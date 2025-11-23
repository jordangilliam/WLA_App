/**
 * Intelligent Recommendation Engine
 * Provides adaptive, context-aware content recommendations
 */

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: LearningPathStep[];
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  pillarIds: string[];
}

export interface LearningPathStep {
  id: string;
  type: 'lesson' | 'mission' | 'challenge' | 'observation';
  contentId: string;
  title: string;
  description: string;
  order: number;
  required: boolean;
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  completedMissions: string[];
  completedChallenges: string[];
  observations: number;
  speciesIdentified: number;
  favoritePillars: string[];
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
}

export interface RecommendationContext {
  location?: {
    latitude: number;
    longitude: number;
    fieldSiteId?: string;
  };
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  weather?: string;
  currentActivity?: string;
}

/**
 * Generate personalized learning path based on user progress and interests
 */
export function generateLearningPath(
  userProgress: UserProgress,
  context?: RecommendationContext
): LearningPath | null {
  // Determine user level
  const userLevel = determineUserLevel(userProgress);
  
  // Identify knowledge gaps
  const knowledgeGaps = identifyKnowledgeGaps(userProgress);
  
  // Select appropriate content based on level and gaps
  const steps = selectPathSteps(userLevel, knowledgeGaps, context);
  
  if (steps.length === 0) return null;
  
  return {
    id: `path-${userProgress.userId}-${Date.now()}`,
    title: `Personalized ${userLevel} Learning Path`,
    description: `A customized learning journey based on your progress and interests`,
    steps,
    estimatedDuration: steps.length * 15, // 15 minutes per step average
    difficulty: userLevel,
    tags: extractTags(steps),
    pillarIds: extractPillars(steps),
  };
}

/**
 * Determine user's learning level
 */
function determineUserLevel(progress: UserProgress): 'beginner' | 'intermediate' | 'advanced' {
  const totalCompleted =
    progress.completedLessons.length +
    progress.completedMissions.length +
    progress.completedChallenges.length;
  
  if (totalCompleted < 5) return 'beginner';
  if (totalCompleted < 15) return 'intermediate';
  return 'advanced';
}

/**
 * Identify knowledge gaps based on completed content
 */
function identifyKnowledgeGaps(progress: UserProgress): string[] {
  const gaps: string[] = [];
  
  // Check for missing pillar coverage
  const allPillars = ['species', 'waterways', 'food-systems', 'micro-macro', 'industry', 'history'];
  const coveredPillars = progress.favoritePillars || [];
  const missingPillars = allPillars.filter((p) => !coveredPillars.includes(p));
  gaps.push(...missingPillars);
  
  // Check for low observation count
  if (progress.observations < 10) {
    gaps.push('field-work');
  }
  
  // Check for low species identification
  if (progress.speciesIdentified < 5) {
    gaps.push('species-identification');
  }
  
  return gaps;
}

/**
 * Select appropriate steps for learning path
 */
function selectPathSteps(
  level: 'beginner' | 'intermediate' | 'advanced',
  gaps: string[],
  context?: RecommendationContext
): LearningPathStep[] {
  const steps: LearningPathStep[] = [];
  
  // Add foundational lessons for beginners
  if (level === 'beginner') {
    steps.push({
      id: 'intro-lesson',
      type: 'lesson',
      contentId: 'intro-to-conservation',
      title: 'Introduction to Conservation',
      description: 'Learn the basics of conservation science',
      order: 1,
      required: true,
    });
  }
  
  // Add content to fill knowledge gaps
  gaps.forEach((gap, index) => {
    if (gap === 'field-work') {
      steps.push({
        id: `field-work-${index}`,
        type: 'mission',
        contentId: 'field-observation-mission',
        title: 'Field Observation Mission',
        description: 'Practice making field observations',
        order: steps.length + 1,
        required: false,
      });
    } else if (gap === 'species-identification') {
      steps.push({
        id: `species-id-${index}`,
        type: 'lesson',
        contentId: 'species-identification-guide',
        title: 'Species Identification Guide',
        description: 'Learn how to identify common species',
        order: steps.length + 1,
        required: false,
      });
    }
  });
  
  // Add context-aware recommendations
  if (context?.location?.fieldSiteId) {
    steps.push({
      id: 'site-specific',
      type: 'mission',
      contentId: context.location.fieldSiteId,
      title: 'Explore This Location',
      description: 'Complete missions at your current field site',
      order: steps.length + 1,
      required: false,
    });
  }
  
  return steps.slice(0, 10); // Limit to 10 steps
}

/**
 * Extract tags from learning path steps
 */
function extractTags(steps: LearningPathStep[]): string[] {
  const tags = new Set<string>();
  steps.forEach((step) => {
    tags.add(step.type);
  });
  return Array.from(tags);
}

/**
 * Extract pillar IDs from learning path steps
 */
function extractPillars(steps: LearningPathStep[]): string[] {
  // In a real implementation, this would query content metadata
  return ['species', 'waterways']; // Placeholder
}

/**
 * Score recommendations based on relevance
 */
export function scoreRecommendation(
  content: any,
  userProgress: UserProgress,
  context?: RecommendationContext
): number {
  let score = 0.5; // Base score
  
  // Boost if content matches user's favorite pillars
  if (content.pillarIds && userProgress.favoritePillars) {
    const matchingPillars = content.pillarIds.filter((p: string) =>
      userProgress.favoritePillars.includes(p)
    );
    score += matchingPillars.length * 0.2;
  }
  
  // Boost if content matches user's learning goals
  if (content.tags && userProgress.learningGoals) {
    const matchingGoals = content.tags.filter((t: string) =>
      userProgress.learningGoals.includes(t)
    );
    score += matchingGoals.length * 0.15;
  }
  
  // Boost if content is appropriate for user's level
  if (content.difficulty === userProgress.preferredDifficulty) {
    score += 0.1;
  }
  
  // Boost if content is location-relevant
  if (context?.location?.fieldSiteId && content.fieldSiteId === context.location.fieldSiteId) {
    score += 0.2;
  }
  
  // Penalize if content is already completed
  if (
    userProgress.completedLessons.includes(content.id) ||
    userProgress.completedMissions.includes(content.id) ||
    userProgress.completedChallenges.includes(content.id)
  ) {
    score *= 0.3; // Reduce score but don't eliminate
  }
  
  return Math.min(1.0, score);
}

/**
 * Get adaptive recommendations that improve with usage
 */
export function getAdaptiveRecommendations(
  userProgress: UserProgress,
  allContent: any[],
  context?: RecommendationContext,
  limit: number = 10
): any[] {
  // Score all content
  const scored = allContent.map((content) => ({
    ...content,
    score: scoreRecommendation(content, userProgress, context),
  }));
  
  // Sort by score
  scored.sort((a, b) => b.score - a.score);
  
  // Return top recommendations
  return scored.slice(0, limit);
}

