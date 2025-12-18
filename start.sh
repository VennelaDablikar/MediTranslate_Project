#!/bin/bash

# Function to kill process on a specific port
kill_port() {
    port=$1
    echo "Checking port $port..."
    pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)..."
        kill -9 $pid
    fi
}

# Function to kill processes on exit
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting MediTranslate..."

# Kill existing processes
kill_port 8000
kill_port 3000

# Start Backend
echo "Starting Backend (FastAPI)..."
(cd backend && uvicorn app.main:app --reload --port 8000) &

# Start Frontend
echo "Starting Frontend (Next.js)..."
(cd frontend && npm run dev) &

# Wait for all background processes
wait
