'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePoints } from '@/ui/points/PointsProvider';

interface PlantObservation {
  id: string;
  timestamp: number;
  speciesId: string;
  location: string;
  habitat: string;
  phenology: string;
  photos: string[];
  notes: string;
}

interface PlantSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Tree' | 'Shrub' | 'Wildflower' | 'Fern';
  points: number;
  emoji: string;
  description: string;
  identifyingFeatures: string[];
  habitat: string[];
  bloomTime?: string;
}

interface KeyStep {
  id: number;
  question: string;
  yesNext: number | string;
  noNext: number | string;
}

const DICHOTOMOUS_KEY: KeyStep[] = [
  { id: 1, question: "Is it a woody plant (tree or shrub)?", yesNext: 2, noNext: 10 },
  { id: 2, question: "Does it reach more than 20 feet tall at maturity?", yesNext: 3, noNext: 7 },
  { id: 3, question: "Does it have needles or scale-like leaves (evergreen)?", yesNext: "eastern-hemlock", noNext: 4 },
  { id: 4, question: "Does it have peeling, multi-colored bark (white, tan, brown)?", yesNext: "american-sycamore", noNext: 5 },
  { id: 5, question: "Does it have unique 4-lobed leaves?", yesNext: "tulip-tree", noNext: 6 },
  { id: 6, question: "Does it have dark, scaly bark and produces dark purple-black fruit?", yesNext: "black-cherry", noNext: "american-sycamore" },
  { id: 7, question: "Does it have aromatic leaves and twigs when crushed?", yesNext: "spicebush", noNext: 8 },
  { id: 8, question: "Does it have flat-topped white flower clusters?", yesNext: "elderberry", noNext: 9 },
  { id: 9, question: "Does it have white flowers in early spring before leaves?", yesNext: "serviceberry", noNext: "spicebush" },
  { id: 10, question: "Does it have fronds (fern)?", yesNext: 11, noNext: 12 },
  { id: 11, question: "Is it evergreen (stays green in winter)?", yesNext: "christmas-fern", noNext: "interrupted-fern" },
  { id: 12, question: "Does it bloom in early spring (March-May)?", yesNext: 13, noNext: 15 },
  { id: 13, question: "Does it have a single white flower with 8-12 petals?", yesNext: "bloodroot", noNext: 14 },
  { id: 14, question: "Does it have 3 petals and 3 broad leaves?", yesNext: "trillium", noNext: "serviceberry" },
  { id: 15, question: "Does it have brilliant red tubular flowers?", yesNext: "cardinal-flower", noNext: 16 },
  { id: 16, question: "Does it have pink-purple flower clusters and grows 4-7 feet tall?", yesNext: "joe-pye-weed", noNext: "black-eyed-susan" }
];

const PA_PLANTS: PlantSpecies[] = [
  {
    id: 'eastern-hemlock',
    commonName: 'Eastern Hemlock',
    scientificName: 'Tsuga canadensis',
    category: 'Tree',
    points: 15,
    emoji: '🌲',
    description: 'Graceful evergreen with drooping branches, critical for stream ecosystems',
    identifyingFeatures: ['Short flat needles', 'Small cones', 'Drooping branch tips', 'Reddish-brown bark'],
    habitat: ['Cool moist ravines', 'Stream banks', 'Rocky slopes']
  },
  {
    id: 'american-sycamore',
    commonName: 'American Sycamore',
    scientificName: 'Platanus occidentalis',
    category: 'Tree',
    points: 10,
    emoji: '🌳',
    description: 'Massive riparian tree with distinctive mottled bark',
    identifyingFeatures: ['Peeling bark (white, tan, brown)', 'Large maple-like leaves', 'Round seed balls'],
    habitat: ['Stream banks', 'Floodplains', 'Wetlands']
  },
  {
    id: 'black-cherry',
    commonName: 'Black Cherry',
    scientificName: 'Prunus serotina',
    category: 'Tree',
    points: 10,
    emoji: '🌳',
    description: 'Important hardwood with valuable fruit for wildlife',
    identifyingFeatures: ['Dark scaly bark', 'White flower clusters', 'Dark purple-black fruit'],
    habitat: ['Upland forests', 'Old fields', 'Forest edges'],
    bloomTime: 'May'
  },
  {
    id: 'tulip-tree',
    commonName: 'Tulip Tree',
    scientificName: 'Liriodendron tulipifera',
    category: 'Tree',
    points: 10,
    emoji: '🌳',
    description: 'Tall fast-growing tree with unique leaf shape',
    identifyingFeatures: ['Four-lobed leaves', 'Tulip-shaped flowers', 'Cone-like fruit'],
    habitat: ['Rich moist soils', 'Coves', 'Lower slopes'],
    bloomTime: 'May-June'
  },
  {
    id: 'spicebush',
    commonName: 'Spicebush',
    scientificName: 'Lindera benzoin',
    category: 'Shrub',
    points: 12,
    emoji: '🌿',
    description: 'Aromatic shrub, host plant for spicebush swallowtail',
    identifyingFeatures: ['Aromatic twigs and leaves', 'Small yellow flowers', 'Red berries'],
    habitat: ['Moist woods', 'Stream banks', 'Shaded areas'],
    bloomTime: 'March-April'
  },
  {
    id: 'elderberry',
    commonName: 'Elderberry',
    scientificName: 'Sambucus canadensis',
    category: 'Shrub',
    points: 10,
    emoji: '🌿',
    description: 'Multi-stemmed shrub with edible berries',
    identifyingFeatures: ['Compound leaves', 'Flat-topped white flower clusters', 'Dark purple berries'],
    habitat: ['Wet areas', 'Stream banks', 'Forest edges'],
    bloomTime: 'June-July'
  },
  {
    id: 'serviceberry',
    commonName: 'Serviceberry',
    scientificName: 'Amelanchier canadensis',
    category: 'Shrub',
    points: 12,
    emoji: '🌿',
    description: 'Early blooming shrub with edible berries',
    identifyingFeatures: ['White flowers', 'Purple-black berries', 'Smooth gray bark'],
    habitat: ['Forest edges', 'Meadows', 'Stream banks'],
    bloomTime: 'April-May'
  },
  {
    id: 'bloodroot',
    commonName: 'Bloodroot',
    scientificName: 'Sanguinaria canadensis',
    category: 'Wildflower',
    points: 15,
    emoji: '🌸',
    description: 'Spring ephemeral with white flowers, red sap',
    identifyingFeatures: ['Single white flower', 'Lobed leaf wraps flower', 'Red-orange sap'],
    habitat: ['Rich woods', 'Floodplains', 'Stream banks'],
    bloomTime: 'March-April'
  },
  {
    id: 'cardinal-flower',
    commonName: 'Cardinal Flower',
    scientificName: 'Lobelia cardinalis',
    category: 'Wildflower',
    points: 15,
    emoji: '🌺',
    description: 'Brilliant red flowers, primary hummingbird plant',
    identifyingFeatures: ['Intense scarlet-red flowers', 'Tubular shape', 'Tall spike (2-4 ft)'],
    habitat: ['Stream banks', 'Wet meadows', 'Swamps'],
    bloomTime: 'July-September'
  },
  {
    id: 'trillium',
    commonName: 'Large-flowered Trillium',
    scientificName: 'Trillium grandiflorum',
    category: 'Wildflower',
    points: 15,
    emoji: '🌼',
    description: 'Iconic spring wildflower with three petals',
    identifyingFeatures: ['Three white petals', 'Three broad leaves', 'Single flower per plant'],
    habitat: ['Rich moist woods', 'Limestone areas'],
    bloomTime: 'April-May'
  },
  {
    id: 'joe-pye-weed',
    commonName: 'Joe-Pye Weed',
    scientificName: 'Eutrochium purpureum',
    category: 'Wildflower',
    points: 10,
    emoji: '🌸',
    description: 'Tall wetland plant, pollinator magnet',
    identifyingFeatures: ['Pink-purple flower clusters', 'Tall (4-7 ft)', 'Whorled leaves'],
    habitat: ['Wet meadows', 'Stream banks', 'Low woods'],
    bloomTime: 'July-September'
  },
  {
    id: 'black-eyed-susan',
    commonName: 'Black-eyed Susan',
    scientificName: 'Rudbeckia hirta',
    category: 'Wildflower',
    points: 8,
    emoji: '🌻',
    description: 'Iconic yellow wildflower with dark center',
    identifyingFeatures: ['Yellow petals', 'Dark brown center', 'Hairy stems and leaves'],
    habitat: ['Fields', 'Prairies', 'Roadsides'],
    bloomTime: 'June-October'
  },
  {
    id: 'christmas-fern',
    commonName: 'Christmas Fern',
    scientificName: 'Polystichum acrostichoides',
    category: 'Fern',
    points: 10,
    emoji: '🌿',
    description: 'Evergreen fern common in PA forests',
    identifyingFeatures: ['Evergreen', 'Leathery fronds', 'Christmas stocking-shaped pinnae'],
    habitat: ['Rocky woods', 'Stream banks', 'Shaded slopes']
  },
  {
    id: 'interrupted-fern',
    commonName: 'Interrupted Fern',
    scientificName: 'Osmunda claytoniana',
    category: 'Fern',
    points: 10,
    emoji: '🌿',
    description: 'Large fern with fertile pinnae in middle',
    identifyingFeatures: ['Fertile pinnae in middle', 'Large (2-4 ft)', 'Circular arrangement'],
    habitat: ['Rich woods', 'Swamps', 'Stream banks']
  }
];

const PHENOLOGY_STAGES = ['Dormant', 'Budding', 'Flowering', 'Fruiting', 'Seeding', 'Fall Color'];
const HABITAT_TYPES = ['Forest', 'Stream Bank', 'Wetland', 'Meadow', 'Edge'];

export default function PlantID() {
  const { award } = usePoints();
  const [activeView, setActiveView] = useState<'key' | 'gallery' | 'observations'>('key');
  const [observations, setObservations] = useState<PlantObservation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpecies | null>(null);
  const [newObservation, setNewObservation] = useState<Partial<PlantObservation>>({
    habitat: 'Forest',
    phenology: 'Flowering',
    photos: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [keyHistory, setKeyHistory] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wla-plant-observations');
      if (saved) setObservations(JSON.parse(saved));
    } catch {}
  }, []);

  const saveObservations = (updated: PlantObservation[]) => {
    setObservations(updated);
    localStorage.setItem('wla-plant-observations', JSON.stringify(updated));
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

  const addObservation = () => {
    if (!newObservation.speciesId) {
      alert('Please select a species');
      return;
    }
    const speciesData = PA_PLANTS.find(s => s.id === newObservation.speciesId);
    const observation: PlantObservation = {
      id: `obs-${Date.now()}`,
      timestamp: Date.now(),
      speciesId: newObservation.speciesId,
      location: newObservation.location || 'Unknown',
      habitat: newObservation.habitat || 'Forest',
      phenology: newObservation.phenology || 'Flowering',
      photos: newObservation.photos || [],
      notes: newObservation.notes || ''
    };
    saveObservations([...observations, observation]);
    const points = speciesData?.points || 5;
    award(points, `Plant ID: ${speciesData?.commonName}`);
    setNewObservation({ habitat: 'Forest', phenology: 'Flowering', photos: [] });
    setShowForm(false);
    setActiveView('observations');
    alert(`Observation saved! +${points} points`);
  };

  const handleKeyAnswer = (answer: 'yes' | 'no') => {
    const step = DICHOTOMOUS_KEY.find(s => s.id === currentStep);
    if (!step) return;
    const next = answer === 'yes' ? step.yesNext : step.noNext;
    if (typeof next === 'string') {
      const species = PA_PLANTS.find(s => s.id === next);
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
      <section style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', padding: '3rem 1.5rem', marginBottom: '2rem', borderRadius: '16px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🌿 Pennsylvania Native Plants</h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Use the dichotomous key to identify trees, shrubs, wildflowers, and ferns
        </p>
      </section>

      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{observations.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Observations</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #0077B6, #023047)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{PA_PLANTS.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Species in Database</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{observations.filter(o => o.photos.length > 0).length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>With Photos</p>
        </div>
      </div>

      <div className="card section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #E5E7EB', paddingBottom: '1rem' }}>
          <button onClick={() => setActiveView('key')} style={{ padding: '0.75rem 1.5rem', background: activeView === 'key' ? '#10B981' : 'transparent', color: activeView === 'key' ? 'white' : '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            🔑 Identification Key
          </button>
          <button onClick={() => setActiveView('gallery')} style={{ padding: '0.75rem 1.5rem', background: activeView === 'gallery' ? '#10B981' : 'transparent', color: activeView === 'gallery' ? 'white' : '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            📚 Species Gallery
          </button>
          <button onClick={() => setActiveView('observations')} style={{ padding: '0.75rem 1.5rem', background: activeView === 'observations' ? '#10B981' : 'transparent', color: activeView === 'observations' ? 'white' : '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            📸 My Observations
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-success" style={{ marginLeft: 'auto' }}>
            ➕ Log Observation
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card section" style={{ marginBottom: '2rem', background: '#F8F9FA' }}>
          <h3>Log Plant Observation</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Species *:</span>
              <select value={newObservation.speciesId || ''} onChange={(e) => setNewObservation({...newObservation, speciesId: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}>
                <option value="">Select a species...</option>
                {PA_PLANTS.map(plant => (
                  <option key={plant.id} value={plant.id}>{plant.emoji} {plant.commonName}</option>
                ))}
              </select>
            </label>
            <div className="row">
              <label style={{ flex: 1, margin: 0 }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Location:</span>
                <input type="text" value={newObservation.location || ''} onChange={(e) => setNewObservation({...newObservation, location: e.target.value})} placeholder="GPS or place name" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }} />
              </label>
              <label style={{ flex: 1, margin: 0 }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Habitat:</span>
                <select value={newObservation.habitat} onChange={(e) => setNewObservation({...newObservation, habitat: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}>
                  {HABITAT_TYPES.map(type => <option key={type}>{type}</option>)}
                </select>
              </label>
            </div>
            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Phenology:</span>
              <select value={newObservation.phenology} onChange={(e) => setNewObservation({...newObservation, phenology: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}>
                {PHENOLOGY_STAGES.map(stage => <option key={stage}>{stage}</option>)}
              </select>
            </label>
            <label style={{ margin: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Photos:</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '2px solid #E5E7EB' }} />
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
              <textarea value={newObservation.notes || ''} onChange={(e) => setNewObservation({...newObservation, notes: e.target.value})} placeholder="Associated species, abundance..." style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB', fontFamily: 'inherit' }} />
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
              <p>Key completed! Click &quot;Start Over&quot; to identify another plant.</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {PA_PLANTS.map(plant => (
            <div key={plant.id} className="card" style={{ cursor: 'pointer', border: '3px solid #10B981', transition: 'transform 0.2s' }} onClick={() => setSelectedSpecies(plant)} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>{plant.emoji}</div>
              <h3 style={{ textAlign: 'center', marginBottom: '0.25rem', fontSize: '1.1rem' }}>{plant.commonName}</h3>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic', color: '#6B7280', marginBottom: '0.5rem' }}>{plant.scientificName}</p>
              <div style={{ padding: '0.5rem', borderRadius: '6px', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', background: '#D1FAE5', color: '#065F46' }}>{plant.category}</div>
              <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.4 }}>{plant.description.substring(0, 80)}...</p>
            </div>
          ))}
        </div>
      )}

      {activeView === 'observations' && (
        <div>
          {observations.length === 0 ? (
            <div className="card section" style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
              <p>No observations yet. Use the identification key then log your findings!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {observations.map(obs => {
                const species = PA_PLANTS.find(s => s.id === obs.speciesId);
                return (
                  <div key={obs.id} className="card">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ fontSize: '3rem' }}>{species?.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{species?.commonName}</h3>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.8 }}>
                          <div><strong>Location:</strong> {obs.location}</div>
                          <div><strong>Habitat:</strong> {obs.habitat}</div>
                          <div><strong>Phenology:</strong> {obs.phenology}</div>
                          <div><strong>Date:</strong> {new Date(obs.timestamp).toLocaleDateString()}</div>
                          {obs.notes && <div><strong>Notes:</strong> {obs.notes}</div>}
                        </div>
                        {obs.photos && obs.photos.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            {obs.photos.map((photo, idx) => (
                              <div
                                key={idx}
                                style={{ width: '100px', height: '100px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}
                              >
                                <Image
                                  src={photo}
                                  alt={`Obs ${idx + 1}`}
                                  fill
                                  unoptimized
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', height: 'fit-content', background: '#D1FAE5', color: '#065F46', fontWeight: 600, fontSize: '0.9rem' }}>
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
            <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: '#D1FAE5', color: '#065F46' }}>
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
            {selectedSpecies.bloomTime && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4>Bloom Time</h4>
                <p>{selectedSpecies.bloomTime}</p>
              </div>
            )}
            <button onClick={() => setSelectedSpecies(null)} className="btn-outline" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      <div className="card section" style={{ background: '#F8F9FA', marginTop: '2rem' }}>
        <h3>📚 Plant Identification Resources</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <a href="https://www.inaturalist.org/taxa/47126-Plantae" target="_blank" rel="noopener noreferrer" className="btn-success">
            <div><strong>iNaturalist - Plants</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Upload observations</div>
          </a>
          <a href="https://www.dcnr.pa.gov/Conservation/WildPlants/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="btn-outline">
            <div><strong>PA Native Plants</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>DCNR resources</div>
          </a>
        </div>
      </div>
    </div>
  );
}
