/**
 * Advanced Gamification Types
 * Multi-dimensional reward and progression systems
 */

// ============================================================================
// User Profile & Progression
// ============================================================================

export type UserRole = 'student' | 'educator' | 'parent' | 'admin' | 'partner';
export type AmbassadorLevel = 'novice' | 'apprentice' | 'ambassador' | 'expert' | 'master' | 'legend';

export interface UserProfile {
  id: string;
  role: UserRole;
  
  // Basic info
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  age?: number;
  schoolOrOrganization?: string;
  
  // Progression
  level: number;
  experience: number;
  experienceToNextLevel: number;
  ambassadorLevel: AmbassadorLevel;
  
  // Points & Currency
  totalPoints: number;
  availablePoints: number; // after redemptions
  lifetimePoints: number;
  
  // Stats
  stats: UserStats;
  
  // Preferences
  preferences: UserPreferences;
  
  // Achievements summary
  totalBadges: number;
  totalLocationsVisited: number;
  totalChallengesCompleted: number;
  totalObservations: number;
  
  // Social
  friends: string[];
  teamId?: string;
  mentorId?: string;
  mentees: string[];
  
  // Privacy
  isProfilePublic: boolean;
  shareLocation: boolean;
  
  // Timestamps
  joinedAt: Date;
  lastActiveAt: Date;
}

export interface UserStats {
  // Exploration
  locationsVisited: number;
  uniqueLocations: number;
  totalDistance: number; // kilometers
  favoriteLocation?: string;
  rarestLocationVisited?: string;
  
  // Learning
  lessonsCompleted: number;
  quizzesPassed: number;
  averageQuizScore: number;
  learningStreak: number; // consecutive days
  longestStreak: number;
  
  // Engagement
  challengesCompleted: number;
  achievementsUnlocked: number;
  badgesEarned: number;
  rewardsRedeemed: number;
  
  // Contribution
  observationsSubmitted: number;
  photosShared: number;
  dataPointsCollected: number;
  peerHelps: number; // helping others identify species, etc.
  
  // Social
  friendCount: number;
  teamChallengesCompleted: number;
  communityContributions: number;
  
  // Conservation impact
  habitatsExplored: number;
  speciesIdentified: number;
  conservationActionsCompleted: number;
  
  // Time-based
  totalTimeInApp: number; // minutes
  totalTimeInField: number; // minutes
  averageSessionDuration: number; // minutes
}

export interface UserPreferences {
  // Notifications
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  nearbyOpportunitiesRadius: number; // kilometers
  notifyOnNewChallenges: boolean;
  notifyOnFriendActivity: boolean;
  
  // Privacy
  profileVisibility: 'public' | 'friends' | 'private';
  locationSharing: 'always' | 'while_using' | 'never';
  showOnLeaderboard: boolean;
  
  // Accessibility
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
  
  // Content
  interests: string[]; // habitats, species, activities
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  difficultyPreference: 'adaptive' | 'easy' | 'medium' | 'hard';
  
  // App behavior
  offlineMode: boolean;
  autoDownloadMaps: boolean;
  batteryOptimization: boolean;
  dataUsageLimit: 'unlimited' | 'wifi_only' | 'minimal';
}

// ============================================================================
// Achievement System
// ============================================================================

export type AchievementCategory = 
  | 'exploration'
  | 'learning'
  | 'social'
  | 'contribution'
  | 'mastery'
  | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  
  // Requirements
  requirements: {
    type: string;
    target: number;
    current?: number;
  }[];
  
  // Rewards
  experienceReward: number;
  pointsReward: number;
  badgeReward?: string;
  unlocksFeature?: string;
  
  // Progression
  hasTiers: boolean;
  currentTier?: number;
  totalTiers?: number;
  
  // Display
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isSecret: boolean; // hidden until unlocked
  
  // Stats
  unlockedByCount: number;
  unlockedByPercentage: number;
  averageTimeToUnlock?: number; // days
  
  // Status
  isActive: boolean;
  isRepeatable: boolean;
  
  // Timestamps
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  
  // Progress
  unlockedAt?: Date;
  progress: number; // 0-100
  currentTier?: number;
  
  // Display
  isNew: boolean;
  viewedAt?: Date;
  isPinned: boolean;
}

// ============================================================================
// Leaderboard System
// ============================================================================

export type LeaderboardType = 
  | 'global'
  | 'regional'
  | 'school'
  | 'team'
  | 'friends'
  | 'age_group';

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time' | 'seasonal';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  
  // Scores
  score: number;
  previousRank?: number;
  rankChange?: number;
  
  // Additional stats
  badges?: number;
  locations?: number;
  challenges?: number;
  
  // Display
  highlight?: boolean; // for current user
}

export interface Leaderboard {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  
  // Metadata
  totalParticipants: number;
  lastUpdated: Date;
  nextUpdateAt: Date;
  
  // Filtering
  region?: string;
  schoolId?: string;
  teamId?: string;
  ageGroup?: string;
}

// ============================================================================
// Streak System
// ============================================================================

export interface Streak {
  userId: string;
  
  // Current streak
  currentStreak: number;
  currentStreakStart: Date;
  currentStreakType: 'learning' | 'visiting' | 'contributing';
  
  // Best streak
  longestStreak: number;
  longestStreakStart?: Date;
  longestStreakEnd?: Date;
  
  // Streak protection
  hasStreakFreeze: boolean;
  streakFreezeCount: number;
  
  // Last activity
  lastActivityDate: Date;
  lastActivityType: string;
  
  // Rewards
  streakMilestones: number[];
  nextMilestone: number;
  nextMilestoneReward: string;
}

// ============================================================================
// Team System
// ============================================================================

export interface Team {
  id: string;
  name: string;
  description: string;
  motto?: string;
  
  // Leadership
  captainId: string;
  coCaptains: string[];
  
  // Members
  members: string[];
  maxMembers: number;
  inviteCode?: string;
  isPublic: boolean;
  
  // Stats
  totalPoints: number;
  totalLocationsVisited: number;
  totalChallengesCompleted: number;
  teamLevel: number;
  
  // Competition
  regionalRank?: number;
  stateRank?: number;
  
  // Appearance
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  
  // Challenges
  activeTeamChallenges: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Quest System (Multi-step Challenges)
// ============================================================================

export type QuestStatus = 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired';

export interface QuestStep {
  id: string;
  order: number;
  name: string;
  description: string;
  requirements: any[];
  isCompleted: boolean;
  completedAt?: Date;
  pointsReward: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  storyline?: string; // narrative element
  
  // Steps
  steps: QuestStep[];
  currentStep: number;
  totalSteps: number;
  
  // Requirements
  requiredLevel?: number;
  requiredBadges?: string[];
  prerequisiteQuests?: string[];
  
  // Rewards
  experienceReward: number;
  pointsReward: number;
  badgeReward?: string;
  specialReward?: string;
  
  // Timing
  estimatedDuration?: number; // minutes
  startDate?: Date;
  deadline?: Date;
  
  // Status
  isActive: boolean;
  isRepeatable: boolean;
  repeatCooldown?: number; // days
  
  // Difficulty
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  recommendedForLevel?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  
  // Progress
  status: QuestStatus;
  currentStepId: string;
  completedSteps: string[];
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  
  // Progress tracking
  progressPercentage: number;
  timeSpent?: number; // minutes
}

// ============================================================================
// Daily/Weekly Missions
// ============================================================================

export interface DailyMission {
  id: string;
  date: Date;
  
  // Missions (3 per day typically)
  missions: {
    id: string;
    description: string;
    type: string;
    target: number;
    current: number;
    pointsReward: number;
    isCompleted: boolean;
  }[];
  
  // Bonus
  bonusReward?: {
    description: string;
    pointsReward: number;
    requiresAll: boolean;
  };
  
  // Status
  completedCount: number;
  totalMissions: number;
  isFullyCompleted: boolean;
}

// ============================================================================
// Level System
// ============================================================================

export interface LevelInfo {
  level: number;
  title: string;
  requiredExperience: number;
  rewards: {
    points?: number;
    badge?: string;
    unlockFeature?: string;
    special?: string;
  };
}

export const LEVEL_SYSTEM: LevelInfo[] = [
  { level: 1, title: "Curious Explorer", requiredExperience: 0, rewards: {} },
  { level: 2, title: "Nature Observer", requiredExperience: 100, rewards: { points: 50 } },
  { level: 3, title: "Field Investigator", requiredExperience: 250, rewards: { points: 75 } },
  { level: 4, title: "Wildlife Scout", requiredExperience: 500, rewards: { points: 100, unlockFeature: "photo_identification" } },
  { level: 5, title: "Conservation Apprentice", requiredExperience: 1000, rewards: { points: 150, badge: "apprentice" } },
  { level: 10, title: "Nature Ambassador", requiredExperience: 5000, rewards: { points: 500, badge: "ambassador" } },
  { level: 15, title: "Conservation Expert", requiredExperience: 12000, rewards: { points: 1000, unlockFeature: "mentor_mode" } },
  { level: 20, title: "Master Naturalist", requiredExperience: 25000, rewards: { points: 2000, badge: "master", special: "custom_avatar" } },
];

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType = 
  | 'achievement_unlocked'
  | 'badge_earned'
  | 'level_up'
  | 'challenge_complete'
  | 'new_reward'
  | 'nearby_location'
  | 'friend_activity'
  | 'team_update'
  | 'event_reminder'
  | 'daily_mission';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  
  // Content
  title: string;
  message: string;
  icon?: string;
  
  // Action
  actionUrl?: string;
  actionLabel?: string;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Timing
  createdAt: Date;
  expiresAt?: Date;
}

