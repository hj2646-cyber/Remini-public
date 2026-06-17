"""환자 발화 입력 분류기 — 회상요법 위험 관리 루프의 첫 단계.

5종 유형으로 분류:
- 일상확인형: 평범한 일상 대화 (식사, 날씨, 기분)
- 회상유도형: 과거 경험/가족/추억 관련
- 민감정보형: 비밀번호/의료/약/돈 관련
- 위험감정형: 자해·자살·공격성
- 혼란·망상형: 비현실적 주장 (도둑·피해 망상)

LLM(Ollama) 호출 + 키워드 폴백 하이브리드.
LLM 실패/타임아웃 시 키워드만으로도 기본 분류를 반환.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass
from typing import Literal

import requests

from app.config import settings

logger = logging.getLogger(__name__)

LABELS = ("일상확인형", "회상유도형", "민감정보형", "위험감정형", "혼란·망상형")
LabelType = Literal[
    "일상확인형", "회상유도형", "민감정보형", "위험감정형", "혼란·망상형", "UNKNOWN"
]

CLASSIFIER_PROMPT = """당신은 치매 환자 대화의 입력 분류기입니다.
환자 발화를 아래 5가지 중 하나로만 분류하세요.

- 일상확인형: 현재 날씨·식사·기분 등 평범한 일상 대화
- 회상유도형: 과거 경험·가족·고향·추억에 관한 이야기
- 민감정보형: 비밀번호·계좌·주민번호·약·의료 진단 관련 요구
- 위험감정형: 자해·자살·극심한 좌절·공격성 표현
- 혼란·망상형: 비현실적 피해·도둑·박해 주장

예시:
발화: "오늘 점심 뭐 먹을까" → 일상확인형
발화: "어릴 때 논밭에서 뛰놀았지" → 회상유도형
발화: "통장 비밀번호 알려줘" → 민감정보형
발화: "다 끝내고 싶어" → 위험감정형
발화: "누가 내 물건을 훔쳐갔어" → 혼란·망상형

분류할 발화: "{utterance}"

정확히 5개 라벨 중 하나만, 다른 말 없이 한 단어로 출력하세요."""

# 키워드 기반 플래그/폴백 추정
_DELUSION_HINTS = ("훔쳐", "훔쳤", "굶겨", "죽이려", "몰래", "빼돌", "도둑", "독을 넣")
_SECRET_HINTS = ("비밀번호", "계좌번호", "주민번호", "현금카드", "약 먹", "처방", "진단", "금고")
_NEGATIVE_HINTS = ("슬프", "괴로", "외로", "무섭", "불안", "짜증", "답답")
_CRISIS_HINTS = ("죽고 싶", "자살", "끝내고 싶", "해치고 싶", "사라지고 싶", "뛰어내리")
_REMINISCE_HINTS = (
    "옛날", "어릴", "어렸", "젊었", "예전", "그때",
    "엄마", "어머니", "아버지", "아빠", "아들", "딸", "손주", "손녀", "며느리",
    "고향", "시골",
)


@dataclass
class ClassifierResult:
    label: LabelType
    contains_delusion: bool
    requests_secret: bool
    negative_emotion_level: int  # 0(중립) ~ 3(위기)
    raw_output: str
    latency_ms: float


def _parse_label(raw: str) -> LabelType:
    """모델 출력에서 5개 라벨 중 하나를 추출."""
    stripped = raw.strip()
    for label in LABELS:
        if stripped == label:
            return label  # type: ignore[return-value]
    for label in LABELS:
        if label in raw:
            return label  # type: ignore[return-value]
    return "UNKNOWN"


def _keyword_only_label(utt: str) -> LabelType:
    """LLM 분류기 실패/비활성 시 키워드 휴리스틱 폴백."""
    if any(h in utt for h in _CRISIS_HINTS):
        return "위험감정형"
    if any(h in utt for h in _DELUSION_HINTS):
        return "혼란·망상형"
    if any(h in utt for h in _SECRET_HINTS):
        return "민감정보형"
    if any(k in utt for k in _REMINISCE_HINTS):
        return "회상유도형"
    return "일상확인형"


def _derive_flags(utterance: str, label: LabelType) -> tuple[bool, bool, int]:
    """라벨 + 키워드로 플래그 파생."""
    contains_delusion = label == "혼란·망상형" or any(h in utterance for h in _DELUSION_HINTS)
    requests_secret = label == "민감정보형" or any(h in utterance for h in _SECRET_HINTS)

    emo_level = 0
    if any(h in utterance for h in _NEGATIVE_HINTS):
        emo_level = 1
    if label == "위험감정형":
        emo_level = max(emo_level, 2)
    if any(h in utterance for h in _CRISIS_HINTS):
        emo_level = 3
    return contains_delusion, requests_secret, emo_level


def classify_utterance(
    utterance: str,
    timeout_sec: float | None = None,
) -> ClassifierResult:
    """Ollama 분류기 모델로 환자 발화를 5종 유형 중 하나로 분류."""
    utt = (utterance or "").strip()
    if not utt:
        return ClassifierResult(
            label="UNKNOWN",
            contains_delusion=False,
            requests_secret=False,
            negative_emotion_level=0,
            raw_output="",
            latency_ms=0.0,
        )

    if not settings.classifier_enabled:
        label = _keyword_only_label(utt)
        d, s, e = _derive_flags(utt, label)
        return ClassifierResult(label, d, s, e, "", 0.0)

    model = settings.classifier_model
    timeout = timeout_sec if timeout_sec is not None else settings.classifier_timeout_sec

    prompt = CLASSIFIER_PROMPT.format(utterance=utt)
    payload = {
        "model": model,
        "stream": False,
        "messages": [{"role": "user", "content": prompt}],
        "options": {
            "temperature": 0.0,
            "top_p": 1.0,
            "num_ctx": 1024,
            "num_predict": 20,
        },
    }

    t0 = time.perf_counter()
    raw = ""
    try:
        r = requests.post(
            f"{settings.ollama_base_url}/api/chat",
            json=payload,
            timeout=timeout,
        )
        r.raise_for_status()
        raw = r.json().get("message", {}).get("content", "").strip()
    except Exception as exc:
        logger.warning("classifier call failed: %s — keyword fallback", exc)

    elapsed_ms = (time.perf_counter() - t0) * 1000.0
    label = _parse_label(raw) if raw else "UNKNOWN"
    if label == "UNKNOWN":
        label = _keyword_only_label(utt)

    d, s, e = _derive_flags(utt, label)
    return ClassifierResult(
        label=label,
        contains_delusion=d,
        requests_secret=s,
        negative_emotion_level=e,
        raw_output=raw,
        latency_ms=elapsed_ms,
    )


def build_guidance_for_result(result: ClassifierResult) -> str | None:
    """분류 결과에 따라 LLM에 추가로 주입할 system 지침.

    반환값이 None이면 별도 지침 불필요 (기본 SYSTEM_PROMPT로 충분).
    """
    if result.label == "혼란·망상형" or result.contains_delusion:
        return (
            "[입력 분류 결과: 혼란·망상형]\n"
            "환자가 망상·피해·박해 관련 발화를 했습니다. "
            "논리로 반박하지도, 동조하지도 마세요. "
            "환자의 감정(불안·두려움)을 짧게 알아주고, 긍정적인 기억으로 자연스럽게 화제를 옮기세요."
        )
    if result.label == "민감정보형" or result.requests_secret:
        return (
            "[입력 분류 결과: 민감정보형]\n"
            "환자가 비밀번호·계좌·의료·약 같은 민감 정보를 묻거나 언급했습니다. "
            "구체적인 정보를 알려주거나 캐묻지 마세요. 주제를 부드럽게 안전한 회상으로 돌리세요."
        )
    if result.label == "회상유도형":
        return (
            "[입력 분류 결과: 회상유도형]\n"
            "환자가 회상 유도 신호를 보냈습니다. "
            "참고 기억에서 관련된 장면/감각 단서를 적극 활용해 대화를 생생하게 키워 주세요."
        )
    if result.label == "일상확인형":
        return (
            "[입력 분류 결과: 일상확인형]\n"
            "환자가 지금-여기 일상(날씨·식사·기분·TV·요즘 관심사)을 이야기하고 있습니다. "
            "굳이 옛 기억으로 화제를 돌리지 말고, 그 일상 이야기에 센스있게 맞장구치고 "
            "가볍게 공감하거나 관련된 다른 일상 화제로 자연스럽게 이어가세요. "
            "질문은 해도 하나만, 안 해도 됩니다."
        )
    # 위험감정형(위기 가드 선처리)/UNKNOWN → 추가 지시 불필요
    return None
