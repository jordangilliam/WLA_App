'use client';

import React from 'react';
import type { Activity } from '@/lib/types/dashboard.types';

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

export default function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: string): string => {
    const icons: Record<string, string> = {
      lesson_completed: '📚',
      badge_earned: '🏆',
      observation_added: '🔍',
      quiz_taken: '📝',
      assignment_submitted: '✅',
      login: '👋',
      journal_entry: '📖',
      species_identified: '🦌',
      field_trip_checkin: '📍',
    };
    return icons[type] || '⭐';
  };

  const getActivityColor = (type: string): string => {
    const colors: Record<string, string> = {
      lesson_completed: '#3B82F6',
      badge_earned: '#F59E0B',
      observation_added: '#10B981',
      quiz_taken: '#8B5CF6',
      assignment_submitted: '#06B6D4',
      login: '#6B7280',
      journal_entry: '#EC4899',
      species_identified: '#84CC16',
      field_trip_checkin: '#F97316',
    };
    return colors[type] || '#6B7280';
  };

  const formatActivityText = (activity: Activity): string => {
    const data = activity.activity_data || {};
    
    switch (activity.activity_type) {
      case 'lesson_completed':
        return `completed "${data.lesson_name || 'a lesson'}"`;
      case 'badge_earned':
        return `earned the "${data.badge_name || 'badge'}" badge!`;
      case 'observation_added':
        return `observed ${data.species || 'wildlife'} at ${data.location || 'a location'}`;
      case 'quiz_taken':
        return `took a quiz and scored ${data.score || 'N/A'}`;
      case 'assignment_submitted':
        return `submitted "${data.assignment_name || 'an assignment'}"`;
      case 'login':
        return 'logged in';
      case 'journal_entry':
        return 'added a journal entry';
      case 'species_identified':
        return `identified ${data.species || 'a species'}`;
      case 'field_trip_checkin':
        return `checked in at ${data.location || 'a location'}`;
      default:
        return 'completed an activity';
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (displayedActivities.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#1E40AF',
          marginBottom: '0.5rem',
        }}>
          No Activity Yet
        </h3>
        <p style={{ color: '#6B7280' }}>
          Student activity will appear here as they use WildPraxis
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#1E40AF',
        marginBottom: '1rem',
      }}>
        📊 Recent Activity
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {displayedActivities.map((activity) => {
          const icon = getActivityIcon(activity.activity_type);
          const color = getActivityColor(activity.activity_type);
          
          return (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                background: '#F9FAFB',
                borderRadius: '8px',
                borderLeft: `4px solid ${color}`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F9FAFB';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: '1.5rem',
                flexShrink: 0,
              }}>
                {icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#111827',
                  marginBottom: '0.25rem',
                }}>
                  <strong style={{ color: '#1E40AF' }}>Student {activity.user_id}</strong>
                  {' '}
                  {formatActivityText(activity)}
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}>
                  <span>{getTimeAgo(activity.created_at)}</span>
                  {activity.points_earned > 0 && (
                    <span style={{
                      background: '#FEF3C7',
                      color: '#F59E0B',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}>
                      +{activity.points_earned} pts
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length > maxItems && (
        <div style={{
          marginTop: '1rem',
          textAlign: 'center',
        }}>
          <button
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: '#3B82F6',
              border: '2px solid #3B82F6',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3B82F6';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#3B82F6';
            }}
          >
            View All Activity ({activities.length} total)
          </button>
        </div>
      )}
    </div>
  );
}

