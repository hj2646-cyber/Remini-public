#!/usr/bin/env bash
# 보호자 앱 폰 시연 — cloudflared 5000 + Expo tunnel 8081 + ASCII QR.
# idempotent: 이미 떠있으면 그대로 재사용. MobaXterm 터미널 친화 (PNG 안 띄움).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$REPO_ROOT/caregiver/artifacts/caregiver-app"
CLOUDFLARED="$HOME/bin/cloudflared"
LOG_CF="/tmp/cloudflared-5000.log"
LOG_EXPO="/tmp/remini-expo-tunnel.log"

# 1) cloudflared 5000
if pgrep -f "cloudflared tunnel --url http://localhost:5000" >/dev/null; then
  echo "[demo] cloudflared 5000 → 이미 실행 중"
else
  if [ ! -x "$CLOUDFLARED" ]; then
    echo "[demo] cloudflared 바이너리 다운 중..."
    mkdir -p "$HOME/bin"
    wget -q -O "$CLOUDFLARED" \
      https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
    chmod +x "$CLOUDFLARED"
  fi
  echo "[demo] cloudflared 5000 시작..."
  : > "$LOG_CF"
  nohup "$CLOUDFLARED" tunnel --url http://localhost:5000 > "$LOG_CF" 2>&1 < /dev/null &
fi

# cloudflared URL 추출
TUNNEL_URL=""
for _ in $(seq 1 30); do
  TUNNEL_URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_CF" 2>/dev/null | head -1 || true)
  [ -n "$TUNNEL_URL" ] && break
  sleep 1
done
if [ -z "$TUNNEL_URL" ]; then
  echo "  ❌ cloudflared URL 못 받음. 로그 마지막 20줄:"
  tail -20 "$LOG_CF"
  exit 1
fi
echo "  → $TUNNEL_URL"

# 2) Expo tunnel 8081
if pgrep -f "expo start --tunnel --port 8081" >/dev/null; then
  echo "[demo] Expo tunnel 8081 → 이미 실행 중"
else
  echo "[demo] Expo tunnel 8081 시작 (EXPO_PUBLIC_DOMAIN=$TUNNEL_URL)..."
  : > "$LOG_EXPO"
  ( cd "$APP_DIR" && nohup env \
      EXPO_PUBLIC_DOMAIN="$TUNNEL_URL" EXPO_ROUTER_APP_ROOT=./app \
      pnpm exec expo start --tunnel --port 8081 \
      > "$LOG_EXPO" 2>&1 < /dev/null & )
fi

# Tunnel ready 대기
echo "[demo] Expo tunnel 준비 대기 (최대 90s)..."
for _ in $(seq 1 90); do
  grep -q "Tunnel ready" "$LOG_EXPO" 2>/dev/null && break
  sleep 1
done

# Expo URL 추출 (manifest API)
EXPO_URL=""
for _ in $(seq 1 20); do
  EXPO_URL=$(curl -sS -m 5 \
      -H "expo-platform: ios" -H "expo-protocol-version: 0" \
      http://localhost:8081/ 2>/dev/null \
    | python3 -c "
import sys, json, re
try:
    m = json.load(sys.stdin)
    h = re.search(r'https?://([^/:]+)', m['launchAsset']['url']).group(1)
    print(f'exp://{h}')
except Exception:
    pass" 2>/dev/null || true)
  [ -n "$EXPO_URL" ] && break
  sleep 2
done
if [ -z "$EXPO_URL" ]; then
  echo "  ❌ Expo URL 못 받음. 로그 마지막 20줄:"
  tail -20 "$LOG_EXPO"
  exit 1
fi

# 3) ASCII QR + 안내
echo ""
echo "=========================================="
echo "  📱 보호자 앱 폰 접속"
echo "=========================================="
echo ""
echo "  Expo URL : $EXPO_URL"
echo "  API 터널 : $TUNNEL_URL"
echo ""
( cd "$APP_DIR" && node -e "require('qrcode-terminal').generate('$EXPO_URL', {small: true})" ) 2>/dev/null \
  || echo "  (QR 렌더 실패 — 위 URL 직접 입력)"
echo ""
echo "  → Expo Go 앱 'Scan QR code' 로 스캔"
echo "  → 또는 'Enter URL' 에 직접 입력 (첫 글자 0=zero)"
echo ""
echo "=========================================="
