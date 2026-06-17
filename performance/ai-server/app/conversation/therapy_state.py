"""회상요법 단계 추적 — Phase 5.

대화 흐름을 4단계로 추적하고, 단계별로 LLM에 다른 지침을 주입:
- OPENING: 대화 시작 / 장기 침묵 후 재시작. 따뜻한 인사 + 익숙한 주제.
- EXPLORATION: 감각·고유명사 등장. 감각 단서로 장면 확장.
- EMOTIONAL_PEAK: 긍정 감정 고조 + 회상 몰입. 리액션 강화.
- CLOSURE: 피로/종료 신호 or 긴 턴. 긍정 감정으로 마무리.

휴리스틱:
- turn_count, 연속 긍정 감정 streak, "회상유도형" 분류 누적, 피로 키워드.
- 5분 이상 공백 → OPENING으로 리셋.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from enum import Enum


class TherapyPhase(str, Enum):
    OPENING = "OPENING"
    EXPLORATION = "EXPLORATION"
    EMOTIONAL_PEAK = "EMOTIONAL_PEAK"
    CLOSURE = "CLOSURE"


_POSITIVE_EMOTIONS: set[str] = {"happy", "calm", "positive", "joy", "content"}
_CLOSURE_HINTS: tuple[str, ...] = (
    "피곤", "쉬고 싶", "자고 싶", "그만", "이제 그만", "지쳤", "졸려",
)

# 세션 비활성 리셋 임계 (초)
_IDLE_RESET_SEC = 300
# EMOTIONAL_PEAK 진입 조건
_PEAK_POS_STREAK = 3
_PEAK_REMINISCE_MIN = 2
# CLOSURE 자동 진입 턴 수
_CLOSURE_TURN_LIMIT = 30


@dataclass
class _SessionState:
    phase: TherapyPhase = TherapyPhase.OPENING
    turn_count: int = 0
    positive_streak: int = 0
    reminisce_turns: int = 0
    last_turn_ts: float = 0.0


class TherapyStateTracker:
    """세션별 회상요법 단계 추적. 스레드 안전하지 않음(단일 loop 전제)."""

    def __init__(self) -> None:
        self._sessions: dict[str, _SessionState] = {}

    def update(
        self,
        session_id: str,
        classifier_label: str | None = None,
        emotion: str | None = None,
        user_text: str = "",
    ) -> TherapyPhase:
        now = time.time()
        st = self._sessions.setdefault(session_id, _SessionState())

        # 장기 공백 리셋
        if st.last_turn_ts and (now - st.last_turn_ts) > _IDLE_RESET_SEC:
            st.phase = TherapyPhase.OPENING
            st.turn_count = 0
            st.positive_streak = 0
            st.reminisce_turns = 0

        st.turn_count += 1
        st.last_turn_ts = now

        if emotion and emotion.lower() in _POSITIVE_EMOTIONS:
            st.positive_streak += 1
        else:
            st.positive_streak = 0

        if classifier_label == "회상유도형":
            st.reminisce_turns += 1

        # CLOSURE 우선 감지 (피로/종료 신호)
        if any(h in (user_text or "") for h in _CLOSURE_HINTS):
            st.phase = TherapyPhase.CLOSURE
            return st.phase
        if st.turn_count > _CLOSURE_TURN_LIMIT:
            st.phase = TherapyPhase.CLOSURE
            return st.phase

        # EMOTIONAL_PEAK
        if (
            st.positive_streak >= _PEAK_POS_STREAK
            and st.reminisce_turns >= _PEAK_REMINISCE_MIN
        ):
            st.phase = TherapyPhase.EMOTIONAL_PEAK
            return st.phase

        # EXPLORATION (OPENING에서 충분한 신호 쌓이면 전이)
        if st.phase == TherapyPhase.OPENING and (
            st.turn_count >= 3 or st.reminisce_turns >= 1
        ):
            st.phase = TherapyPhase.EXPLORATION

        return st.phase

    def get(self, session_id: str) -> TherapyPhase:
        st = self._sessions.get(session_id)
        return st.phase if st else TherapyPhase.OPENING

    def reset(self, session_id: str) -> None:
        self._sessions.pop(session_id, None)


_PHASE_GUIDANCE: dict[TherapyPhase, str] = {
    TherapyPhase.OPENING: (
        "[회상요법 단계: OPENING]\n"
        "대화 초반입니다. 짧고 따뜻하게 인사하고, 익숙한 주제(날씨/식사/오늘 기분)로 시작하세요. "
        "부담 없는 질문 하나로 이야기를 열어주세요."
    ),
    TherapyPhase.EXPLORATION: (
        "[회상요법 단계: EXPLORATION]\n"
        "환자가 기억을 탐색하는 중입니다. 장소 이름/색/냄새/촉감 같은 구체적인 감각 단서를 "
        "살짝 덧붙여 장면을 더 생생하게 키워 주세요."
    ),
    TherapyPhase.EMOTIONAL_PEAK: (
        "[회상요법 단계: EMOTIONAL_PEAK]\n"
        "환자가 긍정 감정으로 깊이 몰입해 있습니다. 리액션을 평소보다 더 따뜻하게 "
        "('정말 좋으셨겠어요', '그 마음이 저도 느껴져요') — 감정을 충분히 공감하고 함께 즐거워해 주세요."
    ),
    TherapyPhase.CLOSURE: (
        "[회상요법 단계: CLOSURE]\n"
        "환자가 피곤해 보이거나 대화가 길어졌습니다. 긍정적인 감정으로 부드럽게 마무리하세요. "
        "'오늘 이야기 참 즐거웠어요' 같은 감사 인사와 함께, 다음에 또 만날 거라는 안심을 짧게."
    ),
}


def guidance_for_phase(phase: TherapyPhase) -> str | None:
    return _PHASE_GUIDANCE.get(phase)


# 글로벌 싱글톤
_tracker = TherapyStateTracker()


def tracker() -> TherapyStateTracker:
    return _tracker
