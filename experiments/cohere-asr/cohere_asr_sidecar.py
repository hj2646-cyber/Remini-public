"""Cohere Transcribe 03-2026 sidecar — mimics Qwen3-ASR sidecar API.

Endpoint compatibility:
  GET  /                  → health
  POST /api/start         → { session_id, language }
  POST /api/chunk         → accumulates float32 PCM bytes; returns partial="" (no streaming)
  POST /api/finish        → returns { language, text } from full buffered transcribe

Uses the native transformers 5.x Cohere ASR implementation.
Korean is supported (confirmed via model card).
"""
from __future__ import annotations

import argparse
import os
import time
import uuid
from dataclasses import dataclass, field
from typing import Optional

import numpy as np
import torch
from flask import Flask, Response, jsonify, request
from transformers import AutoProcessor, CohereAsrForConditionalGeneration


@dataclass
class Session:
    language: Optional[str]
    created_at: float
    last_seen: float
    buffer: list = field(default_factory=list)
    text: str = ""


app = Flask(__name__)
processor: AutoProcessor
model: CohereAsrForConditionalGeneration
dtype = torch.bfloat16
default_language = "Korean"
allowed_languages = {"Korean", "English"}
max_new_tokens = 256
SESSIONS: dict[str, Session] = {}
SESSION_TTL_SEC = 10 * 60
SAMPLE_RATE = 16000


def _normalize_language(value: object) -> Optional[str]:
    raw = str(value or "").strip()
    if not raw or raw.lower() in {"auto", "none", "null"}:
        return None
    aliases = {
        "ko": "Korean", "kor": "Korean", "korean": "Korean", "한국어": "Korean",
        "en": "English", "eng": "English", "english": "English", "영어": "English",
    }
    lang = aliases.get(raw.lower(), raw)
    if lang not in allowed_languages:
        raise ValueError(f"unsupported language: {raw!r}; allowed={sorted(allowed_languages)}")
    return lang


def _gc_sessions() -> None:
    now = time.time()
    dead = [sid for sid, s in SESSIONS.items() if now - s.last_seen > SESSION_TTL_SEC]
    for sid in dead:
        SESSIONS.pop(sid, None)


def _get_session(session_id: str) -> Optional[Session]:
    _gc_sessions()
    session = SESSIONS.get(session_id)
    if session:
        session.last_seen = time.time()
    return session


@app.get("/")
def health() -> Response:
    return jsonify({"ok": True, "backend": "cohere-transcribe-03-2026",
                    "default_language": default_language,
                    "allowed_languages": sorted(allowed_languages)})


@app.post("/api/start")
def api_start() -> Response:
    payload = request.get_json(silent=True) or {}
    requested = request.args.get("language") or payload.get("language") or default_language
    try:
        language = _normalize_language(requested)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    session_id = uuid.uuid4().hex
    now = time.time()
    SESSIONS[session_id] = Session(language=language, created_at=now, last_seen=now)
    return jsonify({"session_id": session_id, "language": language or ""})


@app.post("/api/chunk")
def api_chunk() -> Response:
    session_id = request.args.get("session_id", "")
    session = _get_session(session_id)
    if not session:
        return jsonify({"error": "invalid session_id"}), 400
    if request.mimetype != "application/octet-stream":
        return jsonify({"error": "expect application/octet-stream"}), 400
    raw = request.get_data(cache=False)
    if len(raw) % 4 != 0:
        return jsonify({"error": "float32 bytes length not multiple of 4"}), 400
    wav = np.frombuffer(raw, dtype=np.float32).reshape(-1)
    session.buffer.append(wav.copy())
    # Cohere is batch-only — no partial transcript
    return jsonify({"language": session.language or "", "text": session.text})


@app.post("/api/finish")
def api_finish() -> Response:
    session_id = request.args.get("session_id", "")
    session = _get_session(session_id)
    if not session:
        return jsonify({"error": "invalid session_id"}), 400

    text = ""
    if session.buffer:
        try:
            full = np.concatenate(session.buffer).astype(np.float32)
            # safety: clamp very long sessions (5 min)
            if len(full) > SAMPLE_RATE * 60 * 5:
                full = full[: SAMPLE_RATE * 60 * 5]
            lang_code = "ko" if (session.language or "Korean") in {"Korean", "ko", "kor"} else "en"
            with torch.inference_mode():
                inputs = processor(
                    full,
                    sampling_rate=SAMPLE_RATE,
                    return_tensors="pt",
                    language=lang_code,
                    punctuation=True,
                )
                audio_chunk_index = inputs.get("audio_chunk_index")
                inputs.to(model.device, dtype=model.dtype)
                outputs = model.generate(**inputs, max_new_tokens=max_new_tokens)
                decoded = processor.decode(
                    outputs,
                    skip_special_tokens=True,
                    audio_chunk_index=audio_chunk_index,
                    language=lang_code,
                )
            if isinstance(decoded, (list, tuple)):
                text = (decoded[0] if decoded else "").strip()
            else:
                text = str(decoded or "").strip()
        except Exception as exc:
            text = ""
            print(f"[cohere sidecar] finish error: {exc}", flush=True)

    SESSIONS.pop(session_id, None)
    return jsonify({"language": session.language or "", "text": text})


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Remini Cohere Transcribe sidecar")
    p.add_argument("--model", default="CohereLabs/cohere-transcribe-03-2026")
    p.add_argument("--host", default="0.0.0.0")
    p.add_argument("--port", type=int, default=7860)
    p.add_argument("--default-language", default="Korean")
    p.add_argument("--allowed-languages", default="Korean,English")
    p.add_argument("--device-map", default="cuda:0")
    p.add_argument("--dtype", choices=("bfloat16", "float16", "float32"), default="bfloat16")
    p.add_argument("--max-new-tokens", type=int, default=256)
    return p.parse_args()


def main() -> None:
    args = parse_args()
    global processor, model, dtype, default_language, allowed_languages, max_new_tokens
    dtype = {
        "bfloat16": torch.bfloat16,
        "float16": torch.float16,
        "float32": torch.float32,
    }[args.dtype]
    max_new_tokens = args.max_new_tokens
    allowed_languages = {
        _normalize_language(item) or "" for item in args.allowed_languages.split(",") if item.strip()
    }
    allowed_languages.discard("")
    default_language = _normalize_language(
        os.getenv("COHERE_ASR_LANGUAGE", args.default_language)
    ) or "Korean"

    print(f"[cohere sidecar] loading {args.model} ...", flush=True)
    t0 = time.perf_counter()
    processor = AutoProcessor.from_pretrained(args.model)
    model = CohereAsrForConditionalGeneration.from_pretrained(
        args.model, dtype=dtype, device_map=args.device_map,
    )
    model.eval()
    print(f"[cohere sidecar] loaded in {time.perf_counter()-t0:.1f}s "
          f"default={default_language} allowed={sorted(allowed_languages)} "
          f"dtype={args.dtype} device_map={args.device_map}", flush=True)

    app.run(host=args.host, port=args.port, debug=False, use_reloader=False, threaded=True)


if __name__ == "__main__":
    main()
