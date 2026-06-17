# Slide Outline — 캡스톤 발표용

> 슬라이드 목차 + 각 슬라이드 핵심 한 줄. 발표 자료 작성 시 이 outline 따라 채우면 됨.

---

## 1. Title & Motivation
- **제목**: Remini — 치매 환자 회상요법 AI 대화 파트너 + 보호자 모니터링 시스템
- **문제**: 치매 환자 케어 시간·비용 부담, 보호자 번아웃, 임상 회상요법 접근성
- **목표**: 임상 회상요법 룰 따르는 AI 가 환자와 일상 대화 + 보호자가 모니터링

## 2. System Architecture
- AI Server (FastAPI, gemma-4-31B + therapy SP + wiki + RAG)
- Caregiver API/App (Express + Expo)
- 3-tier Risk Management (입력 분류 → 회상요법 단계 추적 → 위기 감지)
- 그래프: `docs/wiki/00_*` 회상요법 도메인 지식 통합

## 3. 회상요법 도메인 지식 통합
- 도서 *절대지식 치매 백과사전* + 한국 회상법 → wiki 5개 .md
- SYSTEM_PROMPT (5W 금지·1H 화법·부정어 X·사실 교정 X·망상 동조 X)
- KV cache 활용 (Karpathy LLM Wiki 패턴)

## 4. 실험설계 v5 — 두 가설
- **H1**: GraphRAG > VectorRAG (페르소나 fact 검색)
- **H2**: DSLM > Gemini (회상요법 응답)
- 4-cell 2×2 factorial × 1,080 trial × RAGAS 4 메트릭

## 5. Phase 1 — 시스템 적합성 (H1)
- NVIDIA Nemotron-Personas-Korea 30명 stratified sampling
- KG yaml + 시나리오 270 (T 사실/F 반대/F 시점오류/ADV 부분일치/시점근접/유사인물)
- ChromaDB + bge-m3 (VectorRAG) vs yaml KG full (GraphRAG)
- 결과: (`RESULTS.md` 참조)

## 6. Phase 2 — DSLM 회상요법 우월성 (H2)
- 40 회상 세트 × LLM-as-Judge (`docs/평가설문지.hwp`, Q4 제외 13문항) + 전문가 블라인드 설문
- 결과: (`RESULTS.md` 참조)

## 7. Fine-tune Methodology
- 자연 페어 401 (실서비스 로그) + 합성 300 (NVIDIA 30 KG self-distill) + distill 500 (KorEmpathetic user → 우리 시스템 응답)
- PII 자동 감지 (cross-persona leak 방어) — 25 페어 AUTO_FAIL_PII
- 검수 체크리스트 (위키 + SYSTEM_PROMPT 기반 A/B/C 룰)
- 4bit QLoRA (Production Q4_K_M 일치)

## 8. **Negative Result — Catastrophic Forgetting**
- 시도: Curriculum 학습 (Stage 1 KoAlpaca 한국어 → Stage 2 회상요법)
- 결과: Stage 1 후 회상요법 화법 망가짐 (3인칭 메타·백과사전식·사실 환각)
- 원인: Naver 지식인 어조 vs 회상요법 어조 정반대 → 5K × 2 epoch 만으로 catastrophic forgetting
- 교훈: 도메인 일치하지 않는 데이터는 안 더하는 게 더 안전 (LESSONS L2)
- **이 발견 자체가 contribution**

## 9. Safety Evaluation
- `beomi/korean-hatespeech-classifier` 활용
- Before vs After 비교: classifier false positive 패턴 변화
- 일반 분류기의 도메인 specific 한계 (LESSONS L5)
- 향후: 도메인 specific safety 분류기 학습 (v2)

## 10. Lessons Learned (Highlight)
1. Base 모델 origin 검증 = first-class concern
2. Curriculum 학습 시 어조 일관성 필수
3. Self-distillation = cross-persona PII leak 0
4. 일반 safety classifier 한계 → 도메인 specific 필요

## 11. Limitations & Future Work
- 학습 데이터 양 (1,176) — 더 많은 자연 페어 수집 (실서비스 운영)
- DPO/SimPO 정렬 (검수 라벨 활용) — v2
- Qwen 3.5 122B 같은 더 큰 base 비교 — v2
- 도메인 specific safety 분류기 — v2

## 11.5. ⭐ Photo-Triggered Reminiscence Therapy (시스템 contribution, NEW 2026-05-08)
- **임상 책의 사진 매개 회상요법 프로토콜을 LLM 시스템에 multimodal 통합**
- 분당서울대병원 『기억여행』 4권 (96 토픽, 4계절) → 사용자가 책 사진 드롭만 하면 됨
- 트리거: 5턴 라포 → 자동 사진 + 책 표준 첫 질문 ("이 사진을 보고 떠오르는 생각을 자유롭게 말씀해 주세요")
- **상태 머신** (시연용 다이어그램):
  ```
  IDLE → ACTIVE (사진+첫 질문)
       → 5턴 진행 (책 4단계: 자유→경험→분기→감각)
       → ASKING (AI 능동 의사 확인 "더 볼까요?")
                  ↓
       ├─ "더" → 새 랜덤 사진 (즉시)
       ├─ "이제 됐어" → 일상 + 7턴 cooldown
       └─ "싫어" → 즉시 종료 (ASK 무시)
  ```
- 차별점: 단순 키워드 거부 trigger 와 다른 **자율 의사 확인 단계** (Kitwood 1997 환자 자율성 + Feil 1993 Validation Therapy)
- 시연 가능 contribution

## 12. Demo
- 실시간 대화 데모 (환자용 웹 UI + 보호자 앱)
- **사진 자동 트리거 시연** ⭐: 5턴 라포 → 사진 자동 표시 + 책 첫 질문 → 4단계 회상 → ASK → 환자 응답 분기
- before/after 비교 (`evidence/before.txt`, `evidence/after_*.txt`)

## 13. Q&A

---

## 슬라이드 분량 가이드
- 발표 시간 15분 → 12-15 슬라이드
- 각 슬라이드: 한 메시지 한 시각 자료
- Negative result 슬라이드 (#8) 가 강한 인상 — 충분한 시간 (2-3분)
