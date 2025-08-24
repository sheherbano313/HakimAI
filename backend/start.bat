@echo off
echo 🌿 Starting HakimAI Backend...

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    copy env.example .env
    echo 📝 Please edit .env file with your actual values before starting the server
    echo    - Set JWT_SECRET to a secure random string
    echo    - Set OPENAI_API_KEY to your OpenAI API key
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
)

REM Start the server
echo 🚀 Starting server in development mode...
npm run dev
pause
