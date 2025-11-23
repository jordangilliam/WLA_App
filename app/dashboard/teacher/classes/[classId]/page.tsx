'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import TeacherNav from '@/components/dashboard/TeacherNav';
import StudentProgressCard from '@/components/dashboard/StudentProgressCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import type { Class, ClassRosterStudent, ClassOverview } from '@/lib/types/dashboard.types';

// Force dynamic rendering - requires authentication
export const dynamic = 'force-dynamic';

const ICONS = {
  code: '/images/icons/Map.jpg',
  roster: '/images/icons/Habitat.png',
  subject: '/images/icons/journal.jpg',
  school: '/images/icons/Book.png',
};

type DashboardClass = Class & {
  class_name?: string;
  student_count?: number;
  active?: boolean;
};

export default function ClassDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const classId = params?.classId as string;

  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<ClassRosterStudent[]>([]);
  const [overview, setOverview] = useState<ClassOverview | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const fetchClassData = useCallback(async () => {
    try {
      const classResponse = await fetch(`/api/classes/${classId}`);
      if (classResponse.ok) {
        const classResult = await classResponse.json();
        setClassData(classResult.data);
      }

      const studentsResponse = await fetch(`/api/classes/${classId}/students`);
      if (studentsResponse.ok) {
        const studentsResult = await studentsResponse.json();
        setStudents(studentsResult.data || []);
      }

      const progressResponse = await fetch(`/api/classes/${classId}/progress`);
      if (progressResponse.ok) {
        const progressResult = await progressResponse.json();
        setOverview(progressResult.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching class data:', error);
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
      return;
    }

    if (status === 'authenticated' && classId) {
      fetchClassData();
    }
  }, [status, classId, router, fetchClassData]);

  const handleAddStudent = async () => {
    if (!newStudentEmail.trim()) return;

    try {
      const response = await fetch(`/api/classes/${classId}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_email: newStudentEmail }),
      });

      if (response.ok) {
        setNewStudentEmail('');
        setShowAddStudent(false);
        fetchClassData();
      } else {
        alert('Failed to add student. Make sure the email is correct.');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!confirm('Are you sure you want to remove this student from the class?')) {
      return;
    }

    try {
      const response = await fetch(`/api/classes/${classId}/students?studentId=${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClassData();
      } else {
        alert('Failed to remove student');
      }
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Error removing student');
    }
  };

  const pageBackground = {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at 15% 20%, rgba(29,166,219,0.16), transparent 45%), radial-gradient(circle at 80% 0%, rgba(234,126,55,0.15), transparent 45%), #F7FAFF',
    paddingBottom: '4rem',
  } as const;

  if (status === 'loading' || loading) {
    return (
      <div style={pageBackground}>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
          <div
            className="animate-spin rounded-full border-4 border-white/20 border-t-white"
            style={{ width: '58px', height: '58px' }}
          />
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div style={pageBackground}>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', textAlign: 'center', color: '#475569' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <p>Class not found</p>
        </div>
      </div>
    );
  }

  const heroMetrics = [
    { label: 'Class Code', value: classData.class_code, icon: ICONS.code },
    classData.grade_level ? { label: 'Grade', value: classData.grade_level, icon: ICONS.roster } : null,
    classData.subject ? { label: 'Subject', value: classData.subject, icon: ICONS.subject } : null,
    classData.school_name ? { label: 'School', value: classData.school_name, icon: ICONS.school } : null,
  ].filter(Boolean) as { label: string; value: string; icon: string }[];

  const overviewStats = [
    { label: 'Students', value: overview?.student_count ?? students.length, accent: '#0EA5E9' },
    { label: 'Active This Week', value: overview?.active_students_week ?? '—', accent: '#22C55E' },
    { label: 'Assignments', value: overview?.assignments_count ?? '—', accent: '#F97316' },
    { label: 'Pending Reviews', value: overview?.pending_submissions ?? '—', accent: '#A855F7' },
  ];

  const cardBaseStyle = {
    background: 'white',
    borderRadius: '24px',
    padding: '1.75rem',
    border: '1px solid rgba(148,163,184,0.2)',
    boxShadow: '0 20px 55px rgba(15,23,42,0.08)',
  } as const;

  return (
    <div style={pageBackground}>
      <section
        style={{
          maxWidth: '1200px',
          margin: '1.5rem auto',
          padding: '3rem 2rem',
          borderRadius: '32px',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          background: 'linear-gradient(135deg, #01111F 0%, #023047 55%, #0EA5E9 100%)',
          boxShadow: '0 35px 70px rgba(1,17,31,0.45)',
        }}
      >
        <Image src="/images/hero/Hero BAckground.jpg" alt="Class hero" fill priority style={{ objectFit: 'cover', opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => router.back()}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            ← Back to Dashboard
          </button>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.7)' }}>Conservation Cohort</p>
          <h1 style={{ margin: '0.4rem 0', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', fontWeight: 900 }}>{classData.name}</h1>
          {classData.description && (
            <p style={{ margin: '0 0 1.25rem', color: 'rgba(255,255,255,0.88)', maxWidth: '680px', lineHeight: 1.5 }}>{classData.description}</p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {heroMetrics.map((metric) => (
              <div key={metric.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.12)', borderRadius: '18px', padding: '0.75rem 1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Image src={metric.icon} alt={metric.label} width={36} height={36} style={{ borderRadius: '10px' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>{metric.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <TeacherNav />
      </section>

      <section style={{ maxWidth: '1200px', margin: '1.5rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {overviewStats.map((stat) => (
            <div key={stat.label} style={cardBaseStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748B', fontWeight: 700 }}>{stat.label}</span>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>{stat.value}</span>
                <div style={{ width: '50px', height: '4px', borderRadius: '999px', background: `${stat.accent}33`, marginTop: '0.25rem' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '999px', background: stat.accent }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={cardBaseStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>Class Roster ({students.length})</h2>
                <p style={{ margin: '0.3rem 0 0', color: '#5E6A82' }}>Manage WildPraxis ambassadors enrolled in this class.</p>
              </div>
              <button
                onClick={() => setShowAddStudent((prev) => !prev)}
                style={{
                  border: 'none',
                  borderRadius: '14px',
                  padding: '0.65rem 1.25rem',
                  background: 'linear-gradient(135deg, #22C55E, #0F766E)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {showAddStudent ? 'Close' : 'Add Student'}
              </button>
            </div>

            {showAddStudent && (
              <div style={{ borderRadius: '18px', padding: '1.25rem', background: 'rgba(15,118,110,0.06)', marginBottom: '1.5rem', border: '1px solid rgba(15,118,110,0.15)' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F766E', marginBottom: '0.75rem' }}>Invite a student</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <input
                    type="email"
                    placeholder="Student email address"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    style={{ flex: '1 1 220px', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.5)', fontSize: '1rem' }}
                  />
                  <button
                    onClick={handleAddStudent}
                    style={{
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.85rem 1.5rem',
                      background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                      color: 'white',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddStudent(false)}
                    style={{
                      border: '1px solid rgba(148,163,184,0.5)',
                      borderRadius: '12px',
                      padding: '0.85rem 1.25rem',
                      background: 'white',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <p style={{ marginTop: '0.6rem', fontSize: '0.9rem', color: '#475569' }}>Students must already have a WildPraxis login before being invited.</p>
              </div>
            )}

            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem', borderRadius: '20px', border: '1px dashed rgba(148,163,184,0.4)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>👥</div>
                <p style={{ color: '#475569', marginBottom: '1rem' }}>Share class code <strong>{classData.class_code}</strong> to invite your first ambassador.</p>
                <button
                  onClick={() => setShowAddStudent(true)}
                  style={{ border: 'none', borderRadius: '14px', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #22C55E, #0F766E)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                >
                  Add Student
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {students.map((student) => (
                  <StudentProgressCard
                    key={student.student_id}
                    student={student}
                    onViewDetails={() => router.push(`/dashboard/teacher/students/${student.student_id}`)}
                    onRemove={() => handleRemoveStudent(student.student_id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={cardBaseStyle}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.75rem' }}>Class essentials</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#475569' }}>
                <li>🎯 Grade level: {classData.grade_level || 'Not set'}</li>
                <li>📘 Subject focus: {classData.subject || 'Conservation Studies'}</li>
                <li>🏫 {classData.school_name || 'Independent cohort'}</li>
              </ul>
            </div>

            {overview && <ActivityFeed activities={overview.recent_activity ?? []} />}
          </div>
        </div>
      </section>
    </div>
  );
}
