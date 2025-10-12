/**
 * TypeScript Types for Educator Dashboard
 * Matches: lib/db/schema-educator-dashboard.sql
 */

// ============================================
// USER ROLES & ENHANCEMENTS
// ============================================

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type ConsentStatus = 'pending' | 'verified' | 'denied' | 'not_required';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  birth_date?: Date;
  parent_email?: string;
  consent_status: ConsentStatus;
  school_name?: string;
  school_district?: string;
  grade_level?: string;
  created_at: Date;
}

// ============================================
// CLASSES
// ============================================

export interface Class {
  id: number;
  teacher_id: number;
  name: string;
  description?: string;
  grade_level?: string;
  subject?: string;
  class_code: string;
  school_name?: string;
  school_district?: string;
  allow_location_sharing: boolean;
  require_assignment_approval: boolean;
  created_at: Date;
  updated_at: Date;
  archived: boolean;
  archived_at?: Date;
}

export interface CreateClassDTO {
  name: string;
  description?: string;
  grade_level?: string;
  subject?: string;
  school_name?: string;
  school_district?: string;
  allow_location_sharing?: boolean;
  require_assignment_approval?: boolean;
}

export interface UpdateClassDTO {
  name?: string;
  description?: string;
  grade_level?: string;
  subject?: string;
  allow_location_sharing?: boolean;
  require_assignment_approval?: boolean;
  archived?: boolean;
}

// ============================================
// CLASS ENROLLMENTS
// ============================================

export type EnrollmentMethod = 'class_code' | 'teacher_added' | 'admin_added';
export type EnrollmentStatus = 'active' | 'inactive' | 'withdrawn';

export interface ClassEnrollment {
  id: number;
  class_id: number;
  student_id: number;
  enrolled_at: Date;
  enrolled_by: EnrollmentMethod;
  status: EnrollmentStatus;
  withdrawn_at?: Date;
}

export interface EnrollStudentDTO {
  student_id?: number;
  student_email?: string;
  class_code?: string;
}

// ============================================
// ASSIGNMENTS
// ============================================

export type ActivityType = 'lesson' | 'quiz' | 'field_observation' | 'journal' | 'custom';

export interface Assignment {
  id: number;
  class_id: number;
  teacher_id: number;
  title: string;
  description?: string;
  instructions?: string;
  lesson_id?: string;
  activity_type?: ActivityType;
  points_possible: number;
  rubric_url?: string;
  assigned_at: Date;
  due_date?: Date;
  available_from: Date;
  available_until?: Date;
  allow_late_submission: boolean;
  require_teacher_approval: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAssignmentDTO {
  class_id: number;
  title: string;
  description?: string;
  instructions?: string;
  lesson_id?: string;
  activity_type?: ActivityType;
  points_possible?: number;
  due_date?: Date;
  allow_late_submission?: boolean;
}

// ============================================
// ASSIGNMENT SUBMISSIONS
// ============================================

export type SubmissionStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'returned';

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  student_id: number;
  status: SubmissionStatus;
  started_at?: Date;
  submitted_at?: Date;
  graded_at?: Date;
  score?: number;
  points_earned?: number;
  teacher_feedback?: string;
  submission_data?: Record<string, any>;
  is_late: boolean;
}

export interface GradeSubmissionDTO {
  score: number;
  points_earned?: number;
  teacher_feedback?: string;
}

// ============================================
// GROUPS
// ============================================

export type GroupType = 'field_trip' | 'cohort' | 'club' | 'class' | 'wla_academy';
export type GroupRole = 'leader' | 'co_leader' | 'member';
export type GroupMemberStatus = 'active' | 'inactive' | 'left';

export interface Group {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  group_type: GroupType;
  class_id?: number;
  start_date?: Date;
  end_date?: Date;
  is_active: boolean;
  allow_self_join: boolean;
  join_code?: string;
  created_at: Date;
  updated_at: Date;
}

export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  role: GroupRole;
  joined_at: Date;
  left_at?: Date;
  status: GroupMemberStatus;
}

export interface CreateGroupDTO {
  name: string;
  description?: string;
  group_type: GroupType;
  class_id?: number;
  start_date?: Date;
  end_date?: Date;
  allow_self_join?: boolean;
}

// ============================================
// PARENTAL CONSENTS (COPPA)
// ============================================

export type ConsentMethod = 'email_verification' | 'digital_signature' | 'paper_form';
export type ConsentStatusType = 'pending' | 'verified' | 'expired' | 'revoked';
export type ParentRelationship = 'parent' | 'guardian' | 'other';

export interface ParentalConsent {
  id: number;
  student_id: number;
  parent_name: string;
  parent_email: string;
  parent_phone?: string;
  relationship: ParentRelationship;
  consent_given: boolean;
  consent_method?: ConsentMethod;
  consent_text?: string;
  verification_token?: string;
  token_expires_at?: Date;
  verified_at?: Date;
  ip_address?: string;
  user_agent?: string;
  allow_location_sharing: boolean;
  allow_photo_sharing: boolean;
  allow_name_display: boolean;
  allow_work_sharing: boolean;
  status: ConsentStatusType;
  revoked_at?: Date;
  revoked_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ConsentRequestDTO {
  student_id: number;
  parent_name: string;
  parent_email: string;
  parent_phone?: string;
  relationship?: ParentRelationship;
}

export interface ConsentResponseDTO {
  consent_given: boolean;
  allow_location_sharing?: boolean;
  allow_photo_sharing?: boolean;
  allow_name_display?: boolean;
  allow_work_sharing?: boolean;
}

// ============================================
// CONTENT MODERATION
// ============================================

export type ContentType = 'observation' | 'journal' | 'comment' | 'photo' | 'submission';
export type FlagReason = 'inappropriate' | 'spam' | 'safety_concern' | 'bullying' | 'other';
export type FlagStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';
export type FlagPriority = 'low' | 'normal' | 'high' | 'urgent';
export type FlagResolution = 'removed' | 'edited' | 'approved' | 'no_action';

export interface ContentFlag {
  id: number;
  flagged_by?: number;
  content_type: ContentType;
  content_id: number;
  content_snapshot?: Record<string, any>;
  reason: FlagReason;
  description?: string;
  class_id?: number;
  status: FlagStatus;
  priority: FlagPriority;
  reviewed_by?: number;
  reviewed_at?: Date;
  resolution?: FlagResolution;
  resolution_notes?: string;
  created_at: Date;
}

export interface FlagContentDTO {
  content_type: ContentType;
  content_id: number;
  reason: FlagReason;
  description?: string;
}

export interface ResolveFlagDTO {
  resolution: FlagResolution;
  resolution_notes?: string;
}

// ============================================
// ACTIVITY LOG
// ============================================

export type ActivityType =
  | 'lesson_completed'
  | 'badge_earned'
  | 'observation_added'
  | 'quiz_taken'
  | 'assignment_submitted'
  | 'login'
  | 'journal_entry'
  | 'species_identified'
  | 'field_trip_checkin';

export interface Activity {
  id: number;
  user_id: number;
  activity_type: ActivityType;
  activity_data?: Record<string, any>;
  class_id?: number;
  assignment_id?: number;
  points_earned: number;
  created_at: Date;
}

// ============================================
// TEACHER NOTES
// ============================================

export type NoteType = 'general' | 'behavior' | 'academic' | 'parent_contact';

export interface TeacherNote {
  id: number;
  teacher_id: number;
  student_id: number;
  class_id?: number;
  note_text: string;
  note_type: NoteType;
  is_private: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateNoteDTO {
  student_id: number;
  class_id?: number;
  note_text: string;
  note_type?: NoteType;
  is_private?: boolean;
}

// ============================================
// CLASS ANNOUNCEMENTS
// ============================================

export interface ClassAnnouncement {
  id: number;
  class_id: number;
  teacher_id: number;
  title: string;
  message: string;
  published: boolean;
  published_at: Date;
  send_notification: boolean;
  notification_sent_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAnnouncementDTO {
  class_id: number;
  title: string;
  message: string;
  published?: boolean;
  send_notification?: boolean;
}

// ============================================
// DASHBOARD VIEWS & AGGREGATES
// ============================================

export interface ClassRosterStudent {
  class_id: number;
  class_name: string;
  teacher_id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  grade_level?: string;
  consent_status: ConsentStatus;
  enrolled_at: Date;
  enrollment_status: EnrollmentStatus;
  badges_earned: number;
  last_active?: Date;
}

export interface TeacherDashboardSummary {
  teacher_id: number;
  teacher_name: string;
  total_classes: number;
  active_classes: number;
  total_students: number;
  active_students_week: number;
  total_assignments: number;
  points_earned_week: number;
}

export interface StudentProgressSummary {
  student_id: number;
  student_name: string;
  badges_earned: number;
  lessons_completed: number;
  quizzes_taken: number;
  assignments_completed: number;
  assignments_pending: number;
  total_points: number;
  last_active?: Date;
  current_streak: number;
}

export interface ClassOverview {
  class: Class;
  student_count: number;
  active_students_week: number;
  assignments_count: number;
  pending_submissions: number;
  recent_activity: Activity[];
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================
// FILTERS & QUERIES
// ============================================

export interface StudentFilter {
  class_id?: number;
  status?: EnrollmentStatus;
  grade_level?: string;
  consent_status?: ConsentStatus;
  search?: string; // Search by name or email
}

export interface ActivityFilter {
  user_id?: number;
  class_id?: number;
  activity_type?: ActivityType;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
}

export interface AssignmentFilter {
  class_id?: number;
  status?: 'upcoming' | 'active' | 'past_due' | 'completed';
  activity_type?: ActivityType;
}

// ============================================
// PERMISSIONS
// ============================================

export interface UserPermissions {
  canCreateClass: boolean;
  canManageStudents: boolean;
  canGradeAssignments: boolean;
  canViewAllClasses: boolean;
  canModerateContent: boolean;
  canAccessParentPortal: boolean;
}

export function getUserPermissions(role: UserRole): UserPermissions {
  switch (role) {
    case 'admin':
      return {
        canCreateClass: true,
        canManageStudents: true,
        canGradeAssignments: true,
        canViewAllClasses: true,
        canModerateContent: true,
        canAccessParentPortal: true,
      };
    case 'teacher':
      return {
        canCreateClass: true,
        canManageStudents: true,
        canGradeAssignments: true,
        canViewAllClasses: false,
        canModerateContent: true,
        canAccessParentPortal: false,
      };
    case 'parent':
      return {
        canCreateClass: false,
        canManageStudents: false,
        canGradeAssignments: false,
        canViewAllClasses: false,
        canModerateContent: false,
        canAccessParentPortal: true,
      };
    case 'student':
    default:
      return {
        canCreateClass: false,
        canManageStudents: false,
        canGradeAssignments: false,
        canViewAllClasses: false,
        canModerateContent: false,
        canAccessParentPortal: false,
      };
  }
}

// ============================================
// HELPER TYPES
// ============================================

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  order: SortOrder;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// ============================================
// EXPORTS
// ============================================

export type {
  // Re-export all types for convenience
  User,
  Class,
  ClassEnrollment,
  Assignment,
  AssignmentSubmission,
  Group,
  GroupMember,
  ParentalConsent,
  ContentFlag,
  Activity,
  TeacherNote,
  ClassAnnouncement,
};

