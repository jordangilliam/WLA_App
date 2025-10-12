'use client';

import React from 'react';
import type { ClassRosterStudent } from '@/lib/types/dashboard.types';

interface StudentProgressCardProps {
  student: ClassRosterStudent;
  onViewDetails?: () => void;
  onRemove?: () => void;
}

export default function StudentProgressCard({
  student,
  onViewDetails,
  onRemove,
}: StudentProgressCardProps) {
  const getConsentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return { bg: '#D1FAE5', color: '#10B981', label: '✓ Verified' };
      case 'pending':
        return { bg: '#FEF3C7', color: '#F59E0B', label: '⏳ Pending' };
      case 'denied':
        return { bg: '#FEE2E2', color: '#EF4444', label: '✗ Denied' };
      case 'not_required':
        return { bg: '#E0E7FF', color: '#6366F1', label: 'Not Required' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280', label: 'Unknown' };
    }
  };

  const consentStatus = getConsentStatusColor(student.consent_status);
  const daysInactive = student.last_active
    ? Math.floor((Date.now() - new Date(student.last_active).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '2px solid #E5E7EB',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.2)';
        e.currentTarget.style.borderColor = '#3B82F6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = '#E5E7EB';
      }}
    >
      {/* Header with name and consent status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
      }}>
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#1E40AF',
          }}>
            {student.student_name}
          </h4>
          <p style={{
            margin: '0.25rem 0 0 0',
            fontSize: '0.875rem',
            color: '#6B7280',
          }}>
            {student.student_email}
          </p>
        </div>

        <div style={{
          padding: '0.25rem 0.75rem',
          background: consentStatus.bg,
          color: consentStatus.color,
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          marginLeft: '1rem',
        }}>
          {consentStatus.label}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#F59E0B',
            marginBottom: '0.25rem',
          }}>
            {student.badges_earned}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Badges
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: student.grade_level ? '#10B981' : '#6B7280',
            marginBottom: '0.25rem',
          }}>
            {student.grade_level || 'N/A'}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Grade
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: daysInactive !== null && daysInactive < 7 ? '#10B981' : '#EF4444',
            marginBottom: '0.25rem',
          }}>
            {daysInactive !== null ? `${daysInactive}d` : 'Never'}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Inactive
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        fontSize: '0.875rem',
        color: '#6B7280',
        marginBottom: '1rem',
      }}>
        <span>
          📅 Enrolled: {new Date(student.enrolled_at).toLocaleDateString()}
        </span>
        {student.last_active && (
          <span>
            ⚡ Active: {new Date(student.last_active).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
      }}>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            View Details
          </button>
        )}
        
        {onRemove && (
          <button
            onClick={onRemove}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: '#EF4444',
              border: '2px solid #EF4444',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#EF4444';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#EF4444';
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

