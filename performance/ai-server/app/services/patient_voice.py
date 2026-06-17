"""Patient voice profile storage for speaker verification.

Separate from caregiver voice profiles (which are for TTS cloning).
Stores patient voice samples used to verify the speaker is the patient.
"""

from __future__ import annotations

import json
import logging
import shutil
import subprocess
import tempfile
import threading
from datetime import datetime, timezone
from pathlib import Path

from app.config import DATA_DIR

logger = logging.getLogger(__name__)

_STORE_DIR = DATA_DIR / "patient_voice"
_SAMPLES_DIR = _STORE_DIR / "samples"
_META_PATH = _STORE_DIR / "profiles.json"


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class PatientVoiceService:
    """Manages per-user patient voice samples for speaker verification."""

    def __init__(self) -> None:
        _SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        if not _META_PATH.exists():
            self._write_meta({})

    def _read_meta(self) -> dict:
        with self._lock:
            try:
                return json.loads(_META_PATH.read_text(encoding="utf-8"))
            except Exception:
                self._write_meta({})
                return {}

    def _write_meta(self, data: dict) -> None:
        _STORE_DIR.mkdir(parents=True, exist_ok=True)
        _META_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def _user_key(self, user_id: str | None) -> str:
        return (user_id or "").strip() or "__global__"

    def get_profile(self, user_id: str | None) -> dict | None:
        """Return patient voice profile for user, or None."""
        data = self._read_meta()
        return data.get(self._user_key(user_id))

    def get_sample_paths(self, user_id: str | None) -> list[Path]:
        """Return list of WAV file paths for this patient."""
        profile = self.get_profile(user_id)
        if not profile:
            return []
        return [
            _STORE_DIR / f
            for f in (profile.get("sample_files") or [])
            if (_STORE_DIR / f).exists()
        ]

    def save_samples(
        self,
        user_id: str | None,
        uploads: list[tuple[str, bytes]],
    ) -> dict:
        """Save patient voice samples (WAV). Replaces existing samples."""
        if not uploads:
            raise ValueError("at least one audio sample is required")

        key = self._user_key(user_id)
        user_dir = _SAMPLES_DIR / key
        # Clear old samples
        if user_dir.exists():
            shutil.rmtree(user_dir, ignore_errors=True)
        user_dir.mkdir(parents=True, exist_ok=True)

        sample_files: list[str] = []
        for idx, (original_name, content) in enumerate(uploads, start=1):
            if not content:
                continue
            wav_content = self._convert_to_wav(original_name, content)
            safe_name = f"sample-{idx:02d}.wav"
            target = user_dir / safe_name
            target.write_bytes(wav_content)
            sample_files.append(str(target.relative_to(_STORE_DIR)))

        if not sample_files:
            raise ValueError("no valid audio samples")

        data = self._read_meta()
        data[key] = {
            "user_id": (user_id or "").strip() or None,
            "sample_files": sample_files,
            "sample_count": len(sample_files),
            "created_at": _utc_now_iso(),
        }
        self._write_meta(data)

        return data[key]

    def delete_profile(self, user_id: str | None) -> bool:
        key = self._user_key(user_id)
        user_dir = _SAMPLES_DIR / key
        if user_dir.exists():
            shutil.rmtree(user_dir, ignore_errors=True)

        data = self._read_meta()
        if key in data:
            del data[key]
            self._write_meta(data)
            return True
        return False

    def _convert_to_wav(self, original_name: str, content: bytes) -> bytes:
        """Convert uploaded audio to 16kHz mono WAV (for speaker verification)."""
        suffix = Path(original_name or "").suffix.lower() or ".wav"

        with tempfile.TemporaryDirectory(prefix="patient-voice-") as tmp_dir:
            temp_dir = Path(tmp_dir)
            source_path = temp_dir / f"input{suffix}"
            target_path = temp_dir / "output.wav"
            source_path.write_bytes(content)

            # Try soundfile + scipy
            try:
                import numpy as np
                import soundfile as sf
                from scipy.signal import resample_poly
                from math import gcd

                waveform, sample_rate = sf.read(str(source_path), dtype="float32", always_2d=True)
                # mono
                if waveform.shape[1] > 1:
                    waveform = waveform.mean(axis=1, keepdims=True)
                waveform = waveform[:, 0]
                # resample to 16kHz
                if sample_rate != 16000:
                    g = gcd(sample_rate, 16000)
                    up, down = 16000 // g, sample_rate // g
                    waveform = resample_poly(waveform, up, down).astype(np.float32)
                sf.write(str(target_path), waveform, 16000)
                if target_path.exists() and target_path.stat().st_size > 0:
                    return target_path.read_bytes()
            except Exception:
                pass

            # Fallback: ffmpeg
            ffmpeg = shutil.which("ffmpeg")
            if ffmpeg:
                cmd = [ffmpeg, "-y", "-i", str(source_path), "-ac", "1", "-ar", "16000", str(target_path)]
                proc = subprocess.run(cmd, capture_output=True, text=True)
                if proc.returncode == 0 and target_path.exists():
                    return target_path.read_bytes()

        raise ValueError(f"오디오 변환 실패: {original_name}")
