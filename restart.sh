#!/usr/bin/env bash
# Remini 전체 서버 재시작 스크립트
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[restart] stopping..."
bash stop.sh || true

sleep 1

echo "[restart] starting..."
bash start.sh

# 각 포트가 LISTEN 상태가 될 때까지 폴링 (AI Server는 모델 로딩에 30~60초 걸림)
wait_for_port() {
  local name=$1 port=$2 timeout=$3
  local elapsed=0
  while [ $elapsed -lt $timeout ]; do
    if lsof -t -i:$port >/dev/null 2>&1; then
      echo "[restart] $name (port $port) ready (${elapsed}s)"
      return 0
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  echo "[restart] $name (port $port) NOT ready after ${timeout}s"
  return 1
}

echo "[restart] waiting for services to come up..."
wait_for_port "AI Server"     8000 90 || true
wait_for_port "Qwen3-ASR"     7860 90 || true
wait_for_port "API Server"    5000 30 || true
wait_for_port "Caregiver App" 8082 60 || true

echo "[restart] done."
bash status.sh || true
