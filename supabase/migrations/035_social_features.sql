-- Migration: Social Features for Student Sharing
-- Enables class-based sharing and discovery feed

-- Class Feed Posts Table
CREATE TABLE IF NOT EXISTS class_feed_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('observation', 'achievement', 'species', 'mission', 'progress')),
  content_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feed_posts_class ON class_feed_posts(class_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_posts_user ON class_feed_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_content ON class_feed_posts(content_type, content_id);

-- Row Level Security
ALTER TABLE class_feed_posts ENABLE ROW LEVEL SECURITY;

-- Users can view posts from their classes
CREATE POLICY "Users can view class feed posts" ON class_feed_posts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_enrollments
      WHERE class_enrollments.class_id = class_feed_posts.class_id
      AND class_enrollments.user_id = auth.uid()
    )
  );

-- Users can create posts in their classes
CREATE POLICY "Users can create feed posts" ON class_feed_posts
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM class_enrollments
      WHERE class_enrollments.class_id = class_feed_posts.class_id
      AND class_enrollments.user_id = auth.uid()
    )
  );

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts" ON class_feed_posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime for feed posts
ALTER PUBLICATION supabase_realtime ADD TABLE class_feed_posts;

COMMENT ON TABLE class_feed_posts IS 'Class feed posts for sharing observations, achievements, and discoveries';

