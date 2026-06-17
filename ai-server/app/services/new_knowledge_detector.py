from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

CATEGORY_HINTS = [
    "가족관계", "직업/경력", "학창시절", "취미/관심사", "중요한 추억",
    "거주지", "친구/지인", "투약 정보", "식사 선호", "수면 패턴",
    "운동 습관", "의료 이력", "알레르기", "일상 루틴", "기타",
]

MIN_CONFIDENCE = 0.85  # 임계 상향 — 이미 있는 정보 잘못 추가 방지


@dataclass
class NewKnowledgeCandidate:
    raw_utterance: str        # patient's exact words
    summary: str              # extracted summary
    category_hint: str        # e.g. "가족관계", "투약 정보"
    confidence: float         # 0.0 - 1.0


_DETECTION_PROMPT = """\
/no_think
당신은 치매 환자 대화에서 **지식그래프에 추가할 가치가 있는 새 개인 정보**만 감지하는 엄격한 분석기입니다.

# 기존 지식그래프 (이미 저장된 정보 — 절대 다시 새 정보로 추출하지 마세요)
{existing_context}

# 최근 대화
{recent_conversation}

# 환자 발화
"{user_message}"

# 판단 룰 (반드시 따를 것)

1. **이미 지식그래프에 있는 entity 가 발화에 포함되면 → has_new_info=false**.
   예: 위 KG 에 "전북 전주시 완산구 서노송동" 이 있고 환자가 "서노송동 이야기" 했으면 has_new_info=false.
   예: 위 KG 에 "박복례" (어머니) 가 있고 환자가 "엄마 보고 싶다" 했으면 has_new_info=false.
   예: 위 KG 에 "초등학교 교사" 직업이 있고 환자가 "학교에서 일했지" 했으면 has_new_info=false.

2. 단순 감정·감탄·질문·인사·"네/아니오"·"그랬지" 같은 짧은 응답 → has_new_info=false.

3. **완전히 새로운 fact** 만 has_new_info=true:
   - KG 에 없던 사람 이름 (가족·친구·동료 등)
   - KG 에 없던 장소 (살았던 곳·여행지·일터 등)
   - KG 에 없던 직업·취미·습관·건강 상태·약 등
   - 구체적인 시간·연도·사건이 KG 에 없던 새 episode

4. confidence 룰 (엄격):
   - 0.95 이상: 확실히 새로운 fact + KG 와 명백히 다름
   - 0.70~0.94: 새 정보 같지만 표현이 모호함
   - 0.50~0.69: 모호함, 보호자가 검토 필요
   - 0.50 미만: 새 정보 아닐 가능성 높음 → has_new_info=false 권장

5. 의심스러우면 보수적으로 has_new_info=false 와 낮은 confidence 를 택하세요. **이미 있는 정보를 새 것으로 잘못 분류하는 게 가장 큰 실수**입니다.

# category_hint (하나 선택)
{categories}

# 출력 (JSON 만, 다른 텍스트 X)
{{"has_new_info": true/false, "summary": "요약 (1문장)", "category_hint": "카테고리", "confidence": 0.0~1.0}}
"""


async def detect_new_knowledge(
    user_message: str,
    retrieved_context: list[str],
    recent_messages: list[dict],
    user_id: str,
    llm_client: httpx.AsyncClient | None = None,
    model_name: str | None = None,
) -> Optional[NewKnowledgeCandidate]:
    """
    Uses LLM to check if the patient's message contains NEW factual personal information
    not already present in the retrieved knowledge context.

    Returns NewKnowledgeCandidate if new info detected, None otherwise.
    """
    # Skip very short messages unlikely to contain new knowledge
    if len(user_message.strip()) < 5:
        return None

    existing_context = "\n".join(f"- {c}" for c in retrieved_context) if retrieved_context else "- (없음)"
    recent_conv = "\n".join(
        f"- {'환자' if m.get('role') == 'user' else '도우미'}: {m.get('content', '')}"
        for m in (recent_messages or [])[-4:]
    )

    prompt = _DETECTION_PROMPT.format(
        existing_context=existing_context,
        recent_conversation=recent_conv or "(없음)",
        user_message=user_message,
        categories=", ".join(CATEGORY_HINTS),
    )

    payload = {
        "model": model_name or settings.knowledge_model,
        "stream": False,
        "messages": [{"role": "user", "content": prompt}],
        "options": {
            "temperature": 0.1,
            "num_predict": 500,
        },
        "think": False,
    }

    try:
        client = llm_client or httpx.AsyncClient(timeout=30.0)
        should_close = llm_client is None
        try:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/chat",
                json=payload,
                timeout=30.0,
            )
            resp.raise_for_status()
            data = resp.json()
        finally:
            if should_close:
                await client.aclose()

        content = data.get("message", {}).get("content", "")
        # Extract JSON from response (handle possible markdown wrapping)
        content = content.strip()
        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(
                line for line in lines
                if not line.strip().startswith("```")
            )
        result = json.loads(content)

        has_new = result.get("has_new_info", False)
        confidence = float(result.get("confidence", 0.0))

        if not has_new or confidence < MIN_CONFIDENCE:
            return None

        summary = result.get("summary", "").strip()
        category = result.get("category_hint", "기타").strip()
        if category not in CATEGORY_HINTS:
            category = "기타"

        if not summary:
            return None

        return NewKnowledgeCandidate(
            raw_utterance=user_message,
            summary=summary,
            category_hint=category,
            confidence=confidence,
        )

    except json.JSONDecodeError as e:
        logger.warning("Knowledge detection: failed to parse LLM JSON response: %s", e)
        return None
    except Exception:
        logger.warning("Knowledge detection failed (non-blocking)", exc_info=True)
        return None
