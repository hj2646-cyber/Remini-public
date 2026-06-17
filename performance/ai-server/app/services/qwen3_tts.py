"""Qwen3-TTS CustomVoice 단순 TTS 백엔드 (사전 정의 화자).

Alibaba Qwen3-TTS-12Hz-1.7B-CustomVoice 모델 기반. 한국어 화자 `sohee` 가
가장 자연스럽다. 보이스 클로닝은 `local_voice_clone.py` (Base 모델) 가 따로
담당하므로 이 서비스는 단순 한국어 TTS 전용이다.
"""

from __future__ import annotations

import io
import logging
import threading
import wave

import numpy as np

from app.config import settings

logger = logging.getLogger(__name__)


class Qwen3TtsService:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._model = None
        self._supported_speakers: list[str] = []
        self._load_failed = False

    def _resolve_device(self) -> str:
        configured = (settings.qwen3_tts_device or "auto").strip().lower()
        if configured in {"cpu", "cuda"}:
            return configured
        try:
            import torch
            if torch.cuda.is_available():
                return "cuda"
        except Exception:
            pass
        return "cpu"

    def _get_model(self):
        if self._model is not None:
            return self._model
        if self._load_failed:
            raise RuntimeError("Qwen3-TTS previously failed to load")

        with self._lock:
            if self._model is not None:
                return self._model
            try:
                import torch
                from qwen_tts import Qwen3TTSModel
            except ImportError as exc:
                self._load_failed = True
                raise RuntimeError(
                    "Qwen3-TTS requires qwen-tts package. pip install qwen-tts"
                ) from exc

            device = self._resolve_device()
            model_name = settings.qwen3_tts_model
            kwargs = {"device_map": device}
            if device == "cuda":
                kwargs["dtype"] = torch.bfloat16
                try:
                    import flash_attn  # noqa: F401
                    kwargs["attn_implementation"] = "flash_attention_2"
                    logger.info("Qwen3-TTS using flash_attention_2")
                except ImportError:
                    pass

            try:
                model = Qwen3TTSModel.from_pretrained(model_name, **kwargs)
                self._model = model
                self._supported_speakers = list(model.get_supported_speakers())
                logger.info(
                    "Qwen3-TTS loaded (model=%s, device=%s, speakers=%s)",
                    model_name, device, self._supported_speakers,
                )
                return self._model
            except Exception as exc:
                self._load_failed = True
                logger.error("Qwen3-TTS load failed: %s", exc, exc_info=True)
                raise

    def warmup(self) -> None:
        try:
            self._get_model()
            self.synthesize("안녕하세요.")
            logger.info("Qwen3-TTS warmup done")
        except Exception as exc:
            logger.warning("Qwen3-TTS warmup skipped: %s", exc)

    def _resolve_speaker(self, override: str | None) -> str:
        candidate = (override or settings.qwen3_tts_speaker or "sohee").strip().lower()
        if self._supported_speakers and candidate not in self._supported_speakers:
            logger.warning(
                "qwen3 speaker %r not in %s — falling back to %s",
                candidate, self._supported_speakers, self._supported_speakers[0],
            )
            return self._supported_speakers[0]
        return candidate

    def _wav_bytes(self, wav: np.ndarray, sr: int) -> bytes:
        wav = np.squeeze(np.asarray(wav, dtype=np.float32))
        wav = np.clip(wav, -1.0, 1.0)
        pcm16 = (wav * 32767.0).astype(np.int16)
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(int(sr))
            wf.writeframes(pcm16.tobytes())
        return buf.getvalue()

    def synthesize(self, text: str, speaker: str | None = None) -> tuple[bytes, str]:
        text = (text or "").strip()
        if not text:
            raise ValueError("text is empty")

        model = self._get_model()
        spk = self._resolve_speaker(speaker)
        language = (settings.qwen3_tts_language or "korean").strip().lower()

        with self._lock:
            wavs, sr = model.generate_custom_voice(
                text=text,
                speaker=spk,
                language=language,
                non_streaming_mode=True,
            )

        if not wavs:
            raise RuntimeError("Qwen3-TTS produced no audio")

        wav = wavs[0]
        if hasattr(wav, "cpu"):
            wav = wav.cpu().numpy()
        return self._wav_bytes(wav, sr), "audio/wav"
