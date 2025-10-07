#!/bin/bash

# FinSage Startup Script for MacBook
# This script starts both the backend and frontend servers

echo "🚀 Starting FinSage - AI-Powered Financial Intelligence Platform"
echo "================================================================"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend Server..."
    cd "$(dirname "$0")"
    python3 simple_backend.py &
    BACKEND_PID=$!
    echo "✅ Backend started with PID: $BACKEND_PID"
    
    # Wait for backend to start
    echo "⏳ Waiting for backend to initialize..."
    sleep 3
    
    # Test backend connection
    if curl -s http://localhost:8000/api/v1/status/health > /dev/null; then
        echo "✅ Backend is running successfully!"
    else
        echo "❌ Backend failed to start properly"
        return 1
    fi
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server..."
    cd "$(dirname "$0")/frontend/finsage-ui"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi
    
    echo "🚀 Starting React development server..."
    npm start &
    FRONTEND_PID=$!
    echo "✅ Frontend started with PID: $FRONTEND_PID"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down FinSage..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend stopped"
    fi
    echo "👋 FinSage shutdown complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start services
echo "Starting FinSage services..."
start_backend
if [ $? -eq 0 ]; then
    start_frontend
    echo ""
    echo "🎉 FinSage is now running!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:8000"
    echo "📊 API Docs: http://localhost:8000/docs"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
else
    echo "❌ Failed to start FinSage. Please check the errors above."
    exit 1
fi
