# WildPraxis Deployment Checklist

## ✅ **COMPLETED - All 14 Features Built**

All features from the 6-week development plan have been implemented and pushed to GitHub.

---

## 📋 **PRE-DEPLOYMENT STEPS**

### 1. Install Dependencies
```bash
npm install
```

This will install the new `idb` package (v8.0.0) for offline queue functionality.

---

### 2. Run Database Migrations in Supabase

**IMPORTANT:** Run these migrations **IN ORDER** in your Supabase SQL Editor:

#### Core Migrations (Already Run?)
- ✓ `001_add_organizations.sql` - Organizations and user management
- ✓ `002_initial_schema.sql` - Base tables (if you have this)
- ✓ `003_add_field_sites_and_achievements.sql` - Field sites system

#### Core Migrations (Already Run?)
- ✓ `001_add_organizations.sql` - Organizations and user management
- ✓ `002_initial_schema.sql` - Base tables (if you have this)
- ✓ `003_add_field_sites_and_achievements.sql` - Field sites system
- ✓ `004_seed_pittsburgh_field_sites.sql` - 64+ Pittsburgh area field sites
- ✓ `005_add_trout_waters_and_stocking.sql` - 16 trout fishing locations
- ✓ `006_statewide_expansion.sql` - 50+ locations across PA
- ✓ `012_challenges_system.sql` - Daily/weekly challenges
- ✓ `013_class_leaderboards.sql` - Class team stats
- ✓ `014_species_cards.sql` - Species cards with rarity system
- ✓ `015_photo_challenges.sql` - Photo challenge prompts

#### New Migrations (Run These Now)
- ✅ `027_seasonal_waterway_data.sql` - Seasonal data and macroinvertebrate hatches
- ✅ `028_fly_fishing_experts.sql` - Experts, shops, and TU chapters
- ✅ `029_pfbc_mapping_layers.sql` - PFBC trout streams, bass waters, other species
- ✅ `030_pfbc_complete_integration.sql` - Stocking, access points, regulations, habitat

**How to Run:**
1. Open Supabase Dashboard → SQL Editor
2. Copy each migration file content
3. Paste and execute in order
4. Verify no errors before proceeding to next

**Verification Queries:**
After running migrations 027-030, verify data was loaded correctly:
```sql
-- Verify migrations 027-030
SELECT COUNT(*) FROM macroinvertebrate_hatches; -- Should be 9+
SELECT COUNT(*) FROM fly_fishing_experts; -- Should be 2+
SELECT COUNT(*) FROM fly_fishing_shops; -- Should be 60+
SELECT COUNT(*) FROM pfbc_trout_streams; -- Should be 110+
SELECT COUNT(*) FROM pfbc_stocking_schedules; -- Should be 13+
SELECT COUNT(*) FROM pfbc_access_points; -- Should be 15+
```

---

### 3. Environment Variables

Ensure these are set in Vercel/Netlify (as **PLAINTEXT**, not secret references):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_generate_with_openssl
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

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 4. Build and Test Locally

```bash
# Build the app
npm run build

# Test the production build locally
npm start
```

**Check for:**
- ✓ No TypeScript errors
- ✓ No build warnings
- ✓ All pages load correctly
- ✓ Database connections work
- ✓ Authentication flow works

---

## 🚀 **DEPLOYMENT**

### Option A: Vercel (Recommended for Next.js)

1. **Connect GitHub Repository**
   - Go to vercel.com → New Project
   - Import `WLA_App` repository
   - Framework Preset: Next.js (auto-detected)

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from section 3 above
   - **IMPORTANT:** Ensure "Sensitive" toggle is OFF (plaintext values)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~5-10 minutes)
   - Verify deployment at `your-project.vercel.app`

### Option B: Netlify

1. **Create `netlify.toml`** (already exists in repo)

2. **Connect Repository**
   - Go to app.netlify.com → New site from Git
   - Choose GitHub → Select `WLA_App`

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Add Environment Variables**
   - Site Settings → Environment Variables
   - Add all from section 3

5. **Deploy**
   - Trigger deploy
   - Verify at `your-site.netlify.app`

---

## 📱 **POST-DEPLOYMENT TESTING**

### Desktop/Laptop Testing
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

### Mobile Testing (iPhone/Android)
- [ ] Responsive layout works
- [ ] Bottom navigation functions
- [ ] Touch targets are large enough
- [ ] Map gestures work (pinch zoom, pan)
- [ ] Photo capture works
- [ ] Offline queue activates when offline
- [ ] Sync happens when back online

### iPad Testing (Critical for Library Deployment)
- [ ] Landscape mode layout correct
- [ ] Touch targets 60px minimum
- [ ] Multi-user switch works
- [ ] PIN login functions
- [ ] Split-screen mode works
- [ ] All grids display properly (3-4 columns)

### Teacher Dashboard Testing
- [ ] Live monitoring feed updates
- [ ] Student lists load
- [ ] Class creation works
- [ ] Field trip mode accessible
- [ ] Reports generate correctly

---

## 🎯 **FEATURE VERIFICATION**

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

## 🔧 **OPTIMIZATION (Optional but Recommended)**

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

## 📚 **DOCUMENTATION UPDATES**

- [ ] Update README.md with deployment info
- [ ] Create user guide for students
- [ ] Create teacher guide
- [ ] Document API endpoints
- [ ] Add troubleshooting guide

---

## 🎓 **LIBRARY DEPLOYMENT PREP**

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

## ✅ **LAUNCH CHECKLIST**

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

## 🚨 **ROLLBACK PLAN**

If issues arise:

1. Vercel: Revert to previous deployment in dashboard
2. Netlify: Rollback in Deploys tab
3. Database: Restore from Supabase backup
4. Emergency contact: [Your email/phone]

---

## 🎉 **YOU'RE READY TO LAUNCH!**

Once all checklists are complete, WildPraxis is ready for:
- 🏫 School deployments
- 📚 Library iPad programs  
- 🌲 Field trip coordination
- 👥 Class-based learning
- 🦋 Conservation education

**Built for Gen Alpha. Optimized for engagement. Ready for impact.**

