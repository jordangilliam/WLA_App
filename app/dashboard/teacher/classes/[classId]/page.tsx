'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import TeacherNav from '@/components/dashboard/TeacherNav';
import StudentProgressCard from '@/components/dashboard/StudentProgressCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import type { 
  Class, 
  ClassRosterStudent, 
  ClassOverview 
} from '@/lib/types/dashboard.types';

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
      return;
    }

    if (status === 'authenticated' && classId) {
      fetchClassData();
    }
  }, [status, classId, router]);

  const fetchClassData = async () => {
    try {
      // Fetch class details
      const classResponse = await fetch(`/api/classes/${classId}`);
      if (classResponse.ok) {
        const classResult = await classResponse.json();
        setClassData(classResult.data);
      }

      // Fetch students
      const studentsResponse = await fetch(`/api/classes/${classId}/students`);
      if (studentsResponse.ok) {
        const studentsResult = await studentsResponse.json();
        setStudents(studentsResult.data || []);
      }

      // Fetch progress overview
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
  };

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
        fetchClassData(); // Refresh
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
      const response = await fetch(
        `/api/classes/${classId}/students?studentId=${studentId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        fetchClassData(); // Refresh
      } else {
        alert('Failed to remove student');
      }
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Error removing student');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8F4F8 0%, #F0F9F4 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <div style={{ fontSize: '1.25rem', color: '#6B7280' }}>Loading class...</div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8F4F8 0%, #F0F9F4 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <div style={{ fontSize: '1.25rem', color: '#6B7280' }}>Class not found</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E8F4F8 0%, #F0F9F4 25%, #FFF8E7 50%, #F4F1E8 75%, #E3F2E1 100%)',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
        }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3B82F6',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            ← Back to Dashboard
          </button>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1E40AF',
            marginBottom: '0.5rem',
          }}>
            {classData.name}
          </h1>
          
          {classData.description && (
            <p style={{
              fontSize: '1.125rem',
              color: '#6B7280',
              marginBottom: '1rem',
            }}>
              {classData.description}
            </p>
          )}

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            fontSize: '0.875rem',
            color: '#6B7280',
          }}>
            {classData.grade_level && <span>📚 Grade {classData.grade_level}</span>}
            {classData.subject && <span>🔬 {classData.subject}</span>}
            {classData.school_name && <span>🏫 {classData.school_name}</span>}
            <span style={{
              background: '#DBEAFE',
              color: '#1E40AF',
              padding: '0.25rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 700,
            }}>
              Class Code: {classData.class_code}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <TeacherNav />

        {/* Stats Overview */}
        {overview && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #10B981',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>
                {overview.student_count}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Students
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #F59E0B',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>
                {overview.active_students_week}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Active This Week
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #8B5CF6',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8B5CF6' }}>
                {overview.assignments_count}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Assignments
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #EF4444',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#EF4444' }}>
                {overview.pending_submissions}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Pending Review
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem',
        }}>
          {/* Students Section */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1E40AF',
              }}>
                👥 Class Roster ({students.length})
              </h2>

              <button
                onClick={() => setShowAddStudent(!showAddStudent)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ➕ Add Student
              </button>
            </div>

            {/* Add Student Form */}
            {showAddStudent && (
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: '1rem',
                }}>
                  Add Student to Class
                </h3>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="email"
                    placeholder="Student email address"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '1rem',
                    }}
                  />
                  <button
                    onClick={handleAddStudent}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddStudent(false)}
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#6B7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <p style={{
                  marginTop: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                }}>
                  Student must have an existing WildPraxis account to be added.
                </p>
              </div>
            )}

            {/* Student Cards */}
            {students.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '3rem 2rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: '0.5rem',
                }}>
                  No Students Yet
                </h3>
                <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                  Students can join using class code: <strong>{classData.class_code}</strong>
                </p>
                <button
                  onClick={() => setShowAddStudent(true)}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ➕ Add First Student
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}>
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

          {/* Activity Feed Sidebar */}
          <div>
            {overview && <ActivityFeed activities={overview.recent_activity} />}
          </div>
        </div>
      </div>
    </div>
  );
}

