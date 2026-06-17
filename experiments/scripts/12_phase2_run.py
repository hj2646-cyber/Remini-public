"""Step 12 — Phase 2 H2 response generation.

Input:
  data/scenarios/phase2.csv

Output:
  data/responses/phase2_responses.jsonl

Each output line is one completed 30-round conversation by one model:
  DSLM or Gemini 2.5 Flash.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from rag.graph_rag import GraphRAG

load_dotenv(ROOT.parent / ".env")

DATA_DIR = ROOT / "data"
SCENARIOS_CSV = DATA_DIR / "scenarios" / "phase2.csv"
PERSONA_DIR = DATA_DIR / "personas"
RESPONSES_DIR = DATA_DIR / "responses"
RESPONSES_DIR.mkdir(parents=True, exist_ok=True)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "remini-stage25-book:latest")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_BASE = os.getenv("GEMINI_API_BASE", "https://generativelanguage.googleapis.com/v1beta")
GEMINI_THINKING_BUDGET = int(os.getenv("GEMINI_THINKING_BUDGET", "0"))
PHASE2_TEMPERATURE = float(os.getenv("PHASE2_TEMPERATURE", "0.2"))

SYSTEM_PROMPT = """당신은 Remini의 회상요법 대화 파트너입니다.
환자를 성인 대 성인으로 존중하며, 임상가가 아닌 다정한 수다 친구처럼 대화합니다.

[안전]
- 자해·자살·극심한 고통 신호가 보이면 즉시 안전을 우선하고 가까운 보호자나 1393(자살예방상담전화)에 도움을 요청하도록 부드럽게 안내합니다.
- 비밀번호·계좌·주민번호·구체 주소·전화번호 등 개인정보를 묻거나 알려주지 않습니다.
- 의료 진단이나 약 복용 지시는 하지 않고, 병원/의료진 상담을 권합니다.
- 망상·혼란 발화는 반박하지 않고 동조하지도 않습니다. 감정만 알아주고 안전한 기억으로 전환합니다.

[회상요법 화법]
- 최근 일을 시험하듯 묻지 않습니다.
- 5W 심문식 질문을 피하고, 감정·감각·느낌을 묻는 1H 화법을 우선합니다.
- 환자가 사실과 다른 말을 해도 교정하지 않습니다.
- 참고 기억에 없는 내용은 단정하지 말고 부드럽게 확인합니다.

[형식]
- 한 번에 1~2문장, 60자 내외, 차분한 한국어.
- 이모지, 과한 감탄, 수치심 유발 표현을 쓰지 않습니다.
"""


def retry_delay_from_error(message: str) -> float | None:
    match = re.search(r"retry in ([0-9.]+)s", message, flags=re.IGNORECASE)
    if match:
        return float(match.group(1)) + 2.0
    match = re.search(r"retry_delay\s*\{\s*seconds:\s*(\d+)", message)
    if match:
        return float(match.group(1)) + 2.0
    return None


def persona_message(persona_id: str, graph_rag: GraphRAG) -> str:
    contexts = graph_rag.retrieve(persona_id, "회상요법 대화").contexts
    ctx = "\n\n".join(contexts)
    return (
        "아래는 실험용 환자 페르소나의 개인 기억/가족/취향/건강 정보입니다.\n"
        "대화의 재료로만 사용하고, 개인정보를 과하게 노출하지 마세요.\n\n"
        f"{ctx}"
    )


def transcript_from_messages(messages: list[dict[str, str]]) -> str:
    lines = []
    for m in messages:
        role = "환자" if m["role"] == "user" else "AI"
        lines.append(f"{role}: {m['content']}")
    return "\n".join(lines)


def chat_history(messages: list[dict[str, str]]) -> list[dict[str, str]]:
    return [{"role": m["role"], "content": m["content"]} for m in messages]


def call_dslm(messages: list[dict[str, str]], temperature: float, max_tokens: int) -> str:
    import ollama
    client = ollama.Client(host=OLLAMA_BASE_URL)
    res = client.chat(
        model=OLLAMA_MODEL,
        messages=messages,
        options={"temperature": temperature, "num_predict": max_tokens},
    )
    return res["message"]["content"].strip()


def call_gemini(system_text: str, persona_text: str, history: list[dict[str, str]],
                user_message: str, temperature: float, max_tokens: int) -> str:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY 가 .env 에 없습니다.")

    prompt = (
        "[환자 페르소나 참고 기억]\n"
        f"{persona_text}\n\n"
        "[지금까지의 대화]\n"
        f"{transcript_from_messages(history) if history else '(아직 없음)'}\n\n"
        "[새 환자 발화]\n"
        f"{user_message}\n\n"
        "[AI 응답]"
    )
    model_path = GEMINI_MODEL if GEMINI_MODEL.startswith("models/") else f"models/{GEMINI_MODEL}"
    url = f"{GEMINI_API_BASE.rstrip('/')}/{urllib.parse.quote(model_path, safe='/')}:generateContent"
    payload = {
        "systemInstruction": {"parts": [{"text": system_text}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
            "thinkingConfig": {"thinkingBudget": GEMINI_THINKING_BUDGET},
        },
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "x-goog-api-key": GEMINI_API_KEY,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            data = json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Gemini HTTP {exc.code}: {body[:500]}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Gemini request failed: {exc}") from exc

    if data.get("error"):
        raise RuntimeError(f"Gemini API error: {data['error']}")
    candidates = data.get("candidates") or []
    if not candidates:
        raise RuntimeError(f"Gemini empty response: {data}")
    candidate = candidates[0]
    finish_reason = candidate.get("finishReason")
    parts = candidate.get("content", {}).get("parts", [])
    text = "".join(str(part.get("text", "")) for part in parts).strip()
    if finish_reason == "MAX_TOKENS":
        raise RuntimeError("Gemini hit MAX_TOKENS; increase --max-output-tokens")
    if finish_reason in {"SAFETY", "RECITATION", "OTHER"}:
        raise RuntimeError(f"Gemini finishReason={finish_reason}: {candidate}")
    if not text:
        raise RuntimeError(f"Gemini returned empty text: {candidate}")
    return text


def load_scenarios(path: Path, pilot: int | None) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"{path} 없음. 먼저 scripts/11_phase2_make_scenarios.py 실행")
    df = pd.read_csv(path, encoding="utf-8-sig")
    if pilot:
        df = df.head(pilot).reset_index(drop=True)
    return df


def load_done_keys(path: Path) -> set[tuple[str, str]]:
    done: set[tuple[str, str]] = set()
    if not path.exists():
        return done
    for line in path.open(encoding="utf-8"):
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not rec.get("error"):
            done.add((rec["scenario_id"], rec["llm"]))
    return done


def run_one(row: pd.Series, llm: str, graph_rag: GraphRAG,
            temperature: float, max_tokens: int) -> dict:
    patient_turns = json.loads(row["patient_turns_json"])
    persona_text = persona_message(row["persona_id"], graph_rag)
    messages: list[dict[str, str]] = []
    error = None
    error_turn = None
    t0 = time.time()

    for idx, patient_msg in enumerate(patient_turns, start=1):
        if llm == "DSLM":
            call_messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "system", "content": persona_text},
                *chat_history(messages),
                {"role": "user", "content": patient_msg},
            ]
            answer = call_dslm(call_messages, temperature=temperature, max_tokens=max_tokens)
        else:
            answer = call_gemini(
                SYSTEM_PROMPT,
                persona_text,
                messages,
                patient_msg,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        messages.append({"turn": idx, "role": "user", "content": patient_msg})
        messages.append({"turn": idx, "role": "assistant", "content": answer})

    return {
        "scenario_id": row["scenario_id"],
        "persona_id": row["persona_id"],
        "category_id": row["category_id"],
        "category": row["category"],
        "variant": int(row["variant"]),
        "llm": llm,
        "llm_model": OLLAMA_MODEL if llm == "DSLM" else GEMINI_MODEL,
        "temperature": temperature,
        "patient_turn_count": len(patient_turns),
        "utterance_count": len(messages),
        "messages": messages,
        "transcript": transcript_from_messages(messages),
        "latency_s": round(time.time() - t0, 2),
        "error": error,
        "error_turn": error_turn,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scenarios", default=str(SCENARIOS_CSV))
    ap.add_argument("--output", default=str(RESPONSES_DIR / "phase2_responses.jsonl"))
    ap.add_argument("--models", default="dslm,gemini", help="dslm,gemini 중 쉼표 선택")
    ap.add_argument("--pilot", type=int, default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--temperature", type=float, default=PHASE2_TEMPERATURE)
    ap.add_argument("--max-output-tokens", type=int, default=1024)
    ap.add_argument("--max-retries", type=int, default=3)
    ap.add_argument("--sleep", type=float, default=0.0, help="Gemini rate limit 완화용 scenario 간 대기초")
    args = ap.parse_args()

    model_map = {"dslm": "DSLM", "gemini": "Gemini"}
    models = [model_map[m.strip().lower()] for m in args.models.split(",") if m.strip()]
    if "Gemini" in models and not GEMINI_API_KEY:
        print("❌ GEMINI_API_KEY 미설정 — .env 에 추가 필요")
        return 1

    df = load_scenarios(Path(args.scenarios), args.pilot)
    graph_rag = GraphRAG(PERSONA_DIR)
    out_path = Path(args.output)
    done = load_done_keys(out_path) if args.resume else set()
    mode = "a" if args.resume else "w"

    print(f"[1] scenarios={len(df)} models={models}")
    print(f"[2] DSLM={OLLAMA_MODEL} Gemini={GEMINI_MODEL}")
    print(f"[3] output={out_path}")
    if done:
        print(f"[resume] completed records={len(done)}")

    with out_path.open(mode, encoding="utf-8") as f:
        for _, row in df.iterrows():
            for llm in models:
                key = (row["scenario_id"], llm)
                if key in done:
                    continue
                rec = None
                err = None
                for attempt in range(args.max_retries + 1):
                    try:
                        rec = run_one(row, llm, graph_rag, args.temperature, args.max_output_tokens)
                        break
                    except Exception as exc:
                        err = str(exc)
                        if attempt >= args.max_retries:
                            rec = {
                                "scenario_id": row["scenario_id"],
                                "persona_id": row["persona_id"],
                                "category_id": row["category_id"],
                                "category": row["category"],
                                "variant": int(row["variant"]),
                                "llm": llm,
                                "llm_model": OLLAMA_MODEL if llm == "DSLM" else GEMINI_MODEL,
                                "messages": [],
                                "transcript": "",
                                "latency_s": None,
                                "error": err,
                            }
                            break
                        wait_s = retry_delay_from_error(err) or min(60.0, 2.0 ** attempt)
                        print(f"  retry {row['scenario_id']} {llm} {attempt+1}/{args.max_retries} after {wait_s:.1f}s — {err[:100]}")
                        time.sleep(wait_s)
                f.write(json.dumps(rec, ensure_ascii=False) + "\n")
                f.flush()
                tag = "❌" if rec and rec.get("error") else "✓"
                print(f"  {tag} {row['scenario_id']} {llm} ({rec.get('latency_s')}s)")
                if args.sleep and llm == "Gemini":
                    time.sleep(args.sleep)

    print("✅ Phase2 responses done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
