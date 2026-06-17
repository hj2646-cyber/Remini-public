"""
14c — 검수자 간 일치도 (Cohen's κ / Fleiss' κ) 계산

전제:
  - finetune/data/pairs/reviewed/ 안에 검수자별 csv (review_<이름>.csv)
  - 모두 review_sheet.csv 와 동일 컬럼 (id, verdict, ...)
  - 처음 N 개 row (default 30) 가 overlap 검수 (모든 검수자 공통)

산출:
  - Cohen's κ (2명) 또는 Fleiss' κ (3명+)
  - 카테고리(verdict)별 분포 비교
  - confusion matrix
  - docs/presentation/evidence/cohen_kappa_<날짜>.md 저장
"""
import argparse
import csv
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REVIEWED_DIR = ROOT / "finetune" / "data" / "pairs" / "reviewed"
OUT_DIR = ROOT / "docs" / "presentation" / "evidence"


def load_csv(path: Path, overlap_n: int) -> list[dict]:
    with open(path, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    return rows[:overlap_n]


def normalize_verdict(v: str) -> str:
    """verdict 표준화. 빈 값 / 변형 처리."""
    v = (v or "").strip().upper()
    # 자동 마킹된 PII / synth 는 비교 대상 X (overlap 영역에 거의 없겠지만)
    if v in ("PASS", "AUTO_PASS"):
        return "PASS"
    if v in ("FIX",):
        return "FIX"
    if v in ("FAIL", "AUTO_FAIL_PII"):
        return "FAIL"
    if not v:
        return "EMPTY"
    return v


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--overlap-n", type=int, default=30,
                    help="overlap 검수 row 수 (default 처음 30개)")
    args = ap.parse_args()

    files = sorted(REVIEWED_DIR.glob("review_*.csv"))
    if len(files) < 2:
        print(f"ERROR: 검수자 csv 가 2개 이상 필요. 발견: {len(files)}")
        return 1

    print(f"[1] 검수자 {len(files)}명")
    for f in files:
        print(f"   {f.name}")

    print(f"[2] overlap row N = {args.overlap_n} (처음 {args.overlap_n}개)")
    rev_data = {}
    for f in files:
        name = f.stem.replace("review_", "")
        rows = load_csv(f, args.overlap_n)
        rev_data[name] = rows
        print(f"   {name}: {len(rows)} rows 로드")

    # 검수자별 verdict 추출 (id 기준 매칭)
    # 모든 검수자가 같은 id 순서로 검수했다고 가정 (overlap 영역)
    names = list(rev_data.keys())
    n_rows = min(len(v) for v in rev_data.values())
    verdicts = {n: [normalize_verdict(rev_data[n][i].get("verdict", "")) for i in range(n_rows)]
                for n in names}

    print(f"\n[3] verdict 분포")
    for n in names:
        from collections import Counter
        c = Counter(verdicts[n])
        print(f"   {n}: {dict(c)}")

    # 일치도 계산
    print(f"\n[4] 일치도 계산")
    if len(names) == 2:
        from sklearn.metrics import cohen_kappa_score, confusion_matrix
        a, b = names
        k = cohen_kappa_score(verdicts[a], verdicts[b])
        print(f"\n   Cohen's κ ({a} vs {b}) = {k:.4f}")
        # interpretation
        if k > 0.81: lvl = "almost perfect"
        elif k > 0.61: lvl = "substantial ✓ (Landis & Koch 1977 권장 기준)"
        elif k > 0.41: lvl = "moderate"
        elif k > 0.21: lvl = "fair"
        elif k > 0.0: lvl = "slight"
        else: lvl = "poor"
        print(f"   해석: {lvl}")

        # confusion matrix
        labels = sorted(set(verdicts[a]) | set(verdicts[b]))
        cm = confusion_matrix(verdicts[a], verdicts[b], labels=labels)
        print(f"\n   confusion matrix ({a} → {b}):")
        print("       " + "  ".join(f"{l:>6}" for l in labels))
        for i, l in enumerate(labels):
            print(f"   {l:<6} " + "  ".join(f"{cm[i][j]:>6}" for j in range(len(labels))))

        kappa_value = k
        kappa_interp = lvl

    else:
        # 3명+ → Fleiss' κ
        try:
            from statsmodels.stats.inter_rater import fleiss_kappa, aggregate_raters
        except ImportError:
            print("   statsmodels 필요. pip install statsmodels")
            return 1
        all_labels = sorted({v for vs in verdicts.values() for v in vs})
        # rows × raters 매트릭스 → Fleiss 입력 형식 (rows × labels = count)
        import numpy as np
        n_items = n_rows
        n_categories = len(all_labels)
        mat = np.zeros((n_items, n_categories), dtype=int)
        for i in range(n_items):
            for n in names:
                lbl = verdicts[n][i]
                j = all_labels.index(lbl)
                mat[i][j] += 1
        k = fleiss_kappa(mat, method="fleiss")
        if k > 0.81: lvl = "almost perfect"
        elif k > 0.61: lvl = "substantial ✓"
        elif k > 0.41: lvl = "moderate"
        elif k > 0.21: lvl = "fair"
        else: lvl = "poor"
        print(f"\n   Fleiss' κ (검수자 {len(names)}명) = {k:.4f}")
        print(f"   해석: {lvl}")
        # pairwise Cohen's κ 도 함께
        from sklearn.metrics import cohen_kappa_score
        from itertools import combinations
        print(f"\n   pairwise Cohen's κ:")
        for a, b in combinations(names, 2):
            kab = cohen_kappa_score(verdicts[a], verdicts[b])
            print(f"     {a} vs {b}: {kab:.4f}")
        kappa_value = k
        kappa_interp = lvl

    # 결과 저장
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    out_md = OUT_DIR / f"cohen_kappa_{today}.md"
    lines = [
        f"# Cohen's κ (검수자 간 일치도) — {today}",
        "",
        f"- 검수자: {', '.join(names)}",
        f"- overlap row: {n_rows}",
        f"- κ = **{kappa_value:.4f}** ({kappa_interp})",
        "",
        "## verdict 분포",
        "",
    ]
    for n in names:
        from collections import Counter
        c = Counter(verdicts[n])
        lines.append(f"- **{n}**: {dict(c)}")
    lines.append("")
    lines.append("## 의미")
    lines.append("")
    lines.append("Landis & Koch (1977) 기준:")
    lines.append("- κ > 0.81: almost perfect")
    lines.append("- κ > 0.61: **substantial** (실험설계 v5 §3.10 권장 기준)")
    lines.append("- κ > 0.41: moderate")
    lines.append("- κ > 0.21: fair")
    lines.append("- κ ≤ 0.20: slight/poor")
    out_md.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n[5] 결과 저장: {out_md}")


if __name__ == "__main__":
    sys.exit(main())
