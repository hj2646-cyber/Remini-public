from __future__ import annotations

import json
import logging
import os
import threading
import time
from datetime import datetime
from pathlib import Path
from typing import Any

from app.config import DATA_DIR


MEMORY_FILE = DATA_DIR / "memories.json"
LOG_FILE = DATA_DIR / "session_logs.ndjson"
# session_logs.ndjson 최대 줄 수 (초과 시 오래된 줄 삭제)
LOG_MAX_LINES = 500
# memories.json 자동 정리 간격 (초)
_CLEANUP_INTERVAL_SEC = 600  # 10분
# append_session_log 용 lock (동시 writer 간 줄 경계 보호)
_LOG_LOCK = threading.Lock()

logger = logging.getLogger(__name__)


class MemoryStore:
    def __init__(self, file_path: Path = MEMORY_FILE) -> None:
        self.file_path = file_path
        self._last_cleanup = 0.0
        # RLock: cleanup()이 이미 lock 잡은 상태에서 _load/_save를 다시 호출하므로 재진입 필요
        self._lock = threading.RLock()
        if not self.file_path.exists():
            self.file_path.write_text("[]", encoding="utf-8")

    def _load(self) -> list[dict[str, Any]]:
        """Load memories. If the file is corrupted (e.g. two concatenated
        arrays from a prior race condition), quarantine it and try to
        salvage as much data as possible instead of crashing."""
        raw = self.file_path.read_text(encoding="utf-8-sig")
        if not raw.strip():
            return []
        try:
            return json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.warning(
                "memory_store: corrupted memories.json (%s). Attempting salvage.", exc
            )
            return self._salvage(raw)

    def _salvage(self, raw: str) -> list[dict[str, Any]]:
        """Recover items from a corrupted memories.json. Backs up the
        bad file, then returns whatever valid items could be extracted.
        Caller is responsible for persisting the cleaned list."""
        # Quarantine the bad file so we don't lose evidence.
        try:
            stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup = self.file_path.with_suffix(f".json.broken.{stamp}.bak")
            backup.write_text(raw, encoding="utf-8")
            logger.warning("memory_store: wrote corrupted backup to %s", backup)
        except Exception:
            logger.exception("memory_store: failed to write corruption backup")

        salvaged: list[dict[str, Any]] = []
        decoder = json.JSONDecoder()
        idx = 0
        n = len(raw)
        while idx < n:
            # skip whitespace and separators between chunks
            while idx < n and raw[idx] in " \t\r\n,":
                idx += 1
            if idx >= n:
                break
            # if a bare object/array begins here, try raw_decode
            try:
                obj, end = decoder.raw_decode(raw, idx)
            except json.JSONDecodeError:
                # try to resync by wrapping the tail as an array
                tail = raw[idx:].lstrip()
                if not tail.startswith("["):
                    tail = "[" + tail
                # also ensure it ends with a ']'
                if not tail.rstrip().endswith("]"):
                    tail = tail + "]"
                try:
                    obj = json.loads(tail)
                    end = n
                except json.JSONDecodeError:
                    logger.exception(
                        "memory_store: unable to resync salvage at char %d; giving up",
                        idx,
                    )
                    break
            if isinstance(obj, list):
                salvaged.extend(x for x in obj if isinstance(x, dict))
            elif isinstance(obj, dict):
                salvaged.append(obj)
            idx = end

        # dedupe while preserving order
        seen: set[tuple[str, str]] = set()
        out: list[dict[str, Any]] = []
        for it in salvaged:
            content = (it.get("content") or "").strip()
            key = (it.get("session_id", ""), content)
            if not content or key in seen:
                continue
            seen.add(key)
            out.append(it)
        logger.warning(
            "memory_store: salvaged %d unique items from corrupted file", len(out)
        )
        return out

    def _save(self, data: list[dict[str, Any]]) -> None:
        """Atomically replace the memories.json contents.

        Writes to a sibling temp file, fsyncs, then os.replace — this
        prevents readers from ever seeing a half-written file, and
        prevents concurrent writers from producing the two-array
        corruption pattern we've seen in prod."""
        payload = json.dumps(data, ensure_ascii=False, indent=2)
        tmp_path = self.file_path.with_suffix(
            self.file_path.suffix + f".tmp.{os.getpid()}.{threading.get_ident()}"
        )
        try:
            with tmp_path.open("w", encoding="utf-8") as f:
                f.write(payload)
                f.flush()
                os.fsync(f.fileno())
            os.replace(tmp_path, self.file_path)
        except Exception:
            # best-effort cleanup of the temp file
            try:
                if tmp_path.exists():
                    tmp_path.unlink()
            except Exception:
                pass
            raise

    def _is_junk(self, item: dict[str, Any]) -> bool:
        content = (item.get("content") or "").strip()
        if len(content) < 3:
            return True
        return False

    def _deduplicate(self, data: list[dict[str, Any]]) -> list[dict[str, Any]]:
        seen: set[tuple[str, str]] = set()
        cleaned: list[dict[str, Any]] = []
        for item in data:
            content = (item.get("content") or "").strip()
            if self._is_junk(item):
                continue
            key = (item.get("session_id", ""), content)
            if key in seen:
                continue
            seen.add(key)
            cleaned.append(item)
        return cleaned

    def cleanup(self) -> int:
        """중복/빈 항목 제거. 제거된 개수를 반환."""
        with self._lock:
            data = self._load()
            before = len(data)
            cleaned = self._deduplicate(data)
            removed = before - len(cleaned)
            if removed > 0:
                self._save(cleaned)
                logger.info("memory_store cleanup: removed %d junk items (%d -> %d)", removed, before, len(cleaned))
            self._last_cleanup = time.time()
        return removed

    def _maybe_cleanup(self) -> None:
        now = time.time()
        if now - self._last_cleanup >= _CLEANUP_INTERVAL_SEC:
            threading.Thread(target=self.cleanup, daemon=True).start()

    def add(self, item: dict[str, Any]) -> None:
        if self._is_junk(item):
            return
        with self._lock:
            data = self._load()
            # 직전 항목과 동일하면 저장하지 않음
            content = (item.get("content") or "").strip()
            session_id = item.get("session_id", "")
            for existing in reversed(data[-20:]):
                if existing.get("session_id") == session_id and (existing.get("content") or "").strip() == content:
                    return
            data.append(item)
            self._save(data)
        self._maybe_cleanup()

    def list_by_session(self, session_id: str, user_id: str | None = None, limit: int = 100) -> list[dict[str, Any]]:
        with self._lock:
            data = self._load()
        rows = [d for d in data if d.get("session_id") == session_id]
        if user_id is not None:
            rows = [d for d in rows if d.get("user_id") == user_id]
        return rows[-limit:]

    def all(self) -> list[dict[str, Any]]:
        with self._lock:
            return self._load()


def append_session_log(payload: dict[str, Any]) -> None:
    with _LOG_LOCK:
        with LOG_FILE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(payload, ensure_ascii=False) + "\n")
        # 로그 파일이 너무 크면 오래된 줄 잘라냄
        try:
            lines = LOG_FILE.read_text(encoding="utf-8").splitlines()
            if len(lines) > LOG_MAX_LINES:
                trimmed = lines[-LOG_MAX_LINES:]
                LOG_FILE.write_text("\n".join(trimmed) + "\n", encoding="utf-8")
        except Exception:
            pass
