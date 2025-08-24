#!/bin/bash

echo "🌿 Starting HakimAI Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your actual values before starting the server"
    echo "   - Set JWT_SECRET to a secure random string"
    echo "   - Set OPENAI_API_KEY to your OpenAI API key"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🚀 Starting server in development mode..."
npm run dev
