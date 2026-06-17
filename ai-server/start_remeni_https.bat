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

echo [remeni-ai] Opening API and ngrok in separate windows...
start "remeni-api" cmd /k ".venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 2 >nul
start "remeni-ngrok" cmd /k "ngrok http 8000"

echo.
echo API:   http://127.0.0.1:8000
echo ngrok: http://127.0.0.1:4040  (public HTTPS URL check)
echo.
pause
