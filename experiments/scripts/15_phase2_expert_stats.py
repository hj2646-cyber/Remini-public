"""Step 15 — Phase 2 H2 human expert survey statistics.

Input:
  data/expert/phase2_expert_scores.csv

Expected long-format columns:
  rater_id,response_date,scenario_id,question_id,llm,score,model_label,comment

Append tomorrow's additional expert by adding rows with a new rater_id
(for example E06) to the same CSV, then rerun this script.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from scipy import stats

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
EXPERT_DIR = DATA_DIR / "expert"
RESULTS_DIR = DATA_DIR / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

QUESTION_AREAS = {
    **{f"Q{i}": "AI와의 상호작용" for i in range(1, 5)},
    **{f"Q{i}": "임상적 타당성" for i in range(5, 9)},
    **{f"Q{i}": "안정성과 윤리" for i in range(9, 15)},
}
AREA_ORDER = ["AI와의 상호작용", "임상적 타당성", "안정성과 윤리", "전체_14문항"]
REQUIRED_COLUMNS = ["rater_id", "scenario_id", "question_id", "llm", "score"]
WIDE_SCORE_RE = re.compile(r"^(?P<rater>E\d{2,})_(?P<llm>DSLM|Gemini)$")
ALPHA = 0.05
BONFERRONI_ALPHA = ALPHA / 3


def fmt_p(p: float) -> str:
    if pd.isna(p):
        return "nan"
    if p < 0.001:
        return f"{p:.2e}"
    return f"{p:.4f}"


def cohen_dz(diff: pd.Series) -> float:
    vals = pd.to_numeric(diff, errors="coerce").dropna()
    if len(vals) < 2:
        return np.nan
    sd = vals.std(ddof=1)
    if sd == 0:
        return np.nan
    return float(vals.mean() / sd)


def question_sort_key(series: pd.Series) -> pd.Series:
    return series.astype(str).str.extract(r"Q(\d+)")[0].astype(int)


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


def normalize_llm(value: Any) -> str:
    text = str(value).strip()
    lowered = text.lower()
    if lowered in {"dslm", "remini", "our", "ours", "model a dslm", "a_dslm"}:
        return "DSLM"
    if lowered in {"gemini", "gemini 2.5 flash", "gemini-2.5-flash", "model b gemini", "b_gemini"}:
        return "Gemini"
    if text in {"DSLM", "Gemini"}:
        return text
    return text


def wide_score_columns(columns: list[str]) -> list[tuple[str, str, str]]:
    out = []
    for col in columns:
        match = WIDE_SCORE_RE.match(str(col).strip())
        if match:
            out.append((col, match.group("rater"), match.group("llm")))
    return out


def wide_to_long(df: pd.DataFrame) -> pd.DataFrame:
    score_cols = wide_score_columns(list(df.columns))
    if not score_cols:
        return df
    if "question_id" not in df.columns:
        raise ValueError("wide CSV에는 question_id 컬럼이 필요합니다.")

    rows = []
    for _, row in df.iterrows():
        question_id = str(row.get("question_id", "")).strip().upper()
        scenario_id = str(row.get("scenario_id", "") or "H2-EXPERT-01").strip()
        response_date = str(row.get("response_date", "") or "").strip()
        for col, rater_id, llm in score_cols:
            score = row.get(col)
            if pd.isna(score) or str(score).strip() == "":
                continue
            rows.append({
                "rater_id": rater_id,
                "response_date": response_date,
                "scenario_id": scenario_id,
                "question_id": question_id,
                "llm": llm,
                "score": score,
                "model_label": llm,
                "comment": "",
            })
    return pd.DataFrame(rows, columns=[
        "rater_id",
        "response_date",
        "scenario_id",
        "question_id",
        "llm",
        "score",
        "model_label",
        "comment",
    ])


def load_scores(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"{path} 없음. phase2_expert_scores.csv 템플릿을 먼저 만드세요.")
    try:
        df = pd.read_csv(path, encoding="utf-8-sig")
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="cp949")
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        if wide_score_columns(list(df.columns)):
            df = wide_to_long(df)
        else:
            raise ValueError(f"필수 컬럼 누락: {missing}")
    if df.empty:
        return df

    df = df.copy()
    df["rater_id"] = df["rater_id"].astype(str).str.strip()
    df["scenario_id"] = df["scenario_id"].astype(str).str.strip()
    df["question_id"] = df["question_id"].astype(str).str.strip().str.upper()
    df["llm"] = df["llm"].map(normalize_llm)
    df["score"] = pd.to_numeric(df["score"], errors="coerce")
    df["area"] = df["question_id"].map(QUESTION_AREAS)

    bad_q = sorted(df.loc[df["area"].isna(), "question_id"].dropna().unique())
    if bad_q:
        raise ValueError(f"알 수 없는 question_id: {bad_q}. Q1~Q14 형식이어야 합니다.")
    bad_llm = sorted(set(df["llm"].dropna()) - {"DSLM", "Gemini"})
    if bad_llm:
        raise ValueError(f"llm 컬럼은 DSLM/Gemini 여야 합니다. 발견: {bad_llm}")
    bad_score = df["score"].isna() | (df["score"] < 1) | (df["score"] > 5)
    if bad_score.any():
        sample = df.loc[bad_score, ["rater_id", "scenario_id", "question_id", "llm", "score"]].head(10)
        raise ValueError(f"score는 1~5 숫자여야 합니다. 문제 행 예시:\n{sample}")

    key_cols = ["rater_id", "scenario_id", "question_id", "llm"]
    dup = df.duplicated(key_cols, keep=False)
    if dup.any():
        sample = df.loc[dup, key_cols + ["score"]].head(10)
        raise ValueError(f"중복 점수 행이 있습니다. 같은 key는 1행만 허용합니다:\n{sample}")
    return df


def paired_units(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.groupby(["rater_id", "scenario_id", "area", "llm"], as_index=False)["score"]
        .mean()
        .pivot_table(index=["rater_id", "scenario_id", "area"], columns="llm", values="score")
        .reset_index()
    )


def analyze_area(df: pd.DataFrame, area: str) -> dict[str, Any]:
    if area == "전체_14문항":
        sub = (
            df.groupby(["rater_id", "scenario_id", "llm"], as_index=False)["score"]
            .mean()
            .pivot_table(index=["rater_id", "scenario_id"], columns="llm", values="score")
        )
    else:
        sub = (
            df[df["area"] == area]
            .groupby(["rater_id", "scenario_id", "llm"], as_index=False)["score"]
            .mean()
            .pivot_table(index=["rater_id", "scenario_id"], columns="llm", values="score")
        )
    if not {"DSLM", "Gemini"} <= set(sub.columns):
        return {"area": area, "n_units": 0}
    paired = sub[["DSLM", "Gemini"]].dropna()
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
        paired_t, paired_t_p = stats.ttest_rel(paired["DSLM"], paired["Gemini"])
    else:
        paired_t, paired_t_p = np.nan, np.nan
    return {
        "area": area,
        "n_units": int(len(paired)),
        "dslm_mean": float(paired["DSLM"].mean()) if len(paired) else np.nan,
        "gemini_mean": float(paired["Gemini"].mean()) if len(paired) else np.nan,
        "delta_dslm_minus_gemini": float(diff.mean()) if len(diff) else np.nan,
        "shapiro_w": float(shapiro_w) if pd.notna(shapiro_w) else np.nan,
        "shapiro_p": float(shapiro_p) if pd.notna(shapiro_p) else np.nan,
        "wilcoxon_w": float(wilcoxon_w) if pd.notna(wilcoxon_w) else np.nan,
        "wilcoxon_p": float(wilcoxon_p) if pd.notna(wilcoxon_p) else np.nan,
        "paired_t": float(paired_t) if pd.notna(paired_t) else np.nan,
        "paired_t_p": float(paired_t_p) if pd.notna(paired_t_p) else np.nan,
        "cohen_dz": cohen_dz(diff),
    }


def question_summary(df: pd.DataFrame) -> pd.DataFrame:
    wide = (
        df.groupby(["question_id", "area", "llm"], as_index=False)["score"]
        .mean()
        .pivot_table(index=["question_id", "area"], columns="llm", values="score")
        .reset_index()
    )
    if {"DSLM", "Gemini"} <= set(wide.columns):
        wide["delta_dslm_minus_gemini"] = wide["DSLM"] - wide["Gemini"]
    return wide.sort_values("question_id", key=lambda s: s.str.extract(r"Q(\d+)")[0].astype(int))


def rater_summary(df: pd.DataFrame) -> pd.DataFrame:
    wide = (
        df.groupby(["rater_id", "llm"], as_index=False)["score"]
        .mean()
        .pivot_table(index="rater_id", columns="llm", values="score")
        .reset_index()
    )
    if {"DSLM", "Gemini"} <= set(wide.columns):
        wide["delta_dslm_minus_gemini"] = wide["DSLM"] - wide["Gemini"]
        wide["inferred_winner"] = np.select(
            [wide["delta_dslm_minus_gemini"] > 0, wide["delta_dslm_minus_gemini"] < 0],
            ["DSLM", "Gemini"],
            default="Tie",
        )
    return wide


def cronbach_summary(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for area in AREA_ORDER:
        sub = df.copy() if area == "전체_14문항" else df[df["area"] == area].copy()
        for llm in ["DSLM", "Gemini"]:
            wide = (
                sub[sub["llm"] == llm]
                .pivot_table(index="rater_id", columns="question_id", values="score", aggfunc="mean")
                .sort_index(axis=1, key=question_sort_key)
            )
            rows.append({
                "area": area,
                "llm": llm,
                "n_raters": int(wide.shape[0]),
                "n_items": int(wide.shape[1]),
                "cronbach_alpha": cronbach_alpha(wide),
            })
    return pd.DataFrame(rows)


def krippendorff_alpha_interval(df: pd.DataFrame) -> float:
    matrix = rater_score_matrix(df)

    observed_sum = 0.0
    observed_pairs = 0
    for _, row in matrix.iterrows():
        vals = row.dropna().to_numpy(dtype=float)
        if len(vals) < 2:
            continue
        diffs = vals[:, None] - vals[None, :]
        observed_sum += float(np.sum(diffs ** 2))
        observed_pairs += len(vals) * (len(vals) - 1)
    if observed_pairs == 0:
        return np.nan
    do = observed_sum / observed_pairs

    vals = matrix.to_numpy(dtype=float)
    vals = vals[~np.isnan(vals)]
    if len(vals) < 2:
        return np.nan
    diffs = vals[:, None] - vals[None, :]
    de = float(np.sum(diffs ** 2)) / (len(vals) * (len(vals) - 1))
    if de == 0:
        return np.nan
    return float(1 - do / de)


def rater_score_matrix(df: pd.DataFrame) -> pd.DataFrame:
    unit_col = "_unit"
    tmp = df.copy()
    tmp[unit_col] = tmp["scenario_id"] + "|" + tmp["question_id"] + "|" + tmp["llm"]
    return tmp.pivot_table(index=unit_col, columns="rater_id", values="score", aggfunc="mean")


def icc_two_way_random_absolute(df: pd.DataFrame) -> dict[str, float]:
    """ICC(2,1)/(2,k): two-way random effects, absolute agreement."""
    matrix = rater_score_matrix(df).dropna(axis=0, how="any")
    n_targets, n_raters = matrix.shape
    if n_targets < 2 or n_raters < 2:
        return {
            "n_targets": float(n_targets),
            "n_raters": float(n_raters),
            "ms_target": np.nan,
            "ms_rater": np.nan,
            "ms_error": np.nan,
            "icc_2_1": np.nan,
            "icc_2_k": np.nan,
        }

    values = matrix.to_numpy(dtype=float)
    grand_mean = values.mean()
    target_means = values.mean(axis=1)
    rater_means = values.mean(axis=0)

    ss_target = n_raters * np.sum((target_means - grand_mean) ** 2)
    ss_rater = n_targets * np.sum((rater_means - grand_mean) ** 2)
    ss_total = np.sum((values - grand_mean) ** 2)
    ss_error = ss_total - ss_target - ss_rater

    ms_target = ss_target / (n_targets - 1)
    ms_rater = ss_rater / (n_raters - 1)
    ms_error = ss_error / ((n_targets - 1) * (n_raters - 1))

    icc_2_1_denom = ms_target + (n_raters - 1) * ms_error + n_raters * (ms_rater - ms_error) / n_targets
    icc_2_k_denom = ms_target + (ms_rater - ms_error) / n_targets
    icc_2_1 = (ms_target - ms_error) / icc_2_1_denom if icc_2_1_denom != 0 else np.nan
    icc_2_k = (ms_target - ms_error) / icc_2_k_denom if icc_2_k_denom != 0 else np.nan

    return {
        "n_targets": float(n_targets),
        "n_raters": float(n_raters),
        "ms_target": float(ms_target),
        "ms_rater": float(ms_rater),
        "ms_error": float(ms_error),
        "icc_2_1": float(icc_2_1),
        "icc_2_k": float(icc_2_k),
    }


def build_report(df: pd.DataFrame, area_df: pd.DataFrame, q_df: pd.DataFrame, r_df: pd.DataFrame) -> str:
    lines = ["# Phase 2 H2 — Human Expert Survey Statistics\n"]
    lines.append("- Design: human expert blind survey, DSLM vs Gemini")
    lines.append("- Unit for paired tests: rater_id × scenario_id")
    lines.append("- Rubric: docs/평가설문지.hwp 14 items, including Q4")
    lines.append(f"- Raters: {df['rater_id'].nunique()}")
    lines.append(f"- Scenarios: {df['scenario_id'].nunique()}")
    lines.append(f"- Score rows: {len(df)}")
    lines.append(f"- Bonferroni alpha across 3 primary areas: {BONFERRONI_ALPHA:.4f}\n")

    printable = area_df.copy()
    for col in printable.columns:
        if printable[col].dtype.kind in "fc":
            printable[col] = printable[col].map(lambda x: round(float(x), 4) if pd.notna(x) else x)
    lines.append("## Area-Level Paired Tests\n")
    lines.append(printable.to_markdown(index=False) + "\n")

    lines.append("## Rater-Level Direction\n")
    printable_r = r_df.copy()
    for col in printable_r.columns:
        if printable_r[col].dtype.kind in "fc":
            printable_r[col] = printable_r[col].map(lambda x: round(float(x), 4) if pd.notna(x) else x)
    lines.append(printable_r.to_markdown(index=False) + "\n")

    lines.append("## Question-Level Means\n")
    printable_q = q_df.copy()
    for col in printable_q.columns:
        if printable_q[col].dtype.kind in "fc":
            printable_q[col] = printable_q[col].map(lambda x: round(float(x), 4) if pd.notna(x) else x)
    lines.append(printable_q.to_markdown(index=False) + "\n")

    alpha = krippendorff_alpha_interval(df)
    icc = icc_two_way_random_absolute(df)
    lines.append("## Inter-Rater Agreement\n")
    lines.append(f"- Krippendorff's alpha, interval scale: {alpha:.4f}" if pd.notna(alpha) else "- Krippendorff's alpha, interval scale: nan")
    lines.append(f"- ICC(2,1), two-way random absolute agreement, single rater: {icc['icc_2_1']:.4f}" if pd.notna(icc["icc_2_1"]) else "- ICC(2,1), two-way random absolute agreement, single rater: nan")
    lines.append(f"- ICC(2,k), two-way random absolute agreement, average of {int(icc['n_raters'])} raters: {icc['icc_2_k']:.4f}" if pd.notna(icc["icc_2_k"]) else "- ICC(2,k), two-way random absolute agreement, average raters: nan")
    lines.append(f"- ICC targets: {int(icc['n_targets'])}, raters: {int(icc['n_raters'])}")
    lines.append("")

    lines.append("## Internal Consistency\n")
    printable_alpha = cronbach_summary(df)
    for col in printable_alpha.columns:
        if printable_alpha[col].dtype.kind in "fc":
            printable_alpha[col] = printable_alpha[col].map(lambda x: round(float(x), 4) if pd.notna(x) else x)
    lines.append(printable_alpha.to_markdown(index=False) + "\n")

    if "inferred_winner" in r_df.columns:
        counts = r_df["inferred_winner"].value_counts()
        dslm_wins = int(counts.get("DSLM", 0))
        gemini_wins = int(counts.get("Gemini", 0))
        ties = int(counts.get("Tie", 0))
        non_tie = dslm_wins + gemini_wins
        p = stats.binomtest(dslm_wins, non_tie, 0.5, alternative="greater").pvalue if non_tie else np.nan
        lines.append("## Rater-Level Inferred Preference\n")
        lines.append(f"- DSLM-favoring raters: {dslm_wins}")
        lines.append(f"- Gemini-favoring raters: {gemini_wins}")
        lines.append(f"- Tie: {ties}")
        lines.append(f"- Binomial p(DSLM > Gemini, ties excluded): {fmt_p(p)}\n")

    lines.append("## Append Workflow\n")
    lines.append("추가 전문가 데이터가 생기면 wide CSV에는 `E07_DSLM`, `E07_Gemini`처럼 새 열을 추가하거나, long CSV에는 새 `rater_id` 행을 append 한 뒤 이 스크립트를 다시 실행하면 됩니다.")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default=str(EXPERT_DIR / "phase2_expert_scores.csv"))
    ap.add_argument("--output-prefix", default="phase2_expert")
    args = ap.parse_args()

    input_path = Path(args.input)
    df = load_scores(input_path)
    if df.empty:
        print(f"⚠️ expert score rows 없음: {input_path}")
        print("필수 컬럼: rater_id,response_date,scenario_id,question_id,llm,score,model_label,comment")
        print("또는 wide 템플릿 phase2_expert_scores_wide_5raters.csv 에 점수를 넣고 --input 으로 지정하세요.")
        return 0

    normalized_csv = RESULTS_DIR / f"{args.output_prefix}_scores_long.csv"
    area_csv = RESULTS_DIR / f"{args.output_prefix}_area_summary.csv"
    question_csv = RESULTS_DIR / f"{args.output_prefix}_question_summary.csv"
    rater_csv = RESULTS_DIR / f"{args.output_prefix}_rater_summary.csv"
    report_md = RESULTS_DIR / f"{args.output_prefix}_stats.md"

    df.to_csv(normalized_csv, index=False, encoding="utf-8-sig")
    area_rows = [analyze_area(df, area) for area in AREA_ORDER]
    area_df = pd.DataFrame(area_rows)
    area_df.to_csv(area_csv, index=False, encoding="utf-8-sig")
    q_df = question_summary(df)
    q_df.to_csv(question_csv, index=False, encoding="utf-8-sig")
    r_df = rater_summary(df)
    r_df.to_csv(rater_csv, index=False, encoding="utf-8-sig")
    report_md.write_text(build_report(df, area_df, q_df, r_df), encoding="utf-8")

    print(f"✅ {normalized_csv}")
    print(f"✅ {area_csv}")
    print(f"✅ {question_csv}")
    print(f"✅ {rater_csv}")
    print(f"✅ {report_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
