#!/usr/bin/env bash

SERVER_IP="<SERVER_IP>"

echo "=========================================="
echo "  Remini - 서버 상태 확인"
echo "=========================================="
echo ""

check_port() {
  local name=$1 port=$2 url=$3
  local pid=$(lsof -t -iTCP:$port -sTCP:LISTEN 2>/dev/null | head -1)
  if [ -n "$pid" ]; then
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "ERR")
    echo "  ✓ $name (port $port) - 실행 중 (PID: $pid, HTTP: $status)"
  else
    echo "  ✗ $name (port $port) - 중지됨"
  fi
}

check_port "AI Server"      8000 "http://$SERVER_IP:8000/"
check_port "STT-ASR"        7860 "http://$SERVER_IP:7860/"
check_port "API Server"     5000 "http://$SERVER_IP:5000/api/auth/me"
check_port "Caregiver App"  8082 "http://$SERVER_IP:8082/"
check_port "Fish-Speech"    8080 "http://$SERVER_IP:8080/v1/health"

echo ""

# ngrok
NGROK_PID=$(pgrep -f "ngrok" 2>/dev/null | head -1)
if [ -n "$NGROK_PID" ]; then
  TUNNEL_URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | python3 -c "import json,sys; [print(t['public_url'],'->',t['config']['addr']) for t in json.load(sys.stdin).get('tunnels',[])]" 2>/dev/null || echo "확인 불가")
  echo "  ✓ ngrok 실행 중: $TUNNEL_URL"
else
  echo "  ✗ ngrok - 중지됨"
fi

echo ""
echo "=========================================="
