# Remini-APP 서버 시작 매뉴얼

> **주의: 이 문서의 실행 방법을 반드시 따라주세요. 임의로 host/port를 변경하지 마세요.**

## 환경 정보

- **서버 IP**: `<SERVER_IP>` (H200 서버)
- **API 서버 포트**: `5000`
- **Expo 웹앱 포트**: `8082`
- **패키지 매니저**: `pnpm` (npm/yarn 사용 금지)

## 시작 전 준비

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP
pnpm install
```

## 1. API 서버 (Express, 포트 5000)

### 시작

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP/artifacts/api-server
pnpm dev
```

### 백그라운드 실행

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP/artifacts/api-server
nohup pnpm dev > /tmp/api-server.log 2>&1 &
```

### 접속 확인

```bash
curl http://<SERVER_IP>:5000/api/health
```

### 환경변수

`.env` 파일은 프로젝트 루트(`Remini-APP/.env`)에 위치합니다.

| 변수 | 값 | 설명 |
|------|------|------|
| PORT | 5000 | API 서버 포트 |
| AI_SERVER_URL | http://localhost:8000 | dementia-llm AI 서버 |
| NEO4J_URI | (설정됨) | Neo4j 데이터베이스 |
| JWT_SECRET | (설정됨) | JWT 인증 |

## 2. Expo 보호자 웹앱 (포트 8082)

### LAN 개발 모드 (같은 네트워크에서 접속)

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP/artifacts/caregiver-app
EXPO_ROUTER_APP_ROOT=./app npx expo start --web --offline --port 8082
```

접속: `http://<SERVER_IP>:8082`

### 외부 접속 모드 (ngrok 터널 포함)

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP/artifacts/caregiver-app
EXPO_PUBLIC_DOMAIN=<ngrok-api-url> EXPO_ROUTER_APP_ROOT=./app npx expo start --web --tunnel --port 8082
```

`<ngrok-api-url>`은 API 서버의 ngrok URL (아래 ngrok 섹션 참고)

### 백그라운드 실행 (LAN 모드)

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP/artifacts/caregiver-app
nohup bash -c 'EXPO_ROUTER_APP_ROOT=./app npx expo start --web --offline --port 8082' > /tmp/expo-web.log 2>&1 &
```

## 3. ngrok 설정 (외부 접속 필요 시)

### API 서버 터널링

```bash
ngrok http 5000
```

### Expo 웹앱 + API 서버 동시 터널링

1. 먼저 API 서버를 ngrok으로 터널링:
```bash
ngrok http 5000
# 출력된 URL 복사 (예: https://xxxx.ngrok-free.dev)
```

2. Expo 웹앱을 터널 모드로 시작 (API ngrok URL 포함):
```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP/artifacts/caregiver-app
EXPO_PUBLIC_DOMAIN=https://xxxx.ngrok-free.dev EXPO_ROUTER_APP_ROOT=./app npx expo start --web --tunnel --port 8082
```

이렇게 하면 Expo의 내장 @expo/ngrok이 별도 터널을 생성합니다.

## 전체 서버 한번에 시작 (순서대로)

```bash
# 1. AI 서버 (dementia-llm)
cd ~/바탕화면/학부연구생종합설계프로젝트/dementia-llm
source .venv/bin/activate
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > /tmp/ai-server.log 2>&1 &

# 2. API 서버 (Remini-APP Express)
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP/artifacts/api-server
nohup pnpm dev > /tmp/api-server.log 2>&1 &

# 3. Expo 웹앱 (Remini-APP Caregiver)
cd ~/바탕화면/학부연구생종합설계프로젝트/Remini-APP/artifacts/caregiver-app
nohup bash -c 'EXPO_ROUTER_APP_ROOT=./app npx expo start --web --offline --port 8082' > /tmp/expo-web.log 2>&1 &
```

## 절대 하지 말 것

- `--host 127.0.0.1` 또는 `localhost`로 바인딩하지 마세요 (원격 접속 불가)
- `npm` 또는 `yarn`으로 패키지 설치/실행하지 마세요 (pnpm workspace 깨짐)
- `.env` 파일의 `AI_SERVER_URL`을 ngrok URL로 바꾸지 마세요 (같은 서버 내 통신은 localhost)

## 서버 종료

```bash
# 포트별 종료
kill $(lsof -t -i:5000)   # API 서버
kill $(lsof -t -i:8082)   # Expo 웹앱
kill $(lsof -t -i:8000)   # AI 서버 (dementia-llm)
```

## 연결 구조

```
[외부 브라우저/폰]
    │
    ├─ http://<SERVER_IP>:8082  (Expo 웹앱)
    │       │
    │       └─ API 호출 → http://<SERVER_IP>:5000/api/*
    │
    └─ 또는 ngrok URL로 접속 (외부 네트워크)

[서버 내부 통신]
Expo 웹앱 (:8082) → API 서버 (:5000) → AI 서버 (:8000)
                                ↔ (webhook)
```
