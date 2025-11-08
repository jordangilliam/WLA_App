# Fix Vercel Environment Variables
# Run this script to remove broken env var references and redeploy

Write-Host "================================================"
Write-Host "FIXING VERCEL ENVIRONMENT VARIABLES"
Write-Host "================================================"
Write-Host ""
Write-Host "The environment variables are referencing non-existent secrets."
Write-Host "We need to remove them from Vercel dashboard and re-add with direct values."
Write-Host ""
Write-Host "QUICK FIX:"
Write-Host "1. Go to: https://vercel.com/jordan-gilliams-projects/wla-app/settings/environment-variables"
Write-Host "2. Delete ALL environment variables (click trash icon for each)"
Write-Host "3. Re-add them using 'Plaintext' option (NOT 'Reference')"
Write-Host ""
Write-Host "Then come back and press ENTER to continue deployment..."
Read-Host
Write-Host ""
Write-Host "Deploying to Vercel..."
.\node-portable\npx.cmd vercel --prod --yes

