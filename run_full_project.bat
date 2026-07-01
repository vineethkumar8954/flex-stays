@echo off
title Flex-Stays HMS — Full Project Launcher
color 0A

echo ============================================================
echo   🏨 FLEX-STAYS HOTEL MANAGEMENT SYSTEM (HMS)
echo   🚀 Full Project Unified Launcher (Frontend + Backend)
echo ============================================================
echo.

:: Step 1: Ensure MySQL is started
echo [1/4] Checking MySQL Database Service...
sc query MySQL80 | findstr "RUNNING" > nul
if %ERRORLEVEL% NEQ 0 (
    echo MySQL80 is stopped. Attempting to start...
    net start MySQL80
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] Could not start MySQL80. 
        echo Please ensure MySQL is running manually in Services.msc.
    ) else (
        echo [OK] MySQL80 started successfully!
    )
) else (
    echo [OK] MySQL80 is already running!
)
echo.

:: Step 2: Start Spring Boot Backend Server
echo [2/4] Launching Spring Boot Backend (Port 8080)...
set MAVEN_BIN="D:\maven\apache-maven-3.9.7\bin"
start "Flex-Stays HMS Backend" cmd /k "color 0B && cd /d d:\quotex\backend && set PATH=%MAVEN_BIN%;%%PATH%% && mvn spring-boot:run"
echo [OK] Backend started in separate window.
timeout /t 5 /nobreak > nul
echo.

:: Step 3: Launch Local Frontend Web Server
echo [3/4] Launching Static Frontend Web Server (Port 3000)...
start "Flex-Stays HMS Frontend" cmd /k "color 0C && cd /d d:\quotex && python serve.py"
echo [OK] Frontend server running.
timeout /t 3 /nobreak > nul
echo.

:: Step 4: Open Browser Tabs
echo [4/4] Opening browser tabs...
start http://localhost:3000/index.html
start http://localhost:8080/api/v1/swagger-ui.html

echo.
echo ============================================================
echo   🎉 Flex-Stays HMS is up and running!
echo.
echo   - Frontend Portal : http://localhost:3000/index.html
echo   - Swagger API Docs: http://localhost:8080/api/v1/swagger-ui.html
echo ============================================================
echo.
pause
