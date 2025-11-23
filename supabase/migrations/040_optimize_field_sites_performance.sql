-- Performance optimization for field sites queries
-- Creates PostGIS function for efficient distance-based queries

-- Create function to get nearby field sites using PostGIS
CREATE OR REPLACE FUNCTION get_nearby_field_sites(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  max_distance_meters INTEGER DEFAULT 50000,
  result_limit INTEGER DEFAULT 100,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  site_type TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  city TEXT,
  state TEXT,
  ecological_notes TEXT,
  species_commonly_found TEXT[],
  habitat_types TEXT[],
  distance_meters INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.id,
    fs.name,
    fs.description,
    fs.site_type,
    fs.latitude,
    fs.longitude,
    fs.address,
    fs.city,
    fs.state,
    fs.ecological_notes,
    fs.species_commonly_found,
    fs.habitat_types,
    ROUND(
      ST_Distance(
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
        ST_SetSRID(ST_MakePoint(fs.longitude, fs.latitude), 4326)::geography
      )
    )::INTEGER AS distance_meters
  FROM field_sites fs
  WHERE 
    fs.latitude IS NOT NULL 
    AND fs.longitude IS NOT NULL
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(fs.longitude, fs.latitude), 4326)::geography,
      max_distance_meters
    )
  ORDER BY distance_meters ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;

-- Create index on latitude/longitude for faster queries
CREATE INDEX IF NOT EXISTS idx_field_sites_location 
ON field_sites(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create GIST index for PostGIS geography queries (if PostGIS extension is enabled)
-- This will be created automatically if PostGIS is enabled, but we'll try to create it
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    CREATE INDEX IF NOT EXISTS idx_field_sites_geography 
    ON field_sites 
    USING GIST (CAST(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) AS geography))
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
  END IF;
END $$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_nearby_field_sites TO authenticated;
GRANT EXECUTE ON FUNCTION get_nearby_field_sites TO anon;

