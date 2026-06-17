# Phase 1 H1 — 4-Cell Repeated-Measures 2x2 ANOVA

## Overall Verdict

H1 PARTIAL/NOT FULL SUPPORT (1/4 metrics)

| metric            |   n_complete |   graph_mean |   vector_mean |   rag_delta_graph_minus_vector |    rag_p |   rag_partial_eta2 |   dslm_mean |   gemini_mean |   llm_delta_dslm_minus_gemini |    llm_p |   interaction_p | h1_pass   |
|:------------------|-------------:|-------------:|--------------:|-------------------------------:|---------:|-------------------:|------------:|--------------:|------------------------------:|---------:|----------------:|:----------|
| faithfulness      |          268 |       0.9692 |        0.9832 |                        -0.014  | 0.039127 |           0.015841 |      0.9795 |        0.9729 |                        0.0065 | 0.161921 |        0.827728 | False     |
| answer_relevancy  |          270 |       0.5912 |        0.6001 |                        -0.0089 | 0.251764 |           0.00488  |      0.5755 |        0.6158 |                       -0.0403 | 8.2e-05  |        0.180323 | False     |
| context_precision |          270 |       0.787  |        0.6938 |                         0.0933 | 1.3e-05  |           0.068141 |      0.7413 |        0.7395 |                        0.0019 | 0.564667 |        0.564667 | True      |
| context_recall    |          270 |       0.5676 |        0.563  |                         0.0046 | 0.825081 |           0.000182 |      0.5657 |        0.5648 |                        0.0009 | 0.318209 |        0.318209 | False     |

- Input: `experiments/data/results/ragas_vllm_scores.csv`
- Present cells: [1, 2, 3, 4]
- Design: same scenario_id repeated across RAG and LLM conditions
- Within factors: RAG(GraphRAG/VectorRAG), LLM(DSLM/Gemini)
- Bonferroni alpha across 4 RAGAS metrics: 0.0125


## faithfulness

### Cell Descriptives

|   cell |   mean |    std |   count |
|-------:|-------:|-------:|--------:|
|      1 | 0.9722 | 0.1226 |     270 |
|      2 | 0.9648 | 0.1281 |     270 |
|      3 | 0.987  | 0.0797 |     269 |
|      4 | 0.9777 | 0.1201 |     269 |

### Assumption Checks

- Shapiro cell1: W=0.2305, p=7.04e-32
- Shapiro cell2: W=0.2777, p=3.97e-31
- Shapiro cell3: W=0.1445, p=4.17e-33
- Shapiro cell4: W=0.1811, p=1.41e-32
- Levene across 4 cells: W=1.7998, p=0.1455
- Complete repeated-measures scenarios: n=268
- Shapiro RAG contrast Graph-Vector: W=0.3079, p=1.57e-30
- Wilcoxon RAG contrast Graph-Vector: W=40.0000, p=0.0422
- Shapiro LLM contrast DSLM-Gemini: W=0.2549, p=2.13e-31
- Wilcoxon LLM contrast DSLM-Gemini: W=26.5000, p=0.1664
- Shapiro Interaction contrast: W=0.2365, p=1.09e-31
- Wilcoxon Interaction contrast: W=35.0000, p=0.7415

### Repeated-Measures 2x2 ANOVA

|         |   F Value |   Num DF |   Den DF |   Pr > F |   partial_eta2 |
|:--------|----------:|---------:|---------:|---------:|---------------:|
| rag     |   4.29752 |        1 |      267 | 0.039127 |       0.015841 |
| llm     |   1.96707 |        1 |      267 | 0.161921 |       0.007313 |
| rag:llm |   0.04745 |        1 |      267 | 0.827728 |       0.000178 |

### Effect Means

- GraphRAG mean = 0.9692
- VectorRAG mean = 0.9832
- GraphRAG - VectorRAG = -0.0140
- DSLM mean = 0.9795
- Gemini mean = 0.9729
- DSLM - Gemini = +0.0065
- H1 metric verdict: not support (RAG p=0.0391, Bonferroni alpha=0.0125)


## answer_relevancy

### Cell Descriptives

|   cell |   mean |    std |   count |
|-------:|-------:|-------:|--------:|
|      1 | 0.5753 | 0.2601 |     270 |
|      2 | 0.607  | 0.2784 |     270 |
|      3 | 0.5756 | 0.2713 |     270 |
|      4 | 0.6246 | 0.2886 |     270 |

### Assumption Checks

- Shapiro cell1: W=0.8883, p=3.35e-13
- Shapiro cell2: W=0.8676, p=1.71e-14
- Shapiro cell3: W=0.8915, p=5.52e-13
- Shapiro cell4: W=0.8436, p=7.91e-16
- Levene across 4 cells: W=0.7731, p=0.5091
- Complete repeated-measures scenarios: n=270
- Shapiro RAG contrast Graph-Vector: W=0.7148, p=3.50e-21
- Wilcoxon RAG contrast Graph-Vector: W=5863.0000, p=0.0383
- Shapiro LLM contrast DSLM-Gemini: W=0.8514, p=2.06e-15
- Wilcoxon LLM contrast DSLM-Gemini: W=4693.0000, p=8.30e-08
- Shapiro Interaction contrast: W=0.7895, p=2.26e-18
- Wilcoxon Interaction contrast: W=7109.0000, p=0.7067

### Repeated-Measures 2x2 ANOVA

|         |   F Value |   Num DF |   Den DF |   Pr > F |   partial_eta2 |
|:--------|----------:|---------:|---------:|---------:|---------------:|
| rag     |   1.31916 |        1 |      269 | 0.251764 |       0.00488  |
| llm     |  16.0067  |        1 |      269 | 8.2e-05  |       0.056163 |
| rag:llm |   1.80432 |        1 |      269 | 0.180323 |       0.006663 |

### Effect Means

- GraphRAG mean = 0.5912
- VectorRAG mean = 0.6001
- GraphRAG - VectorRAG = -0.0089
- DSLM mean = 0.5755
- Gemini mean = 0.6158
- DSLM - Gemini = -0.0403
- H1 metric verdict: not support (RAG p=0.2518, Bonferroni alpha=0.0125)


## context_precision

### Cell Descriptives

|   cell |   mean |    std |   count |
|-------:|-------:|-------:|--------:|
|      1 | 0.7889 | 0.4089 |     270 |
|      2 | 0.7852 | 0.4115 |     270 |
|      3 | 0.6938 | 0.372  |     270 |
|      4 | 0.6938 | 0.372  |     270 |

### Assumption Checks

- Shapiro cell1: W=0.5016, p=6.50e-27
- Shapiro cell2: W=0.5054, p=7.89e-27
- Shapiro cell3: W=0.7605, p=1.54e-19
- Shapiro cell4: W=0.7605, p=1.54e-19
- Levene across 4 cells: W=5.6281, p=7.91e-04
- Complete repeated-measures scenarios: n=270
- Shapiro RAG contrast Graph-Vector: W=0.7678, p=2.95e-19
- Wilcoxon RAG contrast Graph-Vector: W=2081.0000, p=1.05e-06
- Shapiro LLM contrast DSLM-Gemini: W=0.0927, p=7.04e-34
- Wilcoxon LLM contrast DSLM-Gemini: W=2.0000, p=0.5637
- Shapiro Interaction contrast: W=0.0927, p=7.04e-34
- Wilcoxon Interaction contrast: W=2.0000, p=0.5637

### Repeated-Measures 2x2 ANOVA

|         |   F Value |   Num DF |   Den DF |   Pr > F |   partial_eta2 |
|:--------|----------:|---------:|---------:|---------:|---------------:|
| rag     | 19.6704   |        1 |      269 | 1.3e-05  |       0.068141 |
| llm     |  0.332509 |        1 |      269 | 0.564667 |       0.001235 |
| rag:llm |  0.332509 |        1 |      269 | 0.564667 |       0.001235 |

### Effect Means

- GraphRAG mean = 0.7870
- VectorRAG mean = 0.6938
- GraphRAG - VectorRAG = +0.0933
- DSLM mean = 0.7413
- Gemini mean = 0.7395
- DSLM - Gemini = +0.0019
- H1 metric verdict: SUPPORT (RAG p=1.34e-05, Bonferroni alpha=0.0125)


## context_recall

### Cell Descriptives

|   cell |   mean |    std |   count |
|-------:|-------:|-------:|--------:|
|      1 | 0.5685 | 0.4781 |     270 |
|      2 | 0.5667 | 0.4793 |     270 |
|      3 | 0.563  | 0.4373 |     270 |
|      4 | 0.563  | 0.4373 |     270 |

### Assumption Checks

- Shapiro cell1: W=0.6728, p=1.59e-22
- Shapiro cell2: W=0.6710, p=1.40e-22
- Shapiro cell3: W=0.7507, p=6.52e-20
- Shapiro cell4: W=0.7507, p=6.52e-20
- Levene across 4 cells: W=1.2520, p=0.2896
- Complete repeated-measures scenarios: n=270
- Shapiro RAG contrast Graph-Vector: W=0.7497, p=6.03e-20
- Wilcoxon RAG contrast Graph-Vector: W=1558.0000, p=0.7510
- Shapiro LLM contrast DSLM-Gemini: W=0.0347, p=1.20e-34
- Wilcoxon LLM contrast DSLM-Gemini: W=0.0000, p=0.3173
- Shapiro Interaction contrast: W=0.0347, p=1.20e-34
- Wilcoxon Interaction contrast: W=0.0000, p=0.3173

### Repeated-Measures 2x2 ANOVA

|         |   F Value |   Num DF |   Den DF |   Pr > F |   partial_eta2 |
|:--------|----------:|---------:|---------:|---------:|---------------:|
| rag     |  0.048943 |        1 |      269 | 0.825081 |       0.000182 |
| llm     |  1        |        1 |      269 | 0.318209 |       0.003704 |
| rag:llm |  1        |        1 |      269 | 0.318209 |       0.003704 |

### Effect Means

- GraphRAG mean = 0.5676
- VectorRAG mean = 0.5630
- GraphRAG - VectorRAG = +0.0046
- DSLM mean = 0.5657
- Gemini mean = 0.5648
- DSLM - Gemini = +0.0009
- H1 metric verdict: not support (RAG p=0.8251, Bonferroni alpha=0.0125)
