#!/usr/bin/env bash
# =====================================================================
# Remini 시연영상용 ai-server 재시작 — config.yaml 변경 후 실행
# =====================================================================
set -e

cd "$(dirname "$0")"
bash stop.sh || true
sleep 1
bash start.sh
