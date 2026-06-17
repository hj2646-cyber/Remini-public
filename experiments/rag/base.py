"""공통 인터페이스 — Phase 1 의 두 RAG 비교군이 같은 형식으로 컨텍스트 반환."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol


@dataclass
class RetrievalResult:
    """RAG 셀이 LLM 에 넘겨줄 컨텍스트 + RAGAS 평가 메타.

    contexts: LLM 프롬프트의 KNOWLEDGE 블록에 들어갈 chunk 리스트.
    ground_truth_supported: 이 chunk 안에 ground_truth 가 표면적으로 들어 있는지
                            (RAGAS Context Recall 디버깅 용. 평가는 RAGAS 가 알아서.)
    meta: 셀별 추가 메타데이터 (검색 점수, 모델명 등).
    """
    contexts: list[str]
    meta: dict = field(default_factory=dict)


class PersonaRAG(Protocol):
    name: str  # "GraphRAG" / "VectorRAG"

    def retrieve(self, persona_id: str, question: str) -> RetrievalResult:
        """주어진 페르소나 + 질문에 대한 컨텍스트 chunk 반환."""
        ...
