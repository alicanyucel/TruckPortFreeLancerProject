# TruckPort Production Deployment Script for Windows PowerShell
# This script deploys the TruckPort application to production on Windows

param(
    [string]$Environment = "production",
    [switch]$SkipTests = $false,
    [switch]$SkipBuild = $false
)

# Configuration
$ProjectName = "truckport"
$ImageName = "truckport"
$ContainerName = "truckport-app"
$Port = "80"
$SSLPort = "443"

# Functions
function Write-Info {
    param([string]$Message)
    Write-Host "🚛 $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Main deployment process
try {
    Write-Info "TruckPort Production Deployment Started..."
    
    # Step 1: Clean previous builds
    if (-not $SkipBuild) {
        Write-Info "📦 Cleaning previous builds..."
        if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
        if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }
        docker system prune -f
    }
    
    # Step 2: Install dependencies
    Write-Info "📋 Installing dependencies..."
    npm ci --production=false
    if ($LASTEXITCODE -ne 0) { throw "Failed to install dependencies" }
    
    # Step 3: Run security audit
    Write-Warning "🔒 Running security audit..."
    npm audit --audit-level high
    
    # Step 4: Run linting
    Write-Warning "🔍 Running linting..."
    npm run lint
    if ($LASTEXITCODE -ne 0) { throw "Linting failed" }
    
    # Step 5: Run tests (optional)
    if (-not $SkipTests) {
        Write-Warning "🧪 Running tests..."
        npm run test:ci
        if ($LASTEXITCODE -ne 0) { throw "Tests failed" }
    }
    
    # Step 6: Build for production
    if (-not $SkipBuild) {
        Write-Info "🏗️ Building for production..."
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Production build failed" }
    }
    
    # Step 7: Build Docker image
    Write-Info "🐳 Building Docker image..."
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    docker build -t "${ImageName}:latest" .
    if ($LASTEXITCODE -ne 0) { throw "Docker build failed" }
    
    docker tag "${ImageName}:latest" "${ImageName}:$timestamp"
    
    # Step 8: Stop existing container
    Write-Warning "⏹️ Stopping existing container..."
    docker stop $ContainerName 2>$null
    docker rm $ContainerName 2>$null
    
    # Step 9: Start new container
    Write-Success "🚀 Starting new container..."
    docker run -d `
        --name $ContainerName `
        --restart unless-stopped `
        -p "${Port}:80" `
        -p "${SSLPort}:443" `
        --memory="1g" `
        --cpus="1" `
        -e NODE_ENV=production `
        "${ImageName}:latest"
    
    if ($LASTEXITCODE -ne 0) { throw "Failed to start container" }
    
    # Step 10: Health check
    Write-Info "🏥 Performing health check..."
    Start-Sleep -Seconds 10
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port" -Method GET -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-Success "✅ Deployment successful! Application is running on port $Port"
            Write-Success "🌐 Access your app at: http://localhost:$Port"
        } else {
            throw "Health check failed - HTTP $($response.StatusCode)"
        }
    }
    catch {
        Write-Error "❌ Deployment failed! Application is not responding: $($_.Exception.Message)"
        exit 1
    }
    
    # Step 11: Show container status
    Write-Info "📊 Container status:"
    docker ps --filter "name=$ContainerName"
    
    Write-Success "🎉 TruckPort Production Deployment Completed Successfully!"
    Write-Info "📋 Summary:"
    Write-Host "  - Application: $ProjectName" -ForegroundColor Cyan
    Write-Host "  - Container: $ContainerName" -ForegroundColor Cyan
    Write-Host "  - HTTP Port: $Port" -ForegroundColor Cyan
    Write-Host "  - HTTPS Port: $SSLPort" -ForegroundColor Cyan
    Write-Host "  - Status: Running" -ForegroundColor Green
    Write-Host "  - Health: ✅ Healthy" -ForegroundColor Green
    
    # Optional: Show logs
    $showLogs = Read-Host "Do you want to see application logs? (y/n)"
    if ($showLogs -eq "y" -or $showLogs -eq "Y") {
        Write-Info "📝 Application logs:"
        docker logs $ContainerName --tail 50
    }
}
catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    
    # Show container logs if container exists
    $containerExists = docker ps -a --filter "name=$ContainerName" --format "{{.Names}}"
    if ($containerExists) {
        Write-Warning "📝 Container logs for debugging:"
        docker logs $ContainerName --tail 20
    }
    
    exit 1
}
