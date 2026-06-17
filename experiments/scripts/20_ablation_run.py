"""Step 20 — Leave-one-out ablation: 본 시스템 파이프라인 멀티턴 응답 생성.

각 arm = full 시스템에서 레이어 하나 제거(leave-one-out). app.services 실제 함수를
import 해 ``conversation.agent.run_agent`` 의 전처리(retrieval → classifier →
therapy_state → reminiscence → 프롬프트 조립 → LLM → output_filter)를 동기·배치로
재현하되, arm 플래그로 각 레이어를 on/off 한다. 환자 발화는 phase2.csv 의 30턴을
그대로 재생(통제) — 어떤 arm 이든 같은 환자 발화 시퀀스를 받는다.

RETRIEVAL = 본 시스템 AuraDB 그대로 (RetrievalService.retrieve, Neo4j P001~P030).
멀티턴 sticky anchor 는 TurnContext 로 턴 간 유지(agent.py 와 동일).

출력: data/responses/ablation_responses.jsonl — 한 줄 = (arm, scenario) 한 세트.
이후 21_ablation_judge.py 가 transcript 를 13문항 절대 채점.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path

import pandas as pd
import requests

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
AI_SERVER = REPO / "ai-server"
sys.path.insert(0, str(AI_SERVER))

from dotenv import load_dotenv  # noqa: E402

load_dotenv(REPO / ".env")

from app.config import settings  # noqa: E402
from app.conversation.context import TurnContext  # noqa: E402
from app.services.input_classifier import (  # noqa: E402
    build_guidance_for_result,
    classify_utterance,
)
from app.services.llm import (  # noqa: E402
    SYSTEM_PROMPT,
    _apply_dialect_to_system_prompt,
    _build_conversation_summary_message,
    _build_domain_cag_message,
    _build_memory_message,
    _build_time_context_message,
    _normalize_recent_messages,
    strip_emoji,
)
from app.services.output_filter import apply as output_filter_apply  # noqa: E402
from app.services.reminiscence_topics import get_service as get_reminiscence_service  # noqa: E402
from app.services.retrieval import RetrievalService  # noqa: E402
from app.services.sentiment import classify_emotion, classify_risk_level  # noqa: E402
from app.conversation.therapy_state import guidance_for_phase  # noqa: E402
from app.conversation.therapy_state import tracker as therapy_tracker  # noqa: E402

DATA_DIR = ROOT / "data"
SCENARIOS_CSV = DATA_DIR / "scenarios" / "phase2.csv"
RESPONSES_DIR = DATA_DIR / "responses"
RESPONSES_DIR.mkdir(parents=True, exist_ok=True)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "remini-stage25-book:latest")

# 본 시스템 crisis guardrail (agent.py _CRISIS_REPLY 와 동일) — 모든 arm 공통 안전.
CRISIS_REPLY = (
    "지금 많이 힘드실 수 있어요. 혼자 버티지 않으셔도 됩니다. "
    "가까운 보호자나 1393(자살예방상담전화)로 바로 도움을 요청해 주세요."
)

# -system_prompt arm: 회상요법 정체성·화법·안전 규칙을 제거한 최소 프롬프트.
MINIMAL_PROMPT = "당신은 한국어로 대화하는 도우미입니다. 사용자의 말에 자연스럽게 응답하세요."


@dataclass
class Arm:
    name: str
    system_prompt: bool = True   # False → MINIMAL_PROMPT
    cag: bool = True
    retrieval: bool = True
    classifier: bool = True
    therapy: bool = True
    reminiscence: bool = True
    output_filter: bool = True
    model: str = DEFAULT_MODEL


def build_arms() -> list[Arm]:
    """full + 7 leave-one-out (base 모델 필요한 -fine_tune 은 별도 등록 후)."""
    return [
        Arm("full"),
        Arm("-cag", cag=False),
        Arm("-retrieval", retrieval=False),
        Arm("-system_prompt", system_prompt=False),
        Arm("-classifier", classifier=False),
        Arm("-therapy_state", therapy=False),
        Arm("-reminiscence", reminiscence=False),
        Arm("-output_filter", output_filter=False),
    ]


def call_ollama(
    model: str,
    messages: list[dict[str, str]],
    temperature: float,
    num_predict: int,
    num_ctx: int,
    timeout: int = 240,
) -> str:
    payload = {
        "model": model,
        "stream": False,
        "think": False,
        "keep_alive": -1,
        "messages": messages,
        "options": {
            "temperature": temperature,
            "top_p": settings.ollama_top_p,
            "repeat_penalty": settings.ollama_repeat_penalty,
            "num_ctx": num_ctx,
            "num_predict": num_predict,
        },
    }
    r = requests.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload, timeout=timeout)
    r.raise_for_status()
    return strip_emoji(r.json()["message"]["content"]).strip()


def build_messages(
    arm: Arm,
    effective_user: str,
    context: list[str],
    recent: list[dict[str, str]],
    summary: str,
    combined_guidance: str | None,
    persona_id: str,
) -> list[dict[str, str]]:
    """llm._build_chat_messages 의 메시지 순서를 그대로 복제하되 arm 토글.

    순서: SYSTEM_PROMPT → CAG → time → memory → summary → guidance → history → user.
    """
    base_prompt = SYSTEM_PROMPT if arm.system_prompt else MINIMAL_PROMPT
    eff_prompt = _apply_dialect_to_system_prompt(base_prompt, persona_id)
    msgs: list[dict[str, str]] = [{"role": "system", "content": eff_prompt}]

    if arm.cag:
        cag = _build_domain_cag_message()  # settings.cag_enabled 는 run() 에서 arm.cag 로 세팅
        if cag:
            msgs.append({"role": "system", "content": cag})

    msgs.append({"role": "system", "content": _build_time_context_message()})
    msgs.append({"role": "system", "content": _build_memory_message(context)})

    sm = _build_conversation_summary_message(summary)
    if sm:
        msgs.append({"role": "system", "content": sm})

    if combined_guidance:
        msgs.append({"role": "system", "content": combined_guidance})

    msgs.extend(_normalize_recent_messages(recent))
    msgs.append({"role": "user", "content": effective_user})
    return msgs


def run_set(
    arm: Arm,
    row: pd.Series,
    retrieval_svc: RetrievalService,
    args: argparse.Namespace,
) -> dict:
    patient_turns = json.loads(row["patient_turns_json"])
    if args.max_turns:
        patient_turns = patient_turns[: args.max_turns]
    persona_id = str(row["persona_id"])
    scenario_id = str(row["scenario_id"])
    session_id = f"abl::{arm.name}::{scenario_id}"

    therapy_tracker().reset(session_id)  # arm·scenario 별 단계 상태 격리

    messages: list[dict[str, str]] = []   # 누적 대화 (turn/role/content)
    sticky = TurnContext()
    t0 = time.time()
    error = None

    try:
        for idx, patient_msg in enumerate(patient_turns, start=1):
            recent = [
                {"role": m["role"], "content": m["content"]} for m in messages[-8:]
            ]
            summary = "\n".join(
                f"{m['role']}: {m['content']}" for m in messages[-10:] if m.get("content")
            )

            emotion, crisis_flag = classify_emotion(patient_msg)
            _ = classify_risk_level(patient_msg, emotion, crisis_flag)

            # 본 시스템 crisis guardrail: 위기 발화면 LLM 우회 고정 응답 (모든 arm 공통).
            if crisis_flag:
                answer = CRISIS_REPLY
                messages.append({"turn": idx, "role": "user", "content": patient_msg})
                messages.append({"turn": idx, "role": "assistant", "content": answer})
                continue

            # ── retrieval (arm) ──
            context: list[str] = []
            if arm.retrieval:
                q = " ".join(
                    p for p in (
                        summary,
                        " ".join(m["content"] for m in recent[-6:]),
                        patient_msg,
                    ) if p
                ).strip()
                rr = retrieval_svc.retrieve(
                    session_id=session_id,
                    query=q,
                    user_id=persona_id,
                    recent_messages=recent,
                    conversation_summary=summary,
                    sticky=sticky,
                )
                context = rr.texts
                if rr.weights is not None or rr.topic_emb is not None or rr.anchor_name is not None:
                    sticky = TurnContext(
                        sticky_anchor_name=rr.anchor_name or sticky.sticky_anchor_name,
                        topic_emb=rr.topic_emb if rr.topic_emb is not None else sticky.topic_emb,
                        last_weights=rr.weights if rr.weights is not None else sticky.last_weights,
                        turn_count=sticky.turn_count + 1,
                    )

            # ── input classifier (arm) ──
            classifier_guidance = None
            cls_label = None
            if arm.classifier:
                cres = classify_utterance(patient_msg)
                cls_label = cres.label
                classifier_guidance = build_guidance_for_result(cres)

            # ── therapy state (arm) ──
            therapy_guidance = None
            if arm.therapy:
                phase = therapy_tracker().update(
                    session_id=session_id,
                    classifier_label=cls_label,
                    emotion=emotion,
                    user_text=patient_msg,
                )
                therapy_guidance = guidance_for_phase(phase)

            combined_guidance = (
                "\n\n".join(p for p in (classifier_guidance, therapy_guidance) if p) or None
            )

            # ── reminiscence 사진 자동 트리거 (arm) → user message 에 컨텍스트 append ──
            effective_user = patient_msg
            if arm.reminiscence:
                try:
                    svc = get_reminiscence_service()
                    trig = svc.maybe_trigger(
                        session_id=session_id,
                        user_message=patient_msg,
                        user_id=persona_id,
                        crisis_flag=crisis_flag,
                    )
                    if trig is not None:
                        effective_user = f"{patient_msg}\n\n{svc.build_llm_context(trig)}"
                except Exception:
                    pass

            msgs = build_messages(
                arm, effective_user, context, recent, summary, combined_guidance, persona_id
            )
            answer = call_ollama(
                arm.model, msgs, args.temperature, args.num_predict, args.num_ctx
            )

            # ── output filter (arm) ──
            if arm.output_filter:
                answer = output_filter_apply(answer).text

            messages.append({"turn": idx, "role": "user", "content": patient_msg})
            messages.append({"turn": idx, "role": "assistant", "content": answer})
    except Exception as exc:
        error = str(exc)

    return {
        "arm": arm.name,
        "scenario_id": scenario_id,
        "persona_id": persona_id,
        "category_id": row.get("category_id"),
        "category": row.get("category"),
        "variant": int(row["variant"]) if "variant" in row else None,
        "model": arm.model,
        "arm_flags": {
            "system_prompt": arm.system_prompt,
            "cag": arm.cag,
            "retrieval": arm.retrieval,
            "classifier": arm.classifier,
            "therapy": arm.therapy,
            "reminiscence": arm.reminiscence,
            "output_filter": arm.output_filter,
        },
        "patient_turn_count": len(patient_turns),
        "messages": messages,
        "transcript": "\n".join(
            f"{'환자' if m['role'] == 'user' else 'AI'}: {m['content']}" for m in messages
        ),
        "latency_s": round(time.time() - t0, 2),
        "error": error,
    }


def select_pilot(df: pd.DataFrame, per_category: int | None) -> pd.DataFrame:
    if not per_category:
        return df
    return df.groupby("category", sort=False).head(per_category).reset_index(drop=True)


def load_done(path: Path) -> set[tuple[str, str]]:
    done: set[tuple[str, str]] = set()
    if not path.exists():
        return done
    for line in path.open(encoding="utf-8"):
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not rec.get("error"):
            done.add((rec["arm"], rec["scenario_id"]))
    return done


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scenarios", default=str(SCENARIOS_CSV))
    ap.add_argument("--output", default=str(RESPONSES_DIR / "ablation_responses.jsonl"))
    ap.add_argument("--pilot-per-category", type=int, default=1,
                    help="카테고리별 N개만 (pilot). 0=전체 40세트")
    ap.add_argument("--arms", default="",
                    help="쉼표로 arm 선택 (예: full,-cag). 비우면 전부")
    ap.add_argument("--temperature", type=float, default=settings.ollama_temperature)
    ap.add_argument("--num-predict", type=int, default=settings.ollama_num_predict)
    ap.add_argument("--num-ctx", type=int, default=32768,
                    help="CAG(~27k) 수용 위해 32768. .env 8192 는 CAG off 전제값")
    ap.add_argument("--max-turns", type=int, default=0,
                    help="세트당 환자 발화 N턴만 (0=전체 30턴). smoke/디버그용")
    ap.add_argument("--resume", action="store_true")
    args = ap.parse_args()

    df = pd.read_csv(args.scenarios, encoding="utf-8-sig")
    df = select_pilot(df, args.pilot_per_category)

    arms = build_arms()
    if args.arms.strip():
        wanted = {a.strip() for a in args.arms.split(",") if a.strip()}
        arms = [a for a in arms if a.name in wanted]

    out_path = Path(args.output)
    done = load_done(out_path) if args.resume else set()
    mode = "a" if args.resume else "w"

    print(f"[1] scenarios={len(df)} arms={[a.name for a in arms]}")
    print(f"[2] model={DEFAULT_MODEL} num_ctx={args.num_ctx} temp={args.temperature}")
    print(f"[3] retrieval=AuraDB(Neo4j) output={out_path}")
    if done:
        print(f"[resume] completed sets={len(done)}")

    retrieval_svc = RetrievalService()
    retrieval_svc.warmup_embedder()
    print(f"[4] AuraDB available={retrieval_svc.auradb_memory.available()}")

    # classifier(e4b) warmup + 배치용 timeout. 운영값 2초는 실시간 환자 대기용이라,
    # 배치(메인 stage25-book 과 ollama 동시 사용)에서는 e4b 호출이 2초를 넘겨
    # 매번 키워드 fallback 으로 새고 -classifier arm 과 차이가 사라진다.
    # warmup 으로 e4b 를 GPU 상주시키고 timeout 을 넉넉히 둔다.
    settings.classifier_timeout_sec = 15.0
    try:
        classify_utterance("안녕하세요", timeout_sec=60.0)
        print("[5] classifier(e4b) warmup OK, batch timeout=15.0s")
    except Exception as exc:
        print(f"[5] classifier warmup skip: {exc}")

    total = len(arms) * len(df)
    n = 0
    with out_path.open(mode, encoding="utf-8") as f:
        for arm in arms:
            settings.cag_enabled = arm.cag  # CAG 메시지 게이트를 arm 에 맞춤
            for _, row in df.iterrows():
                n += 1
                if (arm.name, str(row["scenario_id"])) in done:
                    print(f"  · skip {arm.name} {row['scenario_id']} ({n}/{total})")
                    continue
                rec = run_set(arm, row, retrieval_svc, args)
                f.write(json.dumps(rec, ensure_ascii=False) + "\n")
                f.flush()
                tag = "❌" if rec.get("error") else "✓"
                print(
                    f"  {tag} {arm.name} {rec['scenario_id']} "
                    f"turns={rec['patient_turn_count']} {rec['latency_s']}s ({n}/{total})"
                    + (f" — {rec['error'][:80]}" if rec.get("error") else "")
                )

    print("✅ ablation responses done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
