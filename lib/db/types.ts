/**
 * Database Type Definitions
 * 
 * These types match the PostgreSQL schema defined in schema.sql
 * They provide type safety for all database operations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'student' | 'educator' | 'parent' | 'admin' | 'partner';

export type AmbassadorLevel =
  | 'novice'
  | 'apprentice'
  | 'ambassador'
  | 'expert'
  | 'master'
  | 'legend';

export type LicenseTier = 'free' | 'school' | 'district' | 'enterprise';

export type OrganizationType = 'school' | 'district' | 'individual' | 'nonprofit';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          age: number | null;
          school_or_organization: string | null;
          level: number;
          experience: number;
          ambassador_level: AmbassadorLevel;
          total_points: number;
          available_points: number;
          lifetime_points: number;
          is_profile_public: boolean;
          share_location: boolean;
          is_active: boolean;
          email_verified: boolean;
          joined_at: string;
          last_active_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          age?: number | null;
          school_or_organization?: string | null;
          level?: number;
          experience?: number;
          ambassador_level?: AmbassadorLevel;
          total_points?: number;
          available_points?: number;
          lifetime_points?: number;
          is_profile_public?: boolean;
          share_location?: boolean;
          is_active?: boolean;
          email_verified?: boolean;
          joined_at?: string;
          last_active_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          age?: number | null;
          school_or_organization?: string | null;
          level?: number;
          experience?: number;
          ambassador_level?: AmbassadorLevel;
          total_points?: number;
          available_points?: number;
          lifetime_points?: number;
          is_profile_public?: boolean;
          share_location?: boolean;
          is_active?: boolean;
          email_verified?: boolean;
          joined_at?: string;
          last_active_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          type: OrganizationType;
          license_tier: LicenseTier;
          license_expires_at: string | null;
          max_students: number;
          custom_branding: Json | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: OrganizationType;
          license_tier?: LicenseTier;
          license_expires_at?: string | null;
          max_students?: number;
          custom_branding?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: OrganizationType;
          license_tier?: LicenseTier;
          license_expires_at?: string | null;
          max_students?: number;
          custom_branding?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      organization_users: {
        Row: {
          org_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          org_id: string;
          user_id: string;
          role: string;
          joined_at?: string;
        };
        Update: {
          org_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
        };
      };
      classes: {
        Row: {
          id: number;
          teacher_id: string;
          name: string;
          description: string | null;
          grade_level: string | null;
          subject: string | null;
          class_code: string;
          school_name: string | null;
          school_district: string | null;
          allow_location_sharing: boolean;
          require_assignment_approval: boolean;
          created_at: string;
          updated_at: string;
          archived: boolean;
        };
        Insert: {
          id?: number;
          teacher_id: string;
          name: string;
          description?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          class_code: string;
          school_name?: string | null;
          school_district?: string | null;
          allow_location_sharing?: boolean;
          require_assignment_approval?: boolean;
          created_at?: string;
          updated_at?: string;
          archived?: boolean;
        };
        Update: {
          id?: number;
          teacher_id?: string;
          name?: string;
          description?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          class_code?: string;
          school_name?: string | null;
          school_district?: string | null;
          allow_location_sharing?: boolean;
          require_assignment_approval?: boolean;
          created_at?: string;
          updated_at?: string;
          archived?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      ambassador_level: AmbassadorLevel;
      license_tier: LicenseTier;
      organization_type: OrganizationType;
    };
  };
}

