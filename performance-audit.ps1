# TruckPort Performance Monitoring Script
# Runs Lighthouse audit and generates performance report

param(
    [string]$Url = "http://localhost:4200",
    [string]$OutputDir = "./performance-reports",
    [switch]$CI = $false
)

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportPath = "$OutputDir/lighthouse-report-$timestamp"

Write-Host "🚛 TruckPort Performance Audit" -ForegroundColor Blue
Write-Host "==============================" -ForegroundColor Blue

# Check if Lighthouse is installed
$lighthouseInstalled = Get-Command lighthouse -ErrorAction SilentlyContinue
if (-not $lighthouseInstalled) {
    Write-Host "❌ Lighthouse not found. Installing..." -ForegroundColor Yellow
    npm install -g @lhci/cli lighthouse
}

# Run Lighthouse audit
Write-Host "🔍 Running Lighthouse audit on: $Url" -ForegroundColor Green
Write-Host "📊 Report will be saved to: $reportPath" -ForegroundColor Cyan

$lighthouseArgs = @(
    $Url,
    "--output=html",
    "--output=json",
    "--output-path=$reportPath",
    "--chrome-flags=--headless",
    "--quiet"
)

if ($CI) {
    $lighthouseArgs += "--chrome-flags=--no-sandbox"
    $lighthouseArgs += "--chrome-flags=--disable-dev-shm-usage"
}

# Performance budgets (thresholds)
$performanceBudget = @{
    Performance = 90
    Accessibility = 95
    BestPractices = 90
    SEO = 90
    PWA = 80
}

try {
    # Run the audit
    $output = & lighthouse $lighthouseArgs 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Lighthouse audit completed successfully!" -ForegroundColor Green
        
        # Parse JSON report
        $jsonReport = "$reportPath.report.json"
        if (Test-Path $jsonReport) {
            $report = Get-Content $jsonReport | ConvertFrom-Json
            
            # Extract scores
            $scores = @{
                Performance = [math]::Round($report.categories.performance.score * 100, 0)
                Accessibility = [math]::Round($report.categories.accessibility.score * 100, 0)
                BestPractices = [math]::Round($report.categories.'best-practices'.score * 100, 0)
                SEO = [math]::Round($report.categories.seo.score * 100, 0)
            }
            
            # Add PWA score if available
            if ($report.categories.pwa) {
                $scores.PWA = [math]::Round($report.categories.pwa.score * 100, 0)
            }
            
            Write-Host "`n📊 Performance Scores:" -ForegroundColor Blue
            Write-Host "======================" -ForegroundColor Blue
            
            foreach ($category in $scores.Keys) {
                $score = $scores[$category]
                $budget = $performanceBudget[$category]
                $status = if ($score -ge $budget) { "✅ PASS" } else { "❌ FAIL" }
                $color = if ($score -ge $budget) { "Green" } else { "Red" }
                
                Write-Host "$status $category`: $score/100 (Budget: $budget)" -ForegroundColor $color
            }
            
            # Overall assessment
            $overallScore = [math]::Round(($scores.Values | Measure-Object -Average).Average, 0)
            Write-Host "`n🎯 Overall Score: $overallScore/100" -ForegroundColor Cyan
            
            if ($overallScore -ge 90) {
                Write-Host "🏆 Excellent performance!" -ForegroundColor Green
            } elseif ($overallScore -ge 75) {
                Write-Host "👍 Good performance, some improvements possible" -ForegroundColor Yellow
            } else {
                Write-Host "⚠️ Performance needs improvement" -ForegroundColor Red
            }
            
            # Key metrics
            Write-Host "`n⚡ Key Metrics:" -ForegroundColor Blue
            $metrics = $report.audits
            
            if ($metrics.'first-contentful-paint') {
                $fcp = [math]::Round($metrics.'first-contentful-paint'.numericValue / 1000, 2)
                Write-Host "First Contentful Paint: ${fcp}s" -ForegroundColor Cyan
            }
            
            if ($metrics.'largest-contentful-paint') {
                $lcp = [math]::Round($metrics.'largest-contentful-paint'.numericValue / 1000, 2)
                Write-Host "Largest Contentful Paint: ${lcp}s" -ForegroundColor Cyan
            }
            
            if ($metrics.'cumulative-layout-shift') {
                $cls = [math]::Round($metrics.'cumulative-layout-shift'.numericValue, 3)
                Write-Host "Cumulative Layout Shift: $cls" -ForegroundColor Cyan
            }
            
            if ($metrics.'total-blocking-time') {
                $tbt = [math]::Round($metrics.'total-blocking-time'.numericValue, 0)
                Write-Host "Total Blocking Time: ${tbt}ms" -ForegroundColor Cyan
            }
            
            # Performance opportunities
            Write-Host "`n🔧 Top Opportunities:" -ForegroundColor Yellow
            $opportunities = $report.audits | Get-Member -MemberType NoteProperty | 
                ForEach-Object { $report.audits.($_.Name) } | 
                Where-Object { $_.details -and $_.details.overallSavingsMs -gt 0 } |
                Sort-Object { $_.details.overallSavingsMs } -Descending |
                Select-Object -First 5
            
            foreach ($opp in $opportunities) {
                $savings = [math]::Round($opp.details.overallSavingsMs / 1000, 2)
                Write-Host "• $($opp.title): Save ${savings}s" -ForegroundColor Yellow
            }
        }
        
        Write-Host "`n📁 Reports saved:" -ForegroundColor Green
        Write-Host "HTML Report: $reportPath.report.html" -ForegroundColor Cyan
        Write-Host "JSON Report: $reportPath.report.json" -ForegroundColor Cyan
        
        # Open HTML report
        $openReport = Read-Host "`nOpen HTML report in browser? (y/n)"
        if ($openReport -eq "y" -or $openReport -eq "Y") {
            Start-Process "$reportPath.report.html"
        }
        
    } else {
        Write-Host "❌ Lighthouse audit failed!" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Error running Lighthouse: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Performance audit completed!" -ForegroundColor Green
