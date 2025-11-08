@echo off
echo ================================================
echo REMOVING ALL ENVIRONMENT VARIABLES
echo ================================================
echo This will remove ALL variables and you'll re-add them fresh.
echo.
pause

echo Removing all variables...

.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes
.\node-portable\npx.cmd vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes
.\node-portable\npx.cmd vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes
.\node-portable\npx.cmd vercel env rm NEXTAUTH_URL production --yes
.\node-portable\npx.cmd vercel env rm NEXTAUTH_URL production --yes
.\node-portable\npx.cmd vercel env rm NEXTAUTH_SECRET production --yes
.\node-portable\npx.cmd vercel env rm NEXTAUTH_SECRET production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_SECRET_KEY production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_SECRET_KEY production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_WEBHOOK_SECRET production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_WEBHOOK_SECRET production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_BASIC production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_BASIC production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_PRO production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_PRO production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_UNLIMITED production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_SCHOOL_UNLIMITED production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_DISTRICT production --yes
.\node-portable\npx.cmd vercel env rm STRIPE_PRICE_DISTRICT production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_APP_VERSION production --yes
.\node-portable\npx.cmd vercel env rm NEXT_PUBLIC_APP_VERSION production --yes
.\node-portable\npx.cmd vercel env rm NODE_ENV production --yes
.\node-portable\npx.cmd vercel env rm NODE_ENV production --yes

echo.
echo ================================================
echo ALL DUPLICATES REMOVED!
echo ================================================
echo.
echo Now opening .env.local file...
echo Copy the values from .env.local to add them properly.
echo.
pause

notepad .env.local

echo.
echo Now opening YOUR-STRIPE-KEYS.txt...
pause

notepad YOUR-STRIPE-KEYS.txt

echo.
echo ================================================
echo Now run FINAL-ADD-ENV.txt commands one by one!
echo ================================================
pause

