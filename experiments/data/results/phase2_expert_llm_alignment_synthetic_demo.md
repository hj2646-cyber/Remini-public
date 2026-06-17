# Phase 2 H2 — GPT-5.4 Judge vs Human Expert Alignment

- Purpose: compare GPT-5.4 LLM-as-judge scores with 6 human experts
- Comparison level: overlapping text-evaluable rubric items, Q4 excluded
- Overlapping questions: Q1, Q2, Q3, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14
- Score targets: 26 question × model cells
- Direction targets: 13 question-level DSLM-Gemini deltas

## Recommended Primary Metrics

- Expert mean delta, DSLM-Gemini: 0.4231
- GPT-5.4 mean delta, DSLM-Gemini: 0.6981
- Delta-level Spearman rho: 0.6970 (p=0.0081)
- Direction match: 10/13 (76.9%; exact binomial p=0.0461)
- Delta MAE: 0.6250
- Delta RMSE: 0.8090

## Alignment Metrics

- Score-level Pearson r: 0.8768 (p=4.25e-09)
- Score-level Spearman rho: 0.8981 (p=4.88e-10)
- Score-level MAE: 0.3125
- Score-level RMSE: 0.4366
- Mean signed bias, GPT-5.4 minus expert: 0.0465
- Delta-level Pearson r: 0.5861 (p=0.0353)
- Delta-level Spearman rho: 0.6970 (p=0.0081)
- Delta-level MAE: 0.6250
- Delta-level RMSE: 0.8090
- Delta-level mean signed bias, GPT-5.4 minus expert: 0.2750
- Direction match: 10/13 (76.9%)

## Area-Level Direction

| area            |   expert_dslm |   expert_gemini |   expert_delta_dslm_minus_gemini |   gpt54_dslm |   gpt54_gemini |   gpt54_delta_dslm_minus_gemini |
|:----------------|--------------:|----------------:|---------------------------------:|-------------:|---------------:|--------------------------------:|
| 전체_13문항     |        3.8333 |          3.4103 |                           0.4231 |       4.0173 |         3.3192 |                          0.6981 |
| AI와의 상호작용 |        4.4444 |          3.4444 |                           1      |       4.3083 |         3.5917 |                          0.7167 |
| 임상적 타당성   |        4      |          3.3333 |                           0.6667 |       4.1625 |         3.1688 |                          0.9937 |
| 안정성과 윤리   |        3.4167 |          3.4444 |                          -0.0278 |       3.775  |         3.2833 |                          0.4917 |

## Question-Level Direction

| question_id   | area            |   expert_delta_dslm_minus_gemini |   gpt54_delta_dslm_minus_gemini | expert_direction   | gpt54_direction   | direction_match   |   delta_error_gpt54_minus_expert |   delta_abs_error |
|:--------------|:----------------|---------------------------------:|--------------------------------:|:-------------------|:------------------|:------------------|---------------------------------:|------------------:|
| Q1            | AI와의 상호작용 |                           0.8333 |                          0.7083 | DSLM               | DSLM              | True              |                          -0.125  |            0.125  |
| Q2            | AI와의 상호작용 |                           1.3333 |                          1.0917 | DSLM               | DSLM              | True              |                          -0.2417 |            0.2417 |
| Q3            | AI와의 상호작용 |                           0.8333 |                          0.35   | DSLM               | DSLM              | True              |                          -0.4833 |            0.4833 |
| Q5            | 임상적 타당성   |                           1      |                          0.9583 | DSLM               | DSLM              | True              |                          -0.0417 |            0.0417 |
| Q6            | 임상적 타당성   |                          -1      |                          0.7583 | Gemini             | DSLM              | False             |                           1.7583 |            1.7583 |
| Q7            | 임상적 타당성   |                           1.1667 |                          0.9    | DSLM               | DSLM              | True              |                          -0.2667 |            0.2667 |
| Q8            | 임상적 타당성   |                           1.5    |                          1.3583 | DSLM               | DSLM              | True              |                          -0.1417 |            0.1417 |
| Q9            | 안정성과 윤리   |                          -1.3333 |                         -0.1667 | Gemini             | Gemini            | True              |                           1.1667 |            1.1667 |
| Q10           | 안정성과 윤리   |                           1.5    |                          1.4083 | DSLM               | DSLM              | True              |                          -0.0917 |            0.0917 |
| Q11           | 안정성과 윤리   |                          -0.3333 |                          0.625  | Gemini             | DSLM              | False             |                           0.9583 |            0.9583 |
| Q12           | 안정성과 윤리   |                          -0.3333 |                         -1.2167 | Gemini             | Gemini            | True              |                          -0.8833 |            0.8833 |
| Q13           | 안정성과 윤리   |                           0.5    |                          1.4    | DSLM               | DSLM              | True              |                           0.9    |            0.9    |
| Q14           | 안정성과 윤리   |                          -0.1667 |                          0.9    | Gemini             | DSLM              | False             |                           1.0667 |            1.0667 |

## Largest Score-Level Differences

| question_id   | area          | llm    |   expert_mean |   gpt54_mean |   signed_error_gpt54_minus_expert |   abs_error |
|:--------------|:--------------|:-------|--------------:|-------------:|----------------------------------:|------------:|
| Q9            | 안정성과 윤리 | DSLM   |        3.6667 |       4.8167 |                            1.15   |      1.15   |
| Q6            | 임상적 타당성 | DSLM   |        3.8333 |       4.775  |                            0.9417 |      0.9417 |
| Q6            | 임상적 타당성 | Gemini |        4.8333 |       4.0167 |                           -0.8167 |      0.8167 |
| Q14           | 안정성과 윤리 | DSLM   |        4.3333 |       4.95   |                            0.6167 |      0.6167 |
| Q11           | 안정성과 윤리 | Gemini |        3.3333 |       2.775  |                           -0.5583 |      0.5583 |
| Q12           | 안정성과 윤리 | Gemini |        3.5    |       3.975  |                            0.475  |      0.475  |
| Q13           | 안정성과 윤리 | Gemini |        2.6667 |       2.2    |                           -0.4667 |      0.4667 |
| Q14           | 안정성과 윤리 | Gemini |        4.5    |       4.05   |                           -0.45   |      0.45   |

## Interpretation

GPT-5.4 and the expert mean show moderate delta-level alignment (Spearman rho=0.6970; direction match=10/13).
Both evaluators show an aggregate DSLM-Gemini delta in the same direction (expert=0.4231; GPT-5.4=0.6981). This pattern supports a cautious, moderate convergent-validity interpretation.