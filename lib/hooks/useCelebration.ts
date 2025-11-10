'use client';

import { useState, useCallback } from 'react';

export interface CelebrationEvent {
  type: 'level-up' | 'first-checkin' | 'achievement';
  data: any;
}

export function useCelebration() {
  const [activeCelebration, setActiveCelebration] = useState<CelebrationEvent | null>(null);

  const celebrateLevelUp = useCallback((data: {
    newLevel: number;
    pointsEarned: number;
    levelTitle?: string;
    rewards?: any;
  }) => {
    setActiveCelebration({
      type: 'level-up',
      data,
    });
  }, []);

  const celebrateFirstCheckIn = useCallback((data: {
    siteName: string;
    pointsEarned: number;
    bonusPoints?: number;
  }) => {
    setActiveCelebration({
      type: 'first-checkin',
      data,
    });
  }, []);

  const celebrateAchievement = useCallback((data: {
    title: string;
    description: string;
    icon: string;
    rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    pointsEarned: number;
  }) => {
    setActiveCelebration({
      type: 'achievement',
      data,
    });
  }, []);

  const closeCelebration = useCallback(() => {
    setActiveCelebration(null);
  }, []);

  return {
    activeCelebration,
    celebrateLevelUp,
    celebrateFirstCheckIn,
    celebrateAchievement,
    closeCelebration,
  };
}

