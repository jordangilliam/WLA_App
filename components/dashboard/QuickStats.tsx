'use client';

import React from 'react';

interface QuickStatsProps {
  totalClasses: number;
  totalStudents: number;
  activeStudentsWeek: number;
  totalAssignments: number;
  pointsEarnedWeek: number;
}

export default function QuickStats({
  totalClasses,
  totalStudents,
  activeStudentsWeek,
  totalAssignments,
  pointsEarnedWeek,
}: QuickStatsProps) {
  const stats = [
    {
      label: 'Active Classes',
      value: totalClasses,
      icon: '📚',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon: '👥',
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    {
      label: 'Active This Week',
      value: activeStudentsWeek,
      icon: '⚡',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    {
      label: 'Assignments',
      value: totalAssignments,
      icon: '📝',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
    {
      label: 'Points Earned (Week)',
      value: pointsEarnedWeek.toLocaleString(),
      icon: '🏆',
      color: '#EF4444',
      bgColor: '#FEE2E2',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            background: stat.bgColor,
            padding: '1.5rem',
            borderRadius: '12px',
            border: `2px solid ${stat.color}20`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 8px 16px ${stat.color}30`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}>
            <span style={{
              fontSize: '2.5rem',
            }}>
              {stat.icon}
            </span>
            <span style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: stat.color,
            }}>
              {stat.value}
            </span>
          </div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: stat.color,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

