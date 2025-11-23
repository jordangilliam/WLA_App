import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';
import { getPillarRecommendations } from '@/lib/data/pillars';
import { getAdaptiveRecommendations, scoreRecommendation, type UserProgress } from '@/lib/ai/recommendation-engine';

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

/**
 * GET /api/recommendations/unified
 * Unified content recommendation system combining:
 * - Pillar recommendations (lessons, experiences, data sets)
 * - Mission recommendations
 * - Challenge recommendations
 * 
 * Query params:
 * - siteId: Field site ID (optional)
 * - tags: Comma-separated tags (optional)
 * - types: Comma-separated content types (optional)
 * - limit: Max recommendations (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const tagsParam = searchParams.get('tags');
    const typesParam = searchParams.get('types');
    const limitParam = searchParams.get('limit');

    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    const tags = tagsParam ? tagsParam.split(',').map((t) => t.trim()) : [];
    const types = typesParam ? typesParam.split(',').map((t) => t.trim()) : [];
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    const recommendations: any[] = [];

    // 1. Get pillar recommendations
    if (tags.length > 0 || types.length > 0) {
      const pillarRecs = getPillarRecommendations({
        tags: tags.filter(Boolean),
        types: types.filter(Boolean),
        limit: Math.ceil(limit * 0.4), // 40% pillar content
      });

      pillarRecs.forEach((rec) => {
        recommendations.push({
          id: rec.id,
          type: 'pillar_content',
          contentType: rec.type,
          title: rec.name,
          description: rec.pillarDescription,
          pillarId: rec.pillarId,
          pillarTitle: rec.pillarTitle,
          tags: rec.coverageTags,
          path: rec.path,
          score: 1.0, // Base score
        });
      });
    }

    // 2. Get mission recommendations (if siteId provided)
    if (siteId && supabaseAdmin) {
      try {
        const { data: missions } = await supabaseAdmin
          .from('mission_locations')
          .select(`
            mission_id,
            story_missions (
              id,
              title,
              synopsis,
              hero_image_url,
              difficulty
            )
          `)
          .eq('field_site_id', siteId)
          .limit(Math.ceil(limit * 0.3)); // 30% missions

        if (missions) {
          const missionMap = new Map<string, any>();
          missions.forEach((ml: any) => {
            const mission = ml.story_missions;
            if (!mission || missionMap.has(mission.id)) return;
            missionMap.set(mission.id, {
              id: mission.id,
              type: 'mission',
              contentType: 'mission',
              title: mission.title,
              description: mission.synopsis,
              difficulty: mission.difficulty,
              heroImageUrl: mission.hero_image_url,
              path: `/missions?mission=${mission.id}`,
              score: 0.9, // Slightly lower than pillar content
            });
          });
          recommendations.push(...Array.from(missionMap.values()));
        }
      } catch (error) {
        console.error('Failed to fetch missions:', error);
      }
    }

    // 3. Get challenge recommendations (if siteId provided)
    if (siteId && supabaseAdmin) {
      try {
        const siteRelevantMetrics = ['check_ins', 'sites_visited', 'observations', 'photos_taken', 'species_count'];
        const { data: challenges } = await supabaseAdmin
          .from('challenges')
          .select('*')
          .eq('active', true)
          .in('target_metric', siteRelevantMetrics)
          .lte('start_date', new Date().toISOString().split('T')[0])
          .gte('end_date', new Date().toISOString().split('T')[0])
          .limit(Math.ceil(limit * 0.3)); // 30% challenges

        if (challenges) {
          // Get user progress if authenticated
          let userProgress: Record<string, any> = {};
          if (userId) {
            const { data: progress } = await supabaseAdmin
              .from('user_challenge_progress')
              .select('*')
              .eq('user_id', userId)
              .in('challenge_id', challenges.map((c: any) => c.id));

            if (progress) {
              progress.forEach((p: any) => {
                userProgress[p.challenge_id] = p;
              });
            }
          }

          challenges.forEach((challenge: any) => {
            const progress = userProgress[challenge.id];
            const completed = progress?.completed || false;
            const progressPercent = challenge.target_count > 0
              ? Math.min(((progress?.current_progress || 0) / challenge.target_count) * 100, 100)
              : 0;

            // Boost score for incomplete challenges (more relevant)
            const score = completed ? 0.5 : 0.8;

            recommendations.push({
              id: challenge.id,
              type: 'challenge',
              contentType: 'challenge',
              title: challenge.title,
              description: challenge.description,
              challengeType: challenge.challenge_type,
              difficulty: challenge.difficulty,
              icon: challenge.icon,
              rewardPoints: challenge.reward_points,
              currentProgress: progress?.current_progress || 0,
              targetCount: challenge.target_count,
              completed,
              progressPercent,
              path: '/challenges',
              score,
            });
          });
        }
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      }
    }

    // 4. Enhance with adaptive scoring if user is authenticated
    if (userId && supabaseAdmin) {
      try {
        // Fetch user progress for adaptive recommendations
        const { data: lessons } = await supabaseAdmin
          .from('lesson_completions')
          .select('lesson_id')
          .eq('user_id', userId);
        
        const { data: missions } = await supabaseAdmin
          .from('mission_completions')
          .select('mission_id')
          .eq('user_id', userId);

        const userProgress: UserProgress = {
          userId,
          completedLessons: (lessons || []).map((l: any) => l.lesson_id),
          completedMissions: (missions || []).map((m: any) => m.mission_id),
          completedChallenges: [],
          observations: 0,
          speciesIdentified: 0,
          favoritePillars: [],
          preferredDifficulty: 'beginner',
          learningGoals: [],
        };

        // Re-score recommendations with adaptive algorithm
        recommendations.forEach((rec) => {
          rec.score = scoreRecommendation(rec, userProgress, {
            location: siteId ? { 
              latitude: 0, // Will be populated from field site if needed
              longitude: 0, // Will be populated from field site if needed
              fieldSiteId: siteId 
            } : undefined,
          });
        });
      } catch (error) {
        console.error('Error enhancing recommendations:', error);
      }
    }

    // 5. Sort by score and limit
    recommendations.sort((a, b) => b.score - a.score);
    const limited = recommendations.slice(0, limit);

    return NextResponse.json({
      success: true,
      recommendations: limited,
      total: recommendations.length,
      limit,
    });
  } catch (error) {
    console.error('Failed to generate unified recommendations:', error);
    return NextResponse.json(
      { error: 'Unable to generate recommendations' },
      { status: 500 }
    );
  }
}

