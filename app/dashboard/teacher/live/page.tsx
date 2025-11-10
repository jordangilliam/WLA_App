'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface LiveActivity {
  id: string;
  timestamp: string;
  studentName: string;
  studentId: string;
  activityType: 'check-in' | 'observation' | 'achievement' | 'photo' | 'challenge';
  location?: string;
  siteName?: string;
  points: number;
  icon: string;
  color: string;
}

export default function TeacherLiveMonitoringPage() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [activeStudents, setActiveStudents] = useState(0);
  const [totalActions, setTotalActions] = useState(0);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Mock live data - in production, use WebSockets or Server-Sent Events
    const mockActivities: LiveActivity[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        studentName: 'Emily Chen',
        studentId: 'student-1',
        activityType: 'check-in',
        siteName: 'Schenley Park',
        location: 'Pittsburgh, PA',
        points: 50,
        icon: '📍',
        color: 'green',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        studentName: 'Marcus Johnson',
        studentId: 'student-2',
        activityType: 'observation',
        siteName: 'Highland Park',
        points: 75,
        icon: '📝',
        color: 'blue',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        studentName: 'Sofia Rodriguez',
        studentId: 'student-3',
        activityType: 'achievement',
        points: 100,
        icon: '🏆',
        color: 'purple',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        studentName: 'David Kim',
        studentId: 'student-4',
        activityType: 'photo',
        siteName: 'Carnegie Library',
        points: 25,
        icon: '📸',
        color: 'pink',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        studentName: 'Emma Wilson',
        studentId: 'student-5',
        activityType: 'challenge',
        points: 200,
        icon: '🎯',
        color: 'orange',
      },
    ];

    setActivities(mockActivities);
    setActiveStudents(5);
    setTotalActions(mockActivities.length);

    // Simulate new activities
    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.7) {
        const newActivity: LiveActivity = {
          id: `new-${Date.now()}`,
          timestamp: new Date().toISOString(),
          studentName: ['Alex', 'Jordan', 'Taylor', 'Sam', 'Chris'][Math.floor(Math.random() * 5)] + ' ' + ['Smith', 'Brown', 'Davis', 'Miller', 'Wilson'][Math.floor(Math.random() * 5)],
          studentId: `student-${Math.random()}`,
          activityType: ['check-in', 'observation', 'achievement', 'photo', 'challenge'][Math.floor(Math.random() * 5)] as any,
          siteName: ['Schenley Park', 'Highland Park', 'Frick Park', 'Point State Park'][Math.floor(Math.random() * 4)],
          location: 'Pittsburgh, PA',
          points: [25, 50, 75, 100][Math.floor(Math.random() * 4)],
          icon: ['📍', '📝', '🏆', '📸', '🎯'][Math.floor(Math.random() * 5)],
          color: ['green', 'blue', 'purple', 'pink', 'orange'][Math.floor(Math.random() * 5)],
        };

        setActivities((prev) => [newActivity, ...prev].slice(0, 20));
        setTotalActions((prev) => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    pink: 'bg-pink-50 border-pink-200 text-pink-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard/teacher" className="text-blue-100 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                📡 Live Activity Monitor
                {isLive && <span className="text-base px-3 py-1 bg-red-500 rounded-full animate-pulse">● LIVE</span>}
              </h1>
              <p className="text-blue-100">Real-time student activity across all your classes</p>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                isLive
                  ? 'bg-white text-blue-600 hover:bg-blue-50'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                👥
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{activeStudents}</div>
                <div className="text-sm text-gray-600">Active Right Now</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                ⚡
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{totalActions}</div>
                <div className="text-sm text-gray-600">Actions Today</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                🔥
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{Math.round(totalActions / Math.max(activeStudents, 1) * 10) / 10}</div>
                <div className="text-sm text-gray-600">Avg Per Student</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Live Activity Feed</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Auto-refreshing</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Waiting for Activity...</h3>
                <p className="text-gray-600">
                  Student actions will appear here in real-time
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-gray-50 transition-colors animate-fade-in"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                      {activity.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                          <span className="font-bold text-gray-900">{activity.studentName}</span>
                          <span className="text-gray-600 mx-2">•</span>
                          <span className="text-gray-600 capitalize">{activity.activityType.replace('-', ' ')}</span>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>

                      {activity.siteName && (
                        <div className="text-sm text-gray-600 mb-2">
                          📍 {activity.siteName}{activity.location && `, ${activity.location}`}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                          🪙 +{activity.points}
                        </span>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 font-bold text-lg hover:from-green-700 hover:to-green-800 transition-colors flex items-center justify-center gap-3">
            <span className="text-2xl">👏</span>
            <span>Send Class Encouragement</span>
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6 font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-colors flex items-center justify-center gap-3">
            <span className="text-2xl">📊</span>
            <span>View Full Report</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3">💡 Live Monitoring Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Perfect for field trips - see students checking in as they explore</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Pause the feed to review specific activities without missing updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Send quick encouragement messages when you see great work</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Export activity logs for later review and grading</span>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

