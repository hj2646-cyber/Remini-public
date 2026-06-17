# competition/ — 경진대회 산출물

졸업과제(`docs/presentation/`)와 **분리**된 경진대회 전용 폴더.
주제는 동일(치매 환자 AI 대화 + 보호자 모니터링)이지만 제출처·심사 기준·일정이 다르므로 산출물을 섞지 않는다.

## 폴더 구조

```
competition/
├── README.md            # 이 파일
├── submissions/         # 제출서류, 신청서, 사업계획서, 공모전 양식
├── presentation/        # 경진대회용 PPT/슬라이드 (졸업 발표와 별개)
└── planning/            # 일정, 마감일, 체크리스트, 심사 기준 메모
```

## 졸업과제 자료와의 관계

- **분리 (참조만)** — 졸업과제의 실험 로그·결과·방법론 자료는 `docs/presentation/` 에 그대로 둔다.
- 경진대회 자료가 졸업과제 결과를 인용할 때는 **경로만 참조**, 사본을 만들지 않는다.
  - 예: `docs/presentation/RESULTS.md` 의 fine-tune 표를 인용하고 싶으면 → 경진대회 PPT 에 표 일부만 발췌, 출처를 `docs/presentation/RESULTS.md` 로 표기
- 졸업과제 메인 인수인계 파일(`docs/PROGRESS.md`, `docs/FEATURES.md`, `docs/presentation/NEXT_SESSION.md`)은 **건드리지 않는다**.

## 작업 규칙

- 경진대회 관련 새 파일은 무조건 이 폴더 안에.
- 어떤 파일이 경진대회용인지 졸업과제용인지 애매하면 **사용자에게 질문**.
- 한글 파일명 허용. 단 CSV 는 UTF-8 BOM (`utf-8-sig`) 규칙 동일 적용.
