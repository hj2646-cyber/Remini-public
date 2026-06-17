#!/usr/bin/env bash
# =====================================================================
# Remini 시연영상용 ai-server 시작 스크립트 (포트 8100)
# =====================================================================
# 사용법:
#   bash performance/start.sh
#
# 본 시스템 ai-server (port 8000) 와 동시 실행 가능. 충돌 X.
# OLLAMA / Neo4j / 임베딩 등 인프라는 본 시스템과 공유 (별도 인스턴스 X).
# =====================================================================
set -e

cd "$(dirname "$0")"
ROOT="$(pwd)"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/ai-server.log"
PID_FILE="$LOG_DIR/ai-server.pid"

# 이미 떠 있으면 stop 부터
if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "[perf] 이미 떠 있음 (PID $(cat "$PID_FILE")). bash stop.sh 먼저 실행하세요."
  exit 1
fi

# ── 1) config.yaml → 환경변수 (OLLAMA_MODEL, PERF_*, PORT) + ui-config.js 생성
VENV_PY="$ROOT/ai-server/.venv/bin/python"
if [ ! -x "$VENV_PY" ]; then
  echo "[perf] ERROR: venv python 없음: $VENV_PY"
  echo "[perf] 본 시스템 ai-server/.venv 가 살아있는지 확인하세요."
  exit 1
fi

# load_preset.py 의 export 문을 현재 셸에 적용
eval "$("$VENV_PY" "$ROOT/load_preset.py")"

# 포트 강제 (load_preset 에서도 export 하지만 안전망)
export PORT=8100
export HOST=0.0.0.0
export APP_ENV=demo

# ── 2) ai-server 백그라운드 실행
cd "$ROOT/ai-server"
nohup "$VENV_PY" -m uvicorn app.main:app \
  --host 0.0.0.0 --port 8100 \
  --log-level info \
  > "$LOG_FILE" 2>&1 &

PID=$!
echo $PID > "$PID_FILE"
echo "[perf] ai-server 시작됨 (PID $PID, port 8100)"
echo "[perf] preset: $PERF_PRESET_ID ($PERF_PRESET_NAME)"
echo "[perf] OLLAMA_MODEL: $OLLAMA_MODEL"
echo "[perf] log: $LOG_FILE"
echo ""
echo "[perf] 환자 화면: http://<SERVER_IP>:8100/static/patient.html"
echo "[perf] 본 시스템 (8000) 과 동시 사용 OK"
