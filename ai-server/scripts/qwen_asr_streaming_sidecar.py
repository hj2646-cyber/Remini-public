from __future__ import annotations

import argparse
import os
import time
import uuid
from dataclasses import dataclass
from typing import Optional

import numpy as np
from flask import Flask, Response, jsonify, request
from qwen_asr import Qwen3ASRModel


@dataclass
class Session:
    state: object
    language: Optional[str]
    created_at: float
    last_seen: float


app = Flask(__name__)

asr: Qwen3ASRModel
default_language = "Korean"
allowed_languages = {"Korean", "English"}
unfixed_chunk_num = 4
unfixed_token_num = 5
chunk_size_sec = 0.5

SESSIONS: dict[str, Session] = {}
SESSION_TTL_SEC = 10 * 60


def _normalize_language(value: object) -> Optional[str]:
    raw = str(value or "").strip()
    if not raw or raw.lower() in {"auto", "none", "null"}:
        return None
    aliases = {
        "ko": "Korean",
        "kor": "Korean",
        "korean": "Korean",
        "한국어": "Korean",
        "en": "English",
        "eng": "English",
        "english": "English",
        "영어": "English",
    }
    lang = aliases.get(raw.lower(), raw)
    if lang not in allowed_languages:
        raise ValueError(
            f"unsupported language: {raw!r}; allowed={sorted(allowed_languages)}"
        )
    return lang


def _gc_sessions() -> None:
    now = time.time()
    dead = [sid for sid, s in SESSIONS.items() if now - s.last_seen > SESSION_TTL_SEC]
    for sid in dead:
        try:
            asr.finish_streaming_transcribe(SESSIONS[sid].state)
        except Exception:
            pass
        SESSIONS.pop(sid, None)


def _get_session(session_id: str) -> Optional[Session]:
    _gc_sessions()
    session = SESSIONS.get(session_id)
    if session:
        session.last_seen = time.time()
    return session


@app.get("/")
def health() -> Response:
    return jsonify(
        {
            "ok": True,
            "default_language": default_language,
            "allowed_languages": sorted(allowed_languages),
        }
    )


@app.post("/api/start")
def api_start() -> Response:
    payload = request.get_json(silent=True) or {}
    requested = request.args.get("language") or payload.get("language") or default_language
    try:
        language = _normalize_language(requested)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    session_id = uuid.uuid4().hex
    state = asr.init_streaming_state(
        language=language,
        unfixed_chunk_num=unfixed_chunk_num,
        unfixed_token_num=unfixed_token_num,
        chunk_size_sec=chunk_size_sec,
    )
    now = time.time()
    SESSIONS[session_id] = Session(
        state=state,
        language=language,
        created_at=now,
        last_seen=now,
    )
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
    asr.streaming_transcribe(wav, session.state)

    language = getattr(session.state, "language", "") or session.language or ""
    text = getattr(session.state, "text", "") or ""
    if language and language not in allowed_languages:
        text = ""
    return jsonify({"language": language, "text": text})


@app.post("/api/finish")
def api_finish() -> Response:
    session_id = request.args.get("session_id", "")
    session = _get_session(session_id)
    if not session:
        return jsonify({"error": "invalid session_id"}), 400

    asr.finish_streaming_transcribe(session.state)
    language = getattr(session.state, "language", "") or session.language or ""
    text = getattr(session.state, "text", "") or ""
    if language and language not in allowed_languages:
        text = ""
    SESSIONS.pop(session_id, None)
    return jsonify({"language": language, "text": text})


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Remini Qwen3-ASR streaming sidecar")
    parser.add_argument("--asr-model-path", default="Qwen/Qwen3-ASR-1.7B")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=7860)
    parser.add_argument("--gpu-memory-utilization", type=float, default=0.25)
    parser.add_argument("--unfixed-chunk-num", type=int, default=4)
    parser.add_argument("--unfixed-token-num", type=int, default=5)
    parser.add_argument("--chunk-size-sec", type=float, default=0.5)
    parser.add_argument("--default-language", default="Korean")
    parser.add_argument("--allowed-languages", default="Korean,English")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    global asr
    global default_language
    global allowed_languages
    global unfixed_chunk_num
    global unfixed_token_num
    global chunk_size_sec

    allowed_languages = {
        _normalize_language(item) or ""
        for item in args.allowed_languages.split(",")
        if item.strip()
    }
    allowed_languages.discard("")
    default_language = _normalize_language(
        os.getenv("QWEN_ASR_STREAMING_LANGUAGE", args.default_language)
    ) or "Korean"
    unfixed_chunk_num = args.unfixed_chunk_num
    unfixed_token_num = args.unfixed_token_num
    chunk_size_sec = args.chunk_size_sec

    asr = Qwen3ASRModel.LLM(
        model=args.asr_model_path,
        gpu_memory_utilization=args.gpu_memory_utilization,
        max_new_tokens=32,
    )
    print(
        "Model loaded. "
        f"default_language={default_language} allowed={sorted(allowed_languages)}",
        flush=True,
    )
    app.run(host=args.host, port=args.port, debug=False, use_reloader=False, threaded=True)


if __name__ == "__main__":
    main()
