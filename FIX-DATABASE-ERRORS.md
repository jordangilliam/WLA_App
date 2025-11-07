# Fix Database Errors - Simple Instructions

## Problem 1: "partners" table doesn't exist

**Why it happened:** The schema.sql file creates tables in the wrong order. Tables that need `partners` are created before `partners` exists.

**Solution:** Use the fixed schema file I just created.

---

## Problem 2: Migration syntax error

**Why it happened:** The comment line ran by itself without context.

**Solution:** Run the FULL migration file, not line by line.

---

## 🔧 HOW TO FIX (Simple Steps):

### Option A: Start Fresh (Recommended - 5 minutes)

**Step 1: Delete existing tables**

In Supabase SQL Editor, run this:

```sql
-- Drop all tables (this is safe, starts fresh)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS organization_users CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS ambassador_level CASCADE;
DROP TYPE IF EXISTS partner_type CASCADE;
DROP TYPE IF EXISTS location_type CASCADE;
DROP TYPE IF EXISTS badge_tier CASCADE;
DROP TYPE IF EXISTS achievement_category CASCADE;
DROP TYPE IF EXISTS organization_type CASCADE;
DROP TYPE IF EXISTS license_tier CASCADE;
```

Click **RUN**. This clears everything.

---

**Step 2: Run the migration file (organizations only)**

1. In Supabase SQL Editor, click **New query**
2. Copy ENTIRE contents from: `lib/db/migrations/001_add_organizations.sql`
3. Paste into Supabase
4. Click **RUN**
5. Wait for "Success" ✅

This creates just what you need to get started:
- `users` table
- `organizations` table
- `organization_users` table
- Wildlife Leadership Academy organization

---

**Step 3: Test it**

In Supabase, click **Table Editor** (left sidebar)

You should see:
- ✅ users
- ✅ organizations
- ✅ organization_users

Click `organizations` → should have 1 row for "Wildlife Leadership Academy"

**If you see that:** You're done! ✅

---

### Option B: Run Fixed Schema (Optional - for full database)

If you want ALL tables (not just organizations), use the fixed version:

1. Delete existing tables (see Option A, Step 1)
2. Copy from: `lib/db/schema-FIXED.sql`
3. Paste into Supabase SQL Editor
4. Click **RUN**
5. Then run: `lib/db/migrations/001_add_organizations.sql`

**Note:** The full schema has lots of tables you don't need yet. Start with Option A unless you want everything.

---

## ✅ What You Need to Get Started

For your app to work right now, you only need:
- ✅ users table
- ✅ organizations table  
- ✅ organization_users table

That's it! The migration file creates these.

The full schema (partners, locations, rewards, etc.) is for later when you add more features.

---

## 🚀 After Fixing Database:

1. ✅ Tables created in Supabase
2. ⏳ Add API keys to .env.local (if not done)
3. ⏳ Test your app: `.\node-portable\npm.cmd run dev`
4. ⏳ Update one API route to use database
5. ⏳ Deploy to Vercel

---

## 🐛 If You Still Get Errors:

### Error: "relation already exists"
- Some tables were partially created
- Run the DROP commands from Option A, Step 1
- Then try again

### Error: "permission denied"
- You're not connected as the right user
- In Supabase dashboard, make sure you're in your WildPraxis project
- The SQL Editor should say "Connected to: Primary database"

### Error: "syntax error"
- Don't run SQL line by line
- Copy the ENTIRE file contents
- Paste all at once
- Click RUN once

---

## 📋 Quick Checklist:

Do these IN ORDER:

□ Step 1: Clear database (run DROP commands)
□ Step 2: Run 001_add_organizations.sql (full file, all at once)
□ Step 3: Check Table Editor - see 3 tables
□ Step 4: Check organizations table - see WLA row
□ Step 5: Done! ✅

---

## 💡 Why This Happened:

**The schema.sql file:**
- Has 50+ tables
- Some reference others that don't exist yet
- Like saying "put this in the blue box" before creating the blue box

**The migration file:**
- Has just 3 tables you need
- Self-contained and correct
- Works perfectly when run as a complete file

**Solution:**
- Use the migration for now
- Ignore the full schema until you need those extra features

---

## Next Step:

Once tables are created, continue with connecting your app:

1. Create `.env.local` file with your Supabase keys
2. Test connection: `.\node-portable\npm.cmd run dev`
3. See: `CONNECT-YOUR-SUPABASE.md` for detailed steps

---

**TL;DR:** 

Run Option A above. It will work. Takes 5 minutes. Then continue! 🚀

