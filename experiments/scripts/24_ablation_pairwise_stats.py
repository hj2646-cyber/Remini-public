"""Step 24 — Ablation pairwise stats: arm별 full 선호율 + 문항/영역 Δ.

입력: data/results/ablation_pairwise_raw.jsonl  (23_ablation_pairwise_judge.py)
출력:
  data/results/ablation_pairwise_summary.csv
  data/results/ablation_pairwise_report.md

각 비교는 full vs (레이어 제거 arm). full_is 로 A/B 중 어느 쪽이 full 인지 복원.
- Δ = full_score − arm_score (문항/영역, self-consistency 평균 후).  Δ>0 = 레이어 기여.
- 선호: overall_preference 가 full 쪽인 비율 → binomial test (Chatbot Arena 방식).
- Wilcoxon signed-rank (scenario paired) + Cohen's dz + Bonferroni.
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

ITEM_AREA = {
    "Q1": "AI와의 상호작용", "Q2": "AI와의 상호작용", "Q3": "AI와의 상호작용",
    "Q5": "임상적 타당성", "Q6": "임상적 타당성", "Q7": "임상적 타당성", "Q8": "임상적 타당성",
    "Q9": "안정성과 윤리", "Q10": "안정성과 윤리", "Q11": "안정성과 윤리",
    "Q12": "안정성과 윤리", "Q13": "안정성과 윤리", "Q14": "안정성과 윤리",
}
AREAS = ["AI와의 상호작용", "임상적 타당성", "안정성과 윤리"]


def load(path: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    rows: list[dict[str, Any]] = []
    prefs: list[dict[str, Any]] = []
    seen: set[tuple[str, str, int]] = set()
    with path.open(encoding="utf-8") as f:
        for line in f:
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get("error") or not rec.get("parsed"):
                continue
            k = (rec["arm"], rec["scenario_id"], int(rec["repetition"]))
            if k in seen:
                continue
            seen.add(k)
            parsed = rec["parsed"]
            items = parsed.get("items", {})
            fis = rec["full_is"]  # 'A' or 'B'
            for qid, area in ITEM_AREA.items():
                v = items.get(qid)
                if not isinstance(v, dict):
                    continue
                try:
                    full_s = float(v["A"] if fis == "A" else v["B"])
                    arm_s = float(v["B"] if fis == "A" else v["A"])
                except (KeyError, TypeError, ValueError):
                    continue
                rows.append({"arm": rec["arm"], "scenario_id": rec["scenario_id"],
                             "qid": qid, "area": area, "full": full_s, "arm_s": arm_s})
            op = parsed.get("overall_preference")
            pref = "full" if op == fis else ("tie" if op == "Tie" else "arm")
            prefs.append({"arm": rec["arm"], "scenario_id": rec["scenario_id"], "pref": pref})
    return pd.DataFrame(rows), pd.DataFrame(prefs)


def paired(df_area: pd.DataFrame, arm: str, area: str) -> dict[str, Any]:
    sub = df_area[(df_area["arm"] == arm) & (df_area["area"] == area)]
    if sub.empty:
        return {}
    diff = sub["full"] - sub["arm_s"]
    dz = float(diff.mean() / diff.std(ddof=1)) if len(diff) > 1 and diff.std(ddof=1) > 0 else np.nan
    try:
        _, wp = stats.wilcoxon(diff) if diff.abs().sum() > 0 else (np.nan, np.nan)
    except ValueError:
        wp = np.nan
    return {"area": area, "arm": arm, "n": int(len(diff)),
            "full_mean": round(float(sub["full"].mean()), 3),
            "arm_mean": round(float(sub["arm_s"].mean()), 3),
            "delta": round(float(diff.mean()), 3),
            "wilcoxon_p": float(wp) if not pd.isna(wp) else np.nan,
            "cohen_dz": round(dz, 3) if not pd.isna(dz) else np.nan}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pairwise", default=str(RESULTS_DIR / "ablation_pairwise_raw.jsonl"))
    ap.add_argument("--summary-csv", default=str(RESULTS_DIR / "ablation_pairwise_summary.csv"))
    ap.add_argument("--report-md", default=str(RESULTS_DIR / "ablation_pairwise_report.md"))
    args = ap.parse_args()

    long_df, pref_df = load(Path(args.pairwise))
    if long_df.empty:
        print("❌ pairwise 결과 비어있음")
        return 1

    # self-consistency 평균: (arm,scenario,qid) rep 평균
    per_q = long_df.groupby(["arm", "scenario_id", "qid", "area"], as_index=False)[["full", "arm_s"]].mean()
    per_area = per_q.groupby(["arm", "scenario_id", "area"], as_index=False)[["full", "arm_s"]].mean()
    per_all = per_q.groupby(["arm", "scenario_id"], as_index=False)[["full", "arm_s"]].mean()
    per_all["area"] = "ALL"
    per_area = pd.concat([per_area, per_all], ignore_index=True)

    arms = sorted(per_q["arm"].unique())
    rows = []
    for area in [*AREAS, "ALL"]:
        for arm in arms:
            r = paired(per_area, arm, area)
            if r:
                rows.append(r)
    summary = pd.DataFrame(rows)
    summary.to_csv(args.summary_csv, index=False, encoding="utf-8-sig")

    # 선호율 (overall_preference, scenario 단위 다수결 후 arm별 집계)
    alpha = 0.05 / max(1, len(arms))
    lines = ["# Ablation pairwise: full vs 레이어제거 (A/B 직접비교)\n",
             f"- 비교 arm {len(arms)}, Bonferroni α={alpha:.4f}",
             "- Δ = full − arm (전체 ALL 기준). **Δ>0 = 그 레이어가 품질 기여**.",
             "- 선호: judge 가 full 을 더 낫다고 한 비율 (binomial vs 0.5)\n"]

    overall = summary[summary["area"] == "ALL"].sort_values("delta", ascending=False)
    # 선호 binomial: arm별 full승/arm승 (tie 제외)
    pref_rows = []
    for arm in arms:
        pser = pref_df[pref_df["arm"] == arm]["pref"]
        fw = int((pser == "full").sum())
        aw = int((pser == "arm").sum())
        tie = int((pser == "tie").sum())
        nn = fw + aw
        bp = float(stats.binomtest(fw, nn, 0.5).pvalue) if nn > 0 else np.nan
        pref_rows.append({"arm": arm, "full_win": fw, "arm_win": aw, "tie": tie,
                          "full_pref_rate": round(fw / nn, 3) if nn else np.nan,
                          "binom_p": round(bp, 4) if not pd.isna(bp) else np.nan})
    pref_tbl = pd.DataFrame(pref_rows).merge(
        overall[["arm", "delta", "wilcoxon_p", "cohen_dz"]], on="arm", how="left"
    ).sort_values("delta", ascending=False)

    lines.append("## 레이어 기여도 (full 선호율 + 전체 Δ)\n")
    lines.append(pref_tbl.to_markdown(index=False) + "\n")
    for area in AREAS:
        sub = summary[summary["area"] == area].sort_values("delta", ascending=False)
        lines.append(f"## 영역: {area}\n")
        lines.append(sub[["arm", "full_mean", "arm_mean", "delta", "wilcoxon_p", "cohen_dz", "n"]].to_markdown(index=False) + "\n")
    lines.append("## 해석\n- full_pref_rate>0.5 & Δ>0 & p<α → 그 레이어가 품질에 유의하게 기여.\n"
                 "- pairwise 는 절대채점(21)보다 민감 → 같은 8세트라도 차이 더 드러남.")
    Path(args.report_md).write_text("\n".join(lines), encoding="utf-8")
    print(f"[summary] {args.summary_csv}\n[report] {args.report_md}\n")
    print("\n".join(lines)[:1800])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
