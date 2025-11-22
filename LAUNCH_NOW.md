# 🚀 DEPLOYMENT LAUNCH GUIDE

**Status:** ✅ **READY TO DEPLOY NOW**  
**Date:** November 22, 2025  
**Build Status:** Passing ✅  
**Commit:** Ready to push  

---

## 🎯 IMMEDIATE ACTIONS (Next 15 Minutes)

### Step 1: Push to GitHub (2 minutes)

Your code is committed locally. Push it to GitHub:

```bash
cd /Users/jordangilliam/Desktop/WLA_App
git push origin main
```

If you need to authenticate:
```bash
# If using GitHub CLI
gh auth login

# Or use SSH if configured
git remote set-url origin git@github.com:jordangilliam/WLA_App.git
git push origin main
```

---

### Step 2: Deploy to Vercel (10 minutes)

#### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel:** https://vercel.com/login
2. **Click "Add New Project"**
3. **Import your GitHub repository:**
   - Select "Import Git Repository"
   - Find and select `jordangilliam/WLA_App`
   - Click "Import"

4. **Configure Project Settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   
   Click "Environment Variables" and add these:

   ```bash
   # REQUIRED - Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://vaqcsbneypmdhrqnnjph.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from Supabase Dashboard>
   SUPABASE_SERVICE_ROLE_KEY=<get from Supabase Dashboard>
   SUPABASE_KEY=<same as NEXT_PUBLIC_SUPABASE_ANON_KEY>

   # REQUIRED - NextAuth
   NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
   NEXTAUTH_URL=https://your-project.vercel.app

   # REQUIRED - Mapbox
   NEXT_PUBLIC_MAPBOX_TOKEN=<get from Mapbox Dashboard>
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<same as above>
   NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN=<same as above>

   # OPTIONAL - Application
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NODE_ENV=production

   # OPTIONAL - Stripe (if using payments)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from Stripe Dashboard>
   STRIPE_SECRET_KEY=<from Stripe Dashboard>
   STRIPE_WEBHOOK_SECRET=<from Stripe Dashboard>
   STRIPE_PRICE_SCHOOL_BASIC=<from Stripe Dashboard>
   STRIPE_PRICE_SCHOOL_PRO=<from Stripe Dashboard>
   STRIPE_PRICE_SCHOOL_UNLIMITED=<from Stripe Dashboard>
   STRIPE_PRICE_DISTRICT=<from Stripe Dashboard>
   ```

   **Important:** Set all as "plaintext" (not encrypted) for first deployment.

6. **Deploy:**
   - Click "Deploy"
   - Wait 5-10 minutes for build to complete
   - Watch the build logs for any errors

7. **Get Your URL:**
   - Once deployed, you'll get a URL like: `https://your-project.vercel.app`
   - Visit it to verify deployment

#### Option B: Install Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /Users/jordangilliam/Desktop/WLA_App
vercel --prod
```

---

### Step 3: Get Your Environment Variable Values

#### Supabase Keys

1. Go to: https://app.supabase.com
2. Select your project (vaqcsbneypmdhrqnnjph)
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

#### NextAuth Secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

Copy the output → `NEXTAUTH_SECRET`

#### Mapbox Token

1. Go to: https://account.mapbox.com/access-tokens/
2. Create a new token or copy existing token
3. Copy token → All three Mapbox variables

---

## ⚙️ POST-DEPLOYMENT (Next 30 Minutes)

### Step 4: Verify Deployment

Once deployment completes, test these URLs:

1. **Homepage:**
   ```
   https://your-project.vercel.app
   ```
   ✅ Should load without errors

2. **API Health Check:**
   ```
   https://your-project.vercel.app/api/health
   ```
   ✅ Should return: `{"status":"ok"}`

3. **Map Page:**
   ```
   https://your-project.vercel.app/explore
   ```
   ✅ Map should load with field sites

4. **Fly Fishing API:**
   ```
   https://your-project.vercel.app/api/experts/techniques
   https://your-project.vercel.app/api/shops/all
   ```
   ✅ Should return JSON data

### Step 5: Update NextAuth URL

After deployment, update the `NEXTAUTH_URL` environment variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `NEXTAUTH_URL`
3. Change from placeholder to your actual URL:
   ```
   NEXTAUTH_URL=https://your-actual-project.vercel.app
   ```
4. Redeploy (Vercel will auto-redeploy on env change)

### Step 6: Test Authentication

1. Visit: `https://your-project.vercel.app`
2. Click "Sign Up" or "Login"
3. Try creating an account
4. ✅ Authentication should work

### Step 7: Run Verification Checklist

Follow the checklist in `POST_DEPLOYMENT_CHECKLIST.md`:

**Core Tests:**
- [ ] Homepage loads
- [ ] Sign up/login works
- [ ] Map displays field sites
- [ ] Check-in flow works
- [ ] Observations can be created
- [ ] Challenges display
- [ ] Leaderboard shows rankings

**Fly Fishing Features:**
- [ ] Expert techniques accessible
- [ ] Fly shops display on map
- [ ] Hatch data available
- [ ] PFBC data accessible

**Teacher Tools:**
- [ ] Teacher dashboard loads
- [ ] Class creation works
- [ ] Student management works

---

## 🐛 TROUBLESHOOTING

### Build Fails

**Error: "Module not found"**
- Solution: Run `npm install` locally and commit `package-lock.json`
- Redeploy

**Error: "Environment variable missing"**
- Solution: Check all required variables are set in Vercel
- Variable names are case-sensitive
- No trailing spaces

### Runtime Errors

**Error: "Database connection failed"**
- Check Supabase URL is correct
- Verify anon key is valid
- Ensure Supabase project is not paused

**Error: "Map not loading"**
- Verify Mapbox token is valid
- Check all three Mapbox variables are set
- Token must have map access scope

**Error: "Authentication not working"**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches deployment URL
- Ensure both are in "Production" environment

---

## 📊 EXPECTED BUILD OUTPUT

When deployment succeeds, you should see:

```
✅ Build successful
✅ 108 pages generated
✅ All API routes compiled
✅ Middleware compiled
⏱️ Build time: 5-10 minutes
📦 Total size: ~2.5MB
```

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Homepage loads
- ✅ Authentication works
- ✅ Map displays
- ✅ API endpoints return data
- ✅ No console errors in browser
- ✅ Database queries succeed

---

## 📞 NEED HELP?

### Check These First:
1. Build logs in Vercel Dashboard
2. Browser console for errors
3. Supabase logs for database errors
4. Network tab for failed requests

### Common Issues:
- **404 errors:** Check route files exist
- **500 errors:** Check environment variables
- **Map blank:** Check Mapbox token
- **Database errors:** Check Supabase connection

### Contact:
- Email: stringtheorysolutionsllc@gmail.com
- Include: Error message, URL, what you were trying to do

---

## 🔄 ROLLBACK (If Needed)

If something goes wrong:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click **"⋯"** → **"Promote to Production"**
4. Previous version will be restored

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Build started
- [ ] Build completed successfully
- [ ] Homepage loads
- [ ] API endpoints work
- [ ] Authentication tested
- [ ] Map displays correctly
- [ ] Database queries work
- [ ] NEXTAUTH_URL updated
- [ ] Post-deployment tests passed

---

## 🎊 NEXT STEPS AFTER DEPLOYMENT

1. **Set up monitoring:**
   - Add Sentry for error tracking
   - Enable Vercel Analytics
   - Set up uptime monitoring

2. **Custom domain (optional):**
   - Add your domain in Vercel
   - Configure DNS
   - Update `NEXTAUTH_URL`

3. **Invite users:**
   - Create teacher accounts
   - Set up demo/test accounts
   - Prepare onboarding materials

4. **Library deployment:**
   - Configure iPads
   - Train library staff
   - Set up demo accounts

---

## 📈 POST-LAUNCH MONITORING

**First 24 Hours:**
- Monitor error logs every few hours
- Check for slow queries in Supabase
- Watch for failed API calls
- Test on multiple devices

**First Week:**
- Gather user feedback
- Monitor performance metrics
- Check database growth
- Address any issues

---

**YOU'RE READY TO LAUNCH! 🚀**

Follow these steps and you'll have WildPraxis live in production within 30 minutes.

---

**Last Updated:** November 22, 2025  
**Status:** Ready for immediate deployment  
**Build:** Passing ✅

