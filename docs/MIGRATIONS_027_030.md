# Migration Guide: 027-030

This guide documents migrations 027-030, which add fly fishing features, expert knowledge systems, and complete PFBC data integration.

## Overview

These migrations expand the WildPraxis platform with:
- Seasonal waterway data and macroinvertebrate hatch information
- Fly fishing expert knowledge (Joe Humphreys, George Daniel)
- Comprehensive fly fishing shop database
- Complete PFBC data integration (stocking, access points, regulations, habitat)
- PFBC mapping layers (trout streams, bass waters, species designations)

## Migration Dependencies

**Prerequisites:**
- Migration 003: Field sites table
- Migration 005: Water body details table
- Migration 012: Basic waterway data

**Order:**
1. Migration 027: Seasonal waterway data and hatches
2. Migration 028: Fly fishing experts and shops
3. Migration 029: PFBC mapping layers
4. Migration 030: Complete PFBC integration

---

## Migration 027: Seasonal Waterway Data and Macroinvertebrate Hatches

**File:** `supabase/migrations/027_seasonal_waterway_data.sql`

### What It Does

Adds seasonal fishing data and macroinvertebrate hatch information to waterways.

### Tables Created

#### `macroinvertebrate_hatches`
Stores macroinvertebrate species hatch information.

**Columns:**
- `id` (UUID, PK)
- `species` (TEXT) - Scientific name
- `common_name` (TEXT) - Common name (e.g., "Hendrickson", "Sulphur")
- `hatch_start_month` (TEXT) - Start month
- `hatch_end_month` (TEXT) - End month
- `peak_month` (TEXT) - Peak hatch month
- `time_of_day` (TEXT) - `morning`, `afternoon`, `evening`, `night`, `all-day`
- `water_temp_min_f` (INTEGER) - Minimum water temperature
- `water_temp_optimal_f` (INTEGER) - Optimal water temperature
- `water_temp_max_f` (INTEGER) - Maximum water temperature
- `water_types` (TEXT[]) - `limestone`, `freestone`, `spring-fed`, `tailwater`
- `hook_size` (TEXT) - Recommended hook size
- `color_description` (TEXT) - Fly color description
- `notes` (TEXT) - Additional notes

#### `waterway_hatches`
Associates hatches with waterways.

**Columns:**
- `id` (UUID, PK)
- `field_site_id` (UUID, FK → field_sites)
- `hatch_id` (UUID, FK → macroinvertebrate_hatches)
- `intensity` (TEXT) - `light`, `moderate`, `heavy`, `sporadic`
- `notes` (TEXT)

### Schema Changes

**`water_body_details` table additions:**
- `best_seasons` (TEXT[]) - Best fishing seasons
- `spring_notes` (TEXT)
- `summer_notes` (TEXT)
- `fall_notes` (TEXT)
- `winter_notes` (TEXT)
- `ice_fishing` (BOOLEAN)
- `spring_stocking` (BOOLEAN)
- `fall_stocking` (BOOLEAN)
- `avg_water_temp_spring_f` (INTEGER)
- `avg_water_temp_summer_f` (INTEGER)
- `avg_water_temp_fall_f` (INTEGER)
- `avg_water_temp_winter_f` (INTEGER)

### Data Seeded

- **9 macroinvertebrate hatch species:**
  - Hendrickson (Ephemerella subvaria)
  - Sulphur (Ephemerella invaria)
  - Trico (Tricorythodes)
  - Midges (Chironomidae)
  - Grannom (Brachycentrus)
  - March Brown (Ephemerella dorothea)
  - Isonychia
  - Blue-Winged Olive (Baetis)
  - Tiny Blue-Winged Olive (Pseudocloeon)

- **Seasonal data updated for:**
  - Spring Creek
  - Yellow Breeches Creek
  - Penns Creek
  - Raystown Lake
  - Lake Erie

### RLS Policies

- Public read access to `macroinvertebrate_hatches`
- Public read access to `waterway_hatches`

### Rollback

```sql
-- Remove seasonal columns from water_body_details
ALTER TABLE water_body_details
DROP COLUMN IF EXISTS best_seasons,
DROP COLUMN IF EXISTS spring_notes,
DROP COLUMN IF EXISTS summer_notes,
DROP COLUMN IF EXISTS fall_notes,
DROP COLUMN IF EXISTS winter_notes,
DROP COLUMN IF EXISTS ice_fishing,
DROP COLUMN IF EXISTS spring_stocking,
DROP COLUMN IF EXISTS fall_stocking,
DROP COLUMN IF EXISTS avg_water_temp_spring_f,
DROP COLUMN IF EXISTS avg_water_temp_summer_f,
DROP COLUMN IF EXISTS avg_water_temp_fall_f,
DROP COLUMN IF EXISTS avg_water_temp_winter_f;

-- Drop tables
DROP TABLE IF EXISTS waterway_hatches;
DROP TABLE IF EXISTS macroinvertebrate_hatches;
```

---

## Migration 028: Fly Fishing Experts and Shops

**File:** `supabase/migrations/028_fly_fishing_experts.sql`

### What It Does

Adds fly fishing expert knowledge system, including techniques, patterns, and comprehensive fly shop database.

### Tables Created

#### `fly_fishing_experts`
Stores expert information.

**Columns:**
- `id` (UUID, PK)
- `name` (TEXT) - Expert name
- `type` (TEXT) - `expert`, `shop`, `organization`
- `location` (TEXT)
- `region` (TEXT)
- `specialties` (TEXT[])
- `bio` (TEXT)
- `website` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `address` (TEXT)

#### `expert_techniques`
Stores expert techniques.

**Columns:**
- `id` (UUID, PK)
- `expert_id` (UUID, FK → fly_fishing_experts)
- `name` (TEXT) - Technique name
- `description` (TEXT)
- `water_types` (TEXT[])
- `best_seasons` (TEXT[])
- `difficulty` (TEXT) - `beginner`, `intermediate`, `advanced`
- `video_url` (TEXT)

#### `expert_patterns`
Stores expert fly patterns.

**Columns:**
- `id` (UUID, PK)
- `expert_id` (UUID, FK → fly_fishing_experts)
- `name` (TEXT) - Pattern name
- `pattern_type` (TEXT) - `dry-fly`, `nymph`, `streamer`, `wet-fly`, `terrestrial`
- `description` (TEXT)
- `target_species` (TEXT[])
- `best_seasons` (TEXT[])
- `hook_size` (TEXT)
- `materials` (TEXT[])
- `tying_instructions` (TEXT)

#### `expert_favorite_locations`
Stores expert favorite fishing locations.

**Columns:**
- `id` (UUID, PK)
- `expert_id` (UUID, FK → fly_fishing_experts)
- `field_site_id` (UUID, FK → field_sites)
- `waterway_name` (TEXT)
- `section` (TEXT)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `why` (TEXT)
- `best_seasons` (TEXT[])
- `techniques` (TEXT[])

#### `expert_publications`
Stores expert publications.

**Columns:**
- `id` (UUID, PK)
- `expert_id` (UUID, FK → fly_fishing_experts)
- `title` (TEXT)
- `publication_type` (TEXT) - `book`, `article`, `video`, `dvd`, `pattern`
- `year` (INTEGER)
- `url` (TEXT)
- `description` (TEXT)

#### `fly_fishing_shops`
Stores fly fishing shop information.

**Columns:**
- `id` (UUID, PK)
- `name` (TEXT)
- `location` (TEXT)
- `region` (TEXT)
- `address` (TEXT)
- `phone` (TEXT)
- `website` (TEXT)
- `email` (TEXT)
- `services` (TEXT[])
- `has_guides` (BOOLEAN)
- `has_fly_tying` (BOOLEAN)
- `has_classes` (BOOLEAN)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)

### Data Seeded

#### Joe Humphreys
- **4 techniques:**
  - High-Stick Nymphing
  - Leisenring Lift
  - Streamer Techniques
  - Dry Fly Presentation

- **3 patterns:**
  - Joe's Hopper
  - Humphreys Nymph
  - State College Special

- **3 publications:**
  - Trout Tactics (1981)
  - Joe Humphreys's Fly-Fishing Tactics (1993)
  - High-Stick Nymphing Video

- **3 favorite locations:**
  - Spring Creek (Fisherman's Paradise)
  - Penns Creek
  - Yellow Breeches Creek

#### George Daniel
- **4 techniques:**
  - French Nymphing
  - Czech Nymphing
  - Tight-Line Nymphing
  - Competition Techniques

- **3 patterns:**
  - Perdigon
  - Squirmy Wormy
  - Competition Nymphs

- **3 publications:**
  - Dynamic Nymphing (2011)
  - Strip-Set (2015)
  - Modern Nymphing Techniques (video)

- **2 favorite locations:**
  - Spring Creek (Fisherman's Paradise)
  - Yellow Breeches Creek

#### Fly Shops
- **10 fly fishing shops** across PA

#### Trout Unlimited
- **7 Trout Unlimited chapters**

### RLS Policies

- Public read access to all expert-related tables
- Public read access to `fly_fishing_shops`

### Rollback

```sql
-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS expert_publications;
DROP TABLE IF EXISTS expert_favorite_locations;
DROP TABLE IF EXISTS expert_patterns;
DROP TABLE IF EXISTS expert_techniques;
DROP TABLE IF EXISTS fly_fishing_shops;
DROP TABLE IF EXISTS fly_fishing_experts;
```

---

## Migration 029: PFBC Mapping Layers

**File:** `supabase/migrations/029_pfbc_mapping_layers.sql`

### What It Does

Adds PFBC mapping layer data: trout stream classifications, bass waters, and species designations.

### Tables Created

#### `pfbc_trout_streams`
Stores PFBC trout stream classifications.

**Columns:**
- `id` (UUID, PK)
- `field_site_id` (UUID, FK → field_sites)
- `name` (TEXT)
- `classification` (TEXT) - `Class A`, `Wild Trout`, `Stocked`, `Catch & Release`, `Delayed Harvest`, `Trophy Trout`, `Special Regulation`
- `county` (TEXT)
- `region` (TEXT)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `section` (TEXT)
- `regulations` (TEXT)
- `species` (TEXT[])
- `notes` (TEXT)

#### `pfbc_bass_waters`
Stores PFBC bass water designations.

**Columns:**
- `id` (UUID, PK)
- `field_site_id` (UUID, FK → field_sites)
- `name` (TEXT)
- `classification` (TEXT) - `Best Bass Water`, `Bass Water`, `Trophy Bass`, `Largemouth Bass`, `Smallmouth Bass`
- `county` (TEXT)
- `region` (TEXT)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `species` (TEXT[])
- `notes` (TEXT)

#### `pfbc_other_species_waters`
Stores PFBC other species water designations.

**Columns:**
- `id` (UUID, PK)
- `field_site_id` (UUID, FK → field_sites)
- `name` (TEXT)
- `species` (TEXT)
- `classification` (TEXT)
- `county` (TEXT)
- `region` (TEXT)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `notes` (TEXT)

### Schema Changes

**`fly_fishing_shops` table additions:**
- `specialties` (TEXT[])
- `notes` (TEXT)

### Data Seeded

- **10 Class A trout streams**
- **4 Wild Trout streams**
- **3 Delayed Harvest streams**
- **2 Trophy Trout streams**
- **10 Best Bass Waters**
- **7 Other Species Waters** (Walleye, Muskie, Steelhead)

### RLS Policies

- Public read access to all PFBC mapping layer tables

### Rollback

```sql
-- Drop tables
DROP TABLE IF EXISTS pfbc_other_species_waters;
DROP TABLE IF EXISTS pfbc_bass_waters;
DROP TABLE IF EXISTS pfbc_trout_streams;

-- Remove columns from fly_fishing_shops
ALTER TABLE fly_fishing_shops
DROP COLUMN IF EXISTS specialties,
DROP COLUMN IF EXISTS notes;
```

---

## Migration 030: Complete PFBC Integration

**File:** `supabase/migrations/030_pfbc_complete_integration.sql`

### What It Does

Adds complete PFBC data integration: stocking schedules, access points, regulations, and habitat installations.

### Tables Created

#### `pfbc_stocking_schedules`
Stores PFBC stocking schedule data.

**Columns:**
- `id` (UUID, PK)
- `field_site_id` (UUID, FK → field_sites)
- `waterway_name` (TEXT)
- `county` (TEXT)
- `region` (TEXT)
- `species` (TEXT)
- `stocking_date` (DATE)
- `quantity` (INTEGER)
- `size_class` (TEXT) - `Fingerling`, `Adult`, `Trophy`
- `average_length` (DOUBLE PRECISION)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `notes` (TEXT)

#### `pfbc_access_points`
Stores PFBC access point data.

**Columns:**
- `id` (UUID, PK)
- `field_site_id` (UUID, FK → field_sites)
- `waterway_name` (TEXT)
- `name` (TEXT)
- `access_type` (TEXT) - `Boat Launch`, `Shore Access`, `Wade Access`, `Fly Fishing Only`, `Handicap Accessible`
- `county` (TEXT)
- `region` (TEXT)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `amenities` (TEXT[])
- `parking` (BOOLEAN)
- `wheelchair_accessible` (BOOLEAN)
- `notes` (TEXT)

#### `pfbc_regulations`
Stores PFBC fishing regulations.

**Columns:**
- `id` (UUID, PK)
- `field_site_id` (UUID, FK → field_sites)
- `waterway_name` (TEXT)
- `regulation_type` (TEXT) - `Catch & Release`, `Delayed Harvest`, `Trophy Trout`, `Special Regulation`, `Size Limit`, `Creel Limit`
- `description` (TEXT)
- `season` (TEXT)
- `species` (TEXT[])
- `notes` (TEXT)

#### `pfbc_habitat_installations`
Stores PFBC habitat installation data.

**Columns:**
- `id` (UUID, PK)
- `field_site_id` (UUID, FK → field_sites)
- `waterway_name` (TEXT)
- `installation_type` (TEXT) - `Lunker Structure`, `Fish Attractor`, `Habitat Enhancement`, `Spawning Bed`, `Cover Structure`
- `county` (TEXT)
- `region` (TEXT)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `installation_date` (DATE)
- `target_species` (TEXT[])
- `description` (TEXT)

### Data Seeded

- **13 stocking schedules** (trout, bass, muskie, walleye)
- **15 access points** (boat launches, shore access, wade access)
- **8 regulations** (catch & release, delayed harvest, trophy trout, size limits)
- **7 habitat installations** (lunker structures, fish attractors, spawning beds)

### RLS Policies

- Public read access to all PFBC data tables

### Rollback

```sql
-- Drop tables
DROP TABLE IF EXISTS pfbc_habitat_installations;
DROP TABLE IF EXISTS pfbc_regulations;
DROP TABLE IF EXISTS pfbc_access_points;
DROP TABLE IF EXISTS pfbc_stocking_schedules;
```

---

## Running Migrations

### In Supabase Dashboard

1. Open Supabase SQL Editor
2. Copy contents of migration file
3. Run migration
4. Verify tables created and data seeded

### Migration Order

```bash
# Run migrations in order:
1. 027_seasonal_waterway_data.sql
2. 028_fly_fishing_experts.sql
3. 029_pfbc_mapping_layers.sql
4. 030_pfbc_complete_integration.sql
```

### Verification

After running migrations, verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'macroinvertebrate_hatches',
  'waterway_hatches',
  'fly_fishing_experts',
  'expert_techniques',
  'expert_patterns',
  'fly_fishing_shops',
  'pfbc_trout_streams',
  'pfbc_bass_waters',
  'pfbc_stocking_schedules',
  'pfbc_access_points',
  'pfbc_regulations',
  'pfbc_habitat_installations'
);

-- Check data counts
SELECT 
  (SELECT COUNT(*) FROM macroinvertebrate_hatches) as hatches,
  (SELECT COUNT(*) FROM fly_fishing_experts) as experts,
  (SELECT COUNT(*) FROM fly_fishing_shops) as shops,
  (SELECT COUNT(*) FROM pfbc_stocking_schedules) as stocking,
  (SELECT COUNT(*) FROM pfbc_access_points) as access_points;
```

---

## Post-Migration Tasks

1. **Update API Routes** - Ensure API routes use new tables
2. **Test Endpoints** - Verify all endpoints return correct data
3. **Update Documentation** - Update API documentation with new endpoints
4. **Sync PFBC Data** - Set up sync with PFBC API for production (see `supabase/functions/sync-pfbc-stocking/`)

---

## Troubleshooting

### Common Issues

**Issue:** Migration fails with constraint violation
- **Solution:** Ensure prerequisite migrations (003, 005, 012) are run first

**Issue:** RLS policies prevent data access
- **Solution:** Verify RLS policies are created correctly

**Issue:** Missing data after migration
- **Solution:** Check migration logs for errors, verify seed data inserts

---

## Support

For migration issues, contact: stringtheorysolutionsllc@gmail.com


