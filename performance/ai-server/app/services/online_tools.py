from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from zoneinfo import ZoneInfo

from app.config import settings


_TIME_PATTERNS = [
    r"지금\s*몇\s*시",
    r"현재\s*시간",
    r"지금\s*시간",
]

_DATE_PATTERNS = [
    r"오늘\s*몇\s*요일",
    r"오늘\s*요일",
    r"오늘.*요일",
    r"오늘\s*날짜",
    r"금일\s*날짜",
]


@dataclass
class OnlineResult:
    handled: bool
    reply: str = ""
    mode: str = "none"


def _is_match(text: str, patterns: list[str]) -> bool:
    return any(re.search(p, text) for p in patterns)


def _now_in_tz() -> datetime:
    try:
        tz = ZoneInfo(settings.app_timezone)
    except Exception:
        tz = ZoneInfo("Asia/Seoul")
    return datetime.now(tz)


def _answer_time_date(message: str) -> OnlineResult | None:
    lowered = message.lower()
    now = _now_in_tz()
    weekday_ko = ["월", "화", "수", "목", "금", "토", "일"][now.weekday()]

    if _is_match(lowered, _TIME_PATTERNS):
        reply = f"지금 시각은 {now.strftime('%Y-%m-%d %H:%M')} ({settings.app_timezone})입니다."
        return OnlineResult(handled=True, reply=reply, mode="time")
    if _is_match(lowered, _DATE_PATTERNS):
        reply = f"오늘은 {now.strftime('%Y년 %m월 %d일')} {weekday_ko}요일입니다."
        return OnlineResult(handled=True, reply=reply, mode="date")
    return None


def try_online_answer(message: str) -> OnlineResult:
    msg = (message or "").strip()
    if not msg:
        return OnlineResult(handled=False)

    time_date = _answer_time_date(msg)
    if time_date:
        return time_date

    return OnlineResult(handled=False)
