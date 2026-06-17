# Phase 2 H2 — 14-item Survey LLM-as-Judge Statistics

- Design: paired DSLM vs Gemini conversations by scenario_id
- Unit: 30 patient turns + 30 assistant responses per model conversation
- Rubric: docs/평가설문지.hwp 14-item survey
- LLM text judge uses 13 text-evaluable items: Q1-Q3 and Q5-Q14
- Excluded from text judge: Q4(answer speed and voice), evaluated separately by system latency/TTS or human listening
- Bonferroni alpha across 3 areas: 0.0167

## Area-Level Paired Tests

| area            |   n |   dslm_mean |   gemini_mean |   delta_dslm_minus_gemini |   shapiro_w |   shapiro_p |   wilcoxon_w |   wilcoxon_p |   paired_t |   paired_t_p |   cohen_dz |
|:----------------|----:|------------:|--------------:|--------------------------:|------------:|------------:|-------------:|-------------:|-----------:|-------------:|-----------:|
| AI와의 상호작용 |  40 |      4.3083 |        3.5917 |                    0.7167 |      0.959  |      0.1552 |            0 |            0 |    14.8601 |            0 |     2.3496 |
| 임상적 타당성   |  40 |      4.1625 |        3.1687 |                    0.9938 |      0.9148 |      0.0053 |            0 |            0 |    18.7834 |            0 |     2.9699 |
| 안정성과 윤리   |  40 |      3.775  |        3.2833 |                    0.4917 |      0.9563 |      0.1246 |           61 |            0 |     6.7991 |            0 |     1.075  |
| 전체            |  40 |      4.0173 |        3.3192 |                    0.6981 |      0.9554 |      0.1164 |            4 |            0 |    13.6906 |            0 |     2.1647 |

## Reliability / Stability

- Cronbach's alpha (DSLM, 13 text items): 0.6954
- Cronbach's alpha (Gemini, 13 text items): 0.6926
- Judge self-consistency SD mean: 0.1866

## Overall Preference

- DSLM wins: 113
- Gemini wins: 7
- Tie: 0
- Binomial p(DSLM > Gemini, ties excluded): 4.77e-26

## Interpretation Template

H2 is supported if DSLM scores higher than Gemini in the primary survey areas and the paired Wilcoxon tests remain significant after Bonferroni correction. If only some areas pass, report H2 as partially supported.