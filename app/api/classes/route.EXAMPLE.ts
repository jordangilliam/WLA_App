/**
 * EXAMPLE: Classes API Route with Supabase and Security Middleware
 * 
 * This is an example showing how to update API routes to use:
 * - Supabase database instead of mock data
 * - Security middleware for authentication and authorization
 * - Proper error handling and logging
 * 
 * TO USE THIS:
 * 1. Install dependencies: npm install @supabase/supabase-js zod
 * 2. Set up Supabase (see SUPABASE_SETUP_GUIDE.md)
 * 3. Copy this code to replace app/api/classes/route.ts
 * 4. Test with authenticated requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/db/client';
import { withSecurity, validateBody, logAPIAccess } from '@/lib/auth/api-middleware';
import type { 
  Class, 
  CreateClassDTO, 
  ApiResponse 
} from '@/lib/types/dashboard.types';

/**
 * Validation schema for creating a class
 */
const createClassSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  grade_level: z.string().optional(),
  subject: z.string().optional(),
  school_name: z.string().optional(),
  school_district: z.string().optional(),
  allow_location_sharing: z.boolean().default(false),
  require_assignment_approval: z.boolean().default(true),
});

/**
 * GET /api/classes
 * Get all classes for the authenticated teacher
 * 
 * Security: Requires educator or admin role
 * Rate limit: 100 requests per minute
 */
export async function GET(request: NextRequest) {
  try {
    // Apply security checks
    const auth = await withSecurity(request, {
      requireRole: 'educator',
      rateLimit: 100,
    });

    // If security check failed, return error response
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { user } = auth;

    // Query classes from Supabase
    const { data: classes, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching classes:', error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to fetch classes' },
        { status: 500 }
      );
    }

    // Log successful access
    await logAPIAccess(request, user.id, 'read', 'classes', null, true);

    return NextResponse.json<ApiResponse<Class[]>>({
      success: true,
      data: classes as Class[],
    });
  } catch (error) {
    console.error('Error in GET /api/classes:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/classes
 * Create a new class
 * 
 * Security: Requires educator or admin role
 * Rate limit: 50 requests per minute (lower for write operations)
 */
export async function POST(request: NextRequest) {
  try {
    // Apply security checks
    const auth = await withSecurity(request, {
      requireRole: 'educator',
      rateLimit: 50,
    });

    if (auth instanceof NextResponse) {
      return auth;
    }

    const { user } = auth;

    // Validate request body
    const validation = await validateBody(request, createClassSchema);
    if (validation instanceof NextResponse) {
      return validation; // Validation failed
    }

    const classData = validation.data;

    // Generate unique class code
    const classCode = await generateUniqueClassCode();

    // Insert into Supabase
    const { data: newClass, error } = await supabase
      .from('classes')
      .insert({
        teacher_id: user.id,
        ...classData,
        class_code: classCode,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating class:', error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to create class' },
        { status: 500 }
      );
    }

    // Log successful creation
    await logAPIAccess(request, user.id, 'create', 'classes', newClass.id.toString(), true);

    return NextResponse.json<ApiResponse<Class>>(
      {
        success: true,
        data: newClass as Class,
        message: 'Class created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/classes:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to generate unique 6-character class code
 */
async function generateUniqueClassCode(): Promise<string> {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars
  const length = 6;

  // Try up to 10 times to generate unique code
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if code already exists
    const { data: existing } = await supabase
      .from('classes')
      .select('id')
      .eq('class_code', code)
      .maybeSingle();

    if (!existing) {
      return code;
    }
  }

  // Fallback: add timestamp
  const code = Date.now().toString(36).toUpperCase().slice(-6);
  return code;
}

/**
 * COMPARISON: OLD vs NEW
 * 
 * OLD (Mock Data):
 * - Hardcoded mock data
 * - Manual auth checks
 * - No rate limiting
 * - No input validation
 * - No audit logging
 * - Not scalable
 * 
 * NEW (Supabase + Middleware):
 * - Real database queries
 * - Centralized security with withSecurity()
 * - Built-in rate limiting
 * - Type-safe validation with Zod
 * - Automatic audit logging
 * - Production-ready
 * - Row Level Security (RLS) in database
 * 
 * BENEFITS:
 * 1. Security - Multiple layers of protection
 * 2. Type Safety - Zod validation + TypeScript
 * 3. Scalability - Real database, not memory
 * 4. Maintainability - Centralized middleware
 * 5. Monitoring - Audit logs for compliance
 * 6. Performance - Indexed queries, caching
 */

