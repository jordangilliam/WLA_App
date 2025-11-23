-- Migration: Live Field Sessions for Real-Time Collaboration
-- Enables teachers to create live research sessions for field trips

CREATE TABLE IF NOT EXISTS live_field_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  field_site_id UUID REFERENCES field_sites(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_sessions_teacher ON live_field_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_class ON live_field_sessions(class_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_active ON live_field_sessions(is_active, end_time);
CREATE INDEX IF NOT EXISTS idx_live_sessions_field_site ON live_field_sessions(field_site_id);

-- Row Level Security
ALTER TABLE live_field_sessions ENABLE ROW LEVEL SECURITY;

-- Teachers can view their own sessions
CREATE POLICY "Teachers can view their own sessions" ON live_field_sessions
  FOR SELECT
  USING (auth.uid() = teacher_id);

-- Students can view sessions for their classes
CREATE POLICY "Students can view class sessions" ON live_field_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_enrollments
      WHERE class_enrollments.class_id = live_field_sessions.class_id
      AND class_enrollments.user_id = auth.uid()
    )
  );

-- Teachers can create sessions
CREATE POLICY "Teachers can create sessions" ON live_field_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own sessions
CREATE POLICY "Teachers can update their own sessions" ON live_field_sessions
  FOR UPDATE
  USING (auth.uid() = teacher_id);

-- Enable Realtime for live sessions
ALTER PUBLICATION supabase_realtime ADD TABLE live_field_sessions;

COMMENT ON TABLE live_field_sessions IS 'Live field research sessions created by teachers for real-time collaboration during field trips';

