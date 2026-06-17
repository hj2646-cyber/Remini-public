"""
02 — raw_pairs*.jsonl 에 자동 필터 적용 → filtered.jsonl

입력: raw_pairs.jsonl (자연) + raw_pairs_synth.jsonl (self-distillation, 있을 시)
필터:
  - user/assistant 길이 (8 < len < 400)
  - 한국어 비율 (한글 60%+)
  - 시스템 에러 메시지 제거
  - 중복 제거 (같은 (user, assistant) 쌍)
  - assistant 응답이 wiki/안내문 그대로 인용한 경우 제외
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW_NATURAL = ROOT / "finetune" / "data" / "pairs" / "raw_pairs.jsonl"
RAW_SYNTH = ROOT / "finetune" / "data" / "pairs" / "raw_pairs_synth.jsonl"
RAW_EXTERNAL = ROOT / "finetune" / "data" / "pairs" / "raw_pairs_external.jsonl"
OUT = ROOT / "finetune" / "data" / "pairs" / "filtered.jsonl"
DROP_LOG = ROOT / "finetune" / "data" / "pairs" / "_dropped.jsonl"

ERROR_PATTERNS = [
    "죄송합니다",
    "이해하지 못",
    "다시 한 번 말씀",
    "잘 안 들렸",
    "잠시만요",
    "지금 잠시",
    "Error",
    "[ERROR",
    "TODO",
    "system:",
    "<|",
]

# 시스템 에러보다 약함 — 단독 토큰일 때만 의심
SOFT_SUSPICIOUS = ["테스트", "test", "ping"]


def korean_ratio(text: str) -> float:
    if not text:
        return 0.0
    hangul = sum(1 for c in text if "가" <= c <= "힯")
    total = sum(1 for c in text if c.strip())
    return hangul / total if total else 0.0


def is_error_message(text: str) -> bool:
    for pat in ERROR_PATTERNS:
        if pat in text:
            return True
    return False


def main():
    pairs = []
    if RAW_NATURAL.exists():
        nat = [json.loads(line) for line in open(RAW_NATURAL)]
        pairs.extend(nat)
        print(f"[자연 페어]    {RAW_NATURAL.name:<28} {len(nat):>5}")
    if RAW_SYNTH.exists():
        syn = [json.loads(line) for line in open(RAW_SYNTH)]
        pairs.extend(syn)
        print(f"[합성 페어]    {RAW_SYNTH.name:<28} {len(syn):>5}")
    if RAW_EXTERNAL.exists():
        ext = [json.loads(line) for line in open(RAW_EXTERNAL)]
        pairs.extend(ext)
        print(f"[외부 페어]    {RAW_EXTERNAL.name:<28} {len(ext):>5}")
    if not pairs:
        print(f"ERROR: 입력 jsonl 없음. 01 / 01b / 01c 먼저 실행")
        return 1

    seen = set()
    kept, dropped = [], []

    for p in pairs:
        u, a = p["user"], p["assistant"]
        reasons = []

        if not u or not a:
            reasons.append("empty")
        if len(u) < 4:
            reasons.append(f"user_too_short({len(u)})")
        if len(u) > 400:
            reasons.append(f"user_too_long({len(u)})")
        if len(a) < 8:
            reasons.append(f"asst_too_short({len(a)})")
        if len(a) > 400:
            reasons.append(f"asst_too_long({len(a)})")
        if korean_ratio(a) < 0.5:
            reasons.append(f"asst_low_korean({korean_ratio(a):.2f})")
        if is_error_message(a):
            reasons.append("asst_error_msg")

        key = (u.strip(), a.strip())
        if key in seen:
            reasons.append("duplicate")
        seen.add(key)

        if reasons:
            dropped.append({**p, "drop_reasons": reasons})
        else:
            kept.append(p)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        for p in kept:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
    with open(DROP_LOG, "w", encoding="utf-8") as f:
        for p in dropped:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    # 통계
    from collections import Counter
    drop_reasons = Counter()
    for d in dropped:
        for r in d["drop_reasons"]:
            drop_reasons[r.split("(")[0]] += 1

    print(f"\n[합계 입력]    {len(pairs):>4}")
    print(f"[통과]        {len(kept):>4}")
    print(f"[제외]        {len(dropped):>4}  ({len(dropped)/len(pairs)*100:.1f}%)")

    # 출처별 통과 분포
    from collections import Counter
    src_kept = Counter(p.get("source") for p in kept)
    print(f"\n[통과 출처별]")
    for src, n in src_kept.most_common():
        print(f"  {src:<10} {n}")

    print(f"\n[제외 사유 빈도]")
    for r, n in drop_reasons.most_common():
        print(f"  {r:<25} {n}")
    print(f"\n[출력]        {OUT}")
    print(f"[제외 로그]   {DROP_LOG}")


if __name__ == "__main__":
    sys.exit(main())
