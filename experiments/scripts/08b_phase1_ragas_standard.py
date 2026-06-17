"""Step 8b — RAGAS 표준 4 메트릭 평가 (Es et al., EACL 2024 그대로).

LLM-as-Judge: Groq Llama 3.3 70B Versatile (무료 API)
Embedding:    bge-m3 (로컬)

vs `08_phase1_ragas.py` (자체 hybrid) — 같은 응답 데이터로 RAGAS 표준 평가 추가.
두 결과 비교가 학술 contribution: "도메인 hybrid 와 RAGAS 표준이 같은 방향" 검증.

입력:
  data/responses/cell{1-4}.jsonl

출력:
  data/results/ragas_standard_scores.csv
  data/results/ragas_standard_summary.md
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT.parent / ".env")

RESPONSES_DIR = ROOT / "data" / "responses"
RESULTS_DIR = ROOT / "data" / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
JUDGE_MODEL = os.getenv("RAGAS_JUDGE_MODEL", "llama-3.3-70b-versatile")  # Groq
EMBED_MODEL = "BAAI/bge-m3"


def load_cell(cell_id: int, limit: int | None) -> pd.DataFrame:
    path = RESPONSES_DIR / f"cell{cell_id}.jsonl"
    if not path.exists():
        raise FileNotFoundError(f"{path} 없음 — 먼저 07_phase1_run.py 실행")
    rows = []
    for line in path.open(encoding="utf-8"):
        rec = json.loads(line)
        if rec.get("error"):
            continue
        rows.append({
            "scenario_id": rec["scenario_id"],
            "question": rec["question"],
            "answer": rec["answer"] or "정보 없음",  # 빈 응답이면 RAGAS 가 error
            "contexts": rec["retrieved_contexts"] or [""],
            "reference": str(rec["ground_truth"]),
            "cell": cell_id,
            "pattern": rec["pattern"],
        })
        if limit and len(rows) >= limit:
            break
    return pd.DataFrame(rows)


def build_judge():
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY 가 .env 에 없습니다.")
    from langchain_groq import ChatGroq
    from langchain_huggingface import HuggingFaceEmbeddings
    from ragas.llms import LangchainLLMWrapper
    from ragas.embeddings import LangchainEmbeddingsWrapper

    judge = LangchainLLMWrapper(ChatGroq(
        model=JUDGE_MODEL,
        api_key=GROQ_API_KEY,
        temperature=0.0,
        max_tokens=1024,
        # Groq free tier rate limit: 30 RPM, 14,400 RPD
        # RAGAS 내부 retry 가 알아서 backoff
    ))
    embed = LangchainEmbeddingsWrapper(HuggingFaceEmbeddings(
        model_name=EMBED_MODEL,
        encode_kwargs={"normalize_embeddings": True},
    ))
    return judge, embed


def run_ragas(df: pd.DataFrame, judge, embed):
    from datasets import Dataset
    from ragas import evaluate
    from ragas.metrics import (
        Faithfulness, AnswerRelevancy, ContextPrecision, ContextRecall,
    )
    from ragas.run_config import RunConfig

    metrics = [
        Faithfulness(llm=judge),
        AnswerRelevancy(llm=judge, embeddings=embed),
        ContextPrecision(llm=judge),
        ContextRecall(llm=judge),
    ]

    ds = Dataset.from_pandas(df[["question", "answer", "contexts", "reference"]])
    # Groq free tier 30 RPM → max_workers 4 정도 (안전 마진)
    rc = RunConfig(max_workers=4, timeout=300)
    result = evaluate(ds, metrics=metrics, llm=judge, embeddings=embed,
                       raise_exceptions=False, run_config=rc)
    return result.to_pandas()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cells", default="1,2,3,4")
    ap.add_argument("--limit", type=int, default=None, help="cell 당 첫 N건만 (pilot)")
    args = ap.parse_args()

    cells = [int(c) for c in args.cells.split(",")]
    print(f"[1] Judge: Groq / {JUDGE_MODEL}")
    print(f"[2] Embed: {EMBED_MODEL}")
    judge, embed = build_judge()

    all_scores = []
    for cid in cells:
        print(f"\n=== Cell {cid} RAGAS 표준 평가 ===")
        df = load_cell(cid, args.limit)
        print(f"  trial: {len(df)}")
        t0 = time.time()
        scores = run_ragas(df, judge, embed)
        elapsed = time.time() - t0
        print(f"  완료: {elapsed:.1f}s ({elapsed/len(df):.2f}s/trial)")
        scores["cell"] = cid
        scores["scenario_id"] = df["scenario_id"].values
        scores["pattern"] = df["pattern"].values
        all_scores.append(scores)
        # 셀별 단독 저장 (resume 안전)
        scores.to_csv(RESULTS_DIR / f"ragas_standard_cell{cid}.csv",
                      index=False, encoding="utf-8-sig")

    merged = pd.concat(all_scores, ignore_index=True)
    merged.to_csv(RESULTS_DIR / "ragas_standard_scores.csv",
                  index=False, encoding="utf-8-sig")
    print(f"\n[저장] {RESULTS_DIR / 'ragas_standard_scores.csv'} ({len(merged)} rows)")

    metric_cols = [c for c in ("faithfulness", "answer_relevancy",
                               "context_precision", "context_recall") if c in merged.columns]
    summary = merged.groupby("cell")[metric_cols].mean(numeric_only=True).round(4)
    nan_rates = merged.groupby("cell")[metric_cols].apply(lambda x: x.isna().mean()).round(3)
    print("\n=== 셀별 평균 (NaN 제외) ===")
    print(summary.to_markdown())
    print("\n=== NaN 비율 (낮을수록 좋음) ===")
    print(nan_rates.to_markdown())

    with (RESULTS_DIR / "ragas_standard_summary.md").open("w", encoding="utf-8") as f:
        f.write("# Phase 1 RAGAS 표준 결과 (Groq Llama 3.3 70B as Judge)\n\n")
        f.write("## 셀별 평균\n\n")
        f.write(summary.to_markdown() + "\n\n")
        f.write("## NaN 비율\n\n")
        f.write(nan_rates.to_markdown() + "\n\n")
        f.write("## 패턴별 평균\n\n")
        f.write(merged.groupby(["cell", "pattern"])[metric_cols].mean(numeric_only=True).round(4).to_markdown())

    print(f"\n✅ {RESULTS_DIR / 'ragas_standard_summary.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
