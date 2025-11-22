/**
 * Gamification Engine
 * Core logic for points, levels, achievements, and rewards
 */

import type { 
  UserProfile, 
  UserStats, 
  AmbassadorLevel,
  LevelInfo, 
  LEVEL_SYSTEM 
} from '../types/gamification.types';
import type { Location, UserVisit } from '../types/location.types';

// ============================================================================
// Experience & Leveling System
// ============================================================================

/**
 * Level progression table
 */
export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Curious Explorer", requiredExperience: 0, rewards: {} },
  { level: 2, title: "Nature Observer", requiredExperience: 100, rewards: { points: 50 } },
  { level: 3, title: "Field Investigator", requiredExperience: 250, rewards: { points: 75 } },
  { level: 4, title: "Wildlife Scout", requiredExperience: 500, rewards: { points: 100, unlockFeature: "photo_identification" } },
  { level: 5, title: "Conservation Apprentice", requiredExperience: 1000, rewards: { points: 150, badge: "apprentice" } },
  { level: 6, title: "Habitat Explorer", requiredExperience: 1500, rewards: { points: 200 } },
  { level: 7, title: "Species Specialist", requiredExperience: 2250, rewards: { points: 250 } },
  { level: 8, title: "Field Researcher", requiredExperience: 3000, rewards: { points: 300 } },
  { level: 9, title: "Conservation Scout", requiredExperience: 4000, rewards: { points: 400, unlockFeature: "advanced_tracking" } },
  { level: 10, title: "Nature Ambassador", requiredExperience: 5000, rewards: { points: 500, badge: "ambassador" } },
  { level: 11, title: "Wildlife Guardian", requiredExperience: 6500, rewards: { points: 600 } },
  { level: 12, title: "Ecosystem Specialist", requiredExperience: 8000, rewards: { points: 700 } },
  { level: 13, title: "Conservation Leader", requiredExperience: 10000, rewards: { points: 850 } },
  { level: 14, title: "Environmental Advocate", requiredExperience: 12000, rewards: { points: 1000 } },
  { level: 15, title: "Conservation Expert", requiredExperience: 15000, rewards: { points: 1250, unlockFeature: "mentor_mode" } },
  { level: 16, title: "Master Naturalist", requiredExperience: 18000, rewards: { points: 1500 } },
  { level: 17, title: "Biodiversity Champion", requiredExperience: 22000, rewards: { points: 1800 } },
  { level: 18, title: "Wildlife Steward", requiredExperience: 26000, rewards: { points: 2100 } },
  { level: 19, title: "Conservation Visionary", requiredExperience: 30000, rewards: { points: 2500 } },
  { level: 20, title: "Master Conservationist", requiredExperience: 35000, rewards: { points: 3000, badge: "master", special: "custom_avatar" } },
  { level: 21, title: "Legend of the Wild", requiredExperience: 40000, rewards: { points: 3500 } },
  { level: 22, title: "Ecological Sage", requiredExperience: 46000, rewards: { points: 4000 } },
  { level: 23, title: "Ultimate Naturalist", requiredExperience: 52000, rewards: { points: 4500 } },
  { level: 24, title: "Conservation Icon", requiredExperience: 60000, rewards: { points: 5000 } },
  { level: 25, title: "Guardian of Nature", requiredExperience: 70000, rewards: { points: 6000, special: "hall_of_fame" } },
];

/**
 * Calculate level from experience points
 */
export function calculateLevel(experience: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (experience >= LEVELS[i].requiredExperience) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

/**
 * Get level information
 */
export function getLevelInfo(level: number): LevelInfo | undefined {
  return LEVELS.find(l => l.level === level);
}

/**
 * Calculate experience needed for next level
 */
export function experienceToNextLevel(currentExperience: number): number {
  const currentLevel = calculateLevel(currentExperience);
  const nextLevelInfo = LEVELS.find(l => l.level === currentLevel + 1);
  
  if (!nextLevelInfo) return 0; // Max level reached
  
  return nextLevelInfo.requiredExperience - currentExperience;
}

/**
 * Calculate progress to next level (0-100)
 */
export function calculateLevelProgress(currentExperience: number): number {
  const currentLevel = calculateLevel(currentExperience);
  const currentLevelInfo = getLevelInfo(currentLevel);
  const nextLevelInfo = getLevelInfo(currentLevel + 1);
  
  if (!currentLevelInfo || !nextLevelInfo) return 100; // Max level
  
  const currentLevelXP = currentLevelInfo.requiredExperience;
  const nextLevelXP = nextLevelInfo.requiredExperience;
  const progressXP = currentExperience - currentLevelXP;
  const requiredXP = nextLevelXP - currentLevelXP;
  
  return Math.min(100, Math.round((progressXP / requiredXP) * 100));
}

/**
 * Determine ambassador level based on total experience and achievements
 */
export function calculateAmbassadorLevel(
  experience: number,
  totalBadges: number,
  locationsVisited: number
): AmbassadorLevel {
  // Comprehensive scoring system
  const score = experience + (totalBadges * 500) + (locationsVisited * 100);
  
  if (score >= 50000) return 'legend';
  if (score >= 30000) return 'master';
  if (score >= 15000) return 'expert';
  if (score >= 5000) return 'ambassador';
  if (score >= 1000) return 'apprentice';
  return 'novice';
}

// ============================================================================
// Points System
// ============================================================================

export interface PointsCalculation {
  basePoints: number;
  bonuses: Array<{ reason: string; points: number }>;
  total: number;
}

/**
 * Calculate points for a location visit
 */
export function calculateVisitPoints(
  location: Location,
  isFirstVisit: boolean,
  distance: number, // distance traveled in meters
  userLevel: number
): PointsCalculation {
  const calc: PointsCalculation = {
    basePoints: location.basePoints,
    bonuses: [],
    total: 0,
  };

  // First visit bonus
  if (isFirstVisit) {
    calc.bonuses.push({
      reason: 'First Visit',
      points: location.firstVisitBonus,
    });
  }

  // Rarity bonus
  const rarityBonuses: Record<string, number> = {
    common: 0,
    uncommon: 10,
    rare: 25,
    epic: 50,
    legendary: 100,
  };
  
  if (location.rarity && location.rarity !== 'common') {
    calc.bonuses.push({
      reason: `${location.rarity} Location`,
      points: rarityBonuses[location.rarity],
    });
  }

  // Distance bonus (for traveling far)
  if (distance > 50000) { // More than 50km
    calc.bonuses.push({
      reason: 'Long Distance Travel',
      points: 50,
    });
  } else if (distance > 25000) { // More than 25km
    calc.bonuses.push({
      reason: 'Distance Travel',
      points: 25,
    });
  }

  // Distance multiplier (for remote locations)
  if (location.distanceMultiplier && location.distanceMultiplier > 1) {
    const multiplierBonus = Math.round(calc.basePoints * (location.distanceMultiplier - 1));
    calc.bonuses.push({
      reason: 'Remote Location',
      points: multiplierBonus,
    });
  }

  // Calculate total
  calc.total = calc.basePoints + calc.bonuses.reduce((sum, bonus) => sum + bonus.points, 0);

  return calc;
}

/**
 * Calculate points for completing a challenge
 */
export function calculateChallengePoints(
  challengeBasePoints: number,
  difficulty: 'easy' | 'medium' | 'hard' | 'expert',
  completionTime?: number // minutes
): PointsCalculation {
  const calc: PointsCalculation = {
    basePoints: challengeBasePoints,
    bonuses: [],
    total: 0,
  };

  // Difficulty multiplier
  const difficultyMultipliers = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    expert: 3.0,
  };
  
  const difficultyBonus = Math.round(challengeBasePoints * (difficultyMultipliers[difficulty] - 1));
  if (difficultyBonus > 0) {
    calc.bonuses.push({
      reason: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty`,
      points: difficultyBonus,
    });
  }

  // Speed bonus (if completed quickly)
  if (completionTime && completionTime < 30) {
    calc.bonuses.push({
      reason: 'Speed Completion',
      points: 25,
    });
  }

  calc.total = calc.basePoints + calc.bonuses.reduce((sum, bonus) => sum + bonus.points, 0);

  return calc;
}

/**
 * Calculate points for learning activities
 */
export function calculateLearningPoints(
  activityType: 'lesson' | 'quiz' | 'field_guide' | 'identification',
  quizScore?: number // 0-100
): number {
  const basePoints = {
    lesson: 20,
    quiz: 30,
    field_guide: 15,
    identification: 25,
  };

  let points = basePoints[activityType];

  // Quiz score bonus
  if (activityType === 'quiz' && quizScore !== undefined) {
    if (quizScore === 100) points += 20; // Perfect score
    else if (quizScore >= 90) points += 10; // Excellent
    else if (quizScore >= 80) points += 5; // Good
  }

  return points;
}

// ============================================================================
// Badge Checking System
// ============================================================================

export interface BadgeProgress {
  badgeId: string;
  currentProgress: number;
  required: number;
  percentage: number;
  isUnlocked: boolean;
}

/**
 * Check visit-based badge progress
 */
export function checkVisitBadges(
  totalVisits: number,
  uniqueLocations: number,
  locationsByCategory: Record<string, number>,
  visitsByCounty: Record<string, number>
): Record<string, BadgeProgress> {
  const progress: Record<string, BadgeProgress> = {};

  // Explorer badges (total unique locations)
  const explorerTiers = [
    { id: 'explorer_bronze', required: 5 },
    { id: 'explorer_silver', required: 10 },
    { id: 'explorer_gold', required: 25 },
    { id: 'explorer_platinum', required: 50 },
    { id: 'explorer_elite', required: 100 },
  ];

  explorerTiers.forEach(tier => {
    progress[tier.id] = {
      badgeId: tier.id,
      currentProgress: uniqueLocations,
      required: tier.required,
      percentage: Math.min(100, Math.round((uniqueLocations / tier.required) * 100)),
      isUnlocked: uniqueLocations >= tier.required,
    };
  });

  // Park Ranger badge (visit all state parks)
  progress['park_ranger'] = {
    badgeId: 'park_ranger',
    currentProgress: locationsByCategory.state_park || 0,
    required: 121, // Total PA state parks
    percentage: Math.round(((locationsByCategory.state_park || 0) / 121) * 100),
    isUnlocked: (locationsByCategory.state_park || 0) >= 121,
  };

  // County Collector badges (visit locations in X counties)
  const countyTiers = [
    { id: 'county_collector_bronze', required: 5 },
    { id: 'county_collector_silver', required: 10 },
    { id: 'county_collector_gold', required: 25 },
    { id: 'county_collector_platinum', required: 50 },
    { id: 'county_collector_elite', required: 67 }, // All PA counties
  ];

  const countiesVisited = Object.keys(visitsByCounty).length;
  countyTiers.forEach(tier => {
    progress[tier.id] = {
      badgeId: tier.id,
      currentProgress: countiesVisited,
      required: tier.required,
      percentage: Math.min(100, Math.round((countiesVisited / tier.required) * 100)),
      isUnlocked: countiesVisited >= tier.required,
    };
  });

  return progress;
}

/**
 * Check learning-based badge progress
 */
export function checkLearningBadges(
  lessonsCompleted: number,
  quizzesPassed: number,
  averageQuizScore: number,
  speciesIdentified: number
): Record<string, BadgeProgress> {
  const progress: Record<string, BadgeProgress> = {};

  // Scholar badges (lessons completed)
  const scholarTiers = [
    { id: 'scholar_bronze', required: 10 },
    { id: 'scholar_silver', required: 25 },
    { id: 'scholar_gold', required: 50 },
    { id: 'scholar_platinum', required: 100 },
  ];

  scholarTiers.forEach(tier => {
    progress[tier.id] = {
      badgeId: tier.id,
      currentProgress: lessonsCompleted,
      required: tier.required,
      percentage: Math.min(100, Math.round((lessonsCompleted / tier.required) * 100)),
      isUnlocked: lessonsCompleted >= tier.required,
    };
  });

  // Quiz Master (pass X quizzes with 90%+)
  const quizMasterTiers = [
    { id: 'quiz_master_bronze', required: 5 },
    { id: 'quiz_master_silver', required: 15 },
    { id: 'quiz_master_gold', required: 30 },
  ];

  const excellentQuizzes = averageQuizScore >= 90 ? quizzesPassed : 0;
  quizMasterTiers.forEach(tier => {
    progress[tier.id] = {
      badgeId: tier.id,
      currentProgress: excellentQuizzes,
      required: tier.required,
      percentage: Math.min(100, Math.round((excellentQuizzes / tier.required) * 100)),
      isUnlocked: excellentQuizzes >= tier.required,
    };
  });

  // Species Expert (identify X species)
  const speciesExpertTiers = [
    { id: 'species_expert_bronze', required: 25 },
    { id: 'species_expert_silver', required: 50 },
    { id: 'species_expert_gold', required: 100 },
    { id: 'species_expert_platinum', required: 250 },
  ];

  speciesExpertTiers.forEach(tier => {
    progress[tier.id] = {
      badgeId: tier.id,
      currentProgress: speciesIdentified,
      required: tier.required,
      percentage: Math.min(100, Math.round((speciesIdentified / tier.required) * 100)),
      isUnlocked: speciesIdentified >= tier.required,
    };
  });

  return progress;
}

// ============================================================================
// Achievement System
// ============================================================================

export interface AchievementCheck {
  achievementId: string;
  isUnlocked: boolean;
  progress: number;
  message?: string;
}

/**
 * Check for newly unlocked achievements after a visit
 */
export function checkVisitAchievements(
  visit: UserVisit,
  userStats: Partial<UserStats>
): AchievementCheck[] {
  const achievements: AchievementCheck[] = [];

  // First Visit Ever
  if (userStats.locationsVisited === 1) {
    achievements.push({
      achievementId: 'first_steps',
      isUnlocked: true,
      progress: 100,
      message: 'Completed your first location visit!',
    });
  }

  // Early Bird (check-in before 7am)
  const hour = new Date(visit.checkInTime).getHours();
  if (hour < 7) {
    achievements.push({
      achievementId: 'early_bird',
      isUnlocked: true,
      progress: 100,
      message: 'Checked in before 7am!',
    });
  }

  // Night Owl (check-in after 9pm)
  if (hour >= 21) {
    achievements.push({
      achievementId: 'night_owl',
      isUnlocked: true,
      progress: 100,
      message: 'Checked in after 9pm!',
    });
  }

  // Marathon (visit duration > 4 hours)
  if (visit.durationMinutes && visit.durationMinutes > 240) {
    achievements.push({
      achievementId: 'marathon_explorer',
      isUnlocked: true,
      progress: 100,
      message: 'Spent over 4 hours exploring!',
    });
  }

  // Photographer (submitted 10+ photos)
  if (visit.photosSubmitted.length >= 10) {
    achievements.push({
      achievementId: 'photographer',
      isUnlocked: true,
      progress: 100,
      message: 'Submitted 10+ photos in one visit!',
    });
  }

  return achievements.filter(a => a.isUnlocked);
}

// ============================================================================
// Leaderboard Calculations
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  score: number;
  previousRank?: number;
  rankChange?: number;
}

/**
 * Calculate weekly leaderboard rankings
 */
export function calculateWeeklyLeaderboard(
  users: Array<{
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    weeklyPoints: number;
  }>
): LeaderboardEntry[] {
  const sorted = users
    .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
    .map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      score: user.weeklyPoints,
    }));

  return sorted;
}

// ============================================================================
// Streak Management
// ============================================================================

/**
 * Check if streak should be maintained or broken
 */
export function checkStreak(
  lastActivityDate: Date,
  currentDate: Date = new Date()
): { isActive: boolean; daysSince: number } {
  const daysSince = Math.floor(
    (currentDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Streak continues if activity was today or yesterday
  const isActive = daysSince <= 1;

  return { isActive, daysSince };
}

/**
 * Calculate streak milestone rewards
 */
export function getStreakReward(streakDays: number): { points: number; badge?: string } | null {
  const milestones = [
    { days: 7, points: 100, badge: 'week_warrior' },
    { days: 30, points: 500, badge: 'month_master' },
    { days: 100, points: 2000, badge: 'century_champion' },
    { days: 365, points: 10000, badge: 'year_legend' },
  ];

  const milestone = milestones.find(m => m.days === streakDays);
  return milestone || null;
}

// ============================================================================
// Daily Quests & Streak Forecasting
// ============================================================================

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  type: 'exploration' | 'learning' | 'observation' | 'community';
  target: number;
  progress: number;
  rewardPoints: number;
}

const DAILY_QUEST_LIBRARY: Omit<DailyQuest, 'progress'>[] = [
  {
    id: 'daily-check-in',
    title: 'Field Check-in',
    description: 'Log a check-in at any approved field site.',
    type: 'exploration',
    target: 1,
    rewardPoints: 75,
  },
  {
    id: 'observation-journal',
    title: 'Observation Journal',
    description: 'Add a new wildlife or habitat observation.',
    type: 'observation',
    target: 1,
    rewardPoints: 60,
  },
  {
    id: 'lesson-sprint',
    title: 'Complete a Lesson',
    description: 'Finish any lesson plan or quiz.',
    type: 'learning',
    target: 1,
    rewardPoints: 90,
  },
  {
    id: 'species-spotter',
    title: 'Identify Species',
    description: 'Submit an AI identification or teacher-reviewed species.',
    type: 'observation',
    target: 1,
    rewardPoints: 80,
  },
  {
    id: 'team-cheer',
    title: 'Team Boost',
    description: 'Help a teammate or comment on class activity.',
    type: 'community',
    target: 1,
    rewardPoints: 40,
  },
]

export function generateDailyQuests(stats: Partial<UserStats>): DailyQuest[] {
  const quests: DailyQuest[] = []

  const today = new Date().toISOString().split('T')[0]
  const seedValue = Number(today.replace(/-/g, ''))

  const pickQuest = (offset: number) => {
    const index = (seedValue + offset) % DAILY_QUEST_LIBRARY.length
    const base = DAILY_QUEST_LIBRARY[index]
    return { ...base, progress: 0 }
  }

  // Always include check-in quest
  quests.push({
    ...DAILY_QUEST_LIBRARY[0],
    progress: 0,
  })

  // Add quest tailored to the student's weaker area
  if ((stats.lessonsCompleted ?? 0) < (stats.locationsVisited ?? 0)) {
    quests.push({
      ...DAILY_QUEST_LIBRARY.find((q) => q.id === 'lesson-sprint')!,
      progress: 0,
    })
  } else {
    quests.push({
      ...DAILY_QUEST_LIBRARY.find((q) => q.id === 'observation-journal')!,
      progress: 0,
    })
  }

  // Fill remaining slot with rotating quest
  let attempts = 1
  while (quests.length < 3 && attempts < DAILY_QUEST_LIBRARY.length) {
    const candidate = pickQuest(attempts)
    if (!quests.find((q) => q.id === candidate.id)) {
      quests.push(candidate)
    }
    attempts++
  }

  return quests
}

export function forecastStreakStatus(lastActivity: Date, currentDate: Date = new Date()) {
  const hoursSinceLastActivity = (currentDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)
  const hoursUntilStreakBreak = Math.max(0, 48 - hoursSinceLastActivity) // streak breaks after 48h gap

  return {
    shouldWarn: hoursUntilStreakBreak <= 12,
    hoursUntilStreakBreak,
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format points for display
 */
export function formatPoints(points: number): string {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M`;
  } else if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`;
  }
  return points.toString();
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };
  return colors[rarity] || colors.common;
}

