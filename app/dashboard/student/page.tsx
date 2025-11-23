'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';

const DEFAULT_BADGE_TARGET = 50;

const ICONS = {
  map: '/images/icons/Map.jpg',
  journal: '/images/icons/journal.jpg',
  award: '/images/icons/award.jpg',
  habitat: '/images/icons/Habitat.png',
  macro: '/images/icons/Micor(Macro).png',
};

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

const formatNumber = (value: number) => value.toLocaleString();

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

      if (classesResult.status === 'rejected' || !classesResult.value.ok) {
        throw new Error('Failed to fetch classes');
      }

      const classesPayload = await classesResult.value.json();
      setClasses(classesPayload.classes || []);

      if (achievementsResult.status === 'fulfilled' && achievementsResult.value.ok) {
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
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(circle at 10% 20%, rgba(29,166,219,0.15), transparent 45%), radial-gradient(circle at 85% 0%, rgba(234,126,55,0.15), transparent 40%), #F5F7FB',
        }}
      >
        <div
          className="animate-spin rounded-full border-4 border-white/20 border-t-white"
          style={{ width: '54px', height: '54px' }}
        />
      </div>
    );
  }

  const rawEarnedBadges = achievementStats ? achievementStats.earned : badges;
  const totalBadgeBaseline = achievementStats?.total ?? 0;
  const totalBadges = totalBadgeBaseline > 0 ? totalBadgeBaseline : Math.max(DEFAULT_BADGE_TARGET, rawEarnedBadges, 1);
  const earnedBadgesCount = Math.min(rawEarnedBadges, totalBadges);
  const badgeProgress = totalBadges === 0 ? 0 : Math.min((earnedBadgesCount / totalBadges) * 100, 100);

  const heroStats = [
    { label: 'Total Points', value: formatNumber(points), icon: ICONS.award },
    { label: 'Active Streak', value: `${currentStreak} days`, icon: ICONS.journal },
    { label: 'Achievements', value: `${earnedBadgesCount}/${totalBadges}`, icon: ICONS.habitat },
    { label: 'Current Level', value: level, icon: ICONS.macro },
  ];

  const quickActions = [
    {
      label: 'Field Check-In',
      description: 'Log a site visit and boost your streak',
      href: '/explore?action=checkin',
      icon: ICONS.map,
      variant: 'primary' as const,
    },
    {
      label: 'Explore Sites',
      description: 'Find trout waters and study habitats',
      href: '/explore',
      icon: ICONS.habitat,
      accent: '#0EA5E9',
    },
    {
      label: 'Field Journal',
      description: 'Capture today’s observations and media',
      href: '/journal-new',
      icon: ICONS.journal,
      accent: '#8B5CF6',
    },
    {
      label: 'Stocking Calendar',
      description: 'Watch PFBC releases statewide',
      href: '/stocking',
      icon: ICONS.award,
      accent: '#F97316',
    },
  ];

  const cardBaseStyle: CSSProperties = {
    background: 'white',
    borderRadius: '26px',
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
          maxWidth: '1100px',
          margin: '1.5rem auto',
          padding: '3rem 2rem',
          borderRadius: '32px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #012A3A 0%, #0369A1 60%, #0EA5E9 100%)',
          boxShadow: '0 35px 70px rgba(1,42,58,0.45)',
        }}
      >
        <Image
          src="/images/hero/Hero BAckground.jpg"
          alt="Dashboard hero"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.12 }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: 0, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
            Student Dashboard · Wildlife Leadership Academy
          </p>
          <h1 style={{ margin: '0.6rem 0', fontSize: 'clamp(2.1rem, 4vw, 3.4rem)', fontWeight: 900 }}>
            Welcome back, {session?.user?.name || 'Ambassador'}
          </h1>
          <p style={{ margin: '0 0 1.5rem', color: 'rgba(255,255,255,0.9)', maxWidth: '640px', lineHeight: 1.5 }}>
            Track your conservation streak, unlock achievements, and jump back into classes or missions with one tap.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link
              href="/explore"
              style={{
                textDecoration: 'none',
                padding: '0.85rem 1.5rem',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              Find Field Sites →
            </Link>
            <Link
              href="/journal-new"
              style={{
                textDecoration: 'none',
                padding: '0.85rem 1.5rem',
                borderRadius: '16px',
                background: 'white',
                color: '#012A3A',
                fontWeight: 600,
              }}
            >
              Update Field Journal
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {heroStats.map((stat) => (
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
                  <Image src={stat.icon} alt={stat.label} width={36} height={36} style={{ borderRadius: '12px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{stat.value}</div>
                  <div style={{ color: '#5E6A82', fontWeight: 600 }}>{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {quickActions.map((action) => {
            const isPrimary = action.variant === 'primary';
            const baseStyle: CSSProperties = {
              borderRadius: '24px',
              padding: '1.5rem',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '0 25px 55px rgba(15,23,42,0.1)',
            };

            const primaryStyle: CSSProperties = {
              background: 'linear-gradient(135deg, #0F766E, #0EA5E9)',
              color: 'white',
            };

            const neutralStyle: CSSProperties = {
              background: 'white',
              border: '1px solid rgba(148,163,184,0.3)',
              color: '#0F172A',
            };

            return (
              <Link key={action.label} href={action.href} style={{ ...baseStyle, ...(isPrimary ? primaryStyle : neutralStyle) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      background: isPrimary ? 'rgba(255,255,255,0.18)' : `${action.accent ?? '#0EA5E9'}1A`,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Image src={action.icon} alt={action.label} width={34} height={34} style={{ borderRadius: '10px' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{action.label}</div>
                    <p style={{ margin: 0, opacity: isPrimary ? 0.85 : 0.75 }}>{action.description}</p>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', fontWeight: 700 }}>{isPrimary ? 'Start Check-In →' : 'Open →'}</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>My Classes</h2>
          <Link
            href="/join-class"
            style={{
              textDecoration: 'none',
              padding: '0.65rem 1.2rem',
              borderRadius: '14px',
              border: '1px solid rgba(14,165,233,0.4)',
              fontWeight: 600,
              color: '#0369A1',
            }}
          >
            + Join Class
          </Link>
        </div>

        {error ? (
          <div
            style={{
              background: 'linear-gradient(120deg, #FEE2E2, #FECACA)',
              borderRadius: '24px',
              padding: '1.5rem',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        ) : classes.length === 0 ? (
          <div style={cardBaseStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '3rem' }}>🎓</div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>No classes yet</h3>
              <p style={{ margin: 0, color: '#5E6A82' }}>Ask your teacher for a class code to unlock assignments.</p>
              <Link
                href="/join-class"
                style={{
                  marginTop: '0.5rem',
                  textDecoration: 'none',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0F766E, #22C55E)',
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                Join a class
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {classes.map((cls) => (
              <div key={cls.id} style={cardBaseStyle}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>{cls.class_name}</h3>
                    <p style={{ margin: '0.35rem 0', color: '#5E6A82' }}>Teacher: {cls.teacher_name}</p>
                    <p style={{ margin: 0, color: '#94A3B8' }}>{cls.organization_name}</p>
                  </div>
                  <Link
                    href={`/dashboard/student/classes/${cls.id}`}
                    style={{
                      textDecoration: 'none',
                      padding: '0.8rem 1.25rem',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #0EA5E9, #0F766E)',
                      color: 'white',
                      fontWeight: 700,
                    }}
                  >
                    View Class →
                  </Link>
                </div>
                {cls.active_assignment_count && cls.active_assignment_count > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(148,163,184,0.3)', color: '#C2410C', fontWeight: 600 }}>
                    📋 {cls.active_assignment_count} active assignment
                    {cls.active_assignment_count > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ maxWidth: '1100px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={cardBaseStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>Keep your streak alive</h3>
                <p style={{ margin: '0.3rem 0 0', color: '#5E6A82' }}>Visit a new site today to maintain your {currentStreak}-day streak.</p>
              </div>
              <div style={{ fontSize: '3rem' }}>🔥</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href="/explore"
                style={{
                  flex: 1,
                  minWidth: '160px',
                  textDecoration: 'none',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0F766E, #22C55E)',
                  color: 'white',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                Find nearby sites
              </Link>
              <Link
                href="/achievements"
                style={{
                  textDecoration: 'none',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(148,163,184,0.4)',
                  color: '#0F172A',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                View progress
              </Link>
            </div>
          </div>

          <Link
            href="/achievements"
            style={{
              ...cardBaseStyle,
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>
                  {earnedBadgesCount} / {totalBadges}
                </div>
                <div style={{ opacity: 0.85 }}>Achievements unlocked</div>
              </div>
              <div style={{ fontSize: '3rem', opacity: 0.3 }}>→</div>
            </div>
            <div style={{ marginTop: '1.5rem', height: '10px', borderRadius: '999px', background: 'rgba(255,255,255,0.3)' }}>
              <div
                style={{
                  width: `${badgeProgress}%`,
                  height: '100%',
                  borderRadius: '999px',
                  background: 'white',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
