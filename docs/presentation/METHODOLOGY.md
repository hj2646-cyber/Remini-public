# Methodology — 방법론별 학술 근거 + 우리 적용 (발표·논문용)

> 발표·논문 Methods 섹션의 일차 소스. 각 방법론마다 **(1) 정의 (2) 근거 논문 (3) 우리 적용 (4) Why 우리 case에 적합 (5) 발표 contribution** 5요소로 정리.

마지막 갱신: 2026-05-09

---

## 0. 전체 파이프라인 한눈에

```
[Production Teacher]                          [Student LoRA]
gemma-4-31B-it (Q4_K_M)
  + SYSTEM_PROMPT (회상요법 룰)
  + Wiki RAG (00~04 도메인 지식)         ──→  Self-Distillation  ──→  Stage 1 LoRA (6,929 pairs)
  + Persona Context (KG)                                                    │
                                                                            ↓
                                                                    Stage 2 LoRA (KG-aware, 누적 학습)
                                                                    + Replay Buffer (forget 방지)
                                                                            ↓
                                                                    Stage 3 ... (위기·dialect 등)
```

**핵심 디자인 결정**: Production system 자체를 teacher로 삼는 self-distillation pipeline. 외부 데이터셋의 도메인 미스매치 문제(LESSONS L2)와 사람 검수의 비용 문제를 동시에 해결.

---

## 1. Self-Distillation (자기 증류)

### 정의
Teacher 모델의 출력을 student 모델의 학습 데이터로 사용하는 Knowledge Distillation 의 한 형태. Self-distillation 은 teacher 와 student 가 **같은 base 모델** 또는 **같은 시스템 프롬프트로 가공된 동일 모델**인 경우.

### 학술 근거
- **Hinton et al. 2015** — Distilling the Knowledge in a Neural Network. NIPS 2014 Deep Learning Workshop.
  - Knowledge distillation 의 foundational paper. Teacher 의 soft probability 또는 hard output 을 student 학습 신호로.
- **Wang et al. 2022** — Self-Instruct: Aligning Language Models with Self-Generated Instructions. ACL 2023.
  - LLM 자체로 instruction-following 데이터 셀프 생성 → 같은 LLM 이 학습 → instruction 능력 향상.
- **Taori et al. 2023** — Stanford Alpaca: An Instruction-following LLaMA Model.
  - GPT-3.5 (teacher) 로 self-instruct 패턴 적용해 53K instruction 데이터 생성 → LLaMA-7B 학습 → instruction-following 능력 획득.

### 우리 적용
- **Teacher**: `gemma4:31b` + SYSTEM_PROMPT (회상요법 룰 30줄) + Wiki RAG (`docs/wiki/00~04*.md` ~17.5K 토큰) + Persona Context (KG-anonymized)
- **Student data 생성**: `finetune/scripts/19_stage1_71703_distill.py` (Stage 1, 5K pairs), `finetune/scripts/22_stage2_persona_distill.py` (Stage 2, 2.5K pairs)
- **Student**: 같은 `gemma-4-31B-it` base + LoRA 어댑터 (SYSTEM_PROMPT/Wiki/Persona는 학습 시점 input)
- 결과: Stage 1 Proper train_loss 0.258, eval_loss 0.246 (overfit 없음, RESULTS.md)

### Why 우리 case에 적합
1. **도메인 일치 100%** — Production system 이 이미 회상요법 룰을 따름 → 외부 데이터셋의 어조 미스매치 문제(KoAlpaca catastrophic forgetting, FAILURES F2) 회피
2. **사람 검수 무한 확장** — 검수자 3명 × 수일 → 1,129 페어가 한계. self-distill 로 5K, 10K 확장 가능
3. **Production 일관성** — student 가 production teacher 의 행동 모방 → 배포 시 사용자 기대 일관
4. **Cost 측면** — gemma 추론 비용만 (사람 비용 X)

### 발표 contribution
"Production system 자체를 teacher 로 삼는 self-distillation 으로 의료 도메인 fine-tune 데이터 부족 + 도메인 미스매치 문제를 동시 해결. 학생 모델은 가중치에 도메인 행동을 stamp 받아 추론 시 prompt context 비용 절감 가능."

---

## 2. QLoRA — Quantized Low-Rank Adaptation

### 정의
4bit quantized base 모델 위에 low-rank adapter 부착. Full fine-tune 대비 GPU 메모리 ~1/3, 학습 가능 파라미터 ~0.5%로 거의 동등 성능.

### 학술 근거
- **Hu et al. 2021** — LoRA: Low-Rank Adaptation of Large Language Models. ICLR 2022.
  - W' = W + ΔW, ΔW = BA (B ∈ R^(d×r), A ∈ R^(r×k), r ≪ min(d,k)). r=4~16 으로 충분.
- **Dettmers et al. 2023** — QLoRA: Efficient Finetuning of Quantized LLMs. NeurIPS 2023.
  - 4bit NF4 quantization + LoRA + double quantization + paged optimizer. 65B 모델을 단일 48GB GPU 로 fine-tune.
- **Daniel Han (Unsloth)** — Open-source 4bit pre-quantized model + custom Triton kernels. 2-5× 학습 속도 향상.

### 우리 적용
- **Base**: `unsloth/gemma-4-31B-it-unsloth-bnb-4bit` (Q4_K_M, ollama production 양자화 형식과 동일 origin)
- **LoRA**: r=16, α=32, target_modules = q/k/v/o + gate/up/down (모든 attention + MLP), dropout=0.05
- **Memory**: H200 NVL 143GB GPU, 학습 시 ~16GB peak (4bit base + adapter)
- **Stage 1 Proper**: 117분 학습, train_loss 0.258 (RESULTS.md)

### Why 우리 case에 적합
1. **Production 일치** — ollama gemma4:31b 가 Q4_K_M 으로 배포됨 → 학습도 같은 quantization → 변환 추가 손실 0
2. **단일 GPU 학습** — 31B 모델을 H200 1장으로 fine-tune (full fine-tune 은 multi-GPU 필요)
3. **빠른 iteration** — Stage 1 117분 → Stage 2,3,4 도 비슷한 속도 → 캡스톤 일정 내 다중 stage 가능

### 발표 contribution
"QLoRA r=16/α=32 로 31B 모델을 단일 H200 1장에서 117분에 fine-tune. Production Q4_K_M 양자화와 학습 정밀도가 일치해 변환 손실 없음."

---

## 3. Curriculum Learning (단계별 학습)

### 정의
학습을 쉬운 → 어려운 또는 일반 → 특수 순서로 단계화. 각 stage 가 다음 stage 의 starting point.

### 학술 근거
- **Bengio et al. 2009** — Curriculum Learning. ICML 2009.
  - 사람의 학습이 단계적인 것에서 영감. 단순 → 복잡 순서 학습 시 final performance + convergence 속도 ↑.
- **Soviany et al. 2022** — Curriculum Learning: A Survey. International Journal of Computer Vision.
  - LLM era 까지 curriculum learning 의 다양한 변형 정리.

### 우리 적용 + 폐기 + 채택
- **❌ Stage 1 (KoAlpaca, 한국어 보강) 폐기** — FAILURES F2. Curriculum 의도 (general 한국어 → specific 회상요법) 였으나 어조 미스매치로 catastrophic forgetting 발생.
- **✅ Stage 1 Proper (회상요법 단독)** — 단일 stage 로 도메인 specific 데이터만. 6,929 페어, eval_loss 0.246.
- **✅ Stage 2 (KG-aware, 페르소나)** — Stage 1 위에 누적. 페르소나 메타 (교육·가족·우울/불안 점수) system context 추가 학습.
- **계획**: Stage 3 (안전·위기), Stage 4 (부산 dialect) — `FINETUNE_BRANCHES.md`

### Why 우리 case에 적합 (with 폐기 교훈)
- Curriculum 은 **stage 간 도메인 어조 일관성**이 보장될 때 효과적 (LESSONS L2)
- Stage 1 → Stage 2 는 같은 회상요법 도메인 + 점진적 메타 풍부화 → 안전한 curriculum
- Stage 1 (KoAlpaca, 일반 한국어) → Stage 2 (회상요법) 는 위험 — 이미 폐기

### 발표 contribution
"Curriculum learning 의 효과는 stage 간 도메인 어조 일관성에 강하게 의존. 의료/도메인 specific fine-tune 에서 'general → specific' 패턴은 catastrophic forgetting 위험이 있어 'specific → specific 풍부화' 패턴이 더 안전 (KoAlpaca negative result 로 실증)."

---

## 4. Replay Buffer (Continual Learning)

### 정의
새 task/stage 학습 시 이전 task 의 데이터 일부를 mix 해 학습 → catastrophic forgetting 완화.

### 학술 근거
- **McCloskey & Cohen 1989** — Catastrophic Interference in Connectionist Networks: The Sequential Learning Problem. Psychology of Learning and Motivation.
  - Catastrophic forgetting 의 foundational paper.
- **Rolnick et al. 2019** — Experience Replay for Continual Learning. NeurIPS 2019.
  - Replay buffer 가 continual learning 의 가장 효과적 baseline.
- **Chaudhry et al. 2019** — On Tiny Episodic Memories in Continual Learning. ICML 2019.
  - 작은 replay buffer (수%) 만으로 forget 효과적 완화.

### 우리 적용
- **Stage 2 학습 시**: Stage 1 데이터 30% mix (`23_stage2_train.py:--s1-replay-ratio 0.3`)
- 구체적: Stage 2 페어 2,500 → Stage 1 데이터 random sample 750 mix → 총 3,250 학습
- 의도: Stage 2 의 페르소나-aware 학습 시 Stage 1 의 기본 회상요법 화법이 forget 되지 않게

### Why 우리 case에 적합
- Stage 1 KoAlpaca 폐기 사례 (FAILURES F2) 가 명확한 forgetting evidence
- Stage 1 Proper 의 화법 룰 (5W 금지, 부정어 금지 등) 이 Stage 2 학습으로 약화되면 안전성 회귀

### 발표 contribution
"Continual fine-tune 에서 replay buffer 30% 만으로도 이전 stage 의 도메인 행동 보존 가능. Catastrophic forgetting 의 정량적 evidence (Stage 1 KoAlpaca 9/10 → 1/10 safety) 위에서 설계 결정."

---

## 5. Stratified Sampling (페르소나 다양성 확보)

### 정의
모집단을 여러 strata (subgroup) 로 나누고 각 strata 에서 균형있게 sample. ML 에서는 class imbalance 또는 sub-population imbalance 방지.

### 학술 근거
- **Cochran 1977** — Sampling Techniques. Wiley. (3rd ed.)
  - Stratified sampling 의 통계학 foundational textbook.
- **Branco et al. 2016** — A Survey of Predictive Modeling on Imbalanced Domains. ACM Computing Surveys.
  - ML imbalance 의 다양한 sampling 방법론 정리.

### 우리 적용
- **Stage 2 distill** (`22_stage2_persona_distill.py`):
  - Group key = (age_band × sex × edu_band × MH±)
  - 예: (60대 × 남자 × 중등 × MH-) 그룹당 max 20 페어
  - 예상 그룹: 4 × 2 × 5 × 2 = 80 그룹 → max 1,600 페어 (실제는 빈 그룹 빼서 ~1,500)
- 의도: 특정 페르소나 (예: 고학력 60대 여성) 가 데이터 dominance 못하도록 → 학습 모델의 페르소나 generalization

### Why 우리 case에 적합
1. **AI Hub 71703 분포 편향** — 여 73%, 60대 99K (RESULTS.md). Random sample 시 60대 여성이 dominance → 80대 남성·고학력자 underrepresented
2. **Cross-persona generalization** — 다양한 페르소나에서 일관된 회상요법 응답 필요
3. **Fairness** — 특정 인구통계학적 그룹에 편향된 응답 패턴 학습 방지

### 발표 contribution
"AI Hub 71703 의 인구통계학적 편향 (여 73%) 을 stratified sampling 으로 보정. 페르소나 그룹 80개 균등 sample 로 cross-persona generalization 학습."

---

## 6. System-Grounded SFT (Persona-Aware Response)

### 정의
학습 데이터의 system prompt 에 환자 페르소나 KG 를 명시 → 모델이 응답 시 system context 의 메타에 따라 행동 적응. Persona-grounded dialogue 의 SFT 변형.

### 학술 근거
- **Zhang et al. 2018** — Personalizing Dialogue Agents: I have a dog, do you have pets too? ACL 2018 (Persona-Chat).
  - Persona profile 을 dialogue context 로 주입 → 응답이 persona 일관.
- **Roller et al. 2021** — Recipes for Building an Open-Domain Chatbot. EACL 2021 (BlenderBot).
  - Persona + knowledge + task 를 multi-task SFT.
- **Zhou et al. 2023** — LIMA: Less Is More for Alignment. NeurIPS 2023.
  - 1,000 high-quality system-grounded examples 만으로 alignment 가능 (양보다 질).

### 우리 적용
- **Stage 2 학습 데이터 형식** (`23_stage2_train.py:to_chat`):
  ```
  [system] 회상요법 룰 (THERAPY_SYSTEM, 30줄)
  [system] # 환자 페르소나 컨텍스트 (익명화)
            환자: 60대 남자. 교육: 중등. 거주: 대구시. 정신건강: 우울 경증.
            화제: C2-일상회상(장소) (키워드: 학교).
  [user] <환자 발화>
  [assistant] <페르소나-aware 응답>
  ```
- **Stage 1 호환**: Stage 1 페어는 system_persona 가 비어있음 → 빈 컨텍스트로 처리 (replay 시)

### Why 우리 case에 적합
1. **Production 일치** — ai-server 는 환자 KG fact 를 system context 로 주입함 → 학습도 같은 형식
2. **Persona-aware 행동** — 우울 점수 높은 환자에게는 더 부드러운 톤, 낮은 환자에게는 자연스러운 추억 확장
3. **Cross-persona leak 방어** — 학습 데이터의 system context 만 사용하도록 학습 → runtime 에서 다른 환자 PII leak 위험 ↓

### 발표 contribution
"Persona-grounded SFT 로 environment-conditioned response 능력 학습. ai-server 의 KG context 주입 패턴과 학습 형식이 일치 → production-training mismatch 0."

---

## 7. PII Anonymization + Cross-Persona Leak Defense

### 정의
학습 데이터에서 개인식별정보(PII)를 제거 + 응답이 system context 에 명시된 메타만 사용하도록 grounded → 학습 모델의 메모리화 + 외부 PII leak 방어.

### 학술 근거
- **Carlini et al. 2021** — Extracting Training Data from Large Language Models. USENIX Security 2021.
  - LLM 이 학습 데이터의 PII 를 메모리화 + 추출 가능. 의료 도메인 특히 위험.
- **Lukas et al. 2023** — Analyzing Leakage of Personally Identifiable Information in Language Models. IEEE S&P 2023.
  - PII leakage 정량 측정 + 방어 기법.
- **HIPAA Privacy Rule (1996)** — Safe Harbor 18 identifier 제거 요구사항.
- **Dwork et al. 2006** — Calibrating Noise to Sensitivity in Private Data Analysis. TCC 2006 (Differential Privacy).

### 우리 적용
- **Auto PII detection** (`finetune/scripts/02b_anonymize.py`):
  - 자연 페어 (DB) 629 → PII 25 hit → AUTO_FAIL_PII (4.0%)
  - 합성 페어 300, distill 500 → PII 0 hit (system grounded)
- **Persona anonymization**:
  - 71703 teller 메타 → age_band/sex/region 만 (specific 이름 X, 구체 주소 X)
  - System prompt 에 "응답 시 specific 이름·구체 지명·연도 직접 노출 X" 명시
- **결과** (RESULTS.md):
  - 자연 4.0% PII rate (검수 추가 필요)
  - 합성·distill 0% — system grounded 가 leak 방어 입증

### Why 우리 case에 적합
1. **의료 도메인 규제** — 치매 환자 데이터는 highly sensitive (HIPAA/GDPR/개인정보보호법)
2. **Cross-persona leak risk** — 환자 A 의 학습 데이터가 환자 B 응답에 leak → 신뢰 무너짐
3. **System grounded = automatic defense** — system context 에 페르소나 명시 → 응답이 system 만 참조

### 발표 contribution
"System-grounded fine-tune 으로 PII auto-detection + cross-persona leak 방어 동시 달성. 합성·distill 데이터 0% PII rate (자연 페어 4.0% 대비) 로 system grounding 의 안전성 정량 증명."

---

## 8. Domain-Specific Wiki RAG (Cache-Augmented Generation)

### 정의
Domain knowledge 를 벡터 DB 가 아닌 system prompt 에 통째로 주입 → KV cache 가 prefix 로 작동 → retrieval latency 0 + KV cache 재사용으로 추론 속도 ↑.

### 학술 근거
- **Karpathy 2024** — "LLM Wiki" 트윗/blog (informal).
  - Static domain knowledge 는 RAG 보다 system prompt 통째 주입이 단순 + 빠름.
- **Lewis et al. 2020** — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. NeurIPS 2020.
  - 전통적 RAG (vector retrieval).
- **Anthropic 2024** — Prompt Caching (Claude API).
  - 같은 prefix 의 KV cache 재사용 → cost ↓ 90%, latency ↓.

### 우리 적용
- **Wiki RAG**: `docs/wiki/00~04*.md` (~17.5K 토큰) → ai-server 시작 시 합쳐져 SYSTEM_PROMPT 다음 system message 로 주입
- **OLLAMA_NUM_CTX 32768** — wiki + persona + 대화 이력 수용
- **Effect** (PROGRESS.md 5/2): warmup → 첫 발화 LLM TTFT 13.7s → 0.97s (14× 개선)
  - Ollama KV cache prefix 가 warmup 으로 채워져 첫 응답에서 retrieval prefill 비용 X

### Why 우리 case에 적합
1. **Static knowledge** — 회상요법 도메인 지식은 자주 바뀌지 않음 (RAG 의 동적 retrieval 불필요)
2. **Production latency 핵심** — 환자 EOT → 첫 음성 ~4초 (5× 개선) 목표
3. **Token budget 충분** — 32K context window 에 wiki 17.5K + 대화 ~9K + 응답 = 여유

### 발표 contribution
"Domain-specific knowledge 는 vector RAG 보다 system prompt 직접 주입 (Cache-Augmented Generation) 이 latency · 단순성 측면 유리. KV cache prefix 활용으로 첫 응답 TTFT 13.7s → 0.97s (14×) 달성."

### 검증 실험 (계획)
4 조합 (SP±, wiki±) × 회상요법 시나리오 → fine-tune 모델이 wiki 를 가중치에 흡수했는지 측정 (`docs/presentation/RESULTS.md` "Wiki 절감 검증" 섹션).

---

## 9. LLM-as-Judge (자동 평가)

### 정의
강한 LLM을 evaluator 로 사용해 두 응답 A/B를 비교한다. H2에서는 별도 5차원 rubric 을 만들지 않고, `docs/평가설문지.hwp` 의 **14문항 5점 Likert 설문지**를 기준으로 사용한다. 다만 Q4(답변 속도·음색)는 텍스트 로그만으로 평가할 수 없어 LLM text judge에서 제외하고 별도 시스템/인간 평가로 처리한다.

### 학술 근거
- **Zheng et al. 2023** — Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena. NeurIPS 2023.
  - LLM-as-Judge 가 사람 평가와 80%+ 일치. Position bias / verbosity bias 등 한계 정리.
- **Chen et al. 2024** — Humans or LLMs as the Judge? A Study on Judgement Bias. EMNLP 2024.
  - Bias 패턴 + mitigation.

### 우리 적용
- **Phase 2 H2 검증** (실험설계 v5 §3, RESULTS.md): 40 회상요법 세트 × DSLM (우리 fine-tune) vs Gemini 2.5 Flash → OpenAI judge → `docs/평가설문지.hwp` 중 텍스트 평가 가능한 13문항 점수화
- **설문 영역**: AI와의 상호작용 3문항 + Q4 별도 / 임상적 타당성 4문항 / 안정성과 윤리 6문항
- **Statistical test**: 영역별 Wilcoxon signed-rank + Bonferroni 보정, Cronbach's α, judge self-consistency SD
- **사람 보조 검증**: 전문가 5~7명이 같은 14문항 설문을 블라인드 평가, Krippendorff's α 로 평가자 간 일치도 보고
- **예외 정책**: `experiments/` 폴더 내에서만 OpenAI API 사용 — 본 시스템 (`ai-server/`) 에는 클라우드 API 침투 금지 (CLAUDE.md)

### Why 우리 case에 적합
1. **설문 구조 보존** — 사람이 보는 14문항 설문과 LLM judge rubric 이 같아 해석이 직관적이다.
2. **통계 검정력** — 40세트 전체를 자동 평가해 모델 간 paired 비교가 가능하다.
3. **임상 타당성 보강** — 전문가 소표본 설문으로 LLM judge 방향성을 검증한다.

### 발표 contribution
"`docs/평가설문지.hwp` 의 전문가 평가용 설문지를 LLM-as-Judge rubric 으로 재사용하되, 텍스트로 평가 불가능한 Q4는 별도 처리하여 DSLM 과 Gemini 2.5 Flash 의 회상요법 응답 품질을 같은 기준으로 정량 비교한다."

---

## 10. Cohen's κ — 검수자 일치도

### 정의
2명 이상의 검수자가 같은 데이터에 부여한 라벨의 일치도를 chance agreement 보정 후 측정. -1 ~ 1, 1 = 완벽 일치.

### 학술 근거
- **Cohen 1960** — A Coefficient of Agreement for Nominal Scales. Educational and Psychological Measurement.
- **Fleiss 1971** — Measuring Nominal Scale Agreement Among Many Raters. Psychological Bulletin.
  - 3명 이상 raters 확장 (Fleiss' κ).
- **Landis & Koch 1977** — The Measurement of Observer Agreement for Categorical Data. Biometrics.
  - κ 해석 기준: <0 poor / 0-0.2 slight / 0.2-0.4 fair / 0.4-0.6 moderate / 0.6-0.8 substantial / 0.8-1.0 almost perfect.

### 우리 적용
- **검수자**: 검수자 A·B·C 3명, overlap 30 페어
- **결과** (RESULTS.md, `evidence/cohen_kappa_2026-05-05.md`):
  - Fleiss' κ = **0.5421** (moderate, 권장 0.6 미달)
  - 검수자 A vs 검수자 B 0.4407 / 검수자 A vs 검수자 C 0.5922 / 검수자 B vs 검수자 C 0.6296 (substantial)
- **결론**: 검수 가이드라인 정밀화 필요 → CHECKLIST.md 의 헷갈리는 케이스 추가 (FAILURES F6)

### Why 우리 case에 적합
1. **검수 데이터 신뢰성** — 학습 데이터 quality 의 evidence
2. **체크리스트 한계 정량화** — 단순 체크리스트 (CHECKLIST.md) 만으로 substantial 도달 어려움 → 발표 contribution

### 발표 contribution
"3명 검수자 Fleiss' κ = 0.5421 (moderate). 단순 체크리스트만으로 substantial agreement (κ ≥ 0.6) 도달 어려움 — 도메인 specific 검수 가이드 정밀화 필요. 의료 LLM fine-tune 데이터 검수 방법론 contribution."

---

## 11. Safety Classifier (Output Filter Eval)

### 정의
응답을 외부 safety classifier (혐오·차별·위험 발언 detect) 로 평가. 일반 분류기는 도메인 specific 응답에 false positive 위험 있음.

### 학술 근거
- **Lee et al. 2023** — KMHaS: Korean Multi-label Hate Speech Dataset. ACL.
  - `beomi/korean-hatespeech-classifier` 의 base 데이터셋.
- **Markov et al. 2023** — A Holistic Approach to Undesired Content Detection in the Real World. AAAI 2023.
  - 일반 safety classifier 의 domain shift 한계.

### 우리 적용
- **Classifier**: `beomi/korean-hatespeech-classifier`
- **Eval script**: `finetune/scripts/13_safety_eval.py`
- **결과** (RESULTS.md):
  - Before (gemma + SP + wiki): 9/10 (1 false positive)
  - After Stage 1 KoAlpaca (폐기): 1/10 (9 violations) — catastrophic forgetting evidence
  - After Stage 1 Proper: 7/10 (3 false positive)
- **한계** (FAILURES F3): 일반 분류기는 회상요법 도메인 specific 응답에 false positive — domain-specific safety classifier 필요 (v2)

### Why 우리 case에 적합
1. **Negative result evidence** — Stage 1 KoAlpaca 의 9/10 violations 가 catastrophic forgetting 의 정량적 증거
2. **Domain shift 한계 입증** — 일반 분류기의 false positive 패턴 자체가 학술 contribution

### 발표 contribution
"일반 hate speech classifier 는 도메인 specific 응답 (회상요법 안전 안내) 을 false positive 로 잡음 (3/10). Domain-specific safety classifier 학습 필요성을 정량 evidence 로 제시 (v2 계획)."

---

## 12. EchoRoute — Dual Knowledge Graph Soft Routing (시스템 contribution)

### 정의
환자 발화 → soft routing → 두 knowledge graph partition (**생애기억** `life_memory`: 과거 추억·가족·고향·직업 vs **일상돌봄** `daily_care`: 오늘 약·식사·수면·루틴) 사이의 retrieval 비중을 실시간 결정. **hard 택일이 아니라** 양쪽 다 검색하되 가중치로 top-k 예산을 분배하는 weighted fusion.

### 학술 근거
- **Lewis et al. 2020** — RAG (single retrieval source).
- **Khattab et al. 2023** — DSPy (multi-hop / multi-source retrieval).
- **Semantic routing (prototype 기반)** — 각 그래프 노드 임베딩 centroid 와 query 코사인 유사도. training-free (분류기 학습 없음).
- **우리 자체 설계** — 회상요법 특성 (장기 정체성 vs 단기 일상) + 대화 인지 요소 (inertia·topic_shift·anchor).

### 우리 적용 (`auradb_memory.py`)
- `_classify_mode`: 키워드 점수 → 4모드 (routine_support / memory_support / emotion_grounding / bridge_mode)
- `_MODE_GRAPH_POLICY`: 모드별 daily/life prior (0.7/0.3, 0.2/0.8, 0.35/0.65, 0.5/0.5)
- `_compute_graph_weights`: **임베딩 prototype 코사인 softmax(τ=0.15) 65% + 키워드 prior 35%** blend (`_ECHOROUTE_HINT_ALPHA=0.35`). 임베딩 없으면 prior fallback.
- inertia 0.40 (`_ECHOROUTE_WEIGHT_INERTIA`): 주제 안 바뀌면 직전 턴 가중치와 blend / topic_shift: 직전 토픽 임베딩 코사인 <0.50 / anchor: 대화 중심인물 추적
- `_split_graph_budget`: 가중치로 top-k 분배 (각 그래프 최소 1), 양쪽 검색 후 dominant 그래프 evidence 우선 정렬

### Why soft router — LLM 라우터 측정 후 의도적 배제 (2026-05-31) ★
- **음성 회상 대화는 실시간성이 생명** (STT→LLM→TTS). 라우터는 검색 *전에* 직렬로 와야 하므로 그 시간이 전체 응답에 그대로 더해짐.
- LLM-as-router 직접 측정 (warm, wall-clock median): 최경량 `gemma4:e2b` **+238ms**, `e4b` +278ms, 메인 모델 `remini-stage25-book` **+499ms**. 현행 임베딩 EchoRoute = **LLM 호출 0 → +0ms**.
- 품질: LLM 후보(e2b/e4b)가 까다로운 케이스 5/5 정확 (함정 "밥→어머니 된장국"=life 포함) 했으나, **임베딩 prototype 코사인도 동일 케이스 분간** → 품질 이득 작고 시간 비용 큼.
- 병렬화 한계: 라우터∥메인생성은 데이터 의존성(검색 결과가 LLM 프롬프트 입력)으로 불가. 라우터∥검색은 가능하나 임베딩의 +0ms 를 못 이김.
- → **LLM 라우터를 의도적으로 배제, training-free soft router 채택.** (측정: RESULTS.md System 섹션 / EXPERIMENTS_LOG 2026-05-31)

### 발표 contribution
"회상요법 도메인 특성(생애기억 vs 일상돌봄)을 반영한 dual-KG **soft routing**. 임베딩 prototype + 키워드 prior blend 로 LLM 호출 0. LLM-as-router 를 직접 측정(+238~499ms)해 실시간성 근거로 배제 — 단일 RAG 대비 retrieval relevance 향상 + 음성 대화 latency 보존 (negative result 도 설계 contribution)."

---

## 13. Output Filter — Regex + Replacement Table

### 정의
LLM 응답을 정규식 + 치환 테이블로 후처리 → SP 위반 (의료 진단·민감정보·부정어) 차단.

### 학술 근거
- **Constitutional AI** (Bai et al. 2022) — 별도 헤드 또는 룰 기반 output filtering.
- **Markov et al. 2023** — 위 reference.

### 우리 적용
- `services/output_filter.py` — FORBIDDEN_PATTERNS / REPLACEMENT_TABLE / NEGATIVE_WORDS
- `agent._submit_tts` 와 `full_reply` 통합
- 4단계 방어의 마지막 layer (input classifier → SP → wiki → output filter)

### 발표 contribution
"4단계 안전망 (input classifier → SYSTEM_PROMPT → wiki → output filter regex) 으로 LLM hallucination + 의료 진단 위반 다층 방어."

---

## 14. Clinical-Book-Grounded RAG (임상 도서 RAG 통합)

### 정의
도메인 전문가가 저술한 임상 도서를 추출 → 카테고리화 → 시스템 prompt 의 RAG context 로 주입. 외부 권위 있는 임상 patterns(GOOD/BAD 응답) 을 LLM 응답 생성의 anchor 로 활용.

### 학술 근거
- **Lewis et al. 2020 — RAG (Retrieval-Augmented Generation)**: LLM 의 hallucination + 도메인 지식 부족을 외부 retrieval 로 보완.
- **Gao et al. 2023 — RAG Survey**: 도메인 specific knowledge injection 의 표준 방법론.
- **Zhang 2018, Zhou 2023 — Persona-aware grounding**: structured context grounding 으로 LLM 행동 일관성 ↑.
- **Schank & Abelson 1977 — Scripts**: 임상 시나리오의 GOOD/BAD 응답 쌍은 일종의 script knowledge (사회적 routine 의 abstract representation) 로 LLM 이 학습 가능.
- **Touvron et al. 2023 — Llama 2 safety tuning**: contrastive (positive/negative) pair 로 alignment 효과 입증.

### 우리 적용
- 임상 도서 10권 OCR 추출 (총 415MB → 9.7만 줄)
- 핵심 4권 정제:
  * 요시다 가츠아키 『치매 진행을 늦추는 대화의 기술』 — **50개 GOOD/BAD 시나리오 자동 추출**
  * 일본 회상요법학회 『회상법과 회상요법』 — 1H 화법 (5W 금지·How만)
  * Pati Bielak-Smith 『치매가 인생의 끝은 아니니까』 — NVC 11원칙
  * 카이소호 라이브 라브 연구회 『회상치료의 이론과 실제』 — Q&A 핸드북·회상 주제 카탈로그
- 8 카테고리(C1~C8) 와 50 시나리오 1:1 매핑 → CATEGORIES.md 에 GOOD/BAD 인용 추가
- `docs/wiki/06_회상요법_책.md` 생성 → ai-server SYSTEM_PROMPT 자동 주입 (Cache-Augmented Generation 패턴)
- `BOOK_REFERENCES.txt` → v2 발화/응답 generation 시 LLM context 로 주입
- `SEED_TEMPLATE.csv` 부활 + `book_reference` column → 사용자 22 페어 작성 시 책 모범 응답 직접 참조

### Why 적합 (회상요법 도메인 한정)
- **회상요법은 임상 도메인** — 30년 임상 경험을 가진 전문가(요시다 가츠아키)의 50개 시나리오는 일반 RLHF preference 보다 정확한 reference.
- **GOOD/BAD 쌍의 직접 가용성** — 책 자체가 contrastive pair 형식이라 DPO/preference learning 에 그대로 활용 가능.
- **책 권위 = 학술 외부 검증** — NVC (Marshall Rosenberg 계열), 일본 회상요법학회, 분당서울대병원 등 권위 있는 출처로 시스템의 ethical foundation 강화.

### 발표 contribution
"임상 도서 10권 OCR → 50개 GOOD/BAD 시나리오 자동 추출 → 8 카테고리 1:1 매핑 → 시스템 prompt RAG + fine-tune 데이터 양면 활용. 외부 임상 권위로 LLM 응답 정렬 + DPO contrastive pair 자동 확보 (캡스톤 후 활용)."

### 검증 가능한 metric (예정)
- 위기 시나리오 응답에 책 GOOD 패턴 차용율 (책 RAG 적용 전후)
- 망상 응답의 BAD 패턴 (반박·부정·비웃음) 회피율
- 같은 발화 + 책 RAG 유무 응답 비교 (ablation study)

---

## 15. Photo-Triggered Reminiscence Therapy (시스템 contribution, 2026-05-08)

### 정의
환자와 일반 대화 중 N턴마다 자동으로 회상 자극 사진을 multimodal 로 띄우면서 임상 검증된 4단계 progressive stimulation protocol 을 LLM 이 실시간 적용하는 시스템 패턴. 단순 텍스트 RAG 를 넘어 **시각 자극 + 임상 프로토콜 + 자율 의사 확인** 통합.

### 학술 근거
- **Reminiscence Therapy** (Butler 1963): 노년기 인생 회고 → 자아 통합. 치매 환자 인지·정서 개선 (Woods et al. 2018, Cochrane Review).
- **Cognitive Stimulation Therapy / Progressive Stimulation** (Spector et al. 2003): 단계별 자극으로 환자 부담 분산 + 효과 극대화.
- **Multimodal grounding** (Alayrac et al. 2022 Flamingo): 시각 + 언어 통합이 단일 모달 대비 회상 단서 효과 ↑ (해마 우회 — Rasmussen 2019).
- **Patient-centered autonomy** (Kitwood 1997): 치매 케어 윤리 framework — 환자 자율성·통제권 존중.

### 우리 적용
- 사진 풀: `ai-server/data/reminiscence_photos/` — 사용자가 책 사진 드롭, 파일명이 토픽 제목
- 트리거: 5턴 라포 → 자동. 회상 키워드 ("옛날"·"그때") 시 3턴부터 즉시.
- 4단계 진행 (책 표준 패턴):
  - ① 자유 연상 (책 표준 첫 질문 LLM 강제 prepend)
  - ② 경험 회상 (1H 화법)
  - ③ 분기형 (좋아하셨다면/아니셨다면)
  - ④ 감각·구체 (냄새·촉감·소리·맛)
- 거부 신호 다단계: 강한 거부 즉시 종료 / 명시 STOP → ASK 응답 / 그 외 → CONTINUE
- Cooldown 7턴: STOP 후 자동 재트리거 차단

### Why 적합 (회상요법 도메인 한정)
- 책 = 사진 매개 프로토콜 자체 (LLM 이 보조자 역할 대체 시 자연 호환)
- 음성 + 시각 동시 자극 (해마 손상 우회 경로 — 일차감각피질·편도체 직접 활성화)
- 자동 트리거 = 보호자 부담 ↓ (가족·요양보호사가 책 펴고 진행할 시간·전문성 부족)

### 발표 contribution
"임상 도서의 사진 매개 회상요법 프로토콜을 LLM 시스템에 multimodal 통합. **단순 텍스트 RAG → 사진 + 책 4단계 자극 + 환자 자율 의사 확인** 통합 패턴. 시연 가능한 시스템 contribution."

### 검증 가능한 metric (예정)
- 사진 트리거 on/off ablation: 회상 발화 길이·구체성 (label_1 — AI Hub 71703 metric 차용)
- ASK 응답 분기 정확도 (STOP vs CONTINUE 의도 분류)
- 환자 거부율 / 토픽 평균 유지 턴

---

## 16. Mid-Topic Continuation Confirmation (2026-05-08)

### 정의
회상 토픽을 단방향 keyword trigger ("그만") 로만 종료하는 게 아니라, AI 가 토픽 N턴 진행 후 자동으로 환자에게 의사 확인 발화 ("이 사진은 여기까지 하고 다른 사진 더 볼까요? 아니면 다른 이야기 나눌까요?") 를 던지고 응답에 따라 분기하는 상태 머신.

### 학술 근거
- **Patient-centered autonomy** (Kitwood 1997): 환자 통제권 부여
- **Validation Therapy** (Feil 1993): 환자 의사·감정 검증을 임상 protocol 에 명시
- **Conversational AI ethics** (Bender & Koller 2020): AI 일방적 흐름 강요 X → 사용자 통제권 확보

### 우리 적용
```
IDLE → (라포 5턴) → ACTIVE (사진+책 첫 질문) → (5턴 진행) → ASKING
                                                         ↓
                              STOP 키워드 → IDLE (cooldown 7턴)
                              그 외 → ACTIVE (새 랜덤 사진, 즉시)
                              HARD decline → IDLE (ASK 무시)
```
- STOP 키워드: "아니"·"괜찮"·"이제"·"다음에"·"피곤"·"쉬자"
- CONTINUE = default ("응"·"그래"·"더") — 환자 단답 보호
- HARD_DECLINE: "싫어"·"치워"·"재미 없" 즉시 종료

### Why 적합
- 책 임상 패턴 그대로 (회상요법 진행자가 환자 의사 확인 후 다음 단계)
- 환자 인지 부하 ↓ (단방향 keyword 거부보다 AI 능동 묻기가 부담 적음)
- 회상 과부하 방지 (5턴 후 자동 의사 확인)

### 발표 contribution
"단순 키워드 trigger 와 차별화된, 임상 프로토콜에서 차용한 자율 의사 확인 단계. 환자 통제권 + AI 능동성 균형. 상태 머신 명료 (IDLE → ACTIVE → ASKING → STOP/CONTINUE)."

---

## 17. 4계절 96 토픽 카탈로그 (Wiki RAG 자동 주입, 2026-05-08)

### 정의
분당서울대병원 『기억여행』 4권의 96 회상 자극 토픽(8 카테고리 × 12, 4계절)을 wiki RAG 정제판으로 가공 → SYSTEM_PROMPT KV cache prefill 자동 주입.

### 학술 근거
- **CAG (Cache-Augmented Generation)** (Karpathy 2024): static knowledge KV prefix → TTFT ↓ + 응답 품질 ↑
- **Domain-specific reference catalog**: 임상 가이드라인 정제판 LLM context 주입 (LangChain RAG 패턴)
- **Stratified topic sampling** (Cochran 1977): 카테고리·계절 균형 분포

### 우리 적용
- OCR 4권 11,342줄 전수 정독 → 96 토픽 표제·카테고리·표준 질문/활동 패턴
- 8 카테고리 × 12 토픽 × 4계절: 자연·음식·역사·인생·놀이·문화·생활·환경
- wiki/06 신규 섹션 5: 4단계 점진 자극 + 표준 질문 패턴 + 계절별 토픽 표 + 임상 활용 룰 7개
- 자동 주입: ai-server 시작 시 wiki/06.md 전체 SYSTEM_PROMPT prefix → KV cache prefill

### Why 적합
- 임상 검증된 토픽 풀 (1930~80 한국 노인 보편 경험)
- 표준 질문 패턴이 LLM 어조 가이드 (1H 화법·분기형·다감각)
- 계절 동기화 (시스템 시간 인식 → 현재 계절 토픽 우선)

### 발표 contribution
"임상 도서를 단순 인용 차원이 아니라, **표준 질문/활동 패턴 카탈로그 형태로 정제**하여 LLM 응답에 직접 영향. 96 토픽 매핑 + 4단계 자극 패턴이 자동 주입되어 환자 발화에 자연스럽게 책 표제·표준 질문 차용. v2 generation 시 토픽 sampling 풀로도 활용."

---

## 18. Two-Layer Color Policy: 임상 근거 배경 + 가독성 우선 동적 요소 (환자 메인 화면, 2026-05-09)

### 정의
환자 메인 화면의 색감을 **두 레이어로 분리**:
1. **정적 레이어 (배경, 패널, 텍스트, 회상 사진 frame, 시작/관리 패널)** = 색채심리 임상 근거 기반 **고명도·고채도 난색** (노랑·살구·주황·분홍). 화면 면적의 ~70%.
2. **동적 AI 시각 요소 (JARVIS particle orb, audio visualizer wave, 글로우)** = 노인 가독성 우선 **보색 한색** (파랑·청록·초록·보라). WCAG 보색 대비 표준.

### 학술 근거
**레이어 1 (배경) — 색채심리 임상 연구**
- **김형희·최외선 (2010)** — *색채경험을 통한 집단미술치료가 치매노인의 인지와 정서에 미치는 영향*. 미술치료연구, 17(6), 1447–1472.
  - 치매 노인 13명 17회기 실험: 정서 안정 단계로 진입할수록 노랑 사용 50%↑, 파스텔 난색·고명도·고채도 색 선호 증가. 무채색·검정·갈색·진한 보라/파랑은 우울 정서 표출과 직접 연관 (회기단계별 색채 사용 빈도 표 11–12, p.1464–1465).
- **Birren, F. (1985, 1995)** — *색채심리* / *색채의 영향* (서울: 동국출판사 / 시공사). 노랑·주황·빨강·분홍 난색 = 기쁨·활력·행복 연상.
- **Suenaga, T. (1998)** — *색채심리: 마음을 치유하는 컬러세라피*. 고령자 색채 활용 미술놀이 효과성.
- **하마모토 다카시·이토 마사히로 (2005)** — *색채의 마력*. 난색 = 기쁨/행복 연상.

**레이어 2 (동적 요소) — 노인 가독성·보색 대비 표준**
- **WCAG 2.1 AA** — 시각 강조 요소는 배경 대비 4.5:1 이상.
- **Boyce, P. R. (2003)** — *Human Factors in Lighting*. 60세↑ 노인은 노화로 망막 노란 색소 침착 (yellowing of the lens) 증가 → 노랑 톤 시각 인식 둔화. 노랑 배경에 노랑 element 식별 곤란.
- **Ishihara, M. & Boyce, P. (1995)** — 고령자 색 변별 능력 연구: 노란~주황 영역의 변별력이 가장 빠르게 저하. 보색 (파랑·보라) 변별력은 상대적으로 보존.

→ **결론**: 배경은 임상 근거상 난색이 필수, 그 위에 뜨는 동적 요소는 노화 시각 특성상 **노랑의 보색 (파랑·청록·보라)** 가 식별 최적.

### 우리 적용

**레이어 1 (배경 — 난색 임상 근거)**:
- `--bg-a #fff7e0` (크림 노랑, 주조 ~50%) / `--bg-b #ffefd5` (살구) / `--bg-c #ffe4c4` (비스크)
- `--accent-yellow #ffd54f` / `--accent-coral #ffab91` / `--accent-peach #ffcc80`
- `--ink #3e2723` (매우 진한 브라운, 검정 X — 노인 WCAG AA)
- 시작/관리 패널 거의 불투명 `#fffdf5`, font-weight 800
- 시작 버튼 등 CTA = 난색 그라디언트 `linear-gradient(#ffb74d, #ff8a65)`

**레이어 2 (동적 요소 — 한색 보색 가독성)**:
- **JARVIS particle orb 상태별 매핑** (`jarvis-particle-orb.tsx`):
  - idle = 파랑 `#1976D2` / accent `#42A5F5` — 평온·안정
  - listening = 청록 `#00897B` / `#4DB6AC` — 수용
  - thinking = 진한 보라 `#5E35B1` / `#9575CD` — 집중
  - speaking = 초록 `#388E3C` / `#66BB6A` — 생기·교류 (가장 강한 pulse)
  - reassuring = 짙은 보라 `#6A1B9A` / `#AB47BC` — 깊은 안심
- **Visualizer wave 4 라인** (`patient-visualizer.js`, `agent-audio-visualizer-aura.tsx`): 파랑·청록·진한 보라·초록.
- **Orb drop-shadow 글로우**: `rgba(25, 118, 210, 0.36~0.40)` (파란 글로우).

**기타**:
- PWA theme-color = `#FFD54F` (배경 = 난색이라 status bar 도 노랑)
- App.tsx default theme = `"light"` (다크 토글 폐기)
- 보호자 앱(`caregiver-app/`)은 정보 밀도 우선이라 이 정책 적용 X

### Why 우리 case에 적합
- **임상 근거 위배 X**: 김형희·최외선 (2010) 의 한색 회피 룰은 **환자가 표현 매체로 사용하는 색** (만다라·도화지) 에 적용된 거지, **"환자의 시각 환경 전체에 한 픽셀도 한색이 없어야 한다"** 는 의미가 아님. 배경/주조색이 난색이면 정서 안정 환경 조건 충족.
- **노화 시각 특성 반영**: 60세↑ 망막 yellowing 으로 노랑 톤 식별 둔화. 노랑 배경에 노랑 orb = 임상 근거상 일관되지만 **실용적으로 안 보임**. 보색 한색이 인지적 식별 최적.
- **이중 contribution**: 정적 면적은 색채심리 임상 근거, 동적 강조는 시각 인지 표준. 두 학문 분야의 합리적 결합.

### 발표 contribution
"단일 색감 정렬이 아니라, **시각 면적과 동적 요소의 역할을 분리한 2-레이어 색감 정책** 도입. 배경 70% 면적 = 김형희·최외선 (2010) 임상 근거 난색 (정서 안정), 동적 AI 시각 요소 = 노화 망막 yellowing 보상을 위한 보색 한색 (가독성). 기존 색채심리 적용 연구가 단일 톤만 다룬 한계를 극복."

---

## 19. Cross-corpus Self-distillation 통합 (NAVER CareCall NAACL 2022, 2026-05-10)

### 정의
**외부 한국어 시니어 케어 코퍼스의 봇 응답 톤을 LoRA 가중치에 직접 흡수**하는 cross-corpus 통합. 자체 self-distillation pipeline (Stage 1~2.5, ai-server가 teacher) 위에 외부 검증된 corpus의 (user, system) 페어를 추가 학습하여 시니어 친화 톤(따뜻한 위로 표현) 강화.

### 근거 논문
- **Bae et al., "Building a Role Specified Open-Domain Dialogue System Leveraging Large-Scale Language Models" (NAACL 2022)** — CareCall 코퍼스 출처. 10,500 LM-generated + 100 human-validated 시니어 케어콜 대화. role-specified open-domain dialogue.
- **Hu et al., "LoRA: Low-Rank Adaptation" (ICLR 2022)** — LoRA continuation 패턴 (Stage 2.5 어댑터 위 Stage 2.6 누적)
- **McCloskey & Cohen, "Catastrophic Interference in Connectionist Networks" (1989)** — replay buffer 30%로 이전 stage forget 방어

### 우리 적용
- 추출: `naver-ai/carecall-corpus` git clone → (이전 user 발화, 다음 system 응답) 페어 추출 → out-of-bounds=True 제외 → 길이 1~200자 필터 → dedup → **13,357 페어**
- 학습: Stage 2.5 LoRA 어댑터 위 누적 (`lora_stage2_5_book_aware → lora_stage2_6_carecall`)
  - CareCall 13,357 + Stage 2.5 v2 replay 1,600 (30%) = 14,957 (train 14,210)
  - r=16/α=32, batch 2 × ga 4, epochs 2, lr 1e-4
- 결과: train_loss 0.0894 / eval_loss 0.0932 (gap 0.004) / 2시간 56분
- 정성: "정말 소중", "고생 많으셨어요", "도란도란 수다" 같은 따뜻한 위로 표현 흡수
- 정량: safety 7/10 (Stage 2.5) → **8/10** (Stage 2.6) ↑
- 라이선스: CC-BY-NC-SA 4.0 → 캡스톤 비상업 사용 OK, 발표·논문 인용 시 NAVER 출처 명시

### Why 우리 case에 적합
1. **자체 self-distillation의 ceiling 한계 극복** — Stage 1~2.5는 ai-server가 teacher라 ai-server가 못 만드는 응답은 학습된 모델도 못 만듦. 외부 검증된 시니어 corpus가 새로운 ceiling 제공
2. **CareCall task 부분 호환** — 안부 케어콜 ↔ 회상요법 task 다르지만 **시니어 친화 톤·따뜻한 어조·1H 화법** 호환. replay buffer 30%로 회상요법 룰 보존 + 톤만 흡수
3. **Replay buffer 효과 재입증** — Stage 2.5 신규 1,600 페어 학습 때보다 Stage 2.6 신규 13,357 페어가 9배 큰데도 책 패턴 forget X. McCloskey 1989 검증
4. **Domain-mismatch trade-off 정량화** — train_loss 살짝 ↑ (0.0863 → 0.0894)는 task 충돌 reflect, but eval_loss는 ↓ (일반화 ↑). overfit X (gap 0.004). **trade-off가 정량적으로 측정됨이 학술 contribution**
5. **외부 corpus 통합의 라이선스 안전 모델** — CC-BY-NC-SA 4.0 비상업 캡스톤에서 학술 인용·라이선스 표기로 합법 사용. 향후 v2 상업화 시 제거 절차 명확

### 발표 contribution
"기존 self-distillation pipeline (Stage 1~2.5, ai-server teacher)의 **ceiling을 외부 검증된 한국어 시니어 corpus (NAVER CareCall NAACL 2022)로 확장**. LoRA continuation 패턴으로 Stage 2.5 책 패턴 보존 + CareCall 따뜻한 위로 톤 흡수 두 마리 토끼. Replay buffer 30%가 9배 양 신규 데이터에도 forget 없음 입증. Domain-mismatch trade-off (train_loss 0.0863 → 0.0894, but eval_loss 0.0953 → 0.0932)를 정량적으로 측정하여 cross-corpus 통합의 효과 vs 비용을 학술 evidence로 제시."

---

## 20. PWA Web Push — 위험 발화 즉시 보호자 잠금화면 알림 (시스템 contribution, 2026-05-13)

### 정의
W3C Push API + Service Worker + VAPID 인증을 활용한 **앱 설치 없는 잠금화면 푸시 알림**. 보호자가 보호자 웹앱을 iOS Safari 에서 "홈 화면에 추가" 하면 PWA 가 standalone 모드로 동작하면서 푸시 권한 획득 가능. 환자 위험 발화 발생 → AI 서버가 분류 → 보호자 API → 보호자 폰 잠금화면에 즉시 푸시 (앱이 종료되어 있어도, 폰 잠금 상태여도).

### 학술 근거 / 표준
- **W3C Push API** (Recommendation, 2024) — 브라우저-서비스 워커 푸시 전달 표준.
- **IETF RFC 8030** (2016) — Generic Event Delivery Using HTTP Push. 푸시 서버↔푸시 클라이언트 HTTP/2 프로토콜.
- **IETF RFC 8291** (2017) — Message Encryption for Web Push. ECDH P-256 + HKDF + AES-128-GCM end-to-end 암호화. 푸시 서비스 (FCM/APNs) 는 페이로드 읽지 못함.
- **IETF RFC 8292** (2017) — Voluntary Application Server Identification (VAPID) for Web Push. 애플리케이션 서버의 자체 서명 인증, JWT (ES256) 기반.
- **Apple WWDC 2023** — iOS 16.4 (2023.3) 부터 Safari 의 standalone 모드 PWA Web Push 정식 지원. Apple Developer Program (유료) 불필요.
- **Google Chrome 42+** (2015~) — Android/Desktop Chrome Web Push 지원.
- Inter-Operating Specification: 모든 메이저 브라우저 (Safari 16.4+, Chrome, Firefox, Edge) 가 동일 VAPID 표준 사용 — 단일 키 쌍으로 cross-platform 발사.

### 우리 적용
- **백엔드**:
  - `caregiver/artifacts/api-server/src/web-push.ts` — `web-push@^3` (node) 로 VAPID 서명 + RFC 8291 암호화 자동. `sendPushToPatient(patientId, payload)` 헬퍼가 Neo4j 의 `(:Patient)-[:HAS_PUSH_SUBSCRIPTION]->(:PushSubscription)` 관계 traverse → fan-out → 만료 endpoint (HTTP 404/410) 자동 cleanup.
  - `src/routes/push.ts` — 4 라우트 (vapid-public-key/subscribe/unsubscribe/test).
  - `src/routes/alerts.ts` — 기존 AI 서버 webhook (`risk_level=danger` → `notify_caregiver`) 처리 직후 fire-and-forget 푸시. 응답 차단 X.
  - VAPID 키 쌍 1회 생성 → `.env` 영구 저장.
- **프론트엔드**:
  - `caregiver-app/public/manifest.webmanifest` — `display: standalone`, 192/512 icon + maskable.
  - `public/sw.js` — push 이벤트 → `showNotification` (warning 은 `requireInteraction: true`, vibrate pattern [200,100,200,100,200]), notificationclick → 기존 창 focus 또는 새 창.
  - `app/+html.tsx` — Expo Router web root template. iOS PWA meta (`apple-mobile-web-app-capable=yes`, apple-touch-icon, theme-color).
  - `hooks/usePushSubscription.ts` — SW 자동 등록 + 권한 요청 (user-gesture 안에서) + VAPID public key fetch + subscribe + 서버 등록. standalone 모드 감지 (`matchMedia('(display-mode: standalone)')` + `navigator.standalone`).
  - `components/PushNotificationCard.tsx` — alerts 탭 헤더. 상태별 분기 (미지원 / iOS Safari 비-standalone 안내 / 권한 거부 안내 / 미구독 → 구독 / 구독됨 → 테스트+끄기).

### Why 우리 case 에 적합
1. **EAS dev build vs PWA Web Push trade-off**: iOS 네이티브 푸시는 Apple Developer Program $99/년 + APNs cert + TestFlight 1~2일 검수가 필요한데, **PWA 는 $0, Apple Dev Program 불필요, 빌드 불필요**. 캡스톤 시연 기간 내 적용 가능.
2. **인프라 재사용**: 기존 cloudflared HTTPS 터널 (보호자 웹앱 cloudflared, FEATURES 라인 101) 이 Web Push 의 HTTPS 필수 조건을 그대로 충족.
3. **AI 서버 변경 0**: 기존 `notify_caregiver` webhook 그대로 사용. 푸시 발사는 보호자 API 서버 안에서만. AI/모델 코드 안전.
4. **E2E 암호화 표준 (RFC 8291)**: 메시지 페이로드는 FCM/APNs (Apple/Google) 가 읽지 못함. 환자 위험 발화 메시지 같은 의료 민감 정보가 클라우드 사업자에 노출되지 않음 — HIPAA-style 기준에 부합.
5. **cross-platform 단일 코드**: 같은 VAPID 키로 iOS Safari + Android Chrome + Desktop 동시 작동. 보호자 가족 구성원이 어떤 디바이스 쓰든 한 번에 커버.
6. **잠금화면 즉시성**: 환자 자해 발언 같은 응급 상황에 폴링/앱-내 알림이 아니라 잠금화면 + 진동으로 즉시 전달. 임상 안전 가치 직결.

### 발표 contribution
"치매 환자 케어 시스템에서 보호자 즉시 인지는 환자 안전의 핵심 변수. 본 시스템은 **AI 서버의 위험 발화 분류 (risk_level=danger) → 보호자 폰 잠금화면 푸시까지 평균 1초 이내** end-to-end 파이프라인을 W3C Push API + IETF RFC 8030/8291/8292 표준 위에 구현. 특히 iOS 16.4+ standalone PWA 경로를 채택하여 **Apple Developer Program (유료) 우회**, 비상업 캡스톤·연구 환경에서도 잠금화면 푸시 임팩트 확보. RFC 8291 의 ECDH+AES-128-GCM end-to-end 암호화로 환자 메시지 본문이 FCM/APNs 클라우드 사업자에 노출되지 않는 **medical-data-safe push 채널** 구축. 시스템 빌드 contribution: ① $0 비용 PWA Web Push 채택으로 학생 캡스톤 환경의 알림 인프라 진입장벽 제거, ② AI 위험 분류 → webhook → web-push fan-out → Neo4j 만료 cleanup 까지 자동화된 alert pipeline 설계."

---

## 21. Fish-Speech S2 Pro — SOTA open-source TTS (한국어 자연스러움, 2026-05-23)

### 정의
Fish Audio 의 Dual-Autoregressive (DualAR) 텍스트→스피치 모델. **fishaudio/s2-pro** (5B 파라미터, BF16) 는 80+ 언어 10M+ 시간 학습 + RL alignment + 코덱 디코더 (`codec.pth`) 구조. Zero-shot 보이스 클로닝 지원 (3~30초 reference audio). 자체 호스팅 시 `tools/api_server.py` 가 msgpack `POST /v1/tts` 엔드포인트 제공.

### 학술 근거 / 모델 사양
- **Fish Audio Technical Report** (arXiv:2603.08823) — DualAR 아키텍처, RL alignment, 80+ 언어 학습 데이터셋, RTF 0.195 on H200 (5× 실시간), TTFT ~100ms.
- HuggingFace model card (`fishaudio/s2-pro`, BF16 5B, Safetensors, gated repository).
- **License**: Fish Audio Research License (research/non-commercial royalty-free, commercial separate license via business@fish.audio).
- 비교 base TTS: facebook/mms-tts-kor (MMS, Apache-2.0), Supertone Supertonic (ONNX, 비공식 베타), Alibaba Qwen3-TTS-CustomVoice (sohee/aiden/…).

### 우리 적용
- **별도 프로세스 분리** (Python 3.12 + torch 2.8.0+cu128 강제 → ai-server Python 3.13 과 분리):
  - `fish-speech-server/` (git tag main, v2.0.0) — `uv sync --extra cu128` + s2-pro weights (codec.pth 1.8G + safetensors 8.6G).
  - `start-fish.sh` — `tools/api_server.py --mode tts --device cuda --half --listen 0.0.0.0:8080`.
  - root `start.sh` 의 `[2.5]` 단계가 `TTS_PROVIDER=fish` 일 때만 helper 호출 (조건부, GPU 22.5GB 점유).
- **ai-server 통합** (provider switch 패턴, 기존 supertonic/mms/qwen3 와 동일 인터페이스):
  - `app/services/fish_tts.py` — `msgpack.packb` + `requests.post`, references=[] (random voice) 기본, seed 고정으로 일관 음색.
  - `app/services/tts.py` provider 분기 `"fish"` 추가, 실패 시 MMS 폴백.
  - `.env` `TTS_PROVIDER=fish` + `FISH_TTS_ENDPOINT=http://127.0.0.1:8080/v1/tts` + 토큰형 인증.
- **LICENSE attribution 의무 (라이선스 §IV.a)** — 배포 시 Notice 파일 + "Built with Fish Audio" 명시 예정.

### Why 우리 case 에 적합
1. **한국어 자연스러움 사용자 평가 우위**: 동일 텍스트 ("안녕하세요. 저는 레미니입니다. 오늘 기분이 어떠세요?") 합성 비교에서 사용자 청취 평가가 Supertonic 대비 S2 Pro 압승. 치매 환자 대화 시스템에서 음성 자연스러움은 환자 몰입·신뢰도 핵심 변수.
2. **open-source local-only 정책 부합**: CLAUDE.md 룰 "모든 AI 모델은 오픈소스 로컬" — Fish-Speech 가중치는 HF gated 토큰 후 영구 로컬 보관, 추론 시 외부 API 호출 X. OpenAI/Clova/Azure 클라우드 TTS 와 명확히 구분.
3. **별도 venv 패턴의 안전성**: torch 2.8.0+cu128 (Fish) vs torch 2.4.x+cu121 (ai-server 기존 deps) 충돌 회피. msgpack HTTP 경계로 의존성·메모리·crash 격리.
4. **보이스 클로닝 확장 여지**: 현재는 references=[] random voice 기본이지만, 보호자 목소리 sample 3~10초 reference 로 zero-shot 클로닝 가능 → 기존 `LocalVoiceCloneService` (Qwen3 Base) 와 A/B 비교 실험 가능.
5. **fail-open 폴백 체인**: provider fish 실패 시 MMS (facebook/mms-tts-kor) 폴백 → ai-server 응답 정지 X. 운영 안정성.

### 발표 contribution
"본 시스템은 한국어 자연스러움이 가장 뛰어난 SOTA open-source TTS (Fish-Speech S2 Pro, 5B BF16) 를 자체 호스팅으로 통합. **(1) 별도 Python 3.12+cu128 venv 격리 + msgpack HTTP 경계** 로 ai-server 의존성 충돌 없이 통합 가능한 multi-backend TTS 아키텍처 설계 — 같은 패턴으로 Supertonic / MMS / Qwen3-TTS / Fish-S2 4개 백엔드 provider switch (`TTS_PROVIDER` env) 로 실시간 비교 가능. **(2) 라이선스 명시 (Fish Audio Research License = 비상업/연구 한정)** — 캡스톤·발표·논문 활용 OK, 경진대회 상금·상업 배포 시점에 supertonic 으로 fallback 하는 라이선스-aware 배포 정책. **(3) 시스템 contribution** — 외부 클라우드 TTS API 없이 단일 H200 에서 LLM (gemma4:31b 18GB) + STT (whisper) + Fish-S2 TTS (22.5GB) + Neo4j + ai-server 동시 운영하는 all-local 치매 환자 대화 스택 검증."

---

## 22. Qwen3-ASR-1.7B LoRA Fine-tune (노인 발화 도메인 적응, 2026-05-25)

### 정의
범용 다국어 ASR 모델 (Qwen3-ASR-1.7B, Qwen3-Omni audio multimodal 기반, 52언어) 위에 **노인 한국어 자유대화** 도메인을 LoRA 어댑터로 가르치는 도메인 적응 (Domain Adaptation) 학습. 베이스 모델의 일반 ASR 능력은 보존하면서 노인 특유의 발음·간투어·prosody 를 어댑터에 흡수.

### 학술 근거
- **Hu et al. 2021** — LoRA: Low-Rank Adaptation of Large Language Models. ICLR 2022. 베이스 가중치 동결 + low-rank 행렬만 학습 → fine-tune 비용 ~0.1%.
- **Dettmers et al. 2023** — QLoRA: Efficient Finetuning of Quantized LLMs. NeurIPS 2023. 4bit nf4 양자화 + LoRA 로 65B 모델을 단일 GPU 에서 학습. 우리는 1.7B Qwen3-ASR 에 동일 패턴 적용.
- **Kim et al. 2020** — AI Hub 자유대화 음성 (노인남녀) 데이터셋 (1,000명+, 3,000시간) 구축 가이드라인. 노인 발화 특성: "발화 앞 뒤로 묵음과 간투어가 빈번" — 베이스 ASR 의 환각 트리거.
- **Radford et al. 2022** — Whisper: Robust Speech Recognition via Large-Scale Weak Supervision. 동일 다국어 ASR 도메인 적응 패턴의 비교 baseline.

### 우리 적용
- **베이스 모델**: `Qwen/Qwen3-ASR-1.7B` (BF16, ~3.4GB) — Qwen3-Omni audio multimodal 의 ASR 특화 변형. 한국어 (ko) 포함 52개 언어.
- **학습 데이터**: AI Hub 107 (자유대화 노인남녀) 의 부분 다운로드 — Plan A (스튜디오 + AI스피커) + Plan B (음성수집도구 1zip) 합 **263,049 (wav, transcript) pair / 2,048 시간**.
  - 카테고리 매칭도 사전 검증: 음성수집도구 = ANDROID 95% (환자 PWA 브라우저 마이크 환경 fit), 안부·일상대화 + 자유발화 = 회상요법 시나리오 유사.
  - 필터: duration 0.5~25초, transcript 한글 한 글자 이상, 16kHz 보장.
  - 90/10 train/eval split.
- **LoRA 설정** (`finetune/scripts/32_qwen3_asr_lora.py`):
  - **4bit QLoRA** (bnb nf4 + double quant + bfloat16 compute) → VRAM ~3GB
  - **r=16, alpha=32, dropout=0.05**
  - **target_modules**: `q_proj, k_proj, v_proj, o_proj` (LLM attention 만, audio encoder freeze)
  - **lr 1e-4, batch=2, grad_accum=8 (eff. 16), warmup 50 steps**
- **자체 구현 필요성**: Qwen3-Omni 공식 fine-tune 코드 X (qwen-asr 패키지는 추론 전용, GitHub repo 도 captioner downstream 1예시뿐). transformers + peft 표준 패턴 + audio collator 자체 작성.
- **평가** (`33_qwen3_asr_eval.py`, 메모리 룰 — before/after + safety):
  - WER + CER (jiwer) — 노인 발화 eval split 200 sample
  - **환각 검출 패턴**: `국감장/국토교통위/전당대회` (ghost613 turbo-korean Zeroth 뉴스 fine-tune 환각 trauma) + `thank.*watching/subtitles by` (영문 클리쉐) + 5글자+ 반복

### Why 우리 case 에 적합
1. **베이스 모델 한국어 정확도 우위**: round-trip 검증 (3 wav × short/medium) base Qwen3-ASR-1.7B 와 large-v3-turbo 둘 다 100% — 하지만 노인 어눌함·간투어 시 차이 발생 가능성. 도메인 적응으로 해당 영역 정확도 ↑ 기대.
2. **이전 STT fine-tune trauma 해소**: `ghost613/faster-whisper-large-v3-turbo-korean` 시도 → Zeroth (방송·뉴스 낭독체) fine-tune → 환자 일상 대화 환각 (정치 뉴스 클리쉐) → 폐기. **AI Hub 107 = 자유대화 (시나리오 X), 노인 화자 1,000명+, 환자 환경과 매칭** → 환각 위험 ↓.
3. **LoRA = production trade-off**: 베이스 ASR 능력 (영어/일본어 등 다국어) 보존, 어댑터만 교체로 도메인 전환 가능. 운영 시 `QWEN_ASR_USE_ADAPTER=true` env 토글로 즉시 ai-server 적용 가능.
4. **4bit QLoRA = 단일 GPU 학습**: H200 NVL 의 다른 운영 모델 (메인 LLM 47G, supertonic 등) 공존 가능. 4bit 추론으로도 양자화 후 운영 시 추가 가속.
5. **데이터 풍부도**: 2,048시간 = LoRA 표준 권장 (50~100시간) 의 20배. epoch 0.3~0.5만으로도 효과 충분, overfit 방지.

### 발표 contribution
"한국어 ASR 의 노인 발화 특화 도메인 적응 — **AI Hub 107 (자유대화 노인남녀) 부분 다운 + Qwen3-ASR-1.7B 4bit QLoRA** 패턴으로 H200 단일 GPU 학습. (1) **다운로드 효율화**: 306GB 전체 데이터 중 환자 환경 매칭도 (ANDROID 모바일 + 자유대화) 분석 후 카테고리 부분 다운 (filekey 옵션) 으로 **52G 다운으로 263k pair / 2,048시간 확보**, 디스크 활용 최적화 (175GB 정리 + 211GB 여유 안에 처리). (2) **환각 trauma 해소**: ghost613 turbo-korean 의 Zeroth 뉴스 fine-tune 환각 사례 (FAILURES) 를 학습 — 자유대화 코퍼스 + 환각 검출 패턴 (정치 뉴스 클리쉐 / 영문 클리쉐 / 반복) 으로 safety eval. (3) **Qwen3-Omni 자체 LoRA 구현**: 공식 학습 코드 부재 영역에 transformers + peft 표준 패턴 + audio collator 자체 작성. before/after WER + 환각률 정량 비교."

---

## 23. 입력 유형 적응형 대화 주도권 — 회상 PUSH→PULL (Mixed-initiative + Person-centered, 2026-06-01)

### 정의
대화 주도권(initiative)을 **시스템이 매 턴 회상으로 끌고 가는 PUSH** 에서, **환자가 옛 기억을 꺼낼 때만 따라가고(PULL) 평소엔 지금-여기 일상 대화에 머무는 혼합 주도권(mixed-initiative)** 으로 전환. 입력 분류(일상확인형/회상유도형)에 따라 LLM 가이던스를 적응적으로 분기한다.

### 학술 근거
- **Mixed-Initiative Interaction** — Horvitz, CHI 1999, *"Principles of Mixed-Initiative User Interfaces"*. 시스템과 사용자가 상황에 따라 주도권을 주고받음.
- **Person-Centered Dementia Care** — Kitwood 1997, *Dementia Reconsidered*. 환자의 자기결정·통제권 존중, 강요된 활동보다 환자 주도 상호작용.
- **회상요법 임상 원칙** — 환자가 스스로 떠올리도록 돕되 강요하지 않음 (Butler 1963, Woods 2018; 본 프로젝트 임상 도서 RAG 와 일관).

### 우리 적용
프롬프트·로직 5곳 조정 (재학습 無, 즉시 적용·되돌리기 용이):
1. `llm.py` SYSTEM_PROMPT 정체성 — "매 턴 회상으로 끌지 않음, 지금-여기 화제는 그 자리에서" 명시.
2. `llm.py` 화법 — 감탄·맞장구·농담 허용, 매 턴 회상 질문으로 끝내지 않음.
3. `input_classifier.py` — 일상확인형 가이드 신설 (기존 `None` → "센스있게 일상에 머물기"). 일상 입력에 가이드가 없어 모델이 디폴트 회상으로 회귀하던 문제 해소.
4. `therapy_state.py` — EXPLORATION 자동 진입 3턴 → 5턴, 회상 신호(`reminisce_turns≥1`) 시엔 즉시 진입(PULL 유지).
5. `reminiscence_topics.py` — 사진 첫 권유 4→6턴, 재권유 7→12턴. recall_mood 가속 경로는 유지.

### Why 우리 case 에 적합
- 치매 환자에게 매 턴 과거 시험식 질문은 person-centered care 위반 + 피로·혼란 유발. 환자 주도 시 회상요법 효과는 그대로 유지.
- 재학습 없이 정책만 조정 → 빠른 반복·A/B·롤백. 모델(Stage 2.5)은 그대로 두고 상위 정책 레이어만 변경.

### 발표 contribution
- "회상요법 AI = 회상만 한다"는 단순 구현을 넘어, **대화 주도권 정책(PUSH→PULL)** 을 명시적 설계 변수로 제시.
- **before/after 통제 비교**: `git show HEAD` 로 uncommitted 수정 전 모듈을 그대로 로드 → 추측 없이 before 재현하는 재현가능 패턴. 정량(일상 대화 회상 마커 −50%, 질문 −43%) + 정성(턴별 응답) 입증. 회상 신호 시엔 PULL 유지로 기능 약화 없음 동시 입증.
- honest scope: 새 모델·알고리즘이 아닌 **대화 정책 튜닝** — 그러나 HCI(mixed-initiative)·임상(person-centered) 원칙에 정렬. evidence: `evidence/reminiscence_balance_before_after_2026-06-01.md`.

## 24. Leave-one-out Ablation — 컴포넌트별 회상요법 품질 기여도 (착수 2026-06-03)

### 정의
시스템을 이루는 각 컴포넌트(레이어)를 하나씩 제거(leave-one-out)하고, 전체(full) 대비 품질 변화를 측정해 각 컴포넌트의 기여도를 분리·정량화하는 절제 실험.

### 학술 근거
- Ablation 방법론: 신경과학 lesion study → ML 표준 (Meyes et al., 2019, "Ablation Studies in Artificial Neural Networks").
- 평가: LLM-as-Judge (Zheng et al., 2023, MT-Bench) + Self-consistency (Wang et al., 2023).
- 통계: Wilcoxon signed-rank (paired) + Cohen's dz + Bonferroni 보정 (Holm, 1979).

### 우리 적용
- full = 모든 레이어 ON (fine-tune stage2.5-book + AuraDB GraphRAG retrieval + SYSTEM_PROMPT 회상화법 + CAG 도메인 prefix + input_classifier + therapy_state + reminiscence 사진트리거 + output_filter).
- 8 arm = full + 7 leave-one-out (−CAG / −retrieval / −system_prompt / −classifier / −therapy_state / −reminiscence / −output_filter).
- 본 시스템 `app.services` 함수를 직접 import 해 `conversation.agent.run_agent` 전처리를 배치·멀티턴으로 재현(`experiments/scripts/20_ablation_run.py`), 각 레이어를 플래그로 on/off. retrieval 은 실제 AuraDB(Neo4j P001~P030, 페르소나당 59~112 GraphEntity).
- 환자 발화는 phase2.csv 30턴 고정(통제) — arm 간 동일 입력 시퀀스.
- 품질 = gpt-5.4 LLM-judge 13문항(Q4 제외) 절대 1~5점, self-consistency 3 (`21_ablation_judge.py`).
- Δ = full − ablated (영역별), Wilcoxon + Cohen dz + Bonferroni (`22_ablation_stats.py`).

### Why 우리 case 에 적합
- Phase 1(GraphRAG vs Vector)·Phase 2(DSLM vs Gemini)는 시스템 간 비교였고, 본 시스템 내부 레이어의 기여도 분리는 미답. ablation 이 "어느 레이어가 회상요법 품질을 만드는가"를 직접 답한다.
- 정책 레이어(classifier·therapy_state·reminiscence)는 멀티턴 누적에서만 작동 → 30턴 시나리오 재현이 필수라 단일턴 rubric(`19_cag_ablation`)으로는 불가.

### 발표 contribution
- 컴포넌트별 기여도 랭킹 → 각 설계 결정의 정량적 정당화.
- Δ≈0 / Δ<0 레이어 발견 시 over-engineering 을 정직하게 보고(FAILURES 연계).
- 본 시스템 파이프라인을 그대로 배치 재현한 ablation 하네스 자체가 방법론 기여.

---

## 종합 — 발표용 핵심 메시지

1. **Self-distillation pipeline** — Production 자체가 teacher → 도메인 일치 + 양 무한 + 사람 검수 비용 ↓ (Hinton 2015, Wang 2022, Taori 2023)
2. **QLoRA 4bit unsloth** — Production Q4_K_M 일치, 단일 H200 117분 학습 (Hu 2021, Dettmers 2023)
3. **Curriculum 의 함정** — Stage 간 도메인 어조 일관성 필수, KoAlpaca negative result 로 실증 (Bengio 2009 + LESSONS L2)
4. **Replay buffer 30%** — Catastrophic forgetting 완화 (McCloskey 1989, Rolnick 2019)
5. **Stratified persona sampling** — AI Hub 분포 편향 보정, cross-persona generalization (Cochran 1977)
6. **System-grounded SFT** — Production-training mismatch 0, persona-aware behavior (Zhang 2018, Zhou 2023)
7. **System grounding = PII defense** — 합성·distill 0% PII rate 입증 (Carlini 2021)
8. **Cache-Augmented Generation** — Wiki 17.5K + KV cache prefix → TTFT 14× 개선 (Karpathy 2024 + Anthropic prompt caching)
9. **LLM-as-Judge** — 40 회상 세트 × 설문형 자동 평가(Q4 제외 13문항), 전문가 소표본 Krippendorff α 로 방향성 검증 (Zheng 2023)
10. **Cohen's κ moderate (0.54)** — 단순 체크리스트 한계 정량화, 검수 가이드 정밀화 필요 (Cohen 1960, Landis & Koch 1977)
11. **Domain-specific safety classifier 필요** — 일반 분류기 false positive 정량 evidence (Markov 2023)
12. **EchoRoute dual KG** — 회상요법 특성 반영, 시스템 contribution
13. **4단계 output filter** — Hallucination 다층 방어
14. **Clinical-Book-Grounded RAG** — 임상 도서 10권 → 50 GOOD/BAD 시나리오 → 시스템 prompt + fine-tune 양면 활용 (Lewis 2020, Gao 2023, Schank & Abelson 1977)
15. **Photo-Triggered Reminiscence Therapy** — 사진 매개 multimodal 회상요법 자동 유도 + 책 4단계 progressive stimulation protocol (Butler 1963, Spector 2003, Woods 2018)
16. **Mid-Topic Continuation Confirmation** — AI 능동 의사 확인 단계로 환자 자율성 + 흐름 관리 균형 (Kitwood 1997, Feil 1993)
17. **96-Topic Wiki Catalog (4-Season)** — 임상 책 토픽·표준 질문 패턴 → KV cache prefill 자동 주입 (Karpathy 2024 CAG)
18. **Two-Layer Color Policy** — 배경 (~70%) 은 임상 근거 난색 (김형희·최외선 2010), 동적 AI 시각 요소 (orb·wave) 는 노화 망막 yellowing 보상 보색 한색 (Boyce 2003, Ishihara & Boyce 1995). 시각 면적·역할별 색감 분리
21. **Fish-Speech S2 Pro 통합** — SOTA open-source TTS (5B BF16, 80+ 언어, RL alignment) 자체 호스팅. Python 3.12+cu128 venv 격리 + msgpack HTTP 경계로 ai-server 와 의존성 분리. 사용자 평가 한국어 자연스러움 Supertonic 대비 우위 → 다만 chars 비례 latency + 음색 고정 불가 → Supertonic-3 로 복귀 (2026-05-24, OpenRAIL-M + 31언어 + 30ms 일정 latency)
22. **Qwen3-ASR-1.7B LoRA 노인 발화 도메인 적응** — AI Hub 107 (자유대화 노인남녀 1,000명+/3,000시간) 부분 다운 (52G) 으로 263k pair / 2,048시간 확보. 4bit QLoRA (r=16, target=q/k/v/o_proj, audio encoder freeze) 자체 구현 (Qwen3-Omni 공식 학습 코드 부재). ghost613 turbo-korean 의 Zeroth 뉴스 fine-tune 환각 trauma 해소 — 자유대화 코퍼스 + 환각 검출 패턴 (정치 뉴스 클리쉐 / 영문 클리쉐 / 반복) safety eval (Hu 2021, Dettmers 2023, Radford 2022)
19. **Cross-corpus Self-distillation 통합** — NAVER CareCall NAACL 2022 시니어 톤을 LoRA 가중치 직접 흡수. Stage 2.5 책 패턴 보존 + CareCall 따뜻한 위로 톤 결합. Domain-mismatch trade-off 정량화 (Bae 2022, Hu 2021, McCloskey 1989)
20. **PWA Web Push (의료 안전 알림 채널)** — iOS 16.4+ standalone PWA + W3C Push API + IETF RFC 8030/8291/8292. Apple Developer Program 우회로 $0 비용 잠금화면 즉시 알림. RFC 8291 ECDH+AES-128-GCM end-to-end 암호화로 환자 메시지 본문이 FCM/APNs 클라우드에 노출 X (medical-data-safe). 시스템 contribution
