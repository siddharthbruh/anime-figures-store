# Enhanced Anime Figures Store Startup Script
# This script starts both frontend and backend with all enhancements

Write-Host "🚀 Starting Enhanced Anime Figures Store..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Function to start backend
function Start-Backend {
    Write-Host "🔧 Starting Backend Server..." -ForegroundColor Blue
    try {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🚀 Backend Server Starting...' -ForegroundColor Green; npm run dev"
        Write-Host "✅ Backend server started on http://localhost:5000" -ForegroundColor Green
        Start-Sleep -Seconds 3
    } catch {
        Write-Host "❌ Failed to start backend server" -ForegroundColor Red
        Write-Host "🔍 Make sure to run 'npm install --legacy-peer-deps' in the backend directory first" -ForegroundColor Yellow
    }
}

# Function to start frontend
function Start-Frontend {
    Write-Host "🎨 Starting Frontend Application..." -ForegroundColor Blue
    try {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '🎨 Frontend Application Starting...' -ForegroundColor Green; npm start"
        Write-Host "✅ Frontend application will start on http://localhost:3000" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start frontend application" -ForegroundColor Red
        Write-Host "🔍 Make sure to run 'npm install --legacy-peer-deps' in the root directory first" -ForegroundColor Yellow
    }
}

# Check if dependencies are installed
$backendNodeModules = Test-Path "$PSScriptRoot\backend\node_modules"
$frontendNodeModules = Test-Path "$PSScriptRoot\node_modules"

if (-not $backendNodeModules) {
    Write-Host "⚠️  Backend dependencies not found. Installing..." -ForegroundColor Yellow
    Set-Location "$PSScriptRoot\backend"
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}

if (-not $frontendNodeModules) {
    Write-Host "⚠️  Frontend dependencies not found. Installing..." -ForegroundColor Yellow
    Set-Location "$PSScriptRoot"
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}

# Reset location
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "🎯 Enhanced Features Included:" -ForegroundColor Magenta
Write-Host "  • 🎨 Advanced Animations (Magnetic hover, 3D tilts, Particles)" -ForegroundColor White
Write-Host "  • 🔍 Smart Search with live suggestions" -ForegroundColor White
Write-Host "  • 🔧 Advanced filtering (Price, Category, Anime)" -ForegroundColor White
Write-Host "  • 💳 Fixed Payment inputs with validation" -ForegroundColor White
Write-Host "  • 📱 Enhanced responsive design" -ForegroundColor White
Write-Host "  • ⚡ Performance optimizations" -ForegroundColor White
Write-Host ""

# Start services
Start-Backend
Start-Sleep -Seconds 2
Start-Frontend

Write-Host ""
Write-Host "🎉 Both services are starting!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "  • Use the search bar to find products with fuzzy matching" -ForegroundColor White
Write-Host "  • Try the filter button for advanced filtering options" -ForegroundColor White
Write-Host "  • Hover over product cards to see magnetic animations" -ForegroundColor White
Write-Host "  • Payment forms now work perfectly!" -ForegroundColor White
Write-Host ""
Write-Host "❓ If you encounter issues, check ENHANCEMENTS_SUMMARY.md" -ForegroundColor Gray

# Wait for user input before closing
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
