"""
22 — Stage 2: 풍부한 페르소나 KG context 위에서 응답 distill

Stage 1 distill (script 19) 와의 차이:
- teller 메타 풍부화: 나이/성별/지역 → + 교육수준/가족구성/정신건강 점수
- raw json 직접 읽어 stratified sample (페르소나 다양성 확보)
- system context 에 페르소나 명시적 + cross-persona leak 방어 지시

흐름:
  raw json random sample (Training/02.라벨링데이터/*.json)
  → teller 메타 풍부 추출 (교육년/배우자/동거인수/자녀수/우울·불안 점수합)
  → qa[] 에서 길이 필터 발화 1-2개 추출
  → 페르소나 그룹화 stratified sample
  → 익명화된 풍부 페르소나 → system context
  → ai-server 시스템 (gemma + SP + CAG) 응답 generate
  → 페어 jsonl 저장

산출물:
  finetune/data/v2/pairs_stage2_persona.jsonl
"""
import argparse
import json
import random
import sys
import time
from collections import defaultdict
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[2]
CAG_DIR = ROOT / "docs" / "cag"
RAW_DIR = ROOT / "finetune" / "data" / "aihub_71703" / "Training" / "02.라벨링데이터"
RAW_DIR_VAL = ROOT / "finetune" / "data" / "aihub_71703" / "Validation" / "02.라벨링데이터"
OUT_PATH = ROOT / "finetune" / "data" / "v2" / "pairs_stage2_persona.jsonl"
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

SYSTEM_PROMPT = """당신은 Remini의 회상요법 대화 파트너(레미니션)입니다.
환자(레미닌)를 성인 대 성인으로 존중하며, 임상가가 아닌 다정한 수다 친구로 대화합니다.
다음에 이어지는 시스템 메시지로 회상요법 도메인 참조와 환자 페르소나 컨텍스트가 주어집니다.

[안전 — 무조건]
- 자해·자살·극심한 고통 등 위기 신호가 보이면 안전 안내 방향으로 부드럽게 전환합니다.
- 비밀번호·계좌·주민번호·의료 진단·약 복용 지시는 묻지도 알려주지도 않습니다.
- 환자가 비현실적 주장(망상)을 해도 논리로 반박하지 않고, 동조하지도 않습니다.

[화법 — 무조건]
- 5W(언제/어디서/누구/무엇/왜) 심문식 질문은 하지 않습니다. 1H(어떤 느낌?) 중심.
- 같은 질문을 반복해 환자를 시험하지 않습니다. 최근 일을 추궁하지 않습니다.
- "그것도 몰라요?" 같은 수치심 표현, "슬프다·괴롭다·위급하다·곤란하다" 같은 부정어는 사용하지 않습니다.
- 환자가 사실과 다른 말을 해도 교정하지 않습니다.

[한국어 문맥 — 무조건]
- 답변 첫머리에서 환자 발화의 핵심 단어·감정·장면을 한 번 받아 줍니다. 새 화제로 바로 뛰지 않습니다.
- 질문은 많아야 하나만 합니다. 질문 전에는 짧은 공감이나 확인을 먼저 둡니다.
- 발화가 끊기거나 모호하면 지어 채우지 말고, 들린 단어를 되받아 쉬운 느낌 질문이나 선택 질문으로 이어갑니다.
- 번역투·상담 매뉴얼 말투보다 자연스러운 한국어 구어체를 씁니다.

[형식 — 무조건]
- 한 번에 1~2문장, 60자 내외, 차분한 어조.
- 이모지·이모티콘·특수기호 감탄 표현은 사용하지 않습니다.

[페르소나 활용 — Stage 2 핵심]
- 페르소나 컨텍스트의 메타(나이대/지역/가족 구성/정신건강 등)를 응답 톤에 반영하되, 메타를 직접 인용하거나 환자에게 통보하지 않습니다.
- 정신건강 점수(우울·불안)가 높으면 더 부드럽고 안전 지향 톤. 낮으면 자연스러운 추억 확장 톤.
- 페르소나 컨텍스트에 없는 specific 사실(이름·구체 지명·가족 이름)은 단정하지 않습니다.
"""

EDU_BANDS = {
    (0, 0): "미취학",
    (1, 6): "초등",
    (7, 9): "중등",
    (10, 12): "고등",
    (13, 99): "대학 이상",
}


def load_wiki() -> str:
    parts = []
    for p in sorted(CAG_DIR.glob("*.md")):
        if p.name.startswith("_") or p.name.lower() == "readme.md":
            continue
        try:
            t = p.read_text(encoding="utf-8").strip()
        except OSError:
            continue
        if t:
            parts.append(f"<!-- {p.name} -->\n{t}")
    return "\n\n---\n\n".join(parts)


def edu_band(years):
    if not isinstance(years, int):
        return "?"
    for (lo, hi), label in EDU_BANDS.items():
        if lo <= years <= hi:
            return label
    return "?"


def age_band(age):
    if not isinstance(age, int):
        return "?"
    return f"{age // 10}0대"


def extract_teller(teller_obj):
    """teller list 의 첫 element → 풍부 메타 dict."""
    if not teller_obj:
        return {}
    t = teller_obj[0] if isinstance(teller_obj, list) else teller_obj
    anxiety = sum(
        v for k, v in t.items() if k.startswith("불안점수") and isinstance(v, int)
    )
    depression = sum(
        v for k, v in t.items() if k.startswith("우울점수") and isinstance(v, int)
    )
    return {
        "age": t.get("나이"),
        "sex": t.get("성별"),
        "hometown": t.get("고향"),
        "region": t.get("거주지"),
        "edu_years": t.get("교육년"),
        "spouse": t.get("배우자"),
        "household_n": t.get("동거인수(본인포함)"),
        "children_n": t.get("자녀수"),
        "anxiety_sum": anxiety,
        "depression_sum": depression,
    }


def render_anon_persona(meta: dict, keyword: str, category: str) -> str:
    """풍부 메타 → 익명화된 한국어 페르소나 텍스트 (system context 용)."""
    parts = []
    parts.append(
        f"환자: {age_band(meta.get('age'))} {meta.get('sex', '?')}"
    )
    edu = edu_band(meta.get("edu_years"))
    if edu != "?":
        parts.append(f"교육: {edu}")
    region = meta.get("region")
    if region:
        parts.append(f"거주: {region}")
    fam = []
    if meta.get("spouse"):
        fam.append(f"배우자 {meta['spouse']}")
    if isinstance(meta.get("children_n"), int):
        fam.append(f"자녀 {meta['children_n']}명")
    if fam:
        parts.append(f"가족: {', '.join(fam)}")

    anx, dep = meta.get("anxiety_sum", 0), meta.get("depression_sum", 0)
    mh = []
    if anx >= 3:
        mh.append("불안 주의")
    elif anx >= 1:
        mh.append("불안 경증")
    if dep >= 3:
        mh.append("우울 주의")
    elif dep >= 1:
        mh.append("우울 경증")
    if mh:
        parts.append(f"정신건강: {', '.join(mh)}")

    parts.append(f"화제: {category} (키워드: {keyword})")
    return ". ".join(parts) + "."


def persona_group_key(meta: dict) -> tuple:
    """stratified sample 용 그룹 key."""
    return (
        age_band(meta.get("age")),
        meta.get("sex", "?"),
        edu_band(meta.get("edu_years")),
        "MH+" if (meta.get("anxiety_sum", 0) + meta.get("depression_sum", 0)) >= 2 else "MH-",
    )


def call_ollama(messages, model="gemma4:31b", temperature=0.4, num_predict=192):
    r = requests.post(
        OLLAMA_URL,
        json={
            "model": model,
            "messages": messages,
            "stream": False,
            "think": False,
            "options": {
                "temperature": temperature,
                "top_p": 0.9,
                "num_predict": num_predict,
                "num_ctx": 32768,
            },
        },
        timeout=180,
    )
    r.raise_for_status()
    return r.json()["message"]["content"].strip()


def gen_response(utterance: str, anon_persona: str, wiki: str, model: str) -> str:
    msgs = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "system",
            "content": f"# 회상요법 도메인 참조\n\n{wiki}\n\n---\n\n"
            "위 자료는 회상요법 도메인 참조입니다. 환자 발화·화제에 맞는 부분만 자연스럽게 활용하세요.",
        },
        {
            "role": "system",
            "content": f"# 환자 페르소나 컨텍스트 (익명화)\n\n{anon_persona}\n\n"
            "응답 시 specific 이름·구체 지명·연도 직접 노출 X. 메타를 환자에게 통보 X.",
        },
        {"role": "user", "content": utterance},
    ]
    return call_ollama(msgs, model=model)


def keyword_to_category(keyword: str) -> str:
    """간단 매핑 (Stage 1 distill 의 our_category 와 동일 패턴)."""
    pos = {"기쁘다", "행복하다", "고맙다", "자랑스럽다", "즐겁다", "편안하다", "재미있다", "반갑다", "성공"}
    neg = {"슬프다", "외롭다", "불안하다", "후회하다", "화나다", "미안하다"}
    place = {"산", "바다", "공원", "병원", "학교", "집", "식당", "지하철"}
    obj = {"음식", "옷", "자동차", "핸드폰", "선물", "꽃"}
    rel = {"친구", "부모", "아기", "강아지", "여행", "휴가", "칭찬"}
    if keyword in pos:
        return "C8-감정표현(긍정)"
    if keyword in neg:
        return "C5-위기신호" if keyword in {"슬프다", "외롭다", "불안하다"} else "C7-일상푸념"
    if keyword in place:
        return "C2-일상회상(장소)"
    if keyword in obj:
        return "C2-일상회상(사물)"
    if keyword in rel:
        return "C2-일상회상(관계)"
    return "C2-일상회상"


def iter_raw_files(seed: int, max_files: int):
    """raw json 파일을 random shuffle 로 yield."""
    files = []
    for d in (RAW_DIR, RAW_DIR_VAL):
        if d.exists():
            files.extend(d.rglob("*.json"))
    rng = random.Random(seed)
    rng.shuffle(files)
    for f in files[:max_files]:
        try:
            yield f, json.loads(f.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-target", type=int, default=2500, help="목표 페어 수")
    ap.add_argument("--n-per-group", type=int, default=20, help="페르소나 그룹당 최대 페어")
    ap.add_argument("--scan-files", type=int, default=20000, help="raw json 스캔 파일 수")
    ap.add_argument("--min-len", type=int, default=15)
    ap.add_argument("--max-len", type=int, default=120)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--model", default="gemma4:31b")
    args = ap.parse_args()

    if not RAW_DIR.exists():
        print(f"ERROR: {RAW_DIR} 없음")
        return 1

    print(f"[1] raw json 스캔 (max {args.scan_files} files) + teller 메타 풍부화")
    candidates_by_group = defaultdict(list)
    n_files = 0
    for fp, data in iter_raw_files(args.seed, args.scan_files):
        n_files += 1
        meta = extract_teller(data.get("teller"))
        if meta.get("age") is None:
            continue
        keyword = data.get("keyword", "?")
        category = keyword_to_category(keyword)
        for qaidx, qa in enumerate(data.get("qa", [])):
            ans = (qa.get("answer") or "").strip()
            if not (args.min_len <= len(ans) <= args.max_len):
                continue
            grp = persona_group_key(meta)
            candidates_by_group[grp].append({
                "id": f"71703p_{data.get('jsonId', fp.stem)}_{qaidx}",
                "keyword": keyword,
                "category": category,
                "user": ans,
                "meta": meta,
            })
    print(f"   파일 {n_files} 스캔, 그룹 {len(candidates_by_group)}, 후보 {sum(len(v) for v in candidates_by_group.values()):,}")

    print(f"\n[2] stratified sample (그룹당 {args.n_per_group}, 목표 {args.n_target})")
    rng = random.Random(args.seed + 1)
    sample = []
    for grp, rows in candidates_by_group.items():
        n = min(args.n_per_group, len(rows))
        sample.extend(rng.sample(rows, n))
    rng.shuffle(sample)
    if len(sample) > args.n_target:
        sample = sample[: args.n_target]
    print(f"   sample: {len(sample):,}")

    print(f"\n[3] CAG 로드")
    wiki = load_wiki()
    print(f"   CAG: {len(wiki):,} chars")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    pairs = []
    t0 = time.time()
    for i, rec in enumerate(sample, 1):
        try:
            anon = render_anon_persona(rec["meta"], rec["keyword"], rec["category"])
            resp = gen_response(rec["user"], anon, wiki, args.model)
            pairs.append({
                "id": rec["id"],
                "source": "stage2_persona_distill",
                "category": rec["category"],
                "keyword": rec["keyword"],
                "system_persona": anon,
                "user": rec["user"],
                "assistant": resp,
                "meta": rec["meta"],
            })
        except Exception as e:
            print(f"   [skip {i}] {e}")
            continue

        if i % 50 == 0:
            elapsed = time.time() - t0
            eta = elapsed / i * (len(sample) - i)
            print(f"   [{i}/{len(sample)}] elapsed {elapsed:.0f}s ETA {eta:.0f}s ({len(pairs)} pairs)")
            with open(OUT_PATH, "w", encoding="utf-8") as f:
                for p in pairs:
                    f.write(json.dumps(p, ensure_ascii=False) + "\n")

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        for p in pairs:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
    print(f"\n[4] 완료: {len(pairs)} 페어 → {OUT_PATH}")
    print(f"   총 시간: {time.time() - t0:.0f}s")


if __name__ == "__main__":
    sys.exit(main())
