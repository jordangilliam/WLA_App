'use client';

import { useState, useEffect, useRef } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import Image from 'next/image';

/**
 * Terrestrials Page - Wildlife Sign Documentation
 * 
 * Track and document signs of PA wildlife:
 * - Black bears, white-tailed deer, elk
 * - Fur bearers (fox, coyote, bobcat, etc.)
 * - Tracks, scat, rubs, scrapes, dens
 * - Photo documentation
 * - GPS locations
 * - Seasonal patterns
 */

interface WildlifeObservation {
  id: string;
  timestamp: number;
  speciesId: string;
  signType: 'tracks' | 'scat' | 'rubs' | 'scrapes' | 'den' | 'feeding' | 'bedding' | 'visual' | 'sounds' | 'other';
  location: string;
  latitude?: number;
  longitude?: number;
  habitat: string;
  weatherConditions: string;
  photos: string[];
  audioUrl?: string;
  measurements?: {
    length?: number;
    width?: number;
    depth?: number;
    stride?: number;
  };
  notes: string;
  confidence: 'Certain' | 'Probable' | 'Possible';
}

interface WildlifeSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Big Game' | 'Fur Bearer' | 'Small Game' | 'Non-Game';
  emoji: string;
  points: number;
  description: string;
  habitat: string[];
  signs: {
    tracks: string;
    scat: string;
    otherSigns: string[];
  };
  seasonalBehavior: {
    spring: string;
    summer: string;
    fall: string;
    winter: string;
  };
  conservationStatus: string;
  imageUrl?: string;
}

const PA_TERRESTRIALS: WildlifeSpecies[] = [
  // Big Game
  {
    id: 'black-bear',
    commonName: 'Black Bear',
    scientificName: 'Ursus americanus',
    category: 'Big Game',
    emoji: '🐻',
    points: 25,
    description: 'Largest predator in Pennsylvania. Excellent climbers and swimmers. Omnivorous diet.',
    habitat: ['Forests', 'Mountains', 'Swamps', 'Agricultural edges'],
    signs: {
      tracks: 'Five toes, claw marks visible. Front paw 4-5", hind paw 7-9". Plantigrade (flat-footed) walk.',
      scat: 'Varies by diet. Often contains berries, nuts, or insect parts. 1-2" diameter, may be tubular or loose.',
      otherSigns: ['Claw marks on trees', 'Tree rubs', 'Overturned logs/rocks', 'Torn-apart stumps', 'Day beds in vegetation']
    },
    seasonalBehavior: {
      spring: 'Emerge from dens (March-April). Breeding season (June-July). Very hungry, seeking food.',
      summer: 'Active feeding. Building fat reserves. Often near berry patches and oak trees.',
      fall: 'Hyperphagia - intense feeding before hibernation. Most active period. Consuming 20,000 calories/day.',
      winter: 'Denning (Dec-March). Females give birth in den. Males may emerge during warm spells.'
    },
    conservationStatus: 'Stable. Population ~20,000 in PA. Managed hunting season.',
    imageUrl: '/images/species/black-bear.jpg'
  },
  {
    id: 'white-tailed-deer',
    commonName: 'White-tailed Deer',
    scientificName: 'Odocoileus virginianus',
    category: 'Big Game',
    emoji: '🦌',
    points: 15,
    description: 'Most abundant big game species in PA. Named for white underside of tail displayed when alarmed.',
    habitat: ['Forests', 'Fields', 'Suburban areas', 'Agricultural land'],
    signs: {
      tracks: 'Heart-shaped cloven hooves. 2-3" long. Dewclaws may show in soft ground or when running.',
      scat: 'Pellet-shaped, oval, pointed at one end. 1/2-3/4" long. May be clumped or scattered.',
      otherSigns: ['Buck rubs on trees', 'Scrapes under branches', 'Beds in grass/leaves', 'Browse lines on vegetation', 'Trails through woods']
    },
    seasonalBehavior: {
      spring: 'Does pregnant. Bucks growing new antlers. Dispersal of yearling bucks.',
      summer: 'Fawns born (May-June). Does raise fawns. Bucks in bachelor groups. Antlers in velvet.',
      fall: 'Rut (Oct-Nov). Bucks rubbing trees, making scrapes. Breeding activity peaks.',
      winter: 'Antlers shed (Dec-Feb). Yarding behavior in harsh weather. Browsing on woody vegetation.'
    },
    conservationStatus: 'Abundant. Population ~1.5 million in PA. Managed hunting season.',
    imageUrl: '/images/species/white-tailed-deer.jpg'
  },
  {
    id: 'elk',
    commonName: 'Elk',
    scientificName: 'Cervus canadensis',
    category: 'Big Game',
    emoji: '🦌',
    points: 30,
    description: 'Largest member of deer family in PA. Reintroduced to PA in early 1900s. Limited range.',
    habitat: ['Mountain forests', 'Open meadows', 'Forest edges', 'Elk County region'],
    signs: {
      tracks: 'Larger than deer. 4-5" long. Rounded hooves. Heavy build evident in deep tracks.',
      scat: 'Larger pellets than deer. 3/4-1" long. Often in large piles. May be clumped when feeding on green vegetation.',
      otherSigns: ['Wallows (muddy depressions)', 'Large rubs on trees', 'Stripped bark', 'Beds larger than deer', 'Bugling heard in fall']
    },
    seasonalBehavior: {
      spring: 'Calves born (late May-June). Cows protective. Bulls growing antlers.',
      summer: 'In high meadows. Feeding heavily on grasses. Bulls in bachelor groups.',
      fall: 'Rut (Sept-Oct). Bulls bugling. Gathering harems. Aggressive behavior.',
      winter: 'Lower elevations. Yarding behavior. Antlers shed (March). Browsing and grazing.'
    },
    conservationStatus: 'Reintroduced. Population ~1,000 in PA. Limited to northcentral region. Limited hunting.',
    imageUrl: '/images/species/elk.jpg'
  },

  // Fur Bearers
  {
    id: 'coyote',
    commonName: 'Coyote',
    scientificName: 'Canis latrans',
    category: 'Fur Bearer',
    emoji: '🐺',
    points: 20,
    description: 'Highly adaptable canid. Expanded into PA in 1930s-40s. Opportunistic predator.',
    habitat: ['Forests', 'Fields', 'Suburban areas', 'All habitats in PA'],
    signs: {
      tracks: 'Oval, dog-like. 2.5-3.5" long. Four toes, claws visible. More elongated than domestic dog.',
      scat: 'Rope-like, twisted, tapered ends. 3/4" diameter. Often contains fur, bones, berries, seeds.',
      otherSigns: ['Howling heard', 'Prey remains', 'Dens in banks or under structures', 'Scent marking', 'Trails along field edges']
    },
    seasonalBehavior: {
      spring: 'Pups born (April-May). Pair stays at den. Hunting to feed young.',
      summer: 'Family groups. Teaching pups to hunt. Active at dawn/dusk.',
      fall: 'Dispersal of young. Increased vocalizations. Packs forming.',
      winter: 'Breeding season (Jan-Feb). Howling peaks. Hunting in packs. Following deer.'
    },
    conservationStatus: 'Abundant. Year-round hunting/trapping. No closed season.',
    imageUrl: '/images/species/coyote.jpg'
  },
  {
    id: 'red-fox',
    commonName: 'Red Fox',
    scientificName: 'Vulpes vulpes',
    category: 'Fur Bearer',
    emoji: '🦊',
    points: 15,
    description: 'Most common fox in PA. Reddish coat with black legs and white-tipped tail.',
    habitat: ['Fields', 'Forest edges', 'Suburban areas', 'Agricultural land'],
    signs: {
      tracks: 'Small, oval. 2" long. Four toes. Claws sharp. Often in straight line.',
      scat: 'Twisted, tapered. 1/2" diameter. Often contains fur, feathers, berries, insects.',
      otherSigns: ['Den entrances with prey remains', 'Strong musky odor', 'Cached food', 'Trails along fences']
    },
    seasonalBehavior: {
      spring: 'Kits born (March-April). Family at den. Adults hunting constantly.',
      summer: 'Kits learning to hunt. Family active. Hunting small mammals.',
      fall: 'Dispersal of young. Solitary behavior. Caching food.',
      winter: 'Breeding season (Dec-Feb). Pairs forming. Hunting in snow. Mousing.'
    },
    conservationStatus: 'Common. Managed trapping season.',
    imageUrl: '/images/species/red-fox.jpg'
  },
  {
    id: 'bobcat',
    commonName: 'Bobcat',
    scientificName: 'Lynx rufus',
    category: 'Fur Bearer',
    emoji: '🐱',
    points: 25,
    description: 'Only wild cat in PA. Short tail, tufted ears, spotted coat. Elusive and rarely seen.',
    habitat: ['Forests', 'Rocky areas', 'Swamps', 'Remote mountainous regions'],
    signs: {
      tracks: 'Round cat track. 2" diameter. Four toes, no claws visible. Retractable claws.',
      scat: 'Segmented, blunt ends. 1/2-1" diameter. Often buried. Contains fur and bones.',
      otherSigns: ['Scrapes covering scat', 'Claw marks on trees', 'Cached prey', 'Den in rock crevices']
    },
    seasonalBehavior: {
      spring: 'Kittens born (April-May). Female raises alone. Territorial.',
      summer: 'Kittens learning to hunt. Nocturnal activity. Hunting small mammals.',
      fall: 'Dispersal of young. Increased movement. Solitary.',
      winter: 'Breeding season (Feb-March). Most active. Following deer and rabbits.'
    },
    conservationStatus: 'Uncommon but increasing. Limited trapping season.',
    imageUrl: '/images/species/bobcat.jpg'
  },
  {
    id: 'raccoon',
    commonName: 'Raccoon',
    scientificName: 'Procyon lotor',
    category: 'Fur Bearer',
    emoji: '🦝',
    points: 10,
    description: 'Highly adaptable, intelligent. Black mask, ringed tail. Excellent climber.',
    habitat: ['Forests', 'Wetlands', 'Suburban areas', 'Near water'],
    signs: {
      tracks: 'Hand-like prints. Five long toes. Front 2-3", hind 3-4". Look like tiny human hands.',
      scat: 'Tubular, blunt ends. 1/2-3/4" diameter. Often near water. Contains seeds, crayfish parts.',
      otherSigns: ['Latrines (communal scat sites)', 'Overturned trash', 'Raided bird feeders', 'Den in hollow trees']
    },
    seasonalBehavior: {
      spring: 'Young born (April-May). Very active. Feeding heavily after winter.',
      summer: 'Teaching young to forage. Near water. Eating crayfish, frogs.',
      fall: 'Intensive feeding. Building fat. Raiding crops.',
      winter: 'Denning in cold weather (not true hibernation). May emerge during warm spells.'
    },
    conservationStatus: 'Abundant. Managed trapping season.',
    imageUrl: '/images/species/raccoon.jpg'
  },
  {
    id: 'gray-fox',
    commonName: 'Gray Fox',
    scientificName: 'Urocyon cinereoargenteus',
    category: 'Fur Bearer',
    emoji: '🦊',
    points: 15,
    description: 'Only canid that climbs trees. Gray coat with rusty sides. Black-tipped tail.',
    habitat: ['Forests', 'Rocky areas', 'Brushy areas', 'Mature woodlands'],
    signs: {
      tracks: 'Smaller than red fox. 1.5" long. Semi-retractable claws. More cat-like.',
      scat: 'Similar to red fox but smaller. Often contains more plant material.',
      otherSigns: ['Den in trees or rock crevices', 'Claw marks on trees', 'Scat on logs/rocks']
    },
    seasonalBehavior: {
      spring: 'Pups born (March-April). Family in den (often in tree cavity).',
      summer: 'Family active. Young learning to climb. Hunting small prey.',
      fall: 'Young dispersing. Solitary behavior.',
      winter: 'Breeding season (Jan-Feb). Most active. Less common than red fox.'
    },
    conservationStatus: 'Common. Managed trapping season.',
    imageUrl: '/images/species/gray-fox.jpg'
  },

  // Additional Species
  {
    id: 'fisher',
    commonName: 'Fisher',
    scientificName: 'Pekania pennanti',
    category: 'Fur Bearer',
    emoji: '🦦',
    points: 25,
    description: 'Large weasel family member. Reintroduced to PA. One of few porcupine predators.',
    habitat: ['Mature forests', 'Remote areas', 'Northern PA'],
    signs: {
      tracks: 'Five toes, semi-retractable claws. 2.5" long. Bounding gait pattern.',
      scat: 'Twisted, dark. Often contains porcupine quills, fur, bones.',
      otherSigns: ['Tree dens', 'Porcupine kills', 'Trails in snow', 'Scent marking']
    },
    seasonalBehavior: {
      spring: 'Kits born (March-April). Very secretive.',
      summer: 'Solitary except mother with young. Territorial.',
      fall: 'Increased movement. Hunting.',
      winter: 'Breeding season (March-April). Most active. Hunting porcupines, hares.'
    },
    conservationStatus: 'Reintroduced. Growing population. Limited trapping.',
    imageUrl: '/images/species/fisher.jpg'
  },
  {
    id: 'river-otter',
    commonName: 'River Otter',
    scientificName: 'Lontra canadensis',
    category: 'Fur Bearer',
    emoji: '🦦',
    points: 25,
    description: 'Aquatic weasel. Reintroduced to PA. Playful, social. Excellent swimmer.',
    habitat: ['Rivers', 'Streams', 'Lakes', 'Wetlands'],
    signs: {
      tracks: 'Five toes with webbing. 3" wide. Often show tail drag.',
      scat: 'Dark, oily, fishy smell. Contains fish scales, crayfish parts.',
      otherSigns: ['Slides on banks', 'Roll areas in grass', 'Latrines near water', 'Dens in banks']
    },
    seasonalBehavior: {
      spring: 'Pups born (March-April). Family groups active.',
      summer: 'Teaching young to swim and hunt. Very playful.',
      fall: 'Families stay together. Establishing territories.',
      winter: 'Under ice fishing. Using air pockets. Slides on snow/ice.'
    },
    conservationStatus: 'Reintroduced. Increasing. Limited trapping.',
    imageUrl: '/images/species/river-otter.jpg'
  }
];

export default function TerrestrialsPage() {
  const { award } = usePoints();
  
  const [observations, setObservations] = useState<WildlifeObservation[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<WildlifeSpecies | null>(null);
  const [view, setView] = useState<'field-guide' | 'log' | 'observations'>('field-guide');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newObservation, setNewObservation] = useState<Partial<WildlifeObservation>>({
    signType: 'tracks',
    confidence: 'Probable'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = () => {
    try {
      const stored = localStorage.getItem('wla-terrestrial-observations');
      if (stored) {
        setObservations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load observations:', error);
    }
  };

  const saveObservations = (obs: WildlifeObservation[]) => {
    try {
      localStorage.setItem('wla-terrestrial-observations', JSON.stringify(obs));
      setObservations(obs);
    } catch (error) {
      console.error('Failed to save observations:', error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push(event.target.result as string);
          setNewObservation(prev => ({
            ...prev,
            photos: [...(prev.photos || []), event.target!.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const logObservation = () => {
    if (!newObservation.speciesId || !newObservation.location) {
      alert('Please select a species and enter a location');
      return;
    }

    const observation: WildlifeObservation = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      speciesId: newObservation.speciesId,
      signType: newObservation.signType || 'tracks',
      location: newObservation.location,
      latitude: newObservation.latitude,
      longitude: newObservation.longitude,
      habitat: newObservation.habitat || '',
      weatherConditions: newObservation.weatherConditions || '',
      photos: newObservation.photos || [],
      measurements: newObservation.measurements,
      notes: newObservation.notes || '',
      confidence: newObservation.confidence || 'Probable'
    };

    const species = PA_TERRESTRIALS.find(s => s.id === observation.speciesId);
    if (species) {
      award(species.points, `${species.commonName} Sign Documented!`);
    }

    saveObservations([...observations, observation]);
    setNewObservation({ signType: 'tracks', confidence: 'Probable' });
    setView('observations');
  };

  const filteredSpecies = PA_TERRESTRIALS.filter(species => {
    const matchesCategory = filterCategory === 'all' || species.category === filterCategory;
    const matchesSearch = species.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         species.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #4C1D05 0%, #8B4513 100%)',
        color: 'white',
        padding: '2rem 1rem',
        borderRadius: '0 0 24px 24px'
      }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            🐾 PA Terrestrial Wildlife
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
            Track and document signs of Pennsylvania's wildlife
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="container" style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setView('field-guide')}
            style={{
              padding: '0.75rem 1.5rem',
              background: view === 'field-guide' ? '#8B4513' : 'white',
              color: view === 'field-guide' ? 'white' : '#023047',
              border: '2px solid #8B4513',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📖 Field Guide
          </button>
          <button
            onClick={() => setView('log')}
            style={{
              padding: '0.75rem 1.5rem',
              background: view === 'log' ? '#8B4513' : 'white',
              color: view === 'log' ? 'white' : '#023047',
              border: '2px solid #8B4513',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ➕ Log Observation
          </button>
          <button
            onClick={() => setView('observations')}
            style={{
              padding: '0.75rem 1.5rem',
              background: view === 'observations' ? '#8B4513' : 'white',
              color: view === 'observations' ? 'white' : '#023047',
              border: '2px solid #8B4513',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📋 My Observations ({observations.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto 2rem', padding: '0 1rem' }}>
        {view === 'field-guide' && (
          <div>
            {/* Filters */}
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="all">All Species ({PA_TERRESTRIALS.length})</option>
                    <option value="Big Game">Big Game</option>
                    <option value="Fur Bearer">Fur Bearers</option>
                    <option value="Small Game">Small Game</option>
                    <option value="Non-Game">Non-Game</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search species..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Species Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredSpecies.map(species => (
                <div
                  key={species.id}
                  onClick={() => setSelectedSpecies(species)}
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                    {species.emoji}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#023047', marginBottom: '0.25rem', textAlign: 'center' }}>
                    {species.commonName}
                  </h3>
                  <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#6B7280', textAlign: 'center', marginBottom: '0.75rem' }}>
                    {species.scientificName}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: '#FFF3E0',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#E65100',
                    marginBottom: '0.75rem'
                  }}>
                    {species.category}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.5 }}>
                    {species.description}
                  </p>
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8B4513' }}>
                      🏆 {species.points} points per observation
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'log' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#023047', marginBottom: '1.5rem' }}>
              Log Wildlife Observation
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Species Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                  Species *
                </label>
                <select
                  value={newObservation.speciesId || ''}
                  onChange={(e) => setNewObservation({ ...newObservation, speciesId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select a species...</option>
                  {PA_TERRESTRIALS.map(species => (
                    <option key={species.id} value={species.id}>
                      {species.emoji} {species.commonName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sign Type and Confidence */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                    Sign Type
                  </label>
                  <select
                    value={newObservation.signType}
                    onChange={(e) => setNewObservation({ ...newObservation, signType: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="tracks">Tracks</option>
                    <option value="scat">Scat</option>
                    <option value="rubs">Rubs</option>
                    <option value="scrapes">Scrapes</option>
                    <option value="den">Den/Burrow</option>
                    <option value="feeding">Feeding Sign</option>
                    <option value="bedding">Bedding Site</option>
                    <option value="visual">Visual Sighting</option>
                    <option value="sounds">Sounds Heard</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                    Confidence
                  </label>
                  <select
                    value={newObservation.confidence}
                    onChange={(e) => setNewObservation({ ...newObservation, confidence: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="Certain">Certain</option>
                    <option value="Probable">Probable</option>
                    <option value="Possible">Possible</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                  Location *
                </label>
                <input
                  type="text"
                  value={newObservation.location || ''}
                  onChange={(e) => setNewObservation({ ...newObservation, location: e.target.value })}
                  placeholder="e.g., Rothrock State Forest, Huntingdon County"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
              </div>

              {/* Habitat and Weather */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                    Habitat Type
                  </label>
                  <input
                    type="text"
                    value={newObservation.habitat || ''}
                    onChange={(e) => setNewObservation({ ...newObservation, habitat: e.target.value })}
                    placeholder="e.g., Mixed hardwood forest"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                    Weather Conditions
                  </label>
                  <input
                    type="text"
                    value={newObservation.weatherConditions || ''}
                    onChange={(e) => setNewObservation({ ...newObservation, weatherConditions: e.target.value })}
                    placeholder="e.g., Cloudy, 55°F"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                  Photos
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#E3F2FD',
                    color: '#0277BD',
                    border: '2px dashed #0277BD',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  📸 Upload Photos ({newObservation.photos?.length || 0})
                </button>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                  Notes
                </label>
                <textarea
                  value={newObservation.notes || ''}
                  onChange={(e) => setNewObservation({ ...newObservation, notes: e.target.value })}
                  placeholder="Detailed observations, behavior, measurements, etc."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit */}
              <button
                onClick={logObservation}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #4C1D05 0%, #8B4513 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                ✅ Log Observation
              </button>
            </div>
          </div>
        )}

        {view === 'observations' && (
          <div>
            {observations.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.5rem' }}>
                  No Observations Yet
                </h3>
                <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                  Start documenting wildlife signs in the field!
                </p>
                <button
                  onClick={() => setView('log')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#8B4513',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Log First Observation
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {observations.slice().reverse().map(obs => {
                  const species = PA_TERRESTRIALS.find(s => s.id === obs.speciesId);
                  return (
                    <div
                      key={obs.id}
                      style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <div style={{ fontSize: '2.5rem' }}>
                          {species?.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#023047', marginBottom: '0.25rem' }}>
                            {species?.commonName} - {obs.signType}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                            📍 {obs.location} • 📅 {new Date(obs.timestamp).toLocaleDateString()} • 
                            🎯 {obs.confidence}
                          </div>
                          {obs.notes && (
                            <p style={{ fontSize: '0.95rem', color: '#374151', marginBottom: '0.75rem' }}>
                              {obs.notes}
                            </p>
                          )}
                          {obs.photos && obs.photos.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {obs.photos.map((photo, i) => (
                                <div
                                  key={i}
                                  style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '8px',
                                    backgroundImage: `url(${photo})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{
                          padding: '0.5rem 1rem',
                          background: '#FFF3E0',
                          borderRadius: '8px',
                          fontWeight: 700,
                          color: '#E65100'
                        }}>
                          +{species?.points} pts
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Species Detail Modal */}
      {selectedSpecies && (
        <div
          onClick={() => setSelectedSpecies(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: '16px',
              padding: '2rem'
            }}
          >
            <button
              onClick={() => setSelectedSpecies(null)}
              style={{
                float: 'right',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#E5E7EB',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>
              {selectedSpecies.emoji}
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#023047', textAlign: 'center', marginBottom: '0.5rem' }}>
              {selectedSpecies.commonName}
            </h2>
            <p style={{ fontSize: '1rem', fontStyle: 'italic', color: '#6B7280', textAlign: 'center', marginBottom: '1.5rem' }}>
              {selectedSpecies.scientificName}
            </p>

            <div style={{
              padding: '1rem',
              background: '#FFF3E0',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6 }}>
                {selectedSpecies.description}
              </p>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              🐾 Tracks
            </h3>
            <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {selectedSpecies.signs.tracks}
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              💩 Scat
            </h3>
            <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {selectedSpecies.signs.scat}
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              🔍 Other Signs
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              {selectedSpecies.signs.otherSigns.map((sign, i) => (
                <li key={i} style={{ color: '#374151', marginBottom: '0.5rem' }}>{sign}</li>
              ))}
            </ul>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              📅 Seasonal Behavior
            </h3>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              {Object.entries(selectedSpecies.seasonalBehavior).map(([season, behavior]) => (
                <div key={season} style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#023047', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                    {season}
                  </div>
                  <div style={{ color: '#374151', fontSize: '0.95rem' }}>
                    {behavior}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedSpecies(null);
                setView('log');
                setNewObservation({ ...newObservation, speciesId: selectedSpecies.id });
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #4C1D05 0%, #8B4513 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              📝 Log Observation of This Species
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

