from __future__ import annotations

import logging
import math
import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Callable
from urllib.parse import urlparse

import certifi

from app.config import settings

logger = logging.getLogger(__name__)


# EchoRoute tuning knobs — embedding-energy soft routing.
# τ (softmax temperature) smaller = sharper routing; larger = more uniform.
# α (hint prior weight) 0 = pure embeddings, 1 = pure keyword heuristic.
_ECHOROUTE_TEMPERATURE = 0.15
_ECHOROUTE_HINT_ALPHA = 0.35
# Max texts sampled per graph partition when building a persona prototype.
_ECHOROUTE_PROTOTYPE_MAX_NODES = 60
# Step 3 — sticky routing.
# Inertia on last turn's weights; higher = smoother but slower to adapt.
_ECHOROUTE_WEIGHT_INERTIA = 0.40
# Topic EMA decay for the rolling dialogue-theme embedding.
_ECHOROUTE_TOPIC_BETA = 0.70
# Below this cosine similarity to the rolling topic embedding the
# conversation is considered to have shifted, and sticky anchor + last
# weights are discarded.
_ECHOROUTE_TOPIC_SHIFT_COS = 0.50


_ROUTINE_HINTS = {
    "지금", "오늘", "약", "투약", "약 먹", "밥", "식사", "점심", "저녁", "아침",
    "산책", "병원", "화장실", "잠", "자", "취침", "시간", "일정", "루틴",
}
_MEMORY_HINTS = {
    "예전", "옛날", "기억", "추억", "고향", "어릴", "남편", "아내", "딸", "아들",
    "가족", "여행", "결혼", "학교", "친구", "어머니", "아버지",
}
_EMOTION_HINTS = {
    "보고 싶", "그립", "무서", "불안", "슬퍼", "속상", "화나", "외롭", "걱정",
}
_PRONOUN_HINTS = {"그분", "그 사람", "그이", "그때", "거기", "거기서", "그 일", "그곳"}
_ROUTINE_PRIORITY_HINTS = {"약", "투약", "복용", "식사", "밥", "산책", "잠", "취침", "루틴", "시간"}

_MODE_GRAPH_POLICY = {
    "routine_support": {"daily_care": 0.7, "life_memory": 0.3},
    "memory_support": {"daily_care": 0.2, "life_memory": 0.8},
    "emotion_grounding": {"daily_care": 0.35, "life_memory": 0.65},
    "bridge_mode": {"daily_care": 0.5, "life_memory": 0.5},
}


def _dot(a: list[float], b: list[float]) -> float:
    n = min(len(a), len(b))
    return math.fsum(a[i] * b[i] for i in range(n))


def _average_normalize(vectors: list[list[float]]) -> list[float] | None:
    if not vectors:
        return None
    dim = len(vectors[0])
    if dim == 0:
        return None
    n = len(vectors)
    avg = [math.fsum(v[i] for v in vectors) / n for i in range(dim)]
    norm = math.sqrt(math.fsum(x * x for x in avg))
    if norm <= 0.0:
        return None
    return [x / norm for x in avg]


def _normalize_pair(w_d: float, w_l: float) -> tuple[float, float]:
    s = w_d + w_l
    if s <= 0.0:
        return 0.5, 0.5
    return w_d / s, w_l / s


def _normalize_neo4j_uri(raw_uri: str) -> str:
    parsed = urlparse(raw_uri)
    if not parsed.scheme or not parsed.hostname:
        raise ValueError("NEO4J_URI format is invalid.")
    host = parsed.hostname
    port = parsed.port
    scheme = "neo4j" if host.endswith(".databases.neo4j.io") else parsed.scheme.split("+")[0]
    return f"{scheme}://{host}" + (f":{port}" if port else "")


def _build_driver_config(host: str) -> dict:
    if host.endswith(".databases.neo4j.io"):
        from neo4j import TrustCustomCAs

        return {
            "encrypted": True,
            "trusted_certificates": TrustCustomCAs(certifi.where()),
        }
    return {}


@dataclass
class EntityCandidate:
    node_id: str
    name: str
    label: str
    graph_type: str
    alias: str
    role: str


class AuraDBMemory:
    def __init__(self) -> None:
        self._enabled = bool(settings.auradb_enabled)
        self._entity_cache: dict[str, list[EntityCandidate]] = {}
        # EchoRoute: persona_id -> {"daily_care": np-list, "life_memory": np-list}
        self._prototype_cache: dict[str, dict[str, list[float]]] = {}

    def available(self) -> bool:
        if not self._enabled:
            return False
        if not settings.neo4j_uri or not settings.neo4j_username or not settings.neo4j_password:
            return False
        try:
            self._driver()
        except Exception:
            return False
        return True

    @lru_cache(maxsize=1)
    def _driver(self):
        from neo4j import GraphDatabase

        uri = _normalize_neo4j_uri(settings.neo4j_uri or "")
        host = urlparse(uri).hostname or ""
        driver = GraphDatabase.driver(
            uri,
            auth=(settings.neo4j_username or "", settings.neo4j_password or ""),
            **_build_driver_config(host),
        )
        driver.verify_connectivity()
        return driver

    def _resolve_persona_id(self, user_id: str | None) -> str | None:
        return (user_id or "").strip() or None

    def _tokenize(self, text: str) -> list[str]:
        raw_tokens = [token for token in re.split(r"[^\w가-힣]+", (text or "").lower()) if token]
        seen: list[str] = []
        for token in raw_tokens:
            if len(token) < 2:
                continue
            if token not in seen:
                seen.append(token)
        return seen[:12]

    def _classify_mode(self, query: str, recent_messages: list[dict[str, str]] | None = None) -> str:
        text = " ".join(
            [query, *(message.get("content", "") for message in (recent_messages or [])[-4:])]
        ).lower()
        routine_score = sum(1 for hint in _ROUTINE_HINTS if hint in text)
        memory_score = sum(1 for hint in _MEMORY_HINTS if hint in text)
        emotion_score = sum(1 for hint in _EMOTION_HINTS if hint in text)

        if emotion_score and memory_score:
            return "emotion_grounding"
        if routine_score and memory_score:
            return "bridge_mode"
        if routine_score > memory_score:
            return "routine_support"
        if memory_score > routine_score:
            return "memory_support"
        if emotion_score:
            return "emotion_grounding"
        return "bridge_mode"

    def _load_entity_candidates(self, persona_id: str) -> list[EntityCandidate]:
        if persona_id in self._entity_cache:
            return self._entity_cache[persona_id]

        cypher = """
        MATCH (p:Persona {persona_id: $persona_id})-[*0..2]-(n)
        WHERE coalesce(n.name, '') <> ''
        RETURN DISTINCT
            elementId(n) AS node_id,
            coalesce(n.name, '') AS name,
            head(labels(n)) AS label,
            coalesce(n.graph_type, '') AS graph_type,
            coalesce(n.alias, '') AS alias,
            coalesce(n.role, '') AS role
        """
        driver = self._driver()
        with driver.session(database=settings.neo4j_database) as session:
            records = session.run(cypher, persona_id=persona_id)
            rows = [
                EntityCandidate(
                    node_id=record["node_id"],
                    name=record["name"],
                    label=record["label"],
                    graph_type=record["graph_type"],
                    alias=record["alias"],
                    role=record["role"],
                )
                for record in records
                if record["name"]
            ]
        self._entity_cache[persona_id] = rows
        return rows

    def _candidate_match_score(self, candidate: EntityCandidate, text: str) -> int:
        score = 0
        lowered = text.lower()
        name = candidate.name.lower()
        if name and name in lowered:
            score += 8
        aliases = [alias.strip().lower() for alias in candidate.alias.split("|") if alias.strip()]
        for alias in aliases:
            if alias and alias in lowered:
                score += 5
        if candidate.role and candidate.role.lower() in lowered:
            score += 3
        # [시연판 patch] token-level 부분 매칭 — 환자가 조각 발화 ("결혼" 만 말함) 에도
        # 후보 이름 ("결혼할 때 산 금테 안경") 매칭 가능하게.
        # 본 시스템 한정 X — 시연판 retrieval 강화 (1·2단계 영상 메시지 정확).
        text_tokens = [t for t in lowered.split() if len(t) >= 2]
        name_tokens = [t for t in name.split() if len(t) >= 2]
        for t_tok in text_tokens:
            for n_tok in name_tokens:
                if t_tok in n_tok or n_tok in t_tok:
                    score += 8
                    break  # 한 텍스트 토큰당 한 후보당 1회만 가산
        return score

    def infer_photo_relations(
        self,
        user_id: str | None,
        title: str,
        note: str | None = None,
        max_links: int = 4,
    ) -> list[dict[str, str]]:
        persona_id = self._resolve_persona_id(user_id)
        if not persona_id:
            return []

        text = " ".join(part for part in [title, note or ""] if part).strip()
        if not text:
            return []

        scored: list[tuple[int, EntityCandidate]] = []
        for candidate in self._load_entity_candidates(persona_id):
            score = self._candidate_match_score(candidate, text)
            if score <= 0:
                continue
            scored.append((score, candidate))

        scored.sort(key=lambda item: item[0], reverse=True)
        linked: list[dict[str, str]] = []
        seen_ids: set[str] = set()
        for score, candidate in scored:
            if candidate.node_id in seen_ids:
                continue
            seen_ids.add(candidate.node_id)
            linked.append(
                {
                    "node_id": candidate.node_id,
                    "name": candidate.name,
                    "label": candidate.label,
                    "role": candidate.role,
                    "graph_type": candidate.graph_type,
                    "summary": f"{candidate.label}: {candidate.name}",
                    "score": str(score),
                }
            )
            if len(linked) >= max_links:
                break
        return linked

    def upsert_photo_relations(
        self,
        user_id: str | None,
        photo_id: str,
        title: str,
        note: str | None,
        filename: str,
        linked_entities: list[dict[str, str]],
        created_at: str,
        updated_at: str,
    ) -> None:
        persona_id = self._resolve_persona_id(user_id)
        if not persona_id:
            return

        driver = self._driver()
        with driver.session(database=settings.neo4j_database) as session:
            session.run(
                """
                MATCH (p:Persona {persona_id: $persona_id})
                MERGE (photo:MemoryPhoto {photo_id: $photo_id})
                SET photo.title = $title,
                    photo.note = $note,
                    photo.filename = $filename,
                    photo.updated_at = $updated_at,
                    photo.graph_type = 'memory_photo'
                SET photo.created_at = coalesce(photo.created_at, $created_at)
                MERGE (p)-[:HAS_MEMORY_PHOTO]->(photo)
                """,
                persona_id=persona_id,
                photo_id=photo_id,
                title=title,
                note=note or "",
                filename=filename,
                created_at=created_at,
                updated_at=updated_at,
            )
            session.run(
                """
                MATCH (:Persona {persona_id: $persona_id})-[:HAS_MEMORY_PHOTO]->(photo:MemoryPhoto {photo_id: $photo_id})
                OPTIONAL MATCH (photo)-[rel:RELATED_TO]->()
                DELETE rel
                """,
                persona_id=persona_id,
                photo_id=photo_id,
            )
            if linked_entities:
                session.run(
                    """
                    MATCH (:Persona {persona_id: $persona_id})-[:HAS_MEMORY_PHOTO]->(photo:MemoryPhoto {photo_id: $photo_id})
                    UNWIND $node_ids AS node_id
                    MATCH (n)
                    WHERE elementId(n) = node_id
                    MERGE (photo)-[:RELATED_TO]->(n)
                    """,
                    persona_id=persona_id,
                    photo_id=photo_id,
                    node_ids=[entity["node_id"] for entity in linked_entities if entity.get("node_id")],
                )

    def delete_photo_relations(self, user_id: str | None, photo_id: str) -> None:
        persona_id = self._resolve_persona_id(user_id)
        if not persona_id:
            return
        driver = self._driver()
        with driver.session(database=settings.neo4j_database) as session:
            session.run(
                """
                MATCH (:Persona {persona_id: $persona_id})-[:HAS_MEMORY_PHOTO]->(photo:MemoryPhoto {photo_id: $photo_id})
                DETACH DELETE photo
                """,
                persona_id=persona_id,
                photo_id=photo_id,
            )

    def retrieve_related_photos(
        self,
        query: str,
        user_id: str | None = None,
        top_k: int = 3,
        recent_messages: list[dict[str, str]] | None = None,
        conversation_summary: str | None = None,
    ) -> list[dict[str, str | int | list[dict[str, str]]]]:
        persona_id = self._resolve_persona_id(user_id)
        if not persona_id:
            return []

        combined_query = " ".join(
            part for part in [conversation_summary or "", *(m.get("content", "") for m in (recent_messages or [])[-4:]), query] if part
        ).strip()
        tokens = self._tokenize(combined_query)
        anchor = self._resolve_anchor(persona_id, query, recent_messages=recent_messages)

        cypher = """
        MATCH (:Persona {persona_id: $persona_id})-[:HAS_MEMORY_PHOTO]->(photo:MemoryPhoto)
        OPTIONAL MATCH (photo)-[:RELATED_TO]->(n)
        WITH photo,
             collect(DISTINCT {
                name: coalesce(n.name, ''),
                label: head(labels(n)),
                role: coalesce(n.role, '')
             }) AS related
        WITH photo, related,
             reduce(
                score = 0,
                token IN $tokens |
                score +
                CASE WHEN toLower(coalesce(photo.title, '')) CONTAINS token THEN 4 ELSE 0 END +
                CASE WHEN toLower(coalesce(photo.note, '')) CONTAINS token THEN 2 ELSE 0 END +
                reduce(
                    inner = 0,
                    rel IN related |
                    inner +
                    CASE WHEN toLower(coalesce(rel.name, '')) CONTAINS token THEN 6 ELSE 0 END +
                    CASE WHEN toLower(coalesce(rel.role, '')) CONTAINS token THEN 2 ELSE 0 END
                )
             ) AS lexical_score
        RETURN
            photo.photo_id AS photo_id,
            coalesce(photo.title, '') AS title,
            coalesce(photo.note, '') AS note,
            coalesce(photo.filename, '') AS filename,
            coalesce(photo.updated_at, '') AS updated_at,
            related,
            lexical_score
        ORDER BY lexical_score DESC, updated_at DESC
        LIMIT $top_k
        """

        driver = self._driver()
        with driver.session(database=settings.neo4j_database) as session:
            records = session.run(
                cypher,
                persona_id=persona_id,
                tokens=tokens,
                top_k=max(top_k, 1),
            )
            results: list[dict[str, str | int | list[dict[str, str]]]] = []
            for record in records:
                score = int(record["lexical_score"])
                related = record["related"] or []
                if anchor:
                    if any((item or {}).get("name") == anchor.name for item in related):
                        score += 8
                if score <= 0 and anchor is None:
                    continue
                results.append(
                    {
                        "photo_id": record["photo_id"],
                        "title": record["title"],
                        "note": record["note"],
                        "filename": record["filename"],
                        "updated_at": record["updated_at"],
                        "score": score,
                        "linked_entities": [
                            f"{item.get('label')}: {item.get('name')}"
                            for item in related
                            if (item or {}).get("name")
                        ],
                    }
                )
        results.sort(key=lambda item: int(item["score"]), reverse=True)
        return results[:top_k]

    def _resolve_anchor(
        self,
        persona_id: str,
        query: str,
        recent_messages: list[dict[str, str]] | None = None,
    ) -> EntityCandidate | None:
        candidates = self._load_entity_candidates(persona_id)
        if not candidates:
            return None

        best_direct: tuple[int, EntityCandidate] | None = None
        for candidate in candidates:
            score = self._candidate_match_score(candidate, query)
            if score <= 0:
                continue
            if best_direct is None or score > best_direct[0]:
                best_direct = (score, candidate)
        if best_direct is not None:
            return best_direct[1]

        lowered_query = query.lower()
        if not any(hint.lower() in lowered_query for hint in _PRONOUN_HINTS):
            return None

        for message in reversed((recent_messages or [])[-8:]):
            content = message.get("content", "")
            best_recent: tuple[int, EntityCandidate] | None = None
            for candidate in candidates:
                score = self._candidate_match_score(candidate, content)
                if score <= 0:
                    continue
                if best_recent is None or score > best_recent[0]:
                    best_recent = (score, candidate)
            if best_recent is not None:
                return best_recent[1]
        return None

    # ─────────────────────────────────────────────────────────
    # EchoRoute: embedding-energy soft routing
    # ─────────────────────────────────────────────────────────
    def _fetch_graph_texts(self, persona_id: str, graph_type: str) -> list[str]:
        """Sample up to N search_text strings from a persona's graph partition.

        Used to build a single averaged 'prototype' embedding per graph.
        """
        cypher = """
        MATCH (p:Persona {persona_id: $persona_id})-[*1..2]-(n)
        WHERE coalesce(n.graph_type, '') = $graph_type
          AND coalesce(n.search_text, '') <> ''
        RETURN DISTINCT coalesce(n.search_text, '') AS t
        LIMIT $limit
        """
        driver = self._driver()
        with driver.session(database=settings.neo4j_database) as session:
            records = session.run(
                cypher,
                persona_id=persona_id,
                graph_type=graph_type,
                limit=_ECHOROUTE_PROTOTYPE_MAX_NODES,
            )
            return [record["t"] for record in records if record["t"]]

    def _load_prototypes(
        self,
        persona_id: str,
        embed_many: Callable[[list[str]], list[list[float]]] | None,
    ) -> dict[str, list[float]] | None:
        """Return cached {'daily_care': vec, 'life_memory': vec} prototypes.

        Each vec is the L2-renormalized average of per-node embeddings from
        that graph partition. Returns None if embeddings are unavailable or
        both partitions are empty.
        """
        if embed_many is None:
            return None
        cached = self._prototype_cache.get(persona_id)
        if cached is not None:
            return cached

        prototypes: dict[str, list[float]] = {}
        for graph_type in ("daily_care", "life_memory"):
            try:
                texts = self._fetch_graph_texts(persona_id, graph_type)
            except Exception:
                texts = []
            if not texts:
                continue
            try:
                vectors = embed_many(texts)
            except Exception:
                vectors = []
            proto = _average_normalize(vectors)
            if proto is not None:
                prototypes[graph_type] = proto

        if not prototypes:
            return None
        self._prototype_cache[persona_id] = prototypes
        return prototypes

    def _hint_prior(self, mode: str) -> tuple[float, float]:
        """Return (w_daily, w_life) prior from the legacy keyword classifier."""
        policy = _MODE_GRAPH_POLICY.get(mode, _MODE_GRAPH_POLICY["bridge_mode"])
        return float(policy["daily_care"]), float(policy["life_memory"])

    def _compute_graph_weights(
        self,
        query: str,
        persona_id: str,
        mode: str,
        embed_many: Callable[[list[str]], list[list[float]]] | None,
    ) -> tuple[float, float]:
        """EchoRoute soft routing.

        Returns normalized (w_daily, w_life) by blending two signals:
          1. Embedding energy: softmax(cos(query, prototype) / τ)
          2. Hint prior: legacy keyword-based mode table

        Final = (1-α)·embedding + α·hint_prior.

        Falls back to the pure hint prior if embeddings are unavailable.
        """
        hint_w = self._hint_prior(mode)

        if embed_many is None:
            return _normalize_pair(*hint_w)

        prototypes = self._load_prototypes(persona_id, embed_many)
        if not prototypes:
            return _normalize_pair(*hint_w)

        try:
            q_vec = embed_many([query])
        except Exception:
            q_vec = []
        if not q_vec or not q_vec[0]:
            return _normalize_pair(*hint_w)

        q = q_vec[0]
        proto_d = prototypes.get("daily_care")
        proto_l = prototypes.get("life_memory")

        # Cosine similarity (vectors already L2-normalized).
        sim_d = _dot(q, proto_d) if proto_d is not None else None
        sim_l = _dot(q, proto_l) if proto_l is not None else None

        if sim_d is None and sim_l is None:
            return _normalize_pair(*hint_w)
        if sim_d is None:
            return _normalize_pair(0.0, 1.0)
        if sim_l is None:
            return _normalize_pair(1.0, 0.0)

        # Softmax with temperature.
        tau = max(_ECHOROUTE_TEMPERATURE, 1e-3)
        m = max(sim_d, sim_l)
        e_d = math.exp((sim_d - m) / tau)
        e_l = math.exp((sim_l - m) / tau)
        denom = e_d + e_l
        emb_d = e_d / denom
        emb_l = e_l / denom

        alpha = _ECHOROUTE_HINT_ALPHA
        w_d = (1.0 - alpha) * emb_d + alpha * hint_w[0]
        w_l = (1.0 - alpha) * emb_l + alpha * hint_w[1]
        return _normalize_pair(w_d, w_l)

    def _split_graph_budget(self, weights: tuple[float, float], top_k: int) -> dict[str, int]:
        w_d, w_l = weights
        daily_count = max(1, round(top_k * w_d))
        life_count = max(1, top_k - daily_count)
        if daily_count + life_count < top_k:
            life_count += top_k - (daily_count + life_count)
        return {"daily_care": daily_count, "life_memory": life_count}

    def _graph_bonus(self, weights: tuple[float, float], graph_type: str) -> int:
        w_d, w_l = weights
        weight = w_l if graph_type == "life_memory" else w_d
        return int(weight * 10)

    def _record_bonus(self, record: dict, mode: str, query: str) -> int:
        text = " ".join(
            part for part in [record["name"], record["description"], record["value"], record["category"]] if part
        ).lower()
        bonus = 0
        if mode == "routine_support":
            if any(hint in query.lower() for hint in _ROUTINE_PRIORITY_HINTS):
                if any(hint in text for hint in _ROUTINE_PRIORITY_HINTS):
                    bonus += 6
            if record["label"] in {"Routine", "Time", "Activity"}:
                bonus += 4
            if "그래프" in record["name"]:
                bonus -= 8
        elif mode == "memory_support":
            if record["label"] in {"Person", "Event", "Place"}:
                bonus += 4
        elif mode == "emotion_grounding":
            if record["label"] in {"Person", "Event", "Emotion"}:
                bonus += 4
        return bonus

    def _retrieve_from_graph(
        self,
        persona_id: str,
        query: str,
        graph_type: str,
        top_k: int,
        mode: str,
        weights: tuple[float, float],
        anchor: EntityCandidate | None,
    ) -> list[dict]:
        tokens = self._tokenize(query)
        if not tokens:
            return []

        cypher = """
        MATCH (p:Persona {persona_id: $persona_id})
        MATCH (p)-[*0..2]-(n)
        WHERE coalesce(n.graph_type, '') CONTAINS $graph_type
          AND (
            any(token IN $tokens WHERE
                toLower(coalesce(n.search_text, "")) CONTAINS token OR
                toLower(coalesce(n.name, "")) CONTAINS token OR
                toLower(coalesce(n.description, "")) CONTAINS token OR
                toLower(coalesce(n.value, "")) CONTAINS token OR
                toLower(coalesce(n.source_question, "")) CONTAINS token
            )
            OR ($anchor_name <> '' AND (
                toLower(coalesce(n.name, '')) CONTAINS toLower($anchor_name) OR
                toLower(coalesce(n.search_text, '')) CONTAINS toLower($anchor_name)
            ))
          )
        OPTIONAL MATCH path=(n)-[*1..2]-(m)
        WHERE $anchor_name = '' OR any(x IN nodes(path) WHERE toLower(coalesce(x.name, '')) = toLower($anchor_name))
        WITH DISTINCT n,
             collect(DISTINCT {
                label: head(labels(m)),
                name: coalesce(m.name, ''),
                graph_type: coalesce(m.graph_type, ''),
                category: coalesce(m.category, '')
             })[0..5] AS neighbors,
             reduce(
                score = 0,
                token IN $tokens |
                score +
                CASE WHEN toLower(coalesce(n.search_text, "")) CONTAINS token THEN 3 ELSE 0 END +
                CASE WHEN toLower(coalesce(n.name, "")) CONTAINS token THEN 3 ELSE 0 END +
                CASE WHEN toLower(coalesce(n.description, "")) CONTAINS token THEN 2 ELSE 0 END +
                CASE WHEN toLower(coalesce(n.value, "")) CONTAINS token THEN 2 ELSE 0 END +
                CASE WHEN toLower(coalesce(n.source_question, "")) CONTAINS token THEN 1 ELSE 0 END
             ) AS lexical_score
        RETURN
            head(labels(n)) AS label,
            coalesce(n.name, "") AS name,
            coalesce(n.description, "") AS description,
            coalesce(n.value, "") AS value,
            coalesce(n.category, "") AS category,
            coalesce(n.graph_type, "") AS graph_type,
            lexical_score,
            neighbors
        ORDER BY lexical_score DESC, name ASC
        LIMIT $top_k
        """

        driver = self._driver()
        with driver.session(database=settings.neo4j_database) as session:
            records = session.run(
                cypher,
                persona_id=persona_id,
                graph_type=graph_type,
                tokens=tokens,
                top_k=top_k,
                anchor_name=anchor.name if anchor else "",
            )
            results: list[dict] = []
            for record in records:
                score = int(record["lexical_score"]) + self._graph_bonus(weights, graph_type)
                score += self._record_bonus(
                    {
                        "label": record["label"],
                        "name": record["name"],
                        "description": record["description"],
                        "value": record["value"],
                        "category": record["category"],
                    },
                    mode,
                    query,
                )
                if anchor and record["name"] == anchor.name:
                    score += 8
                if anchor:
                    for neighbor in record["neighbors"]:
                        if (neighbor or {}).get("name") == anchor.name:
                            score += 6
                            break
                results.append(
                    {
                        "label": record["label"],
                        "name": record["name"],
                        "description": record["description"],
                        "value": record["value"],
                        "category": record["category"],
                        "graph_type": record["graph_type"],
                        "neighbors": record["neighbors"],
                        "score": score,
                    }
                )
        results = [
            item
            for item in results
            if item["score"] > 0 and "그래프" not in item["name"]
        ]
        results.sort(key=lambda item: item["score"], reverse=True)
        return results[:top_k]

    def _format_evidence(self, graph_type: str, records: list[dict], anchor: EntityCandidate | None) -> list[str]:
        if not records:
            return []

        section_title = "Current care facts" if graph_type == "daily_care" else "Personal memory cues"
        lines: list[str] = []
        for record in records[:3]:
            parts = [f"{record['label']}: {record['name']}"]
            if record["description"]:
                parts.append(record["description"])
            elif record["value"]:
                parts.append(record["value"])
            elif record["category"]:
                parts.append(f"category={record['category']}")

            related = []
            for neighbor in record["neighbors"]:
                neighbor_name = (neighbor or {}).get("name", "")
                neighbor_label = (neighbor or {}).get("label", "")
                if not neighbor_name or neighbor_name == record["name"]:
                    continue
                related.append(f"{neighbor_label}: {neighbor_name}")
            if related:
                parts.append("related=" + ", ".join(related[:3]))

            lines.append(" | ".join(parts))

        if anchor and graph_type == "life_memory":
            lines.insert(0, f"Active anchor | {anchor.label}: {anchor.name}")

        return [f"{section_title} | {line}" for line in lines]

    def _find_anchor_by_name(
        self, persona_id: str, name: str
    ) -> EntityCandidate | None:
        if not name:
            return None
        lowered = name.strip().lower()
        for candidate in self._load_entity_candidates(persona_id):
            if candidate.name.strip().lower() == lowered:
                return candidate
        return None

    def _update_topic_emb(
        self,
        prev: tuple[float, ...] | None,
        query_emb: list[float] | None,
    ) -> tuple[float, ...] | None:
        if query_emb is None:
            return prev
        if prev is None:
            return tuple(query_emb)
        beta = _ECHOROUTE_TOPIC_BETA
        mixed = [beta * p + (1.0 - beta) * q for p, q in zip(prev, query_emb)]
        norm = math.sqrt(math.fsum(x * x for x in mixed))
        if norm <= 0.0:
            return tuple(query_emb)
        return tuple(x / norm for x in mixed)

    def retrieve(
        self,
        query: str,
        user_id: str | None = None,
        top_k: int = 5,
        recent_messages: list[dict[str, str]] | None = None,
        conversation_summary: str | None = None,
        embed_many: Callable[[list[str]], list[list[float]]] | None = None,
        sticky=None,
    ) -> dict:
        """Return dict with keys ``texts`` (list[str]) and EchoRoute meta.

        Meta keys: ``anchor_name`` (str | None), ``weights`` (tuple of two
        floats), ``topic_emb`` (tuple[float, ...] | None). The caller is
        free to ignore the meta and just read ``texts``.
        """
        persona_id = self._resolve_persona_id(user_id)
        if not persona_id:
            return {"texts": [], "anchor_name": None, "weights": None, "topic_emb": None}

        mode = self._classify_mode(query, recent_messages=recent_messages)
        combined_query = " ".join(
            part for part in [conversation_summary or "", *(m.get("content", "") for m in (recent_messages or [])[-4:]), query] if part
        ).strip()

        # Query embedding (used for both routing and topic-shift detection).
        q_emb: list[float] | None = None
        if embed_many is not None:
            try:
                vecs = embed_many([combined_query or query])
                if vecs and vecs[0]:
                    q_emb = vecs[0]
            except Exception:
                q_emb = None

        # Sticky state snapshot from previous turn.
        prev_topic = getattr(sticky, "topic_emb", None) if sticky is not None else None
        prev_anchor_name = (
            getattr(sticky, "sticky_anchor_name", None) if sticky is not None else None
        )
        prev_weights = (
            getattr(sticky, "last_weights", None) if sticky is not None else None
        )

        # EchoRoute raw weights from query embedding + hint prior.
        raw_weights = self._compute_graph_weights(
            query=combined_query or query,
            persona_id=persona_id,
            mode=mode,
            embed_many=embed_many,
        )

        # Topic-shift detection.
        # Primary signal: dominant graph flipped vs the previous turn
        # (argmax of w_d vs w_l). This is discrete and robust — we
        # intentionally avoid cosine-threshold tricks on the rolling
        # topic embedding because bge-m3 Korean similarities cluster
        # in a narrow band (~0.5-0.65) that makes a fixed threshold
        # fragile.
        # Secondary safety: if cosine to the rolling topic embedding
        # collapses below _ECHOROUTE_TOPIC_SHIFT_COS we shift anyway.
        topic_shift = True
        if prev_weights is not None:
            prev_dom = "d" if prev_weights[0] >= prev_weights[1] else "l"
            curr_dom = "d" if raw_weights[0] >= raw_weights[1] else "l"
            topic_shift = prev_dom != curr_dom
            if (
                not topic_shift
                and q_emb is not None
                and prev_topic is not None
            ):
                try:
                    if _dot(q_emb, list(prev_topic)) < _ECHOROUTE_TOPIC_SHIFT_COS:
                        topic_shift = True
                except Exception:
                    pass

        # Anchor resolution: freshly match current query; if nothing and
        # the dialogue hasn't shifted, fall back to the sticky anchor.
        anchor = self._resolve_anchor(
            persona_id, query, recent_messages=recent_messages
        )
        if anchor is None and not topic_shift and prev_anchor_name:
            anchor = self._find_anchor_by_name(persona_id, prev_anchor_name)

        # Inertia: blend with the previous turn's weights unless we shifted.
        if not topic_shift and prev_weights is not None:
            inertia = _ECHOROUTE_WEIGHT_INERTIA
            w_d = (1.0 - inertia) * raw_weights[0] + inertia * prev_weights[0]
            w_l = (1.0 - inertia) * raw_weights[1] + inertia * prev_weights[1]
            weights = _normalize_pair(w_d, w_l)
        else:
            weights = raw_weights

        logger.info(
            "[EchoRoute] raw=(%.3f,%.3f) prev=%s shift=%s final=(%.3f,%.3f)",
            raw_weights[0], raw_weights[1],
            None if prev_weights is None else f"({prev_weights[0]:.2f},{prev_weights[1]:.2f})",
            topic_shift,
            weights[0], weights[1],
        )

        graph_budget = self._split_graph_budget(weights, top_k=max(top_k, 4))
        daily_records = self._retrieve_from_graph(
            persona_id=persona_id,
            query=combined_query,
            graph_type="daily_care",
            top_k=graph_budget["daily_care"],
            mode=mode,
            weights=weights,
            anchor=anchor,
        )
        life_records = self._retrieve_from_graph(
            persona_id=persona_id,
            query=combined_query,
            graph_type="life_memory",
            top_k=graph_budget["life_memory"],
            mode=mode,
            weights=weights,
            anchor=anchor,
        )

        # Order evidence by whichever graph ended up dominating routing.
        evidence: list[str] = []
        if weights[0] >= weights[1]:
            evidence.extend(self._format_evidence("daily_care", daily_records, anchor))
            evidence.extend(self._format_evidence("life_memory", life_records, anchor))
        else:
            evidence.extend(self._format_evidence("life_memory", life_records, anchor))
            evidence.extend(self._format_evidence("daily_care", daily_records, anchor))

        if mode == "emotion_grounding" and anchor is not None:
            evidence.append(f"Safe emotional support cues | 현재 대화의 중심 인물은 {anchor.name}입니다.")

        new_topic_emb = self._update_topic_emb(
            None if topic_shift else prev_topic,
            q_emb,
        )

        return {
            "texts": evidence[: top_k + 2],
            "anchor_name": anchor.name if anchor is not None else None,
            "weights": weights,
            "topic_emb": new_topic_emb,
        }
