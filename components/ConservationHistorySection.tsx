'use client';

import { useState } from 'react';
import type { ConservationHistory } from '@/lib/data/conservation-history';

interface ConservationHistorySectionProps {
  history: ConservationHistory;
}

export default function ConservationHistorySection({ history }: ConservationHistorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
        borderRadius: '16px',
        padding: '2rem',
        marginTop: '3rem',
        border: '2px solid #D1D5DB',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📜</div>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#1F2937',
            marginBottom: '0.5rem',
          }}
        >
          Conservation History Deep Dive
        </h2>
        <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '700px', margin: '0 auto' }}>
          {history.overview}
        </p>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '1rem 1.5rem',
          background: isExpanded ? '#0077B6' : 'white',
          color: isExpanded ? 'white' : '#0077B6',
          border: '2px solid #0077B6',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          transition: 'all 0.3s',
        }}
      >
        {isExpanded ? '▼' : '▶'} {isExpanded ? 'Hide' : 'Explore'} Historical Timeline
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            marginTop: '2rem',
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* Vertical Line */}
            <div
              style={{
                position: 'absolute',
                left: '8px',
                top: '0',
                bottom: '0',
                width: '4px',
                background: 'linear-gradient(to bottom, #0077B6, #023047)',
                borderRadius: '999px',
              }}
            />

            {history.sections.map((section, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  marginBottom: '2.5rem',
                  paddingLeft: '1.5rem',
                }}
              >
                {/* Era Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.5rem',
                    top: '0.25rem',
                    width: '24px',
                    height: '24px',
                    background: 'white',
                    border: '4px solid #0077B6',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  {/* Era Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{section.icon}</span>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#1F2937',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {section.era}
                      </h3>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 600 }}>
                        {section.period}
                      </div>
                    </div>
                  </div>

                  {/* Key Points */}
                  <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem', lineHeight: 1.7 }}>
                    {section.keyPoints.map((point, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem', color: '#374151' }}>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* PA Example */}
                  {section.paExample && (
                    <div
                      style={{
                        background: '#FEF3C7',
                        padding: '1rem',
                        borderRadius: '8px',
                        borderLeft: '4px solid #F59E0B',
                        marginBottom: '1rem',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: '#92400E',
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        📍 Pennsylvania Example:
                      </div>
                      <div style={{ color: '#78350F', fontSize: '0.95rem' }}>{section.paExample}</div>
                    </div>
                  )}

                  {/* Significance */}
                  <div
                    style={{
                      background: '#DBEAFE',
                      padding: '1rem',
                      borderRadius: '8px',
                      borderLeft: '4px solid #0077B6',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#1E3A8A',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      💡 Significance:
                    </div>
                    <div style={{ color: '#1E40AF', fontSize: '0.95rem' }}>{section.significance}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Issues */}
          {history.currentIssues && history.currentIssues.length > 0 && (
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                marginTop: '2rem',
                border: '2px solid #EF4444',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#991B1B',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                ⚠️ Current Conservation Challenges
              </h3>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.7 }}>
                {history.currentIssues.map((issue, i) => (
                  <li key={i} style={{ marginBottom: '0.75rem', color: '#7F1D1D' }}>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Figures */}
          {history.keyFigures && history.keyFigures.length > 0 && (
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                marginTop: '2rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🌟 Key Conservation Figures
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {history.keyFigures.map((figure, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#F9FAFB',
                      padding: '1rem',
                      borderRadius: '8px',
                      borderLeft: '4px solid #0077B6',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#1F2937',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {figure.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {figure.role} • {figure.era}
                    </div>
                    <div style={{ color: '#374151', fontSize: '0.95rem' }}>{figure.contribution}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0077B6 0%, #023047 100%)',
              color: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginTop: '2rem',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              🌍 Your Role in Conservation
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {history.callToAction}
            </p>
            <div style={{ fontSize: '2rem' }}>🌲🐟🦌🦃🐻</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

