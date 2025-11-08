-- Achievement system for FieldQuest
-- Tracks player milestones, badges, and accomplishments

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- Emoji or icon identifier
  category TEXT NOT NULL CHECK (category IN ('collection', 'exploration', 'social', 'skill', 'special')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  
  -- Requirements
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('species_count', 'sites_visited', 'total_catches', 'xp_earned', 'level_reached', 'event_participated', 'streak_days', 'rarity_caught', 'specific_species', 'specific_site')),
  requirement_value INTEGER NOT NULL,
  requirement_data JSONB, -- Additional requirement details
  
  -- Rewards
  xp_reward INTEGER DEFAULT 0,
  title_reward TEXT, -- Special title unlocked
  
  -- Metadata
  is_hidden BOOLEAN DEFAULT false, -- Hidden until unlocked
  is_repeatable BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);

-- User achievement unlocks
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0, -- Current progress towards requirement
  completed BOOLEAN DEFAULT false,
  notified BOOLEAN DEFAULT false, -- Whether user was notified
  
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_completed ON user_achievements(user_id, completed);

-- Seed initial achievements
INSERT INTO achievements (name, title, description, icon, category, rarity, requirement_type, requirement_value, xp_reward) VALUES
  -- Collection Achievements
  ('first_catch', 'First Catch', 'Catch your first Pennsylvania species', '🎯', 'collection', 'common', 'total_catches', 1, 50),
  ('collector_10', 'Budding Naturalist', 'Catch 10 different species', '📖', 'collection', 'common', 'species_count', 10, 100),
  ('collector_25', 'Field Researcher', 'Catch 25 different species', '🔬', 'collection', 'uncommon', 'species_count', 25, 250),
  ('collector_50', 'Wildlife Expert', 'Catch 50 different species', '🎓', 'collection', 'rare', 'species_count', 50, 500),
  ('completionist', 'Master Naturalist', 'Complete your entire species collection', '👑', 'collection', 'legendary', 'species_count', 100, 2000),
  
  -- Rarity Achievements
  ('first_rare', 'Lucky Find', 'Catch your first rare species', '⭐', 'collection', 'uncommon', 'rarity_caught', 1, 150),
  ('first_epic', 'Epic Discovery', 'Catch your first epic species', '✨', 'collection', 'rare', 'rarity_caught', 2, 300),
  ('first_legendary', 'Legendary Hunter', 'Catch your first legendary species', '🏆', 'collection', 'epic', 'rarity_caught', 3, 500),
  
  -- Exploration Achievements
  ('explorer_5', 'Local Explorer', 'Visit 5 different field sites', '🗺️', 'exploration', 'common', 'sites_visited', 5, 100),
  ('explorer_15', 'Regional Explorer', 'Visit 15 different field sites', '🧭', 'exploration', 'uncommon', 'sites_visited', 15, 250),
  ('explorer_30', 'State Explorer', 'Visit 30 different field sites', '🌎', 'exploration', 'rare', 'sites_visited', 30, 500),
  ('explorer_50', 'Master Explorer', 'Visit 50 different field sites', '🚀', 'exploration', 'epic', 'sites_visited', 50, 1000),
  
  -- Library Achievements
  ('library_visitor', 'Library Visitor', 'Visit a Carnegie Library', '📚', 'exploration', 'common', 'specific_site', 1, 50),
  ('library_explorer', 'Library Explorer', 'Visit 5 Carnegie Libraries', '📖', 'exploration', 'uncommon', 'specific_site', 5, 200),
  ('library_master', 'Library Master', 'Visit all 16 Carnegie Libraries', '🏛️', 'exploration', 'legendary', 'specific_site', 16, 1000),
  
  -- Park Achievements
  ('park_ranger', 'Park Ranger', 'Visit 10 parks', '🏞️', 'exploration', 'uncommon', 'specific_site', 10, 200),
  ('trail_blazer', 'Trail Blazer', 'Visit 5 trails or greenways', '🥾', 'exploration', 'uncommon', 'specific_site', 5, 200),
  
  -- XP and Level Achievements
  ('level_5', 'Rising Star', 'Reach level 5', '⭐', 'skill', 'common', 'level_reached', 5, 100),
  ('level_10', 'Skilled Naturalist', 'Reach level 10', '🌟', 'skill', 'uncommon', 'level_reached', 10, 250),
  ('level_25', 'Expert Naturalist', 'Reach level 25', '✨', 'skill', 'rare', 'level_reached', 25, 500),
  ('level_50', 'Legendary Naturalist', 'Reach level 50', '👑', 'skill', 'legendary', 'level_reached', 50, 2000),
  
  -- Participation Achievements
  ('field_trip', 'Field Trip Participant', 'Participate in a teacher event', '🎓', 'social', 'common', 'event_participated', 1, 100),
  ('field_trip_5', 'Field Trip Enthusiast', 'Participate in 5 teacher events', '🎒', 'social', 'uncommon', 'event_participated', 5, 300),
  
  -- Catch Count Achievements
  ('catcher_100', 'Prolific Catcher', 'Catch 100 species total (including duplicates)', '🎯', 'skill', 'uncommon', 'total_catches', 100, 200),
  ('catcher_500', 'Master Catcher', 'Catch 500 species total', '🏅', 'skill', 'rare', 'total_catches', 500, 500),
  ('catcher_1000', 'Legendary Catcher', 'Catch 1000 species total', '🏆', 'skill', 'epic', 'total_catches', 1000, 1000),
  
  -- Special Achievements
  ('early_bird', 'Early Bird', 'Catch a species before 8 AM', '🌅', 'special', 'uncommon', 'specific_species', 1, 150),
  ('night_owl', 'Night Owl', 'Catch a species after 8 PM', '🌙', 'special', 'uncommon', 'specific_species', 1, 150),
  ('weekend_warrior', 'Weekend Warrior', 'Catch 20 species in one weekend', '💪', 'special', 'rare', 'total_catches', 20, 300),
  
  -- Pittsburgh Special
  ('pittsburgh_pride', 'Pittsburgh Pride', 'Visit 25 Pittsburgh field sites', '🏙️', 'exploration', 'rare', 'sites_visited', 25, 400),
  ('three_rivers', 'Three Rivers Explorer', 'Visit sites along all three rivers', '🌊', 'special', 'epic', 'specific_site', 3, 500);

-- RPC function to check and unlock achievements
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  unlocked_achievements JSON;
  achievement RECORD;
  user_progress RECORD;
  should_unlock BOOLEAN;
  current_value INTEGER;
BEGIN
  -- Get user stats
  SELECT
    (SELECT COUNT(DISTINCT species_id) FROM user_species WHERE user_id = p_user_id) as species_count,
    (SELECT COUNT(*) FROM user_species WHERE user_id = p_user_id) as total_catches,
    (SELECT sites_visited FROM users WHERE id = p_user_id) as sites_visited,
    (SELECT xp FROM users WHERE id = p_user_id) as xp,
    (SELECT level FROM users WHERE id = p_user_id) as level
  INTO user_progress;

  -- Array to collect newly unlocked achievements
  unlocked_achievements := '[]'::JSON;

  -- Check each achievement
  FOR achievement IN SELECT * FROM achievements LOOP
    should_unlock := false;
    current_value := 0;

    -- Determine if achievement should be unlocked based on type
    CASE achievement.requirement_type
      WHEN 'species_count' THEN
        current_value := user_progress.species_count;
        should_unlock := current_value >= achievement.requirement_value;
      
      WHEN 'total_catches' THEN
        current_value := user_progress.total_catches;
        should_unlock := current_value >= achievement.requirement_value;
      
      WHEN 'sites_visited' THEN
        current_value := user_progress.sites_visited;
        should_unlock := current_value >= achievement.requirement_value;
      
      WHEN 'level_reached' THEN
        current_value := user_progress.level;
        should_unlock := current_value >= achievement.requirement_value;
      
      WHEN 'xp_earned' THEN
        current_value := user_progress.xp;
        should_unlock := current_value >= achievement.requirement_value;
      
      ELSE
        current_value := 0;
    END CASE;

    -- Insert or update user achievement
    INSERT INTO user_achievements (user_id, achievement_id, progress, completed)
    VALUES (p_user_id, achievement.id, current_value, should_unlock)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = current_value,
        completed = should_unlock,
        unlocked_at = CASE WHEN should_unlock AND NOT user_achievements.completed THEN NOW() ELSE user_achievements.unlocked_at END;

    -- If newly unlocked, add to result and award XP
    IF should_unlock THEN
      SELECT * INTO user_progress FROM user_achievements WHERE user_id = p_user_id AND achievement_id = achievement.id;
      
      IF NOT user_progress.notified THEN
        -- Mark as notified
        UPDATE user_achievements SET notified = true WHERE id = user_progress.id;
        
        -- Award XP
        IF achievement.xp_reward > 0 THEN
          PERFORM increment_user_xp(p_user_id, achievement.xp_reward);
        END IF;
        
        -- Add to result
        unlocked_achievements := unlocked_achievements::JSONB || jsonb_build_object(
          'achievement', achievement,
          'unlocked_at', user_progress.unlocked_at
        )::JSONB;
      END IF;
    END IF;
  END LOOP;

  RETURN unlocked_achievements;
END;
$$;

-- Grant permissions
GRANT SELECT ON achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_achievements TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_unlock_achievements TO authenticated;

-- Migration complete
-- Created: achievements, user_achievements tables
-- Created: check_and_unlock_achievements RPC function
-- Seeded: 30+ initial achievements across all categories

