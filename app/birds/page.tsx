'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import { BIRD_CONSERVATION_HISTORY } from '@/lib/data/conservation-history';
import ConservationHistory from '@/components/ConservationHistory';
import LocalHistoryResearch from '@/components/LocalHistoryResearch';

interface BirdObservation {
  id: string;
  species: string;
  audio: string;
  duration: number;
  location: { lat: number; lng: number } | null;
  timestamp: number;
  habitat: string;
  behavior?: string;
  notes?: string;
}

const PA_BIRDS = [
  { 
    id: 'cardinal', 
    name: 'Northern Cardinal', 
    points: 5,
    song: 'Clear whistled "birdy-birdy-birdy"',
    emoji: '🔴',
    rarity: 'Common'
  },
  { 
    id: 'blue-jay', 
    name: 'Blue Jay', 
    points: 5,
    song: 'Harsh "jay-jay" call',
    emoji: '🔵',
    rarity: 'Common'
  },
  { 
    id: 'robin', 
    name: 'American Robin', 
    points: 5,
    song: 'Cheerful "cheerily-cheer-up"',
    emoji: '🐦',
    rarity: 'Common'
  },
  { 
    id: 'chickadee', 
    name: 'Black-capped Chickadee', 
    points: 5,
    song: 'Clear "chick-a-dee-dee-dee"',
    emoji: '🐦‍⬛',
    rarity: 'Common'
  },
  { 
    id: 'goldfinch', 
    name: 'American Goldfinch', 
    points: 6,
    song: 'Sweet "po-ta-to-chip" in flight',
    emoji: '💛',
    rarity: 'Common'
  },
  { 
    id: 'wood-thrush', 
    name: 'Wood Thrush', 
    points: 10,
    song: 'Flute-like "ee-oh-lay"',
    emoji: '🦜',
    rarity: 'Uncommon - Forest Indicator'
  },
  { 
    id: 'scarlet-tanager', 
    name: 'Scarlet Tanager', 
    points: 10,
    song: 'Hoarse robin-like warble',
    emoji: '🦜',
    rarity: 'Uncommon - Forest Canopy'
  },
  { 
    id: 'baltimore-oriole', 
    name: 'Baltimore Oriole', 
    points: 8,
    song: 'Rich whistled phrases',
    emoji: '🧡',
    rarity: 'Uncommon'
  },
  { 
    id: 'eastern-towhee', 
    name: 'Eastern Towhee', 
    points: 7,
    song: '"Drink-your-tea"',
    emoji: '🐦',
    rarity: 'Uncommon'
  },
  { 
    id: 'pileated', 
    name: 'Pileated Woodpecker', 
    points: 15,
    song: 'Loud, irregular "wuk-wuk-wuk"',
    emoji: '🪶',
    rarity: 'Rare - Old Growth Forest'
  },
  { 
    id: 'barred-owl', 
    name: 'Barred Owl', 
    points: 12,
    song: '"Who cooks for you"',
    emoji: '🦉',
    rarity: 'Uncommon - Nocturnal'
  },
  { 
    id: 'whip-poor-will', 
    name: 'Eastern Whip-poor-will', 
    points: 15,
    song: 'Repetitive "whip-poor-will"',
    emoji: '🌙',
    rarity: 'Rare - Declining Species'
  },
];

export default function BirdSongs() {
  const { award } = usePoints();
  const [observations, setObservations] = useState<BirdObservation[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [habitat, setHabitat] = useState('woodland');
  const [behavior, setBehavior] = useState('');
  const [notes, setNotes] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load saved observations
    const saved = localStorage.getItem('wla-bird-obs');
    if (saved) {
      try {
        setObservations(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      alert('Microphone access denied. Please enable microphone permissions in your browser settings.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, (error) => {
        alert('Unable to get location. Please enable location services.');
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const submitObservation = (speciesId: string) => {
    if (!audioURL || !audioBlob) {
      alert('Please record audio first');
      return;
    }

    const bird = PA_BIRDS.find(b => b.id === speciesId);
    if (!bird) return;

    // Convert blob to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const obs: BirdObservation = {
        id: `bird-${Date.now()}`,
        species: bird.name,
        audio: reader.result as string,
        duration: recordingTime,
        location,
        timestamp: Date.now(),
        habitat,
        behavior,
        notes
      };

      // Save observation
      const updated = [...observations, obs];
      setObservations(updated);
      localStorage.setItem('wla-bird-obs', JSON.stringify(updated));

      // Award points
      award(bird.points, `Bird ID: ${bird.name}`);

      // Reset
      setAudioURL('');
      setAudioBlob(null);
      setBehavior('');
      setNotes('');
      setRecordingTime(0);

      alert(`Great identification! +${bird.points} points for ${bird.name}!`);
    };
    reader.readAsDataURL(audioBlob);
  };

  const deleteObservation = (id: string) => {
    if (confirm('Delete this observation?')) {
      const updated = observations.filter(o => o.id !== id);
      setObservations(updated);
      localStorage.setItem('wla-bird-obs', JSON.stringify(updated));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Header */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, #06D6A0, #0077B6)',
        color: 'white',
        textAlign: 'center',
        padding: '3rem 1.5rem'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>
          🦜 Bird Song Identification
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Record bird songs, identify species, and contribute to avian biodiversity monitoring!
        </p>
      </section>

      {/* Stats */}
      <div className="row" style={{ marginTop: '-1rem', marginBottom: '2rem' }}>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #FFB703, #FB8500)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{observations.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Birds Identified</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #9D4EDD, #7209B7)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>
            {new Set(observations.map(o => o.species)).size}
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Unique Species</p>
        </div>
      </div>

      {/* Bird Guide */}
      <div className="section">
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="btn-outline"
          style={{ marginBottom: '1rem' }}
        >
          {showGuide ? '🦜 Hide' : '🦜 Show'} PA Bird Guide
        </button>
        
        {showGuide && (
          <div className="card section" style={{ background: '#F8F9FA' }}>
            <h3>Pennsylvania Birds</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {PA_BIRDS.map(bird => (
                <div 
                  key={bird.id} 
                  style={{
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: '2px solid #E9ECEF'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                    {bird.emoji}
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{bird.name}</h4>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    background: bird.rarity.includes('Rare') ? '#FEE2E2' : bird.rarity.includes('Uncommon') ? '#FEF3C7' : '#DBEAFE',
                    color: bird.rarity.includes('Rare') ? '#991B1B' : bird.rarity.includes('Uncommon') ? '#92400E' : '#1E40AF',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}>
                    {bird.rarity}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#6C757D', margin: '0.5rem 0', fontStyle: 'italic' }}>
                    &ldquo;{bird.song}&rdquo;
                  </p>
                  <div style={{ color: '#FFB703', fontWeight: 600, fontSize: '0.9rem' }}>
                    +{bird.points} points
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recording Interface */}
      <div className="section card">
        <h2>🎤 Record Bird Song</h2>
        
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          background: isRecording ? '#FEE2E2' : '#F8F9FA',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          {!isRecording ? (
            <button 
              onClick={startRecording} 
              style={{
                fontSize: '1.5rem',
                padding: '1.5rem 3rem',
                background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🎤 Start Recording
            </button>
          ) : (
            <>
              <div style={{ 
                fontSize: '3rem', 
                color: '#DC2626',
                marginBottom: '1rem',
                animation: 'pulse 1.5s infinite'
              }}>
                🔴
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#DC2626', marginBottom: '1rem' }}>
                {formatTime(recordingTime)}
              </div>
              <button 
                onClick={stopRecording}
                style={{
                  fontSize: '1.2rem',
                  padding: '1rem 2.5rem',
                  background: '#1F2937',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ⏹️ Stop Recording
              </button>
            </>
          )}
        </div>

        {audioURL && (
          <div>
            <h3>🎵 Playback & Identification</h3>
            <div style={{ 
              background: '#F8F9FA', 
              padding: '1.5rem', 
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <audio 
                controls 
                src={audioURL} 
                style={{ width: '100%', marginBottom: '1rem' }} 
              />
              <div style={{ fontSize: '0.9rem', color: '#6C757D' }}>
                Duration: {formatTime(recordingTime)}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                Habitat:
              </label>
              <select 
                value={habitat} 
                onChange={(e) => setHabitat(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '6px',
                  border: '2px solid #E9ECEF',
                  fontSize: '1rem'
                }}
              >
                <option value="woodland">Woodland/Forest</option>
                <option value="edge">Forest Edge</option>
                <option value="field">Field/Grassland</option>
                <option value="wetland">Wetland/Marsh</option>
                <option value="urban">Urban/Suburban</option>
                <option value="riparian">Stream/River</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <button 
                onClick={getCurrentLocation} 
                className="btn-outline"
                style={{ width: '100%' }}
              >
                📍 Get GPS Location
              </button>
              {location && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  padding: '1rem',
                  background: '#D1FAE5',
                  borderRadius: '6px',
                  color: '#065F46',
                  fontWeight: 600
                }}>
                  ✓ Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                Behavior (optional):
              </label>
              <input 
                type="text"
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                placeholder="e.g., singing from treetop, alarm call, duet"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '2px solid #E9ECEF',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                Notes (optional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Weather, time of day, other observations..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '2px solid #E9ECEF',
                  fontSize: '1rem',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Which bird did you hear?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {PA_BIRDS.map(bird => (
                <button 
                  key={bird.id}
                  onClick={() => submitObservation(bird.id)}
                  style={{
                    padding: '1rem',
                    background: 'white',
                    border: '2px solid #E9ECEF',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#0077B6';
                    e.currentTarget.style.background = '#F0F9FF';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#E9ECEF';
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{bird.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {bird.name}
                  </div>
                  <div style={{ color: '#FFB703', fontSize: '0.85rem', fontWeight: 600 }}>
                    +{bird.points} pts
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Observations */}
      {observations.length > 0 && (
        <div className="section">
          <h2>🎵 Your Recordings ({observations.length})</h2>
          <div className="row">
            {observations.slice().reverse().map(obs => (
              <div key={obs.id} className="card section" style={{ flex: '0 0 calc(50% - 1rem)', minWidth: '320px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{obs.species}</h3>
                  <button 
                    onClick={() => deleteObservation(obs.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: '#DC2F02',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
                
                <audio 
                  controls 
                  src={obs.audio} 
                  style={{ width: '100%', marginBottom: '1rem' }} 
                />
                
                <div style={{ fontSize: '0.9rem', color: '#6C757D' }}>
                  <div><strong>Duration:</strong> {formatTime(obs.duration)}</div>
                  <div><strong>Habitat:</strong> {obs.habitat}</div>
                  <div><strong>Date:</strong> {new Date(obs.timestamp).toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {new Date(obs.timestamp).toLocaleTimeString()}</div>
                  {obs.location && (
                    <div><strong>Location:</strong> {obs.location.lat.toFixed(4)}, {obs.location.lng.toFixed(4)}</div>
                  )}
                  {obs.behavior && (
                    <div><strong>Behavior:</strong> {obs.behavior}</div>
                  )}
                  {obs.notes && (
                    <div style={{ marginTop: '0.5rem' }}><strong>Notes:</strong> {obs.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <section className="section" style={{ background: '#F8F9FA', borderRadius: '12px', padding: '2rem' }}>
        <h2>💡 Recording Tips</h2>
        <div className="row">
          <div className="card section" style={{ flex: 1 }}>
            <h3>⏰ Best Times</h3>
            <ul style={{ lineHeight: 2 }}>
              <li>Dawn (30 min before sunrise)</li>
              <li>Dusk (1 hour before sunset)</li>
              <li>Early morning (most active)</li>
              <li>Spring migration</li>
            </ul>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>📱 Recording Quality</h3>
            <ul style={{ lineHeight: 2 }}>
              <li>Minimize background noise</li>
              <li>Point mic toward bird</li>
              <li>Record 10-30 seconds</li>
              <li>Note weather conditions</li>
            </ul>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>🔍 Identification</h3>
            <ul style={{ lineHeight: 2 }}>
              <li>Listen for patterns</li>
              <li>Note pitch and rhythm</li>
              <li>Use Merlin Bird ID app</li>
              <li>Compare to reference songs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Conservation History Section */}
      <section className="section" style={{ marginTop: '2rem' }}>
        <ConservationHistory history={BIRD_CONSERVATION_HISTORY} />
        
        <div style={{ marginTop: '2rem' }}>
          <LocalHistoryResearch />
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
