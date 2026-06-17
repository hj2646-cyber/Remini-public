#!/usr/bin/env bash
# 07 — LoRA 어댑터 → base 모델과 병합 → GGUF 변환 → Ollama 등록
#
# 전제:
#   - checkpoints/lora_v1/ 에 LoRA 어댑터 저장됨 (06_train_lora.py 출력)
#   - llama.cpp 의 convert_lora_to_gguf.py + quantize 가 PATH 에 있거나 LLAMA_CPP 변수로 지정
#   - Ollama 가 호스트에 실행 중
#
# 사용:
#   bash 07_to_ollama.sh                       # remini-dslm:lora-v1 으로 등록
#   MODEL_NAME=remini-dslm:test bash 07...     # 다른 이름

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CKPT_DIR="${ROOT}/finetune/checkpoints/lora_v1"
GGUF_OUT="${ROOT}/finetune/checkpoints/lora_v1.gguf"
MODEL_NAME="${MODEL_NAME:-remini-dslm:lora-v1}"
LLAMA_CPP="${LLAMA_CPP:-$HOME/llama.cpp}"

if [[ ! -d "$CKPT_DIR" ]]; then
  echo "ERROR: $CKPT_DIR 없음. 06_train_lora.py 먼저 실행"; exit 1
fi

if [[ ! -d "$LLAMA_CPP" ]]; then
  echo "ERROR: llama.cpp 가 $LLAMA_CPP 에 없음."
  echo "  설치: git clone https://github.com/ggerganov/llama.cpp ~/llama.cpp && cd ~/llama.cpp && make"
  exit 1
fi

# 1) LoRA → GGUF (Q4_K_M 양자화)
echo "[1] LoRA 어댑터 → GGUF 변환 (Q4_K_M)"
python "$LLAMA_CPP/convert_lora_to_gguf.py" \
  --base "google/gemma-3-27b-it" \
  --outfile "$GGUF_OUT" \
  --outtype f16 \
  "$CKPT_DIR"

# 2) Modelfile 작성
MODELFILE="${ROOT}/finetune/checkpoints/Modelfile"
cat > "$MODELFILE" <<'EOF'
FROM gemma4:31b
ADAPTER ${GGUF_OUT}

PARAMETER temperature 0.4
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1
PARAMETER num_ctx 32768

# system prompt 는 호출 시 주입 (학습 때와 동일하게 ai-server SYSTEM_PROMPT 사용)
TEMPLATE """{{ if .System }}<start_of_turn>system
{{ .System }}<end_of_turn>
{{ end }}{{ range .Messages }}<start_of_turn>{{ .Role }}
{{ .Content }}<end_of_turn>
{{ end }}<start_of_turn>model
"""
EOF

echo "[2] Modelfile 작성: $MODELFILE"

# 3) Ollama 등록
echo "[3] Ollama 등록: $MODEL_NAME"
ollama create "$MODEL_NAME" -f "$MODELFILE"

echo ""
echo "[OK] 등록 완료. 테스트:"
echo "  ollama run $MODEL_NAME '안녕하세요. 옛날 학교 다녔던 게 기억나요.'"
echo ""
echo "다음:"
echo "  experiments/.env 에 OLLAMA_MODEL_DSLM=$MODEL_NAME 추가"
echo "  → Phase 1/2 의 cell1/cell3 응답 시 이 모델 사용"
