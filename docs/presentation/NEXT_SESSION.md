# 다음 세션 인계 — 즉시 이어가기

> 현재까지 진행 + 다음 액션 + 대기 중 작업 명확히. 새 세션에서 이 파일만 읽으면 즉시 진행 가능.

마지막 갱신: 2026-06-03 (결과) — **Ablation 완료 + 결과 적재 ✅**. judge(gpt-5.4 13문항 ×3, 192채점, 중복 dedup) → stats 완료. **핵심 결과**: 7 arm 중 **reminiscence 사진 자동트리거만 유일하게 강효과 — 단 제거 시 품질↑** (전체 Δ−0.47, p=.008, dz−1.80; 3영역 전부 상승: 상호작용 −0.71/임상 −0.43/안정 −0.37). CAG 약기여(임상 +0.27 비유의), 나머지 5개 Δ≈0 비유의. full=2.69/5. **해석**: PUSH→PULL(METHODOLOGY 23) 직관의 정량 확인 + **⚠ LLM-judge 텍스트만이라 사진 multimodal 효과 미반영**(사진 권유 멘트만 맥락단절로 감점 → "reminiscence 무용"이 아니라 "텍스트상 사진 권유가 흐름 끊음"). 적재 끝: RESULTS(ablation 섹션)·FAILURES F12·EXPERIMENTS_LOG·METHODOLOGY 24. 산출물 `experiments/data/results/ablation_report.md`+`ablation_summary.csv`. **🔥 다음 옵션**: (1) reminiscence 트리거 PUSH→PULL 연장(간격↑ or 입력유형 기반 발동) (2) 40세트 확대(현 pilot 8세트, reminiscence·CAG만 효과 뚜렷) (3) 사진 multimodal 효과 반영 평가(사람/멀티모달 judge) (4) 발표 슬라이드(over-engineering 정량발견 + 평가한계 정직). **OpenAI 키 채팅 노출됨 → revoke 권장**. **⏸ pairwise 검증 보류**: 절대채점(21, n=8) 둔감으로 reminiscence 외 대부분 비유의 → 민감도 높은 pairwise(full vs 각 ablated A/B) 시도. 스크립트 준비완료(`23_ablation_pairwise_judge.py` + `24_ablation_pairwise_stats.py` + `pairwise_watchdog.sh`), 6/168 채점 중 **OpenAI 크레딧 소진**으로 중단. 재개법: ① OpenAI 충전 후 `setsid nohup bash experiments/scripts/pairwise_watchdog.sh &`(같은 gpt-5.4 일관 유지) ② 또는 Groq 무료(GROQ_API_KEY 있음 — `23`의 `OpenAI(base_url="https://api.groq.com/openai/v1")` + model=`llama-3.3-70b-versatile` 분기 추가 필요, judge 품질·일관성 trade-off). **메인 결과(절대채점 192, gpt-5.4)는 이미 완전·적재됨**.

직전 (06-03 본런 가동) — **회상요법 품질 Leave-one-out Ablation 본런 가동 ✅ (8 arm × 8 카테고리 × 30턴, 본 시스템 파이프라인 재현 + 실제 AuraDB Neo4j)**. 사용자 요청: "레이어 하나씩 다 깎아 LLM-judge 로 품질 측정" (CAG 포함). **arm 8개** = full(전부 ON) + 7 leave-one-out(`−cag`/`−retrieval`/`−system_prompt`/`−classifier`/`−therapy_state`/`−reminiscence`/`−output_filter`). `−fine_tune` 은 base 모델이 ollama 미등록(30GB 변환 필요)이라 제외 — 단 fine-tune 기여도는 이미 stage별 before/after 로 측정됨. **신규 3 스크립트**: `experiments/scripts/20_ablation_run.py`(`app.services` import → `run_agent` 전처리를 배치·멀티턴 재현, arm 플래그 토글, 환자발화 phase2.csv 30턴 고정 통제) / `21_ablation_judge.py`(gpt-5.4 13문항 절대 1~5점, self-consistency 3) / `22_ablation_stats.py`(full 대비 Δ=레이어 기여도, Wilcoxon+Cohen dz+Bonferroni). **retrieval = 진짜 AuraDB** — Neo4j 에 P001~P040+P999 전부 시드 확인됨(페르소나당 59~112 GraphEntity, 17687 reverse 터널 필수). **smoke ✅** (error 0, 회상화법 정상). **함정 2개 해결**: ① classifier(e4b)가 메인(stage25 18GB)과 ollama 동시 사용 시 2초 timeout→키워드 fallback (→ `−classifier` arm 과 차이 소멸) → 본런에 **e4b warmup + classifier_timeout 15s** 적용. ② CAG(~27k) arm 수용 위해 **num_ctx 32768** (.env 8192는 CAG off 전제값). **🔥 새 세션 즉시 할 일**: (1) 본런 완료 확인 — `wc -l experiments/data/responses/ablation_responses.jsonl` (**64** = 완료) + `tail experiments/data/responses/ablation_run.log` (`✅ ablation responses done`). 미완이면 같은 명령에 `--resume` 붙여 재개. (2) judge — `ai-server/.venv/bin/python experiments/scripts/21_ablation_judge.py --self-consistency 3` (gpt-5.4 ~192 호출). (3) stats — `ai-server/.venv/bin/python experiments/scripts/22_ablation_stats.py` → `experiments/data/results/ablation_report.md` 레이어 기여도 랭킹. (4) 결과 → RESULTS.md ablation 섹션 + EXPERIMENTS_LOG 결과 갱신 + (Δ≤0 레이어 있으면) FAILURES. **주의**: 본런 도는 동안 17687 터널 유지(끊기면 retrieve 가 simple_retrieve 폴백 — 에러 아니지만 context 빈약). **본런 PID 1414151** (최초 1366922 → 도중 사용자가 Neo4j 실수로 끔 → retrieve 쓰는 arm(full 후반·−cag) 세트가 `Couldn't connect 17687` 로 에러 → Neo4j 복구 후 `--resume` 재개, PID 갱신). 정상 보존 9세트(full C1·C2 + −retrieval 7)는 skip, 에러+미실행 55 재개. **jsonl 에 에러 줄(14) 잔존하나 `21`/`22` 가 비-error 만 처리 → 결과 무영향**. 완료 판단: 로그에 `✅ ablation responses done` + 유니크 (arm,scenario) 정상 64 (단 `wc -l` 은 에러+재실행 중복 포함이라 64 초과 가능 — 유니크 dedup 으로 세야 정확). 교훈: 터널/Neo4j 끊기면 `RetrievalService.retrieve` 가 폴백 아니라 예외→세트 에러 (retrieve 호출이 try 밖). METHODOLOGY 24 적재됨.

직전 (2026-06-01) — **회상 PUSH→PULL 밸런싱 (프롬프트·로직 5곳, 재학습 無) + before/after 발표 evidence 적재 ✅**. 사용자 피드백("회상요법만 갈기는 느낌, 센스있게 일상 대화도 하게") → 진단: 회상을 PUSH 하는 **4겹 레이어** 누적 (① reminiscence 사진 자동 트리거 **86장 활성**, 4/5/7턴 고정 루프 / ② therapy_state 3턴이면 EXPLORATION 자동진입+매턴 "장면 키워라" / ③ input_classifier 회상유도형 가이드 / ④ SYSTEM_PROMPT "회상 파트너" 정체성). **CAG_ENABLED=false** 라 회상요법 책 395KB 는 현재 LLM 미주입(범인 아님). 처방 = **PUSH→PULL** (환자가 옛 기억 꺼낼 때만 따라가고 평소엔 일상). 사용자 결정: 범위=**프롬프트·로직만**, 밸런스=**반반**. **수정 5곳**: `llm.py` SYSTEM_PROMPT 정체성+화법(일상 잡담·맞장구·농담 허용, 매턴 회상질문 X) / `input_classifier.py` 일상확인형 가이드 신설(None→일상 말동무) / `therapy_state.py` EXPLORATION 진입 3→5턴+문구완화 / `reminiscence_topics.py` 트리거 4→6·7→12턴. py_compile OK. **before/after 통제 비교**: `ai-server/scripts/compare_reminiscence_balance.py` — `git show HEAD` 로 uncommitted 수정 전 4개 모듈 로드해 before 재현(추측 0), 2 시나리오(A 일상잡담 6턴 / B 회상신호 3턴) 멀티턴, retrieval/KG·CAG off(바뀐 5곳만 변수), gemma4:e4b 분류기 warmup. **결과**: 시나리오 A 회상유도 마커 6→3(**−50%**), 질문 7→4, EXPLORATION 진입 3→5턴, 사진 첫 권유 4→6턴 (대표 턴5: before "이 사진 볼까요? 팔씨름 해보셨어요?" 맥락단절 vs after "지금은 창밖 풍경이 어떤가요?" 일상유지). 시나리오 B before·after 모두 턴1 EXPLORATION → **PULL 유지(회상 기능 약화 X)**. 적재: `evidence/reminiscence_balance_before_after_2026-06-01.md`(턴별 비교표+관찰) + `logs/reminiscence_balance_raw_2026-06-01.json` + EXPERIMENTS_LOG 시간순 row + METHODOLOGY 23 (mixed-initiative Horvitz CHI1999 + person-centered Kitwood 1997) + RESULTS "대화 정책" 섹션. **사용자 즉시 액션**: (1) **`bash restart.sh`** 로 ai-server 재시작 (수정 5곳 반영), (2) 환자 화면에서 일상 대화 몇 턴 → 회상 안 끌려가는지 + 옛날 얘기 꺼내면 따라오는지 체감, (3) 너무 회상 잦으면 `reminiscence_topics.py` INITIAL_PROMPT_AFTER 6→8·DEFAULT_TRIGGER_INTERVAL 12→15 / 너무 안 하면 반대로. **다음**: 체감 후 트리거 숫자 미세조정 / (선택) 파인튜닝에 일상 잡담 페어 비중↑ 재학습 (근본 레이어 ④ 모델 자체).

직전 (2026-05-28) — **전문가 블라인드 평가 시나리오 P001 김영자 재설계 + Remini·Gemini 2.5-flash 재생성 ✅**. 사용자가 올린 기존 `docs/presentation/회상요법_대화로그_{remini,gemini}.docx` 가 페르소나-KG 불일치(남편을 보호자명 "이정호"로 부름 등) + 일부 14평가항목을 텍스트 로그만으론 채점 불가(Q3 발음·Q10 보호자알림 프로토콜·Q13 민감주제)였던 문제 발견 → **평가항목은 두고 환자 발화(시나리오)를 항목 채점 가능하게 재설계**. P001 김영자 KG 정본 확인(neo4j 는 **데스크탑 Neo4j Desktop**, H200 에선 17687 reverse 터널로만 접근 — 한참 헤맴, `project_neo4j_aura.md` 메모리 보정함). 김영자=1948생·전주·초등교사30년·어머니 **박복례**(가장 그리워함)·남편 이정호·첫딸 이은정·무릎관절염·혈압약·이미자·뜨개질. 30턴 재설계: Q3 단편발화, Q5·Q7·Q11 보강, Q10 응급강화, **Q13 = 어머니 박복례 상실 회피 런타임 전환**(KG 에 남편 사별 정보 없어 사별 대상 어머니로), 치매 단편 발화 톤(`…`, 마침표 떡칠 금지 — 사용자 지적). **Remini**(ai-server `RetrievalService.retrieve` + `stream_reply`, `remini-stage25-book`) + **Gemini 2.5-flash**(동일 retrieval+SYSTEM_PROMPT 에 LLM만 교체, `12_phase2_run.py` REST 방식, key 는 `.env GEMINI_API_KEY`) 각 30턴 생성. 산출: `docs/presentation/evidence/phase2_expert_scenario_P001_2026-05-28.md`(30턴 비교표+관찰) + `docs/presentation/회상요법_대화로그_{remini,gemini}.docx`(모델명판 — **블라인드 익명화는 사용자가 직접 이름 변경**). 핵심 관찰: Gemini 가 `_build_time_context` 위치·날씨("부산 금정구 28도")를 응답에 노출, Remini 는 같은 입력에도 억제(치매 혼란 방지 우위). 둘 다 #27 자살암시에 1393 미발화(F9/F11 trade-off). **다음**: 사용자 블라인드 배포 / (선택) 추가 페르소나 시나리오 / 발화 미세조정 / Phase B 전문가 설문 수집.

직전 (2026-05-26 11:09) — **Stage 5 STT LoRA 학습 + before/after 평가 완료 ✅**. Qwen3-ASR-1.7B + peft LoRA (r=16, target=q/k/v/o_proj, bf16) on AI Hub 107 (263k pair / 2,048시간) → **WER 28.44% → 7.40% (−21.04%p, 3.85× 개선)** / CER 9.09% → 2.94% / 환각 0/200 (ghost613 Zeroth trauma 해소). 학습 5시간 7분 / H200 단일 / GPU 16.5GB / 16,112 steps. 회상요법 결정적 오인식 (찍기/찢기, 들어가잖아/들어가지 않어, 큰맘/컵만, 선뜻/선택) LoRA 후 모두 해결. **다음 = ai-server STT 통합** (`stt.py _get_qwen()` 에 LoRA adapter 분기 + `.env QWEN_ASR_USE_ADAPTER=true` + `QWEN_ASR_ADAPTER_PATH=finetune/checkpoints/qwen3_asr_lora_v1`). vLLM streaming sidecar 측에도 동일 adapter merge 또는 로드 필요. RESULTS.md Stage 5 섹션 + EXPERIMENTS_LOG 시점 row 2개 + FINETUNE_BRANCHES Stage 5 결과 모두 갱신. **사용자 즉시 액션**: (1) AI Hub API key revoke (https://aihub.or.kr 마이페이지), (2) ai-server STT 통합 적용 여부 결정 (직접 stt.py 분기 / vLLM merge / 그대로 두기), (3) 발표·논문 narrative 에 Stage 5 결과 (WER -74% relative) 박을 위치 결정.

직전 (2026-05-25 19:30) — **STT Fine-tune 데이터 준비 완료 (Stage 5 시작점) ✅**. AI Hub 107 (자유대화 노인남녀) 부분 다운 (Plan A 스튜디오+AI스피커 52G + Plan B 음성수집도구 1zip 30G) → 자동 unzip (10 zips) → 30_explore → 31_prepare 완료. **데이터 263,049 pair / 2,048시간** (`finetune/data/aihub_107_dataset/{train,eval}` 60GB). 다음 = **32_qwen3_asr_lora.py 학습 시작** (4bit QLoRA r=16, audio encoder freeze, target=q/k/v/o_proj, lr=1e-4). 예상: 풀 epoch ~10-22h / max-train 50k ~3-5h / max-steps 200 테스트 ~1h. 학습 후 33_qwen3_asr_eval.py (base vs +lora WER + CER + 환각 검출, 메모리 룰 before/after). 베이스 모델 ghost613 turbo-korean 환각 trauma → Qwen3-ASR-1.7B 채택. EXPERIMENTS_LOG / METHODOLOGY §22 / FINETUNE_BRANCHES Stage 5 모두 갱신. **사용자 즉시 액션**: (1) 학습 옵션 결정 (풀/빠른/테스트) → 32_train 시작 (사용자 직접 실행 권장, GPU 점유 큰 작업), (2) ai-server 학습 동안 꺼진 상태 유지, (3) AI Hub API key (`<AIHUB_API_KEY>`) **revoke** (채팅+다운 명령 로그 노출됨).

직전 (2026-05-23~24) — **TTS 백엔드 교체 (Supertonic → Fish-Speech S2 Pro → Supertonic-3) + 응답 latency 최적화 ✅**. fishaudio/s2-pro (5B BF16, gated HF) 자체 호스팅 → ai-server `fish_tts.py` (msgpack HTTP) → `TTS_PROVIDER=fish`. 사용자 청취 평가에서 한국어 자연스러움 Supertonic 대비 압승. METHODOLOGY 21, EXPERIMENTS_LOG 2026-05-23, FEATURES.md TTS 라인 갱신. **사용자 즉시 액션**: (1) HF 토큰 revoke (https://huggingface.co/settings/tokens — 채팅 노출), (2) `bash stop.sh && bash start.sh` (start.sh 가 `TTS_PROVIDER=fish` 감지하여 fish-speech-server :8080 자동 부팅, 약 30-60초 모델 로딩), (3) 환자 UI 에서 실제 대화 검증, (4) v1.5 weights (`fish-speech-server/checkpoints/fish-speech-1.5/`) 정리 결정 — 사용자 허락 받고 삭제. **라이선스 주의**: Fish Audio Research License = 비상업/연구 한정 → 경진대회 상금·상업 배포 시점 Supertonic 으로 fallback.

직전 (2026-05-14 저녁) — **Phase 2 H2 LLM-as-Judge 전체 완료 ✅** — 40 시나리오 × DSLM(`remini-stage25-book:latest`) vs Gemini 2.5-flash × OpenAI `gpt-5.4` × self-consistency 3 (counterbalanced). 80 응답(48.5분) + 120 judge call (27.4분, 708,805 token). **결과: 13항목 + 3영역 모두 Bonferroni α=0.0167 통과, 전체 Δ +0.70 (Cohen's dz=2.16, 매우 큰 효과), 선호 113:7 (binomial p=4.77e-26), 39/40 시나리오에서 DSLM 우세.** Q별 강점: Q10 응급(+1.41), Q13 민감주제 전환(+1.40), Q8 진단회피(+1.36), Q2 정서지지(+1.09). **Q12 KG 사실성에서만 DSLM 패배 (Δ −1.22) → F11 신설 (finetune trade-off honest negative finding)**. RESULTS Phase 2 섹션 / EXPERIMENTS_LOG / FAILURES F11 / H2 PPT 요약 Section 10 / evidence 4 파일 모두 갱신. **사용자 다음 액션 검토**: (1) 발표·논문 narrative 에 Q12 trade-off 어떻게 박을지, (2) Phase 2 전문가 보조 검증 (블라인드 5~7명 설문) 진행 여부, (3) Q12 복구용 v2 mini distill (KG-grounding 강화) 결정.

직전 (2026-05-14 오후) — **성능판(시연영상 토글판)에도 위험발화 → 보호자 폰 PWA 푸시 통합**. 본 시스템 `agent.py` 의 webhook 호출 (5월 12-13일 추가) 이 성능판 복사본에는 빠져있었음 → 동일하게 패치: `import notify_caregiver` / `_finalize_fire_and_forget` 에 `loop` 인자 + webhook 호출 / `_schedule_notify_caregiver` 함수 / 호출부 2곳 loop 전달. `performance/SCENARIOS.md` preset 5 대본에 위험발화 → 폰 푸시 시퀀스 + 사전 준비 + 트러블슈팅 추가. 본 시스템·성능판이 같은 caregiver API (5000) 향함 → 사전 준비 (보호자 폰 PWA 1회 설치·구독) 동일하게 사용. py_compile OK. **사용자 액션 (시연 검증)**: 본 시스템·성능판 둘 다 끄고 다시 띄우기 (`bash restart.sh` + `bash performance/restart.sh`). 보호자 폰 PWA 미설치라면 이전 갱신의 시연 검증 5단계 1회만 거치면 영구 동작.

직전 (2026-05-13) — **PWA Web Push 알림 시스템 완성** (위험 발화 → 보호자 iPhone 잠금화면 푸시). 백엔드: `caregiver/artifacts/api-server/src/web-push.ts`, `routes/push.ts` (VAPID, subscribe/unsubscribe/test), `routes/alerts.ts` fire-and-forget 통합. 프론트엔드: `caregiver-app/public/{manifest.webmanifest,sw.js,images/icon-{192,512}.png,apple-touch-icon.png}`, `app/+html.tsx` (iOS PWA meta), `hooks/usePushSubscription.ts`, `components/PushNotificationCard.tsx` (alerts 탭 토글). VAPID 키 `.env` 영구 저장. **타입체크 통과** (보호자 API + 보호자 앱). **사용자 액션 (시연 검증)**: ① 보호자 API 5000 재시작 (`web-push` 의존성 + 라우트 새로 추가됨), ② 보호자 웹앱 8082 cloudflared HTTPS 터널, ③ iPhone Safari → 보호자 웹앱 접속 → 공유 → "홈 화면에 추가" → 홈 아이콘으로 다시 열기 (standalone) → 환자 선택 → 알림 탭 → "잠금화면 푸시 알림 받기" → 권한 허용 → "테스트" 버튼으로 즉시 도착 확인 → 환자 웹에서 위험 발화 ("다 끝내고 싶어") → 폰 잠금 상태로 푸시 도착. iOS 16.4+ 필수.

직전 (2026-05-12 밤) — **Phase 1 H1 RAGAS 표준 평가 4 judge LLM 전수 시도 → 모두 실패 → 자체 hybrid 메인 확정 (F10)**. gemma4:31b (226s/trial, NaN 67%) / qwen3:14b (110s, NaN 100%) / Groq Llama 3.3 70B (213s, NaN 40%) / vLLM Qwen2.5-32B-AWQ (170s, NaN 100%) — 모두 한국어 단답 fact-QA 에 RAGAS Faithfulness 부적합 (영어/긴 응답 가정 prompt template). vLLM 셋업 완료 (port 8001, DeepGEMM 비활성 env var, Ollama 와 GPU 공존). 결론: **자체 hybrid 메트릭 (Context Precision Δ=+0.293, p=1.4e-33, d=0.85 — 이미 끝) 가 메인 결과**. 학술 표준 보강은 옵션 (GPT-4o $30 / 6시간 또는 vLLM Faithfulness 제외 3메트릭 overnight). FAILURES F10 + LESSONS L13 + EXPERIMENTS_LOG 누적 기록 완료. **다음 세션 즉시 이어갈 수 있는 자료 정리 끝**.

직전 (2026-05-12 저녁) — 디스크 175GB 회수 + Stage 2.6 폐기 + Stage 2.5 메인 회귀 확정. 사용자 결정: Stage 2.6 의 1393 emergent 손실 (F9) 이 따뜻한 톤 +1 보다 큰 비용 → 메인 모델은 `remini-stage25-book:latest`. 디스크 87%→67%, finetune 167G→45G.

직전 (2026-05-12 오전) — **P999 보편 어르신 시연용 KG (개인 식별자 0) Aura 시드 ✅**. 치매환자 시연 대상자의 생애기억정보를 모르는 상황 대비, 모든 노드를 **역할·보편 명사만**으로 채운 추상 페르소나 1명 구축. Persona.name="어르신", 모든 가족/친구/지명/연도 등 개인 식별자 제거 (예: name="아들"/"어머니"/"어릴 적 단짝 친구"/"고향 시골 마을"/"오래된 가족 사진첩"). 81 entity + 2 Graph hubs, 83 1-hop edges. **시연 접속: ID "P999" 직접 입력 또는 이름 "어르신" 입력 — 둘 다 PersonaDirectory.resolve_persona_id / resolve 로 매핑.** AuraDBMemory.retrieve 동작 검증 (아들→Person:아들 anchor / 어머니→Person:어머니 anchor / 비 오는 날→부침개·막걸리·빗소리·어머니 / 혈압약→Routine:보리차와 함께 혈압약 / 옛 친구→어릴 적 단짝 친구 모두 OK). **사용자 작업: `bash restart.sh` 로 ai-server 재시작 → PersonaDirectory 캐시 새로고침.** 직전 Phase 1 H1 (GraphRAG > VectorRAG) DSLM 검증 그대로 유효, OLLAMA_MODEL=remini-stage25-book.

---

## 현재 상태 (지금까지 끝낸 것)

### ✅ 완료
1. **데이터 구축**:
   - NVIDIA Personas 30 KG → 합성 페어 300
   - KorEmpathetic distill v2 페어 500
   - AI Hub 71703 다운 + 파싱 + 1.77M 환자 발화 추출
   - 자체 conversations.db → 자연 페어 401 → **3명 검수자 (검수자 A·B·C) 검수 → 보수적 merge → 1,129 페어 통과**
   - Cohen's κ Fleiss 0.54 (moderate)
2. **Stage 1 (KoAlpaca)** 시도 → catastrophic forgetting → **폐기** (FAILURES F2)
3. **Stage 1 Proper** ✅ 성공 — 6,929 페어 (검수 + 합성 + distill + 71703 5K)
   - train_loss 0.258, eval_loss 0.246 (overfit X)
   - 117분 학습 (H200 NVL, 4bit QLoRA)
   - GGUF Q4_K_M 변환 + Ollama 등록 (`remini-stage1-proper:latest`)
   - before/after 비교: 부정어 ↓, 다양성 ↑, 회상 유도 ↑
   - Safety 7/10 (3 false positive — classifier 한계)
   - **2026-05-06 오후: 본 시스템 적용** — `.env` `OLLAMA_MODEL=remini-stage1-proper:latest` (ai-server 재시작 필요)
   - 폐기 stage1 36G 정리 (`lora_stage1/`, `lora_stage1_gguf/`, Ollama `remini-stage1:latest`) — F2 증거 텍스트는 `evidence/`에 보존
4. **발표 자료 누적**:
   - `docs/presentation/EXPERIMENTS_LOG.md` (시간순 시도)
   - `docs/presentation/RESULTS.md` (수치 결과)
   - `docs/presentation/FAILURES.md` (F1~F6 negative results)
   - `docs/presentation/LESSONS.md` (정제 메시지)
   - `docs/presentation/IDEAS.md` (I-1~I-30 + C-1~C-17 사용자 체크)
   - `docs/presentation/TECH_STACK.md` (15 카테고리)
   - `docs/presentation/FINETUNE_BRANCHES.md` (7 단계 plan)
   - `docs/presentation/SLIDE_OUTLINE.md` (13 슬라이드)
   - `docs/presentation/evidence/` (before/after txt, safety txt 등)

### 🔄 대기 중 (사용자 작업)

#### 🔥 Phase 1 H1 RAGAS 표준 보강 — **다음 세션에서 결정 + 실행**

자체 hybrid 메트릭 결과는 이미 강력 (p=1.4e-33, d=0.85, F10 참조). 학술 표준 RAGAS 보강 가는 3 가지 옵션:

**옵션 1: GPT-4o $30 / 6시간 — 학술 깨끗 (추천)**
```bash
# .env 에 OPENAI_API_KEY 박기
# 그 후 (다음 세션에서)
cd experiments && source .venv/bin/activate
# 08b 스크립트 ChatGroq → ChatOpenAI 로 수정 (model="gpt-4o-2024-08-06")
python scripts/08b_phase1_ragas_standard.py --cells 1,2,3,4
```
GPT-4o 가 한국어 단답 fact-QA 도 잘 처리 → Faithfulness NaN 거의 없음 + 6시간 안에 1080 trial 완료. 학술 표준 깨끗.

**옵션 2: vLLM Qwen2.5-32B-AWQ 그대로 + Faithfulness 제외 3메트릭 overnight — 무료**
```bash
# vLLM 이미 띄워져 있으면 재사용 가능 (port 8001, DeepGEMM 비활성 env var)
# 죽었으면 다시 띄우기:
cd experiments && source .venv/bin/activate
VLLM_USE_DEEP_GEMM=0 VLLM_MOE_USE_DEEP_GEMM=0 vllm serve Qwen/Qwen2.5-32B-Instruct-AWQ \
  --port 8001 --max-model-len 8192 --gpu-memory-utilization 0.55 --enforce-eager

# 08c 수정 — Faithfulness 메트릭 제거 (3 메트릭만)
python scripts/08c_phase1_ragas_vllm.py --cells 1,2,3,4
```
20-30시간 overnight. Faithfulness 는 자체 hybrid 결과 사용. 80% 학술 표준.

**옵션 3: 자체 hybrid 메인 그대로 + 학술 정당화 명시 — 무료, 0시간 (현재 결정)**
- 결과 이미 끝 (`data/results/ragas_scores.csv` 540 rows)
- 발표/논문: "RAGAS 4 메트릭의 fact-QA 도메인 변형 (Es et al., 2024)" 정직 명시
- F10 + L13 contribution 으로 "4 judge LLM 비교 실패" 자체를 발견으로

→ **옵션 2 또는 3 추천** (옵션 1은 OpenAI 비용 + 사용자 외부 API 회피 의도).

#### 그 외 대기

1. ~~**회상요법 책 PDF/OCR 전송**~~ ✅ 2026-05-07 10권 수신 + 처리 완료
2. **🔥 SEED 22 페어 작성** — `finetune/data/v2/SEED_TEMPLATE.csv` 의 `assistant_response` 칸 22 행 채우기 (카테고리당 2-3개). v2 generation 진행에 필수.
3. **(선택) 추가 AI Hub 데이터 링크 전송**

### ✅ 완료 — Phase 1 H1 RAGAS 표준 4 judge 전수 시도 (2026-05-12 밤)

| Judge | Trial 당 | NaN Faith | 1080 trial 예상 | 비고 |
|---|---|---|---|---|
| gemma4:31b 로컬 | 226s | 67% | 68h | 단일 GPU compute-bound |
| qwen3:14b 로컬 | 110s | 100% | 33h | 작은 모델 statement extraction 실패 |
| Groq Llama 3.3 70B | 213s | 40% | 64h | Free tier 30 RPM 한도 |
| vLLM Qwen2.5-32B-AWQ | 170s | 100% | 51h | continuous batching 효과 X (sequential pattern) |

**FAILURES.md F10 / LESSONS L13 / EXPERIMENTS_LOG 시간순 기록 완료**.

핵심: RAGAS sweet spot = GPT-4o + 영어 + 긴 응답. 한국어 단답 fact-QA + 로컬/무료 = 비현실 + NaN 다수. 자체 hybrid 가 fact-QA 에 더 적합.

생성된 자료:
- `experiments/scripts/08_phase1_ragas.py` — 자체 hybrid (메인, 1080 trial 1분, deterministic)
- `experiments/scripts/08b_phase1_ragas_standard.py` — Groq judge (사용 안 함, 참고용)
- `experiments/scripts/08c_phase1_ragas_vllm.py` — vLLM judge (사용 안 함, 다음 세션 재사용 가능)
- `experiments/data/results/ragas_scores.csv` (540 rows, 메인 결과)
- `experiments/data/results/ragas_standard_cell1.csv` (Groq 5 trial pilot)
- `experiments/data/results/ragas_vllm_cell1.csv` (vLLM 5 trial pilot)

vLLM 서버 (port 8001) 현재 살아있을 수도 — 다음 세션에서 `curl http://127.0.0.1:8001/v1/models` 로 확인.

### ✅ 완료 — Phase 1 H1 DSLM 1차 검증 (2026-05-11)
- 페르소나 30 + 시나리오 270 (8 카테고리: T-거주지/직업/학력, F-반대/비존재/시점오류, ADV-부분일치/시점근접/유사인물)
- Cell 1 (GraphRAG+DSLM) / Cell 3 (VectorRAG+DSLM) 각 270 trial 응답 생성 (각 trial 0.6초, 총 ~5분, 0 errors)
- `experiments/scripts/08_phase1_ragas.py` — RAGAS 4메트릭의 fact-QA 변형 (substring 토큰 ≥50% OR cosine ≥0.35 hybrid). LLM-Judge 미사용 (gemma4:31b 1080 trial 4.5일 비현실).
- **결과**: Context Precision Δ=+0.293 (p=1.4e-33, d=0.85 large), Context Recall (p=1.8e-28, d=0.76). H1 부분 입증.
- T-패턴 + F-비존재 → GraphRAG 1.000 (yaml 통째라 정답 항상 포함), VectorRAG 0.27~0.46
- F-반대 / ADV-* → 둘 다 0 (GT="F" 단답이라 hybrid 메트릭 미스, v2 보완 필요)
- 결과 산출: `experiments/data/results/ragas_scores.csv` (540 rows), `ragas_summary.md`
- RESULTS.md / EXPERIMENTS_LOG.md 갱신 완료

### ✅ 완료 — Stage 2 KG-aware (2026-05-06 13:06)
- distill: 874 페어 (15분, stratified persona group sampling)
- 학습: train_loss **0.2169** (Stage 1 Proper 0.258 보다 ↓), 13.9분, LoRA r=16/α=32 누적, Stage 1 replay 30%
- GGUF Q4_K_M 18.7GB → Ollama `remini-stage2-persona:latest`
- after_stage2: ⭐ **위기 시나리오에 `1393` 자살예방 상담 전화 자동 추가** (페르소나 메타 학습 효과)
- safety: 7/10 (Stage 1 Proper 동일, replay buffer 가 forget 방어)
- `.env OLLAMA_MODEL=remini-stage2-persona:latest` 자동 갱신
- **사용자 작업**: `bash restart.sh` (ai-server 재시작 — 본 시스템에 Stage 2 적용)

### 🆕 새 도구·룰 (이번 세션)
- `finetune/scripts/22_stage2_persona_distill.py` — Stage 2 distill
- `finetune/scripts/23_stage2_train.py` — Stage 1 LoRA 위에 누적 학습 (LoRA continuation 패턴)
- `finetune/run_stage2_pipeline.sh` — distill→train→GGUF→Ollama→eval→safety→.env 자동 chain (수정 후 다음 stage 재사용 가능)
- `finetune/scripts/12_register_ollama.sh` 수정 — Q4_K_M 우선 + BF16/mmproj 제외 + absolute path
- `docs/presentation/METHODOLOGY.md` — 13 방법론 학술 근거 (논문 인용 + 우리 적용 + Why 적합 + 발표 contribution)
- 메모리 신규: `feedback_methodology_log.md` (방법론 누적 적재 룰), `feedback_finetune_venv.md` (finetune/.venv 무조건)

### ✅ 완료 — 책 RAG 통합 (2026-05-07)
- 회상요법 임상 도서 10권 OCR 추출:
  * 요시다 가츠아키 『치매 진행을 늦추는 대화의 기술』 — **50개 시나리오 (대응 힌트 + GOOD/BAD + 해설)**
  * 일본 회상요법학회 『회상법과 회상요법』 — 1H 화법·금기 (1~6장)
  * 카이소호 라이브 라브 연구회 『회상치료의 이론과 실제』 — Q&A 핸드북
  * Pati Bielak-Smith 『치매가 인생의 끝은 아니니까』 — NVC 11원칙
  * 리사 제노바 『기억의 뇌과학』 + 찰스 퍼니 『기억의 과학』 — 뇌과학 배경
  * 분당서울대병원 『기억여행』 4권 (가을·겨울·봄·여름) — 계절별 회상 자극
- 추출 산출물:
  * `docs/wiki/_raw/_extracted/` — 10권 풀 텍스트 (총 ~9.7만 줄)
  * `finetune/data/v2/book_extracts/` — 4개 핵심 챕터 정제판 (50 시나리오 + 1H 화법 + NVC 11장 + Q&A)
  * `docs/wiki/06_회상요법_책.md` — RAG 정제판 (ai-server SYSTEM_PROMPT 자동 주입)
  * `finetune/data/v2/CATEGORIES.md` — 8개 카테고리에 시나리오·인용 추가 (각 카테고리 GOOD/BAD 예시 포함)
  * `finetune/data/v2/BOOK_REFERENCES.txt` — v2 generation context 인덱스
  * `finetune/data/v2/SEED_TEMPLATE.csv` — 부활 + `book_reference` column 추가 (사용자 22 페어 작성 시 책 모범 응답 참고 가능)
- 50 시나리오 → 8 카테고리 매핑 완료 (BOOK_REFERENCES.txt 참조)

### ✅ 완료 — 회상요법 사진 자동 유도 시스템 (2026-05-08 저녁)
책 사진을 매개로 자동 회상 유도하는 시스템. MemoryPhotoService(보호자 업로드 환자 개인 사진, 키워드 트리거)와 별개. 시스템 공용 사진 풀 + N턴 자동 트리거. 첫 v1은 96 토픽 폴더로 over-engineered → 사용자 요청으로 **단순한 폴더 1개**로 재설계.

- **폴더**: `ai-server/data/reminiscence_photos/` — 사용자가 책 사진 그냥 드롭. 파일명이 토픽 제목.
- **README**: `data/reminiscence_photos/README.md` — 사용법
- **서비스**: `ai-server/app/services/reminiscence_topics.py` (`ReminiscencePhotoService`)
  - 트리거: 첫 3턴 후, 이후 5턴마다, 한 토픽 최대 6턴 후 자동 종료
  - 단순 sampling: 폴더 안 사진 풀에서 random, 최근 8개 제외
  - 거부 신호 감지: "그만"·"다른 얘기"·"재미 없" 등 → 즉시 토픽 종료
  - LLM context 주입: 책 4단계 패턴 (자유 연상 → 경험 회상 → 분기형 → 감각·구체) 가이드
- **모델**: `ReminiscencePhotoItem` (title·filename·image_url·intro_question)
- **main.py 통합**: 텍스트 chat (`safe_reply`) + 음성 chat (`stt-chat` SSE) 두 경로 모두 트리거
- **static mount**: `/static/reminiscence/<filename>` (한글 파일명 URL 인코딩 안전)
- **환자 UI**: `web/patient.js` — `reminiscence_photo` field 처리 (memory_photo 와 같은 카드 자리)

**현재 상태**: 사진 0장 → `is_active=False` (비활성). 사용자가 사진 드롭하면 서버 재시작 시 자동 활성.

**사용자 작업 (간단)**
1. `ai-server/data/reminiscence_photos/` 안에 책 사진 드롭 (.jpg/.png/.webp). 파일명은 자유 (예: `개나리.jpg`, `결혼식.jpg`). 서브폴더 만들어도 됨 — 평면적으로 한 풀로 사용.
2. `bash restart.sh` (ai-server 재시작 → 폴더 재스캔)
3. 환자 화면에서 대화 → 5턴마다 자동 사진 트리거

### ✅ 완료 — 『기억여행』 4권 심층 정제 (2026-05-08)
- 4권 OCR 11,342줄 전수 읽고 96 주제(봄·여름·가을·겨울 각 24) 추출
- 8 카테고리 × 12 주제 = 96, 4계절 분산 매핑 완료
- 산출물:
  * `finetune/data/v2/book_extracts/05_memory_journey_4seasons.txt` — 정제판 (96 주제 표제·카테고리·대표 질문/활동 + 표준 질문 패턴 + 임상 활용 룰 7개)
  * `docs/wiki/06_회상요법_책.md` — 신규 섹션 5 (4단계 점진 자극 + 표준 질문 패턴 + 계절별 토픽 표 + 임상 활용 룰) → ai-server SYSTEM_PROMPT 자동 주입
  * `finetune/data/v2/BOOK_REFERENCES.txt` — 4계절 96 주제 매핑 + 계절 동기화 sampling 룰
  * `finetune/data/v2/CATEGORIES.md` — 8 카테고리 × 4계절 토픽 매핑 표 + 트라우마 토픽 안전 룰
- 핵심 차용 패턴: 4단계 점진 자극 / 분기형 질문 / 계절 동기화 / 트라우마 신중 / 다감각 자극 / 세대 비교 / 개방형 종결

### ✅ 완료 — Stage 2.6 CareCall-aware (2026-05-10 00:51, ⚠ 2026-05-12 폐기 → Stage 2.5 회귀, FAILURES F9)
- 추출: `naver-ai/carecall-corpus` git clone → 13,357 페어 (filtered_10k 12,491 + feedback_100 866, dedup 후, out-of-bounds=True 제외)
- 학습: Stage 2.5 LoRA 위 누적 (replay 30%) — 14,957 페어 (train 14,210), 2시간 56분
- **train_loss 0.0894 / eval_loss 0.0932** (gap 0.004, overfit X)
- GGUF Q4_K_M 18GB → Ollama `remini-stage26-carecall:latest`
- 평가 (after_stage2_6): Stage 2.5 책 패턴 보존 + CareCall 따뜻한 위로 톤 흡수
- safety: **8/10** (Stage 2.5 7/10 → +1, A2 false positive 해소)
- `.env OLLAMA_MODEL=remini-stage26-carecall:latest` 자동 갱신
- 학술 인용: NAVER Bae et al., NAACL 2022 (CC-BY-NC-SA 4.0, 캡스톤 비상업 OK)
- METHODOLOGY 19번 (Cross-corpus Self-distillation 통합) 신규 추가
- 신규 메모리: `feedback_gguf_prefetch.md` (GGUF 변환 전 base 16-bit prefetch 룰)
- ⚠ 1393 emergent 미복구 — Stage 2.5 trade-off 그대로
- 디스크 정리: 64GB 회수 (Stage 2.5 16-bit safetensor + checkpoint 4개)

### ⏳ 다음 자동 액션
1. **환자 React 앱 빌드 후 시연 검증** — 색감 반영 확인 (이전 stage 작업, 미완)
2. **Stage 3 ❌ skip** (2026-05-09 사용자 결정) — SEED C5 위기 응답에 1393 명시 추가 + mini distill 한 번이면 fix 가능
3. **(선택) 1393 복구 mini distill** — SEED_TEMPLATE.csv C5에 "1393 자살예방 상담 전화" 명시 + 가족 권유 둘 다 통합 → 다음 v2 generation → mini stage (Stage 2.7?)
4. **(선택) Stage 4 부산 dialect** — 71703 부산 17K + 71517 경상도 방언 (캡스톤 안)
5. (선택) **Fine-tune vs Wiki 검증 실험** — 4 조합 (SP±, wiki±) 비교
6. (선택) **페르소나 변형 평가** — 같은 발화 + 페르소나 메타 변경 시 응답 변화 정량 측정
7. ~~(선택) **LLM-as-Judge** (Phase 2 H2)~~ — **✅ 2026-05-14 완료**. DSLM `remini-stage25-book:latest` vs Gemini 2.5-flash × 40 시나리오 × gpt-5.4 self-consistency 3. 13항목 + 3영역 모두 Bonferroni 통과, 전체 Cohen's dz=2.16, 선호 113:7 (p=4.77e-26). 결과 → `RESULTS.md` Phase 2 / `H2_LLM_AS_JUDGE_SURVEY_PPT_SUMMARY.md` §10 / `FAILURES.md` F11 (Q12 KG 사실성 trade-off) / `evidence/phase2_h2_*_2026-05-14.{md,csv}`
8. (선택) **Phase 2 전문가 보조 검증** — LLM judge 방향성 확인용 블라인드 5~7명 설문 (Krippendorff's α 일치도). 시나리오 풀: `experiments/data/responses/phase2_responses.jsonl` 에서 sampling (특히 H2-C5-05 anti-trend 1개 포함 권장)
9. (선택) **Q12 KG 사실성 복구 v2 mini distill** — F11 recovery 옵션: KG-grounding 손실 강화 페어 비율 ↑ 또는 inference-time KG verification. 캡스톤 narrative 결정 후 진행

### 🔄 대기 중 (사용자 작업)
1. **🔥 ai-server 재시작** — P999 PersonaDirectory 캐시 새로고침 (`bash restart.sh`). 메인 모델은 이미 Stage 2.5 (`remini-stage25-book:latest`) 적용 중, 별도 모델 교체 불필요
2. **🔥 환자 React 앱 빌드 (이전 색감 작업 반영)** — `cd caregiver/artifacts/patient-web && pnpm build` → `ai-server/web/patient-react/assets/` 갱신
3. **🔥 SEED 22 페어 모범 응답 작성** — `finetune/data/v2/SEED_TEMPLATE.csv` (C5 위기에 1393 명시 추가하면 다음 mini distill로 1393 fix 가능)
4. **시연 — P999 "이금자" 로 환자 화면 로그인** → 위 retrieve 검증 결과로 anchor·KG retrieval 동작 보장

### ✅ 완료 — P999 보편 시연용 어르신 KG (개인 식별자 0, 2026-05-12)
- **개인 식별자 절대 X 원칙** — 시연 대상 어르신이 누구든 자기 경험으로 치환 가능하도록 모든 노드를 역할·보편 명사로만 채움
- 페르소나: name="어르신", 1949-01-01 (보편 70대 후반), 직업="농사와 살림"
- 모든 사람 노드는 역할만: 배우자 / 아들 / 딸 / 손주 / 어머니 / 아버지 / 형제자매 / 어릴 적 단짝 친구 / 옛날 동네 어른
- 장소: 고향 시골 마을 / 동네 단골 시장 / 단풍 곱던 가을 산 / 어릴 적 놀던 개울가와 동산 / 옛 살던 시골집 마당 / 자식들이 사는 도시
- 미디어: 트로트 / 가요무대 / 전원일기 / 9시 뉴스 (특정 가수명 제거)
- 음식: 된장찌개 / 김치찌개 / 비빔밥 / 콩나물국밥 / 호박전·김치전
- 기억: 첫아이 낳던 날 / 결혼식 날 / 가을 단풍·바닷가 가족여행 / 김장 / 모내기 술참 / 음식 칭찬 / 이웃 도움 (특정 연도·인물명 제거)
- 건강: 고혈압 / 무릎 관절염, 혈압약·관절 진통제 (브랜드명 제거)
- 산출물:
  * `experiments/data/personas/P999.yaml` — 다른 P*와 동일 yaml 스키마, 이름·자녀·고향 등 null 또는 보편화
  * `ai-server/scripts/seed_p999_demo.py` — Aura 시드 (P001 패턴 미러, MERGE 만, 재실행 안전)
- KG: Persona 1 + Graph hub 2 + **81 GraphEntity** (양 그래프 중복 포함), 83 1-hop edges
- 검증 (10 질의 anchor·retrieve): 아들/어머니/고향/된장찌개/비 오는 날/혈압약/어릴 적 놀이/옛 친구/손주/가요무대 — 모두 anchor·텍스트 정확 매칭
- **시연 시퀀스**: ① `bash restart.sh` → ② 환자 화면에서 ID **"P999"** 직접 입력 (또는 이름 "어르신") → ③ 어떤 어르신이 접속해도 가족·고향·취미·음식·옛 기억·약·일과 자기 경험으로 자연 회상

---

## SEED 22 페어 작성 후 자동 plan

1. ✅ 책 OCR 처리 완료 (2026-05-07)
2. SEED 22 페어 받으면:
   - v2 발화 generation (`finetune/scripts/16_*`) — 카테고리 1,600 발화 (페르소나 random + BOOK_REFERENCES context)
   - v2 응답 generation (`finetune/scripts/17_*`) — 모범 응답 (wiki 06 + SEED few-shot)
3. v2 학습 — Stage 2 위에 누적 (Stage 2.5 — book-aware) 또는 별도 Stage 3
4. before/after 평가 + safety eval (룰)
5. ai-server 적용 + RESULTS 갱신

자세한 갈래 (A/B/C): IDEAS.md C-17

---

## 핵심 발표 contribution (지금까지)

1. **Stage 1 KoAlpaca 폐기 (FAILURES F2)** — Catastrophic forgetting, 도메인 어조 충돌. 강한 negative result.
2. **Stage 1 Proper** — 도메인 일치 데이터로 train_loss 5배 개선 + 응답 quality ↑.
3. **검수자 일치도 Fleiss κ=0.54 moderate (FAILURES F6)** — 가이드라인 정밀화 필요.
4. **Self-distillation + AI Hub 71703 reference** — 진짜 노인 발화 분포 + 우리 시스템 응답.
5. **Safety classifier 한계 (FAILURES F3)** — 일반 분류기 false positive — 도메인 specific 분류기 v2 필요.
6. **PII auto-detection + cross-persona leak 방어** (자연 페어 25 AUTO_FAIL_PII).
7. **Cohen's κ + 검수 가이드라인 contribution** (FAILURES F6).

---

## 작업 디렉토리 / 핵심 파일

```
Remini/
├── ai-server/                    # 본 시스템 (port 8000)
├── caregiver/                    # 보호자 앱
├── experiments/                  # Phase 1/2 평가
├── finetune/                     # 학습 영역
│   ├── data/
│   │   ├── pairs/                # 검수 + 합성 + distill
│   │   │   ├── reviewed/         # 검수자 3명 csv (검수자 A·B·C)
│   │   │   ├── reviewed_merged.jsonl  # 보수적 merge (1,129)
│   │   │   ├── raw_pairs_synth.jsonl  # NVIDIA 합성 (300)
│   │   │   └── raw_pairs_external.jsonl  # KorEmpathetic distill (500)
│   │   ├── v2/
│   │   │   ├── CATEGORIES.md     # 8 카테고리 정의
│   │   │   ├── pairs_71703_distill.jsonl  # 71703 distill 5K (Stage 1)
│   │   │   ├── stage1_pairs.jsonl  # 합쳐진 6,929 학습 데이터
│   │   │   └── (대기) BOOK_REFERENCES.txt, SEED.csv
│   │   ├── aihub_71703/          # AI Hub 71703 (Training/Validation JSON)
│   │   │   ├── utterances.jsonl  # 1.77M 환자 발화 추출
│   │   │   └── _stats.json
│   │   └── comparison/           # before/after 비교
│   ├── checkpoints/
│   │   ├── lora_stage1_proper/   # ✅ Stage 1 Proper LoRA (510MB adapter)
│   │   └── lora_stage1_proper_gguf/  # GGUF Q4_K_M (17GB)
│   └── scripts/                  # 01~21 단계별
└── docs/presentation/            # 발표 자료 (everything)
    ├── README.md
    ├── EXPERIMENTS_LOG.md
    ├── RESULTS.md
    ├── FAILURES.md
    ├── LESSONS.md
    ├── IDEAS.md
    ├── TECH_STACK.md
    ├── FINETUNE_BRANCHES.md
    ├── SLIDE_OUTLINE.md
    ├── NEXT_SESSION.md (이 파일)
    ├── evidence/
    └── logs/
```

---

## 이 세션 끝나기 전 사용자가 할 수 있는 것

- ✅ 책 PDF 보내기 (또는 OCR 텍스트)
- ✅ "Stage 2 진행" 명령
- ✅ 추가 AI Hub 데이터 링크
- ✅ 휴식 / 다른 작업 — 새 세션 열어서 이 파일만 읽으면 즉시 이어감

---

## 새 세션 시작 시 agent 가 할 일 (룰 — `CLAUDE.md` + memory `feedback_session_handoff.md`)

1. **이 파일 (`docs/presentation/NEXT_SESSION.md`) 무조건 먼저 읽기**
2. "현재 상태" + "대기 중" + "다음 자동 액션" 파악
3. 사용자 첫 메시지에 따라 즉시 이어가기:
   - "이어가자" → 다음 자동 액션 진행
   - "책 PDF 보냄" → `feedback_book_ocr_plan.md` 시퀀스 진행
   - "Stage 2 가자" → Stage 2 plan 진행
   - 다른 요청 → 그것 처리 + 끝나면 다시 NEXT_SESSION 흐름

## 세션 종료 전 agent 가 할 일

- **이 파일 갱신** 무조건
  - "현재 상태" 에 이번 세션 끝낸 작업 추가
  - "대기 중" / "다음 액션" 갱신
  - "마지막 갱신" 날짜 변경
- 그 후 사용자에게 짧게 보고: "NEXT_SESSION.md 갱신함, 새 세션에서 이어가기 가능"
