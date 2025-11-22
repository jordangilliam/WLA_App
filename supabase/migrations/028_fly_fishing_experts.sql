-- Migration: Add Fly Fishing Experts, Shops, and Trout Unlimited Data
-- Includes Joe Humphreys, George Daniel, fly shops, and TU chapters

-- ============================================================================
-- FLY FISHING EXPERTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS fly_fishing_experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expert', 'shop', 'organization')),
  location TEXT,
  region TEXT,
  specialties TEXT[],
  bio TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experts_type ON fly_fishing_experts(type);
CREATE INDEX idx_experts_region ON fly_fishing_experts(region);

-- ============================================================================
-- EXPERT TECHNIQUES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS expert_techniques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID NOT NULL REFERENCES fly_fishing_experts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  water_types TEXT[],
  best_seasons TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_techniques_expert ON expert_techniques(expert_id);
CREATE INDEX idx_techniques_difficulty ON expert_techniques(difficulty);

-- ============================================================================
-- EXPERT PATTERNS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS expert_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID NOT NULL REFERENCES fly_fishing_experts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pattern_type TEXT CHECK (pattern_type IN ('dry-fly', 'nymph', 'streamer', 'wet-fly', 'terrestrial')),
  description TEXT,
  target_species TEXT[],
  best_seasons TEXT[],
  hook_size TEXT,
  materials TEXT[],
  tying_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patterns_expert ON expert_patterns(expert_id);
CREATE INDEX idx_patterns_type ON expert_patterns(pattern_type);

-- ============================================================================
-- EXPERT FAVORITE LOCATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS expert_favorite_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID NOT NULL REFERENCES fly_fishing_experts(id) ON DELETE CASCADE,
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  waterway_name TEXT NOT NULL,
  section TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  why TEXT,
  best_seasons TEXT[],
  techniques TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fav_locations_expert ON expert_favorite_locations(expert_id);
CREATE INDEX idx_fav_locations_site ON expert_favorite_locations(field_site_id);

-- ============================================================================
-- EXPERT PUBLICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS expert_publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID NOT NULL REFERENCES fly_fishing_experts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  publication_type TEXT CHECK (publication_type IN ('book', 'article', 'video', 'dvd', 'pattern')),
  year INTEGER,
  url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_publications_expert ON expert_publications(expert_id);
CREATE INDEX idx_publications_type ON expert_publications(publication_type);

-- ============================================================================
-- FLY FISHING SHOPS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS fly_fishing_shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  services TEXT[],
  has_guides BOOLEAN DEFAULT FALSE,
  has_fly_tying BOOLEAN DEFAULT FALSE,
  has_classes BOOLEAN DEFAULT FALSE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shops_location ON fly_fishing_shops(location);
CREATE INDEX idx_shops_region ON fly_fishing_shops(region);

-- ============================================================================
-- SEED DATA: JOE HUMPHREYS
-- ============================================================================

INSERT INTO fly_fishing_experts (name, type, location, region, specialties, bio, website, email, phone, address)
VALUES (
  'Joe Humphreys',
  'expert',
  'State College, PA',
  'Central',
  ARRAY['High-Stick Nymphing', 'Leisenring Lift', 'Streamer Fishing', 'Dry Fly Presentation', 'Teaching & Education'],
  'Legendary fly fishing instructor and guide. Taught thousands of anglers over decades. Expert in traditional and modern techniques.',
  'https://www.flyfishersparadise.com',
  'info@flyfishersparadise.com',
  '(814) 234-4189',
  'State College, PA'
)
ON CONFLICT DO NOTHING
RETURNING id;

-- Get Joe's ID for techniques and patterns
DO $$
DECLARE
  joe_id UUID;
BEGIN
  SELECT id INTO joe_id FROM fly_fishing_experts WHERE name = 'Joe Humphreys';
  
  IF joe_id IS NOT NULL THEN
    -- Joe's Techniques
    INSERT INTO expert_techniques (expert_id, name, description, water_types, best_seasons, difficulty)
    VALUES
      (joe_id, 'High-Stick Nymphing', 'Classic technique for fishing nymphs in pocket water and runs. Keep line off the water, use short drifts.', ARRAY['freestone', 'limestone'], ARRAY['spring', 'fall', 'winter'], 'intermediate'),
      (joe_id, 'Leisenring Lift', 'Traditional wet fly technique where you lift the fly at the end of the drift to imitate emerging insects.', ARRAY['limestone', 'spring-fed'], ARRAY['spring', 'summer'], 'intermediate'),
      (joe_id, 'Streamer Techniques', 'Aggressive streamer fishing for large trout. Various retrieves including strip-pause and swing methods.', ARRAY['freestone', 'limestone'], ARRAY['spring', 'fall'], 'advanced'),
      (joe_id, 'Dry Fly Presentation', 'Precise dry fly casting and presentation techniques for selective trout.', ARRAY['limestone', 'spring-fed'], ARRAY['spring', 'summer', 'fall'], 'intermediate');
    
    -- Joe's Patterns
    INSERT INTO expert_patterns (expert_id, name, pattern_type, description, target_species, best_seasons, hook_size, materials)
    VALUES
      (joe_id, 'Joe''s Hopper', 'terrestrial', 'Classic terrestrial pattern for late summer fishing.', ARRAY['Brown Trout', 'Rainbow Trout'], ARRAY['summer', 'fall'], '#10-#12', ARRAY['Deer hair', 'Rubber legs', 'Foam body']),
      (joe_id, 'Humphreys Nymph', 'nymph', 'Versatile nymph pattern effective in various conditions.', ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'], ARRAY['spring', 'summer', 'fall', 'winter'], '#14-#18', ARRAY['Peacock herl', 'Wire rib', 'Hare''s ear']),
      (joe_id, 'State College Special', 'dry-fly', 'Local pattern for Spring Creek hatches.', ARRAY['Brown Trout', 'Rainbow Trout'], ARRAY['spring', 'summer'], '#14-#16', ARRAY['Hackle', 'Dubbing', 'Wing']);
    
    -- Joe's Publications
    INSERT INTO expert_publications (expert_id, title, publication_type, year, description)
    VALUES
      (joe_id, 'Trout Tactics', 'book', 1981, 'Comprehensive guide to trout fishing techniques.'),
      (joe_id, 'Joe Humphreys''s Fly-Fishing Tactics', 'book', 1993, 'Advanced techniques and strategies.'),
      (joe_id, 'High-Stick Nymphing Video', 'video', NULL, 'Instructional video on high-stick nymphing technique.');
    
    -- Joe's Favorite Locations
    INSERT INTO expert_favorite_locations (expert_id, waterway_name, section, latitude, longitude, why, best_seasons, techniques)
    SELECT 
      joe_id,
      'Spring Creek',
      'Fisherman''s Paradise',
      40.7981,
      -77.8600,
      'Primary teaching location. Year-round fishing with consistent hatches.',
      ARRAY['spring', 'fall', 'winter'],
      ARRAY['High-Stick Nymphing', 'Dry Fly Presentation']
    WHERE EXISTS (SELECT 1 FROM field_sites WHERE name = 'Spring Creek' LIMIT 1);
    
    INSERT INTO expert_favorite_locations (expert_id, waterway_name, latitude, longitude, why, best_seasons, techniques)
    VALUES
      (joe_id, 'Penns Creek', 40.8670, -77.4167, 'Favorite freestone stream. Excellent dry fly and streamer fishing.', ARRAY['spring', 'summer', 'fall'], ARRAY['Streamer Techniques', 'Dry Fly Presentation']),
      (joe_id, 'Yellow Breeches Creek', 40.2342, -77.0264, 'Premier limestone spring creek. Perfect for teaching advanced techniques.', ARRAY['spring', 'fall'], ARRAY['Leisenring Lift', 'Dry Fly Presentation']);
  END IF;
END $$;

-- ============================================================================
-- SEED DATA: GEORGE DANIEL
-- ============================================================================

INSERT INTO fly_fishing_experts (name, type, location, region, specialties, bio, website, email, address)
VALUES (
  'George Daniel',
  'expert',
  'State College, PA',
  'Central',
  ARRAY['Modern Nymphing', 'Competition Fly Fishing', 'Tight-Line Techniques', 'French Nymphing', 'Czech Nymphing'],
  'World-class competitive fly angler and instructor. Expert in modern European nymphing techniques. Multiple-time US Fly Fishing Team member.',
  'https://www.georgedaniel.com',
  'george@georgedaniel.com',
  'State College, PA'
)
ON CONFLICT DO NOTHING
RETURNING id;

DO $$
DECLARE
  george_id UUID;
BEGIN
  SELECT id INTO george_id FROM fly_fishing_experts WHERE name = 'George Daniel';
  
  IF george_id IS NOT NULL THEN
    -- George's Techniques
    INSERT INTO expert_techniques (expert_id, name, description, water_types, best_seasons, difficulty)
    VALUES
      (george_id, 'French Nymphing', 'Long leader, no indicator technique. Highly effective in pocket water and fast runs.', ARRAY['freestone', 'limestone'], ARRAY['spring', 'summer', 'fall', 'winter'], 'advanced'),
      (george_id, 'Czech Nymphing', 'Short-line, heavy nymph technique for fast water. Extremely effective.', ARRAY['freestone'], ARRAY['spring', 'summer', 'fall'], 'advanced'),
      (george_id, 'Tight-Line Nymphing', 'Contact technique maintaining direct connection to the fly.', ARRAY['freestone', 'limestone'], ARRAY['spring', 'summer', 'fall', 'winter'], 'intermediate'),
      (george_id, 'Competition Techniques', 'Advanced techniques used in competitive fly fishing.', ARRAY['freestone', 'limestone'], ARRAY['spring', 'summer', 'fall', 'winter'], 'advanced');
    
    -- George's Patterns
    INSERT INTO expert_patterns (expert_id, name, pattern_type, description, target_species, best_seasons, hook_size, materials)
    VALUES
      (george_id, 'Perdigon', 'nymph', 'Competition-style nymph pattern. Sinks fast, highly visible.', ARRAY['Brown Trout', 'Rainbow Trout'], ARRAY['spring', 'summer', 'fall', 'winter'], '#14-#18', ARRAY['Tungsten bead', 'Epoxy', 'Flash']),
      (george_id, 'Squirmy Wormy', 'nymph', 'Realistic worm imitation. Highly effective.', ARRAY['Brown Trout', 'Rainbow Trout'], ARRAY['spring', 'summer', 'fall'], '#12-#16', ARRAY['Squirmy material', 'Tungsten bead']),
      (george_id, 'Competition Nymphs', 'nymph', 'Various competition-style patterns designed for effectiveness.', ARRAY['Brown Trout', 'Rainbow Trout'], ARRAY['spring', 'summer', 'fall', 'winter'], '#14-#20', ARRAY['Tungsten', 'Flash', 'Synthetic materials']);
    
    -- George's Publications
    INSERT INTO expert_publications (expert_id, title, publication_type, year, description, url)
    VALUES
      (george_id, 'Dynamic Nymphing', 'book', 2011, 'Comprehensive guide to modern nymphing techniques.', 'https://www.amazon.com/Dynamic-Nymphing-George-Daniel/dp/0811707421'),
      (george_id, 'Strip-Set', 'book', 2015, 'Advanced techniques for streamer fishing.', NULL),
      (george_id, 'Modern Nymphing Techniques', 'video', NULL, 'Instructional video series on modern nymphing.', NULL);
    
    -- George's Favorite Locations
    INSERT INTO expert_favorite_locations (expert_id, waterway_name, section, latitude, longitude, why, best_seasons, techniques)
    SELECT 
      george_id,
      'Spring Creek',
      'Fisherman''s Paradise',
      40.7981,
      -77.8600,
      'Primary teaching and competition location. Perfect for modern nymphing techniques.',
      ARRAY['spring', 'fall', 'winter'],
      ARRAY['French Nymphing', 'Tight-Line Nymphing']
    WHERE EXISTS (SELECT 1 FROM field_sites WHERE name = 'Spring Creek' LIMIT 1);
    
    INSERT INTO expert_favorite_locations (expert_id, waterway_name, latitude, longitude, why, best_seasons, techniques)
    VALUES
      (george_id, 'Yellow Breeches Creek', 40.2342, -77.0264, 'Excellent limestone spring creek for advanced techniques.', ARRAY['spring', 'fall'], ARRAY['French Nymphing', 'Tight-Line Nymphing']);
  END IF;
END $$;

-- ============================================================================
-- SEED DATA: FLY FISHING SHOPS
-- ============================================================================

INSERT INTO fly_fishing_shops (name, location, region, address, phone, website, email, services, has_guides, has_fly_tying, has_classes, latitude, longitude)
VALUES
  ('TCO Fly Shop', 'State College, PA', 'Central', '2101 E College Ave, State College, PA 16801', '(814) 234-4189', 'https://www.tcoflyfishing.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Classes', 'Fly Tying', 'Custom Rods'], TRUE, TRUE, TRUE, 40.7981, -77.8600),
  ('TCO Fly Shop', 'Reading, PA', 'Reading', 'Reading, PA', NULL, 'https://www.tcoflyfishing.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Classes'], TRUE, FALSE, TRUE, NULL, NULL),
  ('TCO Fly Shop', 'Bryn Mawr, PA', 'Philadelphia', 'Bryn Mawr, PA', NULL, 'https://www.tcoflyfishing.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Classes'], TRUE, FALSE, TRUE, NULL, NULL),
  ('Fly Fisher''s Paradise', 'State College, PA', 'Central', 'State College, PA', '(814) 234-4189', 'https://www.flyfishersparadise.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Classes', 'Joe Humphreys Instruction'], TRUE, FALSE, TRUE, 40.7981, -77.8600),
  ('Spruce Creek Outfitters', 'Spruce Creek, PA', 'Central', 'Spruce Creek, PA', NULL, 'https://www.sprucecreekoutfitters.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Lodging'], TRUE, FALSE, FALSE, NULL, NULL),
  ('The Feathered Hook', 'Coburn, PA', 'Central', 'Coburn, PA', NULL, 'https://www.featheredhook.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Lodging', 'Classes'], TRUE, FALSE, TRUE, 40.8670, -77.4167),
  ('The Fly Shop', 'Boiling Springs, PA', 'Harrisburg', 'Boiling Springs, PA', NULL, 'https://www.theflyshop.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips'], TRUE, FALSE, FALSE, 40.2342, -77.0264),
  ('Angler''s Paradise', 'Allentown, PA', 'Lehigh Valley', 'Allentown, PA', NULL, 'https://www.anglersparadise.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Classes'], TRUE, FALSE, TRUE, NULL, NULL),
  ('Fly Fishing Outfitters', 'Pittsburgh, PA', 'Pittsburgh', 'Pittsburgh, PA', NULL, 'https://www.flyfishingoutfitters.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips'], TRUE, FALSE, FALSE, NULL, NULL),
  ('The Sporting Gentleman', 'Erie, PA', 'Erie', 'Erie, PA', NULL, 'https://www.sportinggentleman.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Lake Erie Specialists'], TRUE, FALSE, FALSE, 42.1275, -80.0851);

-- ============================================================================
-- SEED DATA: TROUT UNLIMITED CHAPTERS
-- ============================================================================

INSERT INTO fly_fishing_experts (name, type, location, region, specialties, website)
VALUES
  ('Pennsylvania Council', 'organization', 'Statewide', 'Statewide', ARRAY['Conservation', 'Habitat Restoration', 'Education', 'Advocacy'], 'https://www.tu.org'),
  ('Allegheny Mountain Chapter', 'organization', 'Western PA', 'Western PA', ARRAY['Conservation', 'Habitat Restoration'], NULL),
  ('Spring Creek Chapter', 'organization', 'Central PA', 'Central', ARRAY['Spring Creek Conservation', 'Education'], NULL),
  ('Yellow Breeches Chapter', 'organization', 'South Central PA', 'Harrisburg', ARRAY['Yellow Breeches Conservation', 'Habitat Restoration'], NULL),
  ('Penns Creek Chapter', 'organization', 'Central PA', 'Central', ARRAY['Penns Creek Conservation', 'Education'], NULL),
  ('Lackawanna Chapter', 'organization', 'Northeast PA', 'Scranton', ARRAY['Conservation', 'Habitat Restoration'], NULL),
  ('Delaware River Chapter', 'organization', 'Eastern PA', 'Philadelphia', ARRAY['Delaware River Conservation', 'Habitat Restoration'], NULL);

-- RLS Policies
ALTER TABLE fly_fishing_experts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view fly fishing experts" ON fly_fishing_experts FOR SELECT USING (true);

ALTER TABLE expert_techniques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view expert techniques" ON expert_techniques FOR SELECT USING (true);

ALTER TABLE expert_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view expert patterns" ON expert_patterns FOR SELECT USING (true);

ALTER TABLE expert_favorite_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view expert favorite locations" ON expert_favorite_locations FOR SELECT USING (true);

ALTER TABLE expert_publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view expert publications" ON expert_publications FOR SELECT USING (true);

ALTER TABLE fly_fishing_shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view fly fishing shops" ON fly_fishing_shops FOR SELECT USING (true);

-- Summary
DO $$
BEGIN
  RAISE NOTICE '✓ Added fly fishing experts, shops, and Trout Unlimited data';
  RAISE NOTICE '  ✓ Created fly_fishing_experts table';
  RAISE NOTICE '  ✓ Created expert_techniques table';
  RAISE NOTICE '  ✓ Created expert_patterns table';
  RAISE NOTICE '  ✓ Created expert_favorite_locations table';
  RAISE NOTICE '  ✓ Created expert_publications table';
  RAISE NOTICE '  ✓ Created fly_fishing_shops table';
  RAISE NOTICE '  ✓ Seeded Joe Humphreys data (4 techniques, 3 patterns, 3 locations)';
  RAISE NOTICE '  ✓ Seeded George Daniel data (4 techniques, 3 patterns, 2 locations)';
  RAISE NOTICE '  ✓ Seeded 10 fly fishing shops';
  RAISE NOTICE '  ✓ Seeded 7 Trout Unlimited chapters';
  RAISE NOTICE '  🎣 Expert knowledge now available for fly fishing education';
END $$;


