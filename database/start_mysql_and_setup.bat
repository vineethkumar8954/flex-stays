@echo off
echo ============================================================
echo   Starting MySQL80 Service (requires admin rights)
echo ============================================================
echo.

:: Check if already running
sc query MySQL80 | findstr "RUNNING" > nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL80 is already running!
    goto :setup
)

:: Start the service
echo Starting MySQL80...
net start MySQL80
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start MySQL. Please open Services.msc manually and start MySQL80.
    pause
    exit /b 1
)

echo [OK] MySQL80 started!
timeout /t 3 /nobreak > nul

:setup
echo.
echo ============================================================
echo   Running Database Setup
echo ============================================================
echo.

set MYSQL="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set PASS=vineeth@123@

echo Creating schema...
%MYSQL% -u root -p%PASS% < "d:\quotex\database\schema.sql"
echo.

echo Inserting seed data...
%MYSQL% -u root -p%PASS% flexstays < "d:\quotex\database\seed.sql"
echo.

echo Verifying tables...
%MYSQL% -u root -p%PASS% flexstays -e "SELECT 'rooms' tbl, COUNT(*) rows FROM rooms UNION ALL SELECT 'bookings', COUNT(*) FROM bookings UNION ALL SELECT 'staff', COUNT(*) FROM staff UNION ALL SELECT 'users', COUNT(*) FROM users UNION ALL SELECT 'payments', COUNT(*) FROM payments;"

echo.
echo ============================================================
echo  Database setup complete!
echo  Now run: start_backend.bat
echo ============================================================
pause
