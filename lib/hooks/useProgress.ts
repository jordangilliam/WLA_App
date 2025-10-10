/**
 * Modern React hooks for progress management
 * Uses React 18 features for optimal UX
 */

'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import type { LessonProgress, QuizAttempt } from '@/lib/types/lesson.types';
import { getStorage, setStorage, onStorageChange } from '@/lib/utils/storage';

interface ProgressState {
  lessons: Record<string, LessonProgress>;
  isLoading: boolean;
  error: string | null;
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>({
    lessons: {},
    isLoading: true,
    error: null,
  });
  const [isPending, startTransition] = useTransition();

  // Load progress on mount
  useEffect(() => {
    try {
      const progress = getStorage('user-progress', {});
      setState({
        lessons: progress,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        lessons: {},
        isLoading: false,
        error: 'Failed to load progress',
      });
    }
  }, []);

  // Listen for cross-tab updates
  useEffect(() => {
    const unsubscribe = onStorageChange((key) => {
      if (key === 'wla-user-progress') {
        const progress = getStorage('user-progress', {});
        setState(prev => ({
          ...prev,
          lessons: progress,
        }));
      }
    });
    
    return unsubscribe;
  }, []);

  /**
   * Get progress for specific lesson
   */
  const getLessonProgress = useCallback((lessonId: string): LessonProgress | null => {
    return state.lessons[lessonId] || null;
  }, [state.lessons]);

  /**
   * Check if lesson is completed
   */
  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return state.lessons[lessonId]?.status === 'completed';
  }, [state.lessons]);

  /**
   * Start a lesson (track time)
   */
  const startLesson = useCallback((lessonId: string) => {
    startTransition(() => {
      setState(prev => {
        const existing = prev.lessons[lessonId];
        const updated = {
          ...prev.lessons,
          [lessonId]: {
            lessonId,
            status: 'in-progress' as const,
            startedAt: existing?.startedAt || Date.now(),
            timeSpent: existing?.timeSpent || 0,
            quizAttempts: existing?.quizAttempts || [],
            lastVisited: Date.now(),
            bookmarked: existing?.bookmarked || false,
          },
        };
        
        setStorage('user-progress', updated);
        return { ...prev, lessons: updated };
      });
    });
  }, []);

  /**
   * Update time spent on lesson
   */
  const updateTimeSpent = useCallback((lessonId: string, additionalTime: number) => {
    startTransition(() => {
      setState(prev => {
        const existing = prev.lessons[lessonId];
        if (!existing) return prev;
        
        const updated = {
          ...prev.lessons,
          [lessonId]: {
            ...existing,
            timeSpent: existing.timeSpent + additionalTime,
            lastVisited: Date.now(),
          },
        };
        
        setStorage('user-progress', updated);
        return { ...prev, lessons: updated };
      });
    });
  }, []);

  /**
   * Submit quiz attempt
   */
  const submitQuiz = useCallback((
    lessonId: string,
    answers: Record<string, number>,
    totalQuestions: number,
    correctCount: number,
    timeSpent: number
  ): { passed: boolean; percentage: number } => {
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;

    startTransition(() => {
      setState(prev => {
        const existing = prev.lessons[lessonId] || {
          lessonId,
          status: 'in-progress' as const,
          timeSpent: 0,
          quizAttempts: [],
          lastVisited: Date.now(),
          bookmarked: false,
        };

        const attempt: QuizAttempt = {
          attemptNumber: existing.quizAttempts.length + 1,
          answers,
          score: correctCount,
          percentage,
          passed,
          timestamp: Date.now(),
          timeSpent,
        };

        const updated = {
          ...prev.lessons,
          [lessonId]: {
            ...existing,
            status: passed ? ('completed' as const) : ('in-progress' as const),
            completedAt: passed ? Date.now() : existing.completedAt,
            quizAttempts: [...existing.quizAttempts, attempt],
            bestScore: Math.max(percentage, existing.bestScore || 0),
            lastVisited: Date.now(),
          },
        };

        setStorage('user-progress', updated);
        return { ...prev, lessons: updated };
      });
    });

    return { passed, percentage };
  }, []);

  /**
   * Mark lesson as completed (no quiz)
   */
  const completeLesson = useCallback((lessonId: string, timeSpent: number) => {
    startTransition(() => {
      setState(prev => {
        const existing = prev.lessons[lessonId];
        
        const updated = {
          ...prev.lessons,
          [lessonId]: {
            ...(existing || { lessonId, quizAttempts: [], bookmarked: false }),
            status: 'completed' as const,
            completedAt: Date.now(),
            timeSpent: (existing?.timeSpent || 0) + timeSpent,
            lastVisited: Date.now(),
          },
        };

        setStorage('user-progress', updated);
        return { ...prev, lessons: updated };
      });
    });
  }, []);

  /**
   * Toggle bookmark
   */
  const toggleBookmark = useCallback((lessonId: string) => {
    startTransition(() => {
      setState(prev => {
        const existing = prev.lessons[lessonId];
        if (!existing) return prev;

        const updated = {
          ...prev.lessons,
          [lessonId]: {
            ...existing,
            bookmarked: !existing.bookmarked,
          },
        };

        setStorage('user-progress', updated);
        return { ...prev, lessons: updated };
      });
    });
  }, []);

  /**
   * Add notes to lesson
   */
  const updateNotes = useCallback((lessonId: string, notes: string) => {
    startTransition(() => {
      setState(prev => {
        const existing = prev.lessons[lessonId];
        if (!existing) return prev;

        const updated = {
          ...prev.lessons,
          [lessonId]: {
            ...existing,
            notes,
          },
        };

        setStorage('user-progress', updated);
        return { ...prev, lessons: updated };
      });
    });
  }, []);

  /**
   * Get completion statistics
   */
  const getStats = useCallback(() => {
    const lessons = Object.values(state.lessons);
    const completed = lessons.filter(l => l.status === 'completed').length;
    const inProgress = lessons.filter(l => l.status === 'in-progress').length;
    const totalTime = lessons.reduce((sum, l) => sum + l.timeSpent, 0);
    const totalQuizzes = lessons.reduce((sum, l) => sum + l.quizAttempts.length, 0);
    const avgScore = lessons
      .filter(l => l.bestScore !== undefined)
      .reduce((sum, l, _, arr) => sum + (l.bestScore || 0) / arr.length, 0);

    return {
      completed,
      inProgress,
      totalTime,
      totalQuizzes,
      avgScore: Math.round(avgScore),
    };
  }, [state.lessons]);

  /**
   * Reset all progress
   */
  const resetProgress = useCallback(() => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      startTransition(() => {
        setStorage('user-progress', {});
        setState({
          lessons: {},
          isLoading: false,
          error: null,
        });
      });
    }
  }, []);

  return {
    progress: state.lessons,
    isLoading: state.isLoading,
    isPending,
    error: state.error,
    getLessonProgress,
    isLessonCompleted,
    startLesson,
    updateTimeSpent,
    submitQuiz,
    completeLesson,
    toggleBookmark,
    updateNotes,
    getStats,
    resetProgress,
  };
}

