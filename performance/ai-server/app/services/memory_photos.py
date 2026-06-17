from __future__ import annotations

import json
import re
import threading
from datetime import datetime, timezone
from pathlib import Path

from app.config import DATA_DIR
from app.services.auradb_memory import AuraDBMemory


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_-]+", "-", (value or "").strip().lower())
    cleaned = cleaned.strip("-_")
    return cleaned or "photo"


def _tokenize_korean_text(value: str) -> list[str]:
    text = (value or "").lower()
    # Keep Korean/English/numbers and split on everything else.
    normalized = re.sub(r"[^0-9a-z가-힣]+", " ", text)
    tokens = [token for token in normalized.split() if len(token) >= 2]
    return tokens


class MemoryPhotoService:
    def __init__(self) -> None:
        self.root_dir = DATA_DIR / "memory_photos"
        self.files_dir = self.root_dir / "files"
        self.meta_path = self.root_dir / "photos.json"
        self._lock = threading.Lock()
        self._auradb_memory = AuraDBMemory()
        self.files_dir.mkdir(parents=True, exist_ok=True)
        self._ensure_meta()

    def _normalize_user_id(self, user_id: str | None) -> str:
        cleaned = (user_id or "").strip()
        return cleaned or "__global__"

    def _ensure_meta(self) -> None:
        if self.meta_path.exists():
            return
        self._write({"active_photo_id": None, "active_photo_ids": {}, "items": []})

    def _read(self) -> dict:
        with self._lock:
            try:
                data = json.loads(self.meta_path.read_text(encoding="utf-8"))
                if "active_photo_ids" not in data:
                    data["active_photo_ids"] = {}
                return data
            except Exception:
                data = {"active_photo_id": None, "active_photo_ids": {}, "items": []}
                self._write(data)
                return data

    def _write(self, data: dict) -> None:
        self.root_dir.mkdir(parents=True, exist_ok=True)
        self.meta_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def _item_response(self, item: dict, active_photo_id: str | None) -> dict:
        photo_id = item["photo_id"]
        user_id = (item.get("user_id") or "").strip()
        image_url = f"/memory-photos/{photo_id}/file"
        if user_id:
            image_url = f"{image_url}?user_id={user_id}"
        return {
            "photo_id": photo_id,
            "title": item["title"],
            "note": item.get("note") or None,
            "filename": item["filename"],
            "image_url": image_url,
            "linked_entities": list(item.get("linked_entities") or []),
            "is_active": photo_id == active_photo_id,
            "created_at": item.get("created_at") or _now_iso(),
            "updated_at": item.get("updated_at") or item.get("created_at") or _now_iso(),
        }

    def _items_for_user(self, data: dict, user_id: str | None) -> list[dict]:
        normalized_user_id = self._normalize_user_id(user_id)
        return [
            item for item in (data.get("items") or [])
            if self._normalize_user_id(item.get("user_id")) == normalized_user_id
        ]

    def _active_photo_id_for_user(self, data: dict, user_id: str | None) -> str | None:
        normalized_user_id = self._normalize_user_id(user_id)
        if normalized_user_id == "__global__":
            return data.get("active_photo_id")
        return (data.get("active_photo_ids") or {}).get(normalized_user_id)

    def _set_active_photo_id_for_user(self, data: dict, user_id: str | None, photo_id: str | None) -> None:
        normalized_user_id = self._normalize_user_id(user_id)
        if normalized_user_id == "__global__":
            data["active_photo_id"] = photo_id
            return
        active_photo_ids = data.get("active_photo_ids") or {}
        if photo_id:
            active_photo_ids[normalized_user_id] = photo_id
        else:
            active_photo_ids.pop(normalized_user_id, None)
        data["active_photo_ids"] = active_photo_ids

    def _score_item(self, item: dict, query_tokens: list[str], active_photo_id: str | None) -> int:
        score = 0
        title = str(item.get("title") or "")
        note = str(item.get("note") or "")
        linked_entities = " ".join(item.get("linked_entities") or [])
        haystack = f"{title} {note} {linked_entities}".lower()

        for token in query_tokens:
            if token in title.lower():
                score += 5
            elif token in haystack:
                score += 3

        if item.get("photo_id") == active_photo_id:
            score += 1

        return score

    def list_photos(self, user_id: str | None = None) -> dict:
        data = self._read()
        active_photo_id = self._active_photo_id_for_user(data, user_id)
        items = [
            self._item_response(item, active_photo_id)
            for item in sorted(self._items_for_user(data, user_id), key=lambda row: row.get("updated_at") or "", reverse=True)
        ]
        return {"items": items, "active_photo_id": active_photo_id}

    def get_photo(self, photo_id: str | None = None, user_id: str | None = None) -> dict | None:
        data = self._read()
        target = photo_id or self._active_photo_id_for_user(data, user_id)
        if not target:
            return None
        for item in self._items_for_user(data, user_id):
            if item.get("photo_id") == target:
                return item
        return None

    def get_photo_response(self, photo_id: str | None = None, user_id: str | None = None) -> dict | None:
        data = self._read()
        target = photo_id or self._active_photo_id_for_user(data, user_id)
        if not target:
            return None
        active_photo_id = self._active_photo_id_for_user(data, user_id)
        for item in self._items_for_user(data, user_id):
            if item.get("photo_id") == target:
                return self._item_response(item, active_photo_id)
        return None

    def choose_photo(
        self,
        query: str = "",
        user_id: str | None = None,
        recent_messages: list[str] | None = None,
        conversation_summary: str | None = None,
    ) -> dict | None:
        data = self._read()
        items = self._items_for_user(data, user_id)
        if not items:
            return None

        recent_text = " ".join(recent_messages or [])
        combined_query = " ".join(
            part.strip()
            for part in [query, recent_text, conversation_summary or ""]
            if part and part.strip()
        )
        query_tokens = _tokenize_korean_text(combined_query)

        active_photo_id = self._active_photo_id_for_user(data, user_id)
        if user_id and self._auradb_memory.available():
            try:
                recent_payload = [{"role": "user", "content": text} for text in (recent_messages or [])[-4:] if text]
                graph_matches = self._auradb_memory.retrieve_related_photos(
                    query=query,
                    user_id=user_id,
                    top_k=1,
                    recent_messages=recent_payload,
                    conversation_summary=conversation_summary,
                )
                if graph_matches:
                    graph_photo_id = str(graph_matches[0].get("photo_id") or "").strip()
                    if graph_photo_id:
                        graph_selected = self.get_photo_response(graph_photo_id, user_id=user_id)
                        if graph_selected is not None:
                            return graph_selected
            except Exception:
                pass

        if not query_tokens:
            target_id = active_photo_id or items[-1].get("photo_id")
            return self.get_photo_response(target_id, user_id=user_id)

        scored_items = [
            (self._score_item(item, query_tokens, active_photo_id), item)
            for item in items
        ]
        scored_items.sort(
            key=lambda pair: (
                pair[0],
                pair[1].get("updated_at") or "",
                pair[1].get("created_at") or "",
            ),
            reverse=True,
        )

        best_score, best_item = scored_items[0]
        if best_score <= 0:
            target_id = active_photo_id or best_item.get("photo_id")
            return self.get_photo_response(target_id, user_id=user_id)
        return self._item_response(best_item, active_photo_id)

    def create_photo(
        self,
        title: str,
        note: str | None,
        filename: str,
        content: bytes,
        set_active: bool = False,
        user_id: str | None = None,
    ) -> dict:
        cleaned_title = (title or "").strip() or "회상 사진"
        if not content:
            raise ValueError("photo file is empty")

        data = self._read()
        base_id = _slugify(cleaned_title)
        existing_ids = {item.get("photo_id") for item in self._items_for_user(data, user_id)}
        photo_id = base_id
        suffix_num = 2
        while photo_id in existing_ids:
            photo_id = f"{base_id}-{suffix_num}"
            suffix_num += 1

        suffix = Path(filename or "").suffix.lower() or ".jpg"
        saved_filename = f"{photo_id}{suffix}"
        file_path = self.files_dir / saved_filename
        file_path.write_bytes(content)

        now = _now_iso()
        linked_entities: list[str] = []
        linked_entity_records: list[dict[str, str]] = []
        if user_id and self._auradb_memory.available():
            try:
                linked_entity_records = self._auradb_memory.infer_photo_relations(
                    user_id=user_id,
                    title=cleaned_title,
                    note=note,
                )
                linked_entities = [entity["summary"] for entity in linked_entity_records if entity.get("summary")]
            except Exception:
                linked_entities = []
                linked_entity_records = []

        item = {
            "photo_id": photo_id,
            "title": cleaned_title,
            "note": (note or "").strip(),
            "filename": saved_filename,
            "user_id": (user_id or "").strip() or None,
            "linked_entities": linked_entities,
            "created_at": now,
            "updated_at": now,
        }
        items = data.get("items") or []
        items.append(item)
        data["items"] = items
        if set_active or not self._active_photo_id_for_user(data, user_id):
            self._set_active_photo_id_for_user(data, user_id, photo_id)
        self._write(data)
        if user_id and self._auradb_memory.available():
            try:
                self._auradb_memory.upsert_photo_relations(
                    user_id=user_id,
                    photo_id=photo_id,
                    title=cleaned_title,
                    note=note,
                    filename=saved_filename,
                    linked_entities=linked_entity_records,
                    created_at=now,
                    updated_at=now,
                )
            except Exception:
                pass
        return self._item_response(item, self._active_photo_id_for_user(data, user_id))

    def activate_photo(self, photo_id: str, user_id: str | None = None) -> dict:
        data = self._read()
        selected = None
        for item in self._items_for_user(data, user_id):
            if item.get("photo_id") == photo_id:
                item["updated_at"] = _now_iso()
                selected = item
                break
        if selected is None:
            raise ValueError("memory photo not found")
        self._set_active_photo_id_for_user(data, user_id, photo_id)
        self._write(data)
        return self._item_response(selected, photo_id)

    def file_path_for(self, photo_id: str, user_id: str | None = None) -> Path:
        item = self.get_photo(photo_id, user_id=user_id)
        if item is None:
            raise ValueError("memory photo not found")
        path = self.files_dir / item["filename"]
        if not path.exists():
            raise ValueError("memory photo file not found")
        return path

    def delete_photo(self, photo_id: str, user_id: str | None = None) -> bool:
        data = self._read()
        items = data.get("items") or []
        normalized = self._normalize_user_id(user_id)
        remaining: list[dict] = []
        removed_item: dict | None = None
        for item in items:
            matches_scope = self._normalize_user_id(item.get("user_id")) == normalized
            if item.get("photo_id") == photo_id and matches_scope:
                removed_item = item
                continue
            remaining.append(item)
        if removed_item is None:
            return False
        data["items"] = remaining
        if self._active_photo_id_for_user(data, user_id) == photo_id:
            self._set_active_photo_id_for_user(data, user_id, None)
        self._write(data)
        try:
            filename = removed_item.get("filename") or ""
            if filename:
                file_path = self.files_dir / filename
                if file_path.exists():
                    file_path.unlink()
        except Exception:
            pass
        if user_id and self._auradb_memory.available():
            try:
                self._auradb_memory.delete_photo_relations(user_id=user_id, photo_id=photo_id)
            except Exception:
                pass
        return True
