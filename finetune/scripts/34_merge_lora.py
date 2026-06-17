"""
34 — Qwen3-ASR base + LoRA adapter merge → 단일 모델

목적:
  - ai-server 의 vLLM streaming sidecar (`qwen_asr_streaming_sidecar.py`) 가
    base 모델을 그대로 load 함 → LoRA 적용하려면 merge 후 새 path 로 지정.
  - peft adapter 그대로 사용 시 PeftModel wrap 이 vLLM 과 호환 어렵 (sidecar 패턴 변경 필요).
  - merge 한 단일 모델은 base 와 동일 인터페이스 → sidecar/`.env QWEN_ASR_MODEL` path 만 변경.

베이스: Qwen/Qwen3-ASR-1.7B
어댑터: finetune/checkpoints/qwen3_asr_lora_v1/
산출물: finetune/checkpoints/qwen3_asr_lora_v1_merged/  (~3.4GB)
"""

import argparse
import shutil
import sys
from pathlib import Path

import torch
from peft import PeftModel
from qwen_asr import Qwen3ASRModel

ROOT = Path(__file__).resolve().parents[2]
LORA_DIR = ROOT / "finetune" / "checkpoints" / "qwen3_asr_lora_v1"
OUT_DIR = ROOT / "finetune" / "checkpoints" / "qwen3_asr_lora_v1_merged"
BASE_MODEL = "Qwen/Qwen3-ASR-1.7B"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-model", default=BASE_MODEL)
    ap.add_argument("--adapter", default=str(LORA_DIR))
    ap.add_argument("--out", default=str(OUT_DIR))
    args = ap.parse_args()

    print(f"loading base: {args.base_model}", file=sys.stderr)
    wrapper = Qwen3ASRModel.from_pretrained(
        args.base_model, dtype=torch.bfloat16, device_map="cuda:0",
    )
    outer = wrapper.model  # Qwen3ASRForConditionalGeneration

    print(f"applying LoRA adapter: {args.adapter}", file=sys.stderr)
    peft_model = PeftModel.from_pretrained(outer, args.adapter)

    print(f"merging adapter into base weights", file=sys.stderr)
    merged = peft_model.merge_and_unload()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    # GenerationConfig 충돌 방지 — base config 의 temperature 가 do_sample=False 와 inconsistent
    if hasattr(merged, "generation_config") and merged.generation_config is not None:
        if hasattr(merged.generation_config, "temperature"):
            merged.generation_config.temperature = None
        if hasattr(merged.generation_config, "top_p"):
            merged.generation_config.top_p = None
        if hasattr(merged.generation_config, "top_k"):
            merged.generation_config.top_k = None
    print(f"saving merged model: {out}", file=sys.stderr)
    merged.save_pretrained(str(out), safe_serialization=True)

    # processor + tokenizer 등 sidecar 가 필요한 파일 복사 (base model 동일)
    src_base_cache = Path.home() / ".cache" / "huggingface" / "hub" / f"models--{args.base_model.replace('/', '--')}" / "snapshots"
    if src_base_cache.exists():
        snap = next(src_base_cache.iterdir(), None)
        if snap:
            for fn in [
                "preprocessor_config.json",
                "processor_config.json",
                "tokenizer_config.json",
                "tokenizer.json",
                "special_tokens_map.json",
                "chat_template.json",
                "merges.txt",
                "vocab.json",
                "generation_config.json",
            ]:
                src = snap / fn
                if src.exists():
                    shutil.copy2(src, out / fn)
                    print(f"  copied: {fn}", file=sys.stderr)

    print(f"\n=== done ===")
    print(f"  merged model: {out}")
    print(f"\n다음 단계:")
    print(f"  .env: QWEN_ASR_MODEL={out}")
    print(f"  bash stop.sh && bash start.sh  # sidecar 재시작 → merged 모델 로드")


if __name__ == "__main__":
    main()
