'use client';
import { usePoints } from '@/ui/points/PointsProvider';
import Link from 'next/link';

export default function Home() {
  const { total, award, level, levelProgress, currentStreak, badges, getRecentBadges } = usePoints();
  const earnedBadges = badges.filter(b => b.earned);
  const recentBadges = getRecentBadges();
  
  return (
    <>
      {/* Hero Section */}
      <section className="section bg-blue animate-slide-up" style={{ marginTop: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', marginBottom: '0.5rem' }}>🌲 WLA Conservation Ambassadors 🦌</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.95)', maxWidth: '800px', margin: '0 auto' }}>
            Join thousands of PA youth protecting wildlife, restoring habitats, and becoming conservation leaders!
          </p>
        </div>
      </section>

      {/* Stats Dashboard */}
      <div className="row animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card section bg-orange" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⭐</div>
          <div className="points-display" style={{ fontSize: '2.5rem', color: 'white' }}>{total}</div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '1.1rem' }}>Total Points</div>
        </div>
        
        <div className="card section bg-purple" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>Level {level}</div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginTop: '0.5rem' }}>
            <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.3)' }}>
              <div className="progress-fill" style={{ width: `${levelProgress}%`, background: 'white' }}></div>
            </div>
            <small>{Math.round(levelProgress)}% to next level</small>
          </div>
        </div>
        
        <div className="card section bg-green" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔥</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{currentStreak} Days</div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '1.1rem' }}>Current Streak</div>
        </div>
        
        <div className="card section" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{earnedBadges.length}/{badges.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '1.1rem' }}>Badges Earned</div>
        </div>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <section className="section animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2>🎉 Recent Achievements</h2>
      <div className="row">
            {recentBadges.map(badge => (
              <div key={badge.id} className={`badge badge-${badge.tier}`} style={{ flex: '1 1 200px', padding: '1rem', fontSize: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{badge.name}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Goals */}
      <div className="row" style={{ animationDelay: '0.3s' }}>
        <div className="section card" style={{ flex: '2 1 400px' }}>
          <h2>🎯 Today&apos;s Missions</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Complete these activities to earn points and level up!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#F8F9FA', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>📚 Learn PA Conservation History</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Explore our wildlife heritage</div>
              </div>
              <button className="btn-success" onClick={()=>award(10,'history-lesson')}>+10 pts</button>
            </div>
            
            <div style={{ padding: '1rem', background: '#F8F9FA', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>💧 Record Water Quality Data</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Take temp & pH readings</div>
              </div>
              <button className="btn-success" onClick={()=>award(15,'water-reading')}>+15 pts</button>
            </div>
            
            <div style={{ padding: '1rem', background: '#F8F9FA', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>🔬 Upload Macro Photo</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Document aquatic life</div>
              </div>
              <button className="btn-success" onClick={()=>award(5,'macro-upload')}>+5 pts</button>
            </div>

            <div style={{ padding: '1rem', background: '#F8F9FA', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>🏕️ Design a Habitat</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Run habitat simulation</div>
              </div>
              <button className="btn-success" onClick={()=>award(8,'habitat-sim')}>+8 pts</button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="section card">
          <h2>🚀 Quick Start</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Choose your adventure:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/learn" className="btn btn-outline" style={{ textAlign: 'left', padding: '1rem', display: 'block' }}>
              📚 <strong>Learn</strong> - Conservation education
            </Link>
            <Link href="/map" className="btn btn-outline" style={{ textAlign: 'left', padding: '1rem', display: 'block' }}>
              🗺️ <strong>Map</strong> - Watershed monitoring
            </Link>
            <Link href="/keys/macro" className="btn btn-outline" style={{ textAlign: 'left', padding: '1rem', display: 'block' }}>
              🔬 <strong>ID Keys</strong> - Identify species
            </Link>
            <Link href="/habitat" className="btn btn-outline" style={{ textAlign: 'left', padding: '1rem', display: 'block' }}>
              🏕️ <strong>Habitat</strong> - Build ecosystems
            </Link>
            <Link href="/journal" className="btn btn-outline" style={{ textAlign: 'left', padding: '1rem', display: 'block' }}>
              📸 <strong>Journal</strong> - Document your journey
            </Link>
            <Link href="/leaderboard" className="btn btn-outline" style={{ textAlign: 'left', padding: '1rem', display: 'block' }}>
              🏆 <strong>Leaderboard</strong> - Team rankings
            </Link>
          </div>
        </div>
      </div>

      {/* Track Selection */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #023047, #0077B6)', color: 'white' }}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '1.5rem' }}>Choose Your Conservation Track</h2>
        <div className="row">
          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🦌</div>
            <h3 style={{ color: 'white' }}>Bucktails</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Wildlife management & white-tailed deer conservation</p>
          </div>
          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🐟</div>
            <h3 style={{ color: 'white' }}>Bass</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Warm water fisheries & lake ecology</p>
          </div>
          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎣</div>
            <h3 style={{ color: 'white' }}>Brookies</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Cold water streams & brook trout</p>
          </div>
          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🦃</div>
            <h3 style={{ color: 'white' }}>Gobblers</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Wild turkey & upland game birds</p>
          </div>
          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🐻</div>
            <h3 style={{ color: 'white' }}>Ursids</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Black bears & forest ecosystems</p>
        </div>
      </div>
    </section>
    </>
  );
}
