# 발표 자료 소스 폴더

> 캡스톤 발표·논문 작성에 사용할 모든 실험 기록의 단일 소스.
> 모든 시도·결과·교훈 (성공·실패 무관) 을 시간순으로 누적 기록.

## 폴더 구조

```
docs/presentation/
├── README.md             # 이 파일 — 가이드 + 인덱스
├── NEXT_SESSION.md       # ⭐ 다음 세션 인계 (현재 상태 + 다음 액션)
├── EXPERIMENTS_LOG.md    # 시간순 시도 일지 (성공·실패·교훈 모두) ← 메인
├── RESULTS.md            # 수치 결과 요약 (Phase 1 RAGAS, Phase 2 설문형 LLM-as-Judge, Safety)
├── FAILURES.md           # Negative result 모음 — 발표용 발췌
├── LESSONS.md            # 교훈 정제 — 슬라이드 핵심 메시지
├── IDEAS.md              # 시도한 아이디어 + 사용자 체크 모음 (의사결정 근거)
├── TECH_STACK.md         # 기술 스택 (모델/DB/툴) + 채택/보류 근거
├── FINETUNE_BRANCHES.md  # 7 Stage 학습 plan + 데이터 매핑
├── H2_LLM_AS_JUDGE_SURVEY_PPT_SUMMARY.md # H2 설문형 LLM-as-Judge 발표 요약
├── H2_PHASE2_RUN_GUIDE.md # H2 실행 순서와 산출물
├── SLIDE_OUTLINE.md      # 슬라이드 아우트라인 (목차 + 각 슬라이드 핵심 한 줄)
├── logs/                 # raw 로그 보존 (학습·평가·에러 등)
├── evidence/             # 비교 파일·검수 결과·차트 등 증거 자료 모음
└── slides/               # 실제 슬라이드 파일 (.pptx, .pdf, ...)
```

## 기록 규칙 (필수)

1. **새 시도 시작 시**: `EXPERIMENTS_LOG.md` 에 시간 + 시도 내용 즉시 기록 (예상 결과·동기 포함).
2. **결과·실패 발생 시**: 해당 시도 항목에 결과·원인·교훈 즉시 추가.
3. **솔직히 기록**: 실패도 빠짐없이. 학술 발표에서 negative result 가 종종 가장 강한 contribution.
4. **발표 가능한 인사이트** (놀라운 결과·예상 외 발견·학술 가치 있는 패턴) 는 `LESSONS.md` 에 별도 정제.
5. **수치는 그래프로**: 가능하면 차트·표 만들어 `evidence/` 에 저장.

## 자동 누적 흐름

agent (Claude) 가 실험 단계 진행 시:
- 학습·평가 시작 → `EXPERIMENTS_LOG.md` 에 항목 추가
- 학습 완료 → train_loss·eval_loss 기록
- 결과 비교 → `RESULTS.md` 표 업데이트
- 예상 외 패턴 발견 → `FAILURES.md` 또는 `LESSONS.md` 추가

이 폴더는 발표 직전에 **건드리지 않고도 그대로 발췌해서 슬라이드** 가능해야 함.
