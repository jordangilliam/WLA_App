import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { generateLearningPath, getAdaptiveRecommendations, type UserProgress } from '@/lib/ai/recommendation-engine';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/recommendations/learning-path
 * Get personalized learning path for the user
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

    // Fetch user progress
    const userProgress = await fetchUserProgress(userId);

    // Generate learning path
    const learningPath = generateLearningPath(userProgress);

    if (!learningPath) {
      return NextResponse.json({
        success: true,
        learningPath: null,
        message: 'Not enough data to generate learning path',
      });
    }

    return NextResponse.json({
      success: true,
      learningPath,
    });
  } catch (error) {
    console.error('Error generating learning path:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Fetch user progress from database
 */
async function fetchUserProgress(userId: string): Promise<UserProgress> {
  if (!supabaseAdmin) {
    return getDefaultUserProgress(userId);
  }

  try {
    // Fetch completed lessons
    const { data: lessons } = await supabaseAdmin
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', userId);

    // Fetch completed missions
    const { data: missions } = await supabaseAdmin
      .from('mission_completions')
      .select('mission_id')
      .eq('user_id', userId);

    // Fetch completed challenges
    const { data: challenges } = await supabaseAdmin
      .from('user_challenge_progress')
      .select('challenge_id')
      .eq('user_id', userId)
      .eq('completed', true);

    // Fetch observation count
    const { data: observations } = await supabaseAdmin
      .from('observations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Fetch species identification count
    const { data: identifications } = await supabaseAdmin
      .from('ai_identifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'confirmed');

    // Fetch user preferences (would need a user_preferences table)
    const favoritePillars: string[] = [];
    const learningGoals: string[] = [];
    const preferredDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

    return {
      userId,
      completedLessons: (lessons || []).map((l: any) => l.lesson_id),
      completedMissions: (missions || []).map((m: any) => m.mission_id),
      completedChallenges: (challenges || []).map((c: any) => c.challenge_id),
      observations: observations?.length || 0,
      speciesIdentified: identifications?.length || 0,
      favoritePillars,
      preferredDifficulty,
      learningGoals,
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return getDefaultUserProgress(userId);
  }
}

function getDefaultUserProgress(userId: string): UserProgress {
  return {
    userId,
    completedLessons: [],
    completedMissions: [],
    completedChallenges: [],
    observations: 0,
    speciesIdentified: 0,
    favoritePillars: [],
    preferredDifficulty: 'beginner',
    learningGoals: [],
  };
}

