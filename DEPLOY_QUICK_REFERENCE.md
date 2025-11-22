# 🚀 DEPLOY NOW - Quick Reference Card

**Your code is on GitHub and ready!** Follow these steps:

---

## 📋 **STEP-BY-STEP DEPLOYMENT**

### **1. Login to Vercel** (Browser should be open)
👉 https://vercel.com/login

**Login with GitHub** - Use your jordangilliam account

---

### **2. Import Your Repository**

1. Click **"Add New Project"** or **"Import Project"**
2. Look for: **`jordangilliam/WLA_App`**
3. Click **"Import"** next to it

**If you don't see it:**
- Click "Adjust GitHub App Permissions"
- Grant Vercel access to WLA_App repository
- Refresh and try again

---

### **3. Configure Project Settings**

Vercel will auto-detect Next.js. Verify these settings:

```
Framework Preset: Next.js ✅ (auto-detected)
Root Directory: ./ ✅ (default)
Build Command: npm run build ✅
Output Directory: .next ✅
Install Command: npm install ✅
```

**Click "Deploy" to continue** (you'll add env vars next)

OR

**Click "Environment Variables"** to add them first

---

### **4. Add Environment Variables**

Click **"Environment Variables"** and add these:

#### **REQUIRED - Copy and paste these:**

```bash
# Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://vaqcsbneypmdhrqnnjph.supabase.co

# Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [GET FROM SUPABASE - see below]

# Variable Name: SUPABASE_SERVICE_ROLE_KEY
Value: [GET FROM SUPABASE - see below]

# Variable Name: SUPABASE_KEY
Value: [SAME AS NEXT_PUBLIC_SUPABASE_ANON_KEY]

# Variable Name: NEXTAUTH_SECRET
Value: [GENERATED BELOW - see terminal output]

# Variable Name: NEXTAUTH_URL
Value: https://your-project.vercel.app
(Update this after first deployment with your actual URL)

# Variable Name: NEXT_PUBLIC_MAPBOX_TOKEN
Value: [GET FROM MAPBOX - see below]

# Variable Name: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
Value: [SAME AS NEXT_PUBLIC_MAPBOX_TOKEN]

# Variable Name: NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN
Value: [SAME AS NEXT_PUBLIC_MAPBOX_TOKEN]

# Variable Name: NEXT_PUBLIC_APP_VERSION
Value: 1.0.0

# Variable Name: NODE_ENV
Value: production
```

**IMPORTANT:** For each variable:
- Click "Add New"
- Type variable name exactly (case-sensitive!)
- Paste value
- Select "Production" environment
- Click "Add"

---

### **5. Get Your Secret Keys**

#### **🔑 NEXTAUTH_SECRET** (Generated - check terminal output above)
✅ Copy the random string that was just generated

#### **🔑 Supabase Keys:**

1. Open: https://app.supabase.com
2. Select your project: **vaqcsbneypmdhrqnnjph**
3. Go to: **Settings** → **API**
4. Copy these keys:
   - **Project URL** → already set (vaqcsbneypmdhrqnnjph.supabase.co)
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Security:** Never share the service_role key publicly!

#### **🗺️ Mapbox Token:**

1. Open: https://account.mapbox.com/access-tokens/
2. Copy your **Default public token** or create a new one
3. Use for all three Mapbox variables (they're all the same value)

---

### **6. Deploy!**

Once all environment variables are added:

1. Click **"Deploy"**
2. Watch the build logs (this is exciting!)
3. Wait 5-10 minutes
4. Look for: **"✅ Build Completed"**

---

### **7. Get Your Live URL**

After deployment succeeds:
1. Vercel will show you: `https://your-project-name.vercel.app`
2. Click it to open your live app!
3. **Copy this URL** - you'll need it

---

### **8. Update NEXTAUTH_URL**

⚠️ **Important Final Step:**

1. Go back to Vercel Dashboard
2. Your Project → **Settings** → **Environment Variables**
3. Find `NEXTAUTH_URL`
4. Click **Edit**
5. Update with your actual Vercel URL (from step 7)
6. Click **Save**
7. Vercel will **auto-redeploy** (2-3 minutes)

---

## ✅ **VERIFICATION CHECKLIST**

After deployment, test these:

**Homepage:**
```
https://your-project.vercel.app
```
✅ Should load beautifully

**Health Check:**
```
https://your-project.vercel.app/api/health
```
✅ Should return: {"status":"ok"}

**Map:**
```
https://your-project.vercel.app/explore
```
✅ Should show interactive map with field sites

**Try signing up:**
- Click "Sign Up"
- Create test account
- ✅ Should work!

---

## 🐛 **IF SOMETHING GOES WRONG**

### Build Fails

**Error: "Module not found"**
→ Likely a dependency issue. Check build logs.

**Error: "Environment variable ... is not defined"**
→ Add the missing variable in Vercel settings
→ Trigger a redeploy

### Runtime Errors

**"Cannot connect to database"**
→ Check Supabase keys are correct
→ Verify Supabase project is active

**"Map not loading"**
→ Check Mapbox token is valid
→ Ensure all three Mapbox variables are set

**"Authentication error"**
→ Verify NEXTAUTH_SECRET is set
→ Check NEXTAUTH_URL matches your Vercel URL

---

## 📊 **EXPECTED BUILD OUTPUT**

You should see in build logs:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (108/108)
✓ Finalizing page optimization

Build completed. Deployment ready!
✅ Deployment Complete
```

---

## 🎉 **SUCCESS!**

When you see your app live:
- Take a screenshot!
- Test the main features
- Share the URL!

**You just deployed a full-stack conservation education platform!** 🌲🦋🎊

---

## 📞 **Need Help?**

If you get stuck:
1. Check the build logs in Vercel
2. Verify all environment variables are set
3. Make sure no typos in variable names
4. Check that values don't have extra spaces

**I'm here if you need assistance with any step!**

---

**Browser open? Let's deploy! 🚀**

Last updated: November 22, 2025

