# ============================================
# Create .env.local file automatically
# ============================================

Write-Host ""
Write-Host "🚀 WLA_App Environment Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "❌ Cancelled. Keeping existing .env.local" -ForegroundColor Red
        exit
    }
}

Write-Host "⚠️  IMPORTANT: Before running this script..." -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open YOUR-STRIPE-KEYS.txt and copy your Stripe values" -ForegroundColor White
Write-Host "2. You'll need to manually paste them into .env.local after this script" -ForegroundColor White
Write-Host ""
Write-Host "📝 I need your Supabase credentials..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to: https://supabase.com/dashboard/project/_/settings/api" -ForegroundColor White
Write-Host ""

# Get Supabase credentials
Write-Host "Enter your Project URL (e.g., https://abcdefgh.supabase.co):" -ForegroundColor Yellow
$supabaseUrl = Read-Host
Write-Host ""

Write-Host "Enter your Anon/Public key (starts with eyJ...):" -ForegroundColor Yellow
$supabaseAnonKey = Read-Host
Write-Host ""

Write-Host "Enter your Service Role key (starts with eyJ...):" -ForegroundColor Yellow
$supabaseServiceKey = Read-Host
Write-Host ""

# Create the .env.local file
$envContent = @"
# ==============================================
# WLA_App Environment Configuration
# Generated: $(Get-Date)
# ==============================================

# ----------------------------------------------
# Stripe Configuration (✅ FROM YOUR-STRIPE-KEYS.txt)
# ----------------------------------------------
# NOTE: Get these values from YOUR-STRIPE-KEYS.txt
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY_FROM_FILE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY_FROM_FILE
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET_FROM_FILE

# Stripe Price IDs (✅ FROM YOUR-STRIPE-KEYS.txt)
STRIPE_PRICE_SCHOOL_BASIC=YOUR_BASIC_PRICE_ID_FROM_FILE
STRIPE_PRICE_SCHOOL_PRO=YOUR_PRO_PRICE_ID_FROM_FILE
STRIPE_PRICE_SCHOOL_UNLIMITED=YOUR_UNLIMITED_PRICE_ID_FROM_FILE
STRIPE_PRICE_DISTRICT=YOUR_DISTRICT_PRICE_ID_FROM_FILE

# ----------------------------------------------
# Supabase Configuration (✅ CONFIGURED)
# ----------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey
SUPABASE_SERVICE_ROLE_KEY=$supabaseServiceKey

# ----------------------------------------------
# NextAuth Configuration (✅ CONFIGURED)
# ----------------------------------------------
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tR3N7Arb+tYrgbKvH7Z/t3a8BZ/MtNPmI8BuhwhSNvQ=

# ----------------------------------------------
# App Configuration
# ----------------------------------------------
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
"@

# Write the file
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host ""
Write-Host "✅ Success! .env.local created!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  ONE MORE STEP: Add your Stripe keys!" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open YOUR-STRIPE-KEYS.txt" -ForegroundColor White
Write-Host "2. Open .env.local" -ForegroundColor White
Write-Host "3. Replace the Stripe placeholder values with your real keys" -ForegroundColor White
Write-Host ""
Write-Host "📋 Configuration Summary:" -ForegroundColor Cyan
Write-Host "  ⚠️  Stripe keys (manual step required - see YOUR-STRIPE-KEYS.txt)" -ForegroundColor Yellow
Write-Host "  ✅ Supabase credentials (added)" -ForegroundColor White
Write-Host "  ✅ NextAuth secret (generated)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Green
Write-Host "  1. Run the subscription migration in Supabase SQL Editor" -ForegroundColor White
Write-Host "     (see SUPABASE-SETUP-QUICK.md for the SQL)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Start your dev server:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. Visit: http://localhost:3000/admin/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "🎉 You're ready to test!" -ForegroundColor Green
Write-Host ""

