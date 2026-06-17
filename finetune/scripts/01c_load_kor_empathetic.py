"""
01c — KorEmpatheticDialogues (HuggingFace) → raw_pairs_external.jsonl

데이터셋: passing2961/KorEmpatheticDialogues
구조:
  ex = {situation, emotion, dialogue_id, dialogue: [{user_id, utter, utter_idx}, ...]}
  user_id=0: speaker (감정 공유) — 우리의 user 역할
  user_id=1: listener (공감 응답) — 우리의 assistant 역할

화법 필터 (회상요법 룰 위반 페어 제외):
  - 5W 심문 (언제/어디/누구/뭐/무엇/왜)  ← 가장 빈번한 위반
  - 부정어 (슬프/괴로/힘들/위급/곤란)     ← 약하게 적용
  - 너무 길거나 짧음
  - 영어 끼임

산출물:
  finetune/data/pairs/raw_pairs_external.jsonl
  finetune/data/pairs/_external_dropped.jsonl  (제외 사유 로그)
"""

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

from datasets import load_dataset

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "finetune" / "data" / "pairs" / "raw_pairs_external.jsonl"
DROP = ROOT / "finetune" / "data" / "pairs" / "_external_dropped.jsonl"

# ---- 화법 필터 ----
# 5W 단어가 ? 또는 문장 끝 어미와 함께 나오면 심문으로 간주
# (ai-server SYSTEM_PROMPT 의 "5W 심문 금지" 룰과 일치)
W5_TOKENS = ["언제", "어디", "누구", "뭐", "무엇", "왜"]
W5_TAIL_PATTERNS = [
    r"\?$",                        # 물음표로 끝
    r"(나요|가요|어요|군요|시나요|셨나요|니까|는지|을지|었지|니|니\?|을까|을까요)\s*[?.!]?\s*$",
]
INTERROGATIVE_TAIL = re.compile("|".join(W5_TAIL_PATTERNS))

# 부정어 — 환자 위축 위험. ai-server 룰 명시 금지어.
NEGATIVE_WORDS = ["슬프", "괴로", "힘드", "힘들", "위급", "곤란", "비참", "절망"]

# 영어/숫자 등 외국어 끼임 — 60% 이상 한국어여야
def korean_ratio(text: str) -> float:
    if not text:
        return 0.0
    hangul = sum(1 for c in text if "가" <= c <= "힯")
    total = sum(1 for c in text if c.strip())
    return hangul / total if total else 0.0


def is_5w_interrogation(text: str) -> bool:
    """5W 단어 + 의문 어미·물음표 동시 등장."""
    for tok in W5_TOKENS:
        if tok not in text:
            continue
        # tok 이 들어간 문장이 의문형으로 끝나는지
        # 단순 처리: 텍스트 어디든 5W 단어 있고 의문형이면 의심
        if INTERROGATIVE_TAIL.search(text):
            return True
    return False


def has_negative(text: str) -> bool:
    for w in NEGATIVE_WORDS:
        if w in text:
            return True
    return False


def filter_assistant(asst: str) -> list[str]:
    reasons = []
    if not asst or len(asst.strip()) < 8:
        reasons.append("asst_too_short")
    if len(asst) > 200:  # 회상요법은 60자 권장이지만 100자 이내까지 허용
        reasons.append("asst_too_long")
    if korean_ratio(asst) < 0.5:
        reasons.append("low_korean")
    if is_5w_interrogation(asst):
        reasons.append("5w_interrogation")
    if has_negative(asst):
        reasons.append("negative_word")
    return reasons


def filter_user(user: str) -> list[str]:
    reasons = []
    if not user or len(user.strip()) < 4:
        reasons.append("user_too_short")
    if len(user) > 300:
        reasons.append("user_too_long")
    return reasons


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-pairs", type=int, default=2000,
                    help="필터 통과 페어 중 최대 몇개 보존 (학습 dilution 방지)")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    OUT.parent.mkdir(parents=True, exist_ok=True)

    print("[1] 데이터셋 로드: passing2961/KorEmpatheticDialogues")
    ds = load_dataset("passing2961/KorEmpatheticDialogues")

    all_pairs_raw = []
    for split in ["train", "validation"]:
        for ex in ds[split]:
            turns = ex["dialogue"]
            for i in range(len(turns) - 1):
                u, a = turns[i], turns[i + 1]
                if u["user_id"] == 0 and a["user_id"] == 1:
                    all_pairs_raw.append({
                        "id": f"kemd_{split}_{ex['dialogue_id']}_{i}",
                        "source": "kor_empathetic",
                        "session_id": f"kemd_{split}_{ex['dialogue_id']}",
                        "situation": ex["situation"],
                        "emotion": ex["emotion"],
                        "user": u["utter"].strip(),
                        "assistant": a["utter"].strip(),
                    })
    print(f"[2] 추출 페어 (필터 전): {len(all_pairs_raw):,}")

    # 필터
    kept, dropped = [], []
    for p in all_pairs_raw:
        rs = filter_user(p["user"]) + filter_assistant(p["assistant"])
        if rs:
            dropped.append({**p, "drop_reasons": rs})
        else:
            kept.append(p)

    print(f"[3] 필터 통과: {len(kept):,}  ({len(kept)/len(all_pairs_raw)*100:.1f}%)")
    drop_reasons = Counter()
    for d in dropped:
        for r in d["drop_reasons"]:
            drop_reasons[r] += 1
    print(f"\n[제외 사유 빈도]")
    for r, n in drop_reasons.most_common():
        print(f"  {r:<25} {n:,}")

    # max_pairs 로 cap
    if args.max_pairs and len(kept) > args.max_pairs:
        import random
        rng = random.Random(args.seed)
        kept = rng.sample(kept, args.max_pairs)
        print(f"\n[4] {args.max_pairs:,} 개로 sampling (학습 dilution 방지)")

    # 저장
    with open(OUT, "w", encoding="utf-8") as f:
        for p in kept:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
    with open(DROP, "w", encoding="utf-8") as f:
        for p in dropped[:5000]:  # 로그는 5K 만
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    print(f"\n[5] 출력: {OUT}  ({len(kept):,} 페어)")
    print(f"[6] 제외 로그: {DROP}  (sample 5K)")

    # 샘플 출력
    print(f"\n[샘플 통과 3건]")
    for p in kept[:3]:
        print(f"  emotion={p['emotion']}")
        print(f"    USER: {p['user'][:90]}")
        print(f"    AST:  {p['assistant'][:90]}")
        print()


if __name__ == "__main__":
    sys.exit(main())
