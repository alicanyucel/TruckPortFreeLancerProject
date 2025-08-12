@echo off
REM TruckPort Quick Production Deployment
echo.
echo ========================================
echo 🚛 TruckPort Production Deployment
echo ========================================
echo.

REM Step 1: Clean previous build
echo 📦 Cleaning previous build...
if exist dist rmdir /s /q dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Step 2: Install dependencies
echo 📋 Installing dependencies...
call npm ci
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Step 3: Build for production
echo 🏗️ Building for production...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Production build failed
    exit /b 1
)

REM Step 4: Start local server for testing
echo 🚀 Starting local server...
echo.
echo ✅ Production build completed successfully!
echo 🌐 Starting server at http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

cd dist\TruckPort\browser
python -m http.server 8080

echo.
echo 🎉 Deployment completed!
