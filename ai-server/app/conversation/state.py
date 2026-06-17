"""Pure conversation state machine.

Inspired by github.com/NickTikhonov/shuo. Everything in this module is
side-effect free so it can be unit-tested in microseconds and reasoned
about in isolation from I/O.

States
------
* ``LISTENING``  — waiting for user speech. The VAD/STT/EOU stack
  produces ``StartOfTurn``, ``InterimText``, ``EndOfTurn`` events.
* ``RESPONDING`` — an ``AgentPipeline`` is running (LLM → TTS → audio).
  While in this state a fresh ``StartOfTurn`` is treated as **barge-in**
  and causes the pipeline to be cancelled, playback buffer to be
  flushed, and the machine to return to ``LISTENING``.

Transitions
-----------
    LISTENING  ──EndOfTurn(text)──►  RESPONDING        [StartAgent(text)]
    RESPONDING ──AgentDone──────────►  LISTENING        [EmitDone]
    RESPONDING ──StartOfTurn────────►  LISTENING        [CancelAgent, ClearPlayback]   (barge-in)
    LISTENING  ──StartOfTurn────────►  LISTENING        []                              (noise gate, informational)
    *          ──Error──────────────►  LISTENING        [CancelAgent, ClearPlayback]

EndOfTurn while RESPONDING is ignored (duplicate/late finalization).
InterimText in either state is forwarded as a caption action but does
not change state.

Agent-produced events (``AgentToken``, ``AgentTtsChunk``) are only
meaningful in RESPONDING. They are emitted straight through as
client-bound actions. If they arrive in LISTENING (because a cancel was
racing a chunk in flight) they are silently dropped — this is the
reason ``process_event`` never raises on unexpected pairings.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


# ─────────────────────────────────────────────────────────────
# States
# ─────────────────────────────────────────────────────────────
class StateName(str, Enum):
    LISTENING = "LISTENING"
    RESPONDING = "RESPONDING"


@dataclass(frozen=True)
class State:
    name: StateName = StateName.LISTENING
    # Text accumulated from the current user turn. Cleared on
    # EndOfTurn or barge-in.
    current_text: str = ""
    # Monotonically increasing turn id so downstream consumers can
    # discard stale chunks after a barge-in.
    turn_id: int = 0


# ─────────────────────────────────────────────────────────────
# Events (inputs to the state machine)
# ─────────────────────────────────────────────────────────────
class EventType(str, Enum):
    # From VAD / STT / EOU
    START_OF_TURN = "StartOfTurn"
    INTERIM_TEXT = "InterimText"
    END_OF_TURN = "EndOfTurn"
    # From the agent pipeline
    AGENT_TOKEN = "AgentToken"
    AGENT_TTS_CHUNK = "AgentTtsChunk"
    AGENT_DONE = "AgentDone"
    # Generic
    ERROR = "Error"


@dataclass(frozen=True)
class Event:
    type: EventType
    # Payload semantics per type:
    #   START_OF_TURN   : {}  (optional: {"energy": float})
    #   INTERIM_TEXT    : {"text": str}
    #   END_OF_TURN     : {"text": str}
    #   AGENT_TOKEN     : {"token": str, "turn_id": int}
    #   AGENT_TTS_CHUNK : {"audio": bytes, "media_type": str, "turn_id": int, "text"?: str}
    #   AGENT_DONE      : {"reply": str, "turn_id": int, ...}
    #   ERROR           : {"message": str}
    payload: dict[str, Any] = field(default_factory=dict)


# ─────────────────────────────────────────────────────────────
# Actions (outputs — side effects the caller must perform)
# ─────────────────────────────────────────────────────────────
class ActionType(str, Enum):
    START_AGENT = "StartAgent"          # payload: {"text": str, "turn_id": int}
    CANCEL_AGENT = "CancelAgent"        # payload: {}
    CLEAR_PLAYBACK = "ClearPlayback"    # payload: {}
    EMIT_INTERIM = "EmitInterim"        # payload: {"text": str}
    EMIT_TOKEN = "EmitToken"            # payload: {"token": str}
    EMIT_AUDIO = "EmitAudio"            # payload: {"audio": bytes, "media_type": str, "text"?: str}
    EMIT_DONE = "EmitDone"              # payload: {"reply": str, ...}
    EMIT_ERROR = "EmitError"            # payload: {"message": str}


@dataclass(frozen=True)
class Action:
    type: ActionType
    payload: dict[str, Any] = field(default_factory=dict)


# ─────────────────────────────────────────────────────────────
# Pure reducer
# ─────────────────────────────────────────────────────────────
def process_event(state: State, event: Event) -> tuple[State, list[Action]]:
    """Pure reducer: ``(state, event) → (new_state, actions)``.

    Never raises. Unknown (state, event) pairs return the state
    unchanged with no actions.
    """
    s = state
    et = event.type
    p = event.payload

    # ── Error: always safe-reset to LISTENING ──────────────────
    if et == EventType.ERROR:
        actions: list[Action] = []
        if s.name == StateName.RESPONDING:
            actions.append(Action(ActionType.CANCEL_AGENT))
            actions.append(Action(ActionType.CLEAR_PLAYBACK))
        actions.append(Action(ActionType.EMIT_ERROR, {"message": p.get("message", "")}))
        return (
            State(name=StateName.LISTENING, current_text="", turn_id=s.turn_id),
            actions,
        )

    # ── LISTENING ──────────────────────────────────────────────
    if s.name == StateName.LISTENING:
        if et == EventType.START_OF_TURN:
            # Already listening; just reset any partial text. No action.
            return State(name=StateName.LISTENING, current_text="", turn_id=s.turn_id), []

        if et == EventType.INTERIM_TEXT:
            text = p.get("text", "")
            new_state = State(
                name=StateName.LISTENING,
                current_text=text,
                turn_id=s.turn_id,
            )
            return new_state, [Action(ActionType.EMIT_INTERIM, {"text": text})]

        if et == EventType.END_OF_TURN:
            text = (p.get("text") or s.current_text or "").strip()
            if not text:
                # Nothing to respond to.
                return State(name=StateName.LISTENING, current_text="", turn_id=s.turn_id), []
            next_turn = s.turn_id + 1
            new_state = State(
                name=StateName.RESPONDING,
                current_text="",
                turn_id=next_turn,
            )
            return new_state, [
                Action(ActionType.START_AGENT, {"text": text, "turn_id": next_turn})
            ]

        # Agent events while LISTENING: stale, drop.
        return s, []

    # ── RESPONDING ─────────────────────────────────────────────
    if s.name == StateName.RESPONDING:
        if et == EventType.START_OF_TURN:
            # Barge-in: cancel agent, clear playback, return to LISTENING.
            return (
                State(name=StateName.LISTENING, current_text="", turn_id=s.turn_id),
                [
                    Action(ActionType.CANCEL_AGENT),
                    Action(ActionType.CLEAR_PLAYBACK),
                ],
            )

        if et == EventType.INTERIM_TEXT:
            # User is already talking over us but Silero hasn't
            # confirmed barge-in yet. Forward caption, stay put —
            # the eventual StartOfTurn (if energy gate passes) will
            # do the cancel.
            return s, [Action(ActionType.EMIT_INTERIM, {"text": p.get("text", "")})]

        if et == EventType.END_OF_TURN:
            # Stale/late finalization from the previous turn. Drop.
            return s, []

        if et == EventType.AGENT_TOKEN:
            if p.get("turn_id") != s.turn_id:
                return s, []
            return s, [Action(ActionType.EMIT_TOKEN, {"token": p.get("token", "")})]

        if et == EventType.AGENT_TTS_CHUNK:
            if p.get("turn_id") != s.turn_id:
                return s, []
            return s, [
                Action(
                    ActionType.EMIT_AUDIO,
                    {
                        "audio": p.get("audio", b""),
                        "media_type": p.get("media_type", "audio/wav"),
                    }
                    | ({"text": p.get("text", "")} if "text" in p else {}),
                )
            ]

        if et == EventType.AGENT_DONE:
            if p.get("turn_id") != s.turn_id:
                # Late done from a cancelled turn. Ignore.
                return s, []
            done_payload = {k: v for k, v in p.items() if k != "turn_id"}
            return (
                State(name=StateName.LISTENING, current_text="", turn_id=s.turn_id),
                [Action(ActionType.EMIT_DONE, done_payload)],
            )

    return s, []
