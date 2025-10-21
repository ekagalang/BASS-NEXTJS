@echo off
REM ============================================
REM BASS Training Academy - Setup Script
REM For Windows - New Device Setup
REM ============================================

echo.
echo ========================================
echo  BASS TRAINING ACADEMY - SETUP
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/7] Checking Node.js version...
node --version
echo.

REM Check if MySQL is running
echo [2/7] Checking MySQL connection...
mysql -u root --password=admin -e "SELECT 1" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Cannot connect to MySQL!
    echo Please make sure:
    echo   1. MySQL is installed and running
    echo   2. Root password is 'admin' OR update .env.local
    echo.
    echo Press any key to continue anyway...
    pause >nul
) else (
    echo MySQL connection OK
)
echo.

REM Install dependencies
echo [3/7] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo.

REM Check if .env.local exists
echo [4/7] Checking environment variables...
if not exist .env.local (
    echo [INFO] .env.local not found, copying from .env.example...
    copy .env.example .env.local >nul
    echo.
    echo [ACTION REQUIRED] Please edit .env.local and configure:
    echo   - DATABASE_URL (MySQL connection string^)
    echo   - JWT_SECRET (generate a strong secret^)
    echo.
    echo Press any key after you've edited .env.local...
    pause >nul
) else (
    echo .env.local already exists
)
echo.

REM Generate Prisma Client
echo [5/7] Generating Prisma Client...
call npm run db:generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate Prisma Client!
    pause
    exit /b 1
)
echo.

REM Push schema to database
echo [6/7] Syncing database schema...
call npm run db:push
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to sync database!
    echo Please check your DATABASE_URL in .env.local
    pause
    exit /b 1
)
echo.

REM Seed database
echo [7/7] Seeding database with dummy data...
node prisma\seed.js
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Seeding failed, but setup can continue
    echo You can run 'node prisma/seed.js' manually later
)
echo.

echo ========================================
echo  SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:3000
echo   3. Login with:
echo      Email: admin@basstrainingacademy.com
echo      Password: admin123
echo.
echo Useful commands:
echo   npm run dev          - Start development server
echo   npm run db:studio    - Open Prisma Studio (database GUI^)
echo   node prisma/seed.js  - Re-seed database
echo.
pause
