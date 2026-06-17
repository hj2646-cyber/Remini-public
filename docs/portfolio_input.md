# MemorIE — 포트폴리오 입력 문서

> 부산대 산업공학과 캡스톤 "MemorIE (Remini)" — LLM 기반 치매환자 회상요법 대화 시스템
> 본 문서는 IoT-X 캡스톤 대회 포트폴리오 작성을 위해 코드베이스를 정리한 자료다. 모든 인용은 실제 파일·라인 기반이며 추측을 포함하지 않는다.
> 작성일: 2026-04-26

---

## 1. 시스템 아키텍처 전체 구조

### 1.1 최상위 디렉토리 트리 (depth 3)

```
Remini/
├── .env                              # 통합 환경변수 (모든 서비스 공유)
├── start.sh / stop.sh / status.sh / restart.sh
├── ai-server/                        # FastAPI (Python, 환자용 웹 UI 포함)
│   ├── app/
│   │   ├── config.py                 # Settings 단일 소스
│   │   ├── main.py                   # FastAPI 라우트 (1,638 LOC)
│   │   ├── models.py                 # Pydantic DTO
│   │   ├── conversation/             # WebSocket 음성 루프 (Step-2)
│   │   │   ├── agent.py              # 633 LOC, 에이전트 실행
│   │   │   ├── loop.py               # 497 LOC, PatientSession
│   │   │   ├── state.py              # 상태머신 (LISTENING/RESPONDING)
│   │   │   └── therapy_state.py
│   │   └── services/                 # 도메인 서비스 모음
│   │       ├── auradb_memory.py      # 953 LOC, Neo4j AuraDB 그래프
│   │       ├── graphrag_memory.py    # GraphRAG 검색
│   │       ├── retrieval.py          # 임베딩 + 폴백 검색
│   │       ├── llm.py                # Ollama 호출 추상화
│   │       ├── stt.py                # Faster-Whisper
│   │       ├── tts.py / supertonic_tts.py / xtts_tts.py / mms_tts.py / melo_tts.py
│   │       ├── turn_detector.py      # LiveKit EOU 모델 (옵션)
│   │       ├── input_classifier.py   # 5종 위험 분류
│   │       ├── output_filter.py      # 응답 필터
│   │       ├── proactive.py          # 능동 발화 정책
│   │       ├── knowledge_extractor.py / new_knowledge_detector.py / knowledge_confirmation.py
│   │       ├── avoidance_store.py    # 회피 주제 SQLite
│   │       ├── voice_profiles.py / patient_voice.py / local_voice_clone.py
│   │       ├── memory_photos.py / memory_store.py / conversation_db.py
│   │       ├── sentiment.py / dialect.py / online_tools.py
│   │       └── caregiver_webhook.py
│   ├── web/                          # 환자용 정적 웹 (Vanilla JS)
│   │   ├── patient.html / patient.js / patient.css
│   │   ├── voice-loop.js             # WebSocket 음성 클라이언트
│   │   ├── patient-visualizer.js / patient-robot.js
│   │   └── patient-react/            # 빌드된 React SPA
│   ├── data/                         # 환자별 음성·사진
│   ├── models/kokoro/                # TTS 음성 모델 자산
│   ├── scripts/ tests/               # 검증·테스트
│   ├── docker-compose.yml
│   └── requirements.txt
└── caregiver/
    ├── artifacts/
    │   ├── api-server/               # Express 5 API 게이트웨이
    │   │   └── src/
    │   │       ├── index.ts / app.ts / neo4j.ts / seed-neo4j.ts
    │   │       ├── routes/           # auth, patients, conversations, knowledge, alerts, feedback, pending-knowledge, ai-proxy
    │   │       └── middlewares/auth.ts
    │   ├── caregiver-app/            # Expo Router (RN + Web)
    │   │   ├── app/                  # _layout.tsx + (tabs)/ + 모달들
    │   │   ├── hooks/useApi.ts       # React Query 훅 (434 LOC)
    │   │   └── contexts/             # AuthContext, PatientContext
    │   ├── patient-web/              # 보조 환자 SPA (Capacitor 모바일 빌드 포함)
    │   └── mockup-sandbox/           # shadcn/ui 컴포넌트 라이브러리 (재사용)
    ├── lib/
    │   ├── api-spec/ api-zod/ api-client-react/   # OpenAPI/Zod 기반 클라이언트
    │   └── ...
    ├── pnpm-lock.yaml
    └── package.json
```

### 1.2 서브시스템 역할 한 줄 요약

| 서브시스템 | 포트 | 역할 |
|-----------|------|------|
| `ai-server` (FastAPI) | 8000 | STT·EOU·LLM·TTS 음성 루프 + Neo4j RAG + 회상 대화 엔진 + 환자 웹 UI 정적 호스팅 |
| `caregiver/api-server` (Express) | 5000 | 보호자 인증·환자 관리·알림·피드백·기억정보 + AI 서버 프록시 |
| `caregiver/caregiver-app` (Expo) | 8081/8082 | 보호자용 모바일/웹 대시보드 (대화 모니터링·승인·피드백) |
| `ai-server/web` (정적/React) | 8000 하위 | 환자용 음성 UI (Jarvis-orb, 자막, 매크로 EOU 버튼) |

### 1.3 사용된 주요 라이브러리·프레임워크 버전

**AI 서버 (`ai-server/requirements.txt`)**
```
fastapi==0.117.1               uvicorn[standard]==0.36.0
pydantic-settings==2.10.1      python-dotenv==1.1.1
requests==2.32.5               httpx==0.28.1
psycopg[binary]==3.2.10        pgvector==0.4.1
neo4j==5.28.3                  sentence-transformers==5.1.1
faster-whisper==1.2.0          edge-tts>=7.0.0
qwen-tts>=0.1.0                python-multipart==0.0.20
pywebview==5.4
```

**API 서버 (`caregiver/artifacts/api-server/package.json`)**
```
express ^5             jsonwebtoken ^9.0.2     bcryptjs ^2.4.3
cors ^2                cookie-parser ^1.4.7    neo4j-driver ^6.0.1
tsx (catalog)          esbuild ^0.27.3
```

**보호자 앱 (`caregiver/artifacts/caregiver-app/package.json`)**
```
expo ~54.0.27                  expo-router ~6.0.17
react-native 0.81.5            react-native-reanimated ~4.1.1
@tanstack/react-query (catalog) @react-native-async-storage/async-storage 2.2.0
expo-haptics ~15.0.8           expo-image-picker ~17.0.9
zod (catalog)                  typescript ~5.9.2
```

---

## 2. 음성 대화 파이프라인 (STT → EOU → LLM → TTS)

### 2.1 데이터 흐름 (환자 발화 시작 → 응답 재생)

WebSocket 기반 Step-2 루프가 핵심 파이프라인이고, 레거시 SSE(`/stt-chat/stream`)도 유지된다.

```
[브라우저 마이크] → AudioWorklet(PCM16, 16kHz, 1024 샘플) → WS /ws/patient
        ↓
[PatientSession._receiver]  → Silero VAD(32ms 블록) → 음성 세그먼트 누적
        ↓                              ↓
[Faster-Whisper STT (large-v3)]  → _pending_text 누적
        ↓
[END_OF_TURN 이벤트]    ← 매크로 키보드 버튼 ("end_turn" 메시지)
        ↓
[상태머신: LISTENING → RESPONDING]
        ↓
[에이전트 _run_agent_task]
   ├─ retrieval.retrieve()   (AuraDB → pgvector → 키워드 폴백)
   ├─ stream_reply()         (Ollama gemma4:31b 토큰 스트림)
   ├─ 문장 분할 + ThreadPool TTS (Supertonic 우선)
   └─ 오디오 청크 → WS {"type":"audio","data_b64":...}
        ↓
[브라우저: AudioBuffer 재생 + 자막 클램프]
        ↓
[Barge-in: VAD가 500ms 음성 감지] → START_OF_TURN → CANCEL_AGENT + CLEAR_PLAYBACK
```

**핵심 진입점**
- `ai-server/app/conversation/loop.py` — `PatientSession.run()` (line 163), `_receiver()` (line 244), `_flush_end_of_turn()` (line 311), `_process_vad_block()` (line 264)
- `ai-server/app/main.py` — `WebSocket /ws/patient` (line 699), `safe_reply()` (line 344), SSE `stt_chat_stream()` (line 843)
- `ai-server/web/voice-loop.js` — `VoiceLoopSession.start()` (line 89), `sendEndOfTurn()` (line 357)

### 2.2 Turn-taking / EOU 판정

**현재 운용 방식 — 매크로 키보드 버튼 트리거**

`ai-server/app/conversation/loop.py:244`
```python
elif mtype == "end_turn":
    # Button-press turn end: flush any buffered text as END_OF_TURN.
    await self._flush_end_of_turn()
```

`ai-server/app/conversation/loop.py:311` `_flush_end_of_turn()`이 진행 중인 음성 세그먼트를 STT로 처리한 뒤 누적 텍스트를 `END_OF_TURN` 이벤트로 전송한다.

**모델 기반 EOU (옵션) — `ai-server/app/services/turn_detector.py`**

- 모델: `livekit/turn-detector` (HuggingFace, SmolLM2-135M 파인튜닝판), revision `v0.2.0-intl`
- 기본 임계값: `eou_threshold = 0.5` (`config.py:50-52`)
- 우선순위: ① 단답형 완결 표현(`_SHORT_COMPLETE`) → ② 종결 구두점 → ③ LiveKit 모델 prob 비교 → ④ 한국어 휴리스틱 폴백

```python
# turn_detector.py is_utterance_complete()
prob = _model_backend.predict(t, recent_messages=recent_messages)
if prob is not None:
    threshold = settings.eou_threshold
    complete = prob >= threshold
    return {"complete": complete, "confidence": prob if complete else 1.0 - prob,
            "prob": prob, "reason": f"model(p={prob:.3f},thr={threshold:.2f})", ...}
```

**VAD 임계값** (`ai-server/app/config.py:126-131`)
```python
ws_vad_threshold: float = 0.5
ws_vad_min_silence_ms: int = 800       # 800ms 침묵 → 세그먼트 종료
ws_vad_min_speech_ms: int = 300        # 300ms 미만은 기침/노이즈로 폐기
ws_bargein_min_speech_ms: int = 500    # RESPONDING 중 500ms 음성 → barge-in
```

### 2.3 Barge-in 처리

서버는 `RESPONDING` 상태에서 VAD가 500ms 음성을 감지하면 `START_OF_TURN`을 발사하고 상태머신이 에이전트 태스크를 취소한다.

`ai-server/app/conversation/loop.py:281`
```python
if (
    self.state.name == StateName.RESPONDING
    and self._speech_frames_since_start == self._bargein_frames_needed
):
    await self.event_q.put(Event(EventType.START_OF_TURN))
```

상태 전이 (`ai-server/app/conversation/state.py`): `RESPONDING --StartOfTurn--> LISTENING [CancelAgent, ClearPlayback]`

서버에서 발사된 `CLEAR_PLAYBACK` 액션은 클라이언트에 `{"type":"cancel"}` 메시지로 전달되고, `voice-loop.js:309 _onServerMsg("cancel")` → `_stopAllPlayback()`이 모든 재생 중인 `AudioBufferSourceNode`를 즉시 stop 한다.

### 2.4 STT/TTS 모델 (전부 오픈소스 로컬)

| 단계 | 모델 / 엔진 | 파일 | 비고 |
|------|------------|------|------|
| STT | **Faster-Whisper large-v3** (CUDA fp16, beam=1) | `ai-server/app/services/stt.py` `STTService.transcribe()` (line 14~) | `vad_filter=True`, language=`ko` 고정 |
| EOU | **livekit/turn-detector** (SmolLM2-135M) | `ai-server/app/services/turn_detector.py` | 옵션, 현재는 버튼 우선 |
| TTS 1순위 | **Supertonic 2** (ONNX, 한국어, F1-F5/M1-M5) | `ai-server/app/services/supertonic_tts.py` | 기본 화자 F3, 속도 1.05 |
| TTS 2순위 | **XTTS v2** (Coqui, 음성 클로닝) | `ai-server/app/services/xtts_tts.py` | `xtts_max_ref_len=60s` |
| TTS 폴백 | **MMS-TTS / MeloTTS / Edge-TTS** | `mms_tts.py` / `melo_tts.py` / `tts.py:71` | `TTSService.synthesize()` (line 23~) 우선순위 체인 |
| LLM | **Ollama gemma4:31b** | `ai-server/app/services/llm.py` | 7절에서 상세 |

---

## 3. 이원 지식그래프 스키마

### 3.1 노드·엣지 정의 (실제 코드 기준)

`ai-server/app/services/knowledge_extractor.py:12-22`
```python
ENTITY_LABELS = [
    "Person", "Place", "Occupation", "Event", "Activity",
    "Medication", "Food", "Routine", "HealthCondition", "Trait",
    "Item", "Media", "Preference", "Info",
]
RELATIONSHIP_TYPES = [
    "HAS_FAMILY", "HAD_FRIEND", "WORKED_AS", "REFLECTS_ON",
    "ENJOYS_ACTIVITY", "FROM", "TAKES_MEDICATION", "PREFERS_FOOD",
    "HAS_ROUTINE", "HAS_HEALTH_CONDITION", "HAS_PREFERENCE", "HAS_INFO",
]
```

| 그래프 | 주요 노드 라벨 | 관계 |
|--------|--------------|------|
| **life_memory** (생애기억) | `Person`, `Place`, `Occupation`, `Event`, `Activity`, `Trait`, `Media`, `Preference` | `HAS_FAMILY`, `HAD_FRIEND`, `WORKED_AS`, `REFLECTS_ON`, `ENJOYS_ACTIVITY`, `FROM`, `HAS_PREFERENCE` |
| **daily_care** (일상돌봄) | `Medication`, `Food`, `Routine`, `HealthCondition`, `Activity` | `TAKES_MEDICATION`, `PREFERS_FOOD`, `HAS_ROUTINE`, `HAS_HEALTH_CONDITION` |
| 공통 허브 | `Persona`(persona_id), `Graph`(graph_type), `GraphEntity`, `MemoryPhoto` | `IN_GRAPH`, `HAS_MEMORY_PHOTO` |

대화 모드 → 그래프 가중치 매핑 (`ai-server/app/services/auradb_memory.py:50`)
```python
_MODE_GRAPH_POLICY = {
    "routine_support":   {"daily_care": 0.7, "life_memory": 0.3},
    "memory_support":    {"daily_care": 0.2, "life_memory": 0.8},
    "emotion_grounding": {"daily_care": 0.35, "life_memory": 0.65},
    "bridge_mode":       {"daily_care": 0.5, "life_memory": 0.5},
}
```

### 3.2 Cypher 쿼리 예시 (실제 코드 발췌)

**(1) 페르소나 주변 엔티티 후보 추출** — `auradb_memory.py:184`
```cypher
MATCH (p:Persona {persona_id: $persona_id})-[*0..2]-(n)
WHERE coalesce(n.name, '') <> ''
RETURN DISTINCT
    elementId(n) AS node_id,
    coalesce(n.name, '') AS name,
    head(labels(n)) AS label,
    coalesce(n.graph_type, '') AS graph_type,
    coalesce(n.alias, '') AS alias,
    coalesce(n.role, '') AS role
```

**(2) 메모리 사진 UPSERT** — `auradb_memory.py:288`
```cypher
MATCH (p:Persona {persona_id: $persona_id})
MERGE (photo:MemoryPhoto {photo_id: $photo_id})
SET photo.title = $title, photo.note = $note, photo.filename = $filename,
    photo.updated_at = $updated_at, photo.graph_type = 'memory_photo'
SET photo.created_at = coalesce(photo.created_at, $created_at)
MERGE (p)-[:HAS_MEMORY_PHOTO]->(photo)
```

**(3) 토큰 기반 그래프 검색 (EchoRoute)** — `auradb_memory.py:650`
```cypher
MATCH (p:Persona {persona_id: $persona_id})
MATCH (p)-[*0..2]-(n)
WHERE coalesce(n.graph_type, '') CONTAINS $graph_type
  AND any(token IN $tokens WHERE
        toLower(coalesce(n.search_text, "")) CONTAINS token OR
        toLower(coalesce(n.name, ""))        CONTAINS token OR
        toLower(coalesce(n.description, "")) CONTAINS token)
OPTIONAL MATCH path=(n)-[*1..2]-(m)
RETURN DISTINCT n, collect(DISTINCT {label: head(labels(m)), name: m.name})[0..5] AS neighbors
ORDER BY lexical_score DESC, name ASC
```

**(4) 보호자 승인 후 GraphEntity 생성** — `caregiver/artifacts/api-server/src/routes/pending-knowledge.ts:238`
```cypher
MATCH (persona:Persona {persona_id: $personaId})
MATCH (hub:Graph {persona_id: $personaId, graph_type: $type})
CREATE (e:GraphEntity:${entityLabel} {
  kg_id: $kgId, node_id: $nodeId, persona_id: $personaId, graph_type: $type,
  name: $title, description: $content, search_text: $searchText,
  category: $category, source: "ai_approved",
  importance: $importance, period: $period, created_at: $now, updated_at: $now
})
CREATE (persona)-[:${relType}]->(e)
CREATE (e)-[:IN_GRAPH]->(hub)
RETURN e
```

**(5) PendingKnowledge 생성** — `pending-knowledge.ts:60`
```cypher
MATCH (p:Patient {id: $patientNodeId})
CREATE (pk:PendingKnowledge {
  id: $id, rawUtterance: $rawUtterance, summary: $summary,
  categoryHint: $categoryHint, confidence: $confidence,
  status: "pending", sessionId: $sessionId, createdAt: $now, updatedAt: $now
})
CREATE (p)-[:HAS_PENDING_KNOWLEDGE]->(pk)
RETURN pk
```

### 3.3 RAG 검색 흐름

`ai-server/app/services/retrieval.py:278` `RetrievalService.retrieve()`
```python
def retrieve(self, session_id, query, top_k=None, user_id=None,
             recent_messages=None, conversation_summary=None, sticky=None) -> RetrieveResult:
    k = top_k or settings.top_k
    if self.auradb_memory.available():
        auradb_result = self.auradb_memory.retrieve(
            query=query, user_id=user_id, top_k=k,
            recent_messages=recent_messages,
            conversation_summary=conversation_summary,
            embed_many=self.embed_many,            # ← 임베딩 함수 주입
            sticky=sticky)
        if auradb_result and auradb_result.get("texts"):
            filtered_texts = filter_texts_by_avoidance(auradb_result["texts"], user_id)
            return RetrieveResult(texts=filtered_texts, used="auradb_retrieve",
                                  anchor_name=auradb_result.get("anchor_name"),
                                  weights=auradb_result.get("weights"),
                                  topic_emb=auradb_result.get("topic_emb"))
    try:
        texts = self.vector_retrieve(session_id, query, k, user_id=user_id)
        if texts:
            return RetrieveResult(texts=filter_texts_by_avoidance(texts, user_id),
                                  used="vector_retrieve")
    except Exception:
        pass
    texts = self.simple_retrieve(session_id, query, k, user_id=user_id)
    return RetrieveResult(texts=filter_texts_by_avoidance(texts, user_id), used="simple_retrieve")
```

**3단계 폴백**: AuraDB 그래프 → pgvector 벡터 → 키워드 토큰 매칭.

**EchoRoute 동적 라우팅** (`auradb_memory.py:540~600`) — 쿼리 임베딩과 두 그래프 프로토타입 벡터의 코사인을 softmax 한 뒤 힌트 prior와 블렌딩.
```python
tau = max(_ECHOROUTE_TEMPERATURE, 1e-3)        # 0.15
e_d = math.exp((sim_d - m) / tau);  e_l = math.exp((sim_l - m) / tau)
emb_d = e_d / (e_d + e_l);          emb_l = e_l / (e_d + e_l)
alpha = _ECHOROUTE_HINT_ALPHA                  # 0.35
w_d = (1.0 - alpha) * emb_d + alpha * hint_w[0]
w_l = (1.0 - alpha) * emb_l + alpha * hint_w[1]
return _normalize_pair(w_d, w_l)
```

**임베딩 모델**: `BAAI/bge-m3` (1024차원, L2 정규화, CUDA에서 fp16). `retrieval.py:55-72 _get_embedder()`.

`ai-server/app/services/graphrag_memory.py` (292 LOC)는 보조용 CSV 기반 GraphRAG 인덱서로, AuraDB가 없는 환경에서 폴백으로 작동한다.

---

## 4. 동적 메모리 학습 (대화 중 새 지식 추출)

### 4.1 새 지식 감지 — `new_knowledge_detector.py:56` `detect_new_knowledge()`

LLM에게 "환자 발화에 기존 지식그래프에 없는 새로운 사실 정보가 있나?"를 묻는다. temperature 0.1, num_predict 500, `/no_think` 모드.

```python
async def detect_new_knowledge(user_message, retrieved_context, recent_messages, user_id, ...) \
        -> Optional[NewKnowledgeCandidate]:
    if len(user_message.strip()) < 5:
        return None
    prompt = _DETECTION_PROMPT.format(
        existing_context="\n".join(f"- {c}" for c in retrieved_context) or "- (없음)",
        recent_conversation=recent_conv or "(없음)",
        user_message=user_message,
        categories=", ".join(CATEGORY_HINTS))
    payload = {"model": model_name or settings.ollama_model, "stream": False,
               "messages": [{"role": "user", "content": prompt}],
               "options": {"temperature": 0.1, "num_predict": 500},
               "think": False}
    ...
    return NewKnowledgeCandidate(
        raw_utterance=user_message, summary=summary,
        category_hint=category, confidence=confidence)
```

`CATEGORY_HINTS` (line 14): 가족관계, 직업/경력, 학창시절, 취미/관심사, 중요한 추억, 거주지, 친구/지인, 투약 정보, 식사 선호, 수면 패턴, 운동 습관, 의료 이력, 알레르기, 일상 루틴, 기타.

### 4.2 자연스러운 재확인 — `knowledge_confirmation.py:54`

감지 직후 바로 그래프에 쓰지 않고, LLM에 "자연스럽게 다시 확인해 달라"는 가이드를 system prompt로 주입한다.

```python
def get_confirmation_prompt(pending: PendingConfirmation) -> str:
    return (f"[확인 요청] 환자가 '{pending.candidate.summary}'라고 말씀하셨습니다. "
            "자연스럽게 대화하면서 이 내용이 맞는지 한 번 더 확인해주세요. "
            "직접적으로 '맞나요?'라고 묻기보다 대화 흐름 속에서 자연스럽게 되물어주세요.")
```

이후 환자 응답을 다시 LLM으로 검사 (`check_confirmation()`, line 78), confirmed=True이면 보호자 큐에 적재한다.

### 4.3 보호자 승인 큐 (PendingKnowledge)

**큐 적재** — `caregiver/artifacts/api-server/src/routes/pending-knowledge.ts:60` (Cypher는 §3.2 (5) 참조)
- 노드 `PendingKnowledge { rawUtterance, summary, categoryHint, confidence, status:"pending", sessionId }`
- 관계 `Patient -[:HAS_PENDING_KNOWLEDGE]-> PendingKnowledge`

**보호자 앱 승인 UI** — `caregiver/artifacts/caregiver-app/app/(tabs)/knowledge.tsx`
- "대기중인 항목" 섹션에 카드 노출 → 승인/거절 버튼
- React Query 훅: `useApprovePendingKnowledge`, `useRejectPendingKnowledge` (`hooks/useApi.ts`)

### 4.4 승인 시 그래프 반영

`pending-knowledge.ts:171` 흐름:
1. AI 서버 `/extract-knowledge` 호출 → `knowledge_extractor.py:53 extract_structured_knowledge()`가 LLM으로 `{type, category, title, content, entity_label, relationship_type}` 파싱
2. 결과를 검증 (`ENTITY_LABELS`/`RELATIONSHIP_TYPES` 화이트리스트)
3. Cypher로 `GraphEntity:<label>` 생성 + `Persona -[:<rel>]-> GraphEntity` + `GraphEntity -[:IN_GRAPH]-> Graph(hub)` (§3.2 (4))
4. `PendingKnowledge.status = "approved"`로 갱신 (line 282)

거절 시 `status = "rejected"`로만 표시하고 그래프는 손대지 않는다 (line 318).

`knowledge_extractor.py:24` 의 추출 프롬프트에서 `type ∈ {"life_memory","daily_care"}`을 강제하여 두 그래프 중 어디 들어갈지 LLM이 직접 결정한다.

---

## 5. 위험관리·안전성 통제

### 5.1 4단계 방어 파이프라인

```
환자 발화
  → ① input_classifier.classify_utterance()       (5종 분류 + 위기레벨)
  → ② classifier_guidance를 system prompt에 주입  (망상/민감정보별 지침)
  → ③ stream_reply() (Ollama gemma4:31b)
  → ④ output_filter.apply()                       (금지 패턴/부정어 정제)
  → ⑤ classify_risk_level → crisis면 crisis_guardrail 응답 + 보호자 webhook
```

### 5.2 입력 분류기 — `ai-server/app/services/input_classifier.py`

`classify_utterance(utterance, timeout_sec)` (line 114)는 Qwen2.5:3B(`classifier_model`)를 2초 타임아웃으로 호출하여 5종으로 분류:

```python
LABELS = ("일상확인형", "회상유도형", "민감정보형", "위험감정형", "혼란·망상형")
```

LLM 실패 시 키워드 폴백 (line 49~):
```python
_CRISIS_HINTS    = ("죽고", "죽고싶", "자살", "끝내고 싶", "해치고 싶", "포기하고 싶", "살기 싫")
_DELUSION_HINTS  = ("훔쳐", "훔쳤", "굶겨", "죽이려", "몰래", "빼돌", "도둑", "독을 넣")
_SECRET_HINTS    = ("비밀번호", "계좌번호", "주민번호", "현금카드", "약 먹", "처방", "진단", "금고")
_NEGATIVE_HINTS  = ("슬프", "괴로", "외로", "무섭", "불안", "짜증", "답답")
_REMINISCE_HINTS = ("옛날", "어릴", "어렸", "엄마", "아버지", "고향", ...)
```

위기 레벨 0~3 파생 (`_derive_flags`, line 49):
```python
emo_level = 0
if any(h in utterance for h in _NEGATIVE_HINTS): emo_level = 1
if label == "위험감정형":                          emo_level = max(emo_level, 2)
if any(h in utterance for h in _CRISIS_HINTS):    emo_level = 3   # 위기
```

`build_guidance_for_result()` (line 180)는 분류 결과별로 system prompt에 주입할 가이드 문구를 생성한다 — 예: "혼란·망상형 → 논리 반박 금지, 감정만 알아주고 긍정 기억으로 전환".

### 5.3 출력 필터 — `ai-server/app/services/output_filter.py`

`apply(text) -> FilterResult` (line 70). 정규식 기반 금지 패턴:

```python
_FORBIDDEN_PATTERNS = [
    re.compile(r"(비밀번호|계좌번호|주민번호|현금카드).{0,20}(입니다|이에요|예요|은|는|:)"),
    re.compile(r"(이\s*약|이\s*약을).{0,10}(드세요|먹으세요|복용하세요)"),
    re.compile(r"(처방해\s*드릴|진단됩니다|증상은\s*.{0,10}(입니다|이에요))"),
]
SAFE_REDIRECT = "그 이야기보다는, 어릴 적에 가장 기억에 남는 장면이 있으세요?"
```

좌절·수치심 표현 치환 (회상요법 문헌 26p "No 액션" 반영):
```python
_REPLACEMENT_TABLE = {
    "틀렸어요":      "그럴 수 있죠",
    "아니에요":      "그렇게 느끼실 수도 있겠네요",
    "다시 말해보세요": "천천히 해도 괜찮아요",
    "그것도 몰라요":  "제가 궁금해서 여쭤봤어요",
}
_NEGATIVE_WORDS = ["슬프다", "슬퍼요", "괴롭다", "위급하다", "곤란하다", "불쌍하다", ...]
```

### 5.4 회피 주제 학습 — `avoidance_store.py`

```python
@dataclass
class AvoidanceEntry:
    user_id: str; topic: str; count: int; last_seen: float
```
`AvoidanceStore.add()` (line 55)는 SQLite에 `(user_id, topic)` UPSERT, `filter_texts_by_avoidance()` (line 132)가 retrieval 결과에서 회피 주제 매칭 텍스트를 제거. 입력 소스는 보호자 피드백의 `comments` 필드 (§8.4).

### 5.5 감정·위험 분기 — `sentiment.py`

```python
CRISIS_KEYWORDS = ["죽고", "죽고싶", "자살", "없어지고 싶", "해치고 싶", "포기하고 싶", "살기 싫"]
def classify_risk_level(text, emotion, crisis_flag) -> str:
    if crisis_flag:                                    return "danger"
    if any(k in text for k in SAD_KEYWORDS) or emotion == "sad": return "watch"
    return "daily"
```

위기 시 `ai-server/app/main.py:344 safe_reply()`가 LLM 호출을 건너뛰고 즉시 안전 안내문을 반환 + `_fire_webhook(user_id, "emergency", ...)` (caregiver_webhook.py)로 보호자 알림 라우트(`POST /api/patients/:id/alerts`)에 emergency 레벨로 발사.

### 5.6 시스템 프롬프트 (회상요법 가이드라인) — `ai-server/app/services/llm.py:13-70`

전문은 다음과 같다 (LLM에 그대로 들어간다).

```
당신은 remeni-ai의 회상요법 보조 대화 파트너입니다.
임상 전문가가 아니라, 환자의 옛 기억을 함께 떠올려 주는 다정한 말벗입니다.
환자를 성인 대 성인으로 존중하며, 어린아이 다루듯 하지 않습니다.

[대화 태도]
- 웃으며 수다를 떠는 듯한 가볍고 따뜻한 어조로 말합니다.
- 환자가 하고 싶어 하는 이야기를 먼저 충분히 듣고, 주제를 가로채거나 급하게 돌리지 않습니다.
- 환자가 방금 한 말의 일부를 살짝 바꿔서 되풀이하되, 감각 단서를 하나 덧붙입니다.
  예) 환자: "밥이 맛있었어" → 답: "맛있는 밥을 드셨군요. 그 밥에서 어떤 냄새가 나던가요?"
- 가끔 당신 자신에 대해서도 솔직하게 한 마디 덧붙여 대화의 균형을 맞춥니다.

[리액션]
- "역시,", "몰랐네요,", "대단하네요,", "감각이 뛰어나시네요,", "그렇군요!"를 자연스럽게 섞습니다.

[회상 유도 — 사실보다 감정·감각 우선]
- "언제/어디서/누구/무엇을/왜" 같은 5W 심문식 질문은 하지 않습니다.
- 대신 "어떤 느낌이었어요?", "그때 무엇이 떠오르세요?"처럼 느낌·감각을 물어봅니다.
- 모양·색·냄새·맛·소리·촉감 같은 감각어를 써서 옛 기억이 떠오르도록 돕습니다.

[기억 다루기]
- "참고 기억"에 있는 사실은 자연스럽게 확신을 가지고 언급해 그 장면을 다시 불러옵니다.
- 환자가 혼동하거나 사실과 다른 말을 해도 절대 교정하지 않습니다.

[망상·혼란 대응]
- 환자가 비현실적인 주장을 해도 논리로 반박하지 않습니다. 동조하지도 않습니다.
- 대신 환자의 감정을 알아주고 긍정적인 기억으로 부드럽게 화제를 옮깁니다.

[절대 금지]
- "슬프다", "괴롭다", "위급하다", "곤란하다" 같은 부정어를 쓰지 않습니다.
- "그것도 몰라요?", "모르세요?"처럼 수치심을 주는 표현을 쓰지 않습니다.
- 비밀번호·계좌·주민번호·의료 진단·약 복용 지시를 캐묻지도 알려주지도 않습니다.
- 과거와 현재를 비교해 쇠퇴를 부각하지 않습니다.
- 정치·경제·추상적 주제로 대화를 끌고 가지 않습니다.

[안전]
- 자해·자살·극심한 고통 등 위기 신호가 있으면 안전 안내 방향으로 부드럽게 전환합니다.

[형식]
- 한 번에 1~2문장, 대략 60자 내외의 짧은 호흡으로.
- 이모지, 이모티콘, 특수 기호 감탄 표현은 사용하지 않습니다.
```

`PROACTIVE_SYSTEM_PROMPT` (`llm.py:72-87`)는 능동 발화 전용이며 5W 금지·1문장 제약을 더 강하게 둔다.

---

## 6. 인간공학 UI 구현

### 6.1 LLM 주도 트리거

`ai-server/app/services/proactive.py` `ProactivePolicy.evaluate()` (line 16)이 4종 이벤트를 평가한다.

| event_type | 트리거 | 액션 (LLM 호출) |
|-----------|--------|----------------|
| `session_start` | 세션 첫 진입 (1회) | `session_greeting` |
| `face_detected` | 얼굴 감지 | (영구 비활성화 — 빈도 과다) |
| `eyes_closed` | EAR<0.19 가 2.2초 이상 지속 | `drowsy_check` |
| `silence` | 환자 무응답 10초 이상 | 1차 `silence_checkin` → 2차 `silence_memory_prompt` (3회 이후 차단) |

쿨다운 (`config.py:76-82`)
```python
proactive_min_confidence: float = 0.6
proactive_greeting_cooldown_sec: int = 120
proactive_drowsy_cooldown_sec: int = 45
proactive_silence_cooldown_sec: int = 30
proactive_eyes_closed_sec: float = 2.2
proactive_silence_sec: float = 10.0
```

**감지 위치** — `ai-server/web/patient.js`:
- MediaPipe FaceMesh + Eye Aspect Ratio (`EYE_CLOSED_EAR = 0.19`) → `eyes_closed` POST `/proactive-event`
- 무응답 카운터 5초 간격 폴링 → `silence` POST

```javascript
async function postProactiveEvent(eventType, confidence, eyesClosedSeconds = 0, silenceSeconds = 0) {
  const resp = await fetch(`${API_BASE}/proactive-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id, user_id, event_type: eventType,
                           confidence, eyes_closed_seconds, silence_seconds }),
  });
  const data = await resp.json();
  if (data.triggered && data.reply) {
    setSubtitle(data.reply);
    setFaceExpression("reassuring");
    await speakReplyAndAwaitResponse(data.reply);
  }
}
```

### 6.2 인간공학 원칙 코드 매핑

| 원칙 | 적용 위치 | 코드 |
|------|----------|------|
| **Modality Compatibility** (자막+TTS 동시) | `ai-server/app/main.py:843` SSE 이벤트 `token`(자막) + `audio`(TTS), `web/patient.html:35-38` `<p id="subtitleText">` | 문장 단위 ThreadPool TTS, 토큰 단위 자막 갱신 |
| **Redundancy** (시각·청각 중복) | `ai-server/web/patient-visualizer.js` 235 LOC 음성 비주얼라이저 + `patient.css:42-61` 청록 글로우 | 들리지 않을 때 시각 단서, 안 보일 때 청각 단서 |
| **Auditory Display** | TTS 다중 백엔드 폴백 (Supertonic→XTTS→MMS→Edge) | `tts.py:23 TTSService.synthesize()` |
| **Legibility (큰 글씨)** | `patient.css:364` `font-size: clamp(1.6rem, 3vw, 2.7rem)` | 자막 1.6~2.7rem, 검정 배경 위 #f8f2e8 (고대비) |
| **Error tolerance** | 매크로 키보드 EOU 버튼 (음성 인식 실패해도 강제 턴 종료) | `voice-loop.js:357 sendEndOfTurn()` |
| **Affect feedback** | 표정 상태 (`reassuring`, neutral 등) | `patient.js setFaceExpression()` |

### 6.3 매크로 키보드 EOU 버튼 처리

```html
<!-- ai-server/web/patient.html:38 -->
<button id="endTurnBtn" class="end-turn-btn hidden" type="button">말하기 완료</button>
```

```javascript
// ai-server/web/voice-loop.js:357
sendEndOfTurn() {
  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    this.ws.send(JSON.stringify({ type: "end_turn" }));
  }
}
```

```python
# ai-server/app/conversation/loop.py:244
elif mtype == "end_turn":
    await self._flush_end_of_turn()    # 진행 중 STT flush + END_OF_TURN 이벤트
```

물리 버튼 → HID 키보드 입력 → 브라우저 키 이벤트(코드 단의 클릭 핸들러) → WS 메시지 → 상태머신 이벤트, 한 줄짜리 결정 경로로 단순화되어 있다.

---

## 7. 로컬 LLM 통합

### 7.1 Ollama 설정 (`ai-server/app/config.py`)

```python
llm_provider: str = "ollama"
ollama_base_url: str = "http://127.0.0.1:11434"
ollama_model: str = "gemma4:31b"
ollama_temperature: float = 0.4
ollama_top_p: float = 0.9
ollama_repeat_penalty: float = 1.1
ollama_num_ctx: int = 4096
ollama_num_predict: int = 256

eou_model: str = "qwen2.5:1.5b-instruct"
eou_llm_enabled: bool = True
eou_llm_timeout_sec: float = 1.5

classifier_model: str = "qwen2.5:3b"
classifier_enabled: bool = True
classifier_timeout_sec: float = 2.0

embedding_model: str = "BAAI/bge-m3"
```

세 가지 모델을 용도별로 분리한다.

| 용도 | 모델 | temperature | num_predict | timeout |
|------|------|-------------|-------------|---------|
| 회상 대화 (메인) | `gemma4:31b` | 0.4 | 256 | 180s |
| EOU 보조 (옵션) | `qwen2.5:1.5b-instruct` | - | - | 1.5s |
| 입력 분류 | `qwen2.5:3b` | 0.0 | 20 | 2.0s |
| 임베딩 (RAG) | `BAAI/bge-m3` | - | - | - |

### 7.2 LLM 호출 추상화 — `ai-server/app/services/llm.py`

| 함수 | 라인 | 용도 |
|------|------|------|
| `chat_with_ollama()` | 185 | 동기 1회성 응답 |
| `stream_chat_with_ollama()` | 222 | JSONL 스트림 (Generator[str]) |
| `chat_with_ollama_proactive()` | 274 | 능동 발화용 (temp 0.35, num_predict 140) |
| `_build_chat_messages()` | 155 | 시스템·기억·요약·분류·사투리 메시지 조립 |
| `generate_reply()` | 359 | 프로바이더 디스패처 (ollama/clovax) |
| `stream_reply()` | 382 | 스트림 디스패처 |
| `proactive_reply()` | 332 | 능동 호출 디스패처 |

```python
# llm.py:222 stream_chat_with_ollama() 핵심
with requests.post(f"{settings.ollama_base_url}/api/chat", json=payload,
                   timeout=180, stream=True) as r:
    r.raise_for_status()
    for line in r.iter_lines(decode_unicode=True):
        if not line: continue
        chunk = json.loads(line)
        token = chunk.get("message", {}).get("content", "")
        if token: yield token
```

`_build_chat_messages()`가 system → 기억 컨텍스트 → 대화 요약 → classifier_guidance → 사투리 힌트 → 최근 대화 → 현재 user 발화 순으로 메시지를 누적한다 (회상요법 가이드라인이 가장 먼저 들어가도록).

사투리 시스템: `ai-server/app/services/dialect.py` (414 LOC, Top-5 모듈) — 표준어/경상도/전라도/충청도/제주도/강원도 × light/medium/strong 강도 매트릭스를 system prompt에 주입.

### 7.3 임베딩 호출 — `ai-server/app/services/retrieval.py:55`

```python
def _get_embedder(self) -> SentenceTransformer:
    if self._embedder is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        self._embedder = SentenceTransformer(settings.embedding_model, device=device)
        if device == "cuda":
            try: self._embedder.half()      # H200 fp16
            except Exception: pass
    return self._embedder

def embed_many(self, texts):
    return self._get_embedder().encode(texts, normalize_embeddings=True,
                                       convert_to_numpy=True, batch_size=32).tolist()
```

---

## 8. 보호자 앱 구조

### 8.1 환자 ↔ 보호자 정보 흐름

```
[AI 서버 :8000 FastAPI]      ←─── ai-proxy ───→     [API 서버 :5000 Express]
   /conversations                                       /api/patients/...
   /memory-photos                                       /api/auth/login
   /avoidance                                           Bearer JWT 검증
   /proactive-event                                     Neo4j 직결
                                                          ↓ HTTP/JSON+JWT
                                                    [보호자앱 :8081/8082]
                                                       Expo Router (RN+Web)
                                                       React Query 캐싱
```

3-tier로 명확히 분리되어 있고, **보호자 앱은 AI 서버를 직접 호출하지 않는다**. 모든 AI 자원은 `caregiver/artifacts/api-server/src/routes/ai-proxy.ts`(433 LOC)가 patientId↔aiUserId 매핑을 거쳐 프록시한다.

`api-proxy.ts:14`
```typescript
async function resolveAiUserId(patientId: string): Promise<string> {
  // Patient(uuid) → aiUserId("P001" 등) 변환
  ...
}
```

### 8.2 알림·피드백 라우트

| 라우트 | 메서드 | 파일 |
|--------|--------|------|
| `/api/patients/:id/alerts` | GET/POST/PATCH | `routes/alerts.ts` |
| `/api/patients/:id/conversations/:cid/feedback` | POST | `routes/feedback.ts` |
| `/api/patients/:id/pending-knowledge` | GET/POST/PATCH | `routes/pending-knowledge.ts` |
| `/api/patients/:id/ai/conversations/sessions/:sid` | GET (proxy) | `routes/ai-proxy.ts:147` |
| `/api/patients/:id/ai/memory-photos/...` | GET/POST (proxy) | `routes/ai-proxy.ts` |

**알림 흐름**: AI 서버가 위기 감지 시 `caregiver_webhook.py`로 `POST /api/patients/<aiUserId>/alerts {level:"emergency", message}` 발사 → `alerts.ts:31`이 aiUserId/UUID 둘 다 시도하여 `Alert` 노드 생성 + `Patient -[:HAS_ALERT]-> Alert` → 보호자 앱 `useAlerts()`가 30초 간격 폴링하여 표시.

**피드백 흐름** (`routes/feedback.ts:38`): 보호자가 5점 평가 + 코멘트 제출 → `dissatisfied`인 경우 `pushAvoidanceTopics()` (line 16)이 코멘트를 쉼표로 분리해 `POST /avoidance` 로 AI 서버에 fire-and-forget 전송 → AI 서버 `avoidance_store`에 누적되어 다음 retrieval부터 회피.

### 8.3 API 인증 방식 — JWT (HS256, 7일 만료)

`caregiver/artifacts/api-server/src/middlewares/auth.ts:25`
```typescript
export function requireAuth(req, res, next): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required. Provide a Bearer token." });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.caregiverId = decoded.caregiverId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}
export function generateToken(caregiverId, email): string {
  return jwt.sign({ caregiverId, email }, JWT_SECRET, { expiresIn: "7d" });
}
```

비밀번호는 `bcryptjs` saltRounds 적용 후 Neo4j `Caregiver` 노드에 저장. 환자-보호자 매핑은 `Caregiver -[:CARES_FOR]-> Patient` 관계로 표현.

### 8.4 caregiver-app (Expo) 구조

`caregiver/artifacts/caregiver-app/app/_layout.tsx:30 RootLayoutNav()` — 토큰이 없으면 `LoginScreen`, 있으면 Stack 라우팅.

탭 구조 (`app/(tabs)/_layout.tsx`):

| 탭 | 화면 | 주요 데이터 훅 |
|----|------|---------------|
| 홈 | `(tabs)/index.tsx` (396 LOC) | `usePatients`, `useAlerts(unreadOnly=true)`, `useConversations` |
| 대화내역 | `(tabs)/conversations.tsx` | `useConversations` (월별 그룹) |
| 기억정보 | `(tabs)/knowledge.tsx` (396 LOC) | `useKnowledgeItems`, `usePendingKnowledge`, 승인/거절 |
| 알림 | `(tabs)/alerts.tsx` | `useAlerts` (refetchInterval 30s) |

모달: `feedback/[conversationId].tsx`, `knowledge/add.tsx`, `knowledge/[id].tsx`, `patient/add.tsx`, `photos/index.tsx`.

`hooks/useApi.ts` (434 LOC, Top-5 모듈)가 모든 API 훅을 React Query로 래핑하고 `useConversations`은 AI 프록시 응답을 정규화한다:

```typescript
export function useConversations(patientId: string | null) {
  return useQuery({
    queryKey: ["ai-conversations", patientId],
    queryFn: async () => {
      const res = await apiFetch<{ items: AiSessionItem[] }>(
        `/patients/${patientId}/ai/conversations/sessions`);
      return res.items.map<Conversation>((s) => ({
        id: s.session_id, patientId: patientId ?? "",
        sessionDate: aiTsToIso(s.last_at), summary: s.preview,
        feedbackSubmitted: false, messageCount: s.message_count,
        createdAt: aiTsToIso(s.first_at),
      }));
    },
    enabled: patientId !== null,
  });
}
```

`AuthContext` (AsyncStorage 영속) + `PatientContext` (선택 환자 ID 전역 공유)로 상태 관리.

별도 `caregiver/artifacts/patient-web/` (Capacitor 기반 환자용 React PWA, App.tsx 1,177 LOC)가 모바일 앱 빌드용으로 동작하며, `caregiver/artifacts/mockup-sandbox/`는 shadcn/ui 컴포넌트 풀로 재사용된다.

---

## 9. 코드 통계

### 9.1 언어별 파일 수·라인 수 (venv·node_modules·gradio 제외)

| 언어 | 파일 수 | 총 LOC (작성 코드) |
|------|--------|---------------------|
| Python | 54 | **11,732** (ai-server 전체) |
| TypeScript (.ts) | 68 | api-server 라우트·미들웨어·zod/spec/client 라이브러리 포함 |
| TSX (.tsx) | 87 | caregiver-app 화면, patient-web SPA, mockup-sandbox UI |
| JavaScript | 약 7개 (자체) | **6,041** (`ai-server/web/*`) — 706건은 venv 내부 gradio 자산이 압도적이라 자체 코드만 보면 7개 |
| HTML | 자체 4개 | `patient.html`, `index.html`, `expo-go.html`, `patient-react/index.html` |
| CSS | 자체 2개 | `patient.css` (914 LOC), `styles.css` (460 LOC) |

> 메모: 단순 `find`로 잡으면 JS 706 / TS+TSX 155 가 나오는데, 그중 대부분(JS)은 `ai-server/.venv` 안에 들어 있는 Gradio 빌드 산출물이다. 위 표는 **자체 작성** 코드만 추린 수치다.

### 9.2 가장 큰 모듈 Top 3

| 순위 | 파일 | LOC | 역할 |
|------|------|-----|------|
| 1 | `ai-server/app/main.py` | **1,638** | FastAPI 라우트 통합 — `/chat`, `/stt`, `/stt-chat`, `/stt-chat/stream` (SSE), `/ws/patient`, `/tts`, `/proactive-event`, `/avoidance`, `/extract-knowledge` 등 모든 HTTP 진입 |
| 2 | `caregiver/artifacts/patient-web/src/App.tsx` | **1,177** | Capacitor 기반 환자용 보조 PWA (모바일 빌드) — 음성 UI 통합 |
| 3 | `ai-server/app/services/auradb_memory.py` | **953** | Neo4j AuraDB 그래프 인터페이스 — Cypher 쿼리, EchoRoute 라우팅, persona/photo/entity CRUD 일체 |

다음 그룹(Top 4-10): `react-shader-toy.tsx` 963 LOC (Jarvis-orb 셰이더), `agent.py` 633, `loop.py` 497, `dialect.py` 414, `llm.py` 404, `retrieval.py` 320.

---

## 차별점 후보

학술·기술적으로 어필할 만한 다섯 가지 포인트.

### 1. **이원 그래프 + EchoRoute 동적 라우팅**
회상요법은 "현재 일상 정보(약, 식사, 루틴)"와 "과거 정체성(가족, 직업, 추억)"을 다르게 다뤄야 한다. `auradb_memory.py:50`의 `_MODE_GRAPH_POLICY`는 4가지 대화 모드별 가중치를 사전 등록하고, `_compute_graph_weights()` (line 540)는 쿼리 임베딩과 두 그래프 프로토타입 벡터의 코사인을 softmax(τ=0.15)로 풀어 hint prior(α=0.35)와 블렌딩한다. **회상요법 도메인 지식을 "두 그래프 가중치"라는 실수 벡터로 환원해 학습 가능한 형태로 만든 것**이 차별점.

### 2. **다층 안전망 (분류 → 가이드 주입 → 출력 필터 → 위기 webhook)**
LLM에 "위험한 말 하지 마"라고 시키는 게 아니라, ① 입력을 5종 분류(`input_classifier.py`), ② 분류별 system prompt 가이드를 동적 주입(`build_guidance_for_result`), ③ 출력에서 금지 정규식·치환 테이블 적용(`output_filter.py`), ④ 위기 키워드 감지 시 LLM 우회 + 보호자 webhook(`safe_reply` crisis_guardrail). **회상요법 임상 가이드(노 액션 26p)를 코드 레벨로 그대로 옮긴 것**이 임상-공학 융합의 증거.

### 3. **보호자 휴먼-인-더-루프 동적 메모리 학습**
LLM 환각이 그래프를 오염시키지 않도록 "감지 → 자연 재확인 → PendingKnowledge 큐 → 보호자 승인 → 구조화 추출 → GraphEntity 생성"의 5단계 파이프라인을 거친다 (`new_knowledge_detector.py` → `knowledge_confirmation.py` → `pending-knowledge.ts:60` → `:171` → `knowledge_extractor.py:53`). **자율 학습과 인간 검증의 분리**라는 책임 분담 모델은 의료 도메인 LLM 시스템에서 의미 있는 패턴.

### 4. **버튼 우선 + 모델 보조 EOU**
LiveKit turn-detector(SmolLM2-135M)를 도입했지만 매크로 키보드 버튼을 1차 트리거로 두는 결정 (`loop.py:244 "end_turn"`). 이는 **실제 치매 환자 환경에서 음성 모델만 믿었을 때의 false-positive를 인간공학적 입력으로 흡수**한다는 시스템 설계 결정으로, 단순한 "기술 파이프라인" 이상의 사용자 분석을 보여준다.

### 5. **완전 로컬·완전 오픈소스 음성 스택**
STT는 Faster-Whisper large-v3, LLM은 Ollama gemma4:31b + qwen2.5:3b/1.5b 분업, TTS는 Supertonic 2 → XTTS v2 → MMS → Edge 폴백 체인, 임베딩은 BGE-M3 (`requirements.txt`, `tts.py:23`, `config.py`). **클라우드 API 호출이 0이라 의료 데이터가 외부로 나가지 않는다** — 개인정보보호법·HIPAA 관점에서 강력한 셀링 포인트이며, H200 GPU 1대로 STT/LLM/TTS/임베딩을 모두 돌리는 자원 분배 설계 자체가 시스템 엔지니어링 성과.
