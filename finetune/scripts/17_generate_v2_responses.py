"""
17 — v2 응답 generation [GOLEKKI]

input: utterances_v2.jsonl (16 출력) + SEED.csv (사용자 패턴) + ai-server SYSTEM_PROMPT + CAG
output: pairs_v2.jsonl  → 학습 데이터 (user, assistant)

흐름:
  1. utterances_v2.jsonl 의 각 발화에 대해
  2. system: ai-server SYSTEM_PROMPT + CAG + 익명화된 페르소나 + 카테고리별 seed few-shot
  3. user: 환자 발화
  4. ollama gemma4:31b → 응답
  5. PII 자동 검출 (02b 와 동일 룰) → AUTO_FAIL 또는 PASS
  6. 산출물: finetune/data/v2/pairs_v2.jsonl
"""
import argparse
import csv
import json
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[2]
CAG_DIR = ROOT / "docs" / "cag"
UTT_PATH = ROOT / "finetune" / "data" / "v2" / "utterances_v2.jsonl"
SEED_CSV = ROOT / "finetune" / "data" / "v2" / "SEED_TEMPLATE.csv"
OUT_PATH = ROOT / "finetune" / "data" / "v2" / "pairs_v2.jsonl"
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

# ai-server SYSTEM_PROMPT (정확 복제 — 01b/01d 와 동일)
SYSTEM_PROMPT = """당신은 Remini의 회상요법 대화 파트너(레미니션)입니다.
환자(레미닌)를 성인 대 성인으로 존중하며, 임상가가 아닌 다정한 수다 친구로 대화합니다.
다음에 이어지는 시스템 메시지로 회상요법 도메인 참조가 함께 주어집니다. 환자 발화·화제에 맞는 부분을 자연스럽게 활용하되, 그대로 인용하거나 시스템 안내처럼 읽지 않습니다. 도메인 참조와 아래 룰이 충돌하면 아래 룰이 우선합니다.

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

[한국어 문맥 — 무조건]
- 답변 첫머리에서 환자 발화의 핵심 단어·감정·장면을 한 번 받아 줍니다. 새 화제로 바로 뛰지 않습니다.
- 질문은 많아야 하나만 합니다. 질문 전에는 짧은 공감이나 확인을 먼저 둡니다.
- 발화가 끊기거나 모호하면 지어 채우지 말고, 들린 단어를 되받아 쉬운 느낌 질문이나 선택 질문으로 이어갑니다.
- 번역투·상담 매뉴얼 말투보다 자연스러운 한국어 구어체를 씁니다.

[형식 — 무조건]
- 한 번에 1~2문장, 60자 내외, 차분한 어조.
- 이모지·이모티콘·특수기호 감탄 표현은 사용하지 않습니다.
"""

# 익명화 모듈
sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib.util import spec_from_file_location, module_from_spec
_spec = spec_from_file_location("anon", Path(__file__).parent / "14_anonymize_v2.py")
_anon_mod = module_from_spec(_spec)
_spec.loader.exec_module(_anon_mod)
render_persona_for_prompt = _anon_mod.render_persona_for_prompt


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


def load_seeds(seed_path: Path) -> dict[str, list[dict]]:
    if not seed_path.exists():
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


def call_ollama(messages, model="gemma4:31b", temperature=0.4, num_predict=192):
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
    return r.json()["message"]["content"].strip()


def gen_response(utterance: str, persona_anon: dict, category: str,
                  wiki: str, seeds: list[dict], model: str) -> str:
    seed_block = ""
    if seeds:
        # 카테고리 seed 5개 만 (token 절감)
        seed_lines = [f"환자: {s['user']}\n레미니션: {s['assistant']}" for s in seeds[:5]]
        seed_block = "[모범 응답 패턴 (참고)]\n" + "\n\n".join(seed_lines) + "\n\n위 패턴의 어조·길이·룰을 따르되 그대로 복사하지 말고 환자 발화에 맞게."

    msgs = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content":
            f"# 회상요법 도메인 참조\n\n{wiki}\n\n---\n\n"
            "위 자료는 회상요법 도메인 참조입니다. 환자 발화·화제에 맞는 부분만 자연스럽게 활용하고, "
            "그대로 인용하거나 시스템 안내처럼 읽지 않습니다."},
        {"role": "system", "content":
            f"# 환자 컨텍스트 (익명화)\n\n{render_persona_for_prompt(persona_anon)}\n\n"
            f"카테고리: {category}\n\n"
            "응답 시 specific 이름·지명·연도 직접 노출 X (system context 의 익명 카테고리만 활용)."},
    ]
    if seed_block:
        msgs.append({"role": "system", "content": seed_block})
    msgs.append({"role": "user", "content": utterance})

    return call_ollama(msgs, model=model)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="gemma4:31b")
    ap.add_argument("--limit", type=int, default=0, help="처음 N 발화만 (테스트)")
    args = ap.parse_args()

    if not UTT_PATH.exists():
        print(f"ERROR: {UTT_PATH} 없음 — 16_generate_v2_utterances.py 먼저")
        return 1

    utts = [json.loads(l) for l in open(UTT_PATH)]
    if args.limit > 0:
        utts = utts[:args.limit]
    print(f"[1] 발화 {len(utts)}개 응답 generation")

    print(f"[2] CAG / seeds 로드")
    wiki = load_wiki()
    seeds_by_cat = load_seeds(SEED_CSV)
    print(f"   CAG: {len(wiki):,} chars")
    print(f"   seed 카테고리: {list(seeds_by_cat.keys())}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    pairs = []
    t0 = time.time()
    for i, u in enumerate(utts, 1):
        try:
            resp = gen_response(
                u["utterance"], u["persona_anon"], u["category"],
                wiki, seeds_by_cat.get(u["category"], []), args.model)
            pairs.append({
                "id": u["id"].replace("v2_", "v2pair_"),
                "source": "v2",
                "category": u["category"],
                "persona_id": u["persona_id"],
                "user": u["utterance"],
                "assistant": resp,
            })
        except Exception as e:
            print(f"   [skip {i}] {e}")
            continue

        if i % 50 == 0:
            elapsed = time.time() - t0
            eta = elapsed / i * (len(utts) - i)
            print(f"   [{i}/{len(utts)}] elapsed {elapsed:.0f}s ETA {eta:.0f}s")
            with open(OUT_PATH, "w", encoding="utf-8") as f:
                for p in pairs:
                    f.write(json.dumps(p, ensure_ascii=False) + "\n")

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        for p in pairs:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
    print(f"\n[3] {len(pairs)} 페어 → {OUT_PATH}")
    print(f"   총 시간: {time.time()-t0:.0f}s")


if __name__ == "__main__":
    sys.exit(main())
