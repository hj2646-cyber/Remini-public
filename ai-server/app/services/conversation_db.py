from __future__ import annotations

import json
import logging
import sqlite3
import threading
import time
from pathlib import Path
from typing import Any

from app.config import DATA_DIR


DB_PATH = DATA_DIR / "conversations.db"
# 세션당 최대 보관 행 수 (초과 시 오래된 행 삭제)
_MAX_ROWS_PER_SESSION = 200
# 자동 정리 간격 (초)
_CLEANUP_INTERVAL_SEC = 600  # 10분

logger = logging.getLogger(__name__)


class ConversationDB:
    def __init__(self, db_path: Path = DB_PATH) -> None:
        self.db_path = db_path
        self._lock = threading.Lock()
        self._last_cleanup = 0.0
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    user_id TEXT,
                    speaker TEXT NOT NULL,
                    content TEXT NOT NULL,
                    emotion TEXT,
                    risk_level TEXT NOT NULL,
                    crisis_flag INTEGER NOT NULL DEFAULT 0,
                    channel TEXT NOT NULL,
                    meta_json TEXT,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id, created_at)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_conversations_risk ON conversations(risk_level, created_at)"
            )
            conn.commit()

    def add_message(
        self,
        session_id: str,
        user_id: str | None,
        speaker: str,
        content: str,
        emotion: str,
        risk_level: str,
        crisis_flag: bool,
        channel: str,
        meta: dict[str, Any] | None = None,
    ) -> None:
        with self._lock:
            with self._connect() as conn:
                conn.execute(
                    """
                    INSERT INTO conversations
                    (session_id, user_id, speaker, content, emotion, risk_level, crisis_flag, channel, meta_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        session_id,
                        user_id,
                        speaker,
                        content,
                        emotion,
                        risk_level,
                        1 if crisis_flag else 0,
                        channel,
                        json.dumps(meta or {}, ensure_ascii=False),
                    ),
                )
                conn.commit()
        self._maybe_cleanup()

    def cleanup(self) -> int:
        """세션별 오래된 행과 junk system 로그 제거. 제거된 총 행 수 반환."""
        removed = 0
        with self._lock:
            with self._connect() as conn:
                # 1) ignored proactive 로그 일괄 삭제
                cur = conn.execute(
                    "DELETE FROM conversations WHERE speaker = 'system' AND content LIKE 'proactive_event_ignored%'"
                )
                removed += cur.rowcount
                # 2) 세션별 MAX 초과 행 삭제
                sessions = conn.execute(
                    "SELECT session_id, COUNT(*) AS cnt FROM conversations GROUP BY session_id HAVING cnt > ?",
                    (_MAX_ROWS_PER_SESSION,),
                ).fetchall()
                for row in sessions:
                    sid = row["session_id"]
                    cur = conn.execute(
                        """
                        DELETE FROM conversations WHERE id IN (
                            SELECT id FROM conversations
                            WHERE session_id = ?
                            ORDER BY id DESC
                            LIMIT -1 OFFSET ?
                        )
                        """,
                        (sid, _MAX_ROWS_PER_SESSION),
                    )
                    removed += cur.rowcount
                conn.commit()
        if removed > 0:
            logger.info("conversation_db cleanup: removed %d rows", removed)
        self._last_cleanup = time.time()
        return removed

    def _maybe_cleanup(self) -> None:
        now = time.time()
        if now - self._last_cleanup >= _CLEANUP_INTERVAL_SEC:
            threading.Thread(target=self.cleanup, daemon=True).start()

    def list_messages(
        self,
        session_id: str | None = None,
        user_id: str | None = None,
        risk_level: str | None = None,
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        clauses: list[str] = []
        params: list[Any] = []
        if session_id:
            clauses.append("session_id = ?")
            params.append(session_id)
        if user_id is not None:
            clauses.append("user_id = ?")
            params.append(user_id)
        if risk_level:
            clauses.append("risk_level = ?")
            params.append(risk_level)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        params.append(limit)

        with self._connect() as conn:
            rows = conn.execute(
                f"""
                SELECT id, session_id, user_id, speaker, content, emotion, risk_level, crisis_flag, channel, meta_json, created_at
                FROM conversations
                {where}
                ORDER BY id DESC
                LIMIT ?
                """,
                params,
            ).fetchall()

        out: list[dict[str, Any]] = []
        for row in rows:
            item = dict(row)
            item["crisis_flag"] = bool(item["crisis_flag"])
            item["meta"] = json.loads(item.pop("meta_json") or "{}")
            out.append(item)
        out.reverse()
        return out

    def summary(
        self,
        session_id: str | None = None,
        user_id: str | None = None,
    ) -> dict[str, int]:
        clauses: list[str] = []
        params: list[Any] = []
        if session_id:
            clauses.append("session_id = ?")
            params.append(session_id)
        if user_id is not None:
            clauses.append("user_id = ?")
            params.append(user_id)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        with self._connect() as conn:
            total = conn.execute(
                f"SELECT COUNT(*) AS c FROM conversations {where}",
                params,
            ).fetchone()["c"]
            rows = conn.execute(
                f"SELECT risk_level, COUNT(*) AS c FROM conversations {where} GROUP BY risk_level",
                params,
            ).fetchall()

        counts = {"daily": 0, "watch": 0, "danger": 0}
        for row in rows:
            rl = row["risk_level"]
            if rl in counts:
                counts[rl] = int(row["c"])
        counts["total"] = int(total)
        return counts

    def delete_session(self, session_id: str) -> int:
        """주어진 session_id 의 모든 메시지 삭제. 삭제된 행 수 반환."""
        with self._lock:
            with self._connect() as conn:
                cur = conn.execute(
                    "DELETE FROM conversations WHERE session_id = ?",
                    (session_id,),
                )
                conn.commit()
                removed = cur.rowcount
        if removed > 0:
            logger.info("conversation_db: deleted session=%s rows=%d", session_id, removed)
        return removed

    def delete_user(self, user_id: str) -> int:
        """주어진 user_id 의 모든 메시지 삭제 (전체 대화 내역). 삭제된 행 수 반환."""
        with self._lock:
            with self._connect() as conn:
                cur = conn.execute(
                    "DELETE FROM conversations WHERE user_id = ?",
                    (user_id,),
                )
                conn.commit()
                removed = cur.rowcount
        if removed > 0:
            logger.info("conversation_db: deleted user=%s rows=%d", user_id, removed)
        return removed

    def list_sessions(
        self,
        user_id: str | None = None,
        limit: int = 50,
    ) -> list[dict[str, Any]]:
        clauses: list[str] = []
        params: list[Any] = []
        if user_id is not None:
            clauses.append("user_id = ?")
            params.append(user_id)
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        params.append(limit)

        with self._connect() as conn:
            rows = conn.execute(
                f"""
                SELECT
                    session_id,
                    MAX(created_at) AS last_at,
                    MIN(created_at) AS first_at,
                    COUNT(*) AS message_count,
                    SUM(CASE WHEN risk_level='danger' THEN 1 ELSE 0 END) AS danger_count,
                    SUM(CASE WHEN risk_level='watch' THEN 1 ELSE 0 END) AS watch_count,
                    (
                      SELECT content FROM conversations c2
                       WHERE c2.session_id = c1.session_id
                         AND c2.speaker = 'user'
                       ORDER BY c2.id DESC LIMIT 1
                    ) AS preview
                FROM conversations c1
                {where}
                GROUP BY session_id
                ORDER BY last_at DESC
                LIMIT ?
                """,
                params,
            ).fetchall()

        out: list[dict[str, Any]] = []
        for row in rows:
            out.append(
                {
                    "session_id": row["session_id"],
                    "first_at": row["first_at"],
                    "last_at": row["last_at"],
                    "message_count": int(row["message_count"]),
                    "danger_count": int(row["danger_count"] or 0),
                    "watch_count": int(row["watch_count"] or 0),
                    "preview": row["preview"],
                }
            )
        return out
