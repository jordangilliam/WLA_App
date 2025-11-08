@echo off
echo Removing old environment variables...
echo.

.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes
.\node-portable\npx.cmd vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes
.\node-portable\npx.cmd vercel env rm NEXTAUTH_URL production --yes
.\node-portable\npx.cmd vercel env rm NEXTAUTH_SECRET production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_SECRET_KEY production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_WEBHOOK_SECRET production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_BASIC production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_PRO production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_UNLIMITED production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_DISTRICT production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_APP_VERSION production --yes
.\node-portable\npx.cmd vercel env rm NODE_ENV production --yes

echo.
echo All old variables removed! Now re-run the add commands.
pause

