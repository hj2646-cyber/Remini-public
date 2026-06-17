"""Unit tests for retrieval.looks_fragmented + reconstruct_from_fragments.

실제 Neo4j 연결은 mock — KG 매칭 로직만 단위 검증.
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

from app.services.retrieval import RetrievalService


class TestLooksFragmented:
    def test_ellipsis(self):
        assert RetrievalService.looks_fragmented("으어… 철수가…") is True

    def test_hesitation_token(self):
        assert RetrievalService.looks_fragmented("으어 철수가") is True

    def test_multi_dots(self):
        assert RetrievalService.looks_fragmented("철... 철수가... 강아지...") is True

    def test_short_multi_dots(self):
        assert RetrievalService.looks_fragmented("철수가. 강아지. 밥.") is True

    def test_normal_clean(self):
        assert RetrievalService.looks_fragmented("오늘 날씨 참 좋네요") is False

    def test_empty(self):
        assert RetrievalService.looks_fragmented("") is False


class TestReconstructFromFragments:
    def _make_service(self):
        svc = RetrievalService()
        # auradb 연결 없이도 동작 경로 테스트
        return svc

    def test_none_if_not_fragmented(self):
        svc = self._make_service()
        with patch.object(svc.auradb_memory, "available", return_value=True):
            result = svc.reconstruct_from_fragments("오늘 날씨 좋네요", user_id="u1")
            assert result is None

    def test_none_if_auradb_unavailable(self):
        svc = self._make_service()
        with patch.object(svc.auradb_memory, "available", return_value=False):
            result = svc.reconstruct_from_fragments("으어… 철수가…", user_id="u1")
            assert result is None

    def test_returns_hint_when_kg_match(self):
        svc = self._make_service()
        # Mock: auradb available, persona_id 유효, 후보 하나 매칭됨
        cand = MagicMock()
        cand.name = "철수"
        cand.label = "Person"
        cand.alias = ""
        cand.role = "아들"

        with patch.object(svc.auradb_memory, "available", return_value=True), \
             patch.object(svc.auradb_memory, "_resolve_persona_id", return_value="p1"), \
             patch.object(svc.auradb_memory, "_load_entity_candidates", return_value=[cand]), \
             patch.object(svc.auradb_memory, "_candidate_match_score", return_value=10):
            result = svc.reconstruct_from_fragments(
                "으어… 철수가… 강아지…", user_id="u1"
            )
            assert result is not None
            assert "철수" in result
            assert "아들" in result
            assert "교정" in result  # 교정 금지 문구

    def test_no_hint_if_weak_match(self):
        svc = self._make_service()
        cand = MagicMock()
        cand.name = "철수"
        cand.alias = ""
        cand.role = ""
        cand.label = "Person"

        with patch.object(svc.auradb_memory, "available", return_value=True), \
             patch.object(svc.auradb_memory, "_resolve_persona_id", return_value="p1"), \
             patch.object(svc.auradb_memory, "_load_entity_candidates", return_value=[cand]), \
             patch.object(svc.auradb_memory, "_candidate_match_score", return_value=3):
            result = svc.reconstruct_from_fragments(
                "으어… 철수가…", user_id="u1", min_match_score=8
            )
            assert result is None
