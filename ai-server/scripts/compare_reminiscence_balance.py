"""회상 PUSH→PULL 밸런싱 — Before/After 비교 evidence 생성.

2026-06-01 변경(프롬프트·로직 5곳)의 효과를 같은 환자 발화 대본으로
before(수정 전) vs after(수정 후) 파이프라인에 각각 멀티턴으로 흘려
실제 LLM 응답을 나란히 비교한다.

Before 재현 방식
----------------
수정한 4개 파일이 아직 커밋되지 않았으므로 ``git show HEAD:<path>`` 로
수정 전 소스를 임시 모듈로 로드한다. 이렇게 하면 OLD SYSTEM_PROMPT /
OLD build_guidance_for_result(일상확인형→None) / OLD therapy(3턴 진입,
옛 문구) / OLD reminiscence 상수(4/7턴) 가 추측 없이 그대로 재현된다.

통제 변수
---------
바뀐 5곳만 변수. retrieval/KG·CAG 는 양쪽 모두 off(context=[]) 로 고정해
프롬프트·로직 레이어의 순수 효과만 본다.

실행:
    cd ai-server && .venv/bin/python scripts/compare_reminiscence_balance.py
"""
from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parents[2]
AI_SERVER = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(AI_SERVER))  # `app` 패키지 import 가능하게
EVIDENCE_DIR = REPO_ROOT / "docs" / "presentation" / "evidence"
LOGS_DIR = REPO_ROOT / "docs" / "presentation" / "logs"
STAMP = "2026-06-01"

# ── 현재(after) 모듈 ───────────────────────────────────────────
from app.config import settings  # noqa: E402
from app.services.llm import (  # noqa: E402
    SYSTEM_PROMPT as NEW_SYS,
    _build_chat_messages,
    strip_emoji,
)
from app.services.input_classifier import (  # noqa: E402
    classify_utterance,
    build_guidance_for_result as new_build_guidance,
)
from app.conversation.therapy_state import (  # noqa: E402
    TherapyStateTracker as NewTracker,
    guidance_for_phase as new_gfp,
)
import app.services.reminiscence_topics as new_rt  # noqa: E402


# ── git HEAD(before) 모듈 로드 ─────────────────────────────────
def load_at_head(git_path: str, alias: str):
    src = subprocess.check_output(
        ["git", "show", f"HEAD:{git_path}"], cwd=str(REPO_ROOT), text=True
    )
    spec = importlib.util.spec_from_loader(alias, loader=None)
    mod = importlib.util.module_from_spec(spec)
    mod.__file__ = str(REPO_ROOT / git_path)
    sys.modules[alias] = mod
    exec(compile(src, git_path, "exec"), mod.__dict__)
    return mod


old_llm = load_at_head("ai-server/app/services/llm.py", "_old_llm")
old_cls = load_at_head("ai-server/app/services/input_classifier.py", "_old_cls")
old_th = load_at_head("ai-server/app/conversation/therapy_state.py", "_old_th")
old_rt = load_at_head("ai-server/app/services/reminiscence_topics.py", "_old_rt")

OLD_SYS = old_llm.SYSTEM_PROMPT
old_build_guidance = old_cls.build_guidance_for_result
OldTracker = old_th.TherapyStateTracker
old_gfp = old_th.guidance_for_phase


# ── ollama 메인 chat 호출 (llm.chat_with_ollama 와 동일 옵션) ──
def ollama_chat(messages: list[dict]) -> str:
    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "think": False,
        "keep_alive": settings.ollama_keep_alive,
        "messages": messages,
        "options": {
            "temperature": settings.ollama_temperature,
            "top_p": settings.ollama_top_p,
            "repeat_penalty": settings.ollama_repeat_penalty,
            "num_ctx": settings.ollama_num_ctx,
            "num_predict": settings.ollama_num_predict,
        },
    }
    r = requests.post(
        f"{settings.ollama_base_url}/api/chat", json=payload, timeout=180
    )
    r.raise_for_status()
    return strip_emoji(r.json()["message"]["content"])


# ── 시나리오 (환자 발화 대본 — AI 응답과 무관한 독립 진술) ─────
SCENARIOS = {
    "A_일상잡담": {
        "desc": "회상 신호 없는 평범한 일상 대화. before가 회상으로 끌고 가는지 / after가 일상에 머무는지.",
        "turns": [
            "오늘 점심에 김치찌개 먹었어",
            "날씨가 쌀쌀하니까 따뜻한 게 좋더라고",
            "텔레비전 켜니까 트로트가 나오더라",
            "그냥 집에서 푹 쉬었지 뭐",
            "응 별일 없었어",
            "그러게 말이야",
        ],
    },
    "B_회상신호": {
        "desc": "환자가 먼저 옛 기억을 꺼냄. after가 회상을 죽인 게 아니라 PULL(따라가기)은 유지함을 증명.",
        "turns": [
            "옛날에 우리 어머니가 김치찌개를 참 맛있게 끓이셨는데",
            "큰 가마솥에다가 푹 끓이셨어",
            "그땐 식구가 많아서 늘 북적북적했지",
        ],
    },
}

REMIN_MARKERS = ["옛날", "예전", "어릴", "어렸", "젊었", "그때", "추억", "사진", "고향", "지난날"]


def count_markers(text: str) -> int:
    return sum(text.count(m) for m in REMIN_MARKERS)


def run_track(track: str, scenario_key: str, turns: list[str]) -> list[dict]:
    """한 트랙(before/after)을 한 시나리오에 대해 멀티턴 실행."""
    if track == "before":
        sysprompt, build_fn, tracker, gfp, remin = (
            OLD_SYS, old_build_guidance, OldTracker(), old_gfp,
            old_rt.ReminiscencePhotoService(),
        )
        msg_builder = old_llm._build_chat_messages
    else:
        sysprompt, build_fn, tracker, gfp, remin = (
            NEW_SYS, new_build_guidance, NewTracker(), new_gfp,
            new_rt.ReminiscencePhotoService(),
        )
        msg_builder = _build_chat_messages

    session_id = f"cmp-{track}-{scenario_key}"
    history: list[dict] = []
    rows: list[dict] = []

    for i, user_text in enumerate(turns, start=1):
        cls = classify_utterance(user_text, timeout_sec=30.0)  # cold-start 여유
        cguide = build_fn(cls)
        phase = tracker.update(
            session_id=session_id,
            classifier_label=cls.label,
            emotion=None,  # 통제: 감정분류 LLM 제외 (positive_streak 영향 無)
            user_text=user_text,
        )
        tguide = gfp(phase)
        combined = "\n\n".join(p for p in (cguide, tguide) if p) or None

        trig = remin.maybe_trigger(session_id=session_id, user_message=user_text)
        trig_mode = trig.get("mode") if isinstance(trig, dict) else None
        effective_user = user_text
        if trig_mode:
            try:
                effective_user = f"{user_text}\n\n{remin.build_llm_context(trig)}"
            except Exception:
                pass

        messages = msg_builder(
            effective_user,
            context=[],  # 통제: KG/retrieval off
            recent_messages=history,
            conversation_summary=None,
            system_prompt=sysprompt,
            user_id=None,
            classifier_guidance=combined,
        )
        reply = ollama_chat(messages)

        rows.append({
            "turn": i,
            "user": user_text,
            "label": cls.label,
            "phase": phase.value if hasattr(phase, "value") else str(phase),
            "remin_trigger": trig_mode or "-",
            "reply": reply,
            "markers": count_markers(reply),
            "questions": reply.count("?") + reply.count("？"),
        })
        history = history + [
            {"role": "user", "content": user_text},
            {"role": "assistant", "content": reply},
        ]
        print(f"  [{track}] {scenario_key} 턴{i} 완료 (label={cls.label}, phase={rows[-1]['phase']}, trig={trig_mode or '-'})")

    return rows


def main() -> None:
    EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")

    # 분류기(gemma4:e4b) cold-load 워밍업 — 첫 호출 timeout 방지
    print("분류기 워밍업...")
    try:
        w = classify_utterance("안녕하세요 오늘 날씨가 좋네요", timeout_sec=90.0)
        print(f"  분류기 OK (label={w.label}, {w.latency_ms:.0f}ms)")
    except Exception as exc:
        print(f"  분류기 워밍업 실패: {exc}")

    results: dict = {}
    for skey, sc in SCENARIOS.items():
        print(f"\n=== 시나리오 {skey} ===")
        results[skey] = {
            "desc": sc["desc"],
            "before": run_track("before", skey, sc["turns"]),
            "after": run_track("after", skey, sc["turns"]),
        }

    # raw json
    raw_path = LOGS_DIR / f"reminiscence_balance_raw_{STAMP}.json"
    raw_path.write_text(
        json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # markdown evidence
    md: list[str] = []
    md.append("# 회상 PUSH→PULL 밸런싱 — Before / After 비교")
    md.append("")
    md.append(f"- 생성: {ts}")
    md.append(f"- 모델: `{settings.ollama_model}` (temp {settings.ollama_temperature}, top_p {settings.ollama_top_p}, num_predict {settings.ollama_num_predict})")
    md.append(f"- 분류기: `{settings.classifier_model}` (enabled={settings.classifier_enabled})")
    md.append("- 통제: retrieval/KG·CAG 양쪽 off(context=[]). 바뀐 5곳만 변수.")
    md.append("- Before 재현: `git show HEAD:<path>` 로 수정 전 4개 모듈 로드 (SYSTEM_PROMPT / classifier guidance / therapy 진입·문구 / reminiscence 상수).")
    md.append("")
    md.append("## 변경 5곳 (2026-06-01)")
    md.append("")
    md.append("| # | 파일 | before → after |")
    md.append("|---|---|---|")
    md.append("| ① | llm.py SYSTEM_PROMPT 정체성 | 회상 파트너 → +\"매 턴 회상으로 끌지 않음, 일상 화제는 그 자리에서\" |")
    md.append("| ② | llm.py 화법 | +\"감탄·맞장구·농담 허용, 매 턴 회상 질문으로 안 끝냄\" |")
    md.append("| ③ | input_classifier 일상확인형 | None → 일상 말동무 가이드(센스있게 맞장구) |")
    md.append("| ④ | therapy_state EXPLORATION 진입 | 3턴 → 5턴, 가이드 문구 완화 |")
    md.append("| ⑤ | reminiscence 트리거 | 첫 권유 4→6턴, 재권유 7→12턴 |")
    md.append("")

    # 메커니즘 요약 (트랙 실행에서 자동 추출)
    md.append("## 메커니즘 요약 (결정적 — LLM 무관)")
    md.append("")
    md.append("| 시나리오 | 지표 | before | after |")
    md.append("|---|---|---|---|")
    for skey, r in results.items():
        for track in ("before", "after"):
            pass
        # EXPLORATION 첫 진입 턴
        def first_phase_turn(rows, ph):
            for x in rows:
                if x["phase"] == ph:
                    return x["turn"]
            return None
        def first_trig_turn(rows):
            for x in rows:
                if x["remin_trigger"] not in ("-", None):
                    return x["turn"], x["remin_trigger"]
            return None, None
        b, a = r["before"], r["after"]
        be, ae = first_phase_turn(b, "EXPLORATION"), first_phase_turn(a, "EXPLORATION")
        bt, btm = first_trig_turn(b)
        at, atm = first_trig_turn(a)
        b_mark = sum(x["markers"] for x in b)
        a_mark = sum(x["markers"] for x in a)
        b_q = sum(x["questions"] for x in b)
        a_q = sum(x["questions"] for x in a)
        md.append(f"| {skey} | EXPLORATION 첫 진입 | {('턴'+str(be)) if be else '—'} | {('턴'+str(ae)) if ae else '—'} |")
        md.append(f"| {skey} | 회상 사진 첫 권유 | {('턴'+str(bt)+'('+btm+')') if bt else '—'} | {('턴'+str(at)+'('+atm+')') if at else '—'} |")
        md.append(f"| {skey} | 회상유도 마커 총합 | {b_mark} | {a_mark} |")
        md.append(f"| {skey} | 질문(?) 총개수 | {b_q} | {a_q} |")
    md.append("")

    # 턴별 응답 비교
    for skey, r in results.items():
        md.append(f"## 시나리오 {skey}")
        md.append("")
        md.append(f"> {r['desc']}")
        md.append("")
        for i in range(len(r["before"])):
            b = r["before"][i]
            a = r["after"][i]
            md.append(f"### 턴 {b['turn']} — 환자: \"{b['user']}\"")
            md.append("")
            md.append(f"- 분류: `{b['label']}`")
            md.append(f"- **[BEFORE]** 단계=`{b['phase']}` 사진트리거=`{b['remin_trigger']}`")
            md.append(f"  > {b['reply']}")
            md.append(f"- **[AFTER]** 단계=`{a['phase']}` 사진트리거=`{a['remin_trigger']}`")
            md.append(f"  > {a['reply']}")
            md.append("")

    md.append("## 관찰 (작성자 해석)")
    md.append("")
    md.append("_(스크립트 실행 후 응답을 읽고 채움)_")
    md.append("")

    md_path = EVIDENCE_DIR / f"reminiscence_balance_before_after_{STAMP}.md"
    md_path.write_text("\n".join(md), encoding="utf-8")

    print(f"\n✅ evidence md → {md_path}")
    print(f"✅ raw json   → {raw_path}")


if __name__ == "__main__":
    main()
