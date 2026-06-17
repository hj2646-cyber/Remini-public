"""피드백 기반 회피 주제 저장소 — Phase 6.

보호자가 특정 주제에 대해 "불만족" 피드백을 주면 (user_id, topic) 을 누적 저장.
retrieval 단계에서 해당 user의 회피 주제가 포함된 결과를 제외.

SQLite 기반 경량 스토어. `data/avoidance.db`에 저장.
"""

from __future__ import annotations

import sqlite3
import threading
import time
from dataclasses import dataclass
from pathlib import Path

from app.config import DATA_DIR


@dataclass
class AvoidanceEntry:
    user_id: str
    topic: str
    count: int
    last_seen: float


class AvoidanceStore:
    def __init__(self, db_path: Path | None = None) -> None:
        self._path = db_path or (DATA_DIR / "avoidance.db")
        self._lock = threading.Lock()
        self._init_db()

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self._path))
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        with self._conn() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS avoidance (
                    user_id TEXT NOT NULL,
                    topic TEXT NOT NULL,
                    count INTEGER NOT NULL DEFAULT 1,
                    last_seen REAL NOT NULL,
                    PRIMARY KEY (user_id, topic)
                )
                """
            )
            conn.commit()

    def add(self, user_id: str, topic: str) -> None:
        """회피 주제 추가. 이미 있으면 count 증가."""
        uid = (user_id or "").strip()
        topic_norm = (topic or "").strip().lower()
        if not uid or not topic_norm:
            return
        now = time.time()
        with self._lock, self._conn() as conn:
            conn.execute(
                """
                INSERT INTO avoidance (user_id, topic, count, last_seen)
                VALUES (?, ?, 1, ?)
                ON CONFLICT(user_id, topic) DO UPDATE SET
                    count = count + 1,
                    last_seen = excluded.last_seen
                """,
                (uid, topic_norm, now),
            )
            conn.commit()

    def list_topics(self, user_id: str) -> list[str]:
        uid = (user_id or "").strip()
        if not uid:
            return []
        with self._conn() as conn:
            rows = conn.execute(
                "SELECT topic FROM avoidance WHERE user_id = ? "
                "ORDER BY count DESC, last_seen DESC",
                (uid,),
            ).fetchall()
        return [r["topic"] for r in rows]

    def remove(self, user_id: str, topic: str) -> bool:
        uid = (user_id or "").strip()
        topic_norm = (topic or "").strip().lower()
        if not uid or not topic_norm:
            return False
        with self._lock, self._conn() as conn:
            cur = conn.execute(
                "DELETE FROM avoidance WHERE user_id = ? AND topic = ?",
                (uid, topic_norm),
            )
            conn.commit()
            return cur.rowcount > 0

    def all_for_user(self, user_id: str) -> list[AvoidanceEntry]:
        uid = (user_id or "").strip()
        if not uid:
            return []
        with self._conn() as conn:
            rows = conn.execute(
                "SELECT user_id, topic, count, last_seen FROM avoidance "
                "WHERE user_id = ?",
                (uid,),
            ).fetchall()
        return [
            AvoidanceEntry(
                user_id=r["user_id"],
                topic=r["topic"],
                count=r["count"],
                last_seen=r["last_seen"],
            )
            for r in rows
        ]


_store: AvoidanceStore | None = None


def avoidance_store() -> AvoidanceStore:
    """싱글톤 접근자."""
    global _store
    if _store is None:
        _store = AvoidanceStore()
    return _store


def filter_texts_by_avoidance(
    texts: list[str], user_id: str | None
) -> list[str]:
    """회피 주제 키워드가 포함된 텍스트를 걸러냄.

    대소문자 무시, 부분 문자열 매치. 회피 주제가 없으면 원본 그대로 반환.
    """
    if not user_id or not texts:
        return texts
    avoid = avoidance_store().list_topics(user_id)
    if not avoid:
        return texts
    out: list[str] = []
    for t in texts:
        lower = t.lower()
        if any(topic in lower for topic in avoid):
            continue
        out.append(t)
    return out
