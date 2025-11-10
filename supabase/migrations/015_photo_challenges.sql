-- Photo Challenges System Migration
-- Scavenger hunt style photo prompts with teacher approval

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Photo Challenges Table
-- ============================================================================

CREATE TABLE photo_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Challenge Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  photo_prompts JSONB NOT NULL, -- Array of prompts with example images
  difficulty VARCHAR(20) DEFAULT 'easy', -- easy, medium, hard
  reward_points INT DEFAULT 100,
  
  -- Timing
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  
  -- Metadata
  icon TEXT DEFAULT '📸',
  category VARCHAR(50), -- nature, wildlife, plants, conservation
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_photo_challenges_active ON photo_challenges(active);
CREATE INDEX idx_photo_challenges_dates ON photo_challenges(start_date, end_date);

-- ============================================================================
-- Photo Submissions Table
-- ============================================================================

CREATE TABLE photo_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- References
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES photo_challenges(id) ON DELETE CASCADE,
  prompt_index INT NOT NULL, -- Which prompt in the array
  
  -- Photo Details
  photo_url TEXT NOT NULL,
  caption TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  site_id UUID REFERENCES field_sites(id),
  
  -- Approval Workflow
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  teacher_feedback TEXT,
  
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, challenge_id, prompt_index)
);

CREATE INDEX idx_submissions_user ON photo_submissions(user_id);
CREATE INDEX idx_submissions_challenge ON photo_submissions(challenge_id);
CREATE INDEX idx_submissions_status ON photo_submissions(status);

-- ============================================================================
-- Functions
-- ============================================================================

-- Get active photo challenges with user progress
CREATE OR REPLACE FUNCTION get_photo_challenges_with_progress(p_user_id UUID)
RETURNS TABLE (
  challenge_id UUID,
  title VARCHAR,
  description TEXT,
  photo_prompts JSONB,
  difficulty VARCHAR,
  reward_points INT,
  icon TEXT,
  total_prompts INT,
  completed_prompts INT,
  approved_prompts INT,
  progress_percent FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pc.id,
    pc.title,
    pc.description,
    pc.photo_prompts,
    pc.difficulty,
    pc.reward_points,
    pc.icon,
    jsonb_array_length(pc.photo_prompts) as total_prompts,
    COUNT(ps.id)::INT as completed_prompts,
    COUNT(ps.id) FILTER (WHERE ps.status = 'approved')::INT as approved_prompts,
    (COUNT(ps.id) FILTER (WHERE ps.status = 'approved')::FLOAT / 
      jsonb_array_length(pc.photo_prompts)::FLOAT * 100) as progress_percent
  FROM photo_challenges pc
  LEFT JOIN photo_submissions ps ON ps.challenge_id = pc.id AND ps.user_id = p_user_id
  WHERE pc.active = true
    AND (pc.start_date IS NULL OR pc.start_date <= CURRENT_DATE)
    AND (pc.end_date IS NULL OR pc.end_date >= CURRENT_DATE)
  GROUP BY pc.id
  ORDER BY pc.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Get pending submissions for teacher review
CREATE OR REPLACE FUNCTION get_pending_photo_submissions(p_teacher_id UUID)
RETURNS TABLE (
  submission_id UUID,
  student_name VARCHAR,
  student_id UUID,
  challenge_title VARCHAR,
  prompt_text TEXT,
  photo_url TEXT,
  caption TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.id,
    u.first_name || ' ' || COALESCE(u.last_name, '') as student_name,
    u.id,
    pc.title,
    (pc.photo_prompts->ps.prompt_index->>'prompt')::TEXT,
    ps.photo_url,
    ps.caption,
    ps.submitted_at
  FROM photo_submissions ps
  JOIN users u ON u.id = ps.user_id
  JOIN photo_challenges pc ON pc.id = ps.challenge_id
  JOIN class_enrollments ce ON ce.student_id = u.id
  JOIN classes c ON c.id = ce.class_id
  WHERE c.teacher_id = p_teacher_id
    AND ps.status = 'pending'
    AND ce.status = 'active'
  ORDER BY ps.submitted_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Approve/reject submission
CREATE OR REPLACE FUNCTION review_photo_submission(
  p_submission_id UUID,
  p_reviewer_id UUID,
  p_status VARCHAR,
  p_feedback TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_challenge RECORD;
  v_completed_count INT;
BEGIN
  -- Update submission status
  UPDATE photo_submissions
  SET 
    status = p_status,
    reviewed_by = p_reviewer_id,
    reviewed_at = NOW(),
    teacher_feedback = p_feedback
  WHERE id = p_submission_id
  RETURNING user_id INTO v_user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  -- If approved, check if challenge is complete
  IF p_status = 'approved' THEN
    SELECT 
      pc.*,
      COUNT(ps.id) FILTER (WHERE ps.status = 'approved')
    INTO v_challenge, v_completed_count
    FROM photo_submissions ps
    JOIN photo_challenges pc ON pc.id = ps.challenge_id
    WHERE ps.user_id = v_user_id AND ps.id = p_submission_id
    GROUP BY pc.id;
    
    -- Award points if all prompts completed
    IF v_completed_count >= jsonb_array_length(v_challenge.photo_prompts) THEN
      -- TODO: Award challenge completion points
      NULL;
    END IF;
  END IF;
  
  RETURN json_build_object('success', true, 'status', p_status);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Seed Data: Example Photo Challenges
-- ============================================================================

INSERT INTO photo_challenges (title, description, photo_prompts, difficulty, reward_points, icon, category) VALUES
(
  'Nature Scavenger Hunt',
  'Find and photograph 10 amazing things in nature!',
  '[
    {"prompt": "Find an oak leaf", "example": "Look for leaves with wavy edges"},
    {"prompt": "Photograph a bird", "example": "Any bird species counts!"},
    {"prompt": "Find animal tracks", "example": "In mud, sand, or snow"},
    {"prompt": "Photograph a spider web", "example": "Early morning dew makes them visible"},
    {"prompt": "Find different colored leaves", "example": "Red, yellow, orange, or brown"},
    {"prompt": "Photograph flowing water", "example": "Stream, fountain, or waterfall"},
    {"prompt": "Find evidence of wildlife", "example": "Nests, burrows, or scat"},
    {"prompt": "Photograph tree bark", "example": "Close-up of interesting textures"},
    {"prompt": "Find a flower", "example": "Any wildflower or garden flower"},
    {"prompt": "Photograph clouds", "example": "Interesting cloud formations"}
  ]'::jsonb,
  'easy',
  500,
  '🔍',
  'nature'
),
(
  'Tree Detective',
  'Identify different tree species by their characteristics',
  '[
    {"prompt": "Oak tree", "example": "Wavy-edged leaves and acorns"},
    {"prompt": "Maple tree", "example": "Hand-shaped leaves with pointed lobes"},
    {"prompt": "Pine tree", "example": "Needles in bundles and pine cones"},
    {"prompt": "Birch tree", "example": "White bark with black markings"},
    {"prompt": "Willow tree", "example": "Long, drooping branches"}
  ]'::jsonb,
  'medium',
  300,
  '🌳',
  'plants'
),
(
  'Wildlife Photographer',
  'Capture amazing Pennsylvania wildlife',
  '[
    {"prompt": "A bird in flight", "example": "Be patient and ready!"},
    {"prompt": "A squirrel", "example": "Common in parks"},
    {"prompt": "A butterfly or moth", "example": "Look for flowers"},
    {"prompt": "A fish", "example": "In a stream or lake"},
    {"prompt": "A deer", "example": "Early morning or evening"}
  ]'::jsonb,
  'hard',
  1000,
  '📷',
  'wildlife'
);

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE photo_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_submissions ENABLE ROW LEVEL SECURITY;

-- Everyone can view active challenges
CREATE POLICY "Active photo challenges are viewable by all"
  ON photo_challenges FOR SELECT
  USING (active = true);

-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
  ON photo_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own submissions
CREATE POLICY "Users can create their own submissions"
  ON photo_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Teachers can view their students' submissions
CREATE POLICY "Teachers can view student submissions"
  ON photo_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN classes c ON c.teacher_id = u.id
      JOIN class_enrollments ce ON ce.class_id = c.id
      WHERE u.id = auth.uid()
        AND ce.student_id = photo_submissions.user_id
    )
  );

-- Teachers can update (review) their students' submissions
CREATE POLICY "Teachers can review student submissions"
  ON photo_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN classes c ON c.teacher_id = u.id
      JOIN class_enrollments ce ON ce.class_id = c.id
      WHERE u.id = auth.uid()
        AND ce.student_id = photo_submissions.user_id
    )
  );

-- ============================================================================
-- Triggers
-- ============================================================================

CREATE TRIGGER update_photo_challenges_updated_at
  BEFORE UPDATE ON photo_challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE photo_challenges IS 'Scavenger hunt style photo challenges';
COMMENT ON TABLE photo_submissions IS 'Student photo submissions with teacher approval workflow';
COMMENT ON FUNCTION get_photo_challenges_with_progress IS 'Returns active challenges with user completion progress';
COMMENT ON FUNCTION get_pending_photo_submissions IS 'Returns pending submissions for teacher review';
COMMENT ON FUNCTION review_photo_submission IS 'Approve or reject a photo submission with feedback';

