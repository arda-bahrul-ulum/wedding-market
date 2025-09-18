@echo off
REM Wedding Commerce Frontend Setup Script for Windows

echo 🚀 Setting up Wedding Commerce Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # API Configuration
        echo VITE_API_URL=http://localhost:8080/api/v1
        echo.
        echo # Development Configuration
        echo VITE_APP_NAME="Wedding Commerce"
        echo VITE_APP_ENV=development
        echo.
        echo # Optional: Enable debug mode
        echo VITE_DEBUG=true
    ) > .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

REM Check if backend is running
echo 🔍 Checking backend connection...
curl -s http://localhost:8080/api/v1 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running
) else (
    echo ⚠️  Backend is not running. Please start the backend first:
    echo    go run . serve
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Make sure backend is running: go run . serve
echo 2. Start frontend development server: npm run dev
echo 3. Open http://localhost:5173 in your browser
echo.
echo Happy coding! 🚀
pause
