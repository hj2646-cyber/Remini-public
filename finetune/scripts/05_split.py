"""
05 — reviewed.jsonl → train/val/test 분할 (8:1:1)

session 단위로 분할 — 같은 세션의 페어가 train+test 에 섞여 들어가는 leak 방지.
"""

import argparse
import json
import random
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "finetune" / "data" / "pairs" / "reviewed.jsonl"
SPLIT_DIR = ROOT / "finetune" / "data" / "splits"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--ratio", default="8:1:1", help="train:val:test")
    args = ap.parse_args()

    if not SRC.exists():
        print(f"ERROR: {SRC} 없음. 04_apply_review.py 먼저 실행")
        return 1

    pairs = [json.loads(line) for line in open(SRC)]
    # session_id 가 없을 수 있으니 id 의 prefix 사용
    by_session = defaultdict(list)
    for p in pairs:
        # id format: db_<session>_<msgid> | log_<file>_<idx>
        parts = p["id"].split("_")
        sess = "_".join(parts[1:-1]) if len(parts) >= 3 else parts[0]
        by_session[sess].append(p)

    sessions = sorted(by_session.keys())
    rng = random.Random(args.seed)
    rng.shuffle(sessions)

    r = [int(x) for x in args.ratio.split(":")]
    total = sum(r)
    n_sess = len(sessions)
    n_train = n_sess * r[0] // total
    n_val = n_sess * r[1] // total
    train_sess = sessions[:n_train]
    val_sess = sessions[n_train:n_train + n_val]
    test_sess = sessions[n_train + n_val:]

    splits = {"train": train_sess, "val": val_sess, "test": test_sess}
    SPLIT_DIR.mkdir(parents=True, exist_ok=True)
    for name, sess_list in splits.items():
        out = SPLIT_DIR / f"{name}.jsonl"
        rows = []
        for s in sess_list:
            rows.extend(by_session[s])
        with open(out, "w", encoding="utf-8") as f:
            for p in rows:
                f.write(json.dumps(p, ensure_ascii=False) + "\n")
        print(f"  {name:<6} sessions={len(sess_list):>3}  pairs={len(rows):>4}  → {out.name}")

    print(f"\n[총] {n_sess} sessions → {len(pairs)} pairs")


if __name__ == "__main__":
    sys.exit(main())
