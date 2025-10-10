// Central export for all lesson data
import { Lesson } from '../types/lesson.types';
import { terrestrialLessons } from './lessons-terrestrial';
import { aquaticLessons } from './lessons-aquatic';
import { crossCuttingLessons } from './lessons-cross-cutting';

// Combine all lessons into a single array
export const allLessons: Lesson[] = [
  ...terrestrialLessons,
  ...aquaticLessons,
  ...crossCuttingLessons,
];

// Export by track for filtered views
export const lessonsByTrack = {
  Bucktails: allLessons.filter((l) => l.track === 'Bucktails'),
  Gobblers: allLessons.filter((l) => l.track === 'Gobblers'),
  Brookies: allLessons.filter((l) => l.track === 'Brookies'),
  Bass: allLessons.filter((l) => l.track === 'Bass'),
};

// Export individual collections
export { terrestrialLessons } from './lessons-terrestrial';
export { aquaticLessons } from './lessons-aquatic';
export { crossCuttingLessons } from './lessons-cross-cutting';

// Helper functions
export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find((lesson) => lesson.id === id);
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getLessonsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Lesson[] {
  return allLessons.filter((lesson) => lesson.difficulty === difficulty);
}

export function searchLessons(query: string): Lesson[] {
  const lowerQuery = query.toLowerCase();
  return allLessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(lowerQuery) ||
      lesson.description.toLowerCase().includes(lowerQuery) ||
      lesson.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

