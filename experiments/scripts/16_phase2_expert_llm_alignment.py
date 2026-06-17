"""Step 16 — Compare GPT-5.4 LLM-as-judge scores with human expert scores.

This is a convergent-validity check, not an inter-rater reliability analysis.
The comparison is performed at the overlapping rubric level because the
GPT-5.4 judge scored 13 text-evaluable items across H2 scenarios, while the
expert survey file stores rubric-level DSLM/Gemini scores.
"""
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from scipy import stats

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
RESULTS_DIR = DATA_DIR / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


def fmt_p(p: float) -> str:
    if pd.isna(p):
        return "nan"
    if p < 0.001:
        return f"{p:.2e}"
    return f"{p:.4f}"


def sorted_questions(values: pd.Series | list[str]) -> list[str]:
    return sorted(set(values), key=lambda q: int(str(q).strip().upper().replace("Q", "")))


def correlation(x: pd.Series, y: pd.Series, method: str) -> tuple[float, float]:
    if len(x) < 3 or x.nunique() < 2 or y.nunique() < 2:
        return np.nan, np.nan
    if method == "pearson":
        result = stats.pearsonr(x, y)
        return float(result.statistic), float(result.pvalue)
    if method == "spearman":
        result = stats.spearmanr(x, y)
        return float(result.statistic), float(result.pvalue)
    raise ValueError(f"unknown method: {method}")


def load_scores(path: Path) -> pd.DataFrame:
    try:
        df = pd.read_csv(path, encoding="utf-8-sig")
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="cp949")
    required = {"question_id", "llm", "score"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"{path} 필수 컬럼 누락: {sorted(missing)}")
    df = df.copy()
    df["question_id"] = df["question_id"].astype(str).str.strip().str.upper()
    df["llm"] = df["llm"].astype(str).str.strip()
    df["score"] = pd.to_numeric(df["score"], errors="coerce")
    df = df.dropna(subset=["score"])
    return df


def summarize_model_question(df: pd.DataFrame, score_name: str) -> pd.DataFrame:
    group_cols = ["question_id", "llm"]
    if "area" in df.columns:
        group_cols.insert(1, "area")
    out = (
        df.groupby(group_cols, as_index=False)["score"]
        .mean()
        .rename(columns={"score": score_name})
    )
    if "area" not in out.columns:
        out["area"] = ""
    return out[["question_id", "area", "llm", score_name]]


def make_alignment(
    llm_df: pd.DataFrame,
    expert_df: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, dict[str, Any]]:
    common_questions = sorted_questions(set(llm_df["question_id"]) & set(expert_df["question_id"]))
    llm_sub = llm_df[llm_df["question_id"].isin(common_questions)].copy()
    expert_sub = expert_df[expert_df["question_id"].isin(common_questions)].copy()

    gpt_mean = summarize_model_question(llm_sub, "gpt54_mean")
    expert_mean = summarize_model_question(expert_sub, "expert_mean")
    target_df = expert_mean.merge(gpt_mean, on=["question_id", "area", "llm"], how="inner")
    target_df["signed_error_gpt54_minus_expert"] = target_df["gpt54_mean"] - target_df["expert_mean"]
    target_df["abs_error"] = target_df["signed_error_gpt54_minus_expert"].abs()

    expert_wide = expert_mean.pivot_table(index=["question_id", "area"], columns="llm", values="expert_mean").reset_index()
    gpt_wide = gpt_mean.pivot_table(index=["question_id", "area"], columns="llm", values="gpt54_mean").reset_index()
    expert_wide["expert_delta_dslm_minus_gemini"] = expert_wide["DSLM"] - expert_wide["Gemini"]
    gpt_wide["gpt54_delta_dslm_minus_gemini"] = gpt_wide["DSLM"] - gpt_wide["Gemini"]
    delta_df = expert_wide[["question_id", "area", "expert_delta_dslm_minus_gemini"]].merge(
        gpt_wide[["question_id", "area", "gpt54_delta_dslm_minus_gemini"]],
        on=["question_id", "area"],
        how="inner",
    )
    delta_df["expert_direction"] = np.select(
        [
            delta_df["expert_delta_dslm_minus_gemini"] > 0,
            delta_df["expert_delta_dslm_minus_gemini"] < 0,
        ],
        ["DSLM", "Gemini"],
        default="Tie",
    )
    delta_df["gpt54_direction"] = np.select(
        [
            delta_df["gpt54_delta_dslm_minus_gemini"] > 0,
            delta_df["gpt54_delta_dslm_minus_gemini"] < 0,
        ],
        ["DSLM", "Gemini"],
        default="Tie",
    )
    delta_df["direction_match"] = delta_df["expert_direction"] == delta_df["gpt54_direction"]
    delta_df["delta_error_gpt54_minus_expert"] = (
        delta_df["gpt54_delta_dslm_minus_gemini"] - delta_df["expert_delta_dslm_minus_gemini"]
    )
    delta_df["delta_abs_error"] = delta_df["delta_error_gpt54_minus_expert"].abs()
    delta_df = delta_df.sort_values("question_id", key=lambda s: s.str.extract(r"Q(\d+)")[0].astype(int))

    area_rows = []
    area_order = ["전체_13문항"] + [a for a in llm_sub["area"].dropna().unique().tolist() if a]
    for area in area_order:
        if area == "전체_13문항":
            e_sub = expert_sub
            g_sub = llm_sub
        else:
            e_sub = expert_sub[expert_sub["area"] == area]
            g_sub = llm_sub[llm_sub["area"] == area]
        e = e_sub.groupby("llm")["score"].mean()
        g = g_sub.groupby("llm")["score"].mean()
        area_rows.append({
            "area": area,
            "expert_dslm": e.get("DSLM", np.nan),
            "expert_gemini": e.get("Gemini", np.nan),
            "expert_delta_dslm_minus_gemini": e.get("DSLM", np.nan) - e.get("Gemini", np.nan),
            "gpt54_dslm": g.get("DSLM", np.nan),
            "gpt54_gemini": g.get("Gemini", np.nan),
            "gpt54_delta_dslm_minus_gemini": g.get("DSLM", np.nan) - g.get("Gemini", np.nan),
        })
    area_df = pd.DataFrame(area_rows)

    target_pearson_r, target_pearson_p = correlation(target_df["expert_mean"], target_df["gpt54_mean"], "pearson")
    target_spearman_rho, target_spearman_p = correlation(target_df["expert_mean"], target_df["gpt54_mean"], "spearman")
    delta_pearson_r, delta_pearson_p = correlation(
        delta_df["expert_delta_dslm_minus_gemini"],
        delta_df["gpt54_delta_dslm_minus_gemini"],
        "pearson",
    )
    delta_spearman_rho, delta_spearman_p = correlation(
        delta_df["expert_delta_dslm_minus_gemini"],
        delta_df["gpt54_delta_dslm_minus_gemini"],
        "spearman",
    )
    non_tie = delta_df[(delta_df["expert_direction"] != "Tie") & (delta_df["gpt54_direction"] != "Tie")]
    direction_match_n = int(delta_df["direction_match"].sum())
    direction_match_total = int(len(delta_df))

    metrics = {
        "common_questions": common_questions,
        "n_targets": int(len(target_df)),
        "n_questions": int(len(delta_df)),
        "target_pearson_r": target_pearson_r,
        "target_pearson_p": target_pearson_p,
        "target_spearman_rho": target_spearman_rho,
        "target_spearman_p": target_spearman_p,
        "target_mae": float(target_df["abs_error"].mean()),
        "target_rmse": float(np.sqrt(np.mean(target_df["signed_error_gpt54_minus_expert"] ** 2))),
        "target_signed_bias": float(target_df["signed_error_gpt54_minus_expert"].mean()),
        "delta_pearson_r": delta_pearson_r,
        "delta_pearson_p": delta_pearson_p,
        "delta_spearman_rho": delta_spearman_rho,
        "delta_spearman_p": delta_spearman_p,
        "delta_mae": float(delta_df["delta_abs_error"].mean()),
        "delta_rmse": float(np.sqrt(np.mean(delta_df["delta_error_gpt54_minus_expert"] ** 2))),
        "delta_signed_bias": float(delta_df["delta_error_gpt54_minus_expert"].mean()),
        "direction_match_n": direction_match_n,
        "direction_match_total": direction_match_total,
        "direction_match_rate": float(delta_df["direction_match"].mean()),
        "direction_match_binom_p_greater_than_chance": float(
            stats.binomtest(direction_match_n, direction_match_total, 0.5, alternative="greater").pvalue
        ),
        "direction_match_n_non_tie": int(non_tie["direction_match"].sum()),
        "direction_match_total_non_tie": int(len(non_tie)),
        "direction_match_rate_non_tie": float(non_tie["direction_match"].mean()) if len(non_tie) else np.nan,
        "overall_expert_delta": float(area_df.loc[area_df["area"] == "전체_13문항", "expert_delta_dslm_minus_gemini"].iloc[0]),
        "overall_gpt54_delta": float(area_df.loc[area_df["area"] == "전체_13문항", "gpt54_delta_dslm_minus_gemini"].iloc[0]),
    }
    return target_df, delta_df, area_df, metrics


def round_numeric(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    for col in out.columns:
        if out[col].dtype.kind in "fc":
            out[col] = out[col].map(lambda x: round(float(x), 4) if pd.notna(x) else x)
    return out


def build_report(target_df: pd.DataFrame, delta_df: pd.DataFrame, area_df: pd.DataFrame, metrics: dict[str, Any]) -> str:
    lines = ["# Phase 2 H2 — GPT-5.4 Judge vs Human Expert Alignment\n"]
    lines.append("- Purpose: compare GPT-5.4 LLM-as-judge scores with 6 human experts")
    lines.append("- Comparison level: overlapping text-evaluable rubric items, Q4 excluded")
    lines.append(f"- Overlapping questions: {', '.join(metrics['common_questions'])}")
    lines.append(f"- Score targets: {metrics['n_targets']} question × model cells")
    lines.append(f"- Direction targets: {metrics['n_questions']} question-level DSLM-Gemini deltas\n")

    lines.append("## Recommended Primary Metrics\n")
    lines.append(f"- Expert mean delta, DSLM-Gemini: {metrics['overall_expert_delta']:.4f}")
    lines.append(f"- GPT-5.4 mean delta, DSLM-Gemini: {metrics['overall_gpt54_delta']:.4f}")
    lines.append(f"- Delta-level Spearman rho: {metrics['delta_spearman_rho']:.4f} (p={fmt_p(metrics['delta_spearman_p'])})")
    lines.append(
        f"- Direction match: {metrics['direction_match_n']}/{metrics['direction_match_total']} "
        f"({metrics['direction_match_rate']:.1%}; exact binomial p={fmt_p(metrics['direction_match_binom_p_greater_than_chance'])})"
    )
    lines.append(f"- Delta MAE: {metrics['delta_mae']:.4f}")
    lines.append(f"- Delta RMSE: {metrics['delta_rmse']:.4f}\n")

    lines.append("## Alignment Metrics\n")
    lines.append(f"- Score-level Pearson r: {metrics['target_pearson_r']:.4f} (p={fmt_p(metrics['target_pearson_p'])})")
    lines.append(f"- Score-level Spearman rho: {metrics['target_spearman_rho']:.4f} (p={fmt_p(metrics['target_spearman_p'])})")
    lines.append(f"- Score-level MAE: {metrics['target_mae']:.4f}")
    lines.append(f"- Score-level RMSE: {metrics['target_rmse']:.4f}")
    lines.append(f"- Mean signed bias, GPT-5.4 minus expert: {metrics['target_signed_bias']:.4f}")
    lines.append(f"- Delta-level Pearson r: {metrics['delta_pearson_r']:.4f} (p={fmt_p(metrics['delta_pearson_p'])})")
    lines.append(f"- Delta-level Spearman rho: {metrics['delta_spearman_rho']:.4f} (p={fmt_p(metrics['delta_spearman_p'])})")
    lines.append(f"- Delta-level MAE: {metrics['delta_mae']:.4f}")
    lines.append(f"- Delta-level RMSE: {metrics['delta_rmse']:.4f}")
    lines.append(f"- Delta-level mean signed bias, GPT-5.4 minus expert: {metrics['delta_signed_bias']:.4f}")
    lines.append(
        f"- Direction match: {metrics['direction_match_n']}/{metrics['direction_match_total']} "
        f"({metrics['direction_match_rate']:.1%})"
    )
    lines.append("")

    lines.append("## Area-Level Direction\n")
    lines.append(round_numeric(area_df).to_markdown(index=False) + "\n")

    lines.append("## Question-Level Direction\n")
    lines.append(round_numeric(delta_df).to_markdown(index=False) + "\n")

    lines.append("## Largest Score-Level Differences\n")
    largest = target_df.sort_values("abs_error", ascending=False).head(8)
    lines.append(round_numeric(largest).to_markdown(index=False) + "\n")

    lines.append("## Interpretation\n")
    if metrics["delta_spearman_rho"] >= 0.7 and metrics["direction_match_rate"] >= 0.8:
        strength = "strong"
        caution = "This pattern supports a strong convergent-validity demonstration for classroom purposes."
    elif metrics["delta_spearman_rho"] >= 0.3 and metrics["direction_match_rate"] >= 0.6:
        strength = "moderate"
        caution = "This pattern supports a cautious, moderate convergent-validity interpretation."
    else:
        strength = "weak"
        caution = "This pattern should be interpreted as weak alignment rather than expert-equivalent judgment."

    lines.append(
        f"GPT-5.4 and the expert mean show {strength} delta-level alignment "
        f"(Spearman rho={metrics['delta_spearman_rho']:.4f}; "
        f"direction match={metrics['direction_match_n']}/{metrics['direction_match_total']})."
    )
    lines.append(
        f"Both evaluators show an aggregate DSLM-Gemini delta in the same direction "
        f"(expert={metrics['overall_expert_delta']:.4f}; GPT-5.4={metrics['overall_gpt54_delta']:.4f}). "
        f"{caution}"
    )
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--llm-scores", default=str(RESULTS_DIR / "phase2_survey_scores_long.csv"))
    ap.add_argument("--expert-scores", default=str(RESULTS_DIR / "phase2_expert_scores_long.csv"))
    ap.add_argument("--output-prefix", default="phase2_expert_llm_alignment")
    args = ap.parse_args()

    llm_df = load_scores(Path(args.llm_scores))
    expert_df = load_scores(Path(args.expert_scores))
    target_df, delta_df, area_df, metrics = make_alignment(llm_df, expert_df)

    target_csv = RESULTS_DIR / f"{args.output_prefix}_targets.csv"
    delta_csv = RESULTS_DIR / f"{args.output_prefix}_question_delta.csv"
    area_csv = RESULTS_DIR / f"{args.output_prefix}_area_summary.csv"
    report_md = RESULTS_DIR / f"{args.output_prefix}.md"

    target_df.to_csv(target_csv, index=False, encoding="utf-8-sig")
    delta_df.to_csv(delta_csv, index=False, encoding="utf-8-sig")
    area_df.to_csv(area_csv, index=False, encoding="utf-8-sig")
    report_md.write_text(build_report(target_df, delta_df, area_df, metrics), encoding="utf-8")

    print(f"✅ {target_csv}")
    print(f"✅ {delta_csv}")
    print(f"✅ {area_csv}")
    print(f"✅ {report_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
