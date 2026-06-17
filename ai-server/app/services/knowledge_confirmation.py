from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

import httpx

from app.config import settings
from app.services.new_knowledge_detector import NewKnowledgeCandidate

logger = logging.getLogger(__name__)


@dataclass
class PendingConfirmation:
    session_id: str
    user_id: str
    candidate: NewKnowledgeCandidate
    created_at: datetime = field(default_factory=datetime.now)
    attempts: int = 0
    max_attempts: int = 1  # only re-ask once


class KnowledgeConfirmationStore:
    """In-memory store for pending confirmations per session."""

    def __init__(self) -> None:
        self._store: dict[str, PendingConfirmation] = {}

    def add(self, session_id: str, user_id: str, candidate: NewKnowledgeCandidate) -> None:
        self._store[session_id] = PendingConfirmation(
            session_id=session_id,
            user_id=user_id,
            candidate=candidate,
        )

    def get(self, session_id: str) -> Optional[PendingConfirmation]:
        return self._store.get(session_id)

    def remove(self, session_id: str) -> None:
        self._store.pop(session_id, None)

    def has_pending(self, session_id: str) -> bool:
        return session_id in self._store


# Singleton
confirmation_store = KnowledgeConfirmationStore()


def get_confirmation_prompt(pending: PendingConfirmation) -> str:
    """Returns a Korean prompt to inject into the LLM system message for natural re-confirmation."""
    summary = pending.candidate.summary
    return (
        f"[확인 요청] 환자가 '{summary}'라고 말씀하셨습니다. "
        "자연스럽게 대화하면서 이 내용이 맞는지 한 번 더 확인해주세요. "
        "직접적으로 '맞나요?'라고 묻기보다 대화 흐름 속에서 자연스럽게 되물어주세요."
    )


_CONFIRMATION_CHECK_PROMPT = """\
/no_think
환자와 대화 중입니다. 이전에 환자가 다음과 같은 새로운 정보를 말했습니다:
"{summary}"

이후 환자의 최신 발화: "{user_message}"

질문: 환자의 최신 발화가 위 정보를 확인(긍정)하고 있나요?
- "네", "맞아요", "그래요", 관련 내용을 더 이야기하는 경우 -> confirmed
- "아니요", "아니에요", 부정하거나 다른 이야기를 하는 경우 -> denied
- 불분명한 경우 -> unclear

반드시 아래 JSON 형식으로만 답하세요:
{{"confirmed": true/false}}
"""


async def check_confirmation(
    user_message: str,
    pending: PendingConfirmation,
    llm_client: httpx.AsyncClient | None = None,
    model_name: str | None = None,
) -> bool:
    """Lightweight LLM check: did the patient confirm the previously mentioned info?

    Returns True if confirmed, False if denied/unclear.
    """
    prompt = _CONFIRMATION_CHECK_PROMPT.format(
        summary=pending.candidate.summary,
        user_message=user_message,
    )

    payload = {
        "model": model_name or settings.knowledge_model,
        "stream": False,
        "messages": [{"role": "user", "content": prompt}],
        "options": {
            "temperature": 0.1,
            "num_predict": 100,
        },
        "think": False,
    }

    try:
        client = llm_client or httpx.AsyncClient(timeout=20.0)
        should_close = llm_client is None
        try:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/chat",
                json=payload,
                timeout=20.0,
            )
            resp.raise_for_status()
            data = resp.json()
        finally:
            if should_close:
                await client.aclose()

        content = data.get("message", {}).get("content", "").strip()
        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(
                line for line in lines
                if not line.strip().startswith("```")
            )

        result = json.loads(content)
        return bool(result.get("confirmed", False))

    except json.JSONDecodeError:
        logger.debug("Confirmation check: failed to parse LLM JSON response")
        return False
    except Exception:
        logger.debug("Confirmation check failed (non-blocking)", exc_info=True)
        return False
