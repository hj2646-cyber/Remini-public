from __future__ import annotations

import logging
import re

from collections.abc import Generator
from pathlib import Path

import requests

from app.config import settings
from app.services.dialect import build_dialect_prompt, get_dialect_context_for_llm
from app.services import performance_flags as _perf


logger = logging.getLogger(__name__)


SYSTEM_PROMPT = """당신은 Remini의 회상요법 대화 파트너(레미니션)입니다.
환자(레미닌)를 성인 대 성인으로 존중하며, 임상가가 아닌 다정한 수다 친구로 대화합니다.
다음에 이어지는 시스템 메시지로 회상요법 도메인 위키가 함께 주어집니다. 환자 발화·화제에 맞는 부분을 자연스럽게 활용하되, 위키를 그대로 인용하거나 시스템 안내처럼 읽지 않습니다. 위키와 아래 룰이 충돌하면 아래 룰이 우선합니다.

[안전 — 무조건]
- 자해·자살·극심한 고통 등 위기 신호가 보이면 이야기 흐름을 놓치지 않으면서 안전 안내 방향으로 부드럽게 전환합니다.
- 비밀번호·계좌·주민번호·의료 진단·약 복용 지시는 묻지도 알려주지도 않습니다.
- 환자가 비현실적 주장(망상)을 해도 논리로 반박하지 않고, 동조하지도 않습니다. 감정만 알아주고 긍정 기억으로 화제를 옮깁니다.

[화법 — 무조건]
- 5W(언제/어디서/누구/무엇/왜) 심문식 질문은 하지 않습니다. 1H(어떤 느낌?) 중심.
- 같은 질문을 반복해 환자를 시험하지 않습니다. 최근 일을 추궁하지 않습니다.
- "그것도 몰라요?" 같은 수치심 표현, "슬프다·괴롭다·위급하다·곤란하다" 같은 부정어는 사용하지 않습니다.
- 환자가 사실과 다른 말을 해도 교정하지 않습니다. "그랬군요" 하고 흐름을 따라갑니다.
- 참고 기억에 없는 내용은 단정하지 않고 "~하셨던 것 같은데, 맞으세요?" 처럼 부드럽게 확인합니다.

[형식 — 무조건]
- 한 번에 1~2문장, 60자 내외, 차분한 어조.
- 이모지·이모티콘·특수기호 감탄 표현은 사용하지 않습니다.
"""


# 시연영상용: 회상요법 OFF 모드 (preset 1, 2) — 가이드 제거, "묻는 것만 답"
# 참고 기억(KG) 은 활용하지만, 먼저 회상 질문은 안 함.
SYSTEM_PROMPT_THERAPY_OFF = """당신은 한국어 대화 상대입니다.
사용자가 묻거나 꺼낸 주제에만 1~2문장으로 짧게 답하세요. 회상 질문을 먼저 꺼내지 마세요.

[참고 기억 활용 — 무조건]
- 시스템 메시지로 "참고 기억" (Personal memory cues / Current care facts) 이 주어집니다.
- 사용자 발화가 그 기억과 관련 있으면 그 정보를 자연스럽게 답변에 인용하세요.
  예) 사용자 "국밥 먹고싶어" + 참고 기억 "콩나물국밥 좋아함, 전주 출신" → "전주 콩나물국밥 말씀이세요?"
- 참고 기억에 없는 내용은 지어내지 마세요.

[형식]
- 한 번에 1~2문장, 60자 내외.
- 이모지·특수기호 사용 금지.
- 부정어("슬프다/괴롭다") 사용 금지.
"""

# 시연영상용: "그렇군요" 강제 (preset 3) — 매 응답을 그렇군요로 시작
_FORCE_GEULEOGUNYO_SUFFIX = """

[강제 형식 — 절대 어기지 마세요]
- 매 응답을 반드시 "그렇군요" 로 시작합니다. 환자가 무엇을 말했든 무조건 첫 단어는 "그렇군요" 입니다.
- "그렇군요" 뒤에 짧은 공감 또는 회상 질문을 1문장 덧붙입니다.
"""


def _active_system_prompt() -> str:
    """시연 토글을 반영한 system prompt 반환.

    - therapy_mode='off' → 회상요법 가이드 제거
    - force_geuleogunyo=true → 매 응답 '그렇군요' 시작 강제
    """
    if _perf.therapy_mode() == "off":
        base = SYSTEM_PROMPT_THERAPY_OFF
    else:
        base = SYSTEM_PROMPT
    if _perf.force_geuleogunyo():
        base = base + _FORCE_GEULEOGUNYO_SUFFIX
    return base


def _wiki_enabled() -> bool:
    """therapy_mode='off' 일 때는 회상요법 wiki 도 주입하지 않음."""
    return _perf.therapy_mode() != "off"


_WIKI_DIR = Path(__file__).resolve().parents[3] / "docs" / "wiki"


def _load_domain_wiki() -> str:
    """docs/wiki/ 안의 모든 .md 파일을 알파벳 순으로 합쳐 반환.

    - 파일명이 `_` 로 시작하거나 `README.md` 인 것은 제외.
    - 각 파일은 `<!-- filename -->` 주석으로 구분.
    - LLM 시스템 메시지로 통째 주입되어 KV 캐시 prefix 로 작동(Karpathy LLM Wiki + CAG 패턴).
    """
    if not _WIKI_DIR.exists():
        logger.warning("domain wiki directory not found: %s", _WIKI_DIR)
        return ""
    md_files = sorted(_WIKI_DIR.glob("*.md"))
    parts: list[str] = []
    for path in md_files:
        if path.name.startswith("_") or path.name.lower() == "readme.md":
            continue
        try:
            text = path.read_text(encoding="utf-8").strip()
        except OSError as exc:
            logger.warning("failed to read wiki file %s: %s", path, exc)
            continue
        if text:
            parts.append(f"<!-- {path.name} -->\n{text}")
    if not parts:
        logger.warning("no domain wiki files loaded from %s", _WIKI_DIR)
        return ""
    body = "\n\n---\n\n".join(parts)
    logger.info("loaded %d domain wiki file(s) from %s (%d chars)", len(parts), _WIKI_DIR, len(body))
    return body


_DOMAIN_WIKI = _load_domain_wiki()


def _build_domain_wiki_message() -> str | None:
    if not _DOMAIN_WIKI:
        return None
    return (
        "# 회상요법 참조 위키\n\n"
        f"{_DOMAIN_WIKI}\n\n"
        "---\n\n"
        "위 위키는 회상요법 도메인의 참조서입니다. 환자 발화·화제에 맞는 부분만 자연스럽게 활용하고, "
        "위키를 그대로 인용하거나 시스템 안내처럼 읽지 않습니다."
    )


PROACTIVE_SYSTEM_PROMPT = """당신은 remeni-ai의 회상요법 proactive 파트너입니다.
환자가 말을 멈추거나 잠시 눈을 감는 등 조용한 순간에, 부담 없이 옛 이야기를 꺼낼 수 있도록 먼저 다정하게 말을 겁니다.

[원칙]
- 한 번 말 걸 때는 1문장으로 짧게, 웃으며 수다 걸 듯 따뜻하게.
- 감각 단서(냄새·색·소리·맛·촉감)를 살짝 섞어 옛 기억을 자연스럽게 불러오도록 돕습니다.
  예) "요즘 계절에 생각나는 음식이 있으세요?", "어릴 적 동네에서 자주 맡던 냄새가 있으셨어요?"
- 참고 기억에 나오는 키워드(가족 이름, 고향, 취미, 지난 대화의 주제)가 있으면 그것을 가볍게 건드려 봅니다.
- 감지 신뢰도가 낮거나 상황이 불확실하면 단정하지 말고 "혹시 ~하고 계셨어요?"처럼 확인 형태로 말합니다.
- 상황이 분명하지 않으면 굳이 먼저 말 걸지 않습니다.

[금지]
- 5W 심문("언제/어디서/누구/무엇을/왜")으로 말을 걸지 않습니다.
- 부정어("슬프다/괴롭다/위급하다/곤란하다")를 쓰지 않습니다.
- 이모지, 이모티콘, 과한 감탄 표현은 쓰지 않습니다.
"""


def _apply_dialect_to_system_prompt(base_prompt: str, user_id: str | None) -> str:
    """사투리 설정이 있으면 시스템 프롬프트에 사투리 지침을 추가합니다."""
    dialect_prompt = build_dialect_prompt(user_id)
    if dialect_prompt:
        return f"{base_prompt}\n{dialect_prompt}"
    return base_prompt


_EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001F5FF"
    "\U0001F600-\U0001F64F"
    "\U0001F680-\U0001F6FF"
    "\U0001F700-\U0001F77F"
    "\U0001F780-\U0001F7FF"
    "\U0001F800-\U0001F8FF"
    "\U0001F900-\U0001F9FF"
    "\U0001FA00-\U0001FAFF"
    "\U00002700-\U000027BF"
    "\U00002600-\U000026FF"
    "]+",
    flags=re.UNICODE,
)


def strip_emoji(text: str) -> str:
    return _EMOJI_RE.sub("", text).strip()


def _build_memory_message(context: list[str]) -> str:
    ctx_block = "\n".join([f"- {c}" for c in context]) if context else "- (없음)"
    return (
        "아래는 환자의 과거 일화, 가족, 취향 등에 대한 참고 기억입니다.\n"
        "회상 대화의 재료로 활용하세요. 확인된 사실은 자연스럽게 언급해서 환자가 그 장면을 다시 떠올릴 수 있게 돕고, "
        "애매한 내용은 단정하지 말고 부드러운 확인 질문으로 바꾸세요. "
        "여기에 없는 내용은 지어내지 않습니다.\n\n"
        f"참고 기억:\n{ctx_block}"
    )


def _build_conversation_summary_message(conversation_summary: str | None) -> str | None:
    summary = (conversation_summary or "").strip()
    if not summary:
        return None
    return (
        "아래는 최근 대화의 누적 요약입니다.\n"
        "환자가 이미 꺼낸 주제·감정·인물·사건을 기억해 두었다가, 같은 이야기로 자연스럽게 이어가거나 "
        "그 이야기를 조금 더 깊이 파고드는 재료로 쓰세요.\n\n"
        f"대화 요약:\n{summary}"
    )


def _normalize_recent_messages(recent_messages: list[dict[str, str]] | None) -> list[dict[str, str]]:
    if not recent_messages:
        return []
    out: list[dict[str, str]] = []
    for message in recent_messages:
        role = message.get("role", "").strip()
        content = message.get("content", "").strip()
        if role not in {"user", "assistant"} or not content:
            continue
        out.append({"role": role, "content": content})
    return out


def _build_chat_messages(
    user_message: str,
    context: list[str],
    recent_messages: list[dict[str, str]] | None = None,
    conversation_summary: str | None = None,
    system_prompt: str | None = None,
    user_id: str | None = None,
    classifier_guidance: str | None = None,
) -> list[dict[str, str]]:
    # 시연 토글을 매 호출 시점에 평가 (default 인자 evaluation 1회 문제 회피)
    if system_prompt is None:
        system_prompt = _active_system_prompt()
    effective_prompt = _apply_dialect_to_system_prompt(system_prompt, user_id)
    messages = [{"role": "system", "content": effective_prompt}]

    # 도메인 위키 — therapy_mode='off' 시 주입 안 함 (회상요법 가이드 제거)
    if _wiki_enabled():
        wiki_message = _build_domain_wiki_message()
        if wiki_message:
            messages.append({"role": "system", "content": wiki_message})

    messages.append({"role": "system", "content": _build_memory_message(context)})
    summary_message = _build_conversation_summary_message(conversation_summary)
    if summary_message:
        messages.append({"role": "system", "content": summary_message})

    # 입력 분류기 지침 (망상/민감정보/회상유도형 등에 따른 추가 지시)
    if classifier_guidance:
        messages.append({"role": "system", "content": classifier_guidance})

    # 사투리 입력 컨텍스트 힌트 추가
    dialect_hint = get_dialect_context_for_llm(user_message, user_id)
    if dialect_hint:
        messages.append({"role": "system", "content": dialect_hint})

    messages.extend(_normalize_recent_messages(recent_messages))
    messages.append({"role": "user", "content": user_message})
    return messages


def chat_with_ollama(
    user_message: str,
    context: list[str],
    recent_messages: list[dict[str, str]] | None = None,
    conversation_summary: str | None = None,
    user_id: str | None = None,
    classifier_guidance: str | None = None,
) -> str:
    messages = _build_chat_messages(
        user_message,
        context,
        recent_messages,
        conversation_summary,
        user_id=user_id,
        classifier_guidance=classifier_guidance,
    )

    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "think": False,
        "keep_alive": settings.ollama_keep_alive,
        "messages": messages,
        "options": {
            "temperature": settings.ollama_temperature,
            "top_p": settings.ollama_top_p,
            "repeat_penalty": settings.ollama_repeat_penalty,
            "num_ctx": settings.ollama_num_ctx,
            "num_predict": settings.ollama_num_predict,
        },
    }

    r = requests.post(f"{settings.ollama_base_url}/api/chat", json=payload, timeout=180)
    r.raise_for_status()
    data = r.json()
    return strip_emoji(data["message"]["content"])


def stream_chat_with_ollama(
    user_message: str,
    context: list[str],
    recent_messages: list[dict[str, str]] | None = None,
    conversation_summary: str | None = None,
    user_id: str | None = None,
    classifier_guidance: str | None = None,
) -> Generator[str, None, None]:
    messages = _build_chat_messages(
        user_message,
        context,
        recent_messages,
        conversation_summary,
        user_id=user_id,
        classifier_guidance=classifier_guidance,
    )

    payload = {
        "model": settings.ollama_model,
        "stream": True,
        "think": False,
        "keep_alive": settings.ollama_keep_alive,
        "messages": messages,
        "options": {
            "temperature": settings.ollama_temperature,
            "top_p": settings.ollama_top_p,
            "repeat_penalty": settings.ollama_repeat_penalty,
            "num_ctx": settings.ollama_num_ctx,
            "num_predict": settings.ollama_num_predict,
        },
    }

    with requests.post(
        f"{settings.ollama_base_url}/api/chat",
        json=payload,
        timeout=180,
        stream=True,
    ) as r:
        r.raise_for_status()
        import json as _json

        for line in r.iter_lines(decode_unicode=True):
            if not line:
                continue
            try:
                chunk = _json.loads(line)
            except Exception:
                continue
            token = chunk.get("message", {}).get("content", "")
            if token:
                yield token


def chat_with_ollama_proactive(
    action: str,
    context: list[str],
    confidence: float,
    eyes_closed_seconds: float,
    silence_seconds: float = 0.0,
    recent_messages: list[dict[str, str]] | None = None,
    conversation_summary: str | None = None,
    user_id: str | None = None,
) -> str:
    action_instruction = {
        "session_greeting": "대화 세션이 시작되었습니다. 먼저 짧고 편안하게 인사하고, 대답하기 쉬운 아주 간단한 질문으로 대화를 여세요.",
        "greeting": "사용자가 화면 앞에 왔습니다. 반갑게 짧게 인사하고 '오늘 기분은 어떠세요?'처럼 일상적이고 부담 없는 질문으로 대화를 여세요.",
        "drowsy_check": "사용자가 한동안 눈을 감고 있습니다. '주무시는지'를 조심스럽게 확인하고 휴식 제안을 해주세요.",
        "silence_checkin": "사용자가 당신의 말 뒤에 한동안 답하지 않고 있습니다. 재촉하지 말고, 짧게 안부를 묻거나 대답하기 쉬운 질문으로 다시 말을 걸어보세요.",
        "silence_memory_prompt": "사용자가 계속 조용합니다. 참고 기억에서 가장 안전하고 쉬운 단서를 골라, 예/아니오로 답하기 쉬운 회상 질문을 한두 문장으로 제안하세요.",
        "silence_reassure": "사용자가 계속 답하지 않고 있습니다. 부담을 주지 말고, 곁에 있겠다는 안심 문장과 아주 쉬운 선택형 질문 하나로 대화를 다시 시도하세요.",
    }.get(action, "상황을 짧게 확인하고 도움이 필요한지 물어보세요.")

    prompt = (
        f"감지된 상황: {action}\n"
        f"confidence={confidence:.2f}, eyes_closed_seconds={eyes_closed_seconds:.2f}, silence_seconds={silence_seconds:.2f}\n\n"
        f"행동 지침:\n{action_instruction}\n\n"
        "위 정보를 바탕으로 한국어로 한두 문장으로 답해줘."
    )
    # KV cache 공유를 위해 chat 경로와 동일한 prefix 사용 (SYSTEM_PROMPT + wiki).
    # PROACTIVE_SYSTEM_PROMPT 의 핵심 가이드(5W 금지·부정어 금지·1~2문장·이모지
    # 금지) 는 SYSTEM_PROMPT 에 이미 포함되고, "지금 상황" 컨텍스트는 user
    # message 의 action_instruction 에서 처리한다. 이렇게 해야 chat 경로와
    # prefix 22k 가 동일해져 KV cache prefix matching 으로 cold prefill 회피.
    effective_proactive_prompt = _apply_dialect_to_system_prompt(_active_system_prompt(), user_id)
    messages = [{"role": "system", "content": effective_proactive_prompt}]
    if _wiki_enabled():
        wiki_message = _build_domain_wiki_message()
        if wiki_message:
            messages.append({"role": "system", "content": wiki_message})
    messages.append({"role": "system", "content": _build_memory_message(context)})
    summary_message = _build_conversation_summary_message(conversation_summary)
    if summary_message:
        messages.append({"role": "system", "content": summary_message})
    messages.extend(_normalize_recent_messages(recent_messages))
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "think": False,
        "keep_alive": settings.ollama_keep_alive,
        "messages": messages,
        "options": {
            "temperature": min(settings.ollama_temperature, 0.35),
            "top_p": settings.ollama_top_p,
            "repeat_penalty": settings.ollama_repeat_penalty,
            "num_ctx": settings.ollama_num_ctx,
            "num_predict": min(settings.ollama_num_predict, 140),
        },
    }

    r = requests.post(f"{settings.ollama_base_url}/api/chat", json=payload, timeout=180)
    r.raise_for_status()
    data = r.json()
    return strip_emoji(data["message"]["content"])


def proactive_reply(
    action: str,
    context: list[str],
    confidence: float,
    eyes_closed_seconds: float,
    silence_seconds: float = 0.0,
    recent_messages: list[dict[str, str]] | None = None,
    conversation_summary: str | None = None,
    user_id: str | None = None,
) -> str:
    provider = settings.llm_provider.lower()
    if provider == "ollama":
        return chat_with_ollama_proactive(
            action,
            context,
            confidence,
            eyes_closed_seconds,
            silence_seconds=silence_seconds,
            recent_messages=recent_messages,
            conversation_summary=conversation_summary,
            user_id=user_id,
        )
    raise ValueError(f"Unsupported LLM provider: {settings.llm_provider}")


def generate_reply(
    user_message: str,
    context: list[str],
    recent_messages: list[dict[str, str]] | None = None,
    conversation_summary: str | None = None,
    user_id: str | None = None,
    classifier_guidance: str | None = None,
) -> str:
    provider = settings.llm_provider.lower()
    if provider == "ollama":
        return chat_with_ollama(
            user_message,
            context,
            recent_messages=recent_messages,
            conversation_summary=conversation_summary,
            user_id=user_id,
            classifier_guidance=classifier_guidance,
        )
    raise ValueError(f"Unsupported LLM provider: {settings.llm_provider}")


def stream_reply(
    user_message: str,
    context: list[str],
    recent_messages: list[dict[str, str]] | None = None,
    conversation_summary: str | None = None,
    user_id: str | None = None,
    classifier_guidance: str | None = None,
) -> Generator[str, None, None]:
    provider = settings.llm_provider.lower()
    if provider == "ollama":
        yield from stream_chat_with_ollama(
            user_message,
            context,
            recent_messages=recent_messages,
            conversation_summary=conversation_summary,
            user_id=user_id,
            classifier_guidance=classifier_guidance,
        )
        return
    raise ValueError(f"Unsupported LLM provider: {settings.llm_provider}")


def _post_warmup_messages(messages: list[dict[str, str]]) -> None:
    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "think": False,
        "keep_alive": settings.ollama_keep_alive,
        "messages": messages,
        "options": {
            "temperature": 0.0,
            "num_ctx": settings.ollama_num_ctx,
            "num_predict": 1,
        },
    }
    requests.post(f"{settings.ollama_base_url}/api/chat", json=payload, timeout=180)


def warmup_llm(user_id: str | None = None) -> None:
    """LLM KV 캐시에 정적 prefix(SYSTEM_PROMPT + wiki 22k) 를 채운다.

    chat 경로만 한 번 호출한다. proactive 경로도 같은 SYSTEM_PROMPT + wiki
    prefix 를 쓰도록 통일되었기 때문에 chat 한 번이면 양쪽 모두 cache hit
    된다. 두 번 호출하면 동일 prefix 를 두 번 prefill 하는 헛수고.

    `user_id` 를 주면 그 환자의 dialect 가 적용된 SYSTEM_PROMPT 변종을 잡아
    두므로, 환자 진입 시 호출하면 첫 인사·첫 발화 응답이 모두 빠르다.
    """
    if settings.llm_provider.lower() != "ollama":
        return
    try:
        chat_msgs = _build_chat_messages(
            "안녕",
            context=[],
            recent_messages=None,
            conversation_summary=None,
            user_id=user_id,
        )
        _post_warmup_messages(chat_msgs)
    except Exception:
        pass
