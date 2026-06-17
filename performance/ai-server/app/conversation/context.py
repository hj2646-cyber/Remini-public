"""Per-session dialogue context that outlives a single turn.

This is intentionally *not* part of the pure state machine in
``conversation.state``. ``State`` stays a minimal LISTENING/RESPONDING
reducer with monotonic ``turn_id``; anything that carries dialogue
coherence across turns (topic anchor, dominant graph, rolling topic
embedding) lives here and is owned by ``PatientSession``.

EchoRoute step 3 uses this to implement:

* **Sticky anchor** — if a previous turn resolved an active entity
  (e.g. spouse "이정호"), subsequent turns with pronouns like "그분"
  reuse it instead of re-searching the whole persona graph.
* **Topic EMA** — a rolling, L2-normalized embedding of the dialogue
  theme. Used to detect topic shifts and decay the sticky anchor when
  the conversation moves on.
* **Weight inertia** — blend this turn's graph weights with the
  previous turn's so a daily↔life flip doesn't happen mid-thought.

The dataclass is frozen; update it by constructing a new instance.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class TurnContext:
    sticky_anchor_name: str | None = None
    # L2-normalized dialogue topic embedding. None before the first
    # successful retrieval. Stored as tuple so the dataclass stays
    # hashable and safe to pass across threads.
    topic_emb: tuple[float, ...] | None = None
    # Last turn's final (w_daily, w_life). Used for inertia blending.
    last_weights: tuple[float, float] = (0.5, 0.5)
    # Turn counter strictly for debugging/logging — not used in logic.
    turn_count: int = 0
