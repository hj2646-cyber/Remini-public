from __future__ import annotations

import logging
import tempfile
import threading
from pathlib import Path

import numpy as np
import soundfile as sf

from app.config import settings

logger = logging.getLogger(__name__)


class LocalVoiceCloneService:
    """Qwen3-TTS 기반 보호자 음성 복제 서비스.

    참조 음성(3초 이상)을 받아 해당 화자의 목소리로 한국어 텍스트를 읽어줍니다.
    H200 등 고성능 GPU에서 실행을 권장합니다.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._model = None

    def _resolve_device(self) -> str:
        configured = (settings.voice_clone_device or "auto").strip().lower()
        if configured in {"cpu", "cuda", "mps"}:
            return configured
        try:
            import torch
            if torch.cuda.is_available():
                return "cuda"
        except Exception:
            pass
        return "cpu"

    def _get_model(self):
        if self._model is not None:
            return self._model

        with self._lock:
            if self._model is not None:
                return self._model

            try:
                import torch
                from qwen_tts import Qwen3TTSModel
            except ImportError as exc:
                raise RuntimeError(
                    "voice clone requires qwen-tts. "
                    "Install with: pip install qwen-tts"
                ) from exc

            device = self._resolve_device()
            model_name = getattr(settings, "qwen_tts_model", "Qwen/Qwen3-TTS-12Hz-1.7B-Base")

            kwargs = {"device_map": device}
            if device == "cuda":
                kwargs["dtype"] = torch.bfloat16
                # flash_attn이 있으면 사용, 없으면 기본 attention
                try:
                    import flash_attn  # noqa: F401
                    kwargs["attn_implementation"] = "flash_attention_2"
                    logger.info("Using flash_attention_2")
                except ImportError:
                    logger.info("flash_attn not installed, using default attention")

            model = Qwen3TTSModel.from_pretrained(model_name, **kwargs)
            self._model = model
            logger.info("Qwen3-TTS loaded on %s", device)
            return self._model

    def synthesize(
        self,
        text: str,
        sample_paths: list[Path],
        speaker_id: str = "voice-profile",
    ) -> tuple[bytes, str]:
        """참조 음성으로부터 목소리를 복제해 text를 읽어줍니다."""
        usable = [str(p) for p in sample_paths if p.exists()]
        if not usable:
            raise RuntimeError("voice profile has no readable samples")

        text = (text or "").strip()
        if not text:
            raise ValueError("text is empty")

        model = self._get_model()

        # 여러 샘플 중 첫 번째(가장 긴 것 우선)를 참조 음성으로 사용
        best_ref = max(usable, key=lambda p: Path(p).stat().st_size)

        wavs, sr = model.generate_voice_clone(
            text=text,
            language="Korean",
            ref_audio=best_ref,
            x_vector_only_mode=True,
            non_streaming_mode=True,
        )

        if not wavs or len(wavs) == 0:
            raise RuntimeError("Qwen3-TTS produced no audio")

        wav = wavs[0]
        if hasattr(wav, "cpu"):
            wav = wav.cpu().numpy()
        wav = np.squeeze(wav).astype(np.float32)

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            output_path = Path(tmp.name)
        try:
            sf.write(str(output_path), wav, sr)
            return output_path.read_bytes(), "audio/wav"
        finally:
            output_path.unlink(missing_ok=True)
