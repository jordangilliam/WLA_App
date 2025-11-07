-- ============================================================================
-- STEP 1: Base Tables (Run This First!)
-- Creates the minimum tables needed before running the migration
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Type Definitions
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'educator', 'parent', 'admin', 'partner');
CREATE TYPE ambassador_level AS ENUM ('novice', 'apprentice', 'ambassador', 'expert', 'master', 'legend');

-- ============================================================================
-- Users Table
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
-- Classes Table
-- ============================================================================

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grade_level VARCHAR(50),
    subject VARCHAR(100),
    class_code VARCHAR(20) UNIQUE NOT NULL,
    school_name VARCHAR(255),
    school_district VARCHAR(255),
    allow_location_sharing BOOLEAN DEFAULT false,
    require_assignment_approval BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived BOOLEAN DEFAULT false
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_code ON classes(class_code);

-- ============================================================================
-- Row Level Security (RLS) - Users
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- Row Level Security (RLS) - Classes
-- ============================================================================

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Teachers can view their own classes
CREATE POLICY "Teachers can view own classes"
    ON classes FOR SELECT
    USING (teacher_id = auth.uid());

-- Teachers can create classes
CREATE POLICY "Teachers can create classes"
    ON classes FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

-- Teachers can update their own classes
CREATE POLICY "Teachers can update own classes"
    ON classes FOR UPDATE
    USING (teacher_id = auth.uid());

-- Teachers can delete their own classes
CREATE POLICY "Teachers can delete own classes"
    ON classes FOR DELETE
    USING (teacher_id = auth.uid());

-- ============================================================================
-- Base tables created successfully!
-- Next step: Run 001_add_organizations.sql
-- ============================================================================

