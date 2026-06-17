"""
회상요법 사진 자동 유도 시스템.

『기억여행』 책 사진을 환자에게 N턴마다 보여주면서 LLM 이 책 4단계 패턴
(자유 연상 → 경험 회상 → 감각·구체 → 자유) 으로 회상 유도.

사용자는 ai-server/data/reminiscence_photos/ 폴더에 사진 파일 (.jpg/.png/.webp)
을 드롭만 하면 됨. 파일명이 곧 회상 토픽 제목.

기존 MemoryPhotoService (보호자 업로드 환자 개인 추억 사진, 키워드 트리거) 와는 별개:
- MemoryPhotoService: 환자별, 키워드 트리거 ("사진 보여줘")
- ReminiscencePhotoService: 시스템 공용, N턴 자동 트리거
"""
from __future__ import annotations

import logging
import random
import threading
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import quote

from app.config import DATA_DIR
from app.services.book_topics_db import match_topic as _match_book_topic

logger = logging.getLogger(__name__)

REMINISCENCE_DIR = DATA_DIR / "reminiscence_photos"
PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

# 트리거 정책 (환자 user turn 단위)
# 회상 일변도 완화(반반 밸런스): 첫 권유와 재권유 간격을 늘려 평소엔 일상 대화가
# 더 오래 이어지게 한다. 회상 키워드(recall_mood)가 나오면 아래 간격과 무관하게
# 빠르게 트리거되는 PULL 경로는 그대로 유지된다 (maybe_trigger 참조).
INITIAL_PROMPT_AFTER = 6  # N턴 라포 → AI 가 회상 시작 의사 먼저 묻기 ("사진 같이 좀 볼까요?")
DEFAULT_TRIGGER_INTERVAL = 12  # 토픽 종료 후 새 PROMPT 까지 최소 N턴 (continue 응답은 즉시)
ASK_AFTER_TURNS = 5  # 토픽 시작 후 N턴 진행 → AI 가 종료/계속 의사 묻기
MAX_TOPIC_DURATION = 8  # 환자 응답 못 받았을 때 fallback 강제 종료
RECENT_PHOTOS_EXCLUDE = 8  # 최근 N개 사진 sampling 제외

# 환자 발화에 회상 분위기가 나타나면 트리거 가속 (MIN_INITIAL_DELAY 충족 시점부터)
RECALL_SIGNALS = {
    "옛날", "예전", "그때", "어릴", "어렸", "젊었", "젊을", "처음",
    "추억", "떠올라", "생각나", "기억나", "기억해",
}

# AI 가 "더 볼까요?" 질문한 후 환자가 명시적 종료 의사 표현 — 그 외는 CONTINUE 로 해석
STOP_SIGNALS = {
    "아니",
    "괜찮",
    "그만",
    "됐",
    "이제",
    "쉬자",
    "쉴래",
    "피곤",
    "다른 얘기",
    "다른 이야기",
    "다음에",
}

# 토픽 진행 중 환자 강한 거부 신호 — 즉시 종료 (ASK 단계 무시)
HARD_DECLINE_SIGNALS = {
    "싫어",
    "관심 없",
    "말하기 싫",
    "안 보고 싶",
    "치워",
    "재미 없",
}


def _filename_to_title(path: Path) -> str:
    """파일명에서 확장자 + 흔한 prefix 정리하여 토픽 제목 추출."""
    stem = path.stem
    # 흔한 prefix 정리: "01_개나리" → "개나리", "B01_개나리" → "개나리"
    parts = stem.split("_", 1)
    if len(parts) == 2 and len(parts[0]) <= 4 and any(c.isdigit() for c in parts[0]):
        return parts[1].replace("_", " ").strip() or stem
    return stem.replace("_", " ").strip()


@dataclass
class _SessionState:
    user_turns: int = 0
    last_trigger_turn: int = -999  # 마지막 PROMPT/사진 트리거 시점 (cooldown 기준)
    current_photo_path: str | None = None  # 진행 중 사진 (절대 경로 str)
    current_topic_started_at: int = 0
    awaiting_initial_consent: bool = False  # AI 가 "시작할까요?" 물었고 환자 응답 대기 (사진 X)
    awaiting_continuation: bool = False  # AI 가 "더 볼까요?" 물었고 환자 응답 대기 (사진 진행 중)
    recent_photo_paths: list[str] = field(default_factory=list)
    declined: bool = False


class ReminiscencePhotoService:
    """회상요법 사진 풀 + N턴 자동 트리거."""

    def __init__(self, photo_dir: Path | None = None) -> None:
        self._dir = photo_dir or REMINISCENCE_DIR
        self._photos: list[Path] = []  # 절대 경로
        self._lock = threading.Lock()
        self._sessions: dict[str, _SessionState] = {}
        self._scan()

    def _scan(self) -> None:
        if not self._dir.exists():
            logger.warning("reminiscence_photos dir not found: %s", self._dir)
            self._photos = []
            return
        photos = sorted(
            p for p in self._dir.rglob("*")
            if p.is_file() and p.suffix.lower() in PHOTO_EXTS
        )
        self._photos = photos
        logger.info(
            "reminiscence_photos loaded: %d photos from %s", len(photos), self._dir
        )

    def reload(self) -> None:
        with self._lock:
            self._scan()

    @property
    def is_active(self) -> bool:
        return bool(self._photos)

    def _get_session(self, session_id: str) -> _SessionState:
        with self._lock:
            state = self._sessions.get(session_id)
            if state is None:
                state = _SessionState()
                self._sessions[session_id] = state
            return state

    def reset_session(self, session_id: str) -> None:
        with self._lock:
            self._sessions.pop(session_id, None)

    def _detect_hard_decline(self, message: str) -> bool:
        text = (message or "").strip()
        if not text:
            return False
        return any(signal in text for signal in HARD_DECLINE_SIGNALS)

    def _detect_stop(self, message: str) -> bool:
        """ASK 상태에서 환자가 명시적 종료 의사 표현했는지."""
        text = (message or "").strip()
        if not text:
            return False
        return any(signal in text for signal in STOP_SIGNALS)

    def _detect_recall_mood(self, message: str) -> bool:
        text = (message or "").strip()
        if not text:
            return False
        return any(signal in text for signal in RECALL_SIGNALS)

    def _sample_photo(self, state: _SessionState) -> Path | None:
        if not self._photos:
            return None
        recent = set(state.recent_photo_paths[-RECENT_PHOTOS_EXCLUDE:])
        candidates = [p for p in self._photos if str(p) not in recent]
        if not candidates:
            candidates = self._photos
        # 책 96 토픽 매칭된 사진을 2배 가중치 — 책 표준 질문 사용 가능 토픽 우선
        weights = []
        for p in candidates:
            t = _filename_to_title(p)
            w = 2.0 if _match_book_topic(t) else 1.0
            weights.append(w)
        try:
            return random.choices(candidates, weights=weights, k=1)[0]
        except Exception:
            return random.choice(candidates)

    def _build_url(self, photo: Path) -> str:
        rel = photo.relative_to(self._dir)
        # URL 인코딩 (한글 파일명 + 공백 안전)
        parts = [quote(str(part), safe="") for part in rel.parts]
        return "/static/reminiscence/" + "/".join(parts)

    def maybe_trigger(
        self,
        session_id: str,
        user_message: str,
        user_id: str | None = None,
        crisis_flag: bool = False,
    ) -> dict | None:
        """N턴마다 자동 트리거 체크. 반환 형태:

        - 새 사진 트리거: {"mode": "start", title, filename, image_url, ...}
        - 종료/계속 묻기: {"mode": "ask", title, image_url}  (사진 유지)
        - 트리거 X: None
        """
        if not self.is_active:
            return None

        state = self._get_session(session_id)
        state.user_turns += 1

        # 강한 거부 신호 → 무조건 즉시 종료 (모든 단계 무시) + cooldown
        if self._detect_hard_decline(user_message):
            state.declined = True
            had_photo = bool(state.current_photo_path)
            if had_photo:
                logger.info(
                    "[reminiscence] session=%s photo=%s hard-declined",
                    session_id, state.current_photo_path,
                )
            state.current_photo_path = None
            state.awaiting_continuation = False
            state.awaiting_initial_consent = False
            state.last_trigger_turn = state.user_turns  # cooldown
            # 사진이 표시 중이었다면 UI 에 즉시 숨김 신호
            if had_photo:
                return {"action": "hide"}
            return None

        if crisis_flag:
            return None

        # PROMPTING 응답 처리: AI 가 "시작할까요?" 물은 후 환자 답변
        force_new_trigger = False
        if state.awaiting_initial_consent:
            state.awaiting_initial_consent = False
            if self._detect_stop(user_message):
                logger.info(
                    "[reminiscence] session=%s PROMPT→STOP, no photo",
                    session_id,
                )
                state.last_trigger_turn = state.user_turns  # cooldown
                return None
            logger.info(
                "[reminiscence] session=%s PROMPT→CONSENT, starting photo",
                session_id,
            )
            force_new_trigger = True  # 즉시 첫 사진

        # ASK 후 환자 응답 처리: 명시적 STOP 이면 종료, 그 외는 새 사진 (CONTINUE)
        if state.awaiting_continuation:
            state.awaiting_continuation = False
            prev_photo = state.current_photo_path
            state.current_photo_path = None  # 토픽 종료
            if self._detect_stop(user_message):
                logger.info(
                    "[reminiscence] session=%s ASK→STOP, ending topic %s",
                    session_id, prev_photo,
                )
                state.last_trigger_turn = state.user_turns
                # UI 에 사진 즉시 숨김 신호 (이전엔 None 반환 → UI timer 만료까지 사진 유지 버그)
                return {"action": "hide"} if prev_photo else None
            logger.info(
                "[reminiscence] session=%s ASK→CONTINUE, new photo from %s",
                session_id, prev_photo,
            )
            force_new_trigger = True

        # 진행 중 토픽 처리
        if state.current_photo_path:
            elapsed = state.user_turns - state.current_topic_started_at

            # 환자가 자발적 STOP 신호 (ASK 기다리지 않음) → 즉시 종료
            if self._detect_stop(user_message):
                prev_photo = state.current_photo_path
                state.current_photo_path = None
                state.awaiting_continuation = False
                state.last_trigger_turn = state.user_turns
                logger.info(
                    "[reminiscence] session=%s photo=%s user-STOP at elapsed=%d",
                    session_id, prev_photo, elapsed,
                )
                return {"action": "hide"}

            # ASK_AFTER_TURNS 도달: AI 에게 "더 볼까요?" 묻게 함, 사진 유지
            if elapsed == ASK_AFTER_TURNS:
                state.awaiting_continuation = True
                photo_path = Path(state.current_photo_path)
                title = _filename_to_title(photo_path)
                url = self._build_url(photo_path)
                logger.info(
                    "[reminiscence] session=%s ASK on photo=%s (elapsed=%d)",
                    session_id, photo_path.name, elapsed,
                )
                return {
                    "mode": "ask",
                    "title": title,
                    "image_url": url,
                }

            # MAX 도달: 환자 응답 못 받음 — fallback 강제 종료
            if elapsed >= MAX_TOPIC_DURATION:
                logger.info(
                    "[reminiscence] session=%s photo=%s MAX-ended (elapsed=%d)",
                    session_id, state.current_photo_path, elapsed,
                )
                state.current_photo_path = None
            else:
                return None  # 자연 진행

        # 새 트리거 조건
        # - force_new_trigger: PROMPT 동의 후 또는 ASK 동의 후 → 즉시 사진 (아래로 진행)
        # - 그 외: 4턴 라포 도달 → AI 가 시작 의사 PROMPT (사진 X). 회상 키워드 빠르게 나오면 2턴부터 PROMPT.
        recall_mood = self._detect_recall_mood(user_message)
        if not force_new_trigger:
            turns_since_last = state.user_turns - state.last_trigger_turn
            if state.last_trigger_turn < 0:
                # 세션 첫 PROMPT — 라포 후 또는 회상 키워드 시
                if state.user_turns < INITIAL_PROMPT_AFTER:
                    if not recall_mood or state.user_turns < 2:
                        return None
            elif turns_since_last < DEFAULT_TRIGGER_INTERVAL and not recall_mood:
                # 토픽 종료 후 cooldown 중 — 일상 대화 유지
                return None

            # PROMPT 발동 — AI 가 회상 시작 의사 묻기 (사진 X)
            state.awaiting_initial_consent = True
            state.last_trigger_turn = state.user_turns
            logger.info(
                "[reminiscence] session=%s PROMPT (asking consent, no photo) at turn=%d",
                session_id, state.user_turns,
            )
            return {
                "mode": "prompt",
                "title": "",
                "image_url": "",
            }

        photo = self._sample_photo(state)
        if photo is None:
            return None

        state.last_trigger_turn = state.user_turns
        state.current_photo_path = str(photo)
        state.current_topic_started_at = state.user_turns
        state.recent_photo_paths.append(str(photo))
        if len(state.recent_photo_paths) > RECENT_PHOTOS_EXCLUDE * 2:
            state.recent_photo_paths = state.recent_photo_paths[-RECENT_PHOTOS_EXCLUDE:]

        title = _filename_to_title(photo)
        url = self._build_url(photo)

        # 책 96 토픽 매칭 — 사용자 사진 파일명이 책 표제와 일치하면 책 표준 질문 사용 가능
        book_topic = _match_book_topic(title)
        if book_topic:
            logger.info(
                "[reminiscence] session=%s START photo=%s → book topic %s『%s』%s",
                session_id, photo.name, book_topic["id"], book_topic["title"],
                " (continue)" if force_new_trigger else "",
            )
        else:
            logger.info(
                "[reminiscence] session=%s START photo=%s title=%s (no book match)%s",
                session_id, photo.name, title, " (continue)" if force_new_trigger else "",
            )

        return {
            "mode": "start",
            "title": title,
            "filename": photo.name,
            "image_url": url,
            "intro_question": "이 사진을 보고 떠오르는 생각을 자유롭게 말씀해 주세요. 무엇이 보이세요?",
            "book_topic": book_topic,  # None or BookTopic dict
        }

    def build_llm_context(self, triggered: dict) -> str:
        """LLM system prompt 에 추가할 토픽 컨텍스트.

        triggered["mode"] == "prompt": AI 가 회상 시작 의사 묻기 (사진 X).
        triggered["mode"] == "start": 환자 동의 후 새 사진 트리거. 자연 전환 + 책 표준 첫 질문.
        triggered["mode"] == "ask": 토픽 충분히 진행. AI 가 종료/계속 의사 묻기.
        """
        mode = triggered.get("mode", "start")
        title = triggered.get("title", "")

        if mode == "prompt":
            return (
                f"[회상요법 시작 권유 — 환자 동의 확인 단계, 사진 아직 표시 X]\n"
                f"환자와 어느 정도 라포가 형성되었습니다. 이번 응답은:\n"
                f"  1단계 (한 줄): 환자의 직전 발화에 따뜻하게 짧게 공감/응답.\n"
                f"  2단계 (회상 권유, 부드럽게): 자연스럽게 회상 사진 활동 권유. 정확히 또는 비슷하게:\n"
                f"     '혹시 옛날 추억 사진을 같이 보면서 이야기 좀 나눠볼까요? 떠오르는 추억 같이 나누면 재밌을 것 같아요.'\n"
                f"\n"
                f"환자가 다음 턴에 동의하면 → 시스템이 자동으로 사진을 띄우고 회상 시작.\n"
                f"환자가 거절하면 → 일상 대화 그대로 진행.\n"
                f"규칙: 강요 X, 부드러운 권유. 환자 통제권 보장."
            )

        if mode == "ask":
            return (
                f"[회상 사진 마무리 — 환자 의사 확인 단계]\n"
                f"현재 사진 주제: 『{title}』 — 환자와 이 주제로 충분히 회상을 나눴습니다.\n"
                f"\n"
                f"이번 응답은 반드시 두 단계로:\n"
                f"  1단계: 『{title}』 회상 내용에 따뜻하게 공감/정리 (한 줄, '『{title}』참 좋은 추억이네요' 등).\n"
                f"  2단계: 자연스럽게 환자에게 의사 확인 (정확히 또는 비슷하게):\n"
                f"     '『{title}』 이야기는 여기까지 하고 다른 사진 더 볼까요? 아니면 다른 이야기 나눌까요?'\n"
                f"\n"
                f"규칙: 강요 X, 부드러운 선택권 제시. 환자가 답하면 그대로 따라가기."
            )

        # mode == "start"
        book_topic = triggered.get("book_topic")
        if book_topic:
            book_title = book_topic["title"]
            book_id = book_topic["id"]
            std_qs = book_topic.get("std_questions") or []
            std_qs_text = "\n".join(f'     • "{q}"' for q in std_qs[:4]) if std_qs else "     (책 표준 질문 없음 — 책 4단계 패턴으로 자연스럽게)"
            return (
                f"[회상 사진 자동 트리거 — 환자 화면에 사진이 방금 표시됨]\n"
                f"⚠️ 사진 주제: 『{title}』\n"
                f"📖 책 매칭: {book_id} 『{book_title}』 (분당서울대병원 『기억여행』)\n"
                f"\n"
                f"이번 응답은 반드시 두 단계:\n"
                f"  1단계 (자연 전환, 한 줄): 환자의 직전 발화에 짧고 따뜻하게 공감.\n"
                f"  2단계 (사진 화제 전환 + 책의 표준 첫 질문 그대로 또는 거의 그대로 사용):\n"
                f"     '잠깐, 이 사진 한번 같이 볼까요? {{책 표준 질문}}'\n"
                f"     ↓ 책 『{book_title}』의 표준 질문 (이 중 하나 선택해서 그대로 사용 권장):\n"
                f"{std_qs_text}\n"
                f"\n"
                f"이후 환자 응답 따라 책 4단계 패턴으로 진행 (위 책 질문들 활용 가능):\n"
                f"  ① 자유 연상 → ② 1H 경험 회상 → ③ 분기형 (좋아하셨다면/아니셨다면)\n"
                f"  → ④ 감각·구체 (냄새·촉감·소리·맛·색깔, 누구와 함께)\n"
                f"\n"
                f"규칙: 5W 시험 X, 1H 화법만, 부정·반박·교정 X, 정답 강요 X. "
                f"환자가 모르겠다 하면 다른 각도로 부드럽게 다시."
            )

        # 책 매칭 안 됨 — generic title 기반
        return (
            f"[회상 사진 자동 트리거 — 환자 화면에 사진이 방금 표시됨]\n"
            f"⚠️ 사진 주제: 『{title}』 ← 이번 응답에서 반드시 이 단어를 직접 언급할 것.\n"
            f"(책 96 토픽에 직접 매칭 안 됨 — 주제명 기반 1H 질문 만들기)\n"
            f"\n"
            f"이번 응답:\n"
            f"  1단계 (한 줄 공감): 환자 직전 발화에 따뜻하게.\n"
            f"  2단계 (사진 화제 + 『{title}』 1H 질문):\n"
            f"     '잠깐, 이 사진 같이 볼까요? 『{title}』 보신/드셔보신/해보신 적 있으세요?'\n"
            f"\n"
            f"이후 책 4단계 패턴 (모든 질문에 『{title}』 직접 언급):\n"
            f"  ① 자유 연상 → ② 경험 회상 → ③ 분기형 → ④ 감각·구체\n"
            f"\n"
            f"규칙: 5W 시험 X, 1H 화법만, 부정·반박·교정 X."
        )


# 싱글톤
_service: ReminiscencePhotoService | None = None


def get_service() -> ReminiscencePhotoService:
    global _service
    if _service is None:
        _service = ReminiscencePhotoService()
    return _service
