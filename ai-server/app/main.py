from __future__ import annotations

import asyncio
import tempfile
import time
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, Response, UploadFile, WebSocket
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from app.config import settings
from app.models import (
    ChatRequest,
    ChatResponse,
    ConversationDeleteResponse,
    ConversationListResponse,
    ConversationSessionListResponse,
    ConversationSummaryResponse,
    ExtractKnowledgeRequest,
    MemoryPhotoActionResponse,
    MemoryPhotoListResponse,
    MetricResponse,
    ProactiveEventRequest,
    ProactiveEventResponse,
    STTResponse,
    TTSRequest,
    VoiceProfileActionResponse,
    VoiceProfileDeleteResponse,
    VoiceProfileListResponse,
)
from app.services.conversation_db import ConversationDB
from app.services.llm import generate_reply, proactive_reply, stream_reply, strip_emoji, warmup_llm
from app.services.memory_store import append_session_log
from app.services.metrics import metrics_state
from app.services.memory_photos import MemoryPhotoService
from app.services.reminiscence_topics import (
    REMINISCENCE_DIR,
    get_service as get_reminiscence_service,
)
from app.services.online_tools import try_online_answer
from app.services.proactive import ProactivePolicy
from app.services.retrieval import RetrievalService
from app.services.sentiment import classify_emotion, classify_risk_level
from app.services.stt import STTService
from app.services.turn_detector import is_utterance_complete
from app.services.tts import TTSService
from app.services.user_identity import persona_directory, session_identity_store
from app.services.caregiver_webhook import notify_caregiver, send_pending_knowledge
from app.services.new_knowledge_detector import detect_new_knowledge
from app.services.knowledge_confirmation import (
    confirmation_store,
    get_confirmation_prompt,
    check_confirmation,
)
from app.services.knowledge_extractor import extract_structured_knowledge
from app.services.dialect import (
    dialect_store,
    get_available_regions,
    get_available_intensities,
)
from app.conversation.agent import ServiceBundle as _ConvServiceBundle
from app.conversation.context import TurnContext as _TurnContext
from app.conversation.loop import PatientSession as _PatientSession
from app.conversation.loop import warmup as _vad_warmup


app = FastAPI(title="remeni-ai", version="0.1.0")


def _fire_webhook(user_id: str | None, level: str, message: str) -> None:
    """Schedule a caregiver webhook notification without blocking the caller.

    Works from both sync and async contexts.  Never raises.
    """
    if not user_id:
        return
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(notify_caregiver(user_id, level, message))
    except RuntimeError:
        # No running event loop (sync context in threadpool) — run in new loop
        try:
            import threading

            def _send():
                try:
                    asyncio.run(notify_caregiver(user_id, level, message))
                except Exception:
                    pass

            threading.Thread(target=_send, daemon=True).start()
        except Exception:
            pass
# --- Knowledge detection rate limiting ---
_knowledge_detect_msg_counter: dict[str, int] = {}  # session_id -> message count since last detect
_knowledge_detect_last_time: dict[str, float] = {}   # session_id -> last detection timestamp
_KNOWLEDGE_DETECT_MSG_INTERVAL = 1   # detect every message (for testing; raise to 3 for production)
_KNOWLEDGE_DETECT_COOLDOWN_SEC = 10  # detect at most once every 10 seconds


def _should_detect_knowledge(session_id: str) -> bool:
    """Check if we should run knowledge detection for this session."""
    now = time.time()
    _knowledge_detect_msg_counter[session_id] = _knowledge_detect_msg_counter.get(session_id, 0) + 1
    count = _knowledge_detect_msg_counter[session_id]

    if count < _KNOWLEDGE_DETECT_MSG_INTERVAL:
        logger.info("[KnowledgeDetect] skip: msg count %d < %d", count, _KNOWLEDGE_DETECT_MSG_INTERVAL)
        return False

    last = _knowledge_detect_last_time.get(session_id, 0.0)
    if (now - last) < _KNOWLEDGE_DETECT_COOLDOWN_SEC:
        logger.info("[KnowledgeDetect] skip: cooldown (%.0fs since last)", now - last)
        return False

    _knowledge_detect_msg_counter[session_id] = 0
    _knowledge_detect_last_time[session_id] = now
    logger.info("[KnowledgeDetect] TRIGGERED for session %s", session_id)
    return True


async def _run_knowledge_detection(
    user_message: str,
    retrieved_context: list[str],
    recent_messages: list[dict],
    session_id: str,
    user_id: str,
) -> None:
    """Background task: detect new knowledge, handle confirmation flow."""
    try:
        candidate = await detect_new_knowledge(
            user_message=user_message,
            retrieved_context=retrieved_context,
            recent_messages=recent_messages,
            user_id=user_id,
        )
        if candidate is None:
            return

        # Store pending confirmation for this session
        confirmation_store.add(session_id, user_id, candidate)
        logger.info(
            "New knowledge detected for %s: %s (confidence=%.2f)",
            user_id, candidate.summary, candidate.confidence,
        )
    except Exception:
        logger.warning("Knowledge detection background task failed", exc_info=True)


async def _run_confirmation_check(
    user_message: str,
    session_id: str,
) -> None:
    """Background task: check if user confirmed the pending knowledge, fire webhook if yes."""
    try:
        pending = confirmation_store.get(session_id)
        if pending is None:
            return

        confirmed = await check_confirmation(user_message, pending)
        if confirmed:
            # Fire webhook to caregiver API
            try:
                loop = asyncio.get_running_loop()
                loop.create_task(send_pending_knowledge(
                    user_id=pending.user_id,
                    raw_utterance=pending.candidate.raw_utterance,
                    summary=pending.candidate.summary,
                    category_hint=pending.candidate.category_hint,
                    confidence=pending.candidate.confidence,
                    session_id=pending.session_id,
                ))
            except Exception:
                logger.debug("Failed to fire pending knowledge webhook", exc_info=True)

            confirmation_store.remove(session_id)
            logger.info("Knowledge confirmed for session %s: %s", session_id, pending.candidate.summary)
        else:
            pending.attempts += 1
            if pending.attempts >= pending.max_attempts:
                # Exceeded max re-ask attempts, discard
                confirmation_store.remove(session_id)
                logger.info("Knowledge confirmation expired for session %s: %s", session_id, pending.candidate.summary)
    except Exception:
        logger.debug("Confirmation check background task failed", exc_info=True)


import logging as _logging

# Make our INFO logs visible in uvicorn's output.
_logging.basicConfig(
    level=_logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
for _n in ("app", "app.services", "app.services.stt", "app.services.turn_detector",
           "app.services.retrieval", "app.services.tts"):
    _logging.getLogger(_n).setLevel(_logging.INFO)

logger = _logging.getLogger(__name__)

retrieval = RetrievalService()
# EchoRoute step-3 sticky context per session (HTTP /chat path).
_turn_ctx_by_session: dict[str, _TurnContext] = {}
stt_service = STTService()

# Thread pool for background sentence-level TTS synthesis while the
# LLM is still streaming. H200 / local network -> keep it generous.
import base64 as _base64
from concurrent.futures import ThreadPoolExecutor
_tts_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="tts")

_HARD_BOUNDARY = ("。", "！", "？", ".", "!", "?", "…", "\n")
_SOFT_BOUNDARY = (",", "、", ";", ":", "~")
_FIRST_MIN_LEN = 3   # first chunk: fire ASAP for lowest latency to first audio
_LATER_MIN_LEN = 12  # later chunks: longer for more natural prosody

def _split_next_sentence(buf: str, is_first: bool) -> tuple[str | None, str]:
    """Return (sentence, remainder). sentence is None if no boundary yet.

    Uses short min-length for the very first chunk so the first TTS
    call fires as early as possible, hiding edge-tts network latency.
    """
    if not buf:
        return None, buf

    min_len = _FIRST_MIN_LEN if is_first else _LATER_MIN_LEN

    # 1) Hard boundary (., ?, !, newline) -> immediate split.
    for i, ch in enumerate(buf):
        if ch in _HARD_BOUNDARY and i + 1 >= min_len:
            j = i + 1
            while j < len(buf) and buf[j] in (" ", "\n", "\"", "'", "’", "”"):
                j += 1
            return buf[:j].strip(), buf[j:]

    # 2) Soft boundary (comma etc.) once we're long enough. For first
    # chunk we're very aggressive so the user hears audio fast.
    soft_min = min_len
    for i, ch in enumerate(buf):
        if ch in _SOFT_BOUNDARY and i + 1 >= soft_min:
            j = i + 1
            while j < len(buf) and buf[j] == " ":
                j += 1
            return buf[:j].strip(), buf[j:]

    return None, buf

# Per-session pending (incomplete) user utterances waiting for EOU.
# Maps session_id -> {"text": str, "updated": float}
_pending_utterances: dict[str, dict] = {}
_PENDING_TTL_SEC = 12.0


def _get_pending_text(session_id: str) -> str:
    entry = _pending_utterances.get(session_id)
    if not entry:
        return ""
    if time.time() - entry.get("updated", 0) > _PENDING_TTL_SEC:
        _pending_utterances.pop(session_id, None)
        return ""
    return entry.get("text", "")


def _set_pending_text(session_id: str, text: str) -> None:
    _pending_utterances[session_id] = {"text": text, "updated": time.time()}


def _clear_pending_text(session_id: str) -> None:
    _pending_utterances.pop(session_id, None)
tts_service = TTSService()
proactive_policy = ProactivePolicy()
conversation_db = ConversationDB()
memory_photo_service = MemoryPhotoService()
reminiscence_service = get_reminiscence_service()
WEB_DIR = Path(__file__).resolve().parents[1] / "web"
PATIENT_REACT_INDEX = WEB_DIR / "patient-react" / "index.html"
PHOTO_REQUEST_HINTS = {
    "사진 보여",
    "사진 좀 보여",
    "사진 보여줘",
    "사진 볼래",
    "사진 보고 싶",
    "추억 사진",
    "가족 사진",
    "사진 있",
}

# 회상요법 사진 라이브러리 (책 사진 풀, N턴 자동 트리거) — 환자 UI fetch 경로.
# 반드시 /static 보다 먼저 mount — FastAPI 는 prefix 매칭 시 먼저 등록된 mount 가 우선.
if REMINISCENCE_DIR.exists():
    app.mount(
        "/static/reminiscence",
        StaticFiles(directory=REMINISCENCE_DIR),
        name="reminiscence_photos",
    )

if WEB_DIR.exists():
    app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")


@app.on_event("startup")
async def _startup_knowledge_worker() -> None:
    """Knowledge worker 시작 — 비동기 새 지식 감지 (자동 KG 저장 X, PendingKnowledge webhook 만)."""
    from app.services import knowledge_worker as _kw

    _kw.set_conversation_db(conversation_db)
    _kw.start_worker()


@app.on_event("shutdown")
async def _shutdown_knowledge_worker() -> None:
    from app.services import knowledge_worker as _kw

    await _kw.stop_worker()


@app.on_event("startup")
def _startup_cleanup() -> None:
    """서버 시작 시 쌓인 쓰레기 데이터 정리."""
    import threading

    def _run() -> None:
        try:
            conversation_db.cleanup()
        except Exception:
            pass
        try:
            retrieval.memory_store.cleanup()
        except Exception:
            pass
        # Pre-load the LiveKit turn-detector model in the background so
        # the first user utterance doesn't pay the cold-start cost.
        try:
            from app.services.turn_detector import warmup as _eou_warmup
            _eou_warmup()
        except Exception:
            pass
        # Pre-load Silero VAD for the /ws/patient loop.
        try:
            _vad_warmup()
        except Exception:
            pass
        # Pre-warm external Qwen3-ASR streaming sidecar so the first spoken
        # chunk does not pay vLLM's first-request compile cost.
        try:
            stt_service.warmup_streaming()
        except Exception:
            pass
        # Pre-load embedding model on GPU.
        try:
            retrieval.warmup_embedder()
        except Exception:
            pass
        # Pre-load MeloTTS on GPU.
        try:
            tts_service.warmup()
        except Exception:
            pass
        # Pre-load persona cache so /patient/exists doesn't pay first-time
        # Neo4j connection cost on the user's start tap.
        try:
            persona_directory.warmup()
        except Exception:
            pass
        # Pre-prefill the main LLM with a tiny dummy turn so the first real
        # greeting (session_start) doesn't pay 5–10s cold prefill on
        # gemma4:31b + 32k context.
        try:
            from app.services.llm import warmup_llm as _llm_warmup
            _llm_warmup()
        except Exception:
            pass

    threading.Thread(target=_run, daemon=True).start()


def build_conversation_summary(items: list[dict], recent_limit: int = 8, max_summary_items: int = 10) -> str:
    older_items = [item for item in items[:-recent_limit] if item["speaker"] in {"user", "assistant"} and item["content"]]
    if not older_items:
        return ""

    summary_lines: list[str] = []
    for item in older_items[-max_summary_items:]:
        speaker = "사용자" if item["speaker"] == "user" else "도우미"
        content = " ".join(str(item["content"]).split())
        if len(content) > 120:
            content = f"{content[:117]}..."
        summary_lines.append(f"- {speaker}: {content}")
    return "\n".join(summary_lines)


def safe_reply(message: str, session_id: str, user_id: str | None, channel: str = "chat") -> dict:
    proactive_policy.note_user_turn(session_id)
    emotion, crisis_flag = classify_emotion(message)
    risk_level = classify_risk_level(message, emotion, crisis_flag)
    rr_used = "none"
    context: list[str] = []

    # --- Knowledge confirmation: check if user confirmed pending knowledge ---
    if confirmation_store.has_pending(session_id):
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(_run_confirmation_check(message, session_id))
        except RuntimeError:
            pass

    # 최근 대화: 4턴만 (8턴→4턴, LLM 입력 토큰 절반 감소)
    conversation_items = conversation_db.list_messages(session_id=session_id, user_id=user_id, limit=12)
    recent_messages = [
        {"role": item["speaker"], "content": item["content"]}
        for item in conversation_items[-4:]
        if item["speaker"] in {"user", "assistant"} and item["content"]
    ]

    # 사진 요청 키워드가 있을 때만 사진 검색 (매번 호출 → 조건부)
    request_lower = (message or "").lower()
    wants_photo = any(hint in request_lower for hint in PHOTO_REQUEST_HINTS)
    selected_memory_photo = None
    should_show_memory_photo = False
    if wants_photo:
        recent_message_texts = [msg["content"] for msg in recent_messages[-3:] if msg.get("content")]
        selected_memory_photo = memory_photo_service.choose_photo(
            query=message,
            user_id=user_id,
            recent_messages=recent_message_texts,
        )
        should_show_memory_photo = bool(selected_memory_photo)

    effective_message = message
    if should_show_memory_photo:
        photo_note = selected_memory_photo.get("note") or ""
        effective_message = (
            f"{message}\n\n"
            f"현재 보여줄 회상 사진 제목: {selected_memory_photo['title']}\n"
            f"{'사진 설명: ' + photo_note if photo_note else ''}\n"
            "사용자가 사진을 보여달라고 했으니, 사진을 함께 본다는 느낌으로 짧고 따뜻하게 회상 질문을 시작하세요."
        ).strip()

    # 회상요법 토픽 자동 트리거 (책 96 토픽, N턴마다) — memory_photo 와 별개.
    # 환자가 명시적으로 개인 사진을 요청한 경우(memory_photo)에는 토픽 트리거 X.
    triggered_reminiscence: dict | None = None
    if not should_show_memory_photo:
        try:
            triggered_reminiscence = reminiscence_service.maybe_trigger(
                session_id=session_id,
                user_message=message,
                user_id=user_id,
                crisis_flag=crisis_flag,
            )
        except Exception as exc:
            logger.warning("reminiscence trigger failed: %s", exc)
            triggered_reminiscence = None

    # action="hide" 는 사진 숨김 신호만 — LLM context 추가 X (환자 발화에 자연 반응)
    if triggered_reminiscence is not None and triggered_reminiscence.get("action") != "hide":
        topic_context = reminiscence_service.build_llm_context(triggered_reminiscence)
        effective_message = f"{effective_message}\n\n{topic_context}"

    # --- Inject confirmation prompt if pending ---
    pending_conf = confirmation_store.get(session_id) if session_id else None
    if pending_conf is not None:
        conf_prompt = get_confirmation_prompt(pending_conf)
        effective_message = f"{effective_message}\n\n{conf_prompt}"

    # retrieval 쿼리: 순수 사용자 메시지만 사용.
    # (직전 턴 컨텍스트는 recent_messages 파라미터로 따로 전달되므로,
    # 쿼리 임베딩에 봇 응답을 섞으면 EchoRoute 라우팅이 이전 주제로 끌려감)
    retrieval_query = effective_message.strip()

    if crisis_flag:
        reply = (
            "지금 많이 힘드실 수 있어요. 혼자 버티지 않으셔도 됩니다. "
            "가까운 보호자나 1393(자살예방상담전화)로 바로 도움을 요청해 주세요."
        )
        rr_used = "crisis_guardrail"
    else:
        online = try_online_answer(message)
        if online.handled:
            reply = online.reply
            rr_used = f"online_{online.mode}"
        else:
            prev_ctx = _turn_ctx_by_session.get(session_id) or _TurnContext()
            rr = retrieval.retrieve(
                session_id=session_id,
                query=retrieval_query,
                user_id=user_id,
                recent_messages=recent_messages,
                sticky=prev_ctx,
            )
            context = rr.texts
            rr_used = rr.used
            if rr.weights is not None or rr.topic_emb is not None or rr.anchor_name is not None:
                _turn_ctx_by_session[session_id] = _TurnContext(
                    sticky_anchor_name=rr.anchor_name or prev_ctx.sticky_anchor_name,
                    topic_emb=rr.topic_emb if rr.topic_emb is not None else prev_ctx.topic_emb,
                    last_weights=rr.weights if rr.weights is not None else prev_ctx.last_weights,
                    turn_count=prev_ctx.turn_count + 1,
                )
                logger.info(
                    "[EchoRoute] session=%s anchor=%s weights=%s",
                    session_id,
                    _turn_ctx_by_session[session_id].sticky_anchor_name,
                    _turn_ctx_by_session[session_id].last_weights,
                )
            try:
                reply = generate_reply(
                    user_message=effective_message,
                    context=context,
                    recent_messages=recent_messages,
                    user_id=user_id,
                )
            except Exception:
                # Error-tolerant fallback response.
                reply = "말씀해 주셔서 고마워요. 지금 들은 내용을 바탕으로 천천히 함께 정리해볼게요."

    # 사용자 메시지만 기억 저장 (봇 응답은 저장하지 않음 — retrieval 노이즈 방지)
    retrieval.save_memory(
        session_id=session_id,
        user_id=user_id,
        content=message,
        emotion=emotion,
        crisis_flag=crisis_flag,
    )

    conversation_db.add_message(
        session_id=session_id,
        user_id=user_id,
        speaker="user",
        content=message,
        emotion=emotion,
        risk_level=risk_level,
        crisis_flag=crisis_flag,
        channel=channel,
        meta={"retrieval_mode": rr_used, "context_count": len(context)},
    )
    conversation_db.add_message(
        session_id=session_id,
        user_id=user_id,
        speaker="assistant",
        content=reply,
        emotion=emotion,
        risk_level=risk_level,
        crisis_flag=crisis_flag,
        channel=channel,
        meta={"reply_to": "user_message"},
    )

    # --- Background knowledge detection (non-blocking) ---
    if user_id and not crisis_flag and _should_detect_knowledge(session_id):
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(_run_knowledge_detection(
                user_message=message,
                retrieved_context=context,
                recent_messages=recent_messages,
                session_id=session_id,
                user_id=user_id,
            ))
        except RuntimeError:
            pass

    # prompt 모드는 사진 dict 응답 X (사진 표시 없는 권유 단계).
    # action="hide" 는 그대로 forward — UI 가 즉시 사진 숨김.
    if triggered_reminiscence is None:
        response_reminiscence = None
    elif triggered_reminiscence.get("mode") == "prompt":
        response_reminiscence = None
    else:
        response_reminiscence = triggered_reminiscence
    return {
        "reply": reply,
        "emotion": emotion,
        "crisis_flag": crisis_flag,
        "used_retrieval": rr_used,
        "context_count": len(context),
        "memory_photo": selected_memory_photo if should_show_memory_photo else None,
        "reminiscence_photo": response_reminiscence,
    }


def get_effective_user_id(session_id: str, user_id: str | None) -> str | None:
    cleaned = (user_id or "").strip()
    if cleaned:
        persona_by_id = persona_directory.resolve_persona_id(cleaned)
        if persona_by_id:
            session_identity_store.set(session_id, persona_by_id)
            return persona_by_id.persona_id

        persona = persona_directory.resolve(cleaned)
        if persona:
            session_identity_store.set(session_id, persona)
            return persona.persona_id

        existing = session_identity_store.get(session_id)
        if existing and cleaned in {existing.persona_id, existing.name}:
            return existing.persona_id
        return cleaned

    existing = session_identity_store.get(session_id)
    if existing:
        return existing.persona_id
    return None


def maybe_handle_identity_step(message: str, session_id: str, user_id: str | None) -> dict | None:
    explicit_user_id = (user_id or "").strip()
    if explicit_user_id:
        return None

    persona = persona_directory.resolve(message)
    if persona is not None:
        session_identity_store.set(session_id, persona)
        return {
            "reply": f"{persona.name}님, 반갑습니다. 이제부터 이야기를 천천히 들어드릴게요. 오늘 어떤 이야기를 나누고 싶으세요?",
            "emotion": "neutral",
            "crisis_flag": False,
            "used_retrieval": "identity_resolved",
            "context_count": 0,
        }

    effective_user_id = get_effective_user_id(session_id, user_id)
    if effective_user_id:
        return None
    return None


def safe_proactive_reply(req: ProactiveEventRequest) -> ProactiveEventResponse:
    decision = proactive_policy.evaluate(
        session_id=req.session_id,
        event_type=req.event_type,
        confidence=req.confidence,
        eyes_closed_seconds=req.eyes_closed_seconds,
        silence_seconds=req.silence_seconds,
    )
    if not decision.triggered:
        # ignored 이벤트는 DB에 저장하지 않음 — 노이즈 방지
        return ProactiveEventResponse(
            session_id=req.session_id,
            triggered=False,
            reason=decision.reason,
        )

    context_query = f"proactive {decision.action or req.event_type}"
    conversation_items = conversation_db.list_messages(session_id=req.session_id, user_id=req.user_id, limit=8)
    recent_messages = [
        {"role": item["speaker"], "content": item["content"]}
        for item in conversation_items[-4:]
        if item["speaker"] in {"user", "assistant"} and item["content"]
    ]
    rr = retrieval.retrieve(
        session_id=req.session_id,
        query=context_query,
        user_id=req.user_id,
        recent_messages=recent_messages,
    )
    context = rr.texts

    effective_user_id_proactive = get_effective_user_id(req.session_id, req.user_id)
    try:
        reply = proactive_reply(
            action=decision.action or req.event_type,
            context=context,
            confidence=req.confidence,
            eyes_closed_seconds=req.eyes_closed_seconds,
            silence_seconds=req.silence_seconds,
            recent_messages=recent_messages,
            user_id=effective_user_id_proactive,
        )
    except Exception:
        if decision.action == "session_greeting":
            reply = "안녕하세요. 제가 곁에서 천천히 함께 이야기 나눌게요. 오늘은 어떤 이야기가 떠오르세요?"
        elif decision.action == "greeting":
            reply = "안녕하세요. 반가워요. 오늘 기분은 어떠세요?"
        elif decision.action == "drowsy_check":
            reply = "눈을 오래 감고 계셔서 확인드려요. 주무시는 중이실까요?"
        elif decision.action == "silence_checkin":
            reply = "괜찮으시면 천천히 말씀해 주세요. 지금 떠오르는 생각이 있으실까요?"
        elif decision.action == "silence_memory_prompt":
            reply = "혹시 조금 전 이야기하던 분이 떠오르시나요? 기억나는 한 가지라도 괜찮아요."
        else:
            reply = "천천히 계셔도 괜찮아요. 제가 곁에 있으니 편한 말 한마디만 들려주셔도 돼요."

    memory_photo = None
    if decision.action in {"silence_memory_prompt", "silence_reassure"}:
        memory_photo = memory_photo_service.choose_photo(
            query=decision.action or req.event_type,
            user_id=req.user_id,
            recent_messages=[msg["content"] for msg in recent_messages if msg.get("content")],
        )
        if memory_photo:
            reply = (
                f"잠깐 이 사진을 함께 볼까요? {memory_photo['title']} 사진을 보시고 떠오르는 사람이나 장소가 있으세요?"
            )

    retrieval.save_memory(
        session_id=req.session_id,
        user_id=req.user_id,
        content=f"[proactive_event] {req.event_type} (confidence={req.confidence:.2f}, eyes_closed={req.eyes_closed_seconds:.2f}s)",
        emotion="neutral",
        crisis_flag=False,
    )
    retrieval.save_memory(
        session_id=req.session_id,
        user_id=req.user_id,
        content=reply,
        emotion="neutral",
        crisis_flag=False,
    )

    append_session_log(
        {
            "session_id": req.session_id,
            "user_id": req.user_id,
            "event_type": req.event_type,
            "action": decision.action,
            "confidence": req.confidence,
            "eyes_closed_seconds": req.eyes_closed_seconds,
            "silence_seconds": req.silence_seconds,
            "reply": reply,
            "retrieval_mode": rr.used,
            "proactive": True,
        }
    )
    conversation_db.add_message(
        session_id=req.session_id,
        user_id=req.user_id,
        speaker="assistant",
        content=reply,
        emotion="neutral",
        risk_level="daily",
        crisis_flag=False,
        channel="proactive",
        meta={
            "event_type": req.event_type,
            "action": decision.action,
            "confidence": req.confidence,
            "eyes_closed_seconds": req.eyes_closed_seconds,
            "silence_seconds": req.silence_seconds,
        },
    )
    proactive_policy.note_assistant_turn(req.session_id)

    # --- caregiver webhook notifications for proactive events ---
    if decision.triggered:
        if req.event_type == "eyes_closed":
            _fire_webhook(req.user_id, "warning", "환자가 장시간 눈을 감고 있습니다")
        elif req.event_type == "silence":
            _fire_webhook(req.user_id, "info", "환자가 장시간 응답이 없습니다")

    return ProactiveEventResponse(
        session_id=req.session_id,
        triggered=True,
        reason=decision.reason,
        action=decision.action,
        reply=reply,
        memory_photo=memory_photo,
    )


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "env": settings.app_env}


# ─────────────────────────────────────────────────────────────
# shuo-style real-time voice loop (Step 2)
# ─────────────────────────────────────────────────────────────
_conv_service_bundle = _ConvServiceBundle(
    retrieval=retrieval,
    tts=tts_service,
    conversation_db=conversation_db,
    proactive_policy=proactive_policy,
)


@app.websocket("/ws/patient")
async def ws_patient(ws: WebSocket) -> None:
    """Continuous-stream voice loop: PCM16 16kHz in, events out.

    See app/conversation/loop.py for the wire protocol and state
    machine integration. The legacy /stt-chat/stream endpoint remains
    functional in parallel until Step 4.
    """
    session = _PatientSession(ws=ws, bundle=_conv_service_bundle, stt=stt_service)
    await session.run()


@app.get("/")
def web_index() -> FileResponse:
    # 기본 진입점을 환자 화면으로 돌려 iPad 시연/홈 추가 시 바로 환자 UI가 뜨도록 한다.
    patient_path = PATIENT_REACT_INDEX if PATIENT_REACT_INDEX.exists() else WEB_DIR / "patient.html"
    if not patient_path.exists():
        raise HTTPException(status_code=404, detail="patient ui not found")
    return FileResponse(patient_path)


@app.get("/admin")
def admin_screen() -> FileResponse:
    index_path = WEB_DIR / "index.html"
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="admin ui not found")
    return FileResponse(index_path)


@app.get("/patient/exists/{user_id}")
def patient_exists(user_id: str) -> dict:
    cleaned = (user_id or "").strip()
    if not cleaned:
        return {"exists": False, "user_id": cleaned, "name": None}
    persona = persona_directory.resolve_persona_id(cleaned)
    return {
        "exists": persona is not None,
        "user_id": cleaned,
        "name": persona.name if persona else None,
    }


class WarmupRequest(BaseModel):
    user_id: str | None = None


@app.post("/warmup")
def warmup_for_user(req: WarmupRequest) -> dict:
    """환자 진입 시점에 호출. 첫 발화 응답이 cold 비용을 떠안지 않도록
    파이프라인 전체 cold 요소를 미리 깨운다:

    1) **chat LLM** (gemma4:31b + CAG 27k) — KV 캐시 prefix prefill
    2) **proactive LLM** (다른 SYSTEM_PROMPT) — 첫 인사용
    3) **input classifier** (qwen2.5:3b) — 매 chat 호출마다 호출되는 별도 모델
    4) **retrieval** (BGE-M3 임베딩 + AuraDB 첫 connection) — 매 chat 마다 호출
    5) **fragment reconstruction** (Neo4j cypher) — 매 chat 마다 호출

    각 단계는 try/except 로 감싸 한 단계 실패해도 다른 단계는 계속한다.
    cold 면 합산 ~20~25 초, warm 이면 1~2 초.
    """
    started = time.perf_counter()
    timings: dict[str, int] = {}

    def _t(name: str, fn) -> None:
        s = time.perf_counter()
        try:
            fn()
        except Exception as exc:
            logger.warning("warmup step %s failed: %s", name, exc)
        timings[name] = int((time.perf_counter() - s) * 1000)

    # 1+2) LLM chat + proactive 경로 (가장 무거움 ~18s cold, 0s warm)
    _t("llm", lambda: warmup_llm(user_id=req.user_id))

    # 3) input classifier (qwen2.5:3b)
    from app.services.input_classifier import classify_utterance
    _t("classifier", lambda: classify_utterance("안녕"))

    # 4) retrieval (BGE-M3 + AuraDB connection)
    _t(
        "retrieval",
        lambda: retrieval.retrieve(
            session_id="warmup",
            query="안녕",
            user_id=req.user_id,
            recent_messages=[],
            conversation_summary=None,
        ),
    )

    # 5) fragment reconstruction (looks_fragmented gate 로 인해 보통 즉시 None)
    _t(
        "fragment",
        lambda: retrieval.reconstruct_from_fragments("안녕…", user_id=req.user_id),
    )

    elapsed_ms = int((time.perf_counter() - started) * 1000)
    logger.info("warmup user_id=%s total=%dms %s", req.user_id, elapsed_ms, timings)
    return {"status": "ok", "elapsed_ms": elapsed_ms, "timings": timings}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    started = time.perf_counter()
    error = False
    try:
        identity_out = maybe_handle_identity_step(req.message, req.session_id, req.user_id)
        if identity_out is not None:
            proactive_policy.note_user_turn(req.session_id)
            proactive_policy.note_assistant_turn(req.session_id)
            return ChatResponse(session_id=req.session_id, **identity_out)

        effective_user_id = get_effective_user_id(req.session_id, req.user_id)
        out = safe_reply(req.message, req.session_id, effective_user_id, channel="chat")
        proactive_policy.note_assistant_turn(req.session_id)

        # --- caregiver webhook notifications ---
        if out.get("crisis_flag"):
            _fire_webhook(effective_user_id, "emergency", f"위기 상황 감지: {req.message}")
        elif out.get("emotion") and classify_risk_level(req.message, out["emotion"], out["crisis_flag"]) == "danger":
            _fire_webhook(effective_user_id, "warning", f"위험 감정 감지: {out['emotion']}")

        # --- 비동기 새 지식 감지 worker 에 enqueue (지연 0, 자동 KG 저장 X — PendingKnowledge 만) ---
        try:
            from app.services import knowledge_worker as _kw
            _kw.enqueue(effective_user_id, req.session_id, req.message)
        except Exception:
            logger.debug("knowledge_worker enqueue failed (non-blocking)", exc_info=True)

        return ChatResponse(session_id=req.session_id, **out)
    except Exception as e:
        error = True
        raise HTTPException(status_code=500, detail=f"chat failed: {e}") from e
    finally:
        elapsed_ms = (time.perf_counter() - started) * 1000.0
        metrics_state.record(req.session_id, elapsed_ms, error=error)


@app.post("/stt", response_model=STTResponse)
async def stt(file: UploadFile = File(...)) -> STTResponse:
    suffix = Path(file.filename or "audio.wav").suffix or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        raw = await file.read()
        tmp.write(raw)
        tmp_path = Path(tmp.name)
    try:
        text, lang = stt_service.transcribe(tmp_path)
        return STTResponse(text=text, language=lang)
    finally:
        try:
            tmp_path.unlink(missing_ok=True)
        except Exception:
            pass


@app.post("/stt-chat", response_model=ChatResponse)
async def stt_chat(session_id: str, user_id: str | None = None, file: UploadFile = File(...)) -> ChatResponse:
    suffix = Path(file.filename or "audio.wav").suffix or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        raw = await file.read()
        tmp.write(raw)
        tmp_path = Path(tmp.name)
    try:
        text, lang = stt_service.transcribe(tmp_path)
        started = time.perf_counter()
        error = False
        try:
            identity_out = maybe_handle_identity_step(text, session_id, user_id)
            if identity_out is not None:
                proactive_policy.note_user_turn(session_id)
                proactive_policy.note_assistant_turn(session_id)
                return ChatResponse(
                    session_id=session_id,
                    transcript=text,
                    transcript_language=lang,
                    **identity_out,
                )

            effective_user_id = get_effective_user_id(session_id, user_id)
            out = safe_reply(text, session_id, effective_user_id, channel="stt-chat")
            proactive_policy.note_assistant_turn(session_id)

            # --- caregiver webhook notifications ---
            if out.get("crisis_flag"):
                _fire_webhook(effective_user_id, "emergency", f"위기 상황 감지: {text}")
            elif out.get("emotion") and classify_risk_level(text, out["emotion"], out["crisis_flag"]) == "danger":
                _fire_webhook(effective_user_id, "warning", f"위험 감정 감지: {out['emotion']}")

            # --- 비동기 새 지식 감지 worker (지연 0, 자동 KG 저장 X — PendingKnowledge 만) ---
            try:
                from app.services import knowledge_worker as _kw
                _kw.enqueue(effective_user_id, session_id, text)
            except Exception:
                logger.debug("knowledge_worker enqueue failed (non-blocking)", exc_info=True)

            return ChatResponse(
                session_id=session_id,
                transcript=text,
                transcript_language=lang,
                **out,
            )
        except Exception as e:
            error = True
            raise HTTPException(status_code=500, detail=f"stt-chat failed: {e}") from e
        finally:
            elapsed_ms = (time.perf_counter() - started) * 1000.0
            metrics_state.record(session_id, elapsed_ms, error=error)
    finally:
        try:
            tmp_path.unlink(missing_ok=True)
        except Exception:
            pass


def _sse_event(event: str, data: str) -> str:
    return f"event: {event}\ndata: {data}\n\n"


# DEPRECATED: superseded by /ws/patient (see app/conversation/loop.py).
# Kept until the WebSocket voice loop is verified in production; then
# identity/online-tools/memory-photo logic from this handler should be
# ported to app/conversation/agent.py and this endpoint removed.
@app.post("/stt-chat/stream")
async def stt_chat_stream(session_id: str, user_id: str | None = None, file: UploadFile = File(...)) -> StreamingResponse:
    import json as _json

    suffix = Path(file.filename or "audio.wav").suffix or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        raw = await file.read()
        tmp.write(raw)
        tmp_path = Path(tmp.name)

    try:
        chunk_text, lang = stt_service.transcribe(tmp_path)
    finally:
        try:
            tmp_path.unlink(missing_ok=True)
        except Exception:
            pass

    # --- Semantic End-of-Utterance gating ---
    # Combine any pending (previously incomplete) text with this chunk,
    # then ask the turn detector whether the user is done speaking.
    pending_prev = _get_pending_text(session_id)
    if pending_prev and chunk_text:
        accumulated = f"{pending_prev} {chunk_text}".strip()
    else:
        accumulated = (chunk_text or pending_prev or "").strip()

    # Pull the most recent conversation turns so the turn-detector
    # model can use dialogue context when scoring EOU.
    try:
        _eou_ctx_items = conversation_db.list_messages(
            session_id=session_id, user_id=user_id, limit=8
        )
        _eou_recent = [
            {"role": it["speaker"], "content": it["content"]}
            for it in _eou_ctx_items[-6:]
            if it["speaker"] in {"user", "assistant"} and it["content"]
        ]
    except Exception:
        _eou_recent = []

    eou = is_utterance_complete(accumulated, recent_messages=_eou_recent) if accumulated else {
        "complete": False, "confidence": 1.0, "reason": "empty", "latency_ms": 0,
    }
    logger.info(
        "EOU: text=%r complete=%s reason=%s latency=%dms",
        accumulated[:80], eou.get("complete"), eou.get("reason"), eou.get("latency_ms", 0),
    )

    if accumulated and not eou["complete"]:
        _set_pending_text(session_id, accumulated)

        def _continue_stream():
            yield _sse_event("stt", _json.dumps(
                {"text": accumulated, "language": lang, "partial": True},
                ensure_ascii=False,
            ))
            yield _sse_event("continue", _json.dumps(
                {
                    "text": accumulated,
                    "reason": eou["reason"],
                    "confidence": eou["confidence"],
                    "latency_ms": eou["latency_ms"],
                },
                ensure_ascii=False,
            ))

        return StreamingResponse(_continue_stream(), media_type="text/event-stream")

    # Utterance complete: use accumulated text as the user message and
    # clear the pending buffer for this session.
    _clear_pending_text(session_id)
    text = accumulated

    effective_user_id = get_effective_user_id(session_id, user_id)

    identity_out = maybe_handle_identity_step(text, session_id, user_id)
    if identity_out is not None:
        proactive_policy.note_user_turn(session_id)
        proactive_policy.note_assistant_turn(session_id)

        def _identity_stream():
            yield _sse_event("stt", _json.dumps({"text": text, "language": lang}, ensure_ascii=False))
            yield _sse_event("done", _json.dumps({
                "reply": identity_out["reply"],
                "emotion": identity_out["emotion"],
                "crisis_flag": identity_out["crisis_flag"],
                "used_retrieval": identity_out["used_retrieval"],
                "context_count": identity_out["context_count"],
                "memory_photo": None,
                "reminiscence_photo": None,
            }, ensure_ascii=False))

        return StreamingResponse(_identity_stream(), media_type="text/event-stream")

    proactive_policy.note_user_turn(session_id)

    # --- Parallel pre-LLM pipeline -------------------------------
    # Independent work (emotion classify + DB lookup) runs on worker
    # threads so the user doesn't pay the sum of all their latencies.
    from concurrent.futures import ThreadPoolExecutor as _PreExec
    _pre_pool = _PreExec(max_workers=4, thread_name_prefix="prellm")
    _f_emotion = _pre_pool.submit(classify_emotion, text)
    _f_conv = _pre_pool.submit(
        conversation_db.list_messages,
        session_id=session_id, user_id=effective_user_id, limit=24,
    )

    emotion, crisis_flag = _f_emotion.result()
    risk_level = classify_risk_level(text, emotion, crisis_flag)

    # --- Knowledge confirmation: check if user confirmed pending knowledge ---
    if confirmation_store.has_pending(session_id):
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(_run_confirmation_check(text, session_id))
        except RuntimeError:
            pass

    conversation_items = _f_conv.result()
    recent_messages = [
        {"role": item["speaker"], "content": item["content"]}
        for item in conversation_items[-8:]
        if item["speaker"] in {"user", "assistant"} and item["content"]
    ]
    conversation_summary = build_conversation_summary(conversation_items)
    recent_message_texts = [msg["content"] for msg in recent_messages[-6:] if msg.get("content")]

    # Memory photo selection only runs when the user actually asked
    # for a photo, saving an LLM/embedding call on the common path.
    request_lower_early = (text or "").lower()
    _photo_requested = any(hint in request_lower_early for hint in PHOTO_REQUEST_HINTS)
    if _photo_requested:
        selected_memory_photo = memory_photo_service.choose_photo(
            query=text,
            user_id=effective_user_id,
            recent_messages=recent_message_texts,
            conversation_summary=conversation_summary,
        )
    else:
        selected_memory_photo = None
    request_lower = (text or "").lower()
    should_show_memory_photo = bool(selected_memory_photo) and any(hint in request_lower for hint in PHOTO_REQUEST_HINTS)
    effective_message = text
    if should_show_memory_photo:
        photo_note = selected_memory_photo.get("note") or ""
        effective_message = (
            f"{text}\n\n"
            f"현재 보여줄 회상 사진 제목: {selected_memory_photo['title']}\n"
            f"{'사진 설명: ' + photo_note if photo_note else ''}\n"
            "사용자가 사진을 보여달라고 했으니, 사진을 함께 본다는 느낌으로 짧고 따뜻하게 회상 질문을 시작하세요."
        ).strip()

    # 회상요법 토픽 자동 트리거 (음성 chat 경로) — 책 96 토픽, N턴마다.
    triggered_reminiscence: dict | None = None
    if not should_show_memory_photo:
        try:
            triggered_reminiscence = reminiscence_service.maybe_trigger(
                session_id=session_id,
                user_message=text,
                user_id=effective_user_id,
                crisis_flag=crisis_flag,
            )
        except Exception as exc:
            logger.warning("reminiscence trigger (stt-chat) failed: %s", exc)
            triggered_reminiscence = None
    # action="hide" 는 사진 숨김 신호만 — LLM context 추가 X (환자 발화에 자연 반응)
    if triggered_reminiscence is not None and triggered_reminiscence.get("action") != "hide":
        topic_context = reminiscence_service.build_llm_context(triggered_reminiscence)
        effective_message = f"{effective_message}\n\n{topic_context}"

    # --- Inject confirmation prompt if pending (streaming path) ---
    pending_conf_stream = confirmation_store.get(session_id) if session_id else None
    if pending_conf_stream is not None:
        conf_prompt = get_confirmation_prompt(pending_conf_stream)
        effective_message = f"{effective_message}\n\n{conf_prompt}"

    recent_context_text = " ".join(msg["content"] for msg in recent_messages[-6:])
    retrieval_query_parts = [conversation_summary, recent_context_text, effective_message]
    retrieval_query = " ".join(part for part in retrieval_query_parts if part).strip()

    started = time.perf_counter()

    if crisis_flag:
        reply_text = (
            "지금 많이 힘드실 수 있어요. 혼자 버티지 않으셔도 됩니다. "
            "가까운 보호자나 1393(자살예방상담전화)로 바로 도움을 요청해 주세요."
        )
        rr_used = "crisis_guardrail"
        context: list[str] = []

        def _crisis_stream():
            yield _sse_event("stt", _json.dumps({"text": text, "language": lang}, ensure_ascii=False))
            yield _sse_event("token", reply_text)
            yield _sse_event("done", _json.dumps({
                "reply": reply_text,
                "emotion": emotion,
                "crisis_flag": True,
                "used_retrieval": rr_used,
                "context_count": 0,
                "memory_photo": None,
                "reminiscence_photo": None,
            }, ensure_ascii=False))

        def _crisis_finalize():
            for chunk in _crisis_stream():
                yield chunk
            _finalize_conversation(
                session_id, effective_user_id, text, reply_text,
                emotion, risk_level, crisis_flag, context, rr_used, "stt-chat",
                started, selected_memory_photo if should_show_memory_photo else None,
            )

        return StreamingResponse(_crisis_finalize(), media_type="text/event-stream")

    online = try_online_answer(text)
    if online.handled:
        reply_text = online.reply
        rr_used = f"online_{online.mode}"
        context = []

        def _online_stream():
            yield _sse_event("stt", _json.dumps({"text": text, "language": lang}, ensure_ascii=False))
            yield _sse_event("token", reply_text)
            yield _sse_event("done", _json.dumps({
                "reply": reply_text,
                "emotion": emotion,
                "crisis_flag": crisis_flag,
                "used_retrieval": rr_used,
                "context_count": 0,
                "memory_photo": None,
                "reminiscence_photo": None,
            }, ensure_ascii=False))

        def _online_finalize():
            for chunk in _online_stream():
                yield chunk
            _finalize_conversation(
                session_id, effective_user_id, text, reply_text,
                emotion, risk_level, crisis_flag, context, rr_used, "stt-chat",
                started, selected_memory_photo if should_show_memory_photo else None,
            )

        return StreamingResponse(_online_finalize(), media_type="text/event-stream")

    rr = retrieval.retrieve(
        session_id=session_id,
        query=retrieval_query,
        user_id=effective_user_id,
        recent_messages=recent_messages,
        conversation_summary=conversation_summary,
    )
    context = rr.texts
    rr_used = rr.used
    memory_photo_out = selected_memory_photo if should_show_memory_photo else None

    def _llm_stream():
        yield _sse_event("stt", _json.dumps({"text": text, "language": lang}, ensure_ascii=False))

        def _tts_job(sentence: str, idx: int):
            clean = strip_emoji(sentence)
            if not clean:
                return idx, b"", "audio/mpeg"
            try:
                audio_bytes, media_type = tts_service.synthesize(
                    clean,
                    session_id=session_id,
                    user_id=effective_user_id,
                )
                return idx, audio_bytes, media_type
            except Exception as exc:
                logger.warning("streaming TTS failed for sentence #%d: %s", idx, exc)
                return idx, b"", "audio/mpeg"

        def _emit_ready_audio(pending: list, next_idx: list) -> list[str]:
            """Yield SSE strings for any completed-in-order audio futures.

            pending: list of (Future, sentence_text) tuples — sentence_text 는
            자막을 TTS 재생 시점에 동기화하기 위해 audio event 에 함께 보냄.
            """
            out: list[str] = []
            # Keep draining futures that match the next expected index.
            while pending:
                fut, sentence_text = pending[0]
                if not fut.done():
                    break
                idx, audio_bytes, media_type = fut.result()
                if idx != next_idx[0]:
                    # Out of order; wait for the right one. (Shouldn't
                    # happen because we submit sequentially, but guard.)
                    break
                pending.pop(0)
                next_idx[0] += 1
                if audio_bytes:
                    b64 = _base64.b64encode(audio_bytes).decode("ascii")
                    out.append(_sse_event("audio", _json.dumps({
                        "idx": idx,
                        "media_type": media_type,
                        "data_b64": b64,
                        "text": sentence_text,
                    }, ensure_ascii=False)))
            return out

        collected: list[str] = []
        sentence_buf = ""
        pending_tts: list = []  # list[(Future, sentence_text)]
        sentence_idx = 0
        next_emit_idx = [0]

        try:
            for token in stream_reply(
                user_message=effective_message,
                context=context,
                recent_messages=recent_messages,
                conversation_summary=conversation_summary,
                user_id=effective_user_id,
            ):
                collected.append(token)
                yield _sse_event("token", token)
                sentence_buf += token

                # Drain as many complete sentences as possible.
                while True:
                    sentence, remainder = _split_next_sentence(
                        sentence_buf, is_first=(sentence_idx == 0)
                    )
                    if sentence is None:
                        break
                    sentence_buf = remainder
                    fut = _tts_executor.submit(_tts_job, sentence, sentence_idx)
                    pending_tts.append((fut, sentence))
                    sentence_idx += 1

                # Flush any audio that finished since the last token.
                for ev in _emit_ready_audio(pending_tts, next_emit_idx):
                    yield ev
        except Exception:
            if not collected:
                fallback = "말씀해 주셔서 고마워요. 지금 들은 내용을 바탕으로 천천히 함께 정리해볼게요."
                collected.append(fallback)
                yield _sse_event("token", fallback)
                sentence_buf += fallback

        # Flush tail sentence (no terminal punctuation).
        tail = sentence_buf.strip()
        if tail:
            fut = _tts_executor.submit(_tts_job, tail, sentence_idx)
            pending_tts.append((fut, tail))
            sentence_idx += 1

        # Wait for remaining TTS futures in order and emit.
        while pending_tts:
            fut, sentence_text = pending_tts[0]
            idx, audio_bytes, media_type = fut.result()
            pending_tts.pop(0)
            next_emit_idx[0] += 1
            if audio_bytes:
                b64 = _base64.b64encode(audio_bytes).decode("ascii")
                yield _sse_event("audio", _json.dumps({
                    "idx": idx,
                    "media_type": media_type,
                    "data_b64": b64,
                    "text": sentence_text,
                }, ensure_ascii=False))

        full_reply = strip_emoji("".join(collected))
        yield _sse_event("audio_end", _json.dumps({"count": sentence_idx}, ensure_ascii=False))
        # prompt 모드만 응답 dict X (음성으로만 권유). action=hide 는 그대로 forward.
        if triggered_reminiscence is None:
            sse_reminiscence = None
        elif triggered_reminiscence.get("mode") == "prompt":
            sse_reminiscence = None
        else:
            sse_reminiscence = triggered_reminiscence
        yield _sse_event("done", _json.dumps({
            "reply": full_reply,
            "emotion": emotion,
            "crisis_flag": crisis_flag,
            "used_retrieval": rr_used,
            "context_count": len(context),
            "memory_photo": memory_photo_out,
            "reminiscence_photo": sse_reminiscence,
        }, ensure_ascii=False))

        _finalize_conversation(
            session_id, effective_user_id, text, full_reply,
            emotion, risk_level, crisis_flag, context, rr_used, "stt-chat",
            started, memory_photo_out,
        )

    return StreamingResponse(_llm_stream(), media_type="text/event-stream")


def _finalize_conversation(
    session_id: str,
    user_id: str | None,
    message: str,
    reply: str,
    emotion: str,
    risk_level: str,
    crisis_flag: bool,
    context: list[str],
    rr_used: str,
    channel: str,
    started: float,
    memory_photo: dict | None,
) -> None:
    retrieval.save_memory(
        session_id=session_id, user_id=user_id,
        content=message, emotion=emotion, crisis_flag=crisis_flag,
    )
    conversation_db.add_message(
        session_id=session_id, user_id=user_id, speaker="user",
        content=message, emotion=emotion, risk_level=risk_level,
        crisis_flag=crisis_flag, channel=channel,
        meta={"retrieval_mode": rr_used, "context_count": len(context)},
    )
    # --- 비동기 새 지식 감지 worker (지연 0, 자동 KG 저장 X — PendingKnowledge 만) ---
    try:
        from app.services import knowledge_worker as _kw
        _kw.enqueue(user_id, session_id, message)
    except Exception:
        pass
    conversation_db.add_message(
        session_id=session_id, user_id=user_id, speaker="assistant",
        content=reply, emotion=emotion, risk_level=risk_level,
        crisis_flag=crisis_flag, channel=channel,
        meta={"reply_to": "user_message"},
    )
    retrieval.save_memory(
        session_id=session_id, user_id=user_id,
        content=reply, emotion=emotion, crisis_flag=crisis_flag,
    )
    append_session_log({
        "session_id": session_id, "user_id": user_id,
        "message": message, "reply": reply,
        "emotion": emotion, "crisis_flag": crisis_flag,
        "risk_level": risk_level, "retrieval_mode": rr_used,
        "context_count": len(context),
    })
    proactive_policy.note_assistant_turn(session_id)
    elapsed_ms = (time.perf_counter() - started) * 1000.0
    metrics_state.record(session_id, elapsed_ms, error=False)

    # --- caregiver webhook notifications (streaming path) ---
    if crisis_flag:
        _fire_webhook(user_id, "emergency", f"위기 상황 감지: {message}")
    elif risk_level == "danger":
        _fire_webhook(user_id, "warning", f"위험 감정 감지: {emotion}")

    # --- Background knowledge detection (streaming path, non-blocking) ---
    if user_id and not crisis_flag and _should_detect_knowledge(session_id):
        recent_msgs = conversation_db.list_messages(session_id=session_id, user_id=user_id, limit=8)
        recent_for_detect = [
            {"role": item["speaker"], "content": item["content"]}
            for item in recent_msgs[-4:]
            if item["speaker"] in {"user", "assistant"} and item["content"]
        ]
        import threading
        def _bg_detect():
            import asyncio as _aio
            _aio.run(_run_knowledge_detection(
                user_message=message,
                retrieved_context=context,
                recent_messages=recent_for_detect,
                session_id=session_id,
                user_id=user_id,
            ))
        threading.Thread(target=_bg_detect, daemon=True).start()
        logger.info("[KnowledgeDetect] background thread started for session %s", session_id)


@app.get("/metrics", response_model=MetricResponse)
def metrics() -> MetricResponse:
    return MetricResponse(
        total_requests=metrics_state.total_requests,
        total_errors=metrics_state.total_errors,
        avg_latency_ms=round(metrics_state.avg_latency_ms, 2),
        active_sessions=len(metrics_state.sessions),
    )


@app.post("/proactive-event", response_model=ProactiveEventResponse)
def proactive_event(req: ProactiveEventRequest) -> ProactiveEventResponse:
    started = time.perf_counter()
    error = False
    try:
        effective_user_id = get_effective_user_id(req.session_id, req.user_id)
        req = req.model_copy(update={"user_id": effective_user_id})
        return safe_proactive_reply(req)
    except Exception as e:
        error = True
        raise HTTPException(status_code=500, detail=f"proactive failed: {e}") from e
    finally:
        elapsed_ms = (time.perf_counter() - started) * 1000.0
        metrics_state.record(req.session_id, elapsed_ms, error=error)


@app.post("/tts")
def synthesize_tts(req: TTSRequest) -> Response:
    try:
        audio, media_type = tts_service.synthesize(
            req.text,
            session_id=req.session_id,
            user_id=req.user_id,
            speaker_profile_id=req.speaker_profile_id,
        )
        return Response(content=audio, media_type=media_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"tts failed: {e}") from e


@app.get("/tts/voices")
def list_tts_voices() -> dict:
    """Supertonic 화자 목록 + 현재 선택 반환."""
    try:
        voices = tts_service.supertonic.list_voices()
        current = tts_service.supertonic.current_voice
        return {"voices": voices, "current": current}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"list voices failed: {e}") from e


@app.post("/tts/voices/{voice_id}")
def set_tts_voice(voice_id: str) -> dict:
    """런타임에 Supertonic 화자 변경 (예: F3, M4)."""
    try:
        applied = tts_service.supertonic.set_voice(voice_id)
        return {"ok": True, "current": applied}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"set voice failed: {e}") from e


@app.get("/voice-profiles", response_model=VoiceProfileListResponse)
def list_voice_profiles(user_id: str | None = None) -> VoiceProfileListResponse:
    return VoiceProfileListResponse(**tts_service.voice_profiles.list_profiles(user_id=user_id))


@app.post("/voice-profiles", response_model=VoiceProfileActionResponse)
async def create_voice_profile(
    display_name: str = Form(...),
    set_as_default: bool = Form(False),
    user_id: str | None = Form(None),
    files: list[UploadFile] = File(...),
) -> VoiceProfileActionResponse:
    uploads: list[tuple[str, bytes]] = []
    for file in files:
        content = await file.read()
        uploads.append((file.filename or "sample.wav", content))

    try:
        profile = tts_service.voice_profiles.create_profile(
            display_name=display_name,
            uploads=uploads,
            set_as_default=set_as_default,
            user_id=user_id,
        )
        return VoiceProfileActionResponse(profile=profile)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"voice profile create failed: {e}") from e


@app.post("/voice-profiles/{profile_id}/activate", response_model=VoiceProfileActionResponse)
def activate_voice_profile(profile_id: str, user_id: str | None = None) -> VoiceProfileActionResponse:
    try:
        profile = tts_service.voice_profiles.activate_profile(profile_id, user_id=user_id)
        return VoiceProfileActionResponse(profile=profile)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"voice profile activate failed: {e}") from e


@app.post("/voice-clone/toggle")
def toggle_voice_clone(enabled: bool, user_id: str | None = None):
    result = tts_service.voice_profiles.set_voice_clone_enabled(enabled, user_id=user_id)
    return {"voice_clone_enabled": result, "user_id": user_id}


@app.get("/voice-clone/status")
def voice_clone_status(user_id: str | None = None):
    enabled = tts_service.voice_profiles.is_voice_clone_enabled(user_id=user_id)
    return {"voice_clone_enabled": enabled, "user_id": user_id}


@app.delete("/voice-profiles/{profile_id}", response_model=VoiceProfileDeleteResponse)
def delete_voice_profile(profile_id: str, user_id: str | None = None) -> VoiceProfileDeleteResponse:
    try:
        deleted = tts_service.voice_profiles.delete_profile(profile_id, user_id=user_id)
        return VoiceProfileDeleteResponse(**deleted)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"voice profile delete failed: {e}") from e


# ── Patient voice (speaker verification) ──────────────────────
from app.services.patient_voice import PatientVoiceService
_patient_voice_svc = PatientVoiceService()


@app.get("/patient-voice")
def get_patient_voice(user_id: str | None = None):
    profile = _patient_voice_svc.get_profile(user_id)
    return {"profile": profile}


@app.post("/patient-voice")
async def upload_patient_voice(
    user_id: str = Form(""),
    files: list[UploadFile] = File(...),
):
    uploads = []
    for f in files:
        content = await f.read()
        uploads.append((f.filename or "audio.wav", content))
    try:
        result = _patient_voice_svc.save_samples(user_id or None, uploads)
        return {"ok": True, "profile": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.delete("/patient-voice")
def delete_patient_voice(user_id: str | None = None):
    deleted = _patient_voice_svc.delete_profile(user_id)
    return {"ok": True, "deleted": deleted}


@app.get("/memory-photos", response_model=MemoryPhotoListResponse)
def list_memory_photos(user_id: str | None = None) -> MemoryPhotoListResponse:
    return MemoryPhotoListResponse(**memory_photo_service.list_photos(user_id=user_id))


@app.post("/memory-photos", response_model=MemoryPhotoActionResponse)
async def create_memory_photo(
    title: str = Form("회상 사진"),
    note: str = Form(""),
    set_active: bool = Form(True),
    user_id: str | None = Form(None),
    file: UploadFile = File(...),
) -> MemoryPhotoActionResponse:
    try:
        content = await file.read()
        photo = memory_photo_service.create_photo(
            title=title,
            note=note,
            filename=file.filename or "memory-photo.jpg",
            content=content,
            set_active=set_active,
            user_id=user_id,
        )
        return MemoryPhotoActionResponse(photo=photo)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"memory photo create failed: {e}") from e


@app.post("/memory-photos/{photo_id}/activate", response_model=MemoryPhotoActionResponse)
def activate_memory_photo(photo_id: str, user_id: str | None = None) -> MemoryPhotoActionResponse:
    try:
        photo = memory_photo_service.activate_photo(photo_id, user_id=user_id)
        return MemoryPhotoActionResponse(photo=photo)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"memory photo activate failed: {e}") from e


@app.delete("/memory-photos/{photo_id}")
def delete_memory_photo(photo_id: str, user_id: str | None = None) -> dict:
    deleted = memory_photo_service.delete_photo(photo_id, user_id=user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="memory photo not found")
    return {"ok": True, "photo_id": photo_id}


@app.get("/memory-photos/{photo_id}/file")
def memory_photo_file(photo_id: str, user_id: str | None = None) -> FileResponse:
    try:
        path = memory_photo_service.file_path_for(photo_id, user_id=user_id)
        return FileResponse(path)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"memory photo file failed: {e}") from e


@app.post("/memory-photos/{photo_id}/reminisce", response_model=ChatResponse)
def reminisce_with_photo(photo_id: str, req: ChatRequest) -> ChatResponse:
    try:
        effective_user_id = get_effective_user_id(req.session_id, req.user_id)
        photo = memory_photo_service.get_photo(photo_id, user_id=effective_user_id)
        if photo is None:
            raise ValueError("memory photo not found")
        note = (photo.get("note") or "").strip()
        prompt = (
            f"회상 유도를 시작해 주세요. 사진 제목은 '{photo['title']}'입니다. "
            f"{'사진 설명은 ' + note + ' 입니다. ' if note else ''}"
            "환자에게 부담 주지 않게, 이 사진을 보고 떠오르는 사람이나 장소, 감정을 한두 문장으로 천천히 물어봐 주세요."
        )
        out = safe_reply(prompt, req.session_id, effective_user_id, channel="memory-photo")
        out["memory_photo"] = memory_photo_service.get_photo_response(photo_id, user_id=effective_user_id)
        proactive_policy.note_assistant_turn(req.session_id)
        return ChatResponse(session_id=req.session_id, **out)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"memory photo reminisce failed: {e}") from e


@app.get("/conversations", response_model=ConversationListResponse)
def conversations(
    session_id: str | None = None,
    user_id: str | None = None,
    risk_level: str | None = None,
    limit: int = 100,
) -> ConversationListResponse:
    limit = max(1, min(limit, 500))
    items = conversation_db.list_messages(
        session_id=session_id,
        user_id=user_id,
        risk_level=risk_level,
        limit=limit,
    )
    return ConversationListResponse(items=items)


@app.get("/conversations/sessions", response_model=ConversationSessionListResponse)
def conversation_sessions(
    user_id: str | None = None,
    limit: int = 50,
) -> ConversationSessionListResponse:
    limit = max(1, min(limit, 200))
    items = conversation_db.list_sessions(user_id=user_id, limit=limit)
    return ConversationSessionListResponse(items=items)


@app.get("/conversations/summary", response_model=ConversationSummaryResponse)
def conversations_summary(
    session_id: str | None = None,
    user_id: str | None = None,
) -> ConversationSummaryResponse:
    return ConversationSummaryResponse(
        **conversation_db.summary(session_id=session_id, user_id=user_id)
    )


@app.delete("/conversations/sessions/{session_id}", response_model=ConversationDeleteResponse)
def delete_conversation_session(session_id: str) -> ConversationDeleteResponse:
    """세션 1개의 모든 메시지 삭제 (보호자 앱 → API → AI 서버)."""
    if not session_id or not session_id.strip():
        raise HTTPException(status_code=400, detail="session_id required")
    deleted = conversation_db.delete_session(session_id)
    return ConversationDeleteResponse(deleted=deleted, target="session", target_id=session_id)


@app.delete("/conversations/users/{user_id}", response_model=ConversationDeleteResponse)
def delete_conversation_user(user_id: str) -> ConversationDeleteResponse:
    """특정 user_id 의 모든 메시지 삭제 (전체 대화 내역 초기화)."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id required")
    deleted = conversation_db.delete_user(user_id)
    return ConversationDeleteResponse(deleted=deleted, target="user", target_id=user_id)


# ---------------------------------------------------------------------------
# 사투리(Dialect) API
# ---------------------------------------------------------------------------

@app.get("/dialect/regions")
def dialect_regions() -> dict:
    """사용 가능한 사투리 지역 목록을 반환합니다."""
    return {"regions": get_available_regions(), "intensities": get_available_intensities()}


@app.get("/dialect/{user_id}")
def get_dialect(user_id: str) -> dict:
    """특정 사용자의 사투리 설정을 조회합니다."""
    setting = dialect_store.get(user_id)
    return {
        "user_id": user_id,
        "region": setting.region,
        "intensity": setting.intensity,
    }


@app.put("/dialect/{user_id}")
def set_dialect(user_id: str, region: str = "standard", intensity: str = "medium") -> dict:
    """사용자의 사투리 설정을 변경합니다.

    보호자 앱에서 호출합니다.
    - region: standard | gyeongsang | jeolla | chungcheong | jeju | gangwon
    - intensity: light | medium | strong
    """
    valid_regions = {"standard", "gyeongsang", "jeolla", "chungcheong", "jeju", "gangwon"}
    valid_intensities = {"light", "medium", "strong"}
    if region not in valid_regions:
        raise HTTPException(status_code=400, detail=f"Invalid region: {region}. Valid: {valid_regions}")
    if intensity not in valid_intensities:
        raise HTTPException(status_code=400, detail=f"Invalid intensity: {intensity}. Valid: {valid_intensities}")

    setting = dialect_store.set(user_id, region=region, intensity=intensity)  # type: ignore[arg-type]
    logger.info("Dialect updated for user %s: region=%s, intensity=%s", user_id, region, intensity)
    return {
        "ok": True,
        "user_id": user_id,
        "region": setting.region,
        "intensity": setting.intensity,
    }


@app.delete("/dialect/{user_id}")
def reset_dialect(user_id: str) -> dict:
    """사용자의 사투리 설정을 표준어로 초기화합니다."""
    dialect_store.remove(user_id)
    return {"ok": True, "user_id": user_id, "region": "standard", "intensity": "medium"}


@app.post("/extract-knowledge")
async def extract_knowledge_endpoint(request: ExtractKnowledgeRequest) -> dict:
    """Called by the Express server during the caregiver approval flow.

    Extracts structured knowledge from a patient utterance for Neo4j storage.
    """
    try:
        result = await extract_structured_knowledge(
            raw_utterance=request.raw_utterance,
            summary=request.summary,
            category_hint=request.category_hint,
            persona_id=request.persona_id,
        )
        return {"ok": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"knowledge extraction failed: {e}") from e


# ── Avoidance topics (Phase 6: 피드백 기반 회피 주제) ──────────────
from app.services.avoidance_store import avoidance_store as _avoid_store


@app.post("/avoidance")
async def add_avoidance_topic(payload: dict):
    """보호자 앱이 '불만족' 피드백 + 주제를 줬을 때 호출.

    body: { "user_id": "...", "topic": "돈" }
    """
    user_id = (payload.get("user_id") or "").strip()
    topic = (payload.get("topic") or "").strip()
    if not user_id or not topic:
        raise HTTPException(status_code=400, detail="user_id and topic required")
    _avoid_store().add(user_id, topic)
    return {"ok": True, "topics": _avoid_store().list_topics(user_id)}


@app.get("/avoidance/{user_id}")
async def list_avoidance_topics(user_id: str):
    return {"topics": _avoid_store().list_topics(user_id)}


@app.delete("/avoidance/{user_id}/{topic}")
async def remove_avoidance_topic(user_id: str, topic: str):
    removed = _avoid_store().remove(user_id, topic)
    return {"ok": True, "removed": removed}
