'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
  rank: number;
  change: number; // Position change since last update
}

interface LeaderboardRaceProps {
  competitionId: string;
  updateInterval?: number; // milliseconds
}

export default function LeaderboardRace({
  competitionId,
  updateInterval = 5000,
}: LeaderboardRaceProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(`/api/competitions/${competitionId}/leaderboard`);
        if (!response.ok) throw new Error('Failed to load leaderboard');
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();

    // Set up auto-refresh
    const interval = setInterval(loadLeaderboard, updateInterval);

    return () => clearInterval(interval);
  }, [competitionId, updateInterval]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Live Leaderboard</h3>
        <div className="text-xs text-gray-500">
          Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
        </div>
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.userId}
            className={`p-4 rounded-lg border-2 transition-all ${
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
                  <div className="font-bold text-gray-900">{entry.userName}</div>
                  <div className="text-xs text-gray-600">Rank #{entry.rank}</div>
                </div>
                {entry.change !== 0 && (
                  <div
                    className={`text-xs font-semibold ${
                      entry.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {entry.change > 0 ? '↑' : '↓'} {Math.abs(entry.change)}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{entry.points}</div>
                <div className="text-xs text-gray-600">points</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600">No leaderboard data yet</p>
        </div>
      )}
    </div>
  );
}

