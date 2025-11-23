'use client';

import { useMemo } from 'react';

interface DayData {
  date: string;
  value: number;
  count: number;
}

interface ProgressHeatmapProps {
  data: DayData[];
  startDate?: Date;
  endDate?: Date;
  colorScale?: 'green' | 'blue' | 'purple';
  onDayClick?: (date: string, value: number) => void;
}

export default function ProgressHeatmap({
  data,
  startDate,
  endDate,
  colorScale = 'green',
  onDayClick,
}: ProgressHeatmapProps) {
  const heatmapData = useMemo(() => {
    const days: Record<string, DayData> = {};
    
    // Initialize all days in range
    const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();
    const current = new Date(start);
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      days[dateStr] = {
        date: dateStr,
        value: 0,
        count: 0,
      };
      current.setDate(current.getDate() + 1);
    }
    
    // Fill in actual data
    data.forEach((day) => {
      days[day.date] = day;
    });
    
    return Object.values(days);
  }, [data, startDate, endDate]);

  const maxValue = Math.max(...heatmapData.map((d) => d.value), 1);

  const getColor = (value: number): string => {
    const intensity = Math.min(value / maxValue, 1);
    
    if (colorScale === 'green') {
      if (intensity === 0) return '#ebedf0';
      if (intensity < 0.25) return '#c6e48b';
      if (intensity < 0.5) return '#7bc96f';
      if (intensity < 0.75) return '#239a3b';
      return '#196127';
    } else if (colorScale === 'blue') {
      if (intensity === 0) return '#ebedf0';
      if (intensity < 0.25) return '#c6e3ff';
      if (intensity < 0.5) return '#7bb3ff';
      if (intensity < 0.75) return '#3d8eff';
      return '#0066ff';
    } else {
      if (intensity === 0) return '#ebedf0';
      if (intensity < 0.25) return '#e4c1f9';
      if (intensity < 0.5) return '#c77dff';
      if (intensity < 0.75) return '#9d4edd';
      return '#7b2cbf';
    }
  };

  const getDayOfWeek = (date: Date): number => {
    return date.getDay();
  };

  const weeks = useMemo(() => {
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];
    
    heatmapData.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = getDayOfWeek(date);
      
      // Start new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      // Pad week to start on Sunday
      if (currentWeek.length === 0 && dayOfWeek !== 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: '', value: 0, count: 0 });
        }
      }
      
      currentWeek.push(day);
      
      // End of data
      if (index === heatmapData.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks;
  }, [heatmapData]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Activity Heatmap</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
              <div
                key={intensity}
                className="w-3 h-3 rounded"
                style={{ backgroundColor: getColor(intensity * maxValue) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pt-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="h-3 text-xs text-gray-500 w-8 text-right">
                {day === 'Sun' || day === 'Wed' || day === 'Fri' ? day : ''}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  if (!day.date) {
                    return <div key={dayIndex} className="w-3 h-3" />;
                  }
                  
                  return (
                    <div
                      key={day.date}
                      className="w-3 h-3 rounded cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      style={{ backgroundColor: getColor(day.value) }}
                      title={`${new Date(day.date).toLocaleDateString()}: ${day.value} activities`}
                      onClick={() => onDayClick?.(day.date, day.value)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total: {heatmapData.reduce((sum, d) => sum + d.count, 0)} activities
      </div>
    </div>
  );
}

