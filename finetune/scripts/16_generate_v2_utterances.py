"""
16 — v2 환자 발화 generation [GOLEKKI]

각 카테고리 × 페르소나 random combination → 환자 발화 LLM generate.

흐름:
  1. CATEGORIES.md 카테고리 정의 + 룰 로드
  2. SEED_TEMPLATE.csv 사용자 작성 응답 (few-shot 예시) — 22 페어
  3. BOOK_REFERENCES.txt 책 RAG 인덱스 (2026-05-07 ✅, 책 10권 OCR)
  4. 60명 페르소나 풀 (raw_sample_v2.csv) 익명화
  5. 카테고리별 random 페르소나 + 시뮬레이터 prompt → 발화 generate
  6. 산출: data/v2/utterances_v2.jsonl
     {persona_id, category, utterance}

다음 단계: 17_generate_v2_responses.py 가 ai-server 시스템으로 응답 generate.
"""
import argparse
import csv
import hashlib
import json
import random
import sys
import time
from pathlib import Path

import requests

# 익명화 모듈 import (같은 scripts/ 폴더)
sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib.util import spec_from_file_location, module_from_spec
_spec = spec_from_file_location("anon", Path(__file__).parent / "14_anonymize_v2.py")
_anon_mod = module_from_spec(_spec)
_spec.loader.exec_module(_anon_mod)
anonymize_persona = _anon_mod.anonymize_persona
render_persona_for_prompt = _anon_mod.render_persona_for_prompt

ROOT = Path(__file__).resolve().parents[2]
PERSONA_CSV = ROOT / "experiments" / "data" / "personas" / "raw_sample_v2.csv"
SEED_CSV = ROOT / "finetune" / "data" / "v2" / "SEED_TEMPLATE.csv"  # 사용자 작성 + 책 RAG 참조 (2026-05-07)
BOOK_TXT = ROOT / "finetune" / "data" / "v2" / "BOOK_REFERENCES.txt"  # 책 RAG 인덱스 (2026-05-07 ✅)
OUT_PATH = ROOT / "finetune" / "data" / "v2" / "utterances_v2.jsonl"
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

# 카테고리별 발화 수 목표 (CATEGORIES.md 와 동일)
CATEGORY_TARGETS = {
    "C1-망상": 200,
    "C2-일상회상": 300,
    "C3-감각단서": 200,
    "C4-사실오류": 200,
    "C5-위기신호": 100,
    "C6-기억어려움": 200,
    "C7-일상푸념": 200,
    "C8-감정표현": 200,
}

CATEGORY_GUIDELINE = {
    "C1-망상": "비현실적 주장 (도둑·피해·간섭 망상). 동조·반박 X 의도. 짧고 단편적 (5-30자).",
    "C2-일상회상": "가족·고향·옛 직장·음식 회상. 1-2 문장. 회상조 어조.",
    "C3-감각단서": "냄새·맛·소리·색·촉감 trigger. 단편적 단서 발화.",
    "C4-사실오류": "사실과 다르거나 시점 혼동. 명확한 fact mismatch (의사 아들·살아있는 사별자 등).",
    "C5-위기신호": "자해·자살·극심한 우울 표현. 직설적이거나 우회적.",
    "C6-기억어려움": "잊음·혼란·이름 못 떠올림. '뭐였더라' 식.",
    "C7-일상푸념": "날씨·몸 상태·식사 등 일상 푸념. 짧음.",
    "C8-감정표현": "그리움·외로움·자랑 등 감정. 1-2 문장.",
}


def load_seeds_by_category(seed_path: Path) -> dict[str, list[dict]]:
    """SEED.csv 가 있으면 카테고리별 seed 그룹화. 없으면 빈 dict."""
    if not seed_path.exists():
        print(f"⚠ {seed_path} 없음 — 사용자 seed 작성 필요. 일단 빈 채로 진행.")
        return {}
    out = {}
    with open(seed_path, encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            cat = r.get("category", "").strip()
            if r.get("patient_utterance") and r.get("assistant_response"):
                out.setdefault(cat, []).append({
                    "user": r["patient_utterance"].strip(),
                    "assistant": r["assistant_response"].strip(),
                })
    return out


def load_book_references(book_path: Path) -> str:
    """OCR 책 텍스트. placeholder — 파일 없으면 빈 문자열."""
    if not book_path.exists():
        return "(책 OCR 미수신 — 이 부분이 비어있으면 wiki 만 reference)"
    return book_path.read_text(encoding="utf-8")


def call_ollama(messages, model="gemma4:31b", temperature=0.95, num_predict=512):
    r = requests.post(OLLAMA_URL, json={
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
    }, timeout=180)
    r.raise_for_status()
    return r.json()["message"]["content"]


def parse_utterances(raw: str, n: int) -> list[str]:
    text = raw.strip()
    if "```" in text:
        for chunk in text.split("```"):
            chunk = chunk.lstrip("json").strip()
            if chunk.startswith("["):
                text = chunk; break
    try:
        arr = json.loads(text)
        if isinstance(arr, list):
            return [str(x).strip().strip('"').strip("'") for x in arr if str(x).strip()][:n]
    except Exception:
        pass
    out = []
    for line in text.splitlines():
        line = line.strip().lstrip("-•*").strip().strip('"').strip("'").strip(",").strip()
        if 4 <= len(line) <= 100:
            out.append(line)
    return out[:n]


def gen_utterances_for_category(
    category: str,
    n: int,
    persona_anon: dict,
    seeds: list[dict],
    book_text: str,
    model: str,
) -> list[str]:
    """한 페르소나 + 한 카테고리 → n 발화 generate."""
    seed_block = ""
    if seeds:
        seed_lines = [f"- 환자: \"{s['user']}\"\n  레미니션: \"{s['assistant']}\"" for s in seeds[:5]]
        seed_block = "[사용자가 작성한 모범 패턴]\n" + "\n".join(seed_lines)

    system = f"""당신은 회상요법을 받는 노인 치매 환자(레미닌) 시뮬레이터입니다.
주어진 페르소나가 [{category}] 카테고리에 해당하는 발화를 만들어주세요.

[카테고리 정의]
{CATEGORY_GUIDELINE.get(category, '')}

[책 reference - 임상 사례]
{book_text}

{seed_block}

발화 특징:
- 짧고 단편적 (5-40자, 1문장)
- 자연스러운 한국 노인 어조
- 페르소나의 거주·연령·가족·직업·취미 단서 자연스럽게 반영 (specific 이름·지명은 X)"""

    user = f"""[페르소나 익명화]
{render_persona_for_prompt(persona_anon)}

위 환자가 [{category}] 카테고리에 해당하는 발화 {n}개를 만들어주세요.
JSON 배열로만 반환:
["발화1", "발화2", ...]"""

    raw = call_ollama(
        [{"role": "system", "content": system}, {"role": "user", "content": user}],
        model=model,
    )
    return parse_utterances(raw, n)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="gemma4:31b")
    ap.add_argument("--scale", type=float, default=1.0,
                    help="카테고리별 목표 수 scaling (테스트시 0.05 등)")
    ap.add_argument("--per-persona", type=int, default=5,
                    help="페르소나당 카테고리당 발화 수")
    args = ap.parse_args()

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    # 1. 페르소나 풀 로드
    if not PERSONA_CSV.exists():
        print(f"ERROR: {PERSONA_CSV} 없음 — 15_persona_pool_v2.py 먼저")
        return 1
    import pandas as pd
    df = pd.read_csv(PERSONA_CSV)
    print(f"[1] 페르소나 풀: {len(df)}명")

    # 페르소나 dict 형식 (yaml 없이 csv 에서 직접 — anonymize 가 필요한 키만)
    personas = []
    for _, row in df.iterrows():
        personas.append({
            "id": row["uuid"][:8],
            "age": int(row["age"]),
            "age_bin": row["age_bin"],
            "sex": row["sex"],
            "residence": {
                "province": row["province"],
                "district": row["district"],
                "region_class": row["region_class"],
            },
            "education": {"level": row["education_level"]},
            "occupation": row["occupation"],
            "family_type": row["family_type"],
            "marriage": {"status": row["marital_status"]},
            "children": [],  # csv 만 으론 자녀 정보 없음 — 단순화
            "health": {"conditions": []},
            "preferences": {},
        })
    print(f"   anonymized 변환 ready")

    # 2. seed / book 로드
    seeds_by_cat = load_seeds_by_category(SEED_CSV)
    if not seeds_by_cat:
        print(f"⚠ SEED.csv 비어있거나 없음 — few-shot 없이 generation. 사용자 seed 작성 후 재실행 권장.")
    book_text = load_book_references(BOOK_TXT)
    if "미수신" in book_text:
        print(f"⚠ 책 OCR 미수신 — placeholder 로 진행. OCR 받은 후 재실행 권장.")

    # 3. 카테고리별 generation
    all_utts = []
    rng = random.Random(42)
    t0 = time.time()
    for category, target in CATEGORY_TARGETS.items():
        target_n = int(target * args.scale)
        if target_n <= 0:
            continue
        seeds = seeds_by_cat.get(category, [])
        # 페르소나 random pick — n 발화 / per_persona 만큼 페르소나 사용
        n_personas_needed = max(1, target_n // args.per_persona)
        chosen_personas = rng.sample(personas, min(n_personas_needed, len(personas)))
        print(f"\n[{category}] target={target_n}, 페르소나 {len(chosen_personas)}명 × {args.per_persona} 발화")

        cat_count = 0  # 카테고리 내 누적 (전체 all_utts 와 분리)
        for i, p in enumerate(chosen_personas):
            anon = anonymize_persona(p)
            try:
                utts = gen_utterances_for_category(
                    category, args.per_persona, anon, seeds, book_text, args.model)
            except Exception as e:
                print(f"   [skip] persona {i}: {e}")
                continue
            for u in utts:
                all_utts.append({
                    "id": f"v2_{category}_{anon['label']}_{hashlib.md5(u.encode()).hexdigest()[:8]}",
                    "category": category,
                    "persona_id": anon["label"],
                    "persona_anon": anon,
                    "utterance": u,
                })
            cat_count += len(utts)
            elapsed = time.time() - t0
            print(f"   ({i+1}/{len(chosen_personas)}) +{len(utts)} 발화 (cat {cat_count}/{target_n}, total {len(all_utts)}, elapsed {elapsed:.0f}s)")
            if cat_count >= target_n:
                break

        # 누적 저장 (도중 끊겨도 보존)
        with open(OUT_PATH, "w", encoding="utf-8") as f:
            for u in all_utts:
                f.write(json.dumps(u, ensure_ascii=False) + "\n")

    print(f"\n[완료] {len(all_utts)} 발화 → {OUT_PATH}")
    print(f"   총 시간: {time.time()-t0:.0f}s")


if __name__ == "__main__":
    sys.exit(main())
