# Database Migration Execution Order

Run these SQL files **in this exact order** in Supabase SQL Editor.

## ✅ **Core Migrations (If Not Already Run)**

### 1. Organizations & Base Schema
- `supabase/migrations/001_add_organizations.sql`
- `supabase/migrations/lib/db/STEP1-base-tables.sql` (if you have it)

---

## 🆕 **NEW MIGRATIONS - Run These Now**

### 2. Field Sites System
```sql
-- File: supabase/migrations/003_add_field_sites_and_achievements.sql
-- Creates: field_sites, user_visits, achievements, user_achievements
-- Includes: PostGIS, RLS policies, database functions
```

### 3. Pittsburgh Field Sites
```sql
-- File: supabase/migrations/004_seed_pittsburgh_field_sites.sql
-- Adds: 64+ Pittsburgh field sites
-- Types: Libraries, parks, universities, trails, state parks
```

### 4. Trout Waters & Stocking
```sql
-- File: supabase/migrations/005_add_trout_waters_and_stocking.sql
-- Creates: stocking_schedules, water_body_details, catch_reports
-- Adds: 16 trout fishing locations across PA
```

### 5. Statewide Expansion
```sql
-- File: supabase/migrations/006_statewide_expansion.sql
-- Adds: 50+ sites in State College, Harrisburg, Philadelphia, Coatesville, East Stroudsburg
-- Total: 140+ field sites across PA
```

### 6. Challenges System
```sql
-- File: supabase/migrations/012_challenges_system.sql
-- Creates: challenges, user_challenge_progress
-- RPC functions: get_active_challenges, update_challenge_progress, claim_challenge_rewards
-- Seeds: 6 sample challenges (3 daily, 3 weekly)
```

### 7. Class Leaderboards
```sql
-- File: supabase/migrations/013_class_leaderboards.sql
-- Creates: class_team_stats, student_leaderboard
-- RPC functions: get_class_leaderboard, get_student_leaderboard_by_class, update_class_leaderboard
-- Purpose: Weekly class rankings and competition
```

### 8. Species Collection Cards
```sql
-- File: supabase/migrations/014_species_cards.sql
-- Creates: species_cards, user_species_collection
-- RPC functions: get_user_species_collection, discover_species, get_collection_stats
-- Seeds: 13 PA species (birds, mammals, fish, insects)
-- Purpose: Pokemon-style trading card collection
```

### 9. Photo Challenges
```sql
-- File: supabase/migrations/015_photo_challenges.sql
-- Creates: photo_challenges, photo_submissions
-- RPC functions: get_photo_challenges_with_progress, get_pending_photo_submissions, review_photo_submission
-- Seeds: 3 photo challenges (Nature Scavenger Hunt, Tree Detective, Wildlife Photographer)
-- Purpose: Scavenger hunt with teacher approval workflow
```

---

## 📊 **Verification Queries**

After running all migrations, verify with these queries:

### Check Table Counts
```sql
-- Should return data for each table
SELECT 
  'field_sites' as table_name, COUNT(*) as count FROM field_sites
UNION ALL
SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'challenges', COUNT(*) FROM challenges
UNION ALL
SELECT 'species_cards', COUNT(*) FROM species_cards
UNION ALL
SELECT 'photo_challenges', COUNT(*) FROM photo_challenges;
```

**Expected Results:**
- field_sites: ~140
- achievements: ~10-15
- challenges: 6
- species_cards: 13
- photo_challenges: 3

### Check Functions Exist
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

**Expected Functions:**
- `check_achievements`
- `claim_challenge_rewards`
- `discover_species`
- `get_active_challenges`
- `get_class_leaderboard`
- `get_collection_stats`
- `get_photo_challenges_with_progress`
- `get_user_species_collection`
- `get_user_stats`
- `nearby_field_sites`
- `record_visit`
- `review_photo_submission`
- `update_challenge_progress`
- `update_class_leaderboard`

### Check RLS Policies
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Should see policies for all new tables.

---

## ⚠️ **Common Issues & Solutions**

### Issue: "relation does not exist"
**Solution:** Migrations must be run in order. Missing a prior migration.

### Issue: "class_enrollments does not exist"
**Solution:** This was fixed in migration 003. Re-run the fixed version.

### Issue: "PostGIS extension not available"
**Solution:** Enable PostGIS in Supabase Dashboard → Database → Extensions

### Issue: Type or enum already exists
**Solution:** Migration was already run. Can be ignored or drop the type first:
```sql
DROP TYPE IF EXISTS challenge_type CASCADE;
```

### Issue: Permission denied
**Solution:** Run migrations with service role key, not anon key.

---

## 🔄 **Migration Rollback (If Needed)**

If you need to undo a migration:

```sql
-- Example: Rollback species cards
DROP TABLE IF EXISTS user_species_collection CASCADE;
DROP TABLE IF EXISTS species_cards CASCADE;
DROP TYPE IF EXISTS species_category CASCADE;
DROP TYPE IF EXISTS card_rarity CASCADE;
DROP FUNCTION IF EXISTS get_user_species_collection CASCADE;
DROP FUNCTION IF EXISTS discover_species CASCADE;
DROP FUNCTION IF EXISTS get_collection_stats CASCADE;
```

---

## 📝 **Migration Status Tracking**

Keep track of what you've run:

- [ ] 003_add_field_sites_and_achievements.sql
- [ ] 004_seed_pittsburgh_field_sites.sql  
- [ ] 005_add_trout_waters_and_stocking.sql
- [ ] 006_statewide_expansion.sql
- [ ] 012_challenges_system.sql
- [ ] 013_class_leaderboards.sql
- [ ] 014_species_cards.sql
- [ ] 015_photo_challenges.sql

---

## ✅ **All Migrations Complete?**

Run this final verification:

```sql
-- Get all data counts
SELECT 
  (SELECT COUNT(*) FROM field_sites) as field_sites,
  (SELECT COUNT(*) FROM achievements) as achievements,
  (SELECT COUNT(*) FROM challenges) as challenges,
  (SELECT COUNT(*) FROM species_cards) as species_cards,
  (SELECT COUNT(*) FROM photo_challenges) as photo_challenges,
  (SELECT COUNT(*) FROM stocking_schedules) as stocking_schedules;
```

If all counts are > 0, you're ready to deploy! 🚀

