"""
Step 3 — 30개 yaml KG 자동 검수

체크 항목:
  1. 결혼연도가 자녀 출생연도보다 빠른가
  2. 자녀 성씨 = 부모 첫글자 일치
  3. 자녀 나이 < 부모 나이 - 18
  4. family_type 과 자녀 수 모순 없는가
  5. 사별/이혼 연도가 결혼연도 이후이고 현재 이전인가
  6. health.medications 가 health.conditions 와 정합
  7. preferences.food/hobby/culture 텍스트 추출 통계
  8. 텍스트 fact 와 KG fact 잠재 모순 (텍스트에 다른 음식 명시 시)
"""

import sys
from pathlib import Path
from collections import Counter

import yaml

ROOT = Path(__file__).resolve().parent.parent
PERSONA_DIR = ROOT / "data" / "personas"
THIS_YEAR = 2026

# 02_persona_to_kg.py 와 동일
FOOD_POOL = [
    "된장찌개", "김치찌개", "갈비탕", "잡채", "비빔밥", "보리밥", "청국장",
    "갈비찜", "삼계탕", "냉면", "콩국수", "추어탕", "설렁탕", "곰탕",
    "떡볶이", "수제비", "김밥", "칼국수", "파전", "녹두전",
]
MEDICATION_MAP = {
    "고혈압": ["암로디핀", "로사르탄"],
    "당뇨": ["메트포르민", "글리메피리드"],
    "고지혈증": ["아토르바스타틴", "로수바스타틴"],
    "관절염": ["아세트아미노펜", "셀레콕시브"],
    "백내장": [],
    "위염": ["라베프라졸", "오메프라졸"],
    "골다공증": ["알렌드로네이트"],
    "협심증": ["니트로글리세린", "아스피린"],
    "전립선비대": ["탐스로신"],
    "갑상선 저하증": ["레보티록신"],
}


def check(kg: dict) -> list[str]:
    issues = []
    pid = kg["id"]
    name = kg["name"]
    age = kg["age"]

    # 1. 결혼연도 < 자녀 출생연도
    m_year = kg["marriage"].get("marriage_year")
    for c in kg["children"]:
        c_birth = THIS_YEAR - c["age"]
        if m_year and c_birth <= m_year:
            issues.append(f"{pid} {name}: 자녀 {c['name']} 출생({c_birth}) ≤ 결혼({m_year})")

        # 2. 성씨 일치
        if c["name"][0] != name[0]:
            issues.append(f"{pid} {name}: 자녀 성씨 불일치 ({c['name']})")

        # 3. 자녀 나이 < 부모 나이 - 18
        if c["age"] >= age - 18:
            issues.append(f"{pid} {name}({age}세): 자녀 {c['name']}({c['age']}세) 너무 늦은 출산")

    # 4. family_type vs 자녀 수
    ft = kg["family_type"]
    nc = len(kg["children"])
    if ft == "배우자·자녀와 거주" and nc == 0:
        issues.append(f"{pid} {name}: family_type='{ft}'인데 자녀 0명")
    if ft == "기타2세대" and nc == 0:
        issues.append(f"{pid} {name}: family_type='{ft}'인데 자녀 0명")
    if kg["marriage"]["status"] == "미혼" and nc > 0:
        issues.append(f"{pid} {name}: 미혼인데 자녀 {nc}명")

    # 5. 사별/이혼 연도
    sd = kg["marriage"].get("spouse_death_year")
    dv = kg["marriage"].get("divorce_year")
    if sd and m_year and sd <= m_year:
        issues.append(f"{pid} {name}: 사별연도({sd}) ≤ 결혼연도({m_year})")
    if sd and sd >= THIS_YEAR:
        issues.append(f"{pid} {name}: 사별연도({sd}) ≥ 현재({THIS_YEAR})")
    if dv and m_year and dv <= m_year:
        issues.append(f"{pid} {name}: 이혼연도({dv}) ≤ 결혼연도({m_year})")

    # 6. medications ↔ conditions 정합
    expected_meds = set()
    for c in kg["health"]["conditions"]:
        expected_meds.update(MEDICATION_MAP.get(c, []))
    actual_meds = set(kg["health"]["medications"])
    extra = actual_meds - expected_meds
    if extra:
        issues.append(f"{pid} {name}: 약물 {extra} 가 질환과 무관")

    # 8. KG의 음식 fact ↔ 텍스트 모순
    food = kg["preferences"]["food"]
    food_src = kg["preferences"]["food_source"]
    culinary = kg["text"].get("culinary", "") or ""
    if food_src == "random":
        # fallback 인 경우 텍스트에 풀 단어가 있는데 못 찾았는지 검증
        text_foods = [w for w in FOOD_POOL if w in culinary]
        if text_foods:
            issues.append(f"{pid} {name}: 음식 fallback '{food}'이지만 텍스트에 {text_foods} 존재 (논리 오류)")

    return issues


def summary_stats(kgs: list[dict]) -> None:
    print("\n" + "=" * 60)
    print("[요약 통계]")
    print("=" * 60)

    food_src = Counter(k["preferences"]["food_source"] for k in kgs)
    hobby_src = Counter(k["preferences"]["hobby_source"] for k in kgs)
    culture_src = Counter(k["preferences"]["culture_source"] for k in kgs)
    print(f"\n[preference 출처]")
    print(f"  음식: text={food_src['text']}/30  random={food_src['random']}/30")
    print(f"  취미: text={hobby_src['text']}/30  random={hobby_src['random']}/30")
    print(f"  문화: text={culture_src['text']}/30  random={culture_src['random']}/30")

    n_children = Counter(len(k["children"]) for k in kgs)
    print(f"\n[자녀 수 분포]")
    for n in sorted(n_children):
        print(f"  {n}명: {n_children[n]:>2}")

    n_cond = Counter(len(k["health"]["conditions"]) for k in kgs)
    print(f"\n[질환 수 분포]")
    for n in sorted(n_cond):
        print(f"  {n}개: {n_cond[n]:>2}")

    cond_freq = Counter()
    for k in kgs:
        cond_freq.update(k["health"]["conditions"])
    print(f"\n[질환 빈도 top10]")
    for c, n in cond_freq.most_common(10):
        print(f"  {c:<12} {n:>2}")

    food_freq = Counter(k["preferences"]["food"] for k in kgs)
    print(f"\n[음식 fact 빈도 top10]")
    for f, n in food_freq.most_common(10):
        src_breakdown = Counter(k["preferences"]["food_source"]
                                 for k in kgs if k["preferences"]["food"] == f)
        print(f"  {f:<10} {n:>2}  (text={src_breakdown['text']}, random={src_breakdown['random']})")


def main():
    files = sorted(PERSONA_DIR.glob("P*.yaml"))
    if not files:
        print("ERROR: 페르소나 yaml이 없음. 02_persona_to_kg.py 먼저 실행.")
        return 1

    kgs = [yaml.safe_load(open(f)) for f in files]
    print(f"[1] 검수 대상: {len(kgs)}개 페르소나")

    all_issues = []
    for kg in kgs:
        issues = check(kg)
        all_issues.extend(issues)

    print(f"\n[2] 검수 결과: {len(all_issues)}건 이슈")
    if all_issues:
        for i, msg in enumerate(all_issues, 1):
            print(f"  {i}. {msg}")
    else:
        print("  ✓ 통과")

    summary_stats(kgs)
    return 0 if not all_issues else 2


if __name__ == "__main__":
    sys.exit(main())
