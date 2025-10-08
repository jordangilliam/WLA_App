# 🚀 WLA App - Complete Setup Guide

## 📋 Quick Start Checklist

Follow these steps in order to deploy your WLA App successfully.

---

## STEP 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `WLA_App`
3. **Keep Private** (recommended)
4. **DO NOT** check any initialization options (README, .gitignore, license)
5. Click **Create repository**

---

## STEP 2: Configure GitHub Repository Settings

### A. Enable GitHub Actions Permissions
1. Go to your new repo → **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - ✅ Select **"Read and write permissions"**
   - ✅ Check **"Allow GitHub Actions to create and approve pull requests"**
3. Click **Save**

### B. Enable Security Features
1. Go to **Settings** → **Code security and analysis**
2. Enable all recommended features:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates

---

## STEP 3: Add GitHub Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 🔐 Generated Secrets (Copy from SECRETS.txt)
- `NEXTAUTH_SECRET` - Already generated ✅
- `CRON_SECRET` - Already generated ✅

### 🔐 OAuth & API Secrets (You need to create these)
Create these in the following order:

#### 1. Google OAuth (for Google Drive/Sheets)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_SHEETS_ID` (optional, get from your Google Sheet URL)

**How to create:**
1. Go to https://console.cloud.google.com/
2. Create new project "WLA App"
3. Enable APIs: **Google Drive API** and **Google Sheets API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI: `https://YOUR-VERCEL-URL/api/auth/callback/google`
   - You'll update this after Vercel deployment
   - For now use: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**

#### 2. Microsoft Azure AD (for OneDrive)
- `AZURE_AD_CLIENT_ID`
- `AZURE_AD_CLIENT_SECRET`
- `AZURE_AD_TENANT_ID` (use "common" if unsure)

**How to create:**
1. Go to https://portal.azure.com/
2. Navigate to **Azure Active Directory** → **App registrations** → **New registration**
3. Name: "WLA App"
4. Redirect URI: `https://YOUR-VERCEL-URL/api/auth/callback/azure-ad`
   - For now use: `http://localhost:3000/api/auth/callback/azure-ad`
5. After creation, go to **API permissions** → **Add a permission** → **Microsoft Graph**
6. Add these permissions:
   - `Files.ReadWrite` (Delegated)
   - `offline_access` (Delegated)
   - `openid`, `profile`, `email` (Delegated)
7. Go to **Certificates & secrets** → **New client secret** → Copy the value
8. Copy **Application (client) ID** and **Directory (tenant) ID**

#### 3. Mapbox (for Map features)
- `NEXT_PUBLIC_MAPBOX_TOKEN`

**How to create:**
1. Sign up at https://www.mapbox.com/
2. Go to **Account** → **Access tokens**
3. Create new token with **Public** scope
4. Copy the token

#### 4. Vercel (for Deployment)
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**How to create:**
1. Sign up at https://vercel.com/
2. Go to **Settings** → **Tokens** → **Create Token**
3. Copy the token (this is `VERCEL_TOKEN`)
4. You'll get ORG_ID and PROJECT_ID after first deployment (see STEP 6)

---

## STEP 4: Optional GitHub Secrets

These are optional and only needed if using specific features:
- `GOOGLE_SHEETS_RANGE` → Default: `Sheet1!A1`
- `ONEDRIVE_WORKBOOK_PATH` → Default: `WLA/Admin/Reports/admin.xlsx`
- `ONEDRIVE_TABLE_NAME` → Default: `Sessions`

---

## STEP 5: Push Code to GitHub

### Option A: Using Git Bash or Command Prompt (with Git installed)

```bash
# Navigate to your project
cd C:\Users\JerrelTGilliam\.cursor\WLA_App

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: WLA App with TypeScript fixes"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/WLA_App.git

# Push to GitHub
git push -u origin main
```

### Option B: Using GitHub Desktop
1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose `C:\Users\JerrelTGilliam\.cursor\WLA_App`
4. Publish repository to GitHub

### Option C: Using VS Code/Cursor Source Control
1. Click Source Control icon (left sidebar)
2. Click "Publish to GitHub"
3. Follow the prompts

---

## STEP 6: Deploy to Vercel

### Method 1: Import from GitHub (Recommended)
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your `WLA_App` repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave default
5. Add Environment Variables (see list below)
6. Click **Deploy**

### Method 2: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Environment Variables for Vercel
Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
# Core (use values from SECRETS.txt)
NEXTAUTH_SECRET=vnGISgF3/v//1wdBxVFwGMNd2Vk5BZALVhyWF22lo8k=
NEXTAUTH_URL=https://your-app-name.vercel.app
CRON_SECRET=U6EXT7sZQT111/ZZXsuTe1ApmFtfZpJkNS1Ors64uTo=

# Google (use your created values)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_SHEETS_ID=your-sheet-id-optional
GOOGLE_SHEETS_RANGE=Sheet1!A1

# Azure (use your created values)
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-client-secret
AZURE_AD_TENANT_ID=common
ONEDRIVE_WORKBOOK_PATH=WLA/Admin/Reports/admin.xlsx
ONEDRIVE_TABLE_NAME=Sessions

# Mapbox (use your created value)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

---

## STEP 7: Get Vercel Project IDs

After deploying to Vercel:

### Method 1: From Vercel Dashboard
1. Go to your project in Vercel
2. Settings → General
3. Copy **Project ID**
4. Go to Account Settings → Your team
5. Copy **Team ID** (this is your ORG_ID)

### Method 2: Using Vercel CLI
```bash
cd C:\Users\JerrelTGilliam\.cursor\WLA_App
vercel link
# Follow prompts to link project

# IDs will be in .vercel/project.json
type .vercel\project.json
```

Now add these to GitHub Secrets:
- `VERCEL_ORG_ID` = Team ID from above
- `VERCEL_PROJECT_ID` = Project ID from above

---

## STEP 8: Update OAuth Redirect URIs

After Vercel deployment, update redirect URIs with your actual Vercel URL:

### Google Cloud Console
1. Go to https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client
3. Update **Authorized redirect URIs**:
   - `https://your-app-name.vercel.app/api/auth/callback/google`
   - Keep `http://localhost:3000/api/auth/callback/google` for local dev

### Azure Portal
1. Go to https://portal.azure.com/
2. Azure Active Directory → App registrations → Your app
3. Authentication → Add a platform → Web
4. Update **Redirect URIs**:
   - `https://your-app-name.vercel.app/api/auth/callback/azure-ad`
   - Keep `http://localhost:3000/api/auth/callback/azure-ad` for local dev

### Update GitHub Secret
Update your GitHub secret:
- `NEXTAUTH_URL` = `https://your-app-name.vercel.app`

---

## STEP 9: Verify Deployment

1. ✅ Visit your Vercel URL
2. ✅ Test Google OAuth login
3. ✅ Test Azure AD login
4. ✅ Check map loads correctly
5. ✅ Test Google Drive export
6. ✅ Test OneDrive export
7. ✅ Check GitHub Actions (should show green checkmark)

---

## 🔧 Troubleshooting

### Build Fails
- Check all environment variables are set in Vercel
- Check GitHub Actions logs for specific errors

### OAuth Errors
- Verify redirect URIs match exactly
- Ensure secrets are correctly copied (no extra spaces)
- Check API permissions are granted in Google/Azure

### Map Not Loading
- Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- Check token is valid and has public scope

### Cron Jobs Not Working
- Verify `CRON_SECRET` is set in Vercel
- Check Vercel logs for cron execution

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- NextAuth.js Docs: https://next-auth.js.org/
- Mapbox Docs: https://docs.mapbox.com/

---

## ✅ Setup Complete!

Once all steps are done, your WLA App should be:
- ✅ Deployed on Vercel
- ✅ Running GitHub Actions CI/CD
- ✅ OAuth authentication working
- ✅ Cron jobs scheduled
- ✅ All integrations functioning

**Your app URL:** https://your-app-name.vercel.app

