'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import LiveObservations from './LiveObservations';
import LiveLeaderboard from './LiveLeaderboard';
import {
  subscribeToLiveObservations,
  trackPresence,
  unsubscribeChannel,
  type LiveObservation,
  type RealtimeChannel,
} from '@/lib/realtime/websocket';
import type { RealtimeChannel as RealtimeChannelType } from '@supabase/supabase-js';

interface LiveSessionProps {
  sessionId: string;
  className: string;
  fieldSiteName?: string;
  onClose?: () => void;
}

export default function LiveSession({
  sessionId,
  className,
  fieldSiteName,
  onClose,
}: LiveSessionProps) {
  const { data: session } = useSession();
  const [observations, setObservations] = useState<LiveObservation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const channelsRef = useRef<RealtimeChannelType[]>([]);

  const userId = (session?.user as { id?: string } | undefined)?.id || '';
  const userName = session?.user?.name || 'Unknown';

  useEffect(() => {
    if (!userId || !sessionId) return;

    // Track presence
    const presenceChannel = trackPresence(sessionId, userId, userName);
    channelsRef.current.push(presenceChannel);

    // Subscribe to live observations
    const observationsChannel = subscribeToLiveObservations(sessionId, (observation) => {
      setObservations((prev) => [observation, ...prev].slice(0, 50)); // Keep last 50
    });
    channelsRef.current.push(observationsChannel);

    setIsConnected(true);

    return () => {
      channelsRef.current.forEach((channel) => unsubscribeChannel(channel));
      channelsRef.current = [];
      setIsConnected(false);
    };
  }, [sessionId, userId, userName]);

  const handleClose = useCallback(() => {
    channelsRef.current.forEach((channel) => unsubscribeChannel(channel));
    channelsRef.current = [];
    onClose?.();
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{className}</h2>
            {fieldSiteName && (
              <p className="text-blue-100 text-sm mt-1">📍 {fieldSiteName}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm opacity-90">Participants</div>
              <div className="text-xl font-bold">{participantCount}</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            {onClose && (
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Live Observations */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Live Observations</h3>
            <p className="text-sm text-gray-600">See what your classmates are discovering</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LiveObservations observations={observations} />
          </div>
        </div>

        {/* Live Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Live Leaderboard</h3>
            <p className="text-sm text-gray-600">Real-time progress during this session</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LiveLeaderboard sessionId={sessionId} />
          </div>
        </div>
      </div>
    </div>
  );
}

