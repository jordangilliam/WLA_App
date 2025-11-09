# WLA App Deployment Guide

## Overview

This guide covers deployment of the WLA (Wildlife Leadership Academy) Conservation Ambassadors platform to production environments.

## Deployment Platforms

### Primary: Vercel (Recommended)

**Why Vercel?**
- Native Next.js support (created by Vercel team)
- Automatic deployments from GitHub
- Excellent error reporting and debugging
- Free tier: Unlimited deployments, 100GB bandwidth/month
- Zero configuration needed

**Cost Analysis:**
- **Free (Hobby)**: $0/month - Perfect for development/testing
  - Unlimited deployments
  - 100GB bandwidth
  - 6,000 build minutes
- **Pro**: $20/month - For production launch
  - Unlimited team members
  - 1TB bandwidth
  - Advanced analytics
  - Password protection for previews
  - Commercial use allowed

### Backup: Netlify

**Purpose:** Alternative deployment platform for testing
- Free tier: 100GB bandwidth, 300 build minutes
- Configuration via `netlify.toml` (already configured)
- Good for staging/testing before Vercel deployment

## Prerequisites

### 1. Supabase Account Setup

You need a Supabase project with:
- PostgreSQL database
- Authentication enabled
- Row Level Security (RLS) policies

**Cost:** Free tier provides:
- 500MB database
- 50,000 monthly active users
- 2GB file storage
- Unlimited API requests

**Pro tier ($25/month):**
- 8GB database
- 100,000 MAU
- 100GB storage

### 2. Stripe Account (Optional - for payments)

Only needed if enabling school licensing features.
- Stripe account with publishable and secret keys
- Webhook endpoint configured
- Product Price IDs for subscription tiers

### 3. Environment Variables

Required for all deployments:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-random-32-char-string
NODE_ENV=production
NEXT_PUBLIC_APP_VERSION=2.0.0
```

Optional (for payments):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SCHOOL_BASIC=price_...
STRIPE_PRICE_SCHOOL_PRO=price_...
STRIPE_PRICE_SCHOOL_UNLIMITED=price_...
STRIPE_PRICE_DISTRICT=price_...
```

## Deploying to Vercel

### Method 1: Vercel Website (Easiest)

1. **Create/Login to Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended)

2. **Import GitHub Repository**
   - Click "Add New Project"
   - Select `WLA_App` from your GitHub repositories
   - Vercel auto-detects Next.js configuration

3. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add all required variables from the list above
   - **Important**: Add as plaintext values, NOT secret references
   - Apply to all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Vercel CLI (Advanced)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# ...repeat for all variables
```

## Deploying to Netlify

### Using Netlify Website

1. **Create/Login to Netlify Account**
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up with GitHub

2. **Import Repository**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select `WLA_App` repository

3. **Build Settings**
   - Build command: `npm run build` (auto-detected from `netlify.toml`)
   - Publish directory: `.next`
   - Functions directory: (leave empty)

4. **Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add all required variables
   - Save and trigger redeploy

5. **Deploy**
   - Netlify automatically builds and deploys
   - Your app will be live at `https://your-site.netlify.app`

## Custom Domain Setup

### Vercel Custom Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `wildpraxis.org`)
3. Add DNS records to your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. SSL certificate auto-configured by Vercel

### Netlify Custom Domain

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
4. SSL certificate auto-configured by Netlify

## Database Setup

### Initial Schema Migration

1. Log into [Supabase Dashboard](https://app.supabase.com)
2. Go to SQL Editor
3. Run the base schema from `lib/db/STEP1-base-tables.sql`:
   - Creates `users`, `organizations`, `organization_users` tables
4. Run additional migrations as needed:
   - `lib/db/migrations/001_add_organizations.sql`
   - `lib/db/migrations/002_add_subscriptions.sql`
   - `FieldQuest/lib/db/migrations/010_fieldquest.sql` (if using FieldQuest features)

### Row Level Security (RLS)

Supabase uses Row Level Security to protect data:
- Each user can only access their own data
- Teachers can access their class data
- Admins can access organization data
- Policies are defined in migration files

## Environment Configuration by Platform

### Vercel Environment Variables

Add via Vercel Dashboard → Settings → Environment Variables:
1. Set "Environment" to Production, Preview, and Development
2. Do NOT use secret references - add values as plaintext
3. Vercel automatically encrypts all environment variables

### Netlify Environment Variables

Add via Netlify Dashboard → Site Settings → Build & Deploy → Environment:
1. Add each variable with key and value
2. No need to quote values
3. Variables are automatically encrypted

## Troubleshooting

### Build Failures

**Error: Module not found**
- Check that all imports use correct paths
- Verify `tsconfig.json` has correct path aliases
- Ensure `FieldQuest` is excluded from Next.js builds

**Error: TypeScript errors**
- Run `npm run build` locally to reproduce
- Check `read_lints` output for specific errors
- Common issue: strict type inference with Supabase queries

**Error: Environment variable not defined**
- Verify variable name matches exactly (case-sensitive)
- Check variable is added to correct environment (Production/Preview/Development)
- For `NEXT_PUBLIC_*` variables, rebuild is required after changes

### Runtime Errors

**Error: supabaseAdmin is null**
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify key is correct in Supabase Dashboard → Settings → API
- Check `lib/db/client.ts` has proper initialization

**Error: NEXTAUTH_SECRET not configured**
- Generate a random 32-character string
- Can use: `openssl rand -base64 32` or online generator
- Must be set in environment variables

**Error: Stripe webhook signature verification failed**
- Check `STRIPE_WEBHOOK_SECRET` matches webhook endpoint
- Get from Stripe Dashboard → Developers → Webhooks
- Format: `whsec_...`

### Performance Issues

**Slow page loads**
- Enable Vercel Analytics to identify bottlenecks
- Check Supabase query performance in Dashboard → Database → Query Performance
- Consider adding database indexes for frequent queries

**High bandwidth usage**
- Enable Vercel Image Optimization for images
- Compress large assets
- Implement lazy loading for heavy components

## Monitoring & Maintenance

### Health Checks

Monitor these endpoints:
- `/` - Home page should load
- `/api/classes` - API route should return 200 or 401
- `/auth` - Auth page should load

### Error Tracking

Sentry is configured for error tracking:
- Dashboard: [sentry.io](https://sentry.io)
- Errors automatically captured and reported
- Configured in `lib/monitoring/sentry.ts`

### Database Backups

Supabase provides:
- Automatic daily backups (Free tier: 7 days retention)
- Manual backups via Dashboard → Database → Backups
- Point-in-time recovery (Pro tier only)

### Deployment Rollback

**Vercel:**
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"

**Netlify:**
1. Go to Deploys tab
2. Find previous deploy
3. Click "Publish deploy"

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema migrated
- [ ] RLS policies enabled
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (auto-configured)
- [ ] Test user authentication (Google, Azure AD, Email)
- [ ] Test API routes (`/api/classes`, `/api/user/profile`)
- [ ] Test teacher dashboard access
- [ ] Test student dashboard access
- [ ] Verify offline functionality (service worker active)
- [ ] Check error tracking (Sentry receiving errors)
- [ ] Set up uptime monitoring (optional: UptimeRobot, Pingdom)

## Continuous Deployment

Both Vercel and Netlify support automatic deployments:

**On every push to `main` branch:**
1. Code pushed to GitHub
2. Platform detects changes
3. Automatic build triggered
4. If build succeeds, deployed to production
5. If build fails, previous version remains live

**On pull requests:**
1. Preview deployment created
2. Unique URL generated for testing
3. Each commit updates preview
4. Merge to `main` deploys to production

## Total Monthly Cost (Production)

**Minimum (Free Tier):**
- Vercel: $0
- Supabase: $0
- **Total: $0/month**

**Recommended (Production):**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- **Total: $45/month**

**With Payments (Business):**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Stripe: 2.9% + $0.30 per transaction (no monthly fee)
- **Total: $45/month + transaction fees**

## Support

### Platform Support
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Netlify**: [netlify.com/support](https://netlify.com/support)
- **Supabase**: [supabase.com/docs/support](https://supabase.com/docs/support)

### WLA App Support
- GitHub Issues: [github.com/jordangilliam/WLA_App/issues](https://github.com/jordangilliam/WLA_App/issues)
- Email: Contact Wildlife Leadership Academy

## Next Steps

After successful deployment:
1. Review [DEVELOPMENT.md](./DEVELOPMENT.md) for local development setup
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture
3. Test mobile app deployment (Capacitor → iOS/Android)
4. Configure analytics and monitoring
5. Set up content management for teachers

