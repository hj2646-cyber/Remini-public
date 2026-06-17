# VectorDB Validation Report

- Chroma path: `/home/oem/바탕화면/학부연구생종합설계프로젝트/Remini/experiments/rag/chroma_db`
- Collection: `personas`
- Stored rows: 300
- Embedding dimensions: {1024: 300}
- Embedding L2 norm min/max/avg: 1.000000 / 1.000000 / 1.000000
- All embedding values finite: True
- Personas in DB: 30 (P001..P030)
- Rows per persona min/max: 10 / 10
- Chunk kind counts: {'children': 30, 'demographics': 30, 'health': 30, 'marriage': 30, 'preferences': 30, 'text_culinary': 30, 'text_cultural': 30, 'text_family': 30, 'text_hobbies': 30, 'text_persona': 30}

## Source Match

- Current `P*.yaml` files: 31
- Expected rows from P001-P030: 300
- Expected rows from all current P*.yaml: 310
- Actual minus P001-P030 expected: 0
- P001-P030 expected minus actual: 0
- Document mismatches against P001-P030: 0
- Metadata mismatches against P001-P030: 0
- Missing if rebuilt from all current P*.yaml: ['P999__children', 'P999__demographics', 'P999__health', 'P999__marriage', 'P999__preferences', 'P999__text_culinary', 'P999__text_cultural', 'P999__text_family', 'P999__text_hobbies', 'P999__text_persona']

## Retrieval Check From Saved Cell3 Responses

- Response rows: 270
- Errors / empty contexts: 0 / 0
- Cases with expected evidence chunk: 238
- Relevant chunk in top-5: 238/238
- Relevant chunk at rank 1: 157/238
- Cases with no direct vector evidence expectation: 32

| pattern | n | top5_hit | top1_hit | avg_best_rank |
|---|---:|---:|---:|---:|
| ADV-부분일치 | 30 | 30 | 25 | 1.17 |
| ADV-시점근접 | 29 | 29 | 29 | 1.00 |
| ADV-유사인물 | 30 | 30 | 28 | 1.07 |
| F-반대 | 30 | 30 | 14 | 1.73 |
| F-시점오류 | 29 | 29 | 29 | 1.00 |
| T-거주지 | 30 | 30 | 1 | 2.40 |
| T-직업 | 30 | 30 | 7 | 1.93 |
| T-학력 | 30 | 30 | 24 | 1.20 |
