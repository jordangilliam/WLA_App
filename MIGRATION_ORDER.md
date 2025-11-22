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

### 10. AI Identification Review Queue
```sql
-- File: supabase/migrations/016_ai_identifications.sql
-- Creates: ai_identifications table for AI results
-- Adds: RLS policies so students see their entries and educators review all
-- Purpose: Store AI provider outputs + teacher approvals
```

### 11. Soundscape Recordings
```sql
-- File: supabase/migrations/017_soundscape_recordings.sql
-- Creates: soundscape_recordings table for audio journal entries
-- Adds: RLS for student submissions + educator oversight
-- Purpose: Capture audio + enable Purdue export workflow
```

### 12. Citizen Science Media Library
```sql
-- File: supabase/migrations/018_citizen_science_media.sql
-- Creates: observation_media table for photo/audio/video assets
-- Links: ai_identifications.media_id to stored assets
-- Purpose: Power citizen science mode with review + AI pipelines
```

### 13. Community Challenge Engine
```sql
-- File: supabase/migrations/019_community_challenges.sql
-- Creates: community_challenges, participants, and event tables
-- Adds: progress trigger for scoreboard updates
-- Purpose: Support shared class/org missions with live progress
```

### 14. Story Missions
```sql
-- File: supabase/migrations/020_story_missions.sql
-- Creates: story_missions, stages, and progress tables
-- Adds: RLS + triggers for mission content + tracking
-- Purpose: Power story-driven learning arcs with stage objectives
```

### 15. Journal Reflections
```sql
-- File: supabase/migrations/021_journal_reflections.sql
-- Adds: reflection_prompts JSONB, mood, tags to user_visits
-- Purpose: Store structured journaling prompts + mood/tags for filtering
```

### 16. Resource Stream
```sql
-- File: supabase/migrations/022_resource_stream.sql
-- Creates: resource_updates table + category enum
-- Purpose: Surface PSU Extension articles, workshops, alerts
```

### 17. Pollinator Planner
```sql
-- File: supabase/migrations/023_pollinator_plans.sql
-- Creates: pollinator_plans table for saved recommendations
-- Purpose: Track pollinator action plans per user
```

### 18. Mission Locations Bridge
```sql
-- File: supabase/migrations/024_mission_locations.sql
-- Creates: mission_locations, mission_location_visits tables
-- Links: missions to field_sites for location-based gameplay
-- Purpose: Enable S.E.C.R.E.T.-style location triggers and QR/AR clues
```

### 19. PA Waterways Expansion
```sql
-- File: supabase/migrations/025_expand_pa_waterways.sql
-- Adds: 33+ waterways across 9 PA regions
-- Types: Rivers, streams, lakes, reservoirs
-- Purpose: Expand waterways knowledge base for fishing and aquatic ecology
```

### 20. PA Safe Spaces Expansion
```sql
-- File: supabase/migrations/026_expand_pa_safe_spaces.sql
-- Adds: 30+ safe spaces across 8 PA regions
-- Types: Libraries, parks, museums, community centers
-- Purpose: Replicate Pittsburgh model across major PA cities
```

### 21. Seasonal Waterway Data & Macroinvertebrate Hatches
```sql
-- File: supabase/migrations/027_seasonal_waterway_data.sql
-- Creates: macroinvertebrate_hatches, waterway_hatches tables
-- Adds: Seasonal fields to water_body_details
-- Seeds: 9 macroinvertebrate hatch species
-- Purpose: Add seasonal considerations and hatch data for fly fishing
```

### 22. Fly Fishing Experts & Shops
```sql
-- File: supabase/migrations/028_fly_fishing_experts.sql
-- Creates: fly_fishing_experts, expert_techniques, expert_patterns, expert_favorite_locations, expert_publications, fly_fishing_shops tables
-- Seeds: Joe Humphreys, George Daniel, 10 fly shops, 7 TU chapters
-- Purpose: Add expert knowledge, techniques, patterns, and shop locations
```

### 23. PFBC Mapping Layers & Comprehensive Fly Shops
```sql
-- File: supabase/migrations/029_pfbc_mapping_layers.sql
-- Creates: pfbc_trout_streams, pfbc_bass_waters, pfbc_other_species_waters tables
-- Seeds: Class A trout streams (10), Wild Trout streams (4), Delayed Harvest (3), Trophy Trout (2), Best Bass Waters (10), Other Species (7)
-- Updates: fly_fishing_shops table with specialties and notes
-- Purpose: Add PFBC trout stream classifications, bass waters, and comprehensive fly shop data
```

### 24. Complete PFBC Data Integration
```sql
-- File: supabase/migrations/030_pfbc_complete_integration.sql
-- Creates: pfbc_stocking_schedules, pfbc_access_points, pfbc_regulations, pfbc_habitat_installations tables
-- Seeds: Stocking schedules (13), Access points (15), Regulations (8), Habitat installations (7)
-- Purpose: Complete PFBC data integration including stocking, access, regulations, and habitat
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
- [ ] 016_ai_identifications.sql
- [ ] 017_soundscape_recordings.sql
- [ ] 018_citizen_science_media.sql
- [ ] 019_community_challenges.sql
- [ ] 020_story_missions.sql
- [ ] 021_journal_reflections.sql
- [ ] 022_resource_stream.sql
- [ ] 023_pollinator_plans.sql
- [ ] 024_mission_locations.sql
- [ ] 025_expand_pa_waterways.sql
- [ ] 026_expand_pa_safe_spaces.sql
- [ ] 027_seasonal_waterway_data.sql
- [ ] 028_fly_fishing_experts.sql
- [ ] 029_pfbc_mapping_layers.sql
- [ ] 030_pfbc_complete_integration.sql

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

