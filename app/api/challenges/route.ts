import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/challenges
 * Fetch all active challenges with user progress
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.userId;

    // Call Supabase RPC function
    const { data, error } = await supabaseAdmin!
      .rpc('get_active_challenges', { p_user_id: userId });

    if (error) {
      console.error('Error fetching challenges:', error);
      return NextResponse.json(
        { error: 'Failed to fetch challenges', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      challenges: data || [],
    });

  } catch (error: any) {
    console.error('Error in GET /api/challenges:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/challenges
 * Manually update challenge progress (for testing or edge cases)
 * Body: { challengeId: string, increment?: number }
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.userId;

    // Parse request body
    const body = await request.json();
    const { challengeId, increment = 1 } = body;

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    // Call update function
    const { error } = await supabaseAdmin!
      .rpc('update_challenge_progress', {
        p_user_id: userId,
        p_challenge_id: challengeId,
        p_increment: increment,
      });

    if (error) {
      console.error('Error updating challenge progress:', error);
      return NextResponse.json(
        { error: 'Failed to update progress', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Challenge progress updated',
    });

  } catch (error: any) {
    console.error('Error in POST /api/challenges:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

