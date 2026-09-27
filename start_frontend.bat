@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%ProgramFiles%\nodejs;%PATH%"
cd /d "%~dp0frontend"
echo ========================================================
echo Starting CoalGuard AI Frontend (React 19 + Vite + 3D Globe)
echo Local URL: http://127.0.0.1:5173
echo ========================================================
call npm run dev
pause
