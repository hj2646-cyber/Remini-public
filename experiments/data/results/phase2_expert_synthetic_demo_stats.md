# Phase 2 H2 — Human Expert Survey Statistics

- Design: human expert blind survey, DSLM vs Gemini
- Unit for paired tests: rater_id × scenario_id
- Rubric: docs/평가설문지.hwp 14 items, including Q4
- Raters: 6
- Scenarios: 1
- Score rows: 168
- Bonferroni alpha across 3 primary areas: 0.0167

## Area-Level Paired Tests

| area            |   n_units |   dslm_mean |   gemini_mean |   delta_dslm_minus_gemini |   shapiro_w |   shapiro_p |   wilcoxon_w |   wilcoxon_p |   paired_t |   paired_t_p |   cohen_dz |
|:----------------|----------:|------------:|--------------:|--------------------------:|------------:|------------:|-------------:|-------------:|-----------:|-------------:|-----------:|
| AI와의 상호작용 |         6 |      4.4583 |        3.5833 |                    0.875  |      0.7013 |      0.0064 |          0   |       0.0312 |    10.247  |       0.0002 |     4.1833 |
| 임상적 타당성   |         6 |      4      |        3.3333 |                    0.6667 |      0.6399 |      0.0014 |          0   |       0.0312 |    12.6491 |       0.0001 |     5.164  |
| 안정성과 윤리   |         6 |      3.4167 |        3.4444 |                   -0.0278 |      0.9212 |      0.5141 |          2.5 |       1      |    -0.3071 |       0.7711 |    -0.1254 |
| 전체_14문항     |         6 |      3.881  |        3.4524 |                    0.4286 |      0.8137 |      0.0778 |          0   |       0.0312 |    13.4164 |       0      |     5.4772 |

## Rater-Level Direction

| rater_id   |   DSLM |   Gemini |   delta_dslm_minus_gemini | inferred_winner   |
|:-----------|-------:|---------:|--------------------------:|:------------------|
| E01        | 3.3571 |   2.9286 |                    0.4286 | DSLM              |
| E02        | 3.6429 |   3.2143 |                    0.4286 | DSLM              |
| E03        | 3.7857 |   3.3571 |                    0.4286 | DSLM              |
| E04        | 4      |   3.5    |                    0.5    | DSLM              |
| E05        | 4.0714 |   3.7857 |                    0.2857 | DSLM              |
| E06        | 4.4286 |   3.9286 |                    0.5    | DSLM              |

## Question-Level Means

| question_id   | area            |   DSLM |   Gemini |   delta_dslm_minus_gemini |
|:--------------|:----------------|-------:|---------:|--------------------------:|
| Q1            | AI와의 상호작용 | 4.5    |   3.6667 |                    0.8333 |
| Q2            | AI와의 상호작용 | 4.6667 |   3.3333 |                    1.3333 |
| Q3            | AI와의 상호작용 | 4.1667 |   3.3333 |                    0.8333 |
| Q4            | AI와의 상호작용 | 4.5    |   4      |                    0.5    |
| Q5            | 임상적 타당성   | 4      |   3      |                    1      |
| Q6            | 임상적 타당성   | 3.8333 |   4.8333 |                   -1      |
| Q7            | 임상적 타당성   | 3.1667 |   2      |                    1.1667 |
| Q8            | 임상적 타당성   | 5      |   3.5    |                    1.5    |
| Q9            | 안정성과 윤리   | 3.6667 |   5      |                   -1.3333 |
| Q10           | 안정성과 윤리   | 3.1667 |   1.6667 |                    1.5    |
| Q11           | 안정성과 윤리   | 3      |   3.3333 |                   -0.3333 |
| Q12           | 안정성과 윤리   | 3.1667 |   3.5    |                   -0.3333 |
| Q13           | 안정성과 윤리   | 3.1667 |   2.6667 |                    0.5    |
| Q14           | 안정성과 윤리   | 4.3333 |   4.5    |                   -0.1667 |

## Inter-Rater Agreement

- Krippendorff's alpha, interval scale: 0.7057
- ICC(2,1), two-way random absolute agreement, single rater: 0.7186
- ICC(2,k), two-way random absolute agreement, average of 6 raters: 0.9387
- ICC targets: 28, raters: 6

## Internal Consistency

| area            | llm    |   n_raters |   n_items |   cronbach_alpha |
|:----------------|:-------|-----------:|----------:|-----------------:|
| AI와의 상호작용 | DSLM   |          6 |         4 |           0.9148 |
| AI와의 상호작용 | Gemini |          6 |         4 |           0.8718 |
| 임상적 타당성   | DSLM   |          6 |         4 |           0.7222 |
| 임상적 타당성   | Gemini |          6 |         4 |           0.7    |
| 안정성과 윤리   | DSLM   |          6 |         6 |           0.8    |
| 안정성과 윤리   | Gemini |          6 |         6 |           0.7655 |
| 전체_14문항     | DSLM   |          6 |        14 |           0.9337 |
| 전체_14문항     | Gemini |          6 |        14 |           0.9208 |

## Rater-Level Inferred Preference

- DSLM-favoring raters: 6
- Gemini-favoring raters: 0
- Tie: 0
- Binomial p(DSLM > Gemini, ties excluded): 0.0156

## Append Workflow

추가 전문가 데이터가 생기면 wide CSV에는 `E07_DSLM`, `E07_Gemini`처럼 새 열을 추가하거나, long CSV에는 새 `rater_id` 행을 append 한 뒤 이 스크립트를 다시 실행하면 됩니다.