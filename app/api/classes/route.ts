import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';
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
    const session = await getServerSession(authOptions);
    
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

    // Query classes from Supabase
    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { data: classes, error: dbError } = await supabaseAdmin
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('Supabase error fetching classes:', dbError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to fetch classes' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Class[]>>({
      success: true,
      data: classes as Class[],
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
    const session = await getServerSession(authOptions);
    
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

    // Generate unique class code
    const classCode = await generateUniqueClassCode();

    // Insert into database
    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { data: newClass, error: insertError } = await supabaseAdmin
      .from('classes')
      .insert({
        teacher_id: user.id,
        name: body.name,
        description: body.description,
        grade_level: body.grade_level,
        subject: body.subject || 'Environmental Science',
        class_code: classCode,
        school_name: body.school_name,
        school_district: body.school_district,
        allow_location_sharing: body.allow_location_sharing || false,
        require_assignment_approval: body.require_assignment_approval !== false,
      } as never)
      .select()
      .single();

    if (insertError) {
      console.error('Supabase error creating class:', insertError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to create class' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Class>>(
      {
        success: true,
        data: newClass as Class,
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
async function generateUniqueClassCode(): Promise<string> {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar-looking chars
  
  // Try up to 10 times to generate a unique code
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = '';
    
    for (let i = 0; i < 8; i++) {
      if (i === 4) {
        code += '-'; // Add separator for readability
      }
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code already exists in database
    if (supabaseAdmin) {
      const { data: existing } = await supabaseAdmin
        .from('classes')
        .select('id')
        .eq('class_code', code)
        .maybeSingle();
      
      if (!existing) {
        return code; // Code is unique!
      }
    }
  }
  
  // Fallback: add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `WLA-${timestamp}`;
}

