"""
03 — filtered.jsonl → 사람 검수용 CSV

검수자가 작성:
  verdict: PASS / FIX / FAIL
  fixed_assistant: (FIX 일 경우) 수정된 응답
  comment: 자유 코멘트
"""

import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "finetune" / "data" / "pairs" / "filtered.jsonl"
OUT = ROOT / "finetune" / "data" / "pairs" / "review_sheet.csv"
GUIDE = ROOT / "finetune" / "data" / "pairs" / "REVIEW_GUIDE.md"


def main():
    pairs = [json.loads(line) for line in open(SRC)]
    rows = []
    for p in pairs:
        rows.append({
            "id": p["id"],
            "source": p["source"],
            "session_id": p["session_id"],
            "user": p["user"],
            "assistant": p["assistant"],
            "user_emotion": p.get("user_emotion") or "",
            "user_risk_level": p.get("user_risk_level") or "",
            # 검수자 작성
            "verdict": "",
            "fixed_assistant": "",
            "comment": "",
        })
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"[OK] 검수지: {OUT}  ({len(rows)} row)")

    guide = """# Fine-tune 페어 검수 가이드

## 목표
401 페어가 LoRA 학습에 적합한지 사람이 판단. 노이즈 제거.

## 평가 기준 (verdict)
- **PASS** — 그대로 학습 사용 가능
- **FIX** — 응답이 거의 OK 인데 수정 필요. `fixed_assistant` 컬럼에 수정안 작성
- **FAIL** — 학습에서 제외 (잘못된 응답, 부적절, 도메인 벗어남)

## PASS 기준 (회상요법 모범)
1. 환자 발화에 공감·인정 ("그러셨군요", "기억하시는군요")
2. 5W 심문 안 함 ("언제/어디/누구/무엇/왜?" 금지)
3. 1H 위주 ("어떤 느낌이셨어요?")
4. 부정어 없음 ("슬프다/괴롭다/위급" 금지)
5. 사실 교정 안 함 (환자가 틀려도 "그랬군요")
6. 1-2문장, 60자 내외, 차분
7. 망상 동조 안 하면서 위축 안 시킴

## FAIL 사례 (제외)
- 환자 발화 무시하고 엉뚱한 응답
- 5W 심문 ("언제 만나셨나요?")
- 시스템 안내 문구 그대로 노출
- 영어/외국어 끼임
- 너무 길거나 너무 짧음 (자동 필터 통과했어도)
- 환자가 한 말과 모순되는 사실 주장

## FIX 사례 (수정 후 학습 사용)
- 핵심 의미 OK 인데 표현만 어색
- 부정어 한 두 개 → 긍정어로
- 답변에 환자 이름이 잘못 들어감 → 익명화
- `fixed_assistant` 에 수정안 작성

## 작업량
- 한 페어당 약 20-30초
- 401 페어 = 약 2-3시간
- 검수자 1명도 OK (Cohen's κ 측정은 sample 50개 정도만)

## 다음 단계
검수 끝나면:
1. `04_apply_review.py` 실행 → reviewed.jsonl (PASS + FIX 적용)
2. `05_split.py` → train/val/test 분할
3. `06_train_lora.py` → LoRA 학습 시작
"""
    GUIDE.write_text(guide, encoding="utf-8")
    print(f"[OK] 가이드:  {GUIDE}")


if __name__ == "__main__":
    sys.exit(main())
