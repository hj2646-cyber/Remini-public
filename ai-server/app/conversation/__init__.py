"""Conversation state machine and streaming voice loop.

This package implements a shuo-inspired (github.com/NickTikhonov/shuo)
LISTENING ↔ RESPONDING state machine for Remini's real-time voice
pipeline. The design goals are:

  * Single source of truth for "what is the system doing right now".
  * Barge-in for free: a new StartOfTurn while RESPONDING cancels the
    agent and clears playback.
  * Full streaming: LLM tokens feed sentence-level TTS, TTS audio feeds
    the client, all via one WebSocket.

Modules:

  * ``state``   — pure ``process_event(state, event) → (state, actions)``
  * ``agent``   — async LLM → TTS → chunk pipeline (Step 2)
  * ``loop``    — WebSocket session: audio in, VAD, STT, EOU, events out (Step 2)
"""

from app.conversation.state import (  # noqa: F401
    Action,
    ActionType,
    Event,
    EventType,
    State,
    StateName,
    process_event,
)
