-- Migration: Add Trout Waters and Stocking Schedule System
-- Integrates with PA Fish & Boat Commission stocking data
-- Provides real-time trout stocking information for educational field trips

-- ============================================================================
-- STOCKING SCHEDULES TABLE
-- ============================================================================
-- Stores trout stocking events with dates, species, and quantities

CREATE TABLE IF NOT EXISTS stocking_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID NOT NULL REFERENCES field_sites(id) ON DELETE CASCADE,
  
  -- Stocking details
  stocking_date DATE NOT NULL,
  stocking_time TIME,
  actual_stocked BOOLEAN DEFAULT FALSE, -- Planned vs actually completed
  
  -- Fish details
  species TEXT NOT NULL, -- 'Brook Trout', 'Brown Trout', 'Rainbow Trout', 'Golden Rainbow'
  quantity INTEGER NOT NULL, -- Number of fish
  average_length_inches FLOAT, -- Average size
  size_class TEXT, -- 'Adult', 'Trophy', 'Sub-adult'
  
  -- Location details within site
  specific_location TEXT, -- e.g., "Below bridge", "Near parking lot"
  water_temp_f FLOAT, -- Water temperature at stocking
  water_conditions TEXT, -- 'Clear', 'Stained', 'High', 'Low'
  
  -- Source and verification
  pfbc_report_id TEXT, -- PA Fish & Boat Commission report ID
  stocking_crew TEXT, -- Which hatchery/crew
  verified_by TEXT, -- Staff verification
  
  -- Educational value
  public_notice BOOLEAN DEFAULT TRUE, -- Should this be publicly visible?
  educational_notes TEXT, -- Notes for teachers/students
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ -- Last time synced with PFBC data
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_stocking_site ON stocking_schedules(field_site_id);
CREATE INDEX IF NOT EXISTS idx_stocking_date ON stocking_schedules(stocking_date DESC);
CREATE INDEX IF NOT EXISTS idx_stocking_species ON stocking_schedules(species);
CREATE INDEX IF NOT EXISTS idx_stocking_upcoming ON stocking_schedules(stocking_date) WHERE actual_stocked = FALSE;

-- ============================================================================
-- WATER BODY DETAILS TABLE
-- ============================================================================
-- Extended information for fishing locations

CREATE TABLE IF NOT EXISTS water_body_details (
  field_site_id UUID PRIMARY KEY REFERENCES field_sites(id) ON DELETE CASCADE,
  
  -- Water body classification
  water_type TEXT NOT NULL, -- 'Stream', 'Creek', 'River', 'Lake', 'Pond', 'Reservoir'
  water_designation TEXT, -- 'Class A Wild Trout', 'Stocked Trout', 'Approved Trout Waters', 'Enhanced Wild Trout'
  stream_section TEXT, -- e.g., "Headwaters to Route 28 bridge"
  
  -- Fishing regulations
  fishing_regulations JSONB, -- Detailed regulations
  special_regs TEXT, -- Plain text summary
  season_dates JSONB, -- Opening/closing dates
  daily_limit INTEGER, -- Number of fish per day
  size_limits TEXT, -- Size restrictions
  
  -- Access information
  access_type TEXT[], -- ['Public', 'Roadside', 'Trail', 'Parking Lot']
  parking_available BOOLEAN DEFAULT TRUE,
  difficulty TEXT, -- 'Easy', 'Moderate', 'Difficult'
  wheelchair_accessible BOOLEAN DEFAULT FALSE,
  
  -- Water characteristics
  avg_width_feet FLOAT,
  avg_depth_feet FLOAT,
  flow_type TEXT, -- 'Fast', 'Moderate', 'Slow', 'Pool/Riffle'
  bottom_type TEXT[], -- ['Gravel', 'Cobble', 'Boulder', 'Sand', 'Bedrock']
  
  -- Natural reproduction
  natural_reproduction BOOLEAN DEFAULT FALSE, -- Does stream support wild trout?
  documented_species TEXT[], -- Naturally occurring fish species
  
  -- Facilities
  restrooms BOOLEAN DEFAULT FALSE,
  picnic_areas BOOLEAN DEFAULT FALSE,
  fishing_piers BOOLEAN DEFAULT FALSE,
  boat_launch BOOLEAN DEFAULT FALSE,
  
  -- Best practices and safety
  safety_notes TEXT,
  best_times TEXT, -- When to fish
  recommended_methods TEXT[], -- ['Fly fishing', 'Spin casting', 'Bait fishing']
  
  -- Educational value
  educational_features TEXT[], -- What students can learn here
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CATCH REPORTS TABLE (Optional - for student logging)
-- ============================================================================
-- Allow students to log catches for data collection

CREATE TABLE IF NOT EXISTS catch_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_site_id UUID NOT NULL REFERENCES field_sites(id) ON DELETE CASCADE,
  
  -- Catch details
  caught_at TIMESTAMPTZ DEFAULT NOW(),
  species TEXT NOT NULL,
  length_inches FLOAT,
  weight_ounces FLOAT,
  released BOOLEAN DEFAULT TRUE, -- Catch and release
  
  -- Conditions
  weather TEXT,
  water_temp_f FLOAT,
  water_clarity TEXT,
  air_temp_f FLOAT,
  
  -- Method
  fishing_method TEXT, -- 'Fly', 'Spin', 'Bait'
  lure_or_bait TEXT,
  
  -- Documentation
  photo_url TEXT,
  notes TEXT,
  
  -- Verification (for citizen science)
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_catch_user ON catch_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_catch_site ON catch_reports(field_site_id);
CREATE INDEX IF NOT EXISTS idx_catch_date ON catch_reports(caught_at DESC);
CREATE INDEX IF NOT EXISTS idx_catch_species ON catch_reports(species);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE stocking_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_body_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE catch_reports ENABLE ROW LEVEL SECURITY;

-- Stocking Schedules: Everyone can view public schedules
CREATE POLICY "Public can view public stocking schedules"
  ON stocking_schedules FOR SELECT
  USING (public_notice = TRUE);

CREATE POLICY "Admins can manage stocking schedules"
  ON stocking_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Water Body Details: Everyone can view
CREATE POLICY "Public can view water body details"
  ON water_body_details FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage water body details"
  ON water_body_details FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Catch Reports: Users can view/manage their own
CREATE POLICY "Users can view own catch reports"
  ON catch_reports FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own catch reports"
  ON catch_reports FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own catch reports"
  ON catch_reports FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function: Get upcoming stocking events
CREATE OR REPLACE FUNCTION get_upcoming_stockings(
  days_ahead INTEGER DEFAULT 30,
  p_species TEXT DEFAULT NULL
)
RETURNS TABLE (
  field_site_id UUID,
  site_name TEXT,
  site_location GEOGRAPHY,
  stocking_date DATE,
  species TEXT,
  quantity INTEGER,
  size_class TEXT,
  days_until_stocking INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.id AS field_site_id,
    fs.name AS site_name,
    fs.location AS site_location,
    ss.stocking_date,
    ss.species,
    ss.quantity,
    ss.size_class,
    (ss.stocking_date - CURRENT_DATE)::INTEGER AS days_until_stocking
  FROM stocking_schedules ss
  JOIN field_sites fs ON ss.field_site_id = fs.id
  WHERE 
    ss.stocking_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + days_ahead)
    AND ss.actual_stocked = FALSE
    AND ss.public_notice = TRUE
    AND (p_species IS NULL OR ss.species = p_species)
  ORDER BY ss.stocking_date ASC, fs.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get recent stockings (good for fishing trips)
CREATE OR REPLACE FUNCTION get_recent_stockings(
  days_back INTEGER DEFAULT 7,
  p_species TEXT DEFAULT NULL
)
RETURNS TABLE (
  field_site_id UUID,
  site_name TEXT,
  site_location GEOGRAPHY,
  stocking_date DATE,
  species TEXT,
  quantity INTEGER,
  size_class TEXT,
  days_since_stocking INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.id AS field_site_id,
    fs.name AS site_name,
    fs.location AS site_location,
    ss.stocking_date,
    ss.species,
    ss.quantity,
    ss.size_class,
    (CURRENT_DATE - ss.stocking_date)::INTEGER AS days_since_stocking
  FROM stocking_schedules ss
  JOIN field_sites fs ON ss.field_site_id = fs.id
  WHERE 
    ss.stocking_date BETWEEN (CURRENT_DATE - days_back) AND CURRENT_DATE
    AND ss.actual_stocked = TRUE
    AND ss.public_notice = TRUE
    AND (p_species IS NULL OR ss.species = p_species)
  ORDER BY ss.stocking_date DESC, fs.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get best fishing locations (recently stocked + good access)
CREATE OR REPLACE FUNCTION get_best_fishing_spots(
  user_lat FLOAT,
  user_lng FLOAT,
  max_distance_meters FLOAT DEFAULT 50000 -- 50km default
)
RETURNS TABLE (
  field_site_id UUID,
  site_name TEXT,
  site_type TEXT,
  distance_meters FLOAT,
  water_type TEXT,
  last_stocked DATE,
  days_since_stocking INTEGER,
  species_stocked TEXT[],
  access_difficulty TEXT,
  parking_available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.id AS field_site_id,
    fs.name AS site_name,
    fs.site_type,
    ST_Distance(
      fs.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) AS distance_meters,
    wbd.water_type,
    MAX(ss.stocking_date) AS last_stocked,
    (CURRENT_DATE - MAX(ss.stocking_date))::INTEGER AS days_since_stocking,
    ARRAY_AGG(DISTINCT ss.species) AS species_stocked,
    wbd.difficulty AS access_difficulty,
    wbd.parking_available
  FROM field_sites fs
  JOIN water_body_details wbd ON fs.id = wbd.field_site_id
  LEFT JOIN stocking_schedules ss ON fs.id = ss.field_site_id 
    AND ss.actual_stocked = TRUE
    AND ss.stocking_date >= (CURRENT_DATE - 30) -- Last 30 days
  WHERE 
    ST_DWithin(
      fs.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      max_distance_meters
    )
  GROUP BY fs.id, fs.name, fs.site_type, fs.location, wbd.water_type, wbd.difficulty, wbd.parking_available
  ORDER BY distance_meters ASC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamp on stocking schedule changes
CREATE OR REPLACE FUNCTION update_stocking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stocking_timestamp
  BEFORE UPDATE ON stocking_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_stocking_updated_at();

-- Update water body details timestamp
CREATE TRIGGER trigger_update_water_body_timestamp
  BEFORE UPDATE ON water_body_details
  FOR EACH ROW
  EXECUTE FUNCTION update_stocking_updated_at();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION get_upcoming_stockings TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_stockings TO authenticated;
GRANT EXECUTE ON FUNCTION get_best_fishing_spots TO authenticated;

-- ============================================================================
-- SEED ALLEGHENY COUNTY TROUT WATERS
-- ============================================================================

-- Add trout streams and stocked lakes to field_sites
INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

-- STOCKED TROUT STREAMS
('Deer Creek - Harmarville',
 'Popular stocked trout stream with excellent access. Flows through suburban area with multiple fishing spots. Safe creek-side trails and parking. Great for beginners and educational trips.',
 40.5389, -79.8194,

 ST_SetSRID(ST_MakePoint(-79.8194, 40.5389), 4326)::geography,
 'park',
 'Guys Run Rd',
 'Harmarville', 'PA', '15238',
 'Cool-water creek stocked regularly with trout. Supports wild populations of Creek Chub, Darters, and aquatic insects. Excellent for stream ecology and water quality studies.',
 ARRAY['Rainbow Trout', 'Brown Trout', 'Creek Chub', 'Johnny Darter', 'Crayfish', 'Hellgrammite', 'Stonefly'],
 ARRAY['Stocked Trout Stream']),

('Glade Run - Valencia',
 'Scenic stream with good trout habitat. Mix of pools and riffles. Multiple access points with parking. Family-friendly fishing location.',
 40.6678, -79.9856,

 ST_SetSRID(ST_MakePoint(-79.9856, 40.6678), 4326)::geography,
 'park',
 'Route 228',
 'Valencia', 'PA', '16059',
 'Small to medium stream with diverse aquatic habitat. Stocked trout remain through late spring. Natural brook trout in headwaters. Good for aquatic macroinvertebrate sampling.',
 ARRAY['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Longnose Dace', 'Sculpin', 'Mayfly', 'Caddisfly'],
 ARRAY['Stocked Trout Stream']),

('Little Sewickley Creek - Sewickley',
 'Beautiful woodland stream with consistent flow. Popular with fly fishermen. Challenging terrain but rewarding. Best for older students.',
 40.5536, -80.1847,

 ST_SetSRID(ST_MakePoint(-80.1847, 40.5536), 4326)::geography,
 'park',
 'Little Sewickley Creek Rd',
 'Sewickley', 'PA', '15143',
 'High-quality stream habitat with cold water. Some natural reproduction. Excellent insect hatches. Demonstrates healthy stream ecosystem.',
 ARRAY['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Rock Bass', 'Crayfish', 'Stonefly', 'Mayfly'],
 ARRAY['Quality Trout Stream']),

('Montour Run - Moon Township',
 'Accessible stream along Montour Trail. Easy parking and walking access. Perfect for school groups. Gentle flow with good pools.',
 40.5236, -80.1728,

 ST_SetSRID(ST_MakePoint(-80.1728, 40.5236), 4326)::geography,
 'park',
 'Montour Trail',
 'Moon Township', 'PA', '15108',
 'Stream restoration project demonstrates conservation success. Stocked annually. Trail provides safe, easy access along entire fishing section.',
 ARRAY['Rainbow Trout', 'Brown Trout', 'Creek Chub', 'Green Sunfish', 'Crayfish', 'Dragonfly'],
 ARRAY['Restored Stream/Trail Access']),

('Pine Creek - North Park',
 'North Park stream section stocked for Mentored Youth Trout Fishing Day. Excellent for introducing young anglers. Very safe, supervised location.',
 40.6045, -79.9689,

 ST_SetSRID(ST_MakePoint(-79.9689, 40.6045), 4326)::geography,
 'park',
 'Pearce Mill Rd',
 'Allison Park', 'PA', '15101',
 'Small stream within large county park. Stocked specifically for youth fishing programs. Perfect for first-time anglers.',
 ARRAY['Rainbow Trout', 'Brook Trout', 'Creek Chub', 'Darter'],
 ARRAY['Youth Fishing Stream']),

-- STOCKED LAKES
('North Park Lake',
 '75-acre scenic lake stocked with trout spring and fall. Excellent shore access all around lake. Boat rentals available. Safe, accessible, family-friendly.',
 40.6253, -79.9556,

 ST_SetSRID(ST_MakePoint(-79.9556, 40.6253), 4326)::geography,
 'park',
 '10300 Pearce Mill Rd',
 'Allison Park', 'PA', '15101',
 'Large park lake with consistent depth and oxygen. Holds trout well into summer. Also supports bass, panfish, and carp. Excellent for studying lake ecology and seasonal turnover.',
 ARRAY['Rainbow Trout', 'Brown Trout', 'Largemouth Bass', 'Bluegill', 'Pumpkinseed', 'Carp', 'Channel Catfish'],
 ARRAY['Stocked Lake/Multi-species']),

('South Park Lake',
 '18-acre lake heavily stocked with trout. Multiple fishing piers and shore access. Paddle boats available. Great for families and school groups.',
 40.2956, -79.9872,

 ST_SetSRID(ST_MakePoint(-79.9872, 40.2956), 4326)::geography,
 'park',
 '3735 Buffalo Dr',
 'South Park', 'PA', '15129',
 'Shallow lake with good oxygen levels. Trout fishing excellent in spring. Also supports warm-water species. Good for comparing cold and warm water fish.',
 ARRAY['Rainbow Trout', 'Golden Rainbow Trout', 'Bluegill', 'Yellow Perch', 'Crappie', 'Largemouth Bass'],
 ARRAY['Stocked Lake/Warm-water']),

('Boyce Park Lake',
 '12-acre lake in Boyce Park. Peaceful setting with good access. Nature center nearby offers educational programs. Very family-friendly.',
 40.4875, -79.7589,

 ST_SetSRID(ST_MakePoint(-79.7589, 40.4875), 4326)::geography,
 'park',
 '675 Old Frankstown Rd',
 'Plum', 'PA', '15239',
 'Small park lake with seasonal trout stocking. Good populations of sunfish and bass. Adjacent nature center provides educational resources.',
 ARRAY['Rainbow Trout', 'Bluegill', 'Largemouth Bass', 'Pumpkinseed', 'Green Sunfish'],
 ARRAY['Stocked Lake/Educational']),

('Deer Lakes - Upper Lake',
 '32-acre lake with regular trout stockings. Electric motors only - peaceful fishing. Multiple access points. Excellent for kayak fishing.',
 40.6089, -79.8167,

 ST_SetSRID(ST_MakePoint(-79.8167, 40.6089), 4326)::geography,
 'park',
 '2751 Gilespie Rd',
 'Frazer', 'PA', '15044',
 'Upper lake of Deer Lakes chain. Good depth maintains cool water for trout. Also excellent bass and panfish populations. Great for multi-species angling education.',
 ARRAY['Rainbow Trout', 'Brown Trout', 'Largemouth Bass', 'Smallmouth Bass', 'Bluegill', 'Crappie'],
 ARRAY['Stocked Lake/Multi-species']),

-- SPECIAL REGULATION WATERS
('Loyalhanna Creek - Ligonier',
 'Delayed Harvest Artificial Lures Only section. High-quality trout fishing. Heavily stocked. Advanced fishing techniques. Best for experienced anglers.',
 40.2439, -79.2328,

 ST_SetSRID(ST_MakePoint(-79.2328, 40.2439), 4326)::geography,
 'park',
 'Route 711',
 'Ligonier', 'PA', '15658',
 'Special regulation water with extended season. Allows trout to acclimate and provides high-quality fishing experience. Excellent for teaching conservation through fishing regulations.',
 ARRAY['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Sculpin', 'Stonefly', 'Caddisfly'],
 ARRAY['Special Regulation Trout Water']),

('Youghiogheny River - McKeesport',
 'Warm-water fishery with seasonal trout stockings in spring. Excellent smallmouth bass fishing. River access from trails. Multiple launch points.',
 40.3489, -79.8267,

 ST_SetSRID(ST_MakePoint(-79.8267, 40.3489), 4326)::geography,
 'greenway',
 'Youghiogheny River Trail',
 'McKeesport', 'PA', '15132',
 'Large river system. Trout stocked in cool spring waters. Transitions to warm-water fishery by summer. Excellent for studying river ecosystems and seasonal fish movements.',
 ARRAY['Rainbow Trout (spring)', 'Smallmouth Bass', 'Rock Bass', 'Channel Catfish', 'Carp', 'Muskellunge'],
 ARRAY['River/Multi-species/Seasonal']),

('Raccoon Creek - Raccoon State Park',
 'Long section of stocked water flowing through state park. Multiple access points and pools. Excellent habitat diversity. Safe trails throughout.',
 40.4989, -80.3697,

 ST_SetSRID(ST_MakePoint(-80.3697, 40.4989), 4326)::geography,
 'state_park',
 '3000 State Route 18',
 'Hookstown', 'PA', '15050',
 'Creek flows through 7,500+ acre park. Heavily stocked with consistent water flow. Cool temps from tree canopy. One of region''s best stocked trout fisheries.',
 ARRAY['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Creek Chub', 'Darter', 'Crayfish', 'Hellgrammite'],
 ARRAY['Stocked Trout Stream/Park']);

-- ============================================================================
-- ADD WATER BODY DETAILS FOR TROUT LOCATIONS
-- ============================================================================

INSERT INTO water_body_details (
  field_site_id, 
  water_type, 
  water_designation, 
  fishing_regulations,
  daily_limit,
  access_type,
  parking_available,
  difficulty,
  wheelchair_accessible,
  natural_reproduction,
  safety_notes,
  best_times,
  recommended_methods,
  educational_features
) 
SELECT 
  fs.id,
  'Stream',
  'Stocked Trout Waters',
  '{"season": "Year-round", "methods": ["Fly", "Spin", "Bait"], "notes": "Standard PA trout regulations apply"}'::JSONB,
  5,
  ARRAY['Public', 'Roadside', 'Trail'],
  TRUE,
  'Easy',
  FALSE,
  FALSE,
  'Stay on designated paths. Creek can be slippery. Supervise students near water.',
  'Best fishing 2-3 days after stocking. Early morning and evening most productive.',
  ARRAY['Spin casting', 'Bait fishing', 'Fly fishing'],
  ARRAY['Stream ecology', 'Aquatic insects', 'Fish identification', 'Conservation ethics', 'Water quality']
FROM field_sites fs
WHERE fs.name IN ('Deer Creek - Harmarville', 'Glade Run - Valencia', 'Montour Run - Moon Township', 'Pine Creek - North Park')
ON CONFLICT (field_site_id) DO NOTHING;

-- High quality stream
INSERT INTO water_body_details (
  field_site_id, 
  water_type, 
  water_designation,
  fishing_regulations,
  daily_limit,
  access_type,
  parking_available,
  difficulty,
  natural_reproduction,
  safety_notes,
  best_times,
  recommended_methods,
  educational_features
) 
SELECT 
  fs.id,
  'Creek',
  'Quality Stocked Trout Waters',
  '{"season": "Year-round", "methods": ["Fly", "Spin", "Bait"], "notes": "Contains some wild trout - practice catch and release"}'::JSONB,
  5,
  ARRAY['Public', 'Trail'],
  TRUE,
  'Moderate',
  TRUE,
  'Rocky terrain. Wear appropriate footwear. Stay together as group.',
  'Spring and fall best. Summer fishing in shaded pools.',
  ARRAY['Fly fishing', 'Spin casting', 'Nymphing'],
  ARRAY['Stream ecology', 'Wild vs stocked trout', 'Fly fishing techniques', 'Aquatic entomology', 'Riparian zones']
FROM field_sites fs
WHERE fs.name = 'Little Sewickley Creek - Sewickley'
ON CONFLICT (field_site_id) DO NOTHING;

-- Lakes
INSERT INTO water_body_details (
  field_site_id, 
  water_type, 
  water_designation,
  fishing_regulations,
  daily_limit,
  access_type,
  parking_available,
  difficulty,
  wheelchair_accessible,
  restrooms,
  picnic_areas,
  boat_launch,
  natural_reproduction,
  safety_notes,
  best_times,
  recommended_methods,
  educational_features
) 
SELECT 
  fs.id,
  'Lake',
  'Stocked Trout Waters',
  '{"season": "Year-round", "methods": ["All"], "notes": "No size or creel limits on trout"}'::JSONB,
  5,
  ARRAY['Public', 'Parking Lot', 'Paved paths'],
  TRUE,
  'Easy',
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  'Life jackets required on boats. Supervise students near water edges.',
  'Early morning best. Overcast days productive. Fish deeper in summer.',
  ARRAY['Bait fishing', 'Spin casting', 'Bobber fishing'],
  ARRAY['Lake ecology', 'Thermal stratification', 'Multi-species fishery', 'Fish habitat', 'Aquatic food webs']
FROM field_sites fs
WHERE fs.name IN ('North Park Lake', 'South Park Lake', 'Boyce Park Lake', 'Deer Lakes - Upper Lake')
ON CONFLICT (field_site_id) DO NOTHING;

-- Special regulations
INSERT INTO water_body_details (
  field_site_id, 
  water_type, 
  water_designation,
  fishing_regulations,
  special_regs,
  daily_limit,
  access_type,
  parking_available,
  difficulty,
  natural_reproduction,
  safety_notes,
  best_times,
  recommended_methods,
  educational_features
) 
SELECT 
  fs.id,
  'Creek',
  'Delayed Harvest Artificial Lures Only',
  '{"season": "Extended season", "methods": ["Artificial lures only"], "notes": "Check PFBC regulations for specific dates"}'::JSONB,
  'Artificial lures only. Extended season. Catch and release during certain periods. Check current regulations.',
  3,
  ARRAY['Public', 'Trail'],
  TRUE,
  'Difficult',
  TRUE,
  'Advanced location. Swift current. Experienced anglers only. Always check regulations.',
  'Spring and fall excellent. Flies or lures required. No bait allowed.',
  ARRAY['Fly fishing', 'Lure casting'],
  ARRAY['Advanced angling', 'Conservation regulations', 'Catch and release ethics', 'Stream habitat', 'Insect hatches']
FROM field_sites fs
WHERE fs.name = 'Loyalhanna Creek - Ligonier'
ON CONFLICT (field_site_id) DO NOTHING;

-- ============================================================================
-- SEED EXAMPLE STOCKING SCHEDULE (2025 Spring Season)
-- ============================================================================
-- Note: These are EXAMPLE dates. Real data would come from PFBC API

-- Deer Creek stockings
INSERT INTO stocking_schedules (field_site_id, stocking_date, species, quantity, average_length_inches, size_class, public_notice, educational_notes)
SELECT 
  fs.id,
  '2025-03-15'::DATE,
  'Rainbow Trout',
  750,
  10.5,
  'Adult',
  TRUE,
  'Opening Day stocking. Great opportunity for students to see stocking truck and learn about fish management.'
FROM field_sites fs
WHERE fs.name = 'Deer Creek - Harmarville';

INSERT INTO stocking_schedules (field_site_id, stocking_date, species, quantity, average_length_inches, size_class, public_notice, educational_notes)
SELECT 
  fs.id,
  '2025-04-01'::DATE,
  'Brown Trout',
  500,
  11.0,
  'Adult',
  TRUE,
  'In-season stocking. Discuss why Fish Commission stocks multiple times.'
FROM field_sites fs
WHERE fs.name = 'Deer Creek - Harmarville';

-- North Park Lake stockings
INSERT INTO stocking_schedules (field_site_id, stocking_date, species, quantity, average_length_inches, size_class, public_notice, educational_notes)
SELECT 
  fs.id,
  '2025-03-10'::DATE,
  'Rainbow Trout',
  2000,
  10.0,
  'Adult',
  TRUE,
  'Pre-season lake stocking. Trout adapt to lake environment. Good time to discuss lake vs stream habitat.'
FROM field_sites fs
WHERE fs.name = 'North Park Lake';

INSERT INTO stocking_schedules (field_site_id, stocking_date, species, quantity, average_length_inches, size_class, public_notice, educational_notes)
SELECT 
  fs.id,
  '2025-04-20'::DATE,
  'Golden Rainbow Trout',
  300,
  12.0,
  'Trophy',
  TRUE,
  'Trophy trout stocking! Special golden strain. Excellent photo opportunity for students.'
FROM field_sites fs
WHERE fs.name = 'North Park Lake';

-- Raccoon Creek stockings (largest volume)
INSERT INTO stocking_schedules (field_site_id, stocking_date, species, quantity, average_length_inches, size_class, public_notice, educational_notes)
SELECT 
  fs.id,
  '2025-03-18'::DATE,
  'Rainbow Trout',
  3000,
  10.5,
  'Adult',
  TRUE,
  'Major stocking event. Long section of stream means fish are well-distributed.'
FROM field_sites fs
WHERE fs.name = 'Raccoon Creek - Raccoon State Park';

INSERT INTO stocking_schedules (field_site_id, stocking_date, species, quantity, average_length_inches, size_class, public_notice, educational_notes)
SELECT 
  fs.id,
  '2025-04-15'::DATE,
  'Brown Trout',
  1500,
  11.5,
  'Adult',
  TRUE,
  'Brown trout prefer slightly warmer water and are more wary. Great for advanced fishing lessons.'
FROM field_sites fs
WHERE fs.name = 'Raccoon Creek - Raccoon State Park';

-- ============================================================================
-- PFBC API INTEGRATION SETUP
-- ============================================================================
-- Instructions for auto-updating stocking data

COMMENT ON TABLE stocking_schedules IS 'Trout stocking schedule. Sync with PFBC API using Edge Function or cron job. API endpoint: https://apps.fishandboat.pa.gov/StockingSchedule/';

COMMENT ON COLUMN stocking_schedules.pfbc_report_id IS 'Reference ID from PA Fish & Boat Commission database for verification and updates';

COMMENT ON COLUMN stocking_schedules.last_synced_at IS 'Timestamp of last sync with PFBC API. Update via scheduled function.';

-- Create placeholder function for PFBC sync (implement in Edge Function)
CREATE OR REPLACE FUNCTION sync_pfbc_stocking_data()
RETURNS TEXT AS $$
BEGIN
  -- This function should be implemented as a Supabase Edge Function
  -- that calls the PFBC API and updates stocking_schedules table
  -- 
  -- API Documentation: https://www.fishandboat.com/StockingSchedule/
  -- Returns stocking data in JSON format
  -- 
  -- Edge Function should:
  -- 1. Fetch PFBC stocking data for Allegheny County
  -- 2. Match water bodies to field_sites by name/location
  -- 3. Insert/update stocking_schedules
  -- 4. Mark actual_stocked = TRUE for past dates
  -- 5. Update last_synced_at timestamps
  
  RAISE NOTICE 'PFBC sync should be implemented as Supabase Edge Function';
  RAISE NOTICE 'Schedule to run weekly or after PFBC publishes new data';
  RAISE NOTICE 'API: https://apps.fishandboat.pa.gov/StockingSchedule/';
  
  RETURN 'Sync function placeholder. Implement as Edge Function.';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$ 
DECLARE
  trout_site_count INTEGER;
  stocking_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO trout_site_count 
  FROM field_sites 
  WHERE habitat_type LIKE '%Trout%' OR habitat_type LIKE '%Lake%';
  
  SELECT COUNT(*) INTO stocking_count FROM stocking_schedules;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Trout Waters & Stocking System Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Trout fishing locations added: %', trout_site_count;
  RAISE NOTICE 'Example stocking events: %', stocking_count;
  RAISE NOTICE '';
  RAISE NOTICE 'New tables created:';
  RAISE NOTICE '  ✓ stocking_schedules - Trout stocking dates';
  RAISE NOTICE '  ✓ water_body_details - Fishing info & regs';
  RAISE NOTICE '  ✓ catch_reports - Student catch logging';
  RAISE NOTICE '';
  RAISE NOTICE 'New functions:';
  RAISE NOTICE '  ✓ get_upcoming_stockings() - Next 30 days';
  RAISE NOTICE '  ✓ get_recent_stockings() - Last 7 days';
  RAISE NOTICE '  ✓ get_best_fishing_spots() - Near you';
  RAISE NOTICE '';
  RAISE NOTICE 'Integration ready for:';
  RAISE NOTICE '  - PA Fish & Boat Commission API';
  RAISE NOTICE '  - Auto-updating stocking schedules';
  RAISE NOTICE '  - Student catch reporting';
  RAISE NOTICE '  - Trout in the Classroom data';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step: Implement Edge Function for PFBC API sync';
  RAISE NOTICE '========================================';
END $$;

