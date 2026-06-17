from __future__ import annotations

import re
from dataclasses import dataclass
from urllib.parse import urlparse

import certifi

from app.config import settings


_NAME_CLEANUP_PATTERNS = [
    r"^(저는|전|나는|제가|제 이름은|이름은)\s*",
    r"\s*(입니다|이에요|예요|라고 합니다|라고 해요|입니다요|야|요)\s*$",
]


@dataclass
class PersonaIdentity:
    persona_id: str
    name: str


class SessionIdentityStore:
    def __init__(self) -> None:
        self._session_to_persona: dict[str, PersonaIdentity] = {}

    def get(self, session_id: str) -> PersonaIdentity | None:
        return self._session_to_persona.get(session_id)

    def set(self, session_id: str, persona: PersonaIdentity) -> None:
        self._session_to_persona[session_id] = persona


class PersonaDirectory:
    def __init__(self) -> None:
        self._cache: list[PersonaIdentity] | None = None

    def _normalize_neo4j_uri(self, raw_uri: str) -> str:
        parsed = urlparse(raw_uri)
        if not parsed.scheme or not parsed.hostname:
            raise ValueError("NEO4J_URI format is invalid.")
        host = parsed.hostname
        port = parsed.port
        scheme = "neo4j" if host.endswith(".databases.neo4j.io") else parsed.scheme.split("+")[0]
        return f"{scheme}://{host}" + (f":{port}" if port else "")

    def _build_driver_config(self, host: str) -> dict:
        if host.endswith(".databases.neo4j.io"):
            from neo4j import TrustCustomCAs

            return {
                "encrypted": True,
                "trusted_certificates": TrustCustomCAs(certifi.where()),
            }
        return {}

    def _normalize_name(self, raw_name: str) -> str:
        text = (raw_name or "").strip()
        for pattern in _NAME_CLEANUP_PATTERNS:
            text = re.sub(pattern, "", text)
        text = re.sub(r"\s+", "", text)
        return text

    def _load_from_auradb(self) -> list[PersonaIdentity]:
        if not settings.auradb_enabled:
            return []
        if not settings.neo4j_uri or not settings.neo4j_username or not settings.neo4j_password:
            return []

        from neo4j import GraphDatabase

        uri = self._normalize_neo4j_uri(settings.neo4j_uri)
        host = urlparse(uri).hostname or ""
        driver = GraphDatabase.driver(
            uri,
            auth=(settings.neo4j_username, settings.neo4j_password),
            **self._build_driver_config(host),
        )
        try:
            with driver.session(database=settings.neo4j_database) as session:
                records = session.run(
                    """
                    MATCH (p:Persona)
                    WHERE coalesce(p.persona_id, '') <> '' AND coalesce(p.name, '') <> ''
                    RETURN DISTINCT p.persona_id AS persona_id, p.name AS name
                    ORDER BY p.persona_id
                    """
                )
                return [
                    PersonaIdentity(persona_id=str(record["persona_id"]).strip(), name=str(record["name"]).strip())
                    for record in records
                    if record["persona_id"] and record["name"]
                ]
        finally:
            driver.close()

    def all(self) -> list[PersonaIdentity]:
        # 빈 리스트는 캐시하지 않는다. 첫 호출이 Neo4j 연결 실패로 [] 를
        # 반환했을 때 영구히 "등록된 사용자 0명" 상태로 잠기는 사고를 막기 위함.
        if self._cache:
            return self._cache
        try:
            loaded = self._load_from_auradb()
        except Exception:
            loaded = []
        if loaded:
            self._cache = loaded
        return loaded

    def warmup(self) -> int:
        """서버 startup 에서 호출. /patient/exists 첫 응답이 Neo4j 콜드
        connection 비용을 떠안지 않도록 미리 캐시를 채운다."""
        self._cache = None
        return len(self.all())

    def resolve(self, raw_name: str) -> PersonaIdentity | None:
        normalized = self._normalize_name(raw_name)
        if not normalized:
            return None

        personas = self.all()
        exact_matches = [p for p in personas if self._normalize_name(p.name) == normalized]
        if exact_matches:
            return exact_matches[0]

        contains_matches = [p for p in personas if normalized in self._normalize_name(p.name)]
        if len(contains_matches) == 1:
            return contains_matches[0]
        return None

    def resolve_persona_id(self, raw_persona_id: str) -> PersonaIdentity | None:
        candidate = (raw_persona_id or "").strip()
        if not candidate:
            return None
        for persona in self.all():
            if persona.persona_id == candidate:
                return persona
        return None


session_identity_store = SessionIdentityStore()
persona_directory = PersonaDirectory()
