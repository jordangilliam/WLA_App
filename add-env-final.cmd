@echo off
echo ================================================
echo ADDING ENVIRONMENT VARIABLES VIA CLI
echo ================================================
echo.
echo This will prompt you for each value.
echo Paste the value when asked and press ENTER.
echo.
pause

echo.
echo Variable 1/14: NEXT_PUBLIC_SUPABASE_URL
set /p SUPABASE_URL="Enter NEXT_PUBLIC_SUPABASE_URL: "
echo %SUPABASE_URL% | .\node-portable\npx.cmd vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo.
echo Variable 2/14: NEXT_PUBLIC_SUPABASE_ANON_KEY
set /p SUPABASE_ANON="Enter NEXT_PUBLIC_SUPABASE_ANON_KEY: "
echo %SUPABASE_ANON% | .\node-portable\npx.cmd vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo.
echo Variable 3/14: SUPABASE_SERVICE_ROLE_KEY
set /p SUPABASE_SERVICE="Enter SUPABASE_SERVICE_ROLE_KEY: "
echo %SUPABASE_SERVICE% | .\node-portable\npx.cmd vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo.
echo Variable 4/14: NEXTAUTH_URL
echo https://wla-app.vercel.app | .\node-portable\npx.cmd vercel env add NEXTAUTH_URL production

echo.
echo Variable 5/14: NEXTAUTH_SECRET
set /p NEXTAUTH_SEC="Enter NEXTAUTH_SECRET: "
echo %NEXTAUTH_SEC% | .\node-portable\npx.cmd vercel env add NEXTAUTH_SECRET production

echo.
echo Variable 6/14: STRIPE_SECRET_KEY
set /p STRIPE_SEC="Enter STRIPE_SECRET_KEY: "
echo %STRIPE_SEC% | .\node-portable\npx.cmd vercel env add STRIPE_SECRET_KEY production

echo.
echo Variable 7/14: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
set /p STRIPE_PUB="Enter NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "
echo %STRIPE_PUB% | .\node-portable\npx.cmd vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

echo.
echo Variable 8/14: STRIPE_WEBHOOK_SECRET
set /p STRIPE_WEBHOOK="Enter STRIPE_WEBHOOK_SECRET: "
echo %STRIPE_WEBHOOK% | .\node-portable\npx.cmd vercel env add STRIPE_WEBHOOK_SECRET production

echo.
echo Variable 9/14: STRIPE_PRICE_SCHOOL_BASIC
echo price_1SR0V1Lxnej9R7UU8Sc99IJr | .\node-portable\npx.cmd vercel env add STRIPE_PRICE_SCHOOL_BASIC production

echo.
echo Variable 10/14: STRIPE_PRICE_SCHOOL_PRO
echo price_1SR0VPLxnej9R7UUu72O5kB1 | .\node-portable\npx.cmd vercel env add STRIPE_PRICE_SCHOOL_PRO production

echo.
echo Variable 11/14: STRIPE_PRICE_SCHOOL_UNLIMITED
echo price_1SR0VqLxnej9R7UUUTiPYQdd | .\node-portable\npx.cmd vercel env add STRIPE_PRICE_SCHOOL_UNLIMITED production

echo.
echo Variable 12/14: STRIPE_PRICE_DISTRICT
echo price_1SR0WlLxnej9R7UULmdjGR6d | .\node-portable\npx.cmd vercel env add STRIPE_PRICE_DISTRICT production

echo.
echo Variable 13/14: NEXT_PUBLIC_APP_VERSION
echo 1.0.0 | .\node-portable\npx.cmd vercel env add NEXT_PUBLIC_APP_VERSION production

echo.
echo Variable 14/14: NODE_ENV
echo production | .\node-portable\npx.cmd vercel env add NODE_ENV production

echo.
echo ================================================
echo ALL VARIABLES ADDED!
echo ================================================
echo.
echo Now deploying...
.\node-portable\npx.cmd vercel --prod --yes

pause

