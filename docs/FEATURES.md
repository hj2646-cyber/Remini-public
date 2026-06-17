# Remini 기능 체크리스트

조기 종료 방지용 전체 작업 리스트. ☐/☑로 관리.

## AI 서버 (`ai-server/`)

### 기반 인프라
| 기능 | 완료 | 비고 |
|------|:---:|------|
| FastAPI 기본 구조 | ☑ | `app/main.py` |
| 환자 대화 엔드포인트 (WebSocket + REST) | ☑ | |
| 메모리 저장 (`data/memories.json`) | ☑ | |
| 세션 관리 | ☑ | `conversation/state.py` |
| 환자용 웹 UI (얼굴감지, 시각·청각 피드백) | ☑ | `web/patient-react/`, `caregiver/.../patient-web/` |
| 환자 메인 화면 색채심리 팔레트 (논문 근거 난색) | ☑ | 김형희·최외선 2010 + Birren/Suenaga. METHODOLOGY 18. 단, patient-react/assets 빌드 필요 |
| Ollama + gemma4:31b | ☑ | `.env: OLLAMA_MODEL=gemma4:31b` |

### 대화 파이프라인
| 기능 | 완료 | 비고 |
|------|:---:|------|
| STT (faster-whisper) | ☑ | `services/stt.py` |
| TTS (Fish-Speech S2 Pro 메인 + MMS 폴백 / Qwen3-TTS Base 보이스 클로닝) | ☑ | `services/tts.py`, `fish_tts.py` (msgpack HTTP), `fish-speech-server/` (별도 프로세스 :8080), Fish Audio Research License (비상업 한정) |
| 회상요법 SYSTEM_PROMPT (책 원칙 반영) | ☑ | Phase 1 — `services/llm.py` |
| LLM 추론 파이프라인 | ☑ | `conversation/agent.py` |
| 프로액티브 트리거 (session_start / eyes_closed / silence) | ☑ | `services/proactive.py` |
| face_detected 트리거 | 비활성 | 재감지 시 튀는 문제로 영구 OFF |
| 매크로 키보드 (발화 끝 버튼) | ☑ | 하드웨어 연동 |

### 지식 그래프
| 기능 | 완료 | 비고 |
|------|:---:|------|
| Neo4j AuraDB 연결 | ☑ | `services/auradb_memory.py` |
| 이원화 KG 스키마 (생애기억 / 일상돌봄) | ☑ | |
| 설문조사 기반 노드 자동 적재 | ☑ | |
| RAG 연결 (질문→KG검색→LLM) | ☑ | `services/retrieval.py`, `graphrag_memory.py` |
| EchoRoute 라우팅 | ☑ | |

### 동적 메모리 학습
| 기능 | 완료 | 비고 |
|------|:---:|------|
| 대화 중 신규 지식 추출 | ☑ | `services/knowledge_extractor.py` |
| 자연스러운 재확인 루프 | ☑ | `services/knowledge_confirmation.py` |
| 보호자 승인 후 KG 저장 | ☑ | `services/caregiver_webhook.py` |

### 🔴 시스템 위험관리 루프
| 기능 | 완료 | 비고 |
|------|:---:|------|
| 회상요법 프로토콜 SYSTEM_PROMPT 적용 | ☑ | Phase 1 완료 |
| 입력 분류기 (5종 유형, qwen2.5:3b 124ms) | ☑ | Phase 2 완료 — `services/input_classifier.py` |
| 출력 필터 (정규식+치환표) | ☑ | Phase 3 완료 — `services/output_filter.py` |
| 위기 가드(_CRISIS_REPLY) | ☑ | `conversation/agent.py:366-397` |

### 🟡 오류 허용 / 단계 추적 / 피드백 루프
| 기능 | 완료 | 비고 |
|------|:---:|------|
| 오류 허용 설계 (KG 재구성) | ☑ | Phase 4 완료 — `retrieval.reconstruct_from_fragments` |
| 회상요법 단계 추적 (OPENING/EXPLORATION/PEAK/CLOSURE) | ☑ | Phase 5 완료 — `conversation/therapy_state.py` |
| 피드백 → 회피주제 루프 | ☑ | Phase 6 완료 — `services/avoidance_store.py` + `/avoidance` API + `feedback.ts` 연동 |

## API 서버 (`caregiver/artifacts/api-server/`)

| 기능 | 완료 | 비고 |
|------|:---:|------|
| Express 기본 구조 | ☑ | |
| 보호자 인증 | ☐ | |
| 환자-보호자 매핑 | ☑ | |
| 대화 로그 조회 API | ☑ | |
| pending-knowledge 승인 API | ☑ | |
| feedback API (저장) | ☑ | 정책 반영은 Phase 6 |
| 알림 기능 (Alert 노드 저장) | ☑ | `routes/alerts.ts` — AI 서버 webhook → Neo4j Alert |
| Web Push 발사 (VAPID, web-push) | ☑ | `routes/push.ts`, `web-push.ts` — 위험 발화 시 보호자 PWA 잠금화면 푸시 |

## 보호자 앱 (`caregiver/artifacts/caregiver-app/`)

| 기능 | 완료 | 비고 |
|------|:---:|------|
| Expo 기본 구조 | ☑ | |
| 로그인 화면 | ☐ | |
| 환자 모니터링 대시보드 | ☑ | `app/(tabs)/index.tsx` |
| 대화 로그 뷰어 | ☑ | `app/conversation/[id].tsx` |
| 지식 관리 화면 | ☑ | `app/knowledge/` |
| 피드백 입력 UI (별점 + 만족/불만족) | ☑ | `app/feedback/[conversationId].tsx` |
| 알림 수신 (앱 내 목록) | ☑ | `app/(tabs)/alerts.tsx` |
| PWA 매니페스트 + 서비스 워커 | ☑ | `public/manifest.webmanifest`, `public/sw.js`, `app/+html.tsx` (iOS apple-touch-icon, theme-color) |
| Web Push 구독 UI (iOS 16.4+/Android/Desktop) | ☑ | `components/PushNotificationCard.tsx`, `hooks/usePushSubscription.ts` — alerts 탭에 토글 + 테스트 버튼 |
| **잠금화면 푸시 알림** (위험 발화 즉시) | ☑ | AI 서버 risk_level=danger → webhook → API 서버 web-push 발사 → 폰 잠금화면. iOS 는 "홈 화면에 추가" PWA 필수 |
| 모바일 빌드 | ☐ | EAS dev build 는 iOS Apple Dev Program $99/년 필요 — 현재 PWA 로 대체 |
| Expo Go 폰 시연 (외부 LTE 가능) | ☑ | `bash demo.sh` — cloudflared 5000 + Expo tunnel 8081 + ASCII QR 자동 |

## 평가 실험 (발표 25~29p)

| 기능 | 완료 | 비고 |
|------|:---:|------|
| 설문지 설계 (29문항) | ☑ | 발표 27p |
| 24명 피험자 실험 (반복측정 ANOVA 2×2) | ☐ | |
| Do/No 액션 자동 카운트 스크립트 | ☐ | 책 26p 기준 |
| 전문가 블라인드 평가 툴 | 🟡 | 14항목 정리 + DSLM v1 50턴 + DSLM v2 30턴 자연흐름 + base ablation 30턴 산출. Gems 패키지 구성 완료. **새 구성 (안전10+위험5+안전10+위험5) DSLM 30턴 + 사용자 Gems 30턴 대기.** |
| 치매센터·회상요법학회 섭외 | 🟡 | 일부 섭외완료 (발표 29p) |

## 인프라 / 하네스

| 항목 | 완료 | 비고 |
|------|:---:|------|
| `start.sh` / `stop.sh` / `status.sh` / `restart.sh` / `demo.sh` | ☑ | `start.sh`가 `demo.sh` 자동 호출 (cloudflared+Expo tunnel) |
| 외부 노출 터널 (보호자 앱 5000 cloudflared / 환자 PWA 8000 ngrok) | ☑ | 동시 무료, ngrok-free 1터널 제약 우회 |
| 통합 `.env` | ☑ | |
| 하네스 엔지니어링 1~3단계 (CLAUDE.md/MCP/PROGRESS) | ☑ | |
| 배포 자동화 | ☐ | |
| 로그 수집/모니터링 | 🟡 | `session_logs.ndjson` 부분 |

---

## 사용법
- ☐ → ☑ 로 바꾸며 진행, 부분 진행은 🟡
- 새 기능은 해당 섹션에 추가 (섹션 없으면 새로 만들기)
- 완료 기준: 코드 작성 + 테스트 통과 + 커밋 완료
