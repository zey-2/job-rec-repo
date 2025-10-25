#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build script for AI Job Recommender

.DESCRIPTION
    Rebuilds the index.js bundle from TypeScript source files using esbuild.
    Run this script whenever you modify .tsx or .ts files.

.EXAMPLE
    .\build.ps1
#>

Write-Host "🔨 Building AI Job Recommender..." -ForegroundColor Cyan

# Check if npx is available
try {
    $null = Get-Command npx -ErrorAction Stop
} catch {
    Write-Host "❌ Error: npx not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Backup old bundle
if (Test-Path "index.js") {
    Write-Host "📦 Backing up old bundle..." -ForegroundColor Yellow
    Copy-Item "index.js" "index.js.backup" -Force
}

# Build with esbuild
Write-Host "⚡ Running esbuild..." -ForegroundColor Yellow
npx esbuild index.tsx `
    --bundle `
    --format=esm `
    --outfile=index.js `
    --external:react `
    --external:react-dom/client `
    --external:@google/genai `
    --external:lucide-react `
    --jsx=automatic

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "📊 Bundle size: $((Get-Item index.js).Length / 1KB) KB" -ForegroundColor Cyan
    
    # Clean up backup
    if (Test-Path "index.js.backup") {
        Remove-Item "index.js.backup" -Force
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    
    # Restore backup if build failed
    if (Test-Path "index.js.backup") {
        Write-Host "🔄 Restoring previous bundle..." -ForegroundColor Yellow
        Move-Item "index.js.backup" "index.js" -Force
    }
    exit 1
}

Write-Host ""
Write-Host "🚀 Ready to serve! Run: python server.py 8000" -ForegroundColor Green
