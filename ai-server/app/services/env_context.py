"""Real-world environment context — 시간 + 위치 + 날씨.

LLM 의 환각·시간 무지 (밤에 산책 화제, 흐린 날 맑다고 단정 등) 를 해소하기 위해
매 응답 직전 system message 로 주입할 실시간 환경 정보를 제공.

- 시간: datetime.now() (외부 API X)
- 위치: settings.location_name (정적, 시연 = "부산 금정구")
- 날씨: OpenWeatherMap (lat/lon 직접, 30분 cache, 무료 60 calls/min)

CLAUDE.md "모든 AI 모델은 오픈소스 로컬 전용" 정책 예외:
- 본 모듈은 **AI 모델이 아닌 단순 정보 fetch** (Neo4j Aura 와 동급 예외).
- 모델 가중치·학습·추론 X. 환경 사실 1회 fetch + cache.
"""

from __future__ import annotations

import logging
import threading
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Optional

import requests

from app.config import settings

logger = logging.getLogger(__name__)


@dataclass
class WeatherSnapshot:
    desc: str          # 한국어 description ("흐림", "약한 비")
    desc_easy: str     # 노인 친화 변환본 ("박무" → "옅은 안개")
    main: str          # 영문 main category ("Clouds", "Rain", "Clear")
    weather_id: int    # OpenWeatherMap condition code (200~804)
    temp: float        # 섭씨
    feels_like: float
    humidity: int      # %
    wind_speed: float  # m/s
    fetched_at: datetime


def _humanize_weather(weather_id: int, original_desc: str) -> str:
    """기상청 전문 용어 → 노인 친화 일상 한국어.

    참고: https://openweathermap.org/weather-conditions (id 표준)
    원본 `lang=kr` desc 의 어려운 용어 (박무·연무·안개비·진눈깨비 등) 를
    노인이 일상에서 쓰는 단순 표현으로 매핑.
    """
    # Thunderstorm 2xx
    if 200 <= weather_id < 300:
        return "천둥치는 비"
    # Drizzle 3xx — 안개비/적은비 → "가는 비"
    if 300 <= weather_id < 400:
        return "가는 비"
    # Rain 5xx
    if 500 <= weather_id < 600:
        if weather_id in (500, 520):
            return "약한 비"
        if weather_id == 501:
            return "비"
        if weather_id in (502, 521):
            return "굵은 비"
        if weather_id in (503, 504, 522, 531):
            return "폭우"
        if weather_id == 511:
            return "비"
        return "비"
    # Snow 6xx — 진눈깨비 → "비 섞인 눈"
    if 600 <= weather_id < 700:
        if weather_id in (600, 620):
            return "약한 눈"
        if weather_id == 601:
            return "눈"
        if weather_id in (602, 621, 622):
            return "함박눈"
        if weather_id in (611, 612, 613, 615, 616):
            return "비 섞인 눈"
        return "눈"
    # Atmosphere 7xx — 박무·연무·모래·먼지 등
    if 700 <= weather_id < 800:
        if weather_id in (701, 741):   # Mist (박무), Fog (안개)
            return "옅은 안개"
        if weather_id == 711:           # Smoke (연기)
            return "공기가 뿌연 날"
        if weather_id == 721:           # Haze (연무)
            return "공기가 흐릿함"
        if weather_id in (731, 751, 761):  # 모래 먼지/모래/먼지
            return "미세먼지"
        if weather_id == 762:           # 화산재
            return "공기가 안 좋음"
        if weather_id == 771:           # 스콜
            return "갑작스런 비바람"
        if weather_id == 781:           # 토네이도
            return "강한 회오리바람"
        return "흐릿한 공기"
    # Clear 800
    if weather_id == 800:
        return "맑음"
    # Clouds 80x
    if 801 <= weather_id < 900:
        if weather_id in (801, 802):
            return "구름 조금"
        if weather_id == 803:
            return "구름 많음"
        if weather_id == 804:
            return "흐림"
    return original_desc  # fallback


_LOCK = threading.Lock()
_CACHE: dict[str, WeatherSnapshot] = {}
_CACHE_TTL = timedelta(minutes=30)


def _classify_period(hour: int) -> str:
    if 0 <= hour < 6:
        return "새벽 (대부분 주무시는 시간)"
    if 6 <= hour < 9:
        return "이른 아침"
    if 9 <= hour < 12:
        return "오전"
    if 12 <= hour < 14:
        return "점심 무렵"
    if 14 <= hour < 18:
        return "오후"
    if 18 <= hour < 21:
        return "저녁"
    return "밤 (대부분 주무시거나 실내에 계실 시간)"


def get_weather() -> Optional[WeatherSnapshot]:
    """OpenWeatherMap 좌표 기반 호출 + 30분 cache. 실패 시 None."""
    api_key = (settings.openweather_api_key or "").strip()
    lat = settings.weather_lat
    lon = settings.weather_lon
    if not api_key or lat is None or lon is None:
        return None

    key = f"{lat:.3f},{lon:.3f}"
    now = datetime.now()

    with _LOCK:
        cached = _CACHE.get(key)
        if cached and (now - cached.fetched_at) < _CACHE_TTL:
            return cached

    try:
        r = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "lat": lat, "lon": lon,
                "appid": api_key,
                "units": "metric",
                "lang": "kr",
            },
            timeout=3.0,
        )
        if not r.ok:
            logger.warning("openweather %d: %s", r.status_code, (r.text or "")[:200])
            return None
        j = r.json()
        w0 = (j.get("weather", [{}])[0] or {})
        wid = int(w0.get("id", 0))
        desc_raw = w0.get("description", "?")
        snap = WeatherSnapshot(
            desc=desc_raw,
            desc_easy=_humanize_weather(wid, desc_raw),
            main=w0.get("main", "?"),
            weather_id=wid,
            temp=float(j.get("main", {}).get("temp", 0.0)),
            feels_like=float(j.get("main", {}).get("feels_like", 0.0)),
            humidity=int(j.get("main", {}).get("humidity", 0)),
            wind_speed=float(j.get("wind", {}).get("speed", 0.0)),
            fetched_at=now,
        )
        with _LOCK:
            _CACHE[key] = snap
        logger.info("weather fetched: %s %.1f°C (%s)", snap.desc, snap.temp, settings.location_name)
        return snap
    except Exception as exc:
        logger.warning("openweather fetch failed: %s", exc)
        return None


def build_env_context_message() -> str:
    """LLM system message 용 환경 사실 문자열 — 시간 + 위치 + 날씨 + 활용 가이드."""
    now = datetime.now()
    hour = now.hour
    period = _classify_period(hour)
    weekday = ["월", "화", "수", "목", "금", "토", "일"][now.weekday()]
    location = (settings.location_name or "").strip() or "한국"

    weather = get_weather()
    if weather:
        weather_block = (
            f"- 오늘 {location} 날씨: **{weather.desc_easy}, 기온 {weather.temp:.0f}도** "
            f"(체감 {weather.feels_like:.0f}도, 습도 {weather.humidity}%, 바람 {weather.wind_speed:.1f}m/s)\n"
            f"- ⚠️ 응답 시 반드시 위 표현 그대로 사용. 기상학 전문 용어 (박무·연무·안개비·진눈깨비·강수 등) 금지.\n"
        )
        weather_guide = (
            "## 날씨 — 위 정보 그대로 활용. 환자에게 추측 X.\n"
            "- 회상 끌어오기 (예시): '비 오는 날엔 부침개에 막걸리 한 잔 생각나죠?', "
            "'맑은 날엔 빨래 너는 게 제 맛이죠', '추운 날엔 따끈한 차 한 잔 어떠세요?', "
            "'비 오시는데 무릎 안 쑤시세요?'.\n"
            "- 환자가 다른 날씨 말하면 교정하지 말고 그대로 받아주기 (\"그러시군요\").\n"
        )
    else:
        weather_block = "- 오늘 날씨: 정보 없음\n"
        weather_guide = (
            "## 날씨 — 정보 없음. 추측·단정 금지\n"
            "- 잘못된 예: \"오늘 날씨 맑죠?\" / \"비가 많이 와요\".\n"
            "- 옳은 예: \"오늘 날씨는 어떠셨어요?\" → 환자 답에 호응만.\n"
        )

    return (
        "# 실시간 환경 정보 (매 응답 직전 주입)\n\n"
        f"- 지금: **{now.year}년 {now.month}월 {now.day}일 ({weekday}) {hour}시 — {period}**\n"
        f"- 위치: **{location}**\n"
        f"{weather_block}\n"
        "## 시간대 — 자연스러운 화제 매핑\n"
        "- 밤·새벽 (21~6시): 외출·산책·낮 활동 화제 X. 실내 회상 (옛 기억, 가족, 음식, 노래, 사진).\n"
        "- 이른 아침 (6~9시): 아침 식사·하루 계획·간단한 안부.\n"
        "- 점심 무렵 (12~14시): 음식 화제 자연.\n"
        "- 저녁 (18~21시): 하루 정리·저녁 식사·가족.\n\n"
        f"{weather_guide}\n"
        "## 모르는 외부 사실 — 추측 금지\n"
        "- 환자 가족·지인의 현재 안부, 환자 위치/외출 여부, 환자가 안 말한 신체 상태는 모름.\n"
        "- 단정·추측하지 말고 환자에게 부드럽게 물어보거나 호응만.\n"
    )
