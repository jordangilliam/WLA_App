import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/auth.config';
import type { 
  ClassOverview,
  Activity,
  ApiResponse 
} from '@/lib/types/dashboard.types';

/**
 * GET /api/classes/[classId]/progress
 * Get progress overview for a class (for teacher dashboard)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    const classId = parseInt(params.classId);

    if (isNaN(classId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid class ID' },
        { status: 400 }
      );
    }

    // Only teachers of the class or admins
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Teachers only' },
        { status: 403 }
      );
    }

    // TODO: Fetch real data from database
    // - Class details
    // - Student count
    // - Active students this week
    // - Assignments
    // - Recent activity from activity_log

    // Mock data
    const recentActivity: Activity[] = [
      {
        id: 1001,
        user_id: 101,
        activity_type: 'lesson_completed',
        activity_data: {
          lesson_id: 'match-the-hatch',
          lesson_name: 'Match the Hatch - Aquatic Insects',
          score: 18,
        },
        class_id: classId,
        points_earned: 25,
        created_at: new Date('2025-10-12T10:30:00'),
      },
      {
        id: 1002,
        user_id: 102,
        activity_type: 'badge_earned',
        activity_data: {
          badge_id: 'aquatic-ecologist',
          badge_name: 'Aquatic Ecologist',
        },
        class_id: classId,
        points_earned: 50,
        created_at: new Date('2025-10-12T09:15:00'),
      },
      {
        id: 1003,
        user_id: 103,
        activity_type: 'observation_added',
        activity_data: {
          species: 'Brook Trout',
          location: 'Spring Creek',
        },
        class_id: classId,
        points_earned: 10,
        created_at: new Date('2025-10-11T14:45:00'),
      },
      {
        id: 1004,
        user_id: 101,
        activity_type: 'assignment_submitted',
        activity_data: {
          assignment_id: 5,
          assignment_name: 'Water Quality Report',
        },
        class_id: classId,
        assignment_id: 5,
        points_earned: 0,
        created_at: new Date('2025-10-11T11:20:00'),
      },
    ];

    const overview: ClassOverview = {
      class: {
        id: classId,
        teacher_id: user.id,
        name: 'Environmental Science 7A',
        description: 'Introduction to ecology and conservation',
        grade_level: '7',
        subject: 'Science',
        class_code: 'FISH-2025',
        school_name: 'Central Middle School',
        school_district: 'State College Area SD',
        allow_location_sharing: false,
        require_assignment_approval: true,
        created_at: new Date('2025-01-15'),
        updated_at: new Date('2025-01-15'),
        archived: false,
      },
      student_count: 18,
      active_students_week: 15,
      assignments_count: 6,
      pending_submissions: 3,
      recent_activity: recentActivity,
    };

    return NextResponse.json<ApiResponse<ClassOverview>>({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error('Error fetching class progress:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

