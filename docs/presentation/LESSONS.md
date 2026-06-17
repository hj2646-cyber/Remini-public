# Lessons Learned — 정제된 핵심 메시지

> 발표 슬라이드의 "Lessons Learned" 섹션에 그대로 사용. 한 줄로 요약 + 근거.

각 항목은: **메시지 한 줄 → 근거 (어떤 시도에서 도출) → 의미** 순서.

---

## L1. Base 모델 origin 검증은 Fine-tune 의 first-class concern

**근거**: gemma-4-31B vs gemma-3-27b 혼동 (FAILURES F1).

**의미**: Production 양자화 형식 (Q4_K_M) ↔ HF identifier 매핑이 명확하지 않으면 학습 결과 자체가 무효. 시작 전 5분 검증이 학습 56분 매몰 비용 회피.

---

## L2. Curriculum 학습 시 Stage 간 도메인 어조 일관성 필수

**근거**: KoAlpaca Stage 1 → 회상요법 catastrophic forgetting (FAILURES F2). Naver 지식인 어조 (정보 제공) 가 회상요법 어조 (수다 친구) 를 5K 페어 × 2 epoch LoRA 만으로 덮어씀.

**의미**: 단순히 "한국어 능력 보강" 의도로 추가 데이터 mix 시, 어조가 도메인과 충돌하면 base 의 사전 학습된 일반 능력이 도메인 룰을 약화시킴. **도메인 일치하지 않는 데이터는 안 더하는 게 더 안전**.

---

## L3. "한국어 능력 보강" 은 base 가 충분하면 오히려 해롭다

**근거**: gemma-4-31B-it 는 multilingual + 한국어 사전학습 충분. 우리 합성/distill 페어 자체가 자연스러운 한국 회상응답이라 추가 한국어 학습 불필요.

**의미**: **Default to less data** (Karpathy 원칙). 추가 학습 데이터 추가 전 "이게 정말 필요한가" 검증.

---

## L4. Self-Distillation 패턴은 cross-persona PII leak 0

**근거**: NVIDIA 30 KG self-distillation (300 페어) + KorEmpathetic distill (500 페어) → PII auto-detect 결과 모두 0 hit. 자연 페어 (DB) 에서만 25 hit.

**의미**: System grounded 학습 데이터 (system prompt 에 페르소나 KG 포함) 는 응답이 system 정보만 사용하도록 학습되어 외부 환자 PII leak 가능성 낮음. 의료 도메인 fine-tune 의 표준 패턴.

---

## L5. 일반 Safety Classifier 는 도메인 Specific 응답에 부적합

**근거**: `beomi/korean-hatespeech-classifier` 가 회상요법 정상 응답에 false positive (90% → 일부) + 도메인 변화 응답에 detection 패턴 변화 (10%). (FAILURES F3)

**의미**: 도메인 specific 모델 평가에는 도메인 specific 분류기 또는 LLM-as-Judge 가 필요. Safety metric 으로 일반 분류기 단독 사용은 한계.

---

## L6. ML Pipeline 자동화 시 시스템 의존성 사전 설치 필수

**근거**: unsloth llama.cpp 자동 빌드의 libcurl4-openssl-dev 의존성 (FAILURES F4).

**의미**: 백그라운드 자동화 chain 구성 시 sudo 필요한 시스템 패키지를 미리 install 해두지 않으면 chain 중단. 환경 셋업 체크리스트 표준화 필요.

---

## L7. Production 양자화 수준에서 Fine-tune 이 자연스러움

**근거**: 우리 ai-server ollama gemma4:31b 는 Q4_K_M (4bit). 4bit QLoRA (Dettmers 2023) 로 학습 → 추가 양자화 손실 0.

**의미**: **fp16 학습 → Q4 변환** 보다 **Q4 학습 → Q4 운용** 이 production 일치. QLoRA 4bit 정확도 손실 ~0.1-0.3% (논문 기준) — 무시 가능.

---

## L8. Curriculum 학습 + Replay Buffer 가 Catastrophic Forgetting 효과적 완화

**근거**: Stage 2 KG-aware 학습 (2026-05-06):
- Stage 1 Proper LoRA 위에 누적 학습 (1,136 페어, train_loss 0.2169)
- Stage 1 데이터 30% replay mix (METHODOLOGY §4)
- Stage 2 후 safety classifier 7/10 → Stage 1 Proper 와 동일 비율 (forget 없음)

**의미**: KoAlpaca catastrophic forgetting (FAILURES F2) 의 정반대 결과. 같은 도메인 (회상요법) + 30% replay 시 stage 누적 학습이 안전. **Curriculum 의 효과는 (1) 도메인 어조 일관성 + (2) replay buffer 두 조건이 충족될 때 발현**. 적은 데이터 (1,136) 로도 train_loss 0.2169 (Stage 1 Proper 0.258 보다 낮음) — 누적 학습 효율성 입증.

---

## L9. System-Grounded SFT 가 Persona 메타 학습으로 Safety 응답 풍부화

**근거**: Stage 2 위기 시나리오 응답에 **`1393` 자살예방 상담 전화 명시** 자동 추가 (Stage 1 Proper 응답에는 없음).
- 학습 데이터: AI Hub 71703 teller 메타 (우울/불안 점수 0~4) → system context 익명화 주입
- 결과: 페르소나 메타 학습이 위기 응답에 specific 안전 정보 (1393) 추가하는 행동으로 발현

**의미**: System-grounded SFT (METHODOLOGY §6) 가 단순 "메타에 따라 톤 조정"을 넘어 **safety-relevant specific 정보** 까지 학습 가능. 의료/safety 도메인 fine-tune 의 emergent behavior. LIMA (Zhou 2023) 의 "alignment 는 system context 만 있으면 1,000 examples 로 가능" 의 도메인 specific 확장.

---

## L10. 임상 도서 RAG 통합은 1:1 매핑이 가능하면 학습 데이터 + system prompt 양면 자산

**근거**: 회상요법 책 10권 OCR 통합 (2026-05-07) + Stage 2.5 학습 검증 (2026-05-08).
- 요시다 가츠아키 『치매 진행을 늦추는 대화의 기술』의 50개 GOOD/BAD 시나리오가 우리 8 카테고리에 거의 1:1 매핑됨
- 책 자체가 contrastive pair 형식 → 이 책의 응답 패턴을 그대로 wiki RAG (system prompt) + fine-tune SEED few-shot + (캡스톤 후) DPO 학습 양면으로 활용 가능

**Stage 2.5 학습 후 검증** (after_stage2_5):
- A1 망상 응답에 책 #21 패턴 (감정 인정 → 음식 회상 전환) 직접 차용
- A4 위기 응답에 책 #26 패턴 (부정어 회피 + 가족 권유) 적용
- 고향 그리움에 NVC 7장 (슬픔 맛보기) + 1H 화법 — 짧고 차분
- 기억 어려움에 책 #24 "그럴 때가 있죠" 인용 그대로
- train_loss 0.0863 (Stage 1 0.258 → Stage 2 0.217 → Stage 2.5 0.086, 누적 -67%)
- eval_loss 0.0953 (overfit gap 0.01, 안전)

**의미**: 도메인 전문가 도서가 우연히 카테고리 체계와 호환되면, **하나의 도서 = system prompt 외부 권위 + 학습 데이터 anchor** 의 dual-role 자산. RAG (Lewis 2020) + script knowledge (Schank & Abelson 1977) + safety contrastive pair (Touvron 2023) 의 결합. 일반 LLM 학습은 RLHF 인간 라벨에 의존하지만, 임상 도메인은 **30년 임상 전문가의 책이 라벨보다 정확한 reference**가 됨. **검증된 의미**: 학습 가중치까지 책 패턴이 들어옴 — RAG 만으로 끝나지 않고 fine-tune 으로 internalize 가능.

---

## L11. SEED 작성이 emergent behavior 를 덮어쓴다 — 학습 데이터 우선순위가 emergent 보다 강함

**근거**: A4 위기 시나리오 응답 변화 (after_stage2 → after_stage2_5).
- Stage 2: AI Hub 71703 페르소나 메타 (우울/불안 점수) 학습 → "1393 자살예방 상담 전화" specific 정보 emergent (학습 데이터에 명시 X 였는데 자발적으로 추가)
- Stage 2.5: SEED_TEMPLATE C5 의 가족 권유 패턴 + 책 RAG (요시다 #26 + NVC 9장) → 1393 빠지고 가족 연결 우선

**의미**: Fine-tune 시 SEED few-shot + 학습 데이터의 영향력이 이전 stage 의 emergent behavior 를 덮어쓸 수 있다. SEED 작성 시 **이전 stage 의 좋은 emergent 도 명시적으로 보존**해야 안 잃음. Catastrophic forgetting 의 의미가 단순 일반능력 손실뿐 아니라 specific behavior 손실로도 확장됨.

**Recovery**: SEED_TEMPLATE C5 위기 응답에 1393 명시 + 가족 권유 둘 다 통합. 또는 SEED 22 페어 → 50 페어로 늘려서 카테고리 안 다양성 확보.

---

## L12. Phase 1 H1 — GraphRAG > VectorRAG (DSLM 고정, 표준 RAGAS + 자체 hybrid 모두 부분 입증)

**근거**: Cell 1 (GraphRAG+DSLM) vs Cell 3 (VectorRAG+DSLM), n=270 paired t-test.
- **표준 RAGAS Context Precision Δ=+0.0951, p=1.7e-05, Cohen's dz=0.266**
- **Context Precision Δ=+0.293, p=1.4e-33, Cohen's d=0.85 (large)**
- Context Recall p=1.8e-28, d=0.76 (large)
- Faithfulness/Answer Relevancy: 응답 단계 saturation (차이 미미)

**의미**: 페르소나 fact 검색 task 에서 구조화된 KG (yaml 통째 컨텍스트) 가 벡터 검색 (ChromaDB top-5 bge-m3) 보다 검색 단계 메트릭에서 통계적 유의 + large effect 로 우월. 응답 quality 는 두 RAG context 모두 saturate → LLM 이 정답 추출에 성공.

**한계 정직**:
- DSLM 한정 (Cell 2,4 Gemini 미실행 — LLM cross-robustness 미입증)
- 표준 RAGAS 는 Context Precision 1개 지표에서만 Bonferroni 통과 — H1 "부분 입증"
- F-비존재 / 부정 T/F 는 표준 RAGAS Context Recall 과 구조적으로 잘 맞지 않음

---

## L13. 표준 RAGAS 를 한국어 단답 fact-QA 에 쓰려면 reference/prompt/wrapper 를 맞춰야 한다

**근거**: 4 judge LLM 초기 시도 (FAILURES F10) — gemma4:31b / qwen3:14b / Groq Llama 70B / vLLM Qwen2.5-32B-AWQ 모두 trial 당 90-226초 + Faithfulness NaN 40-100%. 이후 H200 vLLM + reference 자연어화 + Korean-localized RAGAS prompts + fast OpenAI-compatible wrapper 로 540 trial 표준 RAGAS 완료.

내부 원인:
- RAGAS Faithfulness = "응답을 statement 들로 분리 → 각 grounded 여부 verify" 라는 영어/긴 응답 가정의 prompt template
- 한국어 단답 "인천 부평구에 거주합니다" 는 statement 1개 (그대로) — 한국어 LLM 이 이걸 빈 list 로 반환 → division by zero → NaN
- `ground_truth="F"` 같은 라벨 reference 는 RAGAS 의 claim attribution 입력으로 부적합
- RAGAS telemetry + LangChain/Instructor wrapper 가 vLLM 직접 호출(0.4s)보다 훨씬 느린 병목을 만들 수 있음

**의미**: 표준 RAGAS 자체를 버릴 필요는 없지만, 한국어 단답 fact-QA 에서는 입력 형식과 실행 wrapper 를 RAGAS 가 기대하는 형태로 맞춰야 한다. 최종 설정은 `RAGAS_DO_NOT_TRACK=true`, 자연어 `reference`, Korean-localized prompt, fast vLLM wrapper.

**contribution**: "한국어 짧은 fact-QA 에서 표준 RAGAS 를 실제로 재현하려면 무엇을 고쳐야 하는가" 를 실패 로그와 최종 복구 결과로 제시 가능. 자체 hybrid 는 빠른 diagnostic 으로 보조 사용.

---

## L14. (예정) Phase 2 — DSLM vs Gemini 회상요법

(실험 진행 후 작성)

---

## 슬라이드 핵심 한 줄 (최종 정제)

발표 한 슬라이드에 한 줄로 들어갈 수 있는 메시지:

1. "도메인 specific fine-tune 에서는 더 많은 데이터가 항상 더 좋은 게 아니다 — 어조 일관성이 양보다 중요하다"
2. "일반 Safety 분류기는 도메인 specific 모델 평가에 부적합 — 도메인별 평가 도구 필요"
3. "Self-distillation (system grounded) 은 cross-persona PII leak 0 의 자연스러운 방어 메커니즘"
4. "Production 양자화 수준 (Q4_K_M) 에서 직접 fine-tune 이 fp16 학습 후 변환보다 일치성 높음"
5. "Curriculum + Replay 30% 가 Catastrophic Forgetting 효과적 완화 — Stage 2 가 Stage 1 forget 없이 train_loss 0.258 → 0.2169"
6. "System-grounded SFT 의 emergent behavior — Persona 메타 (우울/불안 점수) 학습이 위기 응답에 자살예방 상담 전화 명시까지 자동 학습"
7. "임상 도서 50 GOOD/BAD 시나리오의 8 카테고리 1:1 매핑 — 한 도서가 system prompt + fine-tune SEED + DPO contrastive pair 의 triple-role 자산"
8. "SEED 작성이 emergent behavior 를 덮어쓴다 — Stage 2 의 1393 emergent 가 Stage 2.5 SEED 의 '가족 권유' 패턴에 의해 사라짐. Specific 안전 정보는 이전 stage 의 emergent 만 의지하지 말고 SEED 에 명시 보존해야"
