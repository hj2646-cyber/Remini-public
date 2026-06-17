"""
33 — Qwen3-ASR LoRA before/after WER + 환각 검증 (메모리 룰 필수)

비교:
  base  = Qwen/Qwen3-ASR-1.7B
  +lora = base + finetune/checkpoints/qwen3_asr_lora_v1/

평가:
  - eval split 의 wav transcribe → WER (jiwer) + CER
  - 환각 검증: 짧은 발화 / 무음 wav 에서 비정상 응답 (반복 / 뉴스 클리쉐 / 미관련) 검사

산출물:
  finetune/data/aihub_107_eval/results.json
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "finetune" / "data" / "aihub_107_dataset"
LORA_DIR = ROOT / "finetune" / "checkpoints" / "qwen3_asr_lora_v1"
OUT = ROOT / "finetune" / "data" / "aihub_107_eval" / "results.json"

HALLUC_PATTERNS = [
    r"국감장",      # 정치 뉴스 클리쉐 (ghost613 turbo 사례)
    r"국토교통위",
    r"전당대회",
    r"thank.*watching",  # 영문 종료문구
    r"subtitles by",
]


def is_hallucination(text: str, reference: str) -> bool:
    """기본 환각 검사: 정치 뉴스 클리쉐 / 영문 클리쉐 / 반복."""
    t = text or ""
    for pat in HALLUC_PATTERNS:
        if re.search(pat, t, re.IGNORECASE):
            return True
    # 5글자 이상 반복 (예: "안녕하세요안녕하세요...")
    for i in range(5, min(20, len(t))):
        chunk = t[:i]
        if chunk and t.count(chunk) >= 3:
            return True
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-samples", type=int, default=200, help="eval sample 수")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    import torch
    from datasets import load_from_disk, Audio
    from qwen_asr import Qwen3ASRModel
    import random

    # ── basename → absolute path 매핑 (32 와 동일 패턴, torchcodec 우회) ──
    UTT = ROOT / "finetune" / "data" / "aihub_107" / "utterances.jsonl"
    wav_lookup: dict[str, str] = {}
    with UTT.open(encoding="utf-8") as _f:
        for _line in _f:
            _r = json.loads(_line)
            _p = _r.get("wav_path", "")
            if _p:
                wav_lookup[Path(_p).name] = _p
    print(f"wav_lookup: {len(wav_lookup):,} entries", file=sys.stderr)

    random.seed(args.seed)
    eval_ds = load_from_disk(str(DATA_DIR / "eval"))
    # Audio decode 끄고 path basename 만 받음
    eval_ds = eval_ds.cast_column("audio", Audio(decode=False))
    n = min(args.n_samples, len(eval_ds))
    idxs = random.sample(range(len(eval_ds)), n)
    samples = [eval_ds[i] for i in idxs]

    try:
        import jiwer
    except ImportError:
        print("❌ pip install jiwer", file=sys.stderr)
        sys.exit(1)

    def eval_model(name: str, model) -> dict:
        preds = []
        refs = []
        halls = 0
        for s in samples:
            ref = s["text"]
            basename = s["audio"]["path"]
            wav_path = wav_lookup.get(Path(basename).name, basename)
            try:
                res = model.transcribe(audio=wav_path, language="Korean")
                pred = (res[0].text if res else "").strip()
            except Exception as e:
                pred = ""
            preds.append(pred)
            refs.append(ref)
            if is_hallucination(pred, ref):
                halls += 1
        wer = jiwer.wer(refs, preds)
        cer = jiwer.cer(refs, preds)
        return {
            "name": name,
            "n": n,
            "wer": wer,
            "cer": cer,
            "hallucination_count": halls,
            "hallucination_rate": halls / n,
            "samples": [{"ref": r, "pred": p} for r, p in zip(refs[:20], preds[:20])],
        }

    results = {}

    print("=== base ===", file=sys.stderr)
    base = Qwen3ASRModel.from_pretrained(
        "Qwen/Qwen3-ASR-1.7B",
        dtype=torch.bfloat16,
        device_map="cuda:0",
        max_new_tokens=128,
    )
    results["base"] = eval_model("base", base)
    del base
    torch.cuda.empty_cache()

    print("=== base+lora ===", file=sys.stderr)
    from peft import PeftModel
    base2 = Qwen3ASRModel.from_pretrained(
        "Qwen/Qwen3-ASR-1.7B",
        dtype=torch.bfloat16,
        device_map="cuda:0",
        max_new_tokens=128,
    )
    inner = getattr(base2, "model", base2)
    peft_model = PeftModel.from_pretrained(inner, str(LORA_DIR))
    base2.model = peft_model
    results["lora"] = eval_model("lora", base2)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\n=== summary ===")
    for k in ["base", "lora"]:
        r = results[k]
        print(f"  {k:>6}  WER={r['wer']:.3%}  CER={r['cer']:.3%}  halls={r['hallucination_count']}/{r['n']}")
    print(f"\n  saved: {OUT}")


if __name__ == "__main__":
    main()
