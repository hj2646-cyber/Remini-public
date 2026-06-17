#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt

HOST_VALUE="${HOST:-0.0.0.0}"
PORT_VALUE="${PORT:-8000}"

uvicorn app.main:app --host "$HOST_VALUE" --port "$PORT_VALUE" --reload
