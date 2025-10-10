/**
 * Interactive quiz component with validation
 * Features: Step-by-step, instant feedback, retry mechanism
 */

'use client';

import { useState, useEffect } from 'react';
import type { QuizQuestion } from '@/lib/types/lesson.types';

interface QuizComponentProps {
  questions: QuizQuestion[];
  lessonId: string;
  onComplete: (score: number, percentage: number, passed: boolean) => void;
  minPassingScore?: number;
}

export function QuizComponent({ 
  questions, 
  lessonId,
  onComplete,
  minPassingScore = 70 
}: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());

  const isQuizComplete = Object.keys(answers).length === questions.length;
  const correctCount = questions.filter(q => answers[q.id] === q.correctIndex).length;
  const percentage = Math.round((correctCount / questions.length) * 100);
  const passed = percentage >= minPassingScore;

  const handleAnswer = (questionId: string, choiceIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: choiceIndex }));
    
    // Auto-advance to next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    }
  };

  const handleSubmit = () => {
    const timeSpent = Date.now() - startTime;
    setShowResults(true);
    onComplete(correctCount, percentage, passed);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div style={{ 
        background: 'white',
        border: '2px solid #E5E7EB',
        borderRadius: '16px',
        padding: '2rem',
        marginTop: '2rem',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: passed 
              ? 'linear-gradient(135deg, #10B981, #059669)' 
              : 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white',
            boxShadow: passed 
              ? '0 8px 24px rgba(16, 185, 129, 0.3)'
              : '0 8px 24px rgba(245, 158, 11, 0.3)',
          }}>
            {passed ? '✓' : '!'}
          </div>

          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: 800,
            color: '#111827',
            marginBottom: '0.5rem',
          }}>
            {passed ? 'Congratulations! 🎉' : 'Almost There! 💪'}
          </h2>

          <div style={{
            fontSize: '3rem',
            fontWeight: 800,
            background: passed 
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'linear-gradient(135deg, #F59E0B, #D97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}>
            {percentage}%
          </div>

          <p style={{
            fontSize: '1.125rem',
            color: '#6B7280',
            marginBottom: '2rem',
          }}>
            You got {correctCount} out of {questions.length} questions correct
            {!passed && ` (need ${minPassingScore}% to pass)`}
          </p>
        </div>

        {/* Detailed Results */}
        <div style={{
          background: '#F9FAFB',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{ 
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: '#111827',
          }}>
            Question Review
          </h3>

          {questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div 
                key={q.id}
                style={{
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: idx < questions.length - 1 ? '1px solid #E5E7EB' : 'none',
                }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'start',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCorrect ? '#10B981' : '#EF4444',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontWeight: 600,
                      color: '#111827',
                      marginBottom: '0.5rem',
                    }}>
                      {q.prompt}
                    </p>

                    {!isCorrect && (
                      <div>
                        <p style={{ 
                          color: '#DC2626',
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem',
                        }}>
                          Your answer: {q.choices[userAnswer]}
                        </p>
                        <p style={{ 
                          color: '#10B981',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}>
                          Correct answer: {q.choices[q.correctIndex]}
                        </p>
                      </div>
                    )}

                    {q.explanation && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#6B7280',
                        borderLeft: `3px solid ${isCorrect ? '#10B981' : '#3B82F6'}`,
                      }}>
                        <strong>💡 </strong>{q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
        }}>
          {!passed && (
            <button
              onClick={handleRetry}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🔄 Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.href = '/learn'}
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '10px',
              background: passed 
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : '#6B7280',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: passed 
                ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                : '0 4px 12px rgba(107, 114, 128, 0.3)',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {passed ? '✓ Continue Learning' : '← Back to Lessons'}
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const hasAnsweredCurrent = answers[question.id] !== undefined;

  return (
    <div style={{
      background: 'white',
      border: '2px solid #E5E7EB',
      borderRadius: '16px',
      padding: '2rem',
      marginTop: '2rem',
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <span style={{ 
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#6B7280',
          }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span style={{ 
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#10B981',
          }}>
            {Object.keys(answers).length} answered
          </span>
        </div>
        
        <div style={{
          height: '8px',
          background: '#F3F4F6',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(Object.keys(answers).length / questions.length) * 100}%`,
            background: 'linear-gradient(90deg, #10B981, #059669)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#111827',
          marginBottom: '1.5rem',
          lineHeight: 1.4,
        }}>
          {question.prompt}
        </h3>

        {question.hint && (
          <div style={{
            padding: '1rem',
            background: '#FEF3C7',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#92400E',
            marginBottom: '1.5rem',
            borderLeft: '4px solid #F59E0B',
          }}>
            <strong>💡 Hint:</strong> {question.hint}
          </div>
        )}

        {/* Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.choices.map((choice, idx) => {
            const isSelected = answers[question.id] === idx;
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(question.id, idx)}
                style={{
                  padding: '1.25rem',
                  textAlign: 'left',
                  background: isSelected ? '#DBEAFE' : 'white',
                  border: `2px solid ${isSelected ? '#3B82F6' : '#E5E7EB'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: '#111827',
                  transition: 'all 0.2s',
                  fontWeight: isSelected ? 600 : 400,
                }}
                onMouseOver={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#3B82F6';
                    e.currentTarget.style.background = '#F0F9FF';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#3B82F6' : '#D1D5DB'}`,
                    background: isSelected ? '#3B82F6' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isSelected && (
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'white',
                      }} />
                    )}
                  </div>
                  <span>{choice}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #E5E7EB',
      }}>
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            borderRadius: '8px',
            background: currentQuestion === 0 ? '#F3F4F6' : 'white',
            color: currentQuestion === 0 ? '#9CA3AF' : '#374151',
            border: '2px solid #E5E7EB',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ← Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isQuizComplete}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '8px',
              background: isQuizComplete 
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : '#F3F4F6',
              color: isQuizComplete ? 'white' : '#9CA3AF',
              border: 'none',
              cursor: isQuizComplete ? 'pointer' : 'not-allowed',
              transition: 'transform 0.2s',
              boxShadow: isQuizComplete ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
            }}
            onMouseOver={(e) => {
              if (isQuizComplete) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ✓ Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}

