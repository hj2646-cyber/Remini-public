#!/usr/bin/env bash
# 12 — GGUF → ollama create
# 사용: bash 12_register_ollama.sh <gguf_path> <ollama_model_name>
#   예: bash 12_register_ollama.sh checkpoints/lora_stage1/unsloth.Q4_K_M.gguf remini-stage1

set -euo pipefail

GGUF="${1:?usage: $0 <gguf_path> <ollama_model_name>}"
NAME="${2:?usage: $0 <gguf_path> <ollama_model_name>}"

if [[ ! -f "$GGUF" ]]; then
  # 디렉토리이면 Q4_K_M 우선 (BF16/mmproj 는 partial 또는 multimodal — ollama 부적합)
  if [[ -d "$GGUF" ]]; then
    DIR="$GGUF"
    GGUF=$(ls "$DIR"/*Q4_K_M*.gguf 2>/dev/null | head -1)
    [[ -z "$GGUF" ]] && GGUF=$(ls "$DIR"/*.gguf 2>/dev/null | grep -vE "BF16|bf16|mmproj" | head -1)
    [[ -z "$GGUF" ]] && GGUF=$(ls "$DIR"/*.gguf 2>/dev/null | head -1)
  fi
fi
if [[ ! -f "$GGUF" ]]; then
  echo "ERROR: GGUF 파일 없음: $1"; exit 1
fi
# absolute path 정규화 (ollama Modelfile FROM 권장)
GGUF=$(readlink -f "$GGUF")

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MODELFILE="$(dirname "$GGUF")/Modelfile.${NAME}"

# ai-server 의 ollama 파라미터와 동일
cat > "$MODELFILE" <<EOF
FROM $GGUF

PARAMETER temperature 0.4
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1
PARAMETER num_ctx 32768
EOF

echo "[1] Modelfile 생성: $MODELFILE"
echo "[2] ollama create $NAME"
ollama create "$NAME" -f "$MODELFILE"

echo ""
echo "[OK] 등록 완료: ollama run $NAME"
ollama list | grep "$NAME" || true
