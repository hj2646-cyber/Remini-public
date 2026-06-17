"""
30 — AI Hub 107 (자유대화 노인남녀) 데이터 구조 파싱 + (wav, transcript) 매칭 검증

다운 결과:
  finetune/data/aihub_107/        Plan A — 스튜디오 + AI스피커 (52G)
  finetune/data/aihub_107_vsd/    Plan B — 음성수집도구 1zip (29G)

산출물:
  finetune/data/aihub_107/_stats.json     - 카테고리/주제/지역/나이/duration 통계
  finetune/data/aihub_107/utterances.jsonl - (wav_path, transcript, meta) 페어
"""

import argparse
import json
import sys
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
A = ROOT / "finetune" / "data" / "aihub_107"
B = ROOT / "finetune" / "data" / "aihub_107_vsd"
OUT_STATS = A / "_stats.json"
OUT_UTT = A / "utterances.jsonl"


def find_label_jsons(root: Path) -> list[Path]:
    """라벨링 JSON 들 (.json, 화자 디렉토리 구조). 압축해제 안 됐으면 빈 list."""
    return list(root.rglob("*.json"))


def find_wav(label_json: Path, file_nm: str) -> Path | None:
    """JSON 의 fileNm 으로 원천데이터 wav 찾기.

    라벨링 구조: .../1.라벨링데이터_0913_add/<카테고리>/<화자_dir>/*.json
    원천 구조:   .../2.원천데이터_0913_add/<카테고리>/<화자_dir>/*.wav
    같은 카테고리 하위에서 .json → .wav 치환 + 라벨링/원천 경로 변환.
    """
    s = str(label_json)
    candidates = [
        s.replace("1.라벨링데이터_0913_add", "2.원천데이터_0913_add").replace(".json", ".wav"),
        s.replace("1.라벨링데이터_0913_add", "2.원천데이터_1022_add").replace(".json", ".wav"),
    ]
    for c in candidates:
        p = Path(c)
        if p.exists():
            return p
    # fileNm 기반 fallback (wav 가 별도 위치)
    if file_nm:
        wav_name = file_nm if file_nm.lower().endswith(".wav") else f"{file_nm}.wav"
        # 같은 화자 dir 에 있는지
        parent_wavs = list(label_json.parent.glob(wav_name))
        if parent_wavs:
            return parent_wavs[0]
    return None


def parse(root: Path, label: str, limit: int | None = None) -> tuple[list[dict], dict]:
    jsons = find_label_jsons(root)
    print(f"[{label}] label JSONs: {len(jsons):,}", file=sys.stderr)
    if limit:
        jsons = jsons[:limit]

    rows = []
    stats = {
        "label": label,
        "total_jsons": len(jsons),
        "themes": Counter(),
        "ages": Counter(),
        "genders": Counter(),
        "regions": Counter(),
        "recrd_envrn": Counter(),
        "recrd_unit": Counter(),
        "wav_found": 0,
        "wav_missing": 0,
        "duration_sec_sum": 0.0,
    }

    for jp in jsons:
        try:
            d = json.load(open(jp, encoding="utf-8"))
        except Exception:
            continue

        u = d.get("발화정보", {})
        c = d.get("대화정보", {})
        r = d.get("녹음자정보", {})

        text = (u.get("stt") or "").strip()
        if not text:
            continue
        file_nm = u.get("fileNm") or ""
        wav = find_wav(jp, file_nm)

        if wav:
            stats["wav_found"] += 1
        else:
            stats["wav_missing"] += 1

        stats["themes"][c.get("convrsThema", "?")] += 1
        stats["ages"][str(r.get("age", "?"))] += 1
        stats["genders"][r.get("gender", "?")] += 1
        stats["regions"][c.get("cityCode", "?")] += 1
        stats["recrd_envrn"][c.get("recrdEnvrn", "?")] += 1
        stats["recrd_unit"][c.get("recrdUnit", "?")] += 1
        try:
            stats["duration_sec_sum"] += float(u.get("recrdTime", 0) or 0)
        except Exception:
            pass

        if wav:
            rows.append({
                "wav_path": str(wav),
                "transcript": text,
                "duration_sec": float(u.get("recrdTime", 0) or 0),
                "theme": c.get("convrsThema", ""),
                "age": r.get("age"),
                "gender": r.get("gender"),
                "region": c.get("cityCode"),
                "recrd_envrn": c.get("recrdEnvrn"),
                "recrd_unit": c.get("recrdUnit"),
                "category": label,  # studio | aispeaker | vsd
            })

    return rows, stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None, help="JSON 처리 제한 (debug)")
    args = ap.parse_args()

    all_rows = []
    all_stats = {}

    for root, label in [
        (A, "plan_a"),
        (B, "vsd"),
    ]:
        if not root.exists():
            print(f"[skip] {root} 없음", file=sys.stderr)
            continue
        rows, stats = parse(root, label, args.limit)
        all_rows.extend(rows)
        # Counter → dict (Top 50만)
        for k in ["themes", "ages", "genders", "regions", "recrd_envrn", "recrd_unit"]:
            stats[k] = dict(stats[k].most_common(50))
        all_stats[label] = stats

    # 집계
    summary = {
        "total_pairs": len(all_rows),
        "total_duration_hours": sum(s["duration_sec_sum"] for s in all_stats.values()) / 3600,
        "per_category": all_stats,
    }
    A.mkdir(parents=True, exist_ok=True)
    OUT_STATS.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    with OUT_UTT.open("w", encoding="utf-8") as f:
        for r in all_rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(f"=== summary ===")
    print(f"  pairs:    {len(all_rows):,}")
    print(f"  duration: {summary['total_duration_hours']:.1f} hours")
    print(f"  stats:    {OUT_STATS}")
    print(f"  utts:     {OUT_UTT}")


if __name__ == "__main__":
    main()
