-- Migration: Team Challenges & Competitions
-- Enables class competitions and team challenges

-- Class Competitions Table
CREATE TABLE IF NOT EXISTS class_competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  first_place_reward TEXT,
  second_place_reward TEXT,
  third_place_reward TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competition Participants (Classes)
CREATE TABLE IF NOT EXISTS class_competition_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES class_competitions(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competition_id, class_id)
);

-- Team Challenge Members
CREATE TABLE IF NOT EXISTS team_challenge_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_competitions_active ON class_competitions(is_active, end_date);
CREATE INDEX IF NOT EXISTS idx_competitions_dates ON class_competitions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_competition_participants_comp ON class_competition_participants(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_participants_class ON class_competition_participants(class_id);
CREATE INDEX IF NOT EXISTS idx_team_challenge_members_challenge ON team_challenge_members(challenge_id);
CREATE INDEX IF NOT EXISTS idx_team_challenge_members_user ON team_challenge_members(user_id);

-- Row Level Security
ALTER TABLE class_competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_challenge_members ENABLE ROW LEVEL SECURITY;

-- Users can view competitions for their classes
CREATE POLICY "Users can view class competitions" ON class_competitions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_competition_participants
      JOIN class_enrollments ON class_enrollments.class_id = class_competition_participants.class_id
      WHERE class_competition_participants.competition_id = class_competitions.id
      AND class_enrollments.user_id = auth.uid()
    )
  );

-- Teachers can create competitions
CREATE POLICY "Teachers can create competitions" ON class_competitions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'educator' OR users.role = 'teacher')
    )
  );

-- Users can view competition participants
CREATE POLICY "Users can view competition participants" ON class_competition_participants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_enrollments
      WHERE class_enrollments.class_id = class_competition_participants.class_id
      AND class_enrollments.user_id = auth.uid()
    )
  );

-- Users can view team challenge members
CREATE POLICY "Users can view team members" ON team_challenge_members
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM team_challenge_members tcm2
      WHERE tcm2.challenge_id = team_challenge_members.challenge_id
      AND tcm2.user_id = auth.uid()
    )
  );

-- Users can join team challenges
CREATE POLICY "Users can join team challenges" ON team_challenge_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE class_competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE class_competition_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE team_challenge_members;

COMMENT ON TABLE class_competitions IS 'Class vs class competitions with leaderboards and rewards';
COMMENT ON TABLE class_competition_participants IS 'Classes participating in competitions';
COMMENT ON TABLE team_challenge_members IS 'Users participating in team challenges';

