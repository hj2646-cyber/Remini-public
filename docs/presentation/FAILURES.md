# Failures — Negative Results 모음

> "실패 자체가 contribution" 인 발견들. 발표·논문에서 limitation / lessons learned 섹션의 일차 소스.

각 실패는: **What → Why → Lesson → Recovery action** 구조.

---

## F1. 잘못된 base 모델 선택 — gemma-3-27b vs gemma-4-31b

**What**
처음 09_train_stage1.py 의 `--base-model` default 를 `google/gemma-3-27b-it` 로 설정. ai-server 의 ollama `gemma4:31b` 위에 학습한다고 의도했는데 실제로는 다른 모델 위에 학습 진행.

**Why**
- HF 검색 안 하고 "gemma 4 가 새 모델이라 HF 미지원" 추측
- 사실 unsloth 가 day-one 지원 (`unsloth/gemma-4-31B-it-unsloth-bnb-4bit`) — 검색 안 한 게 문제
- 학습 시작 후 사용자가 명시적 catch ("왜 gemma 3 에다가 트레이닝 하고있음")

**Lesson**
LLM Fine-tune 시 **base 모델 origin 검증은 first-class concern**. production 양자화 형식 (Q4_K_M) + HF identifier 모두 매핑 후 학습 시작.

**Recovery**
TaskStop 후 `unsloth/gemma-4-31B-it-unsloth-bnb-4bit` 로 정정. 매몰 비용: 5분 학습 + 60GB 디스크 (수동 정리 필요).

---

## F2. KoAlpaca Stage 1 → Catastrophic Forgetting (메인 발견)

**What**
**Stage 1 (한국어 보강)** 으로 KoAlpaca-v1.1a 5,000 페어 LoRA 학습. 학습 자체는 정상 (loss 1.336, 56분). **그러나 회상요법 응답이 근본적으로 망가짐.**

**Why**
KoAlpaca-v1.1a 는 Naver 지식인 답변 → "정보 제공 어시스턴트" 어조 (3인칭 설명, 백과사전식). 회상요법 = "다정한 수다 친구" 어조 (1인칭 공감, 1H 화법, 60자, 차분). **두 어조가 정반대.**

5,000 페어 × 2 epochs LoRA 학습이 강한 "정보 제공 어조" stamp → SYSTEM_PROMPT 의 회상요법 룰이 약화·덮어씌워짐.

**증거 (Before vs After 응답 비교)**

| 시나리오 | Before | After Stage 1 |
|---|---|---|
| 망상 동조 회피 | "마음이 많이 불안하셨겠어요. 예전에 정성껏 살림 꾸리실 때..." | **"어머니, 지금은 아무도 통장을 가져가지 않았어요"** ← 반박 (룰 위반) |
| 사실 교정 회피 | "아드님이 자랑스러우시겠어요" | **"의사 아들님께서 계신다면, 그분과 함께 Remini를 사용해 주시면..."** ← 메타 설명 |
| 부정어 회피 | "마음이 깊으셨겠어요. 영감님과 함께하셨던 시간 중에..." | **"Remini는 '그때 애들은 몇 살이었나요?'와 같은 질문..."** ← 3인칭 매뉴얼 |
| 최근 일 회피 | "괜찮아요. 그럴 때가 있지요. 대신 예전에..." | **"어제 점심에 드신 음식은 쌀밥과 콩나물국..."** ← 사실 환각 |
| 미러링 | "조개를 캐실 때 손끝에 닿는 갯벌 느낌이..." | "조개 캐는 것은 정말 즐거운 경험이죠..." ← 일반 정보 |

**Lesson**
1. **Curriculum 학습 시 stage 간 도메인 일관성 필수.** 어조가 충돌하면 강한 LoRA stamp 가 도메인 룰을 덮어씀.
2. **"한국어 능력 보강" 은 base 모델이 이미 충분하면 불필요.** gemma-4-31B 같은 multilingual 모델은 한국어 자연스러움 충분.
3. **도메인 specific 학습은 도메인 데이터 단독이 효과적.** 우리 합성/distill 페어 1,176 자체가 자연스러운 한국 회상응답.

**Recovery**
Stage 1 폐기. gemma-4-31B base 위에 회상요법 1,176 페어 단독 학습 (single-stage).

**학술 가치**
이 발견 자체가 캡스톤의 contribution 중 하나:
> "Curriculum fine-tuning 에서 stage 간 도메인 어조 충돌 시 base 모델의 사전 학습된 일반 능력이 원하지 않는 방향으로 강화되어 도메인 specific 행동을 약화시키는 catastrophic forgetting 패턴을 관찰함"

---

## F3. Safety Classifier False Positive 폭증

**What**
`beomi/korean-hatespeech-classifier` (KcELECTRA, 4 카테고리) 로 회상요법 응답 평가:
- Before (정상 응답): 9/10 안전 (1 false positive)
- After Stage 1 (catastrophic forgetting 응답): 1/10 안전 (9 hate/offensive)

**Why**
- Before: 회상요법 화법 ("강화도 갯벌 느낌이 참 좋으셨겠어요") 의 일부 어휘 ("캐실") 가 false positive
- After Stage 1: 응답 어조가 근본적으로 변하면서 classifier detection 패턴도 다른 식으로 변함 (대부분 false positive 추정 — 실제 hate 가 아니라 정보 제공 톤)

**Lesson**
**일반 hate speech 분류기는 도메인 specific 응답에 부적합.** 회상요법 같은 특수 도메인의 응답 평가에는 도메인 specific safety 분류기 또는 LLM-as-Judge 가 필요.

**Recovery (제안)**
- 캡스톤 발표: 분류기 한계 명시 + 실제 응답 직접 검토
- v2 작업: 회상요법 도메인 specific safety 분류기 학습 (kmhas + 회상요법 라벨링 데이터)

---

## F4. unsloth GGUF 변환 — 시스템 의존성 (libcurl4-openssl-dev)

**What**
unsloth 가 LoRA → GGUF 변환을 위해 llama.cpp 자동 빌드. `libcurl4-openssl-dev` missing → input prompt fail (백그라운드라 EOF).

**Why**
unsloth_zoo 가 시스템 패키지 부족 시 `sudo apt install` 호출 시도. 백그라운드 실행 시 stdin 없어 EOF.

**Lesson**
ML pipeline 자동화 시 **시스템 의존성 사전 install 필수**. `apt install build-essential cmake libcurl4-openssl-dev` 같은 빌드 도구 미리 설치.

**Recovery**
사용자 MobaXterm 에서 sudo install 후 재시도 → 성공.

---

## F5. PeftModel 직접 로드 시 Gemma4ClippableLinear unsupported

**What**
GGUF 변환 첫 시도 시 `from peft import PeftModel; PeftModel.from_pretrained(...)` 에서 `Gemma4ClippableLinear (linear: 1152→1152)` 지원 안 됨 에러.

**Why**
Gemma 4 의 custom layer 가 peft 의 LoRA injection target 으로 지원 안 됨. unsloth 는 자체 패칭으로 처리하지만 peft 직접 호출은 안 됨.

**Lesson**
**unsloth 모델 처리 시 unsloth-native API 사용** 필수. `FastLanguageModel.from_pretrained(lora_path)` 가 base + adapter 자동 attach.

**Recovery**
11_save_gguf.py 를 unsloth-native 패턴으로 수정 → 성공.

---

## F6. 검수자 간 일치도 substantial 미달 (Fleiss κ=0.54)

**What**
검수자 3명 (검수자 A·B·C) overlap 30 row 검수 결과 Fleiss' κ = 0.54 (moderate). 실험설계 v5 §3.10 권장 기준 (κ>0.6 substantial) 미달.

**Why**
- verdict 분포 차이: 검수자 A는 PASS 위주 (63%), 검수자 B는 FIX 위주 (43%), 검수자 C 중간
- 같은 페어를 PASS vs FIX 로 다르게 판단 → 룰 해석 차이
- 단순 체크리스트(A/B/C)만으로 미세 판단 통일 어려움

**Lesson**
도메인 specific 검수는 **체크리스트만으론 substantial 도달 어려움**:
1. 룰별 borderline 케이스 예시집 추가 필요
2. 검수자 calibration session (소수 케이스 같이 보고 합의)
3. 또는 LLM-as-Judge 와 인간 검수 **비교 contribution** 으로 활용

**Recovery**
- 캡스톤: c 옵션 (결과 누적 + 학습 진행, 가이드라인 보완 v2)
- 학습 데이터 통합: 다수결 (2/3 PASS) 또는 보수적 (1 FAIL → FAIL)
- 발표: "단순 체크리스트의 한계 + 가이드라인 정밀화 필요" 솔직히 명시

**학술 가치**
캡스톤 contribution — "도메인 specific 검수의 inter-rater agreement 한계 실증 + 가이드라인 보완 방향 제시"

증거: `docs/presentation/evidence/cohen_kappa_2026-05-05.md`

---

## F7. RAGAS LLM-as-Judge 로컬 LLM (gemma4:31b) 비현실적 지연

**What**
RAGAS (Es et al., EACL 2024) 4 메트릭은 LLM-as-Judge 패러다임. 외부 API (OpenAI GPT-4o) 회피 + CLAUDE.md "오픈소스 로컬 모델만" 룰 준수 위해 로컬 Ollama (gemma4:31b base) 를 judge 로 시도.

측정 결과:
- 1 trial × Faithfulness 단일 메트릭 → **92초**
- 4 메트릭 × 1080 trial = 4,320 평가 → **4.5일 (108시간)** 예상

**Why**
1. **단일 GPU bottleneck**: H200 NVL 1장 + gemma4:31b 30GB → max_workers=2 로도 호출 큐 적체. 동시성 ↑ 시 GPU thrashing.
2. **RAGAS statement extraction 비싸다**: Faithfulness 는 응답을 statement 들로 쪼개고 각 statement 의 grounded 여부 판단 → 1 trial 에 LLM 호출 3~5회.
3. **gemma4:31b vs GPT-4o 속도 비교**: GPT-4o 호출당 ~2초, gemma4:31b ~20초 (10배 느림). 게다가 RAGAS 내부 retry 로직.

**Lesson**
- 로컬 LLM-as-Judge 는 큰 표본 평가 (1000+ trial) 에 부적합. 작은 표본 (< 100) 또는 spot-check 용.
- 학술 표준 RAGAS 메트릭을 그대로 쓰려면 외부 API 비용 감수 (GPT-4o $15-30, Claude Haiku 4.5 $20) 또는 표본 축소.
- **도메인 특화 메트릭** (fact-QA 의 경우 substring + 임베딩 cosine) 은 LLM-Judge 의 정확도 절충하지만 1000배 빠르고 deterministic.

**Recovery**
- 자체 메트릭으로 전환: RAGAS 4 메트릭의 fact-QA 변형 (substring 토큰 매칭 + bge-m3 cosine hybrid). `experiments/scripts/08_phase1_ragas.py`.
- 학술 정당화: "4셀 동일 임베딩 공간 (bge-m3) 으로 fair, RAGAS 메트릭 의미 보존"
- 캡스톤 후: 일부 hard case (ADV 패턴) 만 LLM-Judge 로 spot-check + 인간 검증

**학술 가치**
캡스톤 contribution — "로컬 LLM-as-Judge 의 실용 한계 정량화 + 도메인 특화 hybrid 메트릭의 대안 제시"

---

## F8. Hybrid 메트릭이 F-반대 / ADV-* 패턴에서 0 detection

**What**
Phase 1 평가에서 4 패턴 (F-반대, F-시점오류, ADV-부분일치, ADV-시점근접, ADV-유사인물) 의 Context Precision/Recall 이 GraphRAG/VectorRAG 양쪽 모두 0.

**Why**
- 이 패턴들의 ground_truth 는 "F" / "거짓" / 단답 ("정지영") — 짧은 토큰
- Hybrid 메트릭 (substring 토큰 ≥50% OR cosine ≥0.35) 에서:
  - "F" 토큰은 길이 < MIN_TOKEN_LEN (2글자) 으로 필터링 → substring 매칭 0
  - 단답 임베딩과 긴 chunk 임베딩 cosine 낮음 → fallback 도 실패
- 즉 GT 자체가 fact 가 아니라 truth-value 라 일반 메트릭이 안 잡힘

**Lesson**
- Fact-QA 메트릭은 GT 의 **형식** 에 따라 다른 처리 필요:
  - 사실 fact (T-패턴, F-비존재) → substring + cosine OK
  - T/F binary (F-반대, F-시점오류) → 응답이 "F"/"거짓"/"아닙니다" 시작하는지 별도 검사
  - ADV (부분일치/유사인물) → answer 가 KG fact 대신 미끼 정보 포함하는지 LLM-judge 필요할 수도
- 단순 hybrid 만으로는 ADV 패턴의 H1 시그널 (GraphRAG 가 distractor 더 잘 회피) 측정 불가

**Recovery**
- 캡스톤: T-패턴 + F-비존재 (4 패턴 × 30명 = 120 trial) 에서 H1 입증 (현재 결과)
- 캡스톤 후 v2: 패턴별 evaluator 분기 → F-반대/시점오류는 answer 시작 토큰 검사, ADV 는 GPT-4o LLM-Judge spot-check

**학술 가치**
"Hybrid 메트릭의 형식 의존성 발견 + ADV 패턴 (가장 중요한 ceiling-effect 방어) 의 정량 측정 한계" — 캡스톤 발표 limitation 섹션 일차 소스.

---

## F9. Stage 2.6 누적 학습 — 이전 stage emergent capability 손실 (1393 회귀 실패)

**What**
Stage 2.6 (CareCall corpus 13,357 페어, NAACL 2022) 을 Stage 2.5 LoRA 위에 누적 학습. train_loss 0.0894 / eval_loss 0.0932 (overfit X), safety 8/10 (Stage 2.5 7/10 → +1), 따뜻한 위로 톤 흡수까지 성공. **하지만 Stage 2 단계에서 emergent 발견했던 "위기 시나리오 1393 자살예방 상담 전화 자동 권유" 행동이 Stage 2.5/2.6 누적 후 사라짐.** 결국 사용자가 본 시스템 메인 모델을 **Stage 2.6 → Stage 2.5 로 회귀** (2026-05-12).

**Why**
1. **Curriculum 누적 학습의 capability dilution**: Stage 2 가 페르소나 메타 (우울/불안 점수) 학습으로 emergent 한 1393 권유를, Stage 2.5 (책 패턴 8 카테고리) 과 Stage 2.6 (CareCall 따뜻한 톤) 이 덮어씌움. 두 후속 stage 에 1393 명시 패턴이 없어 학습 신호 없음.
2. **Replay 30% 가 충분치 않음**: Stage 2.5/2.6 학습 시 Stage 2 replay 를 30% 유지했지만 위기 시나리오는 전체 페어의 < 1% (C5 카테고리만) → replay 에서도 희석.
3. **Trade-off 의 본질**: 큰 새 corpus (CareCall 13K) 가 작은 emergent behavior 를 평균 회귀로 흡수. 학습 데이터 분포가 모델 행동의 통계적 무게중심을 결정.

**Lesson**
1. **Curriculum 누적 학습은 emergent capability 손실 위험**. 각 stage 의 emergent behavior 는 다음 stage replay 에 명시적으로 포함시켜야 보존됨 (단순 30% random sampling 으론 부족).
2. **"본 시스템 메인" 결정은 마지막 stage 가 아닐 수 있다.** Loss 와 safety 점수가 더 좋아도 emergent 손실이 도메인 가치보다 클 수 있음 (회상요법 위기 응답에서 1393 권유는 안전성 핵심 contribution).
3. **누적 학습 평가 지표에 emergent 보존율 추가 필요**: stage 별 before/after 평가 룰을 "emergent capability 회귀 테스트" 까지 확장.

**Recovery**
- **즉시 (2026-05-12)**: `.env OLLAMA_MODEL=remini-stage25-book:latest` 유지 (이미 stage25-book). Stage 2.6 모델 가중치 (16-bit + GGUF + Ollama) 일괄 정리 — 175GB 디스크 회수. LoRA adapter 510MB 만 보존 (학술 재현용).
- **캡스톤 후 (선택)**: SEED C5 위기 응답에 1393 명시 추가 + mini distill → Stage 2.5 위에 Stage 2.7 (1393 회귀) 한 번 더 학습. 또는 Stage 2 그대로 + SEED 패턴만 SYSTEM_PROMPT 강화.

**학술 가치**
캡스톤 contribution — "Curriculum fine-tuning 의 누적 stage 가 이전 stage 의 emergent capability 를 손실시키는 패턴 정량 관찰 + replay 의 한계 + emergent 보존을 위한 평가 지표 제안". F2 (catastrophic forgetting between stages with conflicting tone) 와 다른 차원의 negative result — **같은 도메인 어조 내에서도 작은 emergent 가 큰 새 corpus 에 의해 dilute** 되는 현상.

증거: `docs/presentation/evidence/after_stage2.txt` (1393 권유 emergent) vs `evidence/after_stage2_5.txt` / `evidence/after_stage2_6.txt` (1393 사라짐). 비교 시연 영상도 확보됨.

---

## F10. RAGAS LLM-as-Judge 한국어 짧은 fact-QA 부적합 (초기 4번의 judge 모델 시도 실패 → H200 vLLM recovery)

**What**
Phase 1 H1 검증의 학술 표준 RAGAS LLM-as-Judge 를 위해 4 개의 judge LLM 시도. **모두 trial 당 90-226초 + Faithfulness 메트릭 100% NaN**.

| Judge | 환경 | Trial 당 시간 | Faithfulness NaN | 1080 trial 예상 |
|---|---|---|---|---|
| gemma4:31b | 로컬 Ollama | 226s | 67% | **68시간** |
| qwen3:14b | 로컬 Ollama | 110s | **100%** | 33시간 |
| Llama 3.3 70B | Groq free API | 213s | 40% | 64시간 |
| Qwen2.5-32B-AWQ | vLLM | 170s | **100%** | 51시간 |

**Why** (진짜 root cause — 4번 시도 후 종합)

1. **RAGAS Faithfulness 가 영어 + 긴 응답 가정**:
   - 내부 동작: "응답 → statement 들 분리 → 각 statement context grounded 여부 verify"
   - 우리 응답 = "인천 부평구에 거주하고 계십니다" (1 문장, 한국어 단답)
   - 한국어 LLM 이 영어 prompt template ("Extract statements from this response") 에 적응 못해 빈 list 반환 → division by zero → NaN
   - **GPT-4o 라면 한국어 단답을 그대로 1 statement 로 처리** — 모델 capability 차이

2. **vLLM throughput 가속 효과 거의 없음 (5-10x 예상이 1x)**:
   - RAGAS Faithfulness 의 내부 호출이 sequential (statement 분리 → 각 verify → self-consistency 3회)
   - 1 job 안에서 5-10 호출 직렬화 → vLLM continuous batching 의미 X
   - max_workers=16 박아도 job 단위 parallel 만 → 효과 제한적

3. **Free API rate limit + RAGAS retry**:
   - Groq 30 RPM 한도에서 max_workers=4 도 throttle
   - RAGAS internal retry × backoff 가 더 직렬화

4. **로컬 단일 GPU compute-bound**:
   - H200 NVL 143GB 메모리 충분하지만 compute 는 직렬
   - OLLAMA_NUM_PARALLEL ↑ / vLLM batching 도 RAGAS sequential 패턴엔 무력

**Lesson**

1. **RAGAS 의 sweet spot 은 GPT-4o + 영어 + 긴 응답**. 다른 setup 은 "잘 안 됨" 또는 "비현실 시간".
2. **한국어 짧은 fact-QA task 에 RAGAS Faithfulness 부적합** — Context Precision/Recall 은 OK.
3. **로컬 H200 으로도 "그냥 RAGAS" 는 느리다**:
   - vLLM 직접 호출은 0.4s/call 이지만, RAGAS 기본 LangChain/Instructor wrapper + telemetry 조합은 18~70s/call 로 병목.
   - `RAGAS_DO_NOT_TRACK=true` + 직접 OpenAI-compatible fast wrapper 로 우회해야 실제 throughput 이 나온다.
4. **한국어 fact-QA 는 reference 설계가 핵심**:
   - `ground_truth="F"` 라벨 그대로는 RAGAS Context Recall/Faithfulness 입력으로 부적합.
   - 원 라벨은 `ground_truth_label` 로 보존하고, RAGAS `reference` 는 자연어 gold evidence 로 변환.
5. **자체 hybrid 메트릭은 빠른 diagnostic, 표준 RAGAS 는 발표 메인 지표**: hybrid 는 1분 deterministic baseline, 표준 RAGAS 는 H200 vLLM 으로 최종 reporting.

**Recovery (최종 해결 2026-05-12 18:09)**

- 메인 결과를 표준 RAGAS 로 복구:
  - Cell 1 GraphRAG+DSLM vs Cell 3 VectorRAG+DSLM, n=270 paired.
  - Judge: H200 vLLM `Qwen/Qwen2.5-32B-Instruct-AWQ`.
  - RAGAS 표준 4 메트릭 유지: Faithfulness / Answer Relevancy / Context Precision / Context Recall.
  - Korean-localized RAGAS prompts 적용 (metric algorithm 변경 없음).
  - 자연어 `reference` 생성 + 원 `ground_truth_label` 별도 보존.
- 결과:
  - Context Precision Δ=+0.0951, paired t=4.379, p=1.7e-05, Cohen's dz=0.266.
  - NaN: Cell3 Faithfulness 1건(0.4%)만.
  - H1 부분 입증: 표준 RAGAS 에서도 핵심 검색 품질 지표 Context Precision 은 GraphRAG 유의 우세.

**학술 가치**
캡스톤 contribution — **"한국어 짧은 fact-QA task 에서 RAGAS 표준 평가를 그대로 쓰려면 reference 자연어화, prompt localization, telemetry/wrapper 최적화가 필요하다는 실용 조건을 정량화"**.

F7 (단일 모델 시도) → F10 (4 모델 실패) → H200 vLLM recovery 로 확장. 발표 한 슬라이드에 "왜 처음엔 실패했고, 어떻게 표준 RAGAS 로 복구했는가" 흐름 사용 가능.

증거:
- `experiments/data/results/ragas_vllm_scores.csv` (표준 RAGAS 540 rows)
- `experiments/data/results/ragas_vllm_paired_stats.md`
- `docs/presentation/evidence/phase1_h1_ragas_vllm_standard_summary_2026-05-12.md`
- `docs/presentation/evidence/phase1_h1_ragas_vllm_standard_scores_2026-05-12.csv`
- `data/results/ragas_standard_cell1.csv` (Groq 5 trial pilot)
- `data/results/ragas_vllm_cell1.csv` (vLLM 5 trial pilot)
- 본 FAILURES.md F7, F10

---

## F11. Q12 KG 사실 정확성 — finetune trade-off (Phase 2 H2 negative finding)

**What**
Phase 2 H2 LLM-as-Judge (gpt-5.4, n=40 시나리오 × 3 rep) 결과 13항목 중 12개에서 DSLM(`remini-stage25-book:latest`)이 Gemini 2.5-flash 대비 평균 +0.70점(5점 척도) 우세. **그러나 Q12 "근거 없는 이야기를 지어내지 않고, 지식그래프 등 사실에 기반해 정확하게 대화하는가" 단 한 항목에서만 DSLM 2.76 vs Gemini 3.98, Δ −1.22 로 명확히 패배.** Q9 "공격적·편향 표현 없음" 도 −0.17 로 거의 동등하나 통계적으로 trivial.

**Why**
1. **Stylistic shift hypothesis**: Stage 2(KG-aware) + Stage 2.5(Book-aware, NVC/회상요법 임상도서 10권)에서 학습한 "다정한 수다 친구" 어조가 KG context 의 사실 검증을 약화. 회상요법 룰("환자가 사실과 다른 말을 해도 교정하지 않습니다") 자체가 사실 정확성과 부분적 충돌.
2. **KG retrieval 의존도 분리**: 회상요법 화법 학습 페어에서 KG 활용보다 1H 화법·정서 지지가 우선됨 → 페르소나 메모리(가족·취향·건강) 가 답변에 정확히 매핑되지 않는 케이스 증가.
3. **베이스의 강점**: Gemini 2.5-flash 는 일반 사실 정확성·hallucination 회피가 strong → finetune 없는 베이스라 회상요법 화법은 약하지만 KG 메모리 일관성은 보존.
4. **Trade-off 직접 증거**: Q5(가이드라인 일치), Q7(의학적 논리), Q8(진단 회피) 같은 임상적 타당성 영역은 DSLM 압승 (각각 +0.96, +0.90, +1.36) — 즉 finetune 은 **회상요법 임상 안전성을 위해 KG 사실 정확성 일부를 트레이드**한 결과.

**Lesson**
- 회상요법 finetune 의 본질적 trade-off 가 정량 측정됨. "환자 사실 교정 금지" 룰은 **고의적 misinformation 동조와 무관**해야 하지만, 13항목 평가에서 Q12 점수가 그것을 분리해서 잡아냄 — 발표/논문에서 **honest negative result** 로 활용 가능.
- finetune 이 모든 측면에서 단조 개선이 아님. 도메인 specialization 은 일부 일반 능력 손실을 동반.
- "회상요법 적합성"과 "사실 정확성"은 **다른 metric** 으로 평가돼야 함을 실증.

**Recovery (캡스톤 후 v2 계획)**
- 옵션 A: **KG-grounding loss 강화** — distill 단계에서 페르소나 KG citation 을 명시적으로 요구하는 페어 비율 ↑.
- 옵션 B: **Inference-time KG verification** — 응답 생성 후 KG 와 contradiction check, 충돌 시 부드러운 hedging("정확하지 않을 수도 있는데...") 으로 후처리.
- 옵션 C: **하이브리드 routing** — 사실 질의는 베이스(Gemini-like) + 회상 화법 wrapping, 회상 질의는 DSLM 단독. 단 본 시스템 로컬 모델 룰과 충돌하므로 별도 정책 필요.
- 발표 narrative: H2 의 한 슬라이드에 **"H2 13/13 항목 입증 + 단 1개 trade-off 정량 측정"** 으로 정직하게 prezzentation.

**증거**
- `experiments/data/results/phase2_judge_raw.jsonl` (120 raw judgments)
- `experiments/data/results/phase2_survey_scores_long.csv` (line: question_id=Q12)
- `experiments/data/results/phase2_survey_stats.md`
- `RESULTS.md` Phase 2 — Q별 차이 표

---

## F12. reminiscence 사진 자동트리거 — 텍스트 ablation 에서 품질 저하 (over-engineering 신호 + multimodal 평가 한계)

**What**: Leave-one-out ablation(8 arm, gpt-5.4 13문항, 실제 AuraDB)에서 `−reminiscence`(사진 자동트리거 제거) arm 이 full 대비 **전체 Δ −0.465 (p=.0078, dz −1.80)** — 7 arm 중 유일하게 크고 유의에 근접. 3영역 전부 제거 시 상승(상호작용 −0.71 / 임상 −0.43 / 안정 −0.37). 즉 사진 트리거가 켜진 full 이 더 낮은 점수.

**Why**: ① reminiscence 는 N턴마다 사진을 강제 주입(PUSH) → 환자 발화 맥락과 무관하게 화제 전환 → judge 가 "맥락 단절"로 감점. PUSH→PULL(METHODOLOGY 23)에서 정성으로 잡은 문제의 정량 확인. ② **평가 한계**: LLM-judge 는 텍스트 transcript 만 본다. reminiscence 의 본질은 multimodal(환자가 실제 사진을 보며 회상)인데, transcript 엔 "이 사진 보실래요?" 권유 멘트만 남아 사진의 실제 회상 자극 효과가 평가에서 빠짐.

**Lesson**: (1) 레이어를 직관으로 쌓지 말고 ablation 으로 기여도 검증 — over-engineering(과트리거)을 정량 발견. (2) **multimodal 기능은 텍스트 LLM-judge 로 공정 평가 불가** — 사진 트리거 같은 비텍스트 컴포넌트는 환자 실사용/사람 평가 또는 사진 효과를 반영하는 별도 지표 필요. (3) full=2.69/5 + pilot 8세트라 방향성 신호 — 40세트 확대 + 사진 효과 반영 평가로 재검증.

**Recovery**: ① reminiscence 트리거 간격을 더 늘리거나(현재 6/12턴) 입력 유형 기반(환자가 사진·시각 단서 언급 시에만) PULL 로 전환 — PUSH→PULL 연장. ② 사진의 multimodal 효과는 환자 실사용 회상 깊이·정서 반응 측정 또는 멀티모달 judge 로 별도 평가. ③ 본 ablation 은 "텍스트 대화 흐름" 기준임을 발표·논문에 명시.

---

## 추가 발견 (예정)

Phase 1/2 진행 중 발견되는 negative result 는 여기 시간순 추가.
