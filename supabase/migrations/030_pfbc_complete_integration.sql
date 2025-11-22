-- Migration: Complete PFBC Data Integration
-- Includes: Stocking schedules, access points, regulations, habitat installations

-- ============================================================================
-- PFBC STOCKING SCHEDULES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pfbc_stocking_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  waterway_name TEXT NOT NULL,
  county TEXT NOT NULL,
  region TEXT NOT NULL,
  species TEXT NOT NULL,
  stocking_date DATE NOT NULL,
  quantity INTEGER NOT NULL,
  size_class TEXT CHECK (size_class IN ('Fingerling', 'Adult', 'Trophy')),
  average_length DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pfbc_stocking_waterway ON pfbc_stocking_schedules(waterway_name);
CREATE INDEX idx_pfbc_stocking_date ON pfbc_stocking_schedules(stocking_date);
CREATE INDEX idx_pfbc_stocking_species ON pfbc_stocking_schedules(species);
CREATE INDEX idx_pfbc_stocking_region ON pfbc_stocking_schedules(region);

-- ============================================================================
-- PFBC ACCESS POINTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pfbc_access_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  waterway_name TEXT NOT NULL,
  name TEXT NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('Boat Launch', 'Shore Access', 'Wade Access', 'Fly Fishing Only', 'Handicap Accessible')),
  county TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  amenities TEXT[],
  parking BOOLEAN DEFAULT FALSE,
  wheelchair_accessible BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pfbc_access_waterway ON pfbc_access_points(waterway_name);
CREATE INDEX idx_pfbc_access_type ON pfbc_access_points(access_type);
CREATE INDEX idx_pfbc_access_region ON pfbc_access_points(region);

-- ============================================================================
-- PFBC REGULATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pfbc_regulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  waterway_name TEXT NOT NULL,
  regulation_type TEXT NOT NULL CHECK (regulation_type IN ('Catch & Release', 'Delayed Harvest', 'Trophy Trout', 'Special Regulation', 'Size Limit', 'Creel Limit')),
  description TEXT NOT NULL,
  season TEXT,
  species TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pfbc_reg_waterway ON pfbc_regulations(waterway_name);
CREATE INDEX idx_pfbc_reg_type ON pfbc_regulations(regulation_type);

-- ============================================================================
-- PFBC HABITAT INSTALLATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pfbc_habitat_installations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  waterway_name TEXT NOT NULL,
  installation_type TEXT NOT NULL CHECK (installation_type IN ('Lunker Structure', 'Fish Attractor', 'Habitat Enhancement', 'Spawning Bed', 'Cover Structure')),
  county TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  installation_date DATE,
  target_species TEXT[],
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pfbc_habitat_waterway ON pfbc_habitat_installations(waterway_name);
CREATE INDEX idx_pfbc_habitat_type ON pfbc_habitat_installations(installation_type);
CREATE INDEX idx_pfbc_habitat_region ON pfbc_habitat_installations(region);

-- ============================================================================
-- SEED DATA: STOCKING SCHEDULES
-- ============================================================================

INSERT INTO pfbc_stocking_schedules (waterway_name, county, region, species, stocking_date, quantity, size_class, average_length, latitude, longitude, notes)
VALUES
  ('Spring Creek', 'Centre', 'Central', 'Rainbow Trout', '2025-03-15', 2000, 'Adult', 10.5, 40.7981, -77.8600, 'Opening Day stocking'),
  ('Spring Creek', 'Centre', 'Central', 'Brown Trout', '2025-04-01', 1500, 'Adult', 11.0, 40.7981, -77.8600, 'In-season stocking'),
  ('Spring Creek', 'Centre', 'Central', 'Golden Rainbow Trout', '2025-04-20', 300, 'Trophy', 12.0, 40.7981, -77.8600, 'Trophy trout stocking'),
  ('Penns Creek', 'Centre', 'Central', 'Rainbow Trout', '2025-03-18', 2500, 'Adult', 10.5, 40.8670, -77.4167, 'Opening Day stocking'),
  ('Penns Creek', 'Centre', 'Central', 'Brown Trout', '2025-04-15', 1800, 'Adult', 11.5, 40.8670, -77.4167, 'In-season stocking'),
  ('Yellow Breeches Creek', 'Cumberland', 'Harrisburg', 'Rainbow Trout', '2025-03-20', 3000, 'Adult', 10.5, 40.2342, -77.0264, 'Opening Day stocking'),
  ('Yellow Breeches Creek', 'Cumberland', 'Harrisburg', 'Brown Trout', '2025-04-18', 2000, 'Adult', 11.5, 40.2342, -77.0264, 'In-season stocking'),
  ('Yellow Breeches Creek', 'Cumberland', 'Harrisburg', 'Rainbow Trout', '2025-10-15', 2000, 'Adult', 10.5, 40.2342, -77.0264, 'Fall stocking'),
  ('Raystown Lake', 'Huntingdon', 'Central', 'Striped Bass', '2025-05-01', 50000, 'Fingerling', 2.0, 40.3000, -78.0000, 'Annual striped bass fingerling stocking'),
  ('Raystown Lake', 'Huntingdon', 'Central', 'Muskellunge', '2025-05-15', 5000, 'Fingerling', 3.0, 40.3000, -78.0000, 'Annual muskie fingerling stocking'),
  ('Raystown Lake', 'Huntingdon', 'Central', 'Walleye', '2025-04-20', 100000, 'Fingerling', 1.5, 40.3000, -78.0000, 'Annual walleye fingerling stocking'),
  ('Lake Arthur (Moraine State Park)', 'Butler', 'Pittsburgh', 'Muskellunge', '2025-05-10', 3000, 'Fingerling', 3.0, 40.9000, -80.1000, 'Annual muskie fingerling stocking'),
  ('Lake Arthur (Moraine State Park)', 'Butler', 'Pittsburgh', 'Walleye', '2025-04-25', 50000, 'Fingerling', 1.5, 40.9000, -80.1000, 'Annual walleye fingerling stocking')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: ACCESS POINTS
-- ============================================================================

INSERT INTO pfbc_access_points (waterway_name, name, access_type, county, region, latitude, longitude, amenities, parking, wheelchair_accessible, notes)
VALUES
  ('Spring Creek', 'Fisherman''s Paradise', 'Fly Fishing Only', 'Centre', 'Central', 40.7981, -77.8600, ARRAY['Parking', 'Restrooms', 'Visitor Center', 'Trails'], TRUE, TRUE, 'Premier fly fishing access'),
  ('Spring Creek', 'Benner Spring Access', 'Wade Access', 'Centre', 'Central', 40.8000, -77.8500, ARRAY['Parking'], TRUE, FALSE, 'Good wade access'),
  ('Penns Creek', 'Coburn Access', 'Wade Access', 'Centre', 'Central', 40.8670, -77.4167, ARRAY['Parking'], TRUE, FALSE, 'Primary access point'),
  ('Penns Creek', 'Weikert Access', 'Wade Access', 'Union', 'Central', 40.9000, -77.4000, ARRAY['Parking'], TRUE, FALSE, 'Good access point'),
  ('Yellow Breeches Creek', 'Allenberry Resort Access', 'Wade Access', 'Cumberland', 'Harrisburg', 40.2342, -77.0264, ARRAY['Parking', 'Restrooms'], TRUE, FALSE, 'Popular access point'),
  ('Yellow Breeches Creek', 'Boiling Springs Access', 'Wade Access', 'Cumberland', 'Harrisburg', 40.2400, -77.0200, ARRAY['Parking'], TRUE, FALSE, 'Good access point'),
  ('Raystown Lake', 'Seven Points Marina', 'Boat Launch', 'Huntingdon', 'Central', 40.3000, -78.0000, ARRAY['Boat Launch', 'Parking', 'Restrooms', 'Marina', 'Fuel'], TRUE, TRUE, 'Main marina and boat launch'),
  ('Raystown Lake', 'Snyder Run Boat Launch', 'Boat Launch', 'Huntingdon', 'Central', 40.3500, -78.0500, ARRAY['Boat Launch', 'Parking'], TRUE, FALSE, 'Secondary boat launch'),
  ('Raystown Lake', 'Shore Access Areas', 'Shore Access', 'Huntingdon', 'Central', 40.3000, -78.0000, ARRAY['Parking'], TRUE, FALSE, 'Multiple shore access points'),
  ('Lake Arthur (Moraine State Park)', 'Main Boat Launch', 'Boat Launch', 'Butler', 'Pittsburgh', 40.9000, -80.1000, ARRAY['Boat Launch', 'Parking', 'Restrooms'], TRUE, TRUE, 'Main boat launch'),
  ('Lake Arthur (Moraine State Park)', 'Shore Access Areas', 'Shore Access', 'Butler', 'Pittsburgh', 40.9000, -80.1000, ARRAY['Parking'], TRUE, FALSE, 'Multiple shore access points'),
  ('French Creek', 'Phoenixville Access', 'Wade Access', 'Chester', 'Philadelphia', 40.1000, -75.6000, ARRAY['Parking'], TRUE, FALSE, 'Good wade access'),
  ('French Creek', 'Upper French Creek Access', 'Wade Access', 'Chester', 'Philadelphia', 40.1500, -75.7000, ARRAY['Parking'], TRUE, FALSE, 'Upper section access'),
  ('Lehigh River', 'Allentown Access', 'Wade Access', 'Lehigh', 'Lehigh Valley', 40.6000, -75.5000, ARRAY['Parking'], TRUE, FALSE, 'Urban access point'),
  ('Lehigh River', 'Upper Lehigh River Access', 'Wade Access', 'Carbon', 'Lehigh Valley', 40.9000, -75.7000, ARRAY['Parking'], TRUE, FALSE, 'Upper section access')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: REGULATIONS
-- ============================================================================

INSERT INTO pfbc_regulations (waterway_name, regulation_type, description, season, species, notes)
VALUES
  ('Spring Creek', 'Trophy Trout', 'All-tackle trophy trout section. Special regulations apply.', NULL, ARRAY['Brown Trout', 'Rainbow Trout'], 'Check current regulations'),
  ('Spring Creek', 'Catch & Release', 'Catch and release only in designated sections.', NULL, ARRAY['Brown Trout', 'Rainbow Trout'], 'Check current regulations'),
  ('Yellow Breeches Creek', 'Delayed Harvest', 'Catch and release only, artificial lures only, Oct 1 - Feb 28', 'October 1 - February 28', ARRAY['Brown Trout', 'Rainbow Trout'], 'Delayed harvest section'),
  ('Yellow Breeches Creek', 'Trophy Trout', 'All-tackle trophy trout section', NULL, ARRAY['Brown Trout', 'Rainbow Trout'], 'Trophy trout section'),
  ('Little Lehigh Creek', 'Delayed Harvest', 'Catch and release only, artificial lures only, Oct 1 - Feb 28', 'October 1 - February 28', ARRAY['Brown Trout', 'Rainbow Trout'], 'Delayed harvest section'),
  ('Tulpehocken Creek', 'Delayed Harvest', 'Catch and release only, artificial lures only, Oct 1 - Feb 28', 'October 1 - February 28', ARRAY['Brown Trout', 'Rainbow Trout'], 'Delayed harvest section'),
  ('Raystown Lake', 'Size Limit', 'Bass: 15" minimum, Walleye: 18" minimum, Muskie: 40" minimum', NULL, ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Muskellunge'], 'Size limits apply'),
  ('Lake Arthur (Moraine State Park)', 'Size Limit', 'Bass: 12" minimum, Muskie: 40" minimum', NULL, ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Muskellunge'], 'Size limits apply')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: HABITAT INSTALLATIONS
-- ============================================================================

INSERT INTO pfbc_habitat_installations (waterway_name, installation_type, county, region, latitude, longitude, installation_date, target_species, description)
VALUES
  ('Raystown Lake', 'Lunker Structure', 'Huntingdon', 'Central', 40.3000, -78.0000, '2020-05-15', ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Crappie'], 'Lunker structure for bass habitat'),
  ('Raystown Lake', 'Lunker Structure', 'Huntingdon', 'Central', 40.3200, -78.0200, '2021-06-01', ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Crappie'], 'Lunker structure for bass habitat'),
  ('Raystown Lake', 'Spawning Bed', 'Huntingdon', 'Central', 40.3100, -78.0100, '2019-04-20', ARRAY['Walleye', 'Smallmouth Bass'], 'Spawning bed enhancement'),
  ('Lake Arthur (Moraine State Park)', 'Lunker Structure', 'Butler', 'Pittsburgh', 40.9000, -80.1000, '2020-05-20', ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Crappie'], 'Lunker structure for bass habitat'),
  ('Lake Arthur (Moraine State Park)', 'Fish Attractor', 'Butler', 'Pittsburgh', 40.9100, -80.1100, '2021-06-15', ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Crappie'], 'Fish attractor structure'),
  ('Blue Marsh Lake', 'Habitat Enhancement', 'Berks', 'Reading', 40.3758, -75.9244, '2020-04-10', ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Crappie'], 'Habitat enhancement project'),
  ('Beltzville Lake', 'Cover Structure', 'Carbon', 'Lehigh Valley', 40.8500, -75.6000, '2021-05-01', ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Crappie'], 'Cover structure for fish habitat')
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE pfbc_stocking_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view PFBC stocking schedules" ON pfbc_stocking_schedules FOR SELECT USING (true);

ALTER TABLE pfbc_access_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view PFBC access points" ON pfbc_access_points FOR SELECT USING (true);

ALTER TABLE pfbc_regulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view PFBC regulations" ON pfbc_regulations FOR SELECT USING (true);

ALTER TABLE pfbc_habitat_installations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view PFBC habitat installations" ON pfbc_habitat_installations FOR SELECT USING (true);

-- Summary
DO $$
BEGIN
  RAISE NOTICE '✓ Complete PFBC data integration';
  RAISE NOTICE '  ✓ Created pfbc_stocking_schedules table';
  RAISE NOTICE '  ✓ Created pfbc_access_points table';
  RAISE NOTICE '  ✓ Created pfbc_regulations table';
  RAISE NOTICE '  ✓ Created pfbc_habitat_installations table';
  RAISE NOTICE '  ✓ Seeded stocking schedules (13)';
  RAISE NOTICE '  ✓ Seeded access points (15)';
  RAISE NOTICE '  ✓ Seeded regulations (8)';
  RAISE NOTICE '  ✓ Seeded habitat installations (7)';
  RAISE NOTICE '  🎣 Complete PFBC integration ready';
END $$;


