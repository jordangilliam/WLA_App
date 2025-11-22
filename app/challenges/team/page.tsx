'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  goalType: 'check-ins' | 'observations' | 'species' | 'points';
  targetCount: number;
  currentProgress: number;
  className: string;
  dueDate: string;
  reward: string;
  participants: number;
  icon: string;
}

export default function TeamChallengesPage() {
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState<TeamChallenge[]>([
    {
      id: '1',
      title: 'Class Exploration Goal',
      description: 'Visit 50 different sites together as a class',
      goalType: 'check-ins',
      targetCount: 50,
      currentProgress: 32,
      className: 'Ms. Johnson\'s Biology Class',
      dueDate: '2025-12-01',
      reward: 'Everyone earns 500 bonus points + Class Explorer Badge',
      participants: 24,
      icon: '🗺️',
    },
    {
      id: '2',
      title: 'Species Documentation',
      description: 'Collectively observe 100 different species',
      goalType: 'species',
      targetCount: 100,
      currentProgress: 67,
      className: 'Ms. Johnson\'s Biology Class',
      dueDate: '2025-11-30',
      reward: 'Class Nature Detective Badge + 1000 points each',
      participants: 24,
      icon: '🦋',
    },
    {
      id: '3',
      title: 'Team Point Sprint',
      description: 'Earn 10,000 points together this week',
      goalType: 'points',
      targetCount: 10000,
      currentProgress: 7250,
      className: 'Ms. Johnson\'s Biology Class',
      dueDate: '2025-11-14',
      reward: 'Pizza party + Field Trip privileges',
      participants: 24,
      icon: '🏆',
    },
  ]);

  const getProgressPercent = (challenge: TeamChallenge) => {
    return Math.min((challenge.currentProgress / challenge.targetCount) * 100, 100);
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Ended';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/challenges" className="text-purple-100 hover:text-white mb-2 inline-block">
            ← Back to Challenges
          </Link>
          <h1 className="text-3xl font-bold mb-2">👥 Team Challenges</h1>
          <p className="text-purple-100">
            Work together with your class to achieve amazing goals!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Class Info */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Ms. Johnson&rsquo;s Biology Class</h2>
              <div className="flex items-center gap-4 text-purple-100">
                <span>👥 24 students</span>
                <span>•</span>
                <span>🏆 2 challenges completed this month</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black">3</div>
              <div className="text-sm opacity-90">Active</div>
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="space-y-6">
          {challenges.map((challenge) => {
            const progressPercent = getProgressPercent(challenge);
            const isComplete = progressPercent >= 100;
            const daysRemaining = getDaysRemaining(challenge.dueDate);

            return (
              <div
                key={challenge.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                  isComplete
                    ? 'border-green-500 shadow-lg shadow-green-500/30'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                {/* Challenge Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-5xl">{challenge.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {challenge.title}
                        </h3>
                        <p className="text-gray-600">{challenge.description}</p>
                      </div>
                    </div>
                    {isComplete ? (
                      <span className="px-4 py-2 bg-green-500 text-white rounded-full font-bold flex items-center gap-2">
                        ✓ Complete!
                      </span>
                    ) : (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{daysRemaining}</div>
                        <div className="text-xs text-gray-600">remaining</div>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Team Progress
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {challenge.currentProgress} / {challenge.targetCount}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all duration-500 ${
                          isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      >
                        <div className="h-full w-full bg-white opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Participants Indicator */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>👥</span>
                    <span>{challenge.participants} students working together</span>
                  </div>
                </div>

                {/* Challenge Details */}
                <div className="p-6 space-y-4">
                  {/* Reward */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">Team Reward</div>
                        <div className="text-gray-700">{challenge.reward}</div>
                      </div>
                    </div>
                  </div>

                  {/* Top Contributors */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🌟 Top Contributors</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['Emily C. (12)', 'Marcus J. (10)', 'Sofia R. (9)'].map((contributor, i) => (
                        <div key={i} className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                          {contributor}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  {!isComplete && (
                    <Link
                      href="/explore"
                      className="block w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      Contribute Now! →
                    </Link>
                  )}

                  {isComplete && (
                    <button className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
                      🎉 Claim Team Reward
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* How Team Challenges Work */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3">💡 How Team Challenges Work</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">✓</span>
              <span>Every student&rsquo;s actions count toward the class goal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">✓</span>
              <span>All team members get the reward when you complete a challenge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">✓</span>
              <span>Work together and encourage each other to reach goals faster</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">✓</span>
              <span>Teachers can create custom team challenges for your class</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

