/**
 * Core type definitions for the WLA Learning Platform
 * Using strict TypeScript with runtime validation
 */

// ===== LESSON TYPES =====

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
  hint?: string;
}

export interface Resource {
  label: string;
  url: string;
  type?: 'video' | 'article' | 'pdf' | 'interactive' | 'book' | 'course' | 'tool' | 'report';
}

export interface Lesson {
  id: string;
  slug: string; // URL-friendly version of ID
  track: Track;
  title: string;
  description: string;
  estimatedMinutes: number;
  content: string; // Markdown content
  quiz?: QuizQuestion[];
  resources?: Resource[];
  standards?: string[];
  prerequisites?: string[]; // Lesson IDs that should be completed first
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  objectives?: string[]; // Learning objectives
  createdAt?: string;
  updatedAt?: string;
}

// ===== TRACK TYPES =====

export type Track = 'Brookies' | 'Bass' | 'Bucktails' | 'Gobblers' | 'Ursids' | 'All';

export interface TrackInfo {
  id: Track;
  name: string;
  emoji: string;
  description: string;
  color: string;
  gradient: string;
}

// ===== PROGRESS TYPES =====

export interface QuizAttempt {
  attemptNumber: number;
  answers: Record<string, number>; // questionId -> selectedIndex
  score: number;
  percentage: number;
  passed: boolean;
  timestamp: number;
  timeSpent: number; // milliseconds
}

export interface LessonProgress {
  lessonId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: number;
  completedAt?: number;
  timeSpent: number; // Total milliseconds
  quizAttempts: QuizAttempt[];
  bestScore?: number;
  lastVisited: number;
  bookmarked: boolean;
  notes?: string;
}

export interface UserProgress {
  userId: string;
  lessons: Record<string, LessonProgress>; // lessonId -> progress
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActivity: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  soundEffects: boolean;
  defaultTrack?: Track;
  accessibilityMode: boolean;
}

// ===== POINTS & REWARDS =====

export interface PointsActivity {
  id: string;
  type: 'lesson-complete' | 'quiz-pass' | 'streak' | 'achievement' | 'bonus';
  description: string;
  points: number;
  timestamp: number;
  lessonId?: string;
  metadata?: Record<string, any>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: string;
  earned: boolean;
  earnedAt?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

// ===== STATISTICS =====

export interface Statistics {
  totalLessonsCompleted: number;
  totalQuizzesPassed: number;
  totalTimeSpent: number;
  averageQuizScore: number;
  strongestTrack?: Track;
  completionRate: number;
  pointsEarned: number;
  badgesEarned: number;
  currentLevel: number;
}

// ===== API RESPONSES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ===== VALIDATION TYPES =====

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

// ===== EXPORT TYPES =====

export interface ExportData {
  user: {
    name?: string;
    email?: string;
    team?: string;
  };
  progress: UserProgress;
  statistics: Statistics;
  exportedAt: number;
  version: string;
}

export type ExportFormat = 'json' | 'csv' | 'pdf';
export type ExportDestination = 'local' | 'google-drive' | 'onedrive' | 'email';

