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
export type ChallengeScope = 'class' | 'organization' | 'global';
export type CommunityEntityType = 'class' | 'organization' | 'global';
export type StoryMissionStageStatus = 'pending' | 'in_progress' | 'completed';
export type ResourceCategory = 'article' | 'workshop' | 'alert' | 'grant' | 'toolkit';

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
      observation_media: {
        Row: {
          id: string;
          user_id: string;
          observation_id: string | null;
          field_site_id: string | null;
          media_type: 'photo' | 'audio' | 'video';
          storage_path: string;
          preview_path: string | null;
          captured_at: string | null;
          latitude: number | null;
          longitude: number | null;
          status: 'pending' | 'available' | 'failed' | 'removed';
          source: string;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          observation_id?: string | null;
          field_site_id?: string | null;
          media_type: 'photo' | 'audio' | 'video';
          storage_path: string;
          preview_path?: string | null;
          captured_at?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: 'pending' | 'available' | 'failed' | 'removed';
          source?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          observation_id?: string | null;
          field_site_id?: string | null;
          media_type?: 'photo' | 'audio' | 'video';
          storage_path?: string;
          preview_path?: string | null;
          captured_at?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: 'pending' | 'available' | 'failed' | 'removed';
          source?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_challenges: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          storyline_id: string | null;
          scope: ChallengeScope;
          target_metric: string;
          target_value: number;
          reward: Json | null;
          start_at: string;
          end_at: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          storyline_id?: string | null;
          scope?: ChallengeScope;
          target_metric: string;
          target_value?: number;
          reward?: Json | null;
          start_at?: string;
          end_at?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          storyline_id?: string | null;
          scope?: ChallengeScope;
          target_metric?: string;
          target_value?: number;
          reward?: Json | null;
          start_at?: string;
          end_at?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_challenge_participants: {
        Row: {
          id: string;
          challenge_id: string;
          entity_type: CommunityEntityType;
          entity_id: string | null;
          display_name: string;
          goal_override: number | null;
          progress: number;
          last_event_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          entity_type: CommunityEntityType;
          entity_id?: string | null;
          display_name: string;
          goal_override?: number | null;
          progress?: number;
          last_event_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          entity_type?: CommunityEntityType;
          entity_id?: string | null;
          display_name?: string;
          goal_override?: number | null;
          progress?: number;
          last_event_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_challenge_events: {
        Row: {
          id: string;
          challenge_id: string;
          participant_id: string;
          user_id: string | null;
          event_type: string;
          value: number;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          participant_id: string;
          user_id?: string | null;
          event_type: string;
          value?: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          participant_id?: string;
          user_id?: string | null;
          event_type?: string;
          value?: number;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      story_missions: {
        Row: {
          id: string;
          title: string;
          synopsis: string | null;
          storyline_id: string | null;
          hero_image_url: string | null;
          difficulty: string | null;
          subject_tags: string[];
          recommended_grades: string[];
          start_at: string;
          end_at: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          synopsis?: string | null;
          storyline_id?: string | null;
          hero_image_url?: string | null;
          difficulty?: string | null;
          subject_tags?: string[];
          recommended_grades?: string[];
          start_at?: string;
          end_at?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          synopsis?: string | null;
          storyline_id?: string | null;
          hero_image_url?: string | null;
          difficulty?: string | null;
          subject_tags?: string[];
          recommended_grades?: string[];
          start_at?: string;
          end_at?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      story_mission_stages: {
        Row: {
          id: string;
          mission_id: string;
          order_index: number;
          title: string;
          summary: string | null;
          learning_objective: string | null;
          target_metric: string | null;
          target_value: number | null;
          content: Json | null;
          reward: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          order_index?: number;
          title: string;
          summary?: string | null;
          learning_objective?: string | null;
          target_metric?: string | null;
          target_value?: number | null;
          content?: Json | null;
          reward?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mission_id?: string;
          order_index?: number;
          title?: string;
          summary?: string | null;
          learning_objective?: string | null;
          target_metric?: string | null;
          target_value?: number | null;
          content?: Json | null;
          reward?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      story_mission_progress: {
        Row: {
          id: string;
          mission_id: string;
          user_id: string;
          current_stage: number;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          user_id: string;
          current_stage?: number;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mission_id?: string;
          user_id?: string;
          current_stage?: number;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      story_mission_stage_progress: {
      resource_updates: {
        Row: {
          id: string;
          title: string;
          summary: string | null;
          category: ResourceCategory;
          tags: string[];
          source_name: string | null;
          source_url: string | null;
          featured: boolean;
          published_at: string;
          added_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary?: string | null;
          category?: ResourceCategory;
          tags?: string[];
          source_name?: string | null;
          source_url?: string | null;
          featured?: boolean;
          published_at?: string;
          added_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string | null;
          category?: ResourceCategory;
          tags?: string[];
          source_name?: string | null;
          source_url?: string | null;
          featured?: boolean;
          published_at?: string;
          added_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pollinator_plans: {
        Row: {
          id: string;
          user_id: string;
          location_type: string;
          region: string | null;
          sun_exposure: string;
          soil_moisture: string;
          available_area_sqft: number | null;
          maintenance_level: string;
          bloom_focus: string | null;
          recommendations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location_type: string;
          region?: string | null;
          sun_exposure: string;
          soil_moisture: string;
          available_area_sqft?: number | null;
          maintenance_level: string;
          bloom_focus?: string | null;
          recommendations: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location_type?: string;
          region?: string | null;
          sun_exposure?: string;
          soil_moisture?: string;
          available_area_sqft?: number | null;
          maintenance_level?: string;
          bloom_focus?: string | null;
          recommendations?: Json;
          created_at?: string;
        };
      };
        Row: {
          id: string;
          mission_id: string;
          stage_id: string;
          user_id: string;
          status: StoryMissionStageStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          stage_id: string;
          user_id: string;
          status?: StoryMissionStageStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mission_id?: string;
          stage_id?: string;
          user_id?: string;
          status?: StoryMissionStageStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
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
      challenge_scope: ChallengeScope;
      community_entity_type: CommunityEntityType;
      story_mission_stage_status: StoryMissionStageStatus;
      resource_category: ResourceCategory;
    };
  };
}

