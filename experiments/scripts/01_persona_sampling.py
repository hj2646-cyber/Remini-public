"""
Step 1 — NVIDIA Nemotron-Personas-Korea 분석 + 30명 stratified sampling

실험설계 v5 §1.3 인구학적 분산:
  성별: 남 15, 여 15
  나이: 60대 10, 70대 10, 80대 10
  지역: 수도권 10, 광역시 10, 지방 10
  결혼: 배우자 있음 15, 사별 10, 이혼/미혼 5
  학력: 다양

stratified 전략:
  Stage A — 연령(3) × 성별(2) = 6 cell, 각 5명 → 정확히 30명
  Stage B — 뽑힌 30명의 지역/혼인/학력 분포 보고 (실험설계 v5 대비 갭 표시)

실행:
  python scripts/01_persona_sampling.py --analyze              # 60+ 분포만
  python scripts/01_persona_sampling.py --sample 30 --seed 42  # 30명 추출
"""

import argparse
import sys
from pathlib import Path

import pandas as pd
from datasets import load_dataset

# ---- 실험설계 v5 §1.3 상수 ----
AGE_BINS = [("60대", 60, 69), ("70대", 70, 79), ("80대", 80, 89)]
TARGET_PER_AGE_SEX_CELL = 5  # 6 cell × 5명 = 30명

CAPITAL = {"서울", "경기", "인천"}
METRO = {"부산", "대구", "광주", "대전", "울산", "세종"}

REGION_TARGET = {"수도권": 10, "광역시": 10, "지방": 10}
MARITAL_TARGET = {"배우자있음": 15, "사별": 10, "이혼": 3, "미혼": 2}  # 이혼/미혼=5

ROOT = Path(__file__).resolve().parent.parent  # experiments/
OUT_DIR = ROOT / "data" / "personas"


def classify_region(province: str) -> str:
    if province in CAPITAL:
        return "수도권"
    if province in METRO:
        return "광역시"
    return "지방"


def age_bin(age: int) -> str:
    for name, lo, hi in AGE_BINS:
        if lo <= age <= hi:
            return name
    return ""


def stream_seniors(progress_every: int = 50_000) -> pd.DataFrame:
    """streaming 으로 1M 스캔하면서 60-89세만 메모리에 적재."""
    print(f"[1] streaming nvidia/Nemotron-Personas-Korea ...")
    ds = load_dataset(
        "nvidia/Nemotron-Personas-Korea",
        split="train",
        streaming=True,
    )
    rows = []
    for i, x in enumerate(ds):
        a = x["age"]
        if 60 <= a <= 89:
            rows.append({
                "uuid": x["uuid"],
                "sex": x["sex"],
                "age": a,
                "age_bin": age_bin(a),
                "province": x["province"],
                "district": x["district"],
                "region_class": classify_region(x["province"]),
                "marital_status": x["marital_status"],
                "education_level": x["education_level"],
                "bachelors_field": x.get("bachelors_field", ""),
                "occupation": x["occupation"],
                "family_type": x.get("family_type", ""),
                "housing_type": x.get("housing_type", ""),
                "persona": x["persona"],
                "professional_persona": x["professional_persona"],
                "family_persona": x["family_persona"],
                "culinary_persona": x["culinary_persona"],
                "hobbies_and_interests": x["hobbies_and_interests"],
                "cultural_background": x.get("cultural_background", ""),
            })
        if (i + 1) % progress_every == 0:
            print(f"   스캔 {i+1:>8,} / 1,000,000   60+ 누적 {len(rows):>6,}")
    print(f"   스캔 완료. 60-89세 페르소나: {len(rows):,} 명\n")
    return pd.DataFrame(rows)


def report(df: pd.DataFrame) -> None:
    print("=" * 60)
    print("[2] 60-89세 분포 (실험설계 v5 §1.3 대비)")
    print("=" * 60)

    def show(title: str, series: pd.Series, target: dict | None = None):
        print(f"\n[{title}]  n={len(series):,}")
        vc = series.value_counts()
        for k, v in vc.items():
            line = f"  {k:<15} {v:>7,}  ({v/len(series)*100:5.1f}%)"
            if target and k in target:
                line += f"   목표 {target[k]}명"
            print(line)
        if target:
            missing = [k for k in target if k not in vc.index]
            if missing:
                print(f"  ⚠ 누락 카테고리: {missing}")

    show("성별", df["sex"], {"남자": 15, "여자": 15})
    show("연령대", df["age_bin"], {b: 10 for b, _, _ in AGE_BINS})
    show("지역", df["region_class"], REGION_TARGET)
    show("혼인", df["marital_status"], MARITAL_TARGET)
    show("학력", df["education_level"])


def stratified_sample(df: pd.DataFrame, seed: int) -> pd.DataFrame:
    """Stage A: 연령×성별 6 cell 각 5명. 결정적(seed 고정)."""
    print("=" * 60)
    print("[3] Stage A — 연령(3) × 성별(2) = 6 cell × 5명 = 30명")
    print("=" * 60)
    chunks = []
    for bin_name, lo, hi in AGE_BINS:
        for sex in ("남자", "여자"):
            sub = df[(df["age_bin"] == bin_name) & (df["sex"] == sex)]
            if len(sub) < TARGET_PER_AGE_SEX_CELL:
                print(f"  ⚠ {bin_name}/{sex} 풀 부족: {len(sub)} < {TARGET_PER_AGE_SEX_CELL}")
                chunks.append(sub)
                continue
            picked = sub.sample(n=TARGET_PER_AGE_SEX_CELL, random_state=seed)
            chunks.append(picked)
            print(f"  {bin_name}/{sex}: 풀 {len(sub):>6,} → {TARGET_PER_AGE_SEX_CELL}명")
    sample = pd.concat(chunks, ignore_index=True)
    return sample


def gap_report(sample: pd.DataFrame) -> None:
    """Stage B: 뽑힌 30명의 부차 변수 분포 vs 목표 갭."""
    print("\n" + "=" * 60)
    print("[4] Stage B — 부차 변수 갭 (수동 boost 필요한지 판단)")
    print("=" * 60)

    def diff(name, col, target):
        vc = sample[col].value_counts().to_dict()
        print(f"\n[{name}]")
        for k, t in target.items():
            actual = vc.get(k, 0)
            mark = "✓" if actual == t else ("↑" if actual < t else "↓")
            print(f"  {k:<15} 실제 {actual:>2}  목표 {t:>2}  {mark}")

    diff("지역", "region_class", REGION_TARGET)
    diff("혼인", "marital_status", MARITAL_TARGET)
    print("\n[학력 — 다양성 확인]")
    print(sample["education_level"].value_counts().to_string())


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--analyze", action="store_true", help="60+ 분포만 보고")
    p.add_argument("--sample", type=int, default=0, help="추출할 페르소나 수 (보통 30)")
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--cache", type=str, default=str(OUT_DIR / "_seniors_cache.parquet"),
                   help="60+ 필터 결과 캐시 (재실행 시 streaming 스킵)")
    args = p.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = Path(args.cache)

    if cache_path.exists():
        print(f"[1] 캐시 사용: {cache_path}")
        df = pd.read_parquet(cache_path)
        print(f"   60-89세 페르소나: {len(df):,} 명\n")
    else:
        df = stream_seniors()
        df.to_parquet(cache_path, index=False)
        print(f"   캐시 저장: {cache_path}\n")

    # region_class 는 매칭 사전 변경 시 자동 반영되도록 매번 재계산
    df["region_class"] = df["province"].map(classify_region)

    report(df)

    if args.sample > 0:
        if args.sample != 30:
            print(f"\n⚠ 실험설계 v5 는 30명 기준. --sample {args.sample} 진행하지만 검증식 깨질 수 있음.")
        sample = stratified_sample(df, seed=args.seed)
        gap_report(sample)

        out = OUT_DIR / "raw_sample.csv"
        sample.to_csv(out, index=False, encoding="utf-8-sig")
        print(f"\n[5] 추출 완료 → {out}")
        print(f"   다음 단계: scripts/02_persona_to_kg.py 로 yaml KG 변환")


if __name__ == "__main__":
    sys.exit(main())
