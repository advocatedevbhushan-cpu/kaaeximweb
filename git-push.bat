@echo off
REM Git Push Script for KAAEXIM PRODUCTS PRIVATE LIMITED
REM ====================================================

set BRANCH=main

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

git add -A
if %ERRORLEVEL% neq 0 (
  echo ERROR: Failed to stage changes
  pause
  exit /b 1
)

git diff --cached --quiet
if %ERRORLEVEL% neq 0 (
  echo [2/4] Committing...
  git commit -m "%MSG%"
) else (
  echo [2/4] No changes to commit, skipping.
)

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
