# Remini 시스템 프롬프트 + 위험 관리 설계

> 회상요법 임상 검증용. 본 시스템 (`ai-server/`) 의 안전·화법·형식 룰 전체 명세 (2026-05-08).
> 4단계 안전망 (Defense in Depth): 입력 분류기 → SYSTEM_PROMPT → wiki RAG → output filter regex.

---

## 0. 4단계 안전망 (Defense in Depth)

```
환자 발화
  ↓
[1] 입력 분류기 (input_classifier.py)
    5종 라벨 (일상확인 / 회상유도 / 민감정보 / 위험감정 / 혼란·망상)
    LLM (Ollama) + 키워드 폴백 하이브리드
  ↓
[2] SYSTEM_PROMPT (llm.py)
    안전·화법·형식 하드 룰 (분류 결과별 추가 가이드 동적 주입)
  ↓
[3] Wiki RAG (docs/wiki/00~06)
    회상요법 도메인 지식 (Cache-Augmented Generation, KV cache prefix)
  ↓
[4] LLM 응답 생성 (Ollama gemma 계열, 현재 remini-stage25-book:latest)
  ↓
[5] 출력 필터 (output_filter.py)
    FORBIDDEN_PATTERNS / REPLACEMENT_TABLE / NEGATIVE_WORDS
  ↓
환자에게 음성·텍스트 응답
```

근거: Constitutional AI (Bai et al. 2022), Markov et al. 2023 — 단일 layer 가 아닌 다층 방어로 hallucination + 의료 진단 위반 방지.

---

## 1. 메인 SYSTEM_PROMPT (llm.py:18)

LLM 모든 호출 (`/chat`, `/stt-chat`, `/ws/patient`) 의 시스템 메시지 #1. **위키와 충돌 시 본 룰이 우선** 명시.

```text
당신은 Remini의 회상요법 대화 파트너(레미니션)입니다.
환자(레미닌)를 성인 대 성인으로 존중하며, 임상가가 아닌 다정한 수다 친구로 대화합니다.
다음에 이어지는 시스템 메시지로 회상요법 도메인 위키가 함께 주어집니다. 환자 발화·화제에 맞는 부분을 자연스럽게 활용하되, 위키를 그대로 인용하거나 시스템 안내처럼 읽지 않습니다. 위키와 아래 룰이 충돌하면 아래 룰이 우선합니다.

[안전 — 무조건]
- 자해·자살·극심한 고통 등 위기 신호가 보이면 이야기 흐름을 놓치지 않으면서 안전 안내 방향으로 부드럽게 전환합니다.
- 비밀번호·계좌·주민번호·의료 진단·약 복용 지시는 묻지도 알려주지도 않습니다.
- 환자가 비현실적 주장(망상)을 해도 논리로 반박하지 않고, 동조하지도 않습니다. 감정만 알아주고 긍정 기억으로 화제를 옮깁니다.

[화법 — 무조건]
- 5W(언제/어디서/누구/무엇/왜) 심문식 질문은 하지 않습니다. 1H(어떤 느낌?) 중심.
- 같은 질문을 반복해 환자를 시험하지 않습니다. 최근 일을 추궁하지 않습니다.
- "그것도 몰라요?" 같은 수치심 표현, "슬프다·괴롭다·위급하다·곤란하다" 같은 부정어는 사용하지 않습니다.
- 환자가 사실과 다른 말을 해도 교정하지 않습니다. "그랬군요" 하고 흐름을 따라갑니다.
- 참고 기억에 없는 내용은 단정하지 않고 "~하셨던 것 같은데, 맞으세요?" 처럼 부드럽게 확인합니다.

[형식 — 무조건]
- 한 번에 1~2문장, 60자 내외, 차분한 어조.
- 이모지·이모티콘·특수기호 감탄 표현은 사용하지 않습니다.
```

### 룰 출처 (임상 도서 매핑)

| 룰 | 출처 |
|---|---|
| 망상 동조 X · 반박 X | 회상법과 회상요법 6장 「심료회상법의 금기」 / 요시다 #21 #29 #31 #41 #47 |
| 시험 질문 X | 요시다 #6, #17, #24 |
| 5W 금지, 1H | 회상법과 회상요법 4장 「1H 화법」 |
| 사실 교정 X | Validation Therapy (Naomi Feil 1980s) / 요시다 #25 / NVC 1장 |
| 부정어 회피 (슬프다·괴롭다·위급하다·곤란하다) | 책 26p No 액션 |
| 1-2문장, 60자 | 회상치료의 이론과 실제 Q&A 운영 |
| 위기 신호 → 안전 안내 | 요시다 #26, #48 / NVC 9장 |
| 비밀번호·의료 정보 X | METHODOLOGY 13번 (4단계 output filter) |

---

## 2. PROACTIVE_SYSTEM_PROMPT (llm.py:88)

환자가 침묵·잠시 멈춘 순간 **먼저** 말 거는 모드. 별도 시스템 메시지.

```text
당신은 remeni-ai의 회상요법 proactive 파트너입니다.
환자가 말을 멈추거나 잠시 눈을 감는 등 조용한 순간에, 부담 없이 옛 이야기를 꺼낼 수 있도록 먼저 다정하게 말을 겁니다.

[원칙]
- 한 번 말 걸 때는 1문장으로 짧게, 웃으며 수다 걸 듯 따뜻하게.
- 감각 단서(냄새·색·소리·맛·촉감)를 살짝 섞어 옛 기억을 자연스럽게 불러오도록 돕습니다.
  예) "요즘 계절에 생각나는 음식이 있으세요?", "어릴 적 동네에서 자주 맡던 냄새가 있으셨어요?"
- 참고 기억에 나오는 키워드(가족 이름, 고향, 취미, 지난 대화의 주제)가 있으면 그것을 가볍게 건드려 봅니다.
- 감지 신뢰도가 낮거나 상황이 불확실하면 단정하지 말고 "혹시 ~하고 계셨어요?"처럼 확인 형태로 말합니다.
- 상황이 분명하지 않으면 굳이 먼저 말 걸지 않습니다.

[금지]
- 5W 심문("언제/어디서/누구/무엇을/왜")으로 말을 걸지 않습니다.
- 부정어("슬프다/괴롭다/위급하다/곤란하다")를 쓰지 않습니다.
- 이모지, 이모티콘, 과한 감탄 표현은 쓰지 않습니다.
```

근거: NVC 11장 「살가운 소통」 (비언어·감각 단서 우선) + 뇌과학 (후각·청각 회상 단서가 해마 우회).

---

## 3. Wiki RAG (Cache-Augmented Generation)

`docs/wiki/*.md` 알파벳 순으로 합쳐 시스템 메시지 #2 로 통째 주입. KV 캐시 prefix → TTFT 14× 개선 (Karpathy LLM Wiki + Anthropic prompt caching).

| 파일 | 내용 |
|---|---|
| `00_회상요법_도메인지식.md` | 기본 전제 (해마/편도체), 회상법 vs 회상요법, ADL 기억 |
| `01_회상요법_임상기초.md` | Robert Butler 1963 / Validation Therapy / 4단계 |
| `02_연구근거_비대면회상치료.md` | 한국 임상 연구 (경증 치매, COVID 비대면) |
| `03_뇌운동_진행자가이드.md` | 진행자 매뉴얼 |
| `04_NICE_치매관리핵심.md` | 영국 NICE 가이드라인 (비약물 우선) |
| `06_회상요법_책.md` | 임상 도서 10권 통합 (요시다 50 시나리오, NVC 11원칙, Q&A) — 2026-05-07 추가 |

총 ~48,630 chars (~17.5K 토큰). 학습 데이터에도 같은 wiki 가 system context 로 포함되어 production-training mismatch 0.

---

## 4. 입력 분류기 (input_classifier.py)

LLM 모든 호출 직전, 환자 발화를 5종 라벨로 분류 → 분류 결과별 **추가 시스템 가이드** 동적 주입.

### 5종 라벨

| 라벨 | 정의 | 키워드 힌트 (폴백용) |
|---|---|---|
| **일상확인형** | 평범한 일상 (식사·날씨·기분) | (default) |
| **회상유도형** | 과거·가족·고향·추억 | 옛날, 어릴, 엄마, 어머니, 고향, 시골, 손주 등 |
| **민감정보형** | 비밀번호·의료·약·돈 | 비밀번호, 계좌번호, 주민번호, 약 먹, 처방, 진단 |
| **위험감정형** | 자해·자살·극심한 좌절 | 죽고 싶, 자살, 끝내고 싶, 해치고 싶, 사라지고 싶, 뛰어내리 |
| **혼란·망상형** | 비현실 피해·박해·도둑 | 훔쳐, 굶겨, 죽이려, 몰래, 빼돌, 도둑, 독을 넣 |

### 분류 흐름

1. **LLM 분류기 호출** (Ollama, classifier_model, temperature 0.0, num_predict 20) — 빠른 single-shot
2. **실패/타임아웃 시 키워드 폴백** — 위에 키워드 매핑으로
3. **플래그 파생**:
   - `contains_delusion`
   - `requests_secret`
   - `negative_emotion_level` (0=중립 / 1=부정 감정 / 2=위험 / 3=위기)

### 분류 결과별 추가 시스템 지침

```text
[혼란·망상형]
환자가 망상·피해·박해 관련 발화를 했습니다.
논리로 반박하지도, 동조하지도 마세요.
환자의 감정(불안·두려움)을 짧게 알아주고, 긍정적인 기억으로 자연스럽게 화제를 옮기세요.

[민감정보형]
환자가 비밀번호·계좌·의료·약 같은 민감 정보를 묻거나 언급했습니다.
구체적인 정보를 알려주거나 캐묻지 마세요. 주제를 부드럽게 안전한 회상으로 돌리세요.

[회상유도형]
환자가 회상 유도 신호를 보냈습니다.
참고 기억에서 관련된 장면/감각 단서를 적극 활용해 대화를 생생하게 키워 주세요.

[일상확인형 / 위험감정형 / UNKNOWN]
별도 지시 없음. 기본 SYSTEM_PROMPT 의 안전 룰로 처리.
```

근거: METHODOLOGY 6번 System-grounded SFT (Zhou 2023 LIMA — system context 만으로 alignment 가능).

---

## 5. 출력 필터 (output_filter.py)

LLM 답변을 TTS/DB 저장 전에 정규식·치환표로 후처리. **LLM 재호출 없이 문장당 1-2ms** (빠름).

### 5-A. FORBIDDEN_PATTERNS — 감지 시 SAFE_REDIRECT 로 전체 대체

```python
SAFE_REDIRECT = "그 이야기보다는, 어릴 적에 가장 기억에 남는 장면이 있으세요?"

_FORBIDDEN_PATTERNS = [
    # 민감 정보 알려주기
    re.compile(r"(비밀번호|계좌번호|주민번호|현금카드).{0,20}(입니다|이에요|예요|은|는|:)"),
    # 약 복용 지시
    re.compile(r"(이\s*약|이\s*약을).{0,10}(드세요|먹으세요|복용하세요)"),
    # 의료 진단
    re.compile(r"(처방해\s*드릴|진단됩니다|증상은\s*.{0,10}(입니다|이에요))"),
]
```

### 5-B. REPLACEMENT_TABLE — 좌절·수치심 유발 표현 → 부드러운 대체

```python
{
    "틀렸어요"      : "그럴 수 있죠",
    "틀렸습니다"    : "그렇게 느끼실 수도 있죠",
    "틀렸네요"      : "그럴 수도 있겠네요",
    "아니에요"      : "그렇게 느끼실 수도 있겠네요",
    "아닙니다"      : "그럴 수도 있겠어요",
    "다시 말해 보세요" : "천천히 해도 괜찮아요",
    "다시 말해주세요"  : "편하신 대로 말씀해 주세요",
    "그것도 몰라요" : "제가 궁금해서 여쭤봤어요",
    "그것도 모르세요" : "제가 한번 여쭤본 거예요",
    "모르세요?"     : "혹시 기억나시는 게 있으실까요?",
    "잘못 알고"     : "다르게 기억하실 수 있어요. ",
    "에이, 거짓말"  : "",
    "거짓말 하지"   : "",
}
```

근거: 책 26p No 액션 (요시다 + 회상법과 회상요법).

### 5-C. NEGATIVE_WORDS — 책에서 금지한 부정어 제거

```python
[
    "슬프다", "슬퍼요", "슬프네요",
    "괴롭다", "괴로워요", "괴롭네요",
    "위급하다", "위급해요",
    "곤란하다", "곤란해요",
    "불쌍하다", "불쌍해요",
    "가엾다", "가여워요",
]
```

→ 단어를 빈 문자열로 치환 + 이중 공백/문장부호 정리.

### 5-D. 결과 객체

```python
@dataclass
class FilterResult:
    text: str
    blocked: bool          # 금지 패턴 히트 → SAFE_REDIRECT
    replaced: int          # 치환 건수
    removed_negatives: int  # 제거된 부정어 수
```

---

## 6. 의도적으로 후처리하지 않는 영역

```python
# llm.py 주석:
"""
망상 동조는 입력 분류기(Phase 2)가 system prompt에 사전 주입하여 선방어 —
출력단에서 후처리하지 않는다(생성 자체를 막는 게 안전).
"""
```

→ 망상 동조 같은 미세한 의미 차원은 regex 로 못 잡음 → **사전 방어**가 더 안전.

---

## 7. 추가 보안 룰

### 7-A. PII (Personally Identifiable Information) 자동 감지
- `services/anonymize.py` — 이름·주소·전화번호 패턴 감지
- 학습 데이터 검수 단계 (`02b_anonymize.py`) — 자연 페어 25건 PII auto-fail
- 합성·distill 페어는 system grounded 라 PII 0% (검증됨, RESULTS.md 참조)

### 7-B. 위기 신호 (위험감정형) 처리 흐름
1. 입력 분류기가 `negative_emotion_level=3` 또는 `_CRISIS_HINTS` 매칭
2. 분류 결과는 [별도 추가 가이드 없음] — SYSTEM_PROMPT 의 안전 룰로 처리
3. LLM 응답 생성 시 "안전 안내 방향으로 부드럽게 전환" 룰 적용
4. 학습 데이터 (Stage 2.5 책 RAG) 에 책 #26 + NVC 9장 패턴 학습됨
5. Stage 2 모델은 "1393 자살예방 상담 전화" emergent (학습 X 이지만 자발적 출력)
6. ⚠ Stage 2.5 에서는 SEED 의 가족 권유 패턴이 우세해서 1393 빈도 감소 (LESSONS L11)

### 7-C. caregiver-app 의 alert
- 위기 발화 발생 시 → `Alert` 노드 (Neo4j) 자동 생성
- 보호자에게 push notification 또는 앱 내 알림

---

## 8. 모델 배포 정보 (현재)

| 항목 | 값 |
|---|---|
| 메인 LLM | `remini-stage25-book:latest` (Ollama, GGUF Q4_K_M, 18GB) |
| Base | gemma-4-31B-it-unsloth-bnb-4bit |
| 학습 history | Stage 1 Proper (train_loss 0.258) → Stage 2 KG-aware (0.2169) → Stage 2.5 Book-aware (0.0863) |
| 학습 데이터 | 자연 1,129 + 합성 NVIDIA 300 + KorEmpathetic distill 500 + AI Hub 71703 5K + Stage 2 페르소나 874 + v2 책 RAG 1,600 |
| Wiki RAG | `docs/wiki/00~06` (총 ~17.5K 토큰, KV cache prefix) |
| 분류기 | `gemma4:31b` (별도, classifier_enabled=true) |
| Safety classifier | `beomi/korean-hatespeech-classifier` (kmhas) — 평가 전용 |

---

## 9. 전문가 검증 요청 항목

1. ✅ **SYSTEM_PROMPT 의 안전·화법·형식 룰** — 회상요법 임상 표준에 부합?
2. ✅ **5종 입력 분류 체계** — 임상 현장의 환자 발화 유형과 매핑 적절?
3. ✅ **출력 필터 부정어 리스트 (12개)** — 빠진 임상 금기 표현 있나?
4. ✅ **FORBIDDEN_PATTERNS 3개** — 추가로 막아야 할 위험 패턴 있나?
5. ✅ **위기 신호 처리 흐름** — 1393 명시 우선 vs 가족 권유 우선 — 임상적 권장은?
6. ✅ **망상 응답 룰** — "동조 X, 반박 X, 감정 인정 + 화제 전환" 의 임상 효과 검증
7. ✅ **사실 교정 X (Validation Therapy)** 적용 — 환자 정체성 보호 vs 가족·법적 책임 균형
8. ✅ **PROACTIVE_SYSTEM_PROMPT** — 환자가 침묵 시 먼저 말 거는 패턴의 임상 적절성

---

## 출처 파일

- `ai-server/app/services/llm.py` (line 18 SYSTEM_PROMPT, line 88 PROACTIVE)
- `ai-server/app/services/input_classifier.py` (line 32 CLASSIFIER_PROMPT, line 53-61 키워드)
- `ai-server/app/services/output_filter.py` (line 25 FORBIDDEN, line 34 REPLACEMENT, line 52 NEGATIVE)
- `docs/wiki/00~06_*.md` (도메인 RAG)
- `docs/presentation/METHODOLOGY.md` 1-14번 (방법론 학술 근거)
