"""
15 — 페르소나 풀 v2 — 60명으로 확장 (기존 30명 + 추가 30명)

기존 experiments/data/personas/_seniors_cache.parquet (322,911명) 에서
새로 30명 stratified sampling → experiments/data/personas/raw_sample_v2.csv (60명 통합)

Stage A 와 동일: 연령(3) × 성별(2) = 6 cell × 10명 = 60명

이 풀은 v2 발화 generation 시 random pick 용. 이전 30명 (P001~P030) 도 포함되어 있어
KG yaml 그대로 재사용 가능. 추가 30명은 익명화 후 system context 에만 활용.
"""
import argparse
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
PERSONA_DIR = ROOT / "experiments" / "data" / "personas"
CACHE = PERSONA_DIR / "_seniors_cache.parquet"
EXISTING = PERSONA_DIR / "raw_sample.csv"
OUT = PERSONA_DIR / "raw_sample_v2.csv"

AGE_BINS = [("60대", 60, 69), ("70대", 70, 79), ("80대", 80, 89)]
PER_CELL_TOTAL = 10  # 60명 / 6 cell


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=43)  # 기존 sample (seed=42) 와 다른 seed
    ap.add_argument("--total-per-cell", type=int, default=PER_CELL_TOTAL)
    args = ap.parse_args()

    if not CACHE.exists():
        print(f"ERROR: {CACHE} 없음. 01_persona_sampling.py 먼저 실행")
        return 1
    if not EXISTING.exists():
        print(f"ERROR: {EXISTING} 없음.")
        return 1

    print(f"[1] 캐시 로드: {CACHE}")
    df = pd.read_parquet(CACHE)
    print(f"   60-89세 풀: {len(df):,}")

    print(f"[2] 기존 30명 uuid 제외")
    existing = pd.read_csv(EXISTING)
    df_pool = df[~df["uuid"].isin(existing["uuid"])]
    print(f"   잔여 풀: {len(df_pool):,}")

    print(f"[3] 추가 30명 stratified sampling (seed={args.seed})")
    chunks = [existing]
    for bin_name, lo, hi in AGE_BINS:
        for sex in ("남자", "여자"):
            sub = df_pool[(df_pool["age_bin"] == bin_name) & (df_pool["sex"] == sex)]
            n_add = args.total_per_cell - len(existing[(existing["age_bin"] == bin_name) & (existing["sex"] == sex)])
            if n_add <= 0:
                continue
            picked = sub.sample(n=n_add, random_state=args.seed)
            chunks.append(picked)
            print(f"   {bin_name}/{sex}: 풀 {len(sub):,} → +{n_add}명")

    sample_v2 = pd.concat(chunks, ignore_index=True)
    sample_v2.to_csv(OUT, index=False, encoding="utf-8-sig")
    print(f"\n[4] {len(sample_v2)}명 통합 풀 → {OUT}")
    print(f"\n[분포 확인]")
    print(sample_v2.groupby(["age_bin", "sex"]).size())
    print(f"\n region_class 분포:")
    print(sample_v2["region_class"].value_counts())


if __name__ == "__main__":
    sys.exit(main())
