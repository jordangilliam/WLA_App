'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { soundManager, haptics } from '@/lib/audio/soundManager';

interface Challenge {
  challenge_id: string;
  title: string;
  description: string;
  challenge_type: 'daily' | 'weekly' | 'seasonal' | 'special';
  target_metric: string;
  target_count: number;
  reward_points: number;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  current_progress: number;
  completed: boolean;
  progress_percent: number;
  end_date: string;
}

export default function ChallengesPage() {
  const { data: session, status } = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchChallenges();
    }
  }, [status]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/challenges');
      
      if (!response.ok) throw new Error('Failed to fetch challenges');
      
      const data = await response.json();
      setChallenges(data.challenges || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async (challengeId: string) => {
    setClaiming(challengeId);
    soundManager.play('achievement');
    haptics.success();

    try {
      const response = await fetch('/api/challenges/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });

      if (!response.ok) throw new Error('Failed to claim rewards');

      const data = await response.json();
      
      // Refresh challenges
      await fetchChallenges();
      
      // Show success (you could trigger a celebration modal here)
      alert(`Claimed ${data.points_awarded} points!`);
    } catch (error) {
      console.error('Error claiming rewards:', error);
      soundManager.play('error');
    } finally {
      setClaiming(null);
    }
  };

  const dailyChallenges = challenges.filter(c => c.challenge_type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.challenge_type === 'weekly');
  const specialChallenges = challenges.filter(c => c.challenge_type === 'special');

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-blue-100 text-blue-700',
    hard: 'bg-purple-100 text-purple-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 pb-20 md:pb-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🎯 Daily Challenges</h1>
          <p className="text-orange-100">
            Complete challenges to earn bonus points and build your streak!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Daily Challenges */}
        {dailyChallenges.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>☀️</span>
                <span>Today's Challenges</span>
              </h2>
              <span className="text-sm text-gray-600">Resets daily at midnight</span>
            </div>
            
            <div className="space-y-4">
              {dailyChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.challenge_id}
                  challenge={challenge}
                  difficultyColors={difficultyColors}
                  claiming={claiming}
                  onClaim={handleClaimRewards}
                />
              ))}
            </div>
          </div>
        )}

        {/* Weekly Challenges */}
        {weeklyChallenges.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📅</span>
                <span>Weekly Challenges</span>
              </h2>
              <span className="text-sm text-gray-600">Resets every Monday</span>
            </div>
            
            <div className="space-y-4">
              {weeklyChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.challenge_id}
                  challenge={challenge}
                  difficultyColors={difficultyColors}
                  claiming={claiming}
                  onClaim={handleClaimRewards}
                />
              ))}
            </div>
          </div>
        )}

        {/* Special Challenges */}
        {specialChallenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⭐</span>
              <span>Special Challenges</span>
            </h2>
            
            <div className="space-y-4">
              {specialChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.challenge_id}
                  challenge={challenge}
                  difficultyColors={difficultyColors}
                  claiming={claiming}
                  onClaim={handleClaimRewards}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {challenges.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Challenges</h3>
            <p className="text-gray-600 mb-4">Check back tomorrow for new challenges!</p>
            <Link
              href="/explore"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Explore Field Sites
            </Link>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3">💡 Challenge Tips</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Complete daily challenges to build a streak and earn bonus points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Weekly challenges give bigger rewards but take more effort</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Challenge difficulty affects the points you earn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Your progress is automatically tracked as you use the app!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
  difficultyColors: Record<string, string>;
  claiming: string | null;
  onClaim: (id: string) => void;
}

function ChallengeCard({ challenge, difficultyColors, claiming, onClaim }: ChallengeCardProps) {
  const isCompleted = challenge.completed;
  const progressPercent = Math.min(challenge.progress_percent, 100);

  return (
    <div className={`bg-white rounded-lg border-2 p-6 transition-all ${
      isCompleted ? 'border-green-500 shadow-lg' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-4xl">{challenge.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900">{challenge.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[challenge.difficulty]}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-600">{challenge.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">+{challenge.reward_points}</div>
          <div className="text-xs text-gray-600">points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-700 font-medium">
            {challenge.current_progress} / {challenge.target_count}
          </span>
          <span className="text-gray-600">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className={`rounded-full h-3 transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-orange-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      {isCompleted ? (
        <button
          onClick={() => onClaim(challenge.challenge_id)}
          disabled={claiming === challenge.challenge_id}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claiming === challenge.challenge_id ? 'Claiming...' : '🎁 Claim Rewards'}
        </button>
      ) : (
        <div className="text-center text-sm text-gray-600">
          Keep going! {challenge.target_count - challenge.current_progress} more to complete.
        </div>
      )}
    </div>
  );
}

