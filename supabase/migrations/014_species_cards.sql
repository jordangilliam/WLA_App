-- Species Collection Cards System Migration
-- Pokemon-style trading cards for PA wildlife

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Species Cards Table
-- ============================================================================

CREATE TYPE species_category AS ENUM (
  'bird',
  'mammal',
  'fish',
  'reptile',
  'amphibian',
  'insect',
  'plant',
  'fungi'
);

CREATE TYPE card_rarity AS ENUM (
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary'
);

CREATE TABLE species_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Species Information
  species_name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  category species_category NOT NULL,
  
  -- Card Properties
  rarity card_rarity DEFAULT 'common',
  card_number INT UNIQUE, -- Collection number (e.g., 001-150)
  
  -- Visual
  card_image_url TEXT,
  icon_emoji TEXT DEFAULT '🐾',
  primary_color VARCHAR(7), -- Hex color for card background
  
  -- Information
  habitat TEXT[],
  diet VARCHAR(100),
  size_description VARCHAR(255),
  fun_facts JSONB DEFAULT '[]'::jsonb,
  conservation_status VARCHAR(50),
  pa_native BOOLEAN DEFAULT true,
  seasons_active TEXT[], -- When most likely to see
  
  -- Discovery
  discovery_points INT DEFAULT 10,
  observation_requirements JSONB, -- e.g., {"min_photos": 1, "verified": false}
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_species_cards_category ON species_cards(category);
CREATE INDEX idx_species_cards_rarity ON species_cards(rarity);
CREATE INDEX idx_species_cards_number ON species_cards(card_number);

-- ============================================================================
-- User Species Collection Table
-- ============================================================================

CREATE TABLE user_species_collection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  species_card_id UUID NOT NULL REFERENCES species_cards(id) ON DELETE CASCADE,
  
  -- Collection Status
  first_observed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  observation_count INT DEFAULT 1,
  favorite BOOLEAN DEFAULT false,
  
  -- User Notes
  personal_notes TEXT,
  best_photo_url TEXT,
  best_location TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, species_card_id)
);

CREATE INDEX idx_user_collection_user ON user_species_collection(user_id);
CREATE INDEX idx_user_collection_species ON user_species_collection(species_card_id);
CREATE INDEX idx_user_collection_favorite ON user_species_collection(favorite) WHERE favorite = true;

-- ============================================================================
-- Functions
-- ============================================================================

-- Get user's collection with progress
CREATE OR REPLACE FUNCTION get_user_species_collection(p_user_id UUID)
RETURNS TABLE (
  species_card_id UUID,
  card_number INT,
  common_name VARCHAR,
  scientific_name VARCHAR,
  category species_category,
  rarity card_rarity,
  icon_emoji TEXT,
  card_image_url TEXT,
  primary_color VARCHAR,
  collected BOOLEAN,
  observation_count INT,
  first_observed_at TIMESTAMP WITH TIME ZONE,
  favorite BOOLEAN,
  discovery_points INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.card_number,
    sc.common_name,
    sc.scientific_name,
    sc.category,
    sc.rarity,
    sc.icon_emoji,
    sc.card_image_url,
    sc.primary_color,
    (usc.id IS NOT NULL) as collected,
    COALESCE(usc.observation_count, 0) as observation_count,
    usc.first_observed_at,
    COALESCE(usc.favorite, false) as favorite,
    sc.discovery_points
  FROM species_cards sc
  LEFT JOIN user_species_collection usc ON usc.species_card_id = sc.id AND usc.user_id = p_user_id
  ORDER BY sc.card_number;
END;
$$ LANGUAGE plpgsql;

-- Discover a new species (add to collection)
CREATE OR REPLACE FUNCTION discover_species(
  p_user_id UUID,
  p_species_card_id UUID,
  p_photo_url TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_card RECORD;
  v_already_collected BOOLEAN;
  v_result JSON;
BEGIN
  -- Get species card info
  SELECT * INTO v_card
  FROM species_cards
  WHERE id = p_species_card_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Species card not found');
  END IF;
  
  -- Check if already collected
  SELECT EXISTS(
    SELECT 1 FROM user_species_collection
    WHERE user_id = p_user_id AND species_card_id = p_species_card_id
  ) INTO v_already_collected;
  
  IF v_already_collected THEN
    -- Increment observation count
    UPDATE user_species_collection
    SET 
      observation_count = observation_count + 1,
      best_photo_url = COALESCE(p_photo_url, best_photo_url),
      best_location = COALESCE(p_location, best_location),
      updated_at = NOW()
    WHERE user_id = p_user_id AND species_card_id = p_species_card_id;
    
    RETURN json_build_object(
      'success', true,
      'new_discovery', false,
      'observation_count', (SELECT observation_count FROM user_species_collection WHERE user_id = p_user_id AND species_card_id = p_species_card_id)
    );
  ELSE
    -- Add to collection
    INSERT INTO user_species_collection (
      user_id,
      species_card_id,
      observation_count,
      best_photo_url,
      best_location
    ) VALUES (
      p_user_id,
      p_species_card_id,
      1,
      p_photo_url,
      p_location
    );
    
    -- TODO: Award discovery points to user
    
    RETURN json_build_object(
      'success', true,
      'new_discovery', true,
      'species_name', v_card.common_name,
      'rarity', v_card.rarity,
      'points_earned', v_card.discovery_points,
      'icon', v_card.icon_emoji
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Get collection stats
CREATE OR REPLACE FUNCTION get_collection_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_total INT;
  v_collected INT;
  v_by_category JSON;
  v_by_rarity JSON;
BEGIN
  SELECT COUNT(*) INTO v_total FROM species_cards;
  SELECT COUNT(*) INTO v_collected FROM user_species_collection WHERE user_id = p_user_id;
  
  -- Stats by category
  SELECT json_object_agg(category, collected_count)
  INTO v_by_category
  FROM (
    SELECT 
      sc.category,
      COUNT(usc.id) as collected_count
    FROM species_cards sc
    LEFT JOIN user_species_collection usc ON usc.species_card_id = sc.id AND usc.user_id = p_user_id
    GROUP BY sc.category
  ) cat_stats;
  
  -- Stats by rarity
  SELECT json_object_agg(rarity, collected_count)
  INTO v_by_rarity
  FROM (
    SELECT 
      sc.rarity,
      COUNT(usc.id) as collected_count
    FROM species_cards sc
    LEFT JOIN user_species_collection usc ON usc.species_card_id = sc.id AND usc.user_id = p_user_id
    GROUP BY sc.rarity
  ) rarity_stats;
  
  RETURN json_build_object(
    'total', v_total,
    'collected', v_collected,
    'percentage', ROUND((v_collected::FLOAT / v_total::FLOAT * 100)::NUMERIC, 1),
    'by_category', v_by_category,
    'by_rarity', v_by_rarity
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Seed Data: PA Species Cards
-- ============================================================================

-- Birds (Common)
INSERT INTO species_cards (card_number, species_name, common_name, scientific_name, category, rarity, icon_emoji, habitat, diet, size_description, conservation_status, pa_native, seasons_active, discovery_points, fun_facts) VALUES
(1, 'Eastern Bluebird', 'Eastern Bluebird', 'Sialia sialis', 'bird', 'common', '🐦', ARRAY['open fields', 'parks', 'gardens'], 'Insects', '6-8 inches', 'Least Concern', true, ARRAY['spring', 'summer', 'fall'], 10, '[{"fact": "The male has bright blue plumage!"}, {"fact": "They nest in cavities and birdhouses"}]'::jsonb),
(2, 'American Robin', 'American Robin', 'Turdus migratorius', 'bird', 'common', '🐦', ARRAY['lawns', 'parks', 'forests'], 'Worms & Berries', '9-11 inches', 'Least Concern', true, ARRAY['spring', 'summer', 'fall'], 10, '[{"fact": "One of the first birds to sing at dawn"}, {"fact": "Can eat up to 14 feet of earthworms per day!"}]'::jsonb),
(3, 'Northern Cardinal', 'Northern Cardinal', 'Cardinalis cardinalis', 'bird', 'common', '🐦', ARRAY['woodlands', 'gardens', 'shrublands'], 'Seeds', '8-9 inches', 'Least Concern', true, ARRAY['all year'], 10, '[{"fact": "Males are bright red, females are tan"}, {"fact": "Both male and female sing!"}]'::jsonb);

-- Birds (Uncommon)
INSERT INTO species_cards (card_number, species_name, common_name, scientific_name, category, rarity, icon_emoji, habitat, diet, size_description, conservation_status, pa_native, seasons_active, discovery_points, fun_facts) VALUES
(10, 'Red-tailed Hawk', 'Red-tailed Hawk', 'Buteo jamaicensis', 'bird', 'uncommon', '🦅', ARRAY['open fields', 'forests', 'urban areas'], 'Small mammals', '18-26 inches', 'Least Concern', true, ARRAY['all year'], 25, '[{"fact": "Can see a mouse from 100 feet in the air!"}, {"fact": "Their scream is used in movies for all hawks"}]'::jsonb);

-- Birds (Rare)
INSERT INTO species_cards (card_number, species_name, common_name, scientific_name, category, rarity, icon_emoji, habitat, diet, size_description, conservation_status, pa_native, seasons_active, discovery_points, fun_facts) VALUES
(20, 'Bald Eagle', 'Bald Eagle', 'Haliaeetus leucocephalus', 'bird', 'rare', '🦅', ARRAY['rivers', 'lakes', 'coastlines'], 'Fish', '28-38 inches', 'Least Concern', true, ARRAY['all year'], 50, '[{"fact": "Americas national bird since 1782"}, {"fact": "Can dive at speeds up to 100 mph!"}]'::jsonb);

-- Mammals (Common)
INSERT INTO species_cards (card_number, species_name, common_name, scientific_name, category, rarity, icon_emoji, habitat, diet, size_description, conservation_status, pa_native, seasons_active, discovery_points, fun_facts) VALUES
(30, 'Eastern Gray Squirrel', 'Gray Squirrel', 'Sciurus carolinensis', 'mammal', 'common', '🐿️', ARRAY['forests', 'parks', 'urban areas'], 'Nuts & Seeds', '9-12 inches', 'Least Concern', true, ARRAY['all year'], 10, '[{"fact": "They forget where they bury 25% of their nuts"}, {"fact": "This helps plant new trees!"}]'::jsonb),
(31, 'White-tailed Deer', 'White-tailed Deer', 'Odocoileus virginianus', 'mammal', 'common', '🦌', ARRAY['forests', 'fields', 'suburbs'], 'Plants', '5-7 feet long', 'Least Concern', true, ARRAY['all year'], 15, '[{"fact": "Can jump 8 feet high and 30 feet long"}, {"fact": "Males grow new antlers every year"}]'::jsonb);

-- Mammals (Epic)
INSERT INTO species_cards (card_number, species_name, common_name, scientific_name, category, rarity, icon_emoji, habitat, diet, size_description, conservation_status, pa_native, seasons_active, discovery_points, fun_facts) VALUES
(40, 'Black Bear', 'Black Bear', 'Ursus americanus', 'mammal', 'epic', '🐻', ARRAY['forests', 'mountains'], 'Omnivore', '5-6 feet long', 'Least Concern', true, ARRAY['spring', 'summer', 'fall'], 100, '[{"fact": "Despite the name, they can be brown or cinnamon colored"}, {"fact": "Can run up to 30 mph!"}]'::jsonb);

-- Fish (Common)
INSERT INTO species_cards (card_number, species_name, common_name, scientific_name, category, rarity, icon_emoji, habitat, diet, size_description, conservation_status, pa_native, seasons_active, discovery_points, fun_facts) VALUES
(50, 'Bluegill', 'Bluegill', 'Lepomis macrochirus', 'fish', 'common', '🐟', ARRAY['lakes', 'ponds', 'slow streams'], 'Insects', '6-8 inches', 'Least Concern', true, ARRAY['spring', 'summer', 'fall'], 10, '[{"fact": "They can change color based on mood!"}, {"fact": "Males create nests in shallow water"}]'::jsonb);

-- Fish (Rare)
INSERT INTO species_cards (card_number, species_name, common_name, scientific_name, category, rarity, icon_emoji, habitat, diet, size_description, conservation_status, pa_native, seasons_active, discovery_points, fun_facts) VALUES
(51, 'Brook Trout', 'Brook Trout', 'Salvelinus fontinalis', 'fish', 'rare', '🐟', ARRAY['cold streams', 'mountain lakes'], 'Insects', '10-14 inches', 'Vulnerable', true, ARRAY['spring', 'summer', 'fall'], 50, '[{"fact": "PAs official state fish!"}, {"fact": "Need very clean, cold water to survive"}]'::jsonb);

-- Insects (Common)
INSERT INTO species_cards (card_number, species_name, common_name, scientific_name, category, rarity, icon_emoji, habitat, diet, size_description, conservation_status, pa_native, seasons_active, discovery_points, fun_facts) VALUES
(60, 'Monarch Butterfly', 'Monarch Butterfly', 'Danaus plexippus', 'insect', 'uncommon', '🦋', ARRAY['fields', 'gardens', 'meadows'], 'Nectar', '3-4 inch wingspan', 'Vulnerable', true, ARRAY['summer', 'fall'], 25, '[{"fact": "Migrates 3000 miles to Mexico!"}, {"fact": "Orange color warns predators theyre toxic"}]'::jsonb);

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE species_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_species_collection ENABLE ROW LEVEL SECURITY;

-- Everyone can view species cards
CREATE POLICY "Species cards are viewable by everyone"
  ON species_cards FOR SELECT
  USING (true);

-- Users can view their own collection
CREATE POLICY "Users can view their own collection"
  ON user_species_collection FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own collection
CREATE POLICY "Users can insert into their own collection"
  ON user_species_collection FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collection"
  ON user_species_collection FOR UPDATE
  USING (auth.uid() = user_id);

-- Teachers can view their students' collections
CREATE POLICY "Teachers can view student collections"
  ON user_species_collection FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN classes c ON c.teacher_id = u.id
      JOIN class_enrollments ce ON ce.class_id = c.id
      WHERE u.id = auth.uid()
        AND ce.student_id = user_species_collection.user_id
    )
  );

-- ============================================================================
-- Triggers
-- ============================================================================

CREATE TRIGGER update_species_cards_updated_at
  BEFORE UPDATE ON species_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_species_collection_updated_at
  BEFORE UPDATE ON user_species_collection
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE species_cards IS 'Pokemon-style trading cards for PA wildlife';
COMMENT ON TABLE user_species_collection IS 'Tracks which species each user has discovered';
COMMENT ON FUNCTION get_user_species_collection IS 'Returns all species cards with collection status for a user';
COMMENT ON FUNCTION discover_species IS 'Adds a new species to users collection or increments observation count';
COMMENT ON FUNCTION get_collection_stats IS 'Returns collection progress statistics for a user';

