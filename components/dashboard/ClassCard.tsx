'use client';

import React from 'react';
import Link from 'next/link';
import type { Class } from '@/lib/types/dashboard.types';

interface ClassCardProps {
  classData: Class;
  studentCount: number;
  activeStudents: number;
  pendingSubmissions?: number;
}

export default function ClassCard({
  classData,
  studentCount,
  activeStudents,
  pendingSubmissions = 0,
}: ClassCardProps) {
  const activePercentage = studentCount > 0 
    ? Math.round((activeStudents / studentCount) * 100) 
    : 0;

  return (
    <Link
      href={`/dashboard/teacher/classes/${classData.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid transparent',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.3)';
          e.currentTarget.style.borderColor = '#3B82F6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = 'transparent';
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1E40AF',
            }}>
              {classData.name}
            </h3>
            {classData.description && (
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#6B7280',
                lineHeight: '1.4',
              }}>
                {classData.description}
              </p>
            )}
          </div>
          <div style={{
            background: '#DBEAFE',
            color: '#1E40AF',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            marginLeft: '1rem',
          }}>
            {classData.class_code}
          </div>
        </div>

        {/* Metadata */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #E5E7EB',
        }}>
          {classData.grade_level && (
            <span style={{
              fontSize: '0.875rem',
              color: '#6B7280',
            }}>
              📚 Grade {classData.grade_level}
            </span>
          )}
          {classData.subject && (
            <span style={{
              fontSize: '0.875rem',
              color: '#6B7280',
            }}>
              🔬 {classData.subject}
            </span>
          )}
          {classData.school_name && (
            <span style={{
              fontSize: '0.875rem',
              color: '#6B7280',
            }}>
              🏫 {classData.school_name}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}>
          <div style={{
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#10B981',
              marginBottom: '0.25rem',
            }}>
              {studentCount}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Students
            </div>
          </div>

          <div style={{
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#F59E0B',
              marginBottom: '0.25rem',
            }}>
              {activePercentage}%
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Active
            </div>
          </div>

          <div style={{
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: pendingSubmissions > 0 ? '#EF4444' : '#6B7280',
              marginBottom: '0.25rem',
            }}>
              {pendingSubmissions}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Pending
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '0.75rem',
            color: '#9CA3AF',
          }}>
            Created {new Date(classData.created_at).toLocaleDateString()}
          </span>
          <span style={{
            fontSize: '0.875rem',
            color: '#3B82F6',
            fontWeight: 600,
          }}>
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

