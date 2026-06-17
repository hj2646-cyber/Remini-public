# H1 RAGAS 실험 쉬운 결과 보고서

> 이 파일은 발표 준비용으로, 실험 설계와 통계 결과를 처음 보는 사람도 이해할 수 있게 풀어쓴 자료입니다.

> 최신 4셀 Gemini 포함 결과는 `docs/presentation/H1_RAGAS_4CELL_GEMINI_RESULT_REPORT.md`를 기준으로 사용하세요. 이 파일의 아래 설명은 Cell 1 vs Cell 3 중심으로 H1 paired design을 이해하기 쉽게 풀어쓴 보조 설명입니다.

---

## 1. 제일 쉬운 요약

이번 실험은 한마디로 이거다.

> 같은 질문을 GraphRAG 방식과 VectorRAG 방식으로 각각 풀게 하고, 질문마다 RAGAS 점수를 찍은 뒤, 두 방식의 점수 차이가 통계적으로 의미 있는지 본 실험.

결론:

> **GraphRAG는 VectorRAG보다 Context Precision이 유의하게 높았다.**  
> 즉, GraphRAG가 LLM에게 더 정확한 근거 context를 제공했다.

---

## 2. H1 가설이 뭐였나

H1은 다음 가설이다.

> 환자 개인 정보를 검색할 때, 구조화된 GraphRAG가 일반 VectorRAG보다 더 정확한 정보를 제공할 것이다.

여기서 핵심은 LLM이 말을 얼마나 예쁘게 하느냐가 아니다.

핵심은:

```text
LLM에게 들어가는 근거 context가 얼마나 정확한가?
```

그래서 가장 중요한 지표는 **Context Precision**이다.

---

## 3. 실험에서 비교한 셀

이번 실험에서는 Cell 1과 Cell 3만 비교했다.

| 셀 | RAG 방식 | LLM | 설명 |
|---|---|---|---|
| Cell 1 | GraphRAG | DSLM | 환자 KG YAML 전체를 context로 제공 |
| Cell 3 | VectorRAG | DSLM | ChromaDB에서 관련 chunk top-5 검색 |

중요한 점:

```text
Cell 1과 Cell 3은 LLM이 같다.
둘 다 DSLM을 쓴다.
```

그래서 두 셀의 차이는 LLM 성능 차이가 아니라 **RAG 방식 차이**로 볼 수 있다.

---

## 4. 실험 데이터는 어떻게 생겼나

페르소나 30명을 만들었다.

각 페르소나마다 질문 9개를 만들었다.

```text
30명 x 9질문 = 270개 질문
```

질문 예시는 이런 식이다.

| 패턴 | 예시 |
|---|---|
| T-거주지 | 김원규 씨의 거주지는 어디인가요? |
| T-직업 | 김원규 씨의 직업은 무엇인가요? |
| T-학력 | 김원규 씨의 최종 학력은 무엇인가요? |
| F-반대 | 김원규 씨는 전라남에 살고 있다. 참/거짓 |
| F-비존재 | 최근 가입한 동호회 이름은 무엇인가요? |
| ADV-부분일치 | 직업은 산업 경비원이다. 참/거짓 |

---

## 5. 점수는 어떻게 찍었나

각 질문 하나마다 Cell 1과 Cell 3에서 각각 답변을 만든다.

예를 들어 질문 하나가 있다고 하자.

```text
질문: 김원규 씨의 직업은 무엇인가요?
```

이 질문을 두 번 실행한다.

```text
Cell 1: GraphRAG로 context 검색 → DSLM 답변 생성 → RAGAS 점수 계산
Cell 3: VectorRAG로 context 검색 → DSLM 답변 생성 → RAGAS 점수 계산
```

즉, 질문 하나마다 이렇게 점수 한 쌍이 생긴다.

| scenario_id | Cell 1 Context Precision | Cell 3 Context Precision |
|---|---:|---:|
| P001-Q02-T-직업 | 1.0 | 0.6 |

이걸 270개 질문 전체에 대해 반복했다.

그래서 최종적으로는 이런 비교가 된다.

```text
GraphRAG 점수 270개
vs
VectorRAG 점수 270개
```

---

## 6. 왜 paired design인가

이 실험은 독립적인 두 집단 비교가 아니다.

왜냐하면 Cell 1과 Cell 3이 서로 다른 질문을 푼 게 아니라, **같은 질문 270개를 두 방식으로 반복해서 푼 것**이기 때문이다.

예시:

```text
P001-Q02-T-직업
→ Cell 1에서도 평가
→ Cell 3에서도 평가
```

따라서 각 질문은 자기 짝이 있다.

그래서 통계적으로는:

```text
독립표본 1-way ANOVA X
반복측정 1-way ANOVA O
paired t-test O
```

RAG 조건이 GraphRAG와 VectorRAG 두 개뿐이라서, 반복측정 1-way ANOVA는 paired t-test와 같은 의미다.

수식으로는:

```text
F = t²
```

---

## 7. RAGAS 지표 4개

이번 실험은 표준 RAGAS 4개 지표를 사용했다.

| 지표 | 쉬운 설명 | 이번 실험에서 보는 것 |
|---|---|---|
| Faithfulness | 답변이 context에 근거했는가 | LLM이 근거 없는 말을 했는가 |
| Answer Relevancy | 답변이 질문과 관련 있는가 | 질문에 맞는 답변인가 |
| Context Precision | 검색된 context 중 쓸모 있는 근거 비율 | 검색 결과가 얼마나 정확한가 |
| Context Recall | 필요한 정답 근거가 context에 포함됐는가 | 정답 재료가 들어왔는가 |

H1에서는 **Context Precision**이 가장 중요하다.

왜냐하면 H1은 “답변 말투”가 아니라 **검색 방식의 정확도**를 비교하는 가설이기 때문이다.

---

## 8. 셀별 평균 결과

| Cell | Faithfulness | Answer Relevancy | Context Precision | Context Recall |
|---|---:|---:|---:|---:|
| Cell 1 GraphRAG | 0.9722 | 0.5753 | **0.7889** | **0.5685** |
| Cell 3 VectorRAG | **0.9870** | **0.5756** | 0.6938 | 0.5630 |

쉽게 보면:

```text
Context Precision:
GraphRAG = 0.7889
VectorRAG = 0.6938
차이 = +0.0951
```

즉, GraphRAG가 검색된 context 안에 더 쓸모 있는 근거를 많이 담았다.

---

## 9. 정규성 검정 결과

정규성 검정은 Shapiro-Wilk test를 사용했다.

결과:

| Metric | Cell 1 정규성 | Cell 3 정규성 |
|---|---|---|
| Faithfulness | 만족 X | 만족 X |
| Answer Relevancy | 만족 X | 만족 X |
| Context Precision | 만족 X | 만족 X |
| Context Recall | 만족 X | 만족 X |

왜 이렇게 나왔나?

RAGAS 점수는 0점, 0.5점, 1점처럼 경계가 있는 점수다.

특히 Context Precision이나 Faithfulness는 1.0이 많이 나온다.

그래서 완벽한 정규분포처럼 생기기 어렵다.

발표에서는 이렇게 말하면 된다.

> RAGAS 점수는 0과 1 사이의 bounded score이고 1점에 값이 몰리는 경향이 있어, Shapiro-Wilk 정규성 검정에서는 정규성이 기각되었습니다.

---

## 10. 등분산성 검정 결과

등분산성은 Levene test로 확인했다.

| Metric | Levene p-value | 등분산성 |
|---|---:|---|
| Faithfulness | 0.0981 | 만족 |
| Answer Relevancy | 0.4602 | 만족 |
| Context Precision | 0.0031 | 만족 X |
| Context Recall | 0.1801 | 만족 |

Context Precision은 등분산성이 깨졌다.

하지만 이 실험은 독립표본 ANOVA가 아니라 paired/repeated-measures 구조다.

그래서 더 중요한 것은 셀별 분산이 완전히 같은지가 아니라, **같은 질문에 대한 두 조건의 차이**다.

그래도 발표에서는 한계로 말하면 좋다.

> Context Precision에서는 Levene 검정상 등분산성이 기각되었기 때문에, paired test와 함께 Wilcoxon signed-rank test를 robustness check로 함께 보고했습니다.

---

## 11. 반복측정 1-way ANOVA 결과

메인 통계 검정은 반복측정 1-way ANOVA다.

조건:

```text
Within-subject factor: RAG 방식
Level 1: GraphRAG
Level 2: VectorRAG
```

결과:

| Metric | F | p | partial eta squared | 해석 |
|---|---:|---:|---:|---|
| Faithfulness | 4.0453 | 0.0453 | 0.0149 | 보정 후 유의 X |
| Answer Relevancy | 0.0013 | 0.9710 | 0.0000 | 차이 없음 |
| **Context Precision** | **19.1724** | **1.7e-05** | **0.0665** | **GraphRAG 유의 우세** |
| Context Recall | 0.0706 | 0.7906 | 0.0003 | 차이 없음 |

Bonferroni 보정 기준:

```text
alpha = 0.05 / 4 = 0.0125
```

Context Precision의 p-value는 1.7e-05로 0.0125보다 작다.

따라서 Context Precision은 통계적으로 유의하다.

---

## 12. paired t-test 결과

반복측정 ANOVA와 같은 의미로 paired t-test도 같이 보고했다.

| Metric | GraphRAG - VectorRAG | t | p | Cohen's dz |
|---|---:|---:|---:|---:|
| Faithfulness | -0.0149 | -2.0113 | 0.0453 | -0.1226 |
| Answer Relevancy | -0.0003 | -0.0363 | 0.9710 | -0.0022 |
| **Context Precision** | **+0.0951** | **4.3786** | **1.7e-05** | **0.2665** |
| Context Recall | +0.0056 | 0.2657 | 0.7906 | 0.0162 |

여기서 중요한 건 Context Precision이다.

```text
GraphRAG - VectorRAG = +0.0951
p = 1.7e-05
```

즉, GraphRAG가 VectorRAG보다 Context Precision이 높고, 그 차이는 우연으로 보기 어렵다.

---

## 13. 비모수 검정으로도 확인

정규성이 깨졌기 때문에 Wilcoxon signed-rank test도 같이 확인했다.

Context Precision 결과:

```text
Wilcoxon p = 1.15e-06
```

이것도 유의하다.

즉, 정규성 가정이 약하더라도 Context Precision 결과는 유지된다.

---

## 14. 최종 결론

최종 결론은 이렇게 말하면 된다.

> H1은 부분적으로 지지되었다. 표준 RAGAS 4개 지표 중 검색 품질을 가장 직접적으로 나타내는 Context Precision에서 GraphRAG가 VectorRAG보다 유의하게 높았다. 반면 Faithfulness와 Answer Relevancy는 같은 DSLM이 두 조건에서 모두 답변을 잘 생성했기 때문에 큰 차이가 없었다.

---

## 15. 발표용 짧은 멘트

> H1 실험에서는 같은 270개 질문을 GraphRAG 조건과 VectorRAG 조건에서 반복 측정했습니다. 각 질문마다 RAGAS 4개 점수를 산출했고, 같은 질문의 두 조건 점수를 paired data로 구성했습니다. 따라서 독립표본 ANOVA가 아니라 반복측정 1-way ANOVA를 사용했습니다. 그 결과 Context Precision에서 GraphRAG가 VectorRAG보다 유의하게 높았고, Bonferroni 보정 후에도 p=1.7e-05로 유의했습니다.

---

## 16. 질문 받았을 때 답변

### Q. 왜 1-way ANOVA인데 paired t-test도 같이 나오나요?

조건이 GraphRAG와 VectorRAG 두 개뿐이기 때문이다.

반복측정 1-way ANOVA에서 조건이 2개면 paired t-test와 같은 검정이 된다.

```text
F = t²
```

그래서 둘 다 같은 결론을 준다.

### Q. 정규성이 깨졌는데 ANOVA 써도 되나요?

RAGAS 점수는 0과 1 사이 점수라 정규성이 잘 깨진다.

그래서 메인으로 반복측정 ANOVA를 보고하되, 비모수 검정인 Wilcoxon signed-rank test도 같이 확인했다.

Context Precision은 Wilcoxon에서도 유의했다.

### Q. 왜 Context Precision만 강조하나요?

H1은 LLM의 답변 말투나 자연스러움을 보는 가설이 아니다.

H1은 RAG 검색 방식이 정확한 근거를 잘 가져오는지 보는 가설이다.

그래서 검색 품질 지표인 Context Precision이 가장 직접적인 지표다.

### Q. Faithfulness는 왜 VectorRAG가 조금 더 높나요?

두 조건 모두 같은 DSLM을 사용했고, VectorRAG도 많은 경우 정답 chunk를 가져왔다.

그래서 최종 답변은 둘 다 context에 잘 근거했다.

이 때문에 Faithfulness 같은 답변 단계 지표에서는 차이가 거의 없거나 VectorRAG가 근소하게 높게 나올 수 있다.

하지만 Bonferroni 보정 후에는 유의하지 않다.

---

## 17. 보고서용 결론 문장

본 실험은 30명 페르소나의 270개 fact-QA 시나리오를 대상으로, 동일 DSLM 조건에서 GraphRAG와 VectorRAG의 검색 품질을 비교하였다. 각 시나리오는 두 RAG 조건에서 반복 측정되었으며, 표준 RAGAS 4개 지표를 산출한 뒤 반복측정 1-way ANOVA를 수행하였다. 분석 결과, GraphRAG는 Context Precision에서 VectorRAG보다 유의하게 높은 점수를 보였으며(F(1,269)=19.1724, p=1.7e-05), 이는 구조화된 KG 기반 정보 제공 방식이 환자 개인 fact 검색에서 더 정확한 근거를 제공함을 시사한다.
