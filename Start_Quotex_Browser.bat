@echo off
echo Killing existing Chrome processes...
taskkill /F /IM chrome.exe /T >nul 2>&1
echo Starting Chrome with debugging port...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
echo Done! You can now close this black window.
echo Please go to the new Chrome window, open Quotex, and log in.
pause
