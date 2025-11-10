-- ============================================================================
-- CLEANUP SCRIPT - Run this BEFORE migration 003
-- This removes any old/conflicting tables so we can start fresh
-- ============================================================================

-- Drop tables in reverse dependency order (children first, then parents)
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_visits CASCADE;
DROP TABLE IF EXISTS field_sites CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS nearby_field_sites CASCADE;
DROP FUNCTION IF EXISTS record_visit CASCADE;
DROP FUNCTION IF EXISTS check_achievements CASCADE;
DROP FUNCTION IF EXISTS get_user_stats CASCADE;

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE '✅ Cleanup complete! Old tables and functions dropped. Now run migration 003_FIXED.';
END $$;

