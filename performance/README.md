# `performance/` — 시연영상용 진화 단계 토글판

> **목적**: 시연 영상 촬영 시, 본 시스템의 발전 과정을 5단계로 재현. **본 시스템 (`ai-server/`, port 8000) 은 절대 안 건드림.**

## 핵심 한 줄

`config.yaml` 에서 `active_preset: 1~5` 한 줄만 바꾸고 `bash restart.sh` → 환자 UI 가 그 시점의 모습으로 전환.

---

## 빠른 시작

```bash
# 1. 시연판 시작 (port 8100)
bash performance/start.sh

# 2. 환자 화면 열기
#    http://<SERVER_IP>:8100/static/patient.html

# 3. preset 바꾸기 — config.yaml 의 active_preset 만 수정 (1, 2, 3, 4, 5)
#    vim performance/config.yaml   # 또는 그냥 편집기로
bash performance/restart.sh

# 4. 종료
bash performance/stop.sh
```

---

## 5 preset 요약

| # | UI 배경 | LLM | 회상요법 | STT 오류허용 | 사진 |
|---|--------|-----|---------|------------|------|
| 1 | 검정 | gemma4:31b | OFF | OFF | OFF |
| 2 | 검정 | gemma4:31b | OFF | **ON** | OFF |
| 3 | 검정 | gemma4:31b | full + "그렇군요" 강제 | ON | OFF |
| 4 | 검정 | stage26 | full | ON | OFF |
| 5 | 검정 | stage26 | full | ON | **ON (상단 200px)** |

촬영 대본은 `SCENARIOS.md` 참고.

---

## 폴더 구조

```
performance/
├── config.yaml          # ← 여기 한 줄만 바꿈
├── load_preset.py       # config → 환경변수 변환기
├── start.sh / stop.sh / restart.sh
├── .env -> ../.env      # 본 시스템 .env symlink (Neo4j·embedding 공유)
├── logs/                # 시연판 로그
└── ai-server/           # 코드 복사본 + 분기 추가
    ├── app/             # llm.py, agent.py, main.py 에 _perf 분기
    │   └── services/performance_flags.py  # 환경변수 → 토글
    ├── web/             # patient.html 토글 로직 + dark.css + ui-config.js
    ├── .venv -> ../../ai-server/.venv     # 본 시스템 venv 공유
    ├── data -> ../../ai-server/data       # 사진·DB 공유 (읽기만)
    ├── models -> ../../ai-server/models   # whisper·embedding 공유
    └── conversations.db -> ../../ai-server/conversations.db
```

**디스크 점유 거의 0** — 무거운 건 다 symlink 공유.

---

## 토글 동작 원리

`config.yaml` → `load_preset.py` 가 두 가지 생성:
1. **환경변수 export 문** (stdout) — `start.sh` 가 `eval` 로 셸에 적용
2. **`ai-server/web/ui-config.js`** — frontend 가 즉시 읽음 (`window.__PERF_CONFIG`)

ai-server 코드는 `app/services/performance_flags.py` 통해 환경변수 읽음:

| YAML 키 | 환경변수 | 적용 위치 |
|--------|---------|----------|
| `llm_model` | `OLLAMA_MODEL` | `app/config.py` settings (자동 override) |
| `reminiscence_therapy` | `PERF_REMINISCENCE_THERAPY` | `llm.py` SYSTEM_PROMPT + wiki gate |
| `force_geuleogunyo` | `PERF_FORCE_GEULEOGUNYO` | `llm.py` prompt suffix |
| `stt_robust` | `PERF_STT_ROBUST` | `agent.py` `reconstruct_from_fragments` |
| `reminiscence_photo` | `PERF_REMINISCENCE_PHOTO` | `agent.py` + `main.py` `maybe_trigger` |
| `ui_theme` | (ui-config.js) | `patient.html` cascading link |
| `photo_card` | (ui-config.js) | `patient.html` body class |

---

## 본 시스템 안 건드린다는 보장

- `ai-server/app/`, `ai-server/web/`: 복제만, **수정 X**
- `ai-server/.env`: symlink 로 공유하지만 `start.sh` 가 환경변수 export 로 PORT/OLLAMA_MODEL override → 본 시스템은 본인 값 그대로 사용
- Neo4j Aura: 둘 다 같은 DB 사용. **시연판은 KG 에 쓰기 X**(자동 새 지식 worker 가 발사하긴 하지만 PendingKnowledge 라 보호자 승인 전엔 KG 미반영). 안전.
- conversations.db: symlink. 시연판 대화도 동일 DB 에 쌓임. 부담스러우면 별도 DB 만들기 (`unlink conversations.db && cp ../../ai-server/conversations.db .`).

---

## 트러블슈팅

`SCENARIOS.md` 끝의 트러블슈팅 섹션 참고.

---

## 영상 다 찍은 뒤

1. `bash performance/stop.sh`
2. 폴더 통째로 보존 — `docs/presentation/` 에 영상 파일과 함께 보관 권장
3. (선택) 필요 없어지면 `rm -rf performance/` (본 시스템 영향 0)
