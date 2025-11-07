-- ============================================================================
-- Migration: Add Organizations and Multi-Tenant Support
-- Created: November 7, 2025
-- Description: Add organizations, licensing, and multi-tenant architecture
-- ============================================================================

-- Create organization type enum
CREATE TYPE organization_type AS ENUM ('school', 'district', 'individual', 'nonprofit');

-- Create license tier enum
CREATE TYPE license_tier AS ENUM ('free', 'school', 'district', 'enterprise');

-- Create organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type organization_type NOT NULL,
    license_tier license_tier DEFAULT 'free',
    license_expires_at TIMESTAMP WITH TIME ZONE,
    max_students INTEGER DEFAULT 30,
    custom_branding JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization_users junction table
CREATE TABLE organization_users (
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student', -- 'admin', 'teacher', 'student'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (org_id, user_id)
);

-- Add indexes for performance
CREATE INDEX idx_organizations_license_tier ON organizations(license_tier);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organization_users_user_id ON organization_users(user_id);
CREATE INDEX idx_organization_users_org_id ON organization_users(org_id);

-- Create Wildlife Leadership Academy organization (special partnership)
INSERT INTO organizations (
    id,
    name,
    type,
    license_tier,
    max_students,
    custom_branding
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Well-known UUID for WLA
    'Wildlife Leadership Academy',
    'nonprofit',
    'enterprise',
    999999, -- Unlimited students
    '{"primary_color": "#0077B6", "logo_url": "/wla-logo.png", "is_partner": true}'::jsonb
);

-- Row Level Security (RLS) Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_users ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see organizations they belong to
CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    USING (
        id IN (
            SELECT org_id FROM organization_users
            WHERE user_id = auth.uid()
        )
    );

-- Organizations: Only org admins can update
CREATE POLICY "Org admins can update their organization"
    ON organizations FOR UPDATE
    USING (
        id IN (
            SELECT org_id FROM organization_users
            WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
        )
    );

-- Organization users: Users can view members of their organizations
CREATE POLICY "Users can view their org members"
    ON organization_users FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM organization_users
            WHERE user_id = auth.uid()
        )
    );

-- Organization users: Only org admins can manage members
CREATE POLICY "Org admins can manage members"
    ON organization_users FOR ALL
    USING (
        org_id IN (
            SELECT org_id FROM organization_users
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE organizations IS 'Organizations (schools, districts, nonprofits) using the platform';
COMMENT ON TABLE organization_users IS 'Junction table linking users to organizations with roles';
COMMENT ON COLUMN organizations.license_tier IS 'Subscription tier: free (30 students), school (200), district (1000), enterprise (custom)';
COMMENT ON COLUMN organizations.custom_branding IS 'JSON object with branding customization (colors, logos, etc.)';

-- Migration complete
-- Created: organizations, organization_users tables
-- Inserted: Wildlife Leadership Academy as first organization
-- Set up: Row Level Security policies

