# H2 Phase 2 실행 가이드

## 목적

H2는 DSLM과 Gemini 2.5 Flash의 회상요법 대화 품질을 비교한다.

평가 기준은 새로 만든 임의 rubric이 아니라 `docs/평가설문지.hwp`의 14문항 설문이다. 다만 Q4(답변 속도와 음색)는 텍스트 로그만으로 평가할 수 없어 LLM text judge에서는 제외하고, 시스템 latency/TTS 또는 사람 청취 평가로 별도 처리한다.

## 현재 만들어진 파일

| 파일 | 역할 |
|---|---|
| `experiments/data/scenarios/phase2.csv` | 40개 회상 대화 시나리오 |
| `experiments/data/scenarios/phase2_survey_items.csv` | `docs/평가설문지.hwp` 14문항과 judge scope를 코드에서 쓰기 쉽게 정리한 표 |
| `experiments/scripts/11_phase2_make_scenarios.py` | 40개 시나리오 생성 |
| `experiments/scripts/12_phase2_run.py` | DSLM/Gemini 30턴 대화 생성 |
| `experiments/scripts/13_phase2_judge.py` | OpenAI judge가 Model A/B를 텍스트 평가 가능한 13문항으로 채점 |
| `experiments/scripts/14_phase2_survey_stats.py` | Wilcoxon, Cronbach alpha, preference 분석 |

## 실행 순서

### 1. 시나리오 생성

```bash
experiments/.venv/bin/python experiments/scripts/11_phase2_make_scenarios.py --overwrite
```

산출물:

```text
experiments/data/scenarios/phase2.csv
```

### 2. DSLM/Gemini 응답 생성

결제 등록 후 `.env`에서 Gemini 모델을 고정한다.

```bash
GEMINI_MODEL=gemini-2.5-flash
GEMINI_THINKING_BUDGET=0
```

Gemini 2.5 Flash는 thinking이 기본 활성화되어 짧은 대화 응답에서도 출력이 중간에 끊길 수 있다.
Phase 2는 1~2문장 응답 생성이 목적이므로 `GEMINI_THINKING_BUDGET=0`으로 고정한다.

실행:

```bash
experiments/.venv/bin/python experiments/scripts/12_phase2_run.py \
  --models dslm,gemini \
  --resume \
  --max-retries 5 \
  --max-output-tokens 1024 \
  --sleep 1
```

산출물:

```text
experiments/data/responses/phase2_responses.jsonl
```

### 3. OpenAI 설문형 LLM-as-Judge

`.env`에 OpenAI key와 judge 모델을 넣는다.

```bash
OPENAI_API_KEY=...
OPENAI_JUDGE_MODEL=gpt-5.4
```

`gpt-5.4-mini`는 파이프라인 사전 점검이나 비용 절약용 파일럿에만 사용하고,
최종 발표용 수치는 `gpt-5.4`로 고정한다.

실행:

```bash
experiments/.venv/bin/python experiments/scripts/13_phase2_judge.py \
  --self-consistency 3 \
  --resume
```

산출물:

```text
experiments/data/results/phase2_judge_raw.jsonl
```

### 4. 통계 분석

```bash
experiments/.venv/bin/python experiments/scripts/14_phase2_survey_stats.py
```

산출물:

```text
experiments/data/results/phase2_survey_scores_long.csv
experiments/data/results/phase2_survey_preferences.csv
experiments/data/results/phase2_survey_area_summary.csv
experiments/data/results/phase2_survey_stats.md
```

## 설계 요약

| 항목 | 내용 |
|---|---|
| 평가 단위 | 동일 시나리오의 DSLM 30턴 대화 vs Gemini 30턴 대화 |
| 시나리오 수 | 40세트 |
| 평가 문항 | `docs/평가설문지.hwp` 14문항 |
| LLM text judge 문항 | Q1-Q3, Q5-Q14 총 13문항 |
| 별도 평가 문항 | Q4 답변 속도/음색 |
| 익명화 | Model A / Model B |
| 순서 편향 완화 | 1회차 DSLM→Gemini, 2회차 Gemini→DSLM, 3회차 랜덤 |
| judge 반복 | self-consistency 3회 |
| 통계 | 영역별 Wilcoxon signed-rank + Bonferroni, Cronbach alpha |

## 발표용 한 문장

> H2에서는 `docs/평가설문지.hwp`의 전문가 설문지를 LLM-as-Judge rubric으로 사용하고, 텍스트 평가가 불가능한 Q4는 별도 처리했다. Model A/B 익명화와 순서 교차를 적용해 DSLM과 Gemini 2.5 Flash의 30턴 회상 대화 품질을 paired design으로 비교했다.
