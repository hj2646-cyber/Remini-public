"""Semantic End-of-Utterance (EOU) detection.

Primary backend: LiveKit's open-source `livekit/turn-detector` model
(SmolLM2-135M fine-tuned for turn-taking). Runs locally on GPU; on
H200 each call is <50ms. Falls back to a Korean-specific heuristic
if the model cannot be loaded.

Usage:
    eou = is_utterance_complete(current_text, recent_messages=...)
    if eou["complete"]: ...
"""

from __future__ import annotations

import logging
import threading
import time

from app.config import settings

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────
# Korean heuristic fallback
# ─────────────────────────────────────────────────────────────
_KO_HESITATION_TAILS = (
    "그", "그래서", "그러니까", "근데", "그리고", "음", "어", "에",
    "저기", "그게", "그러면", "아니", "어디", "뭐", "뭐냐", "이제",
    "일단", "그러면은", "그런데", "하고", "랑", "이랑", "와",
)
_TERMINAL_PUNCT = (".", "?", "!", "。", "？", "！", "…")
_SHORT_COMPLETE = {
    # 단답
    "응", "네", "예", "어", "아니", "몰라", "글쎄", "맞아", "그래",
    "싫어", "좋아", "있어", "없어", "그렇지", "그치", "당연하지",
    # 인사 / 완결 단문
    "안녕", "안녕하세요", "안녕하십니까", "반가워", "반가워요",
    "고마워", "고마워요", "고맙습니다", "감사합니다", "감사해요",
    "잘가", "잘가요", "잘있어", "안녕히계세요", "안녕히가세요",
    "수고하세요", "수고했어", "수고하셨습니다",
    "사랑해", "사랑해요", "보고싶어", "보고싶어요",
    "잘자", "잘자요", "굿모닝", "굿나잇",
    "미안", "미안해", "미안해요", "죄송해요", "죄송합니다",
    "괜찮아", "괜찮아요",
}


def _heuristic_complete(text: str) -> tuple[bool, str, float]:
    t = (text or "").strip()
    if not t:
        return False, "empty", 1.0
    if t in _SHORT_COMPLETE:
        return True, "short_complete", 0.95
    if t.endswith(_TERMINAL_PUNCT):
        return True, "terminal_punct", 0.95
    last_token = t.split()[-1]
    if last_token in _KO_HESITATION_TAILS:
        return False, "hesitation_tail", 0.9
    # Default to complete so we never stall the pipeline on the
    # heuristic path; the model (when loaded) will override this.
    return True, "heuristic_default", 0.55


# ─────────────────────────────────────────────────────────────
# LiveKit turn-detector model backend
# ─────────────────────────────────────────────────────────────
class _TurnDetectorModel:
    def __init__(self) -> None:
        self._tokenizer = None
        self._model = None
        self._device = "cpu"
        self._eou_token_id: int | None = None
        self._lock = threading.Lock()
        self._load_failed = False

    def _load(self) -> bool:
        if self._model is not None:
            return True
        if self._load_failed:
            return False
        try:
            import torch
            from transformers import AutoModelForCausalLM, AutoTokenizer

            model_id = settings.eou_hf_model
            revision = settings.eou_hf_revision or None
            logger.info("Loading EOU model: %s (rev=%s)", model_id, revision)

            self._tokenizer = AutoTokenizer.from_pretrained(
                model_id, revision=revision
            )
            self._model = AutoModelForCausalLM.from_pretrained(
                model_id,
                revision=revision,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            )
            self._device = "cuda" if torch.cuda.is_available() else "cpu"
            self._model = self._model.to(self._device)
            self._model.eval()

            # Find the end-of-turn token id. LiveKit's model was
            # trained with SmolLM2's <|im_end|> token as the EOU marker.
            for candidate in ("<|im_end|>", "<|endoftext|>"):
                tid = self._tokenizer.convert_tokens_to_ids(candidate)
                if isinstance(tid, int) and tid >= 0 and tid != self._tokenizer.unk_token_id:
                    self._eou_token_id = tid
                    break
            if self._eou_token_id is None:
                raise RuntimeError("EOU token id not found in tokenizer vocab")

            logger.info(
                "EOU model loaded on %s (eou_token_id=%d)",
                self._device, self._eou_token_id,
            )
            return True
        except Exception as exc:
            logger.warning("EOU model load failed (%s); using heuristic fallback.", exc)
            self._load_failed = True
            self._tokenizer = None
            self._model = None
            return False

    def predict(
        self,
        current_text: str,
        recent_messages: list[dict] | None = None,
    ) -> float | None:
        """Return EOU probability (0..1) or None on failure."""
        if not self._load():
            return None
        try:
            import torch

            messages: list[dict] = []
            for m in (recent_messages or [])[-6:]:
                role = m.get("role")
                content = (m.get("content") or "").strip()
                if role in ("user", "assistant") and content:
                    messages.append({"role": role, "content": content})
            messages.append({"role": "user", "content": current_text})

            with self._lock:
                # Render the chat without the trailing generation prompt
                # so we can inspect the probability of the EOU token at
                # the final position.
                text = self._tokenizer.apply_chat_template(
                    messages,
                    tokenize=False,
                    add_generation_prompt=False,
                )
                # Strip any trailing EOU markers so the model has to
                # *predict* the end token rather than read it.
                for marker in ("<|im_end|>\n", "<|im_end|>", "<|endoftext|>"):
                    if text.endswith(marker):
                        text = text[: -len(marker)]
                        break

                inputs = self._tokenizer(
                    text,
                    return_tensors="pt",
                    truncation=True,
                    max_length=512,
                )
                inputs = {k: v.to(self._device) for k, v in inputs.items()}

                with torch.no_grad():
                    logits = self._model(**inputs).logits[0, -1]
                    probs = torch.softmax(logits, dim=-1)
                    eou_prob = float(probs[self._eou_token_id].item())
                return eou_prob
        except Exception as exc:
            logger.warning("EOU predict failed: %s", exc)
            return None


_model_backend = _TurnDetectorModel()


def warmup() -> None:
    """Trigger background load of the EOU model."""
    try:
        _model_backend._load()
    except Exception:
        pass


# ─────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────
def is_utterance_complete(
    text: str,
    recent_messages: list[dict] | None = None,
) -> dict:
    """Decide whether `text` is a complete user utterance.

    Returns {complete, confidence, reason, latency_ms, prob?}.
    """
    started = time.perf_counter()
    t = (text or "").strip()
    if not t:
        return {
            "complete": False,
            "confidence": 1.0,
            "reason": "empty",
            "latency_ms": 0,
        }

    # Short unambiguous responses skip the model entirely.
    if t in _SHORT_COMPLETE:
        return {
            "complete": True,
            "confidence": 0.95,
            "reason": "short_complete",
            "latency_ms": int((time.perf_counter() - started) * 1000),
        }
    if t.endswith(_TERMINAL_PUNCT):
        return {
            "complete": True,
            "confidence": 0.95,
            "reason": "terminal_punct",
            "latency_ms": int((time.perf_counter() - started) * 1000),
        }

    # 한 어절짜리 짧은 발화는 모델이 자주 incomplete로 잘못 판정함.
    # 마지막 토큰이 hesitation tail이 아니면 그냥 complete로 본다.
    tokens = t.split()
    if len(tokens) == 1 and tokens[0] not in _KO_HESITATION_TAILS:
        return {
            "complete": True,
            "confidence": 0.9,
            "reason": "single_token",
            "latency_ms": int((time.perf_counter() - started) * 1000),
        }

    # Try the LiveKit turn-detector model.
    prob = _model_backend.predict(t, recent_messages=recent_messages)
    if prob is not None:
        threshold = settings.eou_threshold
        complete = prob >= threshold
        return {
            "complete": complete,
            "confidence": prob if complete else 1.0 - prob,
            "prob": prob,
            "reason": f"model(p={prob:.3f},thr={threshold:.2f})",
            "latency_ms": int((time.perf_counter() - started) * 1000),
        }

    # Fallback: heuristic.
    complete, reason, conf = _heuristic_complete(t)
    return {
        "complete": complete,
        "confidence": conf,
        "reason": f"heuristic:{reason}",
        "latency_ms": int((time.perf_counter() - started) * 1000),
    }
