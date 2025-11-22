'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import Link from 'next/link';

const DEFAULT_BADGE_TARGET = 50;

interface EnrolledClass {
  id: string;
  class_code: string;
  class_name: string;
  teacher_name: string;
  organization_name: string;
  active_assignment_count?: number;
}

interface AchievementStats {
  earned: number;
  total: number;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { total: points, level, currentStreak, badges } = usePoints();
  
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [achievementStats, setAchievementStats] = useState<AchievementStats | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const [classesResult, achievementsResult] = await Promise.allSettled([
        fetch('/api/student/classes'),
        fetch('/api/achievements'),
      ]);

      if (
        classesResult.status === 'rejected' ||
        !classesResult.value.ok
      ) {
        throw new Error('Failed to fetch classes');
      }

      const classesPayload = await classesResult.value.json();
      setClasses(classesPayload.classes || []);

      if (achievementsResult.status === 'fulfilled') {
        if (achievementsResult.value.ok) {
          const achievementsPayload = await achievementsResult.value.json();
          const totalAchievements = Array.isArray(achievementsPayload.achievements)
            ? achievementsPayload.achievements.length
            : 0;
          const unlockedAchievements = Array.isArray(achievementsPayload.userAchievements)
            ? achievementsPayload.userAchievements.length
            : 0;

          setAchievementStats({
            earned: unlockedAchievements,
            total: totalAchievements,
          });
        } else {
          console.error('Failed to fetch achievements:', achievementsResult.value.statusText);
        }
      } else {
        console.error('Failed to fetch achievements:', achievementsResult.reason);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = session?.user as { role?: string } | undefined;

    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (status === 'authenticated') {
      if (user?.role !== 'student') {
        router.push('/dashboard/teacher');
      } else {
        loadDashboardData();
      }
    }
  }, [status, session, router, loadDashboardData]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const rawEarnedBadges = achievementStats ? achievementStats.earned : badges;
  const totalBadgeBaseline = achievementStats?.total ?? 0;
  const totalBadges =
    totalBadgeBaseline > 0
      ? totalBadgeBaseline
      : Math.max(DEFAULT_BADGE_TARGET, rawEarnedBadges, 1);
  const earnedBadgesCount = Math.min(rawEarnedBadges, totalBadges);
  const badgeProgress =
    totalBadges === 0 ? 0 : Math.min((earnedBadgesCount / totalBadges) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20 md:pb-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Dashboard 📚</h1>
          <p className="text-green-100">Track your progress and explore nature</p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl mb-2">🪙</div>
            <div className="text-2xl font-bold text-gray-900">{points}</div>
            <div className="text-xs text-gray-600">Total Points</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-gray-900">{currentStreak}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-gray-900">{earnedBadgesCount}</div>
            <div className="text-xs text-gray-600">Achievements</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-900">{level}</div>
            <div className="text-xs text-gray-600">Current Level</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/explore?action=checkin"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center hover:from-green-600 hover:to-green-700 transition-all shadow-md"
          >
            <div className="text-3xl mb-2">📍</div>
            <div className="font-bold">Check In</div>
          </Link>

          <Link
            href="/explore"
            className="bg-white border-2 border-green-600 text-green-700 rounded-lg p-6 text-center hover:bg-green-50 transition-all"
          >
            <div className="text-3xl mb-2">🗺️</div>
            <div className="font-bold">Explore</div>
          </Link>

          <Link
            href="/journal-new"
            className="bg-white border-2 border-blue-600 text-blue-700 rounded-lg p-6 text-center hover:bg-blue-50 transition-all"
          >
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold">Journal</div>
          </Link>

          <Link
            href="/stocking"
            className="bg-white border-2 border-purple-600 text-purple-700 rounded-lg p-6 text-center hover:bg-purple-50 transition-all"
          >
            <div className="text-3xl mb-2">🎣</div>
            <div className="font-bold">Stocking</div>
          </Link>
        </div>
      </div>

      {/* My Classes */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">My Classes</h2>
          <Link
            href="/join-class"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            + Join Class
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-bold text-gray-900 mb-2">No Classes Yet</h3>
            <p className="text-gray-600 mb-4">Ask your teacher for a class code to join</p>
            <Link
              href="/join-class"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Join a Class
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{cls.class_name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Teacher: {cls.teacher_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cls.organization_name}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/student/classes/${cls.id}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    View Class
                  </Link>
                </div>
                {cls.active_assignment_count !== undefined && cls.active_assignment_count > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-sm text-orange-600 font-medium">
                      📋 {cls.active_assignment_count} active assignment{cls.active_assignment_count > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity & Progress */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Keep Going!</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Build Your Streak</h3>
              <p className="text-sm text-gray-600">
                Visit a new site today to maintain your {currentStreak}-day streak!
              </p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/explore"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-center hover:bg-green-700 transition-colors"
            >
              Find Sites Nearby
            </Link>
            <Link
              href="/achievements"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              View Progress
            </Link>
          </div>
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Achievement Progress</h2>
        <Link
          href="/achievements"
          className="block bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:from-purple-600 hover:to-purple-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-2xl font-bold mb-1">
                {earnedBadgesCount} / {totalBadges}
              </div>
              <div className="text-purple-100">Achievements Unlocked</div>
            </div>
            <div className="text-6xl opacity-20">→</div>
          </div>
          <div className="mt-4 bg-white bg-opacity-20 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all"
              style={{ width: `${badgeProgress}%` }}
            ></div>
          </div>
        </Link>
      </div>
    </div>
  );
}

