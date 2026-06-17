"""P999 — 보편 어르신 시연용 페르소나 KG seed.

목적: 치매환자 시연 대상자의 생애기억정보를 알지 못하는 상황에서, 누구나 자기
경험으로 치환해 떠올릴 수 있는 추상화된 한국 70대 어르신 KG 를 Aura 에 부어
넣는다. **개인 식별자(특정 이름·지명·날짜·구체 인물명) 절대 포함 X.**

P001 (김영자) 의 스키마를 그대로 미러:
  - (:Persona {persona_id, name, birth_date, ...})
  - (:GraphEntity:Graph) x 2 (life_memory, daily_care)
  - (:GraphEntity:<Label>) 다수 — HAS_*/MISSES/PREFERS_*/WORKED_AS/... 관계
  - 각 entity 는 (:IN_GRAPH)-> 해당 graph_type hub

쓰기 정책: MERGE 만 사용 (재실행 안전).

시연 접속 방법:
  - ai-server 환자 화면에서 ID "P999" 직접 입력  (user_identity.resolve_persona_id)
  - 또는 이름 "어르신" 입력  (user_identity.resolve)
"""

from __future__ import annotations

import os
import sys
from urllib.parse import urlparse

import certifi
from dotenv import load_dotenv

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(ROOT, ".env"))

from neo4j import GraphDatabase  # noqa: E402

PERSONA_ID = "P999"
PERSONA_NAME = "어르신"          # generic — no personal identifier
BIRTH_DATE = "1949-01-01"        # 보편 70대 후반 — 시연용

PERSONA_PROPS = {
    "persona_id": PERSONA_ID,
    "name": PERSONA_NAME,
    "birth_date": BIRTH_DATE,
    "node_id": f"{PERSONA_ID}|Persona|{PERSONA_NAME}",
    "source_field": "basic_profile",
    "source_question": "성함과 기본 정보",
    "search_text": f"{PERSONA_NAME} | 보편 시연 페르소나 | 70대 한국 어르신",
}

GRAPH_HUBS = [
    {
        "graph_type": "life_memory",
        "name": "보편 어르신 생애기억그래프",
        "description": "과거 기억, 사람, 장소, 사건 중심 그래프 (시연용 추상)",
        "category": "life_memory",
    },
    {
        "graph_type": "daily_care",
        "name": "보편 어르신 일상돌봄그래프",
        "description": "현재 루틴, 건강, 돌봄, 단서 중심 그래프 (시연용 추상)",
        "category": "daily_care",
    },
]

LM = "life_memory"
DC = "daily_care"
BOTH = "both"


def _ent(label, rel, gt, name, **kw):
    e = {"label": label, "rel": rel, "graph_type": gt, "name": name}
    e.update(kw)
    return e


# ───────────────────────────────────────────────
# Entities — 모든 노드는 ROLE 만 / 보편 명사로만 표현.
#   특정 이름 X. 특정 지명 X. 특정 날짜 X.
# ───────────────────────────────────────────────
ENTITIES = [
    # ── 가족 (역할 only, 이름 없음) ──
    _ent("Person", "WAS_CLOSE_TO", LM, "배우자",
         role="spouse", role_hint="배우자",
         alias="배우자|남편|아내|영감|할멈",
         source_field="spouse_role",
         source_question="배우자분과는 어떤 시간을 함께하셨나요?"),
    _ent("Person", "HAS_PERSON", LM, "아들",
         role="son", role_hint="아들",
         alias="아들|장남|큰아들|막내아들",
         source_field="children_roles",
         source_question="자녀분들은 어떻게 되시나요?"),
    _ent("Person", "HAS_PERSON", LM, "딸",
         role="daughter", role_hint="딸",
         alias="딸|큰딸|막내딸",
         source_field="children_roles",
         source_question="자녀분들은 어떻게 되시나요?"),
    _ent("Person", "HAS_PERSON", LM, "손주",
         role="grandchild", role_hint="손주",
         alias="손주|손자|손녀",
         source_field="grandchildren_roles",
         source_question="손주들 보면 어떠세요?"),
    _ent("Person", "MISSES", LM, "어머니",
         role="mother", role_hint="어머니",
         alias="어머니|엄마|모친",
         source_field="most_missed_person",
         source_question="가장 보고 싶은 분은 누구세요?"),
    _ent("Person", "HAS_PERSON", LM, "아버지",
         role="father", role_hint="아버지",
         alias="아버지|아빠|부친",
         source_field="parent_role",
         source_question="아버님은 어떤 분이셨어요?"),
    _ent("Person", "HAS_PERSON", LM, "형제자매",
         role="sibling", role_hint="형제자매",
         alias="형제|자매|언니|오빠|동생|누나|형",
         source_field="siblings_role",
         source_question="형제자매와의 추억이 있으세요?"),
    _ent("Person", "HAD_FRIEND", LM, "어릴 적 단짝 친구",
         role="childhood_friend", role_hint="옛 친구",
         alias="친구|단짝|동무",
         source_field="best_friend",
         source_question="가장 친했던 친구가 있었나요?"),
    _ent("Person", "RELIED_ON", LM, "옛날 동네 어른",
         role="village_elder", role_hint="동네 어른",
         alias="이웃|동네 어른|이장",
         source_field="reliable_neighbor",
         source_question="살면서 의지가 됐던 분이 있으세요?"),

    # ── 장소 (일반 명사) ──
    _ent("Place", "FROM", LM, "고향 시골 마을",
         category="hometown",
         source_field="hometown",
         source_question="고향이 어떤 곳이었어요?"),
    _ent("Place", "HAS_MEANINGFUL_PLACE", LM, "동네 단골 시장",
         category="family_place",
         source_field="family_place",
         source_question="가족과 자주 가던 곳이 있었나요?"),
    _ent("Place", "HAS_MEANINGFUL_PLACE", LM, "단풍 곱던 가을 산",
         category="best_travel_place",
         source_field="best_travel_place",
         source_question="기억에 남는 여행지가 있으세요?"),
    _ent("Place", "HAS_MEANINGFUL_PLACE", LM, "어릴 적 놀던 개울가와 동산",
         category="childhood_play_place",
         source_field="childhood_play_place",
         source_question="어릴 적 어디서 놀았어요?"),
    _ent("Place", "LONGS_FOR_PLACE", LM, "옛 살던 시골집 마당",
         category="nostalgic_home",
         source_field="nostalgic_home",
         source_question="가장 그리운 옛집이 있으세요?"),
    _ent("Place", "WANTS_TO_VISIT", LM, "자식들이 사는 도시",
         category="wish_place",
         source_field="wish_place",
         source_question="가보고 싶은 곳이 있으세요?"),

    # ── 직업 ──
    _ent("Occupation", "WORKED_AS", LM, "농사와 살림",
         category="career",
         source_field="occupation",
         source_question="어떤 일을 하며 사셨어요?"),

    # ── 기억 (보편 이벤트, 특정 연도 X) ──
    _ent("Event", "REMEMBERS", LM, "첫아이 낳던 날",
         category="happy_memory",
         source_field="happiest_moment",
         source_question="가장 행복했던 순간이 언제였어요?"),
    _ent("Event", "REMEMBERS", LM, "자식이 학교 잘 다녀 자랑스러웠던 날",
         category="family_pride",
         source_field="family_proud_moment",
         source_question="자식이 자랑스러웠던 순간이 있으세요?"),
    _ent("Event", "REMEMBERS", LM, "결혼식 날",
         category="life_event",
         source_field="life_event_memory",
         source_question="인생에서 가장 큰 전환점은 언제였어요?"),
    _ent("Event", "REMEMBERS", LM, "배우자와 처음 만난 날",
         category="relationship_memory",
         source_field="spouse_first_meeting_story",
         source_question="배우자분과 어떻게 처음 만나셨어요?"),
    _ent("Event", "REMEMBERS", LM, "온 가족이 함께 떠난 여름 바닷가 여행",
         category="travel_event",
         source_field="travel_memory",
         source_question="기억에 남는 여행이 있었어요?"),
    _ent("Event", "REMEMBERS", LM, "동네 사람들과 모여 김장 담그던 겨울",
         category="family_event",
         source_field="family_event_memory",
         source_question="기억에 남는 가족 행사가 있나요?"),
    _ent("Event", "REMEMBERS", LM, "모내기 끝나고 술참에 다 같이 웃던 일",
         category="funny_memory",
         source_field="funny_memory",
         source_question="웃겼던 기억이 있으세요?"),
    _ent("Event", "REMEMBERS", LM, "텃밭 가꾸며 가족 먹일 채소 길러내던 시간",
         category="work_memory",
         source_field="working_hard_memory",
         source_question="가장 열심히 일했던 기억이 무엇이에요?"),
    _ent("Event", "REMEMBERS", LM, "음식 솜씨 칭찬받던 날",
         category="praised_memory",
         source_field="praised_memory",
         source_question="가장 칭찬받았던 기억이 있으세요?"),
    _ent("Event", "REMEMBERS", LM, "힘들 때 이웃이 손 내밀어준 일",
         category="support_memory",
         source_field="received_help_memory",
         source_question="도움받은 기억이 있으세요?"),
    _ent("Event", "REFLECTS_ON", LM, "어머니 떠올릴 때의 따뜻함과 그리움",
         category="person_reflection",
         source_field="feeling_for_that_person",
         source_question="어머니를 떠올리면 어떤 마음이세요?"),
    _ent("Event", "WANTS_TO_RETURN_TO", LM, "아이들이 마당에서 뛰놀던 시절",
         category="return_time",
         source_field="time_to_return",
         source_question="돌아가고 싶은 시절이 있으세요?"),

    # ── 어릴 적 놀이 (보편) ──
    _ent("Activity", "ENJOYED_ACTIVITY", LM, "공기놀이",
         category="childhood_play",
         source_field="favorite_childhood_play",
         source_question="어릴 적 어떤 놀이 좋아하셨어요?"),
    _ent("Activity", "ENJOYED_ACTIVITY", LM, "고무줄놀이",
         category="childhood_play",
         source_field="favorite_childhood_play",
         source_question="어릴 적 어떤 놀이 좋아하셨어요?"),
    _ent("Activity", "ENJOYED_ACTIVITY", LM, "자치기와 비석치기",
         category="childhood_play",
         source_field="favorite_childhood_play",
         source_question="어릴 적 어떤 놀이 좋아하셨어요?"),

    # ── 추억의 물건 (이름 없는 보편 사물) ──
    _ent("Item", "CHERISHES_ITEM", LM, "결혼할 때 받은 자개장롱",
         category="cherished_item",
         source_field="cherished_item",
         source_question="아끼는 물건이 있으세요?"),
    _ent("Item", "ASSOCIATED_WITH_ITEM", LM, "오래된 가족 사진첩",
         category="nostalgic_object",
         source_field="nostalgic_object",
         source_question="추억이 깃든 물건이 있으세요?"),
    _ent("Item", "ASSOCIATED_WITH_ITEM", LM, "옛날 라디오",
         category="nostalgic_object",
         source_field="nostalgic_object",
         source_question="추억이 깃든 물건이 있으세요?"),

    # ── 자아상 ──
    _ent("Trait", "HAS_TRAIT", LM, "음식 솜씨 좋은 손",
         category="self_image",
         source_field="proud_body_part",
         source_question="자랑스러운 점이 있으세요?"),

    # ── 음식 (보편 한국 가정식) ──
    _ent("Food", "PREFERS_FOOD", BOTH, "된장찌개",
         category="favorite_food",
         source_field="favorite_food",
         source_question="좋아하는 음식이 무엇이세요?"),
    _ent("Food", "PREFERS_FOOD", BOTH, "김치찌개",
         category="favorite_food",
         source_field="favorite_food",
         source_question="좋아하는 음식이 무엇이세요?"),
    _ent("Food", "PREFERS_FOOD", BOTH, "비빔밥",
         category="favorite_food",
         source_field="favorite_food",
         source_question="좋아하는 음식이 무엇이세요?"),
    _ent("Food", "PREFERS_FOOD", BOTH, "콩나물국밥",
         category="favorite_food",
         source_field="favorite_food",
         source_question="좋아하는 음식이 무엇이세요?"),
    _ent("Food", "PREFERS_FOOD", BOTH, "호박전과 김치전",
         category="favorite_food",
         source_field="favorite_food",
         source_question="좋아하는 음식이 무엇이세요?"),

    # ── 미디어 (장르·프로그램명만, 특정 인물명 X) ──
    _ent("Media", "PREFERS_MEDIA", BOTH, "트로트",
         category="music_genre",
         source_field="favorite_music",
         source_question="좋아하는 노래나 음악이 있으세요?"),
    _ent("Media", "PREFERS_MEDIA", BOTH, "가요무대",
         category="drama_or_movie",
         source_field="favorite_drama_movie",
         source_question="자주 보는 프로그램이 있으세요?"),
    _ent("Media", "PREFERS_MEDIA", BOTH, "전원일기",
         category="drama_or_movie",
         source_field="favorite_drama_movie",
         source_question="좋아하는 드라마가 있으세요?"),
    _ent("Media", "PREFERS_MEDIA", BOTH, "9시 뉴스",
         category="drama_or_movie",
         source_field="favorite_drama_movie",
         source_question="저녁에 주로 무엇 보세요?"),

    # ── 선호 (보편 카테고리) ──
    _ent("Preference", "HAS_PREFERENCE", BOTH, "분홍색",
         category="color",
         source_field="favorite_color",
         source_question="좋아하는 색이 있으세요?"),
    _ent("Preference", "HAS_PREFERENCE", BOTH, "가을",
         category="season",
         source_field="favorite_season",
         source_question="좋아하는 계절이 언제인가요?"),
    _ent("Preference", "HAS_PREFERENCE", BOTH, "맑고 선선한 날씨 선호",
         category="weather",
         source_field="favorite_weather",
         source_question="어떤 날씨를 좋아하세요?"),

    # ── 현재 취미 (daily_care) ──
    _ent("Activity", "ENJOYS_ACTIVITY", DC, "화초 가꾸기",
         category="hobby",
         source_field="hobby",
         source_question="요즘 즐기시는 취미가 있으세요?"),
    _ent("Activity", "ENJOYS_ACTIVITY", DC, "동네 산책",
         category="hobby",
         source_field="hobby",
         source_question="요즘 즐기시는 취미가 있으세요?"),
    _ent("Activity", "ENJOYS_ACTIVITY", DC, "마을회관에서 화투 치기",
         category="hobby",
         source_field="hobby",
         source_question="요즘 즐기시는 취미가 있으세요?"),
    _ent("Activity", "ENJOYS_ACTIVITY", DC, "라디오 듣기",
         category="hobby",
         source_field="hobby",
         source_question="요즘 즐기시는 취미가 있으세요?"),

    # ── 건강 ──
    _ent("HealthCondition", "HAS_HEALTH_CONDITION", DC, "고혈압",
         category="health_condition",
         source_field="health_notes",
         source_question="건강은 어떠세요?"),
    _ent("HealthCondition", "HAS_HEALTH_CONDITION", DC, "무릎 관절염",
         category="health_condition",
         source_field="health_notes",
         source_question="건강은 어떠세요?"),
    _ent("Medication", "TAKES_MEDICATION", DC, "혈압약",
         category="medication",
         source_field="health_notes",
         source_question="복용하시는 약이 있으세요?"),
    _ent("Medication", "TAKES_MEDICATION", DC, "관절 진통제",
         category="medication",
         source_field="health_notes",
         source_question="복용하시는 약이 있으세요?"),

    # ── 일과 루틴 ──
    _ent("Routine", "HAS_ROUTINE", DC, "아침 일찍 일어나 마당 쓸기",
         category="morning_routine",
         source_field="morning_routine",
         source_question="아침에 보통 뭐 하세요?"),
    _ent("Routine", "HAS_ROUTINE", DC, "보리차와 함께 혈압약 챙기기",
         category="daily_must_do",
         source_field="daily_must_do",
         source_question="매일 꼭 하시는 일이 있나요?"),
    _ent("Routine", "HAS_ROUTINE", DC, "라디오 들으며 채소 다듬기",
         category="quiet_rest_activity",
         source_field="quiet_rest_activity",
         source_question="조용히 쉴 때는 뭐 하세요?"),
    _ent("Routine", "HAS_ROUTINE", DC, "저녁에 가요무대 보고 잠자리에 들기",
         category="bedtime_routine",
         source_field="bedtime_routine",
         source_question="잠들기 전에 뭐 하세요?"),

    # ── 단서 (보편 감각·연상) ──
    _ent("Cue", "HAS_CUE", BOTH, "가을 들녘 벼 익는 냄새",
         category="smell",
         source_field="hometown_smell_feeling",
         source_question="고향 냄새 하면 뭐 생각나세요?"),
    _ent("Cue", "HAS_CUE", BOTH, "비 오는 날 부침개와 막걸리 생각",
         category="rainy_day",
         source_field="rainy_day_food",
         source_question="비 오는 날 떠오르는 음식이 있나요?"),
    _ent("Cue", "HAS_CUE", BOTH, "빗소리 들으면 어머니 생각",
         category="rainy_feeling",
         source_field="rainy_day_feeling",
         source_question="비 오는 날은 어떤 기분이세요?"),
    _ent("Cue", "HAS_CUE", BOTH, "옛 라디오 트로트 소리 들으면 청춘 시절 생각",
         category="sound",
         source_field="nostalgic_sound",
         source_question="어떤 소리 들으면 옛 생각이 나세요?"),

    # ── 도구 ──
    _ent("Item", "USES_ITEM", BOTH, "오래 쓴 호미",
         category="tool",
         source_field="instrument",
         source_question="자주 쓰시는 도구가 있으세요?"),
]


def _normalize_uri(raw: str) -> str:
    parsed = urlparse(raw)
    host = parsed.hostname or ""
    scheme = "neo4j" if host.endswith(".databases.neo4j.io") else parsed.scheme.split("+")[0]
    return f"{scheme}://{host}" + (f":{parsed.port}" if parsed.port else "")


def _driver_kwargs(host: str) -> dict:
    if host.endswith(".databases.neo4j.io"):
        from neo4j import TrustCustomCAs
        return {"encrypted": True, "trusted_certificates": TrustCustomCAs(certifi.where())}
    return {}


def _entity_search_text(name, role, alias, source_field, source_question, category):
    parts = [name]
    if role:
        parts.append(role)
    if alias:
        parts.append(alias)
    if category:
        parts.append(category)
    if source_field:
        parts.append(source_field)
    if source_question:
        parts.append(source_question)
    return " | ".join(parts)


def _node_id_for_entity(graph_type: str, label: str, name: str) -> str:
    return f"{PERSONA_ID}|{graph_type}|{label}|{name}"


def _hub_node_id(graph_type: str, name: str) -> str:
    return f"{PERSONA_ID}|{graph_type}|Graph|{name}"


def run():
    uri = _normalize_uri(os.environ["NEO4J_URI"])
    host = urlparse(uri).hostname or ""

    drv = GraphDatabase.driver(
        uri,
        auth=(os.environ["NEO4J_USERNAME"], os.environ["NEO4J_PASSWORD"]),
        **_driver_kwargs(host),
    )
    drv.verify_connectivity()
    db = os.environ.get("NEO4J_DATABASE", "neo4j")

    with drv.session(database=db) as s:
        s.run(
            "MERGE (p:Persona {persona_id: $persona_id}) SET p += $props",
            persona_id=PERSONA_ID, props=PERSONA_PROPS,
        )
        print(f"[OK] Persona {PERSONA_ID} ({PERSONA_NAME}) upserted")

        for hub in GRAPH_HUBS:
            node_id = _hub_node_id(hub["graph_type"], hub["name"])
            search_text = f"{hub['name']} | {hub['graph_type']} | {hub['description']}"
            s.run(
                """
                MATCH (p:Persona {persona_id: $persona_id})
                MERGE (g:GraphEntity:Graph {node_id: $node_id})
                SET g.persona_id = $persona_id,
                    g.graph_type = $graph_type,
                    g.name = $name,
                    g.description = $description,
                    g.category = $category,
                    g.search_text = $search_text
                MERGE (p)-[:HAS_GRAPH]->(g)
                """,
                persona_id=PERSONA_ID, node_id=node_id,
                graph_type=hub["graph_type"], name=hub["name"],
                description=hub["description"], category=hub["category"],
                search_text=search_text,
            )
        print(f"[OK] Graph hubs (life_memory + daily_care) upserted")

        total = 0
        for raw in ENTITIES:
            gts = ["life_memory", "daily_care"] if raw["graph_type"] == "both" else [raw["graph_type"]]
            for gt in gts:
                label = raw["label"]
                name = raw["name"]
                node_id = _node_id_for_entity(gt, label, name)
                role = raw.get("role")
                role_hint = raw.get("role_hint")
                alias = raw.get("alias")
                source_field = raw.get("source_field")
                source_question = raw.get("source_question")
                category = raw.get("category")
                description = raw.get("description")
                value = raw.get("value")
                period = raw.get("period")
                search_text = _entity_search_text(name, role, alias, source_field, source_question, category)

                cypher = f"""
                MATCH (p:Persona {{persona_id: $persona_id}})
                MATCH (hub:Graph {{persona_id: $persona_id, graph_type: $graph_type}})
                MERGE (e:GraphEntity:{label} {{node_id: $node_id}})
                SET e.persona_id = $persona_id,
                    e.graph_type = $graph_type,
                    e.name = $name,
                    e.category = $category,
                    e.source_field = $source_field,
                    e.source_question = $source_question,
                    e.role = $role,
                    e.role_hint = $role_hint,
                    e.alias = $alias,
                    e.description = $description,
                    e.value = $value,
                    e.period = $period,
                    e.search_text = $search_text
                MERGE (p)-[:{raw["rel"]}]->(e)
                MERGE (e)-[:IN_GRAPH]->(hub)
                """
                s.run(
                    cypher,
                    persona_id=PERSONA_ID, graph_type=gt, node_id=node_id,
                    name=name, category=category,
                    source_field=source_field, source_question=source_question,
                    role=role, role_hint=role_hint, alias=alias,
                    description=description, value=value, period=period,
                    search_text=search_text,
                )
                total += 1
        print(f"[OK] {total} GraphEntity rows (incl. both-graph duplicates) upserted")

        cnt = s.run(
            "MATCH (p:Persona {persona_id: $persona_id})-[r]->(e:GraphEntity) RETURN count(e) AS n",
            persona_id=PERSONA_ID,
        ).single()["n"]
        print(f"[CHECK] Persona {PERSONA_ID} → {cnt} 1-hop GraphEntity edges")

    drv.close()


if __name__ == "__main__":
    sys.exit(run())
