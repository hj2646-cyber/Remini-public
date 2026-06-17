from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from typing import Any

import psycopg
from pgvector.psycopg import register_vector
from sentence_transformers import SentenceTransformer

from app.config import settings
from app.services.auradb_memory import AuraDBMemory
from app.services.avoidance_store import filter_texts_by_avoidance
from app.services.memory_store import MemoryStore


# STT 조각난 발화 감지/정규화에 쓰는 주저/간투 토큰
_HESITATION_RE = re.compile(r"(으+[어아]+|어+|음+|그+|저+)\b")
_FRAGMENT_MARKERS_RE = re.compile(r"[…\.]{2,}|\.\s+\.")


@dataclass
class RetrieveResult:
    texts: list[str]
    used: str
    # EchoRoute step-3 sticky-routing meta. None for non-auradb backends.
    anchor_name: str | None = None
    weights: tuple[float, float] | None = None
    topic_emb: tuple[float, ...] | None = None


class RetrievalService:
    def __init__(self) -> None:
        self.memory_store = MemoryStore()
        self.auradb_memory = AuraDBMemory()
        self._embedder: SentenceTransformer | None = None
        self._db_ready = False
        self._init_db()

    def _init_db(self) -> None:
        if not settings.database_url:
            self._db_ready = False
            return
        try:
            with psycopg.connect(settings.database_url) as conn:
                register_vector(conn)
                with conn.cursor() as cur:
                    cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
                conn.commit()
            self._db_ready = True
        except Exception:
            self._db_ready = False

    def _get_embedder(self) -> SentenceTransformer:
        if self._embedder is None:
            try:
                import torch
                device = "cuda" if torch.cuda.is_available() else "cpu"
            except Exception:
                device = "cpu"
            self._embedder = SentenceTransformer(
                settings.embedding_model,
                device=device,
            )
            if device == "cuda":
                # fp16 for H200 speedup; bge-m3 works fine at half precision.
                try:
                    self._embedder.half()
                except Exception:
                    pass
        return self._embedder

    def warmup_embedder(self) -> None:
        """Force-load the embedding model (used at server startup)."""
        try:
            emb = self._get_embedder()
            # Dummy encode to trigger CUDA kernel compilation.
            emb.encode("워밍업", normalize_embeddings=True)
        except Exception:
            pass

    def _embed(self, text: str) -> list[float]:
        emb = self._get_embedder()
        return emb.encode(text, normalize_embeddings=True).tolist()

    def embed_many(self, texts: list[str]) -> list[list[float]]:
        """Batch-encode texts and return L2-normalized embeddings.

        Used by AuraDBMemory to build per-graph prototype vectors.
        """
        if not texts:
            return []
        emb = self._get_embedder()
        vecs = emb.encode(
            texts,
            normalize_embeddings=True,
            convert_to_numpy=True,
            batch_size=32,
        )
        return vecs.tolist()

    def save_memory(
        self,
        session_id: str,
        user_id: str | None,
        content: str,
        emotion: str,
        crisis_flag: bool,
    ) -> None:
        row: dict[str, Any] = {
            "session_id": session_id,
            "user_id": user_id,
            "content": content,
            "emotion": emotion,
            "crisis_flag": crisis_flag,
            "created_at": datetime.utcnow().isoformat(),
        }
        self.memory_store.add(row)

        if not self._db_ready:
            return
        try:
            embedding = self._embed(content)
            with psycopg.connect(settings.database_url) as conn:
                register_vector(conn)
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO memory_vectors
                        (session_id, user_id, content, embedding, emotion, crisis_flag)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        """,
                        (session_id, user_id, content, embedding, emotion, crisis_flag),
                    )
                conn.commit()
        except Exception:
            pass

    def simple_retrieve(self, session_id: str, query: str, top_k: int, user_id: str | None = None) -> list[str]:
        items = self.memory_store.list_by_session(session_id, user_id=user_id)
        scored = []
        # 쿼리 토큰을 30개로 제한 (비대한 쿼리 → 느린 매칭 방지)
        q_tokens = set(query.lower().split()[:30])
        for i in items:
            text = i.get("content", "")
            t_tokens = set(text.lower().split())
            score = len(q_tokens.intersection(t_tokens))
            scored.append((score, text))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [s[1] for s in scored[:top_k] if s[1]]

    def vector_retrieve(self, session_id: str, query: str, top_k: int, user_id: str | None = None) -> list[str]:
        if not self._db_ready:
            raise RuntimeError("DB not ready")
        query_vec = self._embed(query)
        with psycopg.connect(settings.database_url) as conn:
            register_vector(conn)
            with conn.cursor() as cur:
                if user_id is None:
                    cur.execute(
                        """
                        SELECT content
                        FROM memory_vectors
                        WHERE session_id = %s
                        ORDER BY embedding <-> %s
                        LIMIT %s
                        """,
                        (session_id, query_vec, top_k),
                    )
                else:
                    cur.execute(
                        """
                        SELECT content
                        FROM memory_vectors
                        WHERE session_id = %s AND user_id = %s
                        ORDER BY embedding <-> %s
                        LIMIT %s
                        """,
                        (session_id, user_id, query_vec, top_k),
                    )
                rows = cur.fetchall()
        return [r[0] for r in rows]

    # ─────────────────────────────────────────────────────────
    # Phase 4 — 오류 허용 설계 (KG 재구성 힌트)
    # ─────────────────────────────────────────────────────────
    @staticmethod
    def looks_fragmented(text: str) -> bool:
        """STT 결과가 조음 장애/주저로 조각났는지 간단 판정.

        신호:
        - 말줄임표 또는 연속 마침표 (…, ..)
        - 주저/간투 토큰 (으어, 음, 그, 저)
        - 짧은 텍스트에 마침표가 여러 개 (단일 문장이 끊겨 들어옴)

        일반 짧은 문장("오늘 날씨 참 좋네요")은 조각으로 보지 않는다.
        """
        if not text:
            return False
        if _FRAGMENT_MARKERS_RE.search(text):
            return True
        if _HESITATION_RE.search(text):
            return True
        stripped = text.strip()
        if len(stripped) <= 25 and stripped.count(".") >= 2:
            return True
        return False

    def reconstruct_from_fragments(
        self,
        raw_text: str,
        user_id: str | None,
        min_match_score: int = 8,
    ) -> str | None:
        """조각난 환자 발화에서 KG 엔티티를 찾아 LLM에 줄 힌트를 생성.

        환자가 조음 장애로 "으어… 철… 철수가… 강아지 밥…" 하는 상황에서
        KG의 고유명사(가족 이름, 장소, 반려동물 등)와 매칭해
        "이 발화의 핵심 단서는 X" 라는 힌트를 만들어 준다.

        책 원칙에 따라 **교정은 금지** — 힌트는 LLM이 자연스럽게 맥락을
        확장할 수 있도록 재료만 제공한다.

        조각 신호가 없거나 매칭이 약하면 None.
        """
        if not raw_text or not self.looks_fragmented(raw_text):
            return None
        if not self.auradb_memory.available():
            return None

        # 주저 토큰/ellipsis 제거
        normalized = _HESITATION_RE.sub(" ", raw_text)
        normalized = re.sub(r"[…\.]+", " ", normalized)
        normalized = re.sub(r"\s+", " ", normalized).strip()
        if len(normalized) < 2:
            return None

        persona_id = self.auradb_memory._resolve_persona_id(user_id)
        if not persona_id:
            return None
        try:
            candidates = self.auradb_memory._load_entity_candidates(persona_id)
        except Exception:
            return None
        if not candidates:
            return None

        scored: list[tuple[int, Any]] = []
        for cand in candidates:
            score = self.auradb_memory._candidate_match_score(cand, normalized)
            if score >= min_match_score:
                scored.append((score, cand))
        if not scored:
            return None

        scored.sort(key=lambda t: -t[0])
        top = scored[:3]

        hint_parts: list[str] = []
        for _, cand in top:
            piece = cand.name
            role = (cand.role or "").strip()
            label = (cand.label or "").strip()
            tag = role or label
            if tag:
                piece = f"{cand.name}({tag})"
            hint_parts.append(piece)

        return (
            "[STT 조각 재구성 힌트]\n"
            f"환자 발화가 조각나 있습니다: \"{raw_text.strip()}\"\n"
            f"참고 기억에서 추정되는 핵심 단서: {', '.join(hint_parts)}.\n"
            "이 단서를 자연스럽게 활용해 이야기를 이어가세요. "
            "환자의 발음 오류를 지적하거나 교정하지 마세요."
        )

    def retrieve(
        self,
        session_id: str,
        query: str,
        top_k: int | None = None,
        user_id: str | None = None,
        recent_messages: list[dict[str, str]] | None = None,
        conversation_summary: str | None = None,
        sticky=None,
    ) -> RetrieveResult:
        k = top_k or settings.top_k
        if self.auradb_memory.available():
            auradb_result = self.auradb_memory.retrieve(
                query=query,
                user_id=user_id,
                top_k=k,
                recent_messages=recent_messages,
                conversation_summary=conversation_summary,
                embed_many=self.embed_many,
                sticky=sticky,
            )
            if auradb_result and auradb_result.get("texts"):
                # Phase 6: 보호자 피드백으로 등록된 회피 주제 제외
                filtered_texts = filter_texts_by_avoidance(
                    auradb_result["texts"], user_id
                )
                return RetrieveResult(
                    texts=filtered_texts,
                    used="auradb_retrieve",
                    anchor_name=auradb_result.get("anchor_name"),
                    weights=auradb_result.get("weights"),
                    topic_emb=auradb_result.get("topic_emb"),
                )
        try:
            texts = self.vector_retrieve(session_id, query, k, user_id=user_id)
            if texts:
                texts = filter_texts_by_avoidance(texts, user_id)
                return RetrieveResult(texts=texts, used="vector_retrieve")
        except Exception:
            pass
        texts = self.simple_retrieve(session_id, query, k, user_id=user_id)
        texts = filter_texts_by_avoidance(texts, user_id)
        return RetrieveResult(texts=texts, used="simple_retrieve")
