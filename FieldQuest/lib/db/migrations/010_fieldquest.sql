-- ============================================================================
-- FieldQuest Game Database Schema
-- Extension to existing WLA_App database
-- ============================================================================

-- Enable PostGIS for geographic data (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Species (PA Wildlife)
-- ============================================================================

CREATE TYPE species_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE species_type AS ENUM ('fish', 'bird', 'mammal', 'amphibian', 'reptile', 'insect', 'plant');

CREATE TABLE species (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(100),
  species_type species_type NOT NULL,
  rarity species_rarity DEFAULT 'common',
  habitat_types TEXT[] DEFAULT '{}',
  description TEXT,
  conservation_status VARCHAR(50),
  educational_facts JSONB,
  image_url TEXT,
  model_3d_url TEXT,
  catch_difficulty INTEGER DEFAULT 1 CHECK (catch_difficulty BETWEEN 1 AND 5),
  base_xp INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_species_type ON species(species_type);
CREATE INDEX idx_species_rarity ON species(rarity);

-- ============================================================================
-- Field Sites (POIs created by teachers/WLA)
-- ============================================================================

CREATE TABLE field_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  site_type VARCHAR(50), -- stream, trail, park, forest, lake, wetland
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude DECIMAL(10, 8) GENERATED ALWAYS AS (ST_Y(location::geometry)) STORED,
  longitude DECIMAL(11, 8) GENERATED ALWAYS AS (ST_X(location::geometry)) STORED,
  geofence_radius INTEGER DEFAULT 50, -- meters
  organization_id INTEGER REFERENCES organizations(id),
  created_by INTEGER REFERENCES users(id),
  loot_table_id UUID,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_field_sites_location ON field_sites USING GIST(location);
CREATE INDEX idx_field_sites_org ON field_sites(organization_id);
CREATE INDEX idx_field_sites_active ON field_sites(is_active) WHERE is_active = true;

-- ============================================================================
-- Spawn Events (Teacher-created or system)
-- ============================================================================

CREATE TYPE spawn_event_type AS ENUM ('teacher_event', 'system_spawn', 'special_event');

CREATE TABLE spawn_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID REFERENCES field_sites(id) ON DELETE CASCADE,
  species_id UUID REFERENCES species(id),
  event_type spawn_event_type DEFAULT 'system_spawn',
  event_name VARCHAR(255),
  created_by INTEGER REFERENCES users(id),
  class_id INTEGER REFERENCES classes(id), -- NULL = visible to all
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  spawn_rate DECIMAL DEFAULT 1.0, -- spawns per hour
  max_spawns INTEGER DEFAULT 10,
  current_spawns INTEGER DEFAULT 0,
  difficulty_modifier DECIMAL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_spawn_events_site ON spawn_events(field_site_id);
CREATE INDEX idx_spawn_events_active ON spawn_events(is_active, start_time, end_time) 
  WHERE is_active = true;
CREATE INDEX idx_spawn_events_class ON spawn_events(class_id) WHERE class_id IS NOT NULL;

-- ============================================================================
-- Active Spawns (live creatures on map)
-- ============================================================================

CREATE TABLE active_spawns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spawn_event_id UUID REFERENCES spawn_events(id) ON DELETE CASCADE,
  species_id UUID REFERENCES species(id),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude DECIMAL(10, 8) GENERATED ALWAYS AS (ST_Y(location::geometry)) STORED,
  longitude DECIMAL(11, 8) GENERATED ALWAYS AS (ST_X(location::geometry)) STORED,
  spawn_time TIMESTAMPTZ DEFAULT NOW(),
  despawn_time TIMESTAMPTZ NOT NULL,
  encounter_difficulty INTEGER DEFAULT 1 CHECK (encounter_difficulty BETWEEN 1 AND 5),
  is_caught BOOLEAN DEFAULT false,
  caught_by INTEGER REFERENCES users(id),
  caught_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_active_spawns_location ON active_spawns USING GIST(location);
CREATE INDEX idx_active_spawns_active ON active_spawns(despawn_time, is_caught) 
  WHERE is_caught = false;
CREATE INDEX idx_active_spawns_species ON active_spawns(species_id);

-- ============================================================================
-- User Species Collection
-- ============================================================================

CREATE TABLE user_species (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  species_id UUID REFERENCES species(id),
  spawn_id UUID REFERENCES active_spawns(id),
  caught_at TIMESTAMPTZ DEFAULT NOW(),
  catch_location GEOGRAPHY(POINT, 4326),
  field_site_id UUID REFERENCES field_sites(id),
  catch_metadata JSONB DEFAULT '{}', -- weather, time_of_day, throw_quality
  is_first_catch BOOLEAN DEFAULT false,
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, spawn_id)
);

CREATE INDEX idx_user_species_user ON user_species(user_id);
CREATE INDEX idx_user_species_species ON user_species(species_id);
CREATE INDEX idx_user_species_first ON user_species(user_id, species_id, is_first_catch) 
  WHERE is_first_catch = true;

-- ============================================================================
-- Encounters (catch attempts)
-- ============================================================================

CREATE TYPE encounter_outcome AS ENUM ('in_progress', 'success', 'fled', 'timeout');

CREATE TABLE encounters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  spawn_id UUID REFERENCES active_spawns(id) ON DELETE CASCADE,
  species_id UUID REFERENCES species(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  outcome encounter_outcome DEFAULT 'in_progress',
  attempts INTEGER DEFAULT 0,
  used_items JSONB DEFAULT '[]',
  catch_quality DECIMAL, -- 0.0-1.0 throw accuracy
  xp_earned INTEGER DEFAULT 0,
  server_verified BOOLEAN DEFAULT true
);

CREATE INDEX idx_encounters_user ON encounters(user_id);
CREATE INDEX idx_encounters_spawn ON encounters(spawn_id);
CREATE INDEX idx_encounters_outcome ON encounters(outcome, ended_at);

-- ============================================================================
-- Items System
-- ============================================================================

CREATE TYPE item_type AS ENUM ('bait', 'lure', 'camera', 'tool', 'consumable');

CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  item_type item_type NOT NULL,
  description TEXT,
  icon_url TEXT,
  effects JSONB DEFAULT '{}', -- {"catch_rate_boost": 1.5, "duration": 300}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_items_type ON items(item_type);

-- ============================================================================
-- User Inventory
-- ============================================================================

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id),
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

CREATE INDEX idx_inventory_user ON inventory(user_id);

-- ============================================================================
-- Loot Tables
-- ============================================================================

CREATE TABLE loot_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100),
  description TEXT,
  drops JSONB DEFAULT '[]', -- [{"item_id": "uuid", "weight": 0.5, "min_qty": 1, "max_qty": 3}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link field sites to loot tables
ALTER TABLE field_sites 
  ADD CONSTRAINT fk_field_sites_loot_table 
  FOREIGN KEY (loot_table_id) REFERENCES loot_tables(id);

-- ============================================================================
-- Audit Log (Anti-cheat)
-- ============================================================================

CREATE TYPE audit_severity AS ENUM ('info', 'warning', 'suspicious', 'ban');

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL, -- catch, poi_interact, movement, suspicious_activity
  event_data JSONB DEFAULT '{}',
  location GEOGRAPHY(POINT, 4326),
  server_time TIMESTAMPTZ DEFAULT NOW(),
  client_time TIMESTAMPTZ,
  integrity_flags TEXT[] DEFAULT '{}',
  severity audit_severity DEFAULT 'info'
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_time ON audit_log(server_time DESC);
CREATE INDEX idx_audit_log_severity ON audit_log(severity) WHERE severity IN ('suspicious', 'ban');

-- ============================================================================
-- Update existing users table for FieldQuest
-- ============================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS species_caught INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_location GEOGRAPHY(POINT, 4326);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_location_time TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_last_location ON users USING GIST(last_location);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE spawn_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_spawns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Species: Public read, admin write
CREATE POLICY "Species are viewable by everyone" ON species
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage species" ON species
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::int AND users.role = 'admin')
  );

-- Field Sites: Public read, teachers/admins write
CREATE POLICY "Active field sites are viewable by everyone" ON field_sites
  FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers and admins can create field sites" ON field_sites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::int 
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Spawn Events: Visible based on class membership
CREATE POLICY "Users can view spawn events for their classes" ON spawn_events
  FOR SELECT USING (
    is_active = true 
    AND (
      class_id IS NULL -- Public events
      OR EXISTS (
        SELECT 1 FROM class_enrollments 
        WHERE class_enrollments.class_id = spawn_events.class_id 
        AND class_enrollments.student_id = auth.uid()::int
        AND class_enrollments.status = 'active'
      )
      OR EXISTS (
        SELECT 1 FROM classes 
        WHERE classes.id = spawn_events.class_id 
        AND classes.teacher_id = auth.uid()::int
      )
    )
  );

-- Active Spawns: Visible if spawn event is visible
CREATE POLICY "Users can view active spawns" ON active_spawns
  FOR SELECT USING (
    is_caught = false 
    AND despawn_time > NOW()
    AND EXISTS (
      SELECT 1 FROM spawn_events 
      WHERE spawn_events.id = active_spawns.spawn_event_id
      -- Will use spawn_events RLS policy
    )
  );

-- User Species: Users can only see their own collection
CREATE POLICY "Users can view their own species collection" ON user_species
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "System can insert species catches" ON user_species
  FOR INSERT WITH CHECK (user_id = auth.uid()::int);

-- Encounters: Users can only see/manage their own
CREATE POLICY "Users can view their own encounters" ON encounters
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can create their own encounters" ON encounters
  FOR INSERT WITH CHECK (user_id = auth.uid()::int);

-- Inventory: Users can only see their own
CREATE POLICY "Users can view their own inventory" ON inventory
  FOR SELECT USING (user_id = auth.uid()::int);

-- Items: Public read
CREATE POLICY "Items are viewable by everyone" ON items
  FOR SELECT USING (is_active = true);

-- Audit Log: Users can only see their own, admins see all
CREATE POLICY "Users can view their own audit logs" ON audit_log
  FOR SELECT USING (
    user_id = auth.uid()::int 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::int 
      AND users.role = 'admin'
    )
  );

COMMENT ON TABLE species IS 'Wildlife species available in FieldQuest';
COMMENT ON TABLE field_sites IS 'Physical locations where wildlife can spawn';
COMMENT ON TABLE spawn_events IS 'Time-based events that generate spawns';
COMMENT ON TABLE active_spawns IS 'Currently active wildlife on the map';
COMMENT ON TABLE user_species IS 'Species caught by users';
COMMENT ON TABLE encounters IS 'Catch attempt sessions';
COMMENT ON TABLE audit_log IS 'Security and anti-cheat tracking';

