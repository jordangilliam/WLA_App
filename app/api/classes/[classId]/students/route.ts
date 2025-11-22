import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';
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

    // Only teachers of the class or admins can view roster
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Teachers only' },
        { status: 403 }
      );
    }

    // Database connection check
    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Check if user is teacher of this class (unless admin)
    if (user.role === 'teacher') {
      const { data: classCheck, error: classCheckError } = await supabaseAdmin
        .from('classes')
        .select('teacher_id')
        .eq('id', classId)
        .maybeSingle();

      const classRow = classCheck as { teacher_id: number } | null;

      if (classCheckError || !classRow) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Class not found' },
          { status: 404 }
        );
      }

      if (classRow.teacher_id !== user.id) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'You do not teach this class' },
          { status: 403 }
        );
      }
    }

    // Fetch roster from database with user details
    const { data: enrollments, error: rosterError } = await supabaseAdmin
      .from('class_enrollments')
      .select(`
        *,
        users!student_id (
          id,
          name,
          email,
          grade_level
        )
      `)
      .eq('class_id', classId)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: true });

    if (rosterError) {
      console.error('Error fetching roster:', rosterError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to fetch class roster' },
        { status: 500 }
      );
    }

    // Transform into ClassRosterStudent format
    const roster = (enrollments || []).map((enrollment: any) => ({
      class_id: classId,
      student_id: enrollment.student_id,
      student_name: enrollment.users?.name || 'Unknown Student',
      student_email: enrollment.users?.email || '',
      grade_level: enrollment.users?.grade_level || '',
      enrolled_at: new Date(enrollment.enrolled_at),
      enrollment_status: enrollment.status,
      consent_status: 'verified',
      badges_earned: 0,
      last_active: new Date(),
      class_name: enrollment.class_name || `Class ${classId}`,
      teacher_id: enrollment.teacher_id || (user.id ?? 0),
    })) as ClassRosterStudent[];

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

    // Database connection check
    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Check if user is teacher of this class (unless admin)
    if (user.role === 'teacher') {
      const { data: classCheck, error: classCheckError } = await supabaseAdmin
        .from('classes')
        .select('teacher_id')
        .eq('id', classId)
        .maybeSingle();

      const classRow = classCheck as { teacher_id: number } | null;

      if (classCheckError || !classRow) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Class not found' },
          { status: 404 }
        );
      }

      if (classRow.teacher_id !== user.id) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'You do not teach this class' },
          { status: 403 }
        );
      }
    }

    // Look up student by ID or email
    let studentId: number;
    
    if (body.student_id) {
      studentId = body.student_id;
    } else if (body.student_email) {
      const { data: studentUser, error: studentError } = await supabaseAdmin
        .from('users')
        .select('id, role')
        .eq('email', body.student_email)
        .maybeSingle();

      const studentRow = studentUser as { id: number; role: string } | null;

      if (studentError || !studentRow) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Student not found with that email' },
          { status: 404 }
        );
      }

      if (studentRow.role !== 'student') {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'User is not a student' },
          { status: 400 }
        );
      }

      studentId = studentRow.id;
    } else {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Student ID or email required' },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('class_enrollments')
      .select('id, status')
      .eq('class_id', classId)
      .eq('student_id', studentId)
      .maybeSingle();

    const existingEnrollment = existing as { id: number; status: string } | null;

    if (checkError) {
      console.error('Error checking enrollment:', checkError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to check enrollment status' },
        { status: 500 }
      );
    }

    if (existingEnrollment && existingEnrollment.status === 'active') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Student is already enrolled in this class' },
        { status: 400 }
      );
    }

    // Insert or reactivate enrollment
    let enrollment: any;

    if (existingEnrollment && existingEnrollment.status === 'withdrawn') {
      // Reactivate
      const { data: reactivated, error: reactivateError } = await supabaseAdmin
        .from('class_enrollments')
        .update({ 
          status: 'active',
          withdrawn_at: null
        } as never)
        .eq('id', existingEnrollment.id)
        .select()
        .single();

      if (reactivateError) {
        console.error('Error reactivating enrollment:', reactivateError);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Failed to add student' },
          { status: 500 }
        );
      }

      enrollment = reactivated;
    } else {
      // Create new enrollment
      const { data: newEnrollment, error: insertError } = await supabaseAdmin
        .from('class_enrollments')
        .insert({
          class_id: classId,
          student_id: studentId,
          enrolled_by: 'teacher_added',
          status: 'active',
        } as never)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating enrollment:', insertError);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Failed to add student' },
          { status: 500 }
        );
      }

      enrollment = newEnrollment;
    }

    return NextResponse.json<ApiResponse<ClassEnrollment>>(
      {
        success: true,
        data: enrollment as ClassEnrollment,
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
    const session = await getServerSession(authOptions);
    
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

    // Database connection check
    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Check if user is teacher of this class (unless admin)
    if (user.role === 'teacher') {
      const { data: classCheck, error: classCheckError } = await supabaseAdmin
        .from('classes')
        .select('teacher_id')
        .eq('id', classId)
        .maybeSingle();

      const classRow = classCheck as { teacher_id: number } | null;

      if (classCheckError || !classRow) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Class not found' },
          { status: 404 }
        );
      }

      if (classRow.teacher_id !== user.id) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'You do not teach this class' },
          { status: 403 }
        );
      }
    }

    // Update enrollment status to 'withdrawn'
    const { error: withdrawError } = await supabaseAdmin
      .from('class_enrollments')
      .update({
        status: 'withdrawn',
        withdrawn_at: new Date().toISOString()
      } as never)
      .eq('class_id', classId)
      .eq('student_id', studentId);

    if (withdrawError) {
      console.error('Error removing student:', withdrawError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to remove student' },
        { status: 500 }
      );
    }

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

