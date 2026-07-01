@echo off
echo ========================================================
echo STEP 1: FORCE CLOSING ALL BACKGROUND CHROME APPS
echo ========================================================
taskkill /F /IM chrome.exe /T >nul 2>&1
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo ========================================================
echo STEP 2: STARTING YOUR REAL CHROME WITH DEBUGGING
echo ========================================================
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="d:\quotex\chrome_debug"
echo.
echo Chrome should now be open! 
echo 1. Please go to https://quotex.com in that window.
echo 2. Pass the security check and log in.
echo 3. You can close this black window once Chrome is open.
pause
