"""GraphRAG 셀 — yaml KG 통째로 LLM context 에 입력.

실험설계 v5 §2.2:
  GraphRAG (구조화) = "페르소나 yaml 전체 LLM에 입력"
  → 검색 알고리즘 안 돌리고 KG 자체를 컨텍스트로 사용.

이는 단순화된 GraphRAG (Graph-as-Knowledge) 패턴. Microsoft GraphRAG (Edge 2024) 의
community detection 등 고도 알고리즘은 30명 페르소나 규모에선 과도하므로 제외.
"""
from __future__ import annotations

from pathlib import Path

import yaml

from .base import PersonaRAG, RetrievalResult


class GraphRAG:
    name = "GraphRAG"

    def __init__(self, persona_dir: str | Path):
        self.persona_dir = Path(persona_dir)
        self._cache: dict[str, str] = {}

    def _load_kg_yaml(self, persona_id: str) -> str:
        if persona_id in self._cache:
            return self._cache[persona_id]
        path = self.persona_dir / f"{persona_id}.yaml"
        if not path.exists():
            raise FileNotFoundError(f"KG 없음: {path}")
        kg = yaml.safe_load(open(path))
        # text 섹션은 별도 처리 — RAG 셀에서는 fact 위주 KG 만 사용
        # (text 는 VectorRAG 가 청크 단위로 임베딩)
        kg_facts = {k: v for k, v in kg.items() if k != "text"}
        return yaml.safe_dump(kg_facts, allow_unicode=True, sort_keys=False, default_flow_style=False)

    def retrieve(self, persona_id: str, question: str) -> RetrievalResult:
        kg_yaml = self._load_kg_yaml(persona_id)
        self._cache[persona_id] = kg_yaml
        return RetrievalResult(
            contexts=[kg_yaml],
            meta={"source": "yaml-full-kg", "persona_id": persona_id},
        )
