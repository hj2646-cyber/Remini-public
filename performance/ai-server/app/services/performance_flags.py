"""시연영상용 진화 단계 토글 — 환경변수 기반.

`performance/load_preset.py` 가 export 한 환경변수를 읽음.
본 시스템 (`Remini/ai-server/`) 에는 이 파일 없음 — 복제판 전용.

토글 목록:
- PERF_REMINISCENCE_THERAPY: full / off / (degraded 는 향후 확장)
- PERF_FORCE_GEULEOGUNYO: true / false  ← "그렇군요" 시작 강제
- PERF_STT_ROBUST: true / false         ← KG fragment 재구성 on/off
- PERF_REMINISCENCE_PHOTO: true / false ← 사진 자동 트리거 on/off
"""
from __future__ import annotations

import os


def therapy_mode() -> str:
    """'full' | 'off' — SYSTEM_PROMPT + wiki 포함 여부."""
    return os.environ.get("PERF_REMINISCENCE_THERAPY", "full").strip().lower()


def force_geuleogunyo() -> bool:
    return os.environ.get("PERF_FORCE_GEULEOGUNYO", "false").strip().lower() == "true"


def stt_robust() -> bool:
    return os.environ.get("PERF_STT_ROBUST", "true").strip().lower() == "true"


def reminiscence_photo_enabled() -> bool:
    return os.environ.get("PERF_REMINISCENCE_PHOTO", "true").strip().lower() == "true"


def preset_id() -> str:
    return os.environ.get("PERF_PRESET_ID", "?")


def preset_name() -> str:
    return os.environ.get("PERF_PRESET_NAME", "(unknown)")


def summary() -> dict[str, str | bool]:
    return {
        "preset_id": preset_id(),
        "preset_name": preset_name(),
        "therapy_mode": therapy_mode(),
        "force_geuleogunyo": force_geuleogunyo(),
        "stt_robust": stt_robust(),
        "reminiscence_photo": reminiscence_photo_enabled(),
    }
