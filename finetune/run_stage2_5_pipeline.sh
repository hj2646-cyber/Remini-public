#!/bin/bash
# Stage 2.5 Book-aware pipeline: GGUF → Ollama register → after eval → safety → .env 갱신
# (학습은 별도 25_stage2_5_book_aware_train.py 로 이미 완료됨)

set -e
set -o pipefail

ROOT=/home/oem/바탕화면/학부연구생종합설계프로젝트/Remini
mkdir -p $ROOT/finetune/logs
LOG=$ROOT/finetune/logs/stage2_5_pipeline_$(date +%Y%m%d_%H%M).log

cd $ROOT
PY=$ROOT/finetune/.venv/bin/python3
MODEL_NAME="remini-stage25-book"

log() { echo "[$(date +%H:%M:%S)] $*" | tee -a $LOG; }

log "=== Stage 2.5 PIPELINE START ==="

# ───── 0. Verify train output ─────
LORA_DIR=$ROOT/finetune/checkpoints/lora_stage2_5_book_aware
if [[ ! -f "$LORA_DIR/adapter_model.safetensors" ]]; then
  log "[ERR] LoRA adapter 없음: $LORA_DIR"; exit 1
fi
log "[0] LoRA adapter OK: $LORA_DIR"

# ───── 1. Unload Ollama models to free GPU ─────
log "[1] Ollama unload models (free GPU for GGUF conversion)"
for m in gemma4:31b remini-stage1-proper:latest remini-stage2-persona:latest; do
  curl -s -X POST http://127.0.0.1:11434/api/generate \
    -d "{\"model\": \"$m\", \"keep_alive\": 0, \"prompt\": \"\"}" >/dev/null || true
done
sleep 5

# ───── 2. GGUF 변환 ─────
log "[2] GGUF conversion start"
$PY -u finetune/scripts/11_save_gguf.py --lora lora_stage2_5_book_aware 2>&1 | tee -a $LOG
log "[2] GGUF done"

# ───── 3. Ollama 등록 ─────
log "[3] Ollama register: $MODEL_NAME"
bash finetune/scripts/12_register_ollama.sh \
  finetune/checkpoints/lora_stage2_5_book_aware_gguf \
  $MODEL_NAME 2>&1 | tee -a $LOG
log "[3] Ollama register done"

# ───── 4. After eval (10 시나리오 응답 generate) ─────
log "[4] after_stage2_5 eval start"
$PY -u finetune/scripts/10_compare.py --tag after_stage2_5 --model ${MODEL_NAME}:latest 2>&1 | tee -a $LOG
log "[4] after_stage2_5 eval done"

# ───── 5. Safety eval (beomi/korean-hatespeech-classifier) ─────
log "[5] safety eval start"
$PY -u finetune/scripts/13_safety_eval.py --tag after_stage2_5 2>&1 | tee -a $LOG
log "[5] safety eval done"

# ───── 6. .env 자동 갱신 (feedback_finetune_apply_to_env.md 룰) ─────
log "[6] Update .env OLLAMA_MODEL → ${MODEL_NAME}:latest"
sed -i "s|^OLLAMA_MODEL=.*|OLLAMA_MODEL=${MODEL_NAME}:latest|" .env
grep "^OLLAMA_MODEL=" .env | tee -a $LOG

log "=== Stage 2.5 PIPELINE DONE ==="
log "[!!] 사용자: ai-server 재시작 필요 (bash restart.sh) — feedback_server_restart.md 룰"
