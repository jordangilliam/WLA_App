-- Fixed version - adds IF NOT EXISTS checks

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Field Sites Table
CREATE TABLE IF NOT EXISTS field_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  site_type VARCHAR(100),
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2) DEFAULT 'PA',
  zip_code VARCHAR(10),
  accessibility_notes TEXT,
  best_times_to_visit TEXT,
  parking_info TEXT,
  safety_notes TEXT,
  ecological_notes TEXT,
  species_commonly_found TEXT[],
  habitat_types TEXT[],
  educational_value TEXT,
  difficulty_level VARCHAR(20),
  estimated_visit_duration VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial index with IF NOT EXISTS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_field_sites_location') THEN
    CREATE INDEX idx_field_sites_location ON field_sites USING GIST (location);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_field_sites_city ON field_sites(city);
CREATE INDEX IF NOT EXISTS idx_field_sites_type ON field_sites(site_type);

-- User Visits Table
CREATE TABLE IF NOT EXISTS user_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES field_sites(id) ON DELETE CASCADE,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  photo_url TEXT,
  weather_conditions TEXT,
  temperature INT,
  species_observed TEXT[],
  UNIQUE(user_id, site_id, visited_at)
);

CREATE INDEX IF NOT EXISTS idx_user_visits_user ON user_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_visits_site ON user_visits(site_id);
CREATE INDEX IF NOT EXISTS idx_user_visits_date ON user_visits(visited_at);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type VARCHAR(50),
  requirement_count INT,
  points_reward INT DEFAULT 0,
  rarity VARCHAR(20) DEFAULT 'common',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- Functions
CREATE OR REPLACE FUNCTION nearby_field_sites(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_meters INT DEFAULT 5000,
  limit_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  site_type VARCHAR,
  latitude FLOAT,
  longitude FLOAT,
  city VARCHAR,
  distance_meters FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.id,
    fs.name,
    fs.description,
    fs.site_type,
    fs.latitude,
    fs.longitude,
    fs.city,
    ST_Distance(
      fs.location::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) as distance_meters
  FROM field_sites fs
  WHERE ST_DWithin(
    fs.location::geography,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance_meters
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION record_visit(
  p_user_id UUID,
  p_site_id UUID,
  p_notes TEXT DEFAULT NULL,
  p_weather TEXT DEFAULT NULL,
  p_temperature INT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_visit_id UUID;
BEGIN
  INSERT INTO user_visits (user_id, site_id, notes, weather_conditions, temperature)
  VALUES (p_user_id, p_site_id, p_notes, p_weather, p_temperature)
  RETURNING id INTO v_visit_id;
  
  RETURN v_visit_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Check for first visit achievement
  INSERT INTO user_achievements (user_id, achievement_id)
  SELECT p_user_id, a.id
  FROM achievements a
  WHERE a.name = 'First Visit' 
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = a.id
    )
    AND EXISTS (
      SELECT 1 FROM user_visits WHERE user_id = p_user_id LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
BEGIN
  SELECT json_build_object(
    'total_visits', COUNT(DISTINCT uv.id),
    'unique_sites', COUNT(DISTINCT uv.site_id),
    'achievements', COUNT(DISTINCT ua.id),
    'total_points', COALESCE(SUM(a.points_reward), 0)
  )
  INTO v_stats
  FROM users u
  LEFT JOIN user_visits uv ON uv.user_id = u.id
  LEFT JOIN user_achievements ua ON ua.user_id = u.id
  LEFT JOIN achievements a ON a.id = ua.achievement_id
  WHERE u.id = p_user_id
  GROUP BY u.id;
  
  RETURN COALESCE(v_stats, '{"total_visits":0,"unique_sites":0,"achievements":0,"total_points":0}'::json);
END;
$$ LANGUAGE plpgsql;

-- Seed Achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_count, points_reward, rarity) VALUES
('First Visit', 'Complete your first field site visit', '🎉', 'visits', 1, 50, 'common'),
('Explorer', 'Visit 10 different field sites', '🗺️', 'unique_sites', 10, 200, 'uncommon'),
('Adventurer', 'Visit 25 different field sites', '🏔️', 'unique_sites', 25, 500, 'rare'),
('Master Explorer', 'Visit 50 different field sites', '🏆', 'unique_sites', 50, 1000, 'epic'),
('Nature Photographer', 'Take 25 field photos', '📸', 'photos', 25, 300, 'uncommon'),
('Species Spotter', 'Observe 50 different species', '🔍', 'species', 50, 400, 'rare')
ON CONFLICT DO NOTHING;

-- Row Level Security
ALTER TABLE field_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Field sites are viewable by everyone" ON field_sites;
CREATE POLICY "Field sites are viewable by everyone"
  ON field_sites FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view their own visits" ON user_visits;
CREATE POLICY "Users can view their own visits"
  ON user_visits FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own visits" ON user_visits;
CREATE POLICY "Users can insert their own visits"
  ON user_visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE field_sites IS 'Field sites for check-ins and observations';
COMMENT ON TABLE user_visits IS 'Records of user visits to field sites';

