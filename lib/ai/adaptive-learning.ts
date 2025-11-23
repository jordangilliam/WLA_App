/**
 * Adaptive Learning Engine
 * Adjusts content difficulty based on user performance
 */

export interface PerformanceMetrics {
  userId: string;
  correctAnswers: number;
  totalAnswers: number;
  averageTime: number; // seconds
  topics: Record<string, {
    correct: number;
    total: number;
    averageTime: number;
  }>;
}

export interface AdaptiveRecommendation {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  reason: string;
  confidence: number;
}

/**
 * Calculate user's current difficulty level
 */
export function calculateDifficultyLevel(metrics: PerformanceMetrics): 'beginner' | 'intermediate' | 'advanced' {
  const accuracy = metrics.totalAnswers > 0 ? metrics.correctAnswers / metrics.totalAnswers : 0;

  if (accuracy < 0.6) {
    return 'beginner';
  } else if (accuracy < 0.8) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}

/**
 * Get adaptive recommendations based on performance
 */
export function getAdaptiveRecommendations(
  metrics: PerformanceMetrics
): AdaptiveRecommendation[] {
  const recommendations: AdaptiveRecommendation[] = [];
  const currentLevel = calculateDifficultyLevel(metrics);

  // Identify weak topics
  Object.entries(metrics.topics).forEach(([topic, topicMetrics]) => {
    const topicAccuracy = topicMetrics.total > 0 ? topicMetrics.correct / topicMetrics.total : 0;
    
    if (topicAccuracy < 0.7 && topicMetrics.total >= 3) {
      recommendations.push({
        difficulty: 'beginner',
        topic,
        reason: `You're struggling with ${topic}. Let's review the basics.`,
        confidence: 0.8,
      });
    }
  });

  // Suggest advancement if doing well
  if (metrics.correctAnswers / metrics.totalAnswers >= 0.85 && currentLevel !== 'advanced') {
    const nextLevel = currentLevel === 'beginner' ? 'intermediate' : 'advanced';
    recommendations.push({
      difficulty: nextLevel,
      topic: 'general',
      reason: `You're excelling! Ready for ${nextLevel} content?`,
      confidence: 0.9,
    });
  }

  return recommendations;
}

/**
 * Adjust question difficulty based on recent performance
 */
export function adjustDifficulty(
  currentDifficulty: 'beginner' | 'intermediate' | 'advanced',
  recentPerformance: { correct: number; total: number }
): 'beginner' | 'intermediate' | 'advanced' {
  const accuracy = recentPerformance.total > 0 ? recentPerformance.correct / recentPerformance.total : 0;

  if (accuracy < 0.5 && currentDifficulty !== 'beginner') {
    // Move down
    return currentDifficulty === 'advanced' ? 'intermediate' : 'beginner';
  } else if (accuracy > 0.85 && currentDifficulty !== 'advanced') {
    // Move up
    return currentDifficulty === 'beginner' ? 'intermediate' : 'advanced';
  }

  return currentDifficulty;
}

/**
 * Generate personalized hints based on performance
 */
export function generateHint(
  question: string,
  userAttempts: number,
  topic: string
): string {
  if (userAttempts === 1) {
    return `Think about what you've learned about ${topic}. What are the key concepts?`;
  } else if (userAttempts === 2) {
    return `Consider the relationship between different parts of the ecosystem. How do they interact?`;
  } else {
    return `Let's break this down step by step. Start with the basics and build up.`;
  }
}

