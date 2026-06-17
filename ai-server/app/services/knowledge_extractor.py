from __future__ import annotations

import json
import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

ENTITY_LABELS = [
    "Person", "Place", "Occupation", "Event", "Activity",
    "Medication", "Food", "Routine", "HealthCondition", "Trait",
    "Item", "Media", "Preference", "Info",
]

RELATIONSHIP_TYPES = [
    "HAS_FAMILY", "HAD_FRIEND", "WORKED_AS", "REFLECTS_ON",
    "ENJOYS_ACTIVITY", "FROM", "TAKES_MEDICATION", "PREFERS_FOOD",
    "HAS_ROUTINE", "HAS_HEALTH_CONDITION", "HAS_PREFERENCE", "HAS_INFO",
]

_EXTRACTION_PROMPT = """\
/no_think
당신은 치매 환자의 발화에서 구조화된 지식을 추출하는 분석기입니다.

환자 발화: "{raw_utterance}"
요약: "{summary}"
카테고리 힌트: "{category_hint}"

아래 규칙에 따라 Neo4j 지식그래프에 저장할 구조화된 데이터를 추출하세요.

type 분류:
- "life_memory": 과거 개인 역사, 추억, 가족관계, 학창시절, 직업 경력 등
- "daily_care": 현재 건강 상태, 투약, 식사, 수면, 운동, 일상 루틴 등

entity_label (하나 선택): {entity_labels}
relationship_type (하나 선택): {relationship_types}

반드시 아래 JSON 형식으로만 답하세요:
{{
    "type": "life_memory 또는 daily_care",
    "category": "한국어 카테고리명",
    "title": "짧은 제목 (10자 이내)",
    "content": "상세 내용",
    "entity_label": "라벨",
    "relationship_type": "관계 유형"
}}
"""


async def extract_structured_knowledge(
    raw_utterance: str,
    summary: str,
    category_hint: str,
    persona_id: str,
    llm_client: httpx.AsyncClient | None = None,
    model_name: str | None = None,
) -> dict:
    """
    Uses LLM to extract structured knowledge data for Neo4j storage.

    Returns dict with:
    - type: "life_memory" or "daily_care"
    - category: Korean category name
    - title: short title
    - content: detailed content
    - entity_label: Neo4j label (Person, Place, Medication, etc.)
    - relationship_type: Neo4j relationship (HAS_FAMILY, TAKES_MEDICATION, etc.)
    - persona_id: the patient's persona id
    """
    prompt = _EXTRACTION_PROMPT.format(
        raw_utterance=raw_utterance,
        summary=summary,
        category_hint=category_hint,
        entity_labels=", ".join(ENTITY_LABELS),
        relationship_types=", ".join(RELATIONSHIP_TYPES),
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

    content = data.get("message", {}).get("content", "").strip()
    if content.startswith("```"):
        lines = content.split("\n")
        content = "\n".join(
            line for line in lines
            if not line.strip().startswith("```")
        )

    result = json.loads(content)

    # Validate and normalize fields
    knowledge_type = result.get("type", "life_memory")
    if knowledge_type not in ("life_memory", "daily_care"):
        knowledge_type = "life_memory"

    entity_label = result.get("entity_label", "Info")
    if entity_label not in ENTITY_LABELS:
        entity_label = "Info"

    relationship_type = result.get("relationship_type", "HAS_INFO")
    if relationship_type not in RELATIONSHIP_TYPES:
        relationship_type = "HAS_INFO"

    return {
        "type": knowledge_type,
        "category": result.get("category", category_hint),
        "title": result.get("title", summary[:10]),
        "content": result.get("content", summary),
        "entity_label": entity_label,
        "relationship_type": relationship_type,
        "persona_id": persona_id,
    }
