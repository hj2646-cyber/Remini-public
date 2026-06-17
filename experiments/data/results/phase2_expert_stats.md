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
| AI와의 상호작용 |         6 |      4.1667 |        3.875  |                    0.2917 |      0.9447 |      0.697  |            7 |       0.5312 |     0.8331 |       0.4428 |     0.3401 |
| 임상적 타당성   |         6 |      3.7083 |        3.375  |                    0.3333 |      0.8585 |      0.1839 |            7 |       0.5625 |     0.9177 |       0.4009 |     0.3746 |
| 안정성과 윤리   |         6 |      3.75   |        3.2778 |                    0.4722 |      0.969  |      0.8856 |            5 |       0.2812 |     1.3077 |       0.2479 |     0.5339 |
| 전체_14문항     |         6 |      3.8571 |        3.4762 |                    0.381  |      0.9632 |      0.8441 |            3 |       0.3125 |     1.3905 |       0.2231 |     0.5677 |

## Rater-Level Direction

| rater_id   |   DSLM |   Gemini |   delta_dslm_minus_gemini | inferred_winner   |
|:-----------|-------:|---------:|--------------------------:|:------------------|
| E01        | 4.1429 |   3.5    |                    0.6429 | DSLM              |
| E02        | 4.8571 |   3.3571 |                    1.5    | DSLM              |
| E03        | 3.7143 |   3.4286 |                    0.2857 | DSLM              |
| E04        | 3.7857 |   3.7857 |                    0      | Tie               |
| E05        | 3.5714 |   4.0714 |                   -0.5    | Gemini            |
| E06        | 3.0714 |   2.7143 |                    0.3571 | DSLM              |

## Question-Level Means

| question_id   | area            |   DSLM |   Gemini |   delta_dslm_minus_gemini |
|:--------------|:----------------|-------:|---------:|--------------------------:|
| Q1            | AI와의 상호작용 | 4.3333 |   3.5    |                    0.8333 |
| Q2            | AI와의 상호작용 | 3.6667 |   4.3333 |                   -0.6667 |
| Q3            | AI와의 상호작용 | 4.3333 |   3.8333 |                    0.5    |
| Q4            | AI와의 상호작용 | 4.3333 |   3.8333 |                    0.5    |
| Q5            | 임상적 타당성   | 4      |   3.6667 |                    0.3333 |
| Q6            | 임상적 타당성   | 3.6667 |   4      |                   -0.3333 |
| Q7            | 임상적 타당성   | 3.5    |   3      |                    0.5    |
| Q8            | 임상적 타당성   | 3.6667 |   2.8333 |                    0.8333 |
| Q9            | 안정성과 윤리   | 3.1667 |   3      |                    0.1667 |
| Q10           | 안정성과 윤리   | 3.1667 |   2.3333 |                    0.8333 |
| Q11           | 안정성과 윤리   | 4      |   4.3333 |                   -0.3333 |
| Q12           | 안정성과 윤리   | 4.1667 |   3.6667 |                    0.5    |
| Q13           | 안정성과 윤리   | 4.1667 |   3.3333 |                    0.8333 |
| Q14           | 안정성과 윤리   | 3.8333 |   3      |                    0.8333 |

## Inter-Rater Agreement

- Krippendorff's alpha, interval scale: 0.0625
- ICC(2,1), two-way random absolute agreement, single rater: 0.0804
- ICC(2,k), two-way random absolute agreement, average of 6 raters: 0.3442
- ICC targets: 28, raters: 6

## Rater-Level Inferred Preference

- DSLM-favoring raters: 4
- Gemini-favoring raters: 1
- Tie: 1
- Binomial p(DSLM > Gemini, ties excluded): 0.1875

## Append Workflow

추가 전문가 데이터가 생기면 wide CSV에는 `E07_DSLM`, `E07_Gemini`처럼 새 열을 추가하거나, long CSV에는 새 `rater_id` 행을 append 한 뒤 이 스크립트를 다시 실행하면 됩니다.