-- Class Leaderboards System Migration
-- Real-time class rankings and team competition

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Class Team Stats Table
-- ============================================================================

CREATE TABLE class_team_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Time Period
  week_start_date DATE NOT NULL,
  
  -- Aggregated Stats
  total_check_ins INT DEFAULT 0,
  total_observations INT DEFAULT 0,
  total_species INT DEFAULT 0,
  total_points INT DEFAULT 0,
  unique_sites_visited INT DEFAULT 0,
  active_students INT DEFAULT 0,
  
  -- Rankings
  rank_position INT,
  prev_week_rank INT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(class_id, week_start_date)
);

CREATE INDEX idx_class_stats_week ON class_team_stats(week_start_date DESC);
CREATE INDEX idx_class_stats_class ON class_team_stats(class_id);
CREATE INDEX idx_class_stats_rank ON class_team_stats(rank_position);

-- ============================================================================
-- Individual Student Leaderboard
-- ============================================================================

CREATE TABLE student_leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Time Period
  week_start_date DATE NOT NULL,
  
  -- Stats
  points_earned INT DEFAULT 0,
  check_ins INT DEFAULT 0,
  observations INT DEFAULT 0,
  species_count INT DEFAULT 0,
  
  -- Rankings
  global_rank INT,
  class_rank INT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, week_start_date)
);

CREATE INDEX idx_student_leaderboard_user ON student_leaderboard(user_id);
CREATE INDEX idx_student_leaderboard_week ON student_leaderboard(week_start_date DESC);
CREATE INDEX idx_student_leaderboard_global_rank ON student_leaderboard(global_rank);

-- ============================================================================
-- Functions
-- ============================================================================

-- Get class leaderboard for current week
CREATE OR REPLACE FUNCTION get_class_leaderboard(p_limit INT DEFAULT 10)
RETURNS TABLE (
  class_id UUID,
  class_name VARCHAR,
  teacher_name VARCHAR,
  total_points INT,
  total_check_ins INT,
  unique_sites INT,
  active_students INT,
  rank_position INT,
  rank_change INT
) AS $$
DECLARE
  v_week_start DATE := DATE_TRUNC('week', CURRENT_DATE)::DATE;
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    COALESCE(u.first_name || ' ' || u.last_name, u.email) as teacher_name,
    COALESCE(cts.total_points, 0) as total_points,
    COALESCE(cts.total_check_ins, 0) as total_check_ins,
    COALESCE(cts.unique_sites_visited, 0) as unique_sites,
    COALESCE(cts.active_students, 0) as active_students,
    COALESCE(cts.rank_position, 9999) as rank_position,
    COALESCE(cts.prev_week_rank - cts.rank_position, 0) as rank_change
  FROM classes c
  JOIN users u ON c.teacher_id = u.id
  LEFT JOIN class_team_stats cts ON cts.class_id = c.id AND cts.week_start_date = v_week_start
  WHERE c.active = true
  ORDER BY total_points DESC, total_check_ins DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get student leaderboard for a specific class
CREATE OR REPLACE FUNCTION get_student_leaderboard_by_class(
  p_class_id UUID,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  user_id UUID,
  student_name VARCHAR,
  points_earned INT,
  check_ins INT,
  observations INT,
  class_rank INT,
  rank_change INT
) AS $$
DECLARE
  v_week_start DATE := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  v_prev_week_start DATE := v_week_start - INTERVAL '7 days';
BEGIN
  RETURN QUERY
  WITH current_week AS (
    SELECT 
      u.id as user_id,
      COALESCE(u.first_name, 'Student') as student_name,
      COALESCE(sl.points_earned, 0) as points_earned,
      COALESCE(sl.check_ins, 0) as check_ins,
      COALESCE(sl.observations, 0) as observations,
      COALESCE(sl.class_rank, 9999) as class_rank
    FROM users u
    JOIN class_enrollments ce ON ce.student_id = u.id
    LEFT JOIN student_leaderboard sl ON sl.user_id = u.id AND sl.week_start_date = v_week_start
    WHERE ce.class_id = p_class_id AND ce.status = 'active'
  ),
  prev_week AS (
    SELECT 
      sl.user_id,
      sl.class_rank as prev_rank
    FROM student_leaderboard sl
    WHERE sl.week_start_date = v_prev_week_start
  )
  SELECT 
    cw.user_id,
    cw.student_name,
    cw.points_earned,
    cw.check_ins,
    cw.observations,
    cw.class_rank,
    COALESCE(pw.prev_rank - cw.class_rank, 0) as rank_change
  FROM current_week cw
  LEFT JOIN prev_week pw ON pw.user_id = cw.user_id
  ORDER BY cw.points_earned DESC, cw.check_ins DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Update class stats for current week
CREATE OR REPLACE FUNCTION update_class_leaderboard()
RETURNS VOID AS $$
DECLARE
  v_week_start DATE := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  v_class RECORD;
  v_rank INT := 1;
BEGIN
  -- Loop through all active classes
  FOR v_class IN 
    SELECT DISTINCT ce.class_id
    FROM class_enrollments ce
    WHERE ce.status = 'active'
  LOOP
    -- Calculate and insert/update stats for this class
    INSERT INTO class_team_stats (
      class_id,
      week_start_date,
      total_check_ins,
      total_observations,
      total_points,
      unique_sites_visited,
      active_students
    )
    SELECT
      v_class.class_id,
      v_week_start,
      -- TODO: Count actual check-ins from user_visits table
      COUNT(DISTINCT uv.id) as total_check_ins,
      -- TODO: Count actual observations
      0 as total_observations,
      -- TODO: Sum actual points
      COUNT(DISTINCT uv.id) * 50 as total_points,
      -- TODO: Count unique sites
      COUNT(DISTINCT uv.site_id) as unique_sites,
      -- Count active students (those who checked in this week)
      COUNT(DISTINCT uv.user_id) as active_students
    FROM class_enrollments ce
    LEFT JOIN user_visits uv ON uv.user_id = ce.student_id 
      AND uv.visited_at >= v_week_start 
      AND uv.visited_at < v_week_start + INTERVAL '7 days'
    WHERE ce.class_id = v_class.class_id
      AND ce.status = 'active'
    GROUP BY ce.class_id
    ON CONFLICT (class_id, week_start_date)
    DO UPDATE SET
      total_check_ins = EXCLUDED.total_check_ins,
      total_observations = EXCLUDED.total_observations,
      total_points = EXCLUDED.total_points,
      unique_sites_visited = EXCLUDED.unique_sites_visited,
      active_students = EXCLUDED.active_students,
      updated_at = NOW();
  END LOOP;

  -- Update rankings
  UPDATE class_team_stats
  SET 
    prev_week_rank = rank_position,
    rank_position = ranked.new_rank
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY total_points DESC, total_check_ins DESC) as new_rank
    FROM class_team_stats
    WHERE week_start_date = v_week_start
  ) ranked
  WHERE class_team_stats.id = ranked.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE class_team_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_leaderboard ENABLE ROW LEVEL SECURITY;

-- Everyone can view class stats (anonymized for competition)
CREATE POLICY "Class stats are viewable by all authenticated users"
  ON class_team_stats FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Students can view their own leaderboard stats
CREATE POLICY "Students can view their own leaderboard stats"
  ON student_leaderboard FOR SELECT
  USING (auth.uid() = user_id);

-- Teachers can view their class leaderboard
CREATE POLICY "Teachers can view their class leaderboard"
  ON student_leaderboard FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN classes c ON c.teacher_id = u.id
      JOIN class_enrollments ce ON ce.class_id = c.id
      WHERE u.id = auth.uid()
        AND ce.student_id = student_leaderboard.user_id
    )
  );

-- Admins can view all leaderboard data
CREATE POLICY "Admins can view all leaderboard data"
  ON student_leaderboard FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================================================
-- Triggers
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE TRIGGER update_class_team_stats_updated_at
  BEFORE UPDATE ON class_team_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_leaderboard_updated_at
  BEFORE UPDATE ON student_leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Scheduled Job (Requires pg_cron extension)
-- ============================================================================

-- Note: This requires pg_cron to be installed
-- Run daily at 1 AM to update leaderboards
-- SELECT cron.schedule('update-leaderboards', '0 1 * * *', 'SELECT update_class_leaderboard();');

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE class_team_stats IS 'Weekly aggregated stats for class team competition';
COMMENT ON TABLE student_leaderboard IS 'Individual student rankings and stats';
COMMENT ON FUNCTION get_class_leaderboard IS 'Returns top N classes by points for current week';
COMMENT ON FUNCTION get_student_leaderboard_by_class IS 'Returns student rankings within a specific class';
COMMENT ON FUNCTION update_class_leaderboard IS 'Recalculates all class and student leaderboard stats';

