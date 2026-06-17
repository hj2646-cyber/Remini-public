"""Speaker verification using resemblyzer.

Compares incoming audio against a pre-enrolled patient voice embedding
to decide whether the speaker is the patient or someone else.
"""

from __future__ import annotations

import logging
import threading
from pathlib import Path

import numpy as np

logger = logging.getLogger(__name__)

_encoder = None
_encoder_lock = threading.Lock()


def _get_encoder():
    """Lazy-load the resemblyzer VoiceEncoder (once, thread-safe)."""
    global _encoder
    if _encoder is not None:
        return _encoder
    with _encoder_lock:
        if _encoder is not None:
            return _encoder
        from resemblyzer import VoiceEncoder
        _encoder = VoiceEncoder("cpu")  # lightweight, CPU is fast enough
        logger.info("Resemblyzer VoiceEncoder loaded")
        return _encoder


class SpeakerVerifier:
    """Per-user speaker verifier with cached enrollment embedding."""

    def __init__(self, threshold: float = 0.75) -> None:
        self.threshold = threshold
        self._enrolled_embedding: np.ndarray | None = None
        self._enrolled_user_id: str | None = None

    @property
    def is_enrolled(self) -> bool:
        return self._enrolled_embedding is not None

    def enroll_from_files(self, wav_paths: list[Path], user_id: str | None = None) -> bool:
        """Compute and cache the average speaker embedding from WAV files."""
        encoder = _get_encoder()
        from resemblyzer import preprocess_wav

        embeddings = []
        for p in wav_paths:
            if not p.exists():
                logger.warning("enroll: file not found %s", p)
                continue
            try:
                wav = preprocess_wav(p)
                if len(wav) < 1600:  # too short (< 0.1s at 16kHz)
                    continue
                emb = encoder.embed_utterance(wav)
                embeddings.append(emb)
            except Exception:
                logger.exception("enroll: failed to process %s", p)

        if not embeddings:
            logger.warning("enroll: no valid samples for user=%s", user_id)
            self._enrolled_embedding = None
            self._enrolled_user_id = None
            return False

        self._enrolled_embedding = np.mean(embeddings, axis=0)
        self._enrolled_user_id = user_id
        logger.info(
            "Speaker enrolled: user=%s from %d samples",
            user_id, len(embeddings),
        )
        return True

    def enroll_from_patient_voice(self, user_id: str | None = None) -> bool:
        """Load patient voice samples for speaker verification."""
        from app.services.patient_voice import PatientVoiceService

        svc = PatientVoiceService()
        wav_paths = svc.get_sample_paths(user_id)
        if not wav_paths:
            logger.info("No patient voice profile for user=%s, speaker verify disabled", user_id)
            self._enrolled_embedding = None
            return False

        return self.enroll_from_files(wav_paths, user_id=user_id)

    def verify(self, pcm16_bytes: bytes, sample_rate: int = 16000) -> tuple[bool, float]:
        """Check if pcm16 audio matches the enrolled speaker.

        Returns (is_patient, similarity_score).
        If not enrolled, always returns (True, 1.0) — pass-through.
        """
        if self._enrolled_embedding is None:
            return True, 1.0

        encoder = _get_encoder()
        audio = np.frombuffer(pcm16_bytes, dtype=np.int16).astype(np.float32) / 32768.0

        # resemblyzer expects 16kHz; resample if needed
        if sample_rate != 16000:
            from scipy.signal import resample
            audio = resample(audio, int(len(audio) * 16000 / sample_rate)).astype(np.float32)

        if len(audio) < 1600:  # < 0.1s — too short to judge
            return True, 1.0

        try:
            emb = encoder.embed_utterance(audio)
            similarity = float(np.dot(self._enrolled_embedding, emb))
            is_patient = similarity >= self.threshold
            return is_patient, similarity
        except Exception:
            logger.exception("speaker verify failed")
            return True, 1.0  # fail-open


def warmup() -> None:
    """Pre-load the encoder model at server start."""
    try:
        _get_encoder()
    except Exception as exc:
        logger.warning("SpeakerVerifier warmup failed: %s", exc)
