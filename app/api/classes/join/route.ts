import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
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

    // TODO: Look up class by class_code
    // TODO: Check if class is archived
    // TODO: Check if student already enrolled
    // TODO: Check if student needs parental consent
    // TODO: Insert into class_enrollments

    // Mock enrollment
    const enrollment: ClassEnrollment = {
      id: Date.now(),
      class_id: 1,
      student_id: user.id,
      enrolled_at: new Date(),
      enrolled_by: 'class_code',
      status: 'active',
    };

    return NextResponse.json<ApiResponse<ClassEnrollment>>(
      {
        success: true,
        data: enrollment,
        message: `Successfully joined class!`,
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

