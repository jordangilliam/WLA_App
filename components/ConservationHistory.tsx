'use client';

import { useState } from 'react';
import type { ConservationHistory } from '@/lib/data/conservation-history';

interface ConservationHistoryProps {
  history: ConservationHistory;
}

export default function ConservationHistory({ history }: ConservationHistoryProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [showKeyFigures, setShowKeyFigures] = useState(false);

  return (
    <div className="card section" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #D1FAE5 100%)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#023047', marginBottom: '0.75rem' }}>
          📚 Conservation History: {history.topic}
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
          {history.overview}
        </p>
      </div>

      {/* Timeline Sections */}
      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
        {history.sections.map((section, idx) => (
          <div 
            key={idx}
            className="card"
            style={{
              background: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: expandedSection === idx ? '3px solid #059669' : '2px solid #E5E7EB'
            }}
            onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
          >
            {/* Section Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expandedSection === idx ? '1.5rem' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{section.icon}</div>
                <div>
                  <h3 style={{ color: '#023047', marginBottom: '0.25rem' }}>{section.era}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.95rem', margin: 0 }}>{section.period}</p>
                </div>
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                color: '#059669',
                transform: expandedSection === idx ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s'
              }}>
                ▼
              </div>
            </div>

            {/* Expanded Content */}
            {expandedSection === idx && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                {/* Key Points */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#059669', marginBottom: '1rem' }}>Key Developments:</h4>
                  <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                    {section.keyPoints.map((point, i) => (
                      <li key={i} style={{ color: '#374151', fontSize: '1rem' }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PA Example */}
                {section.paExample && (
                  <div style={{ 
                    background: '#FFF7ED', 
                    border: '2px solid #F59E0B',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <h4 style={{ color: '#92400E', marginBottom: '0.75rem' }}>
                      🗺️ Pennsylvania Example:
                    </h4>
                    <p style={{ color: '#78350F', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                      {section.paExample}
                    </p>
                  </div>
                )}

                {/* Significance */}
                <div style={{
                  background: '#EEF2FF',
                  border: '2px solid #6366F1',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h4 style={{ color: '#4338CA', marginBottom: '0.75rem' }}>
                    💡 Why This Matters:
                  </h4>
                  <p style={{ color: '#3730A3', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                    {section.significance}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Figures Section */}
      {history.keyFigures && history.keyFigures.length > 0 && (
        <div className="card" style={{ background: '#FEF3C7', marginBottom: '2rem' }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: showKeyFigures ? '1.5rem' : '0'
            }}
            onClick={() => setShowKeyFigures(!showKeyFigures)}
          >
            <h3 style={{ color: '#92400E' }}>🌟 Conservation Heroes</h3>
            <div style={{ 
              fontSize: '1.5rem', 
              color: '#92400E',
              transform: showKeyFigures ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s'
            }}>
              ▼
            </div>
          </div>

          {showKeyFigures && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {history.keyFigures.map((figure, idx) => (
                <div key={idx} className="card" style={{ background: 'white' }}>
                  <h4 style={{ color: '#EA580C', marginBottom: '0.5rem' }}>{figure.name}</h4>
                  <p style={{ 
                    color: '#6B7280', 
                    fontSize: '0.9rem', 
                    fontStyle: 'italic',
                    marginBottom: '0.75rem' 
                  }}>
                    {figure.role} ({figure.era})
                  </p>
                  <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {figure.contribution}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Issues */}
      <div className="card" style={{ background: '#FEE2E2', marginBottom: '2rem' }}>
        <h3 style={{ color: '#991B1B', marginBottom: '1.5rem' }}>⚠️ Current Conservation Challenges</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {history.currentIssues.map((issue, idx) => (
            <div 
              key={idx}
              style={{
                background: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                borderLeft: '4px solid #DC2626'
              }}
            >
              <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                {issue}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
          🌱 How You Can Help
        </h3>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, margin: 0, opacity: 0.95 }}>
          {history.callToAction}
        </p>
      </div>

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

