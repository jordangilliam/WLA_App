'use client';

import React, { useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import { LEARNING_LEVELS, SpeciesKnowledge, CulturalStory } from '@/lib/data/enhanced-species-knowledge';

interface Props {
  speciesKnowledge: SpeciesKnowledge;
}

export default function SpeciesLearningAdventure({ speciesKnowledge }: Props) {
  const { award } = usePoints();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [mysteryAttempts, setMysteryAttempts] = useState<Record<number, boolean>>({});

  const completeLevel = (level: number) => {
    if (!completedLevels.has(level)) {
      const newCompleted = new Set(completedLevels);
      newCompleted.add(level);
      setCompletedLevels(newCompleted);
      
      // Award points based on level
      const points = level * 25;
      award(points, `Completed ${LEARNING_LEVELS[level - 1].title}`);
      
      // Unlock next level
      if (level < 5) {
        setCurrentLevel(level + 1);
      }
    }
  };

  const getLevelContent = (level: number) => {
    const levelKey = `level${level}` as keyof typeof speciesKnowledge.learningStack;
    return speciesKnowledge.learningStack[levelKey];
  };

  const getLevelLocked = (level: number) => {
    if (level === 1) return false;
    return !completedLevels.has(level - 1);
  };

  const getEraColor = (era: string) => {
    const colors: Record<string, string> = {
      'Pre-Contact': '#10B981',
      'Early Contact': '#F59E0B',
      'Colonial Period': '#EF4444',
      'Industrial': '#6366F1',
      'Conservation Era': '#8B5CF6'
    };
    return colors[era] || '#6B7280';
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Header with Carmen Sandiego vibes */}
      <div style={{
        background: 'linear-gradient(135deg, #DC2626 0%, #7C2D12 100%)',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(220, 38, 38, 0.3)'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '-50px',
          fontSize: '180px',
          opacity: 0.1,
          transform: 'translateY(-50%) rotate(-15deg)'
        }}>
          🕵️
        </div>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🌍 The Case of the {speciesKnowledge.commonName}
        </h2>
        <p style={{ fontSize: '1.2rem', opacity: 0.95, maxWidth: '700px' }}>
          <em>Detective, you've stumbled onto something big.</em> This isn't just about wildlife—
          this is about culture, history, and mysteries that span centuries. 
          Are you ready to uncover the truth?
        </p>
      </div>

      {/* Indigenous Names Section */}
      <div className="card" style={{ marginBottom: '2rem', background: '#F0FDF4', border: '3px solid #10B981' }}>
        <h3 style={{ color: '#065F46', marginBottom: '1rem' }}>
          🪶 Indigenous Names & Meanings
        </h3>
        <p style={{ marginBottom: '1.5rem', color: '#065F46' }}>
          Long before Pennsylvania got its name, Indigenous peoples lived here for over 10,000 years. 
          They had rich languages and deep relationships with wildlife. Here's what they called the {speciesKnowledge.commonName}:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {speciesKnowledge.indigenousNames.map((name, idx) => (
            <div key={idx} style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '12px',
              border: '2px solid #10B981'
            }}>
              <h4 style={{ color: '#059669', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {name.tribe}
              </h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#064E3B', marginBottom: '0.5rem' }}>
                "{name.name}"
              </p>
              <p style={{ fontSize: '0.95rem', color: '#065F46', fontStyle: 'italic' }}>
                Meaning: {name.meaning}
              </p>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'white',
          borderRadius: '8px',
          borderLeft: '4px solid #10B981'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#065F46', margin: 0 }}>
            <strong>🔍 Detective's Note:</strong> Notice how each name tells you something about the animal's behavior or relationship with people. 
            Indigenous names weren't just labels—they were observations built from thousands of years of careful attention.
          </p>
        </div>
      </div>

      {/* Learning Stack (ClassDojo Style) */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>
          📚 Your Learning Journey
        </h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#6B7280' }}>
          Complete each level to unlock the next! Each level reveals deeper mysteries and earns you more points.
        </p>

        {[1, 2, 3, 4, 5].map((level) => {
          const levelData = getLevelContent(level);
          const levelInfo = LEARNING_LEVELS[level - 1];
          const isLocked = getLevelLocked(level);
          const isCompleted = completedLevels.has(level);
          const isCurrent = currentLevel === level;

          return (
            <div key={level} style={{
              marginBottom: '1.5rem',
              opacity: isLocked ? 0.5 : 1,
              pointerEvents: isLocked ? 'none' : 'auto'
            }}>
              <div style={{
                background: isCompleted ? 'linear-gradient(135deg, #10B981, #059669)' : isCurrent ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #6B7280, #4B5563)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
                border: isCurrent && !isCompleted ? '3px solid #FCD34D' : 'none'
              }}
              onClick={() => !isLocked && setCurrentLevel(level)}
              onMouseEnter={(e) => !isLocked && (e.currentTarget.style.transform = 'translateX(5px)')}
              onMouseLeave={(e) => !isLocked && (e.currentTarget.style.transform = 'translateX(0)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {isLocked ? '🔒' : isCompleted ? '✅' : levelInfo.emoji}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.3rem' }}>
                      Level {level}: {levelInfo.title}
                    </h4>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                      {levelData.title}
                    </p>
                  </div>
                  {isLocked && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Complete Level {level - 1}</div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>to unlock</div>
                    </div>
                  )}
                  {!isLocked && !isCompleted && (
                    <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem' }}>
                      +{level * 25} pts
                    </div>
                  )}
                </div>
              </div>

              {/* Level Content */}
              {currentLevel === level && !isLocked && (
                <div className="card" style={{
                  background: 'white',
                  border: '3px solid #F59E0B',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{
                    padding: '1.5rem',
                    lineHeight: '1.8',
                    fontSize: '1.05rem',
                    whiteSpace: 'pre-line'
                  }}>
                    {levelData.content}
                  </div>

                  {/* Mystery Challenge */}
                  {levelData.mystery && (
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                      borderRadius: '12px',
                      border: '3px dashed #F59E0B'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🕵️</div>
                        <h4 style={{ margin: 0, color: '#92400E', fontSize: '1.2rem' }}>
                          Mystery Challenge
                        </h4>
                      </div>
                      <p style={{ color: '#78350F', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                        {levelData.mystery}
                      </p>
                      {!mysteryAttempts[level] && (
                        <button
                          onClick={() => {
                            setMysteryAttempts({ ...mysteryAttempts, [level]: true });
                            award(10, 'Mystery Challenge Attempted');
                          }}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: '#F59E0B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                        >
                          🤔 I'm thinking about this... (+10 pts)
                        </button>
                      )}
                      {mysteryAttempts[level] && (
                        <div style={{
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '8px',
                          color: '#065F46',
                          fontWeight: 600
                        }}>
                          ✅ Great! Keep this mystery in mind as you continue learning. The answers reveal themselves...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Complete Button */}
                  {!isCompleted && (
                    <button
                      onClick={() => completeLevel(level)}
                      style={{
                        marginTop: '1.5rem',
                        width: '100%',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      ✅ Complete Level {level} (+{level * 25} points)
                    </button>
                  )}

                  {isCompleted && (
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      background: '#D1FAE5',
                      borderRadius: '8px',
                      textAlign: 'center',
                      color: '#065F46',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      ✅ Level Completed! {level < 5 ? 'Continue to the next level...' : 'You are now a Master Naturalist!'}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cultural History Timeline */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '2rem' }}>
          ⏳ Journey Through Time
        </h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#6B7280' }}>
          Travel through centuries of history. Each era reveals how humans and {speciesKnowledge.commonName.toLowerCase()}s have shaped each other's destinies.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {speciesKnowledge.culturalStories.map((story, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedEra(story.era)}
              style={{
                padding: '1rem 1.5rem',
                background: selectedEra === story.era ? getEraColor(story.era) : 'white',
                color: selectedEra === story.era ? 'white' : getEraColor(story.era),
                border: `3px solid ${getEraColor(story.era)}`,
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '1rem'
              }}
            >
              {story.era}
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
                {story.period}
              </div>
            </button>
          ))}
        </div>

        {selectedEra && speciesKnowledge.culturalStories.map((story, idx) => 
          story.era === selectedEra && (
            <div key={idx} className="card" style={{
              border: `4px solid ${getEraColor(story.era)}`,
              background: 'white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                background: getEraColor(story.era),
                color: 'white',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                borderRadius: '8px 8px 0 0',
                marginTop: '-1rem',
                marginLeft: '-1rem',
                marginRight: '-1rem'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>
                  {story.title}
                </h3>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                  {story.period}
                </p>
              </div>

              <div style={{
                fontSize: '1.05rem',
                lineHeight: '1.9',
                whiteSpace: 'pre-line',
                marginBottom: '1.5rem'
              }}>
                {story.narrative}
              </div>

              {story.indigenousPractice && (
                <div style={{
                  padding: '1.5rem',
                  background: '#F0FDF4',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  borderLeft: '4px solid #10B981'
                }}>
                  <h4 style={{ color: '#065F46', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🪶</span>
                    Indigenous Practice
                  </h4>
                  <p style={{ margin: 0, color: '#065F46', lineHeight: '1.7' }}>
                    {story.indigenousPractice}
                  </p>
                </div>
              )}

              {story.colonialImpact && (
                <div style={{
                  padding: '1.5rem',
                  background: '#FEE2E2',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  borderLeft: '4px solid #DC2626'
                }}>
                  <h4 style={{ color: '#991B1B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚠️</span>
                    Colonial Impact
                  </h4>
                  <p style={{ margin: 0, color: '#991B1B', lineHeight: '1.7' }}>
                    {story.colonialImpact}
                  </p>
                </div>
              )}

              {story.conservationBirth && (
                <div style={{
                  padding: '1.5rem',
                  background: '#EDE9FE',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  borderLeft: '4px solid #8B5CF6'
                }}>
                  <h4 style={{ color: '#6B21A8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🌱</span>
                    Conservation Movement
                  </h4>
                  <p style={{ margin: 0, color: '#6B21A8', lineHeight: '1.7' }}>
                    {story.conservationBirth}
                  </p>
                </div>
              )}

              {story.mystery && (
                <div style={{
                  padding: '1.5rem',
                  background: '#FEF3C7',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  border: '2px dashed #F59E0B'
                }}>
                  <h4 style={{ color: '#92400E', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🔍</span>
                    Historical Mystery
                  </h4>
                  <p style={{ margin: 0, color: '#78350F', lineHeight: '1.7', fontStyle: 'italic' }}>
                    {story.mystery}
                  </p>
                </div>
              )}

              <div style={{
                padding: '1rem',
                background: '#F3F4F6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>💡</span>
                <div>
                  <strong>Fun Fact:</strong> {story.funFact}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Trade History (if available) */}
      {speciesKnowledge.tradeHistory && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          border: '3px solid #F59E0B',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#92400E', marginBottom: '1rem', fontSize: '1.8rem' }}>
            💰 The Economics of {speciesKnowledge.commonName}s
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#92400E', marginBottom: '0.5rem' }}>Trade Commodity</h4>
            <p style={{ fontSize: '1.1rem', color: '#78350F' }}>
              {speciesKnowledge.tradeHistory.commodity}
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#92400E', marginBottom: '0.5rem' }}>Major Trade Routes</h4>
            <ul style={{ color: '#78350F', lineHeight: '1.8' }}>
              {speciesKnowledge.tradeHistory.routes.map((route, idx) => (
                <li key={idx}>{route}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#92400E', marginBottom: '0.5rem' }}>Economic Impact</h4>
            <p style={{ color: '#78350F', lineHeight: '1.7' }}>
              {speciesKnowledge.tradeHistory.economicImpact}
            </p>
          </div>

          <div>
            <h4 style={{ color: '#92400E', marginBottom: '0.5rem' }}>Cultural Exchange</h4>
            <p style={{ color: '#78350F', lineHeight: '1.7' }}>
              {speciesKnowledge.tradeHistory.culturalExchange}
            </p>
          </div>
        </div>
      )}

      {/* Master Detective Badge */}
      {completedLevels.size === 5 && (
        <div style={{
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          borderRadius: '16px',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 10px 40px rgba(245, 158, 11, 0.4)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>
            Case Closed, Detective!
          </h2>
          <p style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            You've uncovered the complete story of the {speciesKnowledge.commonName}—from Indigenous wisdom 
            to colonial exploitation to modern conservation. You are now a <strong>Master Naturalist</strong> for this species!
          </p>
          <div style={{ marginTop: '2rem', fontSize: '1.2rem', opacity: 0.95 }}>
            Ready for your next case?
          </div>
        </div>
      )}
    </div>
  );
}

