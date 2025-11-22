'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePoints } from '@/ui/points/PointsProvider';

interface MacroObservation {
  id: string;
  timestamp: number;
  species: string;
  count: number;
  location: string;
  habitat: string;
  waterQuality: string;
  photos: string[];
  notes: string;
}

interface MacroSpecies {
  id: string;
  name: string;
  scientificName: string;
  group: string;
  pollutionTolerance: 'Sensitive' | 'Somewhat Sensitive' | 'Tolerant';
  points: number;
  emoji: string;
  description: string;
  habitat: string;
  indicators: string[];
}

interface KeyStep {
  id: number;
  question: string;
  yesNext: number | string;
  noNext: number | string;
}

const DICHOTOMOUS_KEY: KeyStep[] = [
  {
    id: 1,
    question: "Does the organism have 6 legs (insect)?",
    yesNext: 2,
    noNext: 8
  },
  {
    id: 2,
    question: "Does it have wing pads or gills visible on the body?",
    yesNext: 3,
    noNext: 7
  },
  {
    id: 3,
    question: "Does it have 2 or 3 long tail filaments?",
    yesNext: 4,
    noNext: 5
  },
  {
    id: 4,
    question: "Does it have 3 tail filaments and gills along the abdomen?",
    yesNext: "mayfly-nymph",
    noNext: "stonefly-nymph"
  },
  {
    id: 5,
    question: "Does it build a protective case from pebbles, twigs, or sand?",
    yesNext: "caddisfly-larvae",
    noNext: 6
  },
  {
    id: 6,
    question: "Does it have large pincers and feathery gills along sides?",
    yesNext: "dobsonfly-larvae",
    noNext: "dragonfly-nymph"
  },
  {
    id: 7,
    question: "Is it small, oval, and found clinging to rocks in fast water?",
    yesNext: "riffle-beetle",
    noNext: "water-penny"
  },
  {
    id: 8,
    question: "Does it have a segmented body with many legs?",
    yesNext: 9,
    noNext: 10
  },
  {
    id: 9,
    question: "Does it have large claws and a hard shell (crustacean)?",
    yesNext: "crayfish",
    noNext: "scud"
  },
  {
    id: 10,
    question: "Does it have a shell (snail)?",
    yesNext: 11,
    noNext: 12
  },
  {
    id: 11,
    question: "Does the shell coil to the left?",
    yesNext: "pouch-snail",
    noNext: "scud"
  },
  {
    id: 12,
    question: "Is it worm-like without legs?",
    yesNext: 13,
    noNext: "aquatic-sowbug"
  },
  {
    id: 13,
    question: "Is it red (bloodworm) or very thin and small?",
    yesNext: "midge-larvae",
    noNext: 14
  },
  {
    id: 14,
    question: "Does it have suckers at both ends?",
    yesNext: "leech",
    noNext: "aquatic-worm"
  }
];

const MACRO_SPECIES: MacroSpecies[] = [
  {
    id: 'mayfly-nymph',
    name: 'Mayfly Nymph',
    scientificName: 'Ephemeroptera',
    group: 'Sensitive',
    pollutionTolerance: 'Sensitive',
    points: 3,
    emoji: '🦟',
    description: 'Three tail filaments, gills on abdomen, found in clean, well-oxygenated water',
    habitat: 'Riffles, under rocks in fast-flowing streams',
    indicators: ['Excellent water quality', 'High dissolved oxygen', 'Cool temperatures']
  },
  {
    id: 'stonefly-nymph',
    name: 'Stonefly Nymph',
    scientificName: 'Plecoptera',
    group: 'Sensitive',
    pollutionTolerance: 'Sensitive',
    points: 3,
    emoji: '🪲',
    description: 'Two tail filaments, branched gills, flat body, found only in pristine water',
    habitat: 'Cold, fast-flowing streams with rocky substrates',
    indicators: ['Pristine water', 'Very high oxygen', 'Cold temperatures']
  },
  {
    id: 'caddisfly-larvae',
    name: 'Caddisfly Larvae',
    scientificName: 'Trichoptera',
    group: 'Sensitive',
    pollutionTolerance: 'Sensitive',
    points: 3,
    emoji: '🐛',
    description: 'Builds protective cases from pebbles, twigs, or silk; found in clean water',
    habitat: 'Streams, lakes; attached to rocks or vegetation',
    indicators: ['Good to excellent water', 'Stable substrate', 'Moderate to high oxygen']
  },
  {
    id: 'riffle-beetle',
    name: 'Riffle Beetle',
    scientificName: 'Elmidae',
    group: 'Sensitive',
    pollutionTolerance: 'Sensitive',
    points: 3,
    emoji: '🪲',
    description: 'Small, oval beetles that cling to rocks in fast water',
    habitat: 'Riffles with high oxygen levels',
    indicators: ['Clean, fast-flowing water', 'High oxygen']
  },
  {
    id: 'water-penny',
    name: 'Water Penny',
    scientificName: 'Psephenidae',
    group: 'Sensitive',
    pollutionTolerance: 'Sensitive',
    points: 3,
    emoji: '⭕',
    description: 'Flat, penny-shaped larvae found clinging to rocks',
    habitat: 'Fast-flowing, well-oxygenated streams',
    indicators: ['Excellent water quality', 'High oxygen']
  },
  {
    id: 'dobsonfly-larvae',
    name: 'Dobsonfly (Hellgrammite)',
    scientificName: 'Corydalidae',
    group: 'Somewhat Sensitive',
    pollutionTolerance: 'Somewhat Sensitive',
    points: 2,
    emoji: '🐉',
    description: 'Large, fierce-looking larvae with pincers and gills along sides',
    habitat: 'Under rocks in streams',
    indicators: ['Good water quality', 'Moderate to high oxygen']
  },
  {
    id: 'dragonfly-nymph',
    name: 'Dragonfly Nymph',
    scientificName: 'Anisoptera',
    group: 'Somewhat Sensitive',
    pollutionTolerance: 'Somewhat Sensitive',
    points: 2,
    emoji: '🦗',
    description: 'Large, robust nymphs with extendable jaw for catching prey',
    habitat: 'Ponds, slow streams, lake margins',
    indicators: ['Fair to good water', 'Moderate oxygen']
  },
  {
    id: 'damselfly-nymph',
    name: 'Damselfly Nymph',
    scientificName: 'Zygoptera',
    group: 'Somewhat Sensitive',
    pollutionTolerance: 'Somewhat Sensitive',
    points: 2,
    emoji: '🦗',
    description: 'Slender body with three leaf-like gills at tail end',
    habitat: 'Vegetation in ponds and slow streams',
    indicators: ['Fair to good water', 'Moderate oxygen']
  },
  {
    id: 'crayfish',
    name: 'Crayfish',
    scientificName: 'Astacidae',
    group: 'Somewhat Sensitive',
    pollutionTolerance: 'Somewhat Sensitive',
    points: 2,
    emoji: '🦞',
    description: 'Freshwater crustacean with large claws',
    habitat: 'Under rocks, in burrows',
    indicators: ['Fair water quality', 'Moderate oxygen']
  },
  {
    id: 'scud',
    name: 'Scud (Amphipod)',
    scientificName: 'Amphipoda',
    group: 'Somewhat Sensitive',
    pollutionTolerance: 'Somewhat Sensitive',
    points: 2,
    emoji: '🦐',
    description: 'Shrimp-like crustacean that swims on its side',
    habitat: 'Vegetation, leaf litter',
    indicators: ['Fair to good water', 'Moderate oxygen']
  },
  {
    id: 'aquatic-worm',
    name: 'Aquatic Worm',
    scientificName: 'Oligochaeta',
    group: 'Tolerant',
    pollutionTolerance: 'Tolerant',
    points: 1,
    emoji: '🪱',
    description: 'Thin, segmented worms that can survive in low oxygen',
    habitat: 'Muddy sediments, polluted water',
    indicators: ['Poor water quality', 'Low oxygen tolerated']
  },
  {
    id: 'midge-larvae',
    name: 'Midge Larvae',
    scientificName: 'Chironomidae',
    group: 'Tolerant',
    pollutionTolerance: 'Tolerant',
    points: 1,
    emoji: '🐛',
    description: 'Small, worm-like larvae, often red (bloodworms)',
    habitat: 'Sediments, tolerates low oxygen',
    indicators: ['Poor to fair water', 'Low oxygen tolerated']
  },
  {
    id: 'leech',
    name: 'Leech',
    scientificName: 'Hirudinea',
    group: 'Tolerant',
    pollutionTolerance: 'Tolerant',
    points: 1,
    emoji: '🪱',
    description: 'Segmented worm with suckers at both ends',
    habitat: 'Vegetation, slow water',
    indicators: ['Poor to fair water', 'Tolerates pollution']
  },
  {
    id: 'pouch-snail',
    name: 'Pouch Snail',
    scientificName: 'Physidae',
    group: 'Tolerant',
    pollutionTolerance: 'Tolerant',
    points: 1,
    emoji: '🐌',
    description: 'Snail with left-coiling shell',
    habitat: 'Vegetation, slow streams',
    indicators: ['Poor to fair water', 'Tolerates pollution']
  },
  {
    id: 'aquatic-sowbug',
    name: 'Aquatic Sowbug',
    scientificName: 'Isopoda',
    group: 'Tolerant',
    pollutionTolerance: 'Tolerant',
    points: 1,
    emoji: '🪲',
    description: 'Flat, oval crustacean resembling terrestrial pill bugs',
    habitat: 'Slow water, vegetation',
    indicators: ['Poor to fair water', 'Tolerates pollution']
  }
];

const HABITAT_TYPES = ['Riffle', 'Pool', 'Run', 'Lake Shore', 'Wetland', 'Under Rocks', 'Vegetation'];

export default function MacroInvertebrateID() {
  const { award } = usePoints();
  const [activeView, setActiveView] = useState<'key' | 'gallery' | 'observations'>('key');
  const [observations, setObservations] = useState<MacroObservation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<MacroSpecies | null>(null);
  const [newObservation, setNewObservation] = useState<Partial<MacroObservation>>({
    count: 1,
    habitat: 'Riffle',
    photos: []
  });

  // Dichotomous key state
  const [currentStep, setCurrentStep] = useState(1);
  const [keyHistory, setKeyHistory] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wla-macro-observations');
      if (saved) setObservations(JSON.parse(saved));
    } catch {}
  }, []);

  const saveObservations = (updated: MacroObservation[]) => {
    setObservations(updated);
    localStorage.setItem('wla-macro-observations', JSON.stringify(updated));
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
    setNewObservation({
      ...newObservation,
      photos: [...(newObservation.photos || []), ...photos]
    });
  };

  const addObservation = () => {
    if (!newObservation.species) {
      alert('Please select a species');
      return;
    }

    const speciesData = MACRO_SPECIES.find(s => s.id === newObservation.species);
    
    const observation: MacroObservation = {
      id: `obs-${Date.now()}`,
      timestamp: Date.now(),
      species: newObservation.species,
      count: newObservation.count || 1,
      location: newObservation.location || 'Unknown',
      habitat: newObservation.habitat || 'Riffle',
      waterQuality: speciesData?.pollutionTolerance || 'Unknown',
      photos: newObservation.photos || [],
      notes: newObservation.notes || ''
    };

    saveObservations([...observations, observation]);
    
    const points = (speciesData?.points || 1) * (newObservation.count || 1);
    award(points, `Macro ID: ${speciesData?.name}`);

    setNewObservation({ count: 1, habitat: 'Riffle', photos: [] });
    setShowForm(false);
    setActiveView('observations');
    alert(`Observation saved! +${points} points`);
  };

  const calculateWaterQualityScore = (): { score: number; rating: string } => {
    if (observations.length === 0) return { score: 0, rating: 'No Data' };
    
    const totalScore = observations.reduce((sum, obs) => {
      const species = MACRO_SPECIES.find(s => s.id === obs.species);
      return sum + (species?.points || 0) * obs.count;
    }, 0);

    let rating = 'Poor';
    if (totalScore > 22) rating = 'Excellent';
    else if (totalScore > 16) rating = 'Good';
    else if (totalScore > 10) rating = 'Fair';

    return { score: totalScore, rating };
  };

  const handleKeyAnswer = (answer: 'yes' | 'no') => {
    const step = DICHOTOMOUS_KEY.find(s => s.id === currentStep);
    if (!step) return;

    const next = answer === 'yes' ? step.yesNext : step.noNext;
    
    if (typeof next === 'string') {
      // Found a species
      const species = MACRO_SPECIES.find(s => s.id === next);
      if (species) {
        setSelectedSpecies(species);
        setKeyHistory([]);
        setCurrentStep(1);
      }
    } else {
      // Move to next step
      setKeyHistory([...keyHistory, currentStep]);
      setCurrentStep(next);
    }
  };

  const handleKeyBack = () => {
    if (keyHistory.length > 0) {
      const previous = keyHistory[keyHistory.length - 1];
      setKeyHistory(keyHistory.slice(0, -1));
      setCurrentStep(previous);
    }
  };

  const resetKey = () => {
    setCurrentStep(1);
    setKeyHistory([]);
  };

  const qualityScore = calculateWaterQualityScore();
  const currentKeyStep = DICHOTOMOUS_KEY.find(s => s.id === currentStep);

  return (
    <div>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #06D6A0, #059669)',
        color: 'white',
        padding: '3rem 1.5rem',
        marginBottom: '2rem',
        borderRadius: '16px'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          🦟 Macroinvertebrate Identification
        </h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Use the dichotomous key to identify stream insects and assess water quality
        </p>
      </section>

      {/* Stats */}
      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #0077B6, #023047)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{observations.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Observations</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: `linear-gradient(135deg, ${qualityScore.rating === 'Excellent' ? '#06D6A0, #059669' : qualityScore.rating === 'Good' ? '#FFB703, #FB8500' : '#DC2626, #991B1B'})`, color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{qualityScore.score}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Water Quality Score</p>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{qualityScore.rating}</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #0077B6, #023047)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>
            {observations.filter(o => {
              const s = MACRO_SPECIES.find(sp => sp.id === o.species);
              return s?.pollutionTolerance === 'Sensitive';
            }).length}
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Sensitive Species</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #E5E7EB', paddingBottom: '1rem' }}>
          <button
            onClick={() => setActiveView('key')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeView === 'key' ? '#06D6A0' : 'transparent',
              color: activeView === 'key' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🔑 Identification Key
          </button>
          <button
            onClick={() => setActiveView('gallery')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeView === 'gallery' ? '#06D6A0' : 'transparent',
              color: activeView === 'gallery' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📚 Species Gallery
          </button>
          <button
            onClick={() => setActiveView('observations')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeView === 'observations' ? '#06D6A0' : 'transparent',
              color: activeView === 'observations' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📸 My Observations
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-success"
            style={{ marginLeft: 'auto' }}
          >
            ➕ Log Observation
          </button>
        </div>
      </div>

      {/* Observation Form */}
      {showForm && (
        <div className="card section" style={{ marginBottom: '2rem', background: '#F8F9FA' }}>
          <h3>Log Macroinvertebrate Observation</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Species *:</span>
              <select
                value={newObservation.species || ''}
                onChange={(e) => setNewObservation({...newObservation, species: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
              >
                <option value="">Select a species...</option>
                {MACRO_SPECIES.map(species => (
                  <option key={species.id} value={species.id}>
                    {species.emoji} {species.name} ({species.pollutionTolerance})
                  </option>
                ))}
              </select>
            </label>

            <div className="row">
              <label style={{ flex: 1, margin: 0 }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Count:</span>
                <input
                  type="number"
                  min="1"
                  value={newObservation.count}
                  onChange={(e) => setNewObservation({...newObservation, count: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                />
              </label>

              <label style={{ flex: 2, margin: 0 }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Location:</span>
                <input
                  type="text"
                  value={newObservation.location || ''}
                  onChange={(e) => setNewObservation({...newObservation, location: e.target.value})}
                  placeholder="Stream name or GPS coordinates"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                />
              </label>
            </div>

            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Habitat Type:</span>
              <select
                value={newObservation.habitat}
                onChange={(e) => setNewObservation({...newObservation, habitat: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
              >
                {HABITAT_TYPES.map(type => <option key={type}>{type}</option>)}
              </select>
            </label>

            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Photos:</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
              />
            </label>

            {newObservation.photos && newObservation.photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {newObservation.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    style={{ width: '100%', borderRadius: '6px', overflow: 'hidden', position: 'relative', height: '120px' }}
                  >
                    <Image
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}

            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Notes:</span>
              <textarea
                value={newObservation.notes || ''}
                onChange={(e) => setNewObservation({...newObservation, notes: e.target.value})}
                placeholder="Behavior, substrate, water conditions..."
                style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB', fontFamily: 'inherit' }}
              />
            </label>

            <div className="row">
              <button onClick={addObservation} className="btn-success" style={{ flex: 1 }}>
                💾 Save Observation
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dichotomous Key View */}
      {activeView === 'key' && (
        <div className="card section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Dichotomous Identification Key</h2>
            <button onClick={resetKey} className="btn-outline">
              🔄 Start Over
            </button>
          </div>

          {currentKeyStep ? (
            <div>
              <div style={{ padding: '1.5rem', background: '#F8F9FA', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                  Step {currentStep} of {DICHOTOMOUS_KEY.length}
                </div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                  {currentKeyStep.question}
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleKeyAnswer('yes')}
                    className="btn-success"
                    style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem' }}
                  >
                    ✓ Yes
                  </button>
                  <button
                    onClick={() => handleKeyAnswer('no')}
                    className="btn-outline"
                    style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem', background: '#DC2626', color: 'white', border: 'none' }}
                  >
                    ✗ No
                  </button>
                </div>
              </div>

              {keyHistory.length > 0 && (
                <button onClick={handleKeyBack} className="btn-outline" style={{ width: '100%' }}>
                  ← Go Back
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <p>Key completed! Click &quot;Start Over&quot; to identify another organism.</p>
            </div>
          )}
        </div>
      )}

      {/* Species Gallery View */}
      {activeView === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {MACRO_SPECIES.map(species => (
            <div
              key={species.id}
              className="card"
              style={{
                cursor: 'pointer',
                border: `3px solid ${species.pollutionTolerance === 'Sensitive' ? '#06D6A0' : species.pollutionTolerance === 'Somewhat Sensitive' ? '#FFB703' : '#DC2626'}`,
                transition: 'transform 0.2s',
              }}
              onClick={() => setSelectedSpecies(species)}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                {species.emoji}
              </div>
              <h3 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                {species.name}
              </h3>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', fontStyle: 'italic', color: '#6B7280', marginBottom: '0.75rem' }}>
                {species.scientificName}
              </p>
              <div style={{
                padding: '0.5rem',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.9rem',
                background: species.pollutionTolerance === 'Sensitive' ? '#D1FAE5' : species.pollutionTolerance === 'Somewhat Sensitive' ? '#FEF3C7' : '#FEE2E2',
                color: species.pollutionTolerance === 'Sensitive' ? '#065F46' : species.pollutionTolerance === 'Somewhat Sensitive' ? '#92400E' : '#991B1B'
              }}>
                {species.pollutionTolerance}
              </div>
              <p style={{ fontSize: '0.9rem', marginTop: '0.75rem', color: '#374151', lineHeight: 1.5 }}>
                {species.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Observations View */}
      {activeView === 'observations' && (
        <div>
          {observations.length === 0 ? (
            <div className="card section" style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🦟</div>
              <p>No observations yet. Use the identification key to find species, then log your findings!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {observations.map(obs => {
                const species = MACRO_SPECIES.find(s => s.id === obs.species);
                return (
                  <div key={obs.id} className="card">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ fontSize: '3rem' }}>{species?.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{species?.name}</h3>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.8 }}>
                          <div><strong>Count:</strong> {obs.count}</div>
                          <div><strong>Location:</strong> {obs.location}</div>
                          <div><strong>Habitat:</strong> {obs.habitat}</div>
                          <div><strong>Date:</strong> {new Date(obs.timestamp).toLocaleDateString()}</div>
                          {obs.notes && <div><strong>Notes:</strong> {obs.notes}</div>}
                        </div>
                        {obs.photos && obs.photos.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            {obs.photos.map((photo, idx) => (
                              <div
                                key={idx}
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                  position: 'relative',
                                }}
                              >
                                <Image
                                  src={photo}
                                  alt={`Observation ${idx + 1}`}
                                  fill
                                  unoptimized
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        height: 'fit-content',
                        background: species?.pollutionTolerance === 'Sensitive' ? '#D1FAE5' : species?.pollutionTolerance === 'Somewhat Sensitive' ? '#FEF3C7' : '#FEE2E2',
                        color: species?.pollutionTolerance === 'Sensitive' ? '#065F46' : species?.pollutionTolerance === 'Somewhat Sensitive' ? '#92400E' : '#991B1B',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}>
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

      {/* Species Detail Modal */}
      {selectedSpecies && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }} onClick={() => setSelectedSpecies(null)}>
          <div className="card section" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>
              {selectedSpecies.emoji}
            </div>
            
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              {selectedSpecies.name}
            </h2>
            <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#6B7280', marginBottom: '1rem' }}>
              {selectedSpecies.scientificName}
            </p>

            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              background: selectedSpecies.pollutionTolerance === 'Sensitive' ? '#D1FAE5' : selectedSpecies.pollutionTolerance === 'Somewhat Sensitive' ? '#FEF3C7' : '#FEE2E2',
              color: selectedSpecies.pollutionTolerance === 'Sensitive' ? '#065F46' : selectedSpecies.pollutionTolerance === 'Somewhat Sensitive' ? '#92400E' : '#991B1B'
            }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Pollution Tolerance: {selectedSpecies.pollutionTolerance}
              </div>
              <div>Worth {selectedSpecies.points} points per individual</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4>Description</h4>
              <p>{selectedSpecies.description}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4>Habitat</h4>
              <p>{selectedSpecies.habitat}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4>Water Quality Indicators</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {selectedSpecies.indicators.map((indicator, idx) => (
                  <li key={idx}>{indicator}</li>
                ))}
              </ul>
            </div>

            <button onClick={() => setSelectedSpecies(null)} className="btn-outline" style={{ width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Resources */}
      <div className="card section" style={{ background: '#F8F9FA', marginTop: '2rem' }}>
        <h3>📚 Macroinvertebrate Resources</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <a href="https://www.macroinvertebrates.org/" target="_blank" rel="noopener noreferrer" className="btn-success">
            <div><strong>Macroinvertebrates.org</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Comprehensive ID guides</div>
          </a>
          <a href="https://www.inaturalist.org/taxa/47120-Insecta" target="_blank" rel="noopener noreferrer" className="btn-outline">
            <div><strong>iNaturalist - Aquatic Insects</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Upload your findings</div>
          </a>
          <a href="https://www.dep.pa.gov/Business/Water/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="btn-outline">
            <div><strong>PA DEP Biomonitoring</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>State monitoring program</div>
          </a>
        </div>
      </div>
    </div>
  );
}
