from __future__ import annotations

import logging
from pathlib import Path

from faster_whisper import WhisperModel

from app.config import settings


logger = logging.getLogger(__name__)


class STTService:
    def __init__(self, preload: bool = True) -> None:
        self._model: WhisperModel | None = None
        if preload:
            try:
                self._get_model()
            except Exception as exc:
                logger.warning("STT preload failed: %s", exc)

    def _build_model(self, device: str, compute_type: str) -> WhisperModel:
        return WhisperModel(
            settings.whisper_model,
            device=device,
            compute_type=compute_type,
        )

    def _get_model(self) -> WhisperModel:
        if self._model is None:
            device = settings.whisper_device
            compute_type = settings.whisper_compute_type
            try:
                self._model = self._build_model(device, compute_type)
                logger.info(
                    "Whisper loaded: model=%s device=%s compute=%s",
                    settings.whisper_model, device, compute_type,
                )
            except Exception as exc:
                logger.warning(
                    "Whisper %s on %s/%s failed (%s); falling back to CPU/int8 small.",
                    settings.whisper_model, device, compute_type, exc,
                )
                # CPU fallback so the server still works without CUDA libs.
                self._model = WhisperModel(
                    "small",
                    device="cpu",
                    compute_type="int8",
                )
        return self._model

    def transcribe(self, audio_path: Path) -> tuple[str, str | None]:
        model = self._get_model()
        language = (settings.whisper_language or "").strip() or None
        segments, info = model.transcribe(
            str(audio_path),
            vad_filter=True,
            language=language,
            beam_size=1,
            best_of=1,
            condition_on_previous_text=False,
        )
        text = "".join(seg.text for seg in segments).strip()
        detected_language = getattr(info, "language", None)
        return text, detected_language or language
