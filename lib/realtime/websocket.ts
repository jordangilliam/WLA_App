/**
 * Real-time WebSocket Infrastructure
 * Uses Supabase Realtime for live collaboration features
 */

import { supabase } from '@/lib/db/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface LiveObservation {
  id: string;
  userId: string;
  userName: string;
  observationId: string;
  fieldSiteId: string;
  speciesName?: string;
  timestamp: Date;
  latitude?: number;
  longitude?: number;
}

export interface LiveSession {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  fieldSiteId?: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  participantCount: number;
}

export interface LiveLeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
  observations: number;
  speciesCount: number;
}

/**
 * Create a realtime channel for live field sessions
 */
export function createLiveSessionChannel(sessionId: string): RealtimeChannel {
  return supabase.channel(`live-session:${sessionId}`, {
    config: {
      broadcast: { self: true },
      presence: { key: 'user_id' },
    },
  });
}

/**
 * Subscribe to live observations in a session
 */
export function subscribeToLiveObservations(
  sessionId: string,
  callback: (observation: LiveObservation) => void
): RealtimeChannel {
  const channel = createLiveSessionChannel(sessionId);

  channel
    .on('broadcast', { event: 'observation' }, (payload) => {
      callback(payload.payload as LiveObservation);
    })
    .subscribe();

  return channel;
}

/**
 * Broadcast a new observation to the session
 */
export async function broadcastObservation(
  sessionId: string,
  observation: Omit<LiveObservation, 'id' | 'timestamp'>
): Promise<void> {
  const channel = createLiveSessionChannel(sessionId);

  await channel.send({
    type: 'broadcast',
    event: 'observation',
    payload: {
      ...observation,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    },
  });
}

/**
 * Subscribe to live leaderboard updates
 */
export function subscribeToLeaderboard(
  sessionId: string,
  callback: (leaderboard: LiveLeaderboardEntry[]) => void
): RealtimeChannel {
  const channel = createLiveSessionChannel(sessionId);

  channel
    .on('broadcast', { event: 'leaderboard' }, (payload) => {
      callback(payload.payload as LiveLeaderboardEntry[]);
    })
    .subscribe();

  return channel;
}

/**
 * Update leaderboard for a session
 */
export async function updateLeaderboard(
  sessionId: string,
  leaderboard: LiveLeaderboardEntry[]
): Promise<void> {
  const channel = createLiveSessionChannel(sessionId);

  await channel.send({
    type: 'broadcast',
    event: 'leaderboard',
    payload: leaderboard,
  });
}

/**
 * Track user presence in a session
 */
export function trackPresence(
  sessionId: string,
  userId: string,
  userName: string
): RealtimeChannel {
  const channel = createLiveSessionChannel(sessionId);

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      console.log('Presence state:', state);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('User joined:', key, newPresences);
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('User left:', key, leftPresences);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          user_name: userName,
          online_at: new Date().toISOString(),
        });
      }
    });

  return channel;
}

/**
 * Cleanup: Unsubscribe from a channel
 */
export function unsubscribeChannel(channel: RealtimeChannel): void {
  channel.unsubscribe();
}

