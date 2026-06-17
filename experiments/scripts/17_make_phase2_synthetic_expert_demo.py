"""Create synthetic expert scores for classroom/statistics demonstration only.

The generated CSV is NOT real expert data and must not be mixed with the
actual Phase 2 expert survey. It is intended to show what the statistical
indices look like when expert ratings are internally consistent and
directionally aligned with the GPT-5.4 judge.
"""
from __future__ import annotations

from itertools import product
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
EXPERT_DIR = DATA_DIR / "expert"
RESULTS_DIR = DATA_DIR / "results"

BASE_WIDE = EXPERT_DIR / "phase2_expert_scores_wide_5raters.csv"
LLM_SCORES = RESULTS_DIR / "phase2_survey_scores_long.csv"
OUT_WIDE = EXPERT_DIR / "phase2_expert_scores_wide_6raters_synthetic_demo.csv"

RATERS = [f"E{i:02d}" for i in range(1, 7)]
DEMO_DATE = "SYNTHETIC_DEMO_DO_NOT_USE_AS_REAL_DATA"
DEMO_SCENARIO = "H2-SYNTHETIC-DEMO-DO-NOT-USE"
RATER_PROFILE = np.array([-0.45, -0.25, -0.10, 0.10, 0.25, 0.45])
DEFAULT_VARIANCE_QUANTILE = 0.003
AI_DSLM_VARIANCE_QUANTILE = 0.03

# Sum(DSLM ratings) - Sum(Gemini ratings), across six synthetic raters.
# These values intentionally create a moderate classroom demo:
# direction agreement with GPT-5.4 = 10/13 text items, delta Spearman ≈ 0.70.
TARGET_DIFF_SUMS = {
    "Q1": 5,
    "Q2": 8,
    "Q3": 5,
    "Q4": 3,
    "Q5": 6,
    "Q6": -6,
    "Q7": 7,
    "Q8": 9,
    "Q9": -8,
    "Q10": 9,
    "Q11": -2,
    "Q12": -2,
    "Q13": 3,
    "Q14": -1,
}


def choose_sum_pair(center: float, diff_sum: int) -> tuple[int, int]:
    """Choose integer six-rater sums nearest to the desired question center."""
    candidates = []
    for dslm_sum in range(len(RATERS), 5 * len(RATERS) + 1):
        gemini_sum = dslm_sum - diff_sum
        if len(RATERS) <= gemini_sum <= 5 * len(RATERS):
            pair_center = (dslm_sum + gemini_sum) / (2 * len(RATERS))
            candidates.append((abs(pair_center - center), dslm_sum, gemini_sum))
    if not candidates:
        raise ValueError(f"Cannot create rating sums for diff_sum={diff_sum}")
    _, dslm_sum, gemini_sum = min(candidates)
    return dslm_sum, gemini_sum


def candidates_by_sum() -> dict[int, tuple[np.ndarray, np.ndarray]]:
    out = {}
    for total in range(len(RATERS), 5 * len(RATERS) + 1):
        arr = np.array(
            [ratings for ratings in product(range(1, 6), repeat=len(RATERS)) if sum(ratings) == total],
            dtype=int,
        )
        out[total] = (arr, arr.var(axis=1))
    return out


def rating_variance_quantile(question_id: str, llm_name: str) -> float:
    if question_id in {"Q1", "Q2", "Q3", "Q4"} and llm_name == "DSLM":
        return AI_DSLM_VARIANCE_QUANTILE
    return DEFAULT_VARIANCE_QUANTILE


def make_rating_matrix(targets: list[tuple[str, str, int]]) -> np.ndarray:
    candidates = candidates_by_sum()
    rows = []
    for question_id, llm_name, total in targets:
        arr, variances = candidates[total]
        threshold = np.quantile(variances, rating_variance_quantile(question_id, llm_name))
        low_variance = arr[variances <= threshold]
        # Keep the same mild rater severity pattern across items. This raises
        # Cronbach's alpha while keeping within-target spread small enough for
        # ICC/Krippendorff agreement to remain interpretable.
        rows.append(low_variance[np.argmax(low_variance @ RATER_PROFILE)])
    return np.array(rows, dtype=int)


def question_center(question_id: str, llm_means: pd.DataFrame) -> float:
    if question_id in llm_means.index:
        return float((llm_means.loc[question_id, "DSLM"] + llm_means.loc[question_id, "Gemini"]) / 2)
    return 4.25


def main() -> int:
    base = pd.read_csv(BASE_WIDE, encoding="utf-8-sig")
    llm = pd.read_csv(LLM_SCORES, encoding="utf-8-sig")
    llm_means = (
        llm.groupby(["question_id", "llm"], as_index=False)["score"]
        .mean()
        .pivot_table(index="question_id", columns="llm", values="score")
    )

    target_sums_by_question = {}
    matrix_targets = []
    for _, row in base.iterrows():
        question_id = str(row["question_id"]).strip().upper()
        center = question_center(question_id, llm_means)
        dslm_sum, gemini_sum = choose_sum_pair(center, TARGET_DIFF_SUMS[question_id])
        target_sums_by_question[question_id] = {"DSLM": dslm_sum, "Gemini": gemini_sum}
        matrix_targets.extend([(question_id, "DSLM", dslm_sum), (question_id, "Gemini", gemini_sum)])

    rating_matrix = make_rating_matrix(matrix_targets)
    matrix_row = 0
    rows = []
    for _, row in base.iterrows():
        question_id = str(row["question_id"]).strip().upper()
        out = {
            "response_date": DEMO_DATE,
            "scenario_id": DEMO_SCENARIO,
            "question_id": question_id,
            "area": row["area"],
            "item": row["item"],
            "demo_note": "SYNTHETIC_CLASSROOM_DEMO_NOT_REAL_EXPERT_DATA",
        }

        for llm_name in ["DSLM", "Gemini"]:
            ratings = rating_matrix[matrix_row]
            expected_sum = target_sums_by_question[question_id][llm_name]
            if int(ratings.sum()) != expected_sum:
                raise RuntimeError(f"{question_id} {llm_name} sum mismatch")
            for rater_id, score in zip(RATERS, ratings, strict=True):
                out[f"{rater_id}_{llm_name}"] = int(score)
            matrix_row += 1
        rows.append(out)

    columns = ["response_date", "scenario_id", "question_id", "area", "item", "demo_note"]
    for rater_id in RATERS:
        columns.extend([f"{rater_id}_DSLM", f"{rater_id}_Gemini"])

    pd.DataFrame(rows, columns=columns).to_csv(OUT_WIDE, index=False, encoding="utf-8-sig")
    print(f"✅ synthetic classroom demo written: {OUT_WIDE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
