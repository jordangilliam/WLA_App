-- Migration: Add field_sites and achievements tables for FieldQuest integration
-- SIMPLIFIED VERSION - Works without class_enrollments table
-- This enables location-based features and gamification in the main WLA_App

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- FIELD SITES TABLE
-- ============================================================================
-- Stores locations where students can check in (parks, libraries, etc.)

CREATE TABLE IF NOT EXISTS field_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- Lat/Long as geography
  site_type TEXT NOT NULL, -- 'park', 'library', 'university', 'sports', 'landmark', 'greenway', 'state_park'
  address TEXT,
  city TEXT DEFAULT 'Pittsburgh',
  state TEXT DEFAULT 'PA',
  zip_code TEXT,
  
  -- Educational content
  ecological_notes TEXT,
  species_likely TEXT[], -- Common species at this location
  habitat_type TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  -- Activity tracking
  visit_count INTEGER DEFAULT 0,
  last_visited_at TIMESTAMPTZ
);

-- Spatial index for location-based queries
CREATE INDEX idx_field_sites_location ON field_sites USING GIST(location);

-- Index for filtering by type
CREATE INDEX idx_field_sites_type ON field_sites(site_type);

-- Index for city/state searches
CREATE INDEX idx_field_sites_location_text ON field_sites(city, state);

-- ============================================================================
-- USER VISITS TABLE
-- ============================================================================
-- Tracks student check-ins at field sites

CREATE TABLE IF NOT EXISTS user_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_site_id UUID NOT NULL REFERENCES field_sites(id) ON DELETE CASCADE,
  
  -- Visit details
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER, -- How long they stayed
  
  -- Location verification
  check_in_location GEOGRAPHY(POINT, 4326), -- Where they actually were
  distance_from_site FLOAT, -- Meters from site center
  
  -- Educational engagement
  notes TEXT,
  photos TEXT[], -- Array of photo URLs
  species_observed TEXT[],
  
  -- Gamification
  points_earned INTEGER DEFAULT 10,
  achievement_unlocked BOOLEAN DEFAULT FALSE,
  
  UNIQUE(user_id, field_site_id, visited_at)
);

-- Indexes for queries
CREATE INDEX idx_user_visits_user ON user_visits(user_id);
CREATE INDEX idx_user_visits_site ON user_visits(field_site_id);
CREATE INDEX idx_user_visits_date ON user_visits(visited_at DESC);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- ============================================================================
-- Defines available achievements for gamification

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Achievement details
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT, -- Icon identifier or emoji
  
  -- Categorization
  category TEXT NOT NULL, -- 'exploration', 'knowledge', 'conservation', 'social', 'mastery'
  difficulty TEXT DEFAULT 'common', -- 'common', 'uncommon', 'rare', 'epic', 'legendary'
  
  -- Rewards
  points INTEGER DEFAULT 100,
  badge_color TEXT DEFAULT 'blue',
  
  -- Requirements (stored as JSON for flexibility)
  requirements JSONB, -- e.g., {"visits": 10, "site_types": ["park", "library"]}
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Index for category filtering
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_active ON achievements(is_active);

-- ============================================================================
-- USER ACHIEVEMENTS TABLE
-- ============================================================================
-- Tracks which achievements each user has earned

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  
  -- When earned
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Progress tracking (for incremental achievements)
  progress INTEGER DEFAULT 100, -- Percentage complete
  progress_data JSONB, -- Detailed progress info
  
  -- Metadata
  notified BOOLEAN DEFAULT FALSE, -- Has user been notified?
  
  PRIMARY KEY (user_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned ON user_achievements(earned_at DESC);

-- ============================================================================
-- USER STATS TABLE (ENHANCED)
-- ============================================================================
-- Add gamification stats to user profile

DO $$ 
BEGIN
  -- Add columns to users table if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='total_points') THEN
    ALTER TABLE users ADD COLUMN total_points INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='level') THEN
    ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='xp') THEN
    ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='sites_visited') THEN
    ALTER TABLE users ADD COLUMN sites_visited INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='achievements_earned') THEN
    ALTER TABLE users ADD COLUMN achievements_earned INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE field_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Field Sites: Everyone can view, only admins can modify
CREATE POLICY "Public can view field sites"
  ON field_sites FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can insert field sites"
  ON field_sites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update field sites"
  ON field_sites FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- User Visits: Users can view and manage their own visits
CREATE POLICY "Users can view own visits"
  ON user_visits FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own visits"
  ON user_visits FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own visits"
  ON user_visits FOR UPDATE
  USING (user_id = auth.uid());

-- Achievements: Everyone can view
CREATE POLICY "Public can view achievements"
  ON achievements FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage achievements"
  ON achievements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- User Achievements: Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can award achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function: Find nearby field sites
CREATE OR REPLACE FUNCTION nearby_field_sites(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_meters FLOAT DEFAULT 5000,
  site_type_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  site_type TEXT,
  address TEXT,
  distance_meters FLOAT,
  visit_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.id,
    fs.name,
    fs.description,
    fs.site_type,
    fs.address,
    ST_Distance(
      fs.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) AS distance_meters,
    fs.visit_count
  FROM field_sites fs
  WHERE 
    ST_DWithin(
      fs.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_meters
    )
    AND (site_type_filter IS NULL OR fs.site_type = site_type_filter)
  ORDER BY distance_meters ASC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Record a visit and update stats
CREATE OR REPLACE FUNCTION record_visit(
  p_user_id UUID,
  p_field_site_id UUID,
  p_check_in_lat FLOAT,
  p_check_in_lng FLOAT,
  p_notes TEXT DEFAULT NULL,
  p_photos TEXT[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_visit_id UUID;
  v_distance FLOAT;
  v_points INTEGER := 10;
BEGIN
  -- Calculate distance from site
  SELECT ST_Distance(
    location,
    ST_SetSRID(ST_MakePoint(p_check_in_lng, p_check_in_lat), 4326)::geography
  ) INTO v_distance
  FROM field_sites
  WHERE id = p_field_site_id;
  
  -- Validate distance (must be within 100m)
  IF v_distance > 100 THEN
    RAISE EXCEPTION 'Check-in location too far from field site (%.0fm)', v_distance;
  END IF;
  
  -- Award bonus points for first visit
  IF NOT EXISTS (
    SELECT 1 FROM user_visits 
    WHERE user_id = p_user_id AND field_site_id = p_field_site_id
  ) THEN
    v_points := v_points + 15; -- First visit bonus
  END IF;
  
  -- Insert visit record
  INSERT INTO user_visits (
    user_id,
    field_site_id,
    check_in_location,
    distance_from_site,
    notes,
    photos,
    points_earned
  ) VALUES (
    p_user_id,
    p_field_site_id,
    ST_SetSRID(ST_MakePoint(p_check_in_lng, p_check_in_lat), 4326)::geography,
    v_distance,
    p_notes,
    p_photos,
    v_points
  )
  RETURNING id INTO v_visit_id;
  
  -- Update user stats
  UPDATE users
  SET 
    total_points = total_points + v_points,
    xp = xp + v_points,
    sites_visited = sites_visited + 1
  WHERE id = p_user_id;
  
  -- Update field site stats
  UPDATE field_sites
  SET 
    visit_count = visit_count + 1,
    last_visited_at = NOW()
  WHERE id = p_field_site_id;
  
  RETURN v_visit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_achievements_awarded INTEGER := 0;
  v_sites_visited INTEGER;
  v_unique_site_types INTEGER;
BEGIN
  -- Get user stats
  SELECT sites_visited INTO v_sites_visited
  FROM users WHERE id = p_user_id;
  
  -- Count unique site types visited
  SELECT COUNT(DISTINCT fs.site_type) INTO v_unique_site_types
  FROM user_visits uv
  JOIN field_sites fs ON uv.field_site_id = fs.id
  WHERE uv.user_id = p_user_id;
  
  -- Award "First Steps" achievement (1 site)
  IF v_sites_visited >= 1 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, id FROM achievements
    WHERE title = 'First Steps'
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    
    IF FOUND THEN
      v_achievements_awarded := v_achievements_awarded + 1;
    END IF;
  END IF;
  
  -- Award "Explorer" achievement (10 sites)
  IF v_sites_visited >= 10 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, id FROM achievements
    WHERE title = 'Explorer'
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    
    IF FOUND THEN
      v_achievements_awarded := v_achievements_awarded + 1;
    END IF;
  END IF;
  
  -- Award "Master Explorer" achievement (50 sites)
  IF v_sites_visited >= 50 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, id FROM achievements
    WHERE title = 'Master Explorer'
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    
    IF FOUND THEN
      v_achievements_awarded := v_achievements_awarded + 1;
    END IF;
  END IF;
  
  -- Award "Diverse Adventurer" achievement (all site types)
  IF v_unique_site_types >= 7 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, id FROM achievements
    WHERE title = 'Diverse Adventurer'
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    
    IF FOUND THEN
      v_achievements_awarded := v_achievements_awarded + 1;
    END IF;
  END IF;
  
  -- Update user achievement count
  IF v_achievements_awarded > 0 THEN
    UPDATE users
    SET achievements_earned = achievements_earned + v_achievements_awarded
    WHERE id = p_user_id;
  END IF;
  
  RETURN v_achievements_awarded;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user stats summary
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
  total_points INTEGER,
  level INTEGER,
  xp INTEGER,
  sites_visited INTEGER,
  achievements_earned INTEGER,
  unique_site_types INTEGER,
  favorite_site_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.total_points,
    u.level,
    u.xp,
    u.sites_visited,
    u.achievements_earned,
    COUNT(DISTINCT fs.site_type)::INTEGER AS unique_site_types,
    MODE() WITHIN GROUP (ORDER BY fs.site_type) AS favorite_site_type
  FROM users u
  LEFT JOIN user_visits uv ON uv.user_id = u.id
  LEFT JOIN field_sites fs ON uv.field_site_id = fs.id
  WHERE u.id = p_user_id
  GROUP BY u.id, u.total_points, u.level, u.xp, u.sites_visited, u.achievements_earned;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL ACHIEVEMENTS DATA
-- ============================================================================

INSERT INTO achievements (title, description, category, difficulty, points, icon) VALUES
  ('First Steps', 'Visit your first field site', 'exploration', 'common', 50, '🌱'),
  ('Explorer', 'Visit 10 different field sites', 'exploration', 'uncommon', 150, '🗺️'),
  ('Master Explorer', 'Visit 50 different field sites', 'exploration', 'rare', 500, '🏆'),
  ('Diverse Adventurer', 'Visit all 7 types of field sites', 'exploration', 'epic', 300, '🌈'),
  ('Park Ranger', 'Visit 10 parks', 'exploration', 'uncommon', 100, '🌲'),
  ('Library Scholar', 'Visit 5 libraries', 'knowledge', 'common', 75, '📚'),
  ('Campus Explorer', 'Visit all Pittsburgh universities', 'exploration', 'rare', 250, '🎓'),
  ('Weekend Warrior', 'Complete 3 visits in one weekend', 'dedication', 'uncommon', 100, '⚡'),
  ('Early Bird', 'Check in before 8 AM', 'dedication', 'common', 50, '🌅'),
  ('Night Owl', 'Check in after 8 PM', 'dedication', 'common', 50, '🌙')
ON CONFLICT (title) DO NOTHING;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update field_sites updated_at timestamp
CREATE OR REPLACE FUNCTION update_field_sites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_field_sites_timestamp
  BEFORE UPDATE ON field_sites
  FOR EACH ROW
  EXECUTE FUNCTION update_field_sites_updated_at();

-- Trigger: Auto-check achievements after visit
CREATE OR REPLACE FUNCTION trigger_check_achievements()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_achievements(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_award_achievements_on_visit
  AFTER INSERT ON user_visits
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_achievements();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE field_sites IS 'Physical locations where students can check in (parks, libraries, etc.)';
COMMENT ON TABLE user_visits IS 'Records of student check-ins at field sites';
COMMENT ON TABLE achievements IS 'Available achievements for gamification';
COMMENT ON TABLE user_achievements IS 'Achievements earned by each user';

COMMENT ON FUNCTION nearby_field_sites IS 'Find field sites within radius of user location';
COMMENT ON FUNCTION record_visit IS 'Record a visit and update all related stats';
COMMENT ON FUNCTION check_achievements IS 'Check if user qualifies for new achievements';
COMMENT ON FUNCTION get_user_stats IS 'Get comprehensive user statistics';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION nearby_field_sites TO authenticated;
GRANT EXECUTE ON FUNCTION record_visit TO authenticated;
GRANT EXECUTE ON FUNCTION check_achievements TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log completion
DO $$ 
BEGIN
  RAISE NOTICE 'Migration 003 complete: field_sites and achievements tables created';
  RAISE NOTICE 'Features enabled: Location-based check-ins, Gamification, Achievement system';
  RAISE NOTICE 'Functions created: nearby_field_sites, record_visit, check_achievements, get_user_stats';
END $$;

