'use client';

import { useEffect, useState } from 'react';
import StreakFire from '@/components/celebrations/StreakFire';
import { isMilestone, getMilestoneMessage } from '@/lib/utils/celebrations';

interface StreakCalendarProps {
  currentStreak: number;
  streakHistory?: Date[]; // Array of dates with activity
  onDateClick?: (date: Date) => void;
  className?: string;
}

export default function StreakCalendar({
  currentStreak,
  streakHistory = [],
  onDateClick,
  className = '',
}: StreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthStreaks, setMonthStreaks] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Convert streak history to a Set of date strings (YYYY-MM-DD)
    const streakSet = new Set(
      streakHistory.map((date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    );

    // Add today if there's a current streak
    if (currentStreak > 0) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      streakSet.add(todayStr);
    }

    setMonthStreaks(streakSet);
  }, [streakHistory, currentStreak]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isStreakDay = (date: Date | null): boolean => {
    if (!date) return false;
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return monthStreaks.has(dateStr);
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isFuture = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const getFireIntensity = (date: Date | null): number => {
    if (!date || !isStreakDay(date)) return 0;
    
    // Calculate days since streak start (simplified - would need actual streak start date)
    // For now, use current streak as intensity indicator
    return Math.min(currentStreak / 30, 1);
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const today = new Date();
  const canGoNext = currentMonth.getMonth() < today.getMonth() || currentMonth.getFullYear() < today.getFullYear();

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Streak Calendar</h3>
          <p className="text-sm text-gray-600 mt-1">
            {currentStreak} day{currentStreak !== 1 ? 's' : ''} streak 🔥
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="font-semibold text-gray-900 min-w-[140px] text-center">{monthName}</span>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const hasStreak = isStreakDay(date);
          const isTodayDate = isToday(date);
          const isFutureDate = isFuture(date);
          const fireIntensity = getFireIntensity(date);
          const isMilestoneDay = hasStreak && isMilestone(date.getDate(), [7, 14, 21, 28]);

          return (
            <div
              key={date.toISOString()}
              onClick={() => !isFutureDate && onDateClick?.(date)}
              className={`
                aspect-square relative rounded-lg transition-all cursor-pointer
                ${isFutureDate ? 'opacity-30 cursor-not-allowed' : ''}
                ${hasStreak ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gray-100'}
                ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${isMilestoneDay ? 'ring-2 ring-yellow-400' : ''}
                hover:scale-105
              `}
            >
              {/* Fire animation for streak days */}
              {hasStreak && fireIntensity > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <StreakFire
                    isActive={true}
                    intensity={fireIntensity}
                    size="small"
                  />
                </div>
              )}

              {/* Day number */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span
                  className={`
                    text-sm font-bold
                    ${hasStreak ? 'text-white' : 'text-gray-700'}
                    ${isTodayDate ? 'text-blue-600' : ''}
                  `}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Milestone indicator */}
              {isMilestoneDay && (
                <div className="absolute -top-1 -right-1 z-20">
                  <span className="text-xs">⭐</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100"></div>
          <span>No activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-500 to-red-500"></div>
          <span>Streak day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500 ring-2 ring-blue-500 ring-offset-1"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

