-- ============================================================================
-- RAD Pass Gamification & Reward System
-- Next-Generation Licensable Engagement Platform
-- ============================================================================
-- 
-- This migration creates a complete, white-labelable gamification system
-- designed for educational institutions and RAD Pass integration.
--
-- Features:
-- - Multi-currency point system (Learning, Action, Social, Bonus)
-- - Partner organization integration
-- - Reward marketplace with redemption tracking
-- - Grade integration for teachers
-- - Analytics and reporting
-- - White-label support for RAD Pass licensing
-- ============================================================================

-- ============================================================================
-- POINT CURRENCIES
-- ============================================================================
-- Multiple point types for diverse engagement

CREATE TYPE point_currency AS ENUM (
  'learning_points',    -- Educational activities (lessons, quizzes, reading)
  'action_points',      -- Field work (check-ins, observations, documentation)
  'social_points',      -- Community engagement (challenges, teamwork, sharing)
  'bonus_points',       -- Special events, achievements, milestones
  'rad_tokens'          -- Redeemable currency for rewards (RAD Pass integration)
);

CREATE TYPE point_transaction_type AS ENUM (
  'earned',             -- User earned points
  'spent',              -- User redeemed points for reward
  'awarded',            -- Admin/teacher awarded points
  'bonus',              -- Bonus points from promotion/event
  'adjustment',         -- Manual adjustment by admin
  'expired',            -- Points expired (if applicable)
  'transferred',        -- Transferred between users (if enabled)
  'refunded'            -- Refund from cancelled reward
);

-- Point ledger - tracks all point transactions
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction details
  currency point_currency NOT NULL,
  transaction_type point_transaction_type NOT NULL,
  amount INTEGER NOT NULL, -- Can be negative for spending
  balance_after INTEGER NOT NULL, -- Running balance
  
  -- Context
  source_type TEXT, -- 'check_in', 'achievement', 'quiz', 'redemption', 'grade_conversion'
  source_id UUID, -- ID of the source entity
  description TEXT NOT NULL,
  metadata JSONB, -- Additional transaction details
  
  -- Attribution
  awarded_by UUID REFERENCES users(id), -- If manually awarded
  related_transaction_id UUID REFERENCES point_transactions(id), -- For refunds, etc.
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- Optional expiration
);

CREATE INDEX idx_point_transactions_user ON point_transactions(user_id, created_at DESC);
CREATE INDEX idx_point_transactions_currency ON point_transactions(currency);
CREATE INDEX idx_point_transactions_type ON point_transactions(transaction_type);
CREATE INDEX idx_point_transactions_source ON point_transactions(source_type, source_id);

-- User point balances - denormalized for fast queries
CREATE TABLE user_point_balances (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Current balances by currency
  learning_points INTEGER DEFAULT 0,
  action_points INTEGER DEFAULT 0,
  social_points INTEGER DEFAULT 0,
  bonus_points INTEGER DEFAULT 0,
  rad_tokens INTEGER DEFAULT 0,
  
  -- Lifetime totals (never decreases)
  lifetime_learning INTEGER DEFAULT 0,
  lifetime_action INTEGER DEFAULT 0,
  lifetime_social INTEGER DEFAULT 0,
  lifetime_bonus INTEGER DEFAULT 0,
  lifetime_rad_tokens INTEGER DEFAULT 0,
  
  -- Total redeemed
  total_redeemed INTEGER DEFAULT 0,
  
  -- Conversion rates (customizable per deployment)
  learning_to_rad_rate DECIMAL(5,2) DEFAULT 10.0, -- 10 learning points = 1 RAD token
  action_to_rad_rate DECIMAL(5,2) DEFAULT 5.0,    -- 5 action points = 1 RAD token
  social_to_rad_rate DECIMAL(5,2) DEFAULT 20.0,   -- 20 social points = 1 RAD token
  
  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PARTNER ORGANIZATIONS
-- ============================================================================
-- Museums, libraries, restaurants, entertainment venues

CREATE TYPE partner_category AS ENUM (
  'museum',
  'library', 
  'cultural_venue',
  'restaurant',
  'entertainment',
  'retail',
  'recreation',
  'education',
  'non_profit',
  'government'
);

CREATE TYPE partner_status AS ENUM (
  'active',
  'pending',
  'inactive',
  'suspended'
);

CREATE TABLE partner_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  description TEXT,
  category partner_category NOT NULL,
  subcategory VARCHAR(100), -- e.g., 'art_museum', 'pizza_restaurant'
  
  -- Contact
  primary_contact_name VARCHAR(255),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(20),
  website TEXT,
  
  -- Location
  address TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) DEFAULT 'PA',
  zip_code VARCHAR(10),
  coordinates GEOGRAPHY(POINT, 4326), -- For mapping
  
  -- Partnership details
  status partner_status DEFAULT 'pending',
  partnership_level VARCHAR(50), -- 'bronze', 'silver', 'gold', 'platinum', 'rad_pass'
  contract_start_date DATE,
  contract_end_date DATE,
  
  -- Branding
  logo_url TEXT,
  banner_url TEXT,
  brand_color VARCHAR(7), -- Hex color
  tagline TEXT,
  
  -- Integration settings
  requires_appointment BOOLEAN DEFAULT false,
  allows_group_reservations BOOLEAN DEFAULT true,
  max_group_size INTEGER,
  advance_booking_days INTEGER,
  redemption_instructions TEXT,
  
  -- API access (for real-time validation)
  api_enabled BOOLEAN DEFAULT false,
  api_key TEXT UNIQUE,
  webhook_url TEXT,
  
  -- Analytics
  total_rewards_offered INTEGER DEFAULT 0,
  total_redemptions INTEGER DEFAULT 0,
  total_students_served INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  
  -- Metadata
  metadata JSONB, -- Custom fields per partner
  terms_and_conditions TEXT,
  privacy_policy TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_partners_status ON partner_organizations(status);
CREATE INDEX idx_partners_category ON partner_organizations(category);
CREATE INDEX idx_partners_city ON partner_organizations(city);
CREATE INDEX idx_partners_coordinates ON partner_organizations USING GIST(coordinates);

-- ============================================================================
-- REWARDS CATALOG
-- ============================================================================
-- Rewards offered by partners

CREATE TYPE reward_type AS ENUM (
  'admission',          -- Free/discounted admission
  'food',              -- Food items (pizza slice, ice cream)
  'merchandise',       -- Physical items
  'experience',        -- Special experience (behind-scenes tour)
  'digital',           -- Digital content (ebook, video course)
  'discount',          -- Percentage or dollar discount
  'upgrade',           -- Service upgrade
  'donation'           -- Partner donates to cause on behalf of student
);

CREATE TYPE reward_rarity AS ENUM (
  'common',
  'uncommon', 
  'rare',
  'epic',
  'legendary'
);

CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partner_organizations(id) ON DELETE CASCADE,
  
  -- Reward details
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  reward_type reward_type NOT NULL,
  rarity reward_rarity DEFAULT 'common',
  
  -- Cost in RAD tokens
  cost_rad_tokens INTEGER NOT NULL,
  cost_learning_points INTEGER DEFAULT 0, -- Alternative currency
  cost_action_points INTEGER DEFAULT 0,
  
  -- Value
  retail_value DECIMAL(10,2), -- Actual dollar value
  discount_percentage INTEGER, -- If applicable
  
  -- Availability
  is_active BOOLEAN DEFAULT true,
  total_quantity INTEGER, -- NULL = unlimited
  quantity_remaining INTEGER,
  quantity_per_user INTEGER DEFAULT 1, -- How many times each user can claim
  
  -- Scheduling
  available_start_date DATE,
  available_end_date DATE,
  available_days_of_week INTEGER[], -- [0,1,2,3,4,5,6] for Sunday-Saturday
  available_times JSONB, -- {"start": "09:00", "end": "17:00"}
  
  -- Age restrictions
  min_age INTEGER,
  max_age INTEGER,
  
  -- Requirements
  required_level INTEGER, -- User must be this level
  required_achievements UUID[], -- Must have these achievements
  requires_parent_permission BOOLEAN DEFAULT false,
  requires_teacher_approval BOOLEAN DEFAULT false,
  
  -- Display
  image_url TEXT,
  icon TEXT, -- Emoji or icon identifier
  featured BOOLEAN DEFAULT false,
  featured_order INTEGER,
  
  -- Redemption settings
  redemption_method VARCHAR(50), -- 'qr_code', 'confirmation_code', 'digital', 'pickup', 'mail'
  redemption_instructions TEXT,
  requires_appointment BOOLEAN DEFAULT false,
  expiration_days INTEGER DEFAULT 30, -- Days until redemption expires after claiming
  
  -- Terms
  terms_and_conditions TEXT,
  exclusions TEXT,
  
  -- Analytics
  total_claimed INTEGER DEFAULT 0,
  total_redeemed INTEGER DEFAULT 0,
  total_expired INTEGER DEFAULT 0,
  average_redemption_time_days INTEGER, -- Time from claim to redemption
  
  -- Metadata
  tags TEXT[], -- For searching/filtering
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rewards_partner ON rewards(partner_id);
CREATE INDEX idx_rewards_active ON rewards(is_active);
CREATE INDEX idx_rewards_featured ON rewards(featured, featured_order);
CREATE INDEX idx_rewards_type ON rewards(reward_type);
CREATE INDEX idx_rewards_rarity ON rewards(rarity);
CREATE INDEX idx_rewards_cost ON rewards(cost_rad_tokens);

-- ============================================================================
-- REWARD REDEMPTIONS
-- ============================================================================
-- Track user reward claims and redemptions

CREATE TYPE redemption_status AS ENUM (
  'claimed',           -- User claimed but not redeemed yet
  'pending_approval',  -- Waiting for teacher/parent approval
  'approved',          -- Approved, ready for redemption
  'redeemed',          -- Successfully redeemed at partner
  'expired',           -- Redemption window expired
  'cancelled',         -- Cancelled by user or admin
  'refunded'           -- Points refunded
);

CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partner_organizations(id) ON DELETE CASCADE,
  
  -- Redemption details
  status redemption_status DEFAULT 'claimed',
  confirmation_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "WLA-XKCD-9876"
  qr_code_data TEXT, -- QR code content for validation
  
  -- Point transaction
  point_transaction_id UUID REFERENCES point_transactions(id),
  cost_paid_tokens INTEGER NOT NULL,
  cost_paid_learning INTEGER DEFAULT 0,
  cost_paid_action INTEGER DEFAULT 0,
  
  -- Scheduling (if required)
  scheduled_date DATE,
  scheduled_time TIME,
  appointment_confirmation TEXT,
  
  -- Approval workflow
  requires_approval BOOLEAN DEFAULT false,
  approval_requested_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id), -- Teacher/parent who approved
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  
  -- Redemption tracking
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  redeemed_at TIMESTAMP WITH TIME ZONE,
  redeemed_by_partner_user UUID, -- Partner staff member who validated
  redemption_location TEXT, -- Physical location if applicable
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Auto-calculated based on reward settings
  
  -- Cancellation
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  refund_issued BOOLEAN DEFAULT false,
  
  -- Feedback
  user_rating INTEGER, -- 1-5 stars
  user_feedback TEXT,
  partner_notes TEXT,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_redemptions_user ON reward_redemptions(user_id, status);
CREATE INDEX idx_redemptions_reward ON reward_redemptions(reward_id);
CREATE INDEX idx_redemptions_partner ON reward_redemptions(partner_id);
CREATE INDEX idx_redemptions_status ON reward_redemptions(status);
CREATE INDEX idx_redemptions_confirmation ON reward_redemptions(confirmation_code);
CREATE INDEX idx_redemptions_expiry ON reward_redemptions(expires_at);

-- ============================================================================
-- GRADE INTEGRATION
-- ============================================================================
-- System for converting activity into academic grades

CREATE TYPE grade_category AS ENUM (
  'participation',
  'field_work',
  'knowledge',
  'collaboration',
  'conservation_action',
  'leadership'
);

CREATE TABLE grade_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Assignment details
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category grade_category NOT NULL,
  
  -- Point requirements
  required_learning_points INTEGER DEFAULT 0,
  required_action_points INTEGER DEFAULT 0,
  required_social_points INTEGER DEFAULT 0,
  
  -- Alternative requirements (OR logic)
  required_check_ins INTEGER DEFAULT 0,
  required_achievements INTEGER DEFAULT 0,
  required_challenge_completions INTEGER DEFAULT 0,
  specific_achievement_ids UUID[], -- Must complete these specific achievements
  
  -- Grading scale
  total_possible_points INTEGER NOT NULL, -- Academic grade points (e.g., 100)
  conversion_formula TEXT, -- Formula for converting activity to grade
  grade_letter_scale JSONB, -- {"A": 90, "B": 80, "C": 70, "D": 60}
  
  -- Dates
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  
  -- Settings
  allow_late_submission BOOLEAN DEFAULT false,
  late_penalty_percentage INTEGER DEFAULT 10,
  extra_credit_available BOOLEAN DEFAULT false,
  extra_credit_max_points INTEGER,
  
  -- Display
  is_published BOOLEAN DEFAULT false,
  weight DECIMAL(5,2), -- Weight in overall grade (e.g., 0.20 for 20%)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_grade_assignments_teacher ON grade_assignments(teacher_id);
CREATE INDEX idx_grade_assignments_class ON grade_assignments(class_id);
CREATE INDEX idx_grade_assignments_due_date ON grade_assignments(due_date);

-- Student grades for assignments
CREATE TABLE student_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES grade_assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Points earned (in gamification system)
  learning_points_earned INTEGER DEFAULT 0,
  action_points_earned INTEGER DEFAULT 0,
  social_points_earned INTEGER DEFAULT 0,
  check_ins_completed INTEGER DEFAULT 0,
  achievements_completed INTEGER DEFAULT 0,
  
  -- Calculated grade
  points_earned DECIMAL(5,2), -- Academic points
  points_possible INTEGER,
  percentage DECIMAL(5,2), -- 0-100
  letter_grade VARCHAR(2), -- A+, A, A-, B+, etc.
  
  -- Status
  is_submitted BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE,
  is_late BOOLEAN DEFAULT false,
  is_graded BOOLEAN DEFAULT false,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES users(id),
  
  -- Feedback
  teacher_comments TEXT,
  private_notes TEXT, -- Not visible to student
  
  -- Extra credit
  extra_credit_points DECIMAL(5,2) DEFAULT 0,
  extra_credit_note TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_student_grades_assignment ON student_grades(assignment_id);
CREATE INDEX idx_student_grades_student ON student_grades(student_id);
CREATE INDEX idx_student_grades_graded ON student_grades(is_graded);

-- ============================================================================
-- RAD PASS LICENSING
-- ============================================================================
-- White-label configurations for RAD Pass and other institutions

CREATE TABLE rad_pass_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Deployment identification
  deployment_name VARCHAR(255) NOT NULL UNIQUE, -- 'Pittsburgh RAD Pass', 'Cleveland Arts Pass'
  subdomain VARCHAR(100) UNIQUE, -- 'pittsburgh', 'cleveland' (for rad-pass.pittsburgh.wildpraxis.com)
  custom_domain VARCHAR(255), -- Full custom domain if provided
  
  -- Organization
  organization_name VARCHAR(255) NOT NULL,
  organization_type VARCHAR(100), -- 'municipal', 'regional', 'school_district', 'nonprofit'
  primary_contact_email VARCHAR(255) NOT NULL,
  
  -- Branding
  logo_url TEXT,
  primary_color VARCHAR(7), -- Hex color
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  custom_css TEXT, -- Additional styling
  
  -- Features enabled
  features_enabled JSONB, -- {"museums": true, "restaurants": true, "leaderboards": false}
  
  -- Point configuration
  point_conversion_rates JSONB, -- Custom conversion rates
  point_expiration_enabled BOOLEAN DEFAULT false,
  point_expiration_days INTEGER,
  
  -- Integration settings
  api_key TEXT UNIQUE NOT NULL,
  webhook_url TEXT,
  sso_enabled BOOLEAN DEFAULT false,
  sso_provider VARCHAR(50),
  sso_config JSONB,
  
  -- Licensing
  license_type VARCHAR(50), -- 'trial', 'basic', 'premium', 'enterprise'
  monthly_fee DECIMAL(10,2),
  transaction_fee_percentage DECIMAL(5,2), -- Fee per reward redemption
  contract_start_date DATE NOT NULL,
  contract_end_date DATE,
  is_active BOOLEAN DEFAULT true,
  
  -- Analytics
  total_users INTEGER DEFAULT 0,
  total_partners INTEGER DEFAULT 0,
  total_redemptions INTEGER DEFAULT 0,
  monthly_active_users INTEGER DEFAULT 0,
  
  -- Support
  support_email VARCHAR(255),
  support_phone VARCHAR(20),
  support_hours TEXT,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_deployments_subdomain ON rad_pass_deployments(subdomain);
CREATE INDEX idx_deployments_active ON rad_pass_deployments(is_active);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================
-- Pre-aggregated stats for dashboards

CREATE TABLE daily_partner_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partner_organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Redemption metrics
  redemptions_claimed INTEGER DEFAULT 0,
  redemptions_redeemed INTEGER DEFAULT 0,
  redemptions_expired INTEGER DEFAULT 0,
  
  -- Financial metrics
  total_tokens_redeemed INTEGER DEFAULT 0,
  estimated_value_provided DECIMAL(10,2), -- Based on retail values
  
  -- User metrics
  unique_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  returning_users INTEGER DEFAULT 0,
  
  -- Ratings
  average_rating DECIMAL(3,2),
  total_ratings INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(partner_id, date)
);

CREATE INDEX idx_partner_stats_date ON daily_partner_stats(date DESC);
CREATE INDEX idx_partner_stats_partner ON daily_partner_stats(partner_id, date DESC);

-- ============================================================================
-- PROMOTIONAL CAMPAIGNS
-- ============================================================================
-- Time-limited bonus point campaigns

CREATE TABLE promotional_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Campaign details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50), -- 'bonus_points', 'double_points', 'featured_rewards', 'flash_sale'
  
  -- Targeting
  target_audience JSONB, -- {"grades": [6,7,8], "schools": ["..."], "classes": ["..."]}
  deployment_id UUID REFERENCES rad_pass_deployments(id), -- If specific to deployment
  
  -- Bonus configuration
  bonus_multiplier DECIMAL(3,2) DEFAULT 1.0, -- 2.0 = double points
  bonus_flat_amount INTEGER, -- Fixed bonus points
  affected_activities TEXT[], -- Which activities get bonuses
  
  -- Featured rewards
  featured_reward_ids UUID[], -- Highlight specific rewards
  featured_partner_ids UUID[], -- Highlight specific partners
  
  -- Dates
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Analytics
  total_participants INTEGER DEFAULT 0,
  total_bonus_points_awarded INTEGER DEFAULT 0,
  total_redemptions_during_campaign INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_campaigns_active ON promotional_campaigns(is_active, start_date, end_date);
CREATE INDEX idx_campaigns_deployment ON promotional_campaigns(deployment_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to award points and update balances
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_currency point_currency,
  p_amount INTEGER,
  p_source_type TEXT,
  p_source_id UUID,
  p_description TEXT,
  p_awarded_by UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT 
    CASE p_currency
      WHEN 'learning_points' THEN learning_points
      WHEN 'action_points' THEN action_points
      WHEN 'social_points' THEN social_points
      WHEN 'bonus_points' THEN bonus_points
      WHEN 'rad_tokens' THEN rad_tokens
    END INTO v_current_balance
  FROM user_point_balances
  WHERE user_id = p_user_id;
  
  -- If no balance record exists, create one
  IF v_current_balance IS NULL THEN
    INSERT INTO user_point_balances (user_id)
    VALUES (p_user_id);
    v_current_balance := 0;
  END IF;
  
  -- Calculate new balance
  v_new_balance := v_current_balance + p_amount;
  
  -- Create transaction
  INSERT INTO point_transactions (
    user_id,
    currency,
    transaction_type,
    amount,
    balance_after,
    source_type,
    source_id,
    description,
    awarded_by,
    metadata
  ) VALUES (
    p_user_id,
    p_currency,
    'earned',
    p_amount,
    v_new_balance,
    p_source_type,
    p_source_id,
    p_description,
    p_awarded_by,
    p_metadata
  ) RETURNING id INTO v_transaction_id;
  
  -- Update balance
  UPDATE user_point_balances
  SET 
    learning_points = CASE WHEN p_currency = 'learning_points' THEN learning_points + p_amount ELSE learning_points END,
    action_points = CASE WHEN p_currency = 'action_points' THEN action_points + p_amount ELSE action_points END,
    social_points = CASE WHEN p_currency = 'social_points' THEN social_points + p_amount ELSE social_points END,
    bonus_points = CASE WHEN p_currency = 'bonus_points' THEN bonus_points + p_amount ELSE bonus_points END,
    rad_tokens = CASE WHEN p_currency = 'rad_tokens' THEN rad_tokens + p_amount ELSE rad_tokens END,
    lifetime_learning = CASE WHEN p_currency = 'learning_points' THEN lifetime_learning + p_amount ELSE lifetime_learning END,
    lifetime_action = CASE WHEN p_currency = 'action_points' THEN lifetime_action + p_amount ELSE lifetime_action END,
    lifetime_social = CASE WHEN p_currency = 'social_points' THEN lifetime_social + p_amount ELSE lifetime_social END,
    lifetime_bonus = CASE WHEN p_currency = 'bonus_points' THEN lifetime_bonus + p_amount ELSE lifetime_bonus END,
    lifetime_rad_tokens = CASE WHEN p_currency = 'rad_tokens' THEN lifetime_rad_tokens + p_amount ELSE lifetime_rad_tokens END,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Function to convert points to RAD tokens
CREATE OR REPLACE FUNCTION convert_to_rad_tokens(
  p_user_id UUID,
  p_learning_points INTEGER DEFAULT 0,
  p_action_points INTEGER DEFAULT 0,
  p_social_points INTEGER DEFAULT 0
) RETURNS INTEGER AS $$
DECLARE
  v_rad_tokens_earned INTEGER := 0;
  v_rates RECORD;
BEGIN
  -- Get conversion rates for user
  SELECT learning_to_rad_rate, action_to_rad_rate, social_to_rad_rate
  INTO v_rates
  FROM user_point_balances
  WHERE user_id = p_user_id;
  
  -- Calculate RAD tokens to award
  IF p_learning_points > 0 THEN
    v_rad_tokens_earned := v_rad_tokens_earned + FLOOR(p_learning_points::DECIMAL / v_rates.learning_to_rad_rate);
  END IF;
  
  IF p_action_points > 0 THEN
    v_rad_tokens_earned := v_rad_tokens_earned + FLOOR(p_action_points::DECIMAL / v_rates.action_to_rad_rate);
  END IF;
  
  IF p_social_points > 0 THEN
    v_rad_tokens_earned := v_rad_tokens_earned + FLOOR(p_social_points::DECIMAL / v_rates.social_to_rad_rate);
  END IF;
  
  -- Deduct source points and award RAD tokens
  IF v_rad_tokens_earned > 0 THEN
    -- Deduct source currency
    UPDATE user_point_balances
    SET
      learning_points = learning_points - p_learning_points,
      action_points = action_points - p_action_points,
      social_points = social_points - p_social_points,
      rad_tokens = rad_tokens + v_rad_tokens_earned,
      updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record transactions
    IF p_learning_points > 0 THEN
      PERFORM award_points(
        p_user_id,
        'learning_points'::point_currency,
        -p_learning_points,
        'conversion',
        NULL,
        'Converted to RAD tokens'
      );
    END IF;
    
    IF p_action_points > 0 THEN
      PERFORM award_points(
        p_user_id,
        'action_points'::point_currency,
        -p_action_points,
        'conversion',
        NULL,
        'Converted to RAD tokens'
      );
    END IF;
    
    IF p_social_points > 0 THEN
      PERFORM award_points(
        p_user_id,
        'social_points'::point_currency,
        -p_social_points,
        'conversion',
        NULL,
        'Converted to RAD tokens'
      );
    END IF;
    
    PERFORM award_points(
      p_user_id,
      'rad_tokens'::point_currency,
      v_rad_tokens_earned,
      'conversion',
      NULL,
      'Converted from activity points'
    );
  END IF;
  
  RETURN v_rad_tokens_earned;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique confirmation code
CREATE OR REPLACE FUNCTION generate_confirmation_code() RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate format: WLA-XXXX-9999
    v_code := 'WLA-' || 
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
              LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if exists
    SELECT EXISTS(
      SELECT 1 FROM reward_redemptions WHERE confirmation_code = v_code
    ) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA - Pittsburgh RAD Pass Partners
-- ============================================================================

-- Initialize Pittsburgh RAD Pass deployment
INSERT INTO rad_pass_deployments (
  deployment_name,
  subdomain,
  organization_name,
  organization_type,
  primary_contact_email,
  primary_color,
  secondary_color,
  accent_color,
  license_type,
  monthly_fee,
  contract_start_date,
  is_active
) VALUES (
  'Pittsburgh RAD Pass',
  'pittsburgh',
  'Regional Asset District - Allegheny County',
  'municipal',
  'info@radworkshere.org',
  '#FF6B35', -- RAD orange
  '#004E89', -- RAD blue
  '#F7B801', -- RAD yellow
  'enterprise',
  0.00,
  CURRENT_DATE,
  true
);

-- Add partner organizations
DO $$
DECLARE
  v_rad_deployment_id UUID;
BEGIN
  SELECT id INTO v_rad_deployment_id FROM rad_pass_deployments WHERE subdomain = 'pittsburgh';
  
  -- Museums
  INSERT INTO partner_organizations (name, category, subcategory, city, state, website, status, partnership_level, logo_url, description) VALUES
    ('Carnegie Museum of Natural History', 'museum', 'natural_history', 'Pittsburgh', 'PA', 'https://carnegiemnh.org', 'active', 'rad_pass', '/partners/carnegie-nmnh.png', 'World-class natural history museum with dinosaurs, minerals, and wildlife halls'),
    ('Carnegie Science Center', 'museum', 'science', 'Pittsburgh', 'PA', 'https://carnegiesciencecenter.org', 'active', 'rad_pass', '/partners/carnegie-science.png', 'Interactive science museum with planetarium and USS Requin submarine'),
    ('The Andy Warhol Museum', 'museum', 'art', 'Pittsburgh', 'PA', 'https://www.warhol.org', 'active', 'rad_pass', '/partners/warhol.png', 'Largest museum dedicated to a single artist in North America'),
    ('Carnegie Museum of Art', 'museum', 'art', 'Pittsburgh', 'PA', 'https://cmoa.org', 'active', 'rad_pass', '/partners/carnegie-art.png', 'Contemporary and classical art collections'),
    ('Phipps Conservatory', 'cultural_venue', 'botanical_garden', 'Pittsburgh', 'PA', 'https://phipps.conservatory.org', 'active', 'rad_pass', '/partners/phipps.png', 'Stunning botanical gardens and sustainable horticulture'),
    ('National Aviary', 'cultural_venue', 'zoo', 'Pittsburgh', 'PA', 'https://www.aviary.org', 'active', 'rad_pass', '/partners/aviary.png', 'America''s only independent indoor nonprofit aviary'),
    ('Children''s Museum of Pittsburgh', 'museum', 'children', 'Pittsburgh', 'PA', 'https://pittsburghkids.org', 'active', 'rad_pass', '/partners/childrens-museum.png', 'Award-winning hands-on learning experiences for kids'),
    ('Pittsburgh Zoo & Aquarium', 'cultural_venue', 'zoo', 'Pittsburgh', 'PA', 'https://pittsburghzoo.org', 'active', 'rad_pass', '/partners/zoo.png', 'Home to thousands of animals from around the world');
  
  -- Libraries (Carnegie Library of Pittsburgh system)
  INSERT INTO partner_organizations (name, category, subcategory, city, state, website, status, partnership_level, description) VALUES
    ('Carnegie Library - Main (Oakland)', 'library', 'public_library', 'Pittsburgh', 'PA', 'https://carnegielibrary.org', 'active', 'rad_pass', 'Historic main branch with extensive collections and maker spaces'),
    ('Carnegie Library - Squirrel Hill', 'library', 'public_library', 'Pittsburgh', 'PA', 'https://carnegielibrary.org', 'active', 'rad_pass', 'Community library branch serving Squirrel Hill'),
    ('Carnegie Library - Homewood', 'library', 'public_library', 'Pittsburgh', 'PA', 'https://carnegielibrary.org', 'active', 'rad_pass', 'Community hub with STEM programs'),
    ('Carnegie Library - Hazelwood', 'library', 'public_library', 'Pittsburgh', 'PA', 'https://carnegielibrary.org', 'active', 'rad_pass', 'Neighborhood library with youth programs');
  
  -- Entertainment venues
  INSERT INTO partner_organizations (name, category, subcategory, city, state, website, status, partnership_level, description, requires_appointment, max_group_size) VALUES
    ('Urban Air Adventure Park', 'entertainment', 'trampoline_park', 'Pittsburgh', 'PA', 'https://urbanairtrampolinepark.com', 'active', 'gold', 'Trampoline park with attractions and climbing walls', true, 50),
    ('Dave & Buster''s Waterfront', 'entertainment', 'arcade', 'Pittsburgh', 'PA', 'https://daveandbusters.com', 'active', 'gold', 'Arcade games, virtual reality, and dining', false, 40),
    ('TopGolf Pittsburgh', 'entertainment', 'golf', 'Pittsburgh', 'PA', 'https://topgolf.com', 'active', 'gold', 'High-tech driving range entertainment venue', true, 30),
    ('Scene75 Entertainment Center', 'entertainment', 'arcade', 'Pittsburgh', 'PA', 'https://scene75.com', 'active', 'gold', 'Indoor entertainment center with go-karts and arcade', false, 50);
  
  -- Restaurants (Local Pittsburgh favorites)
  INSERT INTO partner_organizations (name, category, subcategory, city, state, website, status, partnership_level, description) VALUES
    ('Mineo''s Pizza House', 'restaurant', 'pizza', 'Pittsburgh', 'PA', 'https://mineospizza.com', 'active', 'silver', 'Iconic Pittsburgh pizza since 1958'),
    ('Aiello''s Pizza', 'restaurant', 'pizza', 'Pittsburgh', 'PA', 'https://aiellospizza.com', 'active', 'silver', 'Family-owned Pittsburgh pizza tradition'),
    ('Primanti Bros', 'restaurant', 'sandwich', 'Pittsburgh', 'PA', 'https://primantibros.com', 'active', 'silver', 'Famous sandwiches with fries and coleslaw on top'),
    ('The Original Hot Dog Shop (The O)', 'restaurant', 'fast_food', 'Pittsburgh', 'PA', null, 'active', 'silver', 'Oakland institution serving fries and hot dogs to students'),
    ('Stack''d Burgers', 'restaurant', 'burgers', 'Pittsburgh', 'PA', 'https://stackdburgers.com', 'active', 'silver', 'Build-your-own burger creations'),
    ('Rita''s Italian Ice', 'restaurant', 'dessert', 'Pittsburgh', 'PA', 'https://ritasice.com', 'active', 'silver', 'Italian ice and frozen custard treats');
  
END $$;

-- ============================================================================
-- SAMPLE REWARDS
-- ============================================================================

DO $$
DECLARE
  v_carnegie_nmnh_id UUID;
  v_science_center_id UUID;
  v_urban_air_id UUID;
  v_mineos_id UUID;
  v_topgolf_id UUID;
BEGIN
  -- Get partner IDs
  SELECT id INTO v_carnegie_nmnh_id FROM partner_organizations WHERE name = 'Carnegie Museum of Natural History';
  SELECT id INTO v_science_center_id FROM partner_organizations WHERE name = 'Carnegie Science Center';
  SELECT id INTO v_urban_air_id FROM partner_organizations WHERE name = 'Urban Air Adventure Park';
  SELECT id INTO v_mineos_id FROM partner_organizations WHERE name = 'Mineo''s Pizza House';
  SELECT id INTO v_topgolf_id FROM partner_organizations WHERE name = 'TopGolf Pittsburgh';
  
  -- Carnegie Museum rewards
  INSERT INTO rewards (
    partner_id, name, description, reward_type, rarity, cost_rad_tokens,
    retail_value, is_active, quantity_per_user, redemption_method, icon
  ) VALUES
    (v_carnegie_nmnh_id, 'Free General Admission', 'Free general admission pass to explore dinosaurs, gems, and wildlife', 'admission', 'rare', 150, 19.95, true, 4, 'qr_code', '🦕'),
    (v_carnegie_nmnh_id, 'Behind-the-Scenes Tour', 'Exclusive behind-the-scenes tour of research collections', 'experience', 'epic', 500, 75.00, true, 1, 'appointment', '🔬'),
    (v_carnegie_nmnh_id, 'Gift Shop Voucher', '$10 gift shop credit for souvenirs', 'discount', 'uncommon', 75, 10.00, true, 2, 'qr_code', '🎁');
  
  -- Science Center rewards
  INSERT INTO rewards (
    partner_id, name, description, reward_type, rarity, cost_rad_tokens,
    retail_value, is_active, quantity_per_user, redemption_method, icon
  ) VALUES
    (v_science_center_id, 'Science Center Pass', 'General admission to hands-on science exhibits', 'admission', 'rare', 150, 19.95, true, 4, 'qr_code', '🔭'),
    (v_science_center_id, 'Planetarium Show', 'Admission to digital planetarium show', 'experience', 'uncommon', 100, 10.00, true, 2, 'qr_code', '🌌'),
    (v_science_center_id, 'USS Requin Submarine Tour', 'Tour the historic WWII submarine', 'experience', 'rare', 125, 15.00, true, 2, 'qr_code', '⚓');
  
  -- Urban Air rewards
  INSERT INTO rewards (
    partner_id, name, description, reward_type, rarity, cost_rad_tokens,
    retail_value, is_active, quantity_per_user, redemption_method, icon,
    requires_appointment, expiration_days
  ) VALUES
    (v_urban_air_id, '1 Hour Ultimate Pass', 'One hour of unlimited attractions access', 'experience', 'epic', 300, 29.99, true, 2, 'qr_code', '🤸', true, 60),
    (v_urban_air_id, 'Warrior Course Entry', 'Single entry to the warrior obstacle course', 'experience', 'uncommon', 100, 12.99, true, 4, 'qr_code', '💪', true, 60);
  
  -- TopGolf rewards
  INSERT INTO rewards (
    partner_id, name, description, reward_type, rarity, cost_rad_tokens,
    retail_value, is_active, quantity_per_user, redemption_method, icon,
    requires_appointment, expiration_days
  ) VALUES
    (v_topgolf_id, '$25 Game Credit', '$25 credit toward bay rental and games', 'discount', 'epic', 400, 25.00, true, 2, 'qr_code', '⛳', true, 90),
    (v_topgolf_id, 'Free Appetizer', 'Free appetizer with bay rental', 'food', 'uncommon', 150, 12.00, true, 2, 'qr_code', '🍟', false, 30);
  
  -- Pizza rewards
  INSERT INTO rewards (
    partner_id, name, description, reward_type, rarity, cost_rad_tokens,
    retail_value, is_active, quantity_per_user, redemption_method, icon,
    expiration_days
  ) VALUES
    (v_mineos_id, 'Free Pizza Slice', 'One free slice of classic Mineo''s pizza', 'food', 'common', 50, 4.50, true, 8, 'qr_code', '🍕', 14),
    (v_mineos_id, '$10 Off Large Pizza', '$10 off any large pizza purchase', 'discount', 'uncommon', 100, 10.00, true, 4, 'qr_code', '🍕', 30),
    (v_mineos_id, 'Free 2-Liter Soda', 'Free 2-liter soda with any purchase', 'food', 'common', 25, 3.00, true, 12, 'qr_code', '🥤', 14);
END $$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_point_trans_user_currency_date ON point_transactions(user_id, currency, created_at DESC);
CREATE INDEX idx_rewards_active_partner_cost ON rewards(is_active, partner_id, cost_rad_tokens);
CREATE INDEX idx_redemptions_user_status_created ON reward_redemptions(user_id, status, created_at DESC);
CREATE INDEX idx_student_grades_student_assignment ON student_grades(student_id, assignment_id);

-- Partial indexes for active records
CREATE INDEX idx_rewards_active_featured ON rewards(featured_order) WHERE is_active = true AND featured = true;
CREATE INDEX idx_redemptions_active ON reward_redemptions(expires_at) WHERE status IN ('claimed', 'approved');
CREATE INDEX idx_partners_active ON partner_organizations(name) WHERE status = 'active';

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_point_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE rad_pass_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_partner_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_campaigns ENABLE ROW LEVEL SECURITY;

-- User can see their own point transactions
CREATE POLICY user_view_own_transactions ON point_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- User can see their own balance
CREATE POLICY user_view_own_balance ON user_point_balances
  FOR SELECT USING (auth.uid() = user_id);

-- Everyone can see active partners
CREATE POLICY public_view_active_partners ON partner_organizations
  FOR SELECT USING (status = 'active');

-- Everyone can see active rewards
CREATE POLICY public_view_active_rewards ON rewards
  FOR SELECT USING (is_active = true);

-- User can see their own redemptions
CREATE POLICY user_view_own_redemptions ON reward_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- User can create redemptions
CREATE POLICY user_create_redemptions ON reward_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teachers can see grades for their classes
CREATE POLICY teacher_view_class_grades ON student_grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM grade_assignments ga
      WHERE ga.id = student_grades.assignment_id
      AND ga.teacher_id = auth.uid()
    )
  );

-- Students can see their own grades
CREATE POLICY student_view_own_grades ON student_grades
  FOR SELECT USING (auth.uid() = student_id);

-- Admin policies
CREATE POLICY admin_all_access_partners ON partner_organizations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY admin_all_access_rewards ON rewards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY admin_all_access_redemptions ON reward_redemptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_orgs_updated_at BEFORE UPDATE ON partner_organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_redemptions_updated_at BEFORE UPDATE ON reward_redemptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grade_assignments_updated_at BEFORE UPDATE ON grade_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_grades_updated_at BEFORE UPDATE ON student_grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate confirmation codes on redemption creation
CREATE OR REPLACE FUNCTION set_redemption_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := generate_confirmation_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_redemption_confirmation_code BEFORE INSERT ON reward_redemptions
  FOR EACH ROW EXECUTE FUNCTION set_redemption_code();

-- Auto-calculate expiration date
CREATE OR REPLACE FUNCTION set_redemption_expiration()
RETURNS TRIGGER AS $$
DECLARE
  v_expiration_days INTEGER;
BEGIN
  SELECT expiration_days INTO v_expiration_days
  FROM rewards
  WHERE id = NEW.reward_id;
  
  NEW.expires_at := NOW() + (COALESCE(v_expiration_days, 30) || ' days')::INTERVAL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_redemption_expiration_date BEFORE INSERT ON reward_redemptions
  FOR EACH ROW EXECUTE FUNCTION set_redemption_expiration();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View of available rewards with partner info
CREATE OR REPLACE VIEW available_rewards_view AS
SELECT 
  r.*,
  p.name as partner_name,
  p.category as partner_category,
  p.logo_url as partner_logo,
  p.city as partner_city,
  p.website as partner_website,
  (r.quantity_remaining > 0 OR r.quantity_remaining IS NULL) as in_stock,
  (r.available_start_date IS NULL OR r.available_start_date <= CURRENT_DATE) AND
  (r.available_end_date IS NULL OR r.available_end_date >= CURRENT_DATE) as currently_available
FROM rewards r
JOIN partner_organizations p ON r.partner_id = p.id
WHERE r.is_active = true AND p.status = 'active';

-- View of user statistics
CREATE OR REPLACE VIEW user_gamification_stats AS
SELECT 
  u.id as user_id,
  u.display_name,
  u.level,
  u.experience,
  b.learning_points,
  b.action_points,
  b.social_points,
  b.bonus_points,
  b.rad_tokens,
  b.lifetime_learning,
  b.lifetime_action,
  b.lifetime_social,
  b.lifetime_rad_tokens,
  b.total_redeemed,
  (b.learning_points + b.action_points + b.social_points + b.bonus_points) as total_points,
  (SELECT COUNT(*) FROM reward_redemptions WHERE user_id = u.id AND status = 'redeemed') as rewards_redeemed_count,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id = u.id AND progress = 100) as achievements_completed
FROM users u
LEFT JOIN user_point_balances b ON u.id = b.user_id;

COMMENT ON TABLE point_transactions IS 'Ledger of all point earnings and spending';
COMMENT ON TABLE user_point_balances IS 'Current point balances for each user across all currencies';
COMMENT ON TABLE partner_organizations IS 'Partner organizations offering rewards (museums, restaurants, venues)';
COMMENT ON TABLE rewards IS 'Catalog of rewards available for redemption';
COMMENT ON TABLE reward_redemptions IS 'User reward claims and redemption tracking';
COMMENT ON TABLE grade_assignments IS 'Teacher-created assignments that convert activity to grades';
COMMENT ON TABLE student_grades IS 'Student grades calculated from gamification activity';
COMMENT ON TABLE rad_pass_deployments IS 'White-label deployments for RAD Pass and other institutions';
COMMENT ON TABLE daily_partner_stats IS 'Aggregated daily statistics for partner analytics';
COMMENT ON TABLE promotional_campaigns IS 'Time-limited promotional campaigns and bonuses';

