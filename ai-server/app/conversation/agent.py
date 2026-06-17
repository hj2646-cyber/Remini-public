"""Agent pipeline: LLM → sentence-level TTS → streaming events.

This is the async equivalent of ``main.py``'s ``_llm_stream`` closure
inside ``/stt-chat/stream``. It exists so the new WebSocket loop
(``conversation.loop``) can drive it as a cancellable ``asyncio.Task``
and wire its output into the shuo-style state machine
(``conversation.state``).

Design
------
* ``run_agent`` is an async generator of ``AgentEvent`` objects. The
  caller awaits one at a time and decides what to do with each
  (forward to client, drop if stale, etc.).
* Blocking work (emotion classification, DB lookup, retrieval, LLM
  streaming, per-sentence TTS) is off-loaded to thread pools so the
  WebSocket loop stays responsive.
* Cancellation is cooperative: on ``asyncio.CancelledError`` the
  generator stops emitting and the finalize step is skipped, matching
  shuo's "barge-in cancels the agent" semantic. Any in-flight LLM/TTS
  worker threads run to completion and their results are discarded.

MVP scope (Step 2)
------------------
Covered: emotion, risk, retrieval, conversation history, LLM token
streaming, sentence-level parallel TTS, conversation_db save,
retrieval save_memory, proactive notes, metrics.

Deferred to Step 4 (restored to reach parity with ``/stt-chat/stream``):
identity step, crisis guardrail, online tools, memory-photo selection,
knowledge detection / confirmation injection, caregiver webhook.
Marked with ``# TODO(step4)`` below.
"""

from __future__ import annotations

import asyncio
import logging
import time
from collections.abc import AsyncIterator
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from typing import Any

from app.conversation.context import TurnContext
from app.conversation.therapy_state import (
    TherapyPhase,
    guidance_for_phase,
    tracker as therapy_tracker,
)
from app.services.caregiver_webhook import notify_caregiver
from app.services.conversation_db import ConversationDB
from app.services.input_classifier import (
    ClassifierResult,
    build_guidance_for_result,
    classify_utterance,
)
from app.services.knowledge_confirmation import (
    confirmation_store,
    get_confirmation_prompt,
)
from app.services.llm import stream_reply, strip_emoji
from app.services.output_filter import apply as apply_output_filter
from app.services.memory_store import append_session_log
from app.services.metrics import metrics_state
from app.services.proactive import ProactivePolicy
from app.services.reminiscence_topics import get_service as _get_reminiscence_service
from app.services.retrieval import RetrievalService
from app.services.sentiment import classify_emotion, classify_risk_level
from app.services.tts import TTSService


_CRISIS_REPLY = (
    "지금 많이 힘드실 수 있어요. 혼자 버티지 않으셔도 됩니다. "
    "가까운 보호자나 1393(자살예방상담전화)로 바로 도움을 요청해 주세요."
)


def _finalize_fire_and_forget(
    bundle: "ServiceBundle",
    req: "AgentRequest",
    ctx: "_PreparedContext",
    full_reply: str,
    started: float,
    loop: asyncio.AbstractEventLoop,
) -> None:
    """Persist a completed turn. Safe to call from any thread."""
    try:
        bundle.retrieval.save_memory(
            session_id=req.session_id,
            user_id=req.user_id,
            content=req.text,
            emotion=ctx.emotion,
            crisis_flag=ctx.crisis_flag,
        )
        bundle.conversation_db.add_message(
            session_id=req.session_id,
            user_id=req.user_id,
            speaker="user",
            content=req.text,
            emotion=ctx.emotion,
            risk_level=ctx.risk_level,
            crisis_flag=ctx.crisis_flag,
            channel=req.channel,
            meta={
                "retrieval_mode": ctx.retrieval_used,
                "context_count": len(ctx.retrieval_context),
            },
        )
        # --- 비동기 새 지식 감지 worker (지연 0, 자동 KG 저장 X — PendingKnowledge 만) ---
        try:
            from app.services import knowledge_worker as _kw
            _kw.enqueue(req.user_id, req.session_id, req.text)
        except Exception:
            pass
        bundle.conversation_db.add_message(
            session_id=req.session_id,
            user_id=req.user_id,
            speaker="assistant",
            content=full_reply,
            emotion=ctx.emotion,
            risk_level=ctx.risk_level,
            crisis_flag=ctx.crisis_flag,
            channel=req.channel,
            meta={"reply_to": "user_message"},
        )
        bundle.retrieval.save_memory(
            session_id=req.session_id,
            user_id=req.user_id,
            content=full_reply,
            emotion=ctx.emotion,
            crisis_flag=ctx.crisis_flag,
        )
        append_session_log({
            "session_id": req.session_id,
            "user_id": req.user_id,
            "message": req.text,
            "reply": full_reply,
            "emotion": ctx.emotion,
            "crisis_flag": ctx.crisis_flag,
            "risk_level": ctx.risk_level,
            "retrieval_mode": ctx.retrieval_used,
            "context_count": len(ctx.retrieval_context),
        })
        bundle.proactive_policy.note_assistant_turn(req.session_id)
        elapsed_ms = (time.perf_counter() - started) * 1000.0
        metrics_state.record(req.session_id, elapsed_ms, error=False)

        # caregiver webhook — WebSocket path
        if req.user_id:
            if ctx.crisis_flag:
                _schedule_notify_caregiver(
                    loop,
                    req.user_id,
                    "emergency",
                    f"위기 상황 감지: {req.text}",
                )
            elif ctx.risk_level == "danger":
                _schedule_notify_caregiver(
                    loop,
                    req.user_id,
                    "warning",
                    f"위험 감정 감지: {ctx.emotion}",
                )
    except Exception:
        logger.exception("agent finalize failed")
        metrics_state.record(req.session_id, 0.0, error=True)

logger = logging.getLogger(__name__)


def _schedule_notify_caregiver(
    loop: asyncio.AbstractEventLoop,
    user_id: str,
    level: str,
    message: str,
) -> None:
    """Schedule caregiver notification from the finalize worker thread."""
    coro = notify_caregiver(user_id, level, message)
    try:
        future = asyncio.run_coroutine_threadsafe(coro, loop)
    except Exception:
        coro.close()
        logger.debug("failed to schedule caregiver webhook", exc_info=True)
        return

    def _log_error(done) -> None:
        try:
            done.result()
        except Exception:
            logger.debug("caregiver webhook task failed", exc_info=True)

    future.add_done_callback(_log_error)


# ─────────────────────────────────────────────────────────────
# Service bundle — passed in from main.py so we reuse the
# already-warmed module-level singletons instead of re-instantiating
# (avoiding GPU re-loads and circular imports).
# ─────────────────────────────────────────────────────────────
@dataclass
class ServiceBundle:
    retrieval: RetrievalService
    tts: TTSService
    conversation_db: ConversationDB
    proactive_policy: ProactivePolicy


# ─────────────────────────────────────────────────────────────
# Events emitted to the WebSocket loop
# ─────────────────────────────────────────────────────────────
@dataclass
class AgentEvent:
    kind: str  # "token" | "audio" | "done" | "error"
    payload: dict[str, Any] = field(default_factory=dict)


@dataclass
class AgentRequest:
    text: str
    session_id: str
    user_id: str | None
    turn_id: int
    channel: str = "ws-patient"
    # Carried across turns by PatientSession. None on the very first
    # turn of a session or when sticky routing is disabled.
    turn_context: TurnContext | None = None


# ─────────────────────────────────────────────────────────────
# Sentence boundary detection (lifted from main.py:208-237 so we
# don't take a dependency on main to avoid a circular import).
# ─────────────────────────────────────────────────────────────
_HARD_BOUNDARY = ("。", "！", "？", ".", "!", "?", "…", "\n")
_SOFT_BOUNDARY = (",", "、", ";", ":", "~")
# 첫 sentence 너무 짧으면 (예: "네.") TTS 합성 ↓ 재생 ↓ 다음 sentence 도착 전 끝나서 끊김 발생.
# 약간 길게 잡아 첫 음성 합성 시간을 다음 sentence 도착 시간으로 흡수.
_FIRST_MIN_LEN = 4
_LATER_MIN_LEN = 12


def _split_next_sentence(buf: str, is_first: bool) -> tuple[str | None, str]:
    if not buf:
        return None, buf
    min_len = _FIRST_MIN_LEN if is_first else _LATER_MIN_LEN
    for i, ch in enumerate(buf):
        if ch in _HARD_BOUNDARY and i + 1 >= min_len:
            j = i + 1
            while j < len(buf) and buf[j] in (" ", "\n", '"', "'", "\u2019", "\u201d"):
                j += 1
            return buf[:j].strip(), buf[j:]
    for i, ch in enumerate(buf):
        if ch in _SOFT_BOUNDARY and i + 1 >= min_len:
            j = i + 1
            while j < len(buf) and buf[j] == " ":
                j += 1
            return buf[:j].strip(), buf[j:]
    return None, buf


# Shared thread pool for per-sentence TTS synthesis. H200 GPU is the
# real bottleneck for the TTS backends — too many workers cause CUDA
# thrashing (each sentence takes longer overall). 2 keeps GPU pipelined
# without thrashing while still allowing one in-flight + one queued.
_tts_pool = ThreadPoolExecutor(max_workers=2, thread_name_prefix="ws-tts")
_prep_pool = ThreadPoolExecutor(max_workers=4, thread_name_prefix="ws-prep")


# ─────────────────────────────────────────────────────────────
# Pre-LLM context preparation (emotion, history, retrieval)
# ─────────────────────────────────────────────────────────────
@dataclass
class _PreparedContext:
    emotion: str
    crisis_flag: bool
    risk_level: str
    recent_messages: list[dict[str, str]]
    conversation_summary: str
    retrieval_context: list[str]
    retrieval_used: str
    next_turn_context: TurnContext | None = None
    classifier_result: ClassifierResult | None = None
    classifier_guidance: str | None = None
    therapy_phase: TherapyPhase | None = None
    therapy_guidance: str | None = None

    @property
    def combined_guidance(self) -> str | None:
        """분류기 지침 + 단계 지침 합쳐서 LLM에 전달."""
        parts = [p for p in (self.classifier_guidance, self.therapy_guidance) if p]
        return "\n\n".join(parts) if parts else None


async def _prepare_context(
    req: AgentRequest,
    bundle: ServiceBundle,
) -> _PreparedContext:
    """Run independent pre-LLM work concurrently off the event loop.

    Execution shape (optimized):

        emotion  ┐
        list_msg ┘ (both start immediately)
                   ↓
            list_msg returns (fast DB read)
                   ↓
        retrieval starts ─ runs in parallel with emotion
                   ↓
        wait(emotion, retrieval)

    Previously retrieval was serial after emotion+list_msg; now it
    overlaps with the slower emotion classifier LLM call, saving
    ~200ms on average per turn.
    """
    loop = asyncio.get_running_loop()

    f_emotion = loop.run_in_executor(_prep_pool, classify_emotion, req.text)
    f_classify = loop.run_in_executor(_prep_pool, classify_utterance, req.text)
    # 환자가 새로고침하면 session_id 가 매번 새로 발급되므로, 같은 user_id 의
    # 이전 세션 대화도 컨텍스트로 이어주려면 session 필터를 풀고 user_id 만으로
    # 검색한다 (대화 기록은 보호자 앱·DB 양쪽에 영구 저장이라 이게 자연스러움).
    # user_id 가 없는 익명 세션은 종전대로 session_id 로 격리한다.
    _conv_session_filter = None if req.user_id else req.session_id
    f_conv = loop.run_in_executor(
        _prep_pool,
        lambda: bundle.conversation_db.list_messages(
            session_id=_conv_session_filter, user_id=req.user_id, limit=24
        ),
    )

    # DB read is very fast (~10 ms); await it first so we can build the
    # retrieval query and kick off retrieval while emotion is still running.
    conversation_items = await f_conv
    recent_messages = [
        {"role": item["speaker"], "content": item["content"]}
        for item in conversation_items[-8:]
        if item["speaker"] in {"user", "assistant"} and item["content"]
    ]
    # Cheap summary — mirror of main.build_conversation_summary shape
    # without importing main to avoid a circular import.
    summary_lines = [
        f"{it['speaker']}: {it['content']}"
        for it in conversation_items[-10:]
        if it.get("content")
    ]
    conversation_summary = "\n".join(summary_lines)

    recent_context_text = " ".join(m["content"] for m in recent_messages[-6:])
    retrieval_query = " ".join(
        p for p in (conversation_summary, recent_context_text, req.text) if p
    ).strip()

    def _do_retrieve():
        return bundle.retrieval.retrieve(
            session_id=req.session_id,
            query=retrieval_query,
            user_id=req.user_id,
            recent_messages=recent_messages,
            conversation_summary=conversation_summary,
            sticky=req.turn_context,
        )

    # Launch retrieval concurrently with the still-pending emotion call.
    f_retrieval = loop.run_in_executor(_prep_pool, _do_retrieve)

    emotion, crisis_flag = await f_emotion
    risk_level = classify_risk_level(req.text, emotion, crisis_flag)
    rr = await f_retrieval

    # Input classifier — 5종 유형 (일상/회상/민감/위험/망상)
    classifier_result: ClassifierResult | None = None
    classifier_guidance: str | None = None
    try:
        classifier_result = await f_classify
        classifier_guidance = build_guidance_for_result(classifier_result)
    except Exception as exc:
        logger.warning("input classifier failed: %s", exc)

    # Phase 4 — 오류 허용: STT 조각 발화 시 KG에서 단서 재구성
    try:
        fragment_hint = bundle.retrieval.reconstruct_from_fragments(
            req.text, user_id=req.user_id
        )
        if fragment_hint:
            # 힌트를 retrieval_context 앞쪽에 삽입 → _build_memory_message가
            # 자연스럽게 LLM에 전달
            rr.texts = [fragment_hint, *rr.texts]
    except Exception as exc:
        logger.warning("fragment reconstruction failed: %s", exc)

    # Phase 5 — 회상요법 단계 추적
    therapy_phase: TherapyPhase | None = None
    therapy_guidance: str | None = None
    try:
        cls_label = classifier_result.label if classifier_result else None
        therapy_phase = therapy_tracker().update(
            session_id=req.session_id,
            classifier_label=cls_label,
            emotion=emotion,
            user_text=req.text,
        )
        therapy_guidance = guidance_for_phase(therapy_phase)
    except Exception as exc:
        logger.warning("therapy state update failed: %s", exc)

    # Build the next turn context from retrieval meta.
    prev_ctx = req.turn_context or TurnContext()
    next_ctx: TurnContext | None = None
    if rr.weights is not None or rr.topic_emb is not None or rr.anchor_name is not None:
        next_ctx = TurnContext(
            sticky_anchor_name=rr.anchor_name or prev_ctx.sticky_anchor_name,
            topic_emb=rr.topic_emb if rr.topic_emb is not None else prev_ctx.topic_emb,
            last_weights=rr.weights if rr.weights is not None else prev_ctx.last_weights,
            turn_count=prev_ctx.turn_count + 1,
        )

    return _PreparedContext(
        emotion=emotion,
        crisis_flag=crisis_flag,
        risk_level=risk_level,
        recent_messages=recent_messages,
        conversation_summary=conversation_summary,
        retrieval_context=rr.texts,
        retrieval_used=rr.used,
        next_turn_context=next_ctx,
        classifier_result=classifier_result,
        classifier_guidance=classifier_guidance,
        therapy_phase=therapy_phase,
        therapy_guidance=therapy_guidance,
    )


# ─────────────────────────────────────────────────────────────
# LLM token stream bridge: blocking generator → async queue
# ─────────────────────────────────────────────────────────────
_LLM_EOF = object()


def _run_llm_blocking(
    req: AgentRequest,
    ctx: _PreparedContext,
    q: asyncio.Queue,
    loop: asyncio.AbstractEventLoop,
) -> None:
    """Run the blocking ``stream_reply`` generator in a worker thread
    and push tokens onto an asyncio queue on the main loop."""
    t0 = time.perf_counter()
    ttft_ms = -1
    token_count = 0
    try:
        for token in stream_reply(
            user_message=req.text,
            context=ctx.retrieval_context,
            recent_messages=ctx.recent_messages,
            conversation_summary=ctx.conversation_summary,
            user_id=req.user_id,
            classifier_guidance=ctx.combined_guidance,
        ):
            if ttft_ms < 0:
                ttft_ms = int((time.perf_counter() - t0) * 1000)
            token_count += 1
            asyncio.run_coroutine_threadsafe(q.put(token), loop)
    except Exception as exc:
        logger.warning("LLM stream error: %s", exc)
        asyncio.run_coroutine_threadsafe(q.put(_LLM_EOF), loop)
        return
    total_ms = int((time.perf_counter() - t0) * 1000)
    logger.info(
        "agent.llm turn=%d ttft_ms=%d total_ms=%d tokens=%d",
        req.turn_id, ttft_ms, total_ms, token_count,
    )
    asyncio.run_coroutine_threadsafe(q.put(_LLM_EOF), loop)


# ─────────────────────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────────────────────
async def run_agent(
    req: AgentRequest,
    bundle: ServiceBundle,
) -> AsyncIterator[AgentEvent]:
    """Stream ``AgentEvent``s for one user turn.

    The caller (WebSocket loop) wraps this in an ``asyncio.Task`` so it
    can ``.cancel()`` on barge-in.
    """
    started = time.perf_counter()
    loop = asyncio.get_running_loop()

    # --- Pre-LLM --------------------------------------------------
    _t_prep = time.perf_counter()
    try:
        ctx = await _prepare_context(req, bundle)
    except Exception as exc:
        logger.exception("agent prepare_context failed")
        yield AgentEvent("error", {"message": f"prepare_context: {exc}"})
        return
    prep_ms = int((time.perf_counter() - _t_prep) * 1000)
    # 첫 발화 응답이 느린 원인 진단용. 정상 운영 시 prep ~200~500ms,
    # 첫 호출 cold 시 수초. 합산이 큰 단계가 병목.
    logger.info(
        "agent.prepare_context turn=%d session=%s user=%s prep_ms=%d",
        req.turn_id, req.session_id, req.user_id, prep_ms,
    )

    bundle.proactive_policy.note_user_turn(req.session_id)

    # --- Crisis guardrail: short-circuit before LLM ---------------
    if ctx.crisis_flag:
        yield AgentEvent("token", {"token": _CRISIS_REPLY, "turn_id": req.turn_id})
        try:
            audio_bytes, media_type = bundle.tts.synthesize(
                _CRISIS_REPLY, session_id=req.session_id, user_id=req.user_id
            )
            if audio_bytes:
                yield AgentEvent(
                    "audio",
                    {
                        "idx": 0,
                        "media_type": media_type,
                        "audio": audio_bytes,
                        "text": _CRISIS_REPLY,
                        "turn_id": req.turn_id,
                    },
                )
        except Exception as exc:
            logger.warning("crisis TTS failed: %s", exc)
        yield AgentEvent(
            "done",
            {
                "reply": _CRISIS_REPLY,
                "emotion": ctx.emotion,
                "crisis_flag": True,
                "used_retrieval": "crisis_guardrail",
                "context_count": 0,
                "memory_photo": None,
                "turn_id": req.turn_id,
                "_next_turn_context": ctx.next_turn_context,
            },
        )
        # Finalize like a normal turn so history/metrics stay consistent.
        await asyncio.get_running_loop().run_in_executor(
            _prep_pool,
            lambda: _finalize_fire_and_forget(
                bundle, req, ctx, _CRISIS_REPLY, started, loop
            ),
        )
        return

    # --- Knowledge confirmation: inject pending prompt if any ----
    effective_message = req.text
    pending_conf = confirmation_store.get(req.session_id) if req.session_id else None
    if pending_conf is not None:
        try:
            conf_prompt = get_confirmation_prompt(pending_conf)
            effective_message = f"{req.text}\n\n{conf_prompt}"
        except Exception:
            logger.debug("confirmation prompt injection failed", exc_info=True)

    # --- 회상 사진 자동 트리거 (책 4단계 패턴) — N턴마다 + ASK/CONSENT 상태 머신
    triggered_reminiscence: dict | None = None
    try:
        triggered_reminiscence = _get_reminiscence_service().maybe_trigger(
            session_id=req.session_id,
            user_message=req.text,
            user_id=req.user_id,
            crisis_flag=ctx.crisis_flag,
        )
    except Exception as exc:
        logger.warning("reminiscence trigger (ws/agent) failed: %s", exc)
        triggered_reminiscence = None
    if triggered_reminiscence is not None:
        try:
            topic_context = _get_reminiscence_service().build_llm_context(triggered_reminiscence)
            effective_message = f"{effective_message}\n\n{topic_context}"
        except Exception:
            logger.debug("reminiscence context injection failed", exc_info=True)

    # TODO(step4+): identity step, online tools, memory photo selection.
    # These still only exist in main.stt_chat_stream; port when removing
    # the legacy endpoint.

    # --- LLM + sentence-level TTS --------------------------------
    token_q: asyncio.Queue = asyncio.Queue(maxsize=256)
    llm_req = AgentRequest(
        text=effective_message,
        session_id=req.session_id,
        user_id=req.user_id,
        turn_id=req.turn_id,
        channel=req.channel,
    )
    llm_future = loop.run_in_executor(
        _prep_pool, _run_llm_blocking, llm_req, ctx, token_q, loop
    )

    collected: list[str] = []
    sentence_buf = ""
    sentence_idx = 0
    pending_tts: list[asyncio.Future] = []

    def _submit_tts(sentence: str, idx: int) -> asyncio.Future:
        clean = strip_emoji(sentence)
        # Phase 3 출력 필터: 금지 패턴/치환표/부정어 제거
        filtered = apply_output_filter(clean)
        clean = filtered.text
        if filtered.blocked:
            logger.warning(
                "output_filter blocked sentence idx=%d turn=%d (→ safe redirect)",
                idx, req.turn_id,
            )
        if not clean:
            fut: asyncio.Future = loop.create_future()
            fut.set_result((idx, b"", "audio/wav", ""))
            return fut

        def _job():
            t0 = time.perf_counter()
            try:
                audio_bytes, media_type = bundle.tts.synthesize(
                    clean,
                    session_id=req.session_id,
                    user_id=req.user_id,
                )
                tts_ms = int((time.perf_counter() - t0) * 1000)
                logger.info(
                    "agent.tts turn=%d idx=%d ms=%d chars=%d bytes=%d",
                    req.turn_id, idx, tts_ms, len(clean), len(audio_bytes),
                )
                return idx, audio_bytes, media_type, clean
            except Exception as exc:
                logger.warning("ws TTS failed #%d: %s", idx, exc)
                return idx, b"", "audio/wav", clean

        return loop.run_in_executor(_tts_pool, _job)

    async def _drain_ready_audio() -> list[AgentEvent]:
        """Yield audio events for any completed TTS futures at the head."""
        out: list[AgentEvent] = []
        while pending_tts and pending_tts[0].done():
            fut = pending_tts.pop(0)
            idx, audio_bytes, media_type, sentence_text = fut.result()
            if audio_bytes:
                out.append(
                    AgentEvent(
                        "audio",
                        {
                            "idx": idx,
                            "media_type": media_type,
                            "audio": audio_bytes,
                            "text": sentence_text,
                            "turn_id": req.turn_id,
                        },
                    )
                )
        return out

    try:
        # Drain tokens until LLM EOF
        while True:
            item = await token_q.get()
            if item is _LLM_EOF:
                break
            token: str = item
            collected.append(token)
            yield AgentEvent("token", {"token": token, "turn_id": req.turn_id})
            sentence_buf += token

            # Split as many complete sentences as possible
            while True:
                sentence, remainder = _split_next_sentence(
                    sentence_buf, is_first=(sentence_idx == 0)
                )
                if sentence is None:
                    break
                sentence_buf = remainder
                pending_tts.append(_submit_tts(sentence, sentence_idx))
                sentence_idx += 1

            for ev in await _drain_ready_audio():
                yield ev

        # Flush tail sentence without terminal punctuation
        tail = sentence_buf.strip()
        if tail:
            pending_tts.append(_submit_tts(tail, sentence_idx))
            sentence_idx += 1

        # Wait for remaining TTS in order
        while pending_tts:
            fut = pending_tts[0]
            if not fut.done():
                await asyncio.wait({fut})
            fut = pending_tts.pop(0)
            idx, audio_bytes, media_type, sentence_text = fut.result()
            if audio_bytes:
                yield AgentEvent(
                    "audio",
                    {
                        "idx": idx,
                        "media_type": media_type,
                        "audio": audio_bytes,
                        "text": sentence_text,
                        "turn_id": req.turn_id,
                    },
                )

    except asyncio.CancelledError:
        # Barge-in: abandon LLM/TTS workers (they finish in the background
        # and their results are dropped). Do NOT finalize the turn —
        # the user interrupted us, so we shouldn't persist a half-reply.
        logger.info("agent cancelled (barge-in) session=%s turn=%d",
                    req.session_id, req.turn_id)
        raise

    full_reply = apply_output_filter(strip_emoji("".join(collected)).strip()).text
    # prompt 모드 (AI 가 시작 의사 묻는 단계) 는 사진 dict 안 보냄 — 음성으로만 권유
    response_reminiscence = (
        triggered_reminiscence
        if triggered_reminiscence and triggered_reminiscence.get("mode") != "prompt"
        else None
    )
    yield AgentEvent(
        "done",
        {
            "reply": full_reply,
            "emotion": ctx.emotion,
            "crisis_flag": ctx.crisis_flag,
            "used_retrieval": ctx.retrieval_used,
            "context_count": len(ctx.retrieval_context),
            "memory_photo": None,
            "reminiscence_photo": response_reminiscence,
            "turn_id": req.turn_id,
            # Private key (leading underscore): consumed by PatientSession
            # and stripped before forwarding to the WebSocket client.
            "_next_turn_context": ctx.next_turn_context,
        },
    )

    await loop.run_in_executor(
        _prep_pool,
        lambda: _finalize_fire_and_forget(bundle, req, ctx, full_reply, started, loop),
    )
    # Ensure the LLM thread has been reaped.
    try:
        await llm_future
    except Exception:
        pass
