# Ideas Log — 사용자·agent 의 아이디어 누적

> 캡스톤 진행 중 사용자가 낸 모든 아이디어 + agent 가 제안한 옵션 + 채택/보류/실행 상태.
> 사소한 것도 다 — 발표 자료의 "What we considered" 섹션에 활용 가능 (실제 채택 안 한 옵션도 의사결정 근거로 가치).

각 항목: **아이디어 → 출처(사용자/agent) → 동기 → 상태 → 결과 (있으면)**.

---

## 데이터·실험 설계

### I-1. 실험 폴더 분리 (`experiments/`)
- **출처**: 사용자
- **동기**: 본 시스템 (`ai-server/`) 과 실험 코드 격리, 클라우드 API 예외 정책 폴더 단위 적용
- **상태**: ✅ 채택, 적용 완료
- **결과**: `experiments/` 별도 venv, README 에 클라우드 예외 명시

### I-2. Fine-tune 폴더는 실험 바깥
- **출처**: 사용자 ("fine-tune 결과는 본 시스템에 적용될 자산")
- **상태**: ✅ 채택 — `experiments/finetune/` → `Remini/finetune/` 이동
- **결과**: 명확한 경계 (실험 vs 영구 자산)

### I-3. NVIDIA Nemotron-Personas-Korea 페르소나 활용
- **출처**: 실험설계 v5 §1
- **동기**: 30명 stratified sampling 으로 인구학적 다양성 확보
- **상태**: ✅ 채택 — 322,911명 60-89세 풀에서 30명 추출
- **결과**: KG yaml 30개, 합성 페어 300개 self-distill

### I-4. ★ 임의 설정 — Python random vs LLM
- **출처**: agent 제안
- **동기**: 결혼연도/자녀 이름 등 NVIDIA 데이터에 없는 fact
- **상태**: ✅ random 채택 (시드 고정, 결정적). LLM 대안 보류
- **결과**: 02_persona_to_kg.py 의 seeded RNG

### I-5. KoAlpaca-v1.1a 로 Stage 1 한국어 보강
- **출처**: 사용자 ("한국어 + 한국 정서 강화")
- **동기**: gemma 한국 정서 더 풍부하게
- **상태**: ⚠ **시도 후 폐기** (catastrophic forgetting)
- **결과**: FAILURES F2 — 발표 강한 contribution 으로 전환

### I-6. Self-Distillation v2 — 외부 user 발화 + 우리 시스템 응답
- **출처**: agent 제안 (KorEmpathetic 영어 번역 noisy 우려)
- **동기**: 외부 user 다양성 활용 + 응답 품질 보장
- **상태**: ✅ 채택, 500 페어 생성
- **결과**: 다양한 감정 입력에 일관된 회상요법 응답 학습 데이터

### I-7. KMHas safety classifier 활용
- **출처**: 사용자 제안 ("kmhas 사용해서 악성 분류나 감정 분석 가능?")
- **동기**: 학습 후 안전성 평가 metric
- **상태**: ✅ 옵션 B 채택 (after.txt safety eval, 학습 데이터 필터 X)
- **결과**: classifier false positive 한계 발견 → FAILURES F3

### I-8. 검수 체크리스트 (위키 + SYSTEM_PROMPT 기반)
- **출처**: 사용자 (검수자에게 일관된 룰 필요)
- **동기**: Cohen's κ 측정용 라벨 일관성
- **상태**: ✅ 채택 — A/B/C 3단계 룰
- **결과**: `finetune/data/pairs/CHECKLIST.md`

### I-9. PII 자동 감지 + AUTO_FAIL_PII
- **출처**: agent 제안 (사용자가 cross-persona leak 우려 짚음)
- **동기**: 학습된 모델이 다른 환자에게 진짜 환자 fact 환각 방지
- **상태**: ✅ 채택, 25 페어 자동 마킹
- **결과**: System grounded 학습 데이터 (합성·distill) PII 0 — Self-distillation 안전 패턴 입증

### I-10. NVIDIA 자유대화 음성(노인남여) — STT 학습용
- **출처**: 사용자 제안
- **동기**: 노인 발화 다양성
- **상태**: ❌ 부적합 (monologue 형식, LLM fine-tune 페어 X)
- **결과**: 패스 — 단 STT 모델 fine-tune 별도 작업으로 가능

### I-11. KoCulture-Dialogues — 한국 문화 정서
- **출처**: agent 발견
- **상태**: ❌ 부적합 (MZ 카톡 어조, 노인과 정반대)
- **결과**: 패스

### I-12. korean_safe_conversation
- **출처**: agent 후보 (Tier 1)
- **상태**: ❌ 부적합 ("저는 AI 라서..." 회피 응답 학습 위험)
- **결과**: 패스

### I-13. heegyu/open-korean-instructions
- **출처**: agent 후보
- **상태**: ❌ 부적합 (영어 번역, AI 회피 응답)
- **결과**: 패스

### I-14. **책 OCR + WebSearch 기반 환자 발화 reference 구축** (NEW)
- **출처**: 사용자
- **동기**: 현재 데이터의 user 발화가 환자스럽지 않음 (fact 검증 질문체) + 중복 多
- **상태**: 🔄 진행 예정 (책 OCR 대기)
- **계획**:
  - 카테고리 8개 (망상/회상/감각/사실오류/위기/혼란/푸념/감정)
  - 카테고리당 200-400 발화 → 약 1,600-3,200 페어
  - 응답: ai-server 시스템으로 self-distill (Q4 결정)
  - NVIDIA 페르소나 익명화 후 활용

---

## Fine-tune 방법론

### I-15. Curriculum 학습 (Stage 1 한국어 → Stage 2 회상요법)
- **출처**: 사용자 ("Stage 1 → Stage 2 했으면 좋겠어")
- **상태**: ⚠ 시도 후 폐기 — Stage 1 catastrophic forgetting
- **결과**: 단일 stage (회상요법 단독) 가 도메인 일치성 ↑

### I-16. 4bit QLoRA (Production Q4_K_M 일치)
- **출처**: agent 권장 (사용자 "양자화 성능 떨어지는거 아니야?" 우려)
- **동기**: ollama gemma4:31b Q4_K_M 와 학습 일치 → 변환 추가 손실 0
- **상태**: ✅ 채택 (Dettmers QLoRA NeurIPS 2023 근거)
- **결과**: 학습 안정 (loss 1.336 수렴), 메모리 16GB

### I-17. DPO/SimPO/GRPO 활용 (캡스톤 후 v2)
- **출처**: 사용자 ("sft, grpo, dpo simpo 이런거 뭔지")
- **동기**: 검수 라벨 (PASS/FIX/FAIL) 가 그대로 DPO 데이터 됨
- **상태**: ⏳ 보류 (캡스톤 후 v2)

### I-18. Qwen 3.5 122B-A10B 사용
- **출처**: 사용자 제안
- **동기**: 더 큰 모델 능력
- **상태**: ⏳ 보류 (지금 변경 비추천: production 일치 깨짐, MoE QLoRA 미검증, 매몰비용)
- **결과**: 캡스톤 후 v2 또는 추가 base 비교 실험으로 의미

### I-19. 도메인 specific Safety Classifier 학습
- **출처**: agent 제안 (FAILURES F3 후속)
- **동기**: 일반 분류기 false positive 한계
- **상태**: ⏳ 보류 (캡스톤 후 v2)

---

## 시스템·평가

### I-20. before/after 비교 자동 chain
- **출처**: 사용자
- **동기**: 학습 효과 한눈에
- **상태**: ✅ 채택, 자동 chain 완성 (학습 → GGUF → Ollama → 비교 → safety eval)
- **결과**: `evidence/before.txt`, `after_stage1.txt`, `safety_*.txt`

### I-21. 자동 PASS for synth + distill (검수 부담 감소)
- **출처**: agent 제안
- **동기**: 합성·distill 은 우리 시스템 응답이라 일관됨
- **상태**: ✅ 채택 (`03b_auto_approve_synth.py`)
- **결과**: 검수 700+ → 376 (자연만)

### I-22. AI Hub 가입 후 한국어 데이터셋 활용
- **출처**: agent 후보 (감성 대화 말뭉치, 웰니스 대화)
- **상태**: ⏳ 가입 부담으로 보류

### I-23. 모든 시도·결과·실패·교훈 docs/presentation/ 누적
- **출처**: 사용자 ("실패한것들도 다 발표자료에 넣자")
- **상태**: ✅ 채택 (CLAUDE.md 지침 + memory 등록)
- **결과**: 이 문서가 그 결과물

---

## 사소한 결정·발견

### I-24. 4bit 학습이 fp16 보다 production 일치
- **출처**: agent 분석 (사용자 양자화 우려에 답)
- **상태**: ✅ 정당화 됨

### I-25. unsloth llama.cpp 자동 빌드 의존성 (libcurl)
- **출처**: 시행착오 발견
- **상태**: ✅ MobaXterm 사용자 sudo 로 해결

### I-26. PeftModel 직접 로드 vs unsloth-native API
- **출처**: 시행착오 발견
- **상태**: ✅ unsloth-native 패턴 (FastLanguageModel.from_pretrained(lora_path)) 으로 통일

### I-27. 디스크 정리 (gemma-3-27b 잘못 다운 60GB, GGUF bf16 잔여 등)
- **상태**: ⏳ 캡스톤 끝나면 정리 (지금은 작업 중이라 보류)

---

### I-28. **Few-shot Seed Pattern 응답 generation** (Q4 결정)
- **출처**: 사용자 ("우리가 먼저 몇개 작성하면 패턴 파악해서 나머지 채우기")
- **동기**: 1,600+ 응답 직접 작성 부담 + 응답 일관성 확보
- **상태**: 🔄 진행 예정
- **계획**: 카테고리 8 × 2-3 seed = 20-25 사용자 작성 → system prompt few-shot 예시 → 나머지 LLM generate (Self-Instruct 변형)
- **참고**: Stanford Self-Instruct (Wang et al. 2022), 그러나 우리는 사용자가 seed 직접 → 도메인 정밀도 ↑

### I-29. NVIDIA 페르소나 익명화
- **출처**: 사용자 ("그사람 실제 내용이 finetuning 들어가면 문제")
- **동기**: 학습 데이터에 specific 페르소나 fact 들어가면 cross-persona leak 가능
- **상태**: 🔄 진행 예정
- **계획**: 학습 데이터 system context 의 페르소나 정보에서 이름→"어르신", 지명→일반화, 자녀이름→"자녀분", 구체 직업→일반화

### I-30. **사용자 체크: Fine-tune 후 wiki 필요한가?** (학술 contribution)
- **출처**: 사용자 ("finetuning 하면 llm wiki 필요 없어지는거 아닌지 체크")
- **동기**: 가중치에 도메인 행동 stamp 되면 prompt context 절감 가능 → token 비용·추론 속도 ↑
- **상태**: 🔄 검증 plan 설계 중
- **계획 (Fine-tune 후 별도 실험)**:
  - 4가지 조합 generate: (SP±, wiki±) → 같은 시나리오 응답 비교
  - 분류기 safety + LLM-Judge + 인간 평가
  - 결과: "Fine-tune model 이 22K wiki context 를 어느정도 흡수하는가" 측정
- **학술 가치**: prompt-based vs weight-based 도메인 지식 trade-off 실증

---

## 사용자 체크·검증 요청 모음

> 사용자가 진행 중 명시적으로 "이건 어떻게 됐는지 체크해줘" 한 항목들. 의사결정 근거 + 발표 자료 가치.

### C-1. Stage 1 학습 base 가 ollama 와 일치하는가?
- 사용자 catch (2026-05-04 18:09): "왜 gemma 3 에다가 트레이닝 하고있음??"
- 결과: gemma-3-27b 잘못 → unsloth/gemma-4-31B-it 정정. **F1 negative result**.

### C-2. DSLM 이 fine-tune 되어 있는지?
- 사용자 의문 (2026-05-04): "지금 우리 dslm 파인 튜닝되어있지않아??"
- 결과: ❌ base gemma4:31b + SYSTEM_PROMPT + wiki (prompt engineering). 진정한 DSLM 위해 fine-tune 필요 → 이 작업 시작 trigger.

### C-3. 양자화로 학습하면 성능 떨어지는지?
- 사용자 의문: "양자화로 하면은 성능 떨어지는거아니가?"
- 결과: 4bit QLoRA 정확도 손실 ~0.1-0.3% (Dettmers 2023). 우리 production 이 이미 Q4_K_M 이라 **fp16 학습 후 변환은 오히려 추가 손실**. 4bit 학습이 production 일치.

### C-4. 일상돌봄 약 복용 vs 체크리스트 "민감정보 금지" 모순?
- 사용자 catch: "일상돌봄그래프에서 약 복용 지시진단 해야하는데 왜 체크리스트에 민감정보요청제공금지?"
- 결과: 체크리스트 룰이 모호 → 명확화 필요. **A3a (AI 자유 generation 의 진단·처방 X) vs A3b (개인정보 X) vs 일상돌봄 별도 시스템 (보호자 스케줄러 → template 알림)** 분리. CHECKLIST.md 보강.

### C-5. KMHas hate speech 분류기 활용 가능?
- 사용자 의문: "kmhas-korean-hate-speech 사용해서 악성혐오발언 분류나 감정분석할때 쓸 수 있지 않을까?"
- 결과: ✅ 옵션 B (학습 후 안전 평가) 채택. 다만 일반 분류기 false positive 한계 발견 (FAILURES F3) — 도메인 specific 분류기 필요 (v2).

### C-6. Qwen 3.5 122B 사용?
- 사용자 의문: "qwen 3.5 122B 사용하는거 어떻게 생각해?"
- 결과: 지금 변경 비추천 (production 일치 깨짐, MoE QLoRA 미검증, 매몰비용). 캡스톤 후 v2 base 비교 실험으로 의미.

### C-7. 외부 데이터셋 사용 시 도메인 어조 충돌 우려?
- 사용자 우려: "외부학습데이터 있는거 쓰면좋을것같긴한데 ㅠㅠ"
- 결과: KorEmpathetic raw 페어가 도메인 미스매치 (5W 심문, 영어 번역) → user 발화만 추출 + ai-server 응답 (distill v2) 패턴으로 우회. 다양성 ↑ 도메인 일관성 ↑.

### C-8. 자유대화 음성(노인남여) 활용 가능?
- 사용자 의문: "자연어 자유대화 음성 노인남여 ai hub 에 이 친구 데이터 쓰는거는 어떻게?"
- 결과: ❌ LLM fine-tune 부적합 (monologue, STT 학습용). STT 모델 fine-tune 별도 작업으로는 가능.

### C-9. 376개 검수만으로 충분?
- 사용자 의문: "376개만 해도 충분한지"
- 결과: LoRA 1,000+ 페어 적정인데 우리 1,176 (자연 376 + 합성 300 + distill 500) 에서 자연이 376 이라 양은 충분. **그러나 자연 페어의 user 분포가 환자스럽지 않음 + 중복 문제** → v2 데이터셋 재구성으로 해결.

### C-10. **Fine-tune 후 wiki 필요한가?** ← 현재 체크
- 사용자 체크 (2026-05-05): "finetuning하면 llm wiki 필요 없어지는거 아닌지"
- 상태: 🔄 검증 plan 설계 중 (I-30 참조)
- 학술 가치: prompt context vs weight 의 trade-off 실증

### C-11. **Fine-tune / SP / RAG 차이 명확화**
- 사용자 체크 (2026-05-05): "파인튜닝이랑 시스템프롬프트 정의하는거는 다른거지 rag도 다른거고"
- 결과: ✅ 셋 다 다른 영역 + 다른 효과. **상호 보완 + 일부 중복**.
  - Fine-tune = 가중치 stamp (영구, 추론 비용 0)
  - SP = 매 호출 룰 강제 (token cost, 즉시 변경 가능)
  - RAG (wiki + KG) = 동적 검색 (token cost, 디테일 강함)
- 우리 시스템은 셋 다 사용. C-10 검증이 셋 간 trade-off 측정.

### C-12. **376개 검수 페어 학습에 사용?**
- 사용자 체크 (2026-05-05): "이거근데 지금 왜 채우는거야?" (검수자들 작업 가치 확인)
- 결과: ✅ 필수. v1 학습 데이터의 핵심. Cohen's κ + 가이드라인 실효성 + 자연 vs 합성 비교 — 발표 근거.

### C-13. **v1 vs v2 단계별 효과 비교 필요**
- 사용자 체크 (2026-05-05): "v1 v2 이렇게 뭐 이거의 전후결과도 차이봐야할거아니야"
- 결과: ✅ 메인 contribution. before → after_v1 → after_v2 세 단계 비교 → fine-tune 효과 + 데이터 양 vs 질 trade-off 실증.
- 추가됨: RESULTS.md "단계별 효과 비교" 표

### C-17. **책 OCR (회상요법 책 PDF) 받으면 처리 plan** ✅ 2026-05-07 1~5 완료
- 사용자 약속 (2026-05-04): "회상요법 책같은거를 pdf로 다 스캔 떠서 ocr로 너한테 보내줄 예정". "그전에는 아직 질문을 만들면 안되겠제?" — OCR 받기 전 SEED 작성 보류
- 사용자 재확인 (2026-05-06): "책pdf넣어주면 뭐 어떻게 하자고 내가 얘기했었지않냐" — plan 명시 누락 발견 → 모든 곳에 반영
- 받을 위치: `docs/회상요법_책.pdf` 또는 OCR 텍스트 직접
- **2026-05-07 사용자 10권 업로드** (`docs/wiki/_raw/`, 총 415MB):
  * 요시다 가츠아키 『치매 진행을 늦추는 대화의 기술』 (38MB)
  * 일본 회상요법학회 『회상법과 회상요법』 (74MB)
  * 카이소호 라이브 라브 연구회 『회상치료의 이론과 실제』 (48MB)
  * Pati Bielak-Smith 『치매가 인생의 끝은 아니니까』 (47MB, NVC)
  * 리사 제노바 『기억의 뇌과학』 (41MB) + 찰스 퍼니 『기억의 과학』 (52MB)
  * 분당서울대병원 『기억여행』 4권 (가을·겨울·봄·여름, 117MB)
- **처리 단계**:
  1. ✅ PDF → OCR 텍스트 추출 (`pdftotext -layout`, 총 ~9.7만 줄)
  2. ✅ `docs/wiki/06_회상요법_책.md` 저장 (RAG 정제판, ai-server SYSTEM_PROMPT 자동 주입)
  3. ✅ `finetune/data/v2/BOOK_REFERENCES.txt` 작성 (마스터 인덱스)
  4. ✅ `finetune/data/v2/CATEGORIES.md` 8 카테고리에 GOOD/BAD 인용 추가 (요시다 50 시나리오 → C1~C8 1:1 매핑)
  5. ✅ `SEED_TEMPLATE.csv` 부활 + `book_reference` column 추가
  6. ⏳ v2 발화 generation (16) — SEED 받으면 진행
  7. ⏳ v2 응답 generation (17) — SEED 받으면 진행
- **활용 갈래** (캡스톤 일정에 따라):
  - **A. Stage 2 reference 보강** — Stage 1 LoRA 위에 누적 학습 (KG-aware + 책 reference) → Stage 2.5 (book-aware)
  - **B. wiki RAG 만 강화** (학습 X, runtime RAG context 증강) ✅ 진행 중 (wiki 06 작성 완료, ai-server 재시작 대기)
  - **C. A+B 둘 다** — 가장 풍부, 시간 추가 → 우리 path 채택
- **학술 contribution 확장**: "Fine-tune (가중치) + RAG (book) + SP (룰) 3중 도메인 적응" → METHODOLOGY 14번 (Clinical-Book-Grounded RAG, 5요소) 추가
- 상태: ⏳ SEED 22 페어 사용자 작성 대기. 받으면 단계 6-7 + Stage 2.5 학습 자동 진행.

### C-16. **AI Hub 데이터셋 5개 추가 평가 (538/466/107/71748/71517)**
- 사용자 체크 (2026-05-05): "얘네들은 다 어떻게 쓸 수 있을지 고민해봐"
- 평가:
  - 538 립리딩 ❌ 청각장애인용
  - 466 감성·발화스타일 음성합성 △ STT 보조
  - 107 자유대화 음성(노인남여) △ STT 만 (이전 평가)
  - 71748 한국어 LLM 말뭉치 ❌ 부산 방언·노인 X
  - **71517 중·노년 방언(강원·경상) ⭐ 핵심 발견** — 경상도 1,202h 방언 음성+텍스트, 60대+ 화자, 일반 다운, IRB X. AI Hub 565 (IRB 불가) 의 dialect 측면 완벽 대체
- 결과: 71517 이 메인 추가, 466·107 보조, 538·71748 폐기

### C-15. **고령자 근현대 경험 스토리 구술 데이터 (AI Hub 71703) 활용?** ⭐⭐⭐ 골드 마인
- 사용자 체크 (2026-05-05): "요거는 어떤지 한번 확인해봐"
- 다운로드 + 압축 해제 완료 (2026-05-05) — **Training 114,904 + Validation 14,363 = 129,267 JSON**
- JSON 구조 매우 풍부 (단일 데이터셋이 우리 모든 영역 커버):
  - **qa** 페어 (진행자 question + 노인 answer)
  - **teller** (화자 정보): 나이·성별·고향·거주지·교육·배우자·자녀 + **불안 점수 (2) + 우울 점수 (2)** 0~4 척도
  - **label_1** (회상 quality): 사건구체성 / 시간적·공간적 구체성 / 주관적경험 / 자서전적기억
  - **label_2** (대화 분석): 감정 / 주제이탈 / 같은말반복 / 감각 / 대화자역할 / 과도한흥분
  - **keyword**: 50개 카테고리 (TL_01 감정-긍정·중립 12 + TL_02 부정 11 + TL_03 사물 + TL_04 장소 + TL_05 관계·사건)
- 활용 영역 (단일 데이터셋이 다 커버):
  1. **v2 환자 발화 reference** ⭐ — qa[i].answer 128K개 = 진짜 노인 회상 구술. 사용자 짚은 "input 이 환자스럽지 않음" 문제 직접 해결
  2. **Phase 2 평가 metric** — label_1 사건/시간/공간 구체성 → 회상 유도 효과 정량 측정
  3. **Safety eval ground truth** — teller 불안·우울 점수 → input_classifier 강화 + 위기 감지 검증
  4. **회상요법 진행자 패턴 분석** — qa[i].question 의 5W vs 1H 비율 분석 → 우리 SYSTEM_PROMPT 룰과 비교 (학술 contribution)
  5. STT fine-tune (캡스톤 후 v2) — WAV 안 받음 (안심존 우회는 캡스톤 후)
- 라이센스: AI Hub 일반 다운로드 (안심존 X, IRB X) — 학술·연구 자유
- 결과: ✅ **메인 reference** — 책 OCR + 이 데이터 둘 다 v2 base. 동시에 평가 metric + safety 까지 커버.

### C-14. **부산 노인·치매 음성 데이터 (AI Hub 565) 활용?**
- 사용자 체크 (2026-05-05): "혹시 이거 우리 tts나 stt에 활용가능한지 확인해줘봐 부산지역 노인 및 주요퇴행성 뇌질환자의 음성정보 우리 부산이야"
- 데이터셋: 부산 화자 2,200명 (정상 1,000 + 알츠하이머 909 + 파킨슨 291), WAV+JSON, 발화 특성 라벨 (단절·반복·오발·간투어)
- 적합도: STT fine-tune perfect fit
- 제약: 안심존 전용 + IRB 심의 통지서 필수
- **사용자 결정 (2026-05-05)**: ❌ **IRB 불가 → 폐기**. 캡스톤도 향후도 사용 X.
- 대체: AI Hub 71703 의 부산 화자 17K 발화 만으로 Stage 4 (부산 dialect specific) 진행 가능

---

## 사진 매개 회상요법 자동 유도 (2026-05-08)

### I-31. **Photo-Triggered Reminiscence Therapy — 사진 매개 회상요법 자동 유도**
- **What**: 환자와 일반 대화하다가 N턴 후 자동으로 책 사진 1장 띄우면서 회상요법 4단계 (자유 연상→경험 회상→분기형→감각 구체) 유도. 사용자가 `ai-server/data/reminiscence_photos/` 에 사진 드롭만 하면 됨.
- **Why**: 분당서울대병원 『기억여행』 4권의 임상 검증된 사진 매개 회상 자극 프로토콜 — 환자에게 시각 자극 + 보조자가 책 표준 질문 던지기. 우리는 보조자 역할을 LLM 으로 대체.
- **How**:
  - 트리거: 첫 5턴 라포 형성 → 자동 트리거. 환자 발화에 회상 키워드 ("옛날", "그때", "기억나는데") 나오면 3턴부터 즉시 트리거.
  - 환자 UI 사진 카드 (기존 MemoryPhoto 카드 재사용) + LLM 응답 강제 ("직전 발화 공감 → 사진 화제 자연 전환 → 책 표준 첫 질문 그대로")
  - 강한 거부 신호 ("싫어"·"치워") 감지 시 즉시 종료 + 7턴 cooldown
- **시스템 위치**: `services/reminiscence_topics.py` + `models.ReminiscencePhotoItem` + `web/patient.js` 사진 카드
- **발표 contribution**: 임상 도구(책)를 LLM 시스템에 직접 통합한 multimodal 회상요법 패턴. 단순 텍스트 RAG 를 넘어 시각 자극 + 책의 progressive stimulation protocol 차용. 시연 가능.

### I-32. **Mid-Topic Continuation Confirmation — AI 자율 종료 의사 확인**
- **What**: 환자가 일방적으로 "그만" 해야 토픽 종료되는 게 아니라, 토픽 5턴 진행 후 AI 가 자동으로 "이 사진은 여기까지 하고 다른 사진 더 볼까요? 아니면 다른 이야기 나눌까요?" 묻고 환자 응답 따라 분기.
- **Why**: 책의 임상 패턴 그대로 — 회상요법 진행자가 환자에게 의사 확인 후 다음 단계 결정. 환자 자율성 존중 + 회상 과부하 방지.
- **How**:
  - 토픽 시작 후 ASK_AFTER_TURNS=5 도달 → ASKING 상태 진입 → AI 응답에 의사 확인 발화 강제 주입
  - 환자 응답 분기 (단순 키워드 분류):
    - 명시적 STOP 키워드 ("아니"·"괜찮"·"다음에"·"피곤"·"이제") → 일상 대화 전환 + 7턴 cooldown
    - 그 외 응답 ("더"·"응"·"그래") → 즉시 새 랜덤 사진 트리거 (Continue, INTERVAL 무시)
  - 강한 거부 ("싫어"·"재미 없") 는 ASK 단계 무시 즉시 종료
- **발표 contribution**: 단순 keyword 거부 trigger 와 다른, 회상요법 임상 프로토콜 그대로 차용한 **자율 의사 확인 단계**. 환자에게 통제권 부여하면서도 AI 가 능동적으로 흐름 관리.

### I-33. **4계절 96 토픽 정제 카탈로그 — Wiki RAG 자동 주입**
- **What**: 분당서울대병원 『기억여행』 4권 OCR 11,342줄 전수 정독 → 96 주제(8 카테고리 × 12, 4계절) + 4단계 자극 패턴 + 표준 질문/활동 패턴 정제. wiki/06 자동 주입 → ai-server SYSTEM_PROMPT KV cache prefill.
- **Why**: 책의 임상 검증된 96 회상 자극 토픽이 LLM context 에 자동 주입되어, 응답 시 자연스럽게 "쑥개떡 좋아하셨어요?", "팥빙수 드셔보셨어요?" 같이 책 표제 직접 차용 가능.
- **산출물**:
  - `finetune/data/v2/book_extracts/05_memory_journey_4seasons.txt` — 96 토픽 풀 카탈로그
  - `docs/wiki/06_회상요법_책.md` 신규 섹션 5 — 4단계 점진 자극 + 표준 질문 패턴 + 계절별 토픽 표 + 임상 활용 룰 7개
- **발표 contribution**: 임상 도서를 단순 인용 차원이 아니라, **표준 질문/활동 패턴 카탈로그 형태로 정제**하여 LLM 응답에 직접 영향. 96 토픽 매핑은 v2 generation 시 토픽 sampling 풀로도 활용.

### I-34. **임상 도서 → 시스템 통합 일관 파이프라인** (메타 contribution)
- **What**: 회상요법 임상 도서 10권 → 5단계 시스템 통합:
  1. PDF/OCR 텍스트 추출
  2. 핵심 챕터 정제 (50 시나리오·1H 화법·NVC 11장·Q&A·96 토픽)
  3. wiki/06 RAG 정제판 (SYSTEM_PROMPT 자동 주입)
  4. v2 generation reference (BOOK_REFERENCES + CATEGORIES)
  5. 자동 트리거 시스템 (사진 매개 회상요법)
- **Why**: 임상 도서가 LLM 시스템에 영향 미치는 경로를 다층화 — context (RAG), training data (generation), system behavior (trigger).
- **발표 contribution**: 임상 도메인의 책을 LLM 시스템에 통합하는 **재현 가능한 파이프라인**. 다른 임상 도메인(우울증·자폐·재활)에도 적용 가능.

### I-35. **데이터 시각화 후보 카탈로그 — 발표 슬라이드용**
- **출처**: agent 제안 (사용자 "시각화할만한건 있을까" 질의 후 보류)
- **동기**: 발표·논문 figure 용 — 이미 csv/log 다 있음, 그리기만 하면 됨. 임팩트 순.
- **상태**: 🟡 보류 (나중에 그리기)
- **후보 목록**:
  1. **🔥 Phase 1 H1 RAGAS (1순위)** — `experiments/data/results/ragas_scores.csv` (540행)
     - Cell1(GraphRAG+DSLM) vs Cell3(VectorRAG+DSLM) 4 메트릭 박스플롯
     - 효과크기 (Cohen's d=0.85) + p-value (1.4e-33) 막대
     - 패턴별 Context Precision heatmap (T-거주지/직업/학력 vs F-반대/비존재/시점오류 vs ADV-부분일치/시점근접/유사인물)
     - → H1 결과 한 장 요약
  2. **Stage 누적 학습 손실** — `finetune/logs/` 학습 로그
     - Stage1 Proper(0.258) → Stage2(0.217) → Stage2.5 → Stage2.6(0.089) train/eval loss 라인
     - overfit gap 표시 (train vs eval 차이)
  3. **Stage별 before/after 변화** — `finetune/data/comparison/`
     - 부정어 횟수·다양성·1393 emergent·평균 응답 길이를 stage 진행 누적 라인
     - Stage 2.6 폐기 근거 (1393 사라짐) 시각적으로 명확
  4. **Safety 점수 변화** — 베이스→S1P→S2→S2.5→S2.6 단순 막대 (7→7→7→7→8/10)
  5. **데이터 구성 mix stacked bar** — 검수 1,129 + NVIDIA 합성 300 + KorEmpathetic 500 + AI Hub 71703 5K + CareCall 13K, stage별 누적
  6. **검수자 일치도** — 검수자 A·B·C 3명 Fleiss κ=0.54 + 카테고리별 일치율 heatmap
  7. **P999 KG 그래프** — Persona 1 + 81 entity + 83 edge Neo4j 네트워크 (Cypher Browser 스크린샷 or pyvis HTML)
- **추천 우선순위**: 1 (필수) > 2,3 (학습 contribution) > 7 (시연용) > 4,5,6 (보조)
- **도구**: matplotlib + seaborn (statistical) / plotly (interactive) / pyvis (KG network)
- **위치**: 그리면 `docs/presentation/figures/` 신규 폴더 + SLIDE_OUTLINE.md figure 번호 매핑

---

## 향후 추가될 곳

새 아이디어 나올 때마다 이 파일에 즉시 추가. agent 가 자동 적재.
포맷: I-NN (idea) / C-NN (사용자 체크·검증 요청)
