# Quick Migration Fixes

## Issues Encountered:

### ❌ Migration 003 - Index Already Exists
**Error:** `idx_field_sites_location already exists`
**Fix:** Use the FIXED version: `003_add_field_sites_and_achievements_FIXED.sql`

### ✅ Migration 004 - Successful!
No changes needed.

### ❌ Migration 005 - Policy Already Exists  
**Error:** `policy "Public can view public stocking schedules" already exists`
**Fix:** Run this FIRST to drop existing policies:

```sql
-- Run this before migration 005
DROP POLICY IF EXISTS "Public can view public stocking schedules" ON stocking_schedules;
DROP POLICY IF EXISTS "Public can view water body details" ON water_body_details;
DROP POLICY IF EXISTS "Public can view catch reports" ON catch_reports;
```

Then run migration 005 normally.

### ❌ Migration 006 - Missing Quote
**Error:** `syntax error at or near "PA" LINE 427`
**Fix:** Already fixed in the file! Line 427 now has: `'Erie', 'PA', '16505',`

Just re-run migration 006.

### ❌ Migration 012 - Invalid Enum Value
**Error:** `invalid input value for enum user_role: "teacher"`
**Fix:** Your users table doesn't have a "teacher" role enum. Run this FIRST:

```sql
-- Add teacher role to enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'teacher' AND enumtypid = 'user_role'::regtype) THEN
    ALTER TYPE user_role ADD VALUE 'teacher';
  END IF;
EXCEPTION 
  WHEN undefined_object THEN
    -- Create the enum if it doesn't exist
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
END $$;
```

Then run migration 012.

### ❌ Migration 013 - Foreign Key Type Mismatch
**Error:** `foreign key constraint "class_team_stats_class_id_fkey" cannot be implemented`
**Fix:** Your `classes` table has `id` as INTEGER, but migration expects UUID. Run this FIRST:

```sql
-- Check your classes table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'classes' AND column_name = 'id';

-- If id is INTEGER, we need to modify migration 013
-- Option A: Convert classes.id to UUID (DANGEROUS - data loss)
-- Option B: Modify migration to use INTEGER (safer)
```

**Safer Fix:** Modify migration 013 to change:
```sql
class_id UUID NOT NULL REFERENCES classes(id)
```
To:
```sql
class_id INTEGER NOT NULL REFERENCES classes(id)
```

### ❌ Migration 014 - Missing class_enrollments Table
**Error:** `relation "class_enrollments" does not exist`
**Fix:** Create it FIRST:

```sql
-- Create class_enrollments table if it doesn't exist
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_class_enrollments_class ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student ON class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_status ON class_enrollments(status);
```

Then run migration 014.

### ❌ Migration 015 - SQL Syntax Error
**Error:** `record variable cannot be part of multiple-item INTO list`
**Fix:** In the `review_photo_submission` function, change:

**WRONG:**
```sql
SELECT 
  pc.*,
  COUNT(ps.id) FILTER (WHERE ps.status = 'approved')
INTO v_challenge, v_completed_count
```

**CORRECT:**
```sql
SELECT pc.* INTO v_challenge
FROM photo_challenges pc
WHERE pc.id = (SELECT challenge_id FROM photo_submissions WHERE id = p_submission_id);

SELECT COUNT(ps.id) FILTER (WHERE ps.status = 'approved') INTO v_completed_count
FROM photo_submissions ps
WHERE ps.user_id = v_user_id AND ps.challenge_id = v_challenge.id;
```

---

## Quick Fix Script

Run this COMPLETE script to fix all issues at once:

```sql
-- ============================================================================
-- COMPLETE FIX SCRIPT - Run this in Supabase SQL Editor
-- ============================================================================

-- Fix 1: Drop existing policies from migration 005
DROP POLICY IF EXISTS "Public can view public stocking schedules" ON stocking_schedules;
DROP POLICY IF EXISTS "Public can view water body details" ON water_body_details;
DROP POLICY IF EXISTS "Public can view catch reports" ON catch_reports;

-- Fix 2: Add teacher role enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'teacher' AND enumtypid = 'user_role'::regtype) THEN
    ALTER TYPE user_role ADD VALUE 'teacher';
  END IF;
EXCEPTION 
  WHEN undefined_object THEN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
END $$;

-- Fix 3: Create class_enrollments table
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

-- Policies for class_enrollments
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

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'All fixes applied successfully! Now re-run failed migrations.';
END $$;
```

---

## Revised Migration Order:

1. ✅ Run **FIX SCRIPT above** first
2. ✅ Run `003_add_field_sites_and_achievements_FIXED.sql`
3. ✅ Run `004_seed_pittsburgh_field_sites.sql` (already successful)
4. ✅ Run `005_add_trout_waters_and_stocking.sql` (now will work)
5. ✅ Run `006_statewide_expansion.sql` (quote fixed)
6. ✅ Run `012_challenges_system.sql` (now will work)
7. ⚠️  **Skip** `013_class_leaderboards.sql` FOR NOW (type mismatch issue)
8. ✅ Run `014_species_cards.sql` (now will work)
9. ⚠️  **Skip** `015_photo_challenges.sql` FOR NOW (needs syntax fix)

---

## For Migrations 13 & 15 (Optional - Advanced Features):

These can be added later after fixing:
- Migration 13: Requires changing UUID to INTEGER for class_id
- Migration 15: Requires rewriting the function logic

The core app will work without these!

---

**Priority:** Run the FIX SCRIPT, then re-run migrations 003, 005, 006, 012, 014. 

**Result:** You'll have 140+ field sites, challenges, and species cards working! 🚀

