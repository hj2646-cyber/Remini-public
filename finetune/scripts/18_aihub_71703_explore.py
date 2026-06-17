"""
18 — AI Hub 71703 (고령자 스토리 구술) 일괄 파싱 + 통계 + 환자 발화 추출

JSON 구조:
  qa: [{question, answer}, ...]
  teller: 화자 정보 (나이/성별/고향/거주지/교육/우울·불안 점수)
  label_1: 회상 quality (사건/시간/공간 구체성)
  label_2: 대화 분석 (감정/주제이탈/감각 등)
  keyword: 50개 카테고리 중 하나
  audioFile, audioTime, qualityPoint

산출물:
  finetune/data/aihub_71703/_stats.json  - 전체 통계
  finetune/data/aihub_71703/utterances.jsonl  - 환자 발화 (qa[i].answer) + 메타
"""
import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "finetune" / "data" / "aihub_71703"
TRAIN_DIR = DATA_DIR / "Training" / "02.라벨링데이터"
VAL_DIR = DATA_DIR / "Validation" / "02.라벨링데이터"
OUT_STATS = DATA_DIR / "_stats.json"
OUT_UTT = DATA_DIR / "utterances.jsonl"


# 카테고리 50 → 우리 8 매핑
# AI Hub 카테고리 5대 분류: 감정-긍정·중립(12), 감정-부정(11), 사물(?), 장소(?), 관계·사건(?)
CATEGORY_MAP = {
    # AI Hub keyword → 우리 v2 카테고리
    # C1 망상: AI Hub 에 없음 (정상 노인 데이터)
    # C2 일상회상: 사물·장소·관계/사건
    # C3 감각단서: 일부 사물·장소
    # C4 사실오류: AI Hub 에 없음
    # C5 위기신호: 부정 감정 일부 (외롭다, 후회하다)
    # C6 기억어려움: 없음 (정상 노인)
    # C7 일상푸념: 부정 감정 일부 (답답하다, 힘들다, 지루하다)
    # C8 감정표현: 긍정·중립 + 부정 일부

    # 감정-긍정·중립 (12) → C8 감정표현
    "기쁘다": "C8-감정표현", "즐겁다": "C8-감정표현", "행복하다": "C8-감정표현",
    "편안하다": "C8-감정표현", "고맙다": "C8-감정표현", "안심하다": "C8-감정표현",
    "재미있다": "C8-감정표현", "자랑스럽다": "C8-감정표현", "반갑다": "C8-감정표현",
    "그립다": "C8-감정표현",
    "망설이다": "C7-일상푸념",  # 망설임은 푸념 가까움
    "충격받다": "C5-위기신호",  # 충격은 위기 가까움

    # 감정-부정 (11)
    "미안하다": "C8-감정표현",
    "슬프다": "C5-위기신호",  # 슬픔은 위기 신호 카테고리
    "불안하다": "C5-위기신호",
    "긴장되다": "C7-일상푸념",
    "외롭다": "C5-위기신호",
    "후회하다": "C8-감정표현",
    "화나다": "C7-일상푸념",
    "답답하다": "C7-일상푸념",
    "지루하다": "C7-일상푸념",
    "힘들다": "C7-일상푸념",
    "부끄럽다": "C8-감정표현",
}
# 사물·장소·관계·사건 키워드는 동적으로 매핑 (대부분 C2 일상회상, 일부 C3 감각단서)
DEFAULT_FALLBACK = "C2-일상회상"


def map_category(keyword: str) -> str:
    if keyword in CATEGORY_MAP:
        return CATEGORY_MAP[keyword]
    return DEFAULT_FALLBACK


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="처음 N개 JSON만 (테스트)")
    args = ap.parse_args()

    train_files = sorted(TRAIN_DIR.glob("*.json"))
    val_files = sorted(VAL_DIR.glob("*.json"))
    if args.limit > 0:
        train_files = train_files[:args.limit]
        val_files = val_files[:args.limit]
    print(f"[1] train: {len(train_files):,} / val: {len(val_files):,}")

    stats = {
        "total_files": 0,
        "total_qa_pairs": 0,
        "keyword_counts": Counter(),
        "our_category_counts": Counter(),
        "speaker_age": Counter(),
        "speaker_gender": Counter(),
        "speaker_region": Counter(),
        "speaker_education_years": Counter(),
        "anxiety_score_dist": Counter(),
        "depression_score_dist": Counter(),
        "label1_concreteness": defaultdict(Counter),  # 사건/시간/공간 구체성 분포
        "answer_length_buckets": Counter(),  # 환자 발화 길이 분포
        "split": {"train": 0, "val": 0},
    }

    OUT_UTT.parent.mkdir(parents=True, exist_ok=True)
    n_utt = 0
    with open(OUT_UTT, "w", encoding="utf-8") as fout:
        for split, files in [("train", train_files), ("val", val_files)]:
            for fpath in files:
                try:
                    data = json.load(open(fpath, encoding="utf-8"))
                except Exception:
                    continue
                stats["total_files"] += 1
                stats["split"][split] += 1

                kw = data.get("keyword", "unknown")
                stats["keyword_counts"][kw] += 1
                our_cat = map_category(kw)
                stats["our_category_counts"][our_cat] += 1

                # teller 통계
                tellers = data.get("teller") or [{}]
                t = tellers[0] if isinstance(tellers, list) else tellers
                if t:
                    age = t.get("나이")
                    if isinstance(age, int):
                        bucket = f"{age // 10}0대"
                        stats["speaker_age"][bucket] += 1
                    stats["speaker_gender"][t.get("성별", "?")] += 1
                    stats["speaker_region"][t.get("거주지", "?")] += 1
                    edu = t.get("교육년")
                    if isinstance(edu, int):
                        stats["speaker_education_years"][edu] += 1
                    # 불안·우울 점수 (2개씩)
                    for k, v in t.items():
                        if "불안점수" in k and isinstance(v, (int, float)):
                            stats["anxiety_score_dist"][int(v)] += 1
                        if "우울점수" in k and isinstance(v, (int, float)):
                            stats["depression_score_dist"][int(v)] += 1

                # label_1 (회상 구체성)
                labels = data.get("label_1") or [{}]
                l1 = labels[0] if isinstance(labels, list) else labels
                if l1:
                    for k, v in l1.items():
                        if isinstance(v, (int, float)):
                            stats["label1_concreteness"][k][int(v)] += 1

                # qa 페어 → 환자 발화 추출
                qa = data.get("qa", [])
                stats["total_qa_pairs"] += len(qa)
                for i, pair in enumerate(qa):
                    ans = (pair.get("answer") or "").strip()
                    if not ans:
                        continue
                    n_utt += 1
                    # 길이 bucket
                    L = len(ans)
                    if L < 30: stats["answer_length_buckets"]["0-30"] += 1
                    elif L < 60: stats["answer_length_buckets"]["30-60"] += 1
                    elif L < 100: stats["answer_length_buckets"]["60-100"] += 1
                    elif L < 200: stats["answer_length_buckets"]["100-200"] += 1
                    elif L < 500: stats["answer_length_buckets"]["200-500"] += 1
                    else: stats["answer_length_buckets"]["500+"] += 1

                    fout.write(json.dumps({
                        "id": f"aihub_{data.get('jsonId', fpath.stem)}_{i}",
                        "split": split,
                        "keyword": kw,
                        "our_category": our_cat,
                        "question": (pair.get("question") or "").strip(),
                        "answer": ans,
                        "answer_len": L,
                        "speaker_age": (tellers[0].get("나이") if tellers else None),
                        "speaker_sex": (tellers[0].get("성별") if tellers else None),
                        "speaker_region": (tellers[0].get("거주지") if tellers else None),
                        "label_1": l1,
                        "qaidx": i,
                    }, ensure_ascii=False) + "\n")

    # Counter → dict (json 직렬화)
    stats_serialized = {}
    for k, v in stats.items():
        if isinstance(v, Counter):
            stats_serialized[k] = dict(v.most_common())
        elif isinstance(v, defaultdict):
            stats_serialized[k] = {kk: dict(vv.most_common()) for kk, vv in v.items()}
        else:
            stats_serialized[k] = v

    OUT_STATS.write_text(json.dumps(stats_serialized, ensure_ascii=False, indent=2), encoding="utf-8")

    # 콘솔 요약
    print(f"\n[2] {stats['total_files']:,} files / {stats['total_qa_pairs']:,} qa pairs / {n_utt:,} 환자 발화")
    print(f"\n[3] 우리 8 카테고리 매핑")
    for cat, n in stats["our_category_counts"].most_common():
        print(f"   {cat:<15} {n:,}")
    print(f"\n[4] 화자 통계")
    print(f"   연령대: {dict(stats['speaker_age'].most_common())}")
    print(f"   성별: {dict(stats['speaker_gender'].most_common())}")
    print(f"   거주지 top 10: {dict(stats['speaker_region'].most_common(10))}")
    print(f"\n[5] 불안 점수 분포: {dict(stats['anxiety_score_dist'].most_common())}")
    print(f"   우울 점수 분포: {dict(stats['depression_score_dist'].most_common())}")
    print(f"\n[6] 답변 길이 분포: {dict(stats['answer_length_buckets'].most_common())}")
    print(f"\n[7] keyword top 15:")
    for kw, n in stats["keyword_counts"].most_common(15):
        print(f"   {kw:<15} {n:,}")
    print(f"\n[8] 출력:")
    print(f"   {OUT_STATS}")
    print(f"   {OUT_UTT}  ({n_utt:,} 환자 발화)")


if __name__ == "__main__":
    sys.exit(main())
