"""
32 — Qwen3-ASR-1.7B LoRA 학습 (공식 QwenLM/Qwen3-ASR sft.py 기반 + peft LoRA)

베이스 패턴: https://github.com/QwenLM/Qwen3-ASR/blob/main/finetuning/qwen3_asr_sft.py
- outer wrapper.forward 가 thinker.forward 로 위임하도록 패치 (class-level)
- chat template 으로 prefix 만들고 target append, prefix 부분만 -100 마스킹
- bf16 (4bit QLoRA 아님 — 공식 패턴, 안정성)

LoRA: text decoder q/k/v/o_proj. audio encoder 의 q/k/v 도 (out_proj 라 매칭 안 되는 o_proj 제외) 같이 잡힘 — 도메인 적응 부수효과로 OK.

데이터: finetune/data/aihub_107/utterances.jsonl
  {"wav_path": "/abs/path/foo.wav", "transcript": "...", ...}
  → rename → {"audio": "...", "text": "...", "prompt": ""}

산출물: finetune/checkpoints/qwen3_asr_lora_v1/
"""

import argparse
import json
import random
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List

import librosa
import torch
from datasets import Dataset
from peft import LoraConfig, get_peft_model
from qwen_asr import Qwen3ASRModel
from transformers import GenerationConfig, Trainer, TrainingArguments

ROOT = Path(__file__).resolve().parents[2]
IN_UTT = ROOT / "finetune" / "data" / "aihub_107" / "utterances.jsonl"
OUT_DIR = ROOT / "finetune" / "checkpoints" / "qwen3_asr_lora_v1"


# ── outer wrapper forward 패치 (공식 패턴) ──────────────────────────────
def patch_outer_forward(model):
    cls = model.__class__
    if getattr(cls, "_forward_patched", False):
        return
    if not hasattr(model, "thinker") or not hasattr(model.thinker, "forward"):
        raise RuntimeError("model.thinker.forward not found")

    def forward(
        self,
        input_ids=None,
        attention_mask=None,
        input_features=None,
        feature_attention_mask=None,
        labels=None,
        **kwargs,
    ):
        return self.thinker.forward(
            input_ids=input_ids,
            attention_mask=attention_mask,
            input_features=input_features,
            feature_attention_mask=feature_attention_mask,
            labels=labels,
            **kwargs,
        )

    cls.forward = forward
    cls._forward_patched = True


# ── 데이터 전처리 (공식 패턴) ────────────────────────────────────────────
def load_audio(path: str, sr: int = 16000):
    wav, _ = librosa.load(path, sr=sr, mono=True)
    return wav


def build_prefix_messages(prompt: str, audio_array):
    return [
        {"role": "system", "content": prompt or ""},
        {"role": "user", "content": [{"type": "audio", "audio": audio_array}]},
    ]


def make_preprocess_fn(processor):
    """jsonl row → {prompt, audio path, target, prefix_text}"""
    def _preprocess(ex: Dict[str, Any]) -> Dict[str, Any]:
        prompt = ex.get("prompt", "")
        # dummy audio (chat template 만 — 실제 audio 는 collator 에서)
        prefix_msgs = build_prefix_messages(prompt, None)
        prefix_text = processor.apply_chat_template(
            [prefix_msgs], add_generation_prompt=True, tokenize=False
        )[0]
        return {
            "prompt": prompt,
            "audio": ex["wav_path"],
            "target": ex["transcript"],
            "prefix_text": prefix_text,
        }
    return _preprocess


@dataclass
class DataCollatorForQwen3ASR:
    processor: Any
    sampling_rate: int = 16000

    def __call__(self, features: List[Dict[str, Any]]) -> Dict[str, torch.Tensor]:
        audio_paths = [f["audio"] for f in features]
        prefix_texts = [f["prefix_text"] for f in features]
        targets = [f["target"] for f in features]

        eos = self.processor.tokenizer.eos_token or ""
        full_texts = [pfx + tgt + eos for pfx, tgt in zip(prefix_texts, targets)]
        audios = [load_audio(p, sr=self.sampling_rate) for p in audio_paths]

        full_inputs = self.processor(
            text=full_texts, audio=audios,
            return_tensors="pt", padding=True, truncation=False,
        )
        prefix_inputs = self.processor(
            text=prefix_texts, audio=audios,
            return_tensors="pt", padding=True, truncation=False,
        )
        prefix_lens = prefix_inputs["attention_mask"].sum(dim=1).tolist()

        labels = full_inputs["input_ids"].clone()
        for i, pl in enumerate(prefix_lens):
            labels[i, :pl] = -100
        pad_id = self.processor.tokenizer.pad_token_id
        if pad_id is not None:
            labels[labels == pad_id] = -100

        full_inputs["labels"] = labels
        return full_inputs


class CastFloatInputsTrainer(Trainer):
    """float input 을 model dtype 으로 cast (공식 패턴)."""
    def _prepare_inputs(self, inputs):
        inputs = super()._prepare_inputs(inputs)
        model_dtype = getattr(self.model, "dtype", None)
        if model_dtype is not None:
            for k, v in list(inputs.items()):
                if torch.is_tensor(v) and v.is_floating_point():
                    inputs[k] = v.to(dtype=model_dtype)
        return inputs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-model", default="Qwen/Qwen3-ASR-1.7B")
    ap.add_argument("--lora-r", type=int, default=16)
    ap.add_argument("--lora-alpha", type=int, default=32)
    ap.add_argument("--lora-dropout", type=float, default=0.05)
    ap.add_argument("--batch-size", type=int, default=4)
    ap.add_argument("--grad-accum", type=int, default=4)
    ap.add_argument("--lr", type=float, default=1e-4)
    ap.add_argument("--epochs", type=float, default=1.0)
    ap.add_argument("--max-steps", type=int, default=-1)
    ap.add_argument("--max-train", type=int, default=None)
    ap.add_argument("--warmup-ratio", type=float, default=0.02)
    ap.add_argument("--save-steps", type=int, default=500)
    ap.add_argument("--log-steps", type=int, default=20)
    ap.add_argument("--eval-frac", type=float, default=0.02)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--num-workers", type=int, default=2)
    args = ap.parse_args()

    # ── model + processor + outer forward 패치 ─────────────────────────────
    use_bf16 = torch.cuda.is_available() and torch.cuda.get_device_capability(0)[0] >= 8
    print(f"loading {args.base_model} (bf16={use_bf16})", file=sys.stderr, flush=True)
    asr_wrapper = Qwen3ASRModel.from_pretrained(
        args.base_model,
        dtype=torch.bfloat16 if use_bf16 else torch.float16,
        device_map=None,
    )
    model = asr_wrapper.model
    processor = asr_wrapper.processor
    patch_outer_forward(model)
    model.generation_config = GenerationConfig.from_model_config(model.config)
    if torch.cuda.is_available():
        model.cuda()

    # ── LoRA ───────────────────────────────────────────────────────────────
    lora_cfg = LoraConfig(
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=args.lora_dropout,
        bias="none",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        task_type="CAUSAL_LM",
    )
    model = get_peft_model(model, lora_cfg)
    model.print_trainable_parameters()

    # ── 데이터 로드 (utterances.jsonl 직결) ────────────────────────────────
    print(f"loading utterances from {IN_UTT}", file=sys.stderr, flush=True)
    rows: List[dict] = []
    with IN_UTT.open(encoding="utf-8") as f:
        for line in f:
            rows.append(json.loads(line))
    print(f"  total rows: {len(rows):,}", file=sys.stderr, flush=True)

    random.seed(args.seed)
    random.shuffle(rows)
    n_eval = max(1, int(len(rows) * args.eval_frac))
    eval_rows = rows[:n_eval]
    train_rows = rows[n_eval:]
    if args.max_train:
        train_rows = train_rows[: args.max_train]

    ds_train = Dataset.from_list(train_rows).map(
        make_preprocess_fn(processor), num_proc=1, desc="prep train"
    )
    ds_eval = Dataset.from_list(eval_rows).map(
        make_preprocess_fn(processor), num_proc=1, desc="prep eval"
    )
    keep = {"prompt", "audio", "target", "prefix_text"}
    ds_train = ds_train.remove_columns([c for c in ds_train.column_names if c not in keep])
    ds_eval = ds_eval.remove_columns([c for c in ds_eval.column_names if c not in keep])
    print(f"  train={len(ds_train):,}, eval={len(ds_eval):,}", file=sys.stderr, flush=True)

    collator = DataCollatorForQwen3ASR(processor=processor)

    # ── Trainer ────────────────────────────────────────────────────────────
    targs = TrainingArguments(
        output_dir=str(OUT_DIR),
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        learning_rate=args.lr,
        num_train_epochs=args.epochs,
        max_steps=args.max_steps,
        warmup_ratio=args.warmup_ratio,
        logging_steps=args.log_steps,
        save_steps=args.save_steps,
        eval_steps=args.save_steps,
        eval_strategy="steps",
        save_total_limit=3,
        bf16=use_bf16,
        fp16=not use_bf16,
        report_to="none",
        dataloader_num_workers=args.num_workers,
        dataloader_pin_memory=True,
        ddp_find_unused_parameters=False,
        remove_unused_columns=False,
        label_names=["labels"],
    )

    trainer = CastFloatInputsTrainer(
        model=model,
        args=targs,
        train_dataset=ds_train,
        eval_dataset=ds_eval,
        data_collator=collator,
        tokenizer=processor.tokenizer,
    )

    trainer.train()
    trainer.save_model(str(OUT_DIR))
    print(f"\n=== done — adapter: {OUT_DIR}")


if __name__ == "__main__":
    main()
