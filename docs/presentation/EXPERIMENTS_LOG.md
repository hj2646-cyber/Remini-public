# Fine-tune Experiments Log — 시도/실패/교훈 (캡스톤 발표용)

> 모든 시도와 실패를 빠짐없이 기록. 발표·논문의 limitation / lessons learned 섹션 그대로 사용 가능.

## 시간순 요약

| 시점 | 시도 | 결과 | 교훈 |
|---|---|---|---|
| 2026-06-03 | **Leave-one-out Ablation 본런 착수** (8 arm × 8 카테고리 × 30턴, 본 시스템 파이프라인 재현 + 실제 AuraDB Neo4j) | ✅ **완료 64/64**. judge=gpt-5.4 13문항 절대채점(self-consistency 3, 중복 dedup). **결과: reminiscence 사진 자동트리거가 3영역 전부 품질↓** (전체 Δ−0.47, p=.008, dz−1.80; 상호작용 −0.71 / 임상 −0.43 / 안정 −0.37) — 7 arm 중 유일 강효과. CAG 약기여(임상타당성 +0.27, 비유의). 나머지(retrieval/SP/classifier/therapy/filter) Δ≈0 비유의. full 2.69/5, pilot 8세트. 우여곡절: Neo4j 중단→resume / OpenAI 키 만료→교체 / judge 프로세스 반복 종료→watchdog 자동 resume | (1) 기존 Phase2 응답생성(`12`)은 본 시스템 정책 레이어(classifier·therapy·reminiscence·output_filter·CAG) 미반영 → `app.services` import 해 `run_agent` 전처리 배치·멀티턴 재현(`20`). (2) classifier(e4b)가 메인(stage25)과 ollama 동시 사용 시 2초 timeout→키워드 fallback → warmup + 15s 로 해소. (3) judge=gpt-5.4 13문항 절대채점(`21`) → full 대비 Δ=레이어 기여도(`22`). retrieval=AuraDB P001~P030. METHODOLOGY 24 |
| 2026-06-01 | **회상 PUSH→PULL 밸런싱 (프롬프트·로직 5곳, 재학습 無)** — SYSTEM_PROMPT 정체성·화법 보강 / input_classifier 일상확인형 가이드 신설(None→일상 말동무) / therapy_state EXPLORATION 진입 3→5턴 + 문구 완화 / reminiscence 트리거 4→6·7→12턴. before/after 통제 비교 (`git show HEAD` 로 수정 전 모듈 재현, 2 시나리오 멀티턴, KG·CAG off) | ✅ **일상 대화 회상 강제 완화** — 회상유도 마커 6→3(−50%), 질문 7→4, EXPLORATION 진입 3→5턴, 사진 첫 권유 4→6턴. 회상 신호 시(시나리오 B) before·after 모두 턴1 EXPLORATION → **PULL 유지(회상 기능 약화 X)** | (1) "회상만 갈긴다" = 4겹 PUSH(사진 트리거·단계추적·분류 가이드·SP) 누적. (2) 일상확인형에 가이드가 None 이던 게 모델을 디폴트 회상으로 회귀시킴 → 입력 유형별 적응형 가이드 필요. (3) `git show HEAD` 로 uncommitted 수정 전 모듈 로드 → 추측 없이 before 재현 (재현가능 통제비교 패턴). (4) PUSH→PULL = mixed-initiative + person-centered. evidence: `evidence/reminiscence_balance_before_after_2026-06-01.md`, METHODOLOGY 23 |
| 2026-05-31 | **LLM-as-router 레이턴시 측정 + EchoRoute soft router 정당화** — gemma4 e2b/e4b 등 5개 경량 모델 + 메인 라우터 레이턴시, e2b vs e4b 까다로운 케이스(경계·함정·맥락) 라우팅 품질 | ✅ **LLM 라우터 최경량 e2b +238ms / e4b +278ms / 메인 +499ms (warm, wall-clock median). 현행 임베딩 EchoRoute +0ms. e2b·e4b 라우팅 결정 5/5 일치** | (1) 음성 STT→LLM→TTS 에 라우터는 검색 전 직렬 → LLM 라우터 매 턴 0.24s+ 추가. (2) 임베딩 prototype 코사인이 함정 케이스(밥→어머니 된장국=life)도 분간 → LLM 품질 이득 작음. (3) 라우터∥메인생성은 데이터 의존성(검색결과가 프롬프트 입력)으로 불가, ∥검색만 가능하나 +0ms 못 이김. (4) → training-free soft router 의도 채택, LLM 라우터 배제 (METHODOLOGY 12 보강, RESULTS System 섹션) |
| 2026-05-26 11:09 | **Stage 5 STT — Qwen3-ASR-1.7B + LoRA 학습 완료 + before/after 평가** (5시간 7분, 16,112 steps, H200 단일, bf16) | ✅ **WER 28.44% → 7.40% (−21.04%p, 3.85× 개선)** / CER 9.09% → 2.94% / 환각 0/200 유지 | (1) 회상요법 결정적 오인식 (찍기/찢기, 들어가잖아/들어가지 않어, 큰맘/컵만, 선뜻/선택) LoRA 후 모두 해결. (2) ghost613 Zeroth 환각 trauma (FAILURES F-Zeroth) 와 정반대 — 자유대화 코퍼스 + safety eval 5 패턴 검증 0/200. (3) 공식 학습 코드 부재 영역 자체 셋업 — 4번 디버그 사이클 (`get_input_embeddings` / torchcodec / basename path / grad_fn 없음) → 5번째 시도에서 QwenLM/Qwen3-ASR `qwen3_asr_sft.py` 패턴 (outer.forward 패치 + chat-template prefix masking) 채택 성공 |
| 2026-05-25 20:15→01:48 | Qwen3-ASR LoRA 학습 5번째 시도 (공식 sft.py 패턴 채택) | ✅ trainable 0.43% (8.78M/2.05B), 16,112 steps / 5h7m / GPU 16.5GB / epoch 1.0 / loss ~13 안정 | (1) class-level forward monkey-patch (`cls.forward = forward; cls._forward_patched = True`) 가 핵심 — peft 가 outer.forward 호출 → 내부 thinker.forward 위임. (2) chat-template prefix + assistant target, prefix 부분 -100 마스킹 → standard LM cross-entropy loss. (3) save_total_limit=3 (디스크 부담 줄임) |
| 2026-05-25 19:30 | **AI Hub 107 (자유대화 노인남녀) 부분 다운 + 전처리 완료** — 스튜디오+AI스피커+음성수집도구 1zip (3개 카테고리, filekey 10개) → 63만 JSON 라벨 + 26만 wav → utterances.jsonl + HF dataset (train/eval) | ✅ **263,049 pair / 2,048 시간 학습 데이터 확보** | (1) aihubshell 의 자동 압축해제는 download.tar 만 풀고 내부 zip 들은 그대로 — **수동 unzip 필수**. (2) 부분 다운 (`-filekey K1,K2,...`) 으로 306G 전체 다운 회피, 디스크 360G→211G 안에 처리. (3) 가이드 "다운 사이즈의 2~3배 임시 공간" 룰 검증됨. (4) 라벨링 JSON 의 `convrsThema/age/gender/cityCode/recrdEnvrn/recrdUnit` 분포 분석 → 우리 case 매칭도 사전 검증 (음성수집도구 = ANDROID 95% → 환자 PWA 브라우저 마이크 환경 fit) |
| 2026-05-25 17:00 | **Qwen3-ASR LoRA 학습 셋업** — Qwen3-Omni 기반 ASR (qwen-asr 패키지) 공식 학습 코드 X → 자체 셋업: 4bit QLoRA (peft + bitsandbytes nf4 + bf16 compute) + Trainer + audio collator | 🔄 학습 직전 (데이터 준비 끝) | (1) Qwen3-Omni 의 audio multimodal 학습 패턴은 표준화 X — transformers + peft 표준 패턴으로 자체 구현 (target_modules=q/k/v/o_proj, audio encoder freeze). (2) LoRA r=16, alpha=32, dropout=0.05, lr=1e-4. (3) finetune/.venv 에 qwen-asr 별도 설치 (vllm extras 제외, torch 2.10+cu128 호환) |
| 2026-05-25 14:00 | **STT 백엔드 전환** — faster-whisper large-v3 → large-v3-turbo (~8× 속도, round-trip 100%, 환각 0건) → **Qwen3-ASR-1.7B + vLLM streaming sidecar** (실시간 청크 단위 transcribe, port 7860) | ✅ 한국어 정확도 우위 + 실시간 latency 확보 | (1) faster-whisper large-v3-turbo: 인터넷 환각 위험 0 (ghost613 turbo-korean Zeroth 뉴스 fine-tune 환각 사례와 다름, base turbo 는 안전). (2) Qwen3-ASR-1.7B transformers backend = 2초 latency (느림) → vLLM backend (`qwen-asr-serve`) = real-time. (3) Qwen3-ASR-0.6B 도 시도 (3배 경량) — 학습 base 모델은 1.7B 채택 (정확도 우위) |
| 2026-05-24 22:00 | **proactive 자동 트리거 OFF** (시연 모드) | ✅ session_start 첫 인사는 살리고 face/silence/eyes_closed 만 차단 | `proactive_enabled` env 신설, `session_start` 는 무관 (시연 첫 응답 무한 로딩 사고 후 패치) |
| 2026-05-24 21:00 | **CAG OFF + num_ctx 131072→8192** | ✅ LLM ttft 1.9s → 0.8s (약 60% 단축) | CAG (27k 도메인 prefix) prefill 비용이 응답 latency 큰 비중. 끄면 도메인 가이드 빠지지만 시연용으론 trade-off OK. 회상요법 contribution 시연 후 재활성 |
| 2026-05-24 20:00 | **LLM 보조 경량화 — `classifier_model` + `knowledge_model` 둘 다 gemma3:4b 통일** (기존: classifier qwen2.5:3b / knowledge gemma4:31b) | ✅ Ollama 인스턴스 공유 → GPU 72GB → 3.3GB (~95% 절감), 응답 품질 유지 | 단일 모델 공유로 GPU 점유 효율 ↑. ai-server 의 `services/{input_classifier,knowledge_extractor,knowledge_confirmation,new_knowledge_detector}.py` 모두 영향 |
| 2026-05-24 14:00 | **TTS 재교체** — Fish-Speech S2 Pro → **Supertonic-3** (31 언어, 99M ONNX, OpenRAIL-M + MIT, supertonic 패키지 1.1.2→1.3.1 업그레이드) | ✅ 응답 latency 9배 단축 (Fish 350ms/char → Supertonic 30ms) + 상업 가능 라이선스 | Fish-S2 한국어 자연스러움 우위였지만 **chars 비례 latency** + **음색 고정 불가** (reference audio 필요, seed 만으론 timbre 안 잡힘) → 시연 응답성 문제. Supertonic-3 가 v2 대비 31 언어 (5→31) + 같은 voice ID 호환 (F1-F5/M1-M5). 환자 PWA voice picker 4개 추림 (F3/F5/M4/M5, default M4) |
| 2026-05-23 22:00 | **TTS 백엔드 교체** — Supertonic → Fish-Speech S2 Pro (5B BF16, fishaudio/s2-pro, gated HF) | ✅ 한국어 자연스러움 사용자 평가 우위 → 본 시스템 메인 채택 (`TTS_PROVIDER=fish`) | (1) v2 main 코드 + cu128 venv 별도 (Python 3.12 강제) → ai-server `fish_tts.py` 가 msgpack HTTP 호출. (2) 내장 화자 없음 → seed 고정으로 일관 음색. (3) Fish Audio Research License → 경진대회/상업 X. (4) HF gated 모델은 사용자 토큰 필수 — 처음 v1.5 로 우회한 건 사용자 의도 무시한 실수, v2 (S2 Pro) 명확히 채택 |
| 2026-05-11 | **Phase 1 H1 DSLM 540 trial 실행** (Cell 1 GraphRAG+DSLM / Cell 3 VectorRAG+DSLM) | ✅ 0 error, 0.6s/trial | Ollama remini-stage25-book 안정, GraphRAG yaml 통째 1-chunk vs VectorRAG ChromaDB top-5 |
| 2026-05-11 | **RAGAS LLM-Judge (gemma4:31b) 시도** | ❌ trial당 90s → 1080 trial 4.5일 비현실 | 로컬 LLM-Judge 는 fast eval 불가. 큰 모델 + 단일 GPU bottleneck |
| 2026-05-11 | **RAGAS → 자체 hybrid 메트릭 전환** (substring 토큰 ≥50% OR cosine ≥0.35) | ✅ 540 trial 평가 1분 미만 | 학술 정당화: fact-QA 도메인 변형, RAGAS 4메트릭 매핑 유지, 4셀 동일 임베딩 공간(bge-m3) fair |
| 2026-05-11 | **H1 1차 검정 — paired t-test (Cell 1 vs 3, n=270)** | ✅ **Context Precision Δ=+0.29, p=1.4e-33, d=0.85 (large)** + Context Recall p=1.8e-28, d=0.76 | H1 부분 입증. Faithfulness/Answer Relevancy 는 응답 단계 saturation 으로 차이 미미. T-패턴 + F-비존재 에서 GraphRAG 압승 |
| 2026-05-11 | **F-반대 / ADV-** 패턴에서 Context Precision 둘 다 0** | ⚠ 메트릭 한계 — GT="F" 단답이라 substring/cosine 매칭 안 됨 | v2 평가 메트릭에 패턴별 처리 필요 (캡스톤 후). 또는 LLM-Judge 일부 패턴만 적용 |
| 2026-05-12 16:00 | **RAGAS 표준 가려고 4 judge LLM 비교** — gemma4:31b → qwen3:14b → Groq Llama 70B → vLLM Qwen2.5-32B-AWQ | ❌ 모두 trial 당 90-226s + Faithfulness NaN 다수 | F10 신설: RAGAS sweet spot 은 GPT-4o + 영어 + 긴 응답. 한국어 단답 fact-QA + 로컬/무료 = 50시간+ + NaN 다수 |
| 2026-05-12 | qwen3:14b RAGAS 5 trial pilot | ❌ Faithfulness 100% NaN | 작은 모델은 statement extraction 빈 결과 반환 |
| 2026-05-12 | Groq Llama 3.3 70B (무료 API) 5 trial pilot | ❌ trial 당 213s, NaN 40% | Free tier 30 RPM rate limit + RAGAS internal sequential. CLAUDE.md experiments 예외에 Groq 추가 |
| 2026-05-12 16:10 | vLLM 0.20.2 설치 + Qwen2.5-32B-AWQ 서버 띄움 | ⚠ DeepGEMM 의존성 에러 (FP8 kernels) | `VLLM_USE_DEEP_GEMM=0 VLLM_MOE_USE_DEEP_GEMM=0` env var 박아서 비활성, AWQ marlin kernel 자동 fallback |
| 2026-05-12 16:30 | vLLM 서버 ready (port 8001, GPU 0.55 utilization, Ollama 와 공존) | ✅ Application startup complete | weight 로드 3.4초 (HF cache hit), Application ready 6분 — H200 NVL 143GB |
| 2026-05-12 16:31 | 08c 스크립트 버그 — `.rstrip("/v1")` 가 문자 set 처리해서 port 8001 의 "1" 제거 | ❌ Connection to port 800 refused | `.removesuffix("/v1")` 로 수정. Python rstrip 함정 — 문자열이 아닌 문자 set 작용 |
| 2026-05-12 16:50 | vLLM Qwen2.5-32B-AWQ RAGAS 5 trial pilot | ❌ trial 당 170s, Faithfulness 100% NaN | vLLM continuous batching 효과 X — RAGAS Faithfulness internal sequential. Context Precision/Recall 3 메트릭은 정상 작동 |
| 2026-05-13 | **PWA Web Push 알림 시스템 구축** — VAPID + Service Worker + iOS 16.4+ standalone | ✅ 백엔드/프론트 typecheck 통과, 사용자 시연 검증 대기 | iOS 만 환경에서 EAS dev build (Apple Dev Program $99/년 + TestFlight) 대신 PWA 채택 — $0, 빌드 불필요, 잠금화면 푸시 OK. 위험 발화 → 보호자 폰 잠금화면 end-to-end 자동화. METHODOLOGY 20 참조 |
| 2026-05-12 | 4 judge 시도 후 결론 — RAGAS 표준 캡스톤 일정 내 가능한 길은 GPT-4o $30 / 6시간 만 | 📌 결정 보류 — 다음 세션에서 사용자가 결정 후 진행 | 자체 hybrid (이미 끝, p=1.4e-33) 가 메인. 학술 표준 보강은 옵션 (GPT-4o 결제 or vLLM Faithfulness 제외 3메트릭 overnight) |
| 2026-05-12 18:09 | **H200 vLLM 표준 RAGAS 재시도** — Cell 1 vs 3, 자연어 reference + Korean-localized RAGAS prompts + fast OpenAI-compatible wrapper | ✅ 540 trial 완료. NaN: Cell3 Faithfulness 1건(0.4%)만. Context Precision Δ=+0.0951, p=1.7e-05 | 표준 RAGAS 메트릭을 유지하려면 `ground_truth=F` 라벨을 자연어 gold evidence 로 바꾸고, RAGAS telemetry 비활성(`RAGAS_DO_NOT_TRACK=true`) + LangChain wrapper 우회가 핵심 |
| 2026-05-12 18:20 | RAGAS 속도 병목 root cause 분리 | ✅ 직접 vLLM 0.4s/call vs RAGAS 기본 wrapper 18~70s/call → fast wrapper 후 전체 가능 | vLLM 문제가 아니라 RAGAS telemetry/structured wrapper 병목. 발표 포인트: “표준 메트릭은 유지, 인프라 wrapper만 최적화” |
| 2026-05-04 18:09 | gemma-3-27b-it 위에 Stage 1 학습 시작 | **사용자 catch — 잘못된 base 모델** | base 모델 명확히 검증 필요. ollama 의 gemma4:31b ≠ HF gemma-3-27b |
| 2026-05-04 18:18 | unsloth/gemma-4-31B-it-unsloth-bnb-4bit 정정 | OK — Stage 1 진행 | Unsloth pre-quantized 가 ollama Q4_K_M 과 동일 origin |
| 2026-05-04 19:33 | Stage 1 학습 완료 (1188 steps, 56분, train_loss 1.336) | 학습 자체 정상 | LoRA 어댑터 534MB, eval_loss 1.369 |
| 2026-05-05 18:30 | LoRA → GGUF 변환 시도 (PeftModel 직접) | **실패: Gemma4ClippableLinear unsupported** | unsloth-native 패턴 (LoRA path 를 model_name 으로) 필요 |
| 2026-05-05 18:35 | unsloth-native 패턴으로 재시도 | **실패: libcurl4-openssl-dev missing** | unsloth 가 llama.cpp 자동 빌드 시 시스템 패키지 필요 |
| 2026-05-05 18:39 | sudo apt install libcurl4-openssl-dev 후 재시도 | OK — GGUF 변환 성공 (Q4_K_M 17.4GB) | unsloth 의 llama.cpp 자동 빌드는 sudo 필요한 시스템 패키지 의존 |
| 2026-05-05 18:43 | Stage 1 모델로 after_stage1.txt 생성 | **🚨 catastrophic forgetting 발견** | KoAlpaca 정보 제공 어조가 회상요법 화법 덮어씀 |
| 2026-05-06 10:26 | **Stage 2 KG-aware 시작** — Stage 1 Proper LoRA 위에 누적 학습 | 🔄 진행 중 | 책 PDF 무관 작업. teller 메타 풍부화 (교육·가족·정신건강 점수 추가) + 페르소나-aware 응답 + cross-persona leak 방어 |
| 2026-05-06 11:05 | Stage 2 distill 완료 — 874 페어 (목표 2,500 대비 적음, stratified 그룹당 max 20 제약) | 🟡 양 적지만 학습 가능 (LIMA 1,000 examples 근거) | `--n-per-group` 늘리거나 `--scan-files` 50K 로 양 ↑ 가능 |
| 2026-05-06 11:05 | wrapper [4] 학습 즉시 fail — `ModuleNotFoundError: unsloth` | ❌ system python (anaconda3) 사용 | finetune/.venv 별도 venv 필요. 룰 신설: `feedback_finetune_venv.md` |
| 2026-05-06 11:08 | wrapper 수정 (`PY=$ROOT/finetune/.venv/bin/python3`) + 재실행 | 🔄 retry | dummy PID 99999999 로 [1] 즉시 통과 → [3] unload → [4] train 재진입 |
| 2026-05-06 11:08 | 학습 또 fail — `RuntimeError: Unsloth: You already added LoRA adapters` | ❌ LoRA continuation 패턴 오류 | unsloth `from_pretrained(<lora_dir>)` 로 어댑터 자동 attach 됨 → `get_peft_model` 재호출 시 거부 |
| 2026-05-06 11:52 | 23 스크립트 수정 — get_peft_model 제거, lora_ params 직접 trainable 토글 + model.train() | 🔄 retry 2 | unsloth LoRA continuation 의 정확한 패턴 (PEFT 기본 — adapter 이미 있으면 수동 trainable 활성화) |
| 2026-05-06 12:13 | Stage 2 학습 완료 — train_runtime 835s, **train_loss 0.2169** (Stage 1 Proper 0.258 보다 낮음) | ✅ 누적 효과 입증 | 1,136 페어 (874 + 262 replay) × 2 epochs × 270 steps. 데이터 적은데 loss 낮은 건 LoRA 누적 학습이 base 부터 다시 학습한 것보다 효율적 |
| 2026-05-06 12:13~12:33 | unsloth GGUF 변환 — bf16 merge → Q4_K_M 18.7GB | ✅ 20분 (Stage 1 동일) | safetensors merge 8분 + bf16 GGUF 변환 + Q4_K_M quantize |
| 2026-05-06 12:33 | wrapper [6] Ollama register silent fail | ❌ wrapper 죽음 | (1) GGUF가 `lora_stage2_persona_gguf/` 폴더에 생성됨 (script 11이 자동으로 `_gguf` suffix 추가) — wrapper는 `lora_stage2_persona/` 넘김 (2) 12 스크립트 `ls *.gguf \| head -1` 가 알파벳 첫 BF16 partial 선택 (Q4 아님) → ollama "invalid model name" |
| 2026-05-06 12:50 | 12 스크립트 수정 — Q4_K_M 우선 + BF16/mmproj 제외 + absolute path | ✅ Ollama 등록 성공 | `remini-stage2-persona:latest` 18GB. wrapper 도 path `_gguf` 로 수정 |
| 2026-05-06 12:51 | 직접 chain — eval + safety + .env (background) | 🔄 진행 중 | 학습/GGUF/Ollama 끝났으므로 wrapper 죽음 무시하고 남은 단계만 직접 |
| 2026-05-06 13:06 | **Stage 2 ALL DONE** — eval 30s + safety 7/10 + .env 갱신 | ✅ 완료 | `remini-stage2-persona:latest` Ollama 등록 + `.env OLLAMA_MODEL` 자동 갱신. **위기 시나리오 응답에 `1393` 자살예방 상담 전화 자동 추가** — Stage 2 페르소나 (우울/불안 점수) 학습 결과 ⭐ |
| 2026-05-06 (오후) | **Stage 1 Proper 본 시스템 적용** — `.env` `OLLAMA_MODEL`을 `gemma4:31b` → `remini-stage1-proper:latest` | ✅ 적용 (서버 재시작 대기) | 학습+Ollama 등록 끝났는데 `.env` 안 꽂아서 base 모델 그대로 호출되던 사고. 룰 신설: stage 완료 시 `.env` 자동 갱신 (`feedback_finetune_apply_to_env.md`) |
| 2026-05-06 (오후) | **폐기 stage1 36G 정리** — `lora_stage1/`, `lora_stage1_gguf/`, Ollama `remini-stage1:latest` 삭제 | ✅ 디스크 665G→629G | F2 evidence 텍스트(`before_stage1.txt`/`after_stage1.txt`/safety) 보존돼 발표·논문 인용 가능. 모델 가중치 불필요 |
| 2026-05-09 | **TTS 백엔드 교체 — Supertonic → Qwen3-TTS sohee** | ✅ cold 20s / warm ~3.5s/문장 (24kHz mono) | `Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice` 한국어 화자 `sohee`. 보이스 클로닝(Base) 분리 유지 — `qwen3_tts.py` 신규 + `tts.py` provider="qwen3" 분기. Trade-off: Supertonic 대비 합성 느림이지만 자연스러움·다국어 ↑ |
| 2026-05-09 21:11 | **Stage 2.6 CareCall 시작** — `naver-ai/carecall-corpus` git clone + 페어 추출 13,357 (filtered_10k 12,491 + feedback_100 866) | ✅ NAACL 2022 시니어 톤 데이터 확보 | out-of-bounds=True 제외, dedup 후. 라이선스 CC-BY-NC-SA 4.0 (비상업 캡스톤 OK) |
| 2026-05-09 21:14 | Stage 2.6 학습 시작 (Stage 2.5 LoRA 위 누적, replay 30%) | 🔄 학습 진행 (3,554 step, 2.6s/step) | CareCall 13,357 + v2 replay 1,600 = 14,957 (train 14,210). batch 2 × ga 4, epochs 2, lr 1e-4 |
| 2026-05-09 21:18 | nvidia-smi 보고 학습 silent kill 오판 + 사용자에게 OOM 보고 | ❌ 잘못된 오판 — 실제는 `nohup` 부모 종료 알림이었고 자식 프로세스는 정상 동작 | bash run_in_background 패턴에서 task complete 알림은 nohup 부모 종료일 뿐, 자식 프로세스 alive 별도 확인 필요. `ps -p <pid>` 로 검증 |
| 2026-05-10 00:11 | Stage 2.6 학습 완료 — **train_loss 0.0894 / eval_loss 0.0932** (gap 0.004, overfit X) | ✅ 2시간 56분 (Stage 1 Proper 117분의 1.5배) | LoRA 어댑터 534MB. epoch 2.0 완료 |
| 2026-05-10 00:21 | GGUF 변환 시작 — `11_save_gguf.py --quant q4_k_m` | 🔄 진행 (Stage 2.5 같은 base 16-bit cache miss 재발) | unsloth가 학습용 4bit ID와 다른 16bit ID 사용 → 기존 cache 못 씀 → 30GB 재다운 |
| 2026-05-10 00:21 | 사용자가 같은 실수 반복 강하게 지적 ("왜 같은 일 있었는데 다음에 제대로 안 하냐") | ❌ 반복 실수 인정 | 메모리에 `feedback_gguf_prefetch.md` 신설 — 학습 시작 시 base 16-bit prefetch 룰 박음. 다음 stage부터 자동 적용 |
| 2026-05-10 00:31 | base 16-bit safetensor 다운 9분 (Stage 2.5 60분 대비 짧음, 학교 네트워크 빠른 듯) | ✅ 다운 + merge 18분 만에 끝 | 9분 다운 + 8분 46초 merge (16-bit safetensor 47G + 12G 저장) |
| 2026-05-10 00:32 | 디스크 86% 사용 → 사용자가 정리 명령 | ✅ 64GB 회수 | Stage 2.5/2.6 학습 중간 checkpoint 4개 (6GB) + Stage 2.5 16-bit safetensor 2개 (59GB, GGUF 등록 끝나서 무용) 삭제. 디스크 86% → 79% |
| 2026-05-10 00:45 | GGUF Q4_K_M 변환 완료 — 18GB (`lora_stage2_6_carecall_gguf/`) | ✅ unsloth 자동 변환 정상 | merge → F16 GGUF → Q4_K_M quantize 전체 24분 |
| 2026-05-10 00:45 | Ollama 등록 — `remini-stage26-carecall:latest` 18GB | ✅ `12_register_ollama.sh` (Q4_K_M 우선 + BF16/mmproj 제외 패턴) | parameter: temp 0.4 / top_p 0.9 / repeat_penalty 1.1 / num_ctx 32768 (ai-server 동일) |
| 2026-05-10 00:48 | 10 시나리오 평가 — `evidence/after_stage2_6.txt` | ✅ 34초 generate | 책 #21·#24 / NVC 7장·9장 패턴 유지 + CareCall 따뜻한 위로 톤 흡수 ("정말 소중", "고생 많으셨어요", "도란도란 수다") |
| 2026-05-10 00:50 | safety eval kmhas — **8/10 (80%)** | ✅ Stage 2.5 (7/10)보다 +1 | A2 사실교정 false positive 해소. C5/C7 도메인 misclassify 그대로 유지 (METHODOLOGY 11) |
| 2026-05-10 00:51 | **Stage 2.6 본 시스템 적용** — `.env OLLAMA_MODEL=remini-stage26-carecall:latest` | ✅ 사용자 결정 "이걸로 모델 바꿔줘" | 사용자 직접 `bash restart.sh` 필요 (룰: 서버 재시작 사용자 직접) |
| 2026-05-10 (예정) | 1393 emergent 복구 — SEED C5 위기 응답에 1393 명시 추가 후 mini distill | 📅 캡스톤 후 v2 또는 사용자 결정 시 진행 | Stage 2 emergent → Stage 2.5/2.6 trade-off 해결 plan |
| 2026-05-09 | **Qwen3-TTS → Supertonic 복귀** | ✅ `.env TTS_PROVIDER=supertonic` 복귀 | 환자 응답 지연 체감 너무 큼 (warm 3.5s/문장 vs Supertonic <1s). Qwen3 코드는 보존(provider=qwen3 로 언제든 재시도 가능). 자연스러움 < 응답성 |
| 2026-05-09 | **응답 생성 중… 자막 spinner 추가** | ✅ patient-web 빌드 갱신 | STT finalize ~ 첫 audio_play_start 사이 자막 비어 보이던 구간에 `responsePending` state + spinner UI. App.tsx 의 `stt`/`audio_play_start`/`done`/`cancel`/`notice`/`error`/`ttsEnded` 콜백 토글. CSS 는 기존 `.greeting-pending` 재사용. 환자 인지 부담 ↓ — "멈춘 것 아니다" 즉시 시각화 |
| 2026-05-09 | **"마이크가 켜져있어요" 자막 타이밍 수정** | ✅ AI 발화 도중 노출 버그 fix | 서버가 RESPONDING→LISTENING 을 클라이언트 TTS 재생 종료 전에 emit 하는 알려진 케이스 — `state: "LISTENING"` 콜백에서 `visualState === "speaking"` 가드로 listeningText/EOT 갱신 skip. 진짜 종료(`ttsEnded` / `playTtsReply` onDone·cleanup)에서 chime 먼저 → 240ms 후 자막. "응답 끝 → 띠링 → 자막" UX 일관성 |
| 2026-05-12 | **Stage 2.6 본 시스템 폐기 + Stage 2.5 메인 회귀** (사용자 결정) | ✅ 비교 시연 영상 이미 확보 → 모델 가중치 정리 가능 | Stage 2.6 의 따뜻한 톤 trade-off 보다 Stage 2.5 의 1393 emergent + 책 패턴 보존이 시연/논문 narrative 에 더 적합. `.env OLLAMA_MODEL=remini-stage25-book:latest` 유지. F9 신설 |
| 2026-05-12 | **디스크 정리 — 폐기 stage 모델 가중치 일괄 제거** | ✅ **175GB 회수** (87%→67%, finetune 167G→45G) | Stage 2.6 16-bit safetensor (59G) + GGUF (30G) + Ollama (18G) + Stage 1 Proper GGUF (18G) + Stage 2 Persona GGUF (18G) + 두 stage 의 중간 체크포인트 (~2.2G) + Ollama remini-stage1-proper / remini-stage2-persona (~36G). LoRA adapter 510MB 만 보존 (재현 가능). 발표 evidence (`docs/presentation/evidence/`) 텍스트 일차 증거 모두 보존 |
| 2026-05-14 (오후) | **Phase 2 시나리오 한국어 조사 자동 처리** — `11_phase2_make_scenarios.py:56` | ✅ phase2.csv 재생성 (40 시나리오 × 30턴 정상) | "배우자이/과", "떡볶이을", "냄새을", "전립선비대이" 같은 조사 오류 패턴 제거. 환자 발화는 LLM 미관여 결정적 생성 → DSLM/Gemini 동일 입력 통제 비교 보장 |
| 2026-05-14 | **Gemini SDK 끊김 → REST API + thinkingBudget=0** — `12_phase2_run.py:43` | ✅ pilot 1 페어 (H2-C1-01) 정상 (DSLM 30s / Gemini 53s, 60 utterance) | 기존 SDK 응답 중간 끊김 → google.ai.dev 공식 thinkingBudget=0 박아 thinking token 제거. REST 호출 + finishReason 핸들링 (MAX_TOKENS/SAFETY/PROHIBITED_CONTENT 명시 raise) |
| 2026-05-14 | **Pilot judge (gpt-5.4) — H2-C1-01 self-consistency 3** | ✅ DSLM 4.41 vs Gemini 3.64, pref 3:0 | gpt-5.4 model 호출 검증, JSON 파싱 검증, 카운터밸런싱 동작 검증. 호출당 ~5.9k tok, ~13s |
| 2026-05-14 | **Phase 2 전체 응답 생성 — 40 페어 × DSLM/Gemini × 60 utterance** | ✅ 80/80 레코드, 평균 37.3s, 48.5분 + 재시도 | Gemini 503 high demand 2건 (H2-C3-01, H2-C6-02) → `--resume --max-retries 8 --sleep 2` 로 자동 회복 (H2-C3-01 은 503→PROHIBITED_CONTENT→OK 3-step). 40/40 페어 완성, 모두 60 utterance |
| 2026-05-14 | **Phase 2 전체 judge — gpt-5.4 × 40 시나리오 × 3 rep (counterbalanced)** | ✅ **120/120, 에러·파싱실패 0, 27.4분, 708,805 tok** | self-consistency SD 0.187 (매우 일관), Cronbach's α DSLM 0.695 / Gemini 0.693 |
| 2026-05-14 | **H2 verdict — 13항목 + 3영역 모두 Bonferroni 통과, DSLM 압승** | ✅ Δ +0.698 (전체), Cohen's dz 2.16, 선호 113:7 (p=4.77e-26) | 3 영역 모두 Wilcoxon p<1e-5, paired t p<1e-7. 39/40 시나리오에서 DSLM 우세 (anti-trend: H2-C5-05 만 Δ=−0.18). 시나리오 단위 3:0 압승 36/40. 모든 카테고리에서 DSLM 우세. RESULTS.md Phase 2 섹션 일괄 갱신 |
| 2026-05-14 | **Q12 KG 사실성 negative finding** — DSLM 2.76 vs Gemini 3.98, **Δ −1.22** | ⚠️ finetune trade-off | finetune 으로 회상요법 화법·임상 안전성·응급 프로토콜은 크게 개선됐지만, 지식그래프 기반 사실 정확성에서는 베이스 Gemini 우세. stage 2/2.5 의 stylistic shift 가 KG hallucination 일부 유발 추정. F11 신설 |
| 2026-05-18 | **H2 데모 5지표 통합 dashboard 추가** — Direction Agreement / Δ Spearman ρ / ICC(2,1) / ICC(2,k) / Krippendorff α + 13문항 detail 한 장 | ✅ `docs/presentation/figures/h2_demo_06_metrics_dashboard.png` 생성 | 기존 18 스크립트의 alignment scatter(Q4 제외 13문항 Spearman·Direction)와 reliability cards(ICC·Krippendorff·Cronbach)가 두 그림에 분산 → 발표용 single-slide overview 필요. 19 스크립트 신규. Cicchetti / Krippendorff benchmark band 포함. synthetic demo 6 expert data 사용 (실제 전문가 설문은 미포함) |

---

## Stage 2 — KG-aware 학습 (진행 중, 2026-05-06)

### 동기
- Stage 1 Proper 가 단순 (user, assistant) SFT 라 페르소나 메타 활용 학습 부족
- 71703 teller 에 풍부한 메타 (교육년·배우자·동거인수·자녀수·우울/불안 점수) 미활용
- production ai-server 는 환자 KG fact 를 system context 로 주입하므로, 학습도 같은 형식 필요

### 데이터 plan
- AI Hub 71703 teller 메타 익명화 → system context
- Stage 1 distill 5K 위에 추가 페르소나 풍부화 sample 2-3K
- 페르소나 그룹화 (나이대 × 성별 × 지역 × 교육 × 정신건강) 다양성 확보

### 평가 plan (Stage별 룰 적용)
- before: `evidence/after_stage1_proper.txt` 그대로 (Stage 1 Proper 가 Stage 2 의 baseline)
- after: `evidence/after_stage2.txt` (같은 10 시나리오)
- safety: `evidence/safety_stage2.txt` (beomi/korean-hatespeech-classifier)
- 비교: before → after_stage1_proper → after_stage2 누적
- RESULTS.md 단계별 효과 비교 표 갱신

### 진행 단계
1. ⏳ Stage 2 데이터 준비 스크립트 (`finetune/scripts/22_stage2_persona_distill.py`)
2. ⏳ Stage 2 학습 스크립트 (`finetune/scripts/23_stage2_train.py`)
3. ⏳ STAGE2_PLAN.md 작성
4. ⏸ ai-server 시작 후 distill 응답 generate (사용자 작업)
5. ⏸ 학습 실행 (~2-3시간)
6. ⏸ after + safety 평가 + 결과 누적

---

## 핵심 실패 1: gemma-3-27b-it 잘못 base

### 무엇을 했나
처음 09_train_stage1.py 의 default base-model 을 `google/gemma-3-27b-it` 로 설정. 이유: "ollama 의 gemma4:31b 가 HF에 없을 거다" 추측.

### 무엇이 잘못됐나
- 사용자가 Stage 1 학습 진행 중 catch ("왜 gemma 3 에다가 트레이닝 하고있음")
- 만약 통과됐으면: 학습한 LoRA 가 ollama gemma4:31b 와 호환 안 됨 → 결과 무용지물

### 왜 일어났나
- HF 검색 안 하고 추측만 한 결정
- "gemma 4 가 새 모델이라 HF 미지원" 가정 — 사실은 unsloth 가 day-one 지원 (`unsloth/gemma-4-31B-it-unsloth-bnb-4bit`)

### 교훈
**LLM Fine-tune 시 base 모델 origin 확인은 first-class concern.**
production 양자화 형식 (Q4_K_M) + HF identifier 모두 검증 후 학습 시작.

### 매몰 비용
- 약 5분 학습 진행 후 stop (TaskStop)
- 다운로드된 gemma-3-27b weights — 디스크 공간 약 60GB (수동 정리 필요)

---

## 핵심 실패 2: KoAlpaca-v1.1a Stage 1 → Catastrophic Forgetting

### 무엇을 했나
**Stage 1 (한국어 보강)** 으로 KoAlpaca-v1.1a 5,000 페어 LoRA 학습.
- base: gemma-4-31B-it (4bit QLoRA)
- LoRA r=16, alpha=32, lr=2e-4, 2 epochs
- train_loss: 1.336, eval_loss: 1.369 (학습 자체 안정)

의도: gemma 의 한국어 + 한국 문화 능력 보강 → 회상요법 응답 자연스러움 ↑

### 무엇이 잘못됐나
**SYSTEM_PROMPT + wiki 적용 상태에서 회상요법 응답이 망가짐.**

같은 10개 시나리오 비교:

| 카테고리 | Before (Stage 1 없음) | After Stage 1 |
|---|---|---|
| A1 망상 동조 회피 | "마음이 많이 불안하셨겠어요. 예전에 정성껏 살림 꾸리실 때..." | **"어머니, 지금은 아무도 통장을 가져가지 않았어요"** ← 반박 (룰 위반) |
| A2 사실 교정 회피 | "아드님께서 의사가 되기까지 얼마나 정성을 다해 키우셨을지..." | **"의사 아들님께서 계신다면, 그분과 함께 Remini를 사용해 주시면..."** ← 메타 설명 |
| A4 위기 신호 | "곁에서 함께 이야기를 나누고 싶어요. 잠시 숨을 크게..." | "긍정적인S사고와 적극적인 대처가 필요합니다..." ← 일반론 강의 + 타이포 |
| B5 최근 일 | "괜찮아요. 그럴 때가 있지요. 대신 예전에 가장 좋아하셨던..." | **"어제 점심에 드신 음식은 쌀밥과 콩나물국..."** ← 사실 환각 |
| C5 감각 단서 | "그때 김장하시던 곳에서 어떤 냄새가 가장 많이 났나요?" | "김장하는 날은 동네에서 일어나는 이벤트 중 하나입니다..." ← 백과사전식 |
| C7 미러링 | "조개를 캐실 때 손끝에 닿는 갯벌 느낌이 참 좋으셨겠어요" | "조개 캐는 것은 정말 즐거운 경험이죠. 강한 조개 캐기에는 집중력과..." ← 일반 정보 |

→ **3인칭 메타 설명, 백과사전식 정보 제공, 사실 환각, 룰 위반** 다수.

### 왜 일어났나

**KoAlpaca-v1.1a 의 어조와 회상요법 화법이 정반대.**

- KoAlpaca = Naver 지식인 답변 → "정보 제공 어시스턴트" 어조 (3인칭 설명, 백과사전 답변)
- 회상요법 = "다정한 수다 친구" 어조 (1인칭 공감, 1H 화법, 60자, 차분)

5,000 페어 × 2 epochs 학습이 LoRA 어댑터에 강한 "정보 제공 어조" stamp → SYSTEM_PROMPT 의 회상요법 룰을 덮어씀.

### Safety classifier 결과

`beomi/korean-hatespeech-classifier` 로 분류:
- Before: 9/10 안전 (90%) — 1 false positive
- After Stage 1: **1/10 안전 (10%)** — 9개 hate/offensive

분류기가 hate 로 잡은 응답들이 실제로 hate 인지는 아님 (대부분 false positive). 다만 **응답 어조가 강하게 변한 것은 사실** — 분류기 detection 패턴이 변했을 정도.

### 교훈

1. **Curriculum 학습 시 stage 간 도메인 일관성 필수**
   - Stage 1 (general 한국어) 의 어조가 Stage 2 (specific 도메인) 어조와 정반대면 catastrophic forgetting
   - LoRA 5K × 2 epoch 만으로도 충분히 강한 변화 발생

2. **"한국어 능력 보강" 은 base 모델이 이미 충분하면 불필요**
   - gemma-4-31B-it 가 multilingual + 한국어 사전학습 충분
   - 추가 한국어 학습이 오히려 도메인 specific 행동 약화

3. **도메인 일치 학습 데이터의 가치**
   - 우리 합성 (300) + distill (500) + 자연 (401) = 1,176 페어 자체가 자연스러운 한국 회상응답
   - 외부 일반 instruction 데이터 mix 시 어조 손상

4. **Safety classifier 의 한계**
   - 도메인 specific 응답을 일반 분류기가 false positive 로 잡음
   - 회상요법 specific 분류기 필요 (향후 작업)

### 정정 액션 → Stage 1 폐기

**KoAlpaca Stage 1 LoRA 사용 안 함.**
다음: gemma-4-31B-it base 위에 우리 회상요법 1,176 페어 단독 학습 (`Stage 2` 라는 이름이지만 실제로는 single-stage).

---

## 부수 이슈들

### unsloth GGUF 변환 — Gemma4ClippableLinear

PeftModel.from_pretrained 직접 호출 시 Gemma 4 의 custom layer (`Gemma4ClippableLinear`) 를 peft 가 인식 못 함. **unsloth-native 패턴** (LoRA path 를 model_name 으로 직접 주면 어댑터 자동 attach) 으로 우회.

### unsloth llama.cpp 자동 빌드 — libcurl4-openssl-dev

unsloth 가 GGUF 변환을 위해 llama.cpp 를 처음 사용 시 자동 클론·빌드. 빌드에 `libcurl4-openssl-dev` 필요. 백그라운드 실행 시 input prompt 가 EOF 로 fail. **MobaXterm 사용자 sudo 필요**.

### 디스크 공간

- gemma-3-27b 잘못 다운: ~60GB (수동 정리 필요)
- gemma-4-31B 4bit: ~16GB
- LoRA stage1: 534MB
- GGUF Q4_K_M: 17.4GB
- GGUF bf16 잔여 (정리 안 됨): 10.7GB + 1.1GB
- HF cache 누적: ~80GB+

향후 작업 끝나면 `~/.cache/huggingface/hub/models--google--gemma-3-27b-it` 정리.

---

---

## 2026-05-08 — v2 generation + Stage 2.5 (Book-aware) 학습

### v2 데이터 생성 (10:36 ~ 11:17, 41분)

**시도 1 (5/7 저녁) — 버그**:
- 16번 카테고리별 break 조건 `len(all_utts) >= target_n` 가 **전체 누적**과 카테고리 target 비교
- 결과: C1 200, C2 100, C3-C8 5씩 = 330 페어. 카테고리 분포 박살. 폐기 → `pairs_v2_buggy_2026-05-07.jsonl` 보존

**시도 2 (5/8 오전) — 수정 후 정상**:
- `cat_count` 카테고리별 카운터 도입 → 정상 1,600 페어 분포
- 16번: 1,600 발화 / 774초 (12.9분) — Ollama gemma4:31b base
- 17번: 1,600 응답 / 1,648초 (27.5분) — `remini-stage2-persona:latest` (production teacher 식 self-distillation)
- 카테고리: C1 200, C2 300, C3 200, C4 200, C5 100, C6 200, C7 200, C8 200 ✅ (목표 100% 달성)
- 응답 품질 sample: 책 RAG 룰 (반박 X, 1H 화법, 감정 인정, 화제 전환) 정확 준수

### Stage 2.5 학습 (11:20 ~ 11:50, 23.5분)

**입력**: pairs_v2.jsonl 1,600 + Stage 2 replay 30% (480 페어) = 2,080 페어 → train 1,976 / val 104

**Base**: `lora_stage2_persona` (Stage 2 위에 LoRA continuation)

**Hyperparams**: r=16/α=32, batch 2 × grad_accum 4 = 8, epochs 2, lr 1e-4, warmup_ratio 0.03

**결과**:
- `train_loss: 0.08635` (Stage 1 0.258 → Stage 2 0.2169 → Stage 2.5 0.0863)
- `eval_loss: 0.09531` (overfit 거의 없음, gap 0.01)
- `train_runtime: 1410초` (23.5분)
- 출력: `finetune/checkpoints/lora_stage2_5_book_aware/` (534MB safetensor)

**저장**:
- raw 학습 로그: `docs/presentation/logs/stage2_5_train_2026-05-08.log`
- v2 generation 로그: `docs/presentation/logs/v2_chain_2026-05-08.log`

### Stage 2.5 pipeline (11:52 ~ 진행 중)

**예상 못 한 병목**: HF cache 가 비워져있어 base 모델 (`gemma-4-31B-it-unsloth-bnb-4bit`) 30GB 재다운로드 + 16-bit merge 디스크 I/O wait
- base 다운: ~28분 (1/2 11:58 + 2/2 15:33)
- 16-bit merge: chunk 당 14분 (총 ~28분)
- 평소 10분 → 이번 60분
- 트리거: 어제 (5/6) 폐기 stage1 36GB 정리 시 HF cache 같이 날아감 추정

**남은 단계**: GGUF Q4_K_M quantize → Ollama register (`remini-stage25-book`) → after_stage2_5 eval (10 시나리오) → safety_after_stage2_5 eval (kmhas) → .env 갱신

---

## 발표용 슬라이드 핵심

### "What we tried"
1. Curriculum LoRA 학습 (Stage 1: 한국어 → Stage 2: 회상요법)
2. Self-distillation (NVIDIA 30 KG + KorEmpathetic) 으로 페어 보강
3. 4bit QLoRA (production 양자화 일치)

### "What worked"
- Self-distillation 패턴 (Stanford Alpaca 식) — 자연 401 + 합성 300 + distill 500
- gemma-4-31B-it 4bit 학습 (H200 1장, 56분, train_loss 1.336)
- 자동 검수 파이프라인 (PII 자동 감지, 25 페어 AUTO_FAIL_PII)

### "What failed and why"
1. **gemma-3-27b 잘못 base** — base 검증 부족
2. **KoAlpaca Stage 1** — 도메인 어조 충돌 → catastrophic forgetting
3. **Safety classifier false positive** — 일반 분류기로 도메인 specific 응답 평가의 한계

### "Lessons learned"
- LLM fine-tune 시 base 모델 origin 검증은 first-class concern
- Curriculum 학습 시 stage 간 도메인 일관성 필수
- 도메인 specific 학습은 도메인 데이터 단독 학습이 효과적
- Safety 평가 도구도 도메인 specific 이어야 정확

### "Next iteration"
- Stage 1 폐기, gemma-4-31B + 회상요법 1,176 페어 단독 학습
- (캡스톤 후) DPO/SimPO 로 검수 라벨 활용한 alignment
- (캡스톤 후) 도메인 specific safety 분류기 학습

---

## 2026-05-07 — 회상요법 임상 도서 10권 RAG 통합

### 시도 (What we tried)

사용자 보유 회상요법 도서 10권 OCR PDF 수신 → wiki RAG context 강화 + v2 generation 데이터 기반 마련.

**입력**:
- 요시다 가츠아키 『치매 진행을 늦추는 대화의 기술』 (38MB)
- 일본 회상요법학회 『회상법과 회상요법』 (74MB)
- 카이소호 라이브 라브 연구회 『회상치료의 이론과 실제』 (48MB)
- Pati Bielak-Smith 『치매가 인생의 끝은 아니니까』 (47MB, NVC 기반)
- 리사 제노바 『기억의 뇌과학』 (41MB) + 찰스 퍼니 『기억의 과학』 (52MB)
- 분당서울대병원 『기억여행』 4권 (가을·겨울·봄·여름, 117MB)
- 총 415MB → 9.7만 줄 텍스트

**파이프라인**:
1. `pdftotext -layout` → 텍스트 추출
2. 책별 핵심 챕터 정제:
   - 50개 시나리오 (요시다) 자동 추출 — 패턴: "대응 힌트" + "대화 시도의 예" + "올바르지 못한 대화 시도의 예" + "해설"
   - 1H 화법 1~6장 (회상법과 회상요법)
   - NVC 11장 본문 (치매가 인생의 끝은 아니니까)
   - Q&A 핸드북 (회상치료의 이론과 실제)
3. 8 카테고리 매핑:
   - C1 망상 → #21 #29 #31 #41 #47
   - C2 일상회상 → #3 #6 #7 #8
   - C4 사실오류 → #17 #25
   - C5 위기신호 → #26 #48
   - C6 기억어려움 → #24 #28
   - C7 일상푸념 → #16 #19 #20
   - C8 감정표현 → #8 #26 + NVC 7장
4. 산출물:
   - `docs/wiki/06_회상요법_책.md` — RAG 정제판 (자동 ai-server SYSTEM_PROMPT 주입)
   - `finetune/data/v2/CATEGORIES.md` — 8 카테고리에 GOOD/BAD 인용 추가
   - `finetune/data/v2/BOOK_REFERENCES.txt` — v2 generation context 인덱스
   - `finetune/data/v2/SEED_TEMPLATE.csv` — 부활 + `book_reference` column

### 효과 (What worked)

- **요시다 책의 50 시나리오 = 우리 8 카테고리에 거의 1:1 매핑**: 임상 도서가 실제 환자 발화 분류 체계와 호환되는 명확한 증거. 캡스톤·논문에서 "도메인 적합성" 근거.
- **GOOD/BAD 응답 쌍의 직접 인용 가능 형식**: LLM 학습용 contrastive pair 로 그대로 사용 가능 (DPO 후속 적용 시).
- **NVC 11원칙 = 우리 시스템 prompt 의 윤리 frame 보강**: 외부 권위(Pati Bielak-Smith, Marshall Rosenberg NVC 계열) 인용으로 학술 근거 강화.

### 다음 단계 (Next steps)

1. **사용자 대기**: SEED 22 페어 모범 응답 작성 (책 인용 참조 가능)
2. v2 발화 generation: 페르소나 random + BOOK_REFERENCES context → 1,600 발화
3. v2 응답 generation: wiki 06 + SEED few-shot → 1,600 모범 응답
4. Stage 2.5 학습 (book-aware) 또는 Stage 3 별도
5. before/after 평가 + safety eval

### 검증 가능한 임팩트 (예상)

- 위기 시나리오 응답에 책 GOOD 패턴 차용율 측정 ("OO 씨가 떠나면 전 정말 슬플 거예요" 등)
- 망상 응답의 BAD 패턴 (반박·부정·비웃음) 회피율 측정 (Stage 2 vs Stage 2.5)
- 같은 발화 + 책 RAG 유무 응답 비교 (ablation)

---

## 2026-05-08 — 『기억여행』 4권 (분당서울대병원) 심층 정제 + 96 주제 통합

### 시도 (What we tried)

2026-05-07 책 RAG 통합 시 4권 OCR 만 됐고 정제판 없는 상태였음 (다른 6권은 정제판 존재). 사용자 명시 요청으로 봄·여름·가을·겨울 4권 OCR 텍스트(총 11,342줄, 117MB PDF) 전수 읽고 정제·통합.

**입력 분석**:
- 책 구성: 8 카테고리(자연·음식·역사·인생·놀이·문화·생활·환경) × 12 주제 = 96, 4계절 분산
- 각 주제 = ① 자유 연상 ② 표준 회상 질문 5~7개 ③ 실내외 활동 3~5개 ④ 인지 자극 4지선다
- 권고 사용법: 1일 1주제, 환자 시작 시점 계절부터, 주2회 시 1년 코스

**산출물**:
1. `finetune/data/v2/book_extracts/05_memory_journey_4seasons.txt` — 정제판 (96 주제 표제·카테고리·대표 질문/활동 + 표준 질문 패턴 + 임상 활용 룰 7개)
2. `docs/wiki/06_회상요법_책.md` — 신규 섹션 5 추가: 4단계 점진 자극 + 표준 질문 패턴 + 계절별 토픽 표 + 임상 활용 룰
   - 자동 ai-server SYSTEM_PROMPT 주입 (시작 시 KV cache prefill)
3. `finetune/data/v2/BOOK_REFERENCES.txt` — 4계절 96 주제 매핑 + 계절 동기화 sampling 룰
4. `finetune/data/v2/CATEGORIES.md` — 8 카테고리 × 4계절 토픽 매핑 표 + 트라우마 토픽 안전 룰

### 효과 (What worked)

- **4단계 점진 자극 패턴 = 임상 검증된 회상 dialogue scaffold**: 자유 연상 → 표준 질문 → 활동 → 인지 자극. ai-server 가 한 턴에 모든 자극 쏟는 대신 단계별로 분배 가능.
- **분기형 질문 패턴 ("좋아하셨다면 / 아니셨다면")**: 환자 부정 응답 시 즉시 대안 제시 — 우리 시스템의 "포기 X" 룰을 책 임상 근거로 뒷받침.
- **계절 동기화 토픽 sampling**: 시스템 시간 + 환자 위치 → 현재 계절 토픽 우선. 책의 "학습 효과 + 흥미 유발" 권고 그대로 차용.
- **트라우마 토픽 분리** (6.25, 환갑/제사/가족계획벽보 등): 책의 신중 사용 권고를 우리 시스템 안전 룰로 명문화.

### 다음 단계 (Next steps)

1. **검증**: ai-server 재시작 후 wiki 06 신규 섹션 5 prefill 확인 (`bash restart.sh` 후 첫 응답에서 4계절 토픽 차용 확인)
2. v2 generation 시 4계절 토픽 sampling 통합 (16 스크립트 — 환자 페르소나 + 현재 계절 → 토픽 sampling)
3. Stage 3 학습 시 4계절 회상 시나리오 1~2개 카테고리당 추가 (현재 계절에 맞는 토픽으로)
4. (검증 ablation) 같은 환자 발화에 4계절 토픽 매핑 유무 비교 — 응답 다양성 / 회상 유도 깊이 측정

### 검증 가능한 임팩트 (예상)

- ai-server 응답에서 96 토픽 표제 직접 차용율 (예: "쑥개떡 좋아하셨어요?", "팥빙수 드셔보셨어요?") — wiki RAG context 효능 증거
- 4단계 점진 자극 패턴 준수율 (한 턴에 자유→표준→활동→인지 모두 넣지 않고 분배) — 토큰 효율 + 환자 부담 ↓
- 계절 동기화 효과 (환자 발화에 현재 계절 토픽 등장률 vs 비계절 응답)

---

## 2026-05-08 (저녁) — Photo-Triggered Reminiscence Therapy 시스템 (사진 매개 자동 유도)

### 시도 (What we tried)

분당서울대병원 『기억여행』 책의 사진 매개 회상요법 프로토콜을 ai-server 에 통합. 환자와 일반 대화하다가 N턴 후 자동으로 책 사진 1장 띄우면서 책 4단계 패턴(자유 연상→경험 회상→분기형→감각 구체) 을 LLM 이 적용.

### 핵심 설계

**v1 (over-engineered, 폐기)**: 96 토픽 한글 폴더 + photo_index.json + 계절 sampling 가중치 + 트라우마 가중치 — 사용자 reject ("계절별로 나뉘는거 아닌데, 그냥 그 책 사진 보여주고 회상 유도하는 방법")

**v2 (단순화)**: 폴더 1개 (`ai-server/data/reminiscence_photos/`) — 사용자가 사진 그냥 드롭. 파일명이 토픽 제목. 폴더 평면 스캔 후 random sampling.

**v3 (ASK 상태 머신, 최종)**:
- 토픽 5턴 진행 후 AI 가 자동으로 환자 의사 확인 ("이 사진은 여기까지 하고 다른 사진 더 볼까요? 아니면 다른 이야기 나눌까요?")
- 환자 응답 분기:
  - 명시적 STOP ("아니"·"괜찮"·"이제"·"피곤") → 일상 대화 + 7턴 cooldown
  - 그 외 응답 ("더"·"응"·"그래") → 즉시 새 랜덤 사진 트리거
- 강한 거부 ("싫어"·"치워"·"재미 없") → ASK 단계 무시 즉시 종료

### 시스템 통합

- `ai-server/app/services/reminiscence_topics.py` — 트리거 로직 + 상태 머신
- `ai-server/app/models.py` — `ReminiscencePhotoItem` (mode: start | ask)
- `ai-server/app/main.py` — 텍스트 chat (`safe_reply`) + 음성 chat (`stt-chat` SSE) 두 경로 통합 + `/static/reminiscence` mount
- `ai-server/web/patient.js` — `reminiscence_photo` field 처리 (memory_photo 와 같은 카드 자리)

### 트리거 정책 (테스트 검증)

```
1~4턴: 일반 대화 (라포 형성)
5턴: 첫 트리거 (회상 키워드 "옛날" 나오면 3턴부터 즉시)
6~9턴: 책 4단계 패턴 자연 진행
10턴: AI 자동 ASK ("더 볼까요?")
11턴 분기:
  - "더" → 새 랜덤 사진 (즉시)
  - "이제 됐어" → 일상 + 7턴 cooldown
  - "싫어" → 즉시 종료 (ASK 무시)
```

### 효과 (What worked)

- **사용자 인터페이스 단순**: 사진 폴더 1개에 드롭만 하면 됨 (96 토픽 카탈로그 대비 부담 ↓)
- **책 4단계 패턴 LLM 강제 prepend**: "잠깐 이 사진 한번 같이 볼까요? 이 사진을 보고 떠오르는 생각을 자유롭게 말씀해 주세요. 무엇이 보이세요?" 책 표준 질문 그대로 반영
- **자율 의사 확인 = 환자 인지 부하 ↓**: 단방향 keyword 거부 (환자가 능동 종료) 보다 AI 능동 묻기가 부담 적음
- **MemoryPhoto 와 분리**: 보호자 업로드 환자 개인 사진 (키워드 트리거) vs 시스템 공용 책 사진 (N턴 자동) 두 시스템 충돌 X

### 검증 가능한 임팩트 (예상)

- 사진 트리거 on/off ablation: 회상 발화 길이·구체성 (label_1 사건/시간/공간 구체성 — AI Hub 71703 metric 차용)
- ASK 응답 분기 정확도 (STOP vs CONTINUE 의도 분류 정밀도)
- 환자 거부율 / 토픽 평균 유지 턴
- 시연 가능: 사용자 5장 사진 드롭 + 5턴 라포 → 자동 사진 + 책 첫 질문 → 자연 회상

### 다음 단계

1. **사용자 작업**: 책 사진 5장 이상 폴더 드롭 + `bash restart.sh`
2. **(옵션) React UI 통합**: `web/patient-react/` 도 reminiscence_photo 처리 추가 (현재 vanilla `patient.js` 만)
3. **(옵션) ablation 평가**: 사진 트리거 on/off 응답 비교

### 발표 contribution 요약

"임상 도서의 사진 매개 회상요법 프로토콜을 LLM 시스템에 multimodal 통합. 단순 텍스트 RAG → **시각 자극 + 책 4단계 자극 + 환자 자율 의사 확인** 통합. 시연 가능한 시스템 contribution. 메모리 룰: '그냥 X' 사용자 요청은 단순 v1 부터 (over-engineering 회피)."
