@echo off
REM Git Push Script for KAAEXIM PRODUCTS PRIVATE LIMITED
REM ====================================================

REM Set your branch name (default: main)
set BRANCH=main

REM Set commit message - use first argument or default
if "%1"=="" (
  set MSG=Auto-commit: %DATE% %TIME%
) else (
  set MSG=%*
)

echo =============================================
echo   KAAEXIM - Git Push Script
echo =============================================
echo Branch: %BRANCH%
echo Message: %MSG%
echo =============================================

REM Stage all changes
echo [1/4] Staging changes...
git add -A
if %ERRORLEVEL% neq 0 (
  echo ERROR: Failed to stage changes
  pause
  exit /b 1
)

REM Commit
echo [2/4] Committing...
git commit -m "%MSG%"
if %ERRORLEVEL% neq 0 (
  echo Nothing to commit or commit failed.
  pause
  exit /b 1
)

REM Push
echo [3/4] Pushing to GitHub...
git push origin %BRANCH%
if %ERRORLEVEL% neq 0 (
  echo ERROR: Push failed. Check your remote origin and connection.
  pause
  exit /b 1
)

echo [4/4] Done!
echo =============================================
echo   Successfully pushed to GitHub!
echo =============================================
pause
