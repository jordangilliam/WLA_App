import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/leaderboard/class
 * Fetch class rankings for current week
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get limit from query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Call Supabase RPC function
    const { data, error } = await supabaseAdmin!
      .rpc('get_class_leaderboard', { p_limit: limit } as never);

    if (error) {
      console.error('Error fetching class leaderboard:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rankings: data || [],
      week: new Date().toISOString().split('T')[0],
    });

  } catch (error: any) {
    console.error('Error in GET /api/leaderboard/class:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

