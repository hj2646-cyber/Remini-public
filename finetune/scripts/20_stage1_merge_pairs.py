"""
20 — Stage 1 학습 데이터 통합

input:
  finetune/data/pairs/reviewed_merged.jsonl   (자연 검수 PASS+FIX, ~1,129)
  finetune/data/pairs/raw_pairs_synth.jsonl   (합성 NVIDIA, 300)
  finetune/data/pairs/raw_pairs_external.jsonl (KorEmpathetic distill, 500)
  finetune/data/v2/pairs_71703_distill.jsonl  (71703 5K)

output:
  finetune/data/v2/stage1_pairs.jsonl  (~6,900 페어, 학습용)
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCES = [
    ("reviewed", ROOT / "finetune" / "data" / "pairs" / "reviewed_merged.jsonl"),
    ("synth", ROOT / "finetune" / "data" / "pairs" / "raw_pairs_synth.jsonl"),
    ("kor_empathetic", ROOT / "finetune" / "data" / "pairs" / "raw_pairs_external.jsonl"),
    ("71703_distill", ROOT / "finetune" / "data" / "v2" / "pairs_71703_distill.jsonl"),
]
OUT = ROOT / "finetune" / "data" / "v2" / "stage1_pairs.jsonl"


def main():
    all_pairs = []
    for tag, path in SOURCES:
        if not path.exists():
            print(f"  [skip] {tag}: {path} 없음")
            continue
        rows = [json.loads(l) for l in open(path)]
        # 통일 schema: {id, source, user, assistant}
        for r in rows:
            r.setdefault("source", tag)
            if "user" not in r or "assistant" not in r:
                continue
            all_pairs.append({
                "id": r.get("id", f"{tag}_{len(all_pairs)}"),
                "source": r["source"],
                "user": r["user"],
                "assistant": r["assistant"],
                "meta": {k: v for k, v in r.items() if k not in ("id", "source", "user", "assistant")},
            })
        print(f"  [{tag}] {len(rows):,}")

    # 길이 / empty 필터
    kept = []
    for p in all_pairs:
        u, a = p["user"], p["assistant"]
        if not u or not a or len(u) < 4 or len(a) < 8 or len(a) > 400:
            continue
        kept.append(p)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        for p in kept:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    from collections import Counter
    src_counts = Counter(p["source"] for p in kept)
    print(f"\n[통합 결과]")
    for s, n in src_counts.most_common():
        print(f"  {s:<20} {n:,}")
    print(f"  합: {len(kept):,} 페어")
    print(f"\n출력: {OUT}")


if __name__ == "__main__":
    sys.exit(main())
