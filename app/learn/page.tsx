'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import lessons from './_catalog';
import { getAllProgress, getProgressStats } from './_progress';

export default function LearnHome(){
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    loadProgress();
    
    // Listen for progress updates
    const handleUpdate = () => loadProgress();
    window.addEventListener('progress-updated', handleUpdate);
    return () => window.removeEventListener('progress-updated', handleUpdate);
  }, []);
  
  const loadProgress = () => {
    const progress = getAllProgress();
    const completed = new Set<string>();
    Object.entries(progress).forEach(([id, data]: [string, any]) => {
      if (data.completed) completed.add(id);
    });
    setCompletedLessons(completed);
    setStats(getProgressStats(lessons));
  };

  const tracks = Array.from(new Set(lessons.map(l=>l.track)));
  const grouped: Record<string, typeof lessons> = {};
  tracks.forEach(t => grouped[t] = lessons.filter(l=>l.track===t));

  const trackColors: Record<string, string> = {
    'Brookies': '#0077B6',
    'Bass': '#06D6A0',
    'Bucktails': '#8B4513',
    'Gobblers': '#9D4EDD',
    'Ursids': '#2C1810',
    'All': '#023047'
  };

  const trackIcons: Record<string, string> = {
    'Brookies': '🐟',
    'Bass': '🎣',
    'Bucktails': '🦌',
    'Gobblers': '🦃',
    'Ursids': '🐻',
    'All': '🌲'
  };

  const trackDescriptions: Record<string, string> = {
    'Brookies': 'Stream ecology, watershed science, and brook trout conservation',
    'Bass': 'Lake ecology, aquatic invasives, and responsible angling',
    'Bucktails': 'Deer ecology, forest management, and wildlife populations',
    'Gobblers': 'Turkey habitat, mast cycles, and predator-prey dynamics',
    'Ursids': 'Black bear ecology, coexistence, and landscape connectivity',
    'All': 'Civic engagement, outreach, and conservation policy'
  };

  const totalLessons = lessons.length;
  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <>
      {/* Hero Section */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, #023047, #0077B6)',
        color: 'white',
        textAlign: 'center',
        padding: '3rem 1.5rem'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>
          📚 WLA Learning Center
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          maxWidth: '700px', 
          margin: '0 auto 2rem',
          opacity: 0.95
        }}>
          Master conservation science, wildlife biology, and PA natural history through interactive lessons and quizzes.
        </p>
        
        {/* Progress Bar */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            fontSize: '0.95rem',
            fontWeight: 600
          }}>
            <span>{completedCount} / {totalLessons} Lessons Completed</span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.3)',
            height: '12px',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06D6A0, #FFB703)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          Choose Your Learning Track
        </h2>
        
        {tracks.map(track=> {
          const trackLessons = grouped[track];
          const trackCompleted = trackLessons.filter(l => completedLessons.has(l.id)).length;
          const trackProgress = Math.round((trackCompleted / trackLessons.length) * 100);
          
          return (
            <div 
              key={track} 
              className="section" 
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '2px solid #E9ECEF',
                overflow: 'hidden',
                marginBottom: '2rem',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Track Header */}
              <div style={{
                background: trackColors[track],
                color: 'white',
                padding: '1.5rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ fontSize: '3rem' }}>{trackIcons[track]}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: 'white', margin: '0 0 0.25rem 0' }}>{track}</h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                    {trackDescriptions[track]}
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700 }}>{trackProgress}%</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Complete</div>
                </div>
              </div>

              {/* Lessons List */}
              <div style={{ padding: '1.5rem 2rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {trackLessons.map(lesson=> {
                    const isCompleted = completedLessons.has(lesson.id);
                    return (
                      <Link 
                        key={lesson.id} 
                        href={`/learn/${lesson.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.5rem',
                          padding: '1.25rem',
                          background: isCompleted ? '#F0FDF4' : '#F8F9FA',
                          borderRadius: '10px',
                          border: `2px solid ${isCompleted ? '#86EFAC' : '#E9ECEF'}`,
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = isCompleted ? '#DCFCE7' : '#E9ECEF';
                          e.currentTarget.style.borderColor = trackColors[track];
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = isCompleted ? '#F0FDF4' : '#F8F9FA';
                          e.currentTarget.style.borderColor = isCompleted ? '#86EFAC' : '#E9ECEF';
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: isCompleted ? '#22C55E' : trackColors[track],
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          flexShrink: 0
                        }}>
                          {isCompleted ? '✓' : trackLessons.indexOf(lesson) + 1}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <h3 style={{ 
                            margin: '0 0 0.25rem 0', 
                            fontSize: '1.1rem',
                            color: '#023047'
                          }}>
                            {lesson.title}
                          </h3>
                          <div style={{ 
                            fontSize: '0.875rem', 
                            color: '#6C757D',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center'
                          }}>
                            <span>⏱️ {lesson.minutes} min</span>
                            {lesson.quiz && lesson.quiz.length > 0 && (
                              <span>✅ {lesson.quiz.length} quiz {lesson.quiz.length === 1 ? 'question' : 'questions'}</span>
                            )}
                            {isCompleted && (
                              <span style={{ 
                                color: '#22C55E', 
                                fontWeight: 600 
                              }}>
                                Completed
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ 
                          fontSize: '1.5rem',
                          color: trackColors[track],
                          flexShrink: 0
                        }}>
                          →
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resources Section */}
      <section className="section" style={{ background: '#F8F9FA', borderRadius: '16px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📖 Additional Resources</h2>
        <div className="row">
          <div className="card section" style={{ flex: 1 }}>
            <h3>🎓 PA State Agencies</h3>
            <ul style={{ lineHeight: 2.2 }}>
              <li><a href="https://www.pa.gov/agencies/pgc/education/" target="_blank" rel="noopener">PA Game Commission Education</a></li>
              <li><a href="https://www.pa.gov/agencies/fishandboat/education/" target="_blank" rel="noopener">PA Fish & Boat Commission</a></li>
              <li><a href="https://www.dcnr.pa.gov/Education/" target="_blank" rel="noopener">DCNR Environmental Education</a></li>
            </ul>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>🔬 Penn State Extension</h3>
            <ul style={{ lineHeight: 2.2 }}>
              <li><a href="https://extension.psu.edu/natural-resources" target="_blank" rel="noopener">Natural Resources</a></li>
              <li><a href="https://extension.psu.edu/wildlife" target="_blank" rel="noopener">Wildlife Resources</a></li>
              <li><a href="https://extension.psu.edu/water-resources" target="_blank" rel="noopener">Water Resources</a></li>
            </ul>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>📋 Academic Standards</h3>
            <ul style={{ lineHeight: 2.2 }}>
              <li><a href="https://www.pa.gov/agencies/education/" target="_blank" rel="noopener">PA Dept. of Education</a></li>
              <li><a href="https://www.pdesas.org/" target="_blank" rel="noopener">SAS (Standards Aligned System)</a></li>
              <li><a href="https://static.pdesas.org/content/documents/academic_standards_for_environment_and_ecology.pdf" target="_blank" rel="noopener">Environment & Ecology Standards</a></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
