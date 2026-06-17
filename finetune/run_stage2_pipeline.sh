#!/bin/bash
# Stage 2 full pipeline: distill (이미 시작됨) → train → gguf → ollama register → after eval → safety → .env 갱신
# 모든 룰 자동 적용 (feedback_stage_eval_rule.md, feedback_finetune_apply_to_env.md)

set -e
set -o pipefail

ROOT=/home/oem/바탕화면/학부연구생종합설계프로젝트/Remini
LOG=$ROOT/finetune/logs/stage2_pipeline_$(date +%Y%m%d_%H%M).log
DISTILL_PID="${1:-1636760}"
DISTILL_OUT=$ROOT/finetune/data/v2/pairs_stage2_persona.jsonl

cd $ROOT

# 학습/추론은 finetune/.venv (unsloth + torch+cu128)
PY=$ROOT/finetune/.venv/bin/python3

log() { echo "[$(date +%H:%M:%S)] $*" | tee -a $LOG; }

log "=== Stage 2 PIPELINE START ==="

# ───── 1. Wait for distill to finish ─────
log "[1] Wait distill PID=$DISTILL_PID"
while kill -0 $DISTILL_PID 2>/dev/null; do sleep 60; done
log "[1] distill process exited"

# ───── 2. Verify distill output ─────
if [[ ! -s "$DISTILL_OUT" ]]; then
  log "[ERR] distill output empty: $DISTILL_OUT"; exit 1
fi
PAIRS=$(wc -l < $DISTILL_OUT)
log "[2] distill output: $PAIRS pairs"
if [[ $PAIRS -lt 500 ]]; then
  log "[ERR] too few pairs ($PAIRS) — likely distill failed"; exit 1
fi

# ───── 3. Unload Ollama gemma to free GPU for training ─────
log "[3] Ollama unload gemma4:31b"
curl -s -X POST http://127.0.0.1:11434/api/generate \
  -d '{"model": "gemma4:31b", "keep_alive": 0, "prompt": ""}' >/dev/null || true
sleep 5

# ───── 4. Train (Stage 1 Proper LoRA 위에 누적) ─────
log "[4] Train start"
$PY -u finetune/scripts/23_stage2_train.py 2>&1 | tee -a $LOG
log "[4] Train done"

# ───── 5. GGUF 변환 ─────
log "[5] GGUF start"
$PY -u finetune/scripts/11_save_gguf.py --lora lora_stage2_persona 2>&1 | tee -a $LOG
log "[5] GGUF done"

# ───── 6. Ollama 등록 ─────
log "[6] Ollama register"
bash finetune/scripts/12_register_ollama.sh \
  finetune/checkpoints/lora_stage2_persona_gguf \
  remini-stage2-persona 2>&1 | tee -a $LOG
log "[6] Ollama register done"

# ───── 7. After eval (10 시나리오 응답 generate) ─────
log "[7] after_stage2 eval start"
$PY -u finetune/scripts/10_compare.py --tag after_stage2 --model remini-stage2-persona:latest 2>&1 | tee -a $LOG
log "[7] after_stage2 eval done"

# ───── 8. Safety eval (beomi/korean-hatespeech-classifier) ─────
log "[8] safety eval start"
$PY -u finetune/scripts/13_safety_eval.py --tag after_stage2 2>&1 | tee -a $LOG
log "[8] safety eval done"

# ───── 9. .env 자동 갱신 (feedback_finetune_apply_to_env.md 룰) ─────
log "[9] Update .env OLLAMA_MODEL → remini-stage2-persona:latest"
sed -i 's|^OLLAMA_MODEL=.*|OLLAMA_MODEL=remini-stage2-persona:latest|' .env
grep "^OLLAMA_MODEL=" .env | tee -a $LOG

log "=== Stage 2 PIPELINE DONE ==="
log "[!!] 사용자: ai-server 재시작 필요 (bash restart.sh) — feedback_server_restart.md 룰"
