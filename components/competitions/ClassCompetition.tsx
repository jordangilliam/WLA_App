'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';

interface Competition {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participatingClasses: Array<{
    classId: string;
    className: string;
    points: number;
    rank: number;
  }>;
  rewards: {
    firstPlace: string;
    secondPlace: string;
    thirdPlace: string;
  };
}

interface ClassCompetitionProps {
  competitionId?: string;
}

export default function ClassCompetition({ competitionId }: ClassCompetitionProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompetition() {
      try {
        const url = competitionId
          ? `/api/competitions/${competitionId}`
          : '/api/competitions?active=true&limit=1';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load competition');
        const data = await response.json();
        setCompetition(data.competition || (data.competitions?.[0] || null));
      } catch (error) {
        console.error('Error loading competition:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCompetition();
  }, [competitionId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <div className="text-5xl mb-4">🏆</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Competition</h3>
        <p className="text-gray-600">Check back soon for class competitions!</p>
      </div>
    );
  }

  const timeRemaining = new Date(competition.endDate).getTime() - Date.now();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{competition.title}</h2>
          {competition.isActive && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Active
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{competition.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>📅 Ends in {daysRemaining} days</span>
          <span>👥 {competition.participatingClasses.length} classes</span>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-gray-900">Class Leaderboard</h3>
        {competition.participatingClasses.map((classData, index) => (
          <div
            key={classData.classId}
            className={`p-4 rounded-lg border-2 ${
              index === 0
                ? 'bg-yellow-50 border-yellow-400'
                : index === 1
                ? 'bg-gray-50 border-gray-300'
                : index === 2
                ? 'bg-amber-50 border-amber-400'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{classData.className}</div>
                  <div className="text-sm text-gray-600">Rank #{classData.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{classData.points}</div>
                <div className="text-xs text-gray-600">points</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">Competition Rewards</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥇</span>
            <span className="text-gray-700">
              <strong>1st Place:</strong> {competition.rewards.firstPlace}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥈</span>
            <span className="text-gray-700">
              <strong>2nd Place:</strong> {competition.rewards.secondPlace}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥉</span>
            <span className="text-gray-700">
              <strong>3rd Place:</strong> {competition.rewards.thirdPlace}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

