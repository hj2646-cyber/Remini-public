from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
import threading
from datetime import datetime, timezone
from pathlib import Path

from app.config import DATA_DIR, settings


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_-]+", "-", (value or "").strip().lower())
    cleaned = cleaned.strip("-_")
    return cleaned or "voice"


class VoiceProfileService:
    def __init__(self) -> None:
        self.root_dir = DATA_DIR / "voice_profiles"
        self.samples_dir = self.root_dir / "samples"
        self.meta_path = self.root_dir / "profiles.json"
        self._lock = threading.Lock()
        self.samples_dir.mkdir(parents=True, exist_ok=True)
        self._ensure_meta_file()

    def _normalize_user_id(self, user_id: str | None) -> str:
        cleaned = (user_id or "").strip()
        return cleaned or "__global__"

    def _ensure_meta_file(self) -> None:
        if self.meta_path.exists():
            return
        self._write_meta({"default_profile_id": None, "default_profile_ids": {}, "profiles": []})

    def _read_meta(self) -> dict:
        with self._lock:
            try:
                data = json.loads(self.meta_path.read_text(encoding="utf-8"))
                if "default_profile_ids" not in data:
                    data["default_profile_ids"] = {}
                return data
            except Exception:
                data = {"default_profile_id": None, "default_profile_ids": {}, "profiles": []}
                self._write_meta(data)
                return data

    def _write_meta(self, data: dict) -> None:
        self.root_dir.mkdir(parents=True, exist_ok=True)
        self.meta_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def _normalize_item(self, item: dict, default_profile_id: str | None) -> dict:
        return {
            "profile_id": item["profile_id"],
            "display_name": item["display_name"],
            "sample_count": len(item.get("sample_files") or []),
            "is_default": item["profile_id"] == default_profile_id,
            "created_at": item.get("created_at") or _utc_now_iso(),
            "updated_at": item.get("updated_at") or item.get("created_at") or _utc_now_iso(),
        }

    def _profiles_for_user(self, data: dict, user_id: str | None) -> list[dict]:
        normalized_user_id = self._normalize_user_id(user_id)
        return [
            item for item in (data.get("profiles") or [])
            if self._normalize_user_id(item.get("user_id")) == normalized_user_id
        ]

    def _default_profile_id_for_user(self, data: dict, user_id: str | None) -> str | None:
        normalized_user_id = self._normalize_user_id(user_id)
        if normalized_user_id == "__global__":
            return data.get("default_profile_id")
        return (data.get("default_profile_ids") or {}).get(normalized_user_id)

    def _set_default_profile_id_for_user(self, data: dict, user_id: str | None, profile_id: str | None) -> None:
        normalized_user_id = self._normalize_user_id(user_id)
        if normalized_user_id == "__global__":
            data["default_profile_id"] = profile_id
            return
        defaults = data.get("default_profile_ids") or {}
        if profile_id:
            defaults[normalized_user_id] = profile_id
        else:
            defaults.pop(normalized_user_id, None)
        data["default_profile_ids"] = defaults

    def _load_audio_soundfile(self, path: Path) -> tuple:
        """soundfile로 오디오 로드 (torchcodec 없이 동작)."""
        import soundfile as sf
        import numpy as np
        data, sr = sf.read(str(path), dtype="float32", always_2d=True)
        # [samples, channels] -> [channels, samples]
        return data.T, sr

    def _save_audio_soundfile(self, path: Path, waveform, sample_rate: int) -> None:
        import soundfile as sf
        import numpy as np
        # waveform: [channels, samples] or [samples]
        arr = waveform if waveform.ndim == 1 else waveform.T
        sf.write(str(path), arr, sample_rate)

    def _convert_audio_to_wav(self, original_name: str, content: bytes) -> bytes:
        suffix = Path(original_name or "").suffix.lower() or ".wav"

        with tempfile.TemporaryDirectory(prefix="voice-profile-") as tmp_dir:
            temp_dir = Path(tmp_dir)
            source_path = temp_dir / f"input{suffix}"
            target_path = temp_dir / "output.wav"
            source_path.write_bytes(content)

            # soundfile로 읽기 -> 24kHz mono WAV로 저장
            try:
                import numpy as np
                import soundfile as sf
                from scipy.signal import resample_poly
                from math import gcd

                waveform, sample_rate = self._load_audio_soundfile(source_path)
                # 모노 변환
                if waveform.shape[0] > 1:
                    waveform = waveform.mean(axis=0, keepdims=True)
                # 리샘플링
                if sample_rate != 24000:
                    g = gcd(sample_rate, 24000)
                    up, down = 24000 // g, sample_rate // g
                    resampled = resample_poly(waveform[0], up, down).astype(np.float32)
                    waveform = resampled[np.newaxis, :]
                self._save_audio_soundfile(target_path, waveform[0], 24000)
                if target_path.exists() and target_path.stat().st_size > 0:
                    return target_path.read_bytes()
            except Exception:
                pass

            # fallback: ffmpeg
            ffmpeg = shutil.which("ffmpeg")
            if ffmpeg:
                cmd = [ffmpeg, "-y", "-i", str(source_path), "-ac", "1", "-ar", "24000", str(target_path)]
                proc = subprocess.run(cmd, capture_output=True, text=True)
                if proc.returncode == 0 and target_path.exists() and target_path.stat().st_size > 0:
                    return target_path.read_bytes()

        raise ValueError(
            f"오디오 변환 실패: {original_name}. WAV 또는 MP3 파일을 올려주세요."
        )

    def list_profiles(self, user_id: str | None = None) -> dict:
        data = self._read_meta()
        profiles = self._profiles_for_user(data, user_id)
        default_profile_id = self._default_profile_id_for_user(data, user_id)
        items = [
            self._normalize_item(profile, default_profile_id)
            for profile in sorted(profiles, key=lambda row: row.get("updated_at") or "", reverse=True)
        ]
        return {"items": items, "default_profile_id": default_profile_id}

    def get_profile(self, profile_id: str | None, user_id: str | None = None) -> dict | None:
        if not profile_id:
            return None
        data = self._read_meta()
        for item in self._profiles_for_user(data, user_id):
            if item.get("profile_id") == profile_id:
                return item
        return None

    # ── Voice clone enabled toggle (per-user) ──────────────────
    def is_voice_clone_enabled(self, user_id: str | None = None) -> bool:
        data = self._read_meta()
        flags = data.get("voice_clone_enabled") or {}
        return flags.get(self._normalize_user_id(user_id), False)

    def set_voice_clone_enabled(self, enabled: bool, user_id: str | None = None) -> bool:
        data = self._read_meta()
        flags = data.get("voice_clone_enabled") or {}
        flags[self._normalize_user_id(user_id)] = enabled
        data["voice_clone_enabled"] = flags
        self._write_meta(data)
        return enabled

    def get_active_profile(self, profile_id: str | None = None, user_id: str | None = None) -> dict | None:
        # If voice clone is disabled for this user, never return a profile
        if not self.is_voice_clone_enabled(user_id):
            return None
        if profile_id:
            return self.get_profile(profile_id, user_id=user_id)
        data = self._read_meta()
        default_profile_id = self._default_profile_id_for_user(data, user_id)
        if not default_profile_id:
            return None
        for item in self._profiles_for_user(data, user_id):
            if item.get("profile_id") == default_profile_id:
                return item
        return None

    def create_profile(
        self,
        display_name: str,
        uploads: list[tuple[str, bytes]],
        set_as_default: bool = False,
        user_id: str | None = None,
    ) -> dict:
        cleaned_name = (display_name or "").strip()
        if not cleaned_name:
            raise ValueError("display_name is required")
        if not uploads:
            raise ValueError("at least one audio sample is required")
        if len(uploads) > settings.voice_profile_max_samples:
            raise ValueError(f"sample count exceeds {settings.voice_profile_max_samples}")

        max_bytes = settings.voice_profile_max_mb_per_file * 1024 * 1024
        for original_name, content in uploads:
            if not content:
                raise ValueError(f"empty file: {original_name}")
            if len(content) > max_bytes:
                raise ValueError(f"file too large: {original_name}")

        data = self._read_meta()
        existing_ids = {item.get("profile_id") for item in self._profiles_for_user(data, user_id)}
        base_id = _slugify(cleaned_name)
        profile_id = base_id
        suffix = 2
        while profile_id in existing_ids:
            profile_id = f"{base_id}-{suffix}"
            suffix += 1

        profile_dir = self.samples_dir / self._normalize_user_id(user_id) / profile_id
        profile_dir.mkdir(parents=True, exist_ok=True)
        sample_files: list[str] = []
        for idx, (original_name, content) in enumerate(uploads, start=1):
            wav_content = self._convert_audio_to_wav(original_name, content)
            safe_name = f"sample-{idx:02d}.wav"
            target = profile_dir / safe_name
            target.write_bytes(wav_content)
            sample_files.append(str(target.relative_to(self.root_dir)))

        now = _utc_now_iso()
        profile = {
            "profile_id": profile_id,
            "display_name": cleaned_name,
            "user_id": (user_id or "").strip() or None,
            "sample_files": sample_files,
            "created_at": now,
            "updated_at": now,
        }
        profiles = data.get("profiles") or []
        profiles.append(profile)
        data["profiles"] = profiles

        if set_as_default or not self._default_profile_id_for_user(data, user_id):
            self._set_default_profile_id_for_user(data, user_id, profile_id)

        self._write_meta(data)
        return self._normalize_item(profile, self._default_profile_id_for_user(data, user_id))

    def activate_profile(self, profile_id: str, user_id: str | None = None) -> dict:
        data = self._read_meta()
        profiles = self._profiles_for_user(data, user_id)
        selected = None
        for item in profiles:
            if item.get("profile_id") == profile_id:
                item["updated_at"] = _utc_now_iso()
                selected = item
                break
        if not selected:
            raise ValueError("voice profile not found")

        self._set_default_profile_id_for_user(data, user_id, profile_id)
        self._write_meta(data)
        return self._normalize_item(selected, profile_id)

    def delete_profile(self, profile_id: str, user_id: str | None = None) -> dict:
        data = self._read_meta()
        profiles = data.get("profiles") or []
        target = None
        remaining: list[dict] = []
        normalized_user_id = self._normalize_user_id(user_id)
        for item in profiles:
            if item.get("profile_id") == profile_id and self._normalize_user_id(item.get("user_id")) == normalized_user_id:
                target = item
            else:
                remaining.append(item)

        if target is None:
            raise ValueError("voice profile not found")

        profile_dir = self.samples_dir / normalized_user_id / profile_id
        if profile_dir.exists():
            shutil.rmtree(profile_dir, ignore_errors=True)

        data["profiles"] = remaining
        default_profile_id = self._default_profile_id_for_user(data, user_id)
        if default_profile_id == profile_id:
            next_default = None
            for item in remaining:
                if self._normalize_user_id(item.get("user_id")) == normalized_user_id:
                    next_default = item["profile_id"]
                    break
            self._set_default_profile_id_for_user(data, user_id, next_default)

        self._write_meta(data)
        return {
            "deleted_profile_id": profile_id,
            "default_profile_id": self._default_profile_id_for_user(data, user_id),
        }
