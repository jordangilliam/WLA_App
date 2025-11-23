import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/field-sites/[siteId]/challenges
 * Fetch challenges relevant to a specific field site
 * 
 * Challenges are relevant if:
 * - target_metric is 'check_ins' or 'sites_visited' (any site works)
 * - target_metric is 'observations' or 'photos_taken' (can be done at any site)
 * - Future: field_site_id matches (when location-specific challenges are added)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  const { siteId } = params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  try {
    // Get active challenges that are relevant to any site
    // These metrics can be completed at any field site
    const siteRelevantMetrics = ['check_ins', 'sites_visited', 'observations', 'photos_taken', 'species_count'];
    
    const { data: challenges, error } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .eq('active', true)
      .in('target_metric', siteRelevantMetrics)
      .lte('start_date', new Date().toISOString().split('T')[0])
      .gte('end_date', new Date().toISOString().split('T')[0])
      .order('challenge_type', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch challenges for site:', error);
      return NextResponse.json(
        { error: 'Unable to fetch challenges' },
        { status: 500 }
      );
    }

    // If user is authenticated, get their progress
    let userProgress: Record<string, any> = {};
    if (userId) {
      const { data: progress } = await supabaseAdmin
        .from('user_challenge_progress')
        .select('*')
        .eq('user_id', userId)
        .in('challenge_id', (challenges || []).map((c: any) => c.id));

      if (progress) {
        progress.forEach((p: any) => {
          userProgress[p.challenge_id] = p;
        });
      }
    }

    // Transform challenges with user progress
    const challengesWithProgress = (challenges || []).map((challenge: any) => {
      const progress = userProgress[challenge.id];
      const progressPercent = challenge.target_count > 0
        ? Math.min(((progress?.current_progress || 0) / challenge.target_count) * 100, 100)
        : 0;

      return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        challengeType: challenge.challenge_type,
        targetMetric: challenge.target_metric,
        targetCount: challenge.target_count,
        rewardPoints: challenge.reward_points,
        difficulty: challenge.difficulty,
        icon: challenge.icon,
        currentProgress: progress?.current_progress || 0,
        completed: progress?.completed || false,
        progressPercent,
        rewardsClaimed: progress?.rewards_claimed || false,
      };
    });

    return NextResponse.json({ success: true, challenges: challengesWithProgress });
  } catch (error) {
    console.error('Failed to fetch challenges for site:', error);
    return NextResponse.json(
      { error: 'Unable to fetch challenges' },
      { status: 500 }
    );
  }
}

