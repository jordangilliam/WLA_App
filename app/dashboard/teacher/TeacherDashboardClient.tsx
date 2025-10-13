'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TeacherNav from '@/components/dashboard/TeacherNav';
import QuickStats from '@/components/dashboard/QuickStats';
import ClassCard from '@/components/dashboard/ClassCard';
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
        teacher_name: 'Sarah Johnson',
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8F4F8 0%, #F0F9F4 100%)',
      }}>
        <div style={{
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}>⏳</div>
          <div style={{
            fontSize: '1.25rem',
            color: '#6B7280',
          }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E8F4F8 0%, #F0F9F4 25%, #FFF8E7 50%, #F4F1E8 75%, #E3F2E1 100%)',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1E40AF',
            marginBottom: '0.5rem',
          }}>
            🎓 Teacher Dashboard
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6B7280',
          }}>
            Welcome back, {session?.user?.name || 'Teacher'}! Here&apos;s your overview.
          </p>
        </div>

        {/* Navigation */}
        <TeacherNav />

        {/* Quick Stats */}
        {summary && (
          <QuickStats
            totalClasses={summary.active_classes}
            totalStudents={summary.total_students}
            activeStudentsWeek={summary.active_students_week}
            totalAssignments={summary.total_assignments}
            pointsEarnedWeek={summary.points_earned_week}
          />
        )}

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1E40AF',
            marginBottom: '1rem',
          }}>
            ⚡ Quick Actions
          </h2>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => router.push('/dashboard/teacher/classes/new')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ➕ Create New Class
            </button>
            <button
              onClick={() => router.push('/dashboard/teacher/assignments/new')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              📝 Create Assignment
            </button>
            <button
              onClick={() => router.push('/dashboard/teacher/reports')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              📊 View Reports
            </button>
          </div>
        </div>

        {/* Classes Section */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1E40AF',
            }}>
              📚 My Classes
            </h2>
            <button
              onClick={() => router.push('/dashboard/teacher/classes')}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#3B82F6',
                border: '2px solid #3B82F6',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3B82F6';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#3B82F6';
              }}
            >
              View All →
            </button>
          </div>

          {classes.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1E40AF',
                marginBottom: '0.5rem',
              }}>
                No classes yet
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                marginBottom: '1.5rem',
              }}>
                Get started by creating your first class!
              </p>
              <button
                onClick={() => router.push('/dashboard/teacher/classes/new')}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  cursor: 'pointer',
                }}
              >
                ➕ Create Your First Class
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem',
            }}>
              {classes.slice(0, 3).map((classData) => (
                <ClassCard
                  key={classData.id}
                  classData={classData}
                  studentCount={18}
                  activeStudents={15}
                  pendingSubmissions={3}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

