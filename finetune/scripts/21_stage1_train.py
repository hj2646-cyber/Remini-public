"""
21 — Stage 1 LoRA 학습 (회상요법 기본 화법)

input: finetune/data/v2/stage1_pairs.jsonl (~6,900 페어)
base: unsloth/gemma-4-31B-it-unsloth-bnb-4bit (Stage 1 KoAlpaca 폐기 결정)
output: finetune/checkpoints/lora_stage1_proper

이전 09_train_stage1.py 와 다른 점:
- 데이터: KoAlpaca → 회상요법 페어
- 출력 폴더: lora_stage1 → lora_stage1_proper
- system prompt: KoAlpaca SYSTEM → therapy SYSTEM_PROMPT
- epochs: 3 (작은 데이터, overfit 주의)
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = ROOT / "finetune" / "data" / "v2" / "stage1_pairs.jsonl"
CKPT_DIR = ROOT / "finetune" / "checkpoints"

THERAPY_SYSTEM = """당신은 Remini의 회상요법 대화 파트너(레미니션)입니다.
환자(레미닌)를 성인 대 성인으로 존중하며, 임상가가 아닌 다정한 수다 친구로 대화합니다.

[안전 — 무조건]
- 자해·자살·극심한 고통 등 위기 신호가 보이면 안전 안내 방향으로 부드럽게 전환합니다.
- 환자가 비현실적 주장(망상)을 해도 논리로 반박하지 않고, 동조하지도 않습니다.

[화법 — 무조건]
- 5W(언제/어디서/누구/무엇/왜) 심문식 질문은 하지 않습니다. 1H(어떤 느낌?) 중심.
- "슬프다·괴롭다·위급하다·곤란하다" 같은 부정어는 사용하지 않습니다.
- 환자가 사실과 다른 말을 해도 교정하지 않습니다.

[형식 — 무조건]
- 한 번에 1~2문장, 60자 내외, 차분한 어조.
- 이모지·이모티콘·특수기호 감탄 표현은 사용하지 않습니다."""


def load_jsonl(path: Path) -> list[dict]:
    return [json.loads(l) for l in open(path)]


def to_chat(p: dict) -> dict:
    return {"messages": [
        {"role": "system", "content": THERAPY_SYSTEM},
        {"role": "user", "content": p["user"]},
        {"role": "assistant", "content": p["assistant"]},
    ]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-model", default="unsloth/gemma-4-31B-it-unsloth-bnb-4bit")
    ap.add_argument("--lora-r", type=int, default=16)
    ap.add_argument("--lora-alpha", type=int, default=32)
    ap.add_argument("--max-seq-len", type=int, default=2048)
    ap.add_argument("--batch-size", type=int, default=2)
    ap.add_argument("--grad-accum", type=int, default=4)
    ap.add_argument("--epochs", type=int, default=3)
    ap.add_argument("--lr", type=float, default=2e-4)
    ap.add_argument("--output", default=str(CKPT_DIR / "lora_stage1_proper"))
    ap.add_argument("--val-ratio", type=float, default=0.05)
    args = ap.parse_args()

    from unsloth import FastLanguageModel
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    print(f"[1] base 로드: {args.base_model}")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.base_model,
        max_seq_length=args.max_seq_len,
        load_in_4bit=True,
        dtype=None,
    )

    print(f"[2] LoRA 부착 (r={args.lora_r}, alpha={args.lora_alpha})")
    model = FastLanguageModel.get_peft_model(
        model,
        r=args.lora_r, lora_alpha=args.lora_alpha,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                        "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05, bias="none",
        use_gradient_checkpointing="unsloth",
        random_state=42,
    )

    print(f"[3] 데이터 로드: {DATA_FILE}")
    pairs = load_jsonl(DATA_FILE)
    print(f"   total: {len(pairs)}")

    import random
    rng = random.Random(42); rng.shuffle(pairs)
    n_val = int(len(pairs) * args.val_ratio)
    val_pairs, train_pairs = pairs[:n_val], pairs[n_val:]
    print(f"   train: {len(train_pairs)}, val: {len(val_pairs)}")

    train_ds = Dataset.from_list([to_chat(p) for p in train_pairs])
    val_ds = Dataset.from_list([to_chat(p) for p in val_pairs])

    def fmt(ex):
        return {"text": tokenizer.apply_chat_template(
            ex["messages"], tokenize=False, add_generation_prompt=False)}
    train_ds = train_ds.map(fmt)
    val_ds = val_ds.map(fmt)

    print(f"[4] SFT 학습 시작 (Stage 1 proper)")
    trainer = SFTTrainer(
        model=model, tokenizer=tokenizer,
        train_dataset=train_ds, eval_dataset=val_ds,
        args=SFTConfig(
            output_dir=args.output,
            per_device_train_batch_size=args.batch_size,
            gradient_accumulation_steps=args.grad_accum,
            num_train_epochs=args.epochs,
            learning_rate=args.lr,
            warmup_ratio=0.03,
            logging_steps=10,
            eval_strategy="steps", eval_steps=100,
            save_strategy="epoch", save_total_limit=2,
            bf16=True, optim="adamw_torch", seed=42,
            dataset_text_field="text",
            max_seq_length=args.max_seq_len, packing=False,
        ),
    )
    trainer.train()

    print(f"[5] LoRA 어댑터 저장 → {args.output}")
    model.save_pretrained(args.output)
    tokenizer.save_pretrained(args.output)
    print(f"\n[OK] Stage 1 proper 완료. 다음: GGUF 변환 + Ollama 등록 + before/after compare")


if __name__ == "__main__":
    sys.exit(main())
