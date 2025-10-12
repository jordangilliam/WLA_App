'use client';
import { usePoints } from '@/ui/points/PointsProvider';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { total, award, level, levelProgress, currentStreak, badges, getRecentBadges } = usePoints();
  const earnedBadges = badges.filter(b => b.earned);
  const recentBadges = getRecentBadges();
  
  return (
    <>
      {/* Hero Section - Immersive PA Conservation */}
      <section style={{
        position: 'relative',
        minHeight: '500px',
        background: 'radial-gradient(ellipse at center, #0096C7 0%, #0077B6 40%, #023047 100%)',
        color: 'white',
        overflow: 'hidden',
        marginTop: '1rem',
        borderRadius: '16px',
      }}>
        {/* Hero Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.25,
          backgroundImage: 'url(/images/hero/Hero%20BAckground.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: 'rgba(255,193,7,0.9)',
            color: '#023047',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Pennsylvania Wildlife Leadership Academy
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}>
            Become a Conservation Leader
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            maxWidth: '800px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.95)',
          }}>
            Join Pennsylvania&apos;s elite program training the next generation of wildlife biologists, 
            habitat managers, and conservation scientists. Learn from experts, conduct real field research, 
            and make lasting impacts on our state&apos;s natural heritage.
          </p>
          
          {/* Brook AI Search Bar */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            padding: '0 1rem',
          }}>
            <div 
              id="skl_id_search_hero_section" 
              data-chat-id="FX9IIOtCFx" 
              data-is-hero="true"
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            />
            <p style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
            }}>
              💬 <strong>Ask Brook!</strong> Your AI conservation assistant powered by Penn State Extension research
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}>
            <Link
              href="/learn"
              style={{
                padding: '1.25rem 2.5rem',
                background: '#FFD60A',
                color: '#023047',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s',
                display: 'inline-block',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
            >
              Start Learning →
            </Link>
            
            <Link
              href="/map"
              style={{
                padding: '1.25rem 2.5rem',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1.1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
                display: 'inline-block',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              Explore Watersheds
            </Link>
          </div>

          {/* Program Stats */}
          <div style={{
            display: 'flex',
            gap: '3rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            padding: '2rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>1,000+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Ambassadors Trained</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>500+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Field Projects</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>67</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>PA Counties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Progress Dashboard */}
      <section style={{ margin: '3rem 0' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#023047',
        }}>
          Your Conservation Journey
        </h2>
        
        <div className="row animate-fade-in">
          <div className="card section" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
            color: 'white',
            border: 'none',
          }}>
            {/* TODO: Replace with Oak Leaf Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
            }}>
              [Oak Leaf]
            </div>
            <div className="points-display" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{total}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, opacity: 0.95 }}>Conservation Points</div>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.85 }}>
              Earned through field work, lessons, and habitat projects
            </p>
          </div>
          
          <div className="card section" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #7209B7 0%, #9D4EDD 100%)',
            color: 'white',
            border: 'none',
          }}>
            {/* TODO: Replace with Tree Rings Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
            }}>
              [Tree Rings]
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>Level {level}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, opacity: 0.95 }}>Ambassador Rank</div>
            <div style={{ marginTop: '1rem' }}>
              <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.3)', height: '12px' }}>
                <div className="progress-fill" style={{ width: `${levelProgress}%`, background: 'white', height: '12px' }}></div>
              </div>
              <small style={{ opacity: 0.85, marginTop: '0.5rem', display: 'block' }}>
                {Math.round(levelProgress)}% to Level {level + 1}
              </small>
          </div>
        </div>
        
          <div className="card section" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2A9D8F 0%, #41B3A3 100%)',
            color: 'white',
            border: 'none',
          }}>
            {/* TODO: Replace with Grouse Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
            }}>
              [Grouse]
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{currentStreak}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, opacity: 0.95 }}>Day Streak</div>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.85 }}>
              Keep logging in daily to maintain momentum
            </p>
        </div>
        
          <div className="card section" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FFD60A 0%, #FFC300 100%)',
            color: '#023047',
            border: 'none',
          }}>
            {/* TODO: Replace with Badge Collection Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              background: 'rgba(2,48,71,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
            }}>
              [Badges]
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              {earnedBadges.length}<span style={{ fontSize: '1.5rem', opacity: 0.6 }}>/{badges.length}</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Achievements Unlocked</div>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.85 }}>
              Earn badges through mastery and dedication
            </p>
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      {recentBadges.length > 0 && (
        <section className="section animate-slide-up" style={{
          background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
          borderRadius: '16px',
          padding: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* TODO: Replace with Wildflower Celebration Icon */}
            <div style={{
              fontSize: '2.5rem',
              background: 'white',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              [Flowers]
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#023047', margin: 0 }}>Recent Achievements</h2>
          </div>
          
      <div className="row">
            {recentBadges.map(badge => (
              <div key={badge.id} className={`badge badge-${badge.tier}`} style={{
                flex: '1 1 250px',
                padding: '1.5rem',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>{badge.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem', color: '#023047' }}>
                    {badge.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Missions - Redesigned */}
      <div className="row" style={{ marginTop: '3rem', gap: '2rem' }}>
        <div className="section card" style={{ flex: '2 1 400px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#023047', marginBottom: '0.5rem' }}>
            Today&apos;s Field Missions
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            Complete hands-on conservation activities to earn points and advance your skills
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '2px solid #FFD54F',
            }}>
              <div>
                {/* TODO: Replace with Conservation History Icon */}
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem', color: '#023047' }}>
                  [Field Guide Icon] PA Conservation History
                </div>
                <div style={{ fontSize: '0.95rem', color: '#5D4037' }}>
                  Learn about Gifford Pinchot and the birth of modern forestry
                </div>
              </div>
              <button
                className="btn-success"
                onClick={() => award(10, 'history-lesson')}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                +10 pts
              </button>
            </div>
            
            <div style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '2px solid #64B5F6',
            }}>
              <div>
                {/* TODO: Replace with Water Droplet Icon */}
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem', color: '#023047' }}>
                  [Water Drop Icon] Water Quality Monitoring
                </div>
                <div style={{ fontSize: '0.95rem', color: '#01579B' }}>
                  Collect temperature, pH, and dissolved oxygen readings
                </div>
              </div>
              <button
                className="btn-success"
                onClick={() => award(15, 'water-reading')}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                +15 pts
              </button>
            </div>
            
            <div style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '2px solid #BA68C8',
            }}>
              <div>
                {/* TODO: Replace with Macro Icon */}
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem', color: '#023047' }}>
                  [Macro Icon] Macroinvertebrate Survey
                </div>
                <div style={{ fontSize: '0.95rem', color: '#4A148C' }}>
                  Photograph and identify aquatic invertebrates for iNaturalist
                </div>
              </div>
              <button
                className="btn-success"
                onClick={() => award(5, 'macro-upload')}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                +5 pts
              </button>
            </div>

            <div style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '2px solid #81C784',
            }}>
              <div>
                {/* TODO: Replace with Habitat Icon */}
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem', color: '#023047' }}>
                  [Habitat Icon] Design Wildlife Habitat
                </div>
                <div style={{ fontSize: '0.95rem', color: '#1B5E20' }}>
                  Use the simulator to create a balanced Pennsylvania ecosystem
                </div>
              </div>
              <button
                className="btn-success"
                onClick={() => award(8, 'habitat-sim')}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                +8 pts
              </button>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="section card" style={{ flex: '1 1 300px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#023047', marginBottom: '0.5rem' }}>
            Explore Platform
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            Access all conservation tools and resources
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/learn" className="btn btn-outline" style={{
              textAlign: 'left',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #E5E7EB',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#FFF8E1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <Image 
                  src="/images/icons/Book.png" 
                  alt="Learn" 
                  width={48} 
                  height={48}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.1rem' }}>Learn</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>12 comprehensive lessons</div>
              </div>
            </Link>
            
            <Link href="/map" className="btn btn-outline" style={{
              textAlign: 'left',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #E5E7EB',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#E3F2FD',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <Image 
                  src="/images/icons/Map.jpg" 
                  alt="Watersheds" 
                  width={48} 
                  height={48}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.1rem' }}>Watersheds</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Interactive PA map</div>
              </div>
            </Link>
            
            <Link href="/keys/macro" className="btn btn-outline" style={{
              textAlign: 'left',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #E5E7EB',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#F3E5F5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <Image 
                  src="/images/icons/Micor(Macro).png" 
                  alt="ID Keys" 
                  width={48} 
                  height={48}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.1rem' }}>ID Keys</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Species identification</div>
              </div>
            </Link>
            
            <Link href="/habitat" className="btn btn-outline" style={{
              textAlign: 'left',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #E5E7EB',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#E8F5E9',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <Image 
                  src="/images/icons/Habitat.png" 
                  alt="Habitat" 
                  width={48} 
                  height={48}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.1rem' }}>Habitat</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Ecosystem builder</div>
              </div>
            </Link>
            
            <Link href="/journal" className="btn btn-outline" style={{
              textAlign: 'left',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #E5E7EB',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#FFF3E0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <Image 
                  src="/images/icons/journal.jpg" 
                  alt="Journal" 
                  width={48} 
                  height={48}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.1rem' }}>Journal</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Field documentation</div>
              </div>
            </Link>
            
            <Link href="/leaderboard" className="btn btn-outline" style={{
              textAlign: 'left',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #E5E7EB',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#FFF8E1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <Image 
                  src="/images/icons/award.jpg" 
                  alt="Leaderboard" 
                  width={48} 
                  height={48}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.1rem' }}>Leaderboard</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Team standings</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Conservation Tracks - Redesigned */}
      <section style={{
        marginTop: '4rem',
        background: 'linear-gradient(135deg, #023047 0%, #0077B6 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        color: 'white',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: 'white' }}>
            Choose Your Conservation Track
          </h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
            Specialize in a specific area of Pennsylvania wildlife management and become an expert in your field
          </p>
        </div>

        <div className="row" style={{ gap: '1.5rem' }}>
          <Link href="/learn?track=Brookies" className="card" style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid rgba(255,255,255,0.2)',
            textDecoration: 'none',
            color: 'white',
            transition: 'all 0.3s',
          }} onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              margin: '0 auto 1.5rem',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
              <Image 
                src="/images/tracks/Brook%20Trout.png" 
                alt="Brook Trout" 
                width={150} 
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
          </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>
              Brookies
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              Cold-water stream ecology, brook trout conservation, and wild trout management in Pennsylvania&apos;s pristine mountain waters
            </p>
          </Link>

          <Link href="/learn?track=Bass" className="card" style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid rgba(255,255,255,0.2)',
            textDecoration: 'none',
            color: 'white',
            transition: 'all 0.3s',
          }} onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              margin: '0 auto 1.5rem',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
              <Image 
                src="/images/tracks/Bass.png" 
                alt="Largemouth Bass" 
                width={150} 
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
          </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>
              Bass
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              Warm-water fisheries management, lake and reservoir ecology, and largemouth bass population dynamics in PA waters
            </p>
          </Link>

          <Link href="/learn?track=Bucktails" className="card" style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid rgba(255,255,255,0.2)',
            textDecoration: 'none',
            color: 'white',
            transition: 'all 0.3s',
          }} onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              margin: '0 auto 1.5rem',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
              <Image 
                src="/images/tracks/Deer.png" 
                alt="White-tailed Deer" 
                width={150} 
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
          </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>
              Bucktails
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              White-tailed deer management, wildlife population monitoring, and forest regeneration in Pennsylvania hardwoods
            </p>
          </Link>

          <Link href="/learn?track=Gobblers" className="card" style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid rgba(255,255,255,0.2)',
            textDecoration: 'none',
            color: 'white',
            transition: 'all 0.3s',
          }} onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              margin: '0 auto 1.5rem',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
              <Image 
                src="/images/tracks/Turkey.png" 
                alt="Wild Turkey" 
                width={150} 
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
          </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>
              Gobblers
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              Wild turkey restoration, upland game bird management, and Pennsylvania&apos;s forest-field edge habitats
            </p>
          </Link>

          <Link href="/learn?track=Ursids" className="card" style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid rgba(255,255,255,0.2)',
            textDecoration: 'none',
            color: 'white',
            transition: 'all 0.3s',
          }} onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              margin: '0 auto 1.5rem',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
              <Image 
                src="/images/tracks/Black%20Bear.png" 
                alt="Black Bear" 
                width={150} 
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
        </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>
              Ursids
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              Pennsylvania black bear ecology, large carnivore management, and human-wildlife coexistence in the Alleghenies
            </p>
          </Link>
      </div>
    </section>
    </>
  );
}
