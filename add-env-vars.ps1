# Automated script to add environment variables to Vercel
# This will prompt you for each value

Write-Host "================================================"
Write-Host "ADDING ENVIRONMENT VARIABLES TO VERCEL VIA CLI"
Write-Host "================================================"
Write-Host ""
Write-Host "This script will add each environment variable."
Write-Host "You'll need to paste values from your .env.local file."
Write-Host ""
Write-Host "Press ENTER to start..."
Read-Host

# Function to add environment variable
function Add-VercelEnv {
    param (
        [string]$Name,
        [string]$Source
    )
    
    Write-Host ""
    Write-Host "Adding: $Name" -ForegroundColor Cyan
    Write-Host "Get value from: $Source" -ForegroundColor Yellow
    Write-Host ""
    
    # Create a temporary file with the value
    $value = Read-Host "Paste the value for $Name"
    $value | Out-File -FilePath ".env-temp" -Encoding UTF8 -NoNewline
    
    # Add to Vercel (production only)
    Get-Content ".env-temp" | .\node-portable\npx.cmd vercel env add $Name production
    
    # Clean up
    Remove-Item ".env-temp" -ErrorAction SilentlyContinue
    
    Write-Host "✓ Added $Name" -ForegroundColor Green
}

# Add each variable
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUPABASE VARIABLES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Add-VercelEnv "NEXT_PUBLIC_SUPABASE_URL" ".env.local"
Add-VercelEnv "NEXT_PUBLIC_SUPABASE_ANON_KEY" ".env.local"
Add-VercelEnv "SUPABASE_SERVICE_ROLE_KEY" ".env.local"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXTAUTH VARIABLES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Adding: NEXTAUTH_URL" -ForegroundColor Cyan
"https://wla-app.vercel.app" | Out-File -FilePath ".env-temp" -Encoding UTF8 -NoNewline
Get-Content ".env-temp" | .\node-portable\npx.cmd vercel env add NEXTAUTH_URL production
Remove-Item ".env-temp" -ErrorAction SilentlyContinue
Write-Host "✓ Added NEXTAUTH_URL" -ForegroundColor Green

Add-VercelEnv "NEXTAUTH_SECRET" ".env.local"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STRIPE VARIABLES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Add-VercelEnv "STRIPE_SECRET_KEY" "YOUR-STRIPE-KEYS.txt"
Add-VercelEnv "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "YOUR-STRIPE-KEYS.txt"
Add-VercelEnv "STRIPE_WEBHOOK_SECRET" "YOUR-STRIPE-KEYS.txt"

Write-Host ""
Write-Host "Adding Stripe Price IDs (auto)..." -ForegroundColor Cyan

"price_1SR0V1Lxnej9R7UU8Sc99IJr" | Out-File -FilePath ".env-temp" -Encoding UTF8 -NoNewline
Get-Content ".env-temp" | .\node-portable\npx.cmd vercel env add STRIPE_PRICE_SCHOOL_BASIC production
Write-Host "✓ Added STRIPE_PRICE_SCHOOL_BASIC" -ForegroundColor Green

"price_1SR0VPLxnej9R7UUu72O5kB1" | Out-File -FilePath ".env-temp" -Encoding UTF8 -NoNewline
Get-Content ".env-temp" | .\node-portable\npx.cmd vercel env add STRIPE_PRICE_SCHOOL_PRO production
Write-Host "✓ Added STRIPE_PRICE_SCHOOL_PRO" -ForegroundColor Green

"price_1SR0VqLxnej9R7UUUTiPYQdd" | Out-File -FilePath ".env-temp" -Encoding UTF8 -NoNewline
Get-Content ".env-temp" | .\node-portable\npx.cmd vercel env add STRIPE_PRICE_SCHOOL_UNLIMITED production
Write-Host "✓ Added STRIPE_PRICE_SCHOOL_UNLIMITED" -ForegroundColor Green

"price_1SR0WlLxnej9R7UULmdjGR6d" | Out-File -FilePath ".env-temp" -Encoding UTF8 -NoNewline
Get-Content ".env-temp" | .\node-portable\npx.cmd vercel env add STRIPE_PRICE_DISTRICT production
Write-Host "✓ Added STRIPE_PRICE_DISTRICT" -ForegroundColor Green

Remove-Item ".env-temp" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OTHER VARIABLES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

"1.0.0" | Out-File -FilePath ".env-temp" -Encoding UTF8 -NoNewline
Get-Content ".env-temp" | .\node-portable\npx.cmd vercel env add NEXT_PUBLIC_APP_VERSION production
Write-Host "✓ Added NEXT_PUBLIC_APP_VERSION" -ForegroundColor Green

"production" | Out-File -FilePath ".env-temp" -Encoding UTF8 -NoNewline
Get-Content ".env-temp" | .\node-portable\npx.cmd vercel env add NODE_ENV production
Write-Host "✓ Added NODE_ENV" -ForegroundColor Green

Remove-Item ".env-temp" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✓ ALL ENVIRONMENT VARIABLES ADDED!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now deploying to production..."
Write-Host ""

.\node-portable\npx.cmd vercel --prod --yes

Write-Host ""
Write-Host "================================================"
Write-Host "DEPLOYMENT COMPLETE!"
Write-Host "================================================"

