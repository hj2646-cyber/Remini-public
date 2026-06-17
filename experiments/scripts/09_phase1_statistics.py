"""Step 9 — H1 가설 통계 검정 (2-way ANOVA + Tukey HSD).

입력:
  data/results/ragas_scores.csv

출력:
  data/results/h1_anova.md             (전체 결과)
  data/results/h1_anova_<metric>.csv   (메트릭별 ANOVA 표)

검정 흐름 (실험설계 v5 §2.8):
  1. Shapiro-Wilk     — 정규성 (셀별)
  2. Levene's test    — 등분산
  3. 2-way ANOVA      — factors: RAG (Graph/Vector), LLM (DSLM/Gemini), interaction
  4. Tukey HSD        — 4 셀 pairwise
  5. Cohen's d        — effect size (GraphRAG vs VectorRAG)

H1 입증 조건:
  - RAG main effect 의 p < .05 (Bonferroni 4 메트릭 보정 후 .0125)
  - 방향: GraphRAG mean > VectorRAG mean
  - 4 메트릭 중 최소 2개에서 위 조건 만족 (실험설계 v5 §2.8)
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats
import statsmodels.api as sm
from statsmodels.formula.api import ols
from statsmodels.stats.multicomp import pairwise_tukeyhsd

ROOT = Path(__file__).resolve().parent.parent
RESULTS_DIR = ROOT / "data" / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

# cell 번호 → factor 매핑
CELL_TO_FACTORS = {
    1: ("GraphRAG", "DSLM"),
    2: ("GraphRAG", "Gemini"),
    3: ("VectorRAG", "DSLM"),
    4: ("VectorRAG", "Gemini"),
}

METRICS = ["faithfulness", "answer_relevancy", "context_precision", "context_recall"]
ALPHA = 0.05
BONFERRONI_ALPHA = ALPHA / len(METRICS)  # 0.0125


def cohens_d(a: np.ndarray, b: np.ndarray) -> float:
    a, b = np.asarray(a, dtype=float), np.asarray(b, dtype=float)
    a, b = a[~np.isnan(a)], b[~np.isnan(b)]
    if len(a) < 2 or len(b) < 2:
        return float("nan")
    s = np.sqrt(((len(a) - 1) * a.var(ddof=1) + (len(b) - 1) * b.var(ddof=1))
                / (len(a) + len(b) - 2))
    return (a.mean() - b.mean()) / s if s > 0 else float("nan")


def analyze_metric(df: pd.DataFrame, metric: str, out_lines: list[str]):
    sub = df[["cell", "rag", "llm", metric]].dropna().copy()
    sub.columns = ["cell", "rag", "llm", "y"]

    out_lines.append(f"\n## {metric}\n")
    out_lines.append(f"N = {len(sub)} | Bonferroni α = {BONFERRONI_ALPHA:.4f}\n")

    # 1. 셀별 기술 통계
    desc = sub.groupby("cell")["y"].agg(["mean", "std", "count"]).round(4)
    out_lines.append("**셀별 평균**\n")
    out_lines.append(desc.to_markdown() + "\n")

    # 2. 정규성 & 등분산
    for cell, g in sub.groupby("cell"):
        if len(g) >= 3:
            w, p = stats.shapiro(g["y"])
            out_lines.append(f"- Shapiro cell{cell}: W={w:.3f}, p={p:.3f}")
    groups = [g["y"].values for _, g in sub.groupby("cell")]
    if all(len(g) >= 2 for g in groups):
        lev_w, lev_p = stats.levene(*groups)
        out_lines.append(f"- Levene: W={lev_w:.3f}, p={lev_p:.3f}\n")

    # 3. 2-way ANOVA
    model = ols("y ~ C(rag) * C(llm)", data=sub).fit()
    anova = sm.stats.anova_lm(model, typ=2)
    anova.to_csv(RESULTS_DIR / f"h1_anova_{metric}.csv", encoding="utf-8-sig")
    out_lines.append("**2-way ANOVA**\n")
    out_lines.append(anova.round(4).to_markdown() + "\n")

    rag_p = float(anova.loc["C(rag)", "PR(>F)"])
    llm_p = float(anova.loc["C(llm)", "PR(>F)"])
    inter_p = float(anova.loc["C(rag):C(llm)", "PR(>F)"])

    # 4. RAG main effect 방향 + Cohen's d
    g_y = sub.loc[sub["rag"] == "GraphRAG", "y"].values
    v_y = sub.loc[sub["rag"] == "VectorRAG", "y"].values
    direction = "GraphRAG > VectorRAG" if g_y.mean() > v_y.mean() else "VectorRAG > GraphRAG"
    d = cohens_d(g_y, v_y)
    out_lines.append(f"- **GraphRAG mean** = {g_y.mean():.4f} (n={len(g_y)})")
    out_lines.append(f"- **VectorRAG mean** = {v_y.mean():.4f} (n={len(v_y)})")
    out_lines.append(f"- 방향: **{direction}** | Cohen's d = {d:.3f}\n")

    # 5. Tukey HSD (4 셀)
    tukey = pairwise_tukeyhsd(sub["y"].values, sub["cell"].astype(str).values, alpha=ALPHA)
    out_lines.append("**Tukey HSD (4셀 pairwise)**\n")
    out_lines.append("```\n" + str(tukey) + "\n```\n")

    # 6. H1 검정 verdict (이 메트릭 단위)
    h1_pass = (rag_p < BONFERRONI_ALPHA) and (g_y.mean() > v_y.mean())
    verdict = "✅ H1 SUPPORT" if h1_pass else "❌ H1 not support"
    out_lines.append(f"### Verdict ({metric}): {verdict}")
    out_lines.append(f"- RAG main effect p = {rag_p:.4f} (Bonferroni α={BONFERRONI_ALPHA:.4f})")
    out_lines.append(f"- 방향: {direction}\n")

    return {
        "metric": metric,
        "n": len(sub),
        "graph_mean": round(g_y.mean(), 4),
        "vector_mean": round(v_y.mean(), 4),
        "delta": round(g_y.mean() - v_y.mean(), 4),
        "cohens_d": round(d, 3),
        "rag_p": round(rag_p, 4),
        "llm_p": round(llm_p, 4),
        "interaction_p": round(inter_p, 4),
        "h1_pass": h1_pass,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scores", default=str(RESULTS_DIR / "ragas_scores.csv"))
    args = ap.parse_args()

    df = pd.read_csv(args.scores, encoding="utf-8-sig")
    df["rag"] = df["cell"].map(lambda c: CELL_TO_FACTORS[int(c)][0])
    df["llm"] = df["cell"].map(lambda c: CELL_TO_FACTORS[int(c)][1])

    metrics_present = [m for m in METRICS if m in df.columns]
    print(f"평가 메트릭: {metrics_present}")
    print(f"전체 trial: {len(df)}")

    out_lines = ["# H1 통계 검정 결과 (2-way ANOVA + Tukey HSD)\n"]
    out_lines.append(f"실험설계 v5 §2.8 기준 — 4 메트릭 중 최소 2개에서 RAG main effect p<{BONFERRONI_ALPHA:.4f} + GraphRAG>VectorRAG 면 H1 SUPPORT\n")

    verdicts = []
    for m in metrics_present:
        verdicts.append(analyze_metric(df, m, out_lines))

    # 최종 verdict
    v_df = pd.DataFrame(verdicts)
    n_pass = int(v_df["h1_pass"].sum())
    final = "✅ **H1 SUPPORT**" if n_pass >= 2 else f"❌ **H1 NOT SUPPORT** ({n_pass}/4 메트릭만 통과)"
    out_lines.insert(2, f"## 종합 Verdict\n\n{final} — {n_pass}/{len(metrics_present)} 메트릭에서 통과\n")
    out_lines.insert(3, v_df.to_markdown(index=False) + "\n")

    out_path = RESULTS_DIR / "h1_anova.md"
    out_path.write_text("\n".join(out_lines), encoding="utf-8")
    print(f"\n{final}")
    print(f"✅ {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
