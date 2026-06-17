# H2 전문가 설문 데이터 추가 가이드

## 현재 상태

- H2 LLM-as-Judge 본 실험 결과는 생성 완료.
- 전문가 설문 분석용 입력 파일은 `experiments/data/expert/phase2_expert_scores.csv` 하나로 고정.
- 현재 repo 안에서는 전문가 5명 응답 원본 파일을 찾지 못했으므로, 5명 데이터를 먼저 이 CSV에 넣고 분석한다.
- 내일 6번째 전문가 데이터가 오면 같은 CSV 맨 아래에 `rater_id=E06` 행만 추가하고 스크립트를 다시 실행한다.

## 쉬운 입력 포맷

파일:

```text
experiments/data/expert/phase2_expert_scores_wide_5raters.csv
```

이 파일은 Q1~Q14가 행이고, 전문가 5명 점수 칸이 DSLM/Gemini로 나뉜 wide template이다.
빈칸에 1~5점만 채우면 된다.
한국어가 깨져 보이면 Excel용 CP949 사본인
`experiments/data/expert/phase2_expert_scores_wide_5raters_cp949.csv`를 열어도 된다.
분석 스크립트는 UTF-8 BOM과 CP949를 모두 읽는다.

```text
E01_DSLM, E01_Gemini, E02_DSLM, E02_Gemini, ... E05_DSLM, E05_Gemini
```

분석 실행:

```bash
experiments/.venv/bin/python experiments/scripts/15_phase2_expert_stats.py \
  --input experiments/data/expert/phase2_expert_scores_wide_5raters.csv
```

## Long 입력 포맷

스크립트 내부 표준 포맷은 아래 long CSV다. wide template을 쓰면 스크립트가 자동 변환한다.

파일:

```text
rater_id,response_date,scenario_id,question_id,llm,score,model_label,comment
```

예시:

규칙:

- `rater_id`: 전문가 ID. 현재 5명은 `E01`~`E05`, 내일 추가자는 `E06` 권장.
- `scenario_id`: 평가한 H2 시나리오 ID. 모르면 임시로 `H2-HUMAN-01`처럼 통일 가능.
- `question_id`: `Q1`~`Q14`.
- `llm`: 반드시 `DSLM` 또는 `Gemini`.
- `score`: 1~5 Likert 점수.
- `model_label`: 설문에서 블라인드로 보여준 `A`/`B` 라벨. 분석에는 필수는 아니지만 기록 권장.
- `comment`: 전문가 자유 의견. 없으면 빈칸.

## 분석 실행

```bash
experiments/.venv/bin/python experiments/scripts/15_phase2_expert_stats.py
```

산출물:

```text
experiments/data/results/phase2_expert_scores_long.csv
experiments/data/results/phase2_expert_area_summary.csv
experiments/data/results/phase2_expert_question_summary.csv
experiments/data/results/phase2_expert_rater_summary.csv
experiments/data/results/phase2_expert_stats.md
```

## 내일 추가 절차

1. 오늘 5명 데이터가 들어간 `phase2_expert_scores_wide_5raters.csv`를 유지한다.
2. 내일 받은 1명 데이터는 `E06_DSLM`, `E06_Gemini` 열을 추가해 넣는다.
3. 같은 `--input` 명령으로 다시 실행한다.

```bash
experiments/.venv/bin/python experiments/scripts/15_phase2_expert_stats.py \
  --input experiments/data/expert/phase2_expert_scores_wide_5raters.csv
```

결과 파일은 자동으로 6명 기준으로 덮어써진다.
