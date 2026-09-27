@echo off
cd /d "%~dp0"
echo ========================================================
echo Starting CoalGuard AI FastAPI Backend on http://127.0.0.1:8000
echo ========================================================
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
