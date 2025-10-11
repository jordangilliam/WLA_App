/**
 * Runtime validation schemas using Zod
 * Ensures data integrity at runtime, not just compile time
 */

import { z } from 'zod';

// ===== QUIZ VALIDATION =====

export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  choices: z.array(z.string()).min(2).max(6),
  correctIndex: z.number().int().min(0),
  explanation: z.string().optional(),
  hint: z.string().optional(),
});

// ===== LESSON VALIDATION =====

export const LessonSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/), // URL-safe
  track: z.enum(['Brookies', 'Bass', 'Bucktails', 'Gobblers', 'Ursids', 'All']),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  estimatedMinutes: z.number().int().positive().max(180),
  content: z.string().min(10),
  quiz: z.array(QuizQuestionSchema).optional(),
  resources: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
    type: z.enum(['video', 'article', 'pdf', 'interactive']).optional(),
  })).optional(),
  standards: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// ===== PROGRESS VALIDATION =====

export const LessonProgressSchema = z.object({
  lessonId: z.string(),
  status: z.enum(['not-started', 'in-progress', 'completed']),
  startedAt: z.number().optional(),
  completedAt: z.number().optional(),
  timeSpent: z.number().int().nonnegative(),
  quizAttempts: z.array(z.object({
    attemptNumber: z.number().int().positive(),
    answers: z.record(z.number()),
    score: z.number().int().nonnegative(),
    percentage: z.number().min(0).max(100),
    passed: z.boolean(),
    timestamp: z.number(),
    timeSpent: z.number().int().nonnegative(),
  })),
  bestScore: z.number().int().nonnegative().optional(),
  lastVisited: z.number(),
  bookmarked: z.boolean(),
  notes: z.string().optional(),
});

// ===== HELPER FUNCTIONS =====

/**
 * Safely parse and validate lesson data
 */
export function validateLesson(data: unknown) {
  try {
    return {
      success: true as const,
      data: LessonSchema.parse(data),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return {
      success: false as const,
      errors: ['Unknown validation error'],
    };
  }
}

/**
 * Safely parse and validate progress data
 */
export function validateProgress(data: unknown) {
  try {
    return {
      success: true as const,
      data: LessonProgressSchema.parse(data),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return {
      success: false as const,
      errors: ['Unknown validation error'],
    };
  }
}

