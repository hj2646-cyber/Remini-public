"""
25 — Stage 2.5 LoRA 학습 (Book-aware, Stage 2 KG-aware 위에 누적)

input:
  finetune/data/v2/pairs_v2.jsonl (1,600 — 책 RAG 적용 v2 발화·응답 페어)
  finetune/data/v2/pairs_stage2_persona.jsonl (~2,500 — Stage 2 replay buffer)
base: Stage 2 LoRA (`lora_stage2_persona`) 위에 학습 누적
output: finetune/checkpoints/lora_stage2_5_book_aware

전략 (Stage 2 와 동일):
- Stage 2 데이터 30% replay (catastrophic forgetting 방어)
- Stage 1 LoRA → Stage 2 LoRA → Stage 2.5 LoRA 누적 학습 (LoRA continuation)
- v2 페어는 system_persona 없음 (16번 generation 시 페르소나 익명화 했지만 jsonl 에 미박음)
  → 빈 system_persona 로 처리, Stage 2 replay 가 페르소나 능력 보존

23번 (Stage 2) 과의 차이:
- base: lora_stage2_persona (이미 페르소나 학습됨)
- 데이터: v2 (책 RAG 패턴) + Stage 2 replay (페르소나 보존)
- 책 RAG (wiki 06) 는 학습 데이터에 안 박힘 — runtime SYSTEM_PROMPT 로 자동 주입
- epochs: 2 (이미 stage 1+2 학습됨, overfit 방지)
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_V2 = ROOT / "finetune" / "data" / "v2" / "pairs_v2.jsonl"
DATA_S2 = ROOT / "finetune" / "data" / "v2" / "pairs_stage2_persona.jsonl"
CKPT_DIR = ROOT / "finetune" / "checkpoints"
STAGE2_LORA = CKPT_DIR / "lora_stage2_persona"

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
    """Stage 2 페어 (system_persona 있음) + v2 페어 (없음) 둘 다 처리."""
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
    ap.add_argument("--stage2-lora", default=str(STAGE2_LORA),
                    help="Stage 2 LoRA 어댑터 경로 (이 위에 누적 학습)")
    ap.add_argument("--lora-r", type=int, default=16)
    ap.add_argument("--lora-alpha", type=int, default=32)
    ap.add_argument("--max-seq-len", type=int, default=4096,
                    help="페르소나 + 메시지 합쳐 안전한 길이")
    ap.add_argument("--batch-size", type=int, default=2)
    ap.add_argument("--grad-accum", type=int, default=4)
    ap.add_argument("--epochs", type=int, default=2,
                    help="이미 stage 1+2 학습됨, overfit 방지로 2 epoch")
    ap.add_argument("--lr", type=float, default=1e-4,
                    help="누적 학습은 base 보다 살짝 낮은 lr")
    ap.add_argument("--output", default=str(CKPT_DIR / "lora_stage2_5_book_aware"))
    ap.add_argument("--val-ratio", type=float, default=0.05)
    ap.add_argument("--s2-replay-ratio", type=float, default=0.3,
                    help="Stage 2 데이터 mix 비율 (forget 방지 replay)")
    args = ap.parse_args()

    if not Path(args.stage2_lora).exists():
        print(f"ERROR: Stage 2 LoRA 어댑터 없음: {args.stage2_lora}")
        return 1

    from unsloth import FastLanguageModel
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    print(f"[1] Stage 2 LoRA 어댑터 로드: {args.stage2_lora}")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.stage2_lora,
        max_seq_length=args.max_seq_len,
        load_in_4bit=True,
        dtype=None,
    )
    print(f"   adapter loaded (Stage 2 LoRA r={args.lora_r}/α={args.lora_alpha} 그대로 유지)")

    print(f"[2] 학습 모드 활성화 (LoRA continuation)")
    for name, param in model.named_parameters():
        if "lora_" in name.lower():
            param.requires_grad = True
    model.train()
    if hasattr(model, "print_trainable_parameters"):
        model.print_trainable_parameters()

    print(f"[3] 데이터 로드 + Stage 2 replay mix")
    v2_pairs = load_jsonl(DATA_V2)
    s2_pairs = load_jsonl(DATA_S2)
    if not v2_pairs:
        print(f"ERROR: v2 데이터 없음 ({DATA_V2}). 16+17 먼저 실행")
        return 1
    print(f"   v2 (책 RAG): {len(v2_pairs)}, Stage 2: {len(s2_pairs)}")

    import random
    rng = random.Random(42)
    n_replay = int(len(v2_pairs) * args.s2_replay_ratio)
    n_replay = min(n_replay, len(s2_pairs))
    if n_replay > 0 and s2_pairs:
        replay = rng.sample(s2_pairs, n_replay)
        all_pairs = v2_pairs + replay
        print(f"   replay mix: v2 {len(v2_pairs)} + Stage 2 replay {n_replay} = {len(all_pairs)}")
    else:
        all_pairs = v2_pairs
        print(f"   no replay (v2 only)")

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

    print(f"[4] SFT 학습 시작 (Stage 2.5 Book-aware, Stage 2 위에 누적)")
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
    print(f"\n[OK] Stage 2.5 완료. 다음: 11_save_gguf.py + 12_register_ollama.sh + 10_compare.py")


if __name__ == "__main__":
    sys.exit(main())
