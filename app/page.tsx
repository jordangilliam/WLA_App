'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { usePoints } from '@/ui/points/PointsProvider';

const heroStats = [
  { label: 'Field Sites', value: '140+' },
  { label: 'Species IDs', value: '150+' },
  { label: 'Lessons', value: '50+' },
  { label: 'PA Counties', value: '67' },
] as const;

const learningTracks = [
  {
    id: 'brookies',
    emoji: '🎣',
    title: 'Brookies',
    description: 'Champion brook trout and coldwater habitats.',
    gradient: 'linear-gradient(135deg, #1DA6DB 0%, #147FB1 100%)',
    href: '/learn?track=brookies',
  },
  {
    id: 'bass',
    emoji: '🐟',
    title: 'Bass',
    description: 'Protect warm-water fisheries and river systems.',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    href: '/learn?track=bass',
  },
  {
    id: 'bucktails',
    emoji: '🦌',
    title: 'Bucktails',
    description: 'Study white-tailed deer and habitat balance.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    href: '/learn?track=bucktails',
  },
  {
    id: 'gobblers',
    emoji: '🦃',
    title: 'Gobblers',
    description: 'Restore wild turkey populations statewide.',
    gradient: 'linear-gradient(135deg, #EA7E37 0%, #C75E1A 100%)',
    href: '/learn?track=gobblers',
  },
  {
    id: 'ursids',
    emoji: '🐻',
    title: 'Ursids',
    description: 'Track black bear movement and safety plans.',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    href: '/learn?track=ursids',
  },
] as const;

const featureHighlights = [
  {
    title: 'Interactive Maps',
    description: 'Navigate 140+ conservation field sites across Pennsylvania.',
    letter: 'M',
    color: 'linear-gradient(135deg, var(--wla-blue), var(--wla-teal))',
    href: '/explore',
  },
  {
    title: 'Field Journal',
    description: 'Capture photos, notes, and observations in one tap.',
    letter: 'J',
    color: 'linear-gradient(135deg, #EA7E37, #F4A259)',
    href: '/journal-new',
  },
  {
    title: 'Learning Tracks',
    description: 'Guided lessons curated by WLA faculty experts.',
    letter: 'L',
    color: 'linear-gradient(135deg, #7C3AED, #6d28d9)',
    href: '/learn',
  },
  {
    title: 'Achievements',
    description: 'Earn badges, streaks, and leaderboard recognition.',
    letter: 'A',
    color: 'linear-gradient(135deg, #22c55e, #15803d)',
    href: '/achievements',
  },
  {
    title: 'Habitat Tools',
    description: 'Run habitat plans and pollinator simulations.',
    letter: 'H',
    color: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    href: '/habitat',
  },
  {
    title: 'ID Keys',
    description: 'Identify species quickly with interactive keys.',
    letter: 'ID',
    color: 'linear-gradient(135deg, #f97316, #ea580c)',
    href: '/keys',
  },
] as const;

type QuickAction = {
  label: string;
  emoji: string;
  description: string;
  href: string;
  accent?: 'blue' | 'green' | 'gold' | 'purple' | 'sage';
  variant?: 'primary';
};

const quickActions: QuickAction[] = [
  {
    label: 'Check In',
    emoji: '📍',
    description: 'Log a field site visit.',
    href: '/explore?action=checkin',
    variant: 'primary' as const,
  },
  {
    label: 'Explore Map',
    emoji: '🗺️',
    description: 'Find nearby habitats.',
    href: '/explore',
    accent: 'blue' as const,
  },
  {
    label: 'Journal Entry',
    emoji: '📝',
    description: 'Document observations.',
    href: '/journal-new',
    accent: 'green' as const,
  },
  {
    label: 'Achievements',
    emoji: '🏆',
    description: 'Track badges and streaks.',
    href: '/achievements',
    accent: 'gold' as const,
  },
  {
    label: 'Profile',
    emoji: '👤',
    description: 'Review classes and progress.',
    href: '/profile',
    accent: 'sage' as const,
  },
];

const featuredLocations = [
  {
    title: 'Schenley Park',
    description: '456 acres of urban nature in Pittsburgh.',
    href: '/explore?s=schenley',
    accent: 'var(--wla-blue)',
  },
  {
    title: 'Yellow Creek State Park',
    description: '722-acre lake perfect for fisheries studies.',
    href: '/stocking?site=yellow-creek',
    accent: 'var(--wla-orange)',
  },
] as const;

const trackSpotlight = {
  title: 'Brook Trout Steward',
  summary: 'Complete these missions to unlock the Brookies badge.',
  tasks: [
    'Visit a coldwater stream and log a water temp reading.',
    'Upload two macro-invertebrate observations.',
    'Share your conservation plan with your mentor.',
  ],
} as const;

const ctaHighlights = [
  'Student + teacher-ready experiences out of the box.',
  'Optimized for mobile field work and offline visits.',
  'Trusted data from PFBC, DCNR, and WLA experts.',
] as const;

export default function Home() {
  const { data: session, status } = useSession();
  const { total: points, level, currentStreak } = usePoints();

  if (status === 'authenticated') {
    return <LoggedInHome points={points} level={level} streak={currentStreak} />;
  }

  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className="landing-shell">
      <div className="landing-inner">
        <section className="hero-panel">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="hero-badge">Wildlife Leadership Academy · Pennsylvania</span>
              <h1 className="hero-title">
                Lead Pennsylvania&apos;s <span>Next Conservation Wave.</span>
              </h1>
              <p className="hero-text">
                A modern WLA experience for exploring waterways, journaling observations, and earning recognition as a
                statewide conservation leader.
              </p>
              <div className="hero-actions">
                <Link href="/auth" className="hero-primary">
                  Start Your Journey
                </Link>
                <Link href="/explore" className="hero-secondary">
                  Explore Pennsylvania
                </Link>
              </div>
              <div className="hero-metrics">
                {heroStats.map((stat) => (
                  <div className="hero-metric" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <Image
                src="/images/hero/conservation-hero.jpg"
                alt="WLA ambassadors exploring Pennsylvania habitats"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </section>

        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 180" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,160 C240,120 480,40 720,40 C960,40 1200,120 1440,160 L1440,180 L0,180 Z"
              fill="#f8fafc"
              fillOpacity="0.8"
            />
          </svg>
        </div>

        <section className="section">
          <div className="section-heading">
            <p className="hero-badge">Five WLA Learning Tracks</p>
            <h2>Choose Your Conservation Pathway</h2>
            <p>Every track includes field missions, expert lessons, and achievement rewards.</p>
          </div>
          <div className="track-grid">
            {learningTracks.map((track) => (
              <article className="track-card" style={{ background: track.gradient }} key={track.id}>
                <div className="track-emoji" aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                  {track.emoji}
                </div>
                <div className="track-title">{track.title}</div>
                <p className="track-description">{track.description}</p>
                <Link href={track.href} className="track-link">
                  Explore Track →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="hero-badge">Tools Built For Field Work</p>
            <h2>Everything Ambassadors Need in One Hub</h2>
          </div>
          <div className="feature-grid">
            {featureHighlights.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon" style={{ background: feature.color }}>
                  {feature.letter}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link className="feature-link" href={feature.href}>
                  Open {feature.title} →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="cta-panel">
            <p className="hero-badge">Ready for the 2025 Field Season</p>
            <h2>Launch Your Classroom or Field Team Today</h2>
            <p>
              Seamless onboarding for students, mentors, and instructors. Everyone operates from the same trusted WLA
              system.
            </p>
            <div className="cta-actions">
              <Link href="/auth" className="cta-button" style={{ background: 'var(--wla-blue)', color: '#fff' }}>
                Launch Student Account
              </Link>
              <Link href="/admin/dashboard" className="cta-button secondary">
                Visit Teacher HQ
              </Link>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              {ctaHighlights.map((item) => (
                <li key={item} style={{ marginBottom: '0.4rem' }}>
                  ✅ {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function LoggedInHome({ points, level, streak }: { points: number; level: number; streak: number }) {
  const router = useRouter();

  return (
    <div className="dashboard-shell">
      <section className="dashboard-banner">
        <div className="dashboard-content">
          <p className="hero-badge" style={{ background: 'rgba(255,255,255,0.15)' }}>
            Active Ambassador
          </p>
          <h2 className="hero-title" style={{ fontSize: '2.5rem' }}>
            Ready for your next conservation win?
          </h2>
          <p className="hero-text" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 520, margin: '0 auto 1.5rem' }}>
            Keep your streak alive, log observations, and guide your community.
          </p>
          <div className="hero-metrics">
            <div className="hero-metric">
              <strong>{points.toLocaleString()}</strong>
              <span>Total Points</span>
            </div>
            <div className="hero-metric">
              <strong>Lvl {level}</strong>
              <span>Current Rank</span>
            </div>
            <div className="hero-metric">
              <strong>{streak}🔥</strong>
              <span>Day Streak</span>
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          {quickActions.map((action) => {
            const accentClass =
              action.variant === 'primary'
                ? 'primary'
                : action.accent
                ? `accent-${action.accent}`
                : '';
            const actionClass = ['action-card', accentClass].filter(Boolean).join(' ');
            return (
              <button key={action.label} className={actionClass} onClick={() => router.push(action.href)}>
                <div className="action-card__icon" aria-hidden="true">
                  {action.emoji}
                </div>
                <div className="action-card__body">
                  <div className="action-card__title">{action.label}</div>
                  <p className="action-card__desc">{action.description}</p>
                </div>
                <div className="action-card__arrow" aria-hidden="true">
                  →
                </div>
              </button>
            );
          })}
        </div>

        <div className="dashboard-panels">
          <article className="panel-card">
            <div className="panel-header">
              <div>
                <h3 style={{ margin: 0 }}>Featured Locations</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>New data verified weekly</p>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {featuredLocations.map((location) => (
                <li
                  key={location.title}
                  style={{
                    padding: '0.85rem 0',
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{location.title}</div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{location.description}</p>
                  </div>
                  <button
                    onClick={() => router.push(location.href)}
                    style={{
                      background: location.accent,
                      color: '#fff',
                      borderRadius: '999px',
                      padding: '0.4rem 1rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel-card">
            <div className="panel-header">
              <div>
                <h3 style={{ margin: 0 }}>Keep Your Streak</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  One new action per day keeps the fire alive.
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>🔥</div>
            </div>
            <p style={{ marginBottom: '1rem' }}>Visit any site or submit an observation within the next 12 hours.</p>
            <div className="panel-footer">
              <button
                onClick={() => router.push('/explore')}
                style={{ background: 'var(--wla-blue)', color: '#fff' }}
              >
                Find Sites
              </button>
              <button
                onClick={() => router.push('/achievements')}
                style={{ background: '#f3f4f6', color: '#1f2937' }}
              >
                View Badges
              </button>
            </div>
          </article>

          <article className="panel-card">
            <div className="panel-header">
              <div>
                <h3 style={{ margin: 0 }}>Track Spotlight</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{trackSpotlight.title}</p>
              </div>
            </div>
            <p style={{ marginBottom: '1rem' }}>{trackSpotlight.summary}</p>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
              {trackSpotlight.tasks.map((task) => (
                <li key={task} style={{ marginBottom: '0.5rem' }}>
                  {task}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push('/learn')}
              style={{ marginTop: '1rem', width: '100%', background: 'var(--wla-orange)', color: '#fff' }}
            >
              Open Track Missions
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}
