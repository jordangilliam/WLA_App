import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/competitions
 * Get active competitions
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
    const active = searchParams.get('active') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let query = supabaseAdmin
      .from('class_competitions')
      .select(`
        *,
        participating_classes:class_competition_participants (
          class_id,
          classes (id, class_name)
        )
      `)
      .order('start_date', { ascending: false })
      .limit(limit);

    if (active) {
      const now = new Date().toISOString();
      query = query
        .lte('start_date', now)
        .gte('end_date', now)
        .eq('is_active', true);
    }

    const { data: competitions, error } = await query;

    if (error) {
      console.error('Error fetching competitions:', error);
      return NextResponse.json({ error: 'Failed to fetch competitions' }, { status: 500 });
    }

    // Transform data
    const formattedCompetitions = (competitions || []).map((comp: any) => ({
      id: comp.id,
      title: comp.title,
      description: comp.description,
      startDate: comp.start_date,
      endDate: comp.end_date,
      isActive: comp.is_active,
      participatingClasses: (comp.participating_classes || []).map((pc: any) => ({
        classId: pc.class_id,
        className: pc.classes?.class_name || 'Unknown',
        points: 0, // Would calculate from class points
        rank: 0, // Would calculate from leaderboard
      })),
      rewards: {
        firstPlace: comp.first_place_reward || 'Recognition',
        secondPlace: comp.second_place_reward || 'Recognition',
        thirdPlace: comp.third_place_reward || 'Recognition',
      },
    }));

    return NextResponse.json({
      success: true,
      competitions: formattedCompetitions,
    });
  } catch (error) {
    console.error('Error in competitions API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/competitions
 * Create a new competition (teachers only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const userRole = (session?.user as { role?: string } | undefined)?.role;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userRole !== 'educator' && userRole !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can create competitions' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const body = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      classIds,
      firstPlaceReward,
      secondPlaceReward,
      thirdPlaceReward,
    } = body;

    if (!title || !startDate || !endDate || !classIds || classIds.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create competition
    const { data: competition, error: compError } = await supabaseAdmin
      .from('class_competitions')
      .insert({
        title,
        description: description || null,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
        first_place_reward: firstPlaceReward || null,
        second_place_reward: secondPlaceReward || null,
        third_place_reward: thirdPlaceReward || null,
        created_by: userId,
      })
      .select()
      .single();

    if (compError) {
      console.error('Error creating competition:', compError);
      return NextResponse.json({ error: 'Failed to create competition' }, { status: 500 });
    }

    // Add participating classes
    const participants = classIds.map((classId: string) => ({
      competition_id: competition.id,
      class_id: classId,
    }));

    const { error: participantsError } = await supabaseAdmin
      .from('class_competition_participants')
      .insert(participants as never);

    if (participantsError) {
      console.error('Error adding participants:', participantsError);
      // Continue anyway - competition was created
    }

    return NextResponse.json({
      success: true,
      competition: {
        id: competition.id,
        title: competition.title,
        description: competition.description,
        startDate: competition.start_date,
        endDate: competition.end_date,
        isActive: competition.is_active,
      },
    });
  } catch (error) {
    console.error('Error creating competition:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

