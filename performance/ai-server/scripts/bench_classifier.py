"""입력 분류기 모델 후보 레이턴시/정확도 벤치마크.

회상요법 시스템의 입력 분류기(5종 유형)를 돌릴 Ollama 모델 선정용.
- 일상확인형 / 회상유도형 / 민감정보형 / 위험감정형 / 혼란·망상형

각 후보 모델에 대해:
  1) 3회 warm-up (모델 로드 + 캐시 워밍)
  2) 10개 시나리오 × 3회 반복 timed
  3) p50 / p95 / mean 레이턴시, 정확도 출력

실행:
  cd ai-server && .venv/bin/python scripts/bench_classifier.py

환경변수:
  OLLAMA_BASE_URL  (default http://127.0.0.1:11434)
  BENCH_MODELS      쉼표 구분; 미지정 시 기본 후보 사용
"""

from __future__ import annotations

import json
import os
import statistics
import sys
import time
from dataclasses import dataclass

import requests

OLLAMA = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434")

DEFAULT_CANDIDATES = [
    "qwen2.5:3b",
    "mistral-small3.1:latest",
    "qwen3:14b",
    "gemma3:27b",
    "gemma4:31b",
]

# 5종 × 2 예시
SCENARIOS: list[tuple[str, str]] = [
    ("오늘 점심 뭐 먹을까", "일상확인형"),
    ("날씨 참 좋네요", "일상확인형"),
    ("어릴 때 논밭에서 뛰놀았지", "회상유도형"),
    ("우리 엄마가 끓여주던 김치찌개가 생각나", "회상유도형"),
    ("통장 비밀번호가 뭐였더라", "민감정보형"),
    ("이 약은 언제 먹어야 해?", "민감정보형"),
    ("다 끝내버리고 싶어", "위험감정형"),
    ("아무도 나를 사랑하지 않아", "위험감정형"),
    ("며느리가 나를 굶겨 죽이려 해", "혼란·망상형"),
    ("누가 내 통장을 훔쳐갔어", "혼란·망상형"),
]

LABELS = ["일상확인형", "회상유도형", "민감정보형", "위험감정형", "혼란·망상형"]

CLASSIFIER_PROMPT = """당신은 치매 환자 대화의 입력 분류기입니다.
환자 발화를 아래 5가지 중 하나로만 분류하세요.

- 일상확인형: 현재 날씨·식사·기분 등 평범한 일상 대화
- 회상유도형: 과거 경험·가족·고향·추억에 관한 이야기
- 민감정보형: 비밀번호·계좌·주민번호·약·의료 진단 관련 요구
- 위험감정형: 자해·자살·극심한 좌절·공격성 표현
- 혼란·망상형: 비현실적 피해·도둑·박해 주장

예시:
발화: "오늘 점심 뭐 먹을까" → 일상확인형
발화: "어릴 때 논밭에서 뛰놀았지" → 회상유도형
발화: "통장 비밀번호 알려줘" → 민감정보형
발화: "다 끝내고 싶어" → 위험감정형
발화: "누가 내 물건을 훔쳐갔어" → 혼란·망상형

분류할 발화: "{utterance}"

정확히 5개 라벨 중 하나만, 다른 말 없이 한 단어로 출력하세요."""


@dataclass
class BenchResult:
    model: str
    latencies_ms: list[float]
    accuracy: float
    correct: int
    total: int
    raw_outputs: list[str]

    @property
    def p50(self) -> float:
        return statistics.median(self.latencies_ms)

    @property
    def p95(self) -> float:
        sorted_l = sorted(self.latencies_ms)
        idx = max(0, int(len(sorted_l) * 0.95) - 1)
        return sorted_l[idx]

    @property
    def mean(self) -> float:
        return statistics.mean(self.latencies_ms)


def classify_once(model: str, utterance: str, timeout: int = 60) -> tuple[str, float]:
    prompt = CLASSIFIER_PROMPT.format(utterance=utterance)
    payload = {
        "model": model,
        "stream": False,
        "think": False,
        "messages": [{"role": "user", "content": prompt}],
        "options": {
            "temperature": 0.0,
            "top_p": 1.0,
            "num_ctx": 1024,
            "num_predict": 20,
        },
    }
    t0 = time.perf_counter()
    r = requests.post(f"{OLLAMA}/api/chat", json=payload, timeout=timeout)
    r.raise_for_status()
    elapsed_ms = (time.perf_counter() - t0) * 1000
    raw = r.json().get("message", {}).get("content", "").strip()
    return raw, elapsed_ms


def parse_label(raw: str) -> str:
    """모델 출력에서 5개 라벨 중 하나를 추출 (여러 줄/설명 끼어들어도 동작)."""
    # 정확 매칭 우선
    for label in LABELS:
        if raw.strip() == label:
            return label
    # substring 매칭
    for label in LABELS:
        if label in raw:
            return label
    # 실패 시 unknown
    return "UNKNOWN"


def bench_model(model: str, warmup: int = 3, repeats: int = 3) -> BenchResult:
    print(f"\n=== {model} ===")

    # Warm-up
    print(f"  warm-up {warmup}회...", end=" ", flush=True)
    for _ in range(warmup):
        try:
            classify_once(model, SCENARIOS[0][0])
        except Exception as e:
            print(f"\n  warm-up 실패: {e}")
            return BenchResult(model, [], 0.0, 0, 0, [])
    print("완료")

    latencies: list[float] = []
    correct = 0
    total = 0
    raw_outputs: list[str] = []

    for utterance, expected in SCENARIOS:
        for trial in range(repeats):
            try:
                raw, elapsed = classify_once(model, utterance)
            except Exception as e:
                print(f"  요청 실패 ({utterance[:15]}...): {e}")
                continue
            predicted = parse_label(raw)
            ok = predicted == expected
            latencies.append(elapsed)
            raw_outputs.append(f"{utterance[:20]} → {raw[:40]} ({'OK' if ok else 'X'})")
            if trial == 0:  # 정확도는 첫 시도만 집계
                total += 1
                if ok:
                    correct += 1

    acc = correct / total if total else 0.0
    result = BenchResult(model, latencies, acc, correct, total, raw_outputs)
    print(f"  정확도: {correct}/{total} = {acc:.1%}")
    print(f"  p50={result.p50:.0f}ms, p95={result.p95:.0f}ms, mean={result.mean:.0f}ms, n={len(latencies)}")
    return result


def main() -> int:
    models_env = os.environ.get("BENCH_MODELS")
    models = (
        [m.strip() for m in models_env.split(",") if m.strip()]
        if models_env
        else DEFAULT_CANDIDATES
    )

    print(f"Ollama: {OLLAMA}")
    print(f"후보 모델: {models}")
    print(f"시나리오: {len(SCENARIOS)}개 × 3회 = {len(SCENARIOS) * 3}샘플/모델")

    try:
        r = requests.get(f"{OLLAMA}/api/tags", timeout=5)
        r.raise_for_status()
        available = {m["name"] for m in r.json().get("models", [])}
    except Exception as e:
        print(f"Ollama 연결 실패: {e}")
        return 1

    results: list[BenchResult] = []
    for model in models:
        if model not in available:
            print(f"\n=== {model} ===\n  스킵: 로드 안 됨 (ollama pull 필요)")
            continue
        try:
            results.append(bench_model(model))
        except Exception as e:
            print(f"\n=== {model} ===\n  실패: {e}")

    # 요약 — 정확도 ≥ 80% 필터 후 최저 p50 레이턴시
    print("\n" + "=" * 60)
    print("최종 요약 (정확도 ≥ 80% 중 p50 낮은 순)")
    print("=" * 60)
    eligible = [r for r in results if r.accuracy >= 0.8 and r.latencies_ms]
    ineligible = [r for r in results if r.accuracy < 0.8 or not r.latencies_ms]

    if eligible:
        eligible.sort(key=lambda r: r.p50)
        print(f"\n{'모델':<28}{'정확도':<10}{'p50':<10}{'p95':<10}{'mean':<10}")
        print("-" * 68)
        for r in eligible:
            print(f"{r.model:<28}{r.accuracy:<10.1%}{r.p50:<10.0f}{r.p95:<10.0f}{r.mean:<10.0f}")
        print(f"\n🏆 추천: {eligible[0].model}  (p50={eligible[0].p50:.0f}ms, 정확도 {eligible[0].accuracy:.1%})")
    else:
        print("\n정확도 80% 이상 모델 없음")

    if ineligible:
        print(f"\n제외된 모델 (정확도 < 80%):")
        for r in ineligible:
            p50 = f"{r.p50:.0f}ms" if r.latencies_ms else "N/A"
            print(f"  - {r.model}: 정확도 {r.accuracy:.1%}, p50={p50}")

    # JSON 저장
    out_path = os.path.join(os.path.dirname(__file__), "bench_classifier_results.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "ollama": OLLAMA,
                "scenarios": len(SCENARIOS),
                "results": [
                    {
                        "model": r.model,
                        "accuracy": r.accuracy,
                        "correct": r.correct,
                        "total": r.total,
                        "p50_ms": r.p50 if r.latencies_ms else None,
                        "p95_ms": r.p95 if r.latencies_ms else None,
                        "mean_ms": r.mean if r.latencies_ms else None,
                        "n_samples": len(r.latencies_ms),
                        "raw_outputs": r.raw_outputs,
                    }
                    for r in results
                ],
                "recommended": eligible[0].model if eligible else None,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )
    print(f"\n결과 저장: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
