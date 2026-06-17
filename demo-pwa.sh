#!/usr/bin/env bash
# 보호자 PWA 폰 시연 (잠금화면 푸시 알림) — 한 줄 실행.
#
#   ① 보호자 API 5000 의 /api/push/vapid-public-key 살아있는지 → 없으면 재시작
#   ② cloudflared 5000 (API 외부 노출) — demo.sh 와 동일 패턴, idempotent
#   ③ 보호자 웹앱 8082 죽이고 EXPO_PUBLIC_DOMAIN=<cf5000> 박은 채 재시작
#   ④ cloudflared 8082 (PWA 외부 노출) — 새로 띄움
#   ⑤ PWA URL 큰 QR + 아이폰 셋업 안내 출력
#
# 끝나면 stop.sh 로 깨끗하게 종료.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$REPO_ROOT/caregiver/artifacts/caregiver-app"
API_DIR="$REPO_ROOT/caregiver/artifacts/api-server"
CLOUDFLARED="$HOME/bin/cloudflared"
LOG_CF5000="/tmp/cloudflared-5000.log"
LOG_CF8082="/tmp/cloudflared-8082.log"
LOG_WEB="/tmp/remini-caregiver-web-pwa.log"
LOG_API="/tmp/remini-caregiver-api-pwa.log"

# ─────────────────────────────────────────────────────────────
# ① 보호자 API 5000 — push 라우트 반영 확인 (없으면 재시작)
# ─────────────────────────────────────────────────────────────
echo "[1/5] 보호자 API 5000 push 라우트 확인..."
if curl -sS -m 3 http://localhost:5000/api/push/vapid-public-key 2>/dev/null | grep -q "publicKey"; then
  echo "  → push 라우트 OK (재시작 불필요)"
else
  echo "  → 재시작 필요 (push 라우트 미반영)"
  pids=$(lsof -ti:5000 2>/dev/null || true)
  [ -n "$pids" ] && kill $pids 2>/dev/null && sleep 2 || true
  : > "$LOG_API"
  ( cd "$API_DIR" && nohup pnpm dev > "$LOG_API" 2>&1 < /dev/null & )
  echo -n "  → 5000 준비 대기"
  for _ in $(seq 1 30); do
    if curl -sS -m 2 http://localhost:5000/api/push/vapid-public-key 2>/dev/null | grep -q "publicKey"; then
      echo " ✓"
      break
    fi
    echo -n "."
    sleep 1
  done
  if ! curl -sS -m 2 http://localhost:5000/api/push/vapid-public-key 2>/dev/null | grep -q "publicKey"; then
    echo ""
    echo "  ❌ 보호자 API 가 push 라우트 응답 안 함. 로그 마지막 30줄:"
    tail -30 "$LOG_API"
    exit 1
  fi
fi

# ─────────────────────────────────────────────────────────────
# ② cloudflared 5000 (API 외부 HTTPS)
# ─────────────────────────────────────────────────────────────
echo "[2/5] cloudflared 5000 (API 터널)..."
if pgrep -f "cloudflared tunnel --url http://localhost:5000" >/dev/null; then
  echo "  → 이미 실행 중"
else
  if [ ! -x "$CLOUDFLARED" ]; then
    echo "  ❌ cloudflared 바이너리 없음 ($CLOUDFLARED). demo.sh 한 번 먼저 실행해서 받아주세요."
    exit 1
  fi
  : > "$LOG_CF5000"
  nohup "$CLOUDFLARED" tunnel --url http://localhost:5000 > "$LOG_CF5000" 2>&1 < /dev/null &
fi

CF5000=""
for _ in $(seq 1 30); do
  CF5000=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_CF5000" 2>/dev/null | head -1 || true)
  [ -n "$CF5000" ] && break
  sleep 1
done
if [ -z "$CF5000" ]; then
  echo "  ❌ cloudflared 5000 URL 못 받음. 로그 마지막 20줄:"
  tail -20 "$LOG_CF5000"
  exit 1
fi
echo "  → API: $CF5000"

# ─────────────────────────────────────────────────────────────
# ③ 보호자 웹앱 8082 — EXPO_PUBLIC_DOMAIN 박은 채 재시작
# ─────────────────────────────────────────────────────────────
echo "[3/5] 보호자 웹앱 8082 재시작 (EXPO_PUBLIC_DOMAIN 박기)..."
pids=$(lsof -ti:8082 2>/dev/null || true)
[ -n "$pids" ] && kill $pids 2>/dev/null || true
pkill -f "expo start --web .* --port 8082" 2>/dev/null || true
sleep 2

: > "$LOG_WEB"
( cd "$APP_DIR" && nohup env \
    EXPO_PUBLIC_DOMAIN="$CF5000" EXPO_ROUTER_APP_ROOT=./app \
    npx expo start --web --offline --port 8082 \
    > "$LOG_WEB" 2>&1 < /dev/null & )

echo -n "  → 8082 준비 대기"
for _ in $(seq 1 60); do
  if curl -sS -m 2 http://localhost:8082/ >/dev/null 2>&1; then
    echo " ✓"
    break
  fi
  echo -n "."
  sleep 1
done

# ─────────────────────────────────────────────────────────────
# ④ cloudflared 8082 (PWA 외부 HTTPS)
# ─────────────────────────────────────────────────────────────
echo "[4/5] cloudflared 8082 (PWA 터널)..."
if pgrep -f "cloudflared tunnel --url http://localhost:8082" >/dev/null; then
  echo "  → 이미 실행 중 (이전 URL 폐기, 새 URL 재추출)"
  pkill -f "cloudflared tunnel --url http://localhost:8082" 2>/dev/null || true
  sleep 2
fi
: > "$LOG_CF8082"
nohup "$CLOUDFLARED" tunnel --url http://localhost:8082 > "$LOG_CF8082" 2>&1 < /dev/null &

CF8082=""
for _ in $(seq 1 30); do
  CF8082=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_CF8082" 2>/dev/null | head -1 || true)
  [ -n "$CF8082" ] && break
  sleep 1
done
if [ -z "$CF8082" ]; then
  echo "  ❌ cloudflared 8082 URL 못 받음. 로그 마지막 20줄:"
  tail -20 "$LOG_CF8082"
  exit 1
fi
echo "  → PWA: $CF8082"

# ─────────────────────────────────────────────────────────────
# ⑤ QR + 셋업 안내
# ─────────────────────────────────────────────────────────────
echo ""
echo "=========================================="
echo "  📱 보호자 PWA 폰 시연 — 잠금화면 푸시"
echo "=========================================="
echo ""
echo "  PWA URL : $CF8082"
echo "  API     : $CF5000"
echo ""
( cd "$APP_DIR" && node -e "require('qrcode-terminal').generate('$CF8082', {small: true})" ) 2>/dev/null \
  || echo "  (QR 렌더 실패 — 위 PWA URL 직접 입력)"
echo ""
echo "  아이폰 (iOS 16.4+) 셋업:"
echo "  ① Safari 카메라로 위 QR 스캔 → 보호자 웹앱 접속"
echo "  ② 로그인 → 환자 선택"
echo "  ③ 공유 버튼(□↑) → '홈 화면에 추가' → 추가"
echo "  ④ ⚠️  홈 아이콘으로 다시 열기 (Safari 탭 아님!)"
echo "  ⑤ 알림 탭 → '잠금화면 푸시 알림 받기' → 권한 허용"
echo "  ⑥ '테스트' 누르면 즉시 푸시 도착해야 함"
echo "  ⑦ 환자 웹에서 '다 끝내고 싶어' 같은 위험 발화"
echo "     → 폰 잠금 상태로 잠금화면 + 진동 푸시 도착"
echo ""
echo "  ⚠️  cloudflared 8082 URL 은 끊기면 새로 발급됨."
echo "      시연 중 끊기지 않게 두고, 끊겼다면 폰 PWA 아이콘 지우고"
echo "      이 스크립트 다시 실행해서 새 URL 로 재추가."
echo ""
echo "  종료: bash stop.sh"
echo ""
echo "=========================================="
