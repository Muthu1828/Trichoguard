@echo off
SETLOCAL EnableDelayedExpansion

echo ===========================================
echo    TrichoGuard - Final Launch Script
echo ===========================================
echo.

echo [1/3] Clearing old processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM uvicorn.exe /T 2>nul
taskkill /F /IM python.exe /T /FI "WINDOWTITLE ne *" 2>nul

echo [2/3] Starting Backend Server (Port 8003)...
start "TrichoGuard Backend" cmd /k "cd backend && ..\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8004"

timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Server (Port 3000)...
start "TrichoGuard Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===========================================
echo    Application is starting! 🚀
echo    Backend: http://127.0.0.1:8004
echo    Frontend: http://localhost:3000
echo ===========================================
pause
