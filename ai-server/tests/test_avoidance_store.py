"""Unit tests for avoidance_store — Phase 6."""

from __future__ import annotations

import tempfile
from pathlib import Path

import pytest

from app.services.avoidance_store import (
    AvoidanceStore,
    filter_texts_by_avoidance,
)


@pytest.fixture
def store(tmp_path: Path):
    return AvoidanceStore(db_path=tmp_path / "test.db")


class TestAddAndList:
    def test_add_single(self, store):
        store.add("user1", "돈")
        assert "돈" in store.list_topics("user1")

    def test_add_multiple(self, store):
        store.add("user1", "돈")
        store.add("user1", "건강")
        topics = store.list_topics("user1")
        assert "돈" in topics and "건강" in topics

    def test_add_duplicate_increments_count(self, store):
        store.add("user1", "돈")
        store.add("user1", "돈")
        entries = store.all_for_user("user1")
        assert len(entries) == 1
        assert entries[0].count == 2

    def test_topic_normalized_lowercase(self, store):
        store.add("user1", "DONATION")
        assert "donation" in store.list_topics("user1")

    def test_isolation_between_users(self, store):
        store.add("user1", "돈")
        store.add("user2", "건강")
        assert store.list_topics("user1") == ["돈"]
        assert store.list_topics("user2") == ["건강"]

    def test_empty_user_or_topic(self, store):
        store.add("", "돈")
        store.add("user1", "")
        assert store.list_topics("user1") == []


class TestRemove:
    def test_remove_existing(self, store):
        store.add("user1", "돈")
        assert store.remove("user1", "돈") is True
        assert store.list_topics("user1") == []

    def test_remove_nonexistent(self, store):
        assert store.remove("user1", "없는주제") is False


class TestFilterTexts:
    def test_filters_matching_texts(self, store, monkeypatch):
        # 글로벌 싱글톤을 테스트용 인스턴스로 치환
        monkeypatch.setattr(
            "app.services.avoidance_store._store", store
        )
        store.add("user1", "돈")
        texts = [
            "어릴 때 놀던 마당",
            "우리는 돈 걱정을 많이 했다",
            "엄마가 해주시던 김치찌개",
        ]
        result = filter_texts_by_avoidance(texts, "user1")
        assert len(result) == 2
        assert all("돈" not in t for t in result)

    def test_no_user_id_passes_through(self, store):
        texts = ["a", "b"]
        assert filter_texts_by_avoidance(texts, None) == texts

    def test_empty_avoidance_passes_through(self, store, monkeypatch):
        monkeypatch.setattr(
            "app.services.avoidance_store._store", store
        )
        texts = ["어릴 때 놀던 마당", "우리 돈 이야기"]
        result = filter_texts_by_avoidance(texts, "user_no_topics")
        assert result == texts
