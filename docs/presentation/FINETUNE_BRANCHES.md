# Fine-tune Branch — 큰 가지 (Stage 단위)

> 캡스톤·캡스톤 후 진행할 fine-tune 단계 정리.
> 사용자가 AI Hub / HF 데이터 링크 보내주면 → 어떤 stage 에 매핑할지 이 파일에 기록.

---

## 큰 그림

```
[Base: gemma-4-31B (Q4_K_M)]
        ↓
[Stage 1 Proper] ✅ 회상요법 기본 화법 (train_loss 0.258)
        ↓
[Stage 2] ✅ 페르소나-aware (KG context, train_loss 0.2169) ⭐ 1393 emergent
        ↓
[Stage 2.5] ✅ Book-aware (회상요법 임상 도서 10권, train_loss 0.0863)
        ↓ ⚠ 1393 → 가족 권유 trade-off
[Stage 2.6] ✅ CareCall-aware (NAVER NAACL 2022 시니어 톤, train_loss 0.0894 / eval 0.0932) ← 메인 (remini-stage26-carecall:latest)
        ↓ Safety 8/10 (Stage 2.5 7/10보다 ↑)
[Stage 3] ❌ skip (2026-05-09 사용자 결정) — SEED 보강으로 1393 복구로 대체 가능
        ↓ (선택, 캡스톤 안)
[Stage 4] 부산 dialect specific
        ↓ (별도 — STT)
[Stage 5] STT fine-tune
        ↓ (캡스톤 후 v2)
[Stage 6] 진행자 모방 (실제 임상 패턴)
[Stage 7] DPO / SimPO 정렬 (← 책 GOOD/BAD pair 활용 가능)
```

**각 stage 후**: before vs after 평가 + 결과 누적.

---

## Stage 1 — 회상요법 기본 화법 (메인)

| | |
|---|---|
| 목적 | 가장 강한 baseline. 회상요법 룰 + 화법 + 한국어 스타일 stamp |
| 학습 형식 | (user 환자 발화, assistant 회상요법 응답) SFT |
| 양 | 5K-10K 페어 |
| 시간 | 응답 generate ~6-10시간 + 학습 ~2-3시간 |

### 들어갈 데이터

| 데이터 | 역할 | 양 |
|---|---|---|
| **AI Hub 71703 환자 발화** (qa[i].answer) | user 발화 source ⭐ | 177만 → sample 5-10K |
| 자체 자연 페어 (DB 검수 후) | user + assistant (PASS+FIX) | ~250-350 |
| 자체 합성 (NVIDIA 30 KG self-distill) | 페어 그대로 | 300 |
| 자체 distill (KorEmpathetic user → 우리 응답) | 페어 그대로 | 500 |
| 회상요법 책 OCR | system prompt reference | (텍스트 자료) |

응답 generate: **ai-server (gemma + SP + wiki + 페르소나 익명화) → self-distill**.

---

## Stage 2 — 페르소나-aware 응답 (KG context) + 책 reference

| | |
|---|---|
| 목적 | 환자 KG fact 활용 응답 + cross-persona leak 방어 + **책 임상 사례 reference 활용** |
| 학습 형식 | (system: 페르소나 KG 익명화 + 책 reference, user: 발화, assistant: 응답) |
| 양 | 2K-3K |
| 시간 | ~4-5시간 |
| 누적 | Stage 1 Proper LoRA 위에 누적 학습 (`--resume-from-lora lora_stage1_proper`) |

### 들어갈 데이터

| 데이터 | 역할 | 양 |
|---|---|---|
| **AI Hub 71703 teller** (나이·성별·고향·교육·우울·불안) | system context (익명화) | 129K teller → sample 2-3K |
| (대안) NVIDIA 페르소나 60명 KG | system context | 60개 KG |
| **회상요법 책 OCR** ⭐ | system prompt reference (임상 사례) | OCR 받으면 추가 |
| **사용자 SEED 22 페어** | few-shot 예시 (모범 응답 패턴) | OCR 받은 후 사용자 작성 |

---

## Stage 2.5 — Book-aware (회상요법 임상 도서 10권 통합) ⏳

**상태**: 책 RAG 통합 완료 (2026-05-07), SEED 22 페어 사용자 작성 대기 → 학습 진행 예정

| | |
|---|---|
| 목적 | 임상 도서의 GOOD/BAD 응답 패턴을 LoRA 가중치에 학습. wiki RAG 와 fine-tune 가중치 양면 적응 |
| 학습 형식 | (system: BOOK_REFERENCES + persona, user: 카테고리별 발화, assistant: 책 패턴 따른 응답) |
| 양 | 1,600 페어 (8 카테고리 × 200, C5 100·C7 200·C8 200) |
| 시간 | distill ~2-3h + 학습 ~30min (Stage 2 위에 LoRA continuation) |
| Base | `remini-stage2-persona:latest` (Stage 2 위에 누적) |

### 들어갈 데이터

| 데이터 | 역할 | 양 |
|---|---|---|
| **사용자 SEED 22 페어** | few-shot 모범 응답 + book_reference column | 22 (사용자 작성 대기) |
| **요시다 50 시나리오** | system context (GOOD/BAD pair) + 카테고리 매핑 | 50 → 8 카테고리 1:1 |
| **NVC 11원칙** (Bielak-Smith) | system context (윤리 frame) | 11 |
| **회상 주제 카탈로그** (Q&A 핸드북) | 발화 generation 시 주제 다양성 확보 | (10+ 주제) |
| **자체 합성 발화** (LLM gen) | 카테고리당 ~200 발화 | 1,600 |
| **자체 합성 응답** (ai-server + wiki 06 + SEED few-shot) | 모범 응답 generate | 1,600 |

### Stage 2 → 2.5 누적 학습 룰
- Stage 2 LoRA 위에 누적 (LoRA continuation)
- Stage 2 데이터 30% replay (catastrophic forgetting 방어, McCloskey 1989)
- before/after 평가 + safety eval 무조건

### 캡스톤 후 활용
- 50 GOOD/BAD 시나리오 → DPO contrastive pair (Stage 7) 자동 자산
- "Fine-tune (Stage 2.5) + RAG (wiki 06) + SP (룰) 3중 도메인 적응" 학술 contribution

---

## Stage 2.6 — CareCall-aware (NAVER NAACL 2022 시니어 톤) ✅

**상태**: 학습 완료 (2026-05-10), 본 시스템 적용 (`remini-stage26-carecall:latest`)

| | |
|---|---|
| 목적 | 한국어 시니어 케어 코퍼스의 따뜻한 위로 톤을 LoRA 가중치에 흡수 |
| 학습 형식 | (user 노인 발화, system CareCall 봇 응답) SFT 페어 |
| 양 | 14,957 (CareCall 13,357 + Stage 2.5 v2 replay 1,600) |
| 시간 | 2시간 56분 (3,554 step, 2.6s/step) |
| Base | `lora_stage2_5_book_aware` (Stage 2.5 어댑터 위 누적) |

### 들어간 데이터

| 데이터 | 역할 | 양 | 라이선스 |
|---|---|---|---|
| **NAVER CareCall filtered_10k** | LM 생성 + 사람 필터링 시니어 대화 | 12,491 페어 | CC-BY-NC-SA 4.0 |
| **NAVER CareCall feedback_100** | Human-in-the-loop 검수 시니어 대화 | 866 페어 | CC-BY-NC-SA 4.0 |
| Stage 2.5 v2 replay (책 RAG) | catastrophic forgetting 방어 | 1,600 페어 | self-generated |

추출 룰:
- (이전 user 발화, 다음 system 응답) 페어 변환
- `out-of-bounds=True` 응답 제외 (role spec 위반)
- 길이 1~200자 필터
- dedup (user+assistant 조합)
- feedback_100 우선 배치 (사람 검수 우선)

### 결과

| 지표 | 값 | Stage 2.5 비교 |
|---|---|---|
| train_loss | 0.0894 | 0.0863 → 살짝 ↑ (안부 task 충돌) |
| eval_loss | 0.0932 | 0.0953 → ↓ (일반화 ↑) |
| Safety (kmhas) | **8/10** | 7/10 → +1 ⭐ |

### 핵심 효과
1. ✅ Stage 2.5 책 패턴 보존 (요시다 #21·#24, NVC 7장·9장)
2. ⭐ CareCall 따뜻한 위로 표현 흡수 ("정말 소중", "고생 많으셨어요", "도란도란 수다")
3. ⭐ 감각 1H 화법 유지
4. ⚠ 1393 emergent 미복구 (Stage 2.5 trade-off 그대로)

### 캡스톤 후 활용
- 시니어 톤 강도가 사용자 만족도 평가 (피드백 satisfaction) baseline
- Stage 7 DPO contrastive에서 CareCall feedback_100 (chosen) vs filtered_10k LM-generated 일부 (rejected) 활용 가능

---

## Stage 3 — 안전·위기 응답 specific (스킵)

**상태**: 2026-05-09 사용자 결정으로 **스킵**. SEED C5 위기 응답에 1393 명시 추가 + mini distill 한 번이면 fix 가능 → 별도 stage 불필요.

대안 plan: SEED_TEMPLATE.csv C5 위기 응답에 "1393 자살예방 상담 전화" 명시 + 가족 권유 둘 다 통합 → 다음 v2 generation 한 번 돌리면 가중치에 박힘.

---

## ~~Stage 3 — 안전·위기 응답 specific~~ (원본 plan, 스킵됨)

| | |
|---|---|
| 목적 | 위기 신호 감지 + 안전 안내 강화 (SYSTEM_PROMPT A4 룰 weight ↑) |
| 학습 형식 | (위기 발화, 안전 응답) |
| 양 | 500-1K |
| 시간 | ~1.5-2시간 |

### 들어갈 데이터

| 데이터 | 역할 | 양 |
|---|---|---|
| **AI Hub 71703 우울/불안 점수 ≥2 화자** | user 위기 발화 | ~17-25% × sample |
| 자체 위기 시나리오 작성 | user 추가 (예: "다 끝내고 싶어") | 50-100 |
| ai-server 안전 응답 generate | assistant | (자동) |

---

## Stage 4 — 부산 dialect specific (선택, 캡스톤 안)

| | |
|---|---|
| 목적 | 부산 환자 발화에 dialect 일치 응답 |
| 양 | 5K (sample) |
| 시간 | ~7시간 |

### 들어갈 데이터

| 데이터 | 역할 | 양 |
|---|---|---|
| **AI Hub 71703 부산 화자만** (`거주지=부산시`) | user 부산 발화 (한국어 표준 위주) | 17K → sample 5K |
| **AI Hub 71517 경상도 방언** (60대+ 사투리) | user 방언 발화 + 표준치환 페어 | 1,202h 경상도 → text sample |
| ~~AI Hub 565 부산 노인·치매~~ | ❌ IRB 불가 — 71517 이 dialect 측면 대체 | — |

---

## Stage 5 — STT Fine-tune (별도 작업, LLM 과 분리) — ✅ 완료 (2026-05-26)

| | |
|---|---|
| 목적 | **Qwen3-ASR-1.7B** 베이스 위에 노인 발화 도메인 적응 (peft LoRA, bf16) |
| 학습 형식 | WAV + transcript 페어 (chat-template prefix + assistant target, prefix -100 mask) |
| 결과 | **WER 28.44% → 7.40% (−21.04%p, 3.85×)**, CER 9.09% → 2.94%, 환각 0/200 유지 |
| 산출물 | `finetune/checkpoints/qwen3_asr_lora_v1/adapter_model.safetensors` (8.78M params) |
| 학습 시간 | 5시간 7분 / H200 단일 / GPU 16.5GB / 16,112 steps (epoch 1.0) |

### 베이스 모델 결정 (2026-05-25)
- ❌ ~~faster-whisper-large-v3-turbo-korean (ghost613)~~ — Zeroth 뉴스 fine-tune 환각 trauma (정치 뉴스 클리쉐 찍어냄), 폐기
- ✅ **Qwen3-ASR-1.7B** (Qwen3-Omni audio multimodal 기반) — 52언어, 한국어 round-trip 100%, vLLM streaming sidecar 호환
- 폴백 운영: faster-whisper-large-v3-turbo (인터넷 다국어 turbo, 환각 위험 0 검증됨)

### 들어갈 데이터 (실제 채택)

| 데이터 | 양 | 채택 / 진행 상황 |
|---|---|---|
| **AI Hub 107 자유대화 음성(노인남여)** ⭐ | 1,000명+ × 3,000h+ | **2026-05-25 부분 다운** — 스튜디오 + AI스피커 + 음성수집도구 1zip = 263k pair / **2,048 시간** |
| AI Hub 71703 음성 (10,529h) | 매우 큼 | 텍스트만 사용 (Stage 1 distill, audio 미다운) — 디스크 부담 3.5TB |
| AI Hub 71517 경상도 방언 음성 | 1,202h | **Stage 5.2** 후속 (부산 dialect STT 확장) |
| AI Hub 71517 강원도 방언 | 801h | 보조 |
| AI Hub 466 감성·발화스타일 음성합성 | 1,067h | 감정 발화 보조 (선택) |
| ~~AI Hub 565 부산 노인·치매~~ | ❌ IRB 불가 — 폐기 | 71517 이 대체 |

### 학습 + 평가 패턴 (메모리 룰 — Stage 별 before/after)

1. **`finetune/scripts/30_aihub107_explore.py`** — 다운 후 (wav, transcript) pair 검증 + 통계 (theme/age/region/duration)
2. **`finetune/scripts/31_aihub107_prepare.py`** — 필터 (0.5~25s, 한글) + 90/10 split + HF datasets (Audio 컬럼 16kHz cast)
3. **`finetune/scripts/32_qwen3_asr_lora.py`** — 4bit QLoRA 학습 (r=16, target=q/k/v/o_proj, bf16, lr=1e-4)
4. **`finetune/scripts/33_qwen3_asr_eval.py`** — base vs +lora WER + CER + **환각 검출** (정치 뉴스/영문 클리쉐/반복)
5. ai-server 통합 — `app/services/stt.py` `_get_qwen()` 에 `PeftModel.from_pretrained` 분기 (`QWEN_ASR_USE_ADAPTER=true`)

---

## Stage 6 — 진행자 모방 (캡스톤 후 v2)

| | |
|---|---|
| 목적 | 실제 임상 진행자 패턴 학습 |
| 학습 형식 | (환자 answer, 진행자 next_question) — 룰 일치 question 만 |

### 들어갈 데이터

| 데이터 | 역할 | 양 |
|---|---|---|
| **AI Hub 71703 question 룰 일치** (5W X, 부정어 X) | assistant 응답 | ~80% × sample |

---

## Stage 7 — DPO / SimPO 정렬 (캡스톤 후 v2)

| | |
|---|---|
| 목적 | preference 학습 — chosen vs rejected |
| 학습 형식 | (user, chosen, rejected) |

### 들어갈 데이터

| 데이터 | 역할 |
|---|---|
| 검수자 PASS/FIX 결과 | chosen |
| 검수자 FAIL 결과 | rejected |
| AI Hub 룰 위반 question | rejected (5W·부정어 케이스) |

---

## 사용자가 보낼 AI Hub 데이터 매핑 (적재 영역)

> 사용자가 새 AI Hub 또는 HF 데이터 링크 보내면 여기 추가.
> 포맷: **데이터셋 → Stage 매핑 → 활용 방법 → 양 / 라이센스 / 다운로드 가능 여부**

### (이미 활용 중 / 활용 예정)

| 데이터 | Stage | 활용 |
|---|---|---|
| AI Hub 71703 (고령자 스토리 구술) ⭐ | Stage 1·2·3·4 | 환자 발화·teller·점수 다 활용 (177만 발화, 부산 17K) |
| **AI Hub 71517 (중·노년 강원·경상 방언) ⭐** | **Stage 4 + Stage 5** | 경상도 방언 1,202h (부산 포함), 60대+ 화자, 음성+발음/방언/표준 3중 표기 → dialect LLM + STT 둘 다 |
| AI Hub 자유대화 음성(노인남여) (107) | Stage 5 | 노인 STT (LLM 부적합) |
| AI Hub 466 감성·발화스타일 음성합성 | Stage 5 (보조) | 감정 발화 STT 보강 (50명 성우, 노인 X) |

### (제외 / 폐기)

| 데이터 | 사유 |
|---|---|
| AI Hub 565 (부산 노인·치매 음성) | ❌ IRB 불가 — 71517 가 dialect 측면 대체 |
| AI Hub 538 (립리딩 음성) | ❌ 청각장애인용, 회상요법 부적합 |
| AI Hub 71748 (한국어 LLM 말뭉치 310만) | ❌ 부산 방언 X, 노인 X, 일반 텍스트 |

### (추가 예정 — 사용자 보내는 대로)

```
- (대기) ...
```

---

## 진행 순서 권장

**캡스톤 안**:
1. Stage 1 (메인) — 검수 결과 + AI Hub 71703 → 학습 → 평가
2. Stage 2 — teller 익명화 → 학습 → 평가
3. Stage 3 — 위기 점수 필터 → 학습 → 평가
4. (선택) Stage 4 — 부산 화자만 → 학습 → 평가

**캡스톤 후 v2**:
5. Stage 5 STT (IRB 후)
6. Stage 6 진행자 모방
7. Stage 7 DPO 정렬

각 stage **완료 후 EXPERIMENTS_LOG / RESULTS / FAILURES / LESSONS 즉시 누적**.
