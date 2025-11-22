'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface ClassRanking {
  class_id: string;
  class_name: string;
  teacher_name: string;
  total_points: number;
  total_check_ins: number;
  unique_sites: number;
  active_students: number;
  rank_position: number;
  rank_change: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [classRankings, setClassRankings] = useState<ClassRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'class' | 'individual'>('class');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard/class');
      
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      
      const data = await response.json();
      setClassRankings(data.rankings || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <span className="text-green-600">↑ {change}</span>;
    if (change < 0) return <span className="text-red-600">↓ {Math.abs(change)}</span>;
    return <span className="text-gray-500">—</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20 md:pb-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
          <p className="text-purple-100">
            See how your class ranks against others this week!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* View Toggle */}
        <div className="bg-white rounded-lg border border-gray-200 p-2 mb-6 inline-flex">
          <button
            onClick={() => setViewType('class')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewType === 'class'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            🏫 Class Rankings
          </button>
          <button
            onClick={() => setViewType('individual')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewType === 'individual'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            👤 Individual
          </button>
        </div>

        {/* Reset Timer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              <div>
                <div className="font-semibold text-amber-900">Weekly Competition</div>
                <div className="text-sm text-amber-700">Resets every Monday at midnight</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-900">3d 5h</div>
              <div className="text-xs text-amber-700">remaining</div>
            </div>
          </div>
        </div>

        {/* Class Leaderboard */}
        {viewType === 'class' && (
          <>
            {/* Top 3 Podium */}
            {classRankings.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="flex flex-col items-center pt-12">
                  <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-6 w-full text-center shadow-lg">
                    <div className="text-5xl mb-2">🥈</div>
                    <div className="font-bold text-gray-900 mb-1">{classRankings[1].class_name}</div>
                    <div className="text-2xl font-black text-gray-700">{classRankings[1].total_points}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-6 w-full text-center shadow-2xl border-4 border-amber-300">
                    <div className="text-6xl mb-2">🥇</div>
                    <div className="font-bold text-amber-900 mb-1">{classRankings[0].class_name}</div>
                    <div className="text-3xl font-black text-amber-900">{classRankings[0].total_points}</div>
                    <div className="text-sm text-amber-800">points</div>
                    <div className="mt-3 inline-block bg-white bg-opacity-30 px-3 py-1 rounded-full text-xs font-bold text-amber-900">
                      🏆 TOP CLASS
                    </div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center pt-16">
                  <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-2xl p-6 w-full text-center shadow-lg">
                    <div className="text-4xl mb-2">🥉</div>
                    <div className="font-bold text-orange-900 mb-1">{classRankings[2].class_name}</div>
                    <div className="text-xl font-black text-orange-800">{classRankings[2].total_points}</div>
                    <div className="text-sm text-orange-700">points</div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Rankings List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-4">Class</div>
                  <div className="col-span-2 text-center">Points</div>
                  <div className="col-span-2 text-center">Check-ins</div>
                  <div className="col-span-2 text-center">Sites</div>
                  <div className="col-span-1 text-center">Change</div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {classRankings.map((ranking) => (
                  <div
                    key={ranking.class_id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                      ranking.rank_position <= 3 ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <span className="text-2xl font-bold">{getRankIcon(ranking.rank_position)}</span>
                      </div>
                      <div className="col-span-4">
                        <div className="font-semibold text-gray-900">{ranking.class_name}</div>
                        <div className="text-sm text-gray-600">{ranking.teacher_name}</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="text-lg font-bold text-purple-600">{ranking.total_points}</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="text-gray-900">{ranking.total_check_ins}</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="text-gray-900">{ranking.unique_sites}</div>
                      </div>
                      <div className="col-span-1 text-center text-sm font-medium">
                        {getRankChangeIcon(ranking.rank_change)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Individual Leaderboard (Coming Soon) */}
        {viewType === 'individual' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Individual Rankings</h3>
            <p className="text-gray-600 mb-4">
              See how you rank against classmates!
            </p>
            <Link
              href="/leaderboard/class"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              View My Class Rankings
            </Link>
          </div>
        )}

        {/* Empty State */}
        {classRankings.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings Yet</h3>
            <p className="text-gray-600 mb-4">
              Start checking in and earning points to appear on the leaderboard!
            </p>
            <Link
              href="/explore"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Explore Field Sites
            </Link>
          </div>
        )}

        {/* How Points Work */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3">📊 How Class Rankings Work</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Your class earns points from every student&rsquo;s check-ins and observations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Rankings reset every Monday to keep competition fresh</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Top 3 classes each week earn special badges and rewards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Work together as a team to climb the leaderboard!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
