"""Local GPU TTS backend using Facebook's MMS-TTS Korean model.

`facebook/mms-tts-kor` is a VITS-based Korean TTS distributed via
HuggingFace. It runs on GPU with the already-installed `transformers`
stack — no extra system dependencies (unlike MeloTTS which needs
MeCab). On H200 a typical sentence synthesizes in well under 200ms.
"""

from __future__ import annotations

import io
import logging
import threading

import numpy as np

from app.config import settings

logger = logging.getLogger(__name__)


class MmsTtsService:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._model = None
        self._tokenizer = None
        self._device = "cpu"
        self._sample_rate = 16000
        self._load_failed = False
        self._uroman = None

    def _romanize(self, text: str) -> str:
        """facebook/mms-tts-kor expects romanized input."""
        if self._uroman is None:
            try:
                from uroman import Uroman
                self._uroman = Uroman()
            except Exception as exc:
                logger.error("uroman load failed: %s", exc)
                raise
        return self._uroman.romanize_string(text)

    def _get_model(self):
        if self._model is not None:
            return self._model
        if self._load_failed:
            raise RuntimeError("MMS-TTS previously failed to load")
        with self._lock:
            if self._model is not None:
                return self._model
            try:
                import torch
                from transformers import AutoTokenizer, VitsModel

                model_id = settings.mms_tts_model
                logger.info("Loading MMS-TTS: %s", model_id)
                tokenizer = AutoTokenizer.from_pretrained(model_id)
                model = VitsModel.from_pretrained(model_id)
                device = "cuda" if torch.cuda.is_available() else "cpu"
                dtype = torch.float16 if device == "cuda" else torch.float32
                model = model.to(device=device, dtype=dtype)
                model.eval()
                self._tokenizer = tokenizer
                self._model = model
                self._device = device
                self._sample_rate = getattr(model.config, "sampling_rate", 16000)
                logger.info(
                    "MMS-TTS loaded on %s (sr=%d, dtype=%s)",
                    device, self._sample_rate, dtype,
                )
                return self._model
            except Exception as exc:
                self._load_failed = True
                logger.error("MMS-TTS load failed: %s", exc, exc_info=True)
                raise

    def warmup(self) -> None:
        try:
            self._get_model()
            self.synthesize("안녕하세요.")
            logger.info("MMS-TTS warmup done")
        except Exception as exc:
            logger.warning("MMS-TTS warmup skipped: %s", exc)

    def synthesize(self, text: str) -> tuple[bytes, str]:
        text = (text or "").strip()
        if not text:
            raise ValueError("text is empty")

        import torch

        model = self._get_model()
        speed = float(getattr(settings, "mms_tts_speed", 1.0) or 1.0)

        romanized = self._romanize(text)

        with self._lock:
            inputs = self._tokenizer(romanized, return_tensors="pt")
            inputs = {k: v.to(self._device) for k, v in inputs.items()}
            with torch.no_grad():
                waveform = model(**inputs).waveform  # [1, T] float
            wav = waveform[0].detach().to(torch.float32).cpu().numpy()

        if speed and abs(speed - 1.0) > 1e-3:
            # Simple linear resample to change speed. Cheap but decent.
            target_len = max(1, int(len(wav) / speed))
            xp = np.linspace(0, 1, num=len(wav), endpoint=False)
            fp = wav
            x = np.linspace(0, 1, num=target_len, endpoint=False)
            wav = np.interp(x, xp, fp).astype(np.float32)

        # Encode as WAV (PCM16) in-memory.
        import wave
        buf = io.BytesIO()
        pcm16 = np.clip(wav, -1.0, 1.0)
        pcm16 = (pcm16 * 32767.0).astype(np.int16)
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(int(self._sample_rate))
            wf.writeframes(pcm16.tobytes())
        return buf.getvalue(), "audio/wav"
