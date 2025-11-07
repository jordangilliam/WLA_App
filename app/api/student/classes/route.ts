import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';
import type { ApiResponse } from '@/lib/types/dashboard.types';

interface EnrolledClass {
  enrollment_id: number;
  class_id: number;
  class_name: string;
  class_code: string;
  teacher_name: string;
  school_name?: string;
  subject?: string;
  enrolled_at: Date;
  status: string;
}

/**
 * GET /api/student/classes
 * Get all classes the student is enrolled in
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;

    // Only students can use this endpoint
    if (user.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'This endpoint is for students only' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Get student's enrolled classes with class and teacher details
    const { data: enrollments, error: enrollError } = await supabaseAdmin
      .from('class_enrollments')
      .select(`
        id,
        enrolled_at,
        status,
        classes!inner (
          id,
          name,
          class_code,
          school_name,
          subject,
          teacher_id,
          users!teacher_id (
            name
          )
        )
      `)
      .eq('student_id', user.id)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false });

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to fetch classes' },
        { status: 500 }
      );
    }

    // Transform data into a cleaner format
    const enrolledClasses: EnrolledClass[] = (enrollments || []).map((enrollment: any) => ({
      enrollment_id: enrollment.id,
      class_id: enrollment.classes.id,
      class_name: enrollment.classes.name,
      class_code: enrollment.classes.class_code,
      teacher_name: enrollment.classes.users?.name || 'Unknown Teacher',
      school_name: enrollment.classes.school_name,
      subject: enrollment.classes.subject,
      enrolled_at: new Date(enrollment.enrolled_at),
      status: enrollment.status,
    }));

    return NextResponse.json<ApiResponse<EnrolledClass[]>>({
      success: true,
      data: enrolledClasses,
    });
  } catch (error) {
    console.error('Error fetching student classes:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/student/classes
 * Withdraw from a class
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;

    // Only students can use this endpoint
    if (user.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'This endpoint is for students only' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const classId = parseInt(searchParams.get('classId') || '0');

    if (isNaN(classId) || classId === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid class ID' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Withdraw from class (mark as withdrawn, don't delete)
    const { error: withdrawError } = await supabaseAdmin
      .from('class_enrollments')
      .update({ 
        status: 'withdrawn',
        withdrawn_at: new Date().toISOString()
      })
      .eq('class_id', classId)
      .eq('student_id', user.id)
      .eq('status', 'active');

    if (withdrawError) {
      console.error('Error withdrawing from class:', withdrawError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to withdraw from class' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ withdrawn: boolean }>>({
      success: true,
      data: { withdrawn: true },
      message: 'Successfully withdrawn from class',
    });
  } catch (error) {
    console.error('Error withdrawing from class:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

