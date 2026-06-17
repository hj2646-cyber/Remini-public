# H1 RAGAS 4셀 결과 보고서

> 2026-05-14 실행 결과. 발표에서 H1 결과를 설명할 때 이 파일을 기준으로 보면 된다.

---

## 한 줄 결론

**GraphRAG는 VectorRAG보다 Context Precision이 유의하게 높았다.**

즉, GraphRAG가 LLM에게 더 정확한 근거 context를 제공했다.

다만 RAGAS 4개 지표 전체가 모두 이긴 것은 아니므로, 결론은 이렇게 말하는 것이 안전하다.

> H1은 전면 입증이 아니라, 핵심 검색 품질 지표인 Context Precision에서 부분 입증되었다.

---

## 실험 질문

H1의 질문은 이것이다.

> 환자 개인 fact를 검색할 때 GraphRAG가 VectorRAG보다 더 정확한 근거를 제공하는가?

그래서 이 실험의 핵심은 답변 말투가 아니라 **검색된 context의 품질**이다.

---

## 비교한 4개 셀

같은 270개 질문을 네 조건에서 반복해서 실행했다.

| Cell | RAG | LLM | 의미 |
|---:|---|---|---|
| 1 | GraphRAG | DSLM | 우리 로컬 모델 + 구조화 KG 검색 |
| 2 | GraphRAG | Gemini 2.5 Flash | 범용 모델 + 구조화 KG 검색 |
| 3 | VectorRAG | DSLM | 우리 로컬 모델 + 벡터 검색 |
| 4 | VectorRAG | Gemini 2.5 Flash | 범용 모델 + 벡터 검색 |

중요한 점은 **같은 질문이 네 셀에 모두 들어갔다**는 것이다.

그래서 독립표본 비교가 아니라 반복측정 설계다.

---

## 데이터 구조

페르소나 30명 × 질문 9개:

```text
30 x 9 = 270 scenarios
```

각 scenario마다 다음 값이 생긴다.

```text
Cell1 score
Cell2 score
Cell3 score
Cell4 score
```

그래서 통계 검정은 다음 구조로 진행했다.

```text
Within-subject factor 1: RAG
  - GraphRAG
  - VectorRAG

Within-subject factor 2: LLM
  - DSLM
  - Gemini
```

메인 검정은 **2×2 repeated-measures ANOVA**다.

---

## RAGAS 평가 방식

Judge:

```text
Qwen/Qwen2.5-32B-Instruct-AWQ
vLLM on H200
```

RAGAS 지표:

| 지표 | 쉬운 의미 | H1에서의 역할 |
|---|---|---|
| Faithfulness | 답변이 context에 근거했는가 | 답변 환각 확인 |
| Answer Relevancy | 답변이 질문과 관련 있는가 | 답변 적합성 확인 |
| Context Precision | 검색된 context 중 쓸모 있는 근거 비율 | H1 핵심 지표 |
| Context Recall | 필요한 근거가 context에 들어왔는가 | 정답 근거 포함 여부 |

한국어 단답/T-F 라벨 때문에 RAGAS가 불안정해지는 문제를 줄이기 위해, RAGAS 알고리즘은 바꾸지 않고 prompt 예시만 한국어 fact-QA에 맞게 localized했다.

---

## 셀별 평균

| Cell | Faithfulness | Answer Relevancy | Context Precision | Context Recall |
|---:|---:|---:|---:|---:|
| 1 GraphRAG+DSLM | 0.9722 | 0.5753 | **0.7889** | **0.5685** |
| 2 GraphRAG+Gemini | 0.9648 | 0.6070 | **0.7852** | **0.5667** |
| 3 VectorRAG+DSLM | **0.9870** | 0.5756 | 0.6938 | 0.5630 |
| 4 VectorRAG+Gemini | 0.9777 | **0.6246** | 0.6938 | 0.5630 |

Context Precision만 보면:

```text
GraphRAG 평균 = 0.7870
VectorRAG 평균 = 0.6938
차이 = +0.0933
```

---

## 통계 결과

Bonferroni 보정 기준:

```text
alpha = 0.05 / 4 = 0.0125
```

| Metric | GraphRAG | VectorRAG | Δ | RAG p | partial η² | 결론 |
|---|---:|---:|---:|---:|---:|---|
| Faithfulness | 0.9692 | **0.9832** | -0.0140 | 0.0391 | 0.0158 | 보정 후 유의 X |
| Answer Relevancy | 0.5912 | **0.6001** | -0.0089 | 0.2518 | 0.0049 | 차이 없음 |
| **Context Precision** | **0.7870** | 0.6938 | **+0.0933** | **1.34e-05** | **0.0681** | **GraphRAG 유의 우세** |
| Context Recall | **0.5676** | 0.5630 | +0.0046 | 0.8251 | 0.0002 | 차이 없음 |

---

## 발표에서 이렇게 말하면 됨

> H1은 GraphRAG와 VectorRAG를 비교하기 위해 같은 270개 개인 fact 질문을 4개 조건에서 반복 측정한 실험입니다. 생성 모델이 달라져도 결과가 특정 모델에만 의존하지 않는지 보기 위해 DSLM과 Gemini 2.5 Flash를 모두 사용했습니다. 표준 RAGAS 4개 지표로 평가했고, 2×2 repeated-measures ANOVA 결과 Context Precision에서 GraphRAG가 VectorRAG보다 유의하게 높았습니다. 따라서 GraphRAG가 환자 개인 정보 검색에서 더 정확한 근거 context를 제공한다는 H1은 부분적으로 지지됩니다.

---

## 산출 파일

최종 결과:

- `experiments/data/results/ragas_vllm_scores.csv`
- `experiments/data/results/ragas_vllm_summary.md`
- `experiments/data/results/ragas_vllm_2x2_repeated_anova.md`
- `experiments/data/results/ragas_vllm_2x2_repeated_anova_summary.csv`

발표 evidence 복사본:

- `docs/presentation/evidence/phase1_h1_ragas_vllm_4cell_summary_2026-05-14.md`
- `docs/presentation/evidence/phase1_h1_ragas_vllm_4cell_scores_2026-05-14.csv`
- `docs/presentation/evidence/phase1_h1_ragas_vllm_4cell_anova_2026-05-14.md`
- `docs/presentation/evidence/phase1_h1_ragas_vllm_4cell_anova_summary_2026-05-14.csv`

