"""STT 실시간 보정 — 소형 LLM 이 대화 맥락으로 STT 오인식만 교정.

streaming partial 텍스트를 별도 경량 Ollama 모델 (settings.stt_correction_model) 로
보내 동음이의어·노인 발음·도메인 용어 오인식을 교정한다.

환각 방지가 핵심 (치매 어르신 발화라 없는 말 지어내면 위험):
- temperature 0, 짧은 출력 (num_predict)
- 프롬프트: "오인식 글자만 고쳐라. 없는 내용 추가 금지. 못 고치면 원문 그대로."
- 가드: 교정본이 원문보다 과하게 길면 (지어냄 의심) 원문 반환

CLAUDE.md "모든 AI 모델은 오픈소스 로컬 전용" 정책 부합 — Ollama 로컬 경량 모델.
"""

from __future__ import annotations

import logging

import requests

from app.config import settings

logger = logging.getLogger(__name__)


_SYSTEM_PROMPT = """너는 한국어 음성인식(STT) 결과를 교정하는 도구다.
치매 어르신과의 회상요법 대화 중, STT 가 잘못 알아들은 글자를 바로잡는다.

규칙:
- 발음 혼동·받침 오류·띄어쓰기만 고친다. 글자 단위 교정이다.
- 문장의 의미를 절대 바꾸지 마라. 특히 동사의 뜻을 반대로 바꾸지 마라 (예: 받았다↔줬다, 갔다↔왔다).
- 원문에 없는 단어·내용을 추가하지 말고, 멀쩡한 단어를 삭제하지도 마라.
- 멀쩡하면 그대로 둔다. 못 고치겠으면 입력을 그대로 반환한다.
- 설명·따옴표·접두어 없이, 교정된 문장만 출력한다.

예시:
입력: 아부지가 바테서 일하고 게세요
출력: 아버지가 밭에서 일하고 계세요
입력: 할무니가 떡꾹을 끄려 주셨어
출력: 할머니가 떡국을 끓여 주셨어
입력: 동상이랑 마당에서 노랐던 게 생각나
출력: 동생이랑 마당에서 놀았던 게 생각나"""


def correct_transcript(raw_text: str, context_hint: str | None = None) -> str:
    """raw STT 텍스트를 교정해 반환. 실패/환각 의심 시 원문 그대로.

    context_hint: 직전 봇 발화 등 대화 맥락 (동음이의 판단 도움). 없어도 됨.
    """
    text = (raw_text or "").strip()
    if not text:
        return text

    if context_hint and context_hint.strip():
        user_content = (
            f"[직전 대화 맥락]\n{context_hint.strip()}\n\n"
            f"[교정할 음성인식 결과]\n{text}"
        )
    else:
        user_content = text

    payload = {
        "model": settings.stt_correction_model,
        "stream": False,
        "keep_alive": settings.ollama_keep_alive,
        "messages": [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        "options": {
            "temperature": settings.stt_correction_temperature,
            "num_predict": settings.stt_correction_num_predict,
        },
    }

    try:
        r = requests.post(
            f"{settings.ollama_base_url}/api/chat",
            json=payload,
            timeout=settings.stt_correction_timeout_sec,
        )
        r.raise_for_status()
        corrected = (r.json().get("message", {}).get("content") or "").strip()
    except Exception as exc:
        logger.warning("STT correction failed (%s); using raw text", exc)
        return text

    if not corrected:
        return text

    # 환각 가드 — 교정본이 원문보다 과하게 길면 지어낸 것으로 보고 원문 사용
    if len(corrected) > max(20, int(len(text) * 1.6)):
        logger.info(
            "STT correction suspiciously long (%d > %d); using raw text",
            len(corrected), len(text),
        )
        return text

    return corrected
