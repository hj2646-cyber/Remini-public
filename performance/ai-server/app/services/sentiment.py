from __future__ import annotations


CRISIS_KEYWORDS = [
    "죽고",
    "죽고싶",
    "자살",
    "없어지고 싶",
    "해치고 싶",
    "포기하고 싶",
    "살기 싫",
]

SAD_KEYWORDS = [
    "불안",
    "우울",
    "무서",
    "외로",
    "슬퍼",
    "답답",
]

CALM_KEYWORDS = [
    "괜찮",
    "좋아",
    "편안",
    "안심",
    "고마",
]


def classify_emotion(text: str) -> tuple[str, bool]:
    lowered = text.lower()

    crisis_flag = any(k in lowered for k in CRISIS_KEYWORDS)
    if crisis_flag:
        return "crisis", True

    sad_hits = sum(1 for k in SAD_KEYWORDS if k in lowered)
    calm_hits = sum(1 for k in CALM_KEYWORDS if k in lowered)

    if sad_hits > calm_hits:
        return "sad", False
    if calm_hits > sad_hits:
        return "calm", False
    return "neutral", False


def classify_risk_level(text: str, emotion: str, crisis_flag: bool) -> str:
    if crisis_flag:
        return "danger"
    lowered = text.lower()
    if any(k in lowered for k in SAD_KEYWORDS) or emotion == "sad":
        return "watch"
    return "daily"
