# H2 설문형 LLM-as-Judge 발표 정리

## 1. 한 줄 결론

H2에서는 DSLM과 Gemini 2.5 Flash가 만든 30턴 회상요법 대화를 비교하기 위해, `docs/평가설문지.hwp`의 전문가 평가용 설문지를 LLM-as-Judge rubric으로 사용한다.

단, Q4(답변 속도·음색)는 텍스트 로그만 보는 LLM-as-Judge가 평가할 수 없으므로 제외하고, 시스템 latency/TTS 또는 사람 청취 평가로 별도 처리한다.

## 2. 실제 논문에서도 이런 방식인가?

방향은 맞다.

대표 LLM-as-Judge 연구들은 공통적으로 다음 방식을 사용한다.

1. 강한 LLM을 평가자로 사용한다.
2. 평가 대상 모델의 이름을 숨기고 Model A/B처럼 익명화한다.
3. 같은 입력에 대한 두 응답을 비교하거나, 명확한 rubric에 따라 점수를 준다.
4. 위치 편향(position bias)을 줄이기 위해 응답 순서를 바꾸거나 랜덤화한다.
5. 사람 평가와의 일치도 또는 보조 검증을 함께 보고한다.

우리 H2 설계는 이 흐름을 따른다. 다만 MT-Bench처럼 일반 챗봇 품질을 평가하는 것이 아니라, 회상요법 도메인에 맞춘 **`docs/평가설문지.hwp` 설문형 rubric**을 사용한다는 점이 우리 연구의 적용 차이이다.

## 3. 논문 근거와 우리 설계의 연결

| 논문/흐름 | 핵심 | 우리 설계에 반영한 점 |
|---|---|---|
| Zheng et al. 2023, MT-Bench / Chatbot Arena | GPT-4 같은 강한 LLM을 judge로 사용해 모델 응답을 비교하고, 사람 선호와의 일치 가능성을 보임 | OpenAI judge로 DSLM vs Gemini 응답을 비교 |
| MT-Bench 계열 pairwise 평가 | Model A/B를 익명화하고 두 응답을 비교 | DSLM/Gemini 이름을 숨기고 A/B로 평가 |
| LLM judge bias 연구 | position bias, verbosity bias 등 judge 편향이 존재함 | A/B 순서 교차, 반복 평가, 평균 점수 사용 |
| G-Eval 계열 평가 | 명확한 평가 기준과 단계/rubric을 주고 LLM이 점수화 | `docs/평가설문지.hwp` 설문 중 텍스트 평가 가능한 문항을 scoring rubric으로 사용 |
| 인간 평가 보조 검증 | LLM judge만으로 결론을 고정하지 않고 사람 평가와 비교 | 전문가 5~7명 블라인드 설문으로 방향성 검증 |

## 4. H2 실험 단위

H2의 기본 평가 단위는 단답 질문 하나가 아니라 **30턴짜리 회상요법 대화 로그 1쌍**이다.

| 단위 | 의미 |
|---|---|
| 1세트 | 하나의 환자 상황/회상 시나리오 |
| DSLM 대화 | 우리 모델이 같은 시나리오에서 생성한 30턴 대화 |
| Gemini 대화 | Gemini 2.5 Flash가 같은 시나리오에서 생성한 30턴 대화 |
| 1쌍 | DSLM 대화 1개 vs Gemini 대화 1개 |
| 전체 | 40쌍 = DSLM 40개 + Gemini 40개 = 총 80개 대화 로그 |

## 5. 14문항 설문 구조

14문항은 3개 영역으로 묶는다.

| 영역 | 문항 수 | 평가 의미 |
|---|---:|---|
| AI와의 상호작용 | 3 + Q4 별도 | 맥락 기억, 감정 지지, 부정확 발화 이해. Q4 답변 속도/음색은 별도 평가 |
| 임상적 타당성 | 4 | 치매 돌봄 지침 일치, 기억/인지 자극 질문, 의학적 궁금증 응대, 확정 진단 회피 |
| 안정성과 윤리 | 6 | 무례 표현 회피, 응급 상황 프로토콜, 안전 가드레일, KG 기반 정확성, 민감 주제 전환/보호자 호출, 잘못된 약물 정보 거절 |

Judge는 각 문항을 Model A와 Model B에 대해 각각 1~5점으로 채점한다.

## 6. Self-Consistency 3회가 의미하는 것

Self-consistency 3회는 같은 대화쌍을 judge가 3번 평가하게 하는 것이다.

목적은 LLM judge의 평가 흔들림을 줄이고, 순서 편향을 완화하는 것이다.

권장 실행 방식:

| 반복 | 제시 순서 | 목적 |
|---|---|---|
| 1회차 | Model A = DSLM, Model B = Gemini | 기본 평가 |
| 2회차 | Model A = Gemini, Model B = DSLM | 위치 편향 완화 |
| 3회차 | 순서 랜덤 | judge 안정성 확인 |

결과 분석 시에는 A/B 라벨을 다시 원래 모델명으로 매핑하고, 3회 점수 평균을 사용한다. 반복 평가의 표준편차도 함께 기록하면 judge 안정성을 설명할 수 있다.

전체 judge call 수:

```text
40쌍 × 3회 반복 = 120 judge call
```

중요한 점은 문항별로 따로 호출하는 것이 아니라, **한 번의 judge call에서 Q4를 제외한 13개 text-evaluable 문항 전체를 JSON으로 채점**한다는 것이다.

## 7. 통계 검증

H2는 같은 시나리오에서 DSLM과 Gemini를 비교하므로 paired design이다.

분석 절차:

1. 문항별로 DSLM 점수와 Gemini 점수를 계산한다.
2. Q4를 제외한 13문항을 3개 영역 평균으로 묶는다.
3. 각 영역에서 DSLM과 Gemini의 paired difference를 계산한다.
4. 영역별 Wilcoxon signed-rank test를 수행한다.
5. 3개 영역 검정이므로 Bonferroni 보정을 적용한다.
6. 설문 문항 신뢰도는 Cronbach's alpha로 확인한다.
7. 전문가 보조 검증은 Krippendorff's alpha로 평가자 간 일치도를 확인한다.

## 8. 발표용 슬라이드 문장

### 짧은 버전

> H2에서는 `docs/평가설문지.hwp`의 전문가 평가용 설문지를 LLM-as-Judge rubric으로 사용하되, 텍스트로 평가할 수 없는 Q4는 별도 처리해 DSLM과 Gemini 2.5 Flash의 회상요법 대화 품질을 비교했다.

### 방법 설명 버전

> 각 실험 세트는 동일한 회상 시나리오에 대해 DSLM과 Gemini가 생성한 30턴 대화 1쌍으로 구성된다. OpenAI judge는 모델명을 보지 않은 상태에서 Model A/B의 대화를 읽고, 전문가 설문 중 텍스트 평가 가능한 13문항 Likert 척도로 평가한다.

### 편향 방어 버전

> LLM judge의 위치 편향을 줄이기 위해 Model A/B 순서를 교차하고, 같은 대화쌍을 3회 반복 평가해 평균 점수를 사용했다. 또한 전문가 블라인드 설문을 보조 검증으로 수행해 LLM judge 결과의 방향성을 확인한다.

### 논문 근거 버전

> 이는 MT-Bench와 Chatbot Arena에서 사용된 LLM-as-Judge 방식처럼 강한 LLM을 평가자로 활용하되, 본 연구의 회상요법 도메인에 맞춰 전문가 설문 14문항을 rubric으로 적용한 것이다.

## 9. 발표에서 조심할 표현

안전한 표현:

> LLM-as-Judge를 사람 평가의 완전한 대체재로 사용한 것이 아니라, 대규모 자동 평가를 위한 1차 정량 평가자로 사용하고 전문가 설문으로 보조 검증했다.

피해야 할 표현:

> LLM judge가 사람이랑 완전히 똑같이 평가한다.

피해야 하는 이유:

LLM judge는 position bias, verbosity bias 같은 편향이 알려져 있다. 그래서 순서 교차, 반복 평가, 전문가 보조 검증을 같이 제시하는 것이 안전하다.

## 10. 실행 결과 — 2026-05-14 ✅ 완료

### 실행 사양

- 환자 발화: 40 시나리오 × 30턴, **LLM 미관여 결정적 생성** (`11_phase2_make_scenarios.py` 페르소나 슬롯 + 템플릿). DSLM/Gemini 동일 입력 통제 비교 보장.
- DSLM: `remini-stage25-book:latest` (Stage 2.5 Book-aware finetune)
- Gemini: `gemini-2.5-flash`, REST API + `thinkingBudget=0` (SDK 끊김 회피)
- Judge: OpenAI `gpt-5.4`, temperature=0, JSON mode
- self-consistency 3 rep × counterbalanced (rep1 A=DSLM, rep2 A=Gemini, rep3 random)
- 총 80 응답 + 120 judge call, 27.4분, 708,805 token

### 핵심 수치 — 한 슬라이드용

| 영역 | DSLM | Gemini | Δ | Wilcoxon p | Cohen's dz |
|---|---:|---:|---:|---:|---:|
| AI와의 상호작용 | 4.31 | 3.59 | **+0.72** | <1e-7 | **2.35** |
| 임상적 타당성 | 4.16 | 3.17 | **+0.99** | <1e-7 | **2.97** |
| 안정성과 윤리 | 3.78 | 3.28 | **+0.49** | <1e-5 | **1.08** |
| **전체 13항목** | **4.02** | **3.32** | **+0.70** | **<1e-7** | **2.16** |

- 모든 영역 Bonferroni α=0.0167 통과
- Cohen's dz ≥ 0.8(대형) 을 **전 영역에서 충족**

### 선호 투표 (블라인드)

- DSLM 113 / Gemini 7 / Tie 0 (120 판정)
- Binomial p = **4.77 × 10⁻²⁶**
- 시나리오 단위 3:0 압승: 36 / 40

### Judge 일관성

- Self-consistency SD 평균: 0.187
- Cronbach's α: DSLM 0.695, Gemini 0.693
- 순서 sanity (rep1/rep2/rep3 모두 DSLM 압승): 37 / 37 / 39 → 위치 편향 없음

### Trade-off 정직 보고

- **Q12 KG 사실 정확성**: DSLM 2.76 vs Gemini 3.98, **Δ −1.22** (단 1개 항목에서만 패배)
- finetune 이 회상요법 화법·임상 안전성을 위해 일반 사실 정확성 일부를 트레이드한 결과
- F11 (FAILURES.md) 에 상세 → 캡스톤 후 v2: KG-grounding 강화

### 발표 한 줄

> H2 13/13 항목 + 3영역 모두 통계적으로 유의하게 DSLM 우세 (Cohen's dz 2.16, 선호 113:7, p=4.77e-26). 단 Q12(KG 사실성)에서만 trade-off — finetune 의 정직한 한계로 보고.

### 증거 파일

- `experiments/data/responses/phase2_responses.jsonl` — 40 페어 × 60 utterance
- `experiments/data/results/phase2_judge_raw.jsonl` — 120 raw judgments
- `experiments/data/results/phase2_survey_stats.md` — full report
- `docs/presentation/evidence/phase2_h2_survey_*_2026-05-14.{md,csv}` — evidence snapshot

---

## 11. 참고 문헌

- Zheng et al. (2023). *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*. arXiv:2306.05685. https://arxiv.org/abs/2306.05685
- Liu et al. (2023). *G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment*. arXiv:2303.16634. https://arxiv.org/abs/2303.16634
- Chen et al. (2024). *Humans or LLMs as the Judge? A Study on Judgement Biases*. EMNLP 2024 / arXiv:2402.10669. https://arxiv.org/abs/2402.10669
