# Remini

> **LLM 기반 치매 환자 비약물 치료(회상요법) 대화 AI + 보호자 모니터링 시스템**
> 부산대학교 산업공학과 종합설계프로젝트 · 팀 **MemorIE**

---

## 소개

**Remini**는 경도~중등도 치매 환자를 위한 **비약물 치료(회상요법, Reminiscence Therapy)** 를 AI 대화로 지원하고, 환자의 상태와 위험 신호를 **보호자가 원격으로 모니터링**할 수 있게 하는 시스템입니다.

치매 환자에게는 약물 못지않게 *정서적 안정·인지 자극·사회적 상호작용*이 중요합니다. 회상요법은 환자의 **옛 기억(생애 기억)을 함께 떠올리며 대화**하는 임상적으로 검증된 비약물 중재법입니다. 하지만 회상요법을 잘 진행하려면 환자 개개인의 생애사를 알고, 적절한 화법으로, 꾸준히 곁에서 대화해 줄 사람이 필요합니다 — 현실의 돌봄 환경에서는 충족되기 어렵습니다.

Remini는 이 간극을 메우기 위해 두 축으로 구성됩니다.

1. **환자용 AI 대화 파트너** — 음성으로 자연스럽게 대화하며, 환자의 **개인 생애기억 지식그래프(Knowledge Graph)** 를 근거로 회상을 유도하고, 일상 대화와 회상 대화의 균형을 맞춥니다.
2. **보호자용 모니터링** — 대화 중 **위험 발화(자해·우울·응급 신호 등)** 가 감지되면 보호자의 휴대폰으로 **실시간 푸시 알림**을 보내고, 대화 요약과 상태를 확인할 수 있게 합니다.

### 설계 원칙

- 🔒 **모든 AI 모델은 100% 오픈소스 로컬 모델** — STT·LLM·TTS·임베딩 전부 자체 호스팅. 환자의 민감한 대화가 외부 클라우드 API로 나가지 않습니다. (Neo4j는 데이터 저장소)
- 🧠 **개인화** — 환자마다 생애기억 지식그래프를 구축해, 그 사람만의 가족·고향·직업·추억에 기반한 회상 대화를 합니다.
- 🩺 **임상 근거 기반** — 회상요법 임상 도서·가이드라인을 참고해 화법·금기·단계별 자극 전략을 설계했습니다.
- 🗣️ **고령자 친화 음성 대화** — 한국어 노인 발화에 맞춘 STT 파인튜닝, 자연스러운 한국어 TTS, 발화 종료 감지로 버튼 없이 말로 대화합니다.

---

## 시스템 구성

```
        🎙️ 환자 음성
            │
            ▼
   ┌─────────────────────────────────────────────────────────┐
   │                  AI 서버 (FastAPI · :8000)                │
   │                                                           │
   │   STT ──▶ 입력 분류 ──▶ 지식그래프 RAG ──▶ LLM ──▶ TTS    │
   │  (음성→텍스트)  (의도/위험)   (개인 생애기억)  (회상 대화)  (음성)│
   │                                  │                        │
   │                          위험 발화 감지                    │
   └──────────────────────────────────┼────────────────────────┘
                                       │ webhook
                                       ▼
   ┌──────────────────────────┐   ┌──────────────────────────┐
   │  API 서버 (Express·:5000) │──▶│  보호자 앱 (Expo·:8082)   │
   │  대화 요약 · 알림 · 인증   │   │  + PWA 폰 푸시 알림        │
   └──────────────────────────┘   └──────────────────────────┘
```

| 서비스 | 포트 | 기술 | 역할 |
|--------|------|------|------|
| AI 서버 | 8000 | FastAPI + Uvicorn | STT·LLM·TTS·지식그래프 RAG·회상 대화 정책·환자용 웹 UI |
| API 서버 | 5000 | Express (Node.js) | 보호자 인증·대화 요약·위험 알림 라우팅 |
| 보호자 앱 | 8082 | Expo (React Native) | 환자 모니터링·알림 수신 (웹/PWA) |

---

## 주요 기능

### 🗣️ 환자 대화 (AI 서버)
- **음성 실시간 대화** — STT(음성 인식) → LLM 응답 → TTS(음성 합성)의 풀 보이스 파이프라인
- **발화 종료 감지(EOU)** — 환자가 말을 마쳤는지 감지해 버튼 없이 자연스럽게 턴을 주고받음
- **한국어 노인 발화 특화 STT** — 노인 자유대화 코퍼스로 STT를 LoRA 파인튜닝해 오인식·환각을 줄임
- **자연스러운 한국어 TTS** — 따뜻한 음색의 한국어 음성 합성 (다중 백엔드 지원)
- **실시간 STT 보정** — 소형 LLM이 대화 맥락으로 오인식 단어를 즉석 교정

### 🧠 회상요법 대화 엔진
- **개인 생애기억 지식그래프 RAG** — 환자별 가족·고향·직업·취미·추억을 그래프로 구축하고(Neo4j), 대화 중 관련 기억을 검색해 근거로 활용 (**GraphRAG**)
- **회상 유도 ↔ 일상 대화 균형(PUSH→PULL)** — 환자가 옛 기억을 꺼낼 때 따라가고, 평소엔 일상 잡담·맞장구로 자연스럽게 대화
- **회상 사진 자동 유도** — 추억을 자극하는 사진을 일정 간격으로 제시해 대화의 매개로 활용
- **임상 화법 주입(CAG)** — 회상요법 임상 도서에서 정제한 화법·단계별 자극 전략·금기를 시스템 프롬프트로 주입
- **상태 기반 대화 정책** — 라포 형성 → 탐색 → 심화로 이어지는 대화 단계 관리
- **실시간 환경 정보** — 날씨·시간 등 실제 맥락을 주입해 LLM 환각(엉뚱한 날짜·날씨 언급)을 억제

### 🛡️ 안전 · 보호자 모니터링
- **위험 발화 감지** — 자해·우울·응급 신호 등을 탐지하고, 위기 시 자살예방 상담(1393) 안내
- **보호자 폰 푸시 알림** — 위험 발화 감지 시 보호자 휴대폰 잠금화면으로 즉시 푸시 (Web Push · PWA, iOS 16.4+/Android/데스크톱)
- **대화 기반 모니터링** — 보호자 앱에서 환자 대화 요약·상태·회상 사진 확인

### 🔬 학습 · 평가 인프라 (연구용)
- **DSLM 도메인 파인튜닝** — 회상요법 도메인에 맞춘 LoRA 단계별 학습 파이프라인 (도메인 페어 + 지식그래프 인지 + 임상 도서 반영 + 노인 발화 STT)
- **정량 평가** — GraphRAG vs VectorRAG 검색 품질 비교(Phase 1), LLM-as-Judge 기반 응답 품질 평가(Phase 2), 레이어별 기여도 측정(Ablation) 등. 상세 결과는 [`docs/presentation/`](docs/presentation/) 참고
- **검수 파이프라인** — 다중 검수자 라벨링 + 검수자 간 일치도(Fleiss κ) 측정

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| **LLM** | Ollama (회상요법 도메인 한국어 LoRA 파인튜닝 모델, DSLM) |
| **STT** | Qwen3-ASR (LoRA 파인튜닝) · faster-whisper |
| **TTS** | Supertonic · MMS · Fish-Speech (다중 백엔드) |
| **임베딩 / RAG** | 로컬 문장 임베딩 + Neo4j 지식그래프 (GraphRAG) |
| **발화 종료 감지** | LiveKit turn-detector |
| **AI 서버** | Python · FastAPI · Uvicorn |
| **API 서버** | Node.js · Express · JWT |
| **보호자 앱 / 환자 웹** | React · Expo (React Native) · Capacitor (PWA) |
| **알림** | Web Push (VAPID) |
| **파인튜닝** | Unsloth · PEFT(LoRA) · PyTorch · GGUF |

> 모든 추론 모델은 HuggingFace 등에서 받아 **로컬에서 자체 호스팅**합니다. 외부 클라우드 추론 API는 사용하지 않습니다. (단, `experiments/` 의 일부 평가/베이스라인 비교는 예외 — 자세한 정책은 `experiments/README.md` 참고)

---

## 사용 방법

### 사전 요구사항

- **Python** 3.10+ (AI 서버) · **Node.js** 18+ & **pnpm** (보호자 앱/API)
- **Ollama** — 로컬 LLM 추론 ([ollama.com](https://ollama.com))
- **Neo4j** — 지식그래프 저장소 (로컬 Neo4j Desktop 또는 서버)
- (권장) NVIDIA GPU — STT/TTS/LLM 로컬 추론 가속
- HuggingFace 계정 — 일부 모델 다운로드용

### 1. 내려받기

```bash
git clone https://github.com/hj2646-cyber/Remini-public.git
cd Remini-public
```

### 2. 환경변수 설정

프로젝트 **루트의 `.env` 하나**에 모든 서비스가 공유하는 설정을 둡니다. (이 저장소에는 비밀값이 제거되어 있으니 **본인 값을 직접 채워야** 합니다.)

```bash
cp ai-server/.env.example .env   # 예시를 복사한 뒤 편집
```

`.env`에 채워야 하는 주요 항목:

```dotenv
# LLM (Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=<사용할_모델명>

# 지식그래프 (Neo4j)
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<your_password>

# 보호자 알림 (Web Push) — 직접 생성한 VAPID 키
VAPID_PUBLIC_KEY=<your_key>
VAPID_PRIVATE_KEY=<your_key>

# 보호자 API
JWT_SECRET=<your_secret>

# (선택) 실시간 환경 정보
OPENWEATHER_API_KEY=<your_key>
```

> 서버 IP는 코드/문서에서 `<SERVER_IP>` / `<CLIENT_IP>` 플레이스홀더로 표기되어 있습니다. 자신의 환경에 맞게 바꿔 주세요. (로컬이면 `localhost`)

### 3. 의존성 설치

```bash
# AI 서버 (Python 가상환경)
cd ai-server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cd ..

# 보호자 API + 앱 (pnpm 사용)
cd caregiver
pnpm install
cd ..
```

### 4. 실행

루트의 헬퍼 스크립트로 전체 서비스를 한 번에 띄울 수 있습니다.

```bash
bash start.sh     # 전체 서비스 기동
bash status.sh    # 상태 확인
bash restart.sh   # 재시작
bash stop.sh      # 정지
```

### 5. 접속

| 화면 | 주소 |
|------|------|
| 환자용 대화 웹 UI | `http://<SERVER_IP>:8000` |
| 보호자 앱 (웹/PWA) | `http://<SERVER_IP>:8082` |
| 보호자 API | `http://<SERVER_IP>:5000` |

---

## 프로젝트 구조

```
Remini/
├── ai-server/            # 본 시스템 — FastAPI (STT·LLM·TTS·KG RAG·회상 대화, 환자 웹 UI)
│   └── app/
│       ├── conversation/ # 대화 루프·에이전트·상태 관리
│       └── services/     # STT·TTS·LLM·지식그래프·분류기·위험감지·웹훅 등
├── caregiver/            # 보호자 측
│   └── artifacts/
│       ├── api-server/   # Express API (인증·알림)
│       ├── caregiver-app/# Expo 보호자 앱
│       └── patient-web/  # 환자용 웹 프론트엔드
├── finetune/             # DSLM LoRA 학습 파이프라인 (산출물 → 본 시스템)
├── experiments/          # 평가 (GraphRAG/VectorRAG, LLM-as-Judge, Ablation)
├── docs/                 # 설계·진행 문서 + 발표/논문 소스(docs/presentation)
├── performance/          # 시연용 구성
└── start.sh / stop.sh / status.sh / restart.sh
```

---

## ⚠️ 데이터 및 개인정보 고지

이 저장소는 **공개용 스냅샷**으로, 다음을 명시합니다.

- **등장하는 모든 인물·페르소나·대화는 연구용 합성(가상) 데이터입니다.** `김영자`·`P001`·`어르신`(P999) 등 모든 환자 페르소나는 평가·시연을 위해 **인위적으로 생성한 가공 인물**이며, **실제 환자나 실제 개인의 정보가 아닙니다.** 실제 환자 데이터는 포함되어 있지 않습니다.
- **비밀정보 제외** — API 키·DB 비밀번호·JWT 시크릿·VAPID 키 등은 모두 제거되었습니다. 실행하려면 직접 발급한 값을 `.env`에 채워야 합니다.
- **내부 인프라 정보 일반화** — 서버 IP 등은 `<SERVER_IP>` / `<CLIENT_IP>` 플레이스홀더로 대체했습니다.
- **저작권 자료 제외** — 회상요법·치매 관련 임상 도서/논문 원문(PDF 등)은 저작권상 포함하지 않았습니다. 본 저장소에는 해당 자료를 *참고하여 작성한 요약·정책 문서*만 포함됩니다.

---

## 라이선스

이 프로젝트의 **소스 코드**는 **MIT License** 하에 배포됩니다. 자세한 내용은 [`LICENSE`](LICENSE) 파일을 참고하세요.

```
MIT License — Copyright (c) 2026 MemorIE Team, Pusan National University
```

> **참고:** 본 시스템이 사용·참조하는 일부 외부 모델·데이터셋(STT/TTS/LLM 가중치, 코퍼스 등)은 각자의 라이선스를 따르며, 그중 일부는 **비상업(연구용)** 라이선스입니다. 가중치·데이터 자체는 이 저장소에 포함되어 있지 않습니다. 상업적 이용 시 각 구성요소의 라이선스를 반드시 개별 확인하세요.

---

<p align="center">
  <sub>부산대학교 산업공학과 종합설계프로젝트 · 팀 MemorIE</sub>
</p>
