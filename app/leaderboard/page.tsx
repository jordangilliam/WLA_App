'use client';
import { useEffect, useMemo, useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';

type Team = { name: string; points: number };
const TRACKS = [
  { name: 'Bucktails', icon: '🦌', color: '#8B4513' },
  { name: 'Bass', icon: '🐟', color: '#00B4D8' },
  { name: 'Brookies', icon: '🎣', color: '#0077B6' },
  { name: 'Gobblers', icon: '🦃', color: '#A7C957' },
  { name: 'Ursids', icon: '🐻', color: '#6C757D' }
];

export default function Leaderboard(){
  const { total, level, badges } = usePoints();
  const [track, setTrack] = useState('Brookies');
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState<Record<string, Team[]>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(()=>{ 
    try{ 
      const raw = localStorage.getItem('wla-leaderboards'); 
      if(raw) setTeams(JSON.parse(raw)); 
    }catch{} 
  },[]);
  
  const list = useMemo(()=> teams[track] || [], [teams, track]);
  const currentTrack = TRACKS.find(t => t.name === track);
  const earnedBadges = badges.filter(b => b.earned).length;
  
  const save = (next: Record<string, Team[]>) => { 
    setTeams(next); 
    localStorage.setItem('wla-leaderboards', JSON.stringify(next)); 
  };
  
  const addOrUpdate = () => {
    if(!teamName.trim()) {
      alert('Please enter a team name!');
      return;
    }
    const next = { ...teams };
    const arr = next[track] ? [...next[track]] : [];
    const idx = arr.findIndex(t=>t.name.toLowerCase()===teamName.trim().toLowerCase());
    if(idx>=0){ 
      arr[idx] = { name: teamName.trim(), points: total }; 
    } else { 
      arr.push({ name: teamName.trim(), points: total }); 
    }
    arr.sort((a,b)=>b.points-a.points); 
    next[track] = arr; 
    save(next);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const resetTrack = () => { 
    if(confirm(`Reset all ${track} leaderboard data?`)) {
      const next = { ...teams, [track]: [] }; 
      save(next); 
    }
  };
  
  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };
  
  return (
    <>
      <section className="section bg-purple animate-slide-up" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'white' }}>🏆 Team Leaderboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
          Compete with teams across Pennsylvania! Submit your score and climb the rankings.
        </p>
      </section>

      <div className="row">
        <div className="card section">
          <h2>📊 Your Stats</h2>
          <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #DEE2E6' }}>
              <span style={{ fontWeight: 600 }}>Total Points</span>
              <span className="points-display" style={{ fontSize: '1.5rem' }}>{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #DEE2E6' }}>
              <span style={{ fontWeight: 600 }}>Level</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>Level {level}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>Badges Earned</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{earnedBadges} 🏅</span>
            </div>
          </div>
          
          <h3>Submit Your Score</h3>
          <label>
            Track
            <select value={track} onChange={e=>setTrack(e.target.value)} style={{ fontSize: '1rem' }}>
              {TRACKS.map(t=><option key={t.name} value={t.name}>{t.icon} {t.name}</option>)}
            </select>
          </label>
          
          <label>
            Your Team Name
            <input 
              value={teamName} 
              onChange={e=>setTeamName(e.target.value)} 
              placeholder="e.g., Brookies Blue Squad" 
              style={{ fontSize: '1rem' }}
            />
          </label>
          
          {showSuccess && (
            <div style={{ 
              padding: '1rem', 
              background: 'linear-gradient(135deg, #06D6A0, #A7C957)', 
              color: 'white', 
              borderRadius: '10px', 
              marginBottom: '1rem',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              🎉 Score submitted successfully!
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
            <button onClick={addOrUpdate} className="btn-success" style={{ width: '100%', fontSize: '1.1rem' }}>
              🚀 Submit to Leaderboard
            </button>
            <button onClick={resetTrack} className="btn-outline" style={{ width: '100%' }}>
              🔄 Reset Track
            </button>
          </div>
        </div>

        <div className="card section" style={{flex:'2 1 520px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem' }}>{currentTrack?.icon}</div>
            <div>
              <h2 style={{ margin: 0 }}>{track} Rankings</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{list.length} teams competing</p>
            </div>
          </div>
          
          {list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏁</div>
              <p style={{ fontSize: '1.1rem' }}>No teams yet! Be the first to submit your score.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {list.map((t,i)=>(
                <div 
                  key={i} 
                  style={{ 
                    padding: '1rem 1.25rem',
                    background: i < 3 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#F8F9FA',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    color: i < 3 ? 'white' : 'var(--text)',
                    boxShadow: i < 3 ? 'var(--shadow-md)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  className="animate-slide-up"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', minWidth: '40px' }}>{getMedalEmoji(i)}</span>
                    <span style={{ fontSize: '1.1rem' }}>{t.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{t.points}</span>
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Track Selector Cards */}
      <section className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🎯 All Tracks</h2>
        <div className="row">
          {TRACKS.map(t => (
            <div 
              key={t.name}
              className="card section"
              style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                background: track === t.name ? 'linear-gradient(135deg, var(--wla-blue), var(--wla-teal))' : 'white',
                color: track === t.name ? 'white' : 'var(--text)',
                transform: track === t.name ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setTrack(t.name)}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{t.icon}</div>
              <h3 style={{ color: track === t.name ? 'white' : 'var(--text)' }}>{t.name}</h3>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {(teams[t.name] || []).length} teams
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
