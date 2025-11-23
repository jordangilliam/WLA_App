'use client';

import { useState } from 'react';
import VideoPlayer from './VideoPlayer';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timestamp: number; // seconds in video
  explanation?: string;
}

interface VideoQuizProps {
  videoSrc: string;
  videoTitle: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function VideoQuiz({ videoSrc, videoTitle, questions, onComplete }: VideoQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [videoTime, setVideoTime] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answerIndex,
    });

    if (isLastQuestion) {
      calculateScore();
    } else {
      // Move to next question after a short delay
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1000);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    setShowResults(true);
    if (onComplete) {
      onComplete(correct, questions.length);
    }
  };

  const handleVideoProgress = (progress: number) => {
    const currentTime = (progress / 100) * 100; // Estimate time from progress
    setVideoTime(currentTime);

    // Auto-show question when timestamp is reached
    if (currentQuestion && videoTime >= currentQuestion.timestamp && videoTime < currentQuestion.timestamp + 5) {
      // Question will be shown
    }
  };

  if (showResults) {
    const score = Object.keys(answers).filter(
      (qId) => answers[qId] === questions.find((q) => q.id === qId)?.correctAnswer
    ).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
        <div className="text-6xl mb-4">{percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
        <div className="text-5xl font-bold text-blue-600 mb-4">
          {score} / {questions.length}
        </div>
        <p className="text-gray-600 mb-6">
          You scored {percentage}% - {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
        </p>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setAnswers({});
            setShowResults(false);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <VideoPlayer
        src={videoSrc}
        title={videoTitle}
        onProgress={handleVideoProgress}
      />

      {/* Current Question */}
      {currentQuestion && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{currentQuestion.question}</h3>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showFeedback = answers[currentQuestion.id] !== undefined;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showFeedback
                      ? isCorrect
                        ? 'bg-green-50 border-green-500'
                        : isSelected
                        ? 'bg-red-50 border-red-500'
                        : 'bg-gray-50 border-gray-200'
                      : isSelected
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showFeedback
                          ? isCorrect
                            ? 'border-green-500 bg-green-500 text-white'
                            : isSelected
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {showFeedback && isCorrect && '✓'}
                      {showFeedback && isSelected && !isCorrect && '✗'}
                      {!showFeedback && isSelected && '•'}
                    </div>
                    <span className="font-medium text-gray-900">{option}</span>
                  </div>
                  {showFeedback && isCorrect && currentQuestion.explanation && (
                    <p className="text-sm text-green-700 mt-2 ml-9">
                      {currentQuestion.explanation}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

