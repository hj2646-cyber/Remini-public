# SFT vs LoRA — 차이와 우리 조합

> 캡스톤 발표·논문용 reference. 둘은 배타적 X — 같이 쓰는 거 맞음.

---

## 핵심 차이

| | SFT | LoRA |
|---|---|---|
| **무엇** | 학습 **방법론** (어떤 데이터로) | 학습 **기법** (어떻게 효율적으로) |
| 비유 | "정답지로 가르친다" | "별책부록만 수정한다" |
| 차원 | 데이터 형태 | 가중치 업데이트 방식 |

---

## SFT (Supervised Fine-Tuning)

**"정답지 (input, output) 페어로 가르치기"**

```
페어: (user 발화, assistant 응답)
        ↓
       모델이 input 보고 output 예측
        ↓
       정답이랑 차이(loss)만큼 가중치 수정
```

### SFT 작동 메커니즘
- input(user)에는 loss 계산 X — 컨텍스트로만 사용
- output(assistant)에만 loss 계산 — 모델이 맞춰야 할 정답
- 결과: 모델이 "이런 input 보면 이런 output 내라"를 학습

### 대안 학습 방법론

| 방법론 | 설명 | 우리 사용 |
|---|---|---|
| **SFT** | (input, output) 페어 supervised | ✅ Stage 1~2.6 |
| **CPT** (Continued Pre-Training) | text 통째로 next-token 예측 | ❌ |
| **RLHF** (Reinforcement Learning from Human Feedback) | 사람 선호 보상으로 강화학습 | ❌ |
| **DPO** (Direct Preference Optimization) | chosen vs rejected 페어로 선호 학습 | 📅 Stage 7 계획 |
| **SimPO** (Simple Preference Optimization) | DPO 변형, reference-free | 📅 Stage 7 후보 |

---

## LoRA (Low-Rank Adaptation)

**"베이스 가중치 동결 + 작은 어댑터만 학습"**

```
gemma-31B 60GB (Frozen) ────┐
                             ├── 추론 시 합쳐짐
LoRA 어댑터 534MB (학습)  ───┘
        ↑
    이거만 업데이트
```

### LoRA 핵심 아이디어
- 풀 fine-tuning은 60B 가중치 다 업데이트 → 메모리·시간 폭발
- LoRA는 가중치 변화 ΔW = A × B 로 분해 (low-rank)
- 베이스 W는 freeze, A·B만 학습 (수백 MB만)
- 추론 시: W + ΔW = W + A×B

### 우리 LoRA 설정
| 하이퍼파라미터 | 값 |
|---|---|
| r (rank) | 16 |
| α (alpha) | 32 |
| target modules | q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj |
| 어댑터 크기 | 534MB |

### 대안 학습 기법

| 기법 | 설명 | 우리 사용 |
|---|---|---|
| **Full fine-tuning** | 모든 가중치 업데이트 | ❌ (메모리 폭발) |
| **LoRA** | 어댑터만 학습 | ✅ |
| **QLoRA** | 4bit 압축 base + LoRA | ✅ Stage 1~2.6 |
| **Adapter** | 레이어 사이 작은 모듈 삽입 | ❌ |
| **Prefix tuning** | 입력 prefix 토큰만 학습 | ❌ |

---

## 둘은 직교 (orthogonal)

같이 사용 가능. 서로 다른 질문에 대한 답.

```
        SFT       RLHF     DPO       CPT
       ┌────┬────┬────┬────┐
Full   │  ○  │    │    │    │
LoRA   │ ★★ │    │    │    │ ← 우리 + 계획
QLoRA  │ ★★ │    │ ★  │    │ ← 우리 (Stage 1~2.6)
       └────┴────┴────┴────┘
```

★★ = 우리 현재 사용
★ = 계획 (Stage 7)

---

## 우리 정확한 조합

### 현재 (Stage 1~2.6)
**"4bit base + LoRA로 (input, output) 페어 학습"** = SFT + QLoRA

| Stage | 방법론 | 기법 | 데이터 |
|---|---|---|---|
| Stage 1 Proper | SFT | QLoRA | 6,929 페어 |
| Stage 2 KG-aware | SFT | QLoRA + LoRA continuation | 1,136 페어 |
| Stage 2.5 Book-aware | SFT | QLoRA + LoRA continuation | 2,080 페어 |
| Stage 2.6 CareCall | SFT | QLoRA + LoRA continuation | 14,957 페어 |

### 계획 (Stage 7)
**"LoRA로 chosen/rejected 선호 학습"** = DPO + LoRA

| Stage | 방법론 | 기법 | 데이터 |
|---|---|---|---|
| Stage 7 (예정) | DPO | LoRA continuation | 검수 PASS/FAIL + 책 GOOD/BAD pair |

---

## 비교: 같은 모델 다른 학습

| 시나리오 | 방법론 | 기법 | 비용 | 효과 |
|---|---|---|---|---|
| Full fine-tune SFT | SFT | Full | 메모리 ★★★ 시간 ★★★ | 최강 |
| **QLoRA SFT (우리)** | SFT | QLoRA | 메모리 ★ 시간 ★ | 강력 |
| LoRA SFT | SFT | LoRA | 메모리 ★★ 시간 ★ | 강력 |
| LoRA CPT | CPT | LoRA | 메모리 ★★ 시간 ★★ | 한국어 능숙도 ↑ |
| LoRA DPO | DPO | LoRA | 메모리 ★★ 시간 ★★ | 정렬 ↑ |

---

## 한 줄 정리

> **SFT = 무엇을 가르치냐 (정답지 페어)**
> **LoRA = 어떻게 가르치냐 (어댑터만)**
>
> 둘은 다른 질문에 대한 답. 우리는 **SFT 방법론 + QLoRA 기법** 조합.

---

## 학술 근거

| 기법 | 논문 | 우리 적용 |
|---|---|---|
| LoRA | Hu et al., "LoRA: Low-Rank Adaptation of Large Language Models" (ICLR 2022) | r=16/α=32, gemma-31B |
| QLoRA | Dettmers et al., "QLoRA: Efficient Finetuning of Quantized LLMs" (NeurIPS 2023) | 4bit NF4 + LoRA |
| LoRA continuation | (관행, 학술 명시 X) | Stage N 어댑터 위에 Stage N+1 학습 |
| Replay buffer | McCloskey & Cohen, "Catastrophic Interference" (1989) | 30% 이전 stage replay |
| SFT | Ouyang et al., "Training language models to follow instructions with human feedback" (NeurIPS 2022, InstructGPT) | gemma-31B-it base + 도메인 SFT |
| Self-distillation (production teacher) | Hinton et al., "Distilling the Knowledge in a Neural Network" (2015) 변형 | ai-server (SP+wiki) → LoRA 압축 |

---

## 발표 contribution

1. **QLoRA continuation 패턴** — Stage 1 → 2 → 2.5 → 2.6 누적, 이전 stage forget 없이 train_loss 감소 입증 (0.258 → 0.0894)
2. **Replay buffer 30% 효과** — Stage 1 KoAlpaca catastrophic forgetting (FAILURES F2) 교훈 적용, safety 7/10 유지
3. **Self-distillation으로 ai-server 능력 압축** — SP·wiki·페르소나 컨텍스트를 가중치 레벨에 흡수, 추론 비용 ↓
4. **Clinical-Book RAG → LoRA 가중치 학습** (Stage 2.5) — 책 임상 패턴이 ai-server SP에 박혀 ceiling 끌어올려진 후 distill
5. **Cross-corpus 통합** (Stage 2.6) — NAVER CareCall (NAACL 2022) 시니어 톤 흡수
