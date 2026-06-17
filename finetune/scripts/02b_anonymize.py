"""
02b — 학습 데이터 PII 검출 + 자동 FAIL (cross-persona leakage 방지)

전략:
  - assistant 응답에 PII (인명/지명/특정 직업) 들어가면 학습 제외
  - 자동 substitute 는 부자연스러운 결과 ("남편은 남편분이셨죠") 만들어서 사용 안 함
  - 검수자가 추가로 PII 발견 시 FAIL 처리 가능

산출물:
  finetune/data/pairs/filtered.jsonl 의 검수지(03)에서 PII hit 페어를
  verdict='AUTO_FAIL_PII' 로 마킹. 학습에서 제외됨.
"""

import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "finetune" / "data" / "pairs" / "filtered.jsonl"
SHEET = ROOT / "finetune" / "data" / "pairs" / "review_sheet.csv"
LOG = ROOT / "finetune" / "data" / "pairs" / "_pii_log.jsonl"


# 명시적 PII → 일반 표현
# 새 PII 발견 시 여기 추가. 가급적 단순한 substring 매칭.
SUBSTITUTIONS = [
    # === 자연 페어 (DB) — 실제 환자 P001/P002 등의 specific fact ===
    ("고영달 님", "남편분"),
    ("고영달", "남편분"),
    ("제주 애월", "고향"),
    ("애월", "고향"),
    ("감귤 밭", "농사 일"),
    ("감귤", "농사"),

    # === 합성 페어 (NVIDIA 30 페르소나) — 응답에 가상 인물 이름이 끼어든 경우 ===
    # 자녀 이름 풀 (02_persona_to_kg.py 와 동일) — 응답에 등장하면 익명화
    # (system 에 KG 들어가니 학습엔 OK 지만 안전 차원)
]

# 자녀 이름 풀 자동 추가
CHILD_NAMES = [
    "민수", "준호", "지훈", "성호", "재영", "동현", "현우", "병철",
    "광호", "성민", "정우", "기훈", "영수", "철수", "상현",
    "지영", "수진", "은영", "현주", "미경", "선영", "지윤", "혜진",
    "정희", "영숙", "혜영", "수정", "민지", "유진", "은주",
]


def detect_pii(text: str) -> list[str]:
    """text 에 PII 들어있는지 검출. 매치된 룰 리스트 반환."""
    hits = []
    for src, _ in SUBSTITUTIONS:
        if src in text:
            hits.append(src)
    # 자녀 이름 (성 한 글자 + CHILD_NAMES 풀의 2글자)
    for first in CHILD_NAMES:
        pat = re.compile(rf"[가-힣]{re.escape(first)}(?=$|[은는이가을를과의도에 ,.!?])")
        if pat.search(text):
            hits.append(f"<자녀이름:{first}>")
    return hits


def main():
    if not SRC.exists():
        print(f"ERROR: {SRC} 없음. 02_auto_filter.py 먼저 실행")
        return 1
    if not SHEET.exists():
        print(f"ERROR: {SHEET} 없음. 03_review_sheet.py 먼저 실행")
        return 1

    pairs = [json.loads(l) for l in open(SRC)]

    # PII hit 페어 id 모음
    pii_hits: dict[str, list[str]] = {}
    log_entries = []
    for p in pairs:
        hits = detect_pii(p["assistant"])
        if hits:
            pii_hits[p["id"]] = hits
            log_entries.append({
                "id": p["id"],
                "source": p.get("source"),
                "rules": hits,
                "assistant": p["assistant"],
            })

    # review_sheet.csv 에 verdict='AUTO_FAIL_PII' 마킹
    with open(SHEET, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    fieldnames = list(rows[0].keys())

    n_marked = 0
    for r in rows:
        if r["id"] in pii_hits:
            if not r.get("verdict"):
                r["verdict"] = "AUTO_FAIL_PII"
                r["comment"] = (r.get("comment") or "") + \
                    f" [PII auto-detect: {','.join(pii_hits[r['id']])}]"
                n_marked += 1

    with open(SHEET, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
    with open(LOG, "w", encoding="utf-8") as f:
        for e in log_entries:
            f.write(json.dumps(e, ensure_ascii=False) + "\n")

    print(f"[1] 검사 페어:    {len(pairs):>4}")
    print(f"[2] PII hit:     {len(pii_hits):>4}  ({len(pii_hits)/len(pairs)*100:.1f}%)")
    print(f"[3] 검수지 자동마킹: {n_marked:>4}  (verdict='AUTO_FAIL_PII')")
    print(f"[4] PII log:     {LOG}")
    if log_entries:
        print(f"\n[샘플 5건]")
        for e in log_entries[:5]:
            print(f"  [{e['id']}] {e['rules']}")
            print(f"    → {e['assistant'][:100]}")
            print()
    print("\n검수자가 false positive 발견 시 verdict 를 PASS/FIX 로 덮어쓰기 가능.")
    print("학습 시 04_apply_review.py 가 AUTO_FAIL_PII 페어 자동 제외.")


if __name__ == "__main__":
    sys.exit(main())
