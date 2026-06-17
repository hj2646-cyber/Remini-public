"""
01d — KorEmpatheticDialogues user 발화 → ai-server 환경으로 응답 재생성 (Self-Distill v2)

목적:
  외부 데이터의 다양한 감정 표현 user 발화 → 우리 회상요법 화법 응답 페어
  → 다양한 입력 분포에 우리 시스템 도메인 일관성 학습

전략:
  1) emotion 필터: 회상요법 적합 감정 (긍정 + 약한 부정)
  2) 키워드 필터: 회상 관련 단어 (옛날/어릴/기억/가족 등) 들어간 user 발화만
  3) sample N개 → ai-server SYSTEM_PROMPT + CAG 환경으로 응답 generate
  4) raw_pairs_external.jsonl 덮어쓰기 (이전 외부 페어 대체)

KG context 없음 — 외부 발화는 페르소나 정보 없으므로 SYSTEM + CAG 만으로 응답.
이는 ai-server 가 신규 환자 만났을 때 동작과 같음 (페르소나 없는 일반 응답).
"""

import argparse
import hashlib
import json
import random
import sys
import time
from pathlib import Path

import requests
from datasets import load_dataset

ROOT = Path(__file__).resolve().parents[2]
CAG_DIR = ROOT / "docs" / "cag"
OUT = ROOT / "finetune" / "data" / "pairs" / "raw_pairs_external.jsonl"
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

# 회상요법 적합 감정 (긍정 + 약한 부정 — 평온한 회상 가능)
GOOD_EMOTIONS = {
    "caring", "confident", "content", "faithful", "grateful", "hopeful",
    "impressed", "joyful", "lonely", "nostalgic", "prepared", "proud",
    "sentimental", "surprised", "trusting", "disappointed", "sad",
}
# 부적합 감정 — 격한 부정 / 자극적 (회상요법 도메인 X)
# afraid, angry, annoyed, anxious, apprehensive, ashamed, devastated,
# disgusted, embarrassed, excited, furious, guilty, jealous, terrified

# 회상 관련 키워드 (최소 1개 등장해야 통과)
REMINISCE_KW = [
    "옛날", "어릴", "어렸", "기억", "추억", "예전", "그때", "고향", "동네",
    "친구", "가족", "엄마", "아빠", "어머니", "아버지",
    "할머니", "할아버지", "남편", "아내", "자식", "딸", "아들",
    "초등", "중학", "고등", "대학", "어린", "소년", "소녀", "처음",
    "결혼", "졸업", "입학", "직장", "회사", "고향집",
]

# ai-server SYSTEM_PROMPT (01b 와 동일)
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
    for path in sorted(CAG_DIR.glob("*.md")):
        if path.name.startswith("_") or path.name.lower() == "readme.md":
            continue
        try:
            text = path.read_text(encoding="utf-8").strip()
        except OSError:
            continue
        if text:
            parts.append(f"<!-- {path.name} -->\n{text}")
    return "\n\n---\n\n".join(parts)


def call_ollama(messages, model, temperature=0.4, num_predict=192, timeout=120):
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
    }, timeout=timeout)
    r.raise_for_status()
    return r.json()["message"]["content"].strip()


def is_good(ex, user_utter):
    if ex["emotion"] not in GOOD_EMOTIONS:
        return False, "bad_emotion"
    if len(user_utter) < 5 or len(user_utter) > 200:
        return False, "bad_length"
    if not any(kw in user_utter for kw in REMINISCE_KW):
        return False, "no_reminisce_kw"
    return True, ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-pairs", type=int, default=500,
                    help="self-distill 응답 생성할 user 발화 수")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--model", default="gemma4:31b")
    args = ap.parse_args()

    print("[1] KorEmpatheticDialogues 로드 + 필터")
    ds = load_dataset("passing2961/KorEmpatheticDialogues")
    candidates = []
    drop = {"bad_emotion": 0, "bad_length": 0, "no_reminisce_kw": 0}
    for split in ["train", "validation"]:
        for ex in ds[split]:
            for turn in ex["dialogue"]:
                if turn["user_id"] != 0:
                    continue
                u = turn["utter"].strip()
                ok, reason = is_good(ex, u)
                if ok:
                    candidates.append({
                        "src_split": split,
                        "src_dialogue_id": ex["dialogue_id"],
                        "src_utter_idx": turn["utter_idx"],
                        "emotion": ex["emotion"],
                        "user": u,
                    })
                else:
                    drop[reason] += 1

    print(f"   필터 통과 user 발화: {len(candidates):,}")
    for r, n in drop.items():
        print(f"     [drop {r}] {n:,}")

    rng = random.Random(args.seed)
    if len(candidates) > args.max_pairs:
        sampled = rng.sample(candidates, args.max_pairs)
    else:
        sampled = candidates
    print(f"\n[2] sample → {len(sampled)} user 발화 self-distill\n")

    wiki = load_wiki()
    print(f"   CAG: {len(wiki):,} chars")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pairs = []
    t0 = time.time()
    for i, c in enumerate(sampled, 1):
        try:
            resp = call_ollama([
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "system", "content":
                    f"# 회상요법 도메인 참조\n\n{wiki}\n\n---\n\n"
                    "위 자료는 회상요법 도메인 참조입니다. 환자 발화·화제에 맞는 부분만 자연스럽게 활용하고, "
                    "그대로 인용하거나 시스템 안내처럼 읽지 않습니다."},
                {"role": "user", "content": c["user"]},
            ], model=args.model)
            id_hash = hashlib.md5(f"{c['src_split']}_{c['src_dialogue_id']}_{c['src_utter_idx']}".encode()).hexdigest()[:10]
            pairs.append({
                "id": f"distill_ext_{id_hash}",
                "source": "distill_external",
                "session_id": f"distill_ext_{id_hash}",
                "user": c["user"],
                "assistant": resp,
                "user_emotion": c["emotion"],
                "user_risk_level": None,
            })
        except Exception as e:
            print(f"   [skip {i}] {e}")
            continue

        if i % 50 == 0:
            elapsed = time.time() - t0
            eta = elapsed / i * (len(sampled) - i)
            print(f"   [{i}/{len(sampled)}] elapsed {elapsed:.0f}s ETA {eta:.0f}s — pair {len(pairs)}")
            with open(OUT, "w", encoding="utf-8") as f:
                for p in pairs:
                    f.write(json.dumps(p, ensure_ascii=False) + "\n")

    with open(OUT, "w", encoding="utf-8") as f:
        for p in pairs:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    print(f"\n[3] 완료: {len(pairs)} 페어 → {OUT}")
    print(f"   총 시간: {time.time()-t0:.0f}s")
    if pairs:
        print(f"\n[샘플 3건]")
        for p in pairs[:3]:
            print(f"  [{p['user_emotion']}]")
            print(f"    USER: {p['user']}")
            print(f"    AST:  {p['assistant']}")
            print()


if __name__ == "__main__":
    sys.exit(main())
