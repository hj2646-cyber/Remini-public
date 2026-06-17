"""
분당서울대병원 『기억여행』 4권 96 토픽 — keyword 매칭 + 책 표준 질문 DB.

사용자가 폴더에 드롭한 사진 파일명 (예: "개나리.jpg") 을 책 토픽 표제와 매칭하면,
LLM 에게 책 표제 + 책의 표준 회상 질문을 직접 주입해 사진별 특정 회상 유도 가능.

매칭은 단순 substring (파일명 키워드 in 토픽 keywords or 토픽 title in 파일명).
책 표준 질문 일부는 OCR 정제 텍스트 (book_extracts/05_memory_journey_4seasons.txt) 에서 추출.
나머지는 generic 패턴 — 토픽 표제 기반 1H 질문 자동 생성.
"""
from __future__ import annotations

from typing import TypedDict


class BookTopic(TypedDict, total=False):
    id: str
    season: str
    title: str  # 책 표제
    keywords: list[str]  # 사용자 파일명 매칭용
    std_questions: list[str]  # 책 표준 질문 (정제된 것만)


TOPICS: list[BookTopic] = [
    # ─────────── 봄 24 ───────────
    {"id": "B01", "season": "spring", "title": "봄을 노랗게 물들이는 개나리",
     "keywords": ["개나리"],
     "std_questions": [
         "봄에 많이 피는 노란색 꽃으로 이름이 '개'로 시작하는 꽃은 무엇이지요?",
         "봄에 활짝 핀 개나리를 본 적이 있으세요?",
         "개나리를 꺾어 집에 가져가본 적이 있으세요?",
         "개나리가 핀 거리를 걷는 것을 좋아하셨어요?",
     ]},
    {"id": "B02", "season": "spring", "title": "쫄깃쫄깃 푸른 쑥개떡",
     "keywords": ["쑥개떡", "쑥떡"],
     "std_questions": [
         "봄에 쑥떡을 먹어본 적이 있으시죠?",
         "쑥떡을 좋아하셨어요? 얼마나 자주 드셨어요?",
         "쑥을 캐기 위해 산이나 밭에 가본 적이 있으세요?",
     ]},
    {"id": "B03", "season": "spring", "title": "태극기 휘날리는 삼일절",
     "keywords": ["삼일절", "태극기", "3.1운동", "1.2.3운동"],
     "std_questions": [
         "삼일절은 몇 월 며칠인가요?",
         "삼일절은 무엇을 기념하는 날인가요?",
         "삼일절에 태극기를 달아보신 적이 있으세요?",
     ]},
    {"id": "B04", "season": "spring", "title": "뒤집혀라 딱지치기",
     "keywords": ["딱지"],
     "std_questions": [
         "딱지치기를 해본 적이 있으세요?",
         "어린 시절 딱지치기를 잘 하시는 편이셨어요?",
         "딱지를 무엇으로 만들어 보셨어요?",
     ]},
    {"id": "B05", "season": "spring", "title": "아들 딸 구별말고 둘만 낳아 잘 기르자",
     "keywords": ["가족계획", "산아제한", "5.10선거포스터"],
     "std_questions": [
         "가족계획 벽보를 본 적 있으세요?",
         "어르신께서는 슬하에 몇 분의 자녀를 두셨어요?",
     ]},
    {"id": "B06", "season": "spring", "title": "마을의 물을 책임지던 우물",
     "keywords": ["우물", "마중물"],
     "std_questions": [
         "어릴 적에 우물에서 물을 자주 길어다 드셨어요?",
         "집안에서 물 긷는 심부름은 주로 누가 했었어요?",
         "우물에서 두레박을 놓쳐본 적은 없으세요?",
     ]},
    {"id": "B07", "season": "spring", "title": "따르르릉 반가운 전화",
     "keywords": ["전화기", "전화"],
     "std_questions": [
         "다이얼식 전화기로 전화를 걸어보신 적이 있으시죠?",
         "어린 시절 집에서 사용하던 전화기를 기억하세요?",
         "전화교환원을 기억하세요? 어떤 역할을 했었나요?",
     ]},
    {"id": "B08", "season": "spring", "title": "행운의 네잎 클로버",
     "keywords": ["네잎클로버", "클로버"],
     "std_questions": [
         "네잎 클로버를 본 적이 있으세요?",
         "잔디밭에서 네잎 클로버를 찾으려고 오랜 시간을 보낸 적이 있으세요?",
         "네잎 클로버를 책 사이에 꽂아둔 적이 있으세요?",
     ]},
    {"id": "B09", "season": "spring", "title": "산에 들에 울긋불긋 진달래",
     "keywords": ["진달래"],
     "std_questions": [
         "진달래꽃을 좋아하셨어요?",
         "어르신께서 살던 동네에는 주로 어디에 진달래꽃이 피어 있었어요?",
         "진달래꽃으로 만든 화전을 드셔본 적이 있으세요?",
     ]},
    {"id": "B10", "season": "spring", "title": "향긋하고 고소한 나물 비빔밥",
     "keywords": ["비빔밥", "나물"],
     "std_questions": [
         "비빔밥을 드셔본 적이 있으시죠?",
         "비빔밥을 맛있게 만드는 비법을 알려주실래요?",
         "비빔밥은 어떤 국과 먹을 때 가장 맛있었어요?",
     ]},
    {"id": "B11", "season": "spring", "title": "사랑을 약속하는 결혼식",
     "keywords": ["결혼식", "결혼"],
     "std_questions": [
         "결혼식장에 가본 적이 있으세요?",
         "가장 기억에 남는 결혼식에 대해 말씀해 보세요.",
         "함 팔기를 본 적이 있으세요? 어떤 풍경이었어요?",
     ]},
    {"id": "B12", "season": "spring", "title": "내가 바로 제기차기 대장",
     "keywords": ["제기차기", "제기"],
     "std_questions": [
         "제기차기를 해본 적이 있으세요?",
         "어린 시절에 제기차기를 잘 하셨어요?",
         "제기를 무엇으로 만들었었나요?",
     ]},
    {"id": "B13", "season": "spring", "title": "색시야 색시야 여로",
     "keywords": ["여로"],
     "std_questions": [
         "1970년대 온 국민이 좋아한 '여로'를 본 적이 있으세요?",
         "'여로'의 줄거리를 기억하세요?",
         "'여로'에 나온 배우 이름 (장욱제·태현실 등) 기억나세요?",
     ]},
    {"id": "B14", "season": "spring", "title": "다듬이질 그 청아한 소리",
     "keywords": ["다듬이질", "다듬이"],
     "std_questions": [
         "어머니께서 다듬이질 하시던 모습을 본 적이 있으세요?",
         "방망이로 직접 다듬이질을 해본 적이 있으세요?",
         "풀을 먹인 천의 냄새와 촉감은 어땠어요?",
     ]},
    {"id": "B15", "season": "spring", "title": "영차 물건을 싣던 지게",
     "keywords": ["지게"],
     "std_questions": [
         "지게로 물건을 옮겨본 적이 있으세요?",
         "어떤 물건을 지게로 운반했어요?",
     ]},
    {"id": "B16", "season": "spring", "title": "개굴개굴 개구리",
     "keywords": ["개구리"],
     "std_questions": [
         "어릴 때 개구리를 잡아본 적이 있으세요?",
         "개구리 울음소리 들으면 무슨 생각이 나세요?",
     ]},
    {"id": "B17", "season": "spring", "title": "봄 눈처럼 흩날리던 벚꽃",
     "keywords": ["벚꽃"],
     "std_questions": [
         "벚꽃 구경을 가본 적이 있으세요?",
         "벚꽃 흩날리던 풍경 중 가장 기억에 남는 곳은 어디예요?",
     ]},
    {"id": "B18", "season": "spring", "title": "옛다 가위 옛날 광고",
     "keywords": ["옛다가위", "옛날광고"],
     "std_questions": [
         "옛날 거리 노점 상인들 외치던 소리 기억나세요?",
     ]},
    {"id": "B19", "season": "spring", "title": "코흘리개 처음 학교 가던 날",
     "keywords": ["입학", "초등학교", "교복"],
     "std_questions": [
         "처음 학교 가던 날을 기억하세요?",
         "입학식 때 어떤 옷을 입으셨어요?",
         "처음 만난 선생님이나 친구 기억나세요?",
     ]},
    {"id": "B20", "season": "spring", "title": "돌아라 돌아라 팽이",
     "keywords": ["팽이", "팽이치기"],
     "std_questions": [
         "팽이를 돌려 본 적이 있으세요?",
         "어렸을 때 팽이를 잘 돌리셨어요?",
     ]},
    {"id": "B21", "season": "spring", "title": "축음기로 노래를 처음 들었던 때",
     "keywords": ["축음기"],
     "std_questions": [
         "축음기로 노래 들으신 기억이 있으세요?",
         "어떤 노래를 가장 자주 들으셨어요?",
     ]},
    {"id": "B22", "season": "spring", "title": "구두 닦아 드려요",
     "keywords": ["구두닦이"],
     "std_questions": [
         "거리에서 구두를 닦아주는 사람을 본 적 있으세요?",
     ]},
    {"id": "B23", "season": "spring", "title": "한 땀 한 땀 바느질",
     "keywords": ["바느질"],
     "std_questions": [
         "어머니께서 바느질하시는 모습을 본 적이 있으세요?",
         "직접 바느질을 해본 적이 있으세요?",
     ]},
    {"id": "B24", "season": "spring", "title": "옛날엔 십원으로 할 수 있는 일이 많았는데",
     "keywords": ["십원", "10원"],
     "std_questions": [
         "옛날에 십원으로 무엇을 살 수 있었어요?",
         "어렸을 때 용돈을 얼마 받으셨어요?",
     ]},

    # ─────────── 여름 24 ───────────
    {"id": "S01", "season": "summer", "title": "장맛비 그 시원한 소리",
     "keywords": ["장맛비", "장마"],
     "std_questions": [
         "여름에 비가 많이 내리는 철을 무엇이라 하지요?",
         "비 오는 날을 좋아하셨어요?",
         "우산이 없어서 비를 흠뻑 맞아본 적이 있으세요?",
     ]},
    {"id": "S02", "season": "summer", "title": "원두막에서 한입 가득 베어먹던 수박",
     "keywords": ["수박"],
     "std_questions": [
         "여름에 많이 먹는 과일로 두 글자 단어인 이 과일은 무엇일까요?",
         "수박을 좋아하셨어요?",
         "원두막에서 수박 드신 적이 있으세요?",
     ]},
    {"id": "S03", "season": "summer", "title": "비극적인 민족의 역사 6.25",
     "keywords": ["6.25", "한국전쟁", "전쟁", "마라톤", "군대", "군복"],
     "std_questions": [
         "6.25 전쟁이 일어난 해를 기억하세요?",
         "전쟁 당시 어디에 계셨어요?",
     ]},
    {"id": "S04", "season": "summer", "title": "구슬치기 잘 하셨나요",
     "keywords": ["구슬", "구슬치기"],
     "std_questions": [
         "구슬치기를 해본 적이 있으세요?",
         "구슬치기 잘 하셨어요?",
     ]},
    {"id": "S05", "season": "summer", "title": "간첩은 휴전 없다",
     "keywords": ["간첩", "반공"],
     "std_questions": [
         "반공 포스터 본 적 있으세요?",
     ]},
    {"id": "S06", "season": "summer", "title": "빨간 공중전화 요즘은 안 보이네요",
     "keywords": ["공중전화", "빨간전화"],
     "std_questions": [
         "공중전화를 사용해 본 적이 있으세요?",
         "공중전화로 누구한테 가장 자주 전화하셨어요?",
     ]},
    {"id": "S07", "season": "summer", "title": "물 펌프질 해보셨어요",
     "keywords": ["펌프", "물펌프"],
     "std_questions": [
         "물 펌프질을 해보셨어요?",
         "마중물을 부어본 기억이 나세요?",
     ]},
    {"id": "S08", "season": "summer", "title": "하얀 줄무늬가 있는 노란 참외",
     "keywords": ["참외"],
     "std_questions": [
         "참외 좋아하셨어요?",
         "어릴 때 참외밭에 가본 적 있으세요?",
     ]},
    {"id": "S09", "season": "summer", "title": "파도가 부서지는 바닷가",
     "keywords": ["바다", "바닷가", "해수욕장"],
     "std_questions": [
         "바닷가에 가본 적 있으세요?",
         "여름에 가장 기억에 남는 바닷가는 어디예요?",
     ]},
    {"id": "S10", "season": "summer", "title": "팥과 얼음의 만남 팥빙수",
     "keywords": ["팥빙수", "빙수", "얼음", "단팥죽"],
     "std_questions": [
         "팥빙수 드셔보셨어요?",
         "여름 더울 때 어떤 디저트를 즐겨 드셨어요?",
     ]},
    {"id": "S11", "season": "summer", "title": "대한 독립 만세",
     "keywords": ["광복절", "독립"],
     "std_questions": [
         "광복절은 무엇을 기념하는 날인가요?",
     ]},
    {"id": "S12", "season": "summer", "title": "떴다 떴다 종이비행기",
     "keywords": ["종이비행기", "비행기"],
     "std_questions": [
         "종이비행기 접어보셨어요?",
         "어떤 종이로 비행기 접으셨어요?",
     ]},
    {"id": "S13", "season": "summer", "title": "얼마나 울었던가 동백아가씨",
     "keywords": ["동백아가씨"],
     "std_questions": [
         "이미자의 '동백아가씨'를 들어보신 적이 있으세요?",
     ]},
    {"id": "S14", "season": "summer", "title": "빨래판에 쓱싹쓱싹 손빨래하기",
     "keywords": ["빨래판", "빨래", "빨래질"],
     "std_questions": [
         "빨래판에 손빨래하셨어요?",
         "빨래는 어디서 했어요?",
     ]},
    {"id": "S15", "season": "summer", "title": "돌고 도는 물레방아",
     "keywords": ["물레방아"],
     "std_questions": [
         "물레방아 본 적 있으세요?",
     ]},
    {"id": "S16", "season": "summer", "title": "선녀들이 건너간 오색다리 무지개",
     "keywords": ["무지개"],
     "std_questions": [
         "무지개를 가장 인상 깊게 본 곳이 어디예요?",
     ]},
    {"id": "S17", "season": "summer", "title": "맴맴 여름을 알리는 매미",
     "keywords": ["매미"],
     "std_questions": [
         "매미 잡아본 적 있으세요?",
         "매미 울음소리 들으면 무슨 생각이 나세요?",
     ]},
    {"id": "S18", "season": "summer", "title": "값싸고 시원한 냉면이요",
     "keywords": ["냉면"],
     "std_questions": [
         "냉면 좋아하셨어요?",
         "함흥 냉면, 평양 냉면 어떤 게 더 입맛에 맞으세요?",
     ]},
    {"id": "S19", "season": "summer", "title": "배가 남산만 해졌네요",
     "keywords": ["임신", "출산"],
     "std_questions": [
         "자녀를 가지셨을 때 어떤 기분이셨어요?",
     ]},
    {"id": "S20", "season": "summer", "title": "폴짝 폴짝 신나던 고무줄뛰기",
     "keywords": ["고무줄놀이", "고무줄뛰기", "고무줄"],
     "std_questions": [
         "고무줄놀이 해보셨어요?",
         "어떤 노래 부르며 고무줄놀이 하셨어요?",
     ]},
    {"id": "S21", "season": "summer", "title": "하얀 가운 이발사의 가위질 소리",
     "keywords": ["이발", "이발사", "이발소"],
     "std_questions": [
         "이발소에 자주 가셨어요?",
         "어떤 머리 모양 즐겨 하셨어요?",
     ]},
    {"id": "S22", "season": "summer", "title": "놓칠세라 쫓아다니던 방역차 하얀 꼬리",
     "keywords": ["방역차", "방역"],
     "std_questions": [
         "어릴 때 방역차 쫓아다닌 적 있으세요?",
     ]},
    {"id": "S23", "season": "summer", "title": "삼륜차 다 어디 갔나요",
     "keywords": ["삼륜차"],
     "std_questions": [
         "삼륜차 타본 적 있으세요?",
     ]},
    {"id": "S24", "season": "summer", "title": "오늘 미역국 드셨나요",
     "keywords": ["미역국"],
     "std_questions": [
         "미역국 좋아하세요?",
         "생일에 미역국 드셨어요?",
     ]},

    # ─────────── 가을 24 ───────────
    {"id": "F01", "season": "autumn", "title": "가을 산을 붉게 물들이는 단풍나무",
     "keywords": ["단풍"],
     "std_questions": [
         "가을이 되면 잎이 빨갛게 변하는 나무는 무엇일까요?",
         "단풍 구경을 하러 산에 놀러 간 적이 있으세요?",
         "단풍이 가장 아름답게 물드는 산은 어느 산이에요?",
     ]},
    {"id": "F02", "season": "autumn", "title": "아삭아삭 새콤달콤 붉은 사과",
     "keywords": ["사과"],
     "std_questions": [
         "사과 좋아하셨어요?",
         "사과 따러 가본 적 있으세요?",
     ]},
    {"id": "F03", "season": "autumn", "title": "88올림픽 마스코트 호돌이",
     "keywords": ["호돌이", "88올림픽", "올림픽"],
     "std_questions": [
         "88올림픽 기억나세요? 어디서 보셨어요?",
         "호돌이 인형 본 적 있으세요?",
     ]},
    {"id": "F04", "season": "autumn", "title": "어디 한번 겨뤄볼까 팔씨름",
     "keywords": ["팔씨름"],
     "std_questions": [
         "팔씨름 해보셨어요?",
         "팔씨름 잘 하셨어요?",
     ]},
    {"id": "F05", "season": "autumn", "title": "추억의 학생 모자",
     "keywords": ["학생모자", "70년대 중학생 모자", "교복", "밀짚모자", "초록 모자", "군밤장수모자"],
     "std_questions": [
         "학창시절 모자 쓰셨어요?",
         "어떤 모양의 모자였어요?",
     ]},
    {"id": "F06", "season": "autumn", "title": "사연으로 가득했던 빨간 우체통",
     "keywords": ["우체통", "우체국", "편지"],
     "std_questions": [
         "우체통에 편지 부쳐본 적 있으세요?",
         "누구한테 편지 자주 쓰셨어요?",
     ]},
    {"id": "F07", "season": "autumn", "title": "아이구 매워 아궁이에 저녁 밥 불을 때면",
     "keywords": ["아궁이", "장작", "가마솥"],
     "std_questions": [
         "아궁이에 불 때본 적 있으세요?",
         "장작은 누가 패셨어요?",
     ]},
    {"id": "F08", "season": "autumn", "title": "눈물나게 매운 고추",
     "keywords": ["고추"],
     "std_questions": [
         "고추 직접 따보셨어요?",
         "매운 고추 잘 드셨어요?",
     ]},
    {"id": "F09", "season": "autumn", "title": "쟁반같이 둥근 보름달",
     "keywords": ["보름달", "달"],
     "std_questions": [
         "보름달 보며 소원 빌어보셨어요?",
         "어디서 보름달 보셨어요?",
     ]},
    {"id": "F10", "season": "autumn", "title": "송편 빚어 보셨나요",
     "keywords": ["송편", "추석"],
     "std_questions": [
         "송편 빚어보셨어요?",
         "어떤 속 넣은 송편 가장 좋아하셨어요?",
     ]},
    {"id": "F11", "season": "autumn", "title": "쑥쑥 잘 자라거라 돌잔치",
     "keywords": ["돌잔치", "돌"],
     "std_questions": [
         "자녀들의 돌잔치는 어떻게 하셨어요?",
         "돌잡이에서 무엇을 잡으셨는지 기억하세요?",
     ]},
    {"id": "F12", "season": "autumn", "title": "옹기종기 둘러앉아 공기놀이",
     "keywords": ["공기놀이", "공기"],
     "std_questions": [
         "공기놀이 해보셨어요?",
         "어디서 공깃돌 주워서 하셨어요?",
     ]},
    {"id": "F13", "season": "autumn", "title": "기억나세요 맨발의 청춘",
     "keywords": ["맨발의청춘"],
     "std_questions": [
         "신성일·엄앵란의 '맨발의 청춘' 보셨어요?",
     ]},
    {"id": "F14", "season": "autumn", "title": "고무신 짝꿍 버선",
     "keywords": ["고무신", "버선"],
     "std_questions": [
         "고무신 신어보셨어요?",
         "버선 신었던 기억이 나세요?",
     ]},
    {"id": "F15", "season": "autumn", "title": "하나 둘 저녁상이 차려지던 부뚜막",
     "keywords": ["부뚜막", "놋그릇", "놋주전자"],
     "std_questions": [
         "부뚜막에서 어머니가 밥 짓던 모습 기억나세요?",
         "놋그릇 사용하셨어요?",
     ]},
    {"id": "F16", "season": "autumn", "title": "언약처럼 굳게 얽혀있던 청실홍실",
     "keywords": ["청실홍실"],
     "std_questions": [
         "전통 혼례 가본 적 있으세요?",
         "함 들어오던 풍경 기억나세요?",
     ]},
    {"id": "F17", "season": "autumn", "title": "하늘하늘 코스모스 가을이네요",
     "keywords": ["코스모스"],
     "std_questions": [
         "코스모스 핀 길 걸어본 적 있으세요?",
     ]},
    {"id": "F18", "season": "autumn", "title": "군밤 사어",
     "keywords": ["군밤"],
     "std_questions": [
         "군밤 사 드신 기억 나세요?",
         "어느 거리에서 군밤 자주 사셨어요?",
     ]},
    {"id": "F19", "season": "autumn", "title": "더도 말고 덜도 말고 한가위만 같아라",
     "keywords": ["한가위", "추석", "달력"],
     "std_questions": [
         "한가위에 가족이 모여 무엇을 하셨어요?",
         "추석에 가장 기억에 남는 음식이 뭐예요?",
     ]},
    {"id": "F20", "season": "autumn", "title": "하늘로 높이 높이 그네",
     "keywords": ["그네"],
     "std_questions": [
         "그네 타보셨어요?",
         "단오에 그네 타본 적 있으세요?",
     ]},
    {"id": "F21", "season": "autumn", "title": "커피 한 잔을 시켜놓고 다방",
     "keywords": ["다방"],
     "std_questions": [
         "다방 가보셨어요?",
         "어떤 음악이 흘러나왔던 기억이 나세요?",
     ]},
    {"id": "F22", "season": "autumn", "title": "오라이 버스 안내양",
     "keywords": ["버스안내양", "안내양"],
     "std_questions": [
         "버스 안내양 본 적 있으세요?",
         "안내양이 외치던 '오라이' 소리 기억나세요?",
     ]},
    {"id": "F23", "season": "autumn", "title": "느릿느릿 도심을 달리던 전차",
     "keywords": ["전차"],
     "std_questions": [
         "전차 타보셨어요?",
     ]},
    {"id": "F24", "season": "autumn", "title": "가을 들판 황금 물결",
     "keywords": ["황금들판", "벼", "모내기"],
     "std_questions": [
         "황금색 벼 들판 본 적 있으세요?",
         "모내기나 추수 해보셨어요?",
     ]},

    # ─────────── 겨울 24 ───────────
    {"id": "W01", "season": "winter", "title": "눈 덮인 하얀 세상",
     "keywords": ["눈", "눈사람"],
     "std_questions": [
         "흰 눈이 펑펑 내리던 날을 기억하세요?",
         "눈사람을 만들어 본 적이 있으세요? 얼마나 큰 눈사람이었어요?",
         "눈싸움 한 적 있으세요?",
     ]},
    {"id": "W02", "season": "winter", "title": "액운을 몰아내는 동지 팥죽",
     "keywords": ["팥죽"],
     "std_questions": [
         "동짓날 팥죽 드셔보셨어요?",
         "팥죽에 들어가는 새알을 빚어본 적이 있으세요?",
     ]},
    {"id": "W03", "season": "winter", "title": "잘 살아보세 새마을운동",
     "keywords": ["새마을운동", "새마을"],
     "std_questions": [
         "새마을 운동을 기억하시죠?",
         "새마을 운동 노랫소리에 맞춰 일어난 적이 있으세요?",
     ]},
    {"id": "W04", "season": "winter", "title": "달려라 달려 바람개비 씽씽",
     "keywords": ["바람개비"],
     "std_questions": [
         "바람개비를 만들어 본 적이 있으시죠?",
         "어떤 재료로 만드셨어요?",
     ]},
    {"id": "W05", "season": "winter", "title": "쥐를 잡읍시다",
     "keywords": ["쥐", "쥐잡기", "쥐를 잡자"],
     "std_questions": [
         "쥐 잡는 캠페인 기억나세요?",
     ]},
    {"id": "W06", "season": "winter", "title": "김장 온 가족의 작은 잔칫날",
     "keywords": ["김장"],
     "std_questions": [
         "한 해 김장을 몇 포기씩 하셨어요?",
         "김장 담그실 때 누구랑 같이 하셨어요?",
         "김장 때 빼놓을 수 없는 음식이 있으셨어요? (보쌈, 무생채 등)",
     ]},
    {"id": "W07", "season": "winter", "title": "옹기종기 장독대",
     "keywords": ["장독대", "장독"],
     "std_questions": [
         "어머니께서 장독대 정리하시던 모습 기억나세요?",
         "장독대에 어떤 장이 있었어요?",
     ]},
    {"id": "W08", "season": "winter", "title": "가을 고향처럼 그리운 초가집",
     "keywords": ["초가집"],
     "std_questions": [
         "초가집에 살아보셨어요?",
         "초가지붕은 어떻게 만드셨어요?",
     ]},
    {"id": "W09", "season": "winter", "title": "처마끝 얼음이 꽁꽁 고드름",
     "keywords": ["고드름", "얼음"],
     "std_questions": [
         "처마 끝에 매달린 고드름 본 적 있으세요?",
         "고드름 떼서 먹어본 적 있으세요?",
     ]},
    {"id": "W10", "season": "winter", "title": "한살 더 먹으려면 떡국은 먹어야지",
     "keywords": ["떡국", "설날"],
     "std_questions": [
         "설날에 떡국 드셨어요?",
         "떡국은 누가 끓여주셨어요?",
     ]},
    {"id": "W11", "season": "winter", "title": "오래오래 사세요 환갑잔치",
     "keywords": ["환갑", "환갑잔치"],
     "std_questions": [
         "환갑 잔치 하셨어요?",
         "어떻게 기념하셨어요?",
     ]},
    {"id": "W12", "season": "winter", "title": "도 개 걸 윷 모 윷놀이",
     "keywords": ["윷", "윷놀이"],
     "std_questions": [
         "윷놀이 가족이랑 하셨어요?",
         "도·개·걸·윷·모 순서 기억나세요?",
     ]},
    {"id": "W13", "season": "winter", "title": "저 푸른 초원 위에 남진",
     "keywords": ["남진", "님과함께", "저푸른초원"],
     "std_questions": [
         "남진의 '저 푸른 초원 위에' 들어보셨어요?",
         "남진과 나훈아 중 누구를 더 좋아하셨어요?",
     ]},
    {"id": "W14", "season": "winter", "title": "심지에 불 붙여라 곤로",
     "keywords": ["곤로", "석유곤로"],
     "std_questions": [
         "곤로 사용해 보셨어요?",
         "곤로에 무엇을 끓여 드셨어요?",
     ]},
    {"id": "W15", "season": "winter", "title": "연탄 갈아 보셨나요",
     "keywords": ["연탄"],
     "std_questions": [
         "연탄 갈아 보셨어요?",
         "연탄 갈다가 가스 마셨던 적은 없으세요?",
     ]},
    {"id": "W16", "season": "winter", "title": "주렁주렁 구수한 메주",
     "keywords": ["메주", "매주"],
     "std_questions": [
         "메주 만들어 보셨어요?",
         "메주는 어디에 매달아 두셨어요?",
     ]},
    {"id": "W17", "season": "winter", "title": "겨울에도 늘 푸른 소나무",
     "keywords": ["소나무"],
     "std_questions": [
         "소나무에서는 어떤 향이 나나요?",
         "한 겨울에 솔방울 따본 적 있으세요?",
     ]},
    {"id": "W18", "season": "winter", "title": "겨울 별미 군고구마",
     "keywords": ["군고구마", "고구마"],
     "std_questions": [
         "군고구마 사 드셨어요?",
         "온돌방에서 고구마 구워 드셨어요?",
     ]},
    {"id": "W19", "season": "winter", "title": "온 가족이 조상님께 인사와 약속을 드리던 제사",
     "keywords": ["제사"],
     "std_questions": [
         "제사 지내실 때 어떤 음식을 차리셨어요?",
         "제사 때 가족이 모여 무슨 이야기 나누셨어요?",
     ]},
    {"id": "W20", "season": "winter", "title": "얼음 위를 씽씽 썰매타기",
     "keywords": ["썰매"],
     "std_questions": [
         "썰매 타보셨어요?",
         "어떤 얼음 위에서 타셨어요?",
     ]},
    {"id": "W21", "season": "winter", "title": "홍단이로구나 둘러앉아 화투놀이",
     "keywords": ["화투", "고스톱"],
     "std_questions": [
         "화투 쳐보셨어요?",
         "어떤 그림이 가장 기억나세요?",
     ]},
    {"id": "W22", "season": "winter", "title": "복조리 사세요 복조리요",
     "keywords": ["복조리"],
     "std_questions": [
         "설날에 복조리 사신 기억 있으세요?",
     ]},
    {"id": "W23", "season": "winter", "title": "드러럭 드러럭 맷돌 갈아 보셨나요",
     "keywords": ["맷돌", "멧돌", "절구"],
     "std_questions": [
         "맷돌 갈아보셨어요?",
         "무엇을 갈아 드셨어요?",
     ]},
    {"id": "W24", "season": "winter", "title": "오방색 색동 때때옷",
     "keywords": ["색동", "때때옷", "한복"],
     "std_questions": [
         "색동저고리 입어보셨어요?",
         "명절에 어떤 옷 입으셨어요?",
     ]},
]


def match_topic(filename_title: str) -> BookTopic | None:
    """파일명에서 추출한 title 을 96 토픽 keyword 와 매칭.

    매칭 우선순위:
    1. 정확 일치 (keyword == filename_title)
    2. filename_title 이 keyword 에 포함
    3. keyword 가 filename_title 에 포함
    """
    if not filename_title:
        return None
    title_clean = filename_title.strip().replace(" ", "")

    # 1. 정확 일치
    for topic in TOPICS:
        for kw in topic.get("keywords", []):
            if kw.replace(" ", "") == title_clean:
                return topic

    # 2/3. substring (양방향)
    for topic in TOPICS:
        for kw in topic.get("keywords", []):
            kw_clean = kw.replace(" ", "")
            if not kw_clean:
                continue
            if kw_clean in title_clean or title_clean in kw_clean:
                return topic

    return None
