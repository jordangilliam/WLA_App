'use client';
import React from 'react';
import lessons from '../_catalog';
import { LessonView } from '../_Lesson';
import Link from 'next/link';
import { use } from 'react';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const lesson = lessons.find(l => l.id === id);
  const idx = lessons.findIndex(l => l.id === id);
  const nextId = (idx >= 0 && idx < lessons.length - 1) ? lessons[idx + 1].id : null;
  
  if (!lesson) {
    return (
      <section className="section" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
        <h1>Lesson Not Found</h1>
        <p style={{ marginBottom: '2rem', color: '#6C757D' }}>
          The lesson you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/learn"
          style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: 'linear-gradient(135deg, #0077B6, #023047)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ← Back to Learning Center
        </Link>
      </section>
    );
  }

  const handleDone = () => {
    if (nextId) {
      window.location.href = `/learn/${nextId}`;
    } else {
      window.location.href = '/learn';
    }
  };

  return (
    <>
      <div style={{ padding: '1rem 1.5rem', background: '#F8F9FA' }}>
        <Link 
          href="/learn"
          style={{
            color: '#0077B6',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to All Lessons
        </Link>
      </div>
      <LessonView lesson={lesson} onDone={handleDone} />
    </>
  );
}

