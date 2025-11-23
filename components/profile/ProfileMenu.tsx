'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePoints } from '@/ui/points/PointsProvider';
import SoundSettings from '@/components/settings/SoundSettings';

const ICONS = {
  map: '/images/icons/Map.jpg',
  journal: '/images/icons/journal.jpg',
  award: '/images/icons/award.jpg',
  habitat: '/images/icons/Habitat.png',
  book: '/images/icons/Book.png',
  macro: '/images/icons/Micor(Macro).png',
};

type SectionKey = 'progress' | 'learn' | 'settings';

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const { total: points, level, currentStreak, badges } = usePoints();
  const [activeSection, setActiveSection] = useState<SectionKey>('progress');

  const user = session?.user as { role?: string; name?: string; email?: string } | undefined;
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  const formatNumber = (value: number) => value.toLocaleString();

  if (status === 'loading') {
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

  if (status === 'unauthenticated') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at 20% 20%, rgba(29,166,219,0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(234,126,55,0.18), transparent 45%), #F9FBFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'white',
            borderRadius: '28px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 30px 70px rgba(15,23,42,0.12)',
          }}
        >
          <Image src={ICONS.habitat} alt="WLA badge" width={72} height={72} style={{ borderRadius: '18px', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>Sign in to unlock your WLA journey</h2>
          <p style={{ color: '#5E6A82', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Track achievements, field journals, and teacher tools in the new Wildlife Leadership Academy app experience.
          </p>
          <Link
            href="/auth"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '0.95rem 1.25rem',
              borderRadius: '18px',
              background: 'linear-gradient(120deg, #0EA5E9, #0F766E)',
              color: 'white',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 18px 40px rgba(14,165,233,0.35)',
            }}
          >
            Start your session →
          </Link>
        </div>
      </div>
    );
  }

  const heroStats = [
    { label: 'Points', value: formatNumber(points), icon: ICONS.award },
    { label: 'Day Streak', value: `${currentStreak} days`, icon: ICONS.journal },
    { label: 'Level', value: level, icon: ICONS.macro },
    { label: 'Badges', value: badges, icon: ICONS.habitat },
  ];

  const progressCards = [
    {
      href: '/collections',
      title: 'My Collection',
      description: 'Sites visited and species observed',
      icon: ICONS.map,
    },
    {
      href: '/journal-new',
      title: 'Visit History',
      description: 'Browse every field journal entry',
      icon: ICONS.journal,
    },
    {
      href: '/achievements',
      title: 'Achievements',
      description: `${badges} badges earned so far`,
      icon: ICONS.award,
    },
  ];

  if (isTeacher) {
    progressCards.push({
      href: '/dashboard/teacher',
      title: 'Teacher Dashboard',
      description: 'Manage classes, progress, and missions',
      icon: ICONS.habitat,
    });
  }

  const learnSections = [
    {
      title: 'Educational Modules',
      icon: ICONS.book,
      links: [
        { href: '/birds', label: '🦜 Birds' },
        { href: '/fishing', label: '🎣 Fishing' },
        { href: '/gobblers', label: '🦃 Gobblers' },
        { href: '/terrestrials', label: '🦌 Terrestrials' },
      ],
    },
    {
      title: 'Identification Keys',
      icon: ICONS.macro,
      links: [
        { href: '/keys/macro', label: '🔬 Macroinvertebrates' },
        { href: '/keys/plants', label: '🌿 Plants' },
        { href: '/keys/bugs', label: '🐛 Bugs' },
        { href: '/keys/insects', label: '🦋 Insects' },
      ],
    },
    {
      title: 'Additional Resources',
      icon: ICONS.map,
      links: [
        { href: '/habitat', label: '🏕️ Habitat' },
        { href: '/stocking', label: '🎣 Stocking Calendar' },
        { href: '/outreach', label: '📢 Outreach' },
        { href: '/media', label: '🎥 Media Library' },
      ],
    },
  ];

  const toolLinks = [
    { href: '/exports', label: '💾 Export Data' },
    ...(isAdmin ? [{ href: '/admin/dashboard', label: '⚙️ Admin Dashboard' }] : []),
  ];

  const navButtons: { id: SectionKey; label: string; emoji: string }[] = [
    { id: 'progress', label: 'Progress Deck', emoji: '📊' },
    { id: 'learn', label: 'Learning Hub', emoji: '🌱' },
    { id: 'settings', label: 'Profile & Settings', emoji: '⚙️' },
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
          'radial-gradient(circle at 10% 20%, rgba(29,166,219,0.15), transparent 45%), radial-gradient(circle at 85% 0%, rgba(234,126,55,0.18), transparent 40%), #F7FAFF',
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
          alt="Profile hero"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.12 }}
        />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '28px',
                background: 'rgba(255,255,255,0.18)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
            >
              {(session?.user?.name || 'WLA')[0]}
            </div>
            <div>
              <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                Wildlife Leadership Academy
              </p>
              <h1 style={{ margin: '0.25rem 0 0.35rem', fontSize: '2.45rem', fontWeight: 900 }}>{session?.user?.name || 'Student'}</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>{session?.user?.email}</p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '26px',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {heroStats.map((stat) => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Image src={stat.icon} alt={stat.label} width={34} height={34} style={{ borderRadius: '12px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          gap: '0.75rem',
          padding: '0 1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {navButtons.map((nav) => {
          const active = activeSection === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => setActiveSection(nav.id)}
              style={{
                flex: '1 1 200px',
                border: 'none',
                borderRadius: '999px',
                padding: '0.85rem 1.4rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: active ? '#012A3A' : 'rgba(255,255,255,0.85)',
                color: active ? 'white' : '#0F172A',
                boxShadow: active ? '0 15px 35px rgba(1,42,58,0.35)' : '0 10px 25px rgba(15,23,42,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{nav.emoji}</span>
              {nav.label}
            </button>
          );
        })}
      </div>

      <section style={{ maxWidth: '1100px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        {activeSection === 'progress' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {progressCards.map((card) => (
              <Link key={card.title} href={card.href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    ...cardBaseStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.1rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '18px',
                      background: 'rgba(14,165,233,0.12)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Image src={card.icon} alt={card.title} width={38} height={38} style={{ borderRadius: '12px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>{card.title}</div>
                    <p style={{ margin: 0, color: '#5E6A82' }}>{card.description}</p>
                  </div>
                  <div style={{ fontSize: '1.4rem', color: '#94A3B8' }}>→</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeSection === 'learn' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {learnSections.map((section) => (
              <div key={section.title} style={cardBaseStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <Image src={section.icon} alt={section.title} width={40} height={40} style={{ borderRadius: '12px' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{section.title}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{
                        textDecoration: 'none',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '14px',
                        background: 'rgba(241,245,249,0.8)',
                        color: '#0F172A',
                        fontWeight: 600,
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'settings' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={cardBaseStyle}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Account Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                <div style={{ color: '#5E6A82' }}>Email</div>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{session?.user?.email}</div>
                <div style={{ color: '#5E6A82' }}>Role</div>
                <div style={{ fontWeight: 600, color: '#0F172A', textTransform: 'capitalize' }}>{user?.role || 'student'}</div>
              </div>
            </div>

            <div style={cardBaseStyle}>
              <SoundSettings />
            </div>

            {(isTeacher || isAdmin) && toolLinks.length > 0 && (
              <div style={cardBaseStyle}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Mentor Tools</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{
                        textDecoration: 'none',
                        padding: '0.65rem 1rem',
                        borderRadius: '14px',
                        border: '1px solid rgba(148,163,184,0.4)',
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={cardBaseStyle}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Help & Info</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                <a
                  href="https://wildlifeleadershipacademy.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    padding: '0.65rem 1rem',
                    borderRadius: '14px',
                    background: 'rgba(16,185,129,0.12)',
                    color: '#065F46',
                    fontWeight: 600,
                  }}
                >
                  🌲 WLA Website
                </a>
                <Link
                  href="/offline"
                  style={{
                    textDecoration: 'none',
                    padding: '0.65rem 1rem',
                    borderRadius: '14px',
                    background: 'rgba(14,165,233,0.12)',
                    color: '#0369A1',
                    fontWeight: 600,
                  }}
                >
                  📱 Offline Mode
                </Link>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                border: 'none',
                borderRadius: '22px',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'white',
                background: 'linear-gradient(120deg, #DC2626, #B91C1C)',
                cursor: 'pointer',
                boxShadow: '0 25px 45px rgba(220,38,38,0.35)',
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
