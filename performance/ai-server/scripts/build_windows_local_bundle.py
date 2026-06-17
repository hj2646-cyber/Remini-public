from __future__ import annotations

import shutil
import zipfile
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
DIST_DIR = ROOT_DIR / "dist"
BUNDLE_DIR = DIST_DIR / "remeni-ai-local"
ZIP_PATH = DIST_DIR / "remeni-ai-local.zip"

INCLUDE_PATHS = [
    "app",
    "web",
    "scripts",
    "requirements.txt",
    ".env.example",
    "README.md",
    "start_patient_local.bat",
    "start_patient_desktop.bat",
    "start_remeni.bat",
]


def write_portable_notes(bundle_dir: Path) -> None:
    note = """remeni-ai local bundle

1. 이 폴더를 Windows PC로 옮깁니다.
2. `.env.example`을 참고해 `.env`를 만듭니다.
3. Ollama를 설치하고 필요한 모델을 준비합니다.
4. 같은 PC에서 환자 화면만 쓰려면 `start_patient_local.bat` 또는 `start_patient_desktop.bat`를 실행합니다.

중요:
- 이 번들은 현재 PC의 비밀키나 비밀번호를 포함하지 않습니다.
- PostgreSQL, Neo4j AuraDB, Ollama 설정은 대상 PC에서 다시 맞춰야 합니다.
- 같은 PC에서는 `127.0.0.1` 로컬 주소를 사용하므로 HTTPS 없이 카메라/마이크 사용이 가능합니다.
"""
    (bundle_dir / "LOCAL_RUN.txt").write_text(note, encoding="utf-8")


def copy_item(rel_path: str, bundle_dir: Path) -> None:
    src = ROOT_DIR / rel_path
    dst = bundle_dir / rel_path
    if src.is_dir():
        shutil.copytree(src, dst, dirs_exist_ok=True)
    else:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)


def build_bundle() -> None:
    if BUNDLE_DIR.exists():
        shutil.rmtree(BUNDLE_DIR)
    BUNDLE_DIR.mkdir(parents=True, exist_ok=True)

    for rel_path in INCLUDE_PATHS:
        copy_item(rel_path, BUNDLE_DIR)

    write_portable_notes(BUNDLE_DIR)

    if ZIP_PATH.exists():
        ZIP_PATH.unlink()

    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(BUNDLE_DIR.rglob("*")):
            if path.is_dir():
                continue
            zf.write(path, path.relative_to(DIST_DIR))

    print(f"Created bundle folder: {BUNDLE_DIR}")
    print(f"Created zip file: {ZIP_PATH}")


if __name__ == "__main__":
    build_bundle()
