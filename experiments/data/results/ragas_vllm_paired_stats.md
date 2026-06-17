# Phase 1 H1 — Standard RAGAS vLLM Paired Statistics

- Cells: Cell 1 GraphRAG+DSLM vs Cell 3 VectorRAG+DSLM
- Judge: vLLM `Qwen/Qwen2.5-32B-Instruct-AWQ` on H200
- Metrics: RAGAS Faithfulness, Answer Relevancy, Context Precision, Context Recall
- Prompt mode: Korean-localized RAGAS prompts; metric algorithms unchanged
- Reference: natural-language gold evidence; original `ground_truth_label` preserved
- Bonferroni alpha: 0.0125

## Cell Means

|   cell |   faithfulness |   answer_relevancy |   context_precision |   context_recall |
|-------:|---------------:|-------------------:|--------------------:|-----------------:|
|      1 |         0.9722 |             0.5753 |              0.7889 |           0.5685 |
|      3 |         0.987  |             0.5756 |              0.6938 |           0.563  |

## NaN Rates

|   cell |   faithfulness |   answer_relevancy |   context_precision |   context_recall |
|-------:|---------------:|-------------------:|--------------------:|-----------------:|
|      1 |         0      |                  0 |                   0 |                0 |
|      3 |         0.0037 |                  0 |                   0 |                0 |

## Paired T-Test: GraphRAG - VectorRAG

| metric            |   n_pairs |   graph_mean |   vector_mean |   delta |      t |        p |   cohens_dz |   wilcoxon_p |
|:------------------|----------:|-------------:|--------------:|--------:|-------:|---------:|------------:|-------------:|
| faithfulness      |       269 |       0.9721 |        0.987  | -0.0149 | -2.011 | 0.045296 |      -0.123 |     0.0455   |
| answer_relevancy  |       270 |       0.5753 |        0.5756 | -0.0003 | -0.036 | 0.971037 |      -0.002 |     0.143543 |
| context_precision |       270 |       0.7889 |        0.6938 |  0.0951 |  4.379 | 1.7e-05  |       0.266 |     1e-06    |
| context_recall    |       270 |       0.5685 |        0.563  |  0.0056 |  0.266 | 0.790637 |       0.016 |     0.741846 |

## Verdict

**H1 PARTIAL SUPPORT** — 1/4 metrics pass p<0.0125 and GraphRAG > VectorRAG.

Interpretation: Standard RAGAS reproduces the main retrieval-quality signal on Context Precision. Generation-side metrics are saturated because the same DSLM answers both cells correctly once enough evidence appears.

## Pattern Means

|                     |   faithfulness |   answer_relevancy |   context_precision |   context_recall |
|:--------------------|---------------:|-------------------:|--------------------:|-----------------:|
| (1, 'ADV-부분일치') |         0.8667 |             0.5491 |              0.9667 |           0.8333 |
| (1, 'ADV-시점근접') |         1      |             0.6287 |              0.9667 |           0.1333 |
| (1, 'ADV-유사인물') |         1      |             0.5328 |              0.4    |           0.1667 |
| (1, 'F-반대')       |         1      |             0.5552 |              0.8333 |           0.1333 |
| (1, 'F-비존재')     |         1      |             0      |              0      |           0      |
| (1, 'F-시점오류')   |         0.9167 |             0.6291 |              0.9333 |           0.85   |
| (1, 'T-거주지')     |         0.9667 |             0.5405 |              1      |           1      |
| (1, 'T-직업')       |         1      |             0.8661 |              1      |           1      |
| (1, 'T-학력')       |         1      |             0.8766 |              1      |           1      |
| (3, 'ADV-부분일치') |         0.9138 |             0.5137 |              0.9468 |           0.7667 |
| (3, 'ADV-시점근접') |         0.9833 |             0.5955 |              0.9667 |           0.2667 |
| (3, 'ADV-유사인물') |         1      |             0.6516 |              0.5333 |           0.1333 |
| (3, 'F-반대')       |         1      |             0.5322 |              0.7271 |           0.45   |
| (3, 'F-비존재')     |         1      |             0      |              0      |           0      |
| (3, 'F-시점오류')   |         1      |             0.601  |              0.9667 |           0.45   |
| (3, 'T-거주지')     |         1      |             0.5444 |              0.5922 |           1      |
| (3, 'T-직업')       |         0.9833 |             0.8798 |              0.625  |           1      |
| (3, 'T-학력')       |         1      |             0.8621 |              0.8861 |           1      |
