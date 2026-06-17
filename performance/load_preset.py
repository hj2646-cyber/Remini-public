#!/usr/bin/env python3
"""config.yaml 의 active_preset 를 환경변수 export 문으로 출력.

start.sh 가 `eval $(python load_preset.py)` 로 환경변수에 적용.
ui-config.js 도 함께 생성해서 patient.html 이 frontend 토글을 읽음.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.stderr.write("ERROR: pyyaml 필요. `pip install pyyaml` (또는 .venv 활성화)\n")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent
CONFIG = ROOT / "config.yaml"
UI_CONFIG_JS = ROOT / "ai-server" / "web" / "ui-config.js"


def main() -> int:
    if not CONFIG.exists():
        sys.stderr.write(f"ERROR: {CONFIG} 없음\n")
        return 1

    cfg = yaml.safe_load(CONFIG.read_text(encoding="utf-8"))
    active = cfg.get("active_preset")
    presets = cfg.get("presets") or {}
    if active not in presets:
        sys.stderr.write(f"ERROR: active_preset={active} 가 presets 에 없음\n")
        return 1

    preset = presets[active]
    name = preset.get("name", f"preset {active}")

    # YAML 1.1 quirk 방어: off/on/no/yes 가 boolean 으로 파싱되는 거 string 화
    therapy_raw = preset.get("reminiscence_therapy", "full")
    if therapy_raw is False:
        therapy = "off"
    elif therapy_raw is True:
        therapy = "full"
    else:
        therapy = str(therapy_raw).lower()

    # ----- 환경변수 export 문 (stdout → eval 됨) -----
    exports = {
        "PERF_PRESET_ID": str(active),
        "PERF_PRESET_NAME": name,
        "PERF_REMINISCENCE_THERAPY": therapy,
        "PERF_FORCE_GEULEOGUNYO": "true" if preset.get("force_geuleogunyo") else "false",
        "PERF_STT_ROBUST": "true" if preset.get("stt_robust", True) else "false",
        "PERF_REMINISCENCE_PHOTO": "true" if preset.get("reminiscence_photo", True) else "false",
        # 본 시스템 OLLAMA_MODEL 안 건드림 — 우리만 override
        "OLLAMA_MODEL": str(preset.get("llm_model", "remini-stage26-carecall:latest")),
        # 포트는 start.sh 에서 강제 8100
        "PORT": "8100",
    }
    for k, v in exports.items():
        # 작은따옴표 escape
        safe = v.replace("'", "'\\''")
        print(f"export {k}='{safe}'")

    # ----- frontend 가 읽을 ui-config.js 생성 -----
    ui_cfg = {
        "preset_id": active,
        "preset_name": name,
        "ui_theme": preset.get("ui_theme", "dark"),
        "photo_card": preset.get("photo_card", "hidden"),
        "reminiscence_photo": bool(preset.get("reminiscence_photo", False)),
    }
    UI_CONFIG_JS.parent.mkdir(parents=True, exist_ok=True)
    UI_CONFIG_JS.write_text(
        f"window.__PERF_CONFIG = {json.dumps(ui_cfg, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )

    # stderr 로 사용자에게 안내 (stdout 은 eval 됨)
    sys.stderr.write(f"\n[performance] preset={active} ({name})\n")
    sys.stderr.write(f"[performance] OLLAMA_MODEL={exports['OLLAMA_MODEL']}\n")
    sys.stderr.write(f"[performance] ui-config.js 생성: {UI_CONFIG_JS}\n\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
