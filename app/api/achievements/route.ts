import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check database connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Fetch all achievements
    const { data: achievements, error: achievementsError } = await supabaseAdmin
      .from('achievements')
      .select('*')
      .order('difficulty', { ascending: true })
      .order('category', { ascending: true });

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      );
    }

    // Fetch user's unlocked achievements
    const { data: userAchievements, error: userAchievementsError } = await supabaseAdmin
      .from('user_achievements')
      .select('*')
      .eq('user_id', session.user.id);

    if (userAchievementsError) {
      console.error('Error fetching user achievements:', userAchievementsError);
    }

    // Get user stats for progress calculation
    const { data: userStats, error: statsError } = await supabaseAdmin
      .rpc('get_user_stats', { user_id_param: session.user.id });

    if (statsError) {
      console.error('Error fetching user stats:', statsError);
    }

    // Calculate progress for each achievement
    const achievementsWithProgress = (achievements || []).map((achievement: any) => {
      const userAchievement = (userAchievements || []).find(
        (ua: any) => ua.achievement_id === achievement.id
      );

      let currentCount = 0;

      // Calculate current progress based on requirement type
      if (userStats && !userAchievement) {
        switch (achievement.requirement_type) {
          case 'visits':
            currentCount = userStats.total_visits || 0;
            break;
          case 'observations':
            currentCount = userStats.total_observations || 0;
            break;
          case 'species':
            currentCount = userStats.unique_species || 0;
            break;
          case 'points':
            currentCount = userStats.total_points || 0;
            break;
          case 'photos':
            currentCount = userStats.total_photos || 0;
            break;
          case 'consecutive_days':
            currentCount = userStats.streak_days || 0;
            break;
          default:
            currentCount = 0;
        }
      }

      return {
        ...achievement,
        userAchievement: userAchievement
          ? {
              achievement_id: userAchievement.achievement_id,
              unlocked_at: userAchievement.unlocked_at,
              current_count: achievement.requirement_count,
              progress: 100,
            }
          : {
              achievement_id: achievement.id,
              current_count: currentCount,
              progress: Math.min(
                (currentCount / achievement.requirement_count) * 100,
                100
              ),
            },
      };
    });

    return NextResponse.json({
      success: true,
      achievements: achievements || [],
      userAchievements: (userAchievements || []).map((ua: any) => ({
        achievement_id: ua.achievement_id,
        unlocked_at: ua.unlocked_at,
        progress: 100,
        current_count: (achievements || []).find((a: any) => a.id === ua.achievement_id)
          ?.requirement_count || 0,
      })),
      userStats: userStats || {
        total_visits: 0,
        total_observations: 0,
        unique_species: 0,
        total_points: 0,
        total_photos: 0,
        streak_days: 0,
      },
    });
  } catch (error) {
    console.error('Error in achievements API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

