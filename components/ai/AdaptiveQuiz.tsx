'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
  topic: string;
}

interface AdaptiveQuizProps {
  topic: string;
  initialDifficulty?: 'beginner' | 'intermediate' | 'advanced';
  onComplete?: (score: number, total: number, difficulty: string) => void;
}

export default function AdaptiveQuiz({
  topic,
  initialDifficulty = 'beginner',
  onComplete,
}: AdaptiveQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { answer: number; correct: boolean }>>({});
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [topic, currentDifficulty]);

  const loadQuestions = async () => {
    try {
      const response = await fetch(
        `/api/ai/adaptive-quiz?topic=${topic}&difficulty=${currentDifficulty}&limit=5`
      );
      if (!response.ok) throw new Error('Failed to load questions');
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setAnswers({
      ...answers,
      [currentQuestion.id]: { answer: selectedAnswer, correct: isCorrect },
    });

    setShowExplanation(true);

    // Adjust difficulty based on performance
    if (isCorrect && currentDifficulty === 'beginner') {
      // Move to intermediate after correct answer
      setTimeout(() => {
        setCurrentDifficulty('intermediate');
      }, 2000);
    } else if (!isCorrect && currentDifficulty === 'advanced') {
      // Move down if struggling
      setTimeout(() => {
        setCurrentDifficulty('intermediate');
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      const correct = Object.values(answers).filter((a) => a.correct).length;
      const total = Object.keys(answers).length;
      if (onComplete) {
        onComplete(correct, total, currentDifficulty);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
        <p className="text-gray-600">No questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
            currentDifficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            currentDifficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {currentDifficulty}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{currentQuestion.question}</h3>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showResult = showExplanation;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-50 border-green-500'
                      : isSelected && !isCorrect
                      ? 'bg-red-50 border-red-500'
                      : 'bg-gray-50 border-gray-200'
                    : isSelected
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      showResult
                        ? isCorrect
                          ? 'border-green-500 bg-green-500 text-white'
                          : isSelected && !isCorrect
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300'
                        : isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {showResult && isCorrect && '✓'}
                    {showResult && isSelected && !isCorrect && '✗'}
                    {!showResult && isSelected && '•'}
                  </div>
                  <span className="font-medium text-gray-900">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
          <p className="text-sm text-blue-800">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}

