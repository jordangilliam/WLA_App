-- ============================================
-- WILDPRAXIS EDUCATOR DASHBOARD SCHEMA
-- Supporting: Teacher management, COPPA compliance, Class management
-- ============================================

-- ============================================
-- 1. ENHANCE USERS TABLE
-- ============================================

-- Add role-based authentication and compliance fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';
-- Roles: 'student', 'teacher', 'parent', 'admin'

ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_status VARCHAR(20) DEFAULT 'pending';
-- consent_status: 'pending', 'verified', 'denied', 'not_required' (over 13)

ALTER TABLE users ADD COLUMN IF NOT EXISTS school_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS school_district VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade_level VARCHAR(50);

-- Add unique constraint on parent_email when combined with user
CREATE INDEX IF NOT EXISTS idx_users_parent_email ON users(parent_email) WHERE parent_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- 2. CLASSES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  grade_level VARCHAR(50),
  subject VARCHAR(100) DEFAULT 'Environmental Science',
  class_code VARCHAR(8) UNIQUE NOT NULL,
  
  -- School info
  school_name VARCHAR(255),
  school_district VARCHAR(255),
  
  -- Settings
  allow_location_sharing BOOLEAN DEFAULT FALSE,
  require_assignment_approval BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMP
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_code ON classes(class_code);
CREATE INDEX idx_classes_active ON classes(teacher_id, archived) WHERE archived = FALSE;

COMMENT ON TABLE classes IS 'Teacher-created classes for student organization';
COMMENT ON COLUMN classes.class_code IS 'Unique 8-character code for students to join';

-- ============================================
-- 3. CLASS ENROLLMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS class_enrollments (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Enrollment details
  enrolled_at TIMESTAMP DEFAULT NOW(),
  enrolled_by VARCHAR(20) DEFAULT 'class_code', -- 'class_code', 'teacher_added', 'admin_added'
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'withdrawn'
  withdrawn_at TIMESTAMP,
  
  UNIQUE(class_id, student_id)
);

CREATE INDEX idx_enrollments_class ON class_enrollments(class_id);
CREATE INDEX idx_enrollments_student ON class_enrollments(student_id);
CREATE INDEX idx_enrollments_active ON class_enrollments(class_id, status) WHERE status = 'active';

COMMENT ON TABLE class_enrollments IS 'Student membership in classes';

-- ============================================
-- 4. ASSIGNMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  
  -- Assignment details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  
  -- Link to app content
  lesson_id VARCHAR(100), -- Links to specific lesson/activity in app
  activity_type VARCHAR(50), -- 'lesson', 'quiz', 'field_observation', 'journal', 'custom'
  
  -- Grading
  points_possible INTEGER DEFAULT 0,
  rubric_url VARCHAR(500),
  
  -- Timing
  assigned_at TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  available_from TIMESTAMP DEFAULT NOW(),
  available_until TIMESTAMP,
  
  -- Settings
  allow_late_submission BOOLEAN DEFAULT TRUE,
  require_teacher_approval BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_due_date ON assignments(class_id, due_date);

COMMENT ON TABLE assignments IS 'Teacher-created assignments linked to app activities';

-- ============================================
-- 5. ASSIGNMENT SUBMISSIONS
-- ============================================

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Submission status
  status VARCHAR(20) DEFAULT 'not_started',
  -- status: 'not_started', 'in_progress', 'submitted', 'graded', 'returned'
  
  -- Timing
  started_at TIMESTAMP,
  submitted_at TIMESTAMP,
  graded_at TIMESTAMP,
  
  -- Grading
  score INTEGER,
  points_earned DECIMAL(5,2),
  teacher_feedback TEXT,
  
  -- Student work
  submission_data JSONB, -- Flexible storage for different submission types
  
  -- Late submission
  is_late BOOLEAN DEFAULT FALSE,
  
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_submissions_status ON assignment_submissions(assignment_id, status);
CREATE INDEX idx_submissions_grading_queue ON assignment_submissions(assignment_id, status) 
  WHERE status = 'submitted';

COMMENT ON TABLE assignment_submissions IS 'Student work on assignments';

-- ============================================
-- 6. GROUPS (Field Trips, Cohorts, Clubs)
-- ============================================

CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Creator
  created_by INTEGER NOT NULL REFERENCES users(id),
  
  -- Type
  group_type VARCHAR(50) NOT NULL, -- 'field_trip', 'cohort', 'club', 'class', 'wla_academy'
  
  -- Linked to a class (optional)
  class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
  
  -- Timing
  start_date DATE,
  end_date DATE,
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  allow_self_join BOOLEAN DEFAULT FALSE,
  join_code VARCHAR(8) UNIQUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_groups_creator ON groups(created_by);
CREATE INDEX idx_groups_type ON groups(group_type);
CREATE INDEX idx_groups_active ON groups(is_active, group_type);
CREATE INDEX idx_groups_class ON groups(class_id) WHERE class_id IS NOT NULL;

COMMENT ON TABLE groups IS 'Flexible grouping for field trips, cohorts, clubs';

-- ============================================
-- 7. GROUP MEMBERS
-- ============================================

CREATE TABLE IF NOT EXISTS group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Role in group
  role VARCHAR(20) DEFAULT 'member', -- 'leader', 'co_leader', 'member'
  
  -- Membership
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'left'
  
  UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_active ON group_members(group_id, status) WHERE status = 'active';

COMMENT ON TABLE group_members IS 'Membership in groups';

-- ============================================
-- 8. PARENTAL CONSENTS (COPPA Compliance)
-- ============================================

CREATE TABLE IF NOT EXISTS parental_consents (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Parent information
  parent_name VARCHAR(255) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(20),
  relationship VARCHAR(50) DEFAULT 'parent', -- 'parent', 'guardian', 'other'
  
  -- Consent details
  consent_given BOOLEAN DEFAULT FALSE,
  consent_method VARCHAR(50), -- 'email_verification', 'digital_signature', 'paper_form'
  consent_text TEXT, -- What they consented to
  
  -- Verification
  verification_token VARCHAR(100) UNIQUE,
  token_expires_at TIMESTAMP,
  verified_at TIMESTAMP,
  
  -- Audit trail
  ip_address INET,
  user_agent TEXT,
  
  -- Consent scope
  allow_location_sharing BOOLEAN DEFAULT FALSE,
  allow_photo_sharing BOOLEAN DEFAULT FALSE,
  allow_name_display BOOLEAN DEFAULT TRUE,
  allow_work_sharing BOOLEAN DEFAULT TRUE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'expired', 'revoked'
  revoked_at TIMESTAMP,
  revoked_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consents_student ON parental_consents(student_id);
CREATE INDEX idx_consents_email ON parental_consents(parent_email);
CREATE INDEX idx_consents_token ON parental_consents(verification_token) WHERE verification_token IS NOT NULL;
CREATE INDEX idx_consents_status ON parental_consents(status);

COMMENT ON TABLE parental_consents IS 'COPPA-compliant parental consent tracking';

-- ============================================
-- 9. CONTENT FLAGS (Moderation)
-- ============================================

CREATE TABLE IF NOT EXISTS content_flags (
  id SERIAL PRIMARY KEY,
  
  -- Who flagged
  flagged_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- What was flagged
  content_type VARCHAR(50) NOT NULL, -- 'observation', 'journal', 'comment', 'photo', 'submission'
  content_id INTEGER NOT NULL,
  content_snapshot JSONB, -- Save snapshot in case content is deleted
  
  -- Why flagged
  reason VARCHAR(50) NOT NULL, -- 'inappropriate', 'spam', 'safety_concern', 'bullying', 'other'
  description TEXT,
  
  -- Context
  class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
  
  -- Review status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'under_review', 'resolved', 'dismissed'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Resolution
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  resolution VARCHAR(20), -- 'removed', 'edited', 'approved', 'no_action'
  resolution_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_flags_status ON content_flags(status, priority);
CREATE INDEX idx_flags_content ON content_flags(content_type, content_id);
CREATE INDEX idx_flags_class ON content_flags(class_id) WHERE class_id IS NOT NULL;
CREATE INDEX idx_flags_pending ON content_flags(status, created_at) WHERE status = 'pending';

COMMENT ON TABLE content_flags IS 'Content moderation and safety reporting';

-- ============================================
-- 10. ACTIVITY LOG (for Teacher Dashboard)
-- ============================================

CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Activity details
  activity_type VARCHAR(50) NOT NULL, 
  -- Types: 'lesson_completed', 'badge_earned', 'observation_added', 'quiz_taken',
  --        'assignment_submitted', 'login', 'journal_entry', etc.
  
  activity_data JSONB, -- Flexible storage for activity-specific data
  
  -- Context
  class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE SET NULL,
  
  -- Points earned from this activity
  points_earned INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user_time ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_type ON activity_log(activity_type);
CREATE INDEX idx_activity_class ON activity_log(class_id, created_at DESC) WHERE class_id IS NOT NULL;
CREATE INDEX idx_activity_class_user ON activity_log(class_id, user_id, created_at DESC);

-- Partition by month for better performance (optional for large scale)
-- CREATE TABLE activity_log_2025_01 PARTITION OF activity_log 
--   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

COMMENT ON TABLE activity_log IS 'Comprehensive activity tracking for teacher dashboard';

-- ============================================
-- 11. TEACHER NOTES (about students)
-- ============================================

CREATE TABLE IF NOT EXISTS teacher_notes (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  
  note_text TEXT NOT NULL,
  note_type VARCHAR(50) DEFAULT 'general', -- 'general', 'behavior', 'academic', 'parent_contact'
  is_private BOOLEAN DEFAULT TRUE, -- Private to teacher vs. shared with other teachers
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_teacher_student ON teacher_notes(teacher_id, student_id);
CREATE INDEX idx_notes_class ON teacher_notes(class_id) WHERE class_id IS NOT NULL;

COMMENT ON TABLE teacher_notes IS 'Teacher private notes about student progress';

-- ============================================
-- 12. CLASS ANNOUNCEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS class_announcements (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Publishing
  published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP DEFAULT NOW(),
  
  -- Notifications
  send_notification BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_announcements_class ON class_announcements(class_id, published_at DESC);

COMMENT ON TABLE class_announcements IS 'Teacher announcements to class';

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to generate unique class codes
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude similar-looking chars
  result VARCHAR(8) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate age from birth date
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN DATE_PART('year', AGE(NOW(), birth_date));
END;
$$ LANGUAGE plpgsql;

-- Function to check if user needs parental consent
CREATE OR REPLACE FUNCTION needs_parental_consent(user_id_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  user_age INTEGER;
BEGIN
  SELECT calculate_age(birth_date) INTO user_age
  FROM users
  WHERE id = user_id_param;
  
  RETURN user_age IS NOT NULL AND user_age < 13;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Class roster with student details
CREATE OR REPLACE VIEW class_roster AS
SELECT 
  ce.class_id,
  c.name AS class_name,
  c.teacher_id,
  u.id AS student_id,
  u.name AS student_name,
  u.email AS student_email,
  u.grade_level,
  u.consent_status,
  ce.enrolled_at,
  ce.status AS enrollment_status,
  -- Count badges
  (SELECT COUNT(*) FROM user_badges WHERE user_id = u.id) AS badges_earned,
  -- Recent activity
  (SELECT MAX(created_at) FROM activity_log WHERE user_id = u.id) AS last_active
FROM class_enrollments ce
JOIN classes c ON ce.class_id = c.id
JOIN users u ON ce.student_id = u.id
WHERE ce.status = 'active';

COMMENT ON VIEW class_roster IS 'Complete class roster with student details';

-- View: Teacher dashboard summary
CREATE OR REPLACE VIEW teacher_dashboard_summary AS
SELECT 
  t.id AS teacher_id,
  t.name AS teacher_name,
  COUNT(DISTINCT c.id) AS total_classes,
  COUNT(DISTINCT CASE WHEN c.archived = FALSE THEN c.id END) AS active_classes,
  COUNT(DISTINCT ce.student_id) AS total_students,
  COUNT(DISTINCT CASE WHEN al.created_at > NOW() - INTERVAL '7 days' THEN ce.student_id END) AS active_students_week,
  COUNT(DISTINCT a.id) AS total_assignments,
  SUM(CASE WHEN al.created_at > NOW() - INTERVAL '7 days' THEN al.points_earned ELSE 0 END) AS points_earned_week
FROM users t
LEFT JOIN classes c ON t.id = c.teacher_id
LEFT JOIN class_enrollments ce ON c.id = ce.class_id AND ce.status = 'active'
LEFT JOIN assignments a ON c.id = a.class_id
LEFT JOIN activity_log al ON ce.student_id = al.user_id AND al.class_id = c.id
WHERE t.role = 'teacher'
GROUP BY t.id, t.name;

COMMENT ON VIEW teacher_dashboard_summary IS 'Quick stats for teacher dashboard';

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Log activity when assignment is submitted
CREATE OR REPLACE FUNCTION log_assignment_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status != 'submitted') THEN
    INSERT INTO activity_log (user_id, activity_type, activity_data, class_id, assignment_id, created_at)
    VALUES (
      NEW.student_id,
      'assignment_submitted',
      jsonb_build_object(
        'assignment_id', NEW.assignment_id,
        'submitted_at', NEW.submitted_at
      ),
      (SELECT class_id FROM assignments WHERE id = NEW.assignment_id),
      NEW.assignment_id,
      NEW.submitted_at
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_assignment_submission_trigger 
  AFTER INSERT OR UPDATE ON assignment_submissions
  FOR EACH ROW EXECUTE FUNCTION log_assignment_submission();

-- ============================================
-- SAMPLE DATA FOR DEVELOPMENT/TESTING
-- ============================================

-- Insert sample teacher
-- INSERT INTO users (name, email, role, created_at)
-- VALUES ('Ms. Sarah Johnson', 'sarah.johnson@school.edu', 'teacher', NOW())
-- ON CONFLICT (email) DO NOTHING;

-- Insert sample class
-- INSERT INTO classes (teacher_id, name, grade_level, subject, class_code, school_name, school_district)
-- SELECT id, 'Environmental Science 7A', '7', 'Science', 'FISH2025', 'Central Middle School', 'State College Area SD'
-- FROM users WHERE email = 'sarah.johnson@school.edu' AND role = 'teacher'
-- ON CONFLICT (class_code) DO NOTHING;

-- ============================================
-- GRANTS (adjust based on your setup)
-- ============================================

-- Grant appropriate permissions to app user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO wildpraxis_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO wildpraxis_app;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_activity_recent_by_class ON activity_log(class_id, created_at DESC, user_id)
  WHERE created_at > NOW() - INTERVAL '30 days';

CREATE INDEX IF NOT EXISTS idx_submissions_pending_grading ON assignment_submissions(assignment_id, submitted_at)
  WHERE status = 'submitted';

-- ============================================
-- COMPLETION
-- ============================================

-- Log schema version
CREATE TABLE IF NOT EXISTS schema_versions (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_versions (version, description)
VALUES ('educator_dashboard_v1', 'Initial educator dashboard schema with classes, assignments, groups, COPPA compliance')
ON CONFLICT (version) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Educator Dashboard schema created successfully!';
  RAISE NOTICE 'Tables created: classes, class_enrollments, assignments, assignment_submissions, groups, group_members, parental_consents, content_flags, activity_log, teacher_notes, class_announcements';
  RAISE NOTICE 'Views created: class_roster, teacher_dashboard_summary';
  RAISE NOTICE 'Functions created: generate_class_code, calculate_age, needs_parental_consent';
END $$;

