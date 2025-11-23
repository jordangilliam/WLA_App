'use client';

import { useEffect, useState } from 'react';
import { subscribeToLeaderboard, unsubscribeChannel, type LiveLeaderboardEntry } from '@/lib/realtime/websocket';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface LiveLeaderboardProps {
  sessionId: string;
}

export default function LiveLeaderboard({ sessionId }: LiveLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LiveLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useState<RealtimeChannel | null>(null)[0];

  useEffect(() => {
    if (!sessionId) return;

    // Subscribe to leaderboard updates
    const channel = subscribeToLeaderboard(sessionId, (entries) => {
      setLeaderboard(entries);
      setIsLoading(false);
    });

    // Also fetch initial leaderboard
    fetch(`/api/collaboration/leaderboard?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
        setIsLoading(false);
      });

    return () => {
      if (channel) {
        unsubscribeChannel(channel);
      }
    };
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-5xl mb-4">🏆</div>
        <p className="text-gray-600">No leaderboard data yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Progress will appear as students make observations
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {leaderboard.map((entry, index) => (
        <div
          key={entry.userId}
          className={`p-4 flex items-center gap-4 ${
            index === 0 ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
          }`}
        >
          <div className="flex-shrink-0">
            {index === 0 ? (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                🥇
              </div>
            ) : index === 1 ? (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-lg">
                🥈
              </div>
            ) : index === 2 ? (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-lg">
                🥉
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                {index + 1}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900">{entry.userName}</div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>🪙 {entry.points} pts</span>
              <span>📸 {entry.observations} obs</span>
              <span>🦋 {entry.speciesCount} species</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

