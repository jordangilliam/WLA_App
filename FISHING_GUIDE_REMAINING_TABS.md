# Fishing Guide - Remaining Tab Implementation

This document contains the implementation code for the remaining tabs in the Pennsylvania Fishing Guide. These should be added to `app/fishing/page.tsx` before the closing `</div>` tags around line 2740.

## Fly Fishing Tab

```tsx
        {/* Fly Fishing Tab */}
        {activeTab === 'fly' && (
          <div className="card section">
            <h2>🪰 Fly Fishing Guide for Pennsylvania</h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
              Complete fly fishing education from dry flies to nymphing techniques
            </p>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Fly Categories */}
              <div className="card" style={{ background: '#FFF7ED' }}>
                <h3>🦋 Fly Pattern Categories</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  {FISHING_EQUIPMENT.fly.flies.map((flyCategory, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <h4 style={{ color: '#EA580C', marginBottom: '0.75rem' }}>{flyCategory.category}</h4>
                      <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        {flyCategory.purpose}
                      </p>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#374151' }}>Common Patterns:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {flyCategory.types.map((type, i) => (
                            <span key={i} style={{ background: '#FFF7ED', color: '#9A3412', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Size Range:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{flyCategory.sizes}</p>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>When to Use:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{flyCategory.when}</p>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Techniques:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{flyCategory.techniques}</p>
                      </div>
                      <div style={{ background: '#DBEAFE', padding: '0.75rem', borderRadius: '8px', marginTop: '0.75rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#1E40AF' }}>🎒 Must-Have Flies:</strong>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                          {flyCategory.mustHave.map((fly, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: '#1E3A8A' }}>{fly}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fly Fishing Techniques */}
              <div className="card" style={{ background: '#F0F9FF' }}>
                <h3>🎯 Fly Fishing Techniques</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4>Dry Fly Fishing</h4>
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    The most visual and exciting form of fly fishing. Watch fish rise to take your fly on the surface.
                  </p>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Key Techniques:</strong>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 1.8 }}>
                      <li><strong>Dead Drift:</strong> Let fly float naturally with current, no drag</li>
                      <li><strong>Upstream Presentation:</strong> Cast upstream, retrieve slack as fly drifts down</li>
                      <li><strong>Mending:</strong> Flip line upstream to extend drag-free drift</li>
                      <li><strong>Matching Hatch Size:</strong> Critical for selective fish - match insect size exactly</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4>Nymph Fishing</h4>
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    Accounts for 90% of a trout&apos;s diet. Master nymphing to catch more fish.
                  </p>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Key Techniques:</strong>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 1.8 }}>
                      <li><strong>Indicator Nymphing:</strong> Use strike indicator (bobber), dead drift nymphs near bottom</li>
                      <li><strong>Euro Nymphing (Czech/Polish):</strong> No indicator, tight line, feel strikes</li>
                      <li><strong>High-Sticking:</strong> Keep line off water, rod high, feel everything</li>
                      <li><strong>Two-Fly Rig:</strong> Heavy fly + dropper for different depths</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4>Streamer Fishing</h4>
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    Target big, aggressive fish with baitfish imitations. Active, exciting fishing.
                  </p>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Key Techniques:</strong>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 1.8 }}>
                      <li><strong>Strip Retrieve:</strong> Pull line in short, erratic strips to imitate fleeing baitfish</li>
                      <li><strong>Swing:</strong> Let streamer swing across current, twitch rod tip</li>
                      <li><strong>Jerk-Strip-Pause:</strong> Jerk rod, strip line, pause - triggers strikes</li>
                      <li><strong>Bank Beating:</strong> Cast tight to banks where big fish ambush</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4>Emerger Fishing</h4>
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    Target insects transitioning from nymph to adult - the most vulnerable stage.
                  </p>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Key Techniques:</strong>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 1.8 }}>
                      <li><strong>In the Film:</strong> Fly hangs in surface film, half submerged</li>
                      <li><strong>Greased Leader:</strong> Float leader to keep emerger just under surface</li>
                      <li><strong>Subtle Takes:</strong> Watch for swirls, gentle rises - set hook gently</li>
                      <li><strong>Transition Times:</strong> Fish emergers when you see fish rising but not taking dries</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fly Casting Guide */}
              <div className="card" style={{ background: '#F5F3FF' }}>
                <h3>🎣 Fly Casting Mastery</h3>
                <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Learn the elegant art of fly casting - timing and rhythm over power
                </p>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {CASTING_TECHNIQUES.fly.map((cast, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h4 style={{ color: '#7C3AED' }}>{cast.name}</h4>
                        <span style={{ 
                          background: cast.difficulty === 'Beginner' ? '#ECFDF5' : cast.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                          color: cast.difficulty === 'Beginner' ? '#065F46' : cast.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {cast.difficulty}
                        </span>
                      </div>
                      <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        <strong>Use:</strong> {cast.uses}
                      </p>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Steps:</strong>
                        <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {cast.steps.map((step, i) => (
                            <li key={i} style={{ color: '#4B5563', fontSize: '0.95rem' }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '8px' }}>
                        <strong style={{ color: '#92400E' }}>💡 Essential Tips:</strong>
                        <p style={{ color: '#78350F', marginTop: '0.5rem', fontSize: '0.95rem' }}>{cast.tips}</p>
                        <p style={{ color: '#7C3AED', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                          <strong>Avoid:</strong> {cast.commonMistakes.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
```

## Knots Tab

```tsx
        {/* Knots Tab */}
        {activeTab === 'knots' && (
          <div className="card section">
            <h2>🪢 Essential Fishing Knots</h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
              Master these critical knots for conventional and fly fishing success
            </p>

            {selectedKnot ? (
              <div>
                <button 
                  onClick={() => setSelectedKnot(null)}
                  className="btn-outline"
                  style={{ marginBottom: '1.5rem' }}
                >
                  ← Back to All Knots
                </button>

                <div className="card" style={{ background: '#F9FAFB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                      <h3>{selectedKnot.name}</h3>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ 
                          background: selectedKnot.difficulty === 'Beginner' ? '#ECFDF5' : selectedKnot.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                          color: selectedKnot.difficulty === 'Beginner' ? '#065F46' : selectedKnot.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}>
                          {selectedKnot.difficulty}
                        </span>
                        <span style={{ 
                          background: '#DBEAFE',
                          color: '#1E40AF',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}>
                          {selectedKnot.strength} Strength
                        </span>
                        <span style={{ 
                          background: '#F3E8FF',
                          color: '#6B21A8',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}>
                          {selectedKnot.discipline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4>Common Uses:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {selectedKnot.uses.map((use, i) => (
                        <span key={i} style={{ background: '#ECFDF5', color: '#065F46', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4>Tying Steps:</h4>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: 2, marginTop: '0.75rem' }}>
                      {selectedKnot.steps.map((step, i) => (
                        <li key={i} style={{ color: '#374151', fontSize: '1rem', marginBottom: '0.5rem' }}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Visual Diagram:</h4>
                    <pre style={{ 
                      background: '#F3F4F6', 
                      padding: '1.5rem', 
                      borderRadius: '8px', 
                      overflow: 'auto',
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      color: '#1F2937'
                    }}>
                      {selectedKnot.diagram}
                    </pre>
                  </div>

                  <div style={{ background: '#FEF3C7', border: '2px solid #F59E0B', padding: '1.5rem', borderRadius: '12px' }}>
                    <h4 style={{ color: '#92400E', marginBottom: '0.75rem' }}>💡 Pro Tips:</h4>
                    <p style={{ color: '#78350F', fontSize: '1rem', lineHeight: 1.6 }}>{selectedKnot.tips}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {FISHING_KNOTS.map((knot) => (
                  <div 
                    key={knot.id}
                    className="card"
                    onClick={() => setSelectedKnot(knot)}
                    style={{
                      cursor: 'pointer',
                      background: '#F9FAFB',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <h3>{knot.name}</h3>
                      <span style={{ 
                        background: knot.difficulty === 'Beginner' ? '#ECFDF5' : knot.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                        color: knot.difficulty === 'Beginner' ? '#065F46' : knot.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {knot.difficulty}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                        <strong>Strength:</strong> {knot.strength}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                        <strong>For:</strong> {knot.discipline}
                      </span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Best Uses:</strong>
                      <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.5rem' }}>
                        {knot.uses.join(', ')}
                      </p>
                    </div>

                    <button 
                      className="btn"
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #0077B6, #023047)',
                        color: 'white'
                      }}
                    >
                      View Instructions →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
```

## Equipment Tab

```tsx
        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="card section">
            <h2>🎒 Fishing Equipment Guide</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Everything you need to know about rods, reels, line, and gear
            </p>

            {/* Discipline Selector */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <button
                onClick={() => setSelectedEquipmentType('conventional')}
                className="btn"
                style={{
                  background: selectedEquipmentType === 'conventional' 
                    ? 'linear-gradient(135deg, #0077B6, #023047)'
                    : 'rgba(255,255,255,0.2)',
                  color: selectedEquipmentType === 'conventional' ? 'white' : '#023047',
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem'
                }}
              >
                🎣 Conventional
              </button>
              <button
                onClick={() => setSelectedEquipmentType('fly')}
                className="btn"
                style={{
                  background: selectedEquipmentType === 'fly' 
                    ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
                    : 'rgba(255,255,255,0.2)',
                  color: selectedEquipmentType === 'fly' ? 'white' : '#5B21B6',
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem'
                }}
              >
                🪰 Fly Fishing
              </button>
            </div>

            {selectedEquipmentType === 'conventional' ? (
              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Rods */}
                <div className="card" style={{ background: '#F0F9FF' }}>
                  <h3>🎣 Rods</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.conventional.rods.map((rod, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#0077B6' }}>{rod.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Length:</strong> {rod.length}</div>
                          <div><strong>Power:</strong> {rod.power}</div>
                          <div><strong>Action:</strong> {rod.action}</div>
                          <div><strong>Best For:</strong> {rod.uses}</div>
                          <div><strong>Price Range:</strong> {rod.price}</div>
                        </div>
                        <div style={{ background: '#ECFDF5', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong style={{ color: '#065F46' }}>Recommended For:</strong>
                          <p style={{ color: '#047857', marginTop: '0.5rem' }}>{rod.bestFor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reels */}
                <div className="card" style={{ background: '#FFF7ED' }}>
                  <h3>🎣 Reels</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.conventional.reels.map((reel, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#EA580C' }}>{reel.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Size:</strong> {reel.size}</div>
                          <div><strong>Drag Power:</strong> {reel.dragPower}</div>
                          <div><strong>Gear Ratio:</strong> {reel.gearRatio}</div>
                          <div><strong>Best For:</strong> {reel.uses}</div>
                          <div><strong>Price Range:</strong> {reel.price}</div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Features:</strong>
                          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            {reel.features.map((feature, i) => (
                              <li key={i} style={{ color: '#4B5563' }}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line Types */}
                <div className="card" style={{ background: '#F5F3FF' }}>
                  <h3>🧵 Fishing Line</h3>
                  <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.conventional.line.map((line, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#7C3AED' }}>{line.type}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                          <div>
                            <div style={{ marginBottom: '0.75rem' }}>
                              <strong>Strength:</strong>
                              <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{line.strength}</p>
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                              <strong>Stretch:</strong>
                              <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{line.stretch}</p>
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                              <strong>Visibility:</strong>
                              <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{line.visibility}</p>
                            </div>
                            <div>
                              <strong>Price:</strong>
                              <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{line.price}</p>
                            </div>
                          </div>
                          <div>
                            <div style={{ marginBottom: '1rem' }}>
                              <strong style={{ color: '#059669' }}>✓ Pros:</strong>
                              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                {line.pros.map((pro, i) => (
                                  <li key={i} style={{ color: '#047857', fontSize: '0.9rem' }}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong style={{ color: '#DC2626' }}>✗ Cons:</strong>
                              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                {line.cons.map((con, i) => (
                                  <li key={i} style={{ color: '#B91C1C', fontSize: '0.9rem' }}>{con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div style={{ background: '#DBEAFE', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong>Best Uses:</strong>
                          <p style={{ marginTop: '0.5rem', color: '#1E3A8A' }}>{line.uses}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminal Tackle */}
                <div className="card" style={{ background: '#FEF2F2' }}>
                  <h3>🎣 Terminal Tackle</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.conventional.terminal.map((item, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#DC2626' }}>{item.item}</h4>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Types:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {item.types.map((type, i) => (
                              <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Sizes:</strong>
                          <p style={{ color: '#4B5563', marginTop: '0.5rem' }}>{item.sizes}</p>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Uses:</strong>
                          <p style={{ color: '#4B5563', marginTop: '0.5rem' }}>{item.uses}</p>
                        </div>
                        <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong>💡 Tip:</strong>
                          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#78350F' }}>{item.tips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Fly Equipment
              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Fly Rods */}
                <div className="card" style={{ background: '#F5F3FF' }}>
                  <h3>🪰 Fly Rods</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.fly.rods.map((rod, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#7C3AED' }}>{rod.weight}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Length:</strong> {rod.length}</div>
                          <div><strong>Action:</strong> {rod.action}</div>
                          <div><strong>Best For:</strong> {rod.uses}</div>
                          <div><strong>Price Range:</strong> {rod.price}</div>
                        </div>
                        <div style={{ background: '#F3E8FF', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong style={{ color: '#6B21A8' }}>Recommended For:</strong>
                          <p style={{ color: '#5B21B6', marginTop: '0.5rem' }}>{rod.bestFor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fly Reels */}
                <div className="card" style={{ background: '#FFF7ED' }}>
                  <h3>🎣 Fly Reels</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.fly.reels.map((reel, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#EA580C' }}>{reel.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Drag:</strong> {reel.drag}</div>
                          <div><strong>Weight:</strong> {reel.weight}</div>
                          <div><strong>Best For:</strong> {reel.uses}</div>
                          <div><strong>Price Range:</strong> {reel.price}</div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Features:</strong>
                          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            {reel.features.map((feature, i) => (
                              <li key={i} style={{ color: '#4B5563' }}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fly Line */}
                <div className="card" style={{ background: '#F0F9FF' }}>
                  <h3>🧵 Fly Line</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.fly.line.map((line, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#0077B6' }}>{line.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Uses:</strong> {line.uses}</div>
                          {line.casting && <div><strong>Casting:</strong> {line.casting}</div>}
                          {line.density && <div><strong>Density:</strong> {line.density}</div>}
                          {line.colors && <div><strong>Colors:</strong> {line.colors}</div>}
                          {line.price && <div><strong>Price:</strong> {line.price}</div>}
                        </div>
                        <div style={{ background: '#ECFDF5', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong>Recommendation:</strong>
                          <p style={{ marginTop: '0.5rem', color: '#047857' }}>{line.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leaders & Tippet */}
                <div className="card" style={{ background: '#FEF2F2' }}>
                  <h3>🎯 Leaders & Tippet</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.fly.leaders.map((leader, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#DC2626' }}>{leader.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          {leader.length && <div><strong>Length:</strong> {leader.length}</div>}
                          {leader.tippet && <div><strong>Tippet Size:</strong> {leader.tippet}</div>}
                          {leader.sections && <div><strong>Sections:</strong> {leader.sections}</div>}
                          {leader.strength && <div><strong>Strength:</strong> {leader.strength}</div>}
                          {leader.material && <div><strong>Material:</strong> {leader.material}</div>}
                          <div><strong>Uses:</strong> {leader.uses}</div>
                          {leader.price && <div><strong>Price:</strong> {leader.price}</div>}
                        </div>
                        <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong>💡 Tip:</strong>
                          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#78350F' }}>{leader.tips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
```

## Match the Hatch Tab (Gamified)

```tsx
        {/* Match the Hatch Tab - Gamified */}
        {activeTab === 'match-hatch' && (
          <div className="card section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2>🦋 Match the Hatch Challenge</h2>
                <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
                  Learn PA aquatic insects and earn points by matching flies to hatches
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ textAlign: 'center', background: '#F0F9FF', padding: '1rem 1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0077B6' }}>{matchHatchScore}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Points</div>
                </div>
                <div style={{ textAlign: 'center', background: '#FEF3C7', padding: '1rem 1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>{matchHatchStreak}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Streak</div>
                </div>
                <div style={{ textAlign: 'center', background: '#ECFDF5', padding: '1rem 1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>{matchedInsects.length}/{PA_AQUATIC_INSECTS.length}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Mastered</div>
                </div>
              </div>
            </div>

            {showHatchGame && currentChallenge ? (
              <div className="card" style={{ background: '#F9FAFB' }}>
                <button 
                  onClick={() => {
                    setShowHatchGame(false);
                    setCurrentChallenge(null);
                    setSelectedFlyGuess('');
                  }}
                  className="btn-outline"
                  style={{ marginBottom: '1.5rem' }}
                >
                  ← Back to Insects
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯 Match This Hatch!</h3>
                  <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦋</div>
                    <h4 style={{ fontSize: '1.5rem', color: '#023047', marginBottom: '0.5rem' }}>
                      {currentChallenge.name}
                    </h4>
                    <p style={{ fontStyle: 'italic', color: '#6B7280', marginBottom: '1rem' }}>
                      {currentChallenge.scientificName}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Hatches: {currentChallenge.months.join(', ')}
                      </span>
                      <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        {currentChallenge.time}
                      </span>
                      <span style={{ background: '#F3E8FF', color: '#6B21A8', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Size: {currentChallenge.size}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: '1rem' }}>Which fly pattern would you use?</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {currentChallenge.adult.patterns.map((pattern, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedFlyGuess(pattern);
                          // Award points
                          const newScore = matchHatchScore + currentChallenge.points;
                          const newStreak = matchHatchStreak + 1;
                          setMatchHatchScore(newScore);
                          setMatchHatchStreak(newStreak);
                          if (!matchedInsects.includes(currentChallenge.id)) {
                            setMatchedInsects([...matchedInsects, currentChallenge.id]);
                          }
                          // Save progress
                          localStorage.setItem('wla-match-hatch', JSON.stringify({
                            score: newScore,
                            streak: newStreak,
                            matched: [...matchedInsects, currentChallenge.id]
                          }));
                          // Award points through context
                          addPoints(currentChallenge.points, `Matched ${currentChallenge.name}!`);
                          setTimeout(() => {
                            alert(`Correct! +${currentChallenge.points} points! 🎉`);
                            setShowHatchGame(false);
                            setCurrentChallenge(null);
                            setSelectedFlyGuess('');
                          }, 500);
                        }}
                        className="btn"
                        style={{
                          background: selectedFlyGuess === pattern ? 'linear-gradient(135deg, #059669, #047857)' : 'white',
                          color: selectedFlyGuess === pattern ? 'white' : '#023047',
                          border: '2px solid #0077B6',
                          padding: '1rem',
                          fontSize: '1rem'
                        }}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>

                  <div style={{ background: '#DBEAFE', padding: '1.5rem', borderRadius: '12px', textAlign: 'left' }}>
                    <h4 style={{ color: '#1E40AF', marginBottom: '1rem' }}>Hatch Details:</h4>
                    <div style={{ display: 'grid', gap: '0.75rem', color: '#1E3A8A' }}>
                      <div><strong>Water Temp:</strong> {currentChallenge.waterTemp}</div>
                      <div><strong>Emergence:</strong> {currentChallenge.emergence}</div>
                      <div><strong>Nymph Patterns:</strong> {currentChallenge.nymph.patterns.join(', ')}</div>
                      {currentChallenge.emerger && (
                        <div><strong>Emerger Patterns:</strong> {currentChallenge.emerger.patterns.join(', ')}</div>
                      )}
                      <div><strong>Difficulty:</strong> {currentChallenge.difficulty}</div>
                      <div><strong>💡 Tip:</strong> {currentChallenge.tips}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {PA_AQUATIC_INSECTS.map((insect) => (
                  <div 
                    key={insect.id}
                    className="card"
                    style={{
                      background: matchedInsects.includes(insect.id) ? '#ECFDF5' : '#F9FAFB',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onClick={() => {
                      setCurrentChallenge(insect);
                      setShowHatchGame(true);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {matchedInsects.includes(insect.id) && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#059669',
                        color: 'white',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        ✓
                      </div>
                    )}

                    <h3 style={{ marginBottom: '0.5rem' }}>{insect.name}</h3>
                    <p style={{ fontStyle: 'italic', color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {insect.scientificName}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ 
                        background: insect.difficulty === 'Beginner' ? '#ECFDF5' : insect.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                        color: insect.difficulty === 'Beginner' ? '#065F46' : insect.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}>
                        {insect.difficulty}
                      </span>
                      <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                        +{insect.points} pts
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6 }}>
                      <div><strong>Type:</strong> {insect.type}</div>
                      <div><strong>Hatches:</strong> {insect.months.slice(0, 3).join(', ')}{insect.months.length > 3 && '...'}</div>
                      <div><strong>Time:</strong> {insect.time}</div>
                      <div><strong>Size:</strong> {insect.size}</div>
                    </div>

                    <button 
                      className="btn"
                      style={{
                        width: '100%',
                        marginTop: '1rem',
                        background: matchedInsects.includes(insect.id) 
                          ? 'linear-gradient(135deg, #059669, #047857)'
                          : 'linear-gradient(135deg, #0077B6, #023047)',
                        color: 'white'
                      }}
                    >
                      {matchedInsects.includes(insect.id) ? 'Review Match →' : 'Test Your Skills →'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
```

## Resources Tab (State Parks & Programs)

```tsx
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="card section">
            <h2>📚 Pennsylvania Fishing Resources</h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
              State parks, programs, training opportunities, and conservation resources
            </p>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* State Parks with Fishing */}
              <div className="card" style={{ background: '#F0F9FF' }}>
                <h3>🏞️ Top Pennsylvania State Parks for Fishing</h3>
                <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                  Pennsylvania has 121 state parks with fishing opportunities. Here are some of the best:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {[
                    {
                      name: 'Moraine State Park',
                      county: 'Butler',
                      water: 'Lake Arthur (3,225 acres)',
                      species: ['Musky', 'Walleye', 'Bass', 'Crappie', 'Perch'],
                      features: ['Boat launch', 'Marina', 'Fishing pier', 'Shore access'],
                      programs: ['Free fishing workshops', 'Youth fishing day', 'Kayak fishing tours']
                    },
                    {
                      name: 'Promised Land State Park',
                      county: 'Pike',
                      water: 'Promised Land Lake & Lower Lake',
                      species: ['Trout', 'Bass', 'Pickerel', 'Panfish'],
                      features: ['Boat rental', 'Accessible fishing pier', 'Stream access'],
                      programs: ['Fly fishing clinics', 'Family fishing events', 'Ice fishing workshops']
                    },
                    {
                      name: 'Presque Isle State Park',
                      county: 'Erie',
                      water: 'Lake Erie & Presque Isle Bay',
                      species: ['Walleye', 'Perch', 'Bass', 'Steelhead', 'Musky'],
                      features: ['Multi-species fishery', 'Shore fishing', 'Boat launch'],
                      programs: ['Fishing clinics year-round', 'Junior angler program', 'Ice fishing']
                    },
                    {
                      name: 'Ricketts Glen State Park',
                      county: 'Luzerne/Sullivan/Columbia',
                      water: 'Lake Jean & streams',
                      species: ['Trout', 'Bass', 'Panfish'],
                      features: ['Lake fishing', 'Stream fishing', 'Boat rental'],
                      programs: ['Trout fishing workshop', 'Family fishing day', 'Fly fishing basics']
                    },
                    {
                      name: 'Codorus State Park',
                      county: 'York',
                      water: 'Lake Marburg (1,275 acres)',
                      species: ['Bass', 'Musky', 'Crappie', 'Catfish'],
                      features: ['Multiple boat launches', 'Marina', 'Fishing piers'],
                      programs: ['Youth fishing tournament', 'Fishing workshops', 'Boat fishing clinic']
                    },
                    {
                      name: 'Marsh Creek State Park',
                      county: 'Chester',
                      water: 'Marsh Creek Lake (535 acres)',
                      species: ['Bass', 'Trout', 'Walleye', 'Perch'],
                      features: ['Sailing', 'Boat launch', 'Shore fishing'],
                      programs: ['Beginner fishing clinics', 'Family fishing days', 'Fly fishing intro']
                    }
                  ].map((park, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <h4 style={{ color: '#0077B6', marginBottom: '0.5rem' }}>{park.name}</h4>
                      <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        {park.county} County
                      </p>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Water Body:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{park.water}</p>
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Target Species:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {park.species.map((species, i) => (
                            <span key={i} style={{ background: '#ECFDF5', color: '#065F46', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                              {species}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Features:</strong>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                          {park.features.map((feature, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: '#4B5563' }}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#92400E' }}>Programs:</strong>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                          {park.programs.map((program, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: '#78350F' }}>{program}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Programs */}
              <div className="card" style={{ background: '#F0FDF4' }}>
                <h3>🎓 Fishing Education & Training</h3>
                <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#059669' }}>PFBC Fishing Education</h4>
                    <p style={{ color: '#4B5563', marginBottom: '1rem' }}>
                      Pennsylvania Fish & Boat Commission offers comprehensive fishing education programs
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                      <li><strong>Fishing 101:</strong> Free beginner workshops at state parks</li>
                      <li><strong>Fishing Mentors:</strong> One-on-one instruction from certified anglers</li>
                      <li><strong>Youth Fishing Day:</strong> Annual free fishing day with equipment provided</li>
                      <li><strong>Women&apos;s Fishing Clinics:</strong> Workshops specifically for women anglers</li>
                      <li><strong>Fly Fishing Schools:</strong> Multi-day intensive fly fishing courses</li>
                      <li><strong>Online Resources:</strong> Video tutorials, species guides, regulations</li>
                    </ul>
                    <a 
                      href="https://www.fishandboat.com/Education/Pages/default.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ 
                        display: 'inline-block',
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        color: 'white'
                      }}
                    >
                      Visit PFBC Education →
                    </a>
                  </div>

                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#059669' }}>Trout in the Classroom</h4>
                    <p style={{ color: '#4B5563', marginBottom: '1rem' }}>
                      Students raise trout from eggs to fingerlings, learning aquatic ecosystems
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                      <li>Hands-on science education</li>
                      <li>Water quality monitoring</li>
                      <li>Stream habitat assessment</li>
                      <li>Conservation ethics</li>
                      <li>Stock fish in local streams as class</li>
                    </ul>
                    <a 
                      href="https://www.fishandboat.com/Education/TIC/Pages/default.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ 
                        display: 'inline-block',
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        color: 'white'
                      }}
                    >
                      Learn About TIC →
                    </a>
                  </div>

                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#059669' }}>Angler & Boater Education</h4>
                    <p style={{ color: '#4B5563', marginBottom: '1rem' }}>
                      Certification courses and advanced skills training
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                      <li><strong>Boating Safety Course:</strong> Required for operating powerboats</li>
                      <li><strong>Kayak Fishing Skills:</strong> Safety and techniques for kayak anglers</li>
                      <li><strong>Ice Fishing Safety:</strong> Winter fishing safety and techniques</li>
                      <li><strong>Species ID Workshops:</strong> Learn to identify PA fish species</li>
                      <li><strong>Conservation Volunteer:</strong> Stream cleanups, fish surveys, habitat work</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Conservation & Regulations */}
              <div className="card" style={{ background: '#FFF7ED' }}>
                <h3>🌱 Conservation & Stewardship</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#EA580C' }}>Catch & Release Best Practices</h4>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: 2 }}>
                      <li>Use barbless hooks</li>
                      <li>Keep fish in water when possible</li>
                      <li>Wet hands before handling</li>
                      <li>Support fish horizontally</li>
                      <li>Minimize fight time</li>
                      <li>Revive fish before release</li>
                      <li>Avoid handling gills</li>
                    </ul>
                  </div>

                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#EA580C' }}>Stream Etiquette</h4>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: 2 }}>
                      <li>Respect other anglers&apos; space</li>
                      <li>Enter stream below other anglers</li>
                      <li>Don&apos;t crowd fishing spots</li>
                      <li>Pack out all trash</li>
                      <li>Respect private property</li>
                      <li>Share knowledge with beginners</li>
                      <li>Report pollution or violations</li>
                    </ul>
                  </div>

                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#EA580C' }}>Important Regulations</h4>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: 2 }}>
                      <li>Valid PA fishing license required (16+)</li>
                      <li>Free Youth Fishing Days (no license)</li>
                      <li>Trout/Salmon permit for stocked waters</li>
                      <li>Know season dates & creel limits</li>
                      <li>Size restrictions by species</li>
                      <li>Special regulations on some waters</li>
                      <li>Barbless hooks in some streams</li>
                    </ul>
                    <a 
                      href="https://www.fishandboat.com/regulations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ 
                        display: 'inline-block',
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, #EA580C, #C2410C)',
                        color: 'white',
                        width: '100%'
                      }}
                    >
                      View Current Regulations →
                    </a>
                  </div>
                </div>
              </div>

              {/* Links & Resources */}
              <div className="card" style={{ background: '#F5F3FF' }}>
                <h3>🔗 Useful Links</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { name: 'PA Fish & Boat Commission', url: 'https://www.fishandboat.com', desc: 'Official state fishing authority' },
                    { name: 'Trout Stocking Schedule', url: 'https://pfbc.maps.arcgis.com/apps/webappviewer/index.html', desc: 'Real-time stocking updates' },
                    { name: 'Buy Fishing License', url: 'https://www.pa.wildlifelicense.com/start.php', desc: 'Online license sales' },
                    { name: 'PA State Parks', url: 'https://www.dcnr.pa.gov/StateParks', desc: 'Park information & reservations' },
                    { name: 'Stream Access Map', url: 'https://www.fishandboat.com/Fish/PennsylvaniaFishes/Pages/PublicFishingAccess.aspx', desc: 'Find public fishing access' },
                    { name: 'Wildlife Leadership Academy', url: 'https://wildlifeleadershipacademy.org', desc: 'Conservation education' }
                  ].map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card"
                      style={{
                        background: 'white',
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <h4 style={{ color: '#7C3AED', marginBottom: '0.5rem' }}>{link.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>{link.desc}</p>
                      <div style={{ marginTop: '0.75rem', color: '#7C3AED', fontSize: '0.9rem', fontWeight: 600 }}>
                        Visit Site →
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
```

## Summary

These remaining tabs complete the comprehensive fishing guide:

1. **Fly Fishing Tab** - Complete fly fishing education with:
   - Detailed fly categories (dry flies, nymphs, streamers, emergers, terrestrials, wet flies)
   - Fly fishing techniques (dry fly, nymphing, streamer, emerger fishing)
   - Fly casting mastery guide

2. **Knots Tab** - Essential fishing knots with:
   - Visual ASCII diagrams
   - Step-by-step instructions
   - Difficulty ratings
   - Best uses and pro tips
   - Interactive selection/detail view

3. **Equipment Tab** - Complete gear guide with:
   - Toggle between conventional and fly equipment
   - Rods, reels, line, terminal tackle
   - Fly-specific: rods, reels, line, leaders & tippet
   - Price ranges, features, recommendations

4. **Match the Hatch Tab** - Gamified learning with:
   - 9 PA aquatic insects with full details
   - Points, streaks, and progress tracking
   - Interactive quiz format
   - Difficulty levels
   - Integrates with points system

5. **Resources Tab** - Educational resources with:
   - Top 6 PA state parks for fishing
   - PFBC education programs
   - Trout in the Classroom
   - Conservation best practices
   - Stream etiquette
   - Regulations reminders
   - Useful external links

All tabs are fully styled, responsive, and integrate with the existing point system and localStorage for progress tracking.

