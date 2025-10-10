/**
 * Modern lesson card component
 * Features: Hover effects, progress indicators, accessibility
 */

'use client';

import Link from 'next/link';
import type { Lesson } from '@/lib/types/lesson.types';
import { useProgress } from '@/lib/hooks/useProgress';

interface LessonCardProps {
  lesson: Lesson;
  trackColor: string;
  index: number;
}

export function LessonCard({ lesson, trackColor, index }: LessonCardProps) {
  const { getLessonProgress, isLessonCompleted } = useProgress();
  const progress = getLessonProgress(lesson.id);
  const completed = isLessonCompleted(lesson.id);
  
  const percentage = progress?.bestScore || 0;
  const attempts = progress?.quizAttempts.length || 0;

  return (
    <Link 
      href={`/learn/${lesson.slug}`}
      className="lesson-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem',
        background: completed ? '#F0FDF4' : '#FFFFFF',
        border: `2px solid ${completed ? '#86EFAC' : '#E5E7EB'}`,
        borderRadius: '12px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = trackColor;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = completed ? '#86EFAC' : '#E5E7EB';
      }}
    >
      {/* Progress bar at top */}
      {progress && !completed && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#E5E7EB',
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: trackColor,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Number or checkmark */}
      <div 
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: completed ? '#22C55E' : trackColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.25rem',
          flexShrink: 0,
          boxShadow: completed ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none',
        }}
      >
        {completed ? '✓' : index + 1}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
          }}>
            {lesson.title}
          </h3>
          
          {lesson.difficulty && (
            <span style={{
              padding: '0.25rem 0.625rem',
              background: lesson.difficulty === 'beginner' ? '#DBEAFE' :
                         lesson.difficulty === 'intermediate' ? '#FEF3C7' : '#FEE2E2',
              color: lesson.difficulty === 'beginner' ? '#1E40AF' :
                     lesson.difficulty === 'intermediate' ? '#92400E' : '#991B1B',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}>
              {lesson.difficulty}
            </span>
          )}
        </div>

        <p style={{ 
          margin: '0 0 0.75rem 0',
          color: '#6B7280',
          fontSize: '0.9rem',
          lineHeight: 1.5,
        }}>
          {lesson.description}
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem',
          fontSize: '0.875rem',
          color: '#9CA3AF',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            ⏱️ {lesson.estimatedMinutes} min
          </span>
          
          {lesson.quiz && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              ✅ {lesson.quiz.length} questions
            </span>
          )}
          
          {progress && attempts > 0 && (
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.375rem',
              color: completed ? '#22C55E' : '#F59E0B',
              fontWeight: 600,
            }}>
              {completed ? '✓ Completed' : `Best: ${percentage}%`}
            </span>
          )}

          {progress?.bookmarked && (
            <span>🔖 Bookmarked</span>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <div style={{ 
        color: '#9CA3AF',
        fontSize: '1.5rem',
        flexShrink: 0,
      }}>
        →
      </div>
    </Link>
  );
}

