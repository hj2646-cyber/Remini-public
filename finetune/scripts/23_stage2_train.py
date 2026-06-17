"""
23 — Stage 2 LoRA 학습 (KG-aware, Stage 1 Proper 위에 누적)

input:
  finetune/data/v2/stage1_pairs.jsonl (~6,929 — Stage 1 데이터, 안전망)
  finetune/data/v2/pairs_stage2_persona.jsonl (~2,500 — Stage 2 풍부 페르소나)
base: Stage 1 Proper LoRA 어댑터 (`lora_stage1_proper`) 위에 학습 계속
output: finetune/checkpoints/lora_stage2_persona

전략 (Stage 1 KoAlpaca catastrophic forgetting 교훈 반영):
- Stage 1 데이터를 같이 mix 해서 forget 방지 (replay buffer)
- system prompt 에 페르소나 컨텍스트 추가 (Stage 1 은 단순, Stage 2 는 페르소나)
- Stage 1 페어는 system_persona 비어있음 → 빈 컨텍스트로 통일

Stage 1 train 과의 차이:
- base: unsloth/gemma-4-31B-it-unsloth-bnb-4bit + Stage 1 LoRA 로드
- 데이터: Stage 1 mix + Stage 2 풍부 페르소나
- system context 에 페르소나 텍스트 추가
- epochs: 2 (이미 stage 1 학습됨, overfit 방지)
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_S1 = ROOT / "finetune" / "data" / "v2" / "stage1_pairs.jsonl"
DATA_S2 = ROOT / "finetune" / "data" / "v2" / "pairs_stage2_persona.jsonl"
CKPT_DIR = ROOT / "finetune" / "checkpoints"
STAGE1_LORA = CKPT_DIR / "lora_stage1_proper"

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
- 이모지·이모티콘·특수기호 감탄 표현은 사용하지 않습니다.

[페르소나 활용 — Stage 2]
- 페르소나 컨텍스트의 메타를 응답 톤에 반영하되, 메타를 직접 인용하지 않습니다.
- 정신건강 점수가 높으면 더 부드럽고 안전 지향 톤. 낮으면 자연스러운 추억 확장 톤.
- 페르소나에 없는 specific 사실은 단정하지 않습니다."""


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return [json.loads(line) for line in open(path, encoding="utf-8")]


def to_chat(p: dict) -> dict:
    """Stage 1 페어와 Stage 2 페어 모두 처리.
    Stage 2 는 system_persona 가 있고, Stage 1 은 없음."""
    msgs = [{"role": "system", "content": THERAPY_SYSTEM}]
    persona = p.get("system_persona")
    if persona:
        msgs.append({
            "role": "system",
            "content": f"# 환자 페르소나 컨텍스트 (익명화)\n\n{persona}\n\n"
            "응답 시 specific 이름·구체 지명·연도 직접 노출 X. 메타를 환자에게 통보 X.",
        })
    msgs.extend([
        {"role": "user", "content": p["user"]},
        {"role": "assistant", "content": p["assistant"]},
    ])
    return {"messages": msgs}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage1-lora", default=str(STAGE1_LORA),
                    help="Stage 1 Proper LoRA 어댑터 경로")
    ap.add_argument("--lora-r", type=int, default=16)
    ap.add_argument("--lora-alpha", type=int, default=32)
    ap.add_argument("--max-seq-len", type=int, default=4096,
                    help="페르소나 컨텍스트 추가로 Stage 1 보다 길게")
    ap.add_argument("--batch-size", type=int, default=2)
    ap.add_argument("--grad-accum", type=int, default=4)
    ap.add_argument("--epochs", type=int, default=2,
                    help="Stage 1 위에 누적이라 Stage 1 의 3 보다 적게")
    ap.add_argument("--lr", type=float, default=1e-4,
                    help="누적 학습 안정성 위해 Stage 1 의 2e-4 보다 낮게")
    ap.add_argument("--output", default=str(CKPT_DIR / "lora_stage2_persona"))
    ap.add_argument("--val-ratio", type=float, default=0.05)
    ap.add_argument("--s1-replay-ratio", type=float, default=0.3,
                    help="Stage 1 데이터 mix 비율 (forget 방지 replay)")
    args = ap.parse_args()

    if not Path(args.stage1_lora).exists():
        print(f"ERROR: Stage 1 LoRA 어댑터 없음: {args.stage1_lora}")
        return 1

    from unsloth import FastLanguageModel
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    print(f"[1] Stage 1 Proper LoRA 어댑터 로드: {args.stage1_lora}")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.stage1_lora,
        max_seq_length=args.max_seq_len,
        load_in_4bit=True,
        dtype=None,
    )
    print(f"   adapter loaded (Stage 1 LoRA r={args.lora_r}/α={args.lora_alpha} 그대로 유지)")

    print(f"[2] 학습 모드 활성화 (get_peft_model 호출 X — 이미 어댑터 attach됨)")
    # unsloth from_pretrained 로 LoRA dir 을 로드하면 어댑터 자동 attach + inference mode
    # 학습 계속하려면 trainable param 활성화만 하면 됨 (PEFT 기본 동작)
    for name, param in model.named_parameters():
        if "lora_" in name.lower():
            param.requires_grad = True
    model.train()
    if hasattr(model, "print_trainable_parameters"):
        model.print_trainable_parameters()

    print(f"[3] 데이터 로드 + Stage 1 replay mix")
    s2_pairs = load_jsonl(DATA_S2)
    s1_pairs = load_jsonl(DATA_S1)
    if not s2_pairs:
        print(f"ERROR: Stage 2 데이터 없음 ({DATA_S2}). 22 먼저 실행")
        return 1
    print(f"   Stage 2: {len(s2_pairs)}, Stage 1: {len(s1_pairs)}")

    import random
    rng = random.Random(42)
    n_replay = int(len(s2_pairs) * args.s1_replay_ratio)
    n_replay = min(n_replay, len(s1_pairs))
    if n_replay > 0 and s1_pairs:
        replay = rng.sample(s1_pairs, n_replay)
        all_pairs = s2_pairs + replay
        print(f"   replay mix: Stage 2 {len(s2_pairs)} + Stage 1 replay {n_replay} = {len(all_pairs)}")
    else:
        all_pairs = s2_pairs
        print(f"   no replay (Stage 2 only)")

    rng.shuffle(all_pairs)
    n_val = int(len(all_pairs) * args.val_ratio)
    val_pairs, train_pairs = all_pairs[:n_val], all_pairs[n_val:]
    print(f"   train: {len(train_pairs)}, val: {len(val_pairs)}")

    train_ds = Dataset.from_list([to_chat(p) for p in train_pairs])
    val_ds = Dataset.from_list([to_chat(p) for p in val_pairs])

    def fmt(ex):
        return {"text": tokenizer.apply_chat_template(
            ex["messages"], tokenize=False, add_generation_prompt=False)}
    train_ds = train_ds.map(fmt)
    val_ds = val_ds.map(fmt)

    print(f"[4] SFT 학습 시작 (Stage 2 KG-aware, Stage 1 위에 누적)")
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
    print(f"\n[OK] Stage 2 완료. 다음: 11_save_gguf.py + 12_register_ollama.sh + 10_compare.py")


if __name__ == "__main__":
    sys.exit(main())
