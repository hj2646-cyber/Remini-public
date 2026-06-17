# dementia-llm 서버 시작 매뉴얼

> **주의: 이 문서의 실행 방법을 반드시 따라주세요. 임의로 host/port를 변경하지 마세요.**

## 환경 정보

- **서버 IP**: `<SERVER_IP>` (H200 서버)
- **포트**: `8000`
- **바인딩**: `0.0.0.0` (원격 접속을 위해 반드시 0.0.0.0 유지)
- **접속 URL**: `http://<SERVER_IP>:8000`

## 서버 시작 방법

### 방법 1: 스크립트 사용 (권장)

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/dementia-llm
bash scripts/run_api_wsl.sh
```

이 스크립트가 자동으로 처리하는 것:
- `.env` 파일 로드
- 가상환경 생성 (없을 경우)
- pip 패키지 설치
- uvicorn 서버 시작 (host: 0.0.0.0, port: 8000)

### 방법 2: 수동 실행

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/dementia-llm
source .venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 방법 3: 백그라운드 실행

```bash
cd ~/바탕화면/학부연구생종합설계프로젝트/dementia-llm
source .venv/bin/activate
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > /tmp/ai-server.log 2>&1 &
```

## 절대 하지 말 것

- `--host 127.0.0.1` 또는 `--host localhost`로 실행하지 마세요. 원격 접속이 안 됩니다.
- `app/config.py`의 `host` 기본값을 `127.0.0.1`로 변경하지 마세요.
- `scripts/run_local.py`의 `--host` 기본값을 `127.0.0.1`로 변경하지 마세요.

## 서버 확인

```bash
# 포트 확인
ss -tlnp | grep 8000

# 정상이면 이렇게 나와야 함 (0.0.0.0:8000)
# LISTEN 0 2048 0.0.0.0:8000 0.0.0.0:*

# 헬스 체크
curl http://<SERVER_IP>:8000/
```

## 서버 종료

```bash
# PID 확인 후 종료
kill $(lsof -t -i:8000)
```

## 연결 구조

```
dementia-llm (AI서버, :8000)
    ↑
    │ AI_SERVER_URL=http://localhost:8000
    │
Remini-APP API서버 (:5000)
    ↑
    │ CAREGIVER_API_URL=http://localhost:5000/api
    │
dementia-llm (AI서버, :8000)  ← webhook 전송
```

같은 H200 서버 안에서 서로 통신하므로 서버 간 연결은 `localhost` 사용이 맞습니다.
외부 브라우저에서 접속할 때만 `<SERVER_IP>` IP를 사용합니다.
