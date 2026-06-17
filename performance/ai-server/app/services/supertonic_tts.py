"""Supertonic 2 local TTS backend (Korean-first, ONNX).

Supertone사의 오픈소스 TTS. ONNX 기반이라 의존성이 가볍고, 한국 회사가
만들어서 한국어 자연스러움이 압도적이다. F1~F5 (여성), M1~M5 (남성)
10개 화자를 지원한다.

기본 화자는 .env의 SUPERTONIC_VOICE (예: F3) 로 설정. 런타임에
``set_voice("M4")`` 로 즉시 교체 가능.
"""

from __future__ import annotations

import io
import logging
import threading
import wave

import numpy as np

from app.config import settings

logger = logging.getLogger(__name__)


_VALID_VOICES = {f"F{i}" for i in range(1, 6)} | {f"M{i}" for i in range(1, 6)}


class SupertonicService:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._tts = None
        self._styles: dict[str, object] = {}
        self._sample_rate = 44100
        self._load_failed = False
        self._current_voice = (getattr(settings, "supertonic_voice", "F3") or "F3").upper()
        if self._current_voice not in _VALID_VOICES:
            self._current_voice = "F3"

    @property
    def current_voice(self) -> str:
        return self._current_voice

    def set_voice(self, voice: str) -> str:
        v = (voice or "").upper().strip()
        if v not in _VALID_VOICES:
            raise ValueError(f"unknown voice: {voice}. Valid: {sorted(_VALID_VOICES)}")
        self._current_voice = v
        # Pre-cache style if model is loaded.
        if self._tts is not None and v not in self._styles:
            self._styles[v] = self._tts.get_voice_style(v)
        logger.info("Supertonic voice -> %s", v)
        return v

    def list_voices(self) -> list[str]:
        return sorted(_VALID_VOICES)

    def _get_model(self):
        if self._tts is not None:
            return self._tts
        if self._load_failed:
            raise RuntimeError("Supertonic previously failed to load")
        with self._lock:
            if self._tts is not None:
                return self._tts
            try:
                # Monkey-patch default providers to prefer CUDA before import.
                try:
                    import onnxruntime as ort
                    import supertonic.config as _sc
                    available = ort.get_available_providers()
                    preferred = [p for p in (
                        "CUDAExecutionProvider",
                        "CPUExecutionProvider",
                    ) if p in available]
                    if preferred:
                        _sc.DEFAULT_ONNX_PROVIDERS = preferred
                        # loader.py imports the symbol locally — patch it too.
                        import supertonic.loader as _sl
                        _sl.DEFAULT_ONNX_PROVIDERS = preferred
                        logger.info("Supertonic providers override: %s", preferred)
                except Exception as exc:
                    logger.warning("Provider override failed: %s", exc)

                from supertonic import TTS
                model_name = getattr(settings, "supertonic_model", "supertonic-2")
                logger.info("Loading Supertonic: %s", model_name)
                tts = TTS(model_name)
                # Pre-build style cache
                styles = {}
                for v in tts.voice_style_names:
                    styles[v] = tts.get_voice_style(v)
                self._tts = tts
                self._styles = styles
                self._sample_rate = int(tts.sample_rate)
                logger.info(
                    "Supertonic loaded (sr=%d, voices=%s, default=%s)",
                    self._sample_rate, tts.voice_style_names, self._current_voice,
                )
                return self._tts
            except Exception as exc:
                self._load_failed = True
                logger.error("Supertonic load failed: %s", exc, exc_info=True)
                raise

    def warmup(self) -> None:
        try:
            self._get_model()
            self.synthesize("안녕하세요.")
            logger.info("Supertonic warmup done")
        except Exception as exc:
            logger.warning("Supertonic warmup skipped: %s", exc)

    def _wav_bytes(self, wav: np.ndarray) -> bytes:
        wav = np.asarray(wav, dtype=np.float32).squeeze()
        wav = np.clip(wav, -1.0, 1.0)
        pcm16 = (wav * 32767.0).astype(np.int16)
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(int(self._sample_rate))
            wf.writeframes(pcm16.tobytes())
        return buf.getvalue()

    def synthesize(self, text: str, voice: str | None = None) -> tuple[bytes, str]:
        text = (text or "").strip()
        if not text:
            raise ValueError("text is empty")

        tts = self._get_model()
        v = (voice or self._current_voice).upper()
        if v not in _VALID_VOICES:
            v = self._current_voice
        style = self._styles.get(v) or tts.get_voice_style(v)
        self._styles[v] = style

        speed = float(getattr(settings, "supertonic_speed", 1.05) or 1.05)
        steps = int(getattr(settings, "supertonic_steps", 5) or 5)

        with self._lock:
            audio, _ = tts.synthesize(
                text,
                voice_style=style,
                lang="ko",
                speed=speed,
                total_steps=steps,
            )
        return self._wav_bytes(audio), "audio/wav"
