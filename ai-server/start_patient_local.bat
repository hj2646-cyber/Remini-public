@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  py -3.13 -m venv .venv
)

echo [remeni-ai] Installing requirements...
call ".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
  echo [remeni-ai] Failed to install requirements.
  pause
  exit /b 1
)

echo [remeni-ai] Starting local API server in a new window...
start "remeni-local-api" cmd /k ".venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [remeni-ai] Waiting for server...
timeout /t 3 >nul

echo [remeni-ai] Opening local patient screen...
start "" "http://127.0.0.1:8000/"

echo.
echo Local patient mode:
echo   http://127.0.0.1:8000/
echo.
pause
