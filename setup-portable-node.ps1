# WildPraxis - Portable Node.js Setup Script
# This script downloads and sets up Node.js without requiring installation

Write-Host "🚀 WildPraxis Portable Node.js Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Configuration
$nodeVersion = "v20.11.0"
$downloadUrl = "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-win-x64.zip"
$zipFile = "node-portable.zip"
$extractPath = ".\node-portable"
$downloadPath = ".\$zipFile"

# Check if already exists
if (Test-Path $extractPath) {
    Write-Host "⚠️  Portable Node.js already exists at $extractPath" -ForegroundColor Yellow
    $response = Read-Host "Do you want to re-download? (y/n)"
    if ($response -ne "y") {
        Write-Host "✅ Using existing installation" -ForegroundColor Green
        Write-Host ""
        & "$extractPath\node.exe" --version
        & "$extractPath\npm.cmd" --version
        Write-Host ""
        Write-Host "Run this command to install dependencies:" -ForegroundColor Cyan
        Write-Host ".\node-portable\npm.cmd install" -ForegroundColor White
        exit
    }
    Remove-Item $extractPath -Recurse -Force
}

# Download Node.js
Write-Host "📥 Downloading Node.js $nodeVersion..." -ForegroundColor Cyan
Write-Host "    From: $downloadUrl" -ForegroundColor Gray

try {
    # Use .NET WebClient for compatibility
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($downloadUrl, $downloadPath)
    Write-Host "✅ Download complete!" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual download option:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://nodejs.org/en/download" -ForegroundColor White
    Write-Host "2. Download: Windows Binary (.zip) 64-bit" -ForegroundColor White
    Write-Host "3. Extract to: $extractPath" -ForegroundColor White
    exit 1
}

# Extract
Write-Host ""
Write-Host "📦 Extracting Node.js..." -ForegroundColor Cyan

try {
    # Create extraction directory
    New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
    
    # Extract using .NET (built-in, no external tools needed)
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($downloadPath, ".\temp-extract")
    
    # Move contents from nested folder to node-portable
    $nestedFolder = Get-ChildItem ".\temp-extract" | Select-Object -First 1
    Move-Item "$($nestedFolder.FullName)\*" $extractPath -Force
    
    # Cleanup
    Remove-Item ".\temp-extract" -Recurse -Force
    Remove-Item $downloadPath -Force
    
    Write-Host "✅ Extraction complete!" -ForegroundColor Green
} catch {
    Write-Host "❌ Extraction failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual extraction:" -ForegroundColor Yellow
    Write-Host "1. Unzip $zipFile" -ForegroundColor White
    Write-Host "2. Move contents to $extractPath" -ForegroundColor White
    exit 1
}

# Test
Write-Host ""
Write-Host "🧪 Testing Node.js..." -ForegroundColor Cyan

$nodeVersion = & "$extractPath\node.exe" --version
$npmVersion = & "$extractPath\npm.cmd" --version

Write-Host "✅ Node.js $nodeVersion installed!" -ForegroundColor Green
Write-Host "✅ npm $npmVersion ready!" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "📦 Installing WildPraxis dependencies..." -ForegroundColor Cyan
Write-Host "    This will install @supabase/supabase-js" -ForegroundColor Gray
Write-Host ""

try {
    & "$extractPath\npm.cmd" install
    Write-Host ""
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  npm install failed, but Node.js is ready" -ForegroundColor Yellow
    Write-Host "You can run manually: .\node-portable\npm.cmd install" -ForegroundColor White
}

# Success message
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Portable Node.js installed at: $extractPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usage:" -ForegroundColor Yellow
Write-Host "  Run dev server:  .\node-portable\npm.cmd run dev" -ForegroundColor White
Write-Host "  Install packages: .\node-portable\npm.cmd install [package]" -ForegroundColor White
Write-Host "  Run node:        .\node-portable\node.exe script.js" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up Supabase (see SUPABASE_SETUP_GUIDE.md)" -ForegroundColor White
Write-Host "2. Update API routes (see TODO-PHASE1.md)" -ForegroundColor White
Write-Host ""
Write-Host "You're ready to build! 🚀" -ForegroundColor Green

