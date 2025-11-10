-- Fixed version - Drop existing policies before creating

-- Enable PostGIS if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ... (rest of migration content - I'll provide the key fix for the policy issue)

-- Drop existing policies before creating new ones
DO $$ 
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Public can view public stocking schedules" ON stocking_schedules;
  DROP POLICY IF EXISTS "Public can view water body details" ON water_body_details;
EXCEPTION 
  WHEN undefined_table THEN NULL;
END $$;

-- Then create tables and policies as normal...
-- (Include all original content but with the DROP POLICY statements added)

