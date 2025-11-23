/**
 * Celebration Utilities
 * Helper functions for celebration animations, sounds, and effects
 */

import { soundManager } from '@/lib/audio/soundManager';

export interface CelebrationConfig {
  type: 'level-up' | 'achievement' | 'milestone' | 'streak' | 'check-in';
  intensity?: 'low' | 'medium' | 'high';
  soundEnabled?: boolean;
}

/**
 * Play celebration sound based on type
 */
export function playCelebrationSound(type: CelebrationConfig['type'], intensity: CelebrationConfig['intensity'] = 'medium') {
  if (!soundManager.isEnabled()) return;

  const soundMap: Record<string, 'check-in' | 'points' | 'level-up' | 'achievement' | 'button-click' | 'success' | 'error' | 'notification'> = {
    'level-up': 'level-up',
    'achievement': 'achievement',
    'milestone': 'achievement',
    'streak': 'points',
    'check-in': 'check-in',
  };

  const soundName = soundMap[type] || 'success';
  
  try {
    soundManager.play(soundName);
  } catch (error) {
    console.warn('Failed to play celebration sound:', error);
  }
}

/**
 * Get confetti particle count based on intensity
 */
export function getConfettiParticleCount(intensity: CelebrationConfig['intensity'] = 'medium'): number {
  const counts = {
    low: 200,
    medium: 500,
    high: 1000,
  };
  return counts[intensity];
}

/**
 * Get celebration colors based on type
 */
export function getCelebrationColors(type: CelebrationConfig['type']): string[] {
  const colorMap: Record<string, string[]> = {
    'level-up': ['#8B5CF6', '#A855F7', '#C084FC', '#E9D5FF'],
    'achievement': ['#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7'],
    'milestone': ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
    'streak': ['#EF4444', '#F97316', '#FB923C', '#FED7AA'],
    'check-in': ['#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD'],
  };
  return colorMap[type] || colorMap['achievement'];
}

/**
 * Trigger haptic feedback for celebrations
 */
export function triggerCelebrationHaptics(intensity: CelebrationConfig['intensity'] = 'medium') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  const patterns: Record<'low' | 'medium' | 'high', number[]> = {
    low: [50],
    medium: [100, 50, 100],
    high: [100, 50, 100, 50, 100],
  };

  try {
    const pattern = patterns[intensity || 'medium'];
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Failed to trigger haptics:', error);
  }
}

/**
 * Check if milestone celebration should trigger
 */
export function isMilestone(value: number, milestones: number[] = [7, 30, 100, 365]): boolean {
  return milestones.includes(value);
}

/**
 * Get milestone message
 */
export function getMilestoneMessage(value: number, type: 'streak' | 'level' | 'points' = 'streak'): string {
  const messages: Record<string, Record<number, string>> = {
    streak: {
      7: '🔥 Week Warrior!',
      30: '🔥 Monthly Master!',
      100: '🔥 Century Streak!',
      365: '🔥 Year of Dedication!',
    },
    level: {
      10: '⭐ Decade Achiever!',
      25: '⭐ Quarter Century!',
      50: '⭐ Half Century!',
      100: '⭐ Centurion!',
    },
    points: {
      1000: '🪙 Thousand Points!',
      5000: '🪙 Five Thousand!',
      10000: '🪙 Ten Thousand!',
      50000: '🪙 Fifty Thousand!',
    },
  };

  return messages[type]?.[value] || `🎉 Milestone Reached!`;
}

