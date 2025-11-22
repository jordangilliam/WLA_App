-- Migration: Add Seasonal Waterway Data and Macroinvertebrate Hatch Information
-- Expands waterway knowledge base with seasonal considerations and hatch data

-- ============================================================================
-- MACROINVERTEBRATE HATCH TABLE
-- ============================================================================

-- Drop constraint if it exists (in case table was created with old constraint)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'macroinvertebrate_hatches_peak_month_check'
    AND table_name = 'macroinvertebrate_hatches'
  ) THEN
    ALTER TABLE macroinvertebrate_hatches DROP CONSTRAINT macroinvertebrate_hatches_peak_month_check;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS macroinvertebrate_hatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  species TEXT NOT NULL,
  common_name TEXT NOT NULL,
  hatch_start_month TEXT NOT NULL CHECK (hatch_start_month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')),
  hatch_end_month TEXT NOT NULL CHECK (hatch_end_month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')),
  peak_month TEXT NOT NULL CHECK (peak_month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Year-round')),
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night', 'all-day')),
  water_temp_min_f INTEGER,
  water_temp_optimal_f INTEGER,
  water_temp_max_f INTEGER,
  water_types TEXT[] NOT NULL CHECK (water_types && ARRAY['limestone', 'freestone', 'spring-fed', 'tailwater']),
  hook_size TEXT,
  color_description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table already exists, update the constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'macroinvertebrate_hatches'
  ) THEN
    -- Drop old constraint if it exists
    ALTER TABLE macroinvertebrate_hatches DROP CONSTRAINT IF EXISTS macroinvertebrate_hatches_peak_month_check;
    -- Add new constraint with 'Year-round' option
    ALTER TABLE macroinvertebrate_hatches ADD CONSTRAINT macroinvertebrate_hatches_peak_month_check 
      CHECK (peak_month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Year-round'));
  END IF;
END $$;

CREATE INDEX idx_hatches_months ON macroinvertebrate_hatches(hatch_start_month, hatch_end_month);
CREATE INDEX idx_hatches_water_type ON macroinvertebrate_hatches USING GIN(water_types);

-- ============================================================================
-- WATERWAY HATCH ASSOCIATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS waterway_hatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_site_id UUID NOT NULL REFERENCES field_sites(id) ON DELETE CASCADE,
  hatch_id UUID NOT NULL REFERENCES macroinvertebrate_hatches(id) ON DELETE CASCADE,
  intensity TEXT CHECK (intensity IN ('light', 'moderate', 'heavy', 'sporadic')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(field_site_id, hatch_id)
);

CREATE INDEX idx_waterway_hatches_site ON waterway_hatches(field_site_id);
CREATE INDEX idx_waterway_hatches_hatch ON waterway_hatches(hatch_id);

-- ============================================================================
-- SEASONAL WATERWAY DATA
-- ============================================================================

ALTER TABLE water_body_details
ADD COLUMN IF NOT EXISTS best_seasons TEXT[],
ADD COLUMN IF NOT EXISTS spring_notes TEXT,
ADD COLUMN IF NOT EXISTS summer_notes TEXT,
ADD COLUMN IF NOT EXISTS fall_notes TEXT,
ADD COLUMN IF NOT EXISTS winter_notes TEXT,
ADD COLUMN IF NOT EXISTS ice_fishing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS spring_stocking BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fall_stocking BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS avg_water_temp_spring_f INTEGER,
ADD COLUMN IF NOT EXISTS avg_water_temp_summer_f INTEGER,
ADD COLUMN IF NOT EXISTS avg_water_temp_fall_f INTEGER,
ADD COLUMN IF NOT EXISTS avg_water_temp_winter_f INTEGER;

-- ============================================================================
-- SEED MACROINVERTEBRATE HATCH DATA
-- ============================================================================

INSERT INTO macroinvertebrate_hatches (species, common_name, hatch_start_month, hatch_end_month, peak_month, time_of_day, water_temp_min_f, water_temp_optimal_f, water_temp_max_f, water_types, hook_size, color_description, notes) VALUES

-- Limestone Spring Creek Hatches
('Ephemerella subvaria', 'Hendrickson', 'April', 'May', 'April', 'afternoon', 48, 52, 56, ARRAY['limestone', 'spring-fed'], '#12-#14', 'Dark brown body, gray wings', 'One of the first major hatches of spring'),
('Ephemerella invaria', 'Sulphur', 'May', 'June', 'May', 'evening', 55, 60, 65, ARRAY['limestone', 'spring-fed'], '#16-#18', 'Yellow body, pale yellow wings', 'Evening hatch, very important'),
('Tricorythodes', 'Trico', 'July', 'October', 'August', 'morning', 60, 65, 70, ARRAY['limestone', 'spring-fed'], '#20-#24', 'Dark body, clear wings', 'Early morning hatch, very small'),
('Chironomidae', 'Midges', 'January', 'December', 'Year-round', 'all-day', 35, 50, 65, ARRAY['limestone', 'spring-fed'], '#18-#24', 'Black, olive, or cream', 'Year-round hatch, especially important in winter'),

-- Freestone Stream Hatches
('Brachycentrus', 'Grannom', 'April', 'May', 'April', 'afternoon', 50, 54, 58, ARRAY['freestone'], '#14-#16', 'Olive body, gray wings', 'Important early season hatch'),
('Ephemerella dorothea', 'March Brown', 'March', 'April', 'March', 'afternoon', 45, 50, 55, ARRAY['freestone'], '#12-#14', 'Brown body, mottled wings', 'Early season hatch'),
('Isonychia', 'Isonychia', 'May', 'July', 'June', 'evening', 58, 62, 68, ARRAY['freestone'], '#10-#12', 'Dark brown body, dark wings', 'Large mayfly, important summer hatch'),

-- Tailwater Hatches
('Baetis', 'Blue-Winged Olive', 'March', 'November', 'April', 'afternoon', 45, 55, 65, ARRAY['tailwater', 'limestone'], '#16-#20', 'Olive body, gray-blue wings', 'Year-round hatch in tailwaters, peaks in April and October'),
('Pseudocloeon', 'Tiny Blue-Winged Olive', 'April', 'October', 'May', 'afternoon', 50, 60, 70, ARRAY['tailwater'], '#20-#24', 'Olive body, blue-gray wings', 'Small but important hatch');

-- ============================================================================
-- UPDATE EXISTING WATER BODIES WITH SEASONAL DATA
-- ============================================================================

-- Spring Creek
UPDATE water_body_details wbd
SET
  best_seasons = ARRAY['spring', 'fall', 'winter'],
  spring_notes = 'Excellent Hendrickson and Sulphur hatches. Spring stocking in March-April.',
  summer_notes = 'Trico hatches in early morning. Water stays cool year-round.',
  fall_notes = 'Blue-Winged Olive hatches. Fall stocking in October.',
  winter_notes = 'Year-round fishing. Midge hatches throughout winter.',
  spring_stocking = TRUE,
  fall_stocking = TRUE,
  avg_water_temp_spring_f = 52,
  avg_water_temp_summer_f = 58,
  avg_water_temp_fall_f = 55,
  avg_water_temp_winter_f = 45
FROM field_sites fs
WHERE wbd.field_site_id = fs.id
  AND fs.name = 'Spring Creek'
  AND fs.site_type = 'water_body';

-- Yellow Breeches Creek
UPDATE water_body_details wbd
SET
  best_seasons = ARRAY['spring', 'fall'],
  spring_notes = 'Hendrickson hatch in late April. Excellent spring fishing.',
  fall_notes = 'Fall stocking and Blue-Winged Olive hatches.',
  spring_stocking = TRUE,
  fall_stocking = TRUE,
  avg_water_temp_spring_f = 50,
  avg_water_temp_summer_f = 60,
  avg_water_temp_fall_f = 55,
  avg_water_temp_winter_f = 42
FROM field_sites fs
WHERE wbd.field_site_id = fs.id
  AND fs.name = 'Yellow Breeches Creek'
  AND fs.site_type = 'water_body';

-- Penns Creek
UPDATE water_body_details wbd
SET
  best_seasons = ARRAY['spring', 'summer', 'fall'],
  spring_notes = 'Grannom hatch in mid-April. March Brown in late March.',
  summer_notes = 'Isonychia hatch in June. Excellent dry fly fishing.',
  fall_notes = 'Fall colors and good fishing.',
  spring_stocking = TRUE,
  avg_water_temp_spring_f = 48,
  avg_water_temp_summer_f = 65,
  avg_water_temp_fall_f = 55,
  avg_water_temp_winter_f = 38
FROM field_sites fs
WHERE wbd.field_site_id = fs.id
  AND fs.name = 'Penns Creek'
  AND fs.site_type = 'water_body';

-- Raystown Lake
UPDATE water_body_details wbd
SET
  best_seasons = ARRAY['spring', 'summer', 'fall'],
  spring_notes = 'Excellent bass fishing. Walleye spawn in April.',
  summer_notes = 'Deep water fishing for bass and walleye. Topwater action.',
  fall_notes = 'Excellent fall fishing. Muskie season peaks.',
  winter_notes = 'Ice fishing possible in coves.',
  ice_fishing = TRUE,
  avg_water_temp_spring_f = 55,
  avg_water_temp_summer_f = 75,
  avg_water_temp_fall_f = 65,
  avg_water_temp_winter_f = 40
FROM field_sites fs
WHERE wbd.field_site_id = fs.id
  AND fs.name = 'Raystown Lake'
  AND fs.site_type = 'water_body';

-- Lake Erie
UPDATE water_body_details wbd
SET
  best_seasons = ARRAY['spring', 'summer', 'fall'],
  spring_notes = 'Walleye spawn in April. Excellent spring fishing.',
  summer_notes = 'Perch fishing peaks. Smallmouth bass active.',
  fall_notes = 'Steelhead runs begin. Excellent fall fishing.',
  winter_notes = 'Ice fishing for perch and walleye.',
  ice_fishing = TRUE,
  avg_water_temp_spring_f = 45,
  avg_water_temp_summer_f = 70,
  avg_water_temp_fall_f = 60,
  avg_water_temp_winter_f = 35
FROM field_sites fs
WHERE wbd.field_site_id = fs.id
  AND (fs.name LIKE '%Lake Erie%' OR fs.name LIKE '%Presque Isle%')
  AND fs.site_type = 'water_body';

-- ============================================================================
-- ASSOCIATE HATCHES WITH WATERWAYS
-- ============================================================================

-- Spring Creek hatches
INSERT INTO waterway_hatches (field_site_id, hatch_id, intensity, notes)
SELECT fs.id, h.id, 'heavy', 'Primary hatch for this water'
FROM field_sites fs, macroinvertebrate_hatches h
WHERE fs.name = 'Spring Creek' AND fs.site_type = 'water_body'
  AND h.common_name IN ('Hendrickson', 'Sulphur', 'Trico', 'Midges', 'Blue-Winged Olive')
ON CONFLICT (field_site_id, hatch_id) DO NOTHING;

-- Yellow Breeches hatches
INSERT INTO waterway_hatches (field_site_id, hatch_id, intensity, notes)
SELECT fs.id, h.id, 'heavy', 'Primary hatch for this water'
FROM field_sites fs, macroinvertebrate_hatches h
WHERE fs.name = 'Yellow Breeches Creek' AND fs.site_type = 'water_body'
  AND h.common_name IN ('Hendrickson', 'Sulphur', 'Blue-Winged Olive')
ON CONFLICT (field_site_id, hatch_id) DO NOTHING;

-- Penns Creek hatches
INSERT INTO waterway_hatches (field_site_id, hatch_id, intensity, notes)
SELECT fs.id, h.id, 'heavy', 'Primary hatch for this water'
FROM field_sites fs, macroinvertebrate_hatches h
WHERE fs.name = 'Penns Creek' AND fs.site_type = 'water_body'
  AND h.common_name IN ('Grannom', 'March Brown', 'Isonychia')
ON CONFLICT (field_site_id, hatch_id) DO NOTHING;

-- Tulpehocken Creek (tailwater) hatches
INSERT INTO waterway_hatches (field_site_id, hatch_id, intensity, notes)
SELECT fs.id, h.id, 'heavy', 'Year-round hatch in tailwater'
FROM field_sites fs, macroinvertebrate_hatches h
WHERE fs.name = 'Tulpehocken Creek' AND fs.site_type = 'water_body'
  AND h.common_name IN ('Blue-Winged Olive', 'Tiny Blue-Winged Olive')
ON CONFLICT (field_site_id, hatch_id) DO NOTHING;

-- RLS Policies
ALTER TABLE macroinvertebrate_hatches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view macroinvertebrate hatches" ON macroinvertebrate_hatches FOR SELECT USING (true);

ALTER TABLE waterway_hatches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view waterway hatches" ON waterway_hatches FOR SELECT USING (true);

-- Summary
DO $$
BEGIN
  RAISE NOTICE '✓ Added seasonal waterway data and macroinvertebrate hatch information';
  RAISE NOTICE '  ✓ Created macroinvertebrate_hatches table';
  RAISE NOTICE '  ✓ Created waterway_hatches association table';
  RAISE NOTICE '  ✓ Added seasonal fields to water_body_details';
  RAISE NOTICE '  ✓ Seeded 9 macroinvertebrate hatch species';
  RAISE NOTICE '  ✓ Updated existing waterways with seasonal data';
  RAISE NOTICE '  🎣 Hatch data now available for fly fishing planning';
END $$;

