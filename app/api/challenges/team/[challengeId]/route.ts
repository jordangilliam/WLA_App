import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/challenges/team/[challengeId]
 * Get team challenge details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { challengeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { challengeId } = params;

    // Get challenge
    const { data: challenge, error: challengeError } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .eq('challenge_type', 'team')
      .single();

    if (challengeError || !challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Get team members
    const { data: teamMembers } = await supabaseAdmin
      .from('team_challenge_members')
      .select(`
        user_id,
        users!team_challenge_members_user_id_fkey (id, name)
      `)
      .eq('challenge_id', challengeId);

    const userIds = (teamMembers || []).map((tm: any) => tm.user_id);

    // Get progress for each team member
    const { data: progress } = await supabaseAdmin
      .from('user_challenge_progress')
      .select('user_id, current_progress')
      .eq('challenge_id', challengeId)
      .in('user_id', userIds);

    const progressMap = new Map<string, number>();
    (progress || []).forEach((p: any) => {
      progressMap.set(p.user_id, p.current_progress || 0);
    });

    const totalProgress = Array.from(progressMap.values()).reduce((sum, p) => sum + p, 0);

    const teamMembersData = (teamMembers || []).map((tm: any) => ({
      userId: tm.user_id,
      userName: tm.users?.name || 'Unknown',
      contribution: progressMap.get(tm.user_id) || 0,
    }));

    return NextResponse.json({
      success: true,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        targetMetric: challenge.target_metric,
        targetCount: challenge.target_count,
        currentProgress: totalProgress,
        teamMembers: teamMembersData,
        rewardPoints: challenge.reward_points,
        endDate: challenge.end_date,
        isCompleted: totalProgress >= challenge.target_count,
      },
    });
  } catch (error) {
    console.error('Error fetching team challenge:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

