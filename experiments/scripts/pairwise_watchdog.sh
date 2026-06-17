#!/bin/bash
# pairwise judge(23) 가 중간에 죽으면 resume 로 자동 재시작. 168 채워지면 종료.
REPO=/home/oem/바탕화면/학부연구생종합설계프로젝트/Remini
RAW="$REPO/experiments/data/results/ablation_pairwise_raw.jsonl"
PY="$REPO/ai-server/.venv/bin/python"
SC="$REPO/experiments/scripts/23_ablation_pairwise_judge.py"

for i in $(seq 1 40); do
  DONE=$("$PY" -c "import json,os; print(sum(1 for l in open('$RAW') if not json.loads(l).get('error')) if os.path.exists('$RAW') else 0)" 2>/dev/null || echo 0)
  echo "[pw-watchdog iter=$i] done=$DONE/168"
  if [ "$DONE" -ge 168 ]; then
    echo "[pw-watchdog] pairwise judge 완료 ($DONE/168)"
    break
  fi
  "$PY" -u "$SC" --self-consistency 3 --resume
  echo "[pw-watchdog] 23 종료됨 → 5초 후 resume 재시도"
  sleep 5
done
echo "[pw-watchdog] DONE_MARKER 루프 종료"
