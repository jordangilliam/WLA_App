# ⚡ WLA App - QUICK START (5 Steps)

**Goal:** Get your app from local folder to live on the internet

---

## 📝 STEP 1: Create GitHub Account & Repository (5 min)

1. **Create GitHub account** (if you don't have one): https://github.com/join
2. **Create new repository**: https://github.com/new
   - Name: `WLA_App`
   - Private ✅ (recommended)
   - DO NOT check any boxes
   - Click "Create repository"

---

## 🔐 STEP 2: Create API Credentials (20-30 min)

You need to create accounts and get API keys from these services:

### 2.1 Google (for Google Drive/Sheets integration)
- Go to: https://console.cloud.google.com/
- Follow: **SETUP_GUIDE.md → Step 3.1** for detailed instructions
- You'll get: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### 2.2 Microsoft Azure (for OneDrive integration)
- Go to: https://portal.azure.com/
- Follow: **SETUP_GUIDE.md → Step 3.2** for detailed instructions
- You'll get: `AZURE_AD_CLIENT_ID` and `AZURE_AD_CLIENT_SECRET`

### 2.3 Mapbox (for map features)
- Go to: https://www.mapbox.com/
- Create account → Get access token
- You'll get: `NEXT_PUBLIC_MAPBOX_TOKEN`

### 2.4 Vercel (for hosting)
- Go to: https://vercel.com/
- Create account → Settings → Tokens → Create
- You'll get: `VERCEL_TOKEN`

**✅ PRO TIP:** Open **SECRETS.txt** - your `NEXTAUTH_SECRET` and `CRON_SECRET` are already generated!

---

## 🔑 STEP 3: Add Secrets to GitHub (10 min)

1. Go to your GitHub repo: `https://github.com/YOUR-USERNAME/WLA_App`
2. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Add these secrets **ONE BY ONE**:

**Copy from SECRETS.txt:**
```
NEXTAUTH_SECRET=vnGISgF3/v//1wdBxVFwGMNd2Vk5BZALVhyWF22lo8k=
CRON_SECRET=U6EXT7sZQT111/ZZXsuTe1ApmFtfZpJkNS1Ors64uTo=
```

**From your API credentials (Step 2):**
```
GOOGLE_CLIENT_ID=your-value
GOOGLE_CLIENT_SECRET=your-value
AZURE_AD_CLIENT_ID=your-value
AZURE_AD_CLIENT_SECRET=your-value
AZURE_AD_TENANT_ID=common
NEXT_PUBLIC_MAPBOX_TOKEN=your-value
VERCEL_TOKEN=your-value
```

**You'll add these AFTER first deployment:**
```
VERCEL_ORG_ID=get-after-deployment
VERCEL_PROJECT_ID=get-after-deployment
```

---

## 🚀 STEP 4: Push Code to GitHub (5 min)

**Choose ONE method:**

### Method A: Git Command Line
```bash
cd C:\Users\JerrelTGilliam\.cursor\WLA_App
git init
git add .
git commit -m "Initial commit: WLA_App"
git remote add origin https://github.com/jordangilliam/WLA_App.git
git push -u origin main
```

### Method B: GitHub Desktop
1. Open GitHub Desktop
2. File → Add Local Repository → Choose your WLA_App folder
3. Click "Publish to GitHub"

### Method C: VS Code/Cursor
1. Open Source Control panel (left sidebar)
2. Click "Publish to GitHub"
3. Follow prompts

📖 **Detailed instructions:** See **PUSH_TO_GITHUB.md**

---

## 🌐 STEP 5: Deploy to Vercel (10 min)

### 5.1 Initial Deployment
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `WLA_App` repo
4. **Add Environment Variables** (same as GitHub secrets from Step 3)
5. Click "Deploy"
6. **Copy your Vercel URL** (e.g., `https://wla-app-xyz.vercel.app`)

### 5.2 Get Vercel Project IDs
After deployment:
1. Go to your Vercel project → **Settings** → **General**
2. Copy **Project ID**
3. Go to **Account Settings** → Your team → Copy **Team ID** (this is ORG_ID)
4. Add these to GitHub Secrets:
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

### 5.3 Update OAuth Redirect URIs
**Important:** Now update your OAuth apps with the real Vercel URL:

**Google Cloud Console:**
- https://console.cloud.google.com/apis/credentials
- Edit OAuth client → Update redirect URI to:
  - `https://your-vercel-url.vercel.app/api/auth/callback/google`

**Azure Portal:**
- https://portal.azure.com/
- Your app → Authentication → Update redirect URI to:
  - `https://your-vercel-url.vercel.app/api/auth/callback/azure-ad`

**Update GitHub Secret:**
- Update `NEXTAUTH_URL` to `https://your-vercel-url.vercel.app`

---

## ✅ VERIFICATION

Visit your app and test:
1. ✅ App loads: `https://your-vercel-url.vercel.app`
2. ✅ Google login works
3. ✅ Azure AD login works
4. ✅ Map displays correctly
5. ✅ GitHub Actions shows green checkmark
6. ✅ Exports work (Drive, OneDrive)

---

## 📚 Full Documentation

- **SETUP_GUIDE.md** - Complete detailed instructions
- **SECRETS.txt** - Your generated secrets (KEEP SECURE!)
- **PUSH_TO_GITHUB.md** - Detailed Git push instructions
- **README.md** - Project overview

---

## 🆘 Need Help?

**Common Issues:**
- OAuth errors → Check redirect URIs match exactly
- Build fails → Check all env variables are set
- Map not loading → Check Mapbox token

See **SETUP_GUIDE.md → Troubleshooting** section

---

## 🎉 Success!

Once all steps complete, your app will be:
- ✅ Live on the internet
- ✅ Auto-deploying on every push
- ✅ OAuth authentication working
- ✅ Scheduled cron jobs running
- ✅ All integrations functional

**Your live app:** https://your-vercel-url.vercel.app

