#!/bin/bash
# judge 가 중간에 죽으면 resume 로 자동 재시작. 192 채워지면 종료.
REPO=/home/oem/바탕화면/학부연구생종합설계프로젝트/Remini
RAW="$REPO/experiments/data/results/ablation_judge_raw.jsonl"
PY="$REPO/ai-server/.venv/bin/python"
SC="$REPO/experiments/scripts/21_ablation_judge.py"

for i in $(seq 1 40); do
  DONE=$("$PY" -c "import json; print(sum(1 for l in open('$RAW') if not json.loads(l).get('error')))" 2>/dev/null || echo 0)
  echo "[watchdog iter=$i] done=$DONE/192"
  if [ "$DONE" -ge 192 ]; then
    echo "[watchdog] judge 완료 ($DONE/192)"
    break
  fi
  "$PY" -u "$SC" --self-consistency 3 --resume
  echo "[watchdog] judge 프로세스 종료됨 → 5초 후 resume 재시도"
  sleep 5
done
echo "[watchdog] DONE_MARKER 루프 종료"
