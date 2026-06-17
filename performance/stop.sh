#!/usr/bin/env bash
# =====================================================================
# Remini 시연영상용 ai-server 종료 스크립트
# =====================================================================
set -e

cd "$(dirname "$0")"
ROOT="$(pwd)"
PID_FILE="$ROOT/logs/ai-server.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "[perf] PID 파일 없음. 떠있지 않은 듯."
  # fallback: 포트 8100 점유 프로세스 찾기
  if pgrep -f "uvicorn app.main:app .* --port 8100" >/dev/null; then
    echo "[perf] 포트 8100 점유 프로세스 발견 — 강제 종료"
    pkill -f "uvicorn app.main:app .* --port 8100" || true
  fi
  exit 0
fi

PID="$(cat "$PID_FILE")"
if kill -0 "$PID" 2>/dev/null; then
  echo "[perf] PID $PID 종료 중..."
  kill "$PID"
  sleep 1
  if kill -0 "$PID" 2>/dev/null; then
    echo "[perf] SIGTERM 무시 — SIGKILL"
    kill -9 "$PID" || true
  fi
  echo "[perf] 종료 완료"
else
  echo "[perf] PID $PID 이미 죽음"
fi
rm -f "$PID_FILE"
