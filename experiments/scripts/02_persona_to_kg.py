"""
Step 2 — raw_sample.csv → 30개 yaml KG 변환

전략:
  NVIDIA 직접 매핑: 이름(persona에서 정규식), 나이, 성별, 거주지, 학력, 직업,
                   결혼상태, family_type, housing_type, 페르소나 텍스트 5종
  ★ 임의 설정 (Python random, seed=uuid 해시):
    - 결혼/사별/이혼 연도 (age 기반)
    - 자녀 수 (family_type 매핑) + 이름/나이/성별/동거여부
    - 즐겨먹는 음식 / 취미 / 좋아하는 문화 (단일 fact)
    - 주요 질환 1~3개 (연령대별 빈도)
    - 복용 약물 (질환 → 매핑)

산출물:
  data/personas/P001.yaml ~ P030.yaml
  data/personas/manifest.csv  — id, uuid, name, age, sex, province 매핑
"""

import argparse
import hashlib
import random
import re
import sys
from pathlib import Path

import pandas as pd
import yaml

ROOT = Path(__file__).resolve().parent.parent
PERSONA_DIR = ROOT / "data" / "personas"
THIS_YEAR = 2026  # CLAUDE.md currentDate

# ---- ★ 임의 설정 풀 ----
FOOD_POOL = [
    "된장찌개", "김치찌개", "갈비탕", "잡채", "비빔밥", "보리밥", "청국장",
    "갈비찜", "삼계탕", "냉면", "콩국수", "추어탕", "설렁탕", "곰탕",
    "떡볶이", "수제비", "김밥", "칼국수", "파전", "녹두전",
]
HOBBY_POOL = [
    "산책", "TV 시청", "낚시", "텃밭 가꾸기", "노래 부르기", "독서",
    "라디오 듣기", "바둑", "장기", "화투", "등산", "수영", "사진 찍기",
    "꽃꽂이", "서예", "맛집 탐방",
]
CULTURE_POOL = [
    "트로트", "조용필 노래", "이미자 노래", "나훈아 노래", "임영웅 노래",
    "옛날 영화", "사극 드라마", "전국노래자랑", "가요무대", "주말 드라마",
    "9시 뉴스", "동물 다큐멘터리", "내셔널 지오그래픽",
]
COMMON_CONDITIONS = [
    "고혈압", "당뇨", "고지혈증", "관절염", "백내장", "위염",
    "골다공증", "협심증", "전립선비대", "갑상선 저하증",
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
# 자녀 이름 풀 (시대상에 맞는 흔한 한국 이름)
CHILD_NAMES_M = ["민수", "준호", "지훈", "성호", "재영", "동현", "현우", "병철",
                 "광호", "성민", "정우", "기훈", "영수", "철수", "상현"]
CHILD_NAMES_F = ["지영", "수진", "은영", "현주", "미경", "선영", "지윤", "혜진",
                 "정희", "영숙", "혜영", "수정", "민지", "유진", "은주"]


def seeded_rng(uuid_str: str) -> random.Random:
    """uuid 기반 시드 — 30명 모두 결정적 + 독립적 random 시퀀스."""
    h = int(hashlib.md5(uuid_str.encode()).hexdigest(), 16)
    return random.Random(h)


def pick_from_text_or_fallback(text: str, pool: list[str], rng: random.Random) -> tuple[str, str]:
    """
    텍스트에 풀 단어가 있으면 그중 랜덤 추출 (텍스트와 일관),
    없으면 풀에서 fallback. (값, 출처) 반환 — 출처는 'text' or 'random'.
    """
    text = text or ""
    found = [w for w in pool if w in text]
    if found:
        return rng.choice(found), "text"
    return rng.choice(pool), "random"


def extract_name(persona_text: str) -> str:
    """'김원규 씨는 ...' 패턴에서 이름 추출."""
    m = re.match(r"\s*([가-힣]{2,4})\s*씨", persona_text)
    if m:
        return m.group(1)
    # fallback — 첫 토큰
    return persona_text.strip().split()[0]


def num_children_dist(family_type: str, marital_status: str, rng: random.Random) -> int:
    """family_type + marital_status → 자녀 수 분포."""
    if marital_status == "미혼":
        return 0
    if family_type == "혼자 거주":
        return rng.choices([0, 1, 2, 3], weights=[3, 3, 3, 1])[0]
    if family_type == "배우자와 거주":
        return rng.choices([0, 1, 2, 3], weights=[1, 3, 4, 2])[0]
    if family_type == "배우자·자녀와 거주":
        return rng.choices([1, 2, 3], weights=[3, 4, 3])[0]
    if family_type == "친인척과 거주":
        return rng.choices([0, 1, 2], weights=[2, 3, 2])[0]
    if family_type == "기타2세대":
        return rng.choices([1, 2, 3], weights=[2, 3, 2])[0]
    return rng.randint(0, 2)


def build_children(parent_name: str, parent_age: int, marriage_year: int,
                   family_type: str, num: int, rng: random.Random) -> list[dict]:
    """자녀 num명 생성. 결혼 후 1~5년 부터 출산 시작, 2~4년 간격."""
    if num == 0:
        return []
    surname = parent_name[0]  # 첫 글자 = 성
    first_birth = marriage_year + rng.randint(1, 5)
    children = []
    used_names = set()
    for i in range(num):
        cb_year = first_birth + i * rng.randint(2, 4)
        cb_year = min(cb_year, THIS_YEAR - 18)  # 자녀는 최소 18세
        sex = rng.choices(["남자", "여자"], weights=[1, 1])[0]
        pool = CHILD_NAMES_M if sex == "남자" else CHILD_NAMES_F
        name = rng.choice([n for n in pool if n not in used_names] or pool)
        used_names.add(name)
        living_with = (family_type in {"배우자·자녀와 거주", "기타2세대"}) and (i == 0)
        children.append({
            "name": surname + name,
            "age": THIS_YEAR - cb_year,
            "sex": sex,
            "living_with": living_with,
        })
    return children


def build_health(age: int, rng: random.Random) -> tuple[list[str], list[str]]:
    """연령대별 질환 수 — 60대 1~2개, 70대 2~3개, 80대 2~4개."""
    if age < 70:
        n = rng.choices([1, 2], weights=[2, 1])[0]
    elif age < 80:
        n = rng.choices([2, 3], weights=[3, 2])[0]
    else:
        n = rng.choices([2, 3, 4], weights=[2, 3, 1])[0]
    conditions = rng.sample(COMMON_CONDITIONS, n)
    meds = []
    for c in conditions:
        meds.extend(MEDICATION_MAP.get(c, []))
    # 너무 많으면 추리기 — 한 약 두 번 안 들어가게
    meds = list(dict.fromkeys(meds))
    if len(meds) > 4:
        meds = rng.sample(meds, 4)
    return conditions, meds


def marriage_dates(marital_status: str, age: int, rng: random.Random) -> dict:
    """결혼·사별·이혼 연도 ★ 임의."""
    if marital_status == "미혼":
        return {
            "status": "미혼",
            "marriage_year": None,
            "spouse_death_year": None,
            "divorce_year": None,
        }
    age_at_marriage = rng.choice([23, 25, 27, 28, 30, 33])
    marriage_year = THIS_YEAR - age + age_at_marriage
    out = {
        "status": marital_status,
        "marriage_year": marriage_year,
        "spouse_death_year": None,
        "divorce_year": None,
    }
    if marital_status == "사별":
        # 사별: 결혼연도 + 30~50년 후, 단 현재보다 앞
        years_after = rng.randint(30, 50)
        death_year = min(marriage_year + years_after, THIS_YEAR - 1)
        out["spouse_death_year"] = death_year
    elif marital_status == "이혼":
        years_after = rng.randint(10, 30)
        out["divorce_year"] = min(marriage_year + years_after, THIS_YEAR - 1)
    return out


def build_kg(idx: int, row: pd.Series) -> dict:
    rng = seeded_rng(row["uuid"])
    name = extract_name(row["persona"])
    age = int(row["age"])
    birth_year = THIS_YEAR - age
    bachelors_field = None if row["bachelors_field"] == "해당없음" else row["bachelors_field"]

    marriage = marriage_dates(row["marital_status"], age, rng)

    n_children = num_children_dist(row["family_type"], row["marital_status"], rng)
    marriage_year = marriage["marriage_year"] or (THIS_YEAR - age + 25)
    children = build_children(name, age, marriage_year, row["family_type"], n_children, rng)

    conditions, medications = build_health(age, rng)

    food, food_src = pick_from_text_or_fallback(row["culinary_persona"], FOOD_POOL, rng)
    hobby, hobby_src = pick_from_text_or_fallback(row["hobbies_and_interests"], HOBBY_POOL, rng)
    culture_text = (row["cultural_background"] or "") + " " + (row["hobbies_and_interests"] or "")
    culture, culture_src = pick_from_text_or_fallback(culture_text, CULTURE_POOL, rng)

    kg = {
        "id": f"P{idx:03d}",
        "uuid": row["uuid"],
        "name": name,
        "birth_year": birth_year,
        "age": age,
        "sex": row["sex"],
        "residence": {
            "province": row["province"],
            "district": row["district"],
            "region_class": row["region_class"],
        },
        "education": {
            "level": row["education_level"],
            "field": bachelors_field,
        },
        "occupation": row["occupation"],
        "family_type": row["family_type"],
        "housing_type": row["housing_type"],
        "marriage": marriage,
        "children": children,
        "preferences": {
            "food": food,
            "food_source": food_src,
            "hobby": hobby,
            "hobby_source": hobby_src,
            "culture": culture,
            "culture_source": culture_src,
        },
        "health": {
            "conditions": conditions,
            "medications": medications,
        },
        "text": {
            "persona": row["persona"],
            "family": row["family_persona"],
            "culinary": row["culinary_persona"],
            "hobbies": row["hobbies_and_interests"],
            "cultural": row["cultural_background"],
        },
    }
    return kg


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default=str(PERSONA_DIR / "raw_sample.csv"))
    ap.add_argument("--out-dir", default=str(PERSONA_DIR))
    args = ap.parse_args()

    df = pd.read_csv(args.input)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    manifest_rows = []
    for i, (_, row) in enumerate(df.iterrows(), start=1):
        kg = build_kg(i, row)
        path = out_dir / f"{kg['id']}.yaml"
        with open(path, "w", encoding="utf-8") as f:
            yaml.safe_dump(kg, f, allow_unicode=True, sort_keys=False, default_flow_style=False)
        manifest_rows.append({
            "id": kg["id"],
            "uuid": kg["uuid"],
            "name": kg["name"],
            "age": kg["age"],
            "sex": kg["sex"],
            "province": kg["residence"]["province"],
            "marital_status": kg["marriage"]["status"],
            "n_children": len(kg["children"]),
            "n_conditions": len(kg["health"]["conditions"]),
            "yaml_path": str(path.relative_to(ROOT)),
        })

    manifest = pd.DataFrame(manifest_rows)
    manifest_path = out_dir / "manifest.csv"
    manifest.to_csv(manifest_path, index=False, encoding="utf-8-sig")

    print(f"[OK] {len(manifest)}명 yaml KG 생성 → {out_dir}/P001~P{len(manifest):03d}.yaml")
    print(f"[OK] 매니페스트 → {manifest_path}\n")
    print(manifest.to_string(index=False))


if __name__ == "__main__":
    sys.exit(main())
