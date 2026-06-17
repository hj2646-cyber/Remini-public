"""
Step 4 — 30개 yaml KG → 270개 Phase 1 시나리오 생성

실험설계 v5 §2.5 시나리오 패턴 (페르소나당 9개):
  T 사실 #1 (거주지)        — KG fact 그대로
  T 사실 #2 (직업)
  T 사실 #3 (학력)
  F 반대 (거주지 다른 시도)
  F 비존재 (반려동물 등 KG에 없는 fact)
  F 시점오류 (결혼연도 ±10년 / 미혼이면 출생연도 ±10)
  ADV 부분일치 (직업 비슷한 다른 직업)
  ADV 시점근접 (결혼연도 ±1년 / 미혼이면 출생연도 ±1)
  ADV 유사인물 (자녀 이름 풀에서 fake / 무자녀면 본인 이름 fake)

방침:
  코드로 결정적 생성 (LLM 호출 없음). seed=uuid 해시.
  ground_truth 는 항상 "T" / "F" / 사실값. RAGAS Faithfulness/Recall 평가에 그대로 사용.

산출물:
  data/scenarios/phase1.csv — 270 row
  컬럼: id, persona_id, pattern, question, ground_truth, kg_node, note
"""

import csv
import hashlib
import random
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
PERSONA_DIR = ROOT / "data" / "personas"
SCENARIO_DIR = ROOT / "data" / "scenarios"
THIS_YEAR = 2026

# F 반대용 — region_class 별 다른 시도
FAKE_PROVINCE_MAP = {
    "수도권": ["전북", "경상북", "강원", "전라남"],
    "광역시": ["경기", "충청북", "충청남", "경상남"],
    "지방": ["서울", "부산", "대구", "인천"],
}

# ADV 부분일치 — 직업 fake (의미적으로 비슷하지만 다름)
FAKE_OCC_MAP = {
    "건물 경비원": "산업 경비원",
    "음식 서비스 종사원": "주방 보조원",
    "전화 상담원": "전화 영업원",
    "요양 보호사": "요양 시설 청소원",
    "그 외 상점 판매원": "편의점 판매원",
    "산불 감시원": "산림 관리원",
    "건물 청소원": "건물 관리인",
    "하역 및 적재 관련 단순 종사원": "물류 창고 관리원",
}

# 자녀 이름 풀 (02 와 동일)
CHILD_NAMES_M = ["민수", "준호", "지훈", "성호", "재영", "동현", "현우", "병철",
                 "광호", "성민", "정우", "기훈", "영수", "철수", "상현"]
CHILD_NAMES_F = ["지영", "수진", "은영", "현주", "미경", "선영", "지윤", "혜진",
                 "정희", "영숙", "혜영", "수정", "민지", "유진", "은주"]


def seeded_rng(uuid_str: str, salt: str = "") -> random.Random:
    h = int(hashlib.md5((uuid_str + salt).encode()).hexdigest(), 16)
    return random.Random(h)


# ---- 9 패턴 함수: 각 페르소나 KG 받아 dict 반환 ----

def t1_residence(kg, rng):
    r = kg["residence"]
    # district = "인천-부평구" 형식 → "부평구"만 추출 (province 와 결합 시 중복 제거)
    district_short = r["district"].split("-", 1)[-1] if "-" in r["district"] else r["district"]
    return {
        "pattern": "T-거주지",
        "question": f"{kg['name']} 씨의 거주지는 어디인가요?",
        "ground_truth": f"{r['province']} {district_short}",
        "kg_node": "residence",
        "note": "",
    }


def t2_occupation(kg, rng):
    return {
        "pattern": "T-직업",
        "question": f"{kg['name']} 씨의 직업은 무엇인가요?",
        "ground_truth": kg["occupation"],
        "kg_node": "occupation",
        "note": "",
    }


def t3_education(kg, rng):
    return {
        "pattern": "T-학력",
        "question": f"{kg['name']} 씨의 최종 학력은 무엇인가요?",
        "ground_truth": kg["education"]["level"],
        "kg_node": "education",
        "note": "",
    }


def f_opposite(kg, rng):
    actual = kg["residence"]["province"]
    region = kg["residence"]["region_class"]
    candidates = [p for p in FAKE_PROVINCE_MAP.get(region, ["서울"]) if p != actual]
    fake = rng.choice(candidates) if candidates else "서울"
    return {
        "pattern": "F-반대",
        "question": f"{kg['name']} 씨는 {fake}에 살고 있다. (참/거짓)",
        "ground_truth": "F",
        "kg_node": "residence",
        "note": f"실제 거주: {actual}",
    }


def f_nonexistent(kg, rng):
    # 조사 처리 회피 위해 "(은/는) 무엇" 대신 명사구로 끝내기
    options = [
        "반려동물의 이름은 무엇인가요?",
        "현재 운영 중인 사업자명은 무엇인가요?",
        "정기 후원하는 단체의 이름은 무엇인가요?",
        "최근 가입한 동호회의 이름은 무엇인가요?",
    ]
    suffix = rng.choice(options)
    return {
        "pattern": "F-비존재",
        "question": f"{kg['name']} 씨의 {suffix}",
        "ground_truth": "정보 없음",
        "kg_node": "none",
        "note": "KG에 해당 fact 없음 — 환각 측정용",
    }


def f_year_error(kg, rng):
    m_year = kg["marriage"].get("marriage_year")
    if m_year:
        fake = m_year + rng.choice([-15, -10, 10, 15])
        return {
            "pattern": "F-시점오류",
            "question": f"{kg['name']} 씨는 {fake}년에 결혼했다. (참/거짓)",
            "ground_truth": "F",
            "kg_node": "marriage",
            "note": f"실제 결혼: {m_year}",
        }
    # 미혼 fallback: 출생연도 ±10
    fake = kg["birth_year"] + rng.choice([-10, 10])
    return {
        "pattern": "F-시점오류",
        "question": f"{kg['name']} 씨는 {fake}년에 태어났다. (참/거짓)",
        "ground_truth": "F",
        "kg_node": "birth_year",
        "note": f"실제 출생: {kg['birth_year']}",
    }


def adv_partial(kg, rng):
    occ = kg["occupation"]
    # 무직 페르소나는 직업 부분일치 어색 → 거주지 부분일치로 fallback
    if occ == "무직":
        actual_district = kg["residence"]["district"].split("-", 1)[-1]
        # "부평구" → "부천시" 같은 비슷하지만 다른 시군구 (단순 fake)
        fake_district = actual_district[:-1] + "시" if actual_district.endswith("구") else actual_district[:-1] + "구"
        return {
            "pattern": "ADV-부분일치",
            "question": f"{kg['name']} 씨는 {kg['residence']['province']} {fake_district}에 산다. (참/거짓)",
            "ground_truth": "F",
            "kg_node": "residence",
            "note": f"실제: {actual_district} (행정구역 명칭 일부 겹침)",
        }
    fake = FAKE_OCC_MAP.get(occ, occ + " 관리자")
    return {
        "pattern": "ADV-부분일치",
        "question": f"{kg['name']} 씨의 직업은 {fake}이다. (참/거짓)",
        "ground_truth": "F",
        "kg_node": "occupation",
        "note": f"실제: {occ} (단어 일부 겹침)",
    }


def adv_year_close(kg, rng):
    m_year = kg["marriage"].get("marriage_year")
    if m_year:
        fake = m_year + rng.choice([-1, 1])
        return {
            "pattern": "ADV-시점근접",
            "question": f"{kg['name']} 씨는 {fake}년에 결혼했다. (참/거짓)",
            "ground_truth": "F",
            "kg_node": "marriage",
            "note": f"실제 결혼: {m_year} (1년 차)",
        }
    # 미혼 fallback
    fake = kg["birth_year"] + rng.choice([-1, 1])
    return {
        "pattern": "ADV-시점근접",
        "question": f"{kg['name']} 씨는 {fake}년에 태어났다. (참/거짓)",
        "ground_truth": "F",
        "kg_node": "birth_year",
        "note": f"실제 출생: {kg['birth_year']} (1년 차)",
    }


def adv_similar_name(kg, rng):
    children = kg["children"]
    if children:
        c = rng.choice(children)
        surname = kg["name"][0]
        actual_first = c["name"][1:]
        pool = CHILD_NAMES_M if c["sex"] == "남자" else CHILD_NAMES_F
        candidates = [n for n in pool if n != actual_first]
        fake_first = rng.choice(candidates)
        fake = surname + fake_first
        return {
            "pattern": "ADV-유사인물",
            "question": f"{kg['name']} 씨의 자녀 이름은 {fake}이다. (참/거짓)",
            "ground_truth": "F",
            "kg_node": "children",
            "note": f"실제: {c['name']}",
        }
    # 무자녀 fallback: 본인 이름 fake
    actual = kg["name"]
    pool = CHILD_NAMES_M if kg["sex"] == "남자" else CHILD_NAMES_F
    fake = actual[0] + rng.choice([n for n in pool if n != actual[1:]])
    return {
        "pattern": "ADV-유사인물",
        "question": f"이 사람의 이름은 {fake}이다. (참/거짓)",
        "ground_truth": "F",
        "kg_node": "name",
        "note": f"실제: {actual}",
    }


PATTERNS = [
    ("T-거주지", t1_residence),
    ("T-직업", t2_occupation),
    ("T-학력", t3_education),
    ("F-반대", f_opposite),
    ("F-비존재", f_nonexistent),
    ("F-시점오류", f_year_error),
    ("ADV-부분일치", adv_partial),
    ("ADV-시점근접", adv_year_close),
    ("ADV-유사인물", adv_similar_name),
]


def main():
    SCENARIO_DIR.mkdir(parents=True, exist_ok=True)
    persona_files = sorted(PERSONA_DIR.glob("P*.yaml"))
    rows = []
    for pf in persona_files:
        kg = yaml.safe_load(open(pf))
        for slot, (pat_name, fn) in enumerate(PATTERNS):
            rng = seeded_rng(kg["uuid"], salt=pat_name)
            sc = fn(kg, rng)
            rows.append({
                "id": f"{kg['id']}-Q{slot+1:02d}-{pat_name}",
                "persona_id": kg["id"],
                "persona_name": kg["name"],
                "pattern": sc["pattern"],
                "question": sc["question"],
                "ground_truth": sc["ground_truth"],
                "kg_node": sc["kg_node"],
                "note": sc["note"],
            })

    out = SCENARIO_DIR / "phase1.csv"
    fieldnames = ["id", "persona_id", "persona_name", "pattern",
                  "question", "ground_truth", "kg_node", "note"]
    with open(out, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
    print(f"[OK] {len(rows)}개 시나리오 → {out}")
    # 패턴별 카운트
    from collections import Counter
    cnt = Counter(r["pattern"] for r in rows)
    print("\n[패턴별 분포]")
    for p, n in cnt.items():
        print(f"  {p:<15} {n}")


if __name__ == "__main__":
    sys.exit(main())
