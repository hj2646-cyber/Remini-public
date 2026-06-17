"""
14 — 페르소나 익명화 모듈 (v2 데이터셋 cross-persona leak 방어)

전략:
  학습 데이터 system context 의 페르소나 정보를 specific fact 가 아닌 일반 카테고리로 대체.
  → 모델이 specific 이름·지명·연도 외우지 않고 system 정보의 *카테고리* 만 활용 학습.
  → 다른 환자 응답 시 그 환자 system 정보 따라가도록 일반화.

변환 룰:
  - name (김원규) → "어르신" (또는 P001 같은 ID)
  - residence.province (인천) → region_class (수도권/광역시/지방)
  - residence.district (인천-부평구) → "동네" / 일반화
  - occupation (건물 경비원) → 일반 카테고리 ("관리·경비")
  - children[i].name (김혜진) → "첫째 자녀분"
  - marriage.marriage_year (1991) → "약 N년 전"

사용:
  from anonymize_v2 import anonymize_persona
  kg_anon = anonymize_persona(kg_dict, this_year=2026)
"""
from __future__ import annotations

OCC_CATEGORIES = {
    # specific occupation → 일반 카테고리
    "건물 경비원": "관리·경비",
    "전화 상담원": "사무·상담",
    "음식 서비스 종사원": "음식 서비스",
    "그 외 상점 판매원": "판매",
    "산불 감시원": "관리·경비",
    "건물 청소원": "관리·청소",
    "요양 보호사": "돌봄·보건",
    "하역 및 적재 관련 단순 종사원": "물류·하역",
    "무직": "은퇴·무직",
}

EDU_CATEGORIES = {
    "초등학교": "초등 학력",
    "중학교": "중등 학력",
    "고등학교": "중등 학력",
    "2~3년제 전문대학": "전문대 학력",
    "4년제 대학교": "대학 학력",
    "대학원": "대학원 학력",
    "무학": "비공식 학력",
}

CHILD_ORDINAL = ["첫째", "둘째", "셋째", "넷째", "다섯째"]


def categorize_occupation(occ: str) -> str:
    if occ in OCC_CATEGORIES:
        return OCC_CATEGORIES[occ]
    # fallback: prefix 기반
    if "관리" in occ or "경비" in occ:
        return "관리·경비"
    if "판매" in occ:
        return "판매"
    if "서비스" in occ:
        return "서비스"
    if "단순" in occ or "하역" in occ:
        return "단순 노무"
    return "기타 직종"


def categorize_education(edu: str) -> str:
    return EDU_CATEGORIES.get(edu, "미상")


def anonymize_persona(kg: dict, this_year: int = 2026, persona_id: str | None = None) -> dict:
    """specific persona KG → 익명화된 일반 표현 KG.

    학습 system context 에 들어갈 형태. 응답 generation 시 specific fact 안 사용.
    """
    age = kg["age"]
    sex = kg["sex"]
    name_anon = persona_id or kg.get("id") or "어르신"
    residence_class = kg["residence"]["region_class"]  # 수도권/광역시/지방

    out = {
        "id": kg.get("id"),
        "label": name_anon,                  # specific 이름 X — ID 또는 "어르신"
        "age": age,                          # 나이는 fact 가 아닌 카테고리 (60대/70대/80대) 정도로 활용
        "age_band": kg.get("age_bin", f"{age // 10}0대"),
        "sex": sex,
        "region_class": residence_class,     # 수도권/광역시/지방
        "education_level": categorize_education(kg["education"]["level"]),
        "occupation_category": categorize_occupation(kg["occupation"]),
        "family_type": kg["family_type"],
        "marriage_status": kg["marriage"]["status"],
    }

    # 결혼·사별·이혼 연도 → "N년 전"
    m = kg.get("marriage", {})
    if m.get("marriage_year"):
        years_ago = this_year - m["marriage_year"]
        out["marriage_years_ago"] = years_ago
    if m.get("spouse_death_year"):
        out["bereaved_years_ago"] = this_year - m["spouse_death_year"]
    if m.get("divorce_year"):
        out["divorced_years_ago"] = this_year - m["divorce_year"]

    # 자녀: 이름 X, 수·성별·연령대만
    children = kg.get("children") or []
    out["n_children"] = len(children)
    if children:
        out["children_summary"] = [
            {
                "ordinal": CHILD_ORDINAL[i] if i < len(CHILD_ORDINAL) else f"{i+1}째",
                "sex": c["sex"],
                "age_band": f"{c['age'] // 10}0대" if c["age"] >= 20 else "젊은",
            }
            for i, c in enumerate(children)
        ]

    # 선호·건강은 fact 카테고리 유지 (specific 음식 이름은 fact-bearing 이라 응답 generation prompt 에서 직접 인용 X)
    out["health_conditions"] = kg.get("health", {}).get("conditions", [])
    # 음식·취미·문화 — generation 시 페르소나 character 단서로만 사용. specific 음식명 응답 텍스트에 노출 안 되도록 instruction.
    p = kg.get("preferences") or {}
    out["preferences_hint"] = {
        "food_kind": p.get("food"),       # ex: 청국장 (응답에 직접 인용 X)
        "hobby_kind": p.get("hobby"),     # ex: 산책
        "culture_kind": p.get("culture"), # ex: 트로트
    }

    return out


def render_persona_for_prompt(anon: dict) -> str:
    """익명화된 KG → system prompt 에 들어갈 한국어 페르소나 요약 텍스트."""
    parts = []
    parts.append(f"환자 ID: {anon['label']} ({anon['age_band']} {anon['sex']})")
    parts.append(f"거주: {anon['region_class']}")
    parts.append(f"학력: {anon['education_level']}")
    parts.append(f"직업 카테고리: {anon['occupation_category']}")
    parts.append(f"가족: {anon['family_type']} (결혼 상태: {anon['marriage_status']})")
    if "marriage_years_ago" in anon:
        parts.append(f"결혼: 약 {anon['marriage_years_ago']}년 전")
    if "bereaved_years_ago" in anon:
        parts.append(f"배우자 사별: 약 {anon['bereaved_years_ago']}년 전")
    if "divorced_years_ago" in anon:
        parts.append(f"이혼: 약 {anon['divorced_years_ago']}년 전")
    parts.append(f"자녀 수: {anon['n_children']}")
    if anon.get("children_summary"):
        cs = ", ".join(f"{c['ordinal']}({c['age_band']} {c['sex']})" for c in anon["children_summary"])
        parts.append(f"자녀: {cs}")
    if anon.get("health_conditions"):
        parts.append(f"건강 키워드: {', '.join(anon['health_conditions'])}")
    p = anon.get("preferences_hint") or {}
    pref = []
    if p.get("food_kind"): pref.append(f"음식 성향({p['food_kind']} 류)")
    if p.get("hobby_kind"): pref.append(f"취미 성향({p['hobby_kind']})")
    if p.get("culture_kind"): pref.append(f"문화 성향({p['culture_kind']})")
    if pref:
        parts.append("선호 힌트: " + ", ".join(pref))
    return "\n".join(parts)


# 자체 테스트
if __name__ == "__main__":
    sample_kg = {
        "id": "P001",
        "name": "김원규",
        "age": 65,
        "age_bin": "60대",
        "sex": "남자",
        "residence": {"province": "인천", "district": "인천-부평구", "region_class": "수도권"},
        "education": {"level": "고등학교"},
        "occupation": "건물 경비원",
        "family_type": "배우자·자녀와 거주",
        "marriage": {"status": "배우자있음", "marriage_year": 1991},
        "children": [
            {"name": "김혜진", "age": 32, "sex": "여자"},
            {"name": "김재영", "age": 30, "sex": "남자"},
        ],
        "health": {"conditions": ["고혈압", "당뇨"]},
        "preferences": {"food": "청국장", "hobby": "산책", "culture": "트로트"},
    }
    a = anonymize_persona(sample_kg)
    print("=== anonymized dict ===")
    import json
    print(json.dumps(a, ensure_ascii=False, indent=2))
    print()
    print("=== rendered prompt ===")
    print(render_persona_for_prompt(a))
