"""
04 — 검수지 review_sheet.csv → reviewed.jsonl

규칙:
  PASS / AUTO_PASS    → 학습 포함
  FIX                 → fixed_assistant 로 교체 후 포함
  FAIL / AUTO_FAIL_PII → 제외
  공란                → 미검수, 제외 (안전 우선)

참고: 검수 안 끝났으면 --include-unreviewed 로 PASS+공란 모두 포함 가능 (debug 용).
"""

import argparse
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SHEET = ROOT / "finetune" / "data" / "pairs" / "review_sheet.csv"
OUT = ROOT / "finetune" / "data" / "pairs" / "reviewed.jsonl"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--include-unreviewed", action="store_true",
                    help="공란(미검수)도 PASS 로 간주 (디버그)")
    args = ap.parse_args()

    if not SHEET.exists():
        print(f"ERROR: {SHEET} 없음. 03_review_sheet.py 먼저 실행")
        return 1

    with open(SHEET, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    kept = []
    counts = {"PASS": 0, "AUTO_PASS": 0, "FIX": 0, "FAIL": 0, "AUTO_FAIL_PII": 0, "공란": 0}
    for r in rows:
        verdict = (r.get("verdict") or "").strip().upper()
        if verdict in ("PASS", "AUTO_PASS"):
            counts[verdict] += 1
            kept.append({
                "id": r["id"],
                "source": r["source"],
                "user": r["user"],
                "assistant": r["assistant"],
                "verdict": verdict,
            })
        elif verdict == "FIX":
            counts["FIX"] += 1
            fixed = (r.get("fixed_assistant") or "").strip()
            if not fixed:
                print(f"  [warn] {r['id']} FIX 인데 fixed_assistant 비어있음 — 원본 유지")
                fixed = r["assistant"]
            kept.append({
                "id": r["id"],
                "source": r["source"],
                "user": r["user"],
                "assistant": fixed,
                "original_assistant": r["assistant"],
                "verdict": "FIX",
                "comment": r.get("comment", ""),
            })
        elif verdict in ("FAIL", "AUTO_FAIL_PII"):
            counts[verdict] += 1
        else:
            counts["공란"] += 1
            if args.include_unreviewed:
                kept.append({
                    "id": r["id"],
                    "source": r["source"],
                    "user": r["user"],
                    "assistant": r["assistant"],
                    "verdict": "UNREVIEWED",
                })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        for p in kept:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    print(f"[검수 결과]")
    for k, v in counts.items():
        print(f"  {k:<6} {v:>4}")
    print(f"\n[학습 데이터 통과] {len(kept)} 페어")
    print(f"[출력] {OUT}")

    if counts["공란"] > 0 and not args.include_unreviewed:
        print(f"\n⚠ 미검수 {counts['공란']} 페어가 제외됨. 검수 완료 후 재실행 권장.")


if __name__ == "__main__":
    sys.exit(main())
