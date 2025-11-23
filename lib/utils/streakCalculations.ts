/**
 * Streak Calculation Utilities
 * Helper functions for calculating and managing streaks
 */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakStartDate: Date | null;
  lastActivityDate: Date | null;
  consecutiveDays: number[];
}

/**
 * Calculate streak from activity dates
 */
export function calculateStreak(activityDates: Date[]): StreakData {
  if (activityDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakStartDate: null,
      lastActivityDate: null,
      consecutiveDays: [],
    };
  }

  // Sort dates in descending order
  const sortedDates = [...activityDates].sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if today or yesterday has activity
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const hasToday = sortedDates.some((d) => {
    const dStr = new Date(d).toISOString().split('T')[0];
    return dStr === todayStr;
  });

  const hasYesterday = sortedDates.some((d) => {
    const dStr = new Date(d).toISOString().split('T')[0];
    return dStr === yesterdayStr;
  });

  // If no activity today or yesterday, streak is broken
  if (!hasToday && !hasYesterday) {
    return {
      currentStreak: 0,
      longestStreak: calculateLongestStreak(sortedDates),
      streakStartDate: null,
      lastActivityDate: sortedDates[0] || null,
      consecutiveDays: [],
    };
  }

  // Calculate current streak
  let currentStreak = hasToday ? 1 : 0;
  let streakStart = hasToday ? today : yesterday;
  const consecutiveDays: number[] = [];

  for (let i = hasToday ? 1 : 0; i < sortedDates.length; i++) {
    const checkDate = new Date(streakStart);
    checkDate.setDate(checkDate.getDate() - currentStreak);

    const dateStr = checkDate.toISOString().split('T')[0];
    const activityDateStr = new Date(sortedDates[i]).toISOString().split('T')[0];

    if (dateStr === activityDateStr) {
      currentStreak++;
      consecutiveDays.push(checkDate.getDate());
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak: calculateLongestStreak(sortedDates),
    streakStartDate: streakStart,
    lastActivityDate: sortedDates[0] || null,
    consecutiveDays,
  };
}

/**
 * Calculate longest streak from activity dates
 */
function calculateLongestStreak(sortedDates: Date[]): number {
  if (sortedDates.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);

    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

/**
 * Check if streak is at risk (no activity today)
 */
export function isStreakAtRisk(lastActivityDate: Date | null): boolean {
  if (!lastActivityDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const daysSinceActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  return daysSinceActivity >= 1;
}

/**
 * Get streak milestone rewards
 */
export function getStreakMilestoneReward(streakDays: number): { points: number; badge?: string } | null {
  const milestones: Record<number, { points: number; badge?: string }> = {
    7: { points: 100, badge: 'week-warrior' },
    30: { points: 500, badge: 'monthly-master' },
    100: { points: 2000, badge: 'century-streak' },
    365: { points: 10000, badge: 'year-dedication' },
  };

  return milestones[streakDays] || null;
}

/**
 * Calculate days until next milestone
 */
export function daysUntilNextMilestone(currentStreak: number): { days: number; milestone: number; reward: { points: number; badge?: string } } | null {
  const milestones = [7, 30, 100, 365];
  const nextMilestone = milestones.find((m) => m > currentStreak);

  if (!nextMilestone) return null;

  const reward = getStreakMilestoneReward(nextMilestone);
  if (!reward) return null;

  return {
    days: nextMilestone - currentStreak,
    milestone: nextMilestone,
    reward,
  };
}

