"""
27 — Stage 2.6 LoRA 학습 (CareCall-aware, Stage 2.5 위에 누적)

input:
  finetune/data/v2/pairs_carecall.jsonl (~13K — CareCall 시니어 톤)
  finetune/data/v2/pairs_v2.jsonl (~1,600 — Stage 2.5 replay buffer)
base: Stage 2.5 LoRA (`lora_stage2_5_book_aware`) 위에 학습 누적
output: finetune/checkpoints/lora_stage2_6_carecall

전략:
- Stage 2.5 데이터 (책 RAG) replay 30% 로 forget 방지
- LoRA continuation: Stage 1 → 2 → 2.5 → 2.6 누적
- CareCall 페어는 system_persona 빈 값 (시니어 봇 톤만 흡수)
- THERAPY_SYSTEM 그대로 유지 (회상요법 룰)

참고: NAVER CareCall (Bae et al., NAACL 2022)
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_CARECALL = ROOT / "finetune" / "data" / "v2" / "pairs_carecall.jsonl"
DATA_V2 = ROOT / "finetune" / "data" / "v2" / "pairs_v2.jsonl"
CKPT_DIR = ROOT / "finetune" / "checkpoints"
STAGE25_LORA = CKPT_DIR / "lora_stage2_5_book_aware"

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
    msgs = [{"role": "system", "content": THERAPY_SYSTEM}]
    persona = p.get("system_persona") or ""
    if persona.strip():
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
    ap.add_argument("--stage25-lora", default=str(STAGE25_LORA))
    ap.add_argument("--lora-r", type=int, default=16)
    ap.add_argument("--lora-alpha", type=int, default=32)
    ap.add_argument("--max-seq-len", type=int, default=2048,
                    help="CareCall 페어 짧음 + persona 없음 → 2048 충분")
    ap.add_argument("--batch-size", type=int, default=2)
    ap.add_argument("--grad-accum", type=int, default=4)
    ap.add_argument("--epochs", type=int, default=2)
    ap.add_argument("--lr", type=float, default=1e-4)
    ap.add_argument("--output", default=str(CKPT_DIR / "lora_stage2_6_carecall"))
    ap.add_argument("--val-ratio", type=float, default=0.05)
    ap.add_argument("--replay-ratio", type=float, default=0.3,
                    help="Stage 2.5 v2 데이터 replay 비율")
    args = ap.parse_args()

    if not Path(args.stage25_lora).exists():
        print(f"ERROR: Stage 2.5 LoRA 어댑터 없음: {args.stage25_lora}")
        return 1

    from unsloth import FastLanguageModel
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    print(f"[1] Stage 2.5 LoRA 어댑터 로드: {args.stage25_lora}")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.stage25_lora,
        max_seq_length=args.max_seq_len,
        load_in_4bit=True,
        dtype=None,
    )

    print(f"[2] 학습 모드 활성화 (LoRA continuation)")
    for name, param in model.named_parameters():
        if "lora_" in name.lower():
            param.requires_grad = True
    model.train()
    if hasattr(model, "print_trainable_parameters"):
        model.print_trainable_parameters()

    print(f"[3] 데이터 로드 + Stage 2.5 replay mix")
    cc_pairs = load_jsonl(DATA_CARECALL)
    v2_pairs = load_jsonl(DATA_V2)
    if not cc_pairs:
        print(f"ERROR: CareCall 데이터 없음 ({DATA_CARECALL}). 26 먼저 실행")
        return 1
    print(f"   CareCall: {len(cc_pairs)}, v2 (Stage 2.5): {len(v2_pairs)}")

    import random
    rng = random.Random(42)
    n_replay = int(len(cc_pairs) * args.replay_ratio)
    n_replay = min(n_replay, len(v2_pairs))
    if n_replay > 0 and v2_pairs:
        replay = rng.sample(v2_pairs, n_replay)
        all_pairs = cc_pairs + replay
        print(f"   replay mix: CareCall {len(cc_pairs)} + v2 replay {n_replay} = {len(all_pairs)}")
    else:
        all_pairs = cc_pairs

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

    print(f"[4] SFT 학습 시작 (Stage 2.6 CareCall-aware)")
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
            logging_steps=20,
            eval_strategy="steps",
            eval_steps=200,
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
    print(f"\n[OK] Stage 2.6 완료. 다음: 11_save_gguf + 12_register_ollama + 10_compare + 13_safety")


if __name__ == "__main__":
    sys.exit(main())
