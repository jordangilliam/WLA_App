import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../../auth/auth.config';
import type { 
  ClassRosterStudent,
  EnrollStudentDTO,
  ClassEnrollment,
  ApiResponse 
} from '@/lib/types/dashboard.types';

/**
 * GET /api/classes/[classId]/students
 * Get all students in a class (roster)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    
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

    // Only teachers of the class or admins can view roster
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Teachers only' },
        { status: 403 }
      );
    }

    // TODO: Check if user is teacher of this class
    // TODO: Fetch from database using class_roster view

    // Mock roster data
    const roster: ClassRosterStudent[] = [
      {
        class_id: classId,
        class_name: 'Environmental Science 7A',
        teacher_id: user.id,
        student_id: 101,
        student_name: 'Emily Johnson',
        student_email: 'emily.j@student.edu',
        grade_level: '7',
        consent_status: 'verified',
        enrolled_at: new Date('2025-01-20'),
        enrollment_status: 'active',
        badges_earned: 5,
        last_active: new Date('2025-10-11'),
      },
      {
        class_id: classId,
        class_name: 'Environmental Science 7A',
        teacher_id: user.id,
        student_id: 102,
        student_name: 'Marcus Williams',
        student_email: 'marcus.w@student.edu',
        grade_level: '7',
        consent_status: 'verified',
        enrolled_at: new Date('2025-01-20'),
        enrollment_status: 'active',
        badges_earned: 3,
        last_active: new Date('2025-10-10'),
      },
      {
        class_id: classId,
        class_name: 'Environmental Science 7A',
        teacher_id: user.id,
        student_id: 103,
        student_name: 'Sofia Martinez',
        student_email: 'sofia.m@student.edu',
        grade_level: '7',
        consent_status: 'pending',
        enrolled_at: new Date('2025-01-22'),
        enrollment_status: 'active',
        badges_earned: 1,
        last_active: new Date('2025-10-09'),
      },
    ];

    return NextResponse.json<ApiResponse<ClassRosterStudent[]>>({
      success: true,
      data: roster,
    });
  } catch (error) {
    console.error('Error fetching class roster:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/classes/[classId]/students
 * Add a student to the class
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    
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

    // Only teachers of the class or admins can add students
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Teachers only' },
        { status: 403 }
      );
    }

    const body: EnrollStudentDTO = await request.json();

    // Validation
    if (!body.student_id && !body.student_email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Student ID or email required' },
        { status: 400 }
      );
    }

    // TODO: Check if user is teacher of this class
    // TODO: Look up student by ID or email
    // TODO: Check if already enrolled
    // TODO: Insert into class_enrollments

    // Mock enrollment
    const enrollment: ClassEnrollment = {
      id: Date.now(),
      class_id: classId,
      student_id: body.student_id || 999,
      enrolled_at: new Date(),
      enrolled_by: 'teacher_added',
      status: 'active',
    };

    return NextResponse.json<ApiResponse<ClassEnrollment>>(
      {
        success: true,
        data: enrollment,
        message: 'Student added successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/classes/[classId]/students/[studentId]
 * Remove a student from the class
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    const classId = parseInt(params.classId);
    
    // Get studentId from query params
    const { searchParams } = new URL(request.url);
    const studentId = parseInt(searchParams.get('studentId') || '0');

    if (isNaN(classId) || isNaN(studentId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid class ID or student ID' },
        { status: 400 }
      );
    }

    // Only teachers of the class or admins can remove students
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Teachers only' },
        { status: 403 }
      );
    }

    // TODO: Check if user is teacher of this class
    // TODO: Update enrollment status to 'withdrawn' in database

    return NextResponse.json<ApiResponse<{ removed: boolean }>>({
      success: true,
      data: { removed: true },
      message: 'Student removed from class',
    });
  } catch (error) {
    console.error('Error removing student:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

