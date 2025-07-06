# Anime Figures Store Development Startup Script
Write-Host "🚀 Starting Anime Figures Store Development Environment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Yellow

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the anime-figures-store root directory." -ForegroundColor Red
    exit 1
}

# Function to start backend server
function Start-Backend {
    Write-Host "📦 Starting Backend Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-Command", "cd backend; npm run dev" -WindowStyle Normal
    Start-Sleep 3
}

# Function to start frontend server
function Start-Frontend {
    Write-Host "⚛️ Starting Frontend Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-Command", "npm start" -WindowStyle Normal
    Start-Sleep 3
}

# Function to test API
function Test-API {
    Write-Host "🔍 Testing API endpoints..." -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5
        Write-Host "✅ Backend API is running: $($response.message)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "⚠️ Backend API not responding yet..." -ForegroundColor Yellow
        return $false
    }
}

# Start the development environment
Write-Host "🎯 Step 1: Starting Backend Server" -ForegroundColor Yellow
Start-Backend

Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
$attempts = 0
$maxAttempts = 10
$backendReady = $false

while ($attempts -lt $maxAttempts -and -not $backendReady) {
    Start-Sleep 2
    $attempts++
    Write-Host "   Attempt $attempts/$maxAttempts..." -ForegroundColor Gray
    $backendReady = Test-API
}

if ($backendReady) {
    Write-Host "✅ Backend server is ready!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Backend server may not be ready, but continuing anyway..." -ForegroundColor Yellow
}

Write-Host "🎯 Step 2: Starting Frontend Server" -ForegroundColor Yellow
Start-Frontend

Write-Host "`n🎉 Development Environment Started!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "📊 Health Check: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host "💡 Both servers are starting in separate windows." -ForegroundColor Gray
Write-Host "   Frontend will open automatically in your browser." -ForegroundColor Gray
Write-Host "   Use Ctrl+C in each window to stop the servers." -ForegroundColor Gray

# Wait for user input to keep the script window open
Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
