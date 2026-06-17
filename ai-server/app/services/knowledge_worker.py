"""Knowledge Worker — 비동기 백그라운드 새 지식 감지·webhook 발사.

설계:
- 메인 chat 흐름은 즉시 응답 반환 (지연 영향 0).
- chat endpoint 가 turn 끝에 enqueue(user_id, session_id, user_message) 호출만.
- Worker daemon 이 큐에서 pop → KG fetch → LLM detect → confidence ≥ 임계 → webhook 발사.
- **자동 KG 저장 절대 X**. 모든 감지 결과는 PendingKnowledge 노드로 보호자 승인 대기.
- Worker LLM 은 fine-tune 모델 (회상요법 어조) 아닌 base 모델 (settings.knowledge_model = gemma4:31b).

흐름:
    chat → 응답 + enqueue
              ↓
    worker (asyncio task) — 1 worker, max queue 500
              ↓
    1. KG fetch (Neo4j Persona 1-hop)
    2. recent messages fetch (conversation_db, 최근 6턴)
    3. detect_new_knowledge LLM 호출
    4. confidence ≥ knowledge_pending_threshold → send_pending_knowledge webhook
    5. (보호자가 knowledge.tsx 에서 승인 시 → 기존 KnowledgeItem + GraphEntity 흐름)
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from typing import Optional

from app.config import settings
from app.services.caregiver_webhook import send_pending_knowledge
from app.services.conversation_db import ConversationDB
from app.services.new_knowledge_detector import detect_new_knowledge

logger = logging.getLogger(__name__)


@dataclass
class KnowledgeJob:
    user_id: str
    session_id: str
    user_message: str


_QUEUE_MAX = 500
_RECENT_MSG_LIMIT = 6
_MIN_MESSAGE_LEN = 5

_queue: asyncio.Queue[KnowledgeJob] = asyncio.Queue(maxsize=_QUEUE_MAX)
_worker_task: Optional[asyncio.Task] = None
_conv_db: Optional[ConversationDB] = None


def set_conversation_db(db: ConversationDB) -> None:
    """startup 시 ConversationDB 인스턴스 주입."""
    global _conv_db
    _conv_db = db


def enqueue(user_id: str | None, session_id: str | None, user_message: str | None) -> None:
    """Best-effort enqueue. 큐 full 또는 짧은 발화는 drop."""
    if not user_id or not session_id or not user_message:
        return
    if len(user_message.strip()) < _MIN_MESSAGE_LEN:
        return
    try:
        _queue.put_nowait(KnowledgeJob(
            user_id=user_id,
            session_id=session_id,
            user_message=user_message,
        ))
        logger.info("[KW] enqueued user=%s session=%s qsize=%d", user_id, session_id, _queue.qsize())
    except asyncio.QueueFull:
        logger.warning("[KW] queue full (max=%d), dropping job for %s", _QUEUE_MAX, user_id)


_kg_driver = None


def _get_kg_driver():
    """Neo4j driver 싱글턴 (KW 전용)."""
    global _kg_driver
    if _kg_driver is None:
        from neo4j import GraphDatabase
        _kg_driver = GraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_username or "", settings.neo4j_password or ""),
        )
    return _kg_driver


def _fetch_kg_context(user_id: str) -> list[str]:
    """user_id (= persona_id) 의 KG 1-hop + 2-hop entity 를 풍부한 텍스트 list 로 반환.

    LLM 이 '이미 KG 에 있는지' 정확히 매칭할 수 있게 entity name + label + relationship + source_field 까지 포함.
    실패 시 빈 list.
    """
    try:
        driver = _get_kg_driver()
    except Exception:
        logger.warning("[KW] Neo4j driver init failed", exc_info=True)
        return []

    rows: list[str] = []
    try:
        with driver.session(database=settings.neo4j_database) as session:
            # 1-hop 모든 connected node (label 무관)
            result = session.run(
                """
                MATCH (p:Persona {persona_id: $pid})-[r]->(n)
                WHERE NOT n:Graph AND NOT n:Caregiver AND NOT n:Patient
                RETURN type(r) AS rel,
                       coalesce(n.name, n.title, n.value, n.content, '?') AS name,
                       labels(n) AS labels,
                       coalesce(n.source_field, n.role_hint, n.role, '') AS field,
                       coalesce(n.graph_type, '') AS gtype
                LIMIT 200
                """,
                pid=user_id,
            )
            for record in result:
                labels = [l for l in record["labels"] if l not in ("GraphEntity", "Entity")]
                label = labels[0] if labels else "Entity"
                field = record["field"]
                gtype = record["gtype"]
                gt_str = f" [{gtype}]" if gtype else ""
                fld_str = f" ({field})" if field else ""
                rows.append(f"{label}{gt_str}: {record['name']}{fld_str} -[{record['rel']}]")
    except Exception:
        logger.warning("[KW] KG fetch failed for %s", user_id, exc_info=True)
        return []
    return rows


def _fetch_recent_messages(user_id: str, session_id: str) -> list[dict]:
    """conversation_db 에서 최근 N 턴 fetch. detect_new_knowledge 입력 형식 (role/content)."""
    if _conv_db is None:
        return []
    try:
        msgs = _conv_db.list_messages(
            session_id=session_id,
            user_id=user_id,
            limit=_RECENT_MSG_LIMIT,
        )
    except Exception:
        logger.debug("[KW] recent messages fetch failed", exc_info=True)
        return []
    out: list[dict] = []
    for m in msgs:
        speaker = m.get("speaker", "")
        role = "user" if speaker == "user" else "assistant"
        out.append({"role": role, "content": m.get("content", "")})
    return out


async def _process_job(job: KnowledgeJob) -> None:
    """1 job 처리 — KG fetch + detect + webhook (조건 통과 시)."""
    logger.info("[KW] processing user=%s session=%s msg=%r",
                job.user_id, job.session_id, job.user_message[:60])

    # 1. KG context (1-hop entities)
    existing = _fetch_kg_context(job.user_id)
    logger.debug("[KW] KG context size: %d entities", len(existing))

    # 2. Recent messages
    recent = _fetch_recent_messages(job.user_id, job.session_id)

    # 3. LLM detect (gemma4:31b base 모델 — JSON 출력 가능)
    try:
        candidate = await detect_new_knowledge(
            user_message=job.user_message,
            retrieved_context=existing,
            recent_messages=recent,
            user_id=job.user_id,
        )
    except Exception:
        logger.warning("[KW] detect_new_knowledge failed for %s", job.user_id, exc_info=True)
        return

    if candidate is None:
        logger.info("[KW] no new knowledge for user=%s msg=%r", job.user_id, job.user_message[:40])
        return

    # 4. 임계치 체크 (자동 저장 X — 무조건 PendingKnowledge 흐름)
    threshold = settings.knowledge_pending_threshold
    if candidate.confidence < threshold:
        logger.info(
            "[KW] candidate below threshold: conf=%.2f < %.2f, summary=%r",
            candidate.confidence, threshold, candidate.summary,
        )
        return

    # 5. webhook 발사 → api-server 가 PendingKnowledge 노드 + Alert 생성
    logger.info(
        "[KW] PENDING webhook fire: user=%s conf=%.2f cat=%s summary=%r",
        job.user_id, candidate.confidence, candidate.category_hint, candidate.summary,
    )
    try:
        await send_pending_knowledge(
            user_id=job.user_id,
            raw_utterance=candidate.raw_utterance,
            summary=candidate.summary,
            category_hint=candidate.category_hint,
            confidence=candidate.confidence,
            session_id=job.session_id,
        )
    except Exception:
        logger.warning("[KW] webhook send failed (non-blocking)", exc_info=True)


async def _worker_loop() -> None:
    """무한 루프 — 큐에서 pop + _process_job. cancel 되면 graceful 종료."""
    logger.info("[KW] worker loop started")
    while True:
        try:
            job = await _queue.get()
        except asyncio.CancelledError:
            logger.info("[KW] worker loop cancelled, exiting")
            return
        try:
            await _process_job(job)
        except asyncio.CancelledError:
            logger.info("[KW] worker loop cancelled mid-job")
            return
        except Exception:
            logger.warning("[KW] unexpected worker error", exc_info=True)
        finally:
            _queue.task_done()


def start_worker() -> None:
    """ai-server startup 에서 호출. asyncio task 시작."""
    global _worker_task
    if _worker_task is not None and not _worker_task.done():
        logger.info("[KW] worker already running")
        return
    loop = asyncio.get_event_loop()
    _worker_task = loop.create_task(_worker_loop(), name="knowledge_worker")
    logger.info("[KW] worker task created")


async def stop_worker() -> None:
    """ai-server shutdown 에서 호출. graceful cancel."""
    global _worker_task
    if _worker_task is None:
        return
    if _worker_task.done():
        _worker_task = None
        return
    _worker_task.cancel()
    try:
        await _worker_task
    except asyncio.CancelledError:
        pass
    _worker_task = None
    logger.info("[KW] worker stopped")


def queue_status() -> dict:
    """디버그/모니터링용."""
    return {
        "qsize": _queue.qsize(),
        "max": _QUEUE_MAX,
        "running": _worker_task is not None and not _worker_task.done(),
    }
