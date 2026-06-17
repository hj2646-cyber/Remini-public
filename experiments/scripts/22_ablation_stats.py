"""Step 22 — Ablation 통계: 레이어 기여도 (full 대비 Δ).

입력: data/results/ablation_judge_raw.jsonl  (21_ablation_judge.py 산출)
출력:
  data/results/ablation_scores_long.csv   — arm/scenario/문항 long (self-consistency 평균)
  data/results/ablation_summary.csv        — arm × 영역 평균 + full 대비 Δ + Wilcoxon p + Cohen dz
  data/results/ablation_report.md          — 레이어 기여도 랭킹

해석: Δ = (full 점수) − (레이어 제거 arm 점수). Δ>0 이면 그 레이어가 품질에 기여(제거 시 하락).
Wilcoxon signed-rank (scenario paired) + Cohen's dz + Bonferroni(비교 arm 수) 보정.
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
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

# 13문항 → 3영역 (docs/평가설문지.hwp, Q4 제외)
ITEM_AREA = {
    "Q1": "AI와의 상호작용", "Q2": "AI와의 상호작용", "Q3": "AI와의 상호작용",
    "Q5": "임상적 타당성", "Q6": "임상적 타당성", "Q7": "임상적 타당성", "Q8": "임상적 타당성",
    "Q9": "안정성과 윤리", "Q10": "안정성과 윤리", "Q11": "안정성과 윤리",
    "Q12": "안정성과 윤리", "Q13": "안정성과 윤리", "Q14": "안정성과 윤리",
}
AREAS = ["AI와의 상호작용", "임상적 타당성", "안정성과 윤리"]
FULL = "full"


def load_long(path: Path) -> pd.DataFrame:
    rows: list[dict[str, Any]] = []
    with path.open(encoding="utf-8") as f:
        for line in f:
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get("error") or not rec.get("parsed"):
                continue
            items = (rec["parsed"] or {}).get("items", {})
            for qid, area in ITEM_AREA.items():
                v = items.get(qid)
                score = v.get("score") if isinstance(v, dict) else v
                if score is None:
                    continue
                try:
                    score = float(score)
                except (TypeError, ValueError):
                    continue
                rows.append({
                    "arm": rec["arm"],
                    "scenario_id": rec["scenario_id"],
                    "category": rec.get("category"),
                    "repetition": rec.get("repetition"),
                    "qid": qid,
                    "area": area,
                    "score": score,
                })
    return pd.DataFrame(rows)


def paired_full_vs_arm(per_scn_area: pd.DataFrame, arm: str, area: str) -> dict[str, Any]:
    """같은 scenario 짝으로 full vs arm 비교. Δ = full − arm."""
    sub = per_scn_area[per_scn_area["area"] == area]
    wide = sub.pivot_table(index="scenario_id", columns="arm", values="score")
    if FULL not in wide.columns or arm not in wide.columns:
        return {}
    paired = wide[[FULL, arm]].dropna()
    if len(paired) < 2:
        return {"area": area, "arm": arm, "n": len(paired)}
    diff = paired[FULL] - paired[arm]   # full − ablated
    dz = float(diff.mean() / diff.std(ddof=1)) if diff.std(ddof=1) > 0 else np.nan
    try:
        w_stat, w_p = stats.wilcoxon(diff) if diff.abs().sum() > 0 else (np.nan, np.nan)
    except ValueError:
        w_stat, w_p = np.nan, np.nan
    return {
        "area": area,
        "arm": arm,
        "n": int(len(paired)),
        "full_mean": round(float(paired[FULL].mean()), 3),
        "arm_mean": round(float(paired[arm].mean()), 3),
        "delta_full_minus_arm": round(float(diff.mean()), 3),
        "wilcoxon_p": float(w_p) if not pd.isna(w_p) else np.nan,
        "cohen_dz": round(dz, 3) if not pd.isna(dz) else np.nan,
    }


def build_report(summary: pd.DataFrame, arms: list[str], n_compare: int) -> str:
    alpha = 0.05 / max(1, n_compare)
    lines: list[str] = ["# Ablation: 레이어 기여도 (full 대비 Δ)\n"]
    lines.append(f"- 비교 arm 수: {n_compare}, Bonferroni α = 0.05/{n_compare} = {alpha:.4f}")
    lines.append("- Δ = (full) − (레이어 제거 arm). **Δ>0 = 그 레이어가 품질에 기여** (제거 시 하락).")
    lines.append("- 검정: Wilcoxon signed-rank (scenario paired) + Cohen's dz\n")

    # 전체(ALL) 기준 레이어 기여도 랭킹
    overall = summary[summary["area"] == "ALL"].copy()
    overall = overall.sort_values("delta_full_minus_arm", ascending=False)
    lines.append("## 레이어 기여도 랭킹 (전체 13문항 평균 기준)\n")
    if not overall.empty:
        tbl = overall[["arm", "full_mean", "arm_mean", "delta_full_minus_arm", "wilcoxon_p", "cohen_dz", "n"]].copy()
        tbl["sig(Bonf)"] = tbl["wilcoxon_p"].map(
            lambda p: "✓" if pd.notna(p) and p < alpha else ""
        )
        lines.append(tbl.to_markdown(index=False) + "\n")

    # 영역별 표
    for area in AREAS:
        sub = summary[summary["area"] == area].sort_values("delta_full_minus_arm", ascending=False)
        if sub.empty:
            continue
        lines.append(f"## 영역: {area}\n")
        tbl = sub[["arm", "full_mean", "arm_mean", "delta_full_minus_arm", "wilcoxon_p", "cohen_dz", "n"]]
        lines.append(tbl.to_markdown(index=False) + "\n")

    lines.append("## 해석 가이드\n")
    lines.append(
        "- Δ 가 크고 p<α 인 레이어 = 회상요법 품질의 핵심 기여 컴포넌트.\n"
        "- Δ≈0 = 해당 레이어가 (이 시나리오 셋에서) 품질에 큰 영향 없음 — saturation 또는 다른 레이어와 중복.\n"
        "- Δ<0 = 레이어를 빼니 오히려 점수가 올라간 경우(과잉 개입 가능성) — 정직하게 보고.\n"
        "- pilot 규모(카테고리당 소수)에서는 방향성 신호로 보고, 효과 큰 레이어만 40세트로 확대 권장."
    )
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--judge", default=str(RESULTS_DIR / "ablation_judge_raw.jsonl"))
    ap.add_argument("--scores-csv", default=str(RESULTS_DIR / "ablation_scores_long.csv"))
    ap.add_argument("--summary-csv", default=str(RESULTS_DIR / "ablation_summary.csv"))
    ap.add_argument("--report-md", default=str(RESULTS_DIR / "ablation_report.md"))
    args = ap.parse_args()

    long_df = load_long(Path(args.judge))
    if long_df.empty:
        print("❌ judge 결과 비어있음:", args.judge)
        return 1

    # self-consistency 평균: arm/scenario/qid 단위로 rep 평균
    per_q = (
        long_df.groupby(["arm", "scenario_id", "category", "qid", "area"], as_index=False)["score"]
        .mean()
    )
    per_q.to_csv(args.scores_csv, index=False, encoding="utf-8-sig")

    # scenario별 영역 평균 + 전체(ALL)
    per_scn_area = (
        per_q.groupby(["arm", "scenario_id", "area"], as_index=False)["score"].mean()
    )
    per_scn_all = (
        per_q.groupby(["arm", "scenario_id"], as_index=False)["score"].mean()
    )
    per_scn_all["area"] = "ALL"
    per_scn_area = pd.concat([per_scn_area, per_scn_all], ignore_index=True)

    arms = [a for a in per_q["arm"].unique() if a != FULL]
    rows: list[dict[str, Any]] = []
    for area in [*AREAS, "ALL"]:
        for arm in arms:
            res = paired_full_vs_arm(per_scn_area, arm, area)
            if res:
                rows.append(res)
    summary = pd.DataFrame(rows)
    summary.to_csv(args.summary_csv, index=False, encoding="utf-8-sig")

    report = build_report(summary, arms, n_compare=len(arms))
    Path(args.report_md).write_text(report, encoding="utf-8")

    print(f"[scores] {args.scores_csv}")
    print(f"[summary] {args.summary_csv}")
    print(f"[report] {args.report_md}")
    print("\n" + report[:1500])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
