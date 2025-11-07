-- ============================================================================
-- Supabase RPC Functions for FieldQuest
-- ============================================================================

-- ============================================================================
-- Get nearby field sites
-- ============================================================================

CREATE OR REPLACE FUNCTION nearby_field_sites(
  user_lat FLOAT, 
  user_lng FLOAT, 
  radius_meters INT DEFAULT 300
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  site_type VARCHAR,
  latitude FLOAT,
  longitude FLOAT,
  geofence_radius INT,
  distance_meters FLOAT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.id,
    fs.name,
    fs.description,
    fs.site_type,
    fs.latitude::FLOAT,
    fs.longitude::FLOAT,
    fs.geofence_radius,
    ST_Distance(
      fs.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    )::FLOAT as distance_meters
  FROM field_sites fs
  WHERE ST_DWithin(
    fs.location,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_meters
  )
  AND fs.is_active = true
  ORDER BY distance_meters ASC;
END;
$$;

-- ============================================================================
-- Get nearby active spawns
-- ============================================================================

CREATE OR REPLACE FUNCTION nearby_spawns(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_meters INT DEFAULT 300
)
RETURNS TABLE (
  id UUID,
  species_id UUID,
  species_name VARCHAR,
  species_type species_type,
  rarity species_rarity,
  latitude FLOAT,
  longitude FLOAT,
  despawn_time TIMESTAMPTZ,
  encounter_difficulty INT,
  distance_meters FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    asp.id,
    asp.species_id,
    sp.name as species_name,
    sp.species_type,
    sp.rarity,
    asp.latitude::FLOAT,
    asp.longitude::FLOAT,
    asp.despawn_time,
    asp.encounter_difficulty,
    ST_Distance(
      asp.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    )::FLOAT as distance_meters
  FROM active_spawns asp
  JOIN species sp ON sp.id = asp.species_id
  WHERE ST_DWithin(
    asp.location,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_meters
  )
  AND asp.is_caught = false
  AND asp.despawn_time > NOW()
  ORDER BY distance_meters ASC;
END;
$$;

-- ============================================================================
-- Add XP to user and handle leveling
-- ============================================================================

CREATE OR REPLACE FUNCTION add_user_xp(
  p_user_id INT,
  p_xp INT
)
RETURNS TABLE (
  new_xp INT,
  new_level INT,
  leveled_up BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_xp INT;
  v_current_level INT;
  v_new_xp INT;
  v_new_level INT;
  v_leveled_up BOOLEAN := false;
BEGIN
  -- Get current stats
  SELECT total_xp, level INTO v_current_xp, v_current_level
  FROM users WHERE id = p_user_id;
  
  -- Add XP
  v_new_xp := v_current_xp + p_xp;
  
  -- Calculate new level (100 XP per level, exponential)
  v_new_level := FLOOR(SQRT(v_new_xp / 100)) + 1;
  
  -- Check if leveled up
  IF v_new_level > v_current_level THEN
    v_leveled_up := true;
  END IF;
  
  -- Update user
  UPDATE users 
  SET 
    total_xp = v_new_xp,
    level = v_new_level,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN QUERY SELECT v_new_xp, v_new_level, v_leveled_up;
END;
$$;

-- ============================================================================
-- Check if user is within geofence
-- ============================================================================

CREATE OR REPLACE FUNCTION is_within_geofence(
  user_lat FLOAT,
  user_lng FLOAT,
  target_id UUID,
  target_type VARCHAR -- 'field_site' or 'spawn'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_distance FLOAT;
  v_radius INT;
BEGIN
  IF target_type = 'field_site' THEN
    SELECT 
      ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      ),
      geofence_radius
    INTO v_distance, v_radius
    FROM field_sites
    WHERE id = target_id;
    
  ELSIF target_type = 'spawn' THEN
    -- Spawns have fixed 50m interaction radius
    SELECT 
      ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      )
    INTO v_distance
    FROM active_spawns
    WHERE id = target_id;
    
    v_radius := 50;
  ELSE
    RETURN false;
  END IF;
  
  RETURN v_distance <= v_radius;
END;
$$;

-- ============================================================================
-- Generate spawns for active events
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_spawns()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event RECORD;
  v_site RECORD;
  v_spawn_count INT := 0;
  v_spawn_location GEOGRAPHY(POINT, 4326);
  v_offset_lat FLOAT;
  v_offset_lng FLOAT;
BEGIN
  -- Loop through active events
  FOR v_event IN 
    SELECT * FROM spawn_events 
    WHERE is_active = true 
    AND NOW() BETWEEN start_time AND end_time
    AND current_spawns < max_spawns
  LOOP
    -- Get field site
    SELECT * INTO v_site FROM field_sites WHERE id = v_event.field_site_id;
    
    -- Calculate how many spawns to create (based on spawn_rate)
    -- For simplicity, create 1 spawn per hour if rate >= 1.0
    IF v_event.spawn_rate >= 1.0 AND RANDOM() < 0.1 THEN -- 10% chance per call
      -- Generate random offset within geofence
      v_offset_lat := (RANDOM() - 0.5) * 0.0009 * v_site.geofence_radius / 50;
      v_offset_lng := (RANDOM() - 0.5) * 0.0009 * v_site.geofence_radius / 50;
      
      v_spawn_location := ST_SetSRID(
        ST_MakePoint(
          v_site.longitude + v_offset_lng,
          v_site.latitude + v_offset_lat
        ), 
        4326
      )::geography;
      
      -- Create spawn
      INSERT INTO active_spawns (
        spawn_event_id,
        species_id,
        location,
        spawn_time,
        despawn_time,
        encounter_difficulty
      ) VALUES (
        v_event.id,
        v_event.species_id,
        v_spawn_location,
        NOW(),
        NOW() + INTERVAL '30 minutes',
        FLOOR(RANDOM() * 3 + 1)::INT -- 1-3 difficulty
      );
      
      -- Update event counter
      UPDATE spawn_events 
      SET current_spawns = current_spawns + 1 
      WHERE id = v_event.id;
      
      v_spawn_count := v_spawn_count + 1;
    END IF;
  END LOOP;
  
  RETURN v_spawn_count;
END;
$$;

-- ============================================================================
-- Cleanup expired spawns
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_spawns()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INT;
BEGIN
  DELETE FROM active_spawns 
  WHERE despawn_time < NOW() 
  AND is_caught = false;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  RETURN v_deleted_count;
END;
$$;

-- ============================================================================
-- Get user collection progress
-- ============================================================================

CREATE OR REPLACE FUNCTION user_collection_stats(p_user_id INT)
RETURNS TABLE (
  total_species INT,
  caught_species INT,
  completion_rate FLOAT,
  common_caught INT,
  uncommon_caught INT,
  rare_caught INT,
  epic_caught INT,
  legendary_caught INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH totals AS (
    SELECT COUNT(DISTINCT id) as total FROM species WHERE is_active = true
  ),
  caught AS (
    SELECT 
      COUNT(DISTINCT us.species_id) as caught,
      COUNT(DISTINCT us.species_id) FILTER (WHERE sp.rarity = 'common') as common,
      COUNT(DISTINCT us.species_id) FILTER (WHERE sp.rarity = 'uncommon') as uncommon,
      COUNT(DISTINCT us.species_id) FILTER (WHERE sp.rarity = 'rare') as rare,
      COUNT(DISTINCT us.species_id) FILTER (WHERE sp.rarity = 'epic') as epic,
      COUNT(DISTINCT us.species_id) FILTER (WHERE sp.rarity = 'legendary') as legendary
    FROM user_species us
    JOIN species sp ON sp.id = us.species_id
    WHERE us.user_id = p_user_id
    AND us.is_first_catch = true
  )
  SELECT 
    t.total::INT,
    c.caught::INT,
    (c.caught::FLOAT / NULLIF(t.total, 0))::FLOAT as completion_rate,
    c.common::INT,
    c.uncommon::INT,
    c.rare::INT,
    c.epic::INT,
    c.legendary::INT
  FROM totals t, caught c;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION nearby_field_sites TO authenticated;
GRANT EXECUTE ON FUNCTION nearby_spawns TO authenticated;
GRANT EXECUTE ON FUNCTION add_user_xp TO authenticated;
GRANT EXECUTE ON FUNCTION is_within_geofence TO authenticated;
GRANT EXECUTE ON FUNCTION user_collection_stats TO authenticated;
GRANT EXECUTE ON FUNCTION generate_spawns TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_spawns TO service_role;

