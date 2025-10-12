-- ============================================================================
-- Next-Generation Conservation Platform Database Schema
-- PostgreSQL with PostGIS extension for geospatial data
-- ============================================================================

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- User Management
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'educator', 'parent', 'admin', 'partner');
CREATE TYPE ambassador_level AS ENUM ('novice', 'apprentice', 'ambassador', 'expert', 'master', 'legend');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    
    -- User info
    role user_role DEFAULT 'student',
    age INTEGER,
    school_or_organization VARCHAR(255),
    
    -- Progression
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    ambassador_level ambassador_level DEFAULT 'novice',
    
    -- Points
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    
    -- Privacy
    is_profile_public BOOLEAN DEFAULT true,
    share_location BOOLEAN DEFAULT true,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_total_points ON users(total_points DESC);

-- ============================================================================
-- Locations
-- ============================================================================

CREATE TYPE location_category AS ENUM (
    'state_park', 'state_forest', 'county_park', 'city_park',
    'museum', 'nature_center', 'library', 'community_center',
    'university', 'fishing_access', 'wildlife_area', 'trailhead',
    'water_body', 'conservation_area', 'historic_site'
);

CREATE TYPE location_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category location_category NOT NULL,
    rarity location_rarity DEFAULT 'common',
    
    -- Geographic data (using PostGIS)
    coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
    boundary GEOGRAPHY(POLYGON, 4326),
    check_in_radius INTEGER DEFAULT 100, -- meters
    
    -- Address & contact
    address TEXT,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    state VARCHAR(2) DEFAULT 'PA',
    zip_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    
    -- Hours (JSON for flexibility)
    hours JSONB,
    seasonal_access JSONB,
    
    -- Amenities (array of strings)
    amenities TEXT[],
    accessibility TEXT[],
    
    -- Gamification
    base_points INTEGER DEFAULT 10,
    distance_multiplier DECIMAL(3,2) DEFAULT 1.0,
    first_visit_bonus INTEGER DEFAULT 50,
    
    -- Content
    species TEXT[], -- species IDs
    habitats TEXT[],
    highlights TEXT[],
    educational_content TEXT, -- markdown
    
    -- Media
    images TEXT[],
    map_tile_url TEXT,
    
    -- Partnerships
    partner_organization UUID REFERENCES partners(id),
    has_qr_code BOOLEAN DEFAULT false,
    qr_code_data TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    
    -- Analytics
    total_visits INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spatial indexes for fast geographic queries
CREATE INDEX idx_locations_coordinates ON locations USING GIST(coordinates);
CREATE INDEX idx_locations_boundary ON locations USING GIST(boundary);
CREATE INDEX idx_locations_category ON locations(category);
CREATE INDEX idx_locations_rarity ON locations(rarity);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_county ON locations(county);

-- ============================================================================
-- User Visits / Check-ins
-- ============================================================================

CREATE TYPE verification_method AS ENUM ('gps', 'qr_code', 'photo', 'staff_verification', 'manual_review');

CREATE TABLE user_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    
    -- Visit details
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    check_out_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Verification
    verification_method verification_method NOT NULL,
    verification_confidence INTEGER DEFAULT 0, -- 0-100
    verification_metadata JSONB,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- GPS data
    coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
    gps_accuracy DECIMAL(10,2),
    route_data JSONB, -- array of coordinates if tracking enabled
    distance_traveled INTEGER, -- meters
    
    -- Engagement
    completed_challenges UUID[],
    photos_submitted TEXT[],
    observations_made UUID[],
    notes TEXT,
    
    -- Rewards
    points_earned INTEGER DEFAULT 0,
    badges_earned UUID[],
    
    -- Social
    companions UUID[],
    is_public BOOLEAN DEFAULT true,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visits_user ON user_visits(user_id);
CREATE INDEX idx_visits_location ON user_visits(location_id);
CREATE INDEX idx_visits_check_in ON user_visits(check_in_time DESC);
CREATE INDEX idx_visits_coordinates ON user_visits USING GIST(coordinates);
CREATE INDEX idx_visits_verified ON user_visits(is_verified);

-- ============================================================================
-- Badges
-- ============================================================================

CREATE TYPE badge_category AS ENUM ('explorer', 'scientist', 'scholar', 'ambassador', 'master', 'special');
CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'elite');

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category badge_category NOT NULL,
    tier badge_tier NOT NULL,
    
    -- Requirements (JSON for flexibility)
    requirements JSONB NOT NULL,
    prerequisite_badges UUID[],
    
    -- Rewards
    points_reward INTEGER DEFAULT 0,
    unlocks_rewards UUID[],
    
    -- Display
    icon_url TEXT NOT NULL,
    icon_url_locked TEXT,
    color VARCHAR(7), -- hex color
    
    -- Rarity
    rarity location_rarity DEFAULT 'common',
    earned_by_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_hidden BOOLEAN DEFAULT false, -- secret badges
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_tier ON badges(tier);
CREATE INDEX idx_badges_rarity ON badges(rarity);

CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    
    -- Earning details
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    earned_by TEXT, -- description of trigger
    progress INTEGER DEFAULT 100, -- 0-100
    
    -- Display
    is_displayed BOOLEAN DEFAULT true,
    display_order INTEGER,
    
    -- Social
    share_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);
CREATE INDEX idx_user_badges_earned ON user_badges(earned_at DESC);

-- ============================================================================
-- Challenges
-- ============================================================================

CREATE TYPE challenge_type AS ENUM (
    'discovery', 'conservation', 'scavenger_hunt', 'data_collection',
    'educational', 'social', 'seasonal', 'time_limited'
);

CREATE TYPE challenge_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type challenge_type NOT NULL,
    difficulty challenge_difficulty DEFAULT 'medium',
    
    -- Requirements
    requirements JSONB NOT NULL,
    location_ids UUID[],
    species_ids TEXT[],
    
    -- Rewards
    points_reward INTEGER DEFAULT 0,
    badge_reward UUID REFERENCES badges(id),
    physical_reward TEXT,
    
    -- Timing
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    seasonal_months INTEGER[], -- 1-12
    
    -- Analytics
    participant_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    
    -- Educational
    learning_objectives TEXT[],
    related_content TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_challenges_type ON challenges(type);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX idx_challenges_active ON challenges(is_active);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);

CREATE TABLE user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    
    -- Progress
    status VARCHAR(20) DEFAULT 'in_progress', -- not_started, in_progress, completed, failed
    progress_percentage INTEGER DEFAULT 0,
    current_step INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_challenge ON user_challenges(challenge_id);
CREATE INDEX idx_user_challenges_status ON user_challenges(status);

-- ============================================================================
-- Rewards
-- ============================================================================

CREATE TYPE reward_type AS ENUM ('virtual', 'physical', 'experience', 'opportunity');
CREATE TYPE reward_status AS ENUM ('available', 'claimed', 'fulfilled', 'expired');

CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type reward_type NOT NULL,
    
    -- Cost
    point_cost INTEGER NOT NULL,
    badge_requirements UUID[],
    tier_requirement badge_tier,
    
    -- Inventory
    total_quantity INTEGER, -- null for unlimited
    remaining_quantity INTEGER,
    
    -- Partner
    provided_by UUID REFERENCES partners(id),
    partner_logo TEXT,
    value INTEGER, -- dollar value in cents
    
    -- Details
    images TEXT[],
    terms TEXT,
    expiration_days INTEGER,
    
    -- Fulfillment
    requires_shipping BOOLEAN DEFAULT false,
    requires_scheduling BOOLEAN DEFAULT false,
    redemption_instructions TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Analytics
    claim_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    available_until TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_rewards_type ON rewards(type);
CREATE INDEX idx_rewards_active ON rewards(is_active);
CREATE INDEX idx_rewards_featured ON rewards(is_featured);
CREATE INDEX idx_rewards_cost ON rewards(point_cost);

CREATE TABLE user_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    
    -- Claim details
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status reward_status DEFAULT 'claimed',
    
    -- Fulfillment
    fulfilled_at TIMESTAMP WITH TIME ZONE,
    tracking_number VARCHAR(100),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    
    -- Shipping
    shipping_address JSONB,
    
    -- Redemption
    redemption_code VARCHAR(50),
    redeemed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_rewards_user ON user_rewards(user_id);
CREATE INDEX idx_user_rewards_reward ON user_rewards(reward_id);
CREATE INDEX idx_user_rewards_status ON user_rewards(status);

-- ============================================================================
-- Partners
-- ============================================================================

CREATE TYPE partner_type AS ENUM ('state_agency', 'educational', 'conservation', 'corporate', 'foundation');

CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type partner_type NOT NULL,
    description TEXT,
    
    -- Contact
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website TEXT,
    
    -- Branding
    logo TEXT,
    primary_color VARCHAR(7),
    
    -- Agreement
    agreement_start_date DATE,
    agreement_end_date DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Analytics
    total_students_reached INTEGER DEFAULT 0,
    total_rewards_distributed INTEGER DEFAULT 0,
    impact_metrics JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_partners_type ON partners(type);
CREATE INDEX idx_partners_active ON partners(is_active);

-- ============================================================================
-- Achievements
-- ============================================================================

CREATE TYPE achievement_category AS ENUM ('exploration', 'learning', 'social', 'contribution', 'mastery', 'special');

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category achievement_category NOT NULL,
    
    -- Requirements
    requirements JSONB NOT NULL,
    
    -- Rewards
    experience_reward INTEGER DEFAULT 0,
    points_reward INTEGER DEFAULT 0,
    badge_reward UUID REFERENCES badges(id),
    unlocks_feature TEXT,
    
    -- Progression
    has_tiers BOOLEAN DEFAULT false,
    total_tiers INTEGER DEFAULT 1,
    
    -- Display
    icon TEXT NOT NULL,
    rarity location_rarity DEFAULT 'common',
    is_secret BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_repeatable BOOLEAN DEFAULT false,
    
    -- Stats
    unlocked_by_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Progress
    unlocked_at TIMESTAMP WITH TIME ZONE,
    progress INTEGER DEFAULT 0, -- 0-100
    current_tier INTEGER DEFAULT 1,
    
    -- Display
    is_new BOOLEAN DEFAULT true,
    viewed_at TIMESTAMP WITH TIME ZONE,
    is_pinned BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked_at DESC);

-- ============================================================================
-- Teams
-- ============================================================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    motto VARCHAR(255),
    
    -- Leadership
    captain_id UUID NOT NULL REFERENCES users(id),
    co_captains UUID[],
    
    -- Members
    members UUID[],
    max_members INTEGER DEFAULT 10,
    invite_code VARCHAR(20) UNIQUE,
    is_public BOOLEAN DEFAULT true,
    
    -- Stats
    total_points INTEGER DEFAULT 0,
    total_locations_visited INTEGER DEFAULT 0,
    total_challenges_completed INTEGER DEFAULT 0,
    team_level INTEGER DEFAULT 1,
    
    -- Competition
    regional_rank INTEGER,
    state_rank INTEGER,
    
    -- Appearance
    logo TEXT,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teams_captain ON teams(captain_id);
CREATE INDEX idx_teams_points ON teams(total_points DESC);
CREATE INDEX idx_teams_public ON teams(is_public);

-- ============================================================================
-- Observations / Citizen Science
-- ============================================================================

CREATE TABLE observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES user_visits(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    
    -- Observation details
    species_id TEXT,
    species_name VARCHAR(255),
    common_name VARCHAR(255),
    observation_type VARCHAR(50), -- sighting, photo, audio, tracks, etc.
    
    -- Data
    count INTEGER DEFAULT 1,
    notes TEXT,
    habitat_notes TEXT,
    behavior_notes TEXT,
    
    -- Location
    coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
    gps_accuracy DECIMAL(10,2),
    
    -- Media
    photos TEXT[],
    audio_url TEXT,
    
    -- AI assistance
    ai_suggested_species TEXT[],
    ai_confidence DECIMAL(5,2),
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    
    -- Timestamps
    observed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_observations_user ON observations(user_id);
CREATE INDEX idx_observations_species ON observations(species_id);
CREATE INDEX idx_observations_coordinates ON observations USING GIST(coordinates);
CREATE INDEX idx_observations_verified ON observations(is_verified);
CREATE INDEX idx_observations_date ON observations(observed_at DESC);

-- ============================================================================
-- Notifications
-- ============================================================================

CREATE TYPE notification_type AS ENUM (
    'achievement_unlocked', 'badge_earned', 'level_up', 'challenge_complete',
    'new_reward', 'nearby_location', 'friend_activity', 'team_update',
    'event_reminder', 'daily_mission'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    
    -- Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    icon TEXT,
    
    -- Action
    action_url TEXT,
    action_label VARCHAR(50),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Timing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- Analytics Events
-- ============================================================================

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID,
    
    -- Event details
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(50),
    event_data JSONB,
    
    -- Context
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    device_type VARCHAR(50),
    
    -- Location (if relevant)
    coordinates GEOGRAPHY(POINT, 4326),
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_date ON analytics_events(created_at DESC);

-- ============================================================================
-- Triggers for updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_visits_updated_at BEFORE UPDATE ON user_visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_observations_updated_at BEFORE UPDATE ON observations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Views for common queries
-- ============================================================================

-- User leaderboard view
CREATE VIEW leaderboard_global AS
SELECT 
    u.id,
    u.username,
    u.display_name,
    u.avatar_url,
    u.level,
    u.total_points,
    u.ambassador_level,
    COUNT(DISTINCT uv.location_id) as locations_visited,
    COUNT(DISTINCT ub.badge_id) as badges_earned,
    ROW_NUMBER() OVER (ORDER BY u.total_points DESC) as rank
FROM users u
LEFT JOIN user_visits uv ON u.id = uv.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
WHERE u.is_active = true
GROUP BY u.id;

-- Location popularity view
CREATE VIEW location_stats AS
SELECT 
    l.id,
    l.name,
    l.category,
    l.city,
    l.county,
    l.total_visits,
    l.unique_visitors,
    l.average_rating,
    COUNT(DISTINCT uv.user_id) as current_unique_visitors,
    AVG(uv.rating) as current_average_rating
FROM locations l
LEFT JOIN user_visits uv ON l.id = uv.location_id
WHERE l.is_active = true
GROUP BY l.id;

