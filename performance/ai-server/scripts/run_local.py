from __future__ import annotations

import argparse
import os
import subprocess
import sys
import time
import webbrowser
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]


def load_dotenv() -> None:
    env_path = ROOT_DIR / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def project_python() -> Path:
    if os.name == "nt":
        return ROOT_DIR / ".venv" / "Scripts" / "python.exe"
    return ROOT_DIR / ".venv" / "bin" / "python"


def ensure_venv() -> Path:
    python_path = project_python()
    if python_path.exists():
        return python_path

    base_python = sys.executable or ("python" if os.name == "nt" else "python3")
    subprocess.run([base_python, "-m", "venv", str(ROOT_DIR / ".venv")], cwd=ROOT_DIR, check=True)
    return python_path


def install_requirements(python_path: Path, include_voice_clone: bool = False) -> None:
    subprocess.run([str(python_path), "-m", "pip", "install", "--upgrade", "pip"], cwd=ROOT_DIR, check=True)
    subprocess.run([str(python_path), "-m", "pip", "install", "-r", "requirements.txt"], cwd=ROOT_DIR, check=True)
    if include_voice_clone and (ROOT_DIR / "requirements-voice-clone.txt").exists():
        subprocess.run(
            [str(python_path), "-m", "pip", "install", "-r", "requirements-voice-clone.txt"],
            cwd=ROOT_DIR,
            check=True,
        )


def start_uvicorn(python_path: Path, host: str, port: int, reload: bool) -> int:
    command = [str(python_path), "-m", "uvicorn", "app.main:app", "--host", host, "--port", str(port)]
    if reload:
        command.append("--reload")
    return subprocess.call(command, cwd=ROOT_DIR)


def wait_for_server(url: str, timeout_sec: float = 25.0) -> bool:
    try:
        import requests
    except Exception:
        time.sleep(3.0)
        return True

    deadline = time.time() + timeout_sec
    while time.time() < deadline:
        try:
            response = requests.get(url, timeout=1.5)
            if response.ok:
                return True
        except Exception:
            pass
        time.sleep(0.5)
    return False


def open_browser(url: str) -> None:
    webbrowser.open(url)


def start_background_server(python_path: Path, host: str, port: int, reload: bool) -> subprocess.Popen[str]:
    command = [str(python_path), "-m", "uvicorn", "app.main:app", "--host", host, "--port", str(port)]
    if reload:
        command.append("--reload")
    return subprocess.Popen(command, cwd=ROOT_DIR)


def main() -> int:
    load_dotenv()

    parser = argparse.ArgumentParser(description="Run remeni-ai without .bat files")
    parser.add_argument("mode", choices=["api", "web", "patient"], nargs="?", default="api")
    parser.add_argument("--host", default=os.environ.get("HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8000")))
    parser.add_argument("--no-reload", action="store_true")
    parser.add_argument("--skip-install", action="store_true")
    parser.add_argument("--with-voice-clone", action="store_true")
    args = parser.parse_args()

    python_path = ensure_venv()
    if not args.skip_install:
        install_requirements(python_path, include_voice_clone=args.with_voice_clone)

    reload_enabled = not args.no_reload
    health_url = f"http://{args.host}:{args.port}/health"
    root_url = f"http://{args.host}:{args.port}/"

    if args.mode == "api":
        return start_uvicorn(python_path, args.host, args.port, reload_enabled)

    server = start_background_server(python_path, args.host, args.port, reload_enabled)
    target_url = root_url

    if not wait_for_server(health_url):
        if server.poll() is None:
            server.terminate()
        print(f"[remeni-ai] Server did not become ready: {health_url}", file=sys.stderr)
        return 1

    print(f"[remeni-ai] Opening {target_url}")
    open_browser(target_url)
    print("[remeni-ai] Press Ctrl+C to stop the local server.")

    try:
        return server.wait()
    except KeyboardInterrupt:
        if server.poll() is None:
            server.terminate()
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
