# Gems 비교군 셋업 가이드 — Remini 시스템 프롬프트 그대로 복제

> 전문가 블라인드 평가용 비교군. 우리 ai-server 의 시스템 메시지 조립을 그대로 Google AI Studio Gems 에 박아 **모델만 교체**한 fair comparison 환경 구축.

## 비교 설계

| 항목 | 우리 시스템 (DSLM) | 비교군 (Gems) |
|---|---|---|
| 모델 | `remini-stage25-book:latest` (Gemma4 31B + Stage 1/2/2.5 LoRA) | Gemini 2.5 Pro/Flash (Gems) |
| 시스템 프롬프트 | `llm.py` SYSTEM_PROMPT | **동일** (`01_instruction.md`) |
| 도메인 위키 | `docs/wiki/00~06` 자동 로딩 | **동일** (`02_knowledge_wiki.md` Knowledge 첨부) |
| 환자 KG (P001) | AuraDB 동적 retrieval | **정적 통째 주입** (Instruction 안에 포함) |
| 사투리 | P001 = standard (미적용) | 미적용 (동일) |
| 환자 발화 | 사용자가 직접 (controlled) | 사용자가 직접 (controlled — 동일 발화 시퀀스로 진행) |

## Google AI Studio Gems 셋업 단계

1. https://aistudio.google.com 접속 (Gemini account 로그인)
2. 좌측 사이드바 **"Gems"** 메뉴 → **"+ Create new Gem"**
3. **"Instructions"** 입력란:
   - `01_instruction.md` 파일 열어서 `===시작===` 부터 `===끝===` 사이 본문을 그대로 복사 붙여넣기 (`===` 마커는 제외)
4. **"Knowledge"** 섹션 (있으면) 또는 **"Files"** 첨부:
   - `02_knowledge_wiki.md` 파일 그대로 업로드
   - 만약 Gems UI 에 Knowledge 첨부 기능이 없으면, `02_knowledge_wiki.md` 본문을 Instructions 입력란 끝에 통째로 붙여넣어도 됨 (총 ~60K chars / ~15K tokens — Gems 한도 내)
5. **모델 선택**: Gemini 2.5 Pro 권장 (Flash 도 가능, 더 빠르고 무료 한도 넉넉)
6. **저장** → Gem 활성화

## 평가 세션 진행

7. 새 채팅에서 활성화된 Gem 선택
8. 사용자가 "환자 김영자" 역할로 발화 입력 — Gem 응답 받음 — 다음 발화 입력 — ... 반복
9. **DSLM 평가와 동일하게 30 round-trip** (환자 30 + AI 30 = 60 발화) 진행
10. 채팅 로그 추출 → `expert_eval_gems_P001.md` 로 저장

## 시드 정렬 (controlled comparison 위해)

- **시작 환자 발화**: "안녕하세요" (DSLM 세션 T1과 동일)
- 그 후 자연 흐름. DSLM 과 정확히 같은 발화 안 해도 됨 — 같은 페르소나·같은 시드·동일 길이가 통제 변수.
- 가능하면 **사용자가 두 모델 다 본인이 환자 역할** = 환자 발화 일관성 ↑

## 블라인드 처리

- 두 로그를 전문가 배포 전 **모델명·세션 ID 마스킹** (예: `Model A` / `Model B` 로 라벨 변경, 순서 무작위)
- 평가지 14항목 동일 채점

## 파일 목록

- `README.md` — 본 가이드
- `01_instruction.md` — Gems Instructions 입력란용 (시스템 프롬프트 본문 + P001 페르소나 list + KG 참조 명령)
- `02_knowledge_wiki.md` — Knowledge 첨부 1 (회상요법 wiki 6개 합본, 88KB)
- `03_kg_persona_P001.json` — Knowledge 첨부 2 (P001 1-hop KG export — Neo4j 같은 구조의 정적 페르소나 데이터)

## Knowledge 두 파일 다 첨부

Gems "지식" 섹션의 `+` 버튼으로 **두 파일 모두 업로드**:
1. `02_knowledge_wiki.md` — 회상요법 도메인 위키
2. `03_kg_persona_P001.json` — 환자 페르소나 KG

Instruction 안의 `[지식 그래프 — 무조건 참조]` 섹션이 모델에게 매 응답 전 JSON 을 참조하도록 강제합니다.
