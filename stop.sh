#!/usr/bin/env bash

echo "=========================================="
echo "  Remini - 서버 전체 종료"
echo "=========================================="

PORTS=(8000 7860 5000 8082 8081 8080)

# uvicorn --reload 가 spawn 한 multiprocessing 자식 / Expo metro / pnpm dev 등은
# 포트 점유 PID 만 죽여서는 정리가 안 되어 GPU 메모리 점유한 채 남는다.
# 정확히 Remini 경로에 매칭되는 패턴만 잡아 다른 프로젝트는 건드리지 않게 한다.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PATTERNS=(
  "uvicorn app.main:app"
  "${REPO_ROOT}/ai-server/.venv"
  "qwen-asr-demo-streaming"
  "qwen_asr_streaming_sidecar.py"
  "cohere_asr_sidecar.py"
  "VLLM::EngineCore"
  "${REPO_ROOT}/caregiver/artifacts/api-server"
  "${REPO_ROOT}/caregiver/artifacts/caregiver-app.*expo"
  "${REPO_ROOT}/fish-speech-server/tools/api_server.py"
)

kill_by_pattern() {
  local sig=$1
  local label=$2
  for pat in "${PATTERNS[@]}"; do
    local pids
    pids=$(pgrep -f "$pat" 2>/dev/null || true)
    if [ -n "$pids" ]; then
      echo "  [$label] $pat → $pids"
      kill -$sig $pids 2>/dev/null || true
    fi
  done
}

# 1) SIGTERM 포트 점유 PID
for port in "${PORTS[@]}"; do
  pids=$(lsof -t -iTCP:$port -sTCP:LISTEN 2>/dev/null || true)
  if [ -z "$pids" ]; then
    echo "  포트 $port - 실행 중 아님"
    continue
  fi
  echo "  포트 $port SIGTERM (PID: $pids)"
  kill $pids 2>/dev/null || true
done

# 2) graceful 대기
sleep 2

# 3) 그래도 안 죽었으면 SIGKILL
for port in "${PORTS[@]}"; do
  pids=$(lsof -t -iTCP:$port -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "  포트 $port SIGKILL (PID: $pids) — graceful 실패"
    kill -9 $pids 2>/dev/null || true
  fi
done

sleep 1

# 4) 잔여 자식/좀비 청소 (Remini 경로 한정)
echo ""
echo "  잔여 자식 프로세스 청소..."
kill_by_pattern TERM "TERM"
sleep 1
kill_by_pattern KILL "KILL"

# 5) 최종 확인
sleep 1
stuck=""
for port in "${PORTS[@]}"; do
  if lsof -t -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then
    stuck="$stuck $port"
  fi
done

# 패턴 잔여도 함께 보고
for pat in "${PATTERNS[@]}"; do
  if pgrep -f "$pat" >/dev/null 2>&1; then
    stuck="$stuck pattern:[$pat]"
  fi
done

if [ -n "$stuck" ]; then
  echo ""
  echo "  ⚠️  여전히 살아있음:$stuck"
  exit 1
fi

# 6) ngrok (환자 PWA 8000 외부 노출 + Expo tunnel 자체 ngrok agent)
pkill -f ngrok 2>/dev/null && echo "  ngrok 종료" || true

# 6.5) cloudflared (보호자 앱 5000 + PWA 8082 외부 노출)
pkill -f "cloudflared tunnel --url http://localhost:5000" 2>/dev/null && echo "  cloudflared 5000 종료" || true
pkill -f "cloudflared tunnel --url http://localhost:8082" 2>/dev/null && echo "  cloudflared 8082 종료" || true

# 7) ollama 모델 unload — ai-server 가 keep_alive=-1 로 박아둔 모델은
# ollama 데몬이 마지막 지시를 그대로 유지하므로 ai-server 죽여도 GPU 에 잔존.
# 학습/평가 작업이 GPU 메모리를 다시 쓸 수 있도록 명시적으로 회수한다.
if command -v ollama >/dev/null 2>&1; then
  echo ""
  echo "  ollama 모델 GPU unload..."
  ollama ps 2>/dev/null | tail -n +2 | awk '{print $1}' | while read -r m; do
    [ -z "$m" ] && continue
    ollama stop "$m" 2>/dev/null && echo "    stopped: $m" || true
  done
fi

echo ""
echo "모든 서버 종료 완료!"
