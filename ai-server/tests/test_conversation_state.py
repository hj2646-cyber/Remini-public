"""Table-driven tests for the conversation state machine.

Run from ai-server/ with: ``pytest tests/test_conversation_state.py -v``
"""

from __future__ import annotations

from app.conversation.state import (
    Action,
    ActionType,
    Event,
    EventType,
    State,
    StateName,
    process_event,
)


def _types(actions: list[Action]) -> list[ActionType]:
    return [a.type for a in actions]


# ─────────────────────────────────────────────────────────────
# LISTENING
# ─────────────────────────────────────────────────────────────
def test_listening_interim_forwards_caption_and_buffers_text():
    s = State()
    s2, actions = process_event(s, Event(EventType.INTERIM_TEXT, {"text": "엄마"}))
    assert s2.name == StateName.LISTENING
    assert s2.current_text == "엄마"
    assert _types(actions) == [ActionType.EMIT_INTERIM]
    assert actions[0].payload["text"] == "엄마"


def test_listening_end_of_turn_starts_agent_and_bumps_turn_id():
    s = State(turn_id=7)
    s2, actions = process_event(
        s, Event(EventType.END_OF_TURN, {"text": "엄마 보고 싶어"})
    )
    assert s2.name == StateName.RESPONDING
    assert s2.turn_id == 8
    assert s2.current_text == ""
    assert _types(actions) == [ActionType.START_AGENT]
    assert actions[0].payload == {"text": "엄마 보고 싶어", "turn_id": 8}


def test_listening_end_of_turn_uses_buffered_text_when_payload_empty():
    s = State(current_text="어제 밥 먹었어")
    s2, actions = process_event(s, Event(EventType.END_OF_TURN, {}))
    assert s2.name == StateName.RESPONDING
    assert actions[0].payload["text"] == "어제 밥 먹었어"


def test_listening_end_of_turn_with_empty_text_is_noop():
    s = State()
    s2, actions = process_event(s, Event(EventType.END_OF_TURN, {"text": "   "}))
    assert s2.name == StateName.LISTENING
    assert actions == []


def test_listening_start_of_turn_resets_text_no_action():
    s = State(current_text="partial")
    s2, actions = process_event(s, Event(EventType.START_OF_TURN))
    assert s2.name == StateName.LISTENING
    assert s2.current_text == ""
    assert actions == []


def test_listening_ignores_stray_agent_events():
    s = State()
    for et in (EventType.AGENT_TOKEN, EventType.AGENT_TTS_CHUNK, EventType.AGENT_DONE):
        s2, actions = process_event(s, Event(et, {"turn_id": 1}))
        assert s2 == s
        assert actions == []


# ─────────────────────────────────────────────────────────────
# RESPONDING
# ─────────────────────────────────────────────────────────────
def test_responding_barge_in_cancels_and_clears():
    s = State(name=StateName.RESPONDING, turn_id=3)
    s2, actions = process_event(s, Event(EventType.START_OF_TURN))
    assert s2.name == StateName.LISTENING
    assert s2.current_text == ""
    assert _types(actions) == [ActionType.CANCEL_AGENT, ActionType.CLEAR_PLAYBACK]


def test_responding_agent_token_matches_turn_emits():
    s = State(name=StateName.RESPONDING, turn_id=5)
    s2, actions = process_event(
        s, Event(EventType.AGENT_TOKEN, {"token": "안녕", "turn_id": 5})
    )
    assert s2 == s
    assert _types(actions) == [ActionType.EMIT_TOKEN]
    assert actions[0].payload["token"] == "안녕"


def test_responding_drops_stale_agent_chunks():
    s = State(name=StateName.RESPONDING, turn_id=5)
    stale = Event(EventType.AGENT_TTS_CHUNK, {"audio": b"xxx", "turn_id": 4})
    s2, actions = process_event(s, stale)
    assert s2 == s
    assert actions == []


def test_responding_agent_tts_chunk_emits_audio():
    s = State(name=StateName.RESPONDING, turn_id=2)
    ev = Event(
        EventType.AGENT_TTS_CHUNK,
        {"audio": b"WAV", "media_type": "audio/wav", "turn_id": 2},
    )
    s2, actions = process_event(s, ev)
    assert s2 == s
    assert _types(actions) == [ActionType.EMIT_AUDIO]
    assert actions[0].payload == {"audio": b"WAV", "media_type": "audio/wav"}


def test_responding_agent_done_matches_turn_returns_to_listening():
    s = State(name=StateName.RESPONDING, turn_id=2)
    ev = Event(
        EventType.AGENT_DONE,
        {"turn_id": 2, "reply": "안녕하세요", "emotion": "neutral"},
    )
    s2, actions = process_event(s, ev)
    assert s2.name == StateName.LISTENING
    assert s2.turn_id == 2
    assert _types(actions) == [ActionType.EMIT_DONE]
    assert actions[0].payload == {"reply": "안녕하세요", "emotion": "neutral"}


def test_responding_agent_done_stale_turn_is_dropped():
    s = State(name=StateName.RESPONDING, turn_id=9)
    ev = Event(EventType.AGENT_DONE, {"turn_id": 8, "reply": "stale"})
    s2, actions = process_event(s, ev)
    assert s2 == s
    assert actions == []


def test_responding_end_of_turn_is_ignored():
    s = State(name=StateName.RESPONDING, turn_id=1)
    s2, actions = process_event(s, Event(EventType.END_OF_TURN, {"text": "late"}))
    assert s2 == s
    assert actions == []


def test_responding_interim_forwards_caption_but_no_barge_in():
    s = State(name=StateName.RESPONDING, turn_id=1)
    s2, actions = process_event(s, Event(EventType.INTERIM_TEXT, {"text": "어..."}))
    assert s2 == s
    assert _types(actions) == [ActionType.EMIT_INTERIM]


# ─────────────────────────────────────────────────────────────
# Error handling
# ─────────────────────────────────────────────────────────────
def test_error_from_responding_cancels_and_emits():
    s = State(name=StateName.RESPONDING, turn_id=4)
    s2, actions = process_event(s, Event(EventType.ERROR, {"message": "tts fail"}))
    assert s2.name == StateName.LISTENING
    assert _types(actions) == [
        ActionType.CANCEL_AGENT,
        ActionType.CLEAR_PLAYBACK,
        ActionType.EMIT_ERROR,
    ]
    assert actions[-1].payload["message"] == "tts fail"


def test_error_from_listening_just_emits():
    s = State()
    s2, actions = process_event(s, Event(EventType.ERROR, {"message": "stt fail"}))
    assert s2.name == StateName.LISTENING
    assert _types(actions) == [ActionType.EMIT_ERROR]


# ─────────────────────────────────────────────────────────────
# Full-turn integration scenario
# ─────────────────────────────────────────────────────────────
def test_full_turn_scenario():
    """LISTENING → interim → end → responding → tokens → chunks → done → LISTENING."""
    s = State()
    # interim builds
    s, _ = process_event(s, Event(EventType.INTERIM_TEXT, {"text": "엄"}))
    s, _ = process_event(s, Event(EventType.INTERIM_TEXT, {"text": "엄마"}))
    assert s.current_text == "엄마"
    # end of turn
    s, acts = process_event(s, Event(EventType.END_OF_TURN, {"text": "엄마 뭐해"}))
    assert s.name == StateName.RESPONDING
    tid = s.turn_id
    assert acts[0].type == ActionType.START_AGENT
    # tokens and audio
    s, acts = process_event(
        s, Event(EventType.AGENT_TOKEN, {"token": "잘", "turn_id": tid})
    )
    assert acts[0].type == ActionType.EMIT_TOKEN
    s, acts = process_event(
        s,
        Event(
            EventType.AGENT_TTS_CHUNK,
            {"audio": b"\x00\x01", "media_type": "audio/wav", "turn_id": tid},
        ),
    )
    assert acts[0].type == ActionType.EMIT_AUDIO
    # done
    s, acts = process_event(
        s, Event(EventType.AGENT_DONE, {"turn_id": tid, "reply": "잘 지내"})
    )
    assert s.name == StateName.LISTENING
    assert acts[0].type == ActionType.EMIT_DONE


def test_barge_in_scenario():
    """RESPONDING → barge-in → next turn gets a NEW turn_id."""
    s = State()
    s, _ = process_event(s, Event(EventType.END_OF_TURN, {"text": "처음 질문"}))
    first_turn = s.turn_id
    # barge-in
    s, acts = process_event(s, Event(EventType.START_OF_TURN))
    assert s.name == StateName.LISTENING
    assert _types(acts) == [ActionType.CANCEL_AGENT, ActionType.CLEAR_PLAYBACK]
    # next turn
    s, _ = process_event(s, Event(EventType.END_OF_TURN, {"text": "두번째 질문"}))
    assert s.name == StateName.RESPONDING
    assert s.turn_id == first_turn + 1

    # any late chunk from cancelled turn must be dropped
    s_check, acts = process_event(
        s,
        Event(
            EventType.AGENT_TTS_CHUNK,
            {"audio": b"late", "turn_id": first_turn},
        ),
    )
    assert s_check == s
    assert acts == []
