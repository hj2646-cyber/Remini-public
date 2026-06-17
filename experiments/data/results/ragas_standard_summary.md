# Phase 1 RAGAS 표준 결과 (Groq Llama 3.3 70B as Judge)

## 셀별 평균

|   cell |   faithfulness |   answer_relevancy |   context_precision |   context_recall |
|-------:|---------------:|-------------------:|--------------------:|-----------------:|
|      1 |              1 |             0.6446 |                 0.8 |              0.6 |

## NaN 비율

|   cell |   faithfulness |   answer_relevancy |   context_precision |   context_recall |
|-------:|---------------:|-------------------:|--------------------:|-----------------:|
|      1 |            0.4 |                  0 |                   0 |                0 |

## 패턴별 평균

|                 |   faithfulness |   answer_relevancy |   context_precision |   context_recall |
|:----------------|---------------:|-------------------:|--------------------:|-----------------:|
| (1, 'F-반대')   |            nan |             0.7242 |                   1 |                0 |
| (1, 'F-비존재') |              1 |             0      |                   0 |                0 |
| (1, 'T-거주지') |              1 |             0.5028 |                   1 |                1 |
| (1, 'T-직업')   |            nan |             0.998  |                   1 |                1 |
| (1, 'T-학력')   |              1 |             0.9981 |                   1 |                1 |