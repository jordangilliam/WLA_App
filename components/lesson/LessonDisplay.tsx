/**
 * Complete lesson display with content, quiz, and progress tracking
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import type { Lesson } from '@/lib/types/lesson.types';
import { MarkdownContent } from './MarkdownContent';
import { QuizComponent } from '../quiz/QuizComponent';
import { useProgress } from '@/lib/hooks/useProgress';
import { usePoints } from '@/ui/points/PointsProvider';

interface LessonDisplayProps {
  lesson: Lesson;
  trackColor: string;
}

export function LessonDisplay({ lesson, trackColor }: LessonDisplayProps) {
  const { 
    getLessonProgress, 
    isLessonCompleted,
    startLesson, 
    updateTimeSpent,
    submitQuiz,
    completeLesson,
    toggleBookmark,
  } = useProgress();
  
  const { award } = usePoints();
  const [startTime] = useState(Date.now());
  const [showQuiz, setShowQuiz] = useState(false);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  const progress = getLessonProgress(lesson.id);
  const completed = isLessonCompleted(lesson.id);

  // Start tracking lesson
  useEffect(() => {
    startLesson(lesson.id);

    // Update time spent every 30 seconds
    timeUpdateInterval.current = setInterval(() => {
      updateTimeSpent(lesson.id, 30000);
    }, 30000);

    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
      // Final time update
      const finalTime = Date.now() - startTime;
      updateTimeSpent(lesson.id, finalTime % 30000);
    };
  }, [lesson.id, startLesson, updateTimeSpent, startTime]);

  // Check minimum time requirement (50% of estimated time)
  useEffect(() => {
    const minTime = lesson.estimatedMinutes * 0.5 * 60 * 1000;
    const timer = setTimeout(() => {
      setMinTimeReached(true);
    }, minTime);

    return () => clearTimeout(timer);
  }, [lesson.estimatedMinutes]);

  const handleQuizComplete = (score: number, percentage: number, passed: boolean) => {
    const timeSpent = Date.now() - startTime;
    const result = submitQuiz(lesson.id, {}, lesson.quiz?.length || 0, score, timeSpent);

    if (passed) {
      // Award points based on score
      const points = Math.round((percentage / 100) * 10);
      award(points, `Quiz: ${lesson.title}`);
    }
  };

  const handleCompleteNoQuiz = () => {
    if (!minTimeReached) {
      alert(`Please spend at least ${Math.ceil(lesson.estimatedMinutes * 0.5)} more minutes reviewing the content.`);
      return;
    }

    const timeSpent = Date.now() - startTime;
    completeLesson(lesson.id, timeSpent);
    award(5, `Completed: ${lesson.title}`);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Lesson Header */}
      <div 
        style={{
          background: `linear-gradient(135deg, ${trackColor}, ${trackColor}dd)`,
          color: 'white',
          padding: '2.5rem 2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}>
            <span style={{
              padding: '0.375rem 0.875rem',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}>
              {lesson.track}
            </span>
            
            {completed && (
              <span style={{
                padding: '0.375rem 0.875rem',
                background: '#10B981',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}>
                ✓ Completed
              </span>
            )}

            {lesson.difficulty && (
              <span style={{
                padding: '0.375rem 0.875rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}>
                {lesson.difficulty}
              </span>
            )}
          </div>

          <h1 style={{ 
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 800,
            margin: '0 0 1rem 0',
            lineHeight: 1.2,
          }}>
            {lesson.title}
          </h1>

          <p style={{ 
            fontSize: '1.125rem',
            margin: '0 0 1.5rem 0',
            opacity: 0.95,
            lineHeight: 1.6,
          }}>
            {lesson.description}
          </p>

          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            fontSize: '0.9rem',
            opacity: 0.9,
            flexWrap: 'wrap',
          }}>
            <span>⏱️ {lesson.estimatedMinutes} minutes</span>
            {lesson.quiz && <span>✅ {lesson.quiz.length} quiz questions</span>}
            {lesson.resources && <span>📚 {lesson.resources.length} resources</span>}
            
            <button
              onClick={() => toggleBookmark(lesson.id)}
              style={{
                marginLeft: 'auto',
                background: progress?.bookmarked ? 'rgba(255,255,255,0.3)' : 'transparent',
                border: '2px solid rgba(255,255,255,0.5)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.borderColor = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = progress?.bookmarked ? 'rgba(255,255,255,0.3)' : 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
            >
              {progress?.bookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
            </button>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <div style={{
          background: '#F0F9FF',
          border: '2px solid #BAE6FD',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#0369A1',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            🎯 Learning Objectives
          </h3>
          <ul style={{ 
            margin: 0,
            paddingLeft: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            {lesson.objectives.map((obj, idx) => (
              <li key={idx} style={{ lineHeight: 1.6, color: '#075985' }}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        background: 'white',
        border: '2px solid #E5E7EB',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <MarkdownContent content={lesson.content} />
      </div>

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div style={{
          background: '#FEF3C7',
          border: '2px solid #FDE68A',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#92400E',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            📚 Additional Resources
          </h3>
          <ul style={{ 
            margin: 0,
            paddingLeft: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {lesson.resources.map((resource, idx) => (
              <li key={idx}>
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#D97706',
                    textDecoration: 'underline',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {resource.type === 'video' && '🎥'}
                  {resource.type === 'article' && '📄'}
                  {resource.type === 'pdf' && '📑'}
                  {resource.type === 'interactive' && '🎮'}
                  {!resource.type && '🔗'}
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Standards */}
      {lesson.standards && lesson.standards.length > 0 && (
        <div style={{
          background: '#F5F3FF',
          border: '2px solid #DDD6FE',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          fontSize: '0.9rem',
        }}>
          <h4 style={{ 
            fontSize: '1rem',
            fontWeight: 700,
            color: '#6B21A8',
            marginBottom: '0.75rem',
          }}>
            📋 Academic Standards
          </h4>
          <p style={{ margin: 0, color: '#7C3AED', lineHeight: 1.6 }}>
            {lesson.standards.join(' • ')}
          </p>
        </div>
      )}

      {/* Quiz or Completion */}
      {!completed && (
        <>
          {lesson.quiz && lesson.quiz.length > 0 ? (
            !showQuiz ? (
              <button
                onClick={() => setShowQuiz(true)}
                style={{
                  width: '100%',
                  padding: '1.25rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                ✅ Take the Quiz
              </button>
            ) : (
              <QuizComponent
                questions={lesson.quiz}
                lessonId={lesson.id}
                onComplete={handleQuizComplete}
              />
            )
          ) : (
            <div style={{ textAlign: 'center' }}>
              {!minTimeReached && (
                <p style={{ 
                  color: '#6B7280',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                }}>
                  Please finish reading the lesson to mark it complete...
                </p>
              )}
              <button
                onClick={handleCompleteNoQuiz}
                disabled={!minTimeReached}
                style={{
                  padding: '1.25rem 3rem',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: minTimeReached 
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : '#E5E7EB',
                  color: minTimeReached ? 'white' : '#9CA3AF',
                  border: 'none',
                  cursor: minTimeReached ? 'pointer' : 'not-allowed',
                  transition: 'transform 0.2s',
                  boxShadow: minTimeReached ? '0 4px 16px rgba(16, 185, 129, 0.3)' : 'none',
                }}
                onMouseOver={(e) => {
                  if (minTimeReached) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {minTimeReached ? '✓ Mark Complete (+5 pts)' : '⏱️ Keep Reading...'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Progress Summary */}
      {progress && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#F9FAFB',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#6B7280',
        }}>
          {progress.bestScore && (
            <p style={{ margin: '0 0 0.5rem 0' }}>
              <strong>Best Quiz Score:</strong> {progress.bestScore}%
            </p>
          )}
          {progress.quizAttempts.length > 0 && (
            <p style={{ margin: 0 }}>
              <strong>Quiz Attempts:</strong> {progress.quizAttempts.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

