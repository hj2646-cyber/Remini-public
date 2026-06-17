"""Unit tests for output_filter — 위험관리 루프 Phase 3."""

from __future__ import annotations

from app.services.output_filter import SAFE_REDIRECT, apply, apply_text


class TestForbiddenPatterns:
    def test_password_disclosure_blocked(self):
        r = apply("비밀번호는 1234입니다.")
        assert r.blocked is True
        assert r.text == SAFE_REDIRECT

    def test_account_disclosure_blocked(self):
        r = apply("계좌번호: 123-456-7890")
        assert r.blocked is True

    def test_medication_instruction_blocked(self):
        r = apply("이 약을 드세요.")
        assert r.blocked is True

    def test_medication_instruction_blocked_2(self):
        r = apply("이 약 먹으세요.")
        assert r.blocked is True

    def test_diagnosis_blocked(self):
        r = apply("진단됩니다.")
        assert r.blocked is True

    def test_non_forbidden_passes(self):
        r = apply("따뜻한 차 한잔 드시면 기분이 좋아지실 거예요.")
        assert r.blocked is False
        assert "따뜻한" in r.text


class TestReplacementTable:
    def test_wrong_replaced(self):
        r = apply("그건 틀렸어요.")
        assert "틀렸어요" not in r.text
        assert "그럴 수 있죠" in r.text
        assert r.replaced >= 1

    def test_retry_replaced(self):
        r = apply("다시 말해봐.")
        assert "다시 말해봐" not in r.text
        assert "천천히" in r.text

    def test_shame_replaced(self):
        r = apply("그것도 몰라요?")
        assert "그것도 몰라요" not in r.text
        assert r.replaced >= 1

    def test_no_change_when_clean(self):
        r = apply("맛있는 밥 드셨군요.")
        assert r.replaced == 0
        assert "맛있는 밥 드셨군요" in r.text


class TestNegativeWords:
    def test_sad_removed(self):
        r = apply("그 기억은 슬프다.")
        assert "슬프다" not in r.text
        assert r.removed_negatives >= 1

    def test_painful_removed(self):
        r = apply("정말 괴로워요.")
        assert "괴로워요" not in r.text

    def test_urgent_removed(self):
        r = apply("지금 위급해요.")
        assert "위급해요" not in r.text

    def test_difficult_removed(self):
        r = apply("그건 곤란하다.")
        assert "곤란하다" not in r.text


class TestComposite:
    def test_multiple_issues(self):
        r = apply("틀렸어요. 슬프다.")
        assert "틀렸어요" not in r.text
        assert "슬프다" not in r.text
        assert r.replaced >= 1
        assert r.removed_negatives >= 1

    def test_forbidden_beats_all(self):
        # 금지 패턴이 있으면 나머지 처리 없이 즉시 SAFE_REDIRECT
        r = apply("비밀번호는 1234입니다. 틀렸어요.")
        assert r.blocked is True
        assert r.text == SAFE_REDIRECT

    def test_whitespace_cleanup(self):
        # 부정어 제거 후 이중 공백 정리
        r = apply("그  슬프다  말이에요.")
        assert "  " not in r.text
        assert "슬프다" not in r.text


class TestEmptyAndEdgeCases:
    def test_empty(self):
        r = apply("")
        assert r.text == ""
        assert r.blocked is False
        assert r.replaced == 0

    def test_apply_text_helper(self):
        assert apply_text("틀렸어요") == "그럴 수 있죠"
        assert apply_text("") == ""
