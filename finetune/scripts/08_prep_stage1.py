"""
08 — Stage 1 데이터 prep: beomi/KoAlpaca-v1.1a → finetune/data/stage1/koalpaca.jsonl

beomi/KoAlpaca-v1.1a 특성:
  - 21,155 rows, Naver 지식인 기반 (진짜 한국어, 번역 X)
  - 한국 문화·전통·어법 컨텐츠 풍부 ("큰절", "땡추", "꼽다 vs 꽂다")
  - format: {instruction, output, url}

전처리:
  - output 너무 긴 거 제외 (>500자) — Stage 2 회상요법은 60자 권장이지만
    Stage 1 은 일반 한국어 능력 보강이라 좀 더 허용
  - 너무 짧은 거 제외 (<20자)
  - 5,000개 random sample (catastrophic forgetting 방지 — 너무 많으면 회상요법 dilution)

산출물:
  finetune/data/stage1/koalpaca.jsonl  (chat 형식: messages)
"""

import argparse
import json
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "finetune" / "data" / "stage1" / "koalpaca.jsonl"

# Stage 1 system prompt — 일반 한국어 어시스턴트 (회상요법 X)
# 의도: gemma 의 한국어 능력 + 한국 문화 지식 강화
# Stage 2 의 therapy SYSTEM_PROMPT 와 다른 system 으로 분리해 학습 시 충돌 방지
STAGE1_SYSTEM = """당신은 한국어로 친절하고 정확하게 답변하는 어시스턴트입니다.
한국어 표현·맞춤법·문화·전통에 대해 자연스럽고 정확하게 설명합니다."""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-pairs", type=int, default=5000)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--min-output-len", type=int, default=20)
    ap.add_argument("--max-output-len", type=int, default=500)
    args = ap.parse_args()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    print("[1] beomi/KoAlpaca-v1.1a 로드 ...")
    from datasets import load_dataset
    ds = load_dataset("beomi/KoAlpaca-v1.1a")["train"]
    print(f"    {len(ds):,} rows")

    print("[2] 길이 필터 ...")
    filtered = []
    for ex in ds:
        instr = (ex.get("instruction") or "").strip()
        out = (ex.get("output") or "").strip()
        if not instr or not out:
            continue
        if not (args.min_output_len <= len(out) <= args.max_output_len):
            continue
        if len(instr) > 500:
            continue
        filtered.append({"instruction": instr, "output": out})
    print(f"    통과: {len(filtered):,}")

    print(f"[3] {args.max_pairs:,}개 sample (seed={args.seed})")
    rng = random.Random(args.seed)
    sample = rng.sample(filtered, min(args.max_pairs, len(filtered)))

    print(f"[4] chat 형식 변환 → {OUT}")
    with open(OUT, "w", encoding="utf-8") as f:
        for ex in sample:
            row = {
                "messages": [
                    {"role": "system", "content": STAGE1_SYSTEM},
                    {"role": "user", "content": ex["instruction"]},
                    {"role": "assistant", "content": ex["output"]},
                ],
                "source": "koalpaca-v1.1a",
            }
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(f"\n[5] 완료: {len(sample):,} 페어")
    if sample:
        print(f"\n[샘플 2건]")
        for ex in sample[:2]:
            print(f"  Q: {ex['instruction'][:80]}")
            print(f"  A: {ex['output'][:150]}")
            print()


if __name__ == "__main__":
    sys.exit(main())
