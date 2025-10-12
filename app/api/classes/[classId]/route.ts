import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../auth/auth.config';
import type { 
  Class, 
  UpdateClassDTO, 
  ApiResponse 
} from '@/lib/types/dashboard.types';

/**
 * GET /api/classes/[classId]
 * Get details for a specific class
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

    // TODO: Fetch from database
    // Check if user has access (teacher of class or admin)
    
    // Mock data for now
    const classData: Class = {
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
    };

    return NextResponse.json<ApiResponse<Class>>({
      success: true,
      data: classData,
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/classes/[classId]
 * Update a class
 */
export async function PUT(
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

    const body: UpdateClassDTO = await request.json();

    // TODO: Check if user is teacher of this class
    // TODO: Update in database

    // Mock updated class
    const updatedClass: Class = {
      id: classId,
      teacher_id: user.id,
      name: body.name || 'Environmental Science 7A',
      description: body.description || 'Introduction to ecology and conservation',
      grade_level: body.grade_level || '7',
      subject: body.subject || 'Science',
      class_code: 'FISH-2025',
      school_name: 'Central Middle School',
      school_district: 'State College Area SD',
      allow_location_sharing: body.allow_location_sharing ?? false,
      require_assignment_approval: body.require_assignment_approval ?? true,
      created_at: new Date('2025-01-15'),
      updated_at: new Date(),
      archived: body.archived ?? false,
    };

    return NextResponse.json<ApiResponse<Class>>({
      success: true,
      data: updatedClass,
      message: 'Class updated successfully',
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/classes/[classId]
 * Archive (soft delete) a class
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

    if (isNaN(classId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid class ID' },
        { status: 400 }
      );
    }

    // TODO: Check if user is teacher of this class
    // TODO: Soft delete (set archived = true) in database

    return NextResponse.json<ApiResponse<{ archived: boolean }>>({
      success: true,
      data: { archived: true },
      message: 'Class archived successfully',
    });
  } catch (error) {
    console.error('Error archiving class:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

