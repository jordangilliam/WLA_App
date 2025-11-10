import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * POST /api/challenges/claim
 * Claim rewards for a completed challenge
 * Body: { challengeId: string }
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
    const { challengeId } = body;

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    // Call claim function
    const { data, error } = await supabaseAdmin!
      .rpc('claim_challenge_rewards', {
        p_user_id: userId,
        p_challenge_id: challengeId,
      });

    if (error) {
      console.error('Error claiming rewards:', error);
      return NextResponse.json(
        { error: 'Failed to claim rewards', details: error.message },
        { status: 500 }
      );
    }

    // Parse the JSON result from the function
    const result = data;

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to claim rewards' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      points_awarded: result.points_awarded,
      message: `Successfully claimed ${result.points_awarded} points!`,
    });

  } catch (error: any) {
    console.error('Error in POST /api/challenges/claim:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

