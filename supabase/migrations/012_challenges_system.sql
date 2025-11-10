-- Challenges System Migration
-- Daily/Weekly/Seasonal challenges for habit formation

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Challenges Table
-- ============================================================================

CREATE TYPE challenge_type AS ENUM ('daily', 'weekly', 'seasonal', 'special');
CREATE TYPE challenge_metric AS ENUM (
  'check_ins',
  'observations',
  'species_count',
  'sites_visited',
  'distance_traveled',
  'photos_taken',
  'consecutive_days'
);

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Challenge Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  challenge_type challenge_type NOT NULL,
  
  -- Requirements
  target_metric challenge_metric NOT NULL,
  target_count INT NOT NULL DEFAULT 1,
  
  -- Rewards
  reward_points INT NOT NULL DEFAULT 0,
  reward_badge_id UUID,
  
  -- Timing
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active BOOLEAN DEFAULT true,
  
  -- Metadata
  difficulty VARCHAR(20) DEFAULT 'easy', -- easy, medium, hard
  icon TEXT DEFAULT '🎯',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_challenges_active ON challenges(active);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX idx_challenges_type ON challenges(challenge_type);

-- ============================================================================
-- User Challenge Progress Table
-- ============================================================================

CREATE TABLE user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  
  -- Progress Tracking
  current_progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Rewards
  rewards_claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_user_progress_user ON user_challenge_progress(user_id);
CREATE INDEX idx_user_progress_challenge ON user_challenge_progress(challenge_id);
CREATE INDEX idx_user_progress_completed ON user_challenge_progress(completed);

-- ============================================================================
-- Functions
-- ============================================================================

-- Get active challenges for a user with their progress
CREATE OR REPLACE FUNCTION get_active_challenges(p_user_id UUID)
RETURNS TABLE (
  challenge_id UUID,
  title VARCHAR,
  description TEXT,
  challenge_type challenge_type,
  target_metric challenge_metric,
  target_count INT,
  reward_points INT,
  icon TEXT,
  difficulty VARCHAR,
  start_date DATE,
  end_date DATE,
  current_progress INT,
  completed BOOLEAN,
  progress_percent FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.challenge_type,
    c.target_metric,
    c.target_count,
    c.reward_points,
    c.icon,
    c.difficulty,
    c.start_date,
    c.end_date,
    COALESCE(ucp.current_progress, 0) as current_progress,
    COALESCE(ucp.completed, false) as completed,
    (COALESCE(ucp.current_progress, 0)::FLOAT / c.target_count::FLOAT * 100) as progress_percent
  FROM challenges c
  LEFT JOIN user_challenge_progress ucp ON c.id = ucp.challenge_id AND ucp.user_id = p_user_id
  WHERE c.active = true
    AND c.start_date <= CURRENT_DATE
    AND c.end_date >= CURRENT_DATE
  ORDER BY c.challenge_type, c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Update challenge progress
CREATE OR REPLACE FUNCTION update_challenge_progress(
  p_user_id UUID,
  p_challenge_id UUID,
  p_increment INT DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  v_target_count INT;
  v_new_progress INT;
BEGIN
  -- Get target count
  SELECT target_count INTO v_target_count
  FROM challenges
  WHERE id = p_challenge_id;
  
  -- Insert or update progress
  INSERT INTO user_challenge_progress (user_id, challenge_id, current_progress, completed, updated_at)
  VALUES (p_user_id, p_challenge_id, p_increment, false, NOW())
  ON CONFLICT (user_id, challenge_id)
  DO UPDATE SET 
    current_progress = user_challenge_progress.current_progress + p_increment,
    completed = CASE 
      WHEN (user_challenge_progress.current_progress + p_increment) >= v_target_count THEN true
      ELSE false
    END,
    completed_at = CASE 
      WHEN (user_challenge_progress.current_progress + p_increment) >= v_target_count AND user_challenge_progress.completed_at IS NULL 
      THEN NOW()
      ELSE user_challenge_progress.completed_at
    END,
    updated_at = NOW();
  
  -- Get new progress
  SELECT current_progress INTO v_new_progress
  FROM user_challenge_progress
  WHERE user_id = p_user_id AND challenge_id = p_challenge_id;
  
  -- Award points if completed
  IF v_new_progress >= v_target_count THEN
    -- Update user points (assuming you have a function or trigger for this)
    -- This is a placeholder - adjust based on your points system
    NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Claim challenge rewards
CREATE OR REPLACE FUNCTION claim_challenge_rewards(
  p_user_id UUID,
  p_challenge_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_reward_points INT;
  v_completed BOOLEAN;
  v_already_claimed BOOLEAN;
  v_result JSON;
BEGIN
  -- Check if challenge is completed and not yet claimed
  SELECT 
    ucp.completed,
    ucp.rewards_claimed,
    c.reward_points
  INTO v_completed, v_already_claimed, v_reward_points
  FROM user_challenge_progress ucp
  JOIN challenges c ON c.id = ucp.challenge_id
  WHERE ucp.user_id = p_user_id AND ucp.challenge_id = p_challenge_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Challenge progress not found');
  END IF;
  
  IF NOT v_completed THEN
    RETURN json_build_object('success', false, 'error', 'Challenge not completed');
  END IF;
  
  IF v_already_claimed THEN
    RETURN json_build_object('success', false, 'error', 'Rewards already claimed');
  END IF;
  
  -- Mark as claimed
  UPDATE user_challenge_progress
  SET rewards_claimed = true, claimed_at = NOW()
  WHERE user_id = p_user_id AND challenge_id = p_challenge_id;
  
  -- Award points
  -- TODO: Update your points system here
  
  RETURN json_build_object(
    'success', true,
    'points_awarded', v_reward_points
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Seed Data: Sample Challenges
-- ============================================================================

-- Daily Challenges
INSERT INTO challenges (title, description, challenge_type, target_metric, target_count, reward_points, difficulty, icon, start_date, end_date, active) VALUES
('Daily Explorer', 'Visit 1 new site today', 'daily', 'check_ins', 1, 50, 'easy', '📍', CURRENT_DATE, CURRENT_DATE, true),
('Photo Journal', 'Take 3 wildlife photos today', 'daily', 'photos_taken', 3, 75, 'easy', '📸', CURRENT_DATE, CURRENT_DATE, true),
('Species Spotter', 'Observe 2 different species today', 'daily', 'species_count', 2, 100, 'medium', '🔍', CURRENT_DATE, CURRENT_DATE, true);

-- Weekly Challenges
INSERT INTO challenges (title, description, challenge_type, target_metric, target_count, reward_points, difficulty, icon, start_date, end_date, active) VALUES
('Weekly Wanderer', 'Check in at 5 different sites this week', 'weekly', 'check_ins', 5, 250, 'medium', '🚶', DATE_TRUNC('week', CURRENT_DATE), DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days', true),
('Observation Master', 'Record 10 observations this week', 'weekly', 'observations', 10, 300, 'medium', '📝', DATE_TRUNC('week', CURRENT_DATE), DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days', true),
('Dedication Badge', 'Check in 3 days in a row', 'weekly', 'consecutive_days', 3, 400, 'hard', '🔥', DATE_TRUNC('week', CURRENT_DATE), DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days', true);

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- Everyone can view active challenges
CREATE POLICY "Challenges are viewable by everyone"
  ON challenges FOR SELECT
  USING (active = true);

-- Users can view their own progress
CREATE POLICY "Users can view their own challenge progress"
  ON user_challenge_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own progress (via functions only)
CREATE POLICY "Users can update their own challenge progress"
  ON user_challenge_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own challenge progress"
  ON user_challenge_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Teachers and admins can view all progress
CREATE POLICY "Teachers can view all student progress"
  ON user_challenge_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- Triggers
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_challenge_progress_updated_at
  BEFORE UPDATE ON user_challenge_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE challenges IS 'Daily, weekly, and seasonal challenges for user engagement';
COMMENT ON TABLE user_challenge_progress IS 'Tracks individual user progress on challenges';
COMMENT ON FUNCTION get_active_challenges IS 'Returns all active challenges with user progress';
COMMENT ON FUNCTION update_challenge_progress IS 'Increments progress on a challenge for a user';
COMMENT ON FUNCTION claim_challenge_rewards IS 'Claims rewards for a completed challenge';

