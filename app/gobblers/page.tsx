'use client';

import { useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import { TERRESTRIAL_CONSERVATION_HISTORY } from '@/lib/data/conservation-history';
import ConservationHistory from '@/components/ConservationHistory';
import LocalHistoryResearch from '@/components/LocalHistoryResearch';

export default function GobblersPage() {
  const { award } = usePoints();
  const [activeTab, setActiveTab] = useState<'about' | 'signs' | 'calls' | 'hunting' | 'quiz' | 'history'>('about');

  const completeQuiz = (score: number) => {
    if (score >= 8) {
      award(50, 'Completed Turkey Biology Quiz');
    }
  };

  return (
    <section className="section">
      <div style={{
        background: 'linear-gradient(135deg, #A7C957 0%, #6A994E 100%)',
        padding: '3rem 2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          🦃 Gobblers Track
        </h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
          Master Pennsylvania wild turkey biology, behavior, and conservation
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {[
          { id: 'about', label: '🦃 About Turkeys', icon: '🦃' },
          { id: 'signs', label: '🔍 Signs & Tracks', icon: '🔍' },
          { id: 'calls', label: '🎵 Calls & Sounds', icon: '🎵' },
          { id: 'hunting', label: '🎯 Management', icon: '🎯' },
          { id: 'quiz', label: '📝 Quiz', icon: '📝' },
          { id: 'history', label: '📜 History', icon: '📜' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.id ? '#A7C957' : 'white',
              color: activeTab === tab.id ? 'white' : '#333',
              border: activeTab === tab.id ? 'none' : '2px solid #A7C957',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* About Turkeys */}
      {activeTab === 'about' && (
        <div className="card">
          <h2>🦃 Wild Turkey (Meleagris gallopavo)</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h3>📊 Vital Statistics</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Weight:</strong> Males 15-25 lbs, Females 8-12 lbs</li>
                <li><strong>Length:</strong> 3-4 feet</li>
                <li><strong>Wingspan:</strong> 4-5 feet</li>
                <li><strong>Lifespan:</strong> 3-5 years (wild)</li>
                <li><strong>Speed:</strong> Run 25 mph, Fly 55 mph</li>
                <li><strong>Breeding Season:</strong> March-May</li>
              </ul>
            </div>

            <div>
              <h3>🏠 Habitat</h3>
              <ul style={{ lineHeight: '2' }}>
                <li>Mixed oak/hickory forests</li>
                <li>Agricultural fields (food source)</li>
                <li>Open woodlands with clearings</li>
                <li>Near water sources</li>
                <li>Roosting in tall trees</li>
                <li>Found in all 67 PA counties</li>
              </ul>
            </div>

            <div>
              <h3>🍽️ Diet</h3>
              <ul style={{ lineHeight: '2' }}>
                <li>Acorns and nuts (fall/winter)</li>
                <li>Seeds and grains</li>
                <li>Insects and bugs (spring/summer)</li>
                <li>Berries and fruits</li>
                <li>Green vegetation</li>
                <li>Opportunistic omnivores</li>
              </ul>
            </div>

            <div>
              <h3>🎯 Male vs Female</h3>
              <p><strong>Toms (Males):</strong></p>
              <ul>
                <li>Iridescent feathers</li>
                <li>Large fan-shaped tail</li>
                <li>Prominent beard (hair-like feathers)</li>
                <li>Spurs on legs</li>
                <li>Red, white, blue head</li>
              </ul>
              <p><strong>Hens (Females):</strong></p>
              <ul>
                <li>Duller brown coloring</li>
                <li>Smaller body size</li>
                <li>Usually no beard</li>
                <li>Less colorful head</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '3rem', padding: '2rem', background: '#f0f9ff', borderRadius: '12px' }}>
            <h3>📚 Conservation Success Story</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Wild turkeys were completely extirpated (eliminated) from Pennsylvania by 1840 due to 
              overhunting and habitat loss. Through one of the most successful wildlife restoration programs 
              in history, turkeys were reintroduced starting in the 1950s. Today, Pennsylvania has an estimated 
              <strong> 200,000+ wild turkeys</strong> across all 67 counties! This incredible comeback demonstrates 
              the power of science-based wildlife management and habitat conservation.
            </p>
          </div>
        </div>
      )}

      {/* Signs & Tracks */}
      {activeTab === 'signs' && (
        <div className="card">
          <h2>🔍 Turkey Signs & Tracks</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h3>🐾 Tracks</h3>
              <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem' }}>
                <p><strong>Size:</strong> 4-5 inches long</p>
                <p><strong>Shape:</strong> Three forward toes, one rear toe</p>
                <p><strong>Pattern:</strong> Alternating steps, not in a line</p>
                <p><strong>Where to Look:</strong> Muddy areas, snow, dusty trails</p>
              </div>
              <img src="/images/tracks/Turkey.png" alt="Turkey tracks" style={{ width: '100%', borderRadius: '8px' }} />
            </div>

            <div>
              <h3>💩 Scat (Droppings)</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Male:</strong> J-shaped, about 1 inch long</li>
                <li><strong>Female:</strong> Spiral/coiled shape, smaller</li>
                <li><strong>Color:</strong> Dark brown to green</li>
                <li><strong>Often contains:</strong> Seeds, insect parts</li>
                <li><strong>Fresh:</strong> Moist and soft</li>
                <li><strong>Where:</strong> Feeding areas, under roosts</li>
              </ul>
            </div>

            <div>
              <h3>🪶 Feathers</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Body feathers:</strong> Iridescent bronze/green</li>
                <li><strong>Wing feathers:</strong> Barred black and white</li>
                <li><strong>Tail feathers:</strong> Dark with white or brown tips</li>
                <li><strong>Where to find:</strong> Molting sites, display areas</li>
                <li><strong>Season:</strong> Most common summer/fall</li>
              </ul>
            </div>

            <div>
              <h3>🏗️ Other Signs</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Scratchings:</strong> Leaves disturbed in 2-3 ft patches</li>
                <li><strong>Dusting areas:</strong> Shallow depressions in dirt</li>
                <li><strong>Roosting sites:</strong> Whitewash under trees</li>
                <li><strong>Nesting sites:</strong> Shallow bowl, hidden in vegetation</li>
                <li><strong>Strut marks:</strong> Wing tips drag in dust during display</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff9e6', borderRadius: '12px', border: '2px solid #ffd700' }}>
            <h4>🎯 Field Skills Challenge</h4>
            <p>Can you identify turkey signs in the field? Look for:</p>
            <ol style={{ lineHeight: '2', marginLeft: '2rem' }}>
              <li>Three-toed tracks with rear toe</li>
              <li>Scratched areas where turkeys foraged</li>
              <li>Droppings near feeding or roosting areas</li>
              <li>Feathers along trails or in fields</li>
            </ol>
            <p><strong>Earn 25 points by documenting turkey signs in your journal!</strong></p>
          </div>
        </div>
      )}

      {/* Calls & Sounds */}
      {activeTab === 'calls' && (
        <div className="card">
          <h2>🎵 Turkey Calls & Vocalizations</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#f0f9ff', borderRadius: '12px' }}>
              <h3>🎺 Gobble</h3>
              <p><strong>Sound:</strong> &quot;Gobble-obble-obble&quot;</p>
              <p><strong>Who:</strong> Dominant males (toms)</p>
              <p><strong>When:</strong> Spring breeding season, dawn</p>
              <p><strong>Purpose:</strong> Attract hens, challenge other males</p>
              <p><strong>Distance:</strong> Can be heard over 1 mile</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#fff0f5', borderRadius: '12px' }}>
              <h3>🐣 Yelp</h3>
              <p><strong>Sound:</strong> &quot;Kee-awk, kee-awk&quot;</p>
              <p><strong>Who:</strong> Both sexes, mainly hens</p>
              <p><strong>When:</strong> Year-round</p>
              <p><strong>Purpose:</strong> Location call, reassemble flock</p>
              <p><strong>Variations:</strong> Excited, soft, or lost yelp</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f0fff4', borderRadius: '12px' }}>
              <h3>😌 Purr</h3>
              <p><strong>Sound:</strong> Soft rolling sound</p>
              <p><strong>Who:</strong> Both sexes</p>
              <p><strong>When:</strong> While feeding, roosting</p>
              <p><strong>Purpose:</strong> Contentment, &quot;all is well&quot;</p>
              <p><strong>Volume:</strong> Very quiet, close range only</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#fffacd', borderRadius: '12px' }}>
              <h3>🗣️ Cluck</h3>
              <p><strong>Sound:</strong> Sharp &quot;putt&quot; or &quot;cluck&quot;</p>
              <p><strong>Who:</strong> Both sexes</p>
              <p><strong>When:</strong> Year-round</p>
              <p><strong>Purpose:</strong> Basic communication</p>
              <p><strong>Context:</strong> Soft = content, loud = alarm</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#fff5ee', borderRadius: '12px' }}>
              <h3>🚨 Putt/Alarm Call</h3>
              <p><strong>Sound:</strong> Sharp, loud &quot;putt-putt-putt&quot;</p>
              <p><strong>Who:</strong> Both sexes</p>
              <p><strong>When:</strong> When alarmed</p>
              <p><strong>Purpose:</strong> Warn flock of danger</p>
              <p><strong>Result:</strong> Birds usually flee</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#e6f3ff', borderRadius: '12px' }}>
              <h3>💨 Drumming/Spitting</h3>
              <p><strong>Sound:</strong> &quot;Pfft, thummm&quot;</p>
              <p><strong>Who:</strong> Males during display</p>
              <p><strong>When:</strong> Breeding season</p>
              <p><strong>Purpose:</strong> Accompany strut display</p>
              <p><strong>Volume:</strong> Can carry 100+ yards</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff9e6', borderRadius: '12px' }}>
            <h4>🎤 Learn to Call</h4>
            <p style={{ fontSize: '1.1rem' }}>
              Calling turkeys is an art! The basic yelp is the most important call to learn. 
              Practice making &quot;kee-awk&quot; sounds with a box call, slate call, or even your voice. 
              Remember: <strong>Less is more</strong> - overcalling can scare turkeys away.
            </p>
          </div>
        </div>
      )}

      {/* Management */}
      {activeTab === 'hunting' && (
        <div className="card">
          <h2>🎯 Turkey Management & Hunting in Pennsylvania</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h3>📅 Hunting Seasons (Typical)</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Spring Gobbler:</strong> Late April - Mid May</li>
                <li><strong>Fall Turkey:</strong> October - November</li>
                <li><strong>Youth Hunt:</strong> Special weekend in April</li>
                <li><strong>Bag Limits:</strong> Varies by season/WMU</li>
                <li><strong>Legal Hours:</strong> 1/2 hour before sunrise to 1/2 hour after sunset</li>
              </ul>
            </div>

            <div>
              <h3>📜 Regulations (Key Points)</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>License Required:</strong> General hunting license + Turkey permit</li>
                <li><strong>Tagging:</strong> Immediate upon harvest</li>
                <li><strong>Reporting:</strong> Must report all harvests</li>
                <li><strong>Legal Game:</strong> Bearded turkeys (spring), any turkey (fall)</li>
                <li><strong>Weapons:</strong> Shotgun, bow, crossbow</li>
                <li><strong>No:</strong> Rifles, electronic calls, bait</li>
              </ul>
            </div>

            <div>
              <h3>🌲 Habitat Management</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Nesting cover:</strong> Protect thick ground vegetation</li>
                <li><strong>Brood habitat:</strong> Open areas with insects</li>
                <li><strong>Roosting trees:</strong> Maintain large trees</li>
                <li><strong>Food sources:</strong> Oak/hickory mast, fields</li>
                <li><strong>Prescribed fire:</strong> Opens forest understory</li>
                <li><strong>Selective harvest:</strong> Thin trees for openings</li>
              </ul>
            </div>

            <div>
              <h3>⚠️ Threats to Turkeys</h3>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Predators:</strong> Fox, coyote, great horned owl, raccoon</li>
                <li><strong>Nest predation:</strong> Major cause of mortality</li>
                <li><strong>Poult survival:</strong> Cold wet springs reduce survival</li>
                <li><strong>Habitat loss:</strong> Fragmentation, development</li>
                <li><strong>Disease:</strong> Avian pox, blackhead</li>
                <li><strong>Winter severity:</strong> Deep snow limits feeding</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '2rem', background: '#f0f9ff', borderRadius: '12px' }}>
            <h3>🎓 Becoming a Turkey Hunter</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Turkey hunting is one of the most challenging and rewarding pursuits in outdoor recreation. 
              To get started:
            </p>
            <ol style={{ fontSize: '1.1rem', lineHeight: '2', marginLeft: '2rem' }}>
              <li><strong>Hunter Education:</strong> Complete PA Hunter-Trapper Education course</li>
              <li><strong>Practice Calling:</strong> Master basic yelps and clucks</li>
              <li><strong>Learn Woodsmanship:</strong> Stealth, patience, reading sign</li>
              <li><strong>Safety First:</strong> Wear hunter orange, never stalk turkeys</li>
              <li><strong>Mentorship:</strong> Go with experienced hunters first</li>
              <li><strong>Ethics:</strong> Fair chase, respect wildlife, follow all regulations</li>
            </ol>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff9e6', borderRadius: '12px', border: '2px solid #ffd700' }}>
            <h4>🔗 Resources</h4>
            <ul style={{ lineHeight: '2' }}>
              <li><strong>PA Game Commission:</strong> pgc.pa.gov (seasons, regulations)</li>
              <li><strong>Hunter Education:</strong> Register for courses online</li>
              <li><strong>National Wild Turkey Federation:</strong> Conservation & education</li>
              <li><strong>WLA Programs:</strong> Youth hunting mentorship opportunities</li>
            </ul>
          </div>
        </div>
      )}

      {/* Quiz */}
      {activeTab === 'quiz' && (
        <div className="card">
          <h2>📝 Turkey Biology Quiz</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            Test your knowledge! Score 8/10 or higher to earn <strong>50 points</strong>.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>1. When were wild turkeys extirpated from Pennsylvania?</strong></p>
              <p>A) 1740  B) 1840  C) 1940  D) They were never eliminated</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>2. What is the primary characteristic that distinguishes male turkeys?</strong></p>
              <p>A) Larger beak  B) Beard  C) Longer legs  D) Different call</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>3. How fast can a wild turkey fly?</strong></p>
              <p>A) 25 mph  B) 35 mph  C) 45 mph  D) 55 mph</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>4. What is a &quot;gobble&quot; used for?</strong></p>
              <p>A) Alarm call  B) Attract mates  C) Find food  D) Navigate</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>5. How many toes do turkey tracks show?</strong></p>
              <p>A) 3  B) 4  C) 5  D) 2</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>6. What is the turkey&apos;s primary fall/winter food?</strong></p>
              <p>A) Insects  B) Grass  C) Acorns  D) Worms</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>7. Pennsylvania&apos;s turkey population is approximately:</strong></p>
              <p>A) 50,000  B) 100,000  C) 200,000  D) 500,000</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>8. What sound does a turkey make when alarmed?</strong></p>
              <p>A) Gobble  B) Yelp  C) Putt  D) Purr</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>9. Male turkey droppings are typically:</strong></p>
              <p>A) Spiral-shaped  B) J-shaped  C) Round  D) Flat</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p><strong>10. Wild turkeys can run up to:</strong></p>
              <p>A) 10 mph  B) 15 mph  C) 20 mph  D) 25 mph</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#e6f3ff', borderRadius: '12px' }}>
            <h4>✅ Answer Key</h4>
            <p>1-B, 2-B, 3-D, 4-B, 5-B (4 toes), 6-C, 7-C, 8-C, 9-B, 10-D</p>
            <button 
              onClick={() => completeQuiz(9)}
              style={{
                marginTop: '1rem',
                padding: '1rem 2rem',
                background: '#A7C957',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Submit Quiz (Score: 9/10)
            </button>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <>
          <ConservationHistory history={TERRESTRIAL_CONSERVATION_HISTORY} />
          
          <div style={{ marginTop: '2rem' }}>
            <LocalHistoryResearch />
          </div>
        </>
      )}
    </section>
  );
}

