# 🚀 Deploy to Vercel NOW (Bypass Firewall!)

Since your firewall blocks local dev server, let's deploy straight to production!

Once live, you can access it from anywhere.

---

## Step 1: Push to GitHub (5 minutes)

### If you haven't initialized git yet:

```powershell
cd C:\Users\JerrelTGilliam\.cursor\WLA_App
git init
git add .
git commit -m "Database connected, ready for production"
```

### Connect to your existing GitHub repo:

```powershell
git remote add origin https://github.com/jordangilliam/WLA_App.git
git branch -M main
git push -u origin main
```

**Note:** If it asks for credentials, use GitHub personal access token (not password).

---

## Step 2: Deploy to Vercel (10 minutes)

### 2a. Sign up / Sign in to Vercel

1. Go to: **https://vercel.com**
2. Click "Sign Up" or "Log In"
3. **Use "Continue with GitHub"** (easiest!)
4. Authorize Vercel to access your GitHub

### 2b. Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find **"jordangilliam/WLA_App"** in the list
3. Click **"Import"**

### 2c. Configure Build Settings

Vercel should auto-detect Next.js. Just verify:

- **Framework Preset:** Next.js (should be auto-selected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

Click **"Deploy"** (DON'T click yet - need env vars first!)

---

## Step 3: Add Environment Variables (5 minutes)

**BEFORE clicking Deploy**, scroll down to **"Environment Variables"** section.

Add these (get values from your `.env.local`):

### Required Variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbG...your-anon-key
SUPABASE_SERVICE_ROLE_KEY = eyJhbG...your-service-key

NEXTAUTH_SECRET = your-nextauth-secret
NEXTAUTH_URL = https://your-app.vercel.app (Vercel will show you this URL)

GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret

AZURE_AD_CLIENT_ID = your-azure-client-id
AZURE_AD_CLIENT_SECRET = your-azure-client-secret
AZURE_AD_TENANT_ID = common

NEXT_PUBLIC_MAPBOX_TOKEN = your-mapbox-token
```

**For each variable:**
1. Type the name in "Key"
2. Paste the value in "Value"
3. Click "Add"
4. Repeat for all

**Important:** For `NEXTAUTH_URL`, use the URL Vercel will give you (like `https://wla-app.vercel.app`). You can update this after first deployment.

---

## Step 4: Deploy! (2-3 minutes)

1. After adding all environment variables, click **"Deploy"**
2. Wait 2-3 minutes while Vercel builds your app
3. Watch the build logs (cool to see!)
4. When done, you'll see: **"Congratulations! Your project has been deployed."**

---

## Step 5: Get Your Live URL (instant!)

Vercel gives you a URL like:
- `https://wla-app.vercel.app`
- OR `https://wla-app-jordangilliam.vercel.app`

**Click "Visit"** to open your live site!

---

## Step 6: Update NEXTAUTH_URL (2 minutes)

Now that you have your real URL:

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Find `NEXTAUTH_URL`
4. Click "Edit"
5. Change to your actual Vercel URL
6. Click "Save"
7. Redeploy (Vercel will prompt you)

---

## Step 7: Configure OAuth Callbacks (5 minutes)

### For Google OAuth:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client
3. Add to **"Authorized redirect URIs"**:
   - `https://your-app.vercel.app/api/auth/callback/google`
4. Save

### For Azure AD:

1. Go to: https://portal.azure.com
2. Navigate to Azure AD → App registrations → Your app
3. Add to **"Redirect URIs"**:
   - `https://your-app.vercel.app/api/auth/callback/azure-ad`
4. Save

---

## 🎉 YOU'RE LIVE!

Your app is now accessible at: `https://your-app.vercel.app`

**No firewall issues!** It's on the public internet.

---

## ✅ Test It:

1. Go to your Vercel URL
2. Sign in with Google/Azure
3. Try creating a class
4. Check Supabase Table Editor to see the data

**It should work!**

---

## 🔥 Automatic Deployments

Now whenever you push to GitHub:
- Vercel automatically detects changes
- Rebuilds your app
- Deploys new version
- Takes ~2 minutes
- No manual steps needed!

**Workflow:**
```
Edit code in Cursor → Save → Git commit → Git push → Auto-deploy!
```

---

## 💰 Cost:

**FREE!** Vercel's hobby plan includes:
- Unlimited deployments
- 100GB bandwidth/month
- Automatic SSL (HTTPS)
- Custom domain support
- Preview deployments for every PR

Perfect for your needs!

---

## 🐛 Troubleshooting

### Build fails
- Check build logs in Vercel
- Usually missing environment variable
- Or TypeScript error

### Can't sign in
- Check OAuth redirect URIs are correct
- Verify NEXTAUTH_URL matches your Vercel URL
- Check NEXTAUTH_SECRET is set

### Database errors
- Verify Supabase environment variables are correct
- Check Supabase project is active (not paused)
- Check Table Editor to verify tables exist

---

## 🚀 Next Steps After Deployment:

### Custom Domain (Optional)
1. Buy a domain (like `wildpraxis.org`)
2. In Vercel → Settings → Domains
3. Add your custom domain
4. Update DNS records
5. Vercel handles SSL automatically!

### Share with WLA
Send them the URL and get feedback!

### Continue Building
Now you can develop locally (if firewall allows later) or:
- Edit directly in Cursor
- Commit and push
- Auto-deploys to production
- Test on live site

---

**Ready to deploy?**

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Click Deploy
5. **Live in 10 minutes!** 🎉

