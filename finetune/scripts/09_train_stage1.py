"""
09 — Stage 1 LoRA 학습: gemma-4-31B-it + KoAlpaca-v1.1a (5K)

목적:
  Stage 1 = 한국어 + 한국 문화 능력 보강
  ai-server 의 ollama gemma4:31b 와 **동일 base** (unsloth pre-quantized 4bit)
  → Stage 2 (회상요법) 학습 시 이 어댑터 위에 추가 학습 (curriculum)
  → 최종 LoRA 를 ollama 에 등록하면 ai-server 에서 즉시 사용 가능

base model:
  unsloth/gemma-4-31B-it-unsloth-bnb-4bit (Unsloth 공식 4bit pre-quantized)
  = Google Gemma 4 31B Dense IT, ollama gemma4:31b 와 동일 origin

산출물:
  finetune/checkpoints/lora_stage1/  — Stage 2 의 --resume-from-lora 으로 사용
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = ROOT / "finetune" / "data" / "stage1" / "koalpaca.jsonl"
CKPT_DIR = ROOT / "finetune" / "checkpoints"


def load_jsonl(path: Path) -> list[dict]:
    return [json.loads(l) for l in open(path)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-model", default="unsloth/gemma-4-31B-it-unsloth-bnb-4bit")
    ap.add_argument("--lora-r", type=int, default=16)
    ap.add_argument("--lora-alpha", type=int, default=32)
    ap.add_argument("--max-seq-len", type=int, default=2048)
    ap.add_argument("--batch-size", type=int, default=2)
    ap.add_argument("--grad-accum", type=int, default=4)
    ap.add_argument("--epochs", type=int, default=2)
    ap.add_argument("--lr", type=float, default=2e-4)
    ap.add_argument("--output", default=str(CKPT_DIR / "lora_stage1"))
    ap.add_argument("--val-ratio", type=float, default=0.05)
    args = ap.parse_args()

    from unsloth import FastLanguageModel
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    print(f"[1] base model 로드: {args.base_model}")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.base_model,
        max_seq_length=args.max_seq_len,
        load_in_4bit=True,
        dtype=None,
    )

    print(f"[2] LoRA 어댑터 부착 (r={args.lora_r}, alpha={args.lora_alpha})")
    model = FastLanguageModel.get_peft_model(
        model,
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                        "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05,
        bias="none",
        use_gradient_checkpointing="unsloth",
        random_state=42,
    )

    print(f"[3] 데이터 로드: {DATA_FILE}")
    pairs = load_jsonl(DATA_FILE)
    print(f"   total: {len(pairs)} pairs")

    # train/val 분할
    import random
    rng = random.Random(42)
    rng.shuffle(pairs)
    n_val = int(len(pairs) * args.val_ratio)
    val_pairs = pairs[:n_val]
    train_pairs = pairs[n_val:]
    print(f"   train: {len(train_pairs)}, val: {len(val_pairs)}")

    train_ds = Dataset.from_list(train_pairs)
    val_ds = Dataset.from_list(val_pairs)

    def format_chat(ex):
        return {"text": tokenizer.apply_chat_template(
            ex["messages"], tokenize=False, add_generation_prompt=False)}
    train_ds = train_ds.map(format_chat)
    val_ds = val_ds.map(format_chat)

    print(f"[4] SFT 학습 시작 (Stage 1)")
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        args=SFTConfig(
            output_dir=args.output,
            per_device_train_batch_size=args.batch_size,
            gradient_accumulation_steps=args.grad_accum,
            num_train_epochs=args.epochs,
            learning_rate=args.lr,
            warmup_ratio=0.03,
            logging_steps=10,
            eval_strategy="steps",
            eval_steps=100,
            save_strategy="epoch",
            save_total_limit=2,
            bf16=True,
            optim="adamw_torch",
            seed=42,
            dataset_text_field="text",
            max_seq_length=args.max_seq_len,
            packing=False,
        ),
    )
    trainer.train()

    print(f"[5] LoRA 어댑터 저장 → {args.output}")
    model.save_pretrained(args.output)
    tokenizer.save_pretrained(args.output)
    print(f"\n[OK] Stage 1 완료. 다음: 06_train_lora.py 가 이 LoRA 위에 회상요법 학습")


if __name__ == "__main__":
    sys.exit(main())
