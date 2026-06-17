from __future__ import annotations

import atexit
import os
import subprocess
import sys
import time
import webbrowser
from pathlib import Path

import requests
import webview


ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOG_PATH = DATA_DIR / "patient_desktop.log"
HOST = "127.0.0.1"
PORT = 8000
PATIENT_URL = f"http://{HOST}:{PORT}/"
HEALTH_URL = f"http://{HOST}:{PORT}/health"


def log(message: str) -> None:
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {message}"
    print(line)
    with LOG_PATH.open("a", encoding="utf-8") as fh:
        fh.write(f"{line}\n")


def server_is_ready() -> bool:
    try:
        response = requests.get(HEALTH_URL, timeout=1.5)
        return response.ok
    except Exception:
        return False


def start_server() -> subprocess.Popen[str]:
    env = os.environ.copy()
    env["HOST"] = HOST
    env["PORT"] = str(PORT)
    command = [
        sys.executable,
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        HOST,
        "--port",
        str(PORT),
    ]
    log(f"Starting local server: {' '.join(command)}")
    process = subprocess.Popen(
        command,
        cwd=ROOT_DIR,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    return process


def wait_for_server(timeout_sec: float = 25.0) -> None:
    deadline = time.time() + timeout_sec
    last_error: Exception | None = None
    while time.time() < deadline:
        try:
            response = requests.get(HEALTH_URL, timeout=1.5)
            if response.ok:
                log("Local server is ready.")
                return
        except Exception as exc:
            last_error = exc
        time.sleep(0.5)
    raise RuntimeError(f"Local server did not start in time: {last_error}")


def main() -> int:
    LOG_PATH.write_text("", encoding="utf-8")
    log("Launching patient desktop mode.")
    server: subprocess.Popen[str] | None = None
    server_started_here = False

    if server_is_ready():
        log("Existing local server detected. Reusing it.")
    else:
        server = start_server()
        server_started_here = True

    def cleanup() -> None:
        if server_started_here and server is not None and server.poll() is None:
            log("Stopping local server.")
            server.terminate()
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()

    atexit.register(cleanup)

    try:
        wait_for_server()
    except Exception as exc:
        if server is not None and server.stdout is not None:
            try:
                output = server.stdout.read()
            except Exception:
                output = ""
            if output:
                log("Server output:")
                log(output.strip())
        cleanup()
        log(f"Failed to start local desktop mode: {exc}")
        print(f"[remeni-ai] Failed to start local desktop mode: {exc}", file=sys.stderr)
        print(f"[remeni-ai] See log: {LOG_PATH}", file=sys.stderr)
        return 1

    try:
        log(f"Opening desktop window: {PATIENT_URL}")
        window = webview.create_window(
            title="remeni-ai patient",
            url=PATIENT_URL,
            width=1440,
            height=980,
            min_size=(960, 720),
            text_select=False,
        )
        webview.start()
        log("Desktop window closed.")
        return 0
    except Exception as exc:
        log(f"Desktop window could not be created: {exc}")
        webbrowser.open(PATIENT_URL)
        print("[remeni-ai] Desktop window could not be created. Opened patient page in browser instead.")
        print(f"[remeni-ai] See log: {LOG_PATH}")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
