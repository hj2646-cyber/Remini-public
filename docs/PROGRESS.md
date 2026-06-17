# Remini 진행 일지

세션 간 인수인계용. 각 세션 끝에 업데이트하고 마이크로 커밋. 최신이 위로.

---

## 2026-05-23 (TTS 백엔드 Supertonic → Fish-Speech S2 Pro 교체)

### 오늘 한 일
- **Fish-Speech S2 Pro 자체 호스팅 구축** — `fish-speech-server/` 디렉토리 신설, git main (v2.0.0), `uv sync --extra cu128` Python 3.12 venv 별도. `fishaudio/s2-pro` gated 모델 HF 토큰으로 다운 (codec.pth 1.8G + safetensors 8.6G).
- **api_server 검증** — `tools/api_server.py --mode tts --device cuda --half --listen 0.0.0.0:8080` 부팅 OK, GPU 22.5GB, 한국어 합성 (`POST /v1/tts` msgpack) 동작.
- **ai-server 통합 (provider switch 패턴)** — `app/services/fish_tts.py` (msgpack HTTP client), `tts.py` 분기 추가, `config.py` `fish_tts_*` 설정, `.env` `TTS_PROVIDER=fish` + `FISH_TTS_ENDPOINT`, `requirements.txt` `msgpack` 추가 후 ai-server venv 에 설치.
- **라이프사이클 통합** — `fish-speech-server/start-fish.sh` helper, root `start.sh` 의 `[2.5]` 단계가 `TTS_PROVIDER=fish` 일 때만 helper 호출, `stop.sh` PATTERNS + PORTS 8080 추가, `status.sh` Fish-Speech 행 추가.
- **사용자 청취 평가** — Supertonic vs S2 Pro 한국어 동일 텍스트 합성 비교, S2 Pro 압승 → 메인 채택.

### 핵심 결정
- v1.5 (CC-BY-NC-SA) 임시 채택 → 사용자 catch (S2 명시) → **v2 main + s2-pro 정정**. 모델·코드·deps 모두 v2 로 마이그레이션.
- 내장 화자 없음 (Qwen3 sohee 같은 named speaker X) → seed 고정 (`FISH_TTS_SEED`) 으로 일관 음색 확보 옵션 제공.
- 라이선스 = Fish Audio Research License (비상업 한정). 경진대회 상금·상업 배포 시점에는 Supertonic 으로 fallback 정책 (METHODOLOGY 21).

### 문서 갱신
- FEATURES.md TTS 라인 (Supertonic → Fish-Speech S2 Pro)
- METHODOLOGY.md `## 21` 본문 + 종합 메시지 #21
- EXPERIMENTS_LOG.md 2026-05-23 row

### 사용자 다음 액션
1. **HF 토큰 revoke** (https://huggingface.co/settings/tokens) — 채팅 노출됨
2. `bash stop.sh && bash start.sh` 로 ai-server + fish-speech-server 동시 부팅 (start.sh 가 `TTS_PROVIDER=fish` 감지하여 :8080 자동 띄움)
3. 환자 UI 에서 실제 대화 검증
4. v1.5 weights (`fish-speech-server/checkpoints/fish-speech-1.5/`, 약 2GB) 정리 권유 — 안 쓰면 삭제 가능. 사용자 허락 받고 진행

---

## 2026-05-14 (Phase 2 H2 LLM-as-Judge 전체 완료)

### 오늘 한 일
- **시나리오 정제**: `11_phase2_make_scenarios.py:56` 한국어 조사 자동 처리 (배우자이/과, 떡볶이을, 냄새을, 전립선비대이 등 제거) → `phase2.csv` 재생성 (40 시나리오 × 30턴, LLM 미관여 결정적 생성, DSLM/Gemini 동일 입력 보장).
- **Gemini 호출 안정화**: `12_phase2_run.py:43` SDK 끊김 → REST API + `thinkingBudget=0` + `finishReason` 명시 핸들링 (MAX_TOKENS/SAFETY/PROHIBITED_CONTENT).
- **Pilot judge 검증** (H2-C1-01): gpt-5.4 호출·JSON 파싱·카운터밸런싱 검증 → DSLM 4.41 vs Gemini 3.64, pref 3:0.
- **Phase 2 전체 응답 생성**: 40 시나리오 × DSLM/Gemini = 80 응답 (48.5분, 평균 37s). Gemini 503 high demand 2건 (H2-C3-01, H2-C6-02) 자동 회복 (`--resume --max-retries 8 --sleep 2`).
- **Phase 2 전체 judge**: 40 × 3 rep = 120 호출, 에러·파싱실패 0, 27.4분, 708,805 token.
- **통계**: `14_phase2_survey_stats.py` 실행 → 영역별 paired t / Wilcoxon / Cohen's dz / Cronbach's α / binomial preference test.

### 핵심 결과
- 13항목 + 3영역 모두 Bonferroni α=0.0167 통과
- 전체 Δ DSLM−Gemini = **+0.70** (5점 척도), Cohen's dz = **2.16** (매우 큰 효과)
- 선호: DSLM **113** / Gemini 7 / Tie 0, binomial p = **4.77e-26**
- 39/40 시나리오에서 DSLM 우세, 시나리오 단위 3:0 압승 36/40
- Q별 강점: Q10 응급(+1.41), Q13 민감주제(+1.40), Q8 진단회피(+1.36), Q2 정서지지(+1.09)
- **Q별 약점 (negative finding)**: Q12 KG 사실 정확성 DSLM 2.76 vs Gemini 3.98, **Δ −1.22** → F11 신설

### 문서 갱신
- `docs/presentation/RESULTS.md` — Phase 2 섹션 placeholder → 전체 수치 + Q별/카테고리별 표
- `docs/presentation/EXPERIMENTS_LOG.md` — 시간순 row 8건 추가 (시나리오 정제~H2 verdict)
- `docs/presentation/FAILURES.md` — **F11 신설** (Q12 KG 사실성 trade-off honest negative finding)
- `docs/presentation/H2_LLM_AS_JUDGE_SURVEY_PPT_SUMMARY.md` — §10 "실행 결과" 추가 (한 슬라이드 박스용 핵심 수치)
- `docs/presentation/NEXT_SESSION.md` — 헤더 + 대기 항목 갱신
- `docs/presentation/evidence/phase2_h2_survey_{stats,area_summary,scores_long,preferences}_2026-05-14.{md,csv}` — 4 evidence snapshot 복사

### 멈춘 지점 / 다음 액션
- 발표·논문 narrative 에 **"H2 13/13 항목 입증 + 단 1개 trade-off (Q12) 정직 보고"** 흐름 박을지 결정
- (선택) Phase 2 전문가 보조 검증 — 블라인드 5~7명 설문 (Krippendorff's α). 시나리오 풀: `phase2_responses.jsonl` 에서 sampling, H2-C5-05 anti-trend 1개 포함 권장
- (선택) Q12 복구 v2 mini distill — KG-grounding 손실 강화 또는 inference-time KG verification (F11 recovery 옵션)

---

## 2026-05-13 (PWA Web Push — 보호자 폰 잠금화면 위험 발화 알림)

### 오늘 한 일
- **결정**: iOS 만 사용 가능 + Apple Developer Program $99/년 회피 → EAS dev build 대신 **PWA Web Push** 채택. iOS 16.4+ (2023.3~) 부터 standalone PWA 의 Web Push 정식 지원.
- **백엔드 (`caregiver/artifacts/api-server/`)**:
  - `web-push@^3` 의존성 추가 (pnpm), `@types/web-push` devDep.
  - `src/web-push.ts` — VAPID 초기화 + `sendPushToPatient(patientId, payload)` 헬퍼. Neo4j `(:Patient)-[:HAS_PUSH_SUBSCRIPTION]->(:PushSubscription)` 조회 → web-push fan-out → 만료된 endpoint (404/410) 자동 cleanup.
  - `src/routes/push.ts` — 4 라우트: `GET /push/vapid-public-key` / `POST /push/subscribe` / `POST /push/unsubscribe` / `POST /push/test`. patientId 는 `id` 또는 `aiUserId` 둘 다 매칭.
  - `src/routes/alerts.ts` — alert 노드 저장 후 `sendPushToPatient(rawId, { title, body: message, data: { type:"alert", level, alertId } })` fire-and-forget. AI 서버 `risk_level=danger` webhook → 자동 푸시 발사.
- **VAPID 키 1회 생성** (`web-push.generateVAPIDKeys`) → `.env` 영구 저장 (PUBLIC/PRIVATE/SUBJECT). 평생 사용.
- **프론트엔드 (`caregiver/artifacts/caregiver-app/`)**:
  - `public/manifest.webmanifest` — name="Remini 보호자", display=standalone, theme_color=#1f2937, icons 192/512/maskable.
  - `public/sw.js` — push 이벤트 → showNotification (warning level 은 requireInteraction + vibrate), notificationclick → 기존 창 focus 또는 openWindow.
  - `public/images/{icon-192,icon-512,apple-touch-icon}.png` — ImageMagick `convert` 로 `assets/images/icon.png` (1024x1024) resize.
  - `app/+html.tsx` — Expo Router web root template. `<link rel="manifest">`, `<link rel="apple-touch-icon">`, `<meta name="apple-mobile-web-app-capable" content="yes">` (iOS standalone + web push 활성화 트리거).
  - `hooks/usePushSubscription.ts` — SW 자동 등록 + `requestPermission` (user click 안에서) + VAPID public key 서버에서 fetch + `pushManager.subscribe({userVisibleOnly:true})` + 서버 등록. standalone 모드 감지 (`matchMedia('(display-mode: standalone)')` + `navigator.standalone`).
  - `components/PushNotificationCard.tsx` — alerts 탭 헤더 카드. 상태별 분기: 미지원/Native → 숨김 / iOS Safari 비-standalone → "홈 화면에 추가 안내" / denied → "권한 거부됨, 설정에서 허용" / 미구독 → "잠금화면 푸시 알림 받기" / 구독됨 → "테스트" + "끄기".
  - `server/serve.js` MIME 추가: `.webmanifest` → `application/manifest+json`.
- **타입체크 통과**: 보호자 API + 보호자 앱 (mockup-sandbox 는 기존 React 19 ref 타입 이슈, 무관).

### 사용자 액션 (시연 검증)
1. 보호자 API 5000 재시작 — web-push 의존성/라우트 새로 추가됨. AI 서버는 재시작 불필요 (webhook URL 그대로).
2. 보호자 웹앱 8082 + cloudflared HTTPS 터널 (web push 는 HTTPS 필수).
3. iPhone Safari → cloudflared URL → 로그인 → 환자 선택 → 공유 → "홈 화면에 추가" → 추가된 홈 아이콘으로 다시 열기 (standalone 모드).
4. 알림 탭 → "잠금화면 푸시 알림 받기" → 권한 허용 → "테스트" 누르면 즉시 도착 확인.
5. 환자 웹에서 위험 발화 ("다 끝내고 싶어" 등) → 폰 잠금 상태에서 잠금화면 알림 + 진동 확인.

### 다음 액션 (선택)
- 검증 후 시연 영상 녹화 → `docs/presentation/evidence/` 저장.
- 기존 시연 자동화 (`demo.sh`) 에 보호자 웹앱 cloudflared 라인 추가 옵션.
- 진짜 네이티브 앱 필요 시 EAS iOS dev build (Apple Dev Program $99/년 + 1~2일 검수) 추가 — PWA 와 병행 가능.

---

## 2026-05-11 (보호자 앱 폰 시연 자동화 — cloudflared + Expo tunnel)

### 오늘 한 일
- 보호자 앱 외부 폰 (LTE) 접속 인프라 통합:
  - **문제 진단**: `start.sh`가 `--web --offline`만 띄움 → Expo Go용 Metro 번들러 없음. 폰이 붙을 dev 서버 자체가 없었음.
  - **API 호출 경로**: `caregiver-app/constants/api.ts:17-20`에서 `EXPO_PUBLIC_DOMAIN` 미설정 시 `Constants.expoConfig.hostUri` 기반 폴백 → tunnel 모드면 `xxx.exp.direct:5000`로 시도해서 외부에서 5000 못 뚫어 깨짐.
  - **ngrok-free 1터널 제약 우회**: 환자 PWA용 ngrok 8000 이미 점유 → 5000용 두 번째 터널은 별도 도구 필요. **cloudflared (Cloudflare Quick Tunnel)** 채택 — 무료·무제한·계정 불필요·HTTPS 자동.
- 신규 `demo.sh` (idempotent 헬퍼):
  1. `cloudflared tunnel --url http://localhost:5000` 백그라운드 띄움 + URL 추출
  2. `EXPO_PUBLIC_DOMAIN=<cloudflared-url>` + `expo start --tunnel --port 8081` 백그라운드
  3. Metro manifest API에서 `exp://...exp.direct` URL 추출 → `qrcode-terminal` ASCII QR (small) + URL 출력
  - 이미 떠있으면 재사용 (pgrep 가드). MobaXterm 친화 (PNG 안 띄움).
- 4개 운영 스크립트 통합:
  - `start.sh` — `[3/3]` → `[3/4]`, `[4/4]`로 `bash demo.sh` 동기 호출 추가
  - `stop.sh` — `PORTS`에 `8081` 추가, `pkill -f "cloudflared tunnel --url http://localhost:5000"` 추가
  - `restart.sh` — `wait_for_port "Phone tunnel" 8081 90` 추가
  - `demo.sh` — 신규 (위)
- `cloudflared` 바이너리 `~/bin/cloudflared` 다운 (sudo 불필요).
- 검증: 사용자 폰에서 Expo Go QR 스캔 → 보호자 앱 정상 진입 확인 ✅.

### 알아둘 점
- cloudflared / Expo tunnel **URL은 매 시작마다 바뀜** → 매 시연마다 새 QR 스캔 필요 (재사용 불가).
- `start.sh`가 `demo.sh` 동기 호출이라 시작 시 `[4/4]`에서 1~2분 멈춰 보임 (Expo "Tunnel ready" 대기). 정상.
- `status.sh`는 안 건드림 (요청 외).

### 다음 할 일 (사용자)
- [ ] 시연 끝나고 `bash stop.sh` 했을 때 cloudflared까지 정상 정리되는지 한 번 확인
- [ ] (선택) `status.sh`에도 phone tunnel/cloudflared 상태 표시 추가하고 싶으면 요청

---

## 2026-05-09 (환자 화면 색감 v2 — 2-레이어 정책 + 가독성·라이트모드 정리)

### 오늘 한 일 (v2 갱신)
- **2-레이어 색감 정책으로 재정의** (사용자 결정: "배경색 중요, 자비스는 별로 안 중요"):
  - **레이어 1 (배경 ~70%)**: 난색 임상 근거 유지 (김형희·최외선 2010)
  - **레이어 2 (동적 AI 시각 요소: orb, wave, 글로우)**: 노랑 배경 보색 한색 (파랑·청록·초록·보라). 노인 망막 yellowing(노란 색소 침착) 보상 — Boyce 2003, Ishihara & Boyce 1995 인용
- **JARVIS orb 한색 매핑** (`jarvis-particle-orb.tsx`):
  - idle 파랑 #1976D2 / listening 청록 #00897B / thinking 진한 보라 #5E35B1 / speaking 초록 #388E3C / reassuring 짙은 보라 #6A1B9A
- **Visualizer wave** (`patient-visualizer.js`, `agent-audio-visualizer-aura.tsx`): 4 라인 모두 한색 (파랑·청록·진한 보라·초록)
- **Orb drop-shadow 글로우**: `rgba(25, 118, 210, 0.36~0.40)` (파란 글로우)
- **가독성 강화** (시작/관리/목소리/자막 글자 안 보이는 문제 수정):
  - `--ink #4e342e` → `#3e2723` (매우 진한 브라운, WCAG AA)
  - `--ink-soft` 알파 0.72 → 0.88
  - 모든 패널 배경 거의 불투명 `#fffdf5` 또는 `--panel-bg 0.97`
  - input placeholder 알파 0.42 → 0.55
  - 글자 weight 700 → 800 (start-title, admin-title 등)
  - voice-picker 13px → 14px bold + 그림자
- **라이트/다크 토글 기능 완전 삭제**:
  - `App.tsx` theme state, useEffect, localStorage, 토글 버튼 UI 모두 제거
  - `index.css` `[data-theme="light"]` `[data-theme="dark"]` 분기 + `.theme-toggle` 스타일 통째로 제거
  - `JarvisParticleOrb` `theme` prop, `PatientOrbTheme` 타입, `STATE_STYLE_DARK` 제거 → 단일 `STATE_STYLE`
- **METHODOLOGY 18번 재기술** — 단일 색감 정렬 → "Two-Layer Color Policy" (시각 면적·역할별 색감 분리)
- **메모리 룰 갱신** — `feedback_patient_ui_color_palette.md` 2-레이어 정책으로 재작성

### 다음 할 일 (사용자)
- [ ] `bash restart.sh` (ai-server 재시작) → 환자 화면에서 색감 확인
- [ ] 노랑 배경 + 한색 orb 의 시연 임팩트 사용자 확인

---

## 2026-05-09 (환자 메인 화면 색감 — 색채심리 임상 근거 기반 전면 교체)

### 오늘 한 일
- `docs/KCI_FI001501022.pdf` 정독 — 김형희·최외선 (2010), *색채경험을 통한 집단미술치료가 치매노인의 인지와 정서에 미치는 영향* (미술치료연구 17(6))
  - 핵심 발견: 후기 단계 노랑 50%↑ + 파스텔 난색 (살구·분홍·주황) 사용 = 정서 안정·인지 향상과 직접 연관. 검정·갈색·진한 보라/파랑·무채색 = 우울 표출 매개.
  - 보강 인용: Birren 1985/1995, Suenaga 1998, 하마모토·이토 2005 — 난색 = 기쁨/행복 연상.
- **환자 메인 화면 컬러 토큰 전면 교체** (보호자 앱은 그대로):
  - `ai-server/web/patient.css` — `:root` 변수, body 배경 (검정 `#000` → 크림 노랑 그라디언트), face/eye 청록 → 다크 브라운, glow 시안 → 노랑/살구
  - `ai-server/web/patient.html` — theme-color, voice-picker 인라인 스타일 라이트 톤
  - `ai-server/web/patient-visualizer.js` — wave LINE_COLORS cyan/mint/violet → 노랑/주황/산호/살구
  - `ai-server/web/patient-react/index.html` — PWA theme-color `#A7C7E7` → `#FFD54F`, status-bar `default`
  - `caregiver/artifacts/patient-web/src/index.css` — :root 라이트 default + 다크 폴백 분기 추가
  - `caregiver/artifacts/patient-web/src/App.tsx` — default theme `"dark"` → `"light"` (localStorage 폴백 보존)
  - `caregiver/artifacts/patient-web/src/components/agents-ui/jarvis-particle-orb.tsx` — STATE_STYLE_DARK/LIGHT 둘 다 노랑·주황·산호 난색 그라디언트로 재매핑
  - `caregiver/artifacts/patient-web/src/components/agents-ui/agent-audio-visualizer-aura.tsx` — DEFAULT_COLOR + LINE_COLORS 난색
  - `caregiver/artifacts/patient-web/index.html` — theme-color, status-bar
- `docs/presentation/METHODOLOGY.md` 18번째 항목 추가 — *Color Psychology Driven UI Palette* 5요소 (정의/근거/적용/Why/contribution) + 종합 메시지 갱신

### 컬러 토큰 핵심
```
--bg-a #fff7e0  (크림 노랑, 주조 ~50%)
--bg-b #ffefd5  (살구 파스텔)
--bg-c #ffe4c4  (비스크)
--accent-yellow #ffd54f  --accent-coral #ffab91  --accent-peach #ffcc80
--ink #4e342e  (다크 브라운, 검정 X)
```

JARVIS orb state 매핑: idle 노랑 → listening 살구 → thinking 진한 주황 → speaking 산호 분홍 → reassuring 살구.

### 멈춘 지점
- 소스 수정 완료, **빌드 미실행** — `caregiver/artifacts/patient-web` 의 React 산출물(`ai-server/web/patient-react/assets/index-*.css|js`)은 이전 cyan 톤 그대로. 빌드 돌려야 환자 React 화면에 새 색감 반영.

### 다음 할 일
- [ ] `cd caregiver/artifacts/patient-web && pnpm build` 실행 → `ai-server/web/patient-react/assets/` 갱신 (사용자 직접)
- [ ] `bash restart.sh` (재시작 후 환자 화면에서 색감 확인)
- [ ] 시연 직전: 색감이 시연 컨셉(JARVIS) 과 충돌 안 되는지 사용자 확인
- [ ] (선택) caregiver-app 의 환자 회상 사진 카드 frame 도 같은 난색 팔레트 적용 — 보호자 앱이라 보류

---

## 2026-05-08 (회상 사진 시스템 v3 — ASK 상태 머신)

### 오늘 한 일 (v3 추가)
- 토픽 5턴 진행 후 AI 가 자동으로 "다른 사진 더 볼까요? 아니면 다른 이야기 나눌까요?" 질문하는 ASK 상태 추가
- 환자 응답 분기:
  - 명시적 STOP 키워드 ("아니"·"괜찮"·"이제 됐어"·"다음에"·"피곤" 등) → 토픽 종료, 일상 대화로
  - 그 외 응답 ("더"·"응"·"그래" 등) → 즉시 새 랜덤 사진 트리거
- HARD_DECLINE 신호 ("싫어"·"치워"·"재미 없" 등) → ASK 단계 무시, 즉시 종료
- STOP/HARD_DECLINE 후 cooldown — 7턴 동안 자동 트리거 X
- ASK 시 같은 사진 image_url 재전송 → 환자 UI 25초 timer reset (사진 사라짐 방지)
- ReminiscencePhotoItem 모델에 `mode` 필드 (start | ask)

---

## 2026-05-08 (회상요법 사진 자동 유도 시스템 — 단순화 v2)

### 오늘 한 일
- **v1**: 96 토픽 한글 폴더 + 인덱스 + 계절 sampling 가중치 시스템 → over-engineered. 사용자 reject ("계절별로 나뉘는 거 아닌데, 그냥 사진 보여주고 회상 유도하는 방법")
- **v2 (단순화)**: 폴더 1개 (`ai-server/data/reminiscence_photos/`) — 사용자가 사진 드롭만 하면 됨. 파일명이 토픽 제목.
  - 96 토픽 폴더 + 인덱스 + init script 모두 제거
  - 서비스 rewrite: `ReminiscencePhotoService` — 폴더 평면 스캔, random sampling, 최근 8개 제외
  - 트리거: 첫 3턴 후, 이후 5턴마다, 토픽 최대 6턴 진행 후 종료
  - 거부 신호 감지 ("그만"·"다른 얘기" 등) → 즉시 토픽 종료
  - LLM context 주입 (책 4단계 패턴 가이드)
- **모델 단순화**: `ReminiscencePhotoItem` — title·filename·image_url·intro_question (계절/카테고리/트라우마 메타 제거)
- **main.py 통합**: 텍스트 chat + 음성 chat (stt-chat SSE) 두 경로 모두 트리거 + `/static/reminiscence` static mount (한글 파일명 URL 인코딩)
- **환자 UI**: `web/patient.js` — `reminiscence_photo` field 처리 (memory_photo 와 같은 카드 자리)

### 다음 할 일 (사용자)
- [ ] `ai-server/data/reminiscence_photos/` 폴더에 책 사진 드롭 (.jpg/.png/.webp 등)
- [ ] `bash restart.sh` (ai-server 재시작 → 폴더 자동 재스캔)
- [ ] 환자 화면에서 대화 → 5턴마다 자동 사진 트리거 작동 확인

### 다음 할 일 (코드)
- [ ] React 빌드 환자 UI (`web/patient-react/`) 도 `reminiscence_photo` 처리 추가 (현재는 vanilla `patient.js` 만)
- [ ] (옵션) 4단계 진행 자동 추적 (현재는 LLM 자연 진행)
- [ ] (옵션) ablation 평가: reminiscence trigger on/off 응답 비교

### 교훈
- 사용자 요청 "그냥 그 책 사진 보여주고 회상 유도하는 방법" 을 처음에 너무 풍부하게 해석 → 96 토픽 카탈로그 / 계절 sampling / 트라우마 가중치 등 over-engineered.
- 단순함이 우선. 사용자가 사진 드롭하면 끝나야 함. 메타·인덱스·카테고리 다 부담.
- 이런 패턴 메모리에 기록할 가치 있음 (feedback 메모리).

---

## 2026-05-08 (『기억여행』 4권 심층 정제 + 96 주제 통합)

### 오늘 한 일
- 봄·여름·가을·겨울 OCR 11,342줄 전수 읽고 96 주제(8 카테고리 × 12, 4계절) 추출
- 정제판 생성: `finetune/data/v2/book_extracts/05_memory_journey_4seasons.txt` (96 주제 표제·카테고리·대표 질문/활동 + 표준 질문 패턴 + 임상 활용 룰 7개)
- `docs/wiki/06_회상요법_책.md` 신규 섹션 5 추가: 4단계 점진 자극 + 표준 질문 패턴 + 계절별 토픽 표 + 임상 활용 룰 → ai-server SYSTEM_PROMPT 자동 주입
- `BOOK_REFERENCES.txt` + `CATEGORIES.md` 4계절 96 주제 매핑 + 계절 동기화 sampling 룰 + 트라우마 토픽 안전 룰 추가
- `EXPERIMENTS_LOG.md` 2026-05-08 엔트리 + `NEXT_SESSION.md` 갱신

### 다음 할 일
- [ ] `bash restart.sh` (사용자) — wiki 06 신규 섹션 5 prefill 적용
- [ ] v2 generation 시 4계절 토픽 sampling 통합 (16 스크립트 — 페르소나 + 현재 계절 → 토픽)
- [ ] (검증) 같은 환자 발화에 4계절 토픽 매핑 유무 ablation

---

## 2026-05-08 (전문가 블라인드 평가 — DSLM/Base/Gems 3축 비교 구축)

### 오늘 한 일
- **전문가 평가 설계 정리** — `docs/전문가 평가용_설문조사.docx` 14항목 정독
  - A. 상호작용 4 / B. 임상 4 / C. 안전·윤리 6
  - #4 답변 속도·음색은 텍스트 로그로 평가 불가 → 데모 영상 별도 (실평가 13항목)
- **DSLM v1 50턴 산출** (`expert_eval_dslm_P001.md`, 99발화) — `remini-stage25-book:latest` + ai-server full system. 회피 응답 3회 발생 → 원인 추적
- **버그 발견·수정** (`online_tools.py`):
  - 처음 진단 (오답): "무릎/손/전원일기 = 의료 단서"
  - 실제 원인: `_ONLINE_HINTS` 의 "**요즘**" 단어 매치 → DuckDuckGo 분기 → "온라인에서 바로 확인되는 결과를 찾지 못했어요" fallback. 회상 LLM 호출 자체가 안 됨
  - 사용자 정정: 단어 룰베이스 매치로 LLM 우회하는 흐름 자체가 잘못. 시간/날짜는 유지하되 검색 분기는 제거
  - 적용: `online_tools.py` 의 `_search_duckduckgo` 분기 + `_ONLINE_HINTS` + `_extract_query` 다 삭제 (시간/날짜만 유지). `config.py` 의 `online_search_enabled`, `.env` 의 `ONLINE_SEARCH_ENABLED` 도 제거
  - 향후 정식 해결안: 분류기 LLM (qwen2.5:3b) 확장 — `info_query` intent 추가해 정보 질의(시간/날씨/뉴스)는 tool, 회상은 LLM 분기
- **DSLM v2 30턴 산출** (`expert_eval_dslm_P001_v2.md`, 60발화) — 수정 반영, 회피 0회 ✅
- **base 모델 ablation 30턴 산출** (`expert_eval_base_P001.md`, 60발화) — `gemma4:31b` (fine-tune 미적용) + ai-server full system 동일. fine-tune 단독 효과 측정용. .env 일시 교체 후 복원
- **Gems 비교군 패키지** (`docs/presentation/evidence/gems_eval/`) — Google AI Studio Gems 셋업 가이드 + Instructions 본문 (SYSTEM_PROMPT + P001 KG) + Knowledge wiki 합본 (88KB). 사용자가 직접 Gemini 2.5 Pro 로 환자 역할 30턴 진행 예정

### 멈춘 지점
- DSLM v2 (자연 흐름 30턴) 검토 결과 — **설문지 14항목 다 자연 발생 못 함**. 특히 안전·윤리 항목 (#10 응급 / #11 가드레일 / #14 약물 오정보 / #13 민감 주제 화제 전환) 자연 회상 흐름에서 트리거 X
- 새 평가 구성 plan: 환자 발화 30턴을 **블록 구조 [안전10 + 위험5 + 안전10 + 위험5]** 로 의도 배치 → 14항목 강제 커버
  - 안전 블록: 회상요법 자연 흐름 — #1, 2, 5, 6, 9, 12 자극
  - 위험 블록: 의료/약물/응급/망상/자살암시 — #3, 7, 8, 10, 11, 13, 14 자극
- **DSLM 만 새 구성으로 다시 30턴 산출 예정** (사용자 결정)

### 다음 할 일
- [ ] **DSLM 30턴 새 산출** — 안전 10 + 위험 5 + 안전 10 + 위험 5 블록 구조. 14항목 매핑 사용자 확인 후 호출
- [ ] (사용자) Gems 30턴 직접 산출 → `expert_eval_gems_P001.md` 저장
- [ ] 세 로그 모이면 모델명 마스킹 + 순서 무작위 → 전문가 블라인드 패키지 (PDF/인쇄)
- [ ] (장기) 분류기 LLM 확장 — `info_query` intent 추가해 정보 질의 vs 회상 분기. 룰베이스 단어 매치 fallback 폐기

---

## 2026-05-07 (회상요법 임상 도서 10권 RAG 통합)

### 오늘 한 일
- **사용자가 `docs/wiki/_raw/` 에 회상요법 임상 도서 10권 OCR PDF 업로드** (총 415MB)
  - 요시다 가츠아키 『치매 진행을 늦추는 대화의 기술』, 일본 회상요법학회 『회상법과 회상요법』, 카이소호 라이브 라브 연구회 『회상치료의 이론과 실제』, Pati Bielak-Smith 『치매가 인생의 끝은 아니니까』, 리사 제노바 『기억의 뇌과학』, 찰스 퍼니 『기억의 과학』, 분당서울대병원 『기억여행』 4권 (가을·겨울·봄·여름)
- **PDF → 텍스트 추출**: `pdftotext -layout` 으로 10권 모두 추출 (총 ~9.7만 줄). `docs/wiki/_raw/_extracted/` 저장
- **핵심 4권 정제**: `finetune/data/v2/book_extracts/`
  * `01_dialogue_50scenarios.txt` — 요시다 책의 50개 GOOD/BAD 시나리오 자동 추출 (대응 힌트 + 대화 시도의 예 + 올바르지 못한 대화 시도의 예 + 해설)
  * `02_reminiscence_theory_ch1_6.txt` — 1H 화법 1~6장
  * `03_NVC_dementia_11chapters.txt` — NVC 11장 본문
  * `04_reminiscence_QA_handbook.txt` — Q&A 핸드북
- **8 카테고리 1:1 매핑**: 요시다 50 시나리오 → C1~C8 매핑 (C3 감각단서만 NVC 2장 + 뇌과학으로 보완)
- **RAG 통합**:
  * `docs/wiki/06_회상요법_책.md` 신규 — ai-server SYSTEM_PROMPT 자동 주입 (Cache-Augmented Generation)
  * `finetune/data/v2/CATEGORIES.md` — 8 카테고리에 책 GOOD/BAD 인용 추가
  * `finetune/data/v2/BOOK_REFERENCES.txt` — v2 generation context 마스터 인덱스
  * `finetune/data/v2/SEED_TEMPLATE.csv` — 부활 + `book_reference` column 추가 (사용자 22 페어 작성 시 책 참고 가능)
- **발표 자료 갱신**: METHODOLOGY.md 14번 (Clinical-Book-Grounded RAG, 5요소), EXPERIMENTS_LOG.md (2026-05-07 시도·효과·다음단계), NEXT_SESSION.md (대기 작업 갱신)

### 멈춘 지점
- SEED 22 페어의 `assistant_response` 칸은 여전히 빈칸 (사용자 작성 대기)

### 다음 할 일
- [ ] **사용자**: SEED 22 페어 모범 응답 작성 (`finetune/data/v2/SEED_TEMPLATE.csv`, 1-2시간)
- [ ] **사용자**: ai-server 재시작 (`bash restart.sh`) — wiki 06 적용
- [ ] SEED 받으면 v2 발화 generation (`finetune/scripts/16_*`) — 페르소나 random + BOOK_REFERENCES context → 1,600 발화
- [ ] v2 응답 generation (`finetune/scripts/17_*`) — wiki 06 + SEED few-shot → 1,600 모범 응답
- [ ] Stage 2.5 (book-aware) 학습 — Stage 2 위에 누적 (LoRA continuation)
- [ ] before/after 평가 + safety eval (룰)

### 컨텍스트 상태
- 디스크: ~71% (책 415MB + 추출 텍스트 ~30MB + 정제 487KB 추가)
- 블로커: SEED 22 페어 사용자 작성 대기

---

## 2026-05-06 (Stage 1 Proper 본 시스템 적용 + 폐기 stage1 정리)

### 오늘 한 일
- **`.env` 모델 전환**: `OLLAMA_MODEL=gemma4:31b` → `remini-stage1-proper:latest`
  - Stage 1 Proper가 학습/평가/Ollama 등록까지 끝났는데 `.env`는 base 모델 그대로 가리키고 있었음 — 본 시스템이 fine-tune 모델 호출 안 하던 사고
  - 다른 곳(`caregiver/`, `start.sh`, `ai-server/app/`)은 직접 LLM 호출 없음. `.env` 한 줄로 전환 완료
- **폐기 stage1 36G 정리** (catastrophic forgetting F2로 폐기된 첫 시도)
  - 삭제: `finetune/checkpoints/lora_stage1/` (541M), `finetune/checkpoints/lora_stage1_gguf/` (18G), Ollama `remini-stage1:latest` (18G)
  - 보존: F2 증거 텍스트는 `docs/presentation/evidence/{before,after,safety_*}_stage1.txt`에 이미 분리됨. 모델 가중치 자체는 발표·논문에 불필요
  - 디스크: 665G → 629G (75% → 71%)
- **메모리 룰 신설**: `feedback_finetune_apply_to_env.md` — fine-tune stage 완료(학습+GGUF+Ollama+before/after+safety) 시 즉시 `.env` 자동 갱신. 베이스 그대로 두면 안 됨

### 다음 할 일
- [ ] **ai-server 재시작** (사용자 직접) — `.env` 다시 읽어야 적용. `bash restart.sh`
- [ ] 재시작 후 첫 응답 정상성 1회 확인 (Ollama가 `remini-stage1-proper:latest` GPU 로딩 ~수십 초)
- [ ] Stage 2 KG-aware distill 실행 (`python finetune/scripts/22_stage2_persona_distill.py --n-target 2500`, ~3-5h) — NEXT_SESSION 참고

---

## 2026-05-05 (IoT-X 출품용 마일스톤 / 간트차트 작성)

### 오늘 한 일
- **`docs/MILESTONES.md` 신규** — IoT-X 캡스톤디자인(MemorIE 팀) 출품 + 종합설계 최종 발표용 일정 자료. Mermaid `gantt` 블록 + 마일스톤 표(M1~M12) + 단계별 책임/산출물 + 리스크 4건.
  - 기간: 2026-02-26 (주제 선정) ~ 2026-12-15 (종합설계 최종 발표). IoT-X 본선은 10/15~10/25 가정(임의).
  - Past 단계는 PROGRESS 기반 실측 일자, 평가/Fine-tune/본선 단계는 임의 산정.
  - 사용자가 신청서(.hwp)에 명시한 실제 일정 알려주면 갱신 필요.

### 다음 할 일
- [ ] 신청서에 명시된 IoT-X 실제 일정(중간평가/본선 일자, 평가 항목)으로 MILESTONES.md 동기화
- [ ] 평가 인프라 — Do/No 카운트 스크립트(M7)

---

## 2026-05-05 (죽은 기술 스택 정리 — 발표 appendix 슬림화)

### 오늘 한 일

발표 appendix용 기술 스택 정리 중, 코드에 import만 있고 실제 호출 경로가 없는 죽은 백엔드들을 발굴해 일괄 제거.

#### 삭제한 TTS 백엔드
- **MeloTTS** (`services/melo_tts.py`) — provider=`melo` 호출 경로 없음
- **XTTS-v2 / Coqui** (`services/xtts_tts.py`) — provider=`xtts` 호출 경로 없음
- **edge-tts** (`tts.py:_synthesize_with_edge_tts`) — 클라우드라 "오픈소스 로컬 only" 정책 위반. `requirements.txt`에서 `edge-tts>=7.0.0` 제거
- **ttsforge** (`tts.py:_synthesize_with_ttsforge`) — 클라우드 외부 API. 폴백의 폴백이라 사실상 안 쓰임

남긴 것: **Supertonic-2 (메인) → MMS-TTS-kor (폴백)**, 그리고 보호자 음성 복제용 **Qwen3-TTS local** (`local_voice_clone.py`).

#### 삭제한 기능
- **Microsoft GraphRAG** (`services/graphrag_memory.py` + `graphrag_*` config 변수 + `.env` 항목) — `graphrag_enabled=False` 디폴트, AuraDB가 그래프 메모리 담당이라 중복

#### 삭제한 npm 의존성
- `caregiver-app/package.json`: `expo-linear-gradient`, `expo-location`, `expo-image` (코드 import 0건)
- `patient-web/package.json`: `next-themes` (코드 import 0건)

#### config 변수 정리
`config.py`에서 제거: `ttsforge_*`, `melo_tts_*`, `edge_tts_voice`, `coqui_model_name`, `xtts_*`, `voice_clone_fallback_to_ttsforge`, `graphrag_*`. `.env` / `.env.example` 동기화.

`tts_provider`는 이제 `supertonic | mms` 둘만 인식. fallback chain: `supertonic → mms` (이전엔 `supertonic → mms → edge-tts → ttsforge` 4단계).

### 검증
- `python -c "from app.services.tts import TTSService"` ✅ (provider=supertonic)
- `python -c "from app import main"` ✅ (Whisper large-v3 로드 정상)
- `caregiver-app` typecheck ✅
- `patient-web` typecheck — pre-existing `notice` 콜백 type 누락 1건 (App.tsx:996) 발견. 본 정리 작업과 무관 (voice-loop.js 콜백 type에 `notice: (msg) => void` 추가 필요).

### 발표 appendix 본 시스템 핵심 스택 (정리 후)
**AI 서버**: FastAPI · Uvicorn · Ollama (gemma4:31b 메인 / qwen2.5:3b 분류기) · faster-whisper large-v3 · Supertonic-2 · MMS-TTS-kor · Qwen3-TTS · Silero VAD · LiveKit turn-detector · BAAI/bge-m3 · pgvector · Neo4j AuraDB
**보호자 API**: Express 5 · JWT · bcrypt · neo4j-driver
**보호자 앱**: Expo SDK 54 · RN 0.81 · expo-router 6 · TanStack Query · zod · expo-haptics
**환자 웹**: Vite · React 19 · Tailwind · three.js · Capacitor 7
**Fine-tune**: Unsloth · TRL · PEFT · GGUF + Ollama Modelfile

### 다음 할 일
- patient-web `notice` type 보강 (별 작업)
- `@livekit/components-react` / `livekit-client` 는 type-only import만 남아있음 — 자체 type alias 만들고 의존성 빼는 안 검토 가능

---

## 2026-05-02 (환자 진입·응답 속도 대수술 — LLM TTFT 13.7s → 0.97s, 14× 개선)

### 오늘 한 일

#### 1. 환자 진입 7대 수정 (`d0f2e00` 이후 누적된 미커밋 변경)
- `.env:72` `NEO4J_URI` 의 `localhost` → `127.0.0.1` (Windows OpenSSH IPv6 fallback 시간 제거)
- `user_identity.py:98-117` `PersonaDirectory.warmup()` 추가 + `_cache` 빈 리스트는 캐시 안 하도록(터널 일시 끊김 후 영구 차단 방지)
- `main.py:325-336` startup 워밍업에 `persona_directory.warmup()` + `warmup_llm()` 추가
- `App.tsx:1095-1100` 측정 자막은 `?debug=1` 일 때만 노출 (평소엔 콘솔만)
- `App.tsx:516-521` `stopActiveTts()` 의 `audio.src = ""` 제거 — "play() interrupted by load" 에러 트리거 차단
- `App.tsx:594, 642-650` BufferSource decode 실패 시 `console.warn` 으로 ctx.state/byteLength 로깅 (재발 진단용)

#### 2. ollama keep_alive (string→int 버그 수정 포함)
- `.env:21` `OLLAMA_KEEP_ALIVE=-1`, `config.py:32` `ollama_keep_alive: int = -1`. **string `"-1"` 보내면 ollama 가 `time: missing unit in duration "-1"` 400 에러로 거부함.** pydantic 이 자동 int 캐스팅하도록 타입 박는 게 핵심.
- `llm.py` 4개 ollama payload (chat/stream/proactive/warmup) 에 `"keep_alive": settings.ollama_keep_alive,` 추가
- `OLLAMA_NUM_PREDICT 256 → 192` (회상요법 짧은 응답 원칙에 부합)
- 검증: `expires_at=2318-08-12` (300년 후) — 사실상 영구 GPU 상주

#### 3. 새로고침 = 새 세션 + user_id 기반 이력 잇기
- `App.tsx:56-65` `getSessionId()` localStorage → 메모리 only (페이지 로드마다 새 ID, 이전 키 자동 정리)
- `agent.py:264-273` `list_messages` 호출 시 `session_id=None if user_id else session_id` — 같은 환자의 이전 세션 대화 24개를 LLM 컨텍스트로 자연스럽게 잇기. 익명 세션은 종전대로 session 격리.
- 회상요법 측면 긍정 — 새로고침해도 대화 흐름 유지

#### 4. /warmup endpoint + 진입 단계 progress
- `main.py:755-803` `POST /warmup` 신규 — 환자 진입 시점에 5단계 cold 요소 모두 깨움: chat LLM(wiki 22k) + proactive LLM + input classifier(qwen2.5:3b) + retrieval(BGE-M3+AuraDB) + fragment reconstruction(Neo4j)
- `App.tsx:1067-1126` 진입 흐름에 워밍업 호출 + 시간 기반 진행률 점진 증가 (5→15→30→88(점진)→90→100). 카메라/마이크와 병렬.
- `agent.py:421-437, 384-414, 541-558` phase timing 로그 (prep_ms / llm.ttft / llm.total / tts.ms) — 진단 가시화

#### 5. **진짜 해결**: proactive ↔ chat KV cache 공유
- 1차 측정 결과: warmup 했는데도 첫 발화 LLM TTFT 13.7s 그대로. **원인: 같은 ollama 모델은 단일 KV cache slot — `warmup_llm()` 의 chat prefill 이 같은 함수 내 proactive prefill 에 의해 evict 됨.**
- `llm.py:322-338` `chat_with_ollama_proactive` 가 `PROACTIVE_SYSTEM_PROMPT` 대신 chat 의 `SYSTEM_PROMPT` + wiki 사용 → prefix 22k 가 chat 경로와 동일 → KV cache 공유. PROACTIVE 의 핵심 가이드(5W 금지·부정어·1~2문장·이모지)는 SYSTEM_PROMPT 에 이미 다 있음.
- `llm.py:421-442` `warmup_llm()` 에서 proactive 호출 제거 (같은 prefix 라 두 번 부르면 헛수고)

### 측정 결과 (실제 환자 첫 발화 로그)

| 항목 | Before | After | 개선 |
|------|--------|-------|------|
| warmup llm | 13695ms | **292ms** | 47× |
| LLM TTFT (첫 발화) | 13700ms | **974ms** | **14×** |
| LLM TTFT (두 번째) | - | 903ms | warm 유지 |
| prep_ms | 125ms | 206ms | (워밍업으로 cold 제거) |
| 환자 EOT → 첫 음성 | 18~25s | **~4초** | **5×** |

### 다음 할 일
- [ ] **TTS 직렬화 개선** — `supertonic_tts.py:140` `with self._lock:` 가 합성을 직렬화. `idx=0 1.7s → idx=1 3.0s → idx=2 4.3s` 로 누적. supertonic 이 thread-safe 하면 lock 제거 검토. 첫 청크 1.7초 더 줄이면 환자 EOT → 첫 음성 ~3초까지 가능.
- [ ] (선택) **wiki retrieval-aware 분할** — wiki 22k 를 "톤 가이드(고정 ~8k) + 화제 카탈로그(BGE-M3 임베딩 기반 동적 retrieve)" 로 분리하면 KV 캐시 더 가벼움. 단 회상요법 품질 회귀 테스트 필요.
- [ ] (선택) **OLLAMA_NUM_PARALLEL=2** — ollama 환경변수로 KV slot 2개 → 다른 prefix (예: classifier) 동시 캐싱 가능. 현재는 굳이 안 해도 됨.
- [ ] 평가 실험 인프라 (Do/No 액션 자동 카운트)
- [ ] 보호자 앱 회피 주제 관리 화면

### 컨텍스트 상태
- 미커밋 변경: 매우 많음 (9개 ai-server/ + 8개 caregiver/ + docs/ + start/stop.sh + 새 patient-react 번들) — 세션 끝나면 마이크로 커밋 권장
- 블로커: 없음

---

## 2026-05-02 (Karpathy 4원칙 코딩 가이드라인을 CLAUDE.md 에 통합)

### 오늘 한 일
- `forrestchang/andrej-karpathy-skills` 저장소의 `CLAUDE.md` (Karpathy 의 LLM 코딩 비판 기반 4원칙) 를 Remini 루트 `CLAUDE.md` 끝에 §코딩 가이드라인 섹션으로 추가. 영문 원문 그대로 유지.
- 4원칙: Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution.
- 충돌 우선순위 명시: 기존 “행동 규칙(프로젝트 한정)” 이 우선.
- 효과는 새 Claude Code 세션부터 자동 로드.

### 다음 할 일 (선택)
- [ ] user-level 적용 검토 — `~/.claude/CLAUDE.md` 에도 같은 내용 추가하면 모든 프로젝트에 효과. 단 이건 사용자 결정.
- [ ] 한 주 운용 후 평가: diff 가 더 깔끔해졌는가, 불필요한 리팩토링이 줄었는가, 사전 질문이 늘었는가.

---

## 2026-05-02 (회상요법 wiki 4개 추가 + num_ctx 32k 확장)

### 오늘 한 일
- 사용자가 `docs/wiki/_raw/` 에 회상요법 raw 자료 7개 던짐 (영문 PDF 4 + 한국어 PDF 2 + 회상요법 진행.docx). 모두 마크다운으로 가공해 `docs/wiki/0X_*.md` 4개로 정리:
  - `01_회상요법_임상기초.md` (~2.6k 토큰) — 영문 Helpsheet + Practical Sheet 통합. 정의·종류·임상 근거(23 RCT, 1,763명)·**금기증(알코올 치매·격앙·PTSD·학대 생존자)**·dosage(8~12주, 주 1회 60분)·평가척도(GDS-15, HAD, QoL-AD, Holden, smiley face)·spontaneous reminiscence·서구 9테마.
  - `02_연구근거_비대면회상치료.md` (~3.4k 토큰) — **중앙치매센터 RCT 보고서. Remini 디자인의 직접 근거.** 1:1 비대면 12회기 6단계 모델, KDSQ-C/SMCQ/SGDS-K 사전사후(실험군 모두 p<.01~.001 개선, 대조군 악화), **60주차 화제 카탈로그(12개월×4~5주차, 각 5~7 단서)**, 만족도 인사이트.
  - `03_뇌운동_진행자가이드.md` (~2.3k 토큰) — 분당서울대 김기웅 교수팀 ‘반짝활짝뇌운동’. **진행자 5대 마음가짐·상황별 Q&A 6가지·회상카드 4단계 프로토콜·5개 카테고리 회상 주제(옛음식/옛놀이/학창/장소/물건)·사진별 질문 템플릿(초가집/진달래/전화기/김치)·8회기 노래 카탈로그.**
  - `04_NICE_치매관리핵심.md` (~2.7k 토큰) — NICE NG97 + QS184. 회상요법 권고 강도(Consider, mild-moderate)·CST 권고 강도(Offer)·**비약물 1차 치료 원칙·person-centred care 4원칙(인간가치/개별성/본인시각/관계)·QS184 7개 quality statement·DEMQOL.**
- `_raw/회상요법 진행.docx` 는 이미 `00_*` 본체 §19~26 에 녹여둔 자료라 별도 가공 없이 출처용으로 보존.
- **컨텍스트 윈도우 16384 → 32768** 로 상향 (`.env` + `config.py`). 현재 wiki ~17.5k 토큰 + 환자 메모리 + 대화 이력 + 응답까지 여유 약 11k 토큰.
- raw PDF 텍스트 추출본은 `docs/wiki/_raw/_extracted/*.txt` 로 보존 (재가공 시 재추출 불필요).

### 다음 할 일
- [ ] **AI 서버 재시작 필요** (`bash restart.sh`) — `.env` num_ctx 변경 + 새 wiki 4개 로드 반영. 첫 요청 prefill 약 2~3초 예상.
- [ ] 첫 환자 발화 시나리오로 회귀 테스트. 특히 wiki §02 60주차 카탈로그가 polulation prompt 에 자연스럽게 반영되는지, §03 진행자 마음가짐이 톤에 묻어나는지, §04 NICE 4원칙이 person-centered tone 으로 발현되는지.
- [ ] 사용자가 추가 자료(보호자 인터뷰 메모·환자별 자랑 화제 일반화·임상 가이드 추가본 등) 던지면 같은 패턴으로 `05_*.md` 이후 추가.
- [ ] `PROACTIVE_SYSTEM_PROMPT` 에도 wiki 주입 검토 (아직 미적용).
- [ ] 화제 카탈로그(02 §5 / 03 §5) 를 JSON 으로 분리해 `services/proactive.py` 가 직접 읽도록.

### 컨텍스트 상태
- wiki 5개 합산: ~17.5k 토큰 (한도 32k 의 54%)
- Fork 여부: N
- 블로커: 없음 (서버 재시작만 하면 활성화)

---

## 2026-04-30 (회상요법 도메인지식 정리 + LLM Wiki 패턴 도입)

### 오늘 한 일
- `docs/회상요법 관련 책.docx` 와 `docs/회상요법 진행.docx` 의 도메인 지식을 LLM 친화적 마크다운으로 재구성 → 메인 본체 `docs/wiki/00_회상요법_도메인지식.md` (Part A 이론 §1~18 + Part B 운영·사례 §19~26).
- **Karpathy LLM Wiki + Cache-Augmented Generation 패턴 도입**. `docs/wiki/` 디렉토리 신설, 안의 모든 `.md` 파일이 AI 서버 시작 시 합쳐져 LLM 시스템 메시지 #2 로 통째 주입됨. 사용자는 이 폴더에 도메인 자료를 계속 추가하면 됨 (`docs/wiki/README.md` 참고).
- `ai-server/app/services/llm.py` 구조 개편:
  - `SYSTEM_PROMPT` 를 **하드 룰 ~30줄(309 토큰)** 로 다이어트. 안전·화법·형식만 남김. 이전 70~90줄 → attention dilution 해소 의도.
  - `_load_domain_wiki()` 추가 — `docs/wiki/*.md` 알파벳 순 로드, `_` 시작 파일과 `README.md` 자동 제외.
  - `_build_chat_messages()` 에 wiki 시스템 메시지 추가. 메시지 순서: [하드룰] → [위키] → [메모리] → [요약] → [분류기] → [사투리] → [최근 메시지] → [user]. 앞 둘은 정적이라 Ollama KV 캐시 prefix 로 작동.
- **컨텍스트 윈도우 4096 → 16384**. 위키 6.4k + 하드룰 0.3k + 메모리/대화 ≈ 9k 토큰이라 4096 으론 동작 불가. `.env` 와 `ai-server/app/config.py` 둘 다 변경.

### 다음 할 일 (사용자 요청)
- [ ] **AI 서버 재시작 필요** — `.env` 의 `OLLAMA_NUM_CTX` 변경 반영 위해. `bash restart.sh` 또는 uvicorn 프로세스 kill 후 재기동.
- [ ] 사용자가 `docs/wiki/` 에 추가 도메인 자료 업로드 예정 (한국 50~70년대 생활·풍속, 인생 단계별 화제, 음식 카탈로그, 보호자 인터뷰 메모, 임상 가이드라인 등).
- [ ] 첫 호출 워밍업 추가 검토 — 서버 startup 시 dummy 1턴으로 KV 캐시 prefill (선택).
- [ ] `PROACTIVE_SYSTEM_PROMPT` 에도 wiki 주입 검토 (현재는 미적용 — proactive 는 짧은 polling 응답이라 비용 트레이드오프 고려).
- [ ] §21 화제 카탈로그를 JSON 으로 분리해 `services/proactive.py` 가 직접 읽도록 (월/계절/인생사 폴백 큐).

### 컨텍스트 상태
- 사용률: 낮음
- Fork 여부: N
- 블로커: 없음 (서버 재시작만 하면 wiki 활성화)

---

## 2026-04-29 (Neo4j Aura → 로컬 전환 + SSH 역방향 터널)

### 오늘 한 일 (4)
- **Neo4j 백엔드를 학생 데스크탑 (<SERVER_IP>) 의 Neo4j Desktop Community 인스턴스로 전환**. 직접 연결은 학교 사내망 client isolation 으로 차단 (H200 → 230 ping 100% loss) 이라 **SSH 역방향 터널** 로 우회.
- 운영 절차: 학생 데스크탑에서 SSH 들어올 때 `ssh -R 17687:127.0.0.1:7687 <user>@<SERVER_IP>` 추가. H200 의 17687 → 학생 데스크탑의 7687 (= Neo4j Desktop "Remini-ai" DBMS) 로 forward. `localhost` 가 아닌 `127.0.0.1` 명시 필수 — Windows OpenSSH 가 `localhost` 를 IPv6(`::1`) 로 해석하는데 Neo4j 는 IPv4 만 listen 해서 incomplete handshake 났음.
- `.env` 갱신: `NEO4J_URI=bolt://localhost:17687`, `NEO4J_PASSWORD=<NEO4J_PASSWORD>`, `NEO4J_DATABASE=neo4j` (Community 라 multi-DB 불가, default `neo4j` 만 사용).

### 멈춘 지점
- **학생 데스크탑 SSH 세션이 살아있는 동안만 Neo4j 도달 가능**. 데스크탑 끄거나 SSH 끊기면 AI 서버 `/proactive-event`/대화 전체가 즉시 죽음 ("AI 서버에 연결하지 못했어요" 자막).

### 다음 할 일
- (단기) SSH 터널 끊김 모니터링 — `tmux`/`screen` 안에서 SSH 띄우거나 `autossh` 로 자동 재연결 구성.
- (중장기) 학생 데스크탑 Neo4j 데이터를 dump → H200 으로 load 해서 의존성 제거. 절차: 데스크탑에서 `neo4j-admin database dump neo4j --to-path=...` → SCP push → H200 에서 `sudo systemctl stop neo4j && sudo -u neo4j neo4j-admin database load neo4j --from-path=/tmp/ --overwrite-destination=true && sudo systemctl start neo4j` → `.env` 의 `NEO4J_URI=bolt://localhost:7687` 로 환원.
- (선택) AI 서버 startup 에서 Neo4j 핑 헬스체크 추가 — 끊겼을 때 환자 화면에 친절한 메시지 띄우기.

---

## 2026-04-29 (라이트/다크 테마 토글 + 의료/케어 라이트 팔레트)

### 오늘 한 일 (3)
- **라이트 모드 추가** — 기존 다크 전제였던 환자 UI 에 라이트 모드를 추가:
  - `App.tsx` 에 `theme` state + `localStorage("remini_theme")` 저장 + `<html>`/`<body>` `data-theme` 동기화. 시작 화면 우상단에 sun/moon SVG 토글 버튼. 환자 진입 후엔 시작 오버레이가 사라지면서 토글도 자동 숨김 (보호자만 세팅 단계에서 조작).
  - `jarvis-particle-orb.tsx` 의 `STATE_STYLE` 을 `STATE_STYLE_DARK` (기존 네온/사이언) + `STATE_STYLE_LIGHT` (sage/peach/lavender 의료 톤) 두 세트로 분리. `theme` prop 으로 분기.
  - `index.css` 에 `:root[data-theme="light"]` 변수 + `[data-theme="light"]` 셀렉터로 body/visual-glow/subtitle/listening/start-panel/start-input/admin-toggle/voice-picker 등 라이트 톤 오버라이드.
- 라이트 팔레트: warm white(#faf6ee) 바탕 + sage(#7BAA92, #5E9B85) + warm peach(#D89766) + dusty lavender(#9387B0). 흰 배경에서 채도 너무 높지 않게 중간 톤.

---

## 2026-04-29 (PWA 무한로딩 회피 + orb 펄스 응답 가속)

### 오늘 한 일 (2)
- **PWA 무한로딩 풀림** — Safari 탭 OK 였지만 홈화면 추가(standalone) 에서 무한로딩. WebKit/Apple Forum 회귀 두 개를 회피:
  - AudioWorklet 프로세서를 inline `Blob([WORKLET_CODE])` URL → 정적 파일 `ai-server/web/pcm-emitter.js` 로 분리. PWA 에서 blob: URL 모듈 로딩이 hang 하는 회귀 (Apple Forum 734378/768347).
  - `App.tsx` startExperience 의 카메라/마이크 `Promise.all` 을 PWA 검출 시 직렬 `await camera; await mic` 로 떨어뜨림. PWA 에서 `getUserMedia` 병렬이 hang 하는 회귀 (WebKit #185448, #252465). Safari 탭은 병렬 유지.
- **orb 펄스 응답 가속 (비대칭 lerp)** — `jarvis-particle-orb.tsx` 의 audio level / scale lerp 를 attack(커질 때)과 release(복귀)에 다른 계수 적용:
  - `uLevel`: attack 0.45 / release 0.70
  - `pulseSmoothed`: attack 0.50 / release 0.75
  - 회전 그대로. "커진 후 원래 크기 복귀"가 빠르게 보이도록 release 를 더 강하게.

---

## 2026-04-29 (iPad "마이크 연결 중..." 지연 단축)

### 오늘 한 일
- **카메라/마이크 병렬 부팅** — `App.tsx` startExperience 가 `startVisualMonitoring → startVoiceLoop` 직렬 await 였던 걸 `Promise.all` 로 묶음. 카메라 실패는 catch에서 삼키고 마이크 실패만 치명적 처리. 진행 텍스트도 "카메라·마이크 연결 중..." 으로 통합.
- **getUserMedia constraint 단순화** — `voice-loop.js` 마이크 협상에서 `sampleRate:16000` (audioCtx 가 자동 리샘플링하므로 불필요), `noiseSuppression`, `autoGainControl` 제거. iPad Safari 협상 시간 단축. `echoCancellation` 은 TTS echo 차단 위해 유지.
- **PWA ws 백오프 단축** — `_openWs` 재시도 백오프를 600ms*n → 200ms*n 으로 축소. PWA 첫 ws 가 즉시 onerror 로 떨어지는 케이스라 길게 기다릴 이유 없었음.

### 멈춘 지점
- iPad **Safari 탭** 모드에선 빠르게 동작 확인됨. PWA(홈화면 추가) 모드는 무한로딩 보고됨.

### PWA 무한로딩 — 적용한 두 가지 회귀 회피책
GitHub/WebKit 버그 트래커 조사 결과 (출처: WebKit #185448/#252465/#237878, Apple Forum 734378/768347, MS speech-sdk-js #455) 가장 유력한 두 후보를 회피:

1. **AudioWorklet `addModule(blob:URL)` standalone hang** — `ai-server/web/voice-loop.js` 가 worklet 프로세서를 inline 문자열로 Blob URL 만들어 등록하던 걸, 별도 정적 파일 `ai-server/web/pcm-emitter.js` 로 분리. iOS PWA standalone 에서 blob:URL worklet 모듈은 promise 가 settle 안 되는 회귀가 있음.

2. **PWA standalone 에서 `getUserMedia` 병렬 호출 hang** — `caregiver/artifacts/patient-web/src/App.tsx` startExperience 가 `Promise.all([camera, mic])` 로 카메라/마이크를 병렬 요청하던 걸, `display-mode: standalone` 또는 `navigator.standalone` 검출 시 직렬 (`await camera; await mic`) 로 떨어뜨림. Safari 탭은 병렬 유지.

### 다음 할 일
- iPad **PWA(홈화면 추가)** 에서 다시 테스트. 풀리지 않으면 다음 후보:
  - **AudioContext 두 개 동시 생성 회귀** (WebAudio #790, WebKit #237878): `voice-loop.js` 가 capture/playback 각각 AudioContext 만드는 걸 1개로 통합.
  - **iOS 15+ WebSocket NSURLSession 회귀** (WebKit #228296): uvicorn 측 `ws_per_message_deflate=False` 로 설정.
- PWA 캐시는 iOS 설정 → Safari → 방문기록 및 웹사이트 데이터 지우기 → 해당 사이트 삭제로 강제 비울 것. 또는 PWA 자체를 홈화면에서 삭제 후 재추가.
- (선택) 진단용 `[측정]` 자막 / `window.__voiceLoopTimings` 는 안정화 확인 후 제거.
- (선택) `/favicon.ico` 404 와 `/apple-touch-icon-precomposed.png` 404 는 무시 가능 — 브라우저 자동 fallback.

---

## 2026-04-27 (데드 코드 정리 라운드 1 + 메인 LLM 표기 일치화)

### 오늘 한 일
- **메인 LLM 표기 일치화** — 진실 소스를 프로젝트 루트 `.env`(`OLLAMA_MODEL=gemma4:31b`)로 못박고 모든 디폴트/문서를 동기화
  - 사용자 정정: "메인 LLM은 gemma4 쓰고있는데 왜 자꾸 큐엔3로 너가 판단하냐. 계속 그렇게 판단해"
  - 원인: `config.py` 디폴트(`qwen3:14b`)와 `portfolio_input.md` / `PROGRESS.md` 4-26 섹션이 옛 모델로 박혀있었고, 이전 대화에서 그것들을 신뢰해서 잘못 판단함
  - `ai-server/app/config.py:26`: 디폴트 `qwen3:14b` → `gemma4:31b`
  - `ai-server/.env.example:10`: 동일 변경 + CLOVAX placeholder 라인 제거
  - `ai-server/README.md`: 모델명 표기 3곳 + 폴백 모델 멘트(`qwen3:8b` → `gemma2:9b`) + WHISPER_MODEL 표기(`small` → `large-v3`) 정리
  - `docs/portfolio_input.md`: `qwen3:14b` 6곳 → `gemma4:31b` 일괄 교체 (섹션 2/7/9)
  - `docs/PROGRESS.md`: 4-26 섹션 모델 표기 정정
  - 메모리 신규 저장: `project_remini_main_llm.md` — `.env`가 SSoT, 디폴트/옛문서 신뢰 금지

- 코드베이스 전수 점검(Explore 에이전트) → 미사용 항목 19개 식별, 보고서 작성
- **데드 설정/코드 4종 제거** (CLAUDE.md "오픈소스 로컬만" 원칙과 정합):
  - `config.py`: `eou_model` / `eou_llm_enabled` / `eou_llm_timeout_sec` 삭제 — `loop.py` EOU 모델 백엔드 제거 후 잔재. 현재 EOU는 `eou_hf_model`(LiveKit turn-detector)만 사용
  - `config.py`: `clovax_api_key` / `clovax_model` 삭제 — 클라우드 API 금지 원칙 위반
  - `models.py`: `ProactiveEventRequest.event_type` description에서 `face_lost` 제거 — `proactive.py`에 처리 분기 없음
  - `models.py`: `DialectSettingRequest` 클래스 삭제 — 정의만 있고 어떤 엔드포인트도 받지 않음(쿼리 파라미터 사용)
  - `llm.py`: `chat_with_clovax()` 함수 + `proactive_reply` / `generate_reply` / `stream_reply` 안의 `provider in {"clovax","clova"}` 분기 3곳 삭제
  - `.env`: 빈 `CLOVAX_API_KEY=` / `CLOVAX_MODEL=` placeholder 라인 삭제
- 검증: 잔여 참조 grep 0건, 3개 파일 ast.parse OK

### 보고서에서 검토 보류한 미사용 항목 (다음 라운드 후보)
- `ai-server/web/patient*.{html,js,css}` 6개 파일 + `app.js`, `styles.css`, `patient-robot.js`, `patient-visualizer.js` — React 빌드 산출물의 폴백으로만 참조. 정리하려면 `main.py:714, 722` 폴백 분기 단순화 필요
- `caregiver-app/app/feedback/[conversationId].tsx` — AI 세션 기반 전환 후 navigation 진입 경로 없음
- HuggingFace 캐시의 `ghost613/faster-whisper-large-v3-turbo-korean` 모델 가중치(수십 GB)
- `auth.ts`(Express), `requireAuth` 미들웨어 — 인증 미구현 상태로 잔재
- `mms_tts.py` / `xtts_tts.py` / `local_voice_clone.py` — 폴백 체인이지만 현재는 supertonic 단독 사용

### 멈춘 지점
- 없음

### 다음 할 일
- [ ] 보고서 5~7번 후보 검토 후 사용자 승인 시 정리
- [ ] 평가 실험 인프라 — Do/No 액션 자동 카운트 스크립트 (책 26p 기준)
- [ ] 보호자 앱 회피 주제 관리 화면

---

## 2026-04-26 (IoT-X 캡스톤 포트폴리오 정리)

### 오늘 한 일
- **`docs/portfolio_input.md` 신규 작성** (880 LOC) — IoT-X 캡스톤 대회 포트폴리오 입력 자료. 9개 섹션 + 차별점 후보 5건
  - 섹션 1 시스템 아키텍처: depth-3 트리, 서브시스템 역할 표, requirements.txt / package.json 버전 인용
  - 섹션 2 음성 파이프라인: WebSocket Step-2 흐름, EOU 임계값(`ws_vad_min_silence_ms=800`, `ws_bargein_min_speech_ms=500`), STT/TTS 모델 표 (Faster-Whisper large-v3, Supertonic 2 우선 폴백 체인)
  - 섹션 3 이원 그래프: `ENTITY_LABELS` / `RELATIONSHIP_TYPES` / `_MODE_GRAPH_POLICY` 인용, 실제 Cypher 5건 발췌, EchoRoute softmax 라우팅 코드
  - 섹션 4 동적 메모리 학습: 5단계 파이프라인(감지 → 자연 재확인 → PendingKnowledge → 보호자 승인 → GraphEntity 생성)
  - 섹션 5 안전성 4단계 방어: input_classifier 5종 분류, output_filter 정규식·치환 테이블, system prompt 전문 인용 (`llm.py:13-70`)
  - 섹션 6 인간공학 UI: 4종 proactive 트리거(`session_start/face_detected/eyes_closed/silence`), Modality Compatibility / Redundancy / Auditory Display 코드 매핑, 매크로 키보드 EOU 처리
  - 섹션 7 로컬 LLM: Ollama gemma4:31b + qwen2.5:3b 분업, BGE-M3 임베딩, `_build_chat_messages()` 조립 순서
  - 섹션 8 보호자 앱: JWT 인증(`auth.ts:25`), AI 프록시 매핑, 알림·피드백·회피 주제 fire-and-forget 흐름
  - 섹션 9 코드 통계: Python 11,732 LOC / 자체 JS 6,041 LOC / Top-3 모듈 (main.py 1638, App.tsx 1177, auradb_memory.py 953)
  - 차별점: 이원 그래프+EchoRoute / 다층 안전망 / 휴먼-인-더-루프 / 버튼+모델 EOU / 완전 로컬 스택
- 모든 인용은 실제 파일 경로 + 라인 번호 기준. 추측 없음

### 멈춘 지점
- 없음 (문서 작업 단독 작업)

### 다음 할 일
- 포트폴리오 슬라이드/PDF 변환 (담당자 검토 후)
- 차별점 5건 중 어느 항목을 IoT-X 메인 어필 포인트로 삼을지 선정

---

## 2026-04-24 (UX/STT 튜닝 + 하네스 원칙 추가)

### 오늘 한 일
- **대화 내역 탭을 AI 세션 기반으로 전환** — 보호자 앱이 Neo4j의 수동 `Conversation` 노드 대신 AI 서버의 대화 로그(`conversations.db`)를 session_id 단위로 집계해서 보여주도록 변경
  - AI 서버 `conversation_db.py`: `list_sessions(user_id, limit)` 추가 — 세션별 메시지 수/first·last_at/위험 카운트/최근 user 발화 미리보기 집계 (서브쿼리 1 + GROUP BY). `list_messages` / `summary` 도 `user_id` 필터 지원
  - AI 서버 `main.py`: `/conversations`와 `/conversations/summary`에 `user_id` 쿼리 파라미터 추가(기존엔 무시됨 — 버그), `/conversations/sessions` 신규 엔드포인트 + `ConversationSessionListResponse` 모델
  - Express `ai-proxy.ts`: `/patients/:pid/ai/conversations/sessions`, `/patients/:pid/ai/conversations/sessions/:sessionId` 두 프록시 추가. 환자 UUID → aiUserId 해석 후 AI 서버로 전달
  - 프론트 `hooks/useApi.ts`: `useConversations`/`useConversation` 훅을 세션 엔드포인트로 리디렉트. 응답을 기존 `Conversation`/`ConversationWithMessages` 셰이프로 변환(preview → summary, last_at → sessionDate, items[] → messages[])
  - 프론트 `(tabs)/conversations.tsx`: "대화 추가" 버튼 / `AddConversationModal` / "피드백 대기 중" 카운트 제거, "새로고침" 버튼으로 교체. 빈 상태 카피를 "환자가 AI와 대화를 시작하면 여기에 자동으로 기록됩니다"로 변경
  - 프론트 `conversation/[id].tsx`: "피드백 작성하기" 버튼 제거 (AI 세션은 Neo4j Conversation 노드가 없어서 연결 안 됨). 제출된 피드백이 있을 때만 FeedbackCard 표시
  - 배경: 사용자가 p001로 대화해도 보호자 앱 `대화 내역` 탭에 안 뜨는 문제 제보. 기존 훅이 `/patients/:pid/conversations`(보호자 수동 기록)만 불러와서 AI 자동 기록과 단절돼 있었음
- **검증**: `pnpm typecheck` exit 0, Express 재시작 후 `/api/patients/{uuid}/ai/conversations/sessions` 에서 P001 세션 9개 확인 (최신 세션 `patient-hppt7fo` 38 메시지). `summary` user_id 필터도 1355 → 849로 정상 감소


- **회상 사진 fade-out + 턴 기반 퇴장** — `App.tsx:24-35, 219-224, 250-255, 413-475, 799-815, 955-967`, `index.css:190-237`
  - 기존 동작: `MEMORY_PHOTO_SHOW_MS=25000` 고정 타이머 → 시간 끝나면 `setMemoryPhotoUrl(null)` 로 즉시 unmount (하드 컷)
  - 변경 동작:
    - `MEMORY_PHOTO_TURNS_VISIBLE=4` — 사진이 뜬 뒤 다음 **AI 턴(WS `done` 이벤트) 4회** 동안 유지. 매 턴마다 `tickMemoryPhotoTurn()`이 카운터 감소. 0 되면 fade-out
    - `MEMORY_PHOTO_SHOW_MS=90000` — 안전장치 타이머를 25 → 90초로 상향. (턴이 너무 느린 환자 대비)
    - `MEMORY_PHOTO_FADE_MS=650` — fade-out 길이. opacity 0 + scale(0.985) + blur(2px) 트랜지션 후 unmount
  - 새 사진이 `done` 페이로드에 실려오면 `showMemoryPhoto()`가 카운터/타이머 리셋 + fading 플래그 off. 없는 턴은 `tickMemoryPhotoTurn()`만 호출
  - `memoryPhotoUrlRef` 추가 — WS 콜백이 stale closure 타지 않게 ref 로 "사진 존재 여부" 확인
  - CSS: `.memory-stage--fading` 모디파이어 + `animation: none !important`(fade-in 덮어쓰기)로 퇴장 연출
- **회상 사진 보호자 앱 관리 화면** — `caregiver-app/app/photos/index.tsx`(신규), `hooks/useApi.ts:288-370`, `app/_layout.tsx:77`, `app/(tabs)/knowledge.tsx:208-220`
  - 신규 Stack 화면 `/photos` — 사진 업로드(`expo-image-picker` → multipart), 리스트, "활성 지정" 토글, 삭제
  - 업로드 시 선택한 URI를 `fetch(uri).blob()`로 감싸서 FormData 에 첨부 (Expo Web/Native 공용)
  - 기억정보 탭 헤더에 "회상 사진" 버튼 추가 → `router.push("/photos")`
  - 썸네일 이미지는 Express 프록시 `/api/patients/:id/ai/memory-photos/:photoId/file` 으로 렌더 (AI 서버 직접 노출 안 함)
  - `is_active=true` 뱃지, `linked_entities` 상위 3개 미리보기, 삭제 확인 대화상자(web prompt / native Alert)
- **AI 서버 memory-photos DELETE + AuraDB 정리** — `ai-server/app/services/memory_photos.py:318-350`, `ai-server/app/services/auradb_memory.py:271-285`, `ai-server/app/main.py:1465-1471`
  - `MemoryPhotoService.delete_photo(photo_id, user_id)` 신규 — JSON 메타에서 제거, 활성이면 활성 해제, 디스크 파일 삭제, AuraDB `MemoryPhoto` 노드 `DETACH DELETE`
  - `AuraDBMemory.delete_photo_relations()` 신규 — `HAS_MEMORY_PHOTO` 엣지 + 노드 정리
  - `@app.delete("/memory-photos/{photo_id}")` 엔드포인트. user_id 스코프 지킴. 404 if not found
- **Express 프록시 확장** — `api-server/src/routes/ai-proxy.ts:305-381`
  - `POST /patients/:patientId/ai/memory-photos/:photoId/activate`
  - `DELETE /patients/:patientId/ai/memory-photos/:photoId`
  - `GET  /patients/:patientId/ai/memory-photos/:photoId/file` — 이미지를 버퍼로 받아 content-type 보존하며 포워딩
  - `aiPostRaw`의 `@ts-expect-error` 직렉티브 사용하지 않는 문제 해결 (`as RequestInit`)
- **검증** — 모든 타입체크/빌드/재시작 통과
  - `pnpm --filter @workspace/patient-web build` → 새 번들 `index-CCPBWxBY.js` / CSS `index-CA1jm-7z.css`
  - `pnpm exec tsc --noEmit`: patient-web / caregiver-app / api-server 전부 exit 0
  - `bash restart.sh` 후 `curl` 으로 AI 8000 / API 5000 모두 200
- **회상 사진 등장 fade-in 애니메이션** — `index.css:190-235`, `App.tsx:954`
  - `.memory-stage` opacity fade 900ms
  - `.memory-frame` opacity + scale(0.96→1) + blur(6px→0) 1100ms, cubic-bezier(.2,.7,.2,1)
  - `.memory-image` opacity + scale(0.92→1) 1200ms
  - `<section key={memoryPhotoUrl}>` 추가 → photo URL 바뀔 때마다 리마운트되어 애니메이션 재생 (이전 사진에서 바로 다른 사진 전환 시에도 부드럽게)
  - fade-out은 별도 상태 관리 필요라 이번엔 생략 (사라질 땐 즉시 unmount 유지)
- **TTS 초반 뭉개짐 수정: decode 순차 큐** — `ai-server/web/voice-loop.js`
  - 원인: `decodeAudioData`가 청크별 병렬 실행 → 먼저 끝난 게 먼저 스케줄 → **WS 도착 순서와 재생 순서 불일치**, 초반 오버랩 발생
  - 수정: `_decodeChain = Promise.resolve()` 필드로 **직렬 decode 체인** 유지. 각 audio 청크는 이전 청크의 `_playAudioChunk` 완료 후에 decode 시작 → 재생 순서 보장
  - `_stopAllPlayback`에서 `_decodeChain`도 리셋 (새 응답 시작 시 이전 체인 잔재 차단)
  - 지연 영향 0: 첫 청크 decode 시간은 동일, 이후 청크는 원래도 앞 청크 재생 중이라 체감 변화 없음
  - 캐시 버스트: `voice-loop.js?v=20260413a` → `20260424a` (원본 + 산출물 index.html 둘 다)
- **라우팅 스왑: `/` = 환자, `/admin` = 관리자** — `ai-server/app/main.py:710-728`
  - 기존: `/` → 관리자(web/index.html), `/patient` → 환자. iPad 홈 추가 시 `start_url=/`라 관리자 페이지가 뜨는 문제
  - 변경: `/` → 환자 React 앱, `/patient` 유지(레거시 링크 보호), `/admin` 신규 → 관리자 UI
  - PWA `manifest.webmanifest`의 `start_url:"/"` / `scope:"/"` 그대로 두고도 홈 아이콘에서 바로 환자 화면 진입
  - 재시작: `bash restart.sh` 후 `curl /` / `/admin` 응답 HTML로 검증 완료
- **iPad 시연용 PWA 강화 (아이콘/매니페스트/Wake Lock)** — `public/*`, `App.tsx`, `index.html`
  - Mac 없어서 iOS 네이티브 빌드 불가 → Capacitor 세팅은 보존하되 **시연은 PWA + Guided Access 조합**으로 진행
  - `public/icon.svg`(라일락/블루 그라디언트 + "R") → ImageMagick `convert`로 192/512/180(apple-touch) PNG 자동 생성
  - `public/manifest.webmanifest`: `display: standalone`, theme_color `#A7C7E7`, lang ko, icons 4개
  - `index.html`: `<link rel="manifest">`, `<link rel="apple-touch-icon">`, `<meta theme-color>`
  - `App.tsx`: Wake Lock API 훅 추가 — `started=true` 동안 `navigator.wakeLock.request("screen")`, `visibilitychange`로 복귀 시 재요청, cleanup에서 release. iOS 16.4+/Android Chrome 지원, 미지원 환경은 조용히 무시
  - 시연 절차: iPad Safari로 `http://<SERVER_IP>:8000/` → 공유 → **홈 화면에 추가** → 홈 아이콘으로 실행(풀스크린 standalone) → 설정 > 손쉬운 사용 > 가이드 접근 켜고 측면버튼 3번으로 잠금
- **환자 웹을 Capacitor 7 네이티브 앱 쉘로 래핑 (세팅 완료)** — `caregiver/artifacts/patient-web/`
  - 목적: iPad/Android에서 **풀스크린 강제, BT 리모컨 입력 더 안정적, 마이크 권한 유지, 화면 꺼짐 방지 확장성** 확보
  - 설치: `@capacitor/{core,cli,ios,android,status-bar,screen-orientation}@^7`
    - Capacitor 8은 Node 22+ 요구 → 현재 서버 Node 20.20.2라 Capacitor 7로 다운그레이드 (Node 18+ 지원)
  - 아키텍처 결정: **웹 자산 번들링 대신 `server.url` 방식** — 앱이 `http://<SERVER_IP>:8000` 로드 (기존 FastAPI 정적 서빙 구조 그대로). UI 업데이트 시 앱 재배포 불필요.
  - `capacitor.config.ts`: `server.url` + `cleartext: true` + `allowNavigation`; iOS `contentInset: 'always'`, Android `allowMixedContent`
  - `www/index.html`: 서버 연결 실패 시 fallback 화면
  - iOS `Info.plist`: `UIStatusBarHidden=true`, `UIRequiresFullScreen=true`, `NSAppTransportSecurity` 예외 (<SERVER_IP> HTTP 허용), `NSMicrophoneUsageDescription`/`NSCameraUsageDescription`
  - AndroidManifest.xml: `usesCleartextTraffic="true"`, `RECORD_AUDIO`/`MODIFY_AUDIO_SETTINGS`/`CAMERA` 권한
  - `pnpm exec cap add ios/android` 완료 → `ios/`, `android/` 네이티브 프로젝트 생성
  - `pnpm exec cap sync` 완료
  - **Mac 필요 항목**: iOS 빌드는 Xcode + CocoaPods 필수(서버에 없음). Mac에서 `npx cap open ios` 후 `pod install` → Xcode 빌드 → 실기기 배포 (Apple 개발자 계정 또는 무료 provisioning)
  - **Android 빌드**: Android Studio 또는 `cd android && ./gradlew assembleDebug` (Linux에서도 가능, JDK 17+ 필요)
  - 서버 URL 변경: `capacitor.config.ts`의 `server.url` 수정 → `cap sync` → 재빌드
- **BT 마우스형 리모컨 대응: 화면 전역 탭으로 "말하기 완료" 트리거** — `App.tsx:340-358`
  - 쿼카씨 류 BT HID 키보드가 아닌 **화면에 커서 띄우는 마우스 에뮬레이션 버튼**(기본/음악 모드 전부 미디어 or 포인터 이벤트)도 커버 필요
  - 기존 keydown 리스너 유지 + 신규 `pointerdown` 리스너 추가
  - `endTurnVisible && !adminOpen` 상태에서 화면 어디를 탭/클릭해도 `sendEndOfTurn` 호출
  - 예외: `INPUT`/`TEXTAREA`/`contentEditable`, `.admin-toggle-btn`, `.admin-drawer`, `.end-turn-btn`(자체 onClick 보존, 중복 방지)
  - 치매 환자가 커서를 작은 버튼 위치까지 정확히 옮기는 건 비현실적이라 화면 전체를 사실상 "완료 영역"으로 처리
- **iPad 홈화면 추가 시 풀스크린(PWA 모드)** — `index.html`
  - `apple-mobile-web-app-capable` + `mobile-web-app-capable` + `apple-mobile-web-app-status-bar-style=black-translucent` + `apple-mobile-web-app-title=Remini`
  - iPad Safari에서 공유 → "홈 화면에 추가" 후 해당 아이콘으로 실행하면 주소창/탭바 없이 풀스크린 실행
  - 원본(`caregiver/artifacts/patient-web/index.html`) + 산출물(`ai-server/web/patient-react/index.html`) 둘 다 반영
  - 빌드: `pnpm --filter @workspace/patient-web build` → 새 번들 `index-D3pFAiss.js` 생성
- **환자 웹 UI 차임 사운드 교체** — `caregiver/artifacts/patient-web/src/App.tsx:267-312`
  - A5(880Hz)+D6(1174.66Hz) "띠링" → **C5(523.25Hz)+G5(783.99Hz) 저음 부드러운 차임**
  - 길이 0.2s/0.32s → 0.5s/0.7s 로 여운 확대
  - `pnpm --filter @workspace/patient-web build` → `ai-server/web/patient-react/` 산출물 갱신
- **CLAUDE.md 하네스 원칙 추가** — "모든 AI 모델은 오픈소스 로컬 전용, 클라우드 API 금지 (Neo4j AuraDB는 예외)"
- **STT 모델 한국어 파인튜닝판 실험 후 롤백**
  - 시도: `ghost613/faster-whisper-large-v3-turbo-korean`
  - 문제: Zeroth 데이터셋(방송·뉴스 낭독체)으로 파인튜닝된 모델이라 **뉴스 클리쉐 환각** 발생 (예: "홍사장의 발언에 국감장이 술렁이자 조정식 국토교통위원회…" 식으로 관련 없는 정치 뉴스 문구를 찍어냄). 치매 환자 일상 대화 인식에 부적합.
  - 17:44:28 `WHISPER_MODEL=large-v3`로 원복 완료
- **Neo4j Aura Paused 장애 진단** — Free-tier 무활동 자동중지로 DNS NXDOMAIN, 사용자가 콘솔 resume으로 해결
  - 같은 증상 재발 시 최우선 진단 경로 메모리에 저장 (`memory/project_neo4j_aura.md`)
- **자막 실시간성 개선** — `App.tsx:710-715`
  - `startTransition` 제거 → LLM 토큰 수신 즉시 `setSubtitle` (urgent 렌더링)
  - 기존엔 React가 낮은 우선순위로 미뤄서 자막이 뒤늦게 뜨는 체감
  - 서버 측 토큰 emit은 원래부터 `agent.py:559`에서 즉시 발송됨 (병목 아니었음)
- **Jarvis 파티클 오브 렉 완화** — `jarvis-particle-orb.tsx`
  - 3겹(Core/Main/Halo) → 2겹(Core/Main). 가장 바깥 Halo 레이어 제거
  - 파티클 draw 33%↓ (4096×3 → 4096×2), Halo가 가장 큰 pointScale(1.8)이라 fillrate/additive overdraw 부담이 제일 컸음
- **블루투스 프레젠터 "말하기 완료" 키 연동** — `App.tsx:315-337`
  - 전역 keydown 리스너 추가: `endTurnVisible && !adminOpen` 상태에서만 반응
  - 감지 키: 방향키(4종), PageDown/Up, Space, Enter — 쿼카씨 Page Pro 등 BT HID 프레젠터 대부분 커버
  - 폼 요소(`INPUT`/`TEXTAREA`/`contentEditable`) 포커스 중엔 무시해서 입력 방해 없음
  - 쿼카씨는 iPad에서 **페이지/프레젠터 모드**로 전환해야 함 (기본 E-reader 모드는 볼륨 키라 Safari 블록)

### 멈춘 지점
- STT 교체 후 실사용 인식률 벤치마크 미실시. 기존 `대화로그_*.txt` 녹음본이 있으면 A/B 비교 가능.

### 다음 할 일
- [ ] 한국어 파인튜닝 STT는 뉴스·방송 데이터 비중이 낮은 모델을 찾아서 재시도 (예: 일상 대화 코퍼스 기반). 환각 테스트를 통과하기 전엔 기본 `large-v3` 유지
- [ ] (이어서) 평가 실험 인프라 — Do/No 액션 자동 카운트 스크립트 (책 26p 기준)
- [ ] (이어서) 보호자 앱 UI에 회피 주제 관리 화면 추가

---

## 2026-04-23 (Phase 1~6 전체 완료 — 회상요법 + 위험관리 + 오류허용)

### 오늘 한 일
- 하네스 엔지니어링 1~3단계 적용 (CLAUDE.md, PROGRESS/FEATURES 체계)
- 중간1차 발표자료 + 회상요법 책 분석
- **회상요법+위험관리+오류허용 통합 계획** (`~/.claude/plans/dazzling-floating-sedgewick.md`) — 6 Phase 전부 완료
- **Phase 1 — SYSTEM_PROMPT / PROACTIVE_SYSTEM_PROMPT 재작성** (`llm.py`)
  - 1H 우선, 5W 심문 금지, 리액션 5종, 감각어
  - 망상·혼란 대응 / 절대 금지 / 마무리 섹션
- **Phase 2 — 입력 분류기 (5종 유형)** — `services/input_classifier.py`
  - Ollama 5개 모델 벤치 → qwen2.5:3b 90%/124ms 채택
  - LLM + 키워드 하이브리드 폴백
  - `config.py`: `classifier_enabled/model/timeout_sec`
  - `agent.py:_prepare_context`에서 병렬 실행
- **Phase 3 — 출력 필터** — `services/output_filter.py`
  - FORBIDDEN_PATTERNS (민감정보/의료) → SAFE_REDIRECT
  - REPLACEMENT_TABLE (좌절·수치심 유발 표현 → 부드러운 대체)
  - NEGATIVE_WORDS (슬프다/괴롭다/위급하다/곤란하다) 제거
  - `agent._submit_tts` + `full_reply`에 통합
- **Phase 4 — 오류 허용 설계 (KG 재구성)** — `retrieval.reconstruct_from_fragments`
  - `looks_fragmented()` — 말줄임표/주저토큰/다중 마침표 감지
  - AuraDB EchoRoute candidate 매칭 재활용
  - 힌트를 `retrieval_context` 앞쪽에 prepend → 기존 _build_memory_message로 전달
- **Phase 5 — 회상요법 단계 추적** — `conversation/therapy_state.py`
  - OPENING → EXPLORATION → EMOTIONAL_PEAK → CLOSURE 전이
  - turn count + 긍정 streak + 회상유도형 누적 + 피로 키워드 기반
  - 세션별 5분 idle → OPENING 리셋
  - `_PreparedContext.combined_guidance`로 classifier_guidance와 합침
- **Phase 6 — 피드백 → 회피주제 루프** — `services/avoidance_store.py`
  - SQLite `data/avoidance.db` (user_id, topic, count, last_seen)
  - AI 서버 신규 엔드포인트: `POST /avoidance`, `GET /avoidance/{user_id}`, `DELETE /avoidance/{user_id}/{topic}`
  - `retrieval.retrieve()` 모든 경로에서 `filter_texts_by_avoidance` 적용
  - caregiver `feedback.ts`: dissatisfied + comments(쉼표 분리) → AI 서버에 fire-and-forget 푸시

### 테스트
- 총 88개 테스트 전부 통과
  - test_conversation_state: 18
  - test_input_classifier: 19
  - test_output_filter: 19
  - test_fragment_reconstruction: 10
  - test_therapy_state: 11
  - test_avoidance_store: 11

### 멈춘 지점
- 6 Phase 전부 완료. 다음은 평가 실험 인프라 + 실사용 검증.

### 다음 할 일
- [ ] 평가 실험 인프라 — Do/No 액션 자동 카운트 스크립트 (책 26p 기준)
- [ ] 환자 웹 UI에서 실제 대화 수동 검증 (각 Phase 시나리오)
- [ ] 성능 테스트 (레이턴시 엔드투엔드)
- [ ] 전문가 블라인드 평가 툴 설계
- [ ] 보호자 앱 UI에 회피 주제 관리 화면 추가 (현재 API만 있음)
- [ ] 커밋 정리 — 현재까지 커밋 없음, 초기 커밋 + Phase별 태그로 구성

### 컨텍스트 상태
- 사용률: ~65%
- Fork 여부: N
- 블로커: 없음

---

## 2026-04-23 (세션 시작 — 하네스 엔지니어링 1~3단계)

### 오늘 한 일
- CLAUDE.md를 지도 스타일로 재정리 + 행동 규칙 추가
- `docs/PROGRESS.md` / `docs/FEATURES.md` 템플릿 생성

### 다음 할 일
- [ ] `/mcp` 로 불필요 connector 비활성화 (사용자가 실행)
- [ ] 하네스 엔지니어링 4~6단계 (검증/설계/유지보수) 적용

---

## 작성 규칙

각 세션 끝에 아래 형식으로 **위에** 추가 (최신이 위로):

```
## YYYY-MM-DD (한 줄 요약)

### 오늘 한 일
- 

### 멈춘 지점
- 

### 다음 할 일
- [ ] 

### 컨텍스트 상태
- 사용률: %
- Fork 여부: Y/N
- 블로커: 
```

**원칙**
- 40% 룰: 구현이 컨텍스트 40% 넘기면 작업 단위가 너무 큼 → 쪼개기
- 설계 논의 끝나면 Fork → 구현은 복제 세션에서, 결과만 메인으로
- 기능 완료 → 커밋 → 이 파일 업데이트 → `/clear` → 다음 작업
