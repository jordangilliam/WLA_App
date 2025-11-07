import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';
import type { 
  ClassEnrollment,
  ApiResponse 
} from '@/lib/types/dashboard.types';

interface JoinClassDTO {
  class_code: string;
}

/**
 * POST /api/classes/join
 * Student joins a class using a class code
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;

    // Only students can join classes this way
    if (user.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Only students can join classes via code' },
        { status: 403 }
      );
    }

    const body: JoinClassDTO = await request.json();

    // Validation
    if (!body.class_code || body.class_code.trim().length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Class code is required' },
        { status: 400 }
      );
    }

    const classCode = body.class_code.trim().toUpperCase();

    // Database connection check
    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Look up class by class_code
    const { data: classData, error: classError } = await supabaseAdmin
      .from('classes')
      .select('id, name, archived, teacher_id')
      .eq('class_code', classCode)
      .maybeSingle();

    if (classError) {
      console.error('Error looking up class:', classError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to look up class' },
        { status: 500 }
      );
    }

    if (!classData) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid class code' },
        { status: 404 }
      );
    }

    // Check if class is archived
    if (classData.archived) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'This class is no longer accepting students' },
        { status: 400 }
      );
    }

    // Check if student is already enrolled
    const { data: existingEnrollment, error: enrollCheckError } = await supabaseAdmin
      .from('class_enrollments')
      .select('id, status')
      .eq('class_id', classData.id)
      .eq('student_id', user.id)
      .maybeSingle();

    if (enrollCheckError) {
      console.error('Error checking enrollment:', enrollCheckError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to check enrollment status' },
        { status: 500 }
      );
    }

    if (existingEnrollment) {
      if (existingEnrollment.status === 'active') {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'You are already enrolled in this class' },
          { status: 400 }
        );
      } else if (existingEnrollment.status === 'withdrawn') {
        // Re-activate withdrawn enrollment
        const { data: reactivated, error: reactivateError } = await supabaseAdmin
          .from('class_enrollments')
          .update({ 
            status: 'active',
            withdrawn_at: null
          })
          .eq('id', existingEnrollment.id)
          .select()
          .single();

        if (reactivateError) {
          console.error('Error reactivating enrollment:', reactivateError);
          return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Failed to rejoin class' },
            { status: 500 }
          );
        }

        return NextResponse.json<ApiResponse<ClassEnrollment>>(
          {
            success: true,
            data: reactivated as ClassEnrollment,
            message: `Welcome back to ${classData.name}!`,
          },
          { status: 200 }
        );
      }
    }

    // Create new enrollment
    const { data: enrollment, error: insertError } = await supabaseAdmin
      .from('class_enrollments')
      .insert({
        class_id: classData.id,
        student_id: user.id,
        enrolled_by: 'class_code',
        status: 'active',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating enrollment:', insertError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to join class' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<ClassEnrollment>>(
      {
        success: true,
        data: enrollment as ClassEnrollment,
        message: `Successfully joined ${classData.name}!`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error joining class:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

