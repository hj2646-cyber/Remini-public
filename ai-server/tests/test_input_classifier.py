"""Unit tests for input_classifier — 위험관리 루프 Phase 2.

LLM을 실제로 호출하지 않는 테스트 (classifier_enabled=False or _keyword_only_label 직접 호출).
LLM 통합 테스트는 벤치마크 스크립트(`scripts/bench_classifier.py`)가 담당.
"""

from __future__ import annotations

from app.services.input_classifier import (
    LABELS,
    _derive_flags,
    _keyword_only_label,
    _parse_label,
    build_guidance_for_result,
    classify_utterance,
    ClassifierResult,
)


class TestParseLabel:
    def test_exact_match(self):
        for label in LABELS:
            assert _parse_label(label) == label

    def test_substring_match(self):
        assert _parse_label("분류: 회상유도형") == "회상유도형"
        assert _parse_label("답: 혼란·망상형 입니다.") == "혼란·망상형"

    def test_unknown(self):
        assert _parse_label("") == "UNKNOWN"
        assert _parse_label("잘 모르겠네요") == "UNKNOWN"


class TestKeywordFallback:
    def test_crisis(self):
        assert _keyword_only_label("다 죽고 싶어") == "위험감정형"
        assert _keyword_only_label("자살하고 싶어") == "위험감정형"

    def test_delusion(self):
        assert _keyword_only_label("누가 통장을 훔쳤어") == "혼란·망상형"
        assert _keyword_only_label("며느리가 굶겨 죽이려 해") == "혼란·망상형"

    def test_secret(self):
        assert _keyword_only_label("비밀번호가 뭐였지") == "민감정보형"
        assert _keyword_only_label("이 약 먹어야 돼?") == "민감정보형"

    def test_reminisce(self):
        assert _keyword_only_label("어릴 때 논밭에서 뛰놀았지") == "회상유도형"
        assert _keyword_only_label("엄마가 끓여주던 김치찌개") == "회상유도형"
        assert _keyword_only_label("고향 생각나") == "회상유도형"

    def test_default_daily(self):
        assert _keyword_only_label("오늘 날씨 좋네") == "일상확인형"
        assert _keyword_only_label("점심 뭐 먹을까") == "일상확인형"

    def test_crisis_overrides_reminisce(self):
        # 위기 키워드가 가장 우선
        assert _keyword_only_label("옛날 생각하니 죽고 싶어") == "위험감정형"


class TestDeriveFlags:
    def test_delusion_flag(self):
        _, _, emo = _derive_flags("누가 통장을 훔쳤어", "혼란·망상형")
        d, s, e = _derive_flags("누가 통장을 훔쳤어", "혼란·망상형")
        assert d is True

    def test_secret_flag(self):
        _, s, _ = _derive_flags("비밀번호 알려줘", "민감정보형")
        assert s is True

    def test_negative_emotion_level(self):
        # 0: 중립
        _, _, e0 = _derive_flags("오늘 날씨 좋네", "일상확인형")
        assert e0 == 0
        # 1: 약한 부정
        _, _, e1 = _derive_flags("좀 외로워", "일상확인형")
        assert e1 >= 1
        # 2: 위험감정형 라벨
        _, _, e2 = _derive_flags("아무도 나를 안 봐", "위험감정형")
        assert e2 >= 2
        # 3: 위기 키워드
        _, _, e3 = _derive_flags("다 죽고 싶어", "위험감정형")
        assert e3 == 3


class TestDisabledPath:
    def test_classifier_disabled(self, monkeypatch):
        """classifier_enabled=False면 키워드 폴백만 동작."""
        from app.config import settings

        monkeypatch.setattr(settings, "classifier_enabled", False)
        r = classify_utterance("누가 내 통장을 훔쳤어")
        assert r.label == "혼란·망상형"
        assert r.contains_delusion is True
        assert r.latency_ms == 0.0  # LLM 호출 안 함
        assert r.raw_output == ""

    def test_empty_utterance(self):
        r = classify_utterance("")
        assert r.label == "UNKNOWN"
        assert r.latency_ms == 0.0


class TestGuidance:
    def test_delusion_guidance(self):
        result = ClassifierResult(
            label="혼란·망상형",
            contains_delusion=True,
            requests_secret=False,
            negative_emotion_level=1,
            raw_output="",
            latency_ms=0.0,
        )
        guidance = build_guidance_for_result(result)
        assert guidance is not None
        assert "망상" in guidance
        assert "논리로 반박" in guidance

    def test_secret_guidance(self):
        result = ClassifierResult(
            label="민감정보형",
            contains_delusion=False,
            requests_secret=True,
            negative_emotion_level=0,
            raw_output="",
            latency_ms=0.0,
        )
        guidance = build_guidance_for_result(result)
        assert guidance is not None
        assert "민감" in guidance

    def test_reminisce_guidance(self):
        result = ClassifierResult(
            label="회상유도형",
            contains_delusion=False,
            requests_secret=False,
            negative_emotion_level=0,
            raw_output="",
            latency_ms=0.0,
        )
        guidance = build_guidance_for_result(result)
        assert guidance is not None
        assert "회상" in guidance

    def test_daily_no_guidance(self):
        result = ClassifierResult(
            label="일상확인형",
            contains_delusion=False,
            requests_secret=False,
            negative_emotion_level=0,
            raw_output="",
            latency_ms=0.0,
        )
        assert build_guidance_for_result(result) is None

    def test_crisis_no_extra_guidance(self):
        """위험감정형은 _CRISIS_REPLY가 선처리하므로 추가 지시 불필요."""
        result = ClassifierResult(
            label="위험감정형",
            contains_delusion=False,
            requests_secret=False,
            negative_emotion_level=3,
            raw_output="",
            latency_ms=0.0,
        )
        assert build_guidance_for_result(result) is None
