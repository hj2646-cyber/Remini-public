"""Step 14 — Phase 2 H2 survey LLM-as-Judge statistics.

Input:
  data/results/phase2_judge_raw.jsonl

Outputs:
  data/results/phase2_survey_scores_long.csv
  data/results/phase2_survey_area_summary.csv
  data/results/phase2_survey_stats.md
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from scipy import stats

ROOT = Path(__file__).resolve().parent.parent
RESULTS_DIR = ROOT / "data" / "results"

QUESTION_AREAS = {
    **{f"Q{i}": "AI와의 상호작용" for i in range(1, 4)},
    **{f"Q{i}": "임상적 타당성" for i in range(5, 9)},
    **{f"Q{i}": "안정성과 윤리" for i in range(9, 15)},
}
AREA_ORDER = ["AI와의 상호작용", "임상적 타당성", "안정성과 윤리", "전체"]
ALPHA = 0.05
BONFERRONI_ALPHA = ALPHA / 3


def fmt_p(p: float) -> str:
    if pd.isna(p):
        return "nan"
    if p < 0.001:
        return f"{p:.2e}"
    return f"{p:.4f}"


def score_from_item(item: dict[str, Any], label: str) -> float | None:
    keys = [label, label.lower(), f"model_{label.lower()}", f"model_{label.lower()}_score", f"{label}_score"]
    for key in keys:
        if key in item:
            try:
                return float(item[key])
            except (TypeError, ValueError):
                return None
    return None


def normalize_items(items: Any) -> list[tuple[str, dict[str, Any]]]:
    if isinstance(items, dict):
        return [(str(k).upper(), v) for k, v in items.items() if isinstance(v, dict)]
    if isinstance(items, list):
        out = []
        for v in items:
            if not isinstance(v, dict):
                continue
            qid = str(v.get("id") or v.get("question_id") or "").upper()
            if qid:
                out.append((qid, v))
        return out
    return []


def load_long(path: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    rows = []
    pref_rows = []
    with path.open(encoding="utf-8") as f:
        for line in f:
            rec = json.loads(line)
            if rec.get("error") or not rec.get("parsed"):
                continue
            parsed = rec["parsed"]
            model_for_label = {"A": rec["model_a_llm"], "B": rec["model_b_llm"]}
            pref = str(parsed.get("overall_preference", "Tie")).strip()
            if pref in model_for_label:
                winner = model_for_label[pref]
            else:
                winner = "Tie"
            pref_rows.append({
                "scenario_id": rec["scenario_id"],
                "repetition": int(rec["repetition"]),
                "winner": winner,
                "overall_preference": pref,
                "model_a_llm": rec["model_a_llm"],
                "model_b_llm": rec["model_b_llm"],
                "confidence": parsed.get("confidence"),
            })

            for qid, item in normalize_items(parsed.get("items")):
                if qid not in QUESTION_AREAS:
                    continue
                for label in ["A", "B"]:
                    score = score_from_item(item, label)
                    if score is None:
                        continue
                    rows.append({
                        "scenario_id": rec["scenario_id"],
                        "category_id": rec.get("category_id"),
                        "category": rec.get("category"),
                        "persona_id": rec.get("persona_id"),
                        "repetition": int(rec["repetition"]),
                        "judge_model": rec.get("judge_model"),
                        "question_id": qid,
                        "area": QUESTION_AREAS[qid],
                        "order_label": label,
                        "llm": model_for_label[label],
                        "score": score,
                        "rationale": item.get("rationale", ""),
                    })
    return pd.DataFrame(rows), pd.DataFrame(pref_rows)


def cronbach_alpha(wide: pd.DataFrame) -> float:
    clean = wide.dropna(axis=0, how="any")
    if clean.shape[0] < 2 or clean.shape[1] < 2:
        return np.nan
    k = clean.shape[1]
    item_vars = clean.var(axis=0, ddof=1).sum()
    total_var = clean.sum(axis=1).var(ddof=1)
    if total_var == 0:
        return np.nan
    return float(k / (k - 1) * (1 - item_vars / total_var))


def cohen_dz(diff: pd.Series) -> float:
    vals = pd.to_numeric(diff, errors="coerce").dropna()
    if len(vals) < 2:
        return np.nan
    sd = vals.std(ddof=1)
    if sd == 0:
        return np.nan
    return float(vals.mean() / sd)


def analyze_area(area_df: pd.DataFrame, area: str) -> dict[str, Any]:
    by_scenario = (
        area_df.groupby(["scenario_id", "llm"], as_index=False)["score"]
        .mean()
        .pivot(index="scenario_id", columns="llm", values="score")
    )
    if not {"DSLM", "Gemini"} <= set(by_scenario.columns):
        return {"area": area, "n": 0}
    paired = by_scenario[["DSLM", "Gemini"]].dropna()
    diff = paired["DSLM"] - paired["Gemini"]
    if len(diff) >= 3:
        shapiro_w, shapiro_p = stats.shapiro(diff)
    else:
        shapiro_w, shapiro_p = np.nan, np.nan
    try:
        wilcoxon_w, wilcoxon_p = stats.wilcoxon(diff)
    except ValueError:
        wilcoxon_w, wilcoxon_p = np.nan, np.nan
    if len(diff) >= 2:
        t_stat, t_p = stats.ttest_rel(paired["DSLM"], paired["Gemini"])
    else:
        t_stat, t_p = np.nan, np.nan
    return {
        "area": area,
        "n": len(paired),
        "dslm_mean": float(paired["DSLM"].mean()) if len(paired) else np.nan,
        "gemini_mean": float(paired["Gemini"].mean()) if len(paired) else np.nan,
        "delta_dslm_minus_gemini": float(diff.mean()) if len(diff) else np.nan,
        "shapiro_w": float(shapiro_w) if not pd.isna(shapiro_w) else np.nan,
        "shapiro_p": float(shapiro_p) if not pd.isna(shapiro_p) else np.nan,
        "wilcoxon_w": float(wilcoxon_w) if not pd.isna(wilcoxon_w) else np.nan,
        "wilcoxon_p": float(wilcoxon_p) if not pd.isna(wilcoxon_p) else np.nan,
        "paired_t": float(t_stat) if not pd.isna(t_stat) else np.nan,
        "paired_t_p": float(t_p) if not pd.isna(t_p) else np.nan,
        "cohen_dz": cohen_dz(diff),
    }


def build_report(long_df: pd.DataFrame, pref_df: pd.DataFrame, summary: pd.DataFrame) -> str:
    lines = ["# Phase 2 H2 — 14-item Survey LLM-as-Judge Statistics\n"]
    lines.append("- Design: paired DSLM vs Gemini conversations by scenario_id")
    lines.append("- Unit: 30 patient turns + 30 assistant responses per model conversation")
    lines.append("- Rubric: docs/평가설문지.hwp 14-item survey")
    lines.append("- LLM text judge uses 13 text-evaluable items: Q1-Q3 and Q5-Q14")
    lines.append("- Excluded from text judge: Q4(answer speed and voice), evaluated separately by system latency/TTS or human listening")
    lines.append(f"- Bonferroni alpha across 3 areas: {BONFERRONI_ALPHA:.4f}\n")

    printable = summary.copy()
    for col in printable.columns:
        if printable[col].dtype.kind in "fc":
            printable[col] = printable[col].map(lambda x: round(float(x), 4) if pd.notna(x) else x)
    lines.append("## Area-Level Paired Tests\n")
    lines.append(printable.to_markdown(index=False) + "\n")

    lines.append("## Reliability / Stability\n")
    wide_all = long_df.pivot_table(
        index=["scenario_id", "repetition", "llm"],
        columns="question_id",
        values="score",
        aggfunc="mean",
    )
    for llm, sub in wide_all.groupby(level="llm"):
        alpha = cronbach_alpha(sub.droplevel("llm"))
        lines.append(f"- Cronbach's alpha ({llm}, 13 text items): {alpha:.4f}" if pd.notna(alpha) else f"- Cronbach's alpha ({llm}, 13 text items): nan")

    rep_sd = (
        long_df.groupby(["scenario_id", "llm", "question_id"])["score"]
        .std()
        .dropna()
    )
    lines.append(f"- Judge self-consistency SD mean: {rep_sd.mean():.4f}" if len(rep_sd) else "- Judge self-consistency SD mean: nan")
    lines.append("")

    if not pref_df.empty:
        counts = pref_df["winner"].value_counts()
        dslm_wins = int(counts.get("DSLM", 0))
        gemini_wins = int(counts.get("Gemini", 0))
        ties = int(counts.get("Tie", 0))
        non_tie = dslm_wins + gemini_wins
        p = stats.binomtest(dslm_wins, non_tie, 0.5, alternative="greater").pvalue if non_tie else np.nan
        lines.append("## Overall Preference\n")
        lines.append(f"- DSLM wins: {dslm_wins}")
        lines.append(f"- Gemini wins: {gemini_wins}")
        lines.append(f"- Tie: {ties}")
        lines.append(f"- Binomial p(DSLM > Gemini, ties excluded): {fmt_p(p)}\n")

    lines.append("## Interpretation Template\n")
    lines.append(
        "H2 is supported if DSLM scores higher than Gemini in the primary survey areas "
        "and the paired Wilcoxon tests remain significant after Bonferroni correction. "
        "If only some areas pass, report H2 as partially supported."
    )
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default=str(RESULTS_DIR / "phase2_judge_raw.jsonl"))
    ap.add_argument("--output-prefix", default="phase2_survey")
    args = ap.parse_args()

    raw_path = Path(args.input)
    long_df, pref_df = load_long(raw_path)
    if long_df.empty:
        print("❌ judge score rows 없음")
        return 1

    score_csv = RESULTS_DIR / f"{args.output_prefix}_scores_long.csv"
    pref_csv = RESULTS_DIR / f"{args.output_prefix}_preferences.csv"
    long_df.to_csv(score_csv, index=False, encoding="utf-8-sig")
    pref_df.to_csv(pref_csv, index=False, encoding="utf-8-sig")

    frames = [long_df]
    area_rows = []
    for area in AREA_ORDER:
        if area == "전체":
            sub = long_df.copy()
        else:
            sub = long_df[long_df["area"] == area].copy()
        area_rows.append(analyze_area(sub, area))
    summary = pd.DataFrame(area_rows)
    summary_csv = RESULTS_DIR / f"{args.output_prefix}_area_summary.csv"
    summary.to_csv(summary_csv, index=False, encoding="utf-8-sig")

    report = build_report(long_df, pref_df, summary)
    report_md = RESULTS_DIR / f"{args.output_prefix}_stats.md"
    report_md.write_text(report, encoding="utf-8")

    print(f"✅ {score_csv}")
    print(f"✅ {pref_csv}")
    print(f"✅ {summary_csv}")
    print(f"✅ {report_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
