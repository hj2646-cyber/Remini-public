#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
SERVER_IP="<SERVER_IP>"

wait_for_http() {
  local name=$1 url=$2 timeout=$3
  local elapsed=0
  while [ "$elapsed" -lt "$timeout" ]; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo "  $name ready (${elapsed}s)"
      return 0
    fi
    if [ $((elapsed % 10)) -eq 0 ]; then
      echo "  $name 준비 중... (${elapsed}s)"
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  echo "  $name 준비 시간 초과 (${timeout}s). log 확인: /tmp/remini-qwen-asr-streaming.log 또는 /tmp/remini-cohere-asr-streaming.log"
  return 1
}

# Load shared env
if [ -f "$REPO_ROOT/.env" ]; then
  set -a
  source "$REPO_ROOT/.env"
  set +a
fi

echo "=========================================="
echo "  Remini - 서버 전체 시작"
echo "=========================================="
echo ""

# 기존 포트 점유 + uvicorn --reload 가 spawn 한 multiprocessing 자식 등 잔여 정리는
# stop.sh 에 위임한다 (한 곳에서 관리). stop.sh 가 stuck 보고하더라도 진행은 계속.
echo "  기존 프로세스 정리 (stop.sh 위임)..."
bash "$REPO_ROOT/stop.sh" >/dev/null 2>&1 || true
echo ""

# 1. AI Server (FastAPI)
echo "[1/3] AI Server (FastAPI, port 8000)..."
cd "$REPO_ROOT/ai-server"
if [ ! -d .venv ]; then
  echo "  가상환경 생성 중..."
  python3 -m venv .venv
fi
source .venv/bin/activate
if [ "${SKIP_PIP_INSTALL:-0}" = "1" ]; then
  echo "  pip install 건너뜀 (SKIP_PIP_INSTALL=1)"
else
  echo "  Python requirements 확인..."
  pip install -q -r requirements.txt || {
    echo "  requirements 설치 실패. 자세히 보려면: cd ai-server && .venv/bin/pip install -r requirements.txt"
    exit 1
  }
fi

if { [ "${STT_PROVIDER:-whisper}" = "qwen3" ] || [ "${STT_PROVIDER:-whisper}" = "cohere" ]; } && [ -n "${QWEN_ASR_STREAMING_ENDPOINT:-}" ]; then
  QWEN_ASR_STREAMING_PORT="${QWEN_ASR_STREAMING_PORT:-7860}"
  ASR_STREAMING_BACKEND="${ASR_STREAMING_BACKEND:-${QWEN_ASR_STREAMING_BACKEND:-qwen3}}"
  if lsof -t -i:"$QWEN_ASR_STREAMING_PORT" >/dev/null 2>&1; then
    echo "  ASR streaming sidecar already running (port $QWEN_ASR_STREAMING_PORT)"
  else
    if [ "$ASR_STREAMING_BACKEND" = "cohere" ]; then
      COHERE_ASR_PY="${COHERE_ASR_PY:-$REPO_ROOT/experiments/cohere-asr/.venv/bin/python}"
      COHERE_ASR_SCRIPT="${COHERE_ASR_SCRIPT:-$REPO_ROOT/experiments/cohere-asr/cohere_asr_sidecar.py}"
      if [ ! -x "$COHERE_ASR_PY" ]; then
        echo "  Cohere-ASR 가상환경이 없습니다: $COHERE_ASR_PY"
        exit 1
      fi
      echo "  Cohere-ASR sidecar (port $QWEN_ASR_STREAMING_PORT)..."
      nohup setsid "$COHERE_ASR_PY" "$COHERE_ASR_SCRIPT" \
        --model "${COHERE_ASR_MODEL:-CohereLabs/cohere-transcribe-03-2026}" \
        --host 0.0.0.0 \
        --port "$QWEN_ASR_STREAMING_PORT" \
        --default-language "${QWEN_ASR_STREAMING_LANGUAGE:-Korean}" \
        --allowed-languages "${QWEN_ASR_STREAMING_ALLOWED_LANGUAGES:-Korean,English}" \
        --dtype "${COHERE_ASR_DTYPE:-bfloat16}" \
        --device-map "${COHERE_ASR_DEVICE_MAP:-cuda:0}" \
        --max-new-tokens "${COHERE_ASR_MAX_NEW_TOKENS:-256}" \
        </dev/null \
        > /tmp/remini-cohere-asr-streaming.log 2>&1 &
      echo "  Cohere-ASR PID: $! | log: /tmp/remini-cohere-asr-streaming.log"
    else
      if [ ! -x .venv/bin/qwen-asr-demo-streaming ]; then
        echo "  Qwen3-ASR streaming 패키지가 없습니다."
        echo "  설치: cd ai-server && .venv/bin/pip install -r requirements-qwen-asr.txt"
        exit 1
      fi
      echo "  Qwen3-ASR streaming sidecar (port $QWEN_ASR_STREAMING_PORT)..."
      nohup setsid .venv/bin/python scripts/qwen_asr_streaming_sidecar.py \
        --asr-model-path "${QWEN_ASR_MODEL:-Qwen/Qwen3-ASR-1.7B}" \
        --host 0.0.0.0 \
        --port "$QWEN_ASR_STREAMING_PORT" \
        --gpu-memory-utilization "${QWEN_ASR_STREAMING_GPU_MEMORY_UTILIZATION:-0.25}" \
        --chunk-size-sec "${QWEN_ASR_STREAMING_CHUNK_SEC:-0.5}" \
        --default-language "${QWEN_ASR_STREAMING_LANGUAGE:-Korean}" \
        --allowed-languages "${QWEN_ASR_STREAMING_ALLOWED_LANGUAGES:-Korean,English}" \
        </dev/null \
        > /tmp/remini-qwen-asr-streaming.log 2>&1 &
      echo "  Qwen3-ASR PID: $! | log: /tmp/remini-qwen-asr-streaming.log"
    fi
  fi
  wait_for_http "ASR sidecar" "http://127.0.0.1:$QWEN_ASR_STREAMING_PORT/" 180
fi

nohup setsid python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload \
  </dev/null \
  > /tmp/remini-ai-server.log 2>&1 &
echo "  PID: $! | log: /tmp/remini-ai-server.log"
deactivate

# 2. API Server (Express)
echo "[2/3] API Server (Express, port 5000)..."
cd "$REPO_ROOT/caregiver"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install 2>/dev/null
if [ -d artifacts/patient-web ]; then
  echo "  React patient UI 빌드 중..."
  pnpm --filter @workspace/patient-web build >/tmp/remini-patient-web-build.log 2>&1 || {
    echo "  patient-web build failed. log: /tmp/remini-patient-web-build.log"
    cat /tmp/remini-patient-web-build.log
    exit 1
  }
fi
cd artifacts/api-server
nohup setsid pnpm dev </dev/null > /tmp/remini-api-server.log 2>&1 &
echo "  PID: $! | log: /tmp/remini-api-server.log"

# 2.5 Fish-Speech API server (port 8080) — TTS_PROVIDER=fish 일 때만
if [ "${TTS_PROVIDER:-supertonic}" = "fish" ]; then
  if [ -x "$REPO_ROOT/fish-speech-server/start-fish.sh" ]; then
    echo "[2.5] Fish-Speech (port 8080)..."
    bash "$REPO_ROOT/fish-speech-server/start-fish.sh" || echo "  fish 시작 실패 (MMS 폴백)"
  fi
fi

# 3. Caregiver App (Expo Web)
echo "[3/3] Caregiver App (Expo Web, port 8082)..."
cd "$REPO_ROOT/caregiver/artifacts/caregiver-app"
nohup setsid bash -c 'EXPO_ROUTER_APP_ROOT=./app npx expo start --web --offline --port 8082' \
  </dev/null \
  > /tmp/remini-expo-web.log 2>&1 &
echo "  PID: $! | log: /tmp/remini-expo-web.log"

echo ""
echo "=========================================="
echo "  모든 서버 시작 완료!"
echo "=========================================="
echo ""
echo "  AI Server:      http://$SERVER_IP:8000"
echo "  API Server:     http://$SERVER_IP:5000"
echo "  Caregiver App:  http://$SERVER_IP:8082"
echo ""
echo "  폰 시연 (외부 터널 + QR) — 별도 실행: bash demo.sh"
echo "  종료: bash stop.sh"
echo "  상태: bash status.sh"
echo "=========================================="
