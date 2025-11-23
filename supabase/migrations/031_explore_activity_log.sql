-- Explore activity telemetry log

CREATE TABLE IF NOT EXISTS explore_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_explore_activity_user ON explore_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_explore_activity_type ON explore_activity_log(event_type);
CREATE INDEX IF NOT EXISTS idx_explore_activity_created ON explore_activity_log(created_at);

ALTER TABLE explore_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own explore telemetry" ON explore_activity_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own explore telemetry" ON explore_activity_log
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE explore_activity_log IS 'Telemetry events recorded from the Explore experience (filters, check-ins, bundle queues, etc.)';

