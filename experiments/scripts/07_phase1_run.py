"""Step 7 — Phase 1 응답 생성 (4셀 × 270 시나리오 = 1,080 trial).

4 condition (2×2 factorial):
  cell1 = GraphRAG + DSLM (Ollama)
  cell2 = GraphRAG + Gemini
  cell3 = VectorRAG + DSLM
  cell4 = VectorRAG + Gemini

산출물:
  data/responses/cell1.jsonl
  data/responses/cell2.jsonl
  data/responses/cell3.jsonl
  data/responses/cell4.jsonl

각 줄: {scenario_id, persona_id, question, ground_truth, pattern,
        retrieved_contexts, answer, cell, rag, llm, latency_s}

사용:
  python scripts/07_phase1_run.py --pilot 10              # 셀당 10 trial 만 (pilot)
  python scripts/07_phase1_run.py --cells 1,3             # 특정 셀만
  python scripts/07_phase1_run.py                          # 전체 1,080
  python scripts/07_phase1_run.py --resume                 # 중단된 데서 이어서
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from rag.graph_rag import GraphRAG
from rag.vector_rag import VectorRAG

# 루트 .env 로드 (CLAUDE.md 규칙 — .env 는 프로젝트 루트 하나)
load_dotenv(ROOT.parent / ".env")

# ───────────────────── 설정 ─────────────────────
DATA_DIR = ROOT / "data"
SCENARIOS_CSV = DATA_DIR / "scenarios" / "phase1.csv"
PERSONA_DIR = DATA_DIR / "personas"
CHROMA_PATH = ROOT / "rag" / "chroma_db"
RESPONSES_DIR = DATA_DIR / "responses"
RESPONSES_DIR.mkdir(parents=True, exist_ok=True)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "remini-stage26-carecall:latest")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

CELLS = {
    1: {"rag": "GraphRAG", "llm": "DSLM"},
    2: {"rag": "GraphRAG", "llm": "Gemini"},
    3: {"rag": "VectorRAG", "llm": "DSLM"},
    4: {"rag": "VectorRAG", "llm": "Gemini"},
}

# 단순 fact 검증 task — 회상요법 어조 X (실험설계 v5 §2.5)
SYSTEM_PROMPT = """당신은 페르소나 정보에 대한 단순 사실 검증 어시스턴트입니다.

규칙:
1. 제공된 [페르소나 정보] 만 근거로 답하세요.
2. 제공되지 않은 정보는 "정보 없음" 이라고 답하세요.
3. 추측·일반 상식·환각 금지.
4. T/F 질문은 'T' 또는 'F' 로 시작하고 짧게 근거를 설명하세요.
5. 사실 질문은 한 문장으로 정확히 답하세요."""


def build_prompt(contexts: list[str], question: str) -> str:
    ctx_block = "\n\n".join(f"[chunk {i+1}]\n{c}" for i, c in enumerate(contexts))
    return f"""[페르소나 정보]
{ctx_block}

[질문]
{question}

[답변]"""


# ───────────────────── LLM 호출 ─────────────────────
def call_dslm(prompt: str, system: str = SYSTEM_PROMPT, timeout: int = 60) -> str:
    import ollama
    client = ollama.Client(host=OLLAMA_BASE_URL)
    res = client.chat(
        model=OLLAMA_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        options={"temperature": 0.0, "num_predict": 256},
    )
    return res["message"]["content"].strip()


_gemini_client = None
def call_gemini(prompt: str, system: str = SYSTEM_PROMPT, timeout: int = 60) -> str:
    global _gemini_client
    if _gemini_client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY 가 .env 에 없습니다.")
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_client = genai.GenerativeModel(GEMINI_MODEL, system_instruction=system)
    res = _gemini_client.generate_content(
        prompt,
        generation_config={"temperature": 0.0, "max_output_tokens": 256},
    )
    return (res.text or "").strip()


def retry_delay_from_error(message: str) -> float | None:
    """Gemini 429 에 포함된 retry delay 를 초 단위로 추출."""
    match = re.search(r"retry in ([0-9.]+)s", message, flags=re.IGNORECASE)
    if match:
        return float(match.group(1)) + 2.0
    match = re.search(r"retry_delay\s*\{\s*seconds:\s*(\d+)", message)
    if match:
        return float(match.group(1)) + 2.0
    return None


# ───────────────────── 실행 ─────────────────────
def load_scenarios(pilot: int | None) -> pd.DataFrame:
    df = pd.read_csv(SCENARIOS_CSV, encoding="utf-8-sig")
    df.columns = [c.lstrip("﻿") for c in df.columns]  # BOM 제거
    if pilot:
        # pilot: 각 패턴이 골고루 나오도록 페르소나 첫 N명 × 9 패턴
        n_personas = max(1, pilot // 9 + (1 if pilot % 9 else 0))
        pids = sorted(df["persona_id"].unique())[:n_personas]
        df = df[df["persona_id"].isin(pids)].head(pilot).reset_index(drop=True)
    return df


def load_done_ids(out_path: Path) -> set[str]:
    if not out_path.exists():
        return set()
    done = set()
    for line in out_path.open(encoding="utf-8"):
        try:
            rec = json.loads(line)
            if not rec.get("error"):
                done.add(rec["scenario_id"])
        except Exception:
            pass
    return done


def run_cell(
    cell_id: int,
    scenarios: pd.DataFrame,
    graph_rag,
    vector_rag,
    resume: bool,
    max_retries: int,
    sleep_s: float,
):
    cfg = CELLS[cell_id]
    rag = graph_rag if cfg["rag"] == "GraphRAG" else vector_rag
    llm_fn = call_dslm if cfg["llm"] == "DSLM" else call_gemini

    out_path = RESPONSES_DIR / f"cell{cell_id}.jsonl"
    done = load_done_ids(out_path) if resume else set()
    if done:
        print(f"  ↳ resume: 이미 {len(done)}건 완료, skip")

    mode = "a" if resume else "w"
    with out_path.open(mode, encoding="utf-8") as f:
        for i, row in scenarios.iterrows():
            sid = row["id"]
            if sid in done:
                continue
            t0 = time.time()
            err = None
            try:
                ret = rag.retrieve(row["persona_id"], row["question"])
                prompt = build_prompt(ret.contexts, row["question"])
                answer = ""
                for attempt in range(max_retries + 1):
                    try:
                        answer = llm_fn(prompt)
                        err = None
                        break
                    except Exception as e:
                        err = str(e)
                        if attempt >= max_retries:
                            raise
                        wait_s = retry_delay_from_error(err) or min(60.0, 2.0 ** attempt)
                        print(f"  [{cell_id}] retry {attempt+1}/{max_retries} after {wait_s:.1f}s — {err[:80]}")
                        time.sleep(wait_s)
                if sleep_s > 0:
                    time.sleep(sleep_s)
            except Exception as e:
                ret = None
                answer = ""
                err = str(e)
            rec = {
                "scenario_id": sid,
                "persona_id": row["persona_id"],
                "question": row["question"],
                "ground_truth": row["ground_truth"],
                "pattern": row["pattern"],
                "retrieved_contexts": ret.contexts if ret else [],
                "answer": answer,
                "cell": cell_id,
                "rag": cfg["rag"],
                "llm": cfg["llm"],
                "llm_model": OLLAMA_MODEL if cfg["llm"] == "DSLM" else GEMINI_MODEL,
                "latency_s": round(time.time() - t0, 2),
                "error": err,
            }
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            f.flush()
            if (i + 1) % 10 == 0 or err:
                tag = "❌" if err else "✓"
                print(f"  [{cell_id}] {tag} {i+1}/{len(scenarios)} {sid} ({rec['latency_s']}s)"
                      + (f" — {err[:80]}" if err else ""))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pilot", type=int, default=None, help="시나리오 처음 N개만 실행 (셀당)")
    ap.add_argument("--cells", type=str, default="1,2,3,4", help="실행할 셀 번호 (쉼표)")
    ap.add_argument("--resume", action="store_true", help="기존 결과에 이어서")
    ap.add_argument("--max-retries", type=int, default=3, help="LLM 호출 실패 시 재시도 횟수")
    ap.add_argument("--sleep", type=float, default=0.0, help="Gemini rate limit 완화를 위한 trial 간 대기초")
    args = ap.parse_args()

    cell_ids = [int(c) for c in args.cells.split(",")]

    # 시나리오 로드
    df = load_scenarios(args.pilot)
    print(f"[1] 시나리오: {len(df)} 개 (pilot={args.pilot})")

    # RAG 셀 로드
    print(f"[2] GraphRAG 로딩 (yaml-full-kg from {PERSONA_DIR.name}/)")
    graph_rag = GraphRAG(persona_dir=PERSONA_DIR)
    print(f"[3] VectorRAG 로딩 (chromadb + bge-m3, top_k=5)")
    vector_rag = VectorRAG(
        persona_dir=PERSONA_DIR,
        chroma_path=CHROMA_PATH,
        embedding_model="BAAI/bge-m3",
        top_k=5,
    )
    vector_rag._ensure_loaded()

    # LLM env 점검
    print(f"[4] DSLM (Ollama): {OLLAMA_BASE_URL} / {OLLAMA_MODEL}")
    if any(CELLS[c]["llm"] == "Gemini" for c in cell_ids):
        if not GEMINI_API_KEY:
            print("❌ GEMINI_API_KEY 미설정 — Gemini 셀(2,4) 실행 불가. .env 에 추가.")
            return 1
        print(f"[5] Gemini: {GEMINI_MODEL}")

    # 각 셀 실행
    for cid in cell_ids:
        print(f"\n=== Cell {cid} ({CELLS[cid]['rag']} + {CELLS[cid]['llm']}) ===")
        run_cell(cid, df, graph_rag, vector_rag, resume=args.resume,
                 max_retries=args.max_retries, sleep_s=args.sleep)

    print("\n✅ 완료")
    return 0


if __name__ == "__main__":
    sys.exit(main())
