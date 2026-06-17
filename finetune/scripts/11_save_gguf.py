"""
11 — LoRA 어댑터 + base merge → GGUF (Q4_K_M) 저장

unsloth 의 save_pretrained_gguf 사용. llama.cpp 자동 처리.
저장 위치: finetune/checkpoints/<lora_name>/<lora_name>.gguf
"""

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CKPT_DIR = ROOT / "finetune" / "checkpoints"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lora", required=True, help="LoRA 어댑터 디렉토리 (예: lora_stage1)")
    ap.add_argument("--base-model", default="unsloth/gemma-4-31B-it-unsloth-bnb-4bit")
    ap.add_argument("--quant", default="q4_k_m", help="GGUF quantization (q4_k_m / q5_k_m / q8_0)")
    ap.add_argument("--max-seq-len", type=int, default=32768)
    args = ap.parse_args()

    lora_path = CKPT_DIR / args.lora if not Path(args.lora).is_absolute() else Path(args.lora)
    if not lora_path.exists():
        print(f"ERROR: {lora_path} 없음")
        return 1

    # unsloth-native pattern: LoRA path 자체를 model_name 으로 주면
    # adapter_config.json 의 base_model_name_or_path 따라 base 자동 로드 + 어댑터 attach
    print(f"[1] LoRA + base 자동 로드: {lora_path}")
    from unsloth import FastLanguageModel
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=str(lora_path),
        max_seq_length=args.max_seq_len,
        load_in_4bit=True,
        dtype=None,
    )
    FastLanguageModel.for_inference(model)
    print(f"[2] inference mode 활성")

    print(f"[3] GGUF 저장 ({args.quant}) → {lora_path}/")
    # unsloth save_pretrained_gguf: LoRA + base merge + quantize
    model.save_pretrained_gguf(
        str(lora_path),
        tokenizer,
        quantization_method=args.quant,
    )

    # 결과 GGUF 파일 찾기
    gguf_files = list(lora_path.glob("*.gguf"))
    if gguf_files:
        for f in gguf_files:
            print(f"   {f.name}: {f.stat().st_size / 1e9:.1f} GB")
    print(f"\n[OK] GGUF 저장 완료")


if __name__ == "__main__":
    sys.exit(main())
