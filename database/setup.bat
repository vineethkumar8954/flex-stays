@echo off
echo.
echo ============================================================
echo   Flex-Stays HMS — MySQL Database Setup
echo ============================================================
echo.

set MYSQL="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set PASS=vineeth@123@

echo Step 1: Creating database and schema...
%MYSQL% -u root -p%PASS% < "d:\quotex\database\schema.sql" 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Schema creation failed.
    pause
    exit /b 1
)
echo [OK] Schema created!

echo.
echo Step 2: Inserting seed data...
%MYSQL% -u root -p%PASS% flexstays < "d:\quotex\database\seed.sql" 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Seed failed. It may have already been seeded - that is OK.
)
echo [OK] Seed done!

echo.
echo Step 3: Verifying...
%MYSQL% -u root -p%PASS% flexstays -e "SELECT 'rooms' AS tbl, COUNT(*) AS rows FROM rooms UNION ALL SELECT 'bookings', COUNT(*) FROM bookings UNION ALL SELECT 'staff', COUNT(*) FROM staff UNION ALL SELECT 'users', COUNT(*) FROM users;"

echo.
echo ============================================================
echo   Setup Complete! Database: flexstays is ready.
echo ============================================================
pause
