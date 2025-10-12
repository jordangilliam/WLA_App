'use client';
import { useState, useEffect, useRef } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';

interface InsectObservation {
  id: string;
  timestamp: number;
  speciesId: string;
  location: string;
  behavior: string;
  photos: string[];
  audioUrl?: string;
  notes: string;
}

interface InsectSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Butterfly' | 'Moth' | 'Bee' | 'Beetle' | 'Dragonfly' | 'True Bug';
  points: number;
  emoji: string;
  description: string;
  identifyingFeatures: string[];
  habitat: string[];
  soundDescription?: string;
}

interface KeyStep {
  id: number;
  question: string;
  yesNext: number | string;
  noNext: number | string;
}

const DICHOTOMOUS_KEY: KeyStep[] = [
  { id: 1, question: "Does it have wings?", yesNext: 2, noNext: 15 },
  { id: 2, question: "Does it have 2 pairs of wings (4 total)?", yesNext: 3, noNext: 13 },
  { id: 3, question: "Are both pairs of wings covered in scales?", yesNext: 4, noNext: 8 },
  { id: 4, question: "Is it active during the day?", yesNext: 5, noNext: 7 },
  { id: 5, question: "Does it have orange wings with black veins?", yesNext: "monarch", noNext: 6 },
  { id: 6, question: "Does it have yellow wings with black tiger stripes?", yesNext: "eastern-tiger-swallowtail", noNext: "spicebush-swallowtail" },
  { id: 7, question: "Is it very large (5-6\" wingspan) with red-brown wings?", yesNext: "cecropia-moth", noNext: "luna-moth" },
  { id: 8, question: "Does it have clear or transparent wings?", yesNext: 9, noNext: 11 },
  { id: 9, question: "Is it fuzzy and makes a loud buzzing sound?", yesNext: 10, noNext: "dragonfly" },
  { id: 10, question: "Is it black with yellow bands?", yesNext: "bumble-bee", noNext: "carpenter-bee" },
  { id: 11, question: "Does it have hard wing covers?", yesNext: 12, noNext: "dragonfly" },
  { id: 12, question: "Does it glow/flash light at night?", yesNext: "firefly", noNext: "ladybug" },
  { id: 13, question: "Does it have a long, slender body?", yesNext: "dragonfly", noNext: 14 },
  { id: 14, question: "Is it red and black, found on milkweed?", yesNext: "milkweed-bug", noNext: "spotted-lanternfly" },
  { id: 15, question: "Does it have long antennae and jump?", yesNext: "katydid", noNext: "firefly" }
];

const PA_INSECTS: InsectSpecies[] = [
  {
    id: 'monarch',
    commonName: 'Monarch Butterfly',
    scientificName: 'Danaus plexippus',
    category: 'Butterfly',
    points: 15,
    emoji: '🦋',
    description: 'Iconic migratory butterfly with orange and black wings',
    identifyingFeatures: ['Orange wings with black veins', 'White spots on borders', 'Large wingspan (3.5-4")'],
    habitat: ['Meadows', 'Fields', 'Gardens']
  },
  {
    id: 'eastern-tiger-swallowtail',
    commonName: 'Eastern Tiger Swallowtail',
    scientificName: 'Papilio glaucus',
    category: 'Butterfly',
    points: 10,
    emoji: '🦋',
    description: 'Large yellow butterfly with black tiger stripes',
    identifyingFeatures: ['Yellow with black stripes', 'Blue and red spots', 'Long tail projections'],
    habitat: ['Forests', 'Gardens', 'Stream corridors']
  },
  {
    id: 'spicebush-swallowtail',
    commonName: 'Spicebush Swallowtail',
    scientificName: 'Papilio troilus',
    category: 'Butterfly',
    points: 12,
    emoji: '🦋',
    description: 'Black swallowtail with blue-green iridescence',
    identifyingFeatures: ['Black wings', 'Blue-green scaling', 'Two rows of light spots'],
    habitat: ['Forests', 'Stream banks', 'Woodland edges']
  },
  {
    id: 'bumble-bee',
    commonName: 'Common Eastern Bumble Bee',
    scientificName: 'Bombus impatiens',
    category: 'Bee',
    points: 12,
    emoji: '🐝',
    description: 'Large fuzzy bee critical for pollination',
    identifyingFeatures: ['Black with yellow bands', 'Fuzzy appearance', 'Large size (0.5-1")'],
    habitat: ['Meadows', 'Gardens', 'Forest edges'],
    soundDescription: 'Loud buzzing'
  },
  {
    id: 'carpenter-bee',
    commonName: 'Eastern Carpenter Bee',
    scientificName: 'Xylocopa virginica',
    category: 'Bee',
    points: 8,
    emoji: '🐝',
    description: 'Large bee that nests in wood',
    identifyingFeatures: ['Shiny black abdomen', 'Yellow thorax on males', 'Large size (1")'],
    habitat: ['Dead wood', 'Gardens', 'Forest edges'],
    soundDescription: 'Deep buzzing'
  },
  {
    id: 'firefly',
    commonName: 'Pennsylvania Firefly',
    scientificName: 'Photuris pennsylvanica',
    category: 'Beetle',
    points: 10,
    emoji: '🔦',
    description: 'Bioluminescent beetle that flashes at night',
    identifyingFeatures: ['Soft-bodied', 'Yellow-green light organ', 'Active at dusk'],
    habitat: ['Meadows', 'Wetland edges', 'Lawns']
  },
  {
    id: 'ladybug',
    commonName: 'Seven-spotted Ladybug',
    scientificName: 'Coccinella septempunctata',
    category: 'Beetle',
    points: 5,
    emoji: '🐞',
    description: 'Beneficial beetle that eats aphids',
    identifyingFeatures: ['Red wings with 7 black spots', 'Small size', 'Dome-shaped'],
    habitat: ['Gardens', 'Fields', 'Forests']
  },
  {
    id: 'dragonfly',
    commonName: 'Common Green Darner',
    scientificName: 'Anax junius',
    category: 'Dragonfly',
    points: 10,
    emoji: '🦗',
    description: 'Large migratory dragonfly',
    identifyingFeatures: ['Bright green thorax', 'Blue abdomen', 'Large size (3" body)'],
    habitat: ['Ponds', 'Lakes', 'Slow streams']
  },
  {
    id: 'milkweed-bug',
    commonName: 'Large Milkweed Bug',
    scientificName: 'Oncopeltus fasciatus',
    category: 'True Bug',
    points: 7,
    emoji: '🐛',
    description: 'Orange and black bug found on milkweed',
    identifyingFeatures: ['Orange-red with black markings', 'X pattern on back', 'Found on milkweed'],
    habitat: ['Milkweed patches', 'Fields', 'Roadsides']
  },
  {
    id: 'cecropia-moth',
    commonName: 'Cecropia Moth',
    scientificName: 'Hyalophora cecropia',
    category: 'Moth',
    points: 15,
    emoji: '🦋',
    description: 'Largest native moth in North America',
    identifyingFeatures: ['Huge wingspan (5-6")', 'Red-brown with white bands', 'Crescent moon spots'],
    habitat: ['Forests', 'Edges', 'Gardens']
  },
  {
    id: 'luna-moth',
    commonName: 'Luna Moth',
    scientificName: 'Actias luna',
    category: 'Moth',
    points: 15,
    emoji: '🦋',
    description: 'Ethereal pale green moth with long tail',
    identifyingFeatures: ['Pale green wings', 'Long tail streamers', 'Eyespots'],
    habitat: ['Deciduous forests']
  },
  {
    id: 'katydid',
    commonName: 'Common True Katydid',
    scientificName: 'Pterophylla camellifolia',
    category: 'True Bug',
    points: 8,
    emoji: '🦗',
    description: 'Leaf-like insect famous for night chorus',
    identifyingFeatures: ['Leaf-like green wings', 'Long antennae', 'Large size (2")'],
    habitat: ['Deciduous trees', 'Forest canopy'],
    soundDescription: '"Katy-did, katy-didn\'t" - rhythmic'
  },
  {
    id: 'spotted-lanternfly',
    commonName: 'Spotted Lanternfly',
    scientificName: 'Lycorma delicatula',
    category: 'True Bug',
    points: 5,
    emoji: '🚫',
    description: 'INVASIVE: Report and destroy!',
    identifyingFeatures: ['Gray wings with black spots', 'Red underwings', 'Strong jumper'],
    habitat: ['Tree of Heaven', 'Vineyards', 'Forests']
  }
];

const BEHAVIOR_OPTIONS = ['Nectaring', 'Flying', 'Resting', 'Feeding', 'Calling'];

export default function InsectID() {
  const { award } = usePoints();
  const [activeView, setActiveView] = useState<'key' | 'gallery' | 'observations'>('key');
  const [observations, setObservations] = useState<InsectObservation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<InsectSpecies | null>(null);
  const [newObservation, setNewObservation] = useState<Partial<InsectObservation>>({
    behavior: 'Flying',
    photos: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [keyHistory, setKeyHistory] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wla-insect-observations');
      if (saved) setObservations(JSON.parse(saved));
    } catch {}
  }, []);

  const saveObservations = (updated: InsectObservation[]) => {
    setObservations(updated);
    localStorage.setItem('wla-insect-observations', JSON.stringify(updated));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const photoPromises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    const photos = await Promise.all(photoPromises);
    setNewObservation({ ...newObservation, photos: [...(newObservation.photos || []), ...photos] });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const addObservation = () => {
    if (!newObservation.speciesId) {
      alert('Please select a species');
      return;
    }
    const speciesData = PA_INSECTS.find(s => s.id === newObservation.speciesId);
    let audioUrl: string | undefined;
    if (audioBlob) audioUrl = URL.createObjectURL(audioBlob);
    const observation: InsectObservation = {
      id: `obs-${Date.now()}`,
      timestamp: Date.now(),
      speciesId: newObservation.speciesId,
      location: newObservation.location || 'Unknown',
      behavior: newObservation.behavior || 'Flying',
      photos: newObservation.photos || [],
      audioUrl,
      notes: newObservation.notes || ''
    };
    saveObservations([...observations, observation]);
    let points = speciesData?.points || 5;
    if (observation.photos.length > 0) points += 5;
    if (audioUrl) points += 5;
    award(points, `Insect ID: ${speciesData?.commonName}`);
    setNewObservation({ behavior: 'Flying', photos: [] });
    setAudioBlob(null);
    setShowForm(false);
    setActiveView('observations');
    alert(`Observation saved! +${points} points`);
  };

  const handleKeyAnswer = (answer: 'yes' | 'no') => {
    const step = DICHOTOMOUS_KEY.find(s => s.id === currentStep);
    if (!step) return;
    const next = answer === 'yes' ? step.yesNext : step.noNext;
    if (typeof next === 'string') {
      const species = PA_INSECTS.find(s => s.id === next);
      if (species) {
        setSelectedSpecies(species);
        setKeyHistory([]);
        setCurrentStep(1);
      }
    } else {
      setKeyHistory([...keyHistory, currentStep]);
      setCurrentStep(next);
    }
  };

  const handleKeyBack = () => {
    if (keyHistory.length > 0) {
      setCurrentStep(keyHistory[keyHistory.length - 1]);
      setKeyHistory(keyHistory.slice(0, -1));
    }
  };

  const resetKey = () => {
    setCurrentStep(1);
    setKeyHistory([]);
  };

  const currentKeyStep = DICHOTOMOUS_KEY.find(s => s.id === currentStep);

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #FFB703, #FB8500)', color: 'white', padding: '3rem 1.5rem', marginBottom: '2rem', borderRadius: '16px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🦋 Pennsylvania Insect ID</h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Use the dichotomous key to identify butterflies, bees, beetles, and more
        </p>
      </section>

      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #FFB703, #FB8500)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{observations.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Observations</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{observations.filter(o => o.photos.length > 0).length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>With Photos</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #0077B6, #023047)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{observations.filter(o => o.audioUrl).length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>With Audio</p>
        </div>
      </div>

      <div className="card section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #E5E7EB', paddingBottom: '1rem' }}>
          <button onClick={() => setActiveView('key')} style={{ padding: '0.75rem 1.5rem', background: activeView === 'key' ? '#FFB703' : 'transparent', color: activeView === 'key' ? 'white' : '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            🔑 Identification Key
          </button>
          <button onClick={() => setActiveView('gallery')} style={{ padding: '0.75rem 1.5rem', background: activeView === 'gallery' ? '#FFB703' : 'transparent', color: activeView === 'gallery' ? 'white' : '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            📚 Species Gallery
          </button>
          <button onClick={() => setActiveView('observations')} style={{ padding: '0.75rem 1.5rem', background: activeView === 'observations' ? '#FFB703' : 'transparent', color: activeView === 'observations' ? 'white' : '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            📸 My Observations
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-success" style={{ marginLeft: 'auto' }}>
            ➕ Log Observation
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card section" style={{ marginBottom: '2rem', background: '#F8F9FA' }}>
          <h3>Log Insect Observation</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Species *:</span>
              <select value={newObservation.speciesId || ''} onChange={(e) => setNewObservation({...newObservation, speciesId: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}>
                <option value="">Select a species...</option>
                {PA_INSECTS.map(insect => (
                  <option key={insect.id} value={insect.id}>{insect.emoji} {insect.commonName}</option>
                ))}
              </select>
            </label>
            <div className="row">
              <label style={{ flex: 1, margin: 0 }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Location:</span>
                <input type="text" value={newObservation.location || ''} onChange={(e) => setNewObservation({...newObservation, location: e.target.value})} placeholder="GPS or place name" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }} />
              </label>
              <label style={{ flex: 1, margin: 0 }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Behavior:</span>
                <select value={newObservation.behavior} onChange={(e) => setNewObservation({...newObservation, behavior: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}>
                  {BEHAVIOR_OPTIONS.map(behavior => <option key={behavior}>{behavior}</option>)}
                </select>
              </label>
            </div>
            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Photos (+5 pts):</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '2px solid #E5E7EB' }} />
            </label>
            {newObservation.photos && newObservation.photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {newObservation.photos.map((photo, idx) => (
                  <img key={idx} src={photo} alt={`Photo ${idx + 1}`} style={{ width: '100%', borderRadius: '6px' }} />
                ))}
              </div>
            )}
            <div>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Audio Recording (+5 pts):</span>
              <div className="row" style={{ gap: '0.5rem' }}>
                {!isRecording ? (
                  <button onClick={startRecording} className="btn-success" style={{ flex: 1 }}>🎤 Start Recording</button>
                ) : (
                  <button onClick={stopRecording} className="btn-outline" style={{ flex: 1, background: '#DC2626', color: 'white', border: 'none' }}>⏹️ Stop Recording</button>
                )}
                {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} style={{ flex: 2 }} />}
              </div>
            </div>
            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Notes:</span>
              <textarea value={newObservation.notes || ''} onChange={(e) => setNewObservation({...newObservation, notes: e.target.value})} placeholder="Flight pattern, colors, behavior..." style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB', fontFamily: 'inherit' }} />
            </label>
            <div className="row">
              <button onClick={addObservation} className="btn-success" style={{ flex: 1 }}>💾 Save Observation</button>
              <button onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {activeView === 'key' && (
        <div className="card section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Dichotomous Identification Key</h2>
            <button onClick={resetKey} className="btn-outline">🔄 Start Over</button>
          </div>
          {currentKeyStep ? (
            <div>
              <div style={{ padding: '1.5rem', background: '#F8F9FA', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.5rem' }}>Step {currentStep} of {DICHOTOMOUS_KEY.length}</div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{currentKeyStep.question}</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => handleKeyAnswer('yes')} className="btn-success" style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem' }}>✓ Yes</button>
                  <button onClick={() => handleKeyAnswer('no')} className="btn-outline" style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem', background: '#DC2626', color: 'white', border: 'none' }}>✗ No</button>
                </div>
              </div>
              {keyHistory.length > 0 && (
                <button onClick={handleKeyBack} className="btn-outline" style={{ width: '100%' }}>← Go Back</button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <p>Key completed! Click &quot;Start Over&quot; to identify another insect.</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {PA_INSECTS.map(insect => (
            <div key={insect.id} className="card" style={{ cursor: 'pointer', border: '3px solid #FFB703', transition: 'transform 0.2s' }} onClick={() => setSelectedSpecies(insect)} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>{insect.emoji}</div>
              <h3 style={{ textAlign: 'center', marginBottom: '0.25rem', fontSize: '1.1rem' }}>{insect.commonName}</h3>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic', color: '#6B7280', marginBottom: '0.5rem' }}>{insect.scientificName}</p>
              <div style={{ padding: '0.5rem', borderRadius: '6px', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', background: '#FEF3C7', color: '#92400E' }}>{insect.category}</div>
              <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.4 }}>{insect.description.substring(0, 80)}...</p>
            </div>
          ))}
        </div>
      )}

      {activeView === 'observations' && (
        <div>
          {observations.length === 0 ? (
            <div className="card section" style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🦋</div>
              <p>No observations yet. Use the identification key then log your findings!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {observations.map(obs => {
                const species = PA_INSECTS.find(s => s.id === obs.speciesId);
                return (
                  <div key={obs.id} className="card">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ fontSize: '3rem' }}>{species?.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{species?.commonName}</h3>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.8 }}>
                          <div><strong>Location:</strong> {obs.location}</div>
                          <div><strong>Behavior:</strong> {obs.behavior}</div>
                          <div><strong>Date:</strong> {new Date(obs.timestamp).toLocaleDateString()}</div>
                          {obs.notes && <div><strong>Notes:</strong> {obs.notes}</div>}
                        </div>
                        {obs.photos && obs.photos.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            {obs.photos.map((photo, idx) => (
                              <img key={idx} src={photo} alt={`Obs ${idx + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                            ))}
                          </div>
                        )}
                        {obs.audioUrl && (
                          <div style={{ marginTop: '1rem' }}>
                            <audio controls src={obs.audioUrl} style={{ width: '100%' }} />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', height: 'fit-content', background: '#FEF3C7', color: '#92400E', fontWeight: 600, fontSize: '0.9rem' }}>
                        {species?.points} pts
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedSpecies && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }} onClick={() => setSelectedSpecies(null)}>
          <div className="card section" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>{selectedSpecies.emoji}</div>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{selectedSpecies.commonName}</h2>
            <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#6B7280', marginBottom: '1rem' }}>{selectedSpecies.scientificName}</p>
            <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: '#FEF3C7', color: '#92400E' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{selectedSpecies.category} • Worth {selectedSpecies.points} points</div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4>Description</h4>
              <p>{selectedSpecies.description}</p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4>Identifying Features</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {selectedSpecies.identifyingFeatures.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4>Habitat</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedSpecies.habitat.map((hab, idx) => (
                  <span key={idx} style={{ padding: '0.5rem 1rem', background: '#E5E7EB', borderRadius: '20px', fontSize: '0.9rem' }}>{hab}</span>
                ))}
              </div>
            </div>
            {selectedSpecies.soundDescription && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#F8F9FA', borderRadius: '8px' }}>
                <h4>Sound</h4>
                <p>🔊 {selectedSpecies.soundDescription}</p>
              </div>
            )}
            <button onClick={() => setSelectedSpecies(null)} className="btn-outline" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      <div className="card section" style={{ background: '#F8F9FA', marginTop: '2rem' }}>
        <h3>📚 Insect Identification Resources</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <a href="https://www.inaturalist.org/taxa/47158-Insecta" target="_blank" rel="noopener noreferrer" className="btn-success">
            <div><strong>iNaturalist - Insects</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Upload observations</div>
          </a>
          <a href="https://www.birdweather.com/" target="_blank" rel="noopener noreferrer" className="btn-outline">
            <div><strong>BirdWeather</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Audio ID for insects</div>
          </a>
          <a href="https://extension.psu.edu/spotted-lanternfly" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ border: '2px solid #DC2626' }}>
            <div><strong>🚨 Report Spotted Lanternfly</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Penn State Extension</div>
          </a>
        </div>
      </div>
    </div>
  );
}
