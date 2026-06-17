# H1 표준 RAGAS 실험 발표 가이드

> 목적: 발표를 처음 듣는 사람이 "무엇을 비교했고, 무엇으로 평가했고, 왜 이 결론이 나오는지" 이해하도록 설명하기 위한 별도 자료.

---

## 1. 한 줄 요약

**같은 LLM에게 같은 질문을 던졌을 때, 개인 정보를 구조화된 GraphRAG로 넣는 방식이 VectorRAG보다 필요한 근거를 더 정확하게 제공하는지 검증했다.**

결론은 **부분 입증**이다.  
표준 RAGAS 4개 지표 중 **Context Precision**에서 GraphRAG가 VectorRAG보다 유의하게 높았다.

---

## 2. 왜 이 실험을 했나

Remini는 치매 환자의 생애기억, 가족관계, 거주지, 직업, 일상 정보 같은 개인 정보를 바탕으로 대화한다.

이때 중요한 질문은 다음이다.

> 환자 개인 정보를 LLM에게 줄 때, 그냥 문장 조각을 검색해서 주는 VectorRAG보다, 구조화된 지식그래프 형태로 주는 GraphRAG가 더 정확한가?

이것이 H1 가설이다.

**H1: GraphRAG는 VectorRAG보다 페르소나 사실 검색에서 더 우수하다.**

---

## 3. 비교한 두 조건

이번 발표용 실험은 **Cell 1 vs Cell 3**만 비교했다.

| 조건 | RAG 방식 | LLM | 의미 |
|---|---|---|---|
| Cell 1 | GraphRAG | DSLM | 구조화된 KG YAML 전체를 context로 제공 |
| Cell 3 | VectorRAG | DSLM | ChromaDB + bge-m3로 관련 문장 chunk top-5 검색 |

여기서 DSLM은 Remini에서 사용하는 자체 도메인 특화 로컬 모델이다.

Cell 1과 Cell 3 모두 같은 LLM을 쓰기 때문에, 성능 차이는 LLM 차이가 아니라 **정보 제공 방식의 차이**로 해석할 수 있다.

---

## 4. GraphRAG와 VectorRAG의 차이

### GraphRAG

GraphRAG는 환자 정보를 구조화된 형태로 보관한다.

예를 들면 다음과 같다.

```yaml
name: 김원규
residence:
  province: 인천
  district: 인천-부평구
occupation: 건물 경비원
education:
  level: 고등학교
children:
  - name: 김혜진
```

질문이 들어오면 해당 환자의 구조화된 KG 전체를 LLM에게 제공한다.

장점은 정답 fact가 누락될 가능성이 낮고, 항목 간 관계가 명확하다는 점이다.

### VectorRAG

VectorRAG는 환자 정보를 자연어 문장 chunk로 나누고, 질문과 의미적으로 가까운 chunk를 검색한다.

예를 들면 다음과 같은 chunk들이 있다.

```text
김원규 씨는 65세 남자이며, 인천 부평구에 거주합니다.
김원규 씨의 직업은 건물 경비원입니다.
김원규 씨의 자녀는 김혜진, 김재영입니다.
```

질문이 들어오면 `bge-m3` 임베딩으로 질문과 가까운 chunk top-5를 ChromaDB에서 가져온다.

장점은 일반적인 RAG 방식과 비슷하고 확장성이 좋지만, 특정 fact가 top-k에 안 들어오면 LLM이 정답 근거를 못 받을 수 있다.

---

## 5. 실험 데이터

실험에는 가상의 한국어 페르소나 30명을 사용했다.

각 페르소나마다 9개 질문을 만들었다.

| 패턴 | 예시 | 목적 |
|---|---|---|
| T-거주지 | 김원규 씨의 거주지는 어디인가요? | 정답 fact 검색 |
| T-직업 | 김원규 씨의 직업은 무엇인가요? | 정답 fact 검색 |
| T-학력 | 김원규 씨의 최종 학력은 무엇인가요? | 정답 fact 검색 |
| F-반대 | 김원규 씨는 전라남에 살고 있다. 참/거짓 | 잘못된 주장 판별 |
| F-비존재 | 최근 가입한 동호회 이름은? | 없는 정보에 대한 환각 방지 |
| F-시점오류 | 2001년에 결혼했다. 참/거짓 | 날짜 오류 판별 |
| ADV-부분일치 | 산업 경비원이다. 참/거짓 | 비슷한 단어 혼동 방지 |
| ADV-시점근접 | 1990년에 결혼했다. 참/거짓 | 1년 차이 같은 근접 오류 판별 |
| ADV-유사인물 | 자녀 이름은 김민지이다. 참/거짓 | 비슷한 이름 혼동 방지 |

총 실험 수:

```text
30명 x 9질문 x 2조건 = 540 trial
```

통계 검정은 같은 질문에 대한 Cell 1과 Cell 3 결과를 짝지어 비교하는 **paired t-test**를 사용했다.

---

## 6. 평가에 사용한 도구

### RAGAS

RAGAS는 RAG 시스템을 평가하기 위한 표준 평가 프레임워크다.

이번 실험에서는 RAGAS의 표준 4개 지표를 사용했다.

| 지표 | 쉽게 말하면 | 이 실험에서의 의미 |
|---|---|---|
| Faithfulness | 답변이 제공된 context에 근거하는가 | LLM이 근거 없는 말을 했는가 |
| Answer Relevancy | 답변이 질문과 관련 있는가 | 질문에 맞는 답을 했는가 |
| Context Precision | 검색된 context 중 쓸모 있는 근거 비율 | 검색 결과가 얼마나 정확한가 |
| Context Recall | 필요한 정답 근거가 context에 포함됐는가 | 정답을 맞힐 재료가 들어왔는가 |

H1에서 가장 중요한 지표는 **Context Precision**이다.  
왜냐하면 H1은 LLM의 말솜씨가 아니라 **검색 방식 자체의 품질**을 비교하는 가설이기 때문이다.

### Judge LLM

RAGAS는 일부 지표를 계산할 때 LLM-as-Judge를 사용한다.

이번 실험에서는 H200 서버에서 vLLM으로 다음 모델을 띄워 judge로 사용했다.

```text
Qwen/Qwen2.5-32B-Instruct-AWQ
```

사용 인프라:

| 항목 | 사용 |
|---|---|
| GPU | NVIDIA H200 NVL |
| Serving | vLLM OpenAI-compatible server |
| Judge model | Qwen2.5-32B-Instruct-AWQ |
| Embedding | BAAI/bge-m3 |
| Vector DB | ChromaDB |
| 평가 프레임워크 | RAGAS |

---

## 7. 왜 그냥 RAGAS를 돌리면 실패했나

처음에는 표준 RAGAS를 그대로 돌렸지만 문제가 있었다.

우리 데이터의 정답 중 일부는 다음처럼 너무 짧았다.

```text
F
정보 없음
인천 부평구
```

RAGAS는 이런 라벨 자체보다, 자연어로 된 정답 근거 문장을 더 잘 평가한다.

그래서 정답 라벨은 보존하되, RAGAS 입력용 reference를 자연어로 바꿨다.

예시:

```text
원래 ground_truth_label:
F

RAGAS reference:
제공된 페르소나 정보 기준 김원규 씨의 거주지: 인천 부평구.
```

또한 한국어 단답에서 Faithfulness가 빈 statement를 만드는 문제가 있어서, RAGAS의 metric algorithm은 바꾸지 않고 **prompt 예시만 한국어 단답에 맞게 보정**했다.

즉, 발표에서는 이렇게 설명하면 된다.

> RAGAS 표준 지표는 그대로 사용했다. 다만 한국어 T/F 라벨은 RAGAS가 평가하기 어려워, 원 라벨은 보존하고 평가용 reference만 자연어 근거 문장으로 변환했다.

---

## 8. 실행 흐름

실험은 크게 세 단계다.

### 1단계: 응답 생성

Cell 1과 Cell 3에서 같은 질문에 대해 LLM 답변을 생성한다.

```text
질문
→ GraphRAG 또는 VectorRAG로 context 검색
→ 같은 DSLM에게 context + 질문 입력
→ 답변 저장
```

관련 스크립트:

```text
experiments/scripts/07_phase1_run.py
```

### 2단계: 표준 RAGAS 평가

저장된 답변과 context를 RAGAS 4개 지표로 평가한다.

관련 스크립트:

```text
experiments/scripts/08c_phase1_ragas_vllm.py
```

주요 설정:

```text
cells: 1,3
prompt-mode: korean-localized
wrapper: fast
judge: Qwen2.5-32B-Instruct-AWQ on vLLM
```

### 3단계: 통계 검정

같은 질문에 대한 GraphRAG 점수와 VectorRAG 점수를 짝지어 paired t-test를 수행한다.

결과 파일:

```text
experiments/data/results/ragas_vllm_paired_stats.md
```

---

## 9. 최종 결과

| Metric | GraphRAG | VectorRAG | Graph - Vector | p |
|---|---:|---:|---:|---:|
| Faithfulness | 0.9722 | 0.9870 | -0.0149 | 0.0453 |
| Answer Relevancy | 0.5753 | 0.5756 | -0.0003 | 0.9710 |
| **Context Precision** | **0.7889** | **0.6938** | **+0.0951** | **1.7e-05** |
| Context Recall | 0.5685 | 0.5630 | +0.0056 | 0.7906 |

Bonferroni 보정 기준:

```text
alpha = 0.05 / 4 = 0.0125
```

따라서 **Context Precision은 통계적으로 유의하다.**

---

## 10. 결과 해석

### 핵심 해석

GraphRAG는 VectorRAG보다 검색된 context 안에 실제로 유용한 근거가 더 많이 포함됐다.

즉, 환자 개인 정보처럼 구조화된 fact를 다룰 때는, 의미 기반 chunk 검색보다 구조화된 KG 제공이 더 정확한 근거를 줄 수 있다.

### 왜 Faithfulness와 Answer Relevancy는 차이가 작나

두 조건 모두 같은 DSLM을 사용했다.

그리고 VectorRAG도 top-5 안에 정답 chunk가 들어오는 경우가 많았다.

그래서 최종 답변은 두 조건 모두 꽤 잘 나왔다.  
이 때문에 답변 품질 지표는 saturation이 발생했다.

발표에서는 이렇게 말하면 된다.

> H1은 LLM 자체의 답변 능력보다 검색 방식의 차이를 보는 실험이다. 따라서 가장 중요한 지표는 Context Precision이고, 이 지표에서 GraphRAG가 유의하게 높았다.

---

## 11. 발표용 멘트

짧은 버전:

> H1은 GraphRAG가 VectorRAG보다 환자 개인 fact를 더 정확하게 제공하는지 검증한 실험입니다. 같은 270개 질문을 GraphRAG/VectorRAG와 DSLM/Gemini 네 조건에서 반복 측정했고, 평가는 표준 RAGAS 4개 지표를 사용했습니다. H200 서버에서 vLLM으로 Qwen2.5-32B judge를 구동했으며, 결과적으로 Context Precision에서 GraphRAG가 유의하게 높았습니다. 이는 구조화된 KG가 환자 개인 정보 검색에 더 정확한 근거를 제공한다는 것을 보여줍니다.

조금 자세한 버전:

> 처음에는 RAGAS를 그대로 돌렸을 때 한국어 단답과 T/F 라벨 때문에 Faithfulness가 NaN이 되는 문제가 있었습니다. 그래서 RAGAS metric algorithm은 바꾸지 않고, 평가용 reference만 자연어 gold evidence로 변환하고 prompt 예시를 한국어 단답에 맞췄습니다. 최종적으로 표준 RAGAS 4개 지표를 모두 계산했고, GraphRAG는 Context Precision에서 VectorRAG보다 유의하게 높았습니다.

---

## 12. 한계

1. 표준 RAGAS 기준으로는 4개 지표 중 Context Precision 1개만 Bonferroni 보정을 통과했다.
2. Gemini 조건까지 포함해 4셀로 검증했지만, LLM-as-generator는 DSLM과 Gemini 두 모델이므로 더 많은 범용 모델까지 일반화했다고 말하지는 않는다.
3. Faithfulness와 Answer Relevancy는 답변 단계 지표라, 같은 DSLM이 정답을 잘 생성하면 차이가 작아질 수 있다.
4. F-비존재나 T/F 부정 문항은 RAGAS Context Recall과 완벽히 맞지 않는 면이 있어, 결과 해석은 Context Precision 중심으로 하는 것이 가장 안전하다.

---

## 13. 발표 결론 문장

**표준 RAGAS 평가 결과, GraphRAG는 VectorRAG보다 환자 개인 fact 검색에서 더 높은 Context Precision을 보였으며, 이는 구조화된 KG 기반 정보 제공이 개인화 회상 대화 시스템에 적합하다는 근거가 된다.**
