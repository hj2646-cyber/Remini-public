"""
31 — utterances.jsonl → HF datasets (Audio + text) → train/eval split

필터:
  - duration: 0.5 ~ 25.0 초 (Qwen3-ASR max input 30s 보다 짧게)
  - transcript: 비어있지 않음 + 한국어 한 글자 이상
  - 16kHz 보장 (가이드 명세, 다른 sr 면 resample)

산출물:
  finetune/data/aihub_107_dataset/{train,eval}/  - HF Arrow datasets
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
IN_UTT = ROOT / "finetune" / "data" / "aihub_107" / "utterances.jsonl"
OUT_DIR = ROOT / "finetune" / "data" / "aihub_107_dataset"

MIN_SEC = 0.5
MAX_SEC = 25.0
HANGUL = re.compile(r"[가-힣]")


def load_filter(jsonl: Path) -> list[dict]:
    rows = []
    n_total = 0
    n_dur = 0
    n_text = 0
    with jsonl.open(encoding="utf-8") as f:
        for line in f:
            n_total += 1
            d = json.loads(line)
            dur = float(d.get("duration_sec") or 0)
            if dur < MIN_SEC or dur > MAX_SEC:
                n_dur += 1
                continue
            text = (d.get("transcript") or "").strip()
            if not text or not HANGUL.search(text):
                n_text += 1
                continue
            rows.append(d)
    print(f"filter: total={n_total:,}, kept={len(rows):,}, drop dur={n_dur:,}, drop text={n_text:,}", file=sys.stderr)
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eval-frac", type=float, default=0.05, help="eval split 비율")
    ap.add_argument("--max-train", type=int, default=None, help="train 양 제한 (debug)")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    if not IN_UTT.exists():
        print(f"❌ {IN_UTT} 없음 — 30_aihub107_explore.py 먼저 실행", file=sys.stderr)
        sys.exit(1)

    rows = load_filter(IN_UTT)

    import random
    random.seed(args.seed)
    random.shuffle(rows)

    n_eval = max(1, int(len(rows) * args.eval_frac))
    eval_rows = rows[:n_eval]
    train_rows = rows[n_eval:]
    if args.max_train:
        train_rows = train_rows[: args.max_train]

    from datasets import Dataset, Audio

    def to_ds(items):
        ds = Dataset.from_list([
            {"audio": r["wav_path"], "text": r["transcript"], "duration": r["duration_sec"]}
            for r in items
        ])
        ds = ds.cast_column("audio", Audio(sampling_rate=16000))
        return ds

    train_ds = to_ds(train_rows)
    eval_ds = to_ds(eval_rows)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    train_ds.save_to_disk(str(OUT_DIR / "train"))
    eval_ds.save_to_disk(str(OUT_DIR / "eval"))

    print(f"=== prepared ===")
    print(f"  train: {len(train_ds):,} → {OUT_DIR / 'train'}")
    print(f"  eval:  {len(eval_ds):,} → {OUT_DIR / 'eval'}")


if __name__ == "__main__":
    main()
