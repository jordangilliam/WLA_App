/**
 * Rebuild-systematic themed Learn page
 */

'use client';

import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { LessonCard } from '@/components/lesson/LessonCard';
import { useProgress } from '@/lib/hooks/useProgress';
import { allLessons } from '@/lib/data';
import { TRACKS, type Track } from '@/lib/config/tracks';
import { getPillars, getPillarRecommendations } from '@/lib/data/pillars';
import Link from 'next/link';

const ICONS = {
  book: '/images/icons/Book.png',
  habitat: '/images/icons/Habitat.png',
  macro: '/images/icons/Micor(Macro).png',
  journal: '/images/icons/journal.jpg',
  award: '/images/icons/award.jpg',
};

export default function LearnPage() {
  const { getStats } = useProgress();
  const [selectedTrack, setSelectedTrack] = useState<Track | 'all'>('all');
  const [selectedPillar, setSelectedPillar] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pillars, setPillars] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const stats = getStats();

  // Load pillars on mount
  useEffect(() => {
    const loadedPillars = getPillars();
    setPillars(loadedPillars);
  }, []);

  // Load recommendations when track or pillar changes
  useEffect(() => {
    const tags: string[] = [];
    if (selectedTrack !== 'all') {
      tags.push(selectedTrack.toLowerCase());
    }
    if (selectedPillar !== 'all') {
      tags.push(selectedPillar);
    }

    if (tags.length > 0) {
      const recs = getPillarRecommendations({
        tags,
        types: ['lesson_collection', 'classroom_lesson', 'experience'],
        limit: 6,
      });
      setRecommendations(recs);
    } else {
      setRecommendations([]);
    }
  }, [selectedTrack, selectedPillar]);

  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const matchesTrack = selectedTrack === 'all' || lesson.track === selectedTrack;
      const matchesSearch =
        searchQuery === '' ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // If pillar is selected, filter lessons that match pillar's tracks
      let matchesPillar = true;
      if (selectedPillar !== 'all') {
        const pillar = pillars.find((p) => p.id === selectedPillar);
        if (pillar && pillar.tracks) {
          matchesPillar = pillar.tracks.includes(lesson.track);
        }
      }
      
      return matchesTrack && matchesSearch && matchesPillar;
    });
  }, [selectedTrack, selectedPillar, searchQuery, pillars]);

  const lessonsByTrack = useMemo(() => {
    const grouped: Record<string, typeof allLessons> = {};
    filteredLessons.forEach((lesson) => {
      if (!grouped[lesson.track]) grouped[lesson.track] = [];
      grouped[lesson.track].push(lesson);
    });
    return grouped;
  }, [filteredLessons]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 15% 20%, rgba(29,166,219,0.15), transparent 45%), radial-gradient(circle at 85% 0%, rgba(234,126,55,0.15), transparent 40%), #F9FBFF',
        paddingBottom: '4rem',
      }}
    >
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '1200px',
          margin: '1.5rem auto',
          padding: '3.5rem 2rem',
          borderRadius: '32px',
          color: 'white',
          background: 'linear-gradient(135deg, #023047 0%, #0077B6 55%, #0096C7 100%)',
          boxShadow: '0 25px 60px rgba(2,48,71,0.35)',
        }}
      >
        <Image src="/images/hero/Hero BAckground.jpg" alt="Learning hero" fill priority style={{ objectFit: 'cover', opacity: 0.18 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1.5rem',
              background: 'rgba(255,214,10,0.9)',
              color: '#023047',
              borderRadius: '999px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <Image src={ICONS.book} alt="Learning badge" width={26} height={26} style={{ borderRadius: '8px' }} />
            WLA Lesson Tracks
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.6rem, 4vw, 4rem)',
              fontWeight: 900,
              margin: '1rem auto',
              maxWidth: '820px',
              textShadow: '0 12px 30px rgba(0,0,0,0.3)',
            }}
          >
            Become Pennsylvania&apos;s Next Conservation Expert
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              maxWidth: '760px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Follow structured tracks built by WLA mentors—covering fisheries, forests, pollinators, policy, and storytelling—and earn badges as you master each topic.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.5rem',
              padding: '1.5rem',
              borderRadius: '26px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {[
              { label: 'Lessons Completed', value: stats.completed },
              { label: 'In Progress', value: stats.inProgress },
              { label: 'Avg Score', value: `${stats.avgScore}%` },
              { label: 'Tracks', value: Object.keys(lessonsByTrack).length },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900 }}>{stat.value}</div>
                <div style={{ opacity: 0.85, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '28px',
            padding: '2rem',
            boxShadow: '0 24px 50px rgba(15,23,42,0.08)',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#012A3A' }}>Browse Tracks & Pillars</h2>
              <p style={{ margin: '0.3rem 0 0', color: '#5E6A82' }}>Search by topic, track, or pillar to focus your learning journey.</p>
            </div>
            
            {/* Track Filters */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {[
                { key: 'all', label: 'All Tracks', gradient: 'linear-gradient(120deg,#0EA5E9,#0369A1)' },
                ...Object.values(TRACKS)
                  .filter((t) => t.id !== 'All')
                  .map((track) => ({ key: track.id, label: `${track.emoji} ${track.name}`, gradient: track.gradient })),
              ].map((track) => {
                const active = selectedTrack === track.key;
                return (
                  <button
                    key={track.key}
                    onClick={() => setSelectedTrack(track.key as Track | 'all')}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(148,163,184,0.4)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: active ? track.gradient : 'white',
                      color: active ? 'white' : '#0F172A',
                      boxShadow: active ? '0 12px 25px rgba(15,23,42,0.15)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {track.label}
                  </button>
                );
              })}
            </div>

            {/* Pillar Filters */}
            {pillars.length > 0 && (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', title: 'All Pillars', icon: '🌟' },
                  ...pillars.map((p) => ({
                    id: p.id,
                    title: p.title,
                    icon: p.id === 'species' ? '🦌' : p.id === 'waterways' ? '🌊' : p.id === 'food_systems' ? '🌽' : p.id === 'micro_macro' ? '🧪' : p.id === 'industry_artifacts' ? '🏭' : '📜',
                  })),
                ].map((pillar) => {
                  const active = selectedPillar === pillar.id;
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => setSelectedPillar(pillar.id)}
                      style={{
                        padding: '0.5rem 1.1rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(148,163,184,0.4)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: active ? 'linear-gradient(120deg,#8B5CF6,#6366F1)' : 'white',
                        color: active ? 'white' : '#0F172A',
                        boxShadow: active ? '0 12px 25px rgba(15,23,42,0.15)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {pillar.icon} {pillar.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Search lessons by topic, species, or mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              fontSize: '1rem',
              boxShadow: 'inset 0 1px 4px rgba(15,23,42,0.05)',
              marginTop: '1.2rem',
            }}
          />
        </div>

        {Object.entries(lessonsByTrack).map(([track, lessons]) => {
          const trackInfo = TRACKS[track as Track];
          return (
            <div
              key={track}
              style={{
                background: 'white',
                borderRadius: '26px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 24px 50px rgba(15,23,42,0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ width: '4px', height: '40px', borderRadius: '999px', background: trackInfo.gradient }} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 800, color: '#0F172A' }}>
                    {trackInfo.emoji} {trackInfo.name}
                  </h2>
                  <p style={{ margin: 0, color: '#556079' }}>{trackInfo.description}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {lessons.map((lesson, idx) => (
                  <LessonCard key={lesson.id} lesson={lesson} trackColor={trackInfo.color} index={idx} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div
            style={{
              background: 'white',
              borderRadius: '26px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 24px 50px rgba(15,23,42,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem' }}>💡</div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>Recommended Content</h2>
                <p style={{ margin: '0.3rem 0 0', color: '#5E6A82' }}>Based on your selected track and pillar</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {recommendations.map((rec) => {
                const linkPath = rec.path?.startsWith('/') ? rec.path : rec.path?.startsWith('app/') ? `/${rec.path.replace(/^app\//, '').replace(/\/page\.tsx$/, '')}` : '/learn';
                return (
                  <Link
                    key={rec.id}
                    href={linkPath}
                    style={{
                      display: 'block',
                      padding: '1.25rem',
                      borderRadius: '16px',
                      border: '1px solid rgba(148,163,184,0.3)',
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(99,102,241,0.05))',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(15,23,42,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                      <div style={{ fontSize: '1.5rem' }}>
                        {rec.type === 'lesson_collection' ? '📚' : rec.type === 'experience' ? '🎮' : rec.type === 'data_set' ? '📊' : '📝'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                          {rec.name}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', marginBottom: '0.5rem' }}>
                          {rec.pillarTitle}
                        </p>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {rec.coverageTags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: '0.65rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: 'rgba(139,92,246,0.1)',
                                color: '#6366F1',
                                fontWeight: 600,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {filteredLessons.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#64748B',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
            }}
          >
            <Image src={ICONS.macro} alt="Empty search" width={68} height={68} style={{ borderRadius: '16px' }} />
            <h3 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>No lessons found</h3>
            <p>Try adjusting your search terms, track, or pillar selection.</p>
            {recommendations.length > 0 && (
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748B' }}>
                Check out the recommended content above for related learning materials!
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
