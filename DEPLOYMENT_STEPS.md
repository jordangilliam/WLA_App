# Deployment Steps Guide

This guide provides step-by-step instructions for deploying WildPraxis to production.

---

## Prerequisites Checklist

Before starting deployment, ensure you have:

- [ ] GitHub repository access
- [ ] Vercel account (or Netlify account)
- [ ] Supabase project created and accessible
- [ ] All environment variable values ready
- [ ] Domain name configured (optional)
- [ ] Stripe account set up (if using payments)
- [ ] Mapbox account with access token

---

## Step 1: Pre-Deployment Health Check

Run the pre-deployment check script to verify everything is ready:

```bash
npm run pre-deploy-check
```

This script will verify:
- ✅ All required environment variables are set
- ✅ Database migration files exist
- ✅ TypeScript compilation succeeds
- ✅ No critical linting errors
- ✅ Build completes successfully

**If any checks fail, fix the issues before proceeding.**

---

## Step 2: Environment Variable Setup

### 2.1 Generate Required Secrets

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Save this value - you'll need it for deployment.

### 2.2 Collect All Environment Variables

Prepare these values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth
NEXTAUTH_SECRET=<generated_secret_from_step_2.1>
NEXTAUTH_URL=https://your-domain.com

# Stripe (if using payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SCHOOL_BASIC=price_...
STRIPE_PRICE_SCHOOL_PRO=price_...
STRIPE_PRICE_SCHOOL_UNLIMITED=price_...
STRIPE_PRICE_DISTRICT=price_...

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN=pk.eyJ1... (same as above)

# App
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

**Note:** For initial deployment, use plaintext values. You can migrate to Vercel secrets later.

---

## Step 3: Database Migrations

### 3.1 Access Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

### 3.2 Apply Migrations in Order

Run these migrations **IN ORDER** (copy-paste each file content):

1. **027_seasonal_waterway_data.sql**
   - Location: `supabase/migrations/027_seasonal_waterway_data.sql`
   - Copy entire file content
   - Paste into SQL Editor
   - Click **Run**
   - Verify no errors

2. **028_fly_fishing_experts.sql**
   - Location: `supabase/migrations/028_fly_fishing_experts.sql`
   - Repeat process above

3. **029_pfbc_mapping_layers.sql**
   - Location: `supabase/migrations/029_pfbc_mapping_layers.sql`
   - Repeat process above

4. **030_pfbc_complete_integration.sql**
   - Location: `supabase/migrations/030_pfbc_complete_integration.sql`
   - Repeat process above

### 3.3 Verify Migrations

After all migrations are applied, run these verification queries:

```sql
-- Verify migrations 027-030
SELECT COUNT(*) FROM macroinvertebrate_hatches; -- Should be 9+
SELECT COUNT(*) FROM fly_fishing_experts; -- Should be 2+
SELECT COUNT(*) FROM fly_fishing_shops; -- Should be 60+
SELECT COUNT(*) FROM pfbc_trout_streams; -- Should be 110+
SELECT COUNT(*) FROM pfbc_stocking_schedules; -- Should be 13+
SELECT COUNT(*) FROM pfbc_access_points; -- Should be 15+
```

**Expected Results:**
- `macroinvertebrate_hatches`: 9+ species
- `fly_fishing_experts`: 2+ experts
- `fly_fishing_shops`: 60+ shops
- `pfbc_trout_streams`: 110+ stream designations
- `pfbc_stocking_schedules`: 13+ schedules
- `pfbc_access_points`: 15+ access points

If counts don't match, check migration logs for errors.

---

## Step 4: Vercel Deployment

### 4.1 Connect GitHub Repository

1. Go to https://vercel.com
2. Click **New Project**
3. Import `WLA_App` repository from GitHub
4. Framework Preset: **Next.js** (should auto-detect)

### 4.2 Configure Build Settings

Verify these settings:
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install`
- **Framework:** Next.js

### 4.3 Add Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable from Step 2.2
3. **IMPORTANT:** For initial deployment, set values as **plaintext** (not secrets)
   - Toggle "Sensitive" to **OFF**
   - Enter values directly

**Note:** The `vercel.json` file uses `@` references for secrets. For initial deployment, ignore these and set plaintext values in the dashboard. You can migrate to secrets later.

### 4.4 Deploy

1. Click **Deploy**
2. Wait for build to complete (~5-10 minutes)
3. Monitor build logs for errors
4. Once complete, verify deployment at `your-project.vercel.app`

---

## Step 5: Post-Deployment Verification

### 5.1 Basic Functionality Tests

Test these core features:

- [ ] Homepage loads correctly
- [ ] Sign up / Login works
- [ ] Explore map shows field sites
- [ ] Check-in flow works
- [ ] Observations can be created
- [ ] Challenges display properly
- [ ] Leaderboard shows rankings
- [ ] Collections page loads
- [ ] Species cards flip animation works
- [ ] Profile menu functions

### 5.2 Mobile Testing

- [ ] Responsive layout works
- [ ] Bottom navigation functions
- [ ] Touch targets are large enough
- [ ] Map gestures work (pinch zoom, pan)
- [ ] Photo capture works
- [ ] Offline queue activates when offline
- [ ] Sync happens when back online

### 5.3 iPad Testing (Critical for Library Deployment)

- [ ] Landscape mode layout correct
- [ ] Touch targets 60px minimum
- [ ] Multi-user switch works
- [ ] PIN login functions
- [ ] Split-screen mode works
- [ ] All grids display properly (3-4 columns)

### 5.4 Teacher Dashboard Testing

- [ ] Live monitoring feed updates
- [ ] Student lists load
- [ ] Class creation works
- [ ] Field trip mode accessible
- [ ] Reports generate correctly

### 5.5 Feature Verification

Test each of the 14 features:

1. **Celebration Modals** - Complete a check-in, verify confetti
2. **Sound Effects** - Check settings, test sounds
3. **Collections** - View sites and species galleries
4. **Daily Challenges** - See active challenges
5. **Progress Maps** - View heatmap visualization
6. **Class Leaderboards** - Check rankings
7. **Team Challenges** - View collective progress
8. **Photo Challenges** - Submit a photo
9. **Species Cards** - Flip a card, see details
10. **iPad Responsive** - Test on iPad in landscape
11. **Multi-User** - Switch between users
12. **Offline Queue** - Disconnect, create content, reconnect
13. **Teacher Live** - Monitor as teacher
14. **Field Trip Mode** - Create/view trip

---

## Step 6: Domain Configuration (Optional)

### 6.1 Add Custom Domain

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to match

### 6.2 SSL Certificate

Vercel automatically provisions SSL certificates. Wait for DNS propagation (up to 48 hours).

---

## Rollback Procedures

If issues arise after deployment:

### Option 1: Vercel Dashboard Rollback

1. Go to Vercel Dashboard → **Deployments**
2. Find the previous working deployment
3. Click **⋯** → **Promote to Production**
4. Verify rollback successful

### Option 2: Database Rollback

1. Go to Supabase Dashboard → **Database** → **Backups**
2. Select a backup from before problematic migrations
3. Restore backup
4. Re-apply migrations if needed

### Option 3: Emergency Contact

If critical issues occur:
- Check deployment logs in Vercel dashboard
- Review Supabase logs for database errors
- Check browser console for client-side errors
- Contact: [Your support email/phone]

---

## Troubleshooting

### Build Fails

**Error: Environment variables missing**
- Verify all variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Ensure no trailing spaces

**Error: TypeScript errors**
- Run `npm run pre-deploy-check` locally first
- Fix TypeScript errors before deploying
- Check `tsconfig.json` configuration

**Error: Build timeout**
- Check for infinite loops in code
- Review API route handlers for blocking operations
- Consider increasing build timeout in Vercel settings

### Database Connection Issues

**Error: Cannot connect to Supabase**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is active (not paused)
- Check network restrictions in Supabase dashboard

**Error: RLS policy violations**
- Review Row Level Security policies
- Check service role key is set correctly
- Verify user permissions

### Runtime Errors

**Error: Authentication not working**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches deployment URL
- Review NextAuth configuration

**Error: Map not loading**
- Verify Mapbox token is valid
- Check token has correct scopes
- Ensure `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is set

---

## Post-Deployment Optimization

### Performance

- [ ] Enable Vercel Analytics
- [ ] Set up Sentry for error tracking
- [ ] Configure CDN for images
- [ ] Optimize Mapbox tile loading

### SEO

- [ ] Add meta descriptions
- [ ] Generate sitemap.xml
- [ ] Add robots.txt
- [ ] Implement Open Graph tags

### Monitoring

- [ ] Set up Supabase monitoring
- [ ] Enable database backups
- [ ] Configure API rate limits
- [ ] Set up uptime monitoring

---

## Library Deployment Prep

For iPad deployments in libraries:

1. **Create Library Account**
   - Set up a demo account
   - Pre-populate with sample data
   - Create instructional material

2. **Configure iPad Settings**
   - Install in Safari (PWA)
   - Add to Home Screen icon
   - Enable location services
   - Test multi-user switching

3. **Train Library Staff**
   - How to switch users
   - How to help students log in
   - Troubleshooting common issues
   - When to contact support

4. **Student Onboarding**
   - Create QR code for easy access
   - Print quick-start guide
   - Set up demo video
   - Prepare parental consent forms

---

## Launch Checklist

Final checks before going live:

- [ ] All migrations run successfully
- [ ] Environment variables set correctly
- [ ] Build completes without errors
- [ ] Authentication works
- [ ] Database connections verified
- [ ] API routes respond correctly
- [ ] PWA installs on mobile
- [ ] Offline mode works
- [ ] Multi-user tested on iPad
- [ ] Teacher dashboard accessible
- [ ] Student accounts can be created
- [ ] Points system working
- [ ] Achievements unlock properly
- [ ] Backup plan in place
- [ ] Support email configured
- [ ] Terms of Service added
- [ ] Privacy Policy published

---

## Success! 🎉

Once all checklists are complete, WildPraxis is ready for:
- 🏫 School deployments
- 📚 Library iPad programs  
- 🌲 Field trip coordination
- 👥 Class-based learning
- 🦋 Conservation education

**Built for Gen Alpha. Optimized for engagement. Ready for impact.**
