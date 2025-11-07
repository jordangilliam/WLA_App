# 🚀 WildPraxis Launch Roadmap
## From "Ready to Code" to "Live in Production"

**Current Status:** Dependencies installed, infrastructure ready ✅  
**Goal:** Get the app deployed and usable  
**Timeline:** 2-4 weeks for MVP launch

---

## 🎯 Path to Launch: 3 Critical Phases

### Phase A: Get Database Working (THIS WEEK - 6-8 hours)
**Goal:** Replace mock data with real database

### Phase B: Deploy to Web (WEEK 2 - 4 hours)  
**Goal:** Get it live at a real URL

### Phase C: Mobile Apps (WEEKS 3-16 - ongoing)
**Goal:** iOS and Android native apps

---

## 📋 PHASE A: Database Setup (Do This First!)

### Step 1: Create Supabase Account (30 min)
**What to do:**
1. Go to https://supabase.com
2. Click "Start your project" 
3. Sign up (use your work email)
4. Click "New project"
5. Fill out:
   - Name: `WildPraxis` or `WLA-App`
   - Database Password: (generate strong one, save it!)
   - Region: `East US` (closest to PA)
   - Plan: `Free` (perfect for starting)
6. Click "Create new project"
7. Wait 2 minutes for it to set up

**What you get:**
- Free PostgreSQL database (500MB)
- API endpoints automatically created
- Dashboard to view data
- Authentication built-in

---

### Step 2: Get Your API Keys (5 min)

1. In Supabase dashboard, click "Settings" (gear icon)
2. Click "API" in left sidebar
3. You'll see these - COPY THEM:
   - **Project URL** (looks like: `https://abcdefg.supabase.co`)
   - **anon public** key (long code starting with `eyJ...`)
   - **service_role** key (another long code starting with `eyJ...`)

**Keep these safe!** You'll paste them next.

---

### Step 3: Add Keys to Your App (5 min)

1. In your WLA_App folder, create a new file: `.env.local`
2. Copy this template and paste your actual keys:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-service-key

# NextAuth (keep existing or generate new)
NEXTAUTH_SECRET=your-existing-or-new-secret-here
NEXTAUTH_URL=http://localhost:3000

# Keep all your other existing keys too!
```

3. Save the file

**Important:** This file is already in `.gitignore` so it won't be uploaded to GitHub (good for security!)

---

### Step 4: Create Database Tables (15 min)

1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New query"
3. Open the file `lib/db/schema.sql` in Cursor
4. Copy the ENTIRE contents (it's long!)
5. Paste into Supabase SQL Editor
6. Click "Run" button (bottom right)
7. Should see green "Success" messages

**Then do migration:**
1. Click "New query" again
2. Open `lib/db/migrations/001_add_organizations.sql`
3. Copy entire contents
4. Paste into Supabase
5. Click "Run"
6. Success! ✅

**What this did:**
- Created `users` table
- Created `classes` table  
- Created `organizations` table
- Set up Wildlife Leadership Academy as first organization
- Enabled security (Row Level Security)

---

### Step 5: Update ONE API Route (2-3 hours)

**Start with the simplest one:**

Open: `app/api/classes/route.ts`

**Replace it with code from:** `app/api/classes/route.EXAMPLE.ts`

This connects your app to real database instead of fake data.

**Test it:**
1. Run: `.\node-portable\npm.cmd run dev`
2. Sign in to your app
3. Try creating a class
4. Check Supabase dashboard → "Table Editor" → "classes"
5. Your data should be there! 🎉

---

### Step 6: Test Everything (1 hour)

**Basic smoke test:**
- [ ] App starts without errors
- [ ] Can sign in with Google
- [ ] Can create a class (if teacher)
- [ ] Data appears in Supabase dashboard
- [ ] No console errors

**If it works:** You're done with Phase A! 🎉

**If errors:** Check these files for troubleshooting:
- `SUPABASE_SETUP_GUIDE.md`
- `TODO-PHASE1.md`

---

## 🌐 PHASE B: Deploy to Web (Week 2)

### Option 1: Vercel (Recommended - Easiest)

**Step 1: Push to GitHub (30 min)**
```powershell
# First time setup
git init
git add .
git commit -m "Initial WildPraxis setup"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/yourusername/WLA_App.git
git push -u origin main
```

**Step 2: Deploy to Vercel (15 min)**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your WLA_App repository
5. Add environment variables (same as .env.local)
6. Click "Deploy"
7. Wait 2-3 minutes
8. Get live URL: `https://wla-app.vercel.app` (or similar)

**Cost:** FREE (Hobby plan is perfect)

**What you get:**
- Live URL anyone can access
- Automatic deployments when you push to GitHub
- SSL/HTTPS included
- CDN (fast worldwide)
- 100GB bandwidth/month free

---

### Option 2: Deploy Anywhere Else

Your app can run on:
- **Netlify** (similar to Vercel, also free)
- **Railway** (good for databases)
- **Render** (good pricing)
- **Your own server** (if you have one)

All require similar setup: Connect GitHub, set environment variables, deploy.

---

## 📱 PHASE C: Mobile Apps (Weeks 3-16)

This is the big one - turning your web app into native mobile apps.

### Week 3-4: Offline Features
**What:** Make app work without internet
**Why:** Field trips often have no signal
**How:** Follow Phase 2 in `capacitor-mobile-deployment.plan.md`

**Tasks:**
- Enhance IndexedDB storage
- Build sync engine
- Cache educational content
- Add offline indicators

---

### Week 5-7: Capacitor Setup
**What:** Add mobile app framework
**Why:** Creates real iOS/Android apps
**How:** Follow Phase 3 in plan

**Tasks:**
```powershell
# Install Capacitor
.\node-portable\npm.cmd install @capacitor/core @capacitor/cli

# Initialize
.\node-portable\npx.cmd cap init WildPraxis org.wildlifeleadership.app

# Add platforms
.\node-portable\npx.cmd cap add ios
.\node-portable\npx.cmd cap add android
```

**Requirements:**
- **Mac computer** for iOS (can borrow or rent)
- **Android Studio** (free, works on Windows)

---

### Week 8-10: Native Features
**What:** Camera, GPS, offline storage
**Why:** Better than web versions
**How:** Install Capacitor plugins

```powershell
.\node-portable\npm.cmd install @capacitor/camera @capacitor/geolocation @capacitor/filesystem
```

Update components to use native features instead of web APIs.

---

### Week 11-12: Business Features
**What:** Multi-tenant, licensing, payments
**Why:** So schools can sign up and pay
**How:** Follow Phase 4 in plan

**Tasks:**
- Organization management
- Stripe payment integration
- Admin dashboard
- License validation

---

### Week 13-16: App Store Submission
**What:** Get in Apple App Store and Google Play
**Why:** So anyone can download
**How:** Follow Phase 5 in plan

**Costs:**
- Apple Developer: $99/year
- Google Play: $25 one-time
- App icon design: $500-1000 (or DIY)

**Timeline:**
- Create app store assets: 1 week
- iOS submission: 2-3 days review
- Android submission: Same-day approval usually

---

## 💰 Cost Summary

### To Launch Web App (Phase A + B):
| Item | Cost |
|------|------|
| Supabase (database) | FREE |
| Vercel (hosting) | FREE |
| Your time | ~15 hours |
| **Total** | **$0** |

### To Launch Mobile Apps (Phase C):
| Item | Cost |
|------|------|
| Apple Developer | $99/year |
| Google Play | $25 one-time |
| App icons/design | $500-1000 |
| Mac rental (if needed) | $100/month |
| Test devices | $400-800 (optional) |
| **Total Year 1** | **$1,124 - $2,424** |

---

## 🎯 Quick Win Path (Get Something Live Fast!)

**Week 1:** Database setup (Phase A)
- Monday: Create Supabase account, run schema
- Tuesday-Wed: Update 1-2 API routes
- Thursday: Test everything
- Friday: Fix bugs

**Week 2:** Deploy web app (Phase B)
- Monday: Push to GitHub
- Tuesday: Deploy to Vercel
- Wednesday: Test live site
- Thursday: Share with WLA for feedback
- Friday: Document and celebrate! 🎉

**Result:** Live web app anyone can access!

**Then decide:**
- Keep improving web app? (easier)
- Start mobile apps? (bigger effort)
- Focus on content and users? (smartest!)

---

## 🚦 Decision Points

### Should You Do Mobile Apps?

**Do mobile IF:**
- ✅ Web app is working great
- ✅ Users are actively using it
- ✅ Have 3-4 months to invest
- ✅ Have budget ($1,500-2,500)
- ✅ Need offline features badly
- ✅ Want app store presence

**Skip mobile IF:**
- ❌ Web app not proven yet
- ❌ Low user adoption so far
- ❌ Limited time/budget
- ❌ PWA features are good enough
- ❌ Focus should be on content/users

**Reality check:** Most successful apps start as web-only, prove the concept, THEN go mobile.

---

## 📊 Realistic Timelines

### Fast Track (Web Only):
- Week 1-2: Database + deployment
- Week 3-4: Testing and improvements
- **Launch:** 1 month
- **Cost:** $0

### Full Track (Web + Mobile):
- Week 1-2: Database + web deployment
- Week 3-6: Offline features
- Week 7-10: Capacitor + native features
- Week 11-12: Business features
- Week 13-16: App store submission
- **Launch:** 4 months
- **Cost:** $1,500-2,500

### Recommended (Staged):
- **Phase 1 (Now):** Database + web (2 weeks)
- **Phase 2 (Month 2):** Get users, gather feedback
- **Phase 3 (Month 3-4):** Improve based on feedback
- **Phase 4 (Month 5-8):** Mobile apps IF proven successful
- **Result:** Validated product before big investment

---

## ✅ Your Next 3 Actions

### 1. This Week: Database
- [ ] Create Supabase account (30 min)
- [ ] Run database schema (15 min)
- [ ] Add API keys to .env.local (5 min)
- [ ] Update one API route (2 hours)
- [ ] Test it works (30 min)

### 2. Next Week: Deploy
- [ ] Push to GitHub (30 min)
- [ ] Deploy to Vercel (15 min)
- [ ] Test live site (1 hour)
- [ ] Share with WLA (5 min)

### 3. Week After: Decide
- [ ] Gather feedback from users
- [ ] Measure actual usage
- [ ] Decide: improve web or go mobile?
- [ ] Plan next phase

---

## 🎯 Success Metrics

**You'll know you're ready for mobile when:**
- ✅ 50+ active users on web app
- ✅ 80%+ user satisfaction
- ✅ Users asking for offline features
- ✅ Schools willing to pay
- ✅ Technical foundation solid

**Until then:** Focus on web app, content, and users!

---

## 📞 Get Help

**For Database Setup:**
- Guide: `SUPABASE_SETUP_GUIDE.md`
- Video: Search YouTube "Supabase Next.js setup"

**For Deployment:**
- Vercel Docs: https://vercel.com/docs
- Guide: `DEPLOYMENT_GUIDE.md` (in your files)

**For Mobile:**
- Plan: `capacitor-mobile-deployment.plan.md`
- Capacitor Docs: https://capacitorjs.com

**Stuck?**
- Check error messages carefully
- Google the specific error
- Ask in Supabase Discord: discord.supabase.com
- Ask in Capacitor Discord: discord.gg/UPYqBWFaVx

---

## 🎊 Final Advice

### Start Small, Launch Fast
- Get database working ✅
- Deploy web app ✅
- Get real users ✅
- Gather feedback ✅
- Then decide next steps ✅

### Don't Over-Engineer
- Mobile apps are cool but not required
- Your PWA already works on mobile
- Focus on users and content first
- Technical perfection can wait

### Celebrate Wins
- ✅ Dependencies installed (TODAY!)
- 🎯 Database working (THIS WEEK)
- 🚀 Web app live (NEXT WEEK)
- 📱 Mobile apps (IF/WHEN NEEDED)

---

**You're 80% ready to launch a web app!**

Just need to:
1. Set up database (6 hours)
2. Deploy to Vercel (1 hour)
3. **You're live!** 🎉

Mobile apps can come later IF the web app proves successful.

**Start with Step 1: Create Supabase Account**

You've got this! 🚀

---

*Created: November 7, 2025*  
*Status: Ready to Launch*  
*Next Action: Supabase Setup*

