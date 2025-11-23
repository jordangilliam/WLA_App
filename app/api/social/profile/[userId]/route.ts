import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/social/profile/[userId]
 * Get student profile data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = (session?.user as { id?: string } | undefined)?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { userId } = params;

    // Fetch user data
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, name, avatar_url, bio')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user stats
    const [achievementsResult, observationsResult, identificationsResult, missionsResult] =
      await Promise.allSettled([
        supabaseAdmin
          .from('user_achievements')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabaseAdmin
          .from('observations')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabaseAdmin
          .from('ai_identifications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'confirmed'),
        supabaseAdmin
          .from('mission_completions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

    const achievements = achievementsResult.status === 'fulfilled' ? achievementsResult.value.length || 0 : 0;
    const observations = observationsResult.status === 'fulfilled' ? observationsResult.value.length || 0 : 0;
    const speciesIdentified = identificationsResult.status === 'fulfilled' ? identificationsResult.value.length || 0 : 0;
    const missionsCompleted = missionsResult.status === 'fulfilled' ? missionsResult.value.length || 0 : 0;

    // Fetch favorite pillars (would need user_preferences table or calculate from activity)
    const favoritePillars: string[] = [];

    // Fetch recent discoveries
    const { data: recentPosts } = await supabaseAdmin
      .from('class_feed_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const profile = {
      id: user.id,
      name: user.name,
      avatar: user.avatar_url,
      bio: user.bio,
      achievements,
      observations,
      speciesIdentified,
      missionsCompleted,
      favoritePillars,
      recentDiscoveries: recentPosts || [],
    };

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

