"""
01b — Self-Distillation 페어 합성

NVIDIA 30 페르소나 KG → 환자 발화 LLM generate → ai-server 와 동일 환경(SYSTEM+CAG+KG) 응답 → 페어

직접 ollama 호출로 진행 (ai-server 거치지 않음 — conversation_db 오염 방지).
ai-server 의 SYSTEM_PROMPT + docs/cag/ 정확히 동일하게 재현.

산출물:
  finetune/data/pairs/raw_pairs_synth.jsonl

사용:
  python finetune/scripts/01b_synthesize_pairs.py [--n-utt 10] [--model gemma4:31b]
"""

import argparse
import json
import sys
import time
from pathlib import Path

import requests
import yaml

ROOT = Path(__file__).resolve().parents[2]  # Remini/
PERSONA_DIR = ROOT / "experiments" / "data" / "personas"
CAG_DIR = ROOT / "docs" / "cag"
OUT_PATH = ROOT / "finetune" / "data" / "pairs" / "raw_pairs_synth.jsonl"
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

# ai-server/app/services/llm.py:18 의 SYSTEM_PROMPT 그대로
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

UTT_GEN_SYSTEM = """당신은 회상요법 세션에 참여하는 노인 치매 환자(레미닌) 시뮬레이터입니다.
주어진 페르소나의 환자가 회상요법 시간에 자연스럽게 할 만한 짧은 발화를 만들어주세요.

실제 치매 환자 발화 특징:
- 짧고 단편적 (5~30자, 1문장)
- 단기 기억보다 옛날 일에 더 또렷
- 말 줄임·어미 흐림 ("그게 뭐였더라", "이게 뭐지")
- 가족·옛 직장·고향·음식·옛날 노래·동네·계절 같은 장기 기억 위주
- 기억 어려움 호소 ("기억이 잘 안 나네", "이름이 뭐였더라")
- 망상이나 혼란 약간 ("내 통장 누가 가져갔어", "남편이 어디 갔지")
- 일상 푸념·날씨·몸 상태 ("오늘 따라 다리가 아프네", "오늘 비가 오려나")"""


def load_wiki() -> str:
    """ai-server/app/services/llm.py 의 _load_domain_cag() 와 동일."""
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


def persona_summary(kg: dict) -> str:
    p = kg
    parts = [
        f"환자 이름: {p['name']}",
        f"나이: {p['age']}세 ({p['birth_year']}년생)",
        f"성별: {p['sex']}",
        f"거주: {p['residence']['province']} {p['residence']['district']}",
        f"학력: {p['education']['level']}",
        f"직업: {p['occupation']}",
        f"가족 거주: {p['family_type']}",
    ]
    m = p["marriage"]
    if m["status"] != "미혼":
        parts.append(f"결혼: {m['marriage_year']}년")
        if m.get("spouse_death_year"):
            parts.append(f"배우자 사별: {m['spouse_death_year']}년")
        if m.get("divorce_year"):
            parts.append(f"이혼: {m['divorce_year']}년")
    if p["children"]:
        cs = ", ".join(f"{c['name']}({c['age']}세 {c['sex']})" for c in p["children"])
        parts.append(f"자녀: {cs}")
    parts.append(f"주요 질환: {', '.join(p['health']['conditions'])}")
    parts.append(f"좋아하는 음식: {p['preferences']['food']}")
    parts.append(f"취미: {p['preferences']['hobby']}")
    parts.append(f"좋아하는 문화: {p['preferences']['culture']}")
    parts.append(f"\n[페르소나 narrative]\n{p['text']['persona']}")
    parts.append(f"[가족 narrative]\n{p['text']['family']}")
    parts.append(f"[음식 narrative]\n{p['text']['culinary']}")
    parts.append(f"[취미 narrative]\n{p['text']['hobbies']}")
    return "\n".join(parts)


def call_ollama(messages: list[dict], model: str, temperature: float = 0.4,
                 num_predict: int = 256, timeout: int = 180) -> str:
    r = requests.post(OLLAMA_URL, json={
        "model": model,
        "messages": messages,
        "stream": False,
        "think": False,  # gemma4:31b reasoning mode 끄기 (ai-server 와 동일)
        "options": {
            "temperature": temperature,
            "top_p": 0.9,
            "num_predict": num_predict,
            "num_ctx": 32768,
        },
    }, timeout=timeout)
    r.raise_for_status()
    return r.json()["message"]["content"]


def parse_utterances(raw: str, n: int) -> list[str]:
    """JSON 배열 파싱 시도. 실패 시 줄/번호 단위 fallback."""
    text = raw.strip()
    # ```json ... ``` 마크 제거
    if "```" in text:
        between = text.split("```")
        for chunk in between:
            chunk = chunk.lstrip("json").strip()
            if chunk.startswith("["):
                text = chunk
                break
    try:
        arr = json.loads(text)
        if isinstance(arr, list):
            return [str(x).strip().strip('"').strip("'") for x in arr if str(x).strip()][:n]
    except Exception:
        pass
    # fallback: 줄 단위
    out = []
    for line in text.splitlines():
        line = line.strip().lstrip("-•*").strip()
        # 번호 prefix 제거 ("1. ...", "1) ...")
        for sep in [". ", ") ", "."]:
            if line[:3].strip().rstrip(sep[0]).isdigit() and sep in line[:5]:
                line = line.split(sep, 1)[1]
                break
        line = line.strip().strip('"').strip("'").strip(",").strip()
        if 4 <= len(line) <= 80:
            out.append(line)
    return out[:n]


def gen_patient_utterances(kg: dict, n: int, model: str) -> list[str]:
    user = f"""페르소나:
{persona_summary(kg)}

이 환자가 회상요법 세션에서 다양한 주제(가족·옛 직장·고향·음식·취미·옛날 동네·날씨·건강·기억 어려움)에서 자연스럽게 할 만한 발화 {n}개를 만들어주세요.

JSON 배열로만 반환 (다른 텍스트 없이):
["발화1", "발화2", ..., "발화{n}"]"""
    raw = call_ollama(
        [{"role": "system", "content": UTT_GEN_SYSTEM},
         {"role": "user", "content": user}],
        model=model, temperature=0.95, num_predict=512,
    )
    return parse_utterances(raw, n)


def gen_response(kg: dict, utterance: str, wiki: str, model: str) -> str:
    msgs = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content":
            f"# 회상요법 도메인 참조\n\n{wiki}\n\n---\n\n"
            "위 자료는 회상요법 도메인 참조입니다. 환자 발화·화제에 맞는 부분만 자연스럽게 활용하고, "
            "그대로 인용하거나 시스템 안내처럼 읽지 않습니다."},
        {"role": "system", "content":
            f"# 환자 컨텍스트 (레미닌 정보)\n\n{persona_summary(kg)}"},
        {"role": "user", "content": utterance},
    ]
    return call_ollama(msgs, model=model, temperature=0.4, num_predict=192).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-utt", type=int, default=10, help="페르소나당 발화 수")
    ap.add_argument("--model", default="gemma4:31b")
    ap.add_argument("--limit", type=int, default=0, help="페르소나 N명만 (0=전체)")
    args = ap.parse_args()

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    print(f"[1] CAG 로드 ...")
    wiki = load_wiki()
    print(f"    CAG: {len(wiki):,} chars  (≈{len(wiki)//4:,} tokens)")

    persona_files = sorted(PERSONA_DIR.glob("P*.yaml"))
    if args.limit > 0:
        persona_files = persona_files[:args.limit]
    print(f"[2] persona: {len(persona_files)}개")

    pairs = []
    t0 = time.time()
    for i, pf in enumerate(persona_files, 1):
        kg = yaml.safe_load(open(pf))
        elapsed = time.time() - t0
        eta = elapsed / i * (len(persona_files) - i) if i > 1 else 0
        print(f"[{i:>2}/{len(persona_files)}] {kg['id']} {kg['name']} "
              f"(elapsed {elapsed:.0f}s, ETA {eta:.0f}s)")

        try:
            utts = gen_patient_utterances(kg, args.n_utt, args.model)
        except Exception as e:
            print(f"    [skip persona] 발화 generate 실패: {e}")
            continue
        print(f"    환자 발화 {len(utts)}개 → 응답 generation...")

        for j, u in enumerate(utts, 1):
            try:
                resp = gen_response(kg, u, wiki, args.model)
                pairs.append({
                    "id": f"synth_{kg['id']}_{j:02d}",
                    "source": "synth",
                    "session_id": f"synth_{kg['id']}",
                    "user": u,
                    "assistant": resp,
                    "user_emotion": None,
                    "user_risk_level": None,
                })
            except Exception as e:
                print(f"    [skip pair] {kg['id']}_{j}: {e}")

        # 매 페르소나 끝나면 누적 저장 (도중 끊겨도 보존)
        with open(OUT_PATH, "w", encoding="utf-8") as f:
            for p in pairs:
                f.write(json.dumps(p, ensure_ascii=False) + "\n")

    print(f"\n[3] 합성 완료: {len(pairs)} 페어 → {OUT_PATH}")
    print(f"    총 시간: {time.time()-t0:.0f}s")
    if pairs:
        print(f"\n[샘플 2개]")
        for p in pairs[:2]:
            print(f"  USER: {p['user']}")
            print(f"  AST:  {p['assistant']}")
            print()


if __name__ == "__main__":
    sys.exit(main())
