"""Step 10 — Phase 1 H1 4-cell repeated-measures 2x2 ANOVA.

Input:
  data/results/ragas_vllm_scores.csv

Expected cells:
  cell1 = GraphRAG + DSLM
  cell2 = GraphRAG + Gemini
  cell3 = VectorRAG + DSLM
  cell4 = VectorRAG + Gemini

Because the same scenario_id is evaluated in all four cells, the statistically
matched design is a repeated-measures 2x2 ANOVA:
  within factors = RAG(Graph/Vector), LLM(DSLM/Gemini)
  subject = scenario_id
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats
from statsmodels.stats.anova import AnovaRM

ROOT = Path(__file__).resolve().parent.parent
RESULTS_DIR = ROOT / "data" / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

CELL_TO_FACTORS = {
    1: ("GraphRAG", "DSLM"),
    2: ("GraphRAG", "Gemini"),
    3: ("VectorRAG", "DSLM"),
    4: ("VectorRAG", "Gemini"),
}

METRICS = ["faithfulness", "answer_relevancy", "context_precision", "context_recall"]
ALPHA = 0.05
BONFERRONI_ALPHA = ALPHA / len(METRICS)


def fmt_p(p: float) -> str:
    if pd.isna(p):
        return "nan"
    if p < 0.001:
        return f"{p:.2e}"
    return f"{p:.4f}"


def shapiro_or_nan(values: pd.Series) -> tuple[float, float]:
    vals = pd.to_numeric(values, errors="coerce").dropna()
    if len(vals) < 3:
        return np.nan, np.nan
    w, p = stats.shapiro(vals)
    return float(w), float(p)


def wilcoxon_or_nan(values: pd.Series) -> tuple[float, float]:
    vals = pd.to_numeric(values, errors="coerce").dropna()
    if len(vals) < 1 or np.allclose(vals, 0):
        return np.nan, np.nan
    try:
        w, p = stats.wilcoxon(vals)
    except ValueError:
        return np.nan, np.nan
    return float(w), float(p)


def partial_eta_squared(f_value: float, df_effect: float, df_error: float) -> float:
    if pd.isna(f_value) or pd.isna(df_effect) or pd.isna(df_error):
        return np.nan
    return float((f_value * df_effect) / (f_value * df_effect + df_error))


def analyze_metric(df: pd.DataFrame, metric: str, lines: list[str]) -> dict:
    sub = df.loc[df["cell"].isin(CELL_TO_FACTORS), ["scenario_id", "cell", metric]].dropna()

    lines.append(f"\n## {metric}\n")
    desc = sub.groupby("cell")[metric].agg(["mean", "std", "count"]).round(4)
    lines.append("### Cell Descriptives\n")
    lines.append(desc.to_markdown() + "\n")

    lines.append("### Assumption Checks\n")
    for cell, group in sub.groupby("cell"):
        w, p = shapiro_or_nan(group[metric])
        lines.append(f"- Shapiro cell{cell}: W={w:.4f}, p={fmt_p(p)}")

    groups = [g[metric].dropna().to_numpy() for _, g in sub.groupby("cell")]
    if len(groups) == 4 and all(len(g) >= 2 for g in groups):
        lev_w, lev_p = stats.levene(*groups)
        lines.append(f"- Levene across 4 cells: W={lev_w:.4f}, p={fmt_p(float(lev_p))}")
    else:
        lines.append("- Levene across 4 cells: not available; all four cells are required")

    wide = sub.pivot_table(index="scenario_id", columns="cell", values=metric, aggfunc="first")
    wide = wide.reindex(columns=[1, 2, 3, 4])
    complete = wide.dropna(subset=[1, 2, 3, 4], how="any")
    lines.append(f"- Complete repeated-measures scenarios: n={len(complete)}")

    if len(complete) < 3:
        lines.append("\n반복측정 ANOVA 불가: 네 셀 모두 점수가 있는 scenario_id 가 3개 미만입니다.\n")
        return {
            "metric": metric,
            "n_complete": len(complete),
            "rag_delta_graph_minus_vector": np.nan,
            "rag_p": np.nan,
            "rag_partial_eta2": np.nan,
            "llm_p": np.nan,
            "interaction_p": np.nan,
            "h1_pass": False,
        }

    rag_contrast = ((complete[1] + complete[2]) / 2) - ((complete[3] + complete[4]) / 2)
    llm_contrast = ((complete[1] + complete[3]) / 2) - ((complete[2] + complete[4]) / 2)
    interaction_contrast = (complete[1] - complete[3]) - (complete[2] - complete[4])

    for name, values in [
        ("RAG contrast Graph-Vector", rag_contrast),
        ("LLM contrast DSLM-Gemini", llm_contrast),
        ("Interaction contrast", interaction_contrast),
    ]:
        w, p = shapiro_or_nan(values)
        ww, wp = wilcoxon_or_nan(values)
        lines.append(f"- Shapiro {name}: W={w:.4f}, p={fmt_p(p)}")
        lines.append(f"- Wilcoxon {name}: W={ww:.4f}, p={fmt_p(wp)}")

    long = (
        complete.reset_index()
        .melt(id_vars="scenario_id", value_vars=[1, 2, 3, 4],
              var_name="cell", value_name="score")
    )
    long["cell"] = long["cell"].astype(int)
    long["rag"] = long["cell"].map(lambda c: CELL_TO_FACTORS[c][0])
    long["llm"] = long["cell"].map(lambda c: CELL_TO_FACTORS[c][1])

    aov = AnovaRM(long, depvar="score", subject="scenario_id", within=["rag", "llm"]).fit()
    aov_table = aov.anova_table.copy()
    aov_table["partial_eta2"] = [
        partial_eta_squared(row["F Value"], row["Num DF"], row["Den DF"])
        for _, row in aov_table.iterrows()
    ]

    lines.append("\n### Repeated-Measures 2x2 ANOVA\n")
    lines.append(aov_table.round(6).to_markdown() + "\n")

    graph_mean = float(pd.concat([complete[1], complete[2]]).mean())
    vector_mean = float(pd.concat([complete[3], complete[4]]).mean())
    dslm_mean = float(pd.concat([complete[1], complete[3]]).mean())
    gemini_mean = float(pd.concat([complete[2], complete[4]]).mean())
    rag_delta = graph_mean - vector_mean
    llm_delta = dslm_mean - gemini_mean

    rag_p = float(aov_table.loc["rag", "Pr > F"])
    llm_p = float(aov_table.loc["llm", "Pr > F"])
    interaction_p = float(aov_table.loc["rag:llm", "Pr > F"])
    rag_eta = float(aov_table.loc["rag", "partial_eta2"])
    h1_pass = rag_p < BONFERRONI_ALPHA and rag_delta > 0

    lines.append("### Effect Means\n")
    lines.append(f"- GraphRAG mean = {graph_mean:.4f}")
    lines.append(f"- VectorRAG mean = {vector_mean:.4f}")
    lines.append(f"- GraphRAG - VectorRAG = {rag_delta:+.4f}")
    lines.append(f"- DSLM mean = {dslm_mean:.4f}")
    lines.append(f"- Gemini mean = {gemini_mean:.4f}")
    lines.append(f"- DSLM - Gemini = {llm_delta:+.4f}")
    lines.append(
        f"- H1 metric verdict: {'SUPPORT' if h1_pass else 'not support'} "
        f"(RAG p={fmt_p(rag_p)}, Bonferroni alpha={BONFERRONI_ALPHA:.4f})\n"
    )

    return {
        "metric": metric,
        "n_complete": len(complete),
        "graph_mean": round(graph_mean, 4),
        "vector_mean": round(vector_mean, 4),
        "rag_delta_graph_minus_vector": round(rag_delta, 4),
        "rag_p": rag_p,
        "rag_partial_eta2": rag_eta,
        "dslm_mean": round(dslm_mean, 4),
        "gemini_mean": round(gemini_mean, 4),
        "llm_delta_dslm_minus_gemini": round(llm_delta, 4),
        "llm_p": llm_p,
        "interaction_p": interaction_p,
        "h1_pass": h1_pass,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scores", default=str(RESULTS_DIR / "ragas_vllm_scores.csv"))
    ap.add_argument("--output-prefix", default="ragas_vllm_2x2")
    args = ap.parse_args()

    scores_path = Path(args.scores)
    df = pd.read_csv(scores_path, encoding="utf-8-sig")
    df["cell"] = df["cell"].astype(int)

    present_cells = sorted(df["cell"].dropna().astype(int).unique().tolist())
    missing = sorted(set(CELL_TO_FACTORS) - set(present_cells))

    lines = ["# Phase 1 H1 — 4-Cell Repeated-Measures 2x2 ANOVA\n"]
    lines.append(f"- Input: `{scores_path}`")
    lines.append(f"- Present cells: {present_cells}")
    lines.append("- Design: same scenario_id repeated across RAG and LLM conditions")
    lines.append("- Within factors: RAG(GraphRAG/VectorRAG), LLM(DSLM/Gemini)")
    lines.append(f"- Bonferroni alpha across 4 RAGAS metrics: {BONFERRONI_ALPHA:.4f}\n")

    if missing:
        lines.append(f"> Missing cells: {missing}. Gemini Cell2/Cell4 scores are needed for full 2x2 ANOVA.\n")

    metric_cols = [m for m in METRICS if m in df.columns]
    rows = [analyze_metric(df, metric, lines) for metric in metric_cols]
    summary = pd.DataFrame(rows)

    n_pass = int(summary["h1_pass"].sum()) if not summary.empty else 0
    verdict = "H1 SUPPORT" if n_pass >= 2 else f"H1 PARTIAL/NOT FULL SUPPORT ({n_pass}/{len(metric_cols)} metrics)"
    lines.insert(1, f"## Overall Verdict\n\n{verdict}\n")
    if not summary.empty:
        printable = summary.copy()
        for col in ["rag_p", "llm_p", "interaction_p", "rag_partial_eta2"]:
            if col in printable.columns:
                printable[col] = printable[col].map(lambda x: round(float(x), 6) if pd.notna(x) else x)
        lines.insert(2, printable.to_markdown(index=False) + "\n")

    out_md = RESULTS_DIR / f"{args.output_prefix}_repeated_anova.md"
    out_csv = RESULTS_DIR / f"{args.output_prefix}_repeated_anova_summary.csv"
    out_md.write_text("\n".join(lines), encoding="utf-8")
    summary.to_csv(out_csv, index=False, encoding="utf-8-sig")

    print(verdict)
    print(f"✅ {out_md}")
    print(f"✅ {out_csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
