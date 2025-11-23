import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/collaboration/leaderboard
 * Get live leaderboard for a session
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

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Verify user has access to this session
    const { data: liveSession, error: sessionError } = await supabaseAdmin
      .from('live_field_sessions')
      .select('class_id')
      .eq('id', sessionId)
      .eq('is_active', true)
      .single();

    if (sessionError || !liveSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get all participants in the session's class
    const { data: participants, error: participantsError } = await supabaseAdmin
      .from('class_enrollments')
      .select('user_id, users(id, name)')
      .eq('class_id', (liveSession as any).class_id);

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
      return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
    }

    const participantIds = (participants || []).map((p: any) => p.user_id);

    if (participantIds.length === 0) {
      return NextResponse.json({ success: true, leaderboard: [] });
    }

    // Get observations made during the session
    const { data: sessionData } = await supabaseAdmin
      .from('live_field_sessions')
      .select('start_time, end_time')
      .eq('id', sessionId)
      .single();

    const startTime = sessionData?.start_time || new Date().toISOString();
    const endTime = sessionData?.end_time || new Date().toISOString();

    // Get observations and points for participants during session
    const { data: observations, error: obsError } = await supabaseAdmin
      .from('observations')
      .select('user_id, id, species_identified')
      .in('user_id', participantIds)
      .gte('created_at', startTime)
      .lte('created_at', endTime);

    if (obsError) {
      console.error('Error fetching observations:', obsError);
    }

    // Get points earned during session
    const { data: pointsData, error: pointsError } = await supabaseAdmin
      .from('user_points')
      .select('user_id, points')
      .in('user_id', participantIds)
      .gte('created_at', startTime)
      .lte('created_at', endTime);

    if (pointsError) {
      console.error('Error fetching points:', pointsError);
    }

    // Calculate leaderboard
    const leaderboardMap = new Map<string, { userId: string; userName: string; points: number; observations: number; speciesCount: number }>();

    (participants || []).forEach((p: any) => {
      const userId = p.user_id;
      const userName = p.users?.name || 'Unknown';
      leaderboardMap.set(userId, {
        userId,
        userName,
        points: 0,
        observations: 0,
        speciesCount: 0,
      });
    });

    // Count observations
    (observations || []).forEach((obs: any) => {
      const entry = leaderboardMap.get(obs.user_id);
      if (entry) {
        entry.observations++;
        if (obs.species_identified) {
          entry.speciesCount++;
        }
      }
    });

    // Sum points
    (pointsData || []).forEach((point: any) => {
      const entry = leaderboardMap.get(point.user_id);
      if (entry) {
        entry.points += point.points || 0;
      }
    });

    // Convert to array and sort
    const leaderboard = Array.from(leaderboardMap.values())
      .sort((a, b) => {
        // Sort by points, then observations, then species count
        if (b.points !== a.points) return b.points - a.points;
        if (b.observations !== a.observations) return b.observations - a.observations;
        return b.speciesCount - a.speciesCount;
      });

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

