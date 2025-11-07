-- ============================================================================
-- FIXED Conservation Platform Database Schema
-- PostgreSQL with PostGIS extension for geospatial data
-- FIX: Moved partners table BEFORE tables that reference it
-- ============================================================================

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Type Definitions (Enums)
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'educator', 'parent', 'admin', 'partner');
CREATE TYPE ambassador_level AS ENUM ('novice', 'apprentice', 'ambassador', 'expert', 'master', 'legend');
CREATE TYPE partner_type AS ENUM ('state_agency', 'educational', 'conservation', 'corporate', 'foundation');
CREATE TYPE location_type AS ENUM ('park', 'trail', 'waterway', 'preserve', 'education_center', 'other');
CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'elite');
CREATE TYPE achievement_category AS ENUM ('learning', 'exploration', 'contribution', 'leadership', 'special');

-- ============================================================================
-- User Management
-- ============================================================================

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

-- ============================================================================
-- Partners (MOVED HERE - Must be before locations and rewards)
-- ============================================================================

CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type partner_type NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    
    -- Contribution metrics
    locations_provided INTEGER DEFAULT 0,
    rewards_provided INTEGER DEFAULT 0,
    total_students_reached INTEGER DEFAULT 0,
    
    -- Contact
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    partnership_start_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_partners_type ON partners(type);
CREATE INDEX idx_partners_active ON partners(is_active);

-- ============================================================================
-- Locations & Geography
-- ============================================================================

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type location_type NOT NULL,
    description TEXT,
    
    -- Geographic data
    coordinates GEOGRAPHY(Point, 4326) NOT NULL,
    address TEXT,
    county VARCHAR(100),
    state VARCHAR(2) DEFAULT 'PA',
    
    -- Check-in configuration
    check_in_radius INTEGER DEFAULT 100, -- meters
    base_points INTEGER DEFAULT 10,
    first_visit_bonus INTEGER DEFAULT 50,
    
    -- Metadata
    difficulty VARCHAR(20), -- easy, moderate, challenging
    accessibility_notes TEXT,
    best_seasons TEXT[],
    activities TEXT[],
    
    -- Partnership
    partner_organization UUID REFERENCES partners(id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_coordinates ON locations USING GIST(coordinates);
CREATE INDEX idx_locations_county ON locations(county);

-- ============================================================================
-- Rewards System
-- ============================================================================

CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- scholarship, gear, pass, workshop, experience
    
    -- Requirements
    points_cost INTEGER NOT NULL,
    level_required INTEGER DEFAULT 1,
    badges_required UUID[],
    
    -- Availability
    total_available INTEGER,
    remaining_count INTEGER,
    redemption_start_date DATE,
    redemption_end_date DATE,
    
    -- Value
    estimated_value DECIMAL(10, 2),
    provided_by UUID REFERENCES partners(id),
    
    -- Details
    image_url TEXT,
    terms_and_conditions TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rewards_points_cost ON rewards(points_cost);
CREATE INDEX idx_rewards_type ON rewards(type);

-- ============================================================================
-- Rest of schema continues as before...
-- (I'm showing the fixes - the rest stays the same)
-- ============================================================================

