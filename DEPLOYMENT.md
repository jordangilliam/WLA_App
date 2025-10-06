# 🚀 WLA App Deployment Guide

Complete guide to deploying the Wildlife Leadership Academy Conservation Ambassadors app to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [GitHub Setup](#github-setup)
4. [Deployment Options](#deployment-options)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- ✅ GitHub account
- ✅ Google Cloud Platform account (for OAuth & Drive)
- ✅ Microsoft Azure account (for OneDrive/Microsoft auth)
- ✅ Mapbox account (for map features)
- ✅ Deployment platform account (choose one):
  - Vercel (recommended - easiest)
  - Netlify
  - AWS
  - Other platforms

### Local Setup

```bash
# Install Node.js 18+
node --version  # Should be v18.x or higher

# Clone repository
git clone https://github.com/YOUR_USERNAME/WLA_App.git
cd WLA_App

# Install dependencies
npm install

# Copy environment template
cp .env.template .env.local
```

---

## Environment Setup

### 1. NextAuth Configuration

```bash
# Generate secret key
openssl rand -base64 32
```

Add to `.env.local`:
```env
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000
```

### 2. Google OAuth & Drive API

**Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "WLA Conservation App"
3. Enable APIs:
   - Google Drive API
   - Google Sheets API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Name: "WLA App Production"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-production-domain.vercel.app/api/auth/callback/google`

5. Copy credentials to `.env.local`:
```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

**Optional - Google Sheets Integration:**
```env
GOOGLE_SHEETS_ID=your-spreadsheet-id
GOOGLE_SHEETS_RANGE=Sheet1!A1
```

### 3. Microsoft Azure AD / OneDrive

**Steps:**

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Create new registration:
   - Name: "WLA App"
   - Supported account types: Multitenant
   - Redirect URI: `https://your-domain.com/api/auth/callback/azure-ad`

4. Add API permissions:
   - Microsoft Graph → Delegated permissions:
     - Files.ReadWrite
     - offline_access
     - email
     - openid
     - profile

5. Create client secret:
   - Certificates & secrets → New client secret
   - Copy the value immediately (it won't show again!)

6. Add to `.env.local`:
```env
AZURE_AD_CLIENT_ID=your-application-id
AZURE_AD_CLIENT_SECRET=your-secret-value
AZURE_AD_TENANT_ID=common
```

### 4. Mapbox

1. Create account at [Mapbox](https://account.mapbox.com/)
2. Copy your default public token
3. Add to `.env.local`:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
```

### 5. Admin Access

```env
ADMIN_EMAILS=katie@wildlifeleadershipacademy.org,admin@example.com
ADMIN_DOMAINS=wildlifeleadershipacademy.org
```

### 6. Cron Secret (for scheduled tasks)

```bash
# Generate cron secret
openssl rand -hex 32
```

```env
CRON_SECRET=your-cron-secret
```

---

## GitHub Setup

### 1. Create Repository

```bash
# Create repo on GitHub
# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/WLA_App.git
git branch -M main
git add .
git commit -m "Initial commit: WLA Conservation Ambassadors App"
git push -u origin main
```

### 2. Configure GitHub Secrets

Go to: `Settings → Secrets and variables → Actions → New repository secret`

**Required secrets for Vercel deployment:**

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel deployment token | [Vercel Account Settings → Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Organization ID | Run `vercel` CLI locally, check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Project ID | Same as above |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox token | From Mapbox dashboard |

**Optional secrets (for other platforms):**

- `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID`
- `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` + `AWS_S3_BUCKET`

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Built specifically for Next.js
- Automatic deployments from GitHub
- Built-in SSL
- Edge network CDN
- Generous free tier

**Deploy via CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Deploy via Dashboard:**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. Add environment variables (copy from `.env.local`)
5. Click "Deploy"

**Environment Variables in Vercel:**

Go to: `Project Settings → Environment Variables`

Add all variables from `.env.template` with your production values.

**Important:** Update `NEXTAUTH_URL` to your Vercel domain:
```
NEXTAUTH_URL=https://your-app.vercel.app
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**netlify.toml configuration:**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: AWS (Advanced)

Requires:
- S3 bucket for static assets
- CloudFront distribution
- Lambda@Edge for SSR
- API Gateway (optional)

See [Next.js AWS deployment guide](https://nextjs.org/docs/deployment#self-hosting)

### Option 4: Docker (Self-Hosted)

```dockerfile
# Dockerfile included in repo
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Deploy with:
```bash
docker build -t wla-app .
docker run -p 3000:3000 --env-file .env.local wla-app
```

---

## Post-Deployment

### 1. Update OAuth Redirect URIs

**Google:**
- Add production URL to Google Cloud Console
- Example: `https://wla-app.vercel.app/api/auth/callback/google`

**Microsoft:**
- Add production URL to Azure AD app registration
- Example: `https://wla-app.vercel.app/api/auth/callback/azure-ad`

### 2. Configure Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `app.wildlifeleadershipacademy.org`)
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable

### 3. Set Up Monitoring

**Vercel Analytics:**
```env
VERCEL_ANALYTICS_ID=your-analytics-id
```

**Google Analytics:**
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Configure Cron Jobs

**Vercel Cron:**

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-digest",
      "schedule": "0 12 * * *"
    },
    {
      "path": "/api/cron/anomaly-scan",
      "schedule": "0 6 * * 1"
    }
  ]
}
```

**External Cron Service:**

Use services like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- GitHub Actions (already configured!)

Example POST request:
```bash
curl -X POST https://your-app.vercel.app/api/cron/daily-digest \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

### 5. Test Production Deployment

**Checklist:**

- [ ] Home page loads correctly
- [ ] Authentication works (Google & Microsoft)
- [ ] Map displays (Mapbox loaded)
- [ ] Points system works
- [ ] Leaderboard persists data
- [ ] Export to Google Drive/OneDrive works
- [ ] Admin pages require authentication
- [ ] Mobile responsive design works
- [ ] SSL certificate is active
- [ ] Environment variables are set

---

## Troubleshooting

### Issue: "Invalid redirect URI"

**Solution:** Add your production URL to OAuth provider settings

### Issue: Map doesn't load

**Solution:** Check that `NEXT_PUBLIC_MAPBOX_TOKEN` is set and starts with `pk.`

### Issue: Authentication fails

**Solutions:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure cookies are enabled
- Check OAuth credentials are correct

### Issue: Build fails

**Solutions:**
- Run `npm run build` locally to reproduce
- Check all TypeScript errors: `npx tsc --noEmit`
- Verify all dependencies are installed: `npm ci`
- Check Node.js version: should be 18+

### Issue: Environment variables not working

**Solutions:**
- Variables starting with `NEXT_PUBLIC_` are exposed to browser
- Other variables are server-side only
- Rebuild after changing environment variables
- Check for typos in variable names

### Issue: Performance problems

**Solutions:**
- Enable Vercel Analytics
- Run Lighthouse audit
- Optimize images with Next.js Image component
- Enable compression and caching

---

## Security Best Practices

1. **Secrets Management:**
   - Never commit `.env.local` to git
   - Use different secrets for dev/staging/prod
   - Rotate secrets regularly

2. **OAuth Configuration:**
   - Restrict redirect URIs to your domains only
   - Use HTTPS in production
   - Enable MFA on service accounts

3. **Access Control:**
   - Regularly review admin email list
   - Use domain restrictions when possible
   - Monitor admin access logs

4. **Updates:**
   - Keep dependencies updated: `npm audit`
   - Monitor security advisories
   - Test updates in staging first

---

## Monitoring & Maintenance

### Performance Monitoring

- Vercel Analytics: Real-time performance metrics
- Lighthouse CI: Automated performance audits (configured in GitHub Actions)
- Web Vitals: Core Web Vitals tracking

### Error Tracking

Consider integrating:
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- Vercel Logs - Built-in logging

### Backups

- Student data is stored in localStorage (client-side)
- Exports to Google Drive/OneDrive serve as backups
- Consider periodic automated exports

---

## Support

For deployment help:
- Check [Next.js deployment docs](https://nextjs.org/docs/deployment)
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)
- File issues on GitHub: Your repo issues page

---

## Quick Reference

**Local Development:**
```bash
npm install
npm run dev  # http://localhost:3000
```

**Production Build:**
```bash
npm run build
npm start
```

**Deployment:**
```bash
# Vercel
vercel --prod

# Or let GitHub Actions handle it automatically!
git push origin main
```

---

🌲 Happy Deploying! For questions, contact Wildlife Leadership Academy.

