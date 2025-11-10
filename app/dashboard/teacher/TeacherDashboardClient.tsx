'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Class, TeacherDashboardSummary } from '@/lib/types/dashboard.types';

export default function TeacherDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [summary, setSummary] = useState<TeacherDashboardSummary | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
      return;
    }

    if (status === 'authenticated') {
      const user = session?.user as any;
      
      // Only teachers and admins can access
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        router.push('/');
        return;
      }

      fetchDashboardData();
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch classes
      const classesResponse = await fetch('/api/classes');
      if (classesResponse.ok) {
        const classesData = await classesResponse.json();
        setClasses(classesData.data || []);
      }

      // Mock summary data
      // TODO: Create /api/dashboard/summary endpoint
      setSummary({
        teacher_id: 1,
        teacher_name: session?.user?.name || 'Teacher',
        total_classes: 3,
        active_classes: 3,
        total_students: 52,
        active_students_week: 45,
        total_assignments: 12,
        points_earned_week: 2350,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 pb-20 md:pb-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🎓 Teacher Dashboard</h1>
          <p className="text-blue-100">
            Welcome back, {session?.user?.name || 'Teacher'}! Manage your classes and track student progress.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Quick Stats Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-gray-900">{summary.active_classes}</div>
              <div className="text-xs text-gray-600">Active Classes</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-900">{summary.total_students}</div>
              <div className="text-xs text-gray-600">Total Students</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-900">{summary.active_students_week}</div>
              <div className="text-xs text-gray-600">Active This Week</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-gray-900">{summary.total_assignments}</div>
              <div className="text-xs text-gray-600">Assignments</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl mb-2">🪙</div>
              <div className="text-2xl font-bold text-gray-900">{summary.points_earned_week}</div>
              <div className="text-xs text-gray-600">Points This Week</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/dashboard/teacher/classes/new')}
              className="flex flex-col items-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-2xl">➕</span>
              <span className="font-medium text-sm">Create Class</span>
            </button>

            <button
              onClick={() => router.push('/dashboard/teacher/assignments/new')}
              className="flex flex-col items-center gap-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span className="text-2xl">📝</span>
              <span className="font-medium text-sm">New Assignment</span>
            </button>

            <button
              onClick={() => router.push('/exports')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <span className="text-2xl">💾</span>
              <span className="font-medium text-sm">Export Data</span>
            </button>

            <button
              onClick={() => router.push('/dashboard/teacher/students')}
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="text-2xl">👥</span>
              <span className="font-medium text-sm">All Students</span>
            </button>

            <button
              onClick={() => router.push('/dashboard/teacher/reports')}
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="text-2xl">📊</span>
              <span className="font-medium text-sm">Reports</span>
            </button>

            <button
              onClick={() => router.push('/explore')}
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="text-2xl">🗺️</span>
              <span className="font-medium text-sm">Field Sites</span>
            </button>
          </div>
        </div>

        {/* My Classes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Classes</h2>
            <button
              onClick={() => router.push('/dashboard/teacher/classes/new')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + Create New Class
            </button>
          </div>

          {classes.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-gray-900 mb-2">No Classes Yet</h3>
              <p className="text-gray-600 mb-4">Create your first class to get started</p>
              <button
                onClick={() => router.push('/dashboard/teacher/classes/new')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Class
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls: any) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 mb-1">{cls.class_name}</h3>
                    <p className="text-sm text-gray-600">{cls.class_code}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-600">
                      {cls.student_count || 0} students
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cls.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {cls.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <button
                    onClick={() => router.push(`/dashboard/teacher/classes/${cls.id}`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Manage Class
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Field Trip Planner Teaser */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🚌 Field Trip Planner</h3>
              <p className="text-green-100 mb-4">
                Plan and organize field trips to 140+ sites across Pennsylvania
              </p>
              <button
                onClick={() => router.push('/explore')}
                className="px-6 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Browse Field Sites
              </button>
            </div>
            <div className="hidden md:block text-6xl opacity-50">🗺️</div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>Student activity feed coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
