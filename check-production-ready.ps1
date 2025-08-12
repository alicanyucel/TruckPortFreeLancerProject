# TruckPort Production Environment Checker
# This script checks if the environment is ready for production deployment

param(
    [switch]$Fix = $false
)

$ErrorActionPreference = "Continue"

function Write-CheckResult {
    param(
        [string]$Check,
        [bool]$Passed,
        [string]$Details = "",
        [string]$FixCommand = ""
    )
    
    $status = if ($Passed) { "✅ PASS" } else { "❌ FAIL" }
    $color = if ($Passed) { "Green" } else { "Red" }
    
    Write-Host "$status - $Check" -ForegroundColor $color
    if ($Details) { Write-Host "      $Details" -ForegroundColor Gray }
    if ($FixCommand -and -not $Passed -and $Fix) {
        Write-Host "      🔧 Fixing: $FixCommand" -ForegroundColor Yellow
        Invoke-Expression $FixCommand
    }
}

Write-Host "🚛 TruckPort Production Environment Checker" -ForegroundColor Blue
Write-Host "=============================================" -ForegroundColor Blue

# Node.js Check
$nodeVersion = node --version 2>$null
$nodeOk = $nodeVersion -and [version]($nodeVersion.Substring(1)) -ge [version]"16.0.0"
Write-CheckResult "Node.js (>=16.0.0)" $nodeOk "Current: $nodeVersion"

# npm Check
$npmVersion = npm --version 2>$null
$npmOk = $npmVersion -and [version]$npmVersion -ge [version]"8.0.0"
Write-CheckResult "npm (>=8.0.0)" $npmOk "Current: $npmVersion"

# Angular CLI Check
$ngVersion = ng version --json 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
$ngOk = $ngVersion -and $ngVersion.apps[0].dependencies.'@angular/core'
Write-CheckResult "Angular CLI" $ngOk "Installed and configured"

# Docker Check
$dockerVersion = docker --version 2>$null
$dockerOk = $dockerVersion -ne $null
Write-CheckResult "Docker" $dockerOk "Current: $dockerVersion"

# Docker Compose Check
$dockerComposeVersion = docker-compose --version 2>$null
$dockerComposeOk = $dockerComposeVersion -ne $null
Write-CheckResult "Docker Compose" $dockerComposeOk "Current: $dockerComposeVersion"

# Port Availability
$portTests = @(80, 443, 4200)
foreach ($port in $portTests) {
    $portInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    $portOk = -not $portInUse
    Write-CheckResult "Port $port Available" $portOk $(if ($portInUse) { "Port in use" } else { "Port available" })
}

# Dependencies Check
$packageJsonExists = Test-Path "package.json"
Write-CheckResult "package.json exists" $packageJsonExists

if ($packageJsonExists) {
    $nodeModulesExists = Test-Path "node_modules"
    Write-CheckResult "node_modules installed" $nodeModulesExists "" $(if (-not $nodeModulesExists) { "npm install" })
}

# Build Directory Check
$distExists = Test-Path "dist"
Write-CheckResult "Previous build exists" $distExists $(if ($distExists) { "dist/ directory found" } else { "No previous build" })

# Environment Files Check
$envProdExists = Test-Path "src/environments/environment.prod.ts"
Write-CheckResult "Production environment file" $envProdExists

# SSL Certificate Check (Optional)
$sslCertExists = Test-Path "ssl/cert.pem" -and (Test-Path "ssl/key.pem")
Write-CheckResult "SSL Certificates (Optional)" $sslCertExists $(if (-not $sslCertExists) { "SSL certificates not found (optional)" })

# Memory Check
$totalMemory = [math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
$memoryOk = $totalMemory -ge 4
Write-CheckResult "Available Memory (>=4GB)" $memoryOk "Total: ${totalMemory}GB"

# Disk Space Check
$freeSpace = [math]::Round((Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace / 1GB, 2)
$diskOk = $freeSpace -ge 5
Write-CheckResult "Free Disk Space (>=5GB)" $diskOk "Free: ${freeSpace}GB on C:"

# Git Status Check
$gitStatus = git status --porcelain 2>$null
$gitClean = -not $gitStatus
Write-CheckResult "Git Working Directory Clean" $gitClean $(if ($gitStatus) { "Uncommitted changes found" } else { "Working directory clean" })

# TypeScript Check
$tscVersion = tsc --version 2>$null
$tscOk = $tscVersion -ne $null
Write-CheckResult "TypeScript Compiler" $tscOk "Current: $tscVersion"

# Security Check
Write-Host "`n🔒 Security Checks:" -ForegroundColor Yellow

# Check for sensitive files
$sensitiveFiles = @(".env", ".env.local", ".env.production", "*.key", "*.pem")
$foundSensitive = @()
foreach ($pattern in $sensitiveFiles) {
    $files = Get-ChildItem -Path . -Name $pattern -ErrorAction SilentlyContinue
    $foundSensitive += $files
}
$securityOk = $foundSensitive.Count -eq 0
Write-CheckResult "No sensitive files in repo" $securityOk $(if ($foundSensitive) { "Found: $($foundSensitive -join ', ')" })

# Summary
Write-Host "`n📊 Summary:" -ForegroundColor Blue
$allChecks = @($nodeOk, $npmOk, $ngOk, $dockerOk, $dockerComposeOk, $packageJsonExists, $envProdExists, $memoryOk, $diskOk, $gitClean, $tscOk, $securityOk)
$passedChecks = ($allChecks | Where-Object { $_ }).Count
$totalChecks = $allChecks.Count

$readinessScore = [math]::Round(($passedChecks / $totalChecks) * 100, 0)

if ($readinessScore -ge 90) {
    Write-Host "🎉 Production Ready! Score: $readinessScore%" -ForegroundColor Green
} elseif ($readinessScore -ge 75) {
    Write-Host "⚠️ Mostly Ready. Score: $readinessScore%" -ForegroundColor Yellow
    Write-Host "Consider addressing the failed checks before deployment." -ForegroundColor Yellow
} else {
    Write-Host "❌ Not Ready for Production. Score: $readinessScore%" -ForegroundColor Red
    Write-Host "Please address the failed checks before deployment." -ForegroundColor Red
}

Write-Host "`nPassed: $passedChecks/$totalChecks checks" -ForegroundColor Cyan

if ($Fix) {
    Write-Host "`n🔧 Auto-fix attempted where possible." -ForegroundColor Yellow
    Write-Host "Re-run the script to verify fixes." -ForegroundColor Yellow
}
