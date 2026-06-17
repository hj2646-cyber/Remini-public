# H1 Gemini 조건 추가 실험 구출 플랜

## 1. 지금 이미 끝난 것

현재 끝난 실험은 H1의 핵심 비교다.

```text
Cell 1 = GraphRAG + DSLM
Cell 3 = VectorRAG + DSLM
```

같은 270개 질문을 두 조건에서 반복 측정했고, 표준 RAGAS 4개 지표로 평가했다.
결론은 **Context Precision에서 GraphRAG가 VectorRAG보다 유의하게 높다**는 것이다.

즉, H1을 “DSLM 고정 조건에서 GraphRAG가 VectorRAG보다 검색 근거를 더 정확히 준다”로 말하면 지금 결과만으로도 발표 가능하다.

## 2. Gemini로 추가해야 하는 이유

발표에서 2×2 factorial design을 끝까지 보여주려면 Gemini 조건도 있으면 좋다.

```text
Cell 1 = GraphRAG + DSLM
Cell 2 = GraphRAG + Gemini
Cell 3 = VectorRAG + DSLM
Cell 4 = VectorRAG + Gemini
```

여기서 Gemini는 **답변 생성 모델**이다.
RAGAS judge까지 Gemini로 바꾸는 것이 아니다.

평가자는 가능하면 하나로 고정해야 한다.
그래야 “Cell별 점수 차이”가 evaluator 차이 때문이 아니라 RAG/LLM 조건 차이 때문이라고 말할 수 있다.

따라서 추천 구조는 아래와 같다.

```text
응답 생성:
  Cell1/3 = DSLM
  Cell2/4 = Gemini

평가:
  모든 Cell = 같은 RAGAS judge
  현재는 H200 vLLM Qwen2.5-32B judge
```

## 3. 제일 먼저 확인할 것

루트 `.env`에 Gemini API key가 필요하다.

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL`은 생략해도 된다.
현재 스크립트 기본값은 `gemini-2.5-flash`다.

API key는 git에 올리면 안 된다.
로컬 `.env`에만 둔다.

### 2026-05-12 실제 실행 중 확인된 무료 quota blocker

현재 받은 Google AI Studio free-tier key에서는 전체 Cell2/Cell4 생성이 불가능했다.

실제 API 에러:

```text
gemini-2.5-flash:
  GenerateRequestsPerDayPerProjectPerModel-FreeTier
  limit = 20 requests/day

gemini-2.5-flash-lite:
  GenerateRequestsPerDayPerProjectPerModel-FreeTier
  limit = 20 requests/day

gemini-2.0-flash:
  free-tier request/token limit = 0
```

따라서 Cell2/Cell4 전체 540 trial을 무료 API key 하나로 생성할 수 없다.

현재 저장 상태:

```text
experiments/data/responses/cell2.jsonl
  gemini-2.5-flash-lite partial 19 rows

experiments/data/responses/cell2.gemini-2.5-flash.partial_*.jsonl
  gemini-2.5-flash partial 19 rows 백업
```

`gemini-2.5-flash-lite` ping 1회가 같은 daily quota를 사용해서, 실제 Cell2에는 19개만 저장되었다.

## 3.5. 현실적인 선택지

### 선택지 A — 메인 발표는 Cell1 vs Cell3로 유지

가장 안전하다.
이미 표준 RAGAS + 반복측정 ANOVA 결과가 있고, H1을 "DSLM 고정 조건에서 GraphRAG가 VectorRAG보다 좋은가"로 말하면 된다.

### 선택지 B — Google Cloud billing을 켜고 Gemini Cell2/Cell4 전체 실행

2×2 factorial design을 끝까지 완성하려면 이 방법이 제일 깔끔하다.
단, 같은 Gemini 모델 하나로 Cell2/Cell4 전체를 생성해야 한다.

권장 모델:

```text
gemini-2.5-flash-lite
```

이유:

```text
빠르고 저렴하며, 단순 fact-QA baseline으로 충분하다.
```

### 선택지 C — Gemini는 pilot robustness check로만 사용

무료 quota로 가능한 20개 내외만 보여준다.
이 경우 발표에서는 "정식 통계 검정"이 아니라 "Gemini 조건 pilot"이라고 말해야 한다.

```text
Cell1 vs Cell3 = 메인 검정
Cell2/Cell4 일부 = 참고 pilot
```

## 4. Step 1 — Gemini 응답 생성

repo 루트에서 실행한다.

```bash
experiments/.venv/bin/python experiments/scripts/07_phase1_run.py \
  --cells 2,4 \
  --resume \
  --max-retries 5 \
  --sleep 1
```

출력 파일:

```text
experiments/data/responses/cell2.jsonl
experiments/data/responses/cell4.jsonl
```

확인:

```bash
wc -l experiments/data/responses/cell2.jsonl
wc -l experiments/data/responses/cell4.jsonl
```

각각 270줄이면 성공이다.

중간에 rate limit이나 네트워크 오류가 나도 `--resume`으로 다시 실행하면 실패한 문항부터 재시도한다.

## 5. Step 2 — Gemini Cell도 표준 RAGAS로 평가

vLLM judge 서버를 먼저 켠다.

```bash
vllm serve Qwen/Qwen2.5-32B-Instruct-AWQ \
  --port 8001 \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.6
```

다른 터미널에서 RAGAS 평가를 실행한다.

```bash
experiments/.venv/bin/python experiments/scripts/08c_phase1_ragas_vllm.py \
  --cells 2,4 \
  --merge-cells 1,2,3,4 \
  --prompt-mode korean-localized \
  --wrapper fast \
  --max-workers 8
```

출력 파일:

```text
experiments/data/results/ragas_vllm_cell2.csv
experiments/data/results/ragas_vllm_cell4.csv
experiments/data/results/ragas_vllm_scores.csv
experiments/data/results/ragas_vllm_summary.md
```

`ragas_vllm_scores.csv`는 4개 셀이 합쳐진 파일이 된다.
정상이라면 총 1080행이다.

## 6. Step 3 — 4셀 반복측정 2×2 ANOVA

```bash
experiments/.venv/bin/python experiments/scripts/10_phase1_ragas_2x2_repeated_anova.py \
  --scores experiments/data/results/ragas_vllm_scores.csv
```

출력 파일:

```text
experiments/data/results/ragas_vllm_2x2_repeated_anova.md
experiments/data/results/ragas_vllm_2x2_repeated_anova_summary.csv
```

이 파일이 발표용 최종 통계 검정 파일이다.

## 7. 통계 해석은 이렇게 말하면 된다

4셀 실험에서는 독립표본 ANOVA가 아니라 반복측정 2×2 ANOVA가 맞다.
왜냐하면 같은 `scenario_id` 270개를 Cell1, Cell2, Cell3, Cell4에서 모두 반복해서 평가하기 때문이다.

검정 요지는 세 가지다.

```text
RAG main effect:
  GraphRAG가 VectorRAG보다 전반적으로 좋은가?

LLM main effect:
  DSLM과 Gemini 중 어느 답변 생성 모델이 전반적으로 좋은가?

RAG × LLM interaction:
  GraphRAG의 장점이 DSLM일 때와 Gemini일 때 다르게 나타나는가?
```

H1 발표에서는 특히 **RAG main effect**를 보면 된다.

## 8. 발표용 한 문장

> H1의 확장 검증에서는 동일한 270개 시나리오를 4개 조건(GraphRAG/VectorRAG × DSLM/Gemini)에서 반복 측정하고, 모든 조건을 동일한 표준 RAGAS judge로 평가했다. 이후 반복측정 2×2 ANOVA를 통해 RAG main effect, LLM main effect, RAG×LLM interaction을 검정했다.

## 9. 제일 중요한 방어 논리

Gemini를 추가하더라도 평가자는 바꾸지 않는 것이 좋다.

Gemini를 RAGAS judge로도 쓰면 “Gemini 답변을 Gemini가 평가했다”는 질문을 받을 수 있다.
그래서 메인 결과는 **동일 judge 고정**이 안전하다.

Gemini judge 결과가 꼭 필요하면, 그것은 메인 결과가 아니라 robustness check로 따로 둔다.
