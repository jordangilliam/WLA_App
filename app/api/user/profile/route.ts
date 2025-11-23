import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';
import { sanitizeString } from '@/lib/auth/api-middleware';
import type { ApiResponse } from '@/lib/types/dashboard.types';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  role: string;
  school_name?: string;
  school_district?: string;
  grade_level?: string;
  bio?: string;
  created_at: Date;
  last_login_at?: Date;
}

/**
 * GET /api/user/profile
 * Get current user's profile
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

    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to load profile' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<UserProfile>>({
      success: true,
      data: profile as UserProfile,
    });
  } catch (error) {
    console.error('Error in profile route:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/profile
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    const updates = await request.json();

    // Allowed fields to update
    const allowedFields = [
      'name',
      'bio',
      'school_name',
      'school_district',
      'grade_level',
      'avatar_url',
    ];

    // Filter to only allowed fields and sanitize text inputs
    const filteredUpdates: any = {};
    for (const field of allowedFields) {
      if (field in updates) {
        const value = updates[field];
        // Sanitize text fields
        if (typeof value === 'string' && ['name', 'bio', 'school_name', 'school_district', 'grade_level'].includes(field)) {
          filteredUpdates[field] = sanitizeString(value);
        } else {
          filteredUpdates[field] = value;
        }
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Update profile in database
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('users')
      .update(filteredUpdates as never)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<UserProfile>>({
      success: true,
      data: updated as UserProfile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

