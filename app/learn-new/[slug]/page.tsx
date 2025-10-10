/**
 * Individual lesson page
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LessonDisplay } from '@/components/lesson/LessonDisplay';
import { sampleLessons } from '@/lib/data/sample-lessons';
import { getTrackColor } from '@/lib/config/tracks';

export default function LessonPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;

  const lesson = sampleLessons.find(l => l.slug === slug);

  if (!lesson) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '4rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📚</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Lesson Not Found</h1>
        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
          The lesson you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/learn-new"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #0077B6, #023047)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ← Back to Learning Center
        </Link>
      </div>
    );
  }

  const trackColor = getTrackColor(lesson.track);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div style={{
        background: '#F9FAFB',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link
            href="/learn-new"
            style={{
              color: '#0077B6',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            ← Back to All Lessons
          </Link>
        </div>
      </div>

      {/* Lesson Content */}
      <LessonDisplay lesson={lesson} trackColor={trackColor} />
    </>
  );
}

