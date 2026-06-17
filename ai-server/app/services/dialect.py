"""사투리(dialect) 지원 모듈.

지역별 방언 스타일 정의, 프롬프트 생성, 입력 정규화를 담당합니다.
보호자 앱에서 지역과 강도를 설정하면 LLM 응답과 STT 후처리에 반영됩니다.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal


# ---------------------------------------------------------------------------
# 지원 지역 목록
# ---------------------------------------------------------------------------
DialectRegion = Literal[
    "standard",       # 표준어 (기본값)
    "gyeongsang",     # 경상도
    "jeolla",         # 전라도
    "chungcheong",    # 충청도
    "jeju",           # 제주도
    "gangwon",        # 강원도
]

REGION_DISPLAY_NAMES: dict[str, str] = {
    "standard": "표준어",
    "gyeongsang": "경상도",
    "jeolla": "전라도",
    "chungcheong": "충청도",
    "jeju": "제주도",
    "gangwon": "강원도",
}


# ---------------------------------------------------------------------------
# 강도 레벨
# ---------------------------------------------------------------------------
DialectIntensity = Literal["light", "medium", "strong"]

INTENSITY_DISPLAY: dict[str, str] = {
    "light": "약하게 (살짝 억양만)",
    "medium": "중간 (자연스러운 방언)",
    "strong": "강하게 (진한 사투리)",
}


# ---------------------------------------------------------------------------
# 지역별 LLM 프롬프트 지침
# ---------------------------------------------------------------------------

@dataclass
class _DialectProfile:
    """한 지역의 사투리 스타일 정의."""
    region: str
    description: str
    # 강도별 프롬프트 지침 (LLM system prompt에 삽입)
    prompt_light: str
    prompt_medium: str
    prompt_strong: str
    # 대표 어미/표현 예시 (LLM 참고용)
    examples: list[str] = field(default_factory=list)
    # STT 입력 정규화 매핑 (사투리 표현 → 표준어)
    input_normalize_map: dict[str, str] = field(default_factory=dict)


_PROFILES: dict[str, _DialectProfile] = {
    "gyeongsang": _DialectProfile(
        region="경상도",
        description="경상도 사투리 (부산, 대구, 경북, 경남 지역)",
        prompt_light=(
            "답변할 때 경상도 억양이 살짝 느껴지도록 해주세요. "
            "문장 끝에 가끔 '~예', '~요' 대신 '~이요', '~데이' 같은 표현을 섞어주세요. "
            "전체적으로 표준어 기반이되 경상도 느낌이 살짝 나면 됩니다."
        ),
        prompt_medium=(
            "경상도 사투리로 자연스럽게 대화하세요. "
            "문장 끝에 '~입니더', '~데이', '~나', '~가', '~이가' 같은 경상도 어미를 사용하세요. "
            "'무엇'은 '뭐꼬', '왜'는 '와', '아니다'는 '아이다', '그렇다'는 '그카다' 등을 자연스럽게 섞으세요. "
            "예시: '밥 묵었나?', '오늘 기분이 어떠카노?', '그래 맞데이.', '참 잘했데이.'"
        ),
        prompt_strong=(
            "진한 경상도 사투리로 대화하세요. 표준어를 거의 쓰지 말고 경상도 말투를 최대한 살리세요. "
            "'~입니더', '~데이', '~가?', '~나?', '~꼬?', '~노?' 같은 어미를 적극 사용하세요. "
            "'하다'→'카다', '그렇다'→'그카다', '뭐하니'→'뭐하노', '왜'→'와', "
            "'아니야'→'아이가', '좋다'→'좋다 아이가', '정말'→'참말로', '많이'→'마이' "
            "예시: '밥 묵었나? 오늘은 뭐 할 기가?', '참말로 잘했데이.', '그거 마이 좋다 아이가.'"
        ),
        examples=[
            "밥 묵었나?",
            "오늘 기분이 어떠카노?",
            "그래 맞데이.",
            "참말로 잘했데이.",
            "그거 마이 좋다 아이가.",
        ],
        input_normalize_map={
            "묵었나": "먹었어",
            "뭐하노": "뭐하니",
            "카다": "하다",
            "그카다": "그렇다",
            "아이다": "아니다",
            "아이가": "아니야",
            "데이": "요",
            "마이": "많이",
            "참말로": "정말로",
            "와": "왜",
            "뭐꼬": "뭐야",
            "가주나": "가자",
            "했데이": "했어요",
        },
    ),
    "jeolla": _DialectProfile(
        region="전라도",
        description="전라도 사투리 (광주, 전북, 전남 지역)",
        prompt_light=(
            "답변할 때 전라도 억양이 살짝 느껴지도록 해주세요. "
            "문장 끝에 가끔 '~잉', '~부러' 같은 표현을 살짝 섞어주세요. "
            "전체적으로 표준어 기반이되 전라도 느낌이 살짝 나면 됩니다."
        ),
        prompt_medium=(
            "전라도 사투리로 자연스럽게 대화하세요. "
            "문장 끝에 '~잉', '~부러', '~것이여', '~당께', '~그랑께', '~드랑게' 같은 전라도 어미를 사용하세요. "
            "'무엇'은 '뭣이여', '그래서'는 '그랑께', '정말'은 '진짜로', '알겠다'는 '알겄어' 등을 자연스럽게 섞으세요. "
            "예시: '밥 먹었어잉?', '오늘 기분이 어떻당가?', '잘했부러.', '그것이 맞는겨.'"
        ),
        prompt_strong=(
            "진한 전라도 사투리로 대화하세요. 표준어를 거의 쓰지 말고 전라도 말투를 최대한 살리세요. "
            "'~잉', '~부러', '~것이여', '~당께', '~그랑께', '~거시기' 같은 어미와 표현을 적극 사용하세요. "
            "'하다'→'허다', '그렇다'→'그렇당께', '뭐하니'→'뭣 허고 있어잉', "
            "'아니야'→'아녀잉', '좋다'→'좋당께', '정말'→'참말로', '거기'→'거시기' "
            "예시: '밥 먹었어잉?', '거시기 그것이 맞는 것이여.', '참말로 잘했부러.'"
        ),
        examples=[
            "밥 먹었어잉?",
            "오늘 기분이 어떻당가?",
            "잘했부러.",
            "그것이 맞는 것이여.",
            "거시기 그거 좋당께.",
        ],
        input_normalize_map={
            "잉": "",
            "부러": "요",
            "것이여": "거예요",
            "당께": "요",
            "그랑께": "그래서",
            "거시기": "그것",
            "뭣이여": "뭐예요",
            "허다": "하다",
            "아녀": "아니",
            "드랑게": "요",
        },
    ),
    "chungcheong": _DialectProfile(
        region="충청도",
        description="충청도 사투리 (대전, 충북, 충남 지역)",
        prompt_light=(
            "답변할 때 충청도 억양이 살짝 느껴지도록 해주세요. "
            "말을 천천히 하는 느낌으로, 가끔 '~유', '~여' 같은 표현을 살짝 섞어주세요."
        ),
        prompt_medium=(
            "충청도 사투리로 자연스럽게 대화하세요. "
            "말을 느긋하고 천천히 하는 충청도 특유의 느낌을 살려주세요. "
            "문장 끝에 '~유', '~여', '~슈', '~구먼유', '~당가유' 같은 충청도 어미를 사용하세요. "
            "'그래요'는 '그려유', '뭐해요'는 '뭐 하셔유', '맞아요'는 '맞구먼유' 등을 섞으세요. "
            "예시: '밥 먹었슈?', '오늘 기분이 어떠셔유?', '그려유 맞아유.', '잘했구먼유.'"
        ),
        prompt_strong=(
            "진한 충청도 사투리로 대화하세요. 느긋하고 여유로운 말투를 최대한 살리세요. "
            "'~유', '~여', '~슈', '~구먼유', '~당가유', '~디유' 같은 어미를 적극 사용하세요. "
            "'하다'→'허다', '그래요'→'그려유', '뭐해요'→'뭐 하셔유', "
            "'정말'→'참말로', '빨리'→'얼른', '좋다'→'좋구먼유' "
            "예시: '밥 먹었슈? 오늘은 뭐 할 거여유?', '참말로 잘했구먼유.', '그게 좋겄슈.'"
        ),
        examples=[
            "밥 먹었슈?",
            "오늘 기분이 어떠셔유?",
            "그려유 맞아유.",
            "잘했구먼유.",
            "그게 좋겄슈.",
        ],
        input_normalize_map={
            "유": "요",
            "슈": "요",
            "구먼": "",
            "그려": "그래",
            "겄": "겠",
            "당가": "",
            "디유": "요",
        },
    ),
    "jeju": _DialectProfile(
        region="제주도",
        description="제주도 사투리 (제주 지역)",
        prompt_light=(
            "답변할 때 제주도 억양이 살짝 느껴지도록 해주세요. "
            "가끔 '~마씸', '~수다' 같은 표현을 살짝 섞어주세요."
        ),
        prompt_medium=(
            "제주도 사투리로 자연스럽게 대화하세요. "
            "문장 끝에 '~마씸', '~수다', '~우다', '~쿠다' 같은 제주도 어미를 사용하세요. "
            "'어머니'는 '어멍', '아버지'는 '아방', '무엇'은 '뭐시', '뭐해요'는 '뭐 햄수과?' 등을 섞으세요. "
            "예시: '밥 먹엉마씸?', '오늘 기분이 어떵 하우꽈?', '경 허주마씸.', '잘 햄수다.'"
        ),
        prompt_strong=(
            "진한 제주도 사투리로 대화하세요. 제주 특유의 표현을 최대한 살리세요. "
            "'~마씸', '~수다', '~우다', '~쿠다', '~주마씸' 같은 어미를 적극 사용하세요. "
            "'하다'→'하다/허다', '어머니'→'어멍', '아버지'→'아방', "
            "'무엇'→'뭐시/무신거', '나'→'나/느', '이것'→'이거', '저것'→'저거' "
            "예시: '밥 먹엉마씸? 오늘은 뭐시 할 거우꽈?', '경 잘 햄수다.', '혼저 옵서예.'"
        ),
        examples=[
            "밥 먹엉마씸?",
            "오늘 기분이 어떵 하우꽈?",
            "경 허주마씸.",
            "잘 햄수다.",
            "혼저 옵서예.",
        ],
        input_normalize_map={
            "마씸": "요",
            "수다": "요",
            "우다": "요",
            "어멍": "어머니",
            "아방": "아버지",
            "뭐시": "뭐",
            "무신거": "무엇",
            "햄수과": "해요",
            "경": "그렇게",
            "혼저": "어서",
            "옵서예": "오세요",
        },
    ),
    "gangwon": _DialectProfile(
        region="강원도",
        description="강원도 사투리 (강원 지역)",
        prompt_light=(
            "답변할 때 강원도 억양이 살짝 느껴지도록 해주세요. "
            "가끔 '~래요', '~겠지래요' 같은 표현을 살짝 섞어주세요."
        ),
        prompt_medium=(
            "강원도 사투리로 자연스럽게 대화하세요. "
            "문장 끝에 '~래요', '~겠지래요', '~답디다', '~이래요' 같은 강원도 어미를 사용하세요. "
            "'그래요'는 '그래래요', '정말'은 '참말로', '뭐해요'는 '뭐 해래요' 등을 섞으세요. "
            "예시: '밥 먹었어래요?', '오늘 기분이 어떠래요?', '그래래요 맞아래요.'"
        ),
        prompt_strong=(
            "진한 강원도 사투리로 대화하세요. 강원도 말투를 최대한 살리세요. "
            "'~래요', '~겠지래요', '~답디다', '~이래요' 같은 어미를 적극 사용하세요. "
            "소박하고 정감 있는 느낌을 최대한 살려주세요. "
            "예시: '밥 먹었어래요? 오늘은 뭐 할 거래요?', '참말로 잘했답디다.'"
        ),
        examples=[
            "밥 먹었어래요?",
            "오늘 기분이 어떠래요?",
            "그래래요 맞아래요.",
            "참말로 잘했답디다.",
        ],
        input_normalize_map={
            "래요": "요",
            "답디다": "요",
            "이래요": "이에요",
        },
    ),
}


# ---------------------------------------------------------------------------
# Per-user dialect setting store (in-memory, keyed by user_id)
# ---------------------------------------------------------------------------

@dataclass
class DialectSetting:
    region: DialectRegion = "standard"
    intensity: DialectIntensity = "medium"


class DialectStore:
    """사용자별 사투리 설정을 관리합니다."""

    def __init__(self) -> None:
        self._store: dict[str, DialectSetting] = {}

    def get(self, user_id: str) -> DialectSetting:
        return self._store.get(user_id, DialectSetting())

    def set(self, user_id: str, region: DialectRegion, intensity: DialectIntensity = "medium") -> DialectSetting:
        setting = DialectSetting(region=region, intensity=intensity)
        self._store[user_id] = setting
        return setting

    def remove(self, user_id: str) -> None:
        self._store.pop(user_id, None)

    def list_all(self) -> dict[str, DialectSetting]:
        return dict(self._store)


dialect_store = DialectStore()


# ---------------------------------------------------------------------------
# LLM 프롬프트 생성
# ---------------------------------------------------------------------------

def build_dialect_prompt(user_id: str | None) -> str | None:
    """사용자의 사투리 설정에 맞는 LLM 시스템 프롬프트 조각을 반환합니다.

    표준어이거나 user_id가 없으면 None을 반환합니다.
    """
    if not user_id:
        return None

    setting = dialect_store.get(user_id)
    if setting.region == "standard":
        return None

    profile = _PROFILES.get(setting.region)
    if profile is None:
        return None

    if setting.intensity == "light":
        style_instruction = profile.prompt_light
    elif setting.intensity == "strong":
        style_instruction = profile.prompt_strong
    else:
        style_instruction = profile.prompt_medium

    examples_text = "\n".join(f"  - {ex}" for ex in profile.examples[:5])

    return (
        f"[사투리 설정: {profile.region} / 강도: {INTENSITY_DISPLAY[setting.intensity]}]\n"
        f"{style_instruction}\n\n"
        f"대표 표현 예시:\n{examples_text}\n\n"
        "중요: 사투리를 쓰되, 따뜻하고 정감 있는 느낌을 유지하세요. "
        "환자가 이해하기 어려운 극단적 표현은 피하세요."
    )


# ---------------------------------------------------------------------------
# STT 입력 정규화 (사투리 → 표준어 보조 매핑)
# ---------------------------------------------------------------------------

def normalize_dialect_input(text: str, user_id: str | None) -> str:
    """사투리 입력을 표준어로 정규화합니다.

    현재는 키워드 치환 방식이며, LLM이 사투리를 이해하도록 돕는 보조 역할입니다.
    원본 텍스트는 보존하고, 정규화된 버전을 LLM 컨텍스트에 함께 전달합니다.
    """
    if not user_id or not text:
        return text

    setting = dialect_store.get(user_id)
    if setting.region == "standard":
        return text

    profile = _PROFILES.get(setting.region)
    if profile is None:
        return text

    normalized = text
    for dialect_word, standard_word in profile.input_normalize_map.items():
        # 단어 경계를 고려하지 않는 단순 치환 (어미/접미사가 많으므로)
        normalized = normalized.replace(dialect_word, standard_word)

    return normalized.strip()


def get_dialect_context_for_llm(text: str, user_id: str | None) -> str | None:
    """STT 입력이 사투리일 수 있을 때, LLM에 전달할 보조 컨텍스트를 생성합니다.

    원본 텍스트와 정규화된 텍스트가 다르면 힌트를 반환합니다.
    """
    if not user_id:
        return None

    setting = dialect_store.get(user_id)
    if setting.region == "standard":
        return None

    normalized = normalize_dialect_input(text, user_id)
    if normalized == text:
        return None

    region_name = REGION_DISPLAY_NAMES.get(setting.region, setting.region)
    return (
        f"참고: 환자가 {region_name} 사투리를 사용합니다. "
        f"원본 발화: \"{text}\"\n"
        f"표준어 해석 참고: \"{normalized}\"\n"
        "사투리 표현을 이해하고 자연스럽게 대응해 주세요."
    )


# ---------------------------------------------------------------------------
# 지원 지역 정보 조회 (API용)
# ---------------------------------------------------------------------------

def get_available_regions() -> list[dict]:
    """사용 가능한 지역 목록을 반환합니다."""
    regions = [{"id": "standard", "name": "표준어", "description": "표준어 (기본값)"}]
    for region_id, profile in _PROFILES.items():
        regions.append({
            "id": region_id,
            "name": profile.region,
            "description": profile.description,
            "examples": profile.examples[:3],
        })
    return regions


def get_available_intensities() -> list[dict]:
    """사용 가능한 강도 목록을 반환합니다."""
    return [
        {"id": k, "name": v}
        for k, v in INTENSITY_DISPLAY.items()
    ]
