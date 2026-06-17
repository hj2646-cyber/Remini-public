"""
26 — CareCall 페어 추출 (Stage 2.6)

input:  finetune/data/external/carecall-corpus/data/carecall_filtered_10k.json
        finetune/data/external/carecall-corpus/data/carecall_feedback_100.json
output: finetune/data/v2/pairs_carecall.jsonl

흐름:
  1. JSON 로드
  2. 각 dialogue 에서 (이전 user 발화, 다음 system 응답) 페어 추출
  3. system 응답이 out-of-bounds=True 면 제외 (role spec 위반)
  4. 길이 필터 (user 1-200자, assistant 3-200자)
  5. dedup + 셔플 → jsonl 저장

데이터 출처: NAVER CareCall (Bae et al., NAACL 2022)
            https://github.com/naver-ai/carecall-corpus
            License: CC-BY-NC-SA 4.0
"""
import json
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC_FILTERED = ROOT / "finetune" / "data" / "external" / "carecall-corpus" / "data" / "carecall_filtered_10k.json"
SRC_FEEDBACK = ROOT / "finetune" / "data" / "external" / "carecall-corpus" / "data" / "carecall_feedback_100.json"
OUT_PATH = ROOT / "finetune" / "data" / "v2" / "pairs_carecall.jsonl"


def extract_pairs(dialogues: list[dict], skip_oob: bool = True) -> list[dict]:
    """dialogue list → (user, system) 페어 리스트.

    out-of-bounds=True 응답은 skip (role spec 위반).
    feedback set 은 out-of-bounds 필드 없음 (사람이 다 fix 함) → 무조건 포함.
    """
    pairs = []
    for d in dialogues:
        guid = d.get("guid", "")
        turns = d.get("data", [])
        prev_user = None
        for t in turns:
            role = t.get("role")
            text = (t.get("text") or t.get("utterance") or "").strip()
            oob = t.get("out-of-bounds", False)

            if role == "user":
                prev_user = text
            elif role == "system":
                if prev_user is None:
                    continue  # 첫 인사 skip (user 발화에 대한 응답이 아님)
                if skip_oob and oob:
                    prev_user = None
                    continue
                # 길이 필터
                if not (1 <= len(prev_user) <= 200):
                    prev_user = None
                    continue
                if not (3 <= len(text) <= 200):
                    prev_user = None
                    continue
                pairs.append({
                    "user": prev_user,
                    "assistant": text,
                    "source": "carecall",
                    "guid": guid,
                    "system_persona": "",
                })
                prev_user = None  # 같은 user 발화에 여러 system 응답 매핑 방지
    return pairs


def main():
    if not SRC_FILTERED.exists():
        print(f"ERROR: {SRC_FILTERED} 없음. CareCall git clone 먼저.")
        return 1

    print(f"[1] CareCall 로드")
    filtered = json.loads(SRC_FILTERED.read_text(encoding="utf-8"))
    feedback = json.loads(SRC_FEEDBACK.read_text(encoding="utf-8"))
    print(f"   filtered_10k: {len(filtered)} dialogues")
    print(f"   feedback_100: {len(feedback)} dialogues")

    print(f"[2] 페어 추출 (out-of-bounds=True skip)")
    pairs_filtered = extract_pairs(filtered, skip_oob=True)
    pairs_feedback = extract_pairs(feedback, skip_oob=False)  # feedback 은 oob 필드 없음
    print(f"   filtered → {len(pairs_filtered)} pairs")
    print(f"   feedback → {len(pairs_feedback)} pairs")

    all_pairs = pairs_feedback + pairs_filtered  # feedback 우선 (사람 검수)

    # dedup (user+assistant 조합)
    seen = set()
    deduped = []
    for p in all_pairs:
        key = (p["user"], p["assistant"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(p)
    print(f"   dedup: {len(all_pairs)} → {len(deduped)}")

    rng = random.Random(42)
    rng.shuffle(deduped)

    print(f"[3] jsonl 저장 → {OUT_PATH}")
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        for p in deduped:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    # 통계
    user_lens = [len(p["user"]) for p in deduped]
    asst_lens = [len(p["assistant"]) for p in deduped]
    print(f"\n[stats]")
    print(f"   total pairs: {len(deduped)}")
    print(f"   user len: avg={sum(user_lens)/len(user_lens):.1f} max={max(user_lens)}")
    print(f"   asst len: avg={sum(asst_lens)/len(asst_lens):.1f} max={max(asst_lens)}")
    print(f"   feedback (사람 검수): {len(pairs_feedback)} 우선 배치")

    # 샘플 5개
    print(f"\n[sample 5]")
    for i, p in enumerate(deduped[:5], 1):
        print(f"  [{i}] user: {p['user']}")
        print(f"      asst: {p['assistant']}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
