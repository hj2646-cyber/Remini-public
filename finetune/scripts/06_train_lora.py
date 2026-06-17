"""
06 — gemma4:31b 위에 LoRA fine-tune (unsloth + 4bit QLoRA)

전제:
  - H200 80GB 1장 가정
  - data/splits/train.jsonl + val.jsonl 준비됨
  - experiments/finetune/.venv 활성 (별도 venv 권장 — unsloth가 무거움)

학습 데이터 포맷:
  {"user": "...", "assistant": "..."} → unsloth 채팅 템플릿 (gemma) 으로 변환

OOM 시:
  --batch-size 1 --grad-accum 8 --max-seq-len 1024
  로 줄이면 됨.

Phase 1 (실험설계 v5 기준) 의 4셀 디자인에서:
  cell1/cell3 의 DSLM = 이 스크립트가 산출하는 모델 (remini-dslm-lora-v1)
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SPLITS = ROOT / "finetune" / "data" / "splits"
CKPT_DIR = ROOT / "finetune" / "checkpoints"

# system prompt — ai-server 의 SYSTEM_PROMPT 와 동일하게 유지
# (학습 시에도 같은 system 환경에서 응답하도록)
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


def to_chat_format(p: dict) -> dict:
    """unsloth/transformers chat template 입력 형태."""
    return {
        "messages": [
            {"role": "system", "content": THERAPY_SYSTEM},
            {"role": "user", "content": p["user"]},
            {"role": "assistant", "content": p["assistant"]},
        ]
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-model", default="unsloth/gemma-4-31B-it-unsloth-bnb-4bit",
                    help="ollama gemma4:31b 와 동일 base. Unsloth pre-quantized 4bit.")
    ap.add_argument("--lora-r", type=int, default=16)
    ap.add_argument("--lora-alpha", type=int, default=32)
    ap.add_argument("--max-seq-len", type=int, default=2048)
    ap.add_argument("--batch-size", type=int, default=2)
    ap.add_argument("--grad-accum", type=int, default=4)
    ap.add_argument("--epochs", type=int, default=3)
    ap.add_argument("--lr", type=float, default=2e-4)
    ap.add_argument("--output", default=str(CKPT_DIR / "lora_stage2"))
    ap.add_argument("--resume-from-lora", default=str(CKPT_DIR / "lora_stage1"),
                    help="Stage 1 LoRA 어댑터 경로. 없으면 새 LoRA 처음부터.")
    args = ap.parse_args()

    # Lazy import — unsloth 가 무겁고 별도 venv 일 수 있음
    from unsloth import FastLanguageModel
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    print(f"[1] base model 로딩: {args.base_model}")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.base_model,
        max_seq_length=args.max_seq_len,
        load_in_4bit=True,
        dtype=None,  # auto
    )

    resume_path = Path(args.resume_from_lora)
    if resume_path.exists() and (resume_path / "adapter_config.json").exists():
        print(f"[2] Stage 1 LoRA 로드 후 추가 학습 (curriculum): {resume_path}")
        from peft import PeftModel
        model = PeftModel.from_pretrained(model, str(resume_path), is_trainable=True)
    else:
        print(f"[2] 새 LoRA 어댑터 부착 (r={args.lora_r}, alpha={args.lora_alpha})")
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

    print(f"[3] 데이터 로드")
    train_pairs = load_jsonl(SPLITS / "train.jsonl")
    val_pairs = load_jsonl(SPLITS / "val.jsonl")
    print(f"   train: {len(train_pairs)}, val: {len(val_pairs)}")

    train_ds = Dataset.from_list([to_chat_format(p) for p in train_pairs])
    val_ds = Dataset.from_list([to_chat_format(p) for p in val_pairs])

    # tokenizer chat template 적용
    def format_chat(ex):
        return {"text": tokenizer.apply_chat_template(
            ex["messages"], tokenize=False, add_generation_prompt=False)}
    train_ds = train_ds.map(format_chat)
    val_ds = val_ds.map(format_chat)

    print(f"[4] SFT 학습 시작")
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
            eval_steps=50,
            save_strategy="epoch",
            save_total_limit=2,
            bf16=True,
            optim="adamw_torch",
            seed=42,
            dataset_text_field="text",
            max_seq_length=args.max_seq_len,
            packing=False,  # 페어 단위 학습 명확히 유지
        ),
    )
    trainer.train()

    print(f"[5] LoRA 어댑터 저장 → {args.output}")
    model.save_pretrained(args.output)
    tokenizer.save_pretrained(args.output)


if __name__ == "__main__":
    sys.exit(main())
