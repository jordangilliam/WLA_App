# Complete Migration History & Fixes

## Overview
This document tracks the entire history of database migrations for the WLA_App, including all errors encountered and fixes applied.

---

## Migration Sequence & Current Status

### ✅ **COMPLETED SUCCESSFULLY**

#### 000 - Cleanup Script
- **Purpose**: Drop conflicting tables from previous attempts
- **Status**: ✅ Successful
- **Tables Dropped**: `user_achievements`, `achievements`, `user_visits`, `field_sites`

#### Fix Script (Inline SQL)
- **Purpose**: Prepare database for clean migration run
- **Status**: ✅ Successful
- **Actions**:
  - Dropped duplicate RLS policies
  - Added `teacher` enum value to `user_role` type
  - Created `class_enrollments` table with proper structure

#### 003 - Core Tables (FIXED version)
- **Purpose**: Create `field_sites`, `user_visits`, `achievements`, `user_achievements`
- **Status**: ✅ Successful
- **Key Features**:
  - PostGIS `geography` type for location data
  - Separate `latitude` and `longitude` NOT NULL columns
  - `habitat_types` as `TEXT[]` array
  - `species_commonly_found` as `TEXT[]` array
  - Proper indexes including `idx_field_sites_location`

---

### 🚀 **READY TO RUN** (Next Steps)

#### 004 - Seed Pittsburgh Field Sites
- **Purpose**: Insert 64+ Pittsburgh area locations
- **Status**: ✅ **FIXED & READY**
- **Fixes Applied**:
  1. ✅ Column names updated: `species_likely` → `species_commonly_found`
  2. ✅ Column names updated: `habitat_type` → `habitat_types`
  3. ✅ All 64 entries now have explicit `latitude` and `longitude` values
  4. ✅ All 29 habitat_types values wrapped in `ARRAY['value']` notation
  5. ✅ Removed duplicate lat/lng from first 2 entries
- **Locations Include**:
  - Schenley Park, Frick Park, Highland Park
  - All Carnegie Libraries (64 total)
  - Universities (Pitt, CMU, Duquesne, Chatham, etc.)
  - Sports venues (PNC Park, Acrisure Stadium, PPG Arena)
  - State/County parks (Moraine, Raccoon Creek, etc.)
  - Greenways and trail systems

#### 005 - Trout Waters & Stocking
- **Purpose**: Add 16 trout fishing locations + stocking schedule system
- **Status**: ✅ **FIXED & READY**
- **Fixes Applied**:
  1. ✅ All habitat_types wrapped in ARRAY notation
  2. ✅ Explicit latitude and longitude added to all entries
  3. ✅ RLS policies updated with `DROP POLICY IF EXISTS`
- **Features**:
  - `trout_stocking_schedules` table
  - `stocking_notifications` table
  - Auto-update Edge Function integration planned
  - Locations: Allegheny River, Slippery Rock Creek, Oil Creek, etc.

#### 006 - Statewide Expansion
- **Purpose**: Add 50+ locations across PA
- **Status**: ✅ **FIXED & READY**
- **Fixes Applied**:
  1. ✅ Fixed missing quote in Erie address
  2. ✅ All habitat_types wrapped in ARRAY notation
  3. ✅ Explicit latitude and longitude added to all entries
- **Coverage Areas**:
  - State College (Penn State, museums, parks)
  - Harrisburg (Capitol, museums, state parks)
  - Philadelphia (major museums, universities, parks)
  - Coatesville (community spaces, parks)
  - East Stroudsburg (Pocono region, water gaps)
  - Erie (Presque Isle, Great Lakes ecosystem)

---

### ⏸️ **SKIPPED FOR NOW** (Not Critical)

#### 012 - Challenges System
- **Status**: ⚠️ Has enum issue (teacher role) - **SKIP**
- **Why Skip**: Complex system, not needed for MVP
- **Note**: Fix script attempted to add `teacher` enum, but migration has other issues

#### 013 - Class Leaderboards
- **Status**: ⚠️ Type mismatch (UUID vs INTEGER) - **SKIP**
- **Why Skip**: Complex foreign key issues, requires schema redesign
- **Error**: `class_team_stats.class_id` (UUID) vs `classes.id` (INTEGER)

#### 014 - Species Cards
- **Status**: ⚠️ Depends on class_enrollments - **SKIP FOR NOW**
- **Why Skip**: Can be added later once core functionality is stable
- **Note**: Fix script created class_enrollments table

#### 015 - Photo Challenges
- **Status**: ⚠️ SQL syntax errors - **SKIP**
- **Why Skip**: Complex INTO variable syntax issues
- **Error**: `record variable cannot be part of multiple-item INTO list`

---

## What Each Migration Fixes

### Schema Alignment Issues (FIXED ✅)
**Problem**: Seed migrations (004, 005, 006) were written for an old schema.

**Old Column Names** → **New Column Names**:
- `species_likely` → `species_commonly_found`
- `habitat_type` → `habitat_types`

**Solution**: Updated all INSERT statements in migrations 004, 005, 006.

---

### Array Syntax Issues (FIXED ✅)
**Problem**: PostgreSQL requires array literals to use either `ARRAY['value']` or `'{value}'` syntax.

**Error**:
```
ERROR: 22P02: malformed array literal: "Urban/Gardens"
DETAIL: Array value must start with "{" or dimension information.
```

**Solution**: Wrapped all 30 habitat_types values across migrations 004, 005, 006:
```sql
-- OLD (WRONG):
'Mixed Forest/Gardens'),

-- NEW (CORRECT):
ARRAY['Mixed Forest/Gardens']),
```

---

### NOT NULL Constraint Issues (FIXED ✅)
**Problem**: Schema requires explicit `latitude` and `longitude` columns (NOT NULL).

**Error**:
```
ERROR: 23502: null value in column "latitude" violates not-null constraint
```

**Solution**: Extracted lat/lng from `ST_MakePoint()` and added as explicit columns:
```sql
-- OLD:
INSERT INTO field_sites (name, description, location, ...) VALUES
('Site Name', 'Description', ST_SetSRID(ST_MakePoint(-79.95, 40.44), 4326)::geography, ...);

-- NEW:
INSERT INTO field_sites (name, description, latitude, longitude, location, ...) VALUES
('Site Name', 'Description', 40.44, -79.95, ST_SetSRID(ST_MakePoint(-79.95, 40.44), 4326)::geography, ...);
```

---

## How to Run Migrations (Correct Order)

### Step 1: Run Cleanup (if needed)
```sql
-- Only if you have old tables/policies
-- Run: supabase/migrations/000_CLEANUP_BEFORE_003.sql
```

### Step 2: Run Fix Script (if needed)
```sql
-- Drop duplicate policies and prepare database
-- See MIGRATION_FIXES_UPDATED.md for full script
```

### Step 3: Run Core Schema
```sql
-- Run: supabase/migrations/003_add_field_sites_and_achievements_FIXED.sql
```

### Step 4: Seed Pittsburgh Data ⬅️ **YOU ARE HERE**
```sql
-- Run: supabase/migrations/004_seed_pittsburgh_field_sites.sql
```

### Step 5: Add Trout Waters
```sql
-- Run: supabase/migrations/005_add_trout_waters_and_stocking.sql
```

### Step 6: Statewide Expansion
```sql
-- Run: supabase/migrations/006_statewide_expansion.sql
```

---

## Verification Queries

### After Each Migration, Check:

```sql
-- Count field sites
SELECT COUNT(*) FROM field_sites;
-- Expected after 004: 64
-- Expected after 005: 80
-- Expected after 006: 130+

-- Check for NULL lat/lng (should return 0)
SELECT COUNT(*) FROM field_sites 
WHERE latitude IS NULL OR longitude IS NULL;

-- Check habitat_types format (all should have arrays)
SELECT name, habitat_types 
FROM field_sites 
WHERE habitat_types IS NULL OR array_length(habitat_types, 1) IS NULL
LIMIT 5;

-- Check species format
SELECT name, species_commonly_found 
FROM field_sites 
WHERE species_commonly_found IS NULL OR array_length(species_commonly_found, 1) IS NULL
LIMIT 5;
```

---

## Common Errors & Solutions

### Error: Column does not exist
**Cause**: Using old column names
**Solution**: Check migration 003_FIXED for current schema

### Error: Malformed array literal
**Cause**: Missing `ARRAY[]` wrapper
**Solution**: All habitat_types must be `ARRAY['value']`

### Error: NULL value in column violates not-null constraint
**Cause**: Missing latitude or longitude
**Solution**: Ensure explicit lat, lng values in INSERT

### Error: Policy already exists
**Cause**: Previous migration attempt left policies behind
**Solution**: Run cleanup script or use `DROP POLICY IF EXISTS`

---

## Migration File Quality Checklist

Before running any new migration:

- [ ] All table/column names match `003_FIXED` schema
- [ ] All `habitat_types` values use `ARRAY['value']` syntax
- [ ] All `species_commonly_found` values use `ARRAY['sp1', 'sp2']` syntax
- [ ] Explicit `latitude` and `longitude` columns in all INSERT statements
- [ ] All RLS policies use `DROP POLICY IF EXISTS` before `CREATE POLICY`
- [ ] All indexes use `IF NOT EXISTS`
- [ ] Syntax is valid PostgreSQL 14+ with PostGIS 3+

---

## What's Next

1. ✅ **Run Migration 004** in Supabase SQL Editor
2. ✅ **Run Migration 005** in Supabase SQL Editor
3. ✅ **Run Migration 006** in Supabase SQL Editor
4. 🧪 Test the map page to see all field sites
5. 🧪 Test check-in functionality
6. 🚀 Deploy to Vercel/Netlify
7. 📱 Test on iPad

---

## Lessons Learned

1. **Schema First**: Always verify current schema before writing seed data
2. **Array Syntax Matters**: PostgreSQL is strict about array literals
3. **NOT NULL Constraints**: Must provide explicit values for required columns
4. **Idempotent Migrations**: Use `IF NOT EXISTS` and `DROP IF EXISTS` for clean reruns
5. **Automated Tools**: Python/Node scripts save hours for bulk changes
6. **Version Control**: Git commits after each fix provide safety net

---

## Files Changed (Complete List)

### Fixed Files:
- `supabase/migrations/003_add_field_sites_and_achievements_FIXED.sql`
- `supabase/migrations/004_seed_pittsburgh_field_sites.sql` (30 fixes)
- `supabase/migrations/005_add_trout_waters_and_stocking.sql` (array + lat/lng fixes)
- `supabase/migrations/006_statewide_expansion.sql` (1 array fix + quote fix + lat/lng)

### Created Files:
- `supabase/migrations/000_CLEANUP_BEFORE_003.sql`
- `MIGRATION_FIXES_UPDATED.md` (Fix Script documentation)
- `MIGRATION_ORDER.md` (Execution order guide)

### Skipped (For Now):
- `supabase/migrations/012_challenges_system.sql`
- `supabase/migrations/013_class_leaderboards.sql`
- `supabase/migrations/014_species_cards.sql`
- `supabase/migrations/015_photo_challenges.sql`

---

**Last Updated**: Nov 11, 2025
**Status**: Ready for migrations 004, 005, 006 ✅

