# Tech Stack — Remini 시스템 + 실험 기술 스택

> 발표 슬라이드의 "Architecture" 또는 "Implementation" 섹션 그대로 사용 가능.
> 각 항목: **역할 / 선택 / 버전 / 우리 사용 위치 / 선택 근거 / 대안**

---

## 1. LLM — Generation

| 측면 | 값 |
|---|---|
| 역할 | 환자와의 회상요법 응답 생성, 시나리오/페어 합성 |
| 선택 | **Gemma 4 31B Dense Instruct** (Google DeepMind, 2026) |
| 양자화 | Q4_K_M (4bit, ollama production) / unsloth bnb-4bit (학습) |
| 우리 사용 | `ai-server/.env: OLLAMA_MODEL=gemma4:31b` / `unsloth/gemma-4-31B-it-unsloth-bnb-4bit` (학습) |
| 선택 근거 | (1) 한국어 multilingual 강함 (2) 31B Dense — 추론 속도 vs 능력 균형 (3) Apache 2.0 |
| 대안 (검토 후 보류) | Qwen 3.5 122B-A10B MoE (캡스톤 후 v2), GPT-4o (클라우드 API 금지 룰) |

## 2. 임베딩 — Retrieval

| 측면 | 값 |
|---|---|
| 역할 | VectorRAG 검색, 페르소나 텍스트 chunk 임베딩 |
| 선택 | **BAAI/bge-m3** (1024차원, multilingual) |
| 우리 사용 | `ai-server/.env: EMBEDDING_MODEL=BAAI/bge-m3` / `experiments/rag/vector_rag.py` |
| 선택 근거 | (1) ai-server 가 이미 사용 중 — 실험·운용 일치 (2) multilingual 한국어 강함 |
| 대안 | jhgan/ko-sroberta-multitask (768차원, 실험설계 v5 권장이었지만 bge-m3 가 더 강함) |

## 3. Vector DB

| 측면 | 값 |
|---|---|
| 역할 | Phase 1 VectorRAG 셀의 chunk 저장·검색 |
| 선택 | **ChromaDB** (PersistentClient, cosine similarity) |
| 우리 사용 | `experiments/rag/chroma_db/` (300 chunk: 30 페르소나 × 10 chunk) |
| 선택 근거 | embed-fn 분리 가능, persistent disk, 가벼움 |
| 대안 | FAISS (C++ 빠름·persistent 약함), Qdrant (production scale 강함) |

## 4. Graph DB

| 측면 | 값 |
|---|---|
| 역할 | 환자 페르소나 KG 저장·검색, GraphRAG 셀 |
| 선택 | **Neo4j AuraDB** (Free tier) |
| 우리 사용 | `ai-server/app/services/auradb_memory.py` / Phase 1 GraphRAG 셀 |
| 선택 근거 | 운용 시스템과 동일, Cypher 쿼리, free tier 충분 |
| 주의 | 일정 비활성 시 Paused → DNS NXDOMAIN. 채팅 500 발생 시 콘솔 깨우기 |
| 대안 | KuzuDB (embedded), MemGraph |

## 5. STT — Speech-to-Text

| 측면 | 값 |
|---|---|
| 역할 | 환자 음성 → 텍스트 (대화 입력) |
| 선택 | **faster-whisper-large-v3-turbo-korean** (ghost613 fine-tuned) |
| 우리 사용 | `ai-server/app/services/stt_service.py` |
| 선택 근거 | 한국어 fine-tune, large-v3 base (정확도) |
| 주의 | fine-tune 모델 환각 가능성 — 사용 전 환각 테스트 필수 (memory 등록) |
| 대안 | faster-whisper-large-v3 (vanilla, 한국어 보통), Clova STT (클라우드 — 금지) |

## 6. TTS — Text-to-Speech

| 측면 | 값 |
|---|---|
| 역할 | AI 응답 → 음성 (환자에게 출력) |
| 선택 | **Qwen3-TTS** (Alibaba) + **Supertonic** + **MMS-TTS-KOR** (fallback) |
| 우리 사용 | `ai-server/app/services/tts_service.py` |
| 선택 근거 | Qwen3-TTS 12Hz 1.7B 한국어 자연스러움 |
| 대안 | Coqui XTTS (클로닝), Piper (가벼움) |

## 7. Fine-tune — Training

| 측면 | 값 |
|---|---|
| 역할 | gemma 도메인 specific (회상요법 화법) 학습 |
| 선택 | **unsloth** (가속화 래퍼) + **peft** (LoRA) + **trl** (SFTTrainer) + **bitsandbytes** (4bit) |
| 우리 사용 | `finetune/scripts/06_train_lora.py` , `09_train_stage1.py` |
| 선택 근거 | unsloth 가 LoRA 학습 ~2배 가속 + 메모리 30-50% 절감, gemma 4 day-one 지원 |
| 대안 | axolotl (yaml config), llama-factory (UI), 표준 transformers + peft (느림) |

## 8. Quantization & Deployment

| 측면 | 값 |
|---|---|
| 역할 | 학습 가중치 → production 배포 형식 |
| 선택 | **GGUF Q4_K_M** (llama.cpp 형식) + **Ollama** (local server) |
| 우리 사용 | `finetune/scripts/11_save_gguf.py` (unsloth save_pretrained_gguf) → `12_register_ollama.sh` |
| 선택 근거 | ai-server 가 ollama HTTP API 사용 — 학습 결과 즉시 plug-in |
| 의존 | `libcurl4-openssl-dev` (llama.cpp 빌드) |

## 9. RAGAS Evaluation (Phase 1)

| 측면 | 값 |
|---|---|
| 역할 | RAG 시스템 정량 평가 (Faithfulness / Answer Relevancy / Context Precision / Context Recall) |
| 선택 | **ragas** (Es et al. EACL 2024) |
| 우리 사용 | (예정) `experiments/scripts/05_phase1_ragas.py` |
| 선택 근거 | 학계 표준, RAG 평가 de facto, 의료 도메인 적용 사례 (GastroBot 등) |
| 대안 | TruLens, DeepEval (자체 평가 도구) |

## 10. LLM-as-Judge (Phase 2)

| 측면 | 값 |
|---|---|
| 역할 | 회상요법 응답 pairwise 비교 (`docs/평가설문지.hwp` 기반, LLM text judge는 Q4 제외 13문항) |
| 선택 | **OpenAI judge model** (OpenAI API) |
| 우리 사용 | (예정) `experiments/scripts/13_phase2_judge.py` |
| 선택 근거 | MT-Bench (Zheng NeurIPS 2023) + Microsoft GraphRAG (Edge 2024) 표준. 한국어 평가 강함 |
| 예외 | `experiments/` 한정 클라우드 API 예외 정책 적용 |

## 11. Safety Classifier

| 측면 | 값 |
|---|---|
| 역할 | Fine-tune 모델 응답의 toxicity 평가 |
| 선택 | **beomi/korean-hatespeech-classifier** (KcELECTRA 기반, 4 카테고리) |
| 우리 사용 | `finetune/scripts/13_safety_eval.py` |
| 한계 | 일반 분류기라 도메인 specific 응답에 false positive 발생 (FAILURES F3) — 학술적 발견 |
| 대안 (v2) | 도메인 specific 분류기 직접 학습 (kmhas + 회상요법 라벨링) |

## 12. Datasets

| 데이터셋 | 출처 | 라이센스 | 우리 사용 |
|---|---|---|---|
| **NVIDIA Nemotron-Personas-Korea** | HuggingFace | CC BY 4.0 | 30명 (Phase 1) + 60명 (v2) sampling |
| **KoAlpaca-v1.1a** | HuggingFace (beomi) | Apache 2.0 | Stage 1 시도 (catastrophic forgetting → 폐기) |
| **KorEmpatheticDialogues** | HuggingFace (passing2961) | CC BY 4.0 | distill v2 user 발화 추출 (500) |
| **kmhas_korean_hate_speech** | HuggingFace (jeanlee), mteb mirror | Open | Safety eval 분류기 학습 데이터 (간접) |
| **conversations.db** | 자체 (ai-server 운영 로그) | 자체 | 자연 페어 401 |
| **회상요법 책** | `docs/회상요법 진행/관련 책.docx` | 사용자 보유 | wiki + v2 reference (OCR 예정) |
| **회상요법 위키** | 자체 (`docs/wiki/`) | 자체 | SYSTEM_PROMPT 의 RAG context (~22K 토큰) |
| **AI Hub 71703 고령자 스토리 구술** | AI Hub | 회원가입 (다운로드 가능) | v2 LLM reference ⭐ + STT fine-tune + Phase 2 평가 metric 보완 |
| **AI Hub 71517 중·노년 방언(강원·경상)** ⭐ | AI Hub | 일반 다운 (IRB X) | Stage 4 (부산 dialect LLM) + Stage 5 (STT) — 경상도 1,202h, 60대+ 화자 |
| AI Hub 466 감성·발화스타일 음성합성 | AI Hub | 일반 다운 | Stage 5 보조 (감정 발화 STT) — 50명 성우, 1,067h |
| AI Hub 107 자유대화 음성(노인남여) | AI Hub | 일반 다운 | Stage 5 (노인 STT) — LLM 부적합 |

## 13. Backend / Frontend

| 카테고리 | 선택 | 위치 |
|---|---|---|
| AI Server | **FastAPI** + Uvicorn (Python 3.13) | `ai-server/` (port 8000) |
| Caregiver API | **Express** (Node + pnpm) | `caregiver/artifacts/api-server/` (port 5000) |
| Caregiver App | **Expo Web** (React Native) | `caregiver/artifacts/caregiver-app/` (port 8082) |
| Patient Web | (포함) Vite React | `caregiver/artifacts/patient-web/` |

## 14. Infrastructure

| 측면 | 값 |
|---|---|
| GPU | **NVIDIA H200 NVL** (140GB HBM3) |
| Server | 원격 H200 (<SERVER_IP>) — MobaXterm 접속 |
| 브라우저 | 로컬 (<CLIENT_IP>) |
| OS | Linux 6.8 (Ubuntu) |
| Python venv | `ai-server/.venv/` (운용), `experiments/.venv/` (실험), `finetune/.venv/` (학습) |
| Container | (없음 — 직접 venv) |

## 15. Experiment Tooling

| 측면 | 값 |
|---|---|
| 데이터 처리 | pandas, pyarrow |
| HF datasets | `datasets` (HuggingFace) |
| 시각화 | matplotlib, seaborn (예정), jupyter notebook |
| 통계 | scipy, statsmodels (ANOVA, Tukey HSD), pingouin (비모수) |
| HTTP | requests (Ollama API) |

---

## 채택 안 한 것 (의사결정 근거 — 발표 "Considered Alternatives" 섹션)

| 후보 | 검토 결과 | 사유 |
|---|---|---|
| google/gemma-3-27b-it | ❌ 잘못 선택했다가 catch 후 정정 (FAILURES F1) | ollama gemma4:31b 와 다른 모델 |
| Qwen 3.5 122B-A10B | ⏳ 보류 (캡스톤 후 v2) | production 일치 깨짐, MoE QLoRA 미검증 |
| KoCulture-Dialogues | ❌ 부적합 | MZ 카톡 어조 (노인과 정반대) |
| korean_safe_conversation | ❌ 부적합 | "AI 라서 못 합니다" 회피 응답 학습 위험 |
| heegyu/open-korean-instructions | ❌ 부적합 | 영어 번역 잔여, AI 회피 응답 |
| KoED (KUNLP) | ❌ 보류 | CC BY-NC, zero-shot benchmark 권장 |
| AI Hub 자유대화 음성(노인남여) | ❌ LLM 부적합 | monologue, STT 학습용 (별도 작업으로는 가능) |
| AI Hub 565 부산 노인·치매 음성 | ❌ 폐기 | IRB 불가 — 사용자 결정 (2026-05-05). 대체: AI Hub 71517 경상도 방언 1,202h |
| AI Hub 538 립리딩(입모양) 음성인식 | ❌ 폐기 | 청각장애인용, 일반인 75%, 회상요법 부적합 |
| AI Hub 71748 한국어 LLM 말뭉치 (310만) | ❌ 폐기 | 부산 방언 X, 노인 X, 일반 텍스트 |
| jhgan/ko-sroberta-multitask | ❌ 보류 | bge-m3 가 더 강함 + production 일치 |
| OpenAI/Anthropic/Gemini API (시스템 운용) | ❌ 룰 위반 | "모든 AI 모델은 오픈소스 로컬만" (CLAUDE.md), 실험 한정 예외만 |

---

## 발표용 한 슬라이드 요약

```
[Hardware]      H200 NVL 140GB
[LLM Base]      Gemma 4 31B (4bit Q4_K_M)
[Embedding]     bge-m3 (1024d multilingual)
[VectorRAG]     ChromaDB
[GraphRAG]      Neo4j AuraDB (페르소나 KG)
[Wiki RAG]      docs/wiki/ 22K 토큰 (회상요법 책 + 임상)
[STT]           faster-whisper-large-v3-turbo-korean
[TTS]           Qwen3-TTS / Supertonic / MMS-TTS-KOR
[Fine-tune]     unsloth + peft (LoRA) + trl + bitsandbytes (4bit QLoRA)
[Deployment]    GGUF Q4_K_M → Ollama
[Phase 1 평가]   RAGAS 4 메트릭
[Phase 2 평가]   OpenAI 설문형 LLM-as-Judge + 전문가 블라인드 설문
[Safety eval]   beomi/korean-hatespeech-classifier
[Backend]       FastAPI (AI), Express (Caregiver), Expo (App)
```
