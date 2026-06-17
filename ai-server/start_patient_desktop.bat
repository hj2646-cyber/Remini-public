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

echo [remeni-ai] Opening local desktop patient mode...
call ".venv\Scripts\python.exe" scripts\run_patient_desktop.py
