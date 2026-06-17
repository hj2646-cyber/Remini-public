# experiments/ — 실험설계 v5 작업 폴더

> 실험설계 v5 (`docs/실험설계_v5.docx`) 의 14단계를 실행하는 격리된 폴더.
> **본 시스템 운용 코드(`ai-server/`, `caregiver/`)와 분리** 하여 실험 의존성·데이터·결과가 본 시스템을 오염시키지 않도록 한다.

---

## ⚠️ 클라우드 API 예외 정책

**프로젝트 루트 `CLAUDE.md` 의 "모든 AI 모델은 오픈소스 로컬 모델만" 규칙은 이 `experiments/` 폴더 한정으로 예외 허용.**

이유:
- **베이스라인 비교 대상 자체** 가 클라우드 모델 (Gemini) 임 → 비교 안 하면 가설 검증 불가
- **시나리오 자동 생성** (회의록 [01:13] 권장) 은 Gemini API 사용
- **LLM-as-Judge** 는 OpenAI API 를 사용하되, 5차원 자체 rubric 이 아니라 14문항 설문지를 그대로 채점 rubric 으로 사용

**허용 범위:**
| 용도 | 모델 | 어디서 |
|------|------|--------|
| 시나리오 자동 생성 (270개) | Gemini 2.5 Flash | `scripts/03_scenario_generate.py` |
| Phase 1 베이스라인 응답 | Gemini 2.5 Flash | `scripts/04_phase1_run.py` cell2/cell4 |
| Phase 2 베이스라인 응답 | Gemini 2.5 Flash | `scripts/12_phase2_run.py` |
| Phase 2 LLM-as-Judge | OpenAI judge model | `scripts/13_phase2_judge.py` |

**금지 (이 폴더 안에서도):**
- 본 시스템 운용 코드(`ai-server/`)에 클라우드 API 의존성을 새로 만드는 것
- 실험용 API 키를 본 시스템에서 호출하는 것
- 페르소나/시나리오 외 환자 PII 데이터를 클라우드에 전송하는 것

---

## 폴더 구조

```
experiments/
├── README.md                    # 이 파일
├── .gitignore                   # 응답 raw / 결과물 보호
├── requirements.txt             # ragas, chromadb, openai, google-generativeai 등
├── data/
│   ├── personas/                # 30명 페르소나 KG (yaml)
│   ├── scenarios/               # Phase1 270 + Phase2 40 시나리오
│   ├── responses/               # 4셀 응답 raw (gitignore)
│   └── results/                 # RAGAS 점수 / 통계 결과
├── scripts/                     # Step 1~14 실행 스크립트
│   ├── 01_persona_sampling.py   # NVIDIA 페르소나에서 30명 stratified sampling
│   ├── 02_persona_to_kg.py      # 페르소나 → yaml KG 변환 (★ 임의 설정 자동화)
│   ├── 03_scenario_generate.py  # Gemini로 270 시나리오 생성 + 사람 검수용 출력
│   ├── 04_phase1_run.py         # 4셀 × 270 = 1,080 trial 실행
│   ├── 05_phase1_ragas.py       # RAGAS 4 메트릭 평가
│   ├── 11_phase2_make_scenarios.py # 40 회상 시나리오 생성
│   ├── 12_phase2_run.py         # 40 회상 시나리오 → DSLM/Gemini 응답 80개
│   ├── 13_phase2_judge.py       # OpenAI LLM-as-Judge (`docs/평가설문지.hwp` 14문항)
│   └── 14_phase2_survey_stats.py # Wilcoxon, Cronbach α, preference 분석
├── rag/                         # 비교 대상 두 RAG
│   ├── graph_rag.py             # 기존 ai-server/services/auradb_memory 래핑
│   └── vector_rag.py            # ChromaDB + ko-sroberta (Phase 1용)
└── notebooks/                   # 분석/시각화 ipynb
```

---

## 환경변수

**`.env` 는 프로젝트 루트 하나만** (CLAUDE.md 규칙). 실험용 키는 루트 `.env` 에 다음 변수 추가:

```bash
# experiments/ 전용 — 본 시스템에서 사용 금지
GEMINI_API_KEY=...
OPENAI_API_KEY=...   # Phase 2 LLM-as-Judge 전용
```

스크립트는 `python-dotenv` 로 루트 `.env` 를 읽음.

---

## 실행 순서 (실험설계 v5 §7)

| Step | 스크립트 | 산출물 |
|------|----------|--------|
| 1 | `scripts/01_persona_sampling.py` | NVIDIA 페르소나 분석 보고 |
| 2 | `scripts/02_persona_to_kg.py` | `data/personas/*.yaml` (30개) |
| 3 | (수동 검수) | ★ 임의 설정 검증 |
| 4 | `scripts/03_scenario_generate.py` | `data/scenarios/phase1.csv` (270개) |
| 5 | (수동 검수) | Cohen's κ 측정 |
| 6 | `rag/vector_rag.py` 셋업 | ChromaDB 인덱스 |
| 7 | (LLM 환경 확인) | DSLM(Ollama) + Gemini API 응답 테스트 |
| 8 | `scripts/04_phase1_run.py --pilot 10` | 파일럿 응답 |
| 9 | `scripts/04_phase1_run.py` + `05_phase1_ragas.py` | 1,080 trial RAGAS 점수 |
| 10 | `scripts/11_phase2_make_scenarios.py` | `data/scenarios/phase2.csv` (40 회상 시나리오) |
| 11 | `scripts/12_phase2_run.py` + `13_phase2_judge.py` | 40쌍 × `docs/평가설문지.hwp` 14문항 설문 점수 |
| 12 | (사회복지 학생 평가) | 인간 평가지 |
| 13 | `scripts/14_phase2_survey_stats.py` | Wilcoxon / Cronbach α / preference 분석 |
| 14 | `notebooks/` 시각화 | 결과 표/그래프 |

---

## 가설 (실험설계 v5 §0)

- **H1**: 우리 시스템에서 GraphRAG > VectorRAG (Phase 1)
- **H2**: 회상요법 응답에서 DSLM > Gemini (Phase 2)

각 페이즈 종속변수·검정·기준은 `docs/실험설계_v5.docx` §2.4, §3.6 참조.

---

## 본 시스템과의 관계

- **GraphRAG 셀**: `ai-server/app/services/auradb_memory.py` 의 Neo4j 검색을 그대로 호출 (코드 재사용, 의존성은 `rag/graph_rag.py` 에 격리)
- **DSLM 셀**: `.env` 의 `OLLAMA_MODEL` (현재 `gemma4:31b`) 호출 — 본 시스템과 동일 모델
- **Phase 1 페르소나 KG** 는 본 시스템 환자 데이터와 **분리된 별도 Neo4j 데이터베이스 또는 namespace** 사용 (PII 격리)
