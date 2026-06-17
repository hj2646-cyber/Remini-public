from __future__ import annotations

import logging
from pathlib import Path

import requests

from app.config import settings
from app.services.local_voice_clone import LocalVoiceCloneService
from app.services.fish_tts import FishTtsService
from app.services.mms_tts import MmsTtsService
from app.services.qwen3_tts import Qwen3TtsService
from app.services.supertonic_tts import SupertonicService
from app.services.voice_profiles import VoiceProfileService

logger = logging.getLogger(__name__)


class TTSService:
    def __init__(self) -> None:
        self.voice_profiles = VoiceProfileService()
        self.local_voice_clone = LocalVoiceCloneService()
        self.mms = MmsTtsService()
        self.supertonic = SupertonicService()
        self.qwen3 = Qwen3TtsService()
        self.fish = FishTtsService()

    def warmup(self) -> None:
        """Pre-load the configured local TTS backend at startup."""
        provider = (settings.tts_provider or "supertonic").lower()
        if provider == "supertonic":
            try:
                self.supertonic.warmup()
            except Exception as exc:
                logger.warning("supertonic warmup failed: %s", exc)
        elif provider == "mms":
            try:
                self.mms.warmup()
            except Exception as exc:
                logger.warning("mms warmup failed: %s", exc)
        elif provider == "qwen3":
            try:
                self.qwen3.warmup()
            except Exception as exc:
                logger.warning("qwen3 warmup failed: %s", exc)

    def _media_type_for_format(self, audio_format: str) -> str:
        fmt = (audio_format or "").lower().strip()
        if fmt == "wav":
            return "audio/wav"
        if fmt == "ogg":
            return "audio/ogg"
        return "audio/mpeg"

    def _synthesize_with_voice_clone(self, text: str, profile: dict) -> tuple[bytes, str]:
        endpoint = (settings.voice_clone_endpoint or "").strip()
        if not endpoint:
            raise RuntimeError("VOICE_CLONE_ENDPOINT is not configured")

        files = []
        opened_files = []
        try:
            for rel_path in profile.get("sample_files") or []:
                sample_path = self.voice_profiles.root_dir / rel_path
                if not sample_path.exists():
                    continue
                handle = Path(sample_path).open("rb")
                opened_files.append(handle)
                files.append(("reference_audios", (sample_path.name, handle, "application/octet-stream")))

            if not files:
                raise RuntimeError("voice profile has no readable samples")

            data = {
                "text": text,
                "language_code": settings.voice_clone_language_code,
                "audio_format": settings.voice_clone_audio_format,
                "profile_id": profile.get("profile_id") or "",
                "display_name": profile.get("display_name") or "",
            }
            response = requests.post(
                endpoint,
                data=data,
                files=files,
                timeout=settings.voice_clone_timeout_sec,
            )
            if response.status_code >= 400:
                detail = (response.text or "").strip()
                raise RuntimeError(f"voice clone error {response.status_code}: {detail[:300]}")

            audio_format = (
                response.headers.get("X-Audio-Format")
                or response.headers.get("x-audio-format")
                or settings.voice_clone_audio_format
            )
            return response.content, self._media_type_for_format(audio_format)
        finally:
            for handle in opened_files:
                handle.close()

    def _synthesize_with_local_voice_clone(self, text: str, profile: dict) -> tuple[bytes, str]:
        sample_paths = [
            self.voice_profiles.root_dir / rel_path
            for rel_path in profile.get("sample_files") or []
        ]
        return self.local_voice_clone.synthesize(
            text=text,
            sample_paths=sample_paths,
            speaker_id=profile.get("profile_id") or "voice-profile",
        )

    def synthesize(
        self,
        text: str,
        session_id: str | None = None,
        speaker_profile_id: str | None = None,
        user_id: str | None = None,
    ) -> tuple[bytes, str]:
        text = (text or "").strip()
        if not text:
            raise ValueError("text is empty")
        if len(text) > 2000:
            text = text[:2000]

        # 활성 음성 프로필이 있으면 → 보호자 목소리 복제 (Qwen3-TTS local)
        active_profile = self.voice_profiles.get_active_profile(speaker_profile_id, user_id=user_id)
        if active_profile:
            try:
                if (settings.voice_clone_endpoint or "").strip():
                    return self._synthesize_with_voice_clone(text, active_profile)
                return self._synthesize_with_local_voice_clone(text, active_profile)
            except Exception as exc:
                logger.error("voice clone failed, falling back to default TTS: %s", exc, exc_info=True)

        # 기본 TTS: provider 별 분기 + mms 폴백
        provider = (settings.tts_provider or "supertonic").lower()
        if provider == "mms":
            return self.mms.synthesize(text)

        if provider == "qwen3":
            try:
                return self.qwen3.synthesize(text)
            except Exception as exc:
                logger.warning("Qwen3-TTS failed, falling back to MMS: %s", exc)
                return self.mms.synthesize(text)

        if provider == "fish":
            try:
                return self.fish.synthesize(text)
            except Exception as exc:
                logger.warning("Fish-Speech failed, falling back to MMS: %s", exc)
                return self.mms.synthesize(text)

        try:
            return self.supertonic.synthesize(text)
        except Exception as exc:
            logger.warning("Supertonic failed, falling back to MMS: %s", exc)
            return self.mms.synthesize(text)
