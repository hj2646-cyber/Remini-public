"""
Step 5 — 사람 검수용 시트 생성

산출물:
  data/review/persona_review.csv   — 30 페르소나 KG 검수지 (1차)
  data/review/scenario_review.csv  — 270 시나리오 검수지 (2차, Cohen's κ 측정용)
  data/review/REVIEW_GUIDE.md      — 검수 방법 안내

검수자가 작성할 컬럼:
  reviewer_name      — 검수자 이름 (Cohen's κ 평가자 식별)
  verdict            — PASS / FAIL / FIX (수정 필요)
  comment            — 자유 코멘트
"""

import csv
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
PERSONA_DIR = ROOT / "data" / "personas"
SCENARIO_PATH = ROOT / "data" / "scenarios" / "phase1.csv"
REVIEW_DIR = ROOT / "data" / "review"


def make_persona_sheet():
    files = sorted(PERSONA_DIR.glob("P*.yaml"))
    rows = []
    for f in files:
        k = yaml.safe_load(open(f))
        rows.append({
            "id": k["id"],
            "name": k["name"],
            "age": k["age"],
            "sex": k["sex"],
            "residence": f"{k['residence']['province']} {k['residence']['district']}",
            "education": k["education"]["level"],
            "occupation": k["occupation"],
            "family_type": k["family_type"],
            "marriage_status": k["marriage"]["status"],
            "marriage_year": k["marriage"].get("marriage_year"),
            "n_children": len(k["children"]),
            "children_summary": ", ".join(f"{c['name']}({c['age']}/{c['sex'][0]})" for c in k["children"]),
            "preferences": f"음식:{k['preferences']['food']}/취미:{k['preferences']['hobby']}/문화:{k['preferences']['culture']}",
            "conditions": ", ".join(k["health"]["conditions"]),
            "medications": ", ".join(k["health"]["medications"]),
            "yaml_path": str(f.relative_to(ROOT)),
            # 검수자 작성 컬럼
            "reviewer_name": "",
            "verdict": "",      # PASS / FAIL / FIX
            "comment": "",
        })
    out = REVIEW_DIR / "persona_review.csv"
    with open(out, "w", encoding="utf-8-sig", newline="") as f:  # utf-8-sig: 엑셀 한글 깨짐 방지
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"[OK] 페르소나 검수지: {out}  ({len(rows)} row)")


def make_scenario_sheet():
    with open(SCENARIO_PATH) as f:
        scenarios = list(csv.DictReader(f))
    rows = []
    for s in scenarios:
        rows.append({
            "id": s["id"],
            "persona_id": s["persona_id"],
            "persona_name": s["persona_name"],
            "pattern": s["pattern"],
            "question": s["question"],
            "ground_truth": s["ground_truth"],
            "kg_node": s["kg_node"],
            "note": s["note"],
            # 검수자 작성 컬럼
            "reviewer_name": "",
            "verdict": "",      # PASS / FAIL / FIX
            "comment": "",
        })
    out = REVIEW_DIR / "scenario_review.csv"
    with open(out, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"[OK] 시나리오 검수지: {out}  ({len(rows)} row)")


def make_guide():
    text = """# 검수 가이드 — 실험설계 v5 Step 5

## 두 종류 검수가 있다

### 1차 검수: 페르소나 KG 30개 (`persona_review.csv`)

**목표**: 30명 페르소나가 한국 60-89세 노인으로 자연스러운지, 모순 없는지 확인.

**평가 기준** (`verdict` 컬럼 채우기):
- `PASS` — 그대로 사용 가능
- `FIX` — 일부 수정 필요 (`comment` 에 "결혼연도가 너무 빠름" 등 구체 지적)
- `FAIL` — 사용 불가 (대체 페르소나 필요)

**확인할 것**:
- 이름이 시대상에 맞나 (60-89세 → 1937-1966년생, 그 시대 흔한 이름인가)
- 직업이 연령·성별·학력과 어울리나 (예: 80대 여성이 "산불 감시원" 은 어색)
- 자녀 수·연령이 결혼연도와 정합 (이미 자동 검수됨, 그래도 다시 보면 좋음)
- 거주지 (province + district) 가 정상 행정구역명인가
- 음식·취미·문화 fact 가 본인 캐릭터와 모순 없나
  - 예: 무직 노인이 "맛집 탐방" 취미 → 어색할 수 있음
- preferences 의 `_source: random` 인 항목은 텍스트와 모순될 수 있음 (yaml 직접 열어 확인)

**작업 시간**: 한 명당 약 3-5분 → 30명 = 약 1.5-2.5시간

**출력**: 검수자 본인 이름을 `reviewer_name` 에 적고, verdict + comment 채우기.
같은 시트를 **2-3명이 독립적으로** 작성 (Cohen's κ 측정용 → 평가자 간 일치도)


### 2차 검수: 시나리오 270개 (`scenario_review.csv`)

**목표**: 자동 생성된 270개 질문이 실제 RAG 평가에 사용 가능한지 확인.

**평가 기준** (`verdict` 컬럼):
- `PASS` — 질문·답이 명확하고 패턴 의도대로 동작
- `FIX` — 표현만 어색 (예: "전라남에 살고 있다" → "전라남도에 살고 있다") — comment 에 수정안
- `FAIL` — 질문이 모호하거나 ground_truth 가 틀림

**패턴별 확인 포인트**:

| 패턴 | 확인할 것 |
|------|-----------|
| T-거주지 | ground_truth 가 정확한 행정구역명인가 |
| T-직업 | 답이 KG occupation 과 일치 |
| T-학력 | 답이 KG education_level 과 일치 |
| F-반대 | fake 거주지가 실재 행정구역인가 |
| F-비존재 | 질문이 "정보 없음" 답이 자연스러운가 |
| F-시점오류 | 다른 연도가 명백히 틀렸나 (10-15년 차) |
| ADV-부분일치 | fake 가 실제와 단어 일부만 겹치는가 (의미상 다른 직업) |
| ADV-시점근접 | 정확히 ±1년 차인가 |
| ADV-유사인물 | fake 이름이 실제와 명백히 다른가 (혼동 의도) |

**Sample 검수도 OK** — 270개 다 보기 부담스러우면 패턴별 5개씩 = 45개 sample 만 → 그래도 Cohen's κ 측정 충분.

**작업 시간**: 한 시나리오당 30초 → 270개 = 약 2.5시간 (sample 검수 시 약 30분)


## Cohen's κ 계산 (검수 끝난 후)

검수자 2-3명의 verdict 라벨 모아서 `scripts/06_cohen_kappa.py` (예정) 가 자동 계산.
- κ > 0.6 = substantial agreement (실험설계 v5 §3.10 기준)
- κ < 0.4 = 평가 기준 불명확 → 가이드 보완 후 재검수


## CSV 편집 팁

- 엑셀 / Google Sheets / LibreOffice 어디서 열어도 OK (utf-8-sig 인코딩)
- `verdict` 셀에 **PASS / FIX / FAIL** 셋 중 하나만
- `comment` 는 한국어 자유 서술
- 작성 후 파일명에 본인 이름 붙이기 (예: `scenario_review_홍길동.csv`)
"""
    out = REVIEW_DIR / "REVIEW_GUIDE.md"
    out.write_text(text, encoding="utf-8")
    print(f"[OK] 검수 가이드: {out}")


def main():
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    make_persona_sheet()
    make_scenario_sheet()
    make_guide()
    print(f"\n다음: 검수자가 CSV 채워서 돌려주면 06_cohen_kappa.py (추후) 로 일치도 측정.")


if __name__ == "__main__":
    sys.exit(main())
