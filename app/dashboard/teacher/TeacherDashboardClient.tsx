'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Class, TeacherDashboardSummary } from '@/lib/types/dashboard.types';

const ICONS = {
  map: '/images/icons/Map.jpg',
  journal: '/images/icons/journal.jpg',
  award: '/images/icons/award.jpg',
  habitat: '/images/icons/Habitat.png',
  book: '/images/icons/Book.png',
  macro: '/images/icons/Micor(Macro).png',
};

const formatNumber = (value: number | string | undefined) => {
  if (value === undefined || value === null) return '—';
  return typeof value === 'number' ? value.toLocaleString() : value;
};

type DashboardClass = Class & {
  class_name?: string;
  student_count?: number;
  active?: boolean;
};

export default function TeacherDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [summary, setSummary] = useState<TeacherDashboardSummary | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const classesResponse = await fetch('/api/classes');
      if (classesResponse.ok) {
        const classesData = await classesResponse.json();
        setClasses(classesData.data || []);
      }

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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
      return;
    }

    if (status === 'authenticated') {
      const user = session?.user as { role?: string } | undefined;
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        router.push('/');
        return;
      }

      fetchDashboardData();
    }
  }, [status, session, router, fetchDashboardData]);

  if (status === 'loading' || loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(circle at 15% 20%, rgba(29,166,219,0.18), transparent 45%), radial-gradient(circle at 85% 0%, rgba(234,126,55,0.15), transparent 40%), #F5F7FB',
        }}
      >
        <div
          className="animate-spin rounded-full border-4 border-white/20 border-t-white"
          style={{ width: '54px', height: '54px' }}
        />
      </div>
    );
  }

  const statCards = [
    { label: 'Active Classes', value: summary?.active_classes, icon: ICONS.habitat },
    { label: 'Total Students', value: summary?.total_students, icon: ICONS.map },
    { label: 'Active This Week', value: summary?.active_students_week, icon: ICONS.journal },
    { label: 'Assignments', value: summary?.total_assignments, icon: ICONS.book },
    { label: 'Points This Week', value: summary?.points_earned_week, icon: ICONS.award },
  ];

  const quickActions = [
    {
      label: 'Create Class',
      description: 'Launch a new academy cohort',
      onClick: () => router.push('/dashboard/teacher/classes/new'),
      gradient: 'linear-gradient(135deg, #0F766E, #22C55E)',
      icon: ICONS.habitat,
    },
    {
      label: 'New Assignment',
      description: 'Issue challenges or reflections',
      onClick: () => router.push('/dashboard/teacher/assignments/new'),
      gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
      icon: ICONS.book,
    },
    {
      label: 'Export Data',
      description: 'Download attendance + points logs',
      onClick: () => router.push('/exports'),
      gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)',
      icon: ICONS.award,
    },
    {
      label: 'Student Roster',
      description: 'View all enrolled ambassadors',
      onClick: () => router.push('/dashboard/teacher/students'),
      gradient: 'linear-gradient(135deg, #F59E0B, #F97316)',
      icon: ICONS.journal,
    },
    {
      label: 'Reports',
      description: 'Generate progress rollups',
      onClick: () => router.push('/dashboard/teacher/reports'),
      gradient: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
      icon: ICONS.map,
    },
    {
      label: 'Field Sites',
      description: 'Plan next in-person outing',
      onClick: () => router.push('/explore'),
      gradient: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
      icon: ICONS.macro,
    },
  ];

  const cardBaseStyle: CSSProperties = {
    background: 'white',
    borderRadius: '24px',
    padding: '1.5rem',
    border: '1px solid rgba(148,163,184,0.25)',
    boxShadow: '0 25px 55px rgba(15,23,42,0.08)',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 15% 20%, rgba(29,166,219,0.18), transparent 45%), radial-gradient(circle at 85% 0%, rgba(234,126,55,0.15), transparent 40%), #F7FAFF',
        paddingBottom: '4rem',
      }}
    >
      <section
        style={{
          maxWidth: '1200px',
          margin: '1.5rem auto',
          padding: '3rem 2rem',
          borderRadius: '32px',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          background: 'linear-gradient(135deg, #011627 0%, #024059 50%, #0B8BD9 100%)',
          boxShadow: '0 35px 70px rgba(1,22,39,0.45)',
        }}
      >
        <Image
          src="/images/hero/Hero BAckground.jpg"
          alt="Teacher hero"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.15 }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.7)' }}>
            Teacher Command · Wildlife Leadership Academy
          </p>
          <h1 style={{ margin: '0.6rem 0', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', fontWeight: 900 }}>
            Welcome back, {session?.user?.name || 'Mentor'}
          </h1>
          <p style={{ margin: '0 0 1.5rem', color: 'rgba(255,255,255,0.9)', maxWidth: '680px', lineHeight: 1.5 }}>
            Monitor active cohorts, unlock reports, and plan your next conservation field mission from a single dashboard.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard/teacher/classes/new"
              style={{
                textDecoration: 'none',
                padding: '0.9rem 1.5rem',
                borderRadius: '16px',
                background: 'white',
                color: '#011627',
                fontWeight: 700,
              }}
            >
              + Create Class
            </Link>
            <Link
              href="/dashboard/teacher/reports"
              style={{
                textDecoration: 'none',
                padding: '0.9rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.35)',
                color: 'white',
                fontWeight: 700,
              }}
            >
              Open Reports
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {statCards.map((stat) => (
            <div key={stat.label} style={cardBaseStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '18px',
                    background: 'rgba(14,165,233,0.12)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Image src={stat.icon} alt={stat.label} width={38} height={38} style={{ borderRadius: '12px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>{formatNumber(stat.value)}</div>
                  <div style={{ color: '#5E6A82', fontWeight: 600 }}>{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              style={{
                border: 'none',
                borderRadius: '24px',
                padding: '1.5rem',
                textAlign: 'left',
                color: 'white',
                background: action.gradient,
                boxShadow: '0 25px 55px rgba(15,23,42,0.15)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Image src={action.icon} alt={action.label} width={34} height={34} style={{ borderRadius: '10px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{action.label}</div>
                  <p style={{ margin: 0, opacity: 0.85 }}>{action.description}</p>
                </div>
              </div>
              <div style={{ marginTop: '1rem', fontWeight: 700 }}>Open Tool →</div>
            </button>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, color: '#0F172A' }}>My Classes</h2>
          <button
            onClick={() => router.push('/dashboard/teacher/classes/new')}
            style={{
              border: 'none',
              borderRadius: '14px',
              padding: '0.65rem 1.2rem',
              background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Create Class
          </button>
        </div>

        {(classes as DashboardClass[]).length === 0 ? (
          <div style={cardBaseStyle}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '3rem' }}>📚</div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>No classes yet</h3>
              <p style={{ margin: 0, color: '#5E6A82' }}>Create your first WLA class to start awarding points and streaks.</p>
              <button
                onClick={() => router.push('/dashboard/teacher/classes/new')}
                style={{
                  border: 'none',
                  borderRadius: '16px',
                  padding: '0.85rem 1.5rem',
                  background: 'linear-gradient(135deg, #0F766E, #22C55E)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Create Class
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {(classes as DashboardClass[]).map((cls) => {
              const displayName = cls.class_name ?? cls.name ?? 'Class';
              const displayCode = cls.class_code ?? '—';
              const studentCount = cls.student_count ?? 0;
              const isActive = cls.active ?? !cls.archived;

              return (
                <div key={cls.id} style={cardBaseStyle}>
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{displayName}</h3>
                    <p style={{ margin: '0.35rem 0', color: '#5E6A82' }}>{displayCode}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569', fontWeight: 600 }}>
                    <span>{studentCount} students</span>
                  <span
                    style={{
                      padding: '0.35rem 0.9rem',
                      borderRadius: '999px',
                        background: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.2)',
                        color: isActive ? '#15803D' : '#475569',
                      fontSize: '0.85rem',
                    }}
                  >
                      {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/teacher/classes/${cls.id}`)}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '0.85rem',
                    background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Manage Class
                </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ maxWidth: '1200px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div
            style={{
              ...cardBaseStyle,
              background: 'linear-gradient(135deg, #15803D, #22C55E)',
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Field Trip Planner</h3>
                <p style={{ margin: '0.4rem 0 1rem', color: 'rgba(255,255,255,0.8)' }}>
                  Plan immersive experiences at 140+ verified PA habitats.
                </p>
                <button
                  onClick={() => router.push('/explore')}
                  style={{
                    border: 'none',
                    borderRadius: '14px',
                    padding: '0.75rem 1.25rem',
                    background: 'white',
                    color: '#166534',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Browse Field Sites →
                </button>
              </div>
              <div style={{ fontSize: '3.5rem', opacity: 0.3 }}>🗺️</div>
            </div>
          </div>

          <div style={cardBaseStyle}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0F172A' }}>Recent Activity</h3>
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94A3B8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📈</div>
              <p>Student activity insights coming soon.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
