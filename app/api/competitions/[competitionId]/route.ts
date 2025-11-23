import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/competitions/[competitionId]
 * Get competition details
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

    const { data: competition, error } = await supabaseAdmin
      .from('class_competitions')
      .select(`
        *,
        participating_classes:class_competition_participants (
          class_id,
          classes (id, class_name)
        )
      `)
      .eq('id', competitionId)
      .single();

    if (error || !competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }

    // Calculate class points and rankings
    const classIds = (competition.participating_classes || []).map((pc: any) => pc.class_id);

    // Get points for each class (would need to aggregate from user_points)
    const classPoints: Record<string, number> = {};
    for (const classId of classIds) {
      const { data: classUsers } = await supabaseAdmin
        .from('class_enrollments')
        .select('user_id')
        .eq('class_id', classId);

      const userIds = (classUsers || []).map((u: any) => u.user_id);

      if (userIds.length > 0) {
        const { data: points } = await supabaseAdmin
          .from('user_points')
          .select('points')
          .in('user_id', userIds)
          .gte('created_at', competition.start_date)
          .lte('created_at', competition.end_date);

        const totalPoints = (points || []).reduce((sum: number, p: any) => sum + (p.points || 0), 0);
        classPoints[classId] = totalPoints;
      } else {
        classPoints[classId] = 0;
      }
    }

    // Sort classes by points
    const sortedClasses = (competition.participating_classes || [])
      .map((pc: any) => ({
        classId: pc.class_id,
        className: pc.classes?.class_name || 'Unknown',
        points: classPoints[pc.class_id] || 0,
      }))
      .sort((a: { classId: string; className: string; points: number }, b: { classId: string; className: string; points: number }) => b.points - a.points)
      .map((c: { classId: string; className: string; points: number }, index: number) => ({
        ...c,
        rank: index + 1,
      }));

    return NextResponse.json({
      success: true,
      competition: {
        id: competition.id,
        title: competition.title,
        description: competition.description,
        startDate: competition.start_date,
        endDate: competition.end_date,
        isActive: competition.is_active,
        participatingClasses: sortedClasses,
        rewards: {
          firstPlace: competition.first_place_reward || 'Recognition',
          secondPlace: competition.second_place_reward || 'Recognition',
          thirdPlace: competition.third_place_reward || 'Recognition',
        },
      },
    });
  } catch (error) {
    console.error('Error fetching competition:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

