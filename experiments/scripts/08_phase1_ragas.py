"""Step 8 — 4 메트릭 평가 (RAGAS 4 메트릭의 fact-QA 도메인 특화 변형, 임베딩 기반).

입력:
  data/responses/cell{1-4}.jsonl

출력:
  data/results/ragas_scores.csv
  data/results/ragas_summary.md

평가 메트릭 (RAGAS Es et al., EACL 2024 의 fact-QA 도메인 변형):

  Hybrid relevance = substring 토큰 매칭 ≥ 50% OR cosine ≥ τ_emb
  (fact-QA 에서 정확 매칭 우선 + 의역도 잡기)

  1. Faithfulness          = answer ↔ ground_truth 의 hybrid score
     "응답이 GT fact 를 충실히 담는가"

  2. Answer Relevancy      = cosine(question, answer)
     "응답이 질문 의도에 관련 있는가"

  3. Context Precision     = retrieved chunk 중 GT 와 relevant 한 chunk 비율
     "검색된 정보의 정확도"

  4. Context Recall        = retrieved chunks 안에 GT 정보가 있는가 (max score)
     "필요 정보(GT)가 검색됐는가"

LLM-as-Judge 회피 (gemma4 trial 당 90초 → 1080 trial 4.5일 비현실).
임베딩 (bge-m3, 4셀 동일) + substring 매칭으로 fast/fair/deterministic.

비용: 0 (로컬 임베딩만)
시간: 1080 trial ≈ 1분
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent

RESPONSES_DIR = ROOT / "data" / "responses"
RESULTS_DIR = ROOT / "data" / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

EMBED_MODEL = "BAAI/bge-m3"
EMB_THRESHOLD = 0.35       # 임베딩 cosine ≥ 0.35 면 의미적 매칭
TOKEN_MATCH_RATIO = 0.5    # GT 토큰의 ≥ 50% substring 매칭이면 relevant
MIN_TOKEN_LEN = 2          # 1글자 토큰 (조사 등) 제외


# ─────────────────── 데이터 로드 ───────────────────
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
            "answer": rec["answer"] or "",
            "contexts": rec["retrieved_contexts"] or [],
            "reference": str(rec["ground_truth"]),
            "cell": cell_id,
            "pattern": rec["pattern"],
        })
        if limit and len(rows) >= limit:
            break
    return pd.DataFrame(rows)


# ─────────────────── 임베딩 + 메트릭 ───────────────────
_embedder = None
def get_embedder():
    global _embedder
    if _embedder is None:
        from sentence_transformers import SentenceTransformer
        _embedder = SentenceTransformer(EMBED_MODEL)
    return _embedder


def embed(texts: list[str]) -> np.ndarray:
    """텍스트 리스트 → L2 정규화된 임베딩 행렬."""
    if not texts:
        return np.zeros((0, 1024))
    return get_embedder().encode(texts, normalize_embeddings=True, show_progress_bar=False)


def cosine(a: np.ndarray, b: np.ndarray) -> float:
    """L2 정규화된 벡터의 cosine = 내적."""
    return float(np.clip(np.dot(a, b), -1.0, 1.0))


def tokenize_gt(gt: str) -> list[str]:
    """GT 의 핵심 토큰 (≥ MIN_TOKEN_LEN 글자, 공백 분리)."""
    return [t for t in gt.strip().split() if len(t) >= MIN_TOKEN_LEN]


def token_match_ratio(target: str, gt_tokens: list[str]) -> float:
    """target 안에 GT 토큰이 substring 으로 몇 개 있는지 비율 (0~1)."""
    if not gt_tokens:
        return 0.0
    return sum(1 for t in gt_tokens if t in target) / len(gt_tokens)


def hybrid_relevant(target: str, gt: str, target_emb: np.ndarray, gt_emb: np.ndarray) -> tuple[bool, float]:
    """
    Hybrid relevance:
      - GT 토큰 ≥ 50% substring 매칭  → relevant (정확 매칭 우선)
      - 또는 cosine ≥ EMB_THRESHOLD   → relevant (의역 fallback)

    Return: (is_relevant, hybrid_score)
      hybrid_score = max(token_ratio, cosine) ∈ [0, 1]
    """
    gt_tokens = tokenize_gt(gt)
    ratio = token_match_ratio(target, gt_tokens)
    cos = cosine(target_emb, gt_emb)
    score = max(ratio, max(cos, 0.0))  # cosine 음수면 0 처리
    is_rel = (ratio >= TOKEN_MATCH_RATIO) or (cos >= EMB_THRESHOLD)
    return is_rel, score


def evaluate_row(row: dict, emb_cache: dict) -> dict:
    """1 trial 평가 → 4 메트릭 점수 (substring + 임베딩 하이브리드)."""
    def E(text: str) -> np.ndarray:
        if text not in emb_cache:
            emb_cache[text] = embed([text])[0]
        return emb_cache[text]

    q_text, a_text, ref_text = row["question"], row["answer"] or "", row["reference"]
    ctx_texts = row["contexts"] or []

    q_emb, ref_emb = E(q_text), E(ref_text)
    a_emb = E(a_text) if a_text else np.zeros_like(q_emb)
    ctx_embs = [E(c) for c in ctx_texts]

    # 1. Faithfulness — answer 가 GT fact 를 담는가 (hybrid)
    if a_text:
        _, faithfulness = hybrid_relevant(a_text, ref_text, a_emb, ref_emb)
    else:
        faithfulness = 0.0

    # 2. Answer Relevancy — question ↔ answer cosine (의미 관련성)
    answer_relevancy = cosine(q_emb, a_emb) if a_text else 0.0

    # 3. Context Precision — relevant chunk 비율
    if ctx_texts:
        rel_flags = [hybrid_relevant(c, ref_text, ce, ref_emb)[0]
                     for c, ce in zip(ctx_texts, ctx_embs)]
        context_precision = float(sum(rel_flags) / len(rel_flags))
    else:
        context_precision = 0.0

    # 4. Context Recall — best chunk 의 GT 매칭 점수 (max hybrid score)
    if ctx_texts:
        scores = [hybrid_relevant(c, ref_text, ce, ref_emb)[1]
                  for c, ce in zip(ctx_texts, ctx_embs)]
        context_recall = float(max(scores))
    else:
        context_recall = 0.0

    return {
        "faithfulness": round(faithfulness, 4),
        "answer_relevancy": round(answer_relevancy, 4),
        "context_precision": round(context_precision, 4),
        "context_recall": round(context_recall, 4),
    }


# ─────────────────── 메인 ───────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cells", default="1,2,3,4")
    ap.add_argument("--limit", type=int, default=None, help="cell 당 첫 N건만 (pilot)")
    args = ap.parse_args()

    cells = [int(c) for c in args.cells.split(",")]

    print(f"[1] 임베딩 모델 로드: {EMBED_MODEL}")
    get_embedder()
    print(f"[2] 평가 시작 — 4 메트릭 (fact-QA 변형, bge-m3 cosine)")

    all_rows = []
    emb_cache: dict = {}  # 텍스트 → 임베딩 (중복 question/ref 캐싱)

    for cid in cells:
        df = load_cell(cid, args.limit)
        print(f"\n=== Cell {cid}: {len(df)} trial ===")
        for _, row in df.iterrows():
            metrics = evaluate_row(row.to_dict(), emb_cache)
            metrics.update({
                "scenario_id": row["scenario_id"],
                "cell": cid,
                "pattern": row["pattern"],
            })
            all_rows.append(metrics)

    scores_df = pd.DataFrame(all_rows)
    scores_df.to_csv(RESULTS_DIR / "ragas_scores.csv",
                     index=False, encoding="utf-8-sig")
    print(f"\n[저장] {RESULTS_DIR / 'ragas_scores.csv'} ({len(scores_df)} rows)")

    # 셀별 평균
    metric_cols = ["faithfulness", "answer_relevancy",
                   "context_precision", "context_recall"]
    summary = scores_df.groupby("cell")[metric_cols].mean().round(4)
    print("\n=== 셀별 평균 (4 메트릭) ===")
    print(summary.to_markdown())

    # 패턴별 평균
    pattern_summary = scores_df.groupby(["cell", "pattern"])[metric_cols].mean().round(4)

    with (RESULTS_DIR / "ragas_summary.md").open("w", encoding="utf-8") as f:
        f.write("# Phase 1 평가 결과 (RAGAS 4 메트릭의 fact-QA 변형, bge-m3 기반)\n\n")
        f.write("## 셀별 평균\n\n")
        f.write(summary.to_markdown() + "\n\n")
        f.write("## 패턴별 평균\n\n")
        f.write(pattern_summary.to_markdown() + "\n")

    print(f"\n✅ {RESULTS_DIR / 'ragas_summary.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
