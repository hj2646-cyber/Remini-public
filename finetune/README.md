# finetune — DSLM LoRA Fine-tune

> Remini 본 시스템(`ai-server/`)에 적용할 회상요법 fine-tuned 모델 학습 영역.
> 산출물 (LoRA 어댑터 / GGUF / Ollama 등록 모델) 은 본 시스템과 `experiments/` 양쪽에서 사용.
>
> **위치 결정**: `experiments/` 안이 아니라 루트 직속 (`Remini/finetune/`).
> fine-tune 결과물은 일회성 실험이 아니라 본 시스템의 영구 자산이기 때문.
>
> Prompt + Wiki 방식 (`ai-server/app/services/llm.py` 의 `SYSTEM_PROMPT` + `docs/wiki/`)
> 위에 **가중치 자체** 에 회상요법 지식을 stamp 하여 prompt 짧아도 일관된 도메인 응답 가능.

---

## 데이터 파이프라인

```
conversations.db        대화로그_*.txt          docs/wiki/*.md
   (68세션, 자동)        (3개, 수동)            (5개, 시스템 prompt 용)
        ↓                    ↓                       ↓
        └─── 01_extract_pairs.py ────┘                ↓
                       ↓                              ↓
              data/pairs/raw_pairs.jsonl     (학습 시 system_msg 로 주입)
                       ↓
              02_auto_filter.py
              (길이/언어/에러 필터)
                       ↓
              data/pairs/filtered.jsonl
                       ↓
              03_review_sheet.py
              (사람 검수: PASS/FIX/FAIL)
                       ↓
              data/pairs/reviewed.jsonl  ←  사용자 검수 후 PASS만
                       ↓
              04_split.py
              (train/val/test 8:1:1)
                       ↓
              data/splits/{train,val,test}.jsonl
```

## 학습 파이프라인

```
data/splits/train.jsonl
        ↓
05_train_lora.py  ─────┐
  unsloth + gemma4:31b │  H200 80GB 1장
  LoRA r=16 alpha=32   │  ~2-4시간 (500 페어 × 3 epoch)
  4bit QLoRA           │
        ↓              │
checkpoints/lora_v1/   │
        ↓              │
06_merge_to_gguf.sh    │  LoRA → base 병합 → GGUF Q4_K_M
        ↓              │
07_register_ollama.sh  │  ollama create remini-dslm -f Modelfile
        ↓              │
ollama run remini-dslm ←┘  → Phase 2 cell1 의 응답 모델
```

## 학술적 정당화

- **왜 fine-tune 이 필요한가**: prompt + wiki 만으로는 token 매번 소모 + 강한 행동 패턴 학습 한계.
  Fine-tune 으로 도메인 지식이 가중치에 stamp 되면 prompt 짧아도 일관된 도메인 응답 가능.
- **왜 LoRA 인가**: 31B full fine-tune 은 H200 1장으로 불가 (200GB+ VRAM 필요).
  LoRA r=16 이면 학습 가능 + catastrophic forgetting 방지.
- **데이터 출처의 학습 누설 방지**: Phase 2 평가 30 페르소나 ≠ 학습 데이터 페르소나
  (학습 데이터는 conversations.db 의 P001~P002 등 / 평가는 NVIDIA 30명 별개 인물).

## 데이터 누설 (Data Leakage) 주의

- conversations.db 는 *우리 시스템의 출력* — 이걸 학습하면 "우리 시스템 모방"
- 따라서 검수 단계에서 잘못된 응답 (평가 FAIL) 은 반드시 제외
- 회상요법 책 (`docs/회상요법 진행.docx`) 에서 **모범 응답 30-50개** 수동 추가로 noise 보정

## 의존성

`requirements_train.txt`:
```
unsloth>=2024.10
torch>=2.4.0
transformers>=4.45.0
peft>=0.13.0
trl>=0.11.0
bitsandbytes>=0.44.0
```

`experiments/.venv` 와 별도로 `experiments/finetune/.venv` 권장 (의존성 충돌 회피).
