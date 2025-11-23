import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/competitions/[competitionId]/leaderboard
 * Get real-time leaderboard for competition
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { competitionId: string } }
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

    const { competitionId } = params;

    // Get competition details
    const { data: competition, error: compError } = await supabaseAdmin
      .from('class_competitions')
      .select('start_date, end_date')
      .eq('id', competitionId)
      .single();

    if (compError || !competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }

    // Get all users in participating classes
    const { data: participants } = await supabaseAdmin
      .from('class_competition_participants')
      .select('class_id')
      .eq('competition_id', competitionId);

    const classIds = (participants || []).map((p: any) => p.class_id);

    if (classIds.length === 0) {
      return NextResponse.json({ success: true, leaderboard: [] });
    }

    const { data: enrollments } = await supabaseAdmin
      .from('class_enrollments')
      .select('user_id')
      .in('class_id', classIds);

    const userIds = Array.from(new Set((enrollments || []).map((e: any) => e.user_id)));

    if (userIds.length === 0) {
      return NextResponse.json({ success: true, leaderboard: [] });
    }

    // Get points earned during competition period
    const { data: pointsData } = await supabaseAdmin
      .from('user_points')
      .select('user_id, points, users!user_points_user_id_fkey (id, name)')
      .in('user_id', userIds)
      .gte('created_at', competition.start_date)
      .lte('created_at', competition.end_date);

    // Aggregate points by user
    const userPointsMap = new Map<string, { points: number; userName: string }>();
    (pointsData || []).forEach((p: any) => {
      const userId = p.user_id;
      const current = userPointsMap.get(userId) || { points: 0, userName: p.users?.name || 'Unknown' };
      userPointsMap.set(userId, {
        points: current.points + (p.points || 0),
        userName: current.userName,
      });
    });

    // Convert to array and sort
    const leaderboard = Array.from(userPointsMap.entries())
      .map(([userId, data], index) => ({
        userId,
        userName: data.userName,
        points: data.points,
        rank: index + 1,
        change: 0, // Would track position changes
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

