"""
19 — Stage 1 핵심: AI Hub 71703 distill

흐름:
  utterances.jsonl 에서 카테고리별 균등 sample
  → 길이 0-100자 (회상요법 응답 length 적합)
  → teller 메타 익명화 → system context
  → ai-server 시스템 (gemma + SP + CAG) 응답 generate
  → 페어 jsonl 저장

산출물:
  finetune/data/v2/pairs_71703_distill.jsonl
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
UTT_PATH = ROOT / "finetune" / "data" / "aihub_71703" / "utterances.jsonl"
OUT_PATH = ROOT / "finetune" / "data" / "v2" / "pairs_71703_distill.jsonl"
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

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


def render_anon_persona(rec: dict) -> str:
    """71703 utterance 의 화자 메타 → 익명화된 한국어 페르소나 요약."""
    age = rec.get("speaker_age")
    sex = rec.get("speaker_sex", "?")
    region = rec.get("speaker_region", "?")
    age_band = f"{age // 10}0대" if isinstance(age, int) else "?"
    return (
        f"환자: {age_band} {sex}, 거주 {region}.\n"
        f"카테고리: {rec.get('our_category', '?')} (키워드: {rec.get('keyword', '?')})"
    )


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


def gen_response(utterance: str, anon_persona: str, wiki: str, model: str) -> str:
    msgs = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content":
            f"# 회상요법 도메인 참조\n\n{wiki}\n\n---\n\n"
            "위 자료는 회상요법 도메인 참조입니다. 환자 발화·화제에 맞는 부분만 자연스럽게 활용하고, "
            "그대로 인용하거나 시스템 안내처럼 읽지 않습니다."},
        {"role": "system", "content":
            f"# 환자 컨텍스트 (익명화)\n\n{anon_persona}\n\n"
            "응답 시 specific 이름·지명·연도 직접 노출 X."},
        {"role": "user", "content": utterance},
    ]
    return call_ollama(msgs, model=model)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-total", type=int, default=5000, help="총 페어 수")
    ap.add_argument("--min-len", type=int, default=10)
    ap.add_argument("--max-len", type=int, default=100, help="환자 발화 길이 상한")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--model", default="gemma4:31b")
    args = ap.parse_args()

    if not UTT_PATH.exists():
        print(f"ERROR: {UTT_PATH} 없음. 18 먼저 실행")
        return 1

    print(f"[1] 71703 utterances 로드 + 길이 필터 ({args.min_len}-{args.max_len}자)")
    by_cat = defaultdict(list)
    with open(UTT_PATH, encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            L = r.get("answer_len", 0)
            if not (args.min_len <= L <= args.max_len):
                continue
            by_cat[r["our_category"]].append(r)
    for cat, rows in by_cat.items():
        print(f"   {cat}: {len(rows):,} 후보")

    print(f"\n[2] 카테고리별 균등 sample (총 {args.n_total})")
    rng = random.Random(args.seed)
    n_cats = len(by_cat)
    per_cat = args.n_total // n_cats
    sample = []
    for cat, rows in by_cat.items():
        n = min(per_cat, len(rows))
        sample.extend(rng.sample(rows, n))
    rng.shuffle(sample)
    print(f"   sample: {len(sample):,}")

    print(f"\n[3] CAG 로드")
    wiki = load_wiki()
    print(f"   CAG: {len(wiki):,} chars")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    pairs = []
    t0 = time.time()
    for i, rec in enumerate(sample, 1):
        try:
            anon = render_anon_persona(rec)
            resp = gen_response(rec["answer"], anon, wiki, args.model)
            pairs.append({
                "id": f"71703_{rec['id']}",
                "source": "71703_distill",
                "category": rec["our_category"],
                "keyword": rec["keyword"],
                "user": rec["answer"],
                "assistant": resp,
                "speaker_meta": {
                    "age": rec.get("speaker_age"),
                    "sex": rec.get("speaker_sex"),
                    "region": rec.get("speaker_region"),
                },
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
    print(f"   총 시간: {time.time()-t0:.0f}s")


if __name__ == "__main__":
    sys.exit(main())
