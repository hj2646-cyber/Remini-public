"""VectorRAG 셀 — bge-m3 임베딩 + ChromaDB top-k 검색.

실험설계 v5 §2.2:
  VectorRAG (비구조화) = "자연어 chunk 문장 리스트, 벡터 검색 top-k=5 chunk"

청크 전략:
  페르소나당 5개 텍스트 (persona / family / culinary / hobbies / cultural) → 1 chunk 씩.
  + KG fact 일부도 자연어로 풀어 추가 청크 5개 (인구통계/결혼/자녀/건강/거주).
  = 페르소나당 10 청크 → 30명 = 300 청크.

  이렇게 하면 "결혼연도" 같은 fact 도 텍스트 청크에 들어가서, VectorRAG 가
  단순한 narrative 청크만 가지고 답해야 하는 불공평을 줄일 수 있음.
  (실험설계 v5 §2.5 의 시나리오 패턴이 결혼연도·자녀이름 같은 정확 fact 를 묻기 때문)
"""
from __future__ import annotations

from pathlib import Path
from typing import Optional

import yaml

from .base import RetrievalResult

# Lazy imports — chromadb / sentence-transformers 무거움
_chromadb = None
_st = None


def _lazy_imports():
    global _chromadb, _st
    if _chromadb is None:
        import chromadb
        _chromadb = chromadb
    if _st is None:
        from sentence_transformers import SentenceTransformer
        _st = SentenceTransformer
    return _chromadb, _st


def kg_to_fact_chunks(kg: dict) -> list[tuple[str, str]]:
    """KG yaml → 자연어 fact chunk 리스트. (chunk_id, text) 반환."""
    name = kg["name"]
    age = kg["age"]
    sex = kg["sex"]
    chunks = []

    # 청크 1: 인구통계
    edu = kg["education"]["level"]
    field_part = f", 전공은 {kg['education']['field']}" if kg["education"]["field"] else ""
    chunks.append(("demographics",
        f"{name} 씨는 {age}세 {sex}이며, "
        f"{kg['residence']['province']} {kg['residence']['district']}에 거주합니다. "
        f"최종 학력은 {edu}{field_part}이고, 직업은 {kg['occupation']}입니다."))

    # 청크 2: 결혼
    m = kg["marriage"]
    if m["status"] == "미혼":
        marriage_text = f"{name} 씨는 미혼입니다."
    else:
        marriage_text = f"{name} 씨는 {m['marriage_year']}년에 결혼했습니다."
        if m.get("spouse_death_year"):
            marriage_text += f" {m['spouse_death_year']}년 배우자와 사별했습니다."
        elif m.get("divorce_year"):
            marriage_text += f" {m['divorce_year']}년 이혼했습니다."
    chunks.append(("marriage", marriage_text))

    # 청크 3: 자녀
    if kg["children"]:
        cs = ", ".join(f"{c['name']}({c['age']}세 {c['sex']})" for c in kg["children"])
        chunks.append(("children", f"{name} 씨의 자녀는 {len(kg['children'])}명: {cs}."))
    else:
        chunks.append(("children", f"{name} 씨는 자녀가 없습니다."))

    # 청크 4: 건강
    cond = ", ".join(kg["health"]["conditions"]) or "없음"
    med = ", ".join(kg["health"]["medications"]) or "없음"
    chunks.append(("health",
        f"{name} 씨의 주요 질환은 {cond}이고, 복용 약물은 {med}입니다."))

    # 청크 5: 선호
    p = kg["preferences"]
    chunks.append(("preferences",
        f"{name} 씨가 즐겨먹는 음식은 {p['food']}, 취미는 {p['hobby']}, "
        f"좋아하는 문화는 {p['culture']}입니다."))

    # 청크 6-10: NVIDIA narrative texts (페르소나 텍스트)
    for key in ("persona", "family", "culinary", "hobbies", "cultural"):
        text = (kg.get("text") or {}).get(key)
        if text:
            chunks.append((f"text_{key}", text))

    return chunks


class VectorRAG:
    name = "VectorRAG"

    def __init__(
        self,
        persona_dir: str | Path,
        chroma_path: str | Path,
        embedding_model: str = "BAAI/bge-m3",
        top_k: int = 5,
        device: Optional[str] = None,
    ):
        self.persona_dir = Path(persona_dir)
        self.chroma_path = Path(chroma_path)
        self.embedding_model_name = embedding_model
        self.top_k = top_k
        self.device = device
        self._client = None
        self._collection = None
        self._embedder = None

    def _ensure_loaded(self):
        chromadb, _ = _lazy_imports()
        if self._client is None:
            self._client = chromadb.PersistentClient(path=str(self.chroma_path))
        if self._collection is None:
            self._collection = self._client.get_or_create_collection(
                name="personas", metadata={"hnsw:space": "cosine"})
        if self._embedder is None:
            _, ST = _lazy_imports()
            self._embedder = ST(self.embedding_model_name, device=self.device)

    def build(self):
        """30개 yaml → 약 300개 chunk → bge-m3 임베딩 → ChromaDB 저장."""
        self._ensure_loaded()
        # 기존 데이터 비우기 (재빌드 안전성)
        try:
            self._client.delete_collection("personas")
        except Exception:
            pass
        self._collection = self._client.create_collection(
            name="personas", metadata={"hnsw:space": "cosine"})

        ids, docs, metas = [], [], []
        for yaml_path in sorted(self.persona_dir.glob("P*.yaml")):
            kg = yaml.safe_load(open(yaml_path))
            for chunk_kind, text in kg_to_fact_chunks(kg):
                cid = f"{kg['id']}__{chunk_kind}"
                ids.append(cid)
                docs.append(text)
                metas.append({"persona_id": kg["id"], "chunk_kind": chunk_kind})

        embeddings = self._embedder.encode(docs, show_progress_bar=True,
                                            normalize_embeddings=True).tolist()
        self._collection.add(ids=ids, documents=docs, embeddings=embeddings, metadatas=metas)
        return len(ids)

    def retrieve(self, persona_id: str, question: str) -> RetrievalResult:
        self._ensure_loaded()
        q_emb = self._embedder.encode([question], normalize_embeddings=True).tolist()
        res = self._collection.query(
            query_embeddings=q_emb,
            n_results=self.top_k,
            where={"persona_id": persona_id},  # 같은 페르소나 청크에서만 검색
            include=["documents", "distances", "metadatas"],
        )
        docs = res["documents"][0]
        dists = res["distances"][0]
        metas = res["metadatas"][0]
        return RetrievalResult(
            contexts=docs,
            meta={
                "source": "chromadb-bge-m3",
                "persona_id": persona_id,
                "top_k": self.top_k,
                "distances": dists,
                "chunk_kinds": [m["chunk_kind"] for m in metas],
            },
        )
