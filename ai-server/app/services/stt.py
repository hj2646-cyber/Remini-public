from __future__ import annotations

from dataclasses import dataclass, field
import logging
import re
from pathlib import Path
from threading import Lock

from faster_whisper import WhisperModel
import numpy as np
import requests

from app.config import settings


logger = logging.getLogger(__name__)


# AI Hub 전사 규약 태그 제거 — Stage5 STT LoRA 학습 데이터(발화정보.stt)에
# (NO:...)/(SP) 등 태그가 정제 안 된 채 들어가 모델이 그대로 출력함.
# 근본 해결은 데이터 정제 후 재학습이나, 출력단에서 즉시 제거.
_ASR_TAG_WITH_CONTENT = re.compile(r"\(([A-Z]{1,5}):([^)]*)\)")  # (NO:그거) → 그거
_ASR_TAG_BARE = re.compile(r"\(([A-Z]{1,5})\)")                  # (NO) (SP) → 제거
_ASR_MULTISPACE = re.compile(r"\s{2,}")


def _clean_asr_text(text: str) -> str:
    if not text:
        return text
    # streaming 토큰 경계에서 잘린 미완성 한글 → replacement char(U+FFFD "�").
    # qwen_asr 가 prefix 는 방어하지만 chunk 별 gen_text 끝은 방어 안 함 → 출력단서 제거.
    # 다음 chunk 에서 완성된 글자로 다시 들어옴.
    if "�" in text:
        text = text.replace("�", "")
    if "(" in text:
        text = _ASR_TAG_WITH_CONTENT.sub(r"\2", text)
        text = _ASR_TAG_BARE.sub("", text)
        text = _ASR_MULTISPACE.sub(" ", text)
    return text.strip()


@dataclass
class StreamingSTTHandle:
    session_id: str
    buffer: bytearray = field(default_factory=bytearray)
    last_text: str = ""
    lock: Lock = field(default_factory=Lock)


class STTService:
    """STT 서비스 — provider 분기 (whisper | qwen3 | cohere).

    `STT_PROVIDER=whisper` (default) → faster-whisper (CTranslate2, ~200ms).
    `STT_PROVIDER=qwen3`            → Qwen3-ASR-1.7B (transformers, ~2s, 한국어 정확도 ↑).
    `STT_PROVIDER=cohere`           → Cohere sidecar endpoint 사용.
    `QWEN_ASR_STREAMING_ENDPOINT`   → Qwen-compatible streaming sidecar 사용.
    """

    def __init__(self, preload: bool = True) -> None:
        self._provider = (settings.stt_provider or "whisper").strip().lower()
        self._streaming_endpoint = (settings.qwen_asr_streaming_endpoint or "").rstrip("/")
        self._streaming_chunk_samples = max(
            1, int(round(16000 * float(settings.qwen_asr_streaming_chunk_sec)))
        )
        self._streaming_chunk_bytes = self._streaming_chunk_samples * 2
        self._whisper: WhisperModel | None = None
        self._qwen = None
        if preload:
            try:
                self._get_model()
            except Exception as exc:
                logger.warning("STT preload failed: %s", exc)

    # ── faster-whisper backend ───────────────────────────────────────────
    def _build_whisper(self, device: str, compute_type: str) -> WhisperModel:
        return WhisperModel(
            settings.whisper_model,
            device=device,
            compute_type=compute_type,
        )

    def _get_whisper(self) -> WhisperModel:
        if self._whisper is None:
            device = settings.whisper_device
            compute_type = settings.whisper_compute_type
            try:
                self._whisper = self._build_whisper(device, compute_type)
                logger.info(
                    "Whisper loaded: model=%s device=%s compute=%s",
                    settings.whisper_model, device, compute_type,
                )
            except Exception as exc:
                logger.warning(
                    "Whisper %s on %s/%s failed (%s); falling back to CPU/int8 small.",
                    settings.whisper_model, device, compute_type, exc,
                )
                self._whisper = WhisperModel("small", device="cpu", compute_type="int8")
        return self._whisper

    # ── qwen-asr backend ─────────────────────────────────────────────────
    @property
    def supports_streaming(self) -> bool:
        return self._provider in {"qwen3", "cohere"} and bool(self._streaming_endpoint)

    def _get_qwen(self):
        if self._qwen is None:
            import torch
            from qwen_asr import Qwen3ASRModel
            logger.info(
                "Loading Qwen3-ASR: %s on %s (attn=%s, compile=%s, max_new=%d)",
                settings.qwen_asr_model, settings.qwen_asr_device,
                settings.qwen_asr_attn, settings.qwen_asr_compile,
                settings.qwen_asr_max_new_tokens,
            )
            kwargs = dict(
                dtype=torch.bfloat16,
                device_map=settings.qwen_asr_device,
                max_new_tokens=settings.qwen_asr_max_new_tokens,
            )
            # attn_implementation 시도 → 실패 시 default fallback
            attn = (settings.qwen_asr_attn or "").strip()
            if attn:
                try:
                    self._qwen = Qwen3ASRModel.from_pretrained(
                        settings.qwen_asr_model, attn_implementation=attn, **kwargs,
                    )
                    logger.info("Qwen3-ASR loaded with attn=%s", attn)
                except Exception as exc:
                    logger.warning("attn=%s failed (%s); falling back to default", attn, exc)
                    self._qwen = Qwen3ASRModel.from_pretrained(settings.qwen_asr_model, **kwargs)
            else:
                self._qwen = Qwen3ASRModel.from_pretrained(settings.qwen_asr_model, **kwargs)

            # torch.compile — 첫 호출 시 30~60s 컴파일, 이후 가속
            if settings.qwen_asr_compile:
                try:
                    inner = getattr(self._qwen, "model", None)
                    if inner is not None and hasattr(torch, "compile"):
                        self._qwen.model = torch.compile(inner)
                        logger.info("Qwen3-ASR torch.compile applied to .model")
                except Exception as exc:
                    logger.warning("torch.compile failed: %s", exc)
            logger.info("Qwen3-ASR ready")
        return self._qwen

    # ── unified entry ────────────────────────────────────────────────────
    def _get_model(self):
        if self._provider == "qwen3":
            if self.supports_streaming:
                logger.info(
                    "ASR streaming sidecar configured: %s",
                    self._streaming_endpoint,
                )
                return None
            return self._get_qwen()
        if self._provider == "cohere":
            if self.supports_streaming:
                logger.info(
                    "Cohere ASR sidecar configured: %s",
                    self._streaming_endpoint,
                )
                return None
            raise RuntimeError("STT_PROVIDER=cohere requires QWEN_ASR_STREAMING_ENDPOINT")
        return self._get_whisper()

    # ── qwen-asr streaming sidecar ───────────────────────────────────────
    def _stream_url(self, path: str) -> str:
        if not self._streaming_endpoint:
            raise RuntimeError("ASR streaming endpoint is not configured")
        return f"{self._streaming_endpoint}{path}"

    def begin_stream(self) -> StreamingSTTHandle:
        language = (settings.qwen_asr_streaming_language or "").strip() or None
        response = requests.post(
            self._stream_url("/api/start"),
            json={"language": language} if language else None,
            timeout=settings.qwen_asr_streaming_timeout_sec,
        )
        response.raise_for_status()
        session_id = str(response.json()["session_id"])
        return StreamingSTTHandle(session_id=session_id)

    def _post_stream_chunk(self, handle: StreamingSTTHandle, pcm16_bytes: bytes) -> str:
        if not pcm16_bytes:
            return handle.last_text
        samples = np.frombuffer(pcm16_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        response = requests.post(
            self._stream_url("/api/chunk"),
            params={"session_id": handle.session_id},
            headers={"Content-Type": "application/octet-stream"},
            data=samples.astype(np.float32, copy=False).tobytes(),
            timeout=settings.qwen_asr_streaming_timeout_sec,
        )
        response.raise_for_status()
        text = _clean_asr_text((response.json().get("text") or "").strip())
        handle.last_text = text
        return text

    def stream_chunk(self, handle: StreamingSTTHandle, pcm16_bytes: bytes) -> str | None:
        """Feed PCM16 bytes and return updated text only when a chunk is decoded."""
        with handle.lock:
            handle.buffer.extend(pcm16_bytes)
            text: str | None = None
            while len(handle.buffer) >= self._streaming_chunk_bytes:
                chunk = bytes(handle.buffer[: self._streaming_chunk_bytes])
                del handle.buffer[: self._streaming_chunk_bytes]
                text = self._post_stream_chunk(handle, chunk)
            return text

    def finish_stream(self, handle: StreamingSTTHandle) -> str:
        with handle.lock:
            if handle.buffer:
                tail = bytes(handle.buffer)
                handle.buffer.clear()
                self._post_stream_chunk(handle, tail)
            response = requests.post(
                self._stream_url("/api/finish"),
                params={"session_id": handle.session_id},
                timeout=settings.qwen_asr_streaming_timeout_sec,
            )
            response.raise_for_status()
            text = _clean_asr_text((response.json().get("text") or "").strip())
            handle.last_text = text
            return text

    def abort_stream(self, handle: StreamingSTTHandle | None) -> None:
        if handle is None:
            return
        try:
            requests.post(
                self._stream_url("/api/finish"),
                params={"session_id": handle.session_id},
                timeout=5,
            )
        except Exception:
            logger.debug("ASR stream abort failed", exc_info=True)

    def warmup_streaming(self) -> None:
        if not self.supports_streaming:
            return
        try:
            handle = self.begin_stream()
            silence = b"\x00\x00" * self._streaming_chunk_samples
            self.stream_chunk(handle, silence)
            self.finish_stream(handle)
            logger.info("ASR streaming sidecar warmup done")
        except Exception as exc:
            logger.warning("ASR streaming warmup failed: %s", exc)

    def _audio_file_to_pcm16(self, audio_path: Path) -> bytes:
        import librosa
        import soundfile as sf

        audio, sample_rate = sf.read(str(audio_path))
        samples = np.asarray(audio, dtype=np.float32)
        if samples.ndim > 1:
            samples = samples.mean(axis=1)
        if int(sample_rate) != 16000:
            samples = librosa.resample(
                samples,
                orig_sr=int(sample_rate),
                target_sr=16000,
            ).astype(np.float32, copy=False)
        samples = np.nan_to_num(samples, nan=0.0, posinf=0.0, neginf=0.0)
        samples = np.clip(samples, -1.0, 1.0)
        return (samples * 32767.0).astype(np.int16).tobytes()

    def _transcribe_via_streaming_endpoint(self, audio_path: Path) -> tuple[str, str | None]:
        pcm16 = self._audio_file_to_pcm16(audio_path)
        handle: StreamingSTTHandle | None = None
        try:
            handle = self.begin_stream()
            for offset in range(0, len(pcm16), self._streaming_chunk_bytes):
                self.stream_chunk(handle, pcm16[offset : offset + self._streaming_chunk_bytes])
            text = self.finish_stream(handle)
            handle = None
            return text, "ko"
        finally:
            if handle is not None:
                self.abort_stream(handle)

    def transcribe(self, audio_path: Path) -> tuple[str, str | None]:
        if self._provider in {"qwen3", "cohere"} and self.supports_streaming:
            return self._transcribe_via_streaming_endpoint(audio_path)

        if self._provider == "qwen3":
            model = self._get_qwen()
            results = model.transcribe(
                audio=str(audio_path),
                language=settings.qwen_asr_language,
            )
            text = _clean_asr_text((results[0].text if results else "").strip())
            return text, "ko"

        if self._provider == "cohere":
            raise RuntimeError("STT_PROVIDER=cohere requires QWEN_ASR_STREAMING_ENDPOINT")

        # default: faster-whisper
        model = self._get_whisper()
        language = (settings.whisper_language or "").strip() or None
        segments, info = model.transcribe(
            str(audio_path),
            vad_filter=True,
            language=language,
            beam_size=1,
            best_of=1,
            condition_on_previous_text=False,
        )
        text = "".join(seg.text for seg in segments).strip()
        detected_language = getattr(info, "language", None)
        return text, detected_language or language
