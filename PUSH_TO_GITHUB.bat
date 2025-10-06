@echo off
echo ========================================
echo  WLA App - Push to GitHub Script
echo ========================================
echo.

REM Navigate to the WLA_App directory
cd /d "C:\Users\JerrelTGilliam\.cursor\WLA_App"

echo Step 1: Initialize Git repository...
git init

echo.
echo Step 2: Add all files (preserving folder structure)...
git add .

echo.
echo Step 3: Commit files...
git commit -m "WLA Conservation Ambassadors v1.0 - Complete deployment"

echo.
echo Step 4: Connect to GitHub...
git remote add origin https://github.com/jordangilliam/WLA_App.git

echo.
echo Step 5: Push to GitHub...
echo (You may be prompted for GitHub credentials)
git push -u origin main

echo.
echo ========================================
echo  Done! Check GitHub Actions at:
echo  https://github.com/jordangilliam/WLA_App/actions
echo ========================================
pause

