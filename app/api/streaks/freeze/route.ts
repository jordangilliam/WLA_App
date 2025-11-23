import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * Freeze streak to prevent it from breaking
 * POST /api/streaks/freeze
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    // Check if user has streak freeze available
    // This would typically check user's inventory or purchase history
    // For now, we'll allow one freeze per user (can be enhanced later)

    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('streak_freeze_count, current_streak')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const freezeCount = (userProfile as any).streak_freeze_count || 0;
    const currentStreak = (userProfile as any).current_streak || 0;

    if (freezeCount <= 0) {
      return NextResponse.json(
        { error: 'No streak freezes available. Earn more points to unlock streak freezes!' },
        { status: 400 }
      );
    }

    // Apply streak freeze
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        streak_freeze_count: freezeCount - 1,
        streak_frozen_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Freeze for 24 hours
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error applying streak freeze:', updateError);
      return NextResponse.json({ error: 'Failed to apply streak freeze' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Streak frozen for 24 hours!',
      remainingFreezes: freezeCount - 1,
      frozenUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error in streak freeze API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Get streak freeze status
 * GET /api/streaks/freeze
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('streak_freeze_count, streak_frozen_until, current_streak')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const freezeCount = (userProfile as any).streak_freeze_count || 0;
    const frozenUntil = (userProfile as any).streak_frozen_until;
    const currentStreak = (userProfile as any).current_streak || 0;

    const isFrozen = frozenUntil && new Date(frozenUntil) > new Date();

    return NextResponse.json({
      success: true,
      freezeCount,
      isFrozen,
      frozenUntil: frozenUntil || null,
      currentStreak,
    });
  } catch (error) {
    console.error('Error in streak freeze status API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

