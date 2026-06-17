# Phase 1 H1 — Assumption Checks + Repeated-Measures 1-Way ANOVA

## Design

- Comparison: Cell 1 GraphRAG+DSLM vs Cell 3 VectorRAG+DSLM
- Unit of analysis: same `scenario_id` evaluated under both RAG conditions
- Therefore the observations are paired/repeated-measures, not independent groups
- Main test: repeated-measures 1-way ANOVA with within-subject factor `RAG` (GraphRAG vs VectorRAG)
- With two levels, repeated-measures 1-way ANOVA is mathematically equivalent to a paired t-test: `F = t^2`
- Multiple comparison control: Bonferroni alpha = 0.05 / 4 = 0.0125

## Why Not Ordinary Independent 1-Way ANOVA?

Ordinary one-way ANOVA assumes independent groups. Here, Cell 1 and Cell 3 answer the exact same 270 scenarios, so each pair shares scenario difficulty. Ignoring that pairing would throw away useful control and is less appropriate.

## Assumption Checks

### Cell-Wise Shapiro-Wilk Normality

| metric            |   cell |   n |      W |   p | normal_at_0.05   |
|:------------------|-------:|----:|-------:|----:|:-----------------|
| faithfulness      |      1 | 270 | 0.2305 |   0 | False            |
| faithfulness      |      3 | 269 | 0.1445 |   0 | False            |
| answer_relevancy  |      1 | 270 | 0.8883 |   0 | False            |
| answer_relevancy  |      3 | 270 | 0.8915 |   0 | False            |
| context_precision |      1 | 270 | 0.5016 |   0 | False            |
| context_precision |      3 | 270 | 0.7605 |   0 | False            |
| context_recall    |      1 | 270 | 0.6728 |   0 | False            |
| context_recall    |      3 | 270 | 0.7507 |   0 | False            |

### Levene Homogeneity of Variance

| metric            |   levene_W |        p | equal_var_at_0.05   |
|:------------------|-----------:|---------:|:--------------------|
| faithfulness      |     2.7459 | 0.098087 | True                |
| answer_relevancy  |     0.5461 | 0.460242 | True                |
| context_precision |     8.8184 | 0.003115 | False               |
| context_recall    |     1.8013 | 0.180127 | True                |

### Paired Difference Normality Note

For the paired/repeated-measures primary test, the more relevant normality assumption is the normality of paired differences, not separate cell distributions. RAGAS scores are bounded and often discrete, so Shapiro tests can reject normality even with n=270. Therefore Wilcoxon signed-rank p-values are reported as non-parametric robustness checks.

## Primary Test: Repeated-Measures 1-Way ANOVA

| metric            |   df_condition |   df_error |       F |         p |   partial_eta_sq | F_equals_t_sq_check   |
|:------------------|---------------:|-----------:|--------:|----------:|-----------------:|:----------------------|
| faithfulness      |              1 |        268 |  4.0453 | 0.0452961 |           0.0149 | True                  |
| answer_relevancy  |              1 |        269 |  0.0013 | 0.971037  |           0      | True                  |
| context_precision |              1 |        269 | 19.1724 | 1.712e-05 |           0.0665 | True                  |
| context_recall    |              1 |        269 |  0.0706 | 0.790637  |           0.0003 | True                  |

## Equivalent Paired T-Test + Wilcoxon Robustness

| metric            |   n_pairs |   delta |       t |         p |   cohens_dz |   wilcoxon_p | passes_bonferroni   |
|:------------------|----------:|--------:|--------:|----------:|------------:|-------------:|:--------------------|
| faithfulness      |       269 | -0.0149 | -2.0113 | 0.0452961 |     -0.1226 |    0.0455003 | False               |
| answer_relevancy  |       270 | -0.0003 | -0.0363 | 0.971037  |     -0.0022 |    0.143543  | False               |
| context_precision |       270 |  0.0951 |  4.3786 | 1.712e-05 |      0.2665 |    1.15e-06  | True                |
| context_recall    |       270 |  0.0056 |  0.2657 | 0.790637  |      0.0162 |    0.741846  | False               |

## Verdict

The statistically defensible presentation is: assumption checks were reported, but because the experiment is paired, the main inferential test is repeated-measures 1-way ANOVA / paired t-test. Context Precision passes Bonferroni correction and supports H1 partially.
