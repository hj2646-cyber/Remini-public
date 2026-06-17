"""Unit tests for therapy_state — 회상요법 단계 추적 Phase 5."""

from __future__ import annotations

import time
from unittest.mock import patch

from app.conversation.therapy_state import (
    TherapyPhase,
    TherapyStateTracker,
    guidance_for_phase,
)


class TestPhaseTransitions:
    def test_starts_at_opening(self):
        t = TherapyStateTracker()
        assert t.get("s1") == TherapyPhase.OPENING

    def test_opening_to_exploration_by_turn_count(self):
        t = TherapyStateTracker()
        t.update("s1")
        t.update("s1")
        phase = t.update("s1")  # 3번째 턴
        assert phase == TherapyPhase.EXPLORATION

    def test_opening_to_exploration_by_reminisce(self):
        t = TherapyStateTracker()
        phase = t.update("s1", classifier_label="회상유도형")
        # 회상유도 감지 시 2턴째에 EXPLORATION 전이(첫 턴에는 OPENING 유지)
        phase = t.update("s1", classifier_label="회상유도형")
        assert phase == TherapyPhase.EXPLORATION

    def test_emotional_peak(self):
        t = TherapyStateTracker()
        # 긍정 streak 3 + reminisce 2
        t.update("s1", classifier_label="회상유도형", emotion="happy")
        t.update("s1", classifier_label="회상유도형", emotion="happy")
        phase = t.update("s1", classifier_label="일상확인형", emotion="happy")
        assert phase == TherapyPhase.EMOTIONAL_PEAK

    def test_closure_by_fatigue_keyword(self):
        t = TherapyStateTracker()
        phase = t.update("s1", user_text="이제 좀 피곤해요")
        assert phase == TherapyPhase.CLOSURE

    def test_closure_by_turn_limit(self):
        t = TherapyStateTracker()
        for _ in range(31):
            phase = t.update("s1")
        assert phase == TherapyPhase.CLOSURE

    def test_idle_resets_to_opening(self):
        t = TherapyStateTracker()
        # 턴 3번 → EXPLORATION
        t.update("s1")
        t.update("s1")
        t.update("s1")
        assert t.get("s1") == TherapyPhase.EXPLORATION
        # 6분 지나고 다시 부르면 OPENING
        now = time.time()
        with patch("app.conversation.therapy_state.time.time", return_value=now + 400):
            phase = t.update("s1")
            assert phase == TherapyPhase.OPENING

    def test_negative_emotion_resets_positive_streak(self):
        t = TherapyStateTracker()
        t.update("s1", classifier_label="회상유도형", emotion="happy")
        t.update("s1", classifier_label="회상유도형", emotion="happy")
        # 여기서 부정 감정 → streak 0으로
        phase = t.update("s1", classifier_label="회상유도형", emotion="sad")
        # PEAK 조건 깨짐 → EXPLORATION 유지
        assert phase == TherapyPhase.EXPLORATION


class TestGuidance:
    def test_opening_guidance(self):
        g = guidance_for_phase(TherapyPhase.OPENING)
        assert g is not None
        assert "OPENING" in g

    def test_peak_guidance_mentions_reactions(self):
        g = guidance_for_phase(TherapyPhase.EMOTIONAL_PEAK)
        assert g is not None
        assert "EMOTIONAL_PEAK" in g
        assert "리액션" in g

    def test_closure_guidance_mentions_ending(self):
        g = guidance_for_phase(TherapyPhase.CLOSURE)
        assert g is not None
        assert "CLOSURE" in g
        assert "마무리" in g
