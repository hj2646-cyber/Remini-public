from __future__ import annotations

import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


async def notify_caregiver(user_id: str, level: str, message: str) -> None:
    """POST an alert to the caregiver Express server.

    Silently catches all exceptions so the main chat flow is never interrupted.
    """
    if not settings.caregiver_webhook_enabled:
        return
    if not settings.caregiver_api_url:
        return
    if not user_id:
        return

    url = f"{settings.caregiver_api_url.rstrip('/')}/patients/{user_id}/alerts"
    payload = {"level": level, "message": message}

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            logger.info("Caregiver webhook sent: %s %s -> %s", level, user_id, resp.status_code)
    except Exception:
        logger.debug("Caregiver webhook failed (non-blocking): %s %s", level, user_id, exc_info=True)


async def send_pending_knowledge(
    user_id: str,
    raw_utterance: str,
    summary: str,
    category_hint: str,
    confidence: float,
    session_id: str,
) -> None:
    """POST pending knowledge to the caregiver Express server for approval.

    Silently catches all exceptions so the main chat flow is never interrupted.
    """
    if not settings.caregiver_webhook_enabled:
        return
    if not settings.caregiver_api_url:
        return
    if not user_id:
        return

    url = f"{settings.caregiver_api_url.rstrip('/')}/patients/{user_id}/pending-knowledge"
    # api-server (TypeScript) 가 camelCase 로 req.body 받음 — snake_case 보내면 undefined → 빈 string Neo4j 저장
    payload = {
        "rawUtterance": raw_utterance,
        "summary": summary,
        "categoryHint": category_hint,
        "confidence": confidence,
        "sessionId": session_id,
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            logger.info(
                "Pending knowledge webhook sent: %s %s -> %s",
                user_id, summary, resp.status_code,
            )
    except Exception:
        logger.debug(
            "Pending knowledge webhook failed (non-blocking): %s %s",
            user_id, summary, exc_info=True,
        )
