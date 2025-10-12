import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../auth/auth.config';
import type { 
  Class, 
  CreateClassDTO, 
  ApiResponse 
} from '@/lib/types/dashboard.types';

/**
 * GET /api/classes
 * Get all classes for the authenticated teacher
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    
    // Only teachers and admins can view classes
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Teachers only' },
        { status: 403 }
      );
    }

    // TODO: Replace with actual database query
    // For now, return mock data
    const classes: Class[] = [
      {
        id: 1,
        teacher_id: user.id,
        name: 'Environmental Science 7A',
        description: 'Introduction to ecology and conservation',
        grade_level: '7',
        subject: 'Science',
        class_code: 'FISH2025',
        school_name: 'Central Middle School',
        school_district: 'State College Area SD',
        allow_location_sharing: false,
        require_assignment_approval: true,
        created_at: new Date('2025-01-15'),
        updated_at: new Date('2025-01-15'),
        archived: false,
      },
    ];

    return NextResponse.json<ApiResponse<Class[]>>({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/classes
 * Create a new class
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    
    // Only teachers and admins can create classes
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Teachers only' },
        { status: 403 }
      );
    }

    const body: CreateClassDTO = await request.json();

    // Validation
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Class name is required' },
        { status: 400 }
      );
    }

    // TODO: Generate unique class code
    const classCode = generateClassCode();

    // TODO: Insert into database
    // For now, return mock created class
    const newClass: Class = {
      id: Date.now(), // Temporary ID
      teacher_id: user.id,
      name: body.name,
      description: body.description,
      grade_level: body.grade_level,
      subject: body.subject || 'Environmental Science',
      class_code: classCode,
      school_name: body.school_name,
      school_district: body.school_district,
      allow_location_sharing: body.allow_location_sharing || false,
      require_assignment_approval: body.require_assignment_approval || false,
      created_at: new Date(),
      updated_at: new Date(),
      archived: false,
    };

    return NextResponse.json<ApiResponse<Class>>(
      {
        success: true,
        data: newClass,
        message: `Class created successfully with code: ${classCode}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate a unique 8-character class code
 * Format: XXXX-XXXX (e.g., FISH-2025)
 */
function generateClassCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar-looking chars (I, O, 0, 1)
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    if (i === 4) {
      code += '-'; // Add separator for readability
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // TODO: Check database for uniqueness and regenerate if needed
  return code;
}

