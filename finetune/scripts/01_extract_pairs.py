"""
01 — conversations.db + 대화로그_*.txt → (user, assistant) 페어 raw 추출

전략:
  conversations.db: session_id 별 시간순 정렬 → 인접한 (user → assistant) 추출
  대화로그_*.txt:    "환자:" / "보호자:" 등 헤더 패턴 파싱
  → data/pairs/raw_pairs.jsonl

각 페어 형식:
  {
    "id": "src_session_idx",
    "source": "db" | "log",
    "session_id": "...",
    "user": "환자 발화",
    "assistant": "이전 시스템 응답",
    "user_emotion": "...",     # db 만
    "user_risk_level": "...",  # db 만
    "raw_meta": {...}
  }
"""

import json
import re
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]  # Remini/
DB_PATH = ROOT / "ai-server" / "data" / "conversations.db"
LOG_GLOB = sorted(ROOT.glob("대화로그_*.txt"))
OUT_PATH = ROOT / "finetune" / "data" / "pairs" / "raw_pairs.jsonl"


def extract_db_pairs() -> list[dict]:
    if not DB_PATH.exists():
        print(f"[skip] {DB_PATH} 없음")
        return []
    conn = sqlite3.connect(DB_PATH)
    cur = conn.execute(
        "SELECT id, session_id, speaker, content, emotion, risk_level, created_at "
        "FROM conversations ORDER BY session_id, created_at, id"
    )
    rows = cur.fetchall()
    conn.close()

    pairs = []
    by_session: dict[str, list] = {}
    for r in rows:
        by_session.setdefault(r[1], []).append(r)

    for sid, msgs in by_session.items():
        for i in range(len(msgs) - 1):
            cur, nxt = msgs[i], msgs[i + 1]
            if cur[2] == "user" and nxt[2] == "assistant":
                pairs.append({
                    "id": f"db_{sid}_{cur[0]}",
                    "source": "db",
                    "session_id": sid,
                    "user": cur[3].strip(),
                    "assistant": nxt[3].strip(),
                    "user_emotion": cur[4],
                    "user_risk_level": cur[5],
                    "created_at": cur[6],
                })
    return pairs


def extract_log_pairs() -> list[dict]:
    """대화로그_*.txt — 다양한 포맷 가능. 보통 '환자:'/'시스템:'/'AI:' 헤더."""
    pairs = []
    speaker_pat = re.compile(r"^\s*(환자|레미닌|user|User|USER|시스템|레미니션|assistant|AI|ai)\s*[:：]\s*(.*)$")
    user_role = {"환자", "레미닌", "user", "User", "USER"}

    for log_path in LOG_GLOB:
        # 전문가용 로그는 패턴이 다를 수 있어 우선 시도
        text = log_path.read_text(encoding="utf-8", errors="ignore")
        # 줄 단위로 speaker, content 추출
        turns = []
        cur_role, cur_text = None, []
        for line in text.splitlines():
            m = speaker_pat.match(line)
            if m:
                if cur_role:
                    turns.append((cur_role, "\n".join(cur_text).strip()))
                role = "user" if m.group(1) in user_role else "assistant"
                cur_role = role
                cur_text = [m.group(2)]
            elif cur_role:
                cur_text.append(line)
        if cur_role:
            turns.append((cur_role, "\n".join(cur_text).strip()))

        # 인접 (user, assistant) 추출
        for i in range(len(turns) - 1):
            r1, t1 = turns[i]
            r2, t2 = turns[i + 1]
            if r1 == "user" and r2 == "assistant" and t1 and t2:
                pairs.append({
                    "id": f"log_{log_path.stem}_{i}",
                    "source": "log",
                    "session_id": log_path.stem,
                    "user": t1,
                    "assistant": t2,
                    "user_emotion": None,
                    "user_risk_level": None,
                    "created_at": None,
                })
    return pairs


def main():
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    db_pairs = extract_db_pairs()
    log_pairs = extract_log_pairs()
    all_pairs = db_pairs + log_pairs

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        for p in all_pairs:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    print(f"[1] DB 페어:        {len(db_pairs):>4}")
    print(f"[2] 대화로그 페어:    {len(log_pairs):>4}")
    print(f"[3] 합계:           {len(all_pairs):>4}")
    print(f"[4] 출력: {OUT_PATH}")

    # 샘플 3개 출력
    print("\n[샘플 3개]")
    for p in all_pairs[:3]:
        print(f"  source={p['source']} session={p['session_id']}")
        print(f"    USER:      {p['user'][:80]}")
        print(f"    ASSISTANT: {p['assistant'][:80]}")
        print()


if __name__ == "__main__":
    sys.exit(main())
