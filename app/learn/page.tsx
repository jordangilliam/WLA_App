/**
 * Modern Learn page with track-based organization
 */

'use client';

import { useState, useMemo } from 'react';
import { LessonCard } from '@/components/lesson/LessonCard';
import { useProgress } from '@/lib/hooks/useProgress';
import { allLessons } from '@/lib/data';
import { TRACKS, type Track } from '@/lib/config/tracks';
// import ConservationHistorySection from '@/components/ConservationHistorySection';
// import { FISHING_CONSERVATION_HISTORY } from '@/lib/data/conservation-history';

export default function LearnPage() {
  const { progress, getStats } = useProgress();
  const [selectedTrack, setSelectedTrack] = useState<Track | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getStats();

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return allLessons.filter(lesson => {
      const matchesTrack = selectedTrack === 'all' || lesson.track === selectedTrack;
      const matchesSearch = searchQuery === '' || 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTrack && matchesSearch;
    });
  }, [selectedTrack, searchQuery]);

  // Group by track
  const lessonsByTrack = useMemo(() => {
    const grouped: Record<string, typeof allLessons> = {};
    filteredLessons.forEach(lesson => {
      if (!grouped[lesson.track]) {
        grouped[lesson.track] = [];
      }
      grouped[lesson.track].push(lesson);
    });
    return grouped;
  }, [filteredLessons]);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0077B6, #023047)',
        color: 'white',
        padding: '3rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            color: 'white',
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            🌲 Conservation Learning
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            textAlign: 'center',
            opacity: 0.95,
            maxWidth: '700px',
            margin: '0 auto 2rem',
          }}>
            Explore PA&apos;s rich conservation heritage through hands-on learning
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.completed}</div>
              <div style={{ opacity: 0.9 }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.inProgress}</div>
              <div style={{ opacity: 0.9 }}>In Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.avgScore}%</div>
              <div style={{ opacity: 0.9 }}>Avg Score</div>
          </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Filters */}
        <div style={{ marginBottom: '2rem' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1rem',
              border: '2px solid #E5E7EB',
              borderRadius: '12px',
              marginBottom: '1rem',
            }}
          />

          {/* Track Filters */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setSelectedTrack('all')}
              style={{
                padding: '0.75rem 1.5rem',
                background: selectedTrack === 'all' ? 'linear-gradient(135deg, #0077B6, #023047)' : 'white',
                color: selectedTrack === 'all' ? 'white' : '#374151',
                border: '2px solid #E5E7EB',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
            >
              All Tracks
            </button>
            
            {Object.values(TRACKS).filter(t => t.id !== 'All').map(track => (
            <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: selectedTrack === track.id ? track.gradient : 'white',
                  color: selectedTrack === track.id ? 'white' : '#374151',
                  border: '2px solid #E5E7EB',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                }}
              >
                {track.emoji} {track.name}
            </button>
          ))}
        </div>
        </div>

        {/* Lessons by Track */}
        {Object.entries(lessonsByTrack).map(([track, lessons]) => {
          const trackInfo = TRACKS[track as Track];
          
          return (
            <div key={track} style={{ marginBottom: '3rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}>
              <div style={{ 
                  width: '4px',
                  height: '32px',
                  background: trackInfo.gradient,
                  borderRadius: '999px',
                }} />
                <div>
                  <h2 style={{ 
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    margin: 0,
                    color: '#111827',
                  }}>
                    {trackInfo.emoji} {trackInfo.name}
                  </h2>
                  <p style={{
                    margin: 0,
                    color: '#6B7280',
                    fontSize: '0.95rem',
                  }}>
                    {trackInfo.description}
                  </p>
                </div>
                  </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                {lessons.map((lesson, idx) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    trackColor={trackInfo.color}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#6B7280',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No lessons found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Conservation History Section - Temporarily disabled for debugging */}
      {/* {(selectedTrack === 'all' || selectedTrack === 'Brookies' || selectedTrack === 'Bass') && (
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem 3rem',
        }}>
          <ConservationHistorySection history={FISHING_CONSERVATION_HISTORY} />
        </section>
      )} */}
    </div>
  );
}

