"""출력 필터 — 위험 관리 루프 Phase 3.

LLM 생성 답변을 TTS/DB 저장 전에 정규식·치환표로 후처리.

- FORBIDDEN_PATTERNS: 민감정보 제공/의료 진단 등 절대 금지 패턴 감지 시
  문장 전체를 안전 redirect 문장으로 대체.
- REPLACEMENT_TABLE: 책의 "좌절·수치심 유발" 표현을 부드러운 대체어로.
- NEGATIVE_WORDS: 책에서 금지한 부정어("슬프다/괴롭다/위급하다/곤란하다" 등) 제거.

정규식만 사용 → LLM 재호출 없이 문장당 1~2ms로 빠름.
망상 동조는 **입력 분류기(Phase 2)가 system prompt에 사전 주입**하여 선방어 —
출력단에서 후처리하지 않는다(생성 자체를 막는 게 안전).
"""

from __future__ import annotations

import re
from dataclasses import dataclass


SAFE_REDIRECT = "그 이야기보다는, 어릴 적에 가장 기억에 남는 장면이 있으세요?"


# 감지 시 문장을 안전 redirect로 대체 (민감정보 제공/의료 진단/약 복용 지시)
_FORBIDDEN_PATTERNS: list[re.Pattern[str]] = [
    # 민감 정보 알려주는 패턴 — 구체 숫자/키워드 제공
    re.compile(r"(비밀번호|계좌번호|주민번호|현금카드).{0,20}(입니다|이에요|예요|은|는|:)"),
    # 복용/처방 지시
    re.compile(r"(이\s*약|이\s*약을).{0,10}(드세요|먹으세요|복용하세요)"),
    re.compile(r"(처방해\s*드릴|진단됩니다|증상은\s*.{0,10}(입니다|이에요))"),
]

# 좌절·수치심 유발 표현 → 부드러운 대체 (책 26p No 액션)
_REPLACEMENT_TABLE: dict[str, str] = {
    "틀렸어요": "그럴 수 있죠",
    "틀렸습니다": "그렇게 느끼실 수도 있죠",
    "틀렸네요": "그럴 수도 있겠네요",
    "아니에요": "그렇게 느끼실 수도 있겠네요",
    "아닙니다": "그럴 수도 있겠어요",
    "다시 말해 보세요": "천천히 해도 괜찮아요",
    "다시 말해봐": "천천히 해도 괜찮아요",
    "다시 말해주세요": "편하신 대로 말씀해 주세요",
    "그것도 몰라요": "제가 궁금해서 여쭤봤어요",
    "그것도 모르세요": "제가 한번 여쭤본 거예요",
    "모르세요?": "혹시 기억나시는 게 있으실까요?",
    "잘못 알고": "다르게 기억하실 수 있어요. ",
    "에이, 거짓말": "",
    "거짓말 하지": "",
}

# 책에서 금지한 부정어 — 제거 (주변 조사 포함 자연스럽게)
_NEGATIVE_WORDS: list[str] = [
    "슬프다", "슬퍼요", "슬프네요",
    "괴롭다", "괴로워요", "괴롭네요",
    "위급하다", "위급해요",
    "곤란하다", "곤란해요",
    "불쌍하다", "불쌍해요",
    "가엾다", "가여워요",
]


@dataclass
class FilterResult:
    text: str
    blocked: bool          # 금지 패턴 히트 → SAFE_REDIRECT로 대체됨
    replaced: int          # 치환 건수
    removed_negatives: int  # 제거된 부정어 수


def apply(text: str) -> FilterResult:
    """문장/답변에 필터 적용. 원본 보존, 후처리 결과 반환."""
    if not text:
        return FilterResult(text="", blocked=False, replaced=0, removed_negatives=0)

    # 1. 금지 패턴 검사 — 히트 시 SAFE_REDIRECT로 교체 후 종료
    for pattern in _FORBIDDEN_PATTERNS:
        if pattern.search(text):
            return FilterResult(
                text=SAFE_REDIRECT,
                blocked=True,
                replaced=0,
                removed_negatives=0,
            )

    working = text

    # 2. 치환표 적용
    replaced_count = 0
    for bad, good in _REPLACEMENT_TABLE.items():
        if bad in working:
            working = working.replace(bad, good)
            replaced_count += 1

    # 3. 부정어 제거 (주변 공백 정리)
    removed_count = 0
    for word in _NEGATIVE_WORDS:
        if word in working:
            # "~이(가) 슬프다" 같은 구문이면 조사까지 부드럽게 제거하긴 어려우니
            # 단어만 공백으로 치환하고 이중 공백 정리.
            working = working.replace(word, "")
            removed_count += 1

    # 4. 이중 공백/문장부호 정리
    working = re.sub(r"\s+", " ", working)
    working = re.sub(r"\s+([,.!?])", r"\1", working)
    working = working.strip()

    return FilterResult(
        text=working,
        blocked=False,
        replaced=replaced_count,
        removed_negatives=removed_count,
    )


def apply_text(text: str) -> str:
    """단순 헬퍼: 필터 결과 텍스트만 반환."""
    return apply(text).text
