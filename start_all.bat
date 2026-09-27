@echo off
echo ========================================================
echo Launching CoalGuard AI Fullstack Smart Governance System
echo ========================================================
start "CoalGuard AI - Backend (FastAPI)" cmd /k "%~dp0start_backend.bat"
timeout /t 2 >nul
start "CoalGuard AI - Frontend (Vite React)" cmd /k "%~dp0start_frontend.bat"
echo Services launched!
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo API Docs: http://127.0.0.1:8000/docs
