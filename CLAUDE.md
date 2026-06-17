# Remini - 치매 환자 AI 대화 및 보호자 모니터링 시스템

## 프로젝트 구조

```
Remini/
├── .env                 # 통합 환경변수 (모든 서비스 공유)
├── start.sh / stop.sh / status.sh / restart.sh
├── ai-server/           # FastAPI (Python, 환자용 웹 UI 포함)
├── caregiver/
│   ├── artifacts/api-server/      # Express API
│   └── artifacts/caregiver-app/   # Expo 보호자 앱
├── experiments/         # 실험설계 v5 검증 (Phase 1/2)
├── finetune/            # DSLM LoRA 학습 (산출물 → 본 시스템)
└── competition/         # 경진대회 산출물 (졸업과제와 분리, 자세히는 competition/README.md)
```

## 서버 정보

| 서비스 | 포트 | 기술 |
|--------|------|------|
| AI 서버 | 8000 | FastAPI + Uvicorn |
| API 서버 | 5000 | Express |
| 보호자 웹앱 | 8082 | Expo Web |

접속: http://<SERVER_IP>:{포트}

## Environment
- H200 서버 IP: <SERVER_IP> (원격)
- 브라우저 접속: <CLIENT_IP>
- 반드시 IP 기반 URL (localhost 금지)
- sudo는 MobaXterm 터미널에서만

## 핵심 규칙
- 서버 바인딩 `0.0.0.0` (127.0.0.1 금지)
- `.env`는 프로젝트 루트 하나만
- caregiver는 `pnpm`만 (npm/yarn 금지)
- AI 서버 가상환경: `ai-server/.venv/`
- **한글 포함 CSV 는 무조건 UTF-8 BOM (`utf-8-sig`)** — Excel 한글 깨짐 방지
  - Python `open()` / `pd.to_csv()` 항상 `encoding="utf-8-sig"`
  - Write tool 로 만들면 BOM 안 박힘 → 만든 후 `b'\xef\xbb\xbf' + data` 로 별도 박기
  - 검증: `head -c 3 file.csv | xxd` → `ef bb bf` 면 OK
- **모든 AI 모델은 오픈소스 로컬 모델만** (STT/TTS/LLM/임베딩 전부)
  - 금지: OpenAI/Anthropic/Gemini/Clova/Azure 등 클라우드 API
  - 허용: HuggingFace 다운로드 가능한 모델, 로컬 Ollama, 자체 호스팅
  - Neo4j AuraDB는 예외 (데이터 저장소라 AI 모델 아님)
  - **`experiments/` 폴더는 예외** — 베이스라인 비교(Gemini)·LLM-as-Judge(GPT-4o / **Groq Llama 3.3 70B**)·시나리오 자동 생성(Gemini) 한정. **Groq 는 RAGAS LLM-as-Judge 무료 대안** (Llama 3.3 70B, 학술 표준 동급). 본 시스템(`ai-server/`, `caregiver/`)에는 절대 침투 금지. 자세한 정책: `experiments/README.md`

## 행동 규칙 (에이전트용)
- **새 세션 시작 시 무조건 `docs/presentation/NEXT_SESSION.md` 먼저 읽기** — 현재 상태·대기 작업·다음 액션 한눈에. 이전 세션에서 끊긴 작업 즉시 이어가기.
- 파일 삭제/커밋은 반드시 허락 받고
- 서버 재시작 전 `bash status.sh`로 상태 확인
- 모르면 추측하지 말고 질문할 것
- 한글 파일명(`대화로그_*.txt`) 건드릴 땐 경고
- 긴 작업은 `docs/PROGRESS.md`에 기록, 새 세션에서 이어가기
- **세션 종료 전 `NEXT_SESSION.md` 갱신** — 진행 상태 + 대기 작업 + 다음 액션을 다음 세션이 즉시 이해할 수 있게
- 기능 1개 완료 → 마이크로 커밋 → `docs/FEATURES.md` 체크
- **경진대회 작업물은 `competition/` 폴더로 분리** — 졸업과제(`docs/presentation/`)와 동일 주제지만 제출처·심사 기준 다름
  - 경진대회 제출서류·신청서·기획서 → `competition/submissions/`
  - 경진대회용 PPT/슬라이드 → `competition/presentation/` (졸업 발표 deck 과 별개)
  - 일정·체크리스트·심사기준 메모 → `competition/planning/`
  - 졸업과제 결과 인용 시 **경로 참조만**, 사본 복사 금지
  - 어떤 파일이 경진대회용인지 졸업과제용인지 애매하면 **사용자에게 질문**
  - 자세한 규칙: `competition/README.md`
- **모든 실험 시도·결과·실패·교훈은 `docs/presentation/` 에 누적 기록** (캡스톤 발표·논문 일차 소스)
  - 새 시도 시작 → `docs/presentation/EXPERIMENTS_LOG.md` 시간순 추가
  - 수치 결과 → `docs/presentation/RESULTS.md` 표 갱신
  - Negative result → `docs/presentation/FAILURES.md` (What/Why/Lesson/Recovery)
  - 정제 메시지 → `docs/presentation/LESSONS.md`
  - **새 방법론·기법 도입** → `docs/presentation/METHODOLOGY.md` 5요소 (정의/근거 논문/우리 적용/Why 적합/발표 contribution) 즉시 추가
  - raw 로그 → `docs/presentation/logs/`, 비교 파일 → `docs/presentation/evidence/`
  - 자세한 가이드: `docs/presentation/README.md`
- **각 fine-tune stage 마다 before/after 평가 무조건** (룰)
  - 학습 시작 전: `before_<stage>.txt` 응답 generate (10_compare.py)
  - 학습 후: `after_<stage>.txt` 응답 generate (같은 시나리오)
  - safety eval: `safety_<stage>.txt` (13_safety_eval.py, kmhas classifier)
  - 비교: before vs after (각 stage 누적), 차이 명확히 RESULTS.md 표 갱신
  - 단계별 plan + 데이터 매핑: `docs/presentation/FINETUNE_BRANCHES.md`

## 인수인계 파일
- `docs/PROGRESS.md` — 진행 일지 (오늘 한 일, 멈춘 지점, 다음 할 일)
- `docs/FEATURES.md` — 기능 체크리스트
- `docs/presentation/` — 발표·논문 소스 (실험 일지, 결과, 실패, 교훈, 슬라이드 outline)

---

## 코딩 가이드라인 (Karpathy 4원칙)

> 출처: https://github.com/forrestchang/andrej-karpathy-skills (Karpathy 의 LLM 코딩 비판 기반).
> 이 섹션은 위 저장소의 `CLAUDE.md` 를 그대로 채택. 위 “행동 규칙” 과 충돌하면 행동 규칙(프로젝트 한정 규칙) 이 우선.
> **Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
