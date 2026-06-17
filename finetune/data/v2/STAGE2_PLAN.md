# Stage 2 — KG-aware (페르소나 풍부 메타) 학습 plan

> Stage 1 Proper (6,929 페어, eval_loss 0.246) 위에 누적.
> 책 PDF 무관. AI Hub 71703 teller 메타 풍부화 + cross-persona leak 방어.

---

## 동기

Stage 1 Proper 의 한계:
- 단순 (user, assistant) SFT — 페르소나 메타 활용 학습 부족
- distill 시 system context 에 age/sex/region 만 포함 → teller 의 풍부한 메타 (교육년·배우자·동거인수·자녀수·우울/불안 점수) 미활용
- production ai-server 는 환자 KG fact 를 system context 로 주입하므로, 학습도 같은 형식 필요

Stage 2 가 해결:
- **메타 풍부화** — 교육수준/가족구성/정신건강 점수까지 system context
- **페르소나-aware 응답 학습** — 정신건강 점수 높으면 안전 톤, 낮으면 자연스러운 추억 확장
- **cross-persona leak 방어** — system context 에 명시된 메타만 활용, 외부 PII leak X

---

## 데이터 plan

### 입력
| Source | 양 | 용도 |
|---|---|---|
| `pairs_stage2_persona.jsonl` (script 22 생성) | ~2,500 | Stage 2 메인 |
| `stage1_pairs.jsonl` (Stage 1 데이터) | ~6,929 → replay 30% = ~750 | forget 방지 replay buffer |
| **합계 학습 페어** | **~3,250** | |

### Stage 2 distill 구조 (`pairs_stage2_persona.jsonl`)
```json
{
  "id": "71703p_<jsonId>_<qaidx>",
  "source": "stage2_persona_distill",
  "category": "C2-일상회상(장소)",
  "keyword": "학교",
  "system_persona": "환자: 60대 남자. 교육: 중등. 거주: 대구시. 가족: 배우자 동거, 자녀 1명. 정신건강: 우울 경증. 화제: C2-일상회상(장소) (키워드: 학교).",
  "user": "<71703 환자 발화>",
  "assistant": "<gemma + SP + wiki + persona context 응답>",
  "meta": {"age": 61, "sex": "남자", "edu_years": 9, ...}
}
```

### Stratified sampling (페르소나 다양성)
Group key = (나이대, 성별, 교육수준, 정신건강 ± )
- 예상 그룹 수: 4(60s/70s/80s/90s) × 2(남/여) × 5(미취학~대학) × 2(MH±) = 80 그룹
- 그룹당 max 20 → 최대 1,600. Sample 부족 그룹 만큼 줄어듦 → 최종 ~1,500-2,500.

---

## 학습 plan

### Configuration (`23_stage2_train.py`)
| 파라미터 | 값 | Stage 1 대비 |
|---|---|---|
| Base | Stage 1 Proper LoRA | (Stage 1 은 raw base) |
| LoRA r/α | 16/32 | 동일 |
| max_seq_len | 4096 | Stage 1 의 2048 → 페르소나 컨텍스트 추가로 길게 |
| epochs | 2 | Stage 1 의 3 → overfit 방지 |
| lr | 1e-4 | Stage 1 의 2e-4 → 누적 학습 안정성 |
| Stage 1 replay | 30% | (Stage 1 KoAlpaca 폐기 교훈 — forget 방지) |
| 예상 시간 | ~1.5-2.5h | Stage 1 의 117분 |
| 예상 train_loss | 0.20-0.30 | Stage 1 의 0.258 |

### LoRA 누적 패턴 (검증 필요)
Unsloth `FastLanguageModel.from_pretrained(model_name="<lora_path>")` 로 로드 → `get_peft_model` 으로 학습 활성화.
- 위험: unsloth 의 LoRA continuation 가 검증 안 된 패턴.
- Fallback: 실패 시 Stage 1 데이터 + Stage 2 데이터 합쳐서 raw base 부터 다시 학습 (단일 stage, 양만 ↑).

---

## 평가 plan (Stage별 룰 적용 — `feedback_stage_eval_rule.md`)

### Before
- `evidence/after_stage1_proper.txt` 그대로 (Stage 1 Proper 가 Stage 2 의 baseline)

### After
- `evidence/after_stage2.txt` — 같은 10 시나리오 + 페르소나 컨텍스트 변형 (메타 변화 시 응답 변화 확인)

### Safety
- `evidence/safety_stage2.txt` — `13_safety_eval.py` 동일 (beomi/korean-hatespeech-classifier)

### 누적 비교 (RESULTS.md "단계별 효과 비교" 표)
| 시점 | 모델 | 시나리오 | Safety |
|---|---|---|---|
| Before | gemma-4-31B + SP + wiki | (`evidence/before.txt`) | 9/10 |
| After Stage 1 (KoAlpaca) | + KoAlpaca LoRA | 🚨 forget | 1/10 |
| After Stage 1 Proper | + 회상요법 LoRA (6.9K) | 정성 ↑ | 7/10 |
| **After Stage 2** | + KG-aware LoRA (3.3K, 누적) | (대기) | (대기) |

### Persona-aware 평가 (Stage 2 신규)
같은 user 발화에 대해 페르소나 메타를 바꿔가며 (예: 우울 정상 vs 우울 주의) 응답 톤이 적절히 변하는지 정성 평가 — 별도 시나리오 5세트 추가.

---

## 진행 단계 (체크리스트)

1. ✅ EXPERIMENTS_LOG.md 시도 시작 기록
2. ✅ Stage 2 데이터 준비 스크립트 작성 (`22_stage2_persona_distill.py`)
3. ✅ Stage 2 학습 스크립트 작성 (`23_stage2_train.py`)
4. ✅ STAGE2_PLAN.md 작성
5. ⏸ **사용자 작업** — ai-server 시작 (`bash start.sh` 또는 uvicorn 직접)
6. ⏸ Stage 2 distill 응답 generate (`python finetune/scripts/22_stage2_persona_distill.py --n-target 2500`) — ~3-5시간
7. ⏸ Stage 2 학습 실행 (`python finetune/scripts/23_stage2_train.py`) — ~1.5-2.5h
8. ⏸ GGUF 변환 + Ollama 등록 + after_stage2 generate + safety eval
9. ⏸ RESULTS/EXPERIMENTS_LOG/LESSONS 누적 갱신

---

## 리스크

| 리스크 | 완화 |
|---|---|
| LoRA 누적 unsloth 검증 안 됨 | Fallback: Stage 1 + Stage 2 합쳐 단일 stage 재학습 |
| Stage 1 forget (도메인 어조 약화) | 30% replay buffer (Stage 1 데이터 random sample mix) |
| 페르소나 leak (메타 직접 인용) | system prompt 명시 + 평가 시 메타 인용 빈도 측정 |
| ai-server distill 시간 (~3-5h × 2,500 페어) | gemma4:31b TTFT ~1s, gen ~3-5s/응답. 실측 후 조정 |

---

## 학술 contribution

1. **Curriculum SFT — 도메인 일관 stage**: KoAlpaca 폐기 교훈 (LESSONS L2) 위에서 stage 간 도메인 어조 일치한 학습이 forget 없이 성능 ↑
2. **메타 풍부화 → 페르소나-aware 응답**: 정신건강 점수 → 응답 톤 자동 조정 (Stage 1 은 톤 동일, Stage 2 는 톤 적응)
3. **Cross-persona leak 방어**: system grounded 학습으로 외부 PII leak 0 (LESSONS L4 이어서)
