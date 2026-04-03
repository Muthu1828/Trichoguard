@echo off
SETLOCAL EnableDelayedExpansion

echo ===========================================
echo    TrichoGuard - Automated Push Flow
echo ===========================================
echo.

echo [1/4] Cleaning temporary files...
del /S /Q backend\__pycache__ 2>nul
del /S /Q frontend\.next 2>nul

echo [2/4] Staging changes...
git add .

set /p msg="Enter commit message (or press enter for auto-timestamp): "
if "!msg!"=="" (
    set msg=Auto-Sync: %date% %time%
)

echo [3/4] Committing: !msg!
git commit -m "!msg!"

echo [4/4] Pushing to Main branch...
git push origin main

echo.
echo ===========================================
echo    Push Complete! 🚀
echo    Check GitHub Actions for verification.
echo ===========================================
pause
