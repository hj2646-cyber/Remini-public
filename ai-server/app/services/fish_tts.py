"""Fish-Speech v1.5 HTTP TTS backend.

자체 호스팅한 fish-speech api_server (`tools/api_server.py`, 포트 8080) 에
msgpack POST 요청을 보내 한국어 음성을 합성한다. references 를 비우면
랜덤 음색으로 생성, 채우면 zero-shot 보이스 클로닝.

라이선스: 모델 weights 는 Fish Audio Research License (비상업/연구 한정).
본 시스템은 캡스톤·연구용으로만 사용. 상업 배포 / 경진대회 상금 수령 시
별도 라이선스 (business@fish.audio) 필요.
"""

from __future__ import annotations

import logging

import msgpack
import requests

from app.config import settings

logger = logging.getLogger(__name__)


class FishTtsService:
    def _media_type_for_format(self, audio_format: str) -> str:
        fmt = (audio_format or "").lower().strip()
        if fmt == "wav":
            return "audio/wav"
        if fmt == "mp3":
            return "audio/mpeg"
        if fmt == "flac":
            return "audio/flac"
        return "audio/wav"

    def synthesize(self, text: str) -> tuple[bytes, str]:
        endpoint = (settings.fish_tts_endpoint or "").strip()
        if not endpoint:
            raise RuntimeError("FISH_TTS_ENDPOINT is not configured")

        audio_format = (settings.fish_tts_format or "wav").lower()
        # reference_id 가 설정되어 있으면 fish-server 의 voice template 사용 → 매 호출 동일 음색.
        # 비어있으면 random voice (매 호출 음색 바뀜). seed 는 음색 X, sampling 만 결정.
        ref_id = (settings.fish_tts_reference_id or "").strip() or None
        body = {
            "text": text,
            "references": [],
            "reference_id": ref_id,
            "format": audio_format,
            "max_new_tokens": settings.fish_tts_max_new_tokens,
            "chunk_length": settings.fish_tts_chunk_length,
            "top_p": settings.fish_tts_top_p,
            "repetition_penalty": settings.fish_tts_repetition_penalty,
            "temperature": settings.fish_tts_temperature,
            "streaming": False,
            "use_memory_cache": "off",
            "seed": settings.fish_tts_seed if settings.fish_tts_seed >= 0 else None,
        }

        headers = {"content-type": "application/msgpack"}
        api_key = (settings.fish_tts_api_key or "").strip()
        if api_key:
            headers["authorization"] = f"Bearer {api_key}"

        response = requests.post(
            endpoint,
            data=msgpack.packb(body),
            headers=headers,
            timeout=settings.fish_tts_timeout_sec,
        )
        if response.status_code >= 400:
            detail = (response.text or "").strip()
            raise RuntimeError(f"fish-speech error {response.status_code}: {detail[:300]}")

        return response.content, self._media_type_for_format(audio_format)
