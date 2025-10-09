// Progress tracking system for WLA Learning Platform

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  quizScore?: number;
  quizAttempts?: number;
  completedAt?: number;
  timeSpent?: number;
  startedAt?: number;
}

export interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  totalPoints: number;
  averageScore: number;
  trackProgress: Record<string, { completed: number; total: number }>;
}

// Get all progress data
export function getAllProgress(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem('wla-lesson-progress') || '{}';
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Get progress for specific lesson
export function getLessonProgress(lessonId: string): LessonProgress | null {
  const progress = getAllProgress();
  return progress[lessonId] || null;
}

// Mark lesson as started (track time)
export function startLesson(lessonId: string) {
  const progress = getAllProgress();
  if (!progress[lessonId]) {
    progress[lessonId] = {
      lessonId,
      completed: false,
      startedAt: Date.now()
    };
    localStorage.setItem('wla-lesson-progress', JSON.stringify(progress));
  }
}

// Mark lesson as completed (with validation)
export function completeLessonWithQuiz(
  lessonId: string, 
  score: number, 
  totalQuestions: number,
  timeSpent: number
): { success: boolean; message: string } {
  const percentage = Math.round((score / totalQuestions) * 100);
  const PASSING_SCORE = 70;
  
  if (percentage < PASSING_SCORE) {
    return {
      success: false,
      message: `You scored ${percentage}%. You need ${PASSING_SCORE}% to pass. Review the lesson and try again!`
    };
  }

  const progress = getAllProgress();
  const existing = progress[lessonId] || { lessonId, quizAttempts: 0 };
  
  progress[lessonId] = {
    ...existing,
    completed: true,
    quizScore: percentage,
    quizAttempts: (existing.quizAttempts || 0) + 1,
    completedAt: Date.now(),
    timeSpent
  };
  
  localStorage.setItem('wla-lesson-progress', JSON.stringify(progress));
  window.dispatchEvent(new Event('progress-updated'));
  
  return {
    success: true,
    message: `Excellent! ${percentage}% - Lesson completed!`
  };
}

// Complete lesson without quiz (requires minimum time)
export function completeLessonNoQuiz(
  lessonId: string,
  timeSpent: number,
  minTimeRequired: number
): { success: boolean; message: string } {
  if (timeSpent < minTimeRequired) {
    const remaining = Math.ceil((minTimeRequired - timeSpent) / 60);
    return {
      success: false,
      message: `Please spend at least ${remaining} more minute(s) reviewing the lesson content.`
    };
  }

  const progress = getAllProgress();
  
  progress[lessonId] = {
    lessonId,
    completed: true,
    completedAt: Date.now(),
    timeSpent
  };
  
  localStorage.setItem('wla-lesson-progress', JSON.stringify(progress));
  window.dispatchEvent(new Event('progress-updated'));
  
  return {
    success: true,
    message: 'Lesson completed!'
  };
}

// Check if lesson is completed
export function isLessonCompleted(lessonId: string): boolean {
  const progress = getLessonProgress(lessonId);
  return progress?.completed || false;
}

// Get completion percentage for a track
export function getTrackProgress(track: string, allLessons: any[]): number {
  const trackLessons = allLessons.filter(l => l.track === track);
  const completed = trackLessons.filter(l => isLessonCompleted(l.id)).length;
  return Math.round((completed / trackLessons.length) * 100);
}

// Get overall statistics
export function getProgressStats(allLessons: any[]): ProgressStats {
  const progress = getAllProgress();
  const completedLessons = Object.values(progress).filter(p => p.completed).length;
  
  // Calculate points from localStorage
  const pointsRaw = localStorage.getItem('wla-points') || '[]';
  const points = JSON.parse(pointsRaw);
  const totalPoints = points.reduce((sum: number, p: any) => sum + (p.delta || 0), 0);
  
  // Calculate average score
  const scores = Object.values(progress)
    .filter(p => p.completed && p.quizScore)
    .map(p => p.quizScore as number);
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  
  // Track progress
  const tracks = Array.from(new Set(allLessons.map(l => l.track)));
  const trackProgress: Record<string, { completed: number; total: number }> = {};
  
  tracks.forEach(track => {
    const trackLessons = allLessons.filter(l => l.track === track);
    const completed = trackLessons.filter(l => isLessonCompleted(l.id)).length;
    trackProgress[track] = {
      completed,
      total: trackLessons.length
    };
  });
  
  return {
    totalLessons: allLessons.length,
    completedLessons,
    totalPoints,
    averageScore,
    trackProgress
  };
}

// Reset progress (for testing)
export function resetProgress() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
    localStorage.removeItem('wla-lesson-progress');
    window.dispatchEvent(new Event('progress-updated'));
  }
}

// Export progress data
export function exportProgressCSV(allLessons: any[]): string {
  const progress = getAllProgress();
  let csv = 'Lesson ID,Track,Title,Completed,Score,Attempts,Time Spent (min),Date Completed\n';
  
  allLessons.forEach(lesson => {
    const prog = progress[lesson.id];
    csv += `"${lesson.id}","${lesson.track}","${lesson.title}",`;
    csv += `${prog?.completed ? 'Yes' : 'No'},`;
    csv += `${prog?.quizScore || 'N/A'},`;
    csv += `${prog?.quizAttempts || 0},`;
    csv += `${prog?.timeSpent ? Math.round(prog.timeSpent / 60000) : 'N/A'},`;
    csv += `${prog?.completedAt ? new Date(prog.completedAt).toLocaleDateString() : 'N/A'}\n`;
  });
  
  return csv;
}

// Download progress as CSV
export function downloadProgressCSV(allLessons: any[]) {
  const csv = exportProgressCSV(allLessons);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wla-progress-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

