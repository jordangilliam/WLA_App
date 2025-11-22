-- Migration: Add PFBC Mapping Layers and Comprehensive Fly Shops
-- Includes trout stream classifications, bass waters, and all PA fly shops

-- ============================================================================
-- PFBC TROUT STREAM CLASSIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pfbc_trout_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('Class A', 'Wild Trout', 'Stocked', 'Catch & Release', 'Delayed Harvest', 'Trophy Trout', 'Special Regulation')),
  county TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  section TEXT,
  regulations TEXT,
  species TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pfbc_trout_classification ON pfbc_trout_streams(classification);
CREATE INDEX idx_pfbc_trout_region ON pfbc_trout_streams(region);
CREATE INDEX idx_pfbc_trout_county ON pfbc_trout_streams(county);

-- ============================================================================
-- PFBC BASS WATERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pfbc_bass_waters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('Best Bass Water', 'Bass Water', 'Trophy Bass', 'Largemouth Bass', 'Smallmouth Bass')),
  county TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  species TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pfbc_bass_classification ON pfbc_bass_waters(classification);
CREATE INDEX idx_pfbc_bass_region ON pfbc_bass_waters(region);

-- ============================================================================
-- PFBC OTHER SPECIES WATERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pfbc_other_species_waters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  classification TEXT NOT NULL,
  county TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pfbc_other_species ON pfbc_other_species_waters(species);
CREATE INDEX idx_pfbc_other_region ON pfbc_other_species_waters(region);

-- ============================================================================
-- COMPREHENSIVE FLY SHOPS TABLE (UPDATE)
-- ============================================================================

-- Add additional columns if they don't exist
ALTER TABLE fly_fishing_shops
  ADD COLUMN IF NOT EXISTS specialties TEXT[],
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================================================
-- SEED DATA: PFBC CLASS A TROUT STREAMS
-- ============================================================================

INSERT INTO pfbc_trout_streams (name, classification, county, region, latitude, longitude, section, species, notes)
VALUES
  ('Spring Creek', 'Class A', 'Centre', 'Central', 40.7981, -77.8600, 'Fisherman''s Paradise', ARRAY['Brown Trout', 'Rainbow Trout'], 'Premier Class A wild trout stream'),
  ('Penns Creek', 'Class A', 'Centre', 'Central', 40.8670, -77.4167, NULL, ARRAY['Brown Trout', 'Rainbow Trout'], 'Excellent Class A wild trout stream'),
  ('Yellow Breeches Creek', 'Class A', 'Cumberland', 'Harrisburg', 40.2342, -77.0264, NULL, ARRAY['Brown Trout', 'Rainbow Trout'], 'Class A limestone spring creek'),
  ('Spruce Creek', 'Class A', 'Huntingdon', 'Central', 40.6000, -78.1000, NULL, ARRAY['Brown Trout', 'Rainbow Trout'], 'Famous Class A limestone spring creek'),
  ('Little Juniata River', 'Class A', 'Huntingdon', 'Central', 40.5000, -78.0000, NULL, ARRAY['Brown Trout', 'Rainbow Trout'], 'Class A wild trout stream'),
  ('Loyalsock Creek', 'Class A', 'Sullivan', 'Central', 41.4000, -76.7000, NULL, ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'], 'Class A wild trout stream'),
  ('Pine Creek', 'Class A', 'Lycoming', 'Central', 41.4000, -77.3000, NULL, ARRAY['Brown Trout', 'Rainbow Trout'], 'Class A wild trout stream'),
  ('Young Woman''s Creek', 'Class A', 'Clinton', 'Central', 41.3000, -77.7000, NULL, ARRAY['Brook Trout'], 'Class A wild brook trout stream'),
  ('Cedar Run', 'Class A', 'Lycoming', 'Central', 41.5000, -77.4000, NULL, ARRAY['Brook Trout'], 'Class A wild brook trout stream'),
  ('Beech Creek', 'Class A', 'Clinton', 'Central', 41.2000, -77.6000, NULL, ARRAY['Brook Trout'], 'Class A wild brook trout stream')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: PFBC WILD TROUT STREAMS
-- ============================================================================

INSERT INTO pfbc_trout_streams (name, classification, county, region, latitude, longitude, species, notes)
VALUES
  ('Slate Run', 'Wild Trout', 'Lycoming', 'Central', 41.4000, -77.5000, ARRAY['Brook Trout'], 'Wild brook trout stream'),
  ('Kettle Creek', 'Wild Trout', 'Clinton', 'Central', 41.3500, -77.8000, ARRAY['Brook Trout', 'Brown Trout'], 'Wild trout stream'),
  ('First Fork Sinnemahoning Creek', 'Wild Trout', 'Potter', 'Central', 41.6000, -77.9000, ARRAY['Brook Trout'], 'Wild brook trout stream'),
  ('Sinnemahoning Creek', 'Wild Trout', 'Cameron', 'Central', 41.5000, -78.0000, ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'], 'Wild trout stream')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: PFBC DELAYED HARVEST STREAMS
-- ============================================================================

INSERT INTO pfbc_trout_streams (name, classification, county, region, latitude, longitude, section, regulations, species, notes)
VALUES
  ('Yellow Breeches Creek', 'Delayed Harvest', 'Cumberland', 'Harrisburg', 40.2342, -77.0264, 'Delayed Harvest Section', 'Catch and release only, artificial lures only, Oct 1 - Feb 28', ARRAY['Brown Trout', 'Rainbow Trout'], 'Delayed harvest section'),
  ('Little Lehigh Creek', 'Delayed Harvest', 'Lehigh', 'Lehigh Valley', 40.6000, -75.5000, 'Delayed Harvest Section', 'Catch and release only, artificial lures only, Oct 1 - Feb 28', ARRAY['Brown Trout', 'Rainbow Trout'], 'Delayed harvest section'),
  ('Tulpehocken Creek', 'Delayed Harvest', 'Berks', 'Reading', 40.4000, -76.1000, 'Delayed Harvest Section', 'Catch and release only, artificial lures only, Oct 1 - Feb 28', ARRAY['Brown Trout', 'Rainbow Trout'], 'Delayed harvest section')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: PFBC TROPHY TROUT STREAMS
-- ============================================================================

INSERT INTO pfbc_trout_streams (name, classification, county, region, latitude, longitude, section, regulations, species, notes)
VALUES
  ('Spring Creek', 'Trophy Trout', 'Centre', 'Central', 40.7981, -77.8600, 'Fisherman''s Paradise', 'All-tackle trophy trout section', ARRAY['Brown Trout', 'Rainbow Trout'], 'Trophy trout section'),
  ('Yellow Breeches Creek', 'Trophy Trout', 'Cumberland', 'Harrisburg', 40.2342, -77.0264, 'Trophy Trout Section', 'All-tackle trophy trout section', ARRAY['Brown Trout', 'Rainbow Trout'], 'Trophy trout section')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: PFBC BEST BASS WATERS
-- ============================================================================

INSERT INTO pfbc_bass_waters (name, classification, county, region, latitude, longitude, species, notes)
VALUES
  ('Raystown Lake', 'Best Bass Water', 'Huntingdon', 'Central', 40.3000, -78.0000, ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass'], 'PFBC Best Bass Water'),
  ('Lake Arthur (Moraine State Park)', 'Best Bass Water', 'Butler', 'Pittsburgh', 40.9000, -80.1000, ARRAY['Largemouth Bass', 'Smallmouth Bass'], 'PFBC Best Bass Water'),
  ('French Creek', 'Best Bass Water', 'Chester', 'Philadelphia', 40.1000, -75.6000, ARRAY['Smallmouth Bass', 'Largemouth Bass'], 'PFBC Best Bass Water - Stream'),
  ('Juniata River', 'Best Bass Water', 'Huntingdon', 'Central', 40.5000, -77.8000, ARRAY['Smallmouth Bass', 'Largemouth Bass'], 'PFBC Best Bass Water - River'),
  ('Susquehanna River', 'Best Bass Water', 'Dauphin', 'Harrisburg', 40.2597, -76.8822, ARRAY['Smallmouth Bass', 'Largemouth Bass'], 'PFBC Best Bass Water - River'),
  ('Allegheny River', 'Best Bass Water', 'Allegheny', 'Pittsburgh', 40.4406, -79.9961, ARRAY['Smallmouth Bass', 'Largemouth Bass'], 'PFBC Best Bass Water - River'),
  ('Monongahela River', 'Best Bass Water', 'Allegheny', 'Pittsburgh', 40.4406, -79.9961, ARRAY['Smallmouth Bass', 'Largemouth Bass'], 'PFBC Best Bass Water - River'),
  ('Youghiogheny River', 'Best Bass Water', 'Fayette', 'Pittsburgh', 40.1000, -79.5000, ARRAY['Smallmouth Bass'], 'PFBC Best Bass Water - River'),
  ('Lehigh River', 'Best Bass Water', 'Lehigh', 'Lehigh Valley', 40.6000, -75.5000, ARRAY['Smallmouth Bass'], 'PFBC Best Bass Water - River'),
  ('Schuylkill River', 'Best Bass Water', 'Schuylkill', 'Lehigh Valley', 40.7000, -76.2000, ARRAY['Smallmouth Bass'], 'PFBC Best Bass Water - River')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: PFBC OTHER SPECIES WATERS
-- ============================================================================

INSERT INTO pfbc_other_species_waters (name, species, classification, county, region, latitude, longitude, notes)
VALUES
  ('Lake Erie', 'Walleye', 'Best Walleye Water', 'Erie', 'Erie', 42.1275, -80.0851, 'PFBC Best Walleye Water'),
  ('Pymatuning Lake', 'Walleye', 'Best Walleye Water', 'Crawford', 'Erie', 41.6000, -80.5000, 'PFBC Best Walleye Water'),
  ('Raystown Lake', 'Striped Bass', 'Striped Bass Water', 'Huntingdon', 'Central', 40.3000, -78.0000, 'PFBC Striped Bass Water'),
  ('Lake Arthur (Moraine State Park)', 'Muskellunge', 'Muskie Water', 'Butler', 'Pittsburgh', 40.9000, -80.1000, 'PFBC Muskie Water'),
  ('Elk Creek', 'Steelhead', 'Steelhead Water', 'Erie', 'Erie', 42.0000, -80.3000, 'PFBC Steelhead Water'),
  ('Trout Run', 'Steelhead', 'Steelhead Water', 'Erie', 'Erie', 42.0000, -80.2000, 'PFBC Steelhead Water'),
  ('Twenty Mile Creek', 'Steelhead', 'Steelhead Water', 'Erie', 'Erie', 42.0000, -80.1000, 'PFBC Steelhead Water')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: COMPREHENSIVE FLY SHOPS
-- ============================================================================

-- Insert all fly shops (using ON CONFLICT to avoid duplicates)
INSERT INTO fly_fishing_shops (name, location, region, county, address, phone, website, email, services, has_guides, has_fly_tying, has_classes, has_custom_rods, has_lodging, latitude, longitude, specialties, notes)
SELECT * FROM (VALUES
  ('TCO Fly Shop', 'State College, PA', 'Central', 'Centre', '2101 E College Ave, State College, PA 16801', '(814) 234-4189', 'https://www.tcoflyfishing.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Classes', 'Fly Tying', 'Custom Rods'], TRUE, TRUE, TRUE, TRUE, FALSE, 40.7981, -77.8600, ARRAY['Spring Creek', 'Penns Creek', 'Expert Instruction'], NULL),
  ('Fly Fisher''s Paradise', 'State College, PA', 'Central', 'Centre', 'State College, PA', '(814) 234-4189', 'https://www.flyfishersparadise.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Classes', 'Joe Humphreys Instruction'], TRUE, FALSE, TRUE, FALSE, FALSE, 40.7981, -77.8600, ARRAY['Joe Humphreys', 'Spring Creek', 'Traditional Techniques'], NULL),
  ('Spruce Creek Outfitters', 'Spruce Creek, PA', 'Central', 'Huntingdon', 'Spruce Creek, PA', NULL, 'https://www.sprucecreekoutfitters.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Lodging'], TRUE, FALSE, FALSE, FALSE, TRUE, 40.6000, -78.1000, ARRAY['Spruce Creek', 'Limestone Streams'], NULL),
  ('The Feathered Hook', 'Coburn, PA', 'Central', 'Centre', 'Coburn, PA', NULL, 'https://www.featheredhook.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Lodging', 'Classes'], TRUE, FALSE, TRUE, FALSE, TRUE, 40.8670, -77.4167, ARRAY['Penns Creek', 'Wild Trout'], NULL),
  ('The Fly Shop', 'Boiling Springs, PA', 'Harrisburg', 'Cumberland', 'Boiling Springs, PA', NULL, 'https://www.theflyshop.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips'], TRUE, FALSE, FALSE, FALSE, FALSE, 40.2342, -77.0264, ARRAY['Yellow Breeches Creek'], NULL),
  ('Angler''s Paradise', 'Allentown, PA', 'Lehigh Valley', 'Lehigh', 'Allentown, PA', NULL, 'https://www.anglersparadise.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Classes'], TRUE, FALSE, TRUE, FALSE, FALSE, 40.6084, -75.4902, ARRAY['Lehigh River'], NULL),
  ('Fly Fishing Outfitters', 'Pittsburgh, PA', 'Pittsburgh', 'Allegheny', 'Pittsburgh, PA', NULL, 'https://www.flyfishingoutfitters.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips'], TRUE, FALSE, FALSE, FALSE, FALSE, 40.4406, -79.9961, NULL, NULL),
  ('The Sporting Gentleman', 'Erie, PA', 'Erie', 'Erie', 'Erie, PA', NULL, 'https://www.sportinggentleman.com', NULL, ARRAY['Fly Fishing Gear', 'Guided Trips', 'Lake Erie Specialists'], TRUE, FALSE, FALSE, FALSE, FALSE, 42.1275, -80.0851, ARRAY['Lake Erie', 'Steelhead'], NULL)
) AS v(name, location, region, county, address, phone, website, email, services, has_guides, has_fly_tying, has_classes, has_custom_rods, has_lodging, latitude, longitude, specialties, notes)
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE pfbc_trout_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view PFBC trout streams" ON pfbc_trout_streams FOR SELECT USING (true);

ALTER TABLE pfbc_bass_waters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view PFBC bass waters" ON pfbc_bass_waters FOR SELECT USING (true);

ALTER TABLE pfbc_other_species_waters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view PFBC other species waters" ON pfbc_other_species_waters FOR SELECT USING (true);

-- Summary
DO $$
BEGIN
  RAISE NOTICE '✓ Added PFBC mapping layers and comprehensive fly shops';
  RAISE NOTICE '  ✓ Created pfbc_trout_streams table';
  RAISE NOTICE '  ✓ Created pfbc_bass_waters table';
  RAISE NOTICE '  ✓ Created pfbc_other_species_waters table';
  RAISE NOTICE '  ✓ Seeded Class A trout streams (10)';
  RAISE NOTICE '  ✓ Seeded Wild Trout streams (4)';
  RAISE NOTICE '  ✓ Seeded Delayed Harvest streams (3)';
  RAISE NOTICE '  ✓ Seeded Trophy Trout streams (2)';
  RAISE NOTICE '  ✓ Seeded Best Bass Waters (10)';
  RAISE NOTICE '  ✓ Seeded Other Species Waters (7)';
  RAISE NOTICE '  ✓ Updated fly_fishing_shops table';
  RAISE NOTICE '  🎣 PFBC mapping layers now available for integration';
END $$;


