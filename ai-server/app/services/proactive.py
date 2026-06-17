from __future__ import annotations

import time
from dataclasses import dataclass

from app.config import settings


@dataclass
class ProactiveDecision:
    triggered: bool
    reason: str
    action: str | None = None


class ProactivePolicy:
    def __init__(self) -> None:
        self._last_global_trigger: dict[str, float] = {}
        self._last_action_trigger: dict[tuple[str, str], float] = {}
        self._awaiting_response_since: dict[str, float] = {}
        self._silence_attempts: dict[str, int] = {}
        # 세션당 1회만 발동하는 액션 플래그
        self._session_greeting_fired: set[str] = set()
        self._drowsy_fired: set[str] = set()

    def note_user_turn(self, session_id: str) -> None:
        self._awaiting_response_since.pop(session_id, None)
        self._silence_attempts[session_id] = 0

    def note_assistant_turn(self, session_id: str) -> None:
        self._awaiting_response_since[session_id] = time.time()

    def evaluate(
        self,
        session_id: str,
        event_type: str,
        confidence: float,
        eyes_closed_seconds: float,
        silence_seconds: float = 0.0,
    ) -> ProactiveDecision:
        now = time.time()
        # session_start 첫 인사는 시연/일상 모두 UX 핵심 → proactive_enabled 와 무관하게 항상 처리.
        # (env PROACTIVE_ENABLED=false 는 자동 트리거 — face_detected/silence/eyes_closed — 만 차단)
        if event_type == "session_start":
            # 세션당 단 한 번만 인사 — 재연결/새로고침은 session_id 가
            # 바뀌는 동안에만 다시 울린다.
            if session_id in self._session_greeting_fired:
                return ProactiveDecision(False, "session_greeting_once")
            self._session_greeting_fired.add(session_id)
            self._last_global_trigger[session_id] = now
            return ProactiveDecision(True, "triggered", action="session_greeting")

        if not settings.proactive_enabled:
            return ProactiveDecision(False, "proactive_disabled")

        if confidence < settings.proactive_min_confidence:
            return ProactiveDecision(False, "low_confidence")

        if event_type == "face_detected":
            # face_detected → greeting 은 대화 중간에 얼굴을 잠깐 놓쳤다 다시
            # 잡을 때마다 튀는 문제가 있어서 영구 비활성화했다. 세션 시작 인사는
            # session_start 경로로 한 번만 발동한다. 프런트에서도 더 이상
            # 이 이벤트를 전송하지 않지만, 방어막으로 서버 쪽에서도 차단한다.
            return ProactiveDecision(False, "face_greeting_disabled")

        if event_type == "eyes_closed":
            # 자는지 묻는 멘트는 세션당 한 번만. 한 번 나간 뒤로는
            # drowsy 선제 발화를 영구히 차단한다 (같은 session_id 동안).
            if session_id in self._drowsy_fired:
                return ProactiveDecision(False, "drowsy_once")
            global_last = self._last_global_trigger.get(session_id, 0.0)
            if now - global_last < settings.proactive_global_cooldown_sec:
                return ProactiveDecision(False, "global_cooldown")
            if eyes_closed_seconds < settings.proactive_eyes_closed_sec:
                return ProactiveDecision(False, "not_long_enough")
            self._drowsy_fired.add(session_id)
            self._last_global_trigger[session_id] = now
            return ProactiveDecision(True, "triggered", action="drowsy_check")

        if event_type == "silence":
            awaiting_since = self._awaiting_response_since.get(session_id)
            if not awaiting_since:
                return ProactiveDecision(False, "no_pending_response")

            elapsed = max(silence_seconds, now - awaiting_since)
            if elapsed < settings.proactive_silence_sec:
                return ProactiveDecision(False, "not_long_enough")

            key = (session_id, "silence_followup")
            if now - self._last_action_trigger.get(key, 0.0) < settings.proactive_silence_cooldown_sec:
                return ProactiveDecision(False, "silence_cooldown")

            attempts = self._silence_attempts.get(session_id, 0)
            if attempts >= 2:
                return ProactiveDecision(False, "silence_attempt_limit")
            if attempts <= 0:
                action = "silence_checkin"
            else:
                action = "silence_memory_prompt"

            self._silence_attempts[session_id] = attempts + 1
            self._last_action_trigger[key] = now
            return ProactiveDecision(True, "triggered", action=action)

        return ProactiveDecision(False, "unsupported_event")
