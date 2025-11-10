# 🔧 UPDATED Migration Fixes - Simplified 3-Step Process

## ⚠️ **You Hit This Error:**
```
Error: Failed to run sql query: ERROR: 42703: column "site_id" does not exist
```

**Cause:** Old tables exist from previous attempts with different column structures. `CREATE TABLE IF NOT EXISTS` skips creation, but indexes fail.

---

## ✅ **SIMPLE 3-STEP FIX:**

### **Step 1: Run Cleanup Script**

This drops old tables so we can start fresh. Copy and paste into **Supabase SQL Editor**:

```sql
-- ============================================================================
-- CLEANUP SCRIPT - Run this FIRST
-- ============================================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_visits CASCADE;
DROP TABLE IF EXISTS field_sites CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS nearby_field_sites CASCADE;
DROP FUNCTION IF EXISTS record_visit CASCADE;
DROP FUNCTION IF EXISTS check_achievements CASCADE;
DROP FUNCTION IF EXISTS get_user_stats CASCADE;

-- Success!
DO $$ 
BEGIN
  RAISE NOTICE '✅ Cleanup complete! Now run the fix script.';
END $$;
```

---

### **Step 2: Run Fix Script**

This prepares your database for all migrations. Copy and paste:

```sql
-- ============================================================================
-- FIX SCRIPT - Run this SECOND
-- ============================================================================

-- Fix: Drop existing policies from migration 005
DROP POLICY IF EXISTS "Public can view public stocking schedules" ON stocking_schedules;
DROP POLICY IF EXISTS "Public can view water body details" ON water_body_details;
DROP POLICY IF EXISTS "Public can view catch reports" ON catch_reports;

-- Fix: Add teacher role enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'teacher' AND enumtypid = 'user_role'::regtype) THEN
    ALTER TYPE user_role ADD VALUE 'teacher';
  END IF;
EXCEPTION 
  WHEN undefined_object THEN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
END $$;

-- Fix: Create class_enrollments table
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_class_enrollments_class ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student ON class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_status ON class_enrollments(status);

-- Enable RLS
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Students can view their own enrollments" ON class_enrollments;
CREATE POLICY "Students can view their own enrollments"
  ON class_enrollments FOR SELECT
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Teachers can view their class enrollments" ON class_enrollments;
CREATE POLICY "Teachers can view their class enrollments"
  ON class_enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.id = class_enrollments.class_id
        AND u.id = auth.uid()
    )
  );

-- Success!
DO $$ 
BEGIN
  RAISE NOTICE '✅ Fix script complete! Now run migrations 003-014.';
END $$;
```

---

### **Step 3: Run These 6 Migrations IN ORDER**

Now run each migration file in your Supabase SQL Editor:

#### **3.1 - Field Sites System**
**File:** `003_add_field_sites_and_achievements_FIXED.sql`
- Creates field_sites, user_visits, achievements tables
- ✅ Should work perfectly now!

#### **3.2 - Pittsburgh Sites**
**File:** `004_seed_pittsburgh_field_sites.sql`
- 64 Pittsburgh field sites
- ✅ You said this worked before!

#### **3.3 - Trout Waters**
**File:** `005_add_trout_waters_and_stocking.sql`
- 16 trout fishing locations
- ✅ Should work now (policies dropped in Step 2)

#### **3.4 - Statewide Expansion**
**File:** `006_statewide_expansion.sql`
- 50+ sites across PA
- ✅ Quote fixed! Should work now
- **Total: 140+ field sites!**

#### **3.5 - Challenges System**
**File:** `012_challenges_system.sql`
- Daily/weekly challenges
- ✅ Should work now (teacher enum added in Step 2)

#### **3.6 - Species Cards**
**File:** `014_species_cards.sql`
- 13 PA species with trading cards
- ✅ Should work now (class_enrollments created in Step 2)

---

## 📊 **Verify Success:**

After all 6 migrations, run this to check your data:

```sql
-- Verify everything worked
SELECT 
  (SELECT COUNT(*) FROM field_sites) as field_sites,
  (SELECT COUNT(*) FROM achievements) as achievements,
  (SELECT COUNT(*) FROM challenges) as challenges,
  (SELECT COUNT(*) FROM species_cards) as species_cards,
  (SELECT COUNT(*) FROM stocking_schedules) as stocking_schedules;
```

**Expected Results:**
- field_sites: **~140**
- achievements: **6**
- challenges: **6**
- species_cards: **13**
- stocking_schedules: **~50**

---

## 🎯 **What About Migrations 13 & 15?**

**Skip these for now** - they have complex issues and are optional features:

- ❌ **013_class_leaderboards.sql** - Type mismatch (needs schema changes)
- ❌ **015_photo_challenges.sql** - SQL syntax needs rewrite

**Your app will work great without them!** We can add these later.

---

## 🚀 **After All Migrations Work:**

1. ✅ Run `npm install` (install dependencies)
2. ✅ Run `npm run build` (build the app locally)
3. ✅ Deploy to Vercel (follow `DEPLOYMENT_CHECKLIST.md`)

---

## 💡 **Why 3 Steps?**

1. **Cleanup** - Removes old/conflicting tables
2. **Fix** - Prepares database with missing enums/tables
3. **Migrate** - Runs the actual feature migrations

This ensures a clean, successful migration! 🎉

---

**All scripts are in your repo!**

Just copy-paste each script into Supabase SQL Editor and run them in order. You'll be done in 5-10 minutes! 🚀

