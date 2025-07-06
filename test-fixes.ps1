# Test Script to Verify All Fixes Are Working
# Run this to verify the anime figures store is working correctly

Write-Host "🧪 Testing Anime Figures Store Fixes..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Yellow

# Test 1: Check if both services are running
Write-Host "`n1. 🌐 Checking if services are running..." -ForegroundColor Blue

# Check frontend
$frontendRunning = $false
$frontendPort = ""
$frontendTests = @(3000, 3001, 3002)

foreach ($port in $frontendTests) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $frontendRunning = $true
            $frontendPort = $port
            break
        }
    } catch {
        # Port not available, continue
    }
}

if ($frontendRunning) {
    Write-Host "   ✅ Frontend running on port $frontendPort" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend not running" -ForegroundColor Red
    Write-Host "   💡 Run: npm start" -ForegroundColor Yellow
}

# Check backend
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $backendRunning = $true
        Write-Host "   ✅ Backend running on port 5000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend not running" -ForegroundColor Red
    Write-Host "   💡 Run: cd backend && npm run dev" -ForegroundColor Yellow
}

# Test 2: Check if compilation is successful
Write-Host "`n2. 🔧 Checking compilation status..." -ForegroundColor Blue

if (Test-Path "node_modules") {
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Dependencies missing" -ForegroundColor Red
    Write-Host "   💡 Run: npm install --legacy-peer-deps" -ForegroundColor Yellow
}

# Test 3: Check key files exist
Write-Host "`n3. 📁 Checking essential files..." -ForegroundColor Blue

$keyFiles = @(
    "src/App.js",
    "src/components/Checkout.js",
    "src/components/ProductGrid.js",
    "src/components/Cart.js",
    "backend/server.js"
)

foreach ($file in $keyFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file missing" -ForegroundColor Red
    }
}

# Test 4: API endpoints test
Write-Host "`n4. 🔌 Testing API endpoints..." -ForegroundColor Blue

if ($backendRunning) {
    $endpoints = @(
        @{name = "Health Check"; url = "http://localhost:5000/api/health"},
        @{name = "Products"; url = "http://localhost:5000/api/products"},
        @{name = "Categories"; url = "http://localhost:5000/api/categories"},
        @{name = "Cart"; url = "http://localhost:5000/api/cart"}
    )

    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri $endpoint.url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "   ✅ $($endpoint.name) API working" -ForegroundColor Green
            }
        } catch {
            Write-Host "   ❌ $($endpoint.name) API failed" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ⚠️  Backend not running - skipping API tests" -ForegroundColor Yellow
}

# Test Results Summary
Write-Host "`n📊 TEST SUMMARY" -ForegroundColor Magenta
Write-Host "================" -ForegroundColor Yellow

if ($frontendRunning -and $backendRunning) {
    Write-Host "🎉 SUCCESS! Both services are running" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access your application:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:$frontendPort" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
    Write-Host ""
    Write-Host "💳 PAYMENT FIXES TO TEST:" -ForegroundColor Yellow
    Write-Host "   1. Add items to cart" -ForegroundColor White
    Write-Host "   2. Go to checkout" -ForegroundColor White
    Write-Host "   3. Test these payment inputs:" -ForegroundColor White
    Write-Host "      • Card: 4111111111111111 → formats as 4111 1111 1111 1111" -ForegroundColor Gray
    Write-Host "      • Expiry: 1225 → formats as 12/25" -ForegroundColor Gray
    Write-Host "      • CVV: 123 → accepts numbers only" -ForegroundColor Gray
    Write-Host "      • Name: Any text → works normally" -ForegroundColor Gray
    
} elseif ($frontendRunning) {
    Write-Host "⚠️  Frontend running, but backend needs to be started" -ForegroundColor Yellow
    Write-Host "💡 To start backend: cd backend && npm run dev" -ForegroundColor Gray
    
} elseif ($backendRunning) {
    Write-Host "⚠️  Backend running, but frontend needs to be started" -ForegroundColor Yellow
    Write-Host "💡 To start frontend: npm start" -ForegroundColor Gray
    
} else {
    Write-Host "❌ Neither service is running" -ForegroundColor Red
    Write-Host "💡 Quick start: run .\start-enhanced.ps1" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📖 For detailed information, check:" -ForegroundColor Gray
Write-Host "   • CURRENT_STATUS.md - Current status and what's working" -ForegroundColor Gray
Write-Host "   • PAYMENT_FIXES.md - Payment fixes documentation" -ForegroundColor Gray

Write-Host "`nPress any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
