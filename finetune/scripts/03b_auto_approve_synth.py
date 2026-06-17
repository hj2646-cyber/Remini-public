"""
03b — 합성 페어 자동 PASS 처리 (옵션 A)

review_sheet.csv 의 source=synth 행에 대해 verdict='AUTO_PASS' 일괄 적용.
사용자는 source=db 자연 페어만 수동 검수.

근거: 합성 페어는 동일 모델(gemma4:31b) + 동일 system prompt 의 일관된 출력.
spot check sample 만 보면 충분 (옵션 A).

옵션 B (둘 다 검수) 갈 거면 이 스크립트 실행 안 하면 됨.
"""

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SHEET = ROOT / "finetune" / "data" / "pairs" / "review_sheet.csv"


def main():
    if not SHEET.exists():
        print(f"ERROR: {SHEET} 없음. 03_review_sheet.py 먼저 실행")
        return 1

    with open(SHEET, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    fieldnames = list(rows[0].keys())

    # 우리 시스템 응답 기반(우리 LLM 으로 generate) 페어는 자동 PASS
    AUTO_PASS_SOURCES = {"synth", "distill_external"}
    n_marked = {s: 0 for s in AUTO_PASS_SOURCES}
    n_skipped = 0
    for r in rows:
        if r.get("source") in AUTO_PASS_SOURCES:
            if not r.get("verdict"):
                r["verdict"] = "AUTO_PASS"
                n_marked[r["source"]] += 1
            else:
                n_skipped += 1
    n_synth = sum(n_marked.values())

    with open(SHEET, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)

    n_natural = sum(1 for r in rows if r.get("source") == "db")
    print(f"[OK] LLM 생성 페어 자동 PASS:")
    for src, n in n_marked.items():
        print(f"     {src:<20} {n}")
    if n_skipped:
        print(f"     (이미 검수됨: {n_skipped}개 — 그대로 유지)")
    print(f"\n남은 수동 검수: 자연 페어 {n_natural}개 (source=db)")
    print(f"  → 한 페어당 30초 → 약 {n_natural*30/60:.0f}분")


if __name__ == "__main__":
    sys.exit(main())
