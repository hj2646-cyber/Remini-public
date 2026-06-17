"""
14d — 다중 reviewer 검수 결과 통합 (보수적 merge)

3명 검수자 (검수자 A/B/C) → 통합 verdict:
  - 모두 PASS → PASS (학습 사용)
  - 1명이라도 FAIL → FAIL (학습 제외)
  - 1명이라도 FIX → FIX (수정안 사용 — 가장 까다로운 검수자 우선)
  - 1명 PASS + 2명 FIX → FIX
  - 공란/EMPTY 있으면 그 row 는 다른 검수자 verdict 따름

산출물: finetune/data/pairs/reviewed_merged.jsonl (학습용 통합 결과)
"""
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REV_DIR = ROOT / "finetune" / "data" / "pairs" / "reviewed"
OUT = ROOT / "finetune" / "data" / "pairs" / "reviewed_merged.jsonl"


def normalize(v):
    v = (v or "").strip().upper()
    if v in ("PASS", "AUTO_PASS"):
        return "PASS"
    if v == "FIX":
        return "FIX"
    if v in ("FAIL", "AUTO_FAIL_PII"):
        return "FAIL"
    return ""


def merge_verdicts(verdicts):
    """3개 verdict → 보수적 merge (FAIL > FIX > PASS, EMPTY 무시)."""
    valid = [v for v in verdicts if v]
    if not valid:
        return "EMPTY", None
    if "FAIL" in valid:
        return "FAIL", None
    if "FIX" in valid:
        return "FIX", None
    if all(v == "PASS" for v in valid):
        return "PASS", None
    return "EMPTY", None


def main():
    files = sorted(REV_DIR.glob("review_*.csv"))
    if len(files) < 2:
        print(f"ERROR: 검수자 csv 부족 ({len(files)})")
        return 1

    rev = {}
    for f in files:
        name = f.stem
        with open(f, encoding="utf-8-sig") as fh:
            rev[name] = list(csv.DictReader(fh))
    print(f"[1] 검수자 {len(rev)}명: {list(rev.keys())}")

    # id 기준으로 merge — 모든 csv 가 동일 row 순서·id 라고 가정 (review_sheet 기반이라 같음)
    n_rows = min(len(v) for v in rev.values())
    print(f"[2] {n_rows} rows merge")

    merged = []
    counts = {"PASS": 0, "FIX": 0, "FAIL": 0, "EMPTY": 0}
    for i in range(n_rows):
        rows = [list(rev.values())[k][i] for k in range(len(rev))]
        verdicts = [normalize(r.get("verdict", "")) for r in rows]
        merged_v, _ = merge_verdicts(verdicts)
        counts[merged_v] += 1

        # 데이터 보존
        base = rows[0]  # id 등 공통 컬럼
        # FIX 시 fixed_assistant 골라잡기 — 가장 먼저 FIX 한 검수자 거 (또는 FAIL 우선이라 FIX 만)
        fixed = ""
        if merged_v == "FIX":
            for r in rows:
                if normalize(r.get("verdict", "")) == "FIX":
                    fixed = (r.get("fixed_assistant") or "").strip()
                    if fixed:
                        break

        if merged_v in ("PASS", "FIX"):
            merged.append({
                "id": base["id"],
                "source": base["source"],
                "user": base["user"],
                "assistant": fixed if (merged_v == "FIX" and fixed) else base["assistant"],
                "verdict": merged_v,
                "individual_verdicts": dict(zip(rev.keys(), verdicts)),
            })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        for p in merged:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    print(f"\n[3] merge 결과:")
    for k, v in counts.items():
        print(f"  {k}: {v}")
    print(f"\n[4] 학습 데이터 통과 (PASS+FIX): {len(merged)} 페어")
    print(f"[5] 출력: {OUT}")


if __name__ == "__main__":
    sys.exit(main())
