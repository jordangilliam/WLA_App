'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';

interface TeamMember {
  userId: string;
  userName: string;
  contribution: number;
}

interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  targetMetric: string;
  targetCount: number;
  currentProgress: number;
  teamMembers: TeamMember[];
  rewardPoints: number;
  endDate: Date;
  isCompleted: boolean;
}

interface TeamChallengeProps {
  challengeId: string;
}

export default function TeamChallenge({ challengeId }: TeamChallengeProps) {
  const [challenge, setChallenge] = useState<TeamChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChallenge() {
      try {
        const response = await fetch(`/api/challenges/team/${challengeId}`);
        if (!response.ok) throw new Error('Failed to load challenge');
        const data = await response.json();
        setChallenge(data.challenge);
      } catch (error) {
        console.error('Error loading team challenge:', error);
      } finally {
        setLoading(false);
      }
    }

    loadChallenge();
  }, [challengeId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <p className="text-gray-600">Challenge not found</p>
      </div>
    );
  }

  const progressPercent = Math.min((challenge.currentProgress / challenge.targetCount) * 100, 100);
  const timeRemaining = new Date(challenge.endDate).getTime() - Date.now();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{challenge.title}</h2>
        <p className="text-gray-600 mb-4">{challenge.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>🎯 {challenge.targetMetric}</span>
          <span>⏱️ {daysRemaining} days left</span>
          {challenge.isCompleted && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
              Completed!
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Team Progress</span>
          <span className="text-sm text-gray-600">
            {challenge.currentProgress} / {challenge.targetCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {Math.round(progressPercent)}% complete
        </div>
      </div>

      {/* Team Members */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Team Members</h3>
        <div className="space-y-2">
          {challenge.teamMembers.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {member.userName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900">{member.userName}</span>
              </div>
              <div className="text-sm text-gray-600">
                {member.contribution} {challenge.targetMetric}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900 mb-1">Team Reward</div>
            <div className="text-sm text-gray-600">
              {challenge.rewardPoints} points split among team members
            </div>
          </div>
          <div className="text-3xl">🪙</div>
        </div>
      </div>
    </div>
  );
}

