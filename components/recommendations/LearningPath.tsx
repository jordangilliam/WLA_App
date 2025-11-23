'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { generateLearningPath, type LearningPath, type UserProgress } from '@/lib/ai/recommendation-engine';
import Skeleton from '@/components/ui/Skeleton';

interface LearningPathProps {
  userId: string;
  userProgress?: UserProgress;
}

export default function LearningPathComponent({ userId, userProgress }: LearningPathProps) {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    async function loadLearningPath() {
      try {
        // Fetch user progress if not provided
        let progress = userProgress;
        if (!progress) {
          const response = await fetch('/api/user/progress');
          if (response.ok) {
            const data = await response.json();
            progress = data.progress;
          }
        }

        if (progress) {
          const path = generateLearningPath(progress);
          setLearningPath(path);
        }
      } catch (error) {
        console.error('Error loading learning path:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLearningPath();
  }, [userId, userProgress]);

  const getStepIcon = (type: string) => {
    const icons: Record<string, string> = {
      lesson: '📚',
      mission: '🗺️',
      challenge: '🎯',
      observation: '🔍',
    };
    return icons[type] || '📝';
  };

  const getStepHref = (step: any) => {
    const hrefs: Record<string, string> = {
      lesson: `/learn/${step.contentId}`,
      mission: `/missions?mission=${step.contentId}`,
      challenge: `/challenges`,
      observation: `/explore`,
    };
    return hrefs[step.type] || '#';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!learningPath || learningPath.steps.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <div className="text-5xl mb-4">🎓</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Learning Path Available</h3>
        <p className="text-gray-600">
          Complete some content to generate your personalized learning path
        </p>
      </div>
    );
  }

  const currentStep = learningPath.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / learningPath.steps.length) * 100;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{learningPath.title}</h2>
        <p className="text-gray-600">{learningPath.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <span>⏱️ {learningPath.estimatedDuration} min</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            learningPath.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            learningPath.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {learningPath.difficulty}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {currentStepIndex + 1} of {learningPath.steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      {currentStep && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{getStepIcon(currentStep.type)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-700 uppercase">
                  Current Step
                </span>
                {currentStep.required && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                    Required
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{currentStep.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{currentStep.description}</p>
              <Link
                href={getStepHref(currentStep)}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                Start Step →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* All Steps */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 mb-3">All Steps</h3>
        {learningPath.steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border transition-all ${
              index === currentStepIndex
                ? 'bg-blue-50 border-blue-300 shadow-md'
                : index < currentStepIndex
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center font-bold text-sm">
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{getStepIcon(step.type)}</span>
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                {index === currentStepIndex && (
                  <Link
                    href={getStepHref(step)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Continue →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

