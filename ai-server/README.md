# remeni-ai

치매 환자 대화 보조를 위한 로컬 MVP입니다. FastAPI 백엔드, 웹 UI, Ollama 기반 LLM, Whisper STT, 선택형 PostgreSQL + pgvector 검색을 포함합니다.

## 1. 다른 컴퓨터에서 먼저 설치할 것

필수
- Git
- Python 3.13
- Ollama

기능에 따라 추가
- Docker Desktop: PostgreSQL + pgvector를 사용할 때 필요
- ngrok: iPad Safari에서 카메라/마이크를 HTTPS로 연결할 때 필요

권장 확인
```powershell
git --version
py -3.13 --version
ollama --version
docker --version
ngrok version
```

## 2. 프로젝트 받기

```powershell
git clone https://github.com/hj2646-cyber/dementia-llm.git
cd dementia-llm
```

## 3. 환경 파일 만들기

```powershell
Copy-Item .env.example .env -Force
```

기본 모델은 `gemma4:31b`입니다. H200(80GB) 같은 고용량 GPU 기준이며, 새 PC 사양이 낮으면 `.env`에서 `OLLAMA_MODEL=gemma2:9b`(또는 `qwen3:8b`)로 바꿔도 됩니다.

## 4. Python 가상환경과 패키지 설치

```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 5. Ollama 모델 준비

`.env`와 같은 모델명을 받아 두는 것이 안전합니다.

기본 설정 그대로 쓸 때:
```powershell
ollama pull gemma4:31b
```

가벼운 모델로 바꿨다면:
```powershell
ollama pull gemma2:9b
```

Ollama 앱 또는 서버가 실행 중이어야 합니다.

## 6. 서버 실행

가장 쉬운 방법:
```powershell
.\start_remeni.bat
```

`bat` 없이 바로 실행하려면:
```powershell
py -3.13 scripts/run_local.py api
```

메인 화면까지 같이 열려면:
```powershell
py -3.13 scripts/run_local.py web
```

환자 화면까지 같이 열려면:
```powershell
py -3.13 scripts/run_local.py patient
```

보호자 음성복제 패키지까지 함께 설치하려면 처음 한 번:
```powershell
py -3.13 scripts/run_local.py web --with-voice-clone
```

로컬 PC에서 환자 화면을 바로 띄우려면:
```powershell
.\start_patient_local.bat
```

브라우저 주소창 없이 로컬 앱 창처럼 열려면:
```powershell
.\start_patient_desktop.bat
```

내 컴퓨터로 옮길 수 있는 로컬 실행 번들을 만들려면:
```powershell
.\build_windows_local_bundle.bat
```
생성 결과:
- `dist\remeni-ai-local\`
- `dist\remeni-ai-local.zip`

직접 실행:
```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

접속 주소
- 환자 화면: [http://127.0.0.1:8000](http://127.0.0.1:8000) (`/` 가 환자 UI 진입점)
- 관리자 화면: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
- Swagger 문서: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 7. PostgreSQL + pgvector 사용 시

벡터 검색을 쓰려면 Docker Desktop이 켜져 있어야 합니다.

```powershell
docker compose up -d
```

기본 접속 정보는 `.env.example`에 맞춰 아래처럼 설정되어 있습니다.
- DB: `dementia`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

벡터 DB가 없어도 앱은 실행되며, 그 경우 로컬 메모리 기반 단순 검색으로 동작합니다.

## 8. iPad 또는 다른 기기에서 접속

같은 Wi-Fi라면 PC의 LAN IP로 접속하면 됩니다.

예시
```text
http://192.168.x.x:8000
```

iPad Safari에서 카메라/마이크까지 쓰려면 HTTPS가 필요합니다.

```powershell
.\start_remeni_https.bat
```

또는 직접:
```powershell
ngrok http 8000
```

생성된 `https://...` 주소를 iPad에서 열면 됩니다.

## 9. 주요 환경변수

자주 확인할 값
- `LLM_PROVIDER=ollama`
- `OLLAMA_BASE_URL=http://127.0.0.1:11434`
- `OLLAMA_MODEL=gemma4:31b`
- `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/dementia`
- `WHISPER_MODEL=large-v3`
- `APP_TIMEZONE=Asia/Seoul`

TTS 관련 기본값도 `.env.example`에 포함되어 있습니다.
- `TTSFORGE_LANGUAGE_CODE=ko-KR`
- `TTSFORGE_VOICE_NAME=ko-KR-Standard-A`
- `TTSFORGE_AUDIO_FORMAT=mp3`

보호자 음성 복제용 옵션
- `TTS_PROVIDER=ttsforge` 또는 `coqui_xtts`
- `VOICE_CLONE_ENDPOINT=`: 비워두면 앱 안에서 `coqui-tts` 기반 로컬 복제를 사용
- `VOICE_CLONE_LANGUAGE_CODE=ko`
- `VOICE_CLONE_AUDIO_FORMAT=wav`
- `VOICE_CLONE_DEVICE=auto`
- `VOICE_CLONE_FALLBACK_TO_TTSFORGE=true`

## 10. 주요 API

- `POST /chat`: 일반 대화
- `POST /stt`: 음성 파일 STT
- `POST /stt-chat`: 음성 입력 후 대화 응답
- `POST /tts`: 텍스트를 음성으로 변환
- `GET /voice-profiles`: 등록된 보호자 음성 프로필 조회
- `POST /voice-profiles`: 보호자 샘플 음성 업로드
- `POST /voice-profiles/{profile_id}/activate`: 기본 보호자 목소리로 활성화
- `POST /proactive-event`: proactive 이벤트 입력
- `GET /conversations`: 대화 로그 조회
- `GET /conversations/summary`: 위험도 요약
- `GET /metrics`: 요청/에러/지연 메트릭
- `GET /health`: 서버 상태 확인

## 11. 새 PC에서 막힐 때 체크

- `py -3.13` 명령이 안 되면 Python 3.13이 설치되지 않았거나 PATH 설정이 안 된 상태입니다.
- Ollama 모델을 받지 않았으면 `/chat` 호출 시 응답 생성이 실패할 수 있습니다.
- Docker를 켜지 않았으면 pgvector는 비활성화되고 단순 검색으로만 동작합니다.
- iPad 카메라/마이크가 안 되면 HTTPS 주소로 접속했는지 먼저 확인하세요.
- `.env`가 없으면 `Copy-Item .env.example .env -Force`를 먼저 실행하세요.

## 12. 보호자 목소리로 읽어주기

메인 화면에서 보호자 음성 샘플을 여러 개 올리고 기본 프로필로 적용할 수 있습니다.

이제 실제 동작 방식은 다음과 같습니다.
- 보호자가 화면에 보이는 예시 문장 3개에서 8개 정도를 읽어 녹음합니다.
- 메인 화면의 `보호자 목소리 적용` 카드에서 파일들을 업로드합니다.
- `이 프로필 사용`을 누르면 이후 `/tts` 응답이 그 샘플 목소리로 생성됩니다.
- 복제 엔진이 실패하면 기본값으로 `TTSForge` 음성으로 자동 fallback 됩니다.

설치
```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-voice-clone.txt
```

`.env`에서 아래처럼 바꾸면 됩니다.
```text
TTS_PROVIDER=coqui_xtts
VOICE_CLONE_LANGUAGE_CODE=ko
VOICE_CLONE_DEVICE=auto
VOICE_CLONE_FALLBACK_TO_TTSFORGE=true
```

기본 복제 엔진
- 이 프로젝트는 `coqui-tts`의 `xtts_v2` 모델을 사용하도록 연결되어 있습니다.
- 첫 실행 때 모델 다운로드 때문에 시간이 조금 걸릴 수 있습니다.
- GPU가 있으면 자동으로 `cuda`, 없으면 `cpu`로 동작합니다.

권장 샘플
- 같은 사람 목소리로 5초에서 20초 정도 음성 3개에서 8개
- 주변 소음이 적고 발음이 또렷한 한국어
- 너무 짧은 감탄사보다 문장형 녹음
