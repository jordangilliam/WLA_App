# Connect Your Existing Supabase to WildPraxis

You already have:
✅ Supabase account (jordangilliam)
✅ Project created (WildPraxis)
✅ Connected to GitHub

**Next: Get it talking to your app!**

---

## Step 1: Get Your API Keys (5 minutes)

1. Go to: https://supabase.com/dashboard
2. Click on your **WildPraxis** project
3. In the left sidebar, click the **Settings** icon (gear ⚙️)
4. Click **API** in the settings menu
5. You'll see a page with keys

**Copy these 3 things:**

### Project URL:
Look for: "Project URL"
Will look like: `https://abcdefghijk.supabase.co`

### Anon Key:
Look for: "Project API keys" → "anon" → "public"
Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Service Role Key:
Same section, but labeled "service_role"
Also starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Step 2: Add Keys to Your App (2 minutes)

1. In your WLA_App folder, create a new file called: `.env.local`
2. Copy this template into the file:

```bash
# ============================================
# SUPABASE (DATABASE) - REQUIRED
# ============================================
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# ============================================
# NEXTAUTH (KEEP YOUR EXISTING VALUES)
# ============================================
NEXTAUTH_SECRET=your-existing-secret-here
NEXTAUTH_URL=http://localhost:3000
CRON_SECRET=your-existing-cron-secret

# ============================================
# GOOGLE OAUTH (KEEP YOUR EXISTING VALUES)
# ============================================
GOOGLE_CLIENT_ID=your-existing-google-client-id
GOOGLE_CLIENT_SECRET=your-existing-google-client-secret

# ============================================
# AZURE AD (KEEP YOUR EXISTING VALUES)
# ============================================
AZURE_AD_CLIENT_ID=your-existing-azure-client-id
AZURE_AD_CLIENT_SECRET=your-existing-azure-client-secret
AZURE_AD_TENANT_ID=common

# ============================================
# OTHER EXISTING KEYS
# ============================================
NEXT_PUBLIC_MAPBOX_TOKEN=your-existing-mapbox-token

# Copy any other variables from your existing .env or .env.local files!
```

3. Replace the Supabase values with your actual keys
4. Keep all your other existing keys!
5. Save the file

---

## Step 3: Create Database Tables (10 minutes)

Now we need to set up the database structure.

### 3a. Run Main Schema

1. In Supabase dashboard, click **SQL Editor** (in left sidebar)
2. Click **New query** button
3. In Cursor, open the file: `lib/db/schema.sql`
4. Copy the ENTIRE contents (it's long - that's okay!)
5. Paste into the Supabase SQL Editor
6. Click **RUN** button (bottom right)
7. Wait 5-10 seconds
8. Should see green "Success" messages ✅

### 3b. Run Organizations Migration

1. Click **New query** again
2. In Cursor, open: `lib/db/migrations/001_add_organizations.sql`
3. Copy entire contents
4. Paste into Supabase SQL Editor
5. Click **RUN**
6. Success! ✅

**What this created:**
- Users table (for students, teachers, admins)
- Classes table (for organizing students)
- Organizations table (for schools/districts)
- Wildlife Leadership Academy (pre-configured as first org)
- Security policies (Row Level Security)

---

## Step 4: Test Database Connection (2 minutes)

Let's make sure it works!

1. In your terminal (in Cursor), run:
```powershell
.\node-portable\npm.cmd run dev
```

2. Open browser to: `http://localhost:3000`

3. Open browser console (F12 or right-click → Inspect → Console)

4. Look for errors - there shouldn't be any Supabase connection errors

**If you see:**
- ✅ No errors = Good!
- ❌ "Invalid API key" = Double-check your .env.local file
- ❌ "Failed to fetch" = Check your internet connection

---

## Step 5: Verify Tables Were Created (2 minutes)

1. In Supabase dashboard, click **Table Editor** (in left sidebar)
2. You should see these tables:
   - ✅ users
   - ✅ classes
   - ✅ organizations
   - ✅ organization_users

3. Click on **organizations** table
4. You should see 1 row: "Wildlife Leadership Academy"

**If you see these:** You're all set! ✅

---

## Step 6: Update One API Route (Optional - 1 hour)

To actually USE the database instead of mock data:

1. Open: `app/api/classes/route.ts`
2. Open for reference: `app/api/classes/route.EXAMPLE.ts`
3. Replace the content of route.ts with the example code
4. Save

**Test it:**
1. Restart your dev server (Ctrl+C, then run dev again)
2. Try creating a class in your app
3. Check Supabase → Table Editor → classes
4. Your data should appear! 🎉

---

## Next: Deploy to Production!

Once database is working locally, you can deploy:

### Deploy with Vercel (Easiest):

1. Go to: https://vercel.com
2. Sign in with your GitHub account (jordangilliam)
3. Click "Add New" → "Project"
4. Select your WLA_App repository
5. In "Environment Variables" section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - All your other env variables from .env.local
6. Click "Deploy"
7. Wait 2-3 minutes
8. Get your live URL! 🚀

**Your app will be live at:** `https://wla-app.vercel.app` (or similar)

---

## Troubleshooting

### "Invalid API key"
- Double-check you copied the full keys (they're very long!)
- Make sure no extra spaces
- Restart dev server after changing .env.local

### "Table does not exist"
- Go to Supabase SQL Editor
- Run the schema.sql file again
- Check Table Editor to verify tables exist

### "Row Level Security" errors
- This is normal if you're not signed in
- Sign in to your app first
- RLS policies protect your data (that's good!)

---

## What You Have Now

✅ Supabase account  
✅ Project created  
✅ Connected to GitHub  
✅ API keys (after Step 1)  
✅ Keys in app (after Step 2)  
✅ Database tables (after Step 3)  
✅ Connection working (after Step 4)  
✅ Ready to deploy! (Step 6)

---

## Quick Commands Reference

**Start dev server:**
```powershell
.\node-portable\npm.cmd run dev
```

**Stop dev server:**
Press `Ctrl + C`

**Check if running:**
Open: http://localhost:3000

---

**You're SO CLOSE to having this live!**

Start with Step 1 - get those API keys!

Then follow steps 2-6 and you'll be deployed by end of day! 🚀

