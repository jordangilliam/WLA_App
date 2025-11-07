-- Helper RPC function to increment user XP
-- This is called by edge functions to safely update user XP

CREATE OR REPLACE FUNCTION increment_user_xp(
  user_id UUID,
  xp_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET 
    xp = COALESCE(xp, 0) + xp_amount,
    -- Level up logic: simple formula, every 100 XP = 1 level
    level = FLOOR((COALESCE(xp, 0) + xp_amount) / 100.0) + 1
  WHERE id = user_id;
END;
$$;

-- Helper RPC function to check if user can interact with a field site
-- Returns true if user is within geofence and cooldown has passed

CREATE OR REPLACE FUNCTION can_interact_with_site(
  p_user_id UUID,
  p_field_site_id UUID,
  p_cooldown_hours INTEGER DEFAULT 4
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_interaction TIMESTAMP;
  cooldown_time TIMESTAMP;
BEGIN
  -- Get last interaction time from audit log
  SELECT created_at INTO last_interaction
  FROM audit_log
  WHERE user_id = p_user_id
    AND event_type = 'poi_interacted'
    AND details->>'field_site_id' = p_field_site_id::TEXT
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no previous interaction, allow
  IF last_interaction IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Calculate cooldown time
  cooldown_time := last_interaction + (p_cooldown_hours || ' hours')::INTERVAL;

  -- Return true if cooldown has passed
  RETURN NOW() >= cooldown_time;
END;
$$;

-- Helper RPC function to get user's collection progress
-- Returns count and percentage of species collected

CREATE OR REPLACE FUNCTION get_collection_progress(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_species INTEGER;
  collected_species INTEGER;
  result JSON;
BEGIN
  -- Get total number of species
  SELECT COUNT(*) INTO total_species FROM species;

  -- Get number of species user has collected
  SELECT COUNT(DISTINCT species_id) INTO collected_species
  FROM user_species
  WHERE user_id = p_user_id;

  -- Build result JSON
  result := json_build_object(
    'total_species', total_species,
    'collected_species', collected_species,
    'percentage', ROUND((collected_species::NUMERIC / NULLIF(total_species, 0)) * 100, 2)
  );

  RETURN result;
END;
$$;

-- Helper RPC function to get user's recent activity
-- Returns last 20 encounters and interactions

CREATE OR REPLACE FUNCTION get_user_activity(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(activity_row)
  INTO result
  FROM (
    SELECT
      'encounter' as type,
      e.id,
      e.started_at as timestamp,
      e.outcome,
      e.xp_gained,
      s.common_name as species_name,
      s.rarity
    FROM encounters e
    JOIN species s ON e.species_id = s.id
    WHERE e.user_id = p_user_id
    ORDER BY e.started_at DESC
    LIMIT p_limit
  ) activity_row;

  RETURN COALESCE(result, '[]'::JSON);
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_user_xp TO authenticated;
GRANT EXECUTE ON FUNCTION can_interact_with_site TO authenticated;
GRANT EXECUTE ON FUNCTION get_collection_progress TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_activity TO authenticated;

-- Migration complete
-- Created helper RPC functions for:
-- - increment_user_xp: Safe XP updates with level calculation
-- - can_interact_with_site: Cooldown checking
-- - get_collection_progress: Collection stats
-- - get_user_activity: Recent activity feed

