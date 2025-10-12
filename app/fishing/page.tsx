'use client';

import { useState, useEffect, useRef } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
(mapboxgl as any).accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface FishSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Trout' | 'Bass' | 'Panfish' | 'Pike' | 'Catfish' | 'Other';
  habitat: {
    waterType: string[];
    temperature: string;
    oxygen: string;
    cover: string[];
    depth: string;
  };
  bestBait: string[];
  season: string;
  regulations: string;
  points: number;
  emoji: string;
  description: string;
}

interface WaterBody {
  id: string;
  name: string;
  type: 'Stream' | 'Lake' | 'River' | 'Pond';
  county: string;
  lat: number;
  lon: number;
  species: string[];
  stockingSchedule?: StockingEvent[];
  accessPoints: AccessPoint[];
  regulations: string;
  habitat: string;
  size?: string;
}

interface StockingEvent {
  date: string;
  species: string;
  quantity: number;
  size: string;
}

interface AccessPoint {
  name: string;
  lat: number;
  lon: number;
  amenities: string[];
  accessibility: string;
  parking: boolean;
}

interface FishingLog {
  id: string;
  timestamp: number;
  waterBodyId: string;
  speciesId: string;
  length?: number;
  weight?: number;
  bait: string;
  weather: string;
  waterTemp?: number;
  location: string;
  photos: string[];
  notes: string;
  released: boolean;
}

const PA_FISH_SPECIES: FishSpecies[] = [
  {
    id: 'brook-trout',
    commonName: 'Brook Trout',
    scientificName: 'Salvelinus fontinalis',
    category: 'Trout',
    habitat: {
      waterType: ['Cold streams', 'Spring-fed lakes'],
      temperature: '50-60°F',
      oxygen: 'High (7-10 mg/L)',
      cover: ['Undercut banks', 'Boulders', 'Logs', 'Deep pools'],
      depth: '2-6 feet in streams'
    },
    bestBait: ['Worms', 'Small spinners', 'Flies (dry & wet)', 'Corn'],
    season: 'Year-round (check regs)',
    regulations: 'PA native - Special protection in some streams',
    points: 15,
    emoji: '🐟',
    description: 'Pennsylvania\'s only native trout, prefers cold, clean water'
  },
  {
    id: 'rainbow-trout',
    commonName: 'Rainbow Trout',
    scientificName: 'Oncorhynchus mykiss',
    category: 'Trout',
    habitat: {
      waterType: ['Cold streams', 'Lakes', 'Stocked waters'],
      temperature: '50-65°F',
      oxygen: 'High (6-9 mg/L)',
      cover: ['Riffles', 'Runs', 'Pools', 'Structure'],
      depth: '1-8 feet'
    },
    bestBait: ['PowerBait', 'Spinners', 'Flies', 'Salmon eggs'],
    season: 'Stocked spring & fall',
    regulations: 'Check daily creel limits',
    points: 10,
    emoji: '🌈',
    description: 'Popular stocked trout, known for acrobatic fights'
  },
  {
    id: 'brown-trout',
    commonName: 'Brown Trout',
    scientificName: 'Salmo trutta',
    category: 'Trout',
    habitat: {
      waterType: ['Streams', 'Rivers', 'Lakes'],
      temperature: '55-65°F',
      oxygen: 'Moderate-High (5-8 mg/L)',
      cover: ['Deep pools', 'Undercut banks', 'Structure'],
      depth: '3-10 feet'
    },
    bestBait: ['Minnows', 'Nightcrawlers', 'Streamers', 'Crankbaits'],
    season: 'Year-round',
    regulations: 'Larger size limits on some waters',
    points: 12,
    emoji: '🎣',
    description: 'Wary and difficult to catch, grows large in PA waters'
  },
  {
    id: 'largemouth-bass',
    commonName: 'Largemouth Bass',
    scientificName: 'Micropterus salmoides',
    category: 'Bass',
    habitat: {
      waterType: ['Lakes', 'Ponds', 'Slow rivers'],
      temperature: '65-75°F',
      oxygen: 'Moderate (4-7 mg/L)',
      cover: ['Vegetation', 'Docks', 'Lily pads', 'Fallen trees'],
      depth: '2-15 feet (seasonal)'
    },
    bestBait: ['Plastic worms', 'Crankbaits', 'Topwater lures', 'Spinnerbaits'],
    season: 'Best May-October',
    regulations: '15" minimum (some lakes)',
    points: 10,
    emoji: '🎸',
    description: 'Aggressive predator, found in most PA lakes and ponds'
  },
  {
    id: 'smallmouth-bass',
    commonName: 'Smallmouth Bass',
    scientificName: 'Micropterus dolomieu',
    category: 'Bass',
    habitat: {
      waterType: ['Rivers', 'Streams', 'Clear lakes'],
      temperature: '65-75°F',
      oxygen: 'Moderate-High (5-8 mg/L)',
      cover: ['Rocky areas', 'Gravel bars', 'Boulders'],
      depth: '3-20 feet'
    },
    bestBait: ['Tubes', 'Hellgrammites', 'Crayfish', 'Small jigs'],
    season: 'Best June-October',
    regulations: '12" minimum',
    points: 12,
    emoji: '🥊',
    description: 'Pound-for-pound fighter, thrives in PA rivers'
  },
  {
    id: 'bluegill',
    commonName: 'Bluegill',
    scientificName: 'Lepomis macrochirus',
    category: 'Panfish',
    habitat: {
      waterType: ['Lakes', 'Ponds', 'Slow streams'],
      temperature: '70-80°F',
      oxygen: 'Moderate (4-6 mg/L)',
      cover: ['Vegetation', 'Shallow bays', 'Docks'],
      depth: '1-10 feet'
    },
    bestBait: ['Worms', 'Crickets', 'Small jigs', 'Flies'],
    season: 'Best May-September',
    regulations: 'No minimum size',
    points: 5,
    emoji: '🔵',
    description: 'Excellent for beginners, great table fare'
  },
  {
    id: 'crappie',
    commonName: 'Black Crappie',
    scientificName: 'Pomoxis nigromaculatus',
    category: 'Panfish',
    habitat: {
      waterType: ['Lakes', 'Reservoirs', 'Rivers'],
      temperature: '60-75°F',
      oxygen: 'Moderate (4-7 mg/L)',
      cover: ['Brush piles', 'Docks', 'Submerged trees'],
      depth: '5-15 feet'
    },
    bestBait: ['Minnows', 'Small jigs', 'Tube baits'],
    season: 'Spring spawn (March-May)',
    regulations: 'No minimum size',
    points: 8,
    emoji: '⚫',
    description: 'Schooling fish, great for ice fishing'
  },
  {
    id: 'yellow-perch',
    commonName: 'Yellow Perch',
    scientificName: 'Perca flavescens',
    category: 'Panfish',
    habitat: {
      waterType: ['Lakes', 'Large rivers'],
      temperature: '65-75°F',
      oxygen: 'Moderate (5-7 mg/L)',
      cover: ['Weed beds', 'Rocky areas', 'Open water'],
      depth: '10-25 feet'
    },
    bestBait: ['Minnows', 'Worms', 'Small jigs'],
    season: 'Year-round (great ice fishing)',
    regulations: 'No minimum size',
    points: 8,
    emoji: '💛',
    description: 'Schooling fish, excellent eating'
  },
  {
    id: 'northern-pike',
    commonName: 'Northern Pike',
    scientificName: 'Esox lucius',
    category: 'Pike',
    habitat: {
      waterType: ['Lakes', 'Slow rivers'],
      temperature: '55-70°F',
      oxygen: 'Moderate (5-8 mg/L)',
      cover: ['Vegetation', 'Deep weed edges', 'Points'],
      depth: '5-20 feet'
    },
    bestBait: ['Large spoons', 'Spinnerbaits', 'Live bait', 'Jerkbaits'],
    season: 'Best spring & fall',
    regulations: '24" minimum',
    points: 15,
    emoji: '🔱',
    description: 'Aggressive predator with sharp teeth, use wire leader'
  },
  {
    id: 'muskellunge',
    commonName: 'Muskellunge',
    scientificName: 'Esox masquinongy',
    category: 'Pike',
    habitat: {
      waterType: ['Large lakes', 'Rivers'],
      temperature: '60-75°F',
      oxygen: 'High (6-9 mg/L)',
      cover: ['Deep weed edges', 'Rocky points', 'Open water'],
      depth: '10-40 feet'
    },
    bestBait: ['Large lures (8-12")', 'Jerkbaits', 'Bucktails'],
    season: 'Best fall (September-November)',
    regulations: '40" minimum - Trophy fish',
    points: 25,
    emoji: '👑',
    description: 'The fish of 10,000 casts - PA\'s apex predator'
  },
  {
    id: 'channel-catfish',
    commonName: 'Channel Catfish',
    scientificName: 'Ictalurus punctatus',
    category: 'Catfish',
    habitat: {
      waterType: ['Rivers', 'Lakes', 'Ponds'],
      temperature: '70-85°F',
      oxygen: 'Low-Moderate (3-6 mg/L)',
      cover: ['Deep holes', 'Under structure', 'Bottom'],
      depth: '5-30 feet'
    },
    bestBait: ['Chicken liver', 'Stinkbait', 'Nightcrawlers', 'Cut bait'],
    season: 'Best summer (June-August)',
    regulations: 'No minimum size',
    points: 10,
    emoji: '🐈',
    description: 'Great for bank fishing, active at night'
  },
  {
    id: 'walleye',
    commonName: 'Walleye',
    scientificName: 'Sander vitreus',
    category: 'Other',
    habitat: {
      waterType: ['Lakes', 'Large rivers'],
      temperature: '60-70°F',
      oxygen: 'Moderate-High (6-8 mg/L)',
      cover: ['Rocky areas', 'Sand flats', 'Points'],
      depth: '10-30 feet'
    },
    bestBait: ['Jigs & minnows', 'Crankbaits', 'Live bait rigs'],
    season: 'Best spring & fall (low light)',
    regulations: '15" minimum',
    points: 15,
    emoji: '👁️',
    description: 'Excellent table fare, feed actively in low light'
  }
];

// Sample water bodies - in production, this would come from PFBC GIS API
const PA_WATER_BODIES: WaterBody[] = [
  {
    id: 'spring-creek',
    name: 'Spring Creek',
    type: 'Stream',
    county: 'Centre',
    lat: 40.7934,
    lon: -77.8600,
    species: ['brook-trout', 'brown-trout', 'rainbow-trout'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Rainbow Trout', quantity: 2500, size: 'Adult' },
      { date: '2024-04-15', species: 'Brown Trout', quantity: 1000, size: 'Adult' },
      { date: '2024-10-01', species: 'Brook Trout', quantity: 500, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Fisherman\'s Paradise',
        lat: 40.7934,
        lon: -77.8600,
        amenities: ['Parking', 'Restrooms', 'Wheelchair accessible'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Fly fishing only, catch & release',
    habitat: 'Spring-fed limestone stream with excellent trout habitat',
    size: '15 miles'
  },
  {
    id: 'lake-raystown',
    name: 'Raystown Lake',
    type: 'Lake',
    county: 'Huntingdon',
    lat: 40.4167,
    lon: -78.0833,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'muskellunge', 'crappie', 'bluegill', 'yellow-perch', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Seven Points Marina',
        lat: 40.4167,
        lon: -78.0833,
        amenities: ['Boat launch', 'Parking', 'Marina', 'Restrooms', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Susquehannock Campground',
        lat: 40.4200,
        lon: -78.0900,
        amenities: ['Boat launch', 'Camping', 'Swimming', 'Parking'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Bass: 15" minimum, Walleye: 18" minimum, Muskie: 40" minimum',
    habitat: '8,300-acre reservoir with rocky points, coves, and deep channels. Excellent structure for bass and muskie.',
    size: '8,300 acres, 30 miles long'
  },
  {
    id: 'lake-erie',
    name: 'Lake Erie (Presque Isle Bay)',
    type: 'Lake',
    county: 'Erie',
    lat: 42.1275,
    lon: -80.0851,
    species: ['smallmouth-bass', 'walleye', 'yellow-perch', 'northern-pike', 'muskellunge', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Presque Isle State Park',
        lat: 42.1275,
        lon: -80.0851,
        amenities: ['Multiple launches', 'Parking', 'Beach', 'Trails', 'Visitor center'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Check PA & Great Lakes regulations - Special seasons apply',
    habitat: 'World-class fishing for walleye and perch. Protected bay with weed beds and rocky structure.',
    size: '3,200 acres (Presque Isle Bay)'
  },
  {
    id: 'penns-creek',
    name: 'Penns Creek',
    type: 'Stream',
    county: 'Centre/Snyder',
    lat: 40.8670,
    lon: -77.4167,
    species: ['brown-trout', 'smallmouth-bass'],
    stockingSchedule: [
      { date: '2024-04-05', species: 'Brown Trout', quantity: 1500, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Coburn Access',
        lat: 40.8670,
        lon: -77.4167,
        amenities: ['Parking', 'Stream access'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Trophy trout section - Special regulations',
    habitat: 'Freestone stream with excellent insect hatches, deep pools',
    size: '67 miles'
  },
  {
    id: 'lake-wallenpaupack',
    name: 'Lake Wallenpaupack',
    type: 'Lake',
    county: 'Pike/Wayne',
    lat: 41.3500,
    lon: -75.1833,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'yellow-perch', 'crappie', 'bluegill', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Mangan\'s Boat Launch',
        lat: 41.3500,
        lon: -75.1833,
        amenities: ['Boat launch', 'Parking', 'Marina'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 12" minimum, No size limits on panfish',
    habitat: '5,700-acre reservoir with rocky shorelines, submerged timber, and deep basins',
    size: '5,700 acres, 52 miles of shoreline'
  }
];

export default function FishingPage() {
  const { addPoints } = usePoints();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'stocking' | 'lakes' | 'species' | 'log'>('map');
  const [selectedWaterBody, setSelectedWaterBody] = useState<WaterBody | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCounty, setFilterCounty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLogs, setUserLogs] = useState<FishingLog[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);

  // Log form state
  const [logForm, setLogForm] = useState({
    waterBodyId: '',
    speciesId: '',
    length: '',
    weight: '',
    bait: '',
    weather: '',
    waterTemp: '',
    location: '',
    notes: '',
    released: true
  });
  const [logPhotos, setLogPhotos] = useState<string[]>([]);

  // Load user logs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wla-fishing-logs');
    if (stored) {
      setUserLogs(JSON.parse(stored));
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-77.7278, 40.9699], // Center of PA
      zoom: 6.5
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }), 'top-right');

    // Add markers for water bodies
    map.current.on('load', () => {
      PA_WATER_BODIES.forEach((waterBody) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.cursor = 'pointer';
        el.innerHTML = waterBody.type === 'Lake' ? '🏞️' : '🌊';
        el.style.fontSize = '24px';

        new mapboxgl.Marker(el)
          .setLngLat([waterBody.lon, waterBody.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <strong>${waterBody.name}</strong><br/>
            ${waterBody.type} - ${waterBody.county} County<br/>
            <button onclick="window.dispatchEvent(new CustomEvent('selectWaterBody', {detail: '${waterBody.id}'}))">
              View Details
            </button>
          `))
          .addTo(map.current!);
      });
    });
  }, []);

  // Handle water body selection
  useEffect(() => {
    const handleSelect = (e: any) => {
      const waterBody = PA_WATER_BODIES.find(w => w.id === e.detail);
      if (waterBody) {
        setSelectedWaterBody(waterBody);
        setActiveTab('map');
      }
    };
    window.addEventListener('selectWaterBody', handleSelect);
    return () => window.removeEventListener('selectWaterBody', handleSelect);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setLogPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitLog = () => {
    if (!logForm.waterBodyId || !logForm.speciesId) {
      alert('Please select a water body and species');
      return;
    }

    const newLog: FishingLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      waterBodyId: logForm.waterBodyId,
      speciesId: logForm.speciesId,
      length: logForm.length ? parseFloat(logForm.length) : undefined,
      weight: logForm.weight ? parseFloat(logForm.weight) : undefined,
      bait: logForm.bait,
      weather: logForm.weather,
      waterTemp: logForm.waterTemp ? parseFloat(logForm.waterTemp) : undefined,
      location: logForm.location,
      photos: logPhotos,
      notes: logForm.notes,
      released: logForm.released
    };

    const updated = [newLog, ...userLogs];
    setUserLogs(updated);
    localStorage.setItem('wla-fishing-logs', JSON.stringify(updated));

    // Award points
    const species = PA_FISH_SPECIES.find(s => s.id === logForm.speciesId);
    if (species) {
      addPoints(species.points, `Caught ${species.commonName}`);
    }

    // Reset form
    setLogForm({
      waterBodyId: '',
      speciesId: '',
      length: '',
      weight: '',
      bait: '',
      weather: '',
      waterTemp: '',
      location: '',
      notes: '',
      released: true
    });
    setLogPhotos([]);
    setShowLogForm(false);
  };

  const filteredWaterBodies = PA_WATER_BODIES.filter(w => {
    if (filterType !== 'all' && w.type !== filterType) return false;
    if (filterCounty !== 'all' && w.county !== filterCounty) return false;
    if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredSpecies = PA_FISH_SPECIES.filter(s => {
    if (searchQuery && !s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counties = ['all', ...Array.from(new Set(PA_WATER_BODIES.map(w => w.county)))].sort();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #023047 0%, #0077B6 50%, #00B4D8 100%)', paddingTop: '1rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            🎣 Pennsylvania Fishing Guide
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.95 }}>
            Trout Stocking • Lake Fishing • Species Habitats • Catch Logging
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { id: 'map', label: '🗺️ Interactive Map', icon: '🗺️' },
            { id: 'stocking', label: '📅 Trout Stocking', icon: '🌈' },
            { id: 'lakes', label: '🏞️ Lakes & Streams', icon: '🏞️' },
            { id: 'species', label: '🐟 Species Guide', icon: '🐟' },
            { id: 'log', label: '📝 My Fishing Log', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="btn"
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #FFD60A, #FFB703)'
                  : 'rgba(255,255,255,0.2)',
                color: activeTab === tab.id ? '#023047' : 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(255,214,10,0.3)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Map Tab */}
        {activeTab === 'map' && (
          <div className="card section">
            <div style={{ display: 'grid', gridTemplateColumns: selectedWaterBody ? '1fr 400px' : '1fr', gap: '1.5rem' }}>
              <div>
                <h2>🗺️ Pennsylvania Waters</h2>
                <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                  Click markers to explore fishing locations across Pennsylvania
                </p>
                <div 
                  ref={mapContainer} 
                  style={{ 
                    width: '100%', 
                    height: '600px', 
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }} 
                />
              </div>

              {selectedWaterBody && (
                <div className="card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3>{selectedWaterBody.name}</h3>
                      <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
                        {selectedWaterBody.type} • {selectedWaterBody.county} County
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedWaterBody(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4>Overview</h4>
                    <p style={{ color: '#4B5563', lineHeight: 1.6 }}>{selectedWaterBody.habitat}</p>
                    {selectedWaterBody.size && (
                      <p style={{ color: '#6B7280', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <strong>Size:</strong> {selectedWaterBody.size}
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4>Regulations</h4>
                    <p style={{ color: '#4B5563', lineHeight: 1.6 }}>{selectedWaterBody.regulations}</p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4>Species Present</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedWaterBody.species.map(speciesId => {
                        const species = PA_FISH_SPECIES.find(s => s.id === speciesId);
                        return species ? (
                          <span 
                            key={speciesId}
                            style={{
                              background: '#E0F2FE',
                              color: '#0C4A6E',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: 600
                            }}
                          >
                            {species.emoji} {species.commonName}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {selectedWaterBody.stockingSchedule && selectedWaterBody.stockingSchedule.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4>📅 Stocking Schedule</h4>
                      {selectedWaterBody.stockingSchedule.map((event, idx) => (
                        <div 
                          key={idx}
                          style={{
                            background: '#F0F9FF',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginTop: '0.5rem',
                            borderLeft: '4px solid #0077B6'
                          }}
                        >
                          <div style={{ fontWeight: 600, color: '#023047' }}>{event.species}</div>
                          <div style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>
                            {new Date(event.date).toLocaleDateString()} • {event.quantity} fish • {event.size}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <h4>🚗 Access Points</h4>
                    {selectedWaterBody.accessPoints.map((access, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: '#F9FAFB',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginTop: '0.5rem'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#023047' }}>{access.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
                          {access.amenities.join(' • ')}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>
                          Accessibility: {access.accessibility}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trout Stocking Tab */}
        {activeTab === 'stocking' && (
          <div className="card section">
            <h2>📅 2024 Trout Stocking Schedule</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Plan your fishing trips around PFBC stocking schedules
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {PA_WATER_BODIES
                .filter(w => w.stockingSchedule && w.stockingSchedule.length > 0)
                .map(waterBody => (
                  <div 
                    key={waterBody.id}
                    className="card"
                    style={{ background: '#F0F9FF', border: '2px solid #0077B6' }}
                  >
                    <h3>{waterBody.name}</h3>
                    <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                      {waterBody.type} • {waterBody.county} County
                    </p>

                    {waterBody.stockingSchedule!.map((event, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: 'white',
                          padding: '1rem',
                          borderRadius: '8px',
                          marginTop: '0.75rem',
                          borderLeft: '4px solid #0077B6'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: 700, color: '#023047', fontSize: '1.1rem' }}>
                            {event.species}
                          </div>
                          <div style={{ 
                            background: '#FFD60A', 
                            color: '#023047', 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 700
                          }}>
                            {event.size}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#4B5563' }}>
                          📅 {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#059669', fontWeight: 600, marginTop: '0.25rem' }}>
                          🐟 {event.quantity.toLocaleString()} fish
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setSelectedWaterBody(waterBody);
                        setActiveTab('map');
                      }}
                      className="btn"
                      style={{
                        marginTop: '1rem',
                        width: '100%',
                        background: '#0077B6',
                        color: 'white'
                      }}
                    >
                      View on Map
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Lakes & Streams Tab */}
        {activeTab === 'lakes' && (
          <div className="card section">
            <h2>🏞️ Lakes & Streams Directory</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input"
                style={{ minWidth: '150px' }}
              >
                <option value="all">All Types</option>
                <option value="Lake">Lakes</option>
                <option value="Stream">Streams</option>
                <option value="River">Rivers</option>
              </select>

              <select 
                value={filterCounty}
                onChange={(e) => setFilterCounty(e.target.value)}
                className="input"
                style={{ minWidth: '150px' }}
              >
                {counties.map(county => (
                  <option key={county} value={county}>
                    {county === 'all' ? 'All Counties' : `${county} County`}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ flex: 1, minWidth: '200px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {filteredWaterBodies.map(waterBody => (
                <div key={waterBody.id} className="card" style={{ background: '#F9FAFB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3>{waterBody.name}</h3>
                    <span style={{ fontSize: '2rem' }}>
                      {waterBody.type === 'Lake' ? '🏞️' : '🌊'}
                    </span>
                  </div>
                  
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    {waterBody.type} • {waterBody.county} County
                  </p>

                  {waterBody.size && (
                    <p style={{ color: '#4B5563', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                      <strong>Size:</strong> {waterBody.size}
                    </p>
                  )}

                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#023047' }}>
                      Species ({waterBody.species.length}):
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {waterBody.species.slice(0, 4).map(speciesId => {
                        const species = PA_FISH_SPECIES.find(s => s.id === speciesId);
                        return species ? (
                          <span key={speciesId} style={{ fontSize: '1.5rem' }} title={species.commonName}>
                            {species.emoji}
                          </span>
                        ) : null;
                      })}
                      {waterBody.species.length > 4 && (
                        <span style={{ color: '#6B7280', fontSize: '0.9rem', alignSelf: 'center' }}>
                          +{waterBody.species.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedWaterBody(waterBody);
                      setActiveTab('map');
                    }}
                    className="btn"
                    style={{
                      width: '100%',
                      background: '#0077B6',
                      color: 'white'
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Species Guide Tab */}
        {activeTab === 'species' && (
          <div className="card section">
            <h2>🐟 Pennsylvania Fish Species Guide</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Habitat requirements, best baits, and fishing tips for PA species
            </p>

            <input
              type="text"
              placeholder="Search species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ marginBottom: '1.5rem' }}
            />

            {selectedSpecies ? (
              <div>
                <button 
                  onClick={() => setSelectedSpecies(null)}
                  className="btn-outline"
                  style={{ marginBottom: '1rem' }}
                >
                  ← Back to All Species
                </button>

                <div className="card" style={{ background: '#F0F9FF', border: '3px solid #0077B6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                      <h2>{selectedSpecies.emoji} {selectedSpecies.commonName}</h2>
                      <p style={{ fontStyle: 'italic', color: '#6B7280', marginTop: '0.25rem' }}>
                        {selectedSpecies.scientificName}
                      </p>
                      <span style={{
                        display: 'inline-block',
                        background: '#FFD60A',
                        color: '#023047',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        marginTop: '0.5rem'
                      }}>
                        {selectedSpecies.category}
                      </span>
                    </div>
                    <div style={{
                      background: '#059669',
                      color: 'white',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      +{selectedSpecies.points} Points
                    </div>
                  </div>

                  <p style={{ fontSize: '1.1rem', color: '#023047', marginBottom: '2rem', lineHeight: 1.6 }}>
                    {selectedSpecies.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                      <h3 style={{ color: '#023047', marginBottom: '1rem' }}>🏞️ Habitat Requirements</h3>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.5rem' }}>
                          Water Type:
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {selectedSpecies.habitat.waterType.map((type, idx) => (
                            <li key={idx} style={{ color: '#4B5563' }}>{type}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.25rem' }}>
                          Temperature:
                        </strong>
                        <p style={{ color: '#4B5563', margin: 0 }}>{selectedSpecies.habitat.temperature}</p>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.25rem' }}>
                          Dissolved Oxygen:
                        </strong>
                        <p style={{ color: '#4B5563', margin: 0 }}>{selectedSpecies.habitat.oxygen}</p>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.25rem' }}>
                          Preferred Depth:
                        </strong>
                        <p style={{ color: '#4B5563', margin: 0 }}>{selectedSpecies.habitat.depth}</p>
                      </div>

                      <div>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.5rem' }}>
                          Cover & Structure:
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {selectedSpecies.habitat.cover.map((cover, idx) => (
                            <li key={idx} style={{ color: '#4B5563' }}>{cover}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ color: '#023047', marginBottom: '1rem' }}>🎣 Fishing Info</h3>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.5rem' }}>
                          Best Baits:
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {selectedSpecies.bestBait.map((bait, idx) => (
                            <li key={idx} style={{ color: '#4B5563' }}>{bait}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.25rem' }}>
                          Best Season:
                        </strong>
                        <p style={{ color: '#4B5563', margin: 0 }}>{selectedSpecies.season}</p>
                      </div>

                      <div style={{
                        background: '#FEF3C7',
                        border: '2px solid #F59E0B',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginTop: '1.5rem'
                      }}>
                        <strong style={{ display: 'block', color: '#92400E', marginBottom: '0.5rem' }}>
                          ⚖️ Regulations:
                        </strong>
                        <p style={{ color: '#78350F', margin: 0, fontSize: '0.95rem' }}>
                          {selectedSpecies.regulations}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: '#E0F2FE',
                    border: '2px solid #0077B6',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ color: '#023047', marginBottom: '1rem' }}>📍 Where to Find This Species</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                      {PA_WATER_BODIES
                        .filter(w => w.species.includes(selectedSpecies.id))
                        .map(waterBody => (
                          <button
                            key={waterBody.id}
                            onClick={() => {
                              setSelectedWaterBody(waterBody);
                              setActiveTab('map');
                            }}
                            className="btn"
                            style={{
                              background: 'white',
                              color: '#0077B6',
                              border: '2px solid #0077B6'
                            }}
                          >
                            {waterBody.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredSpecies.map(species => (
                  <div 
                    key={species.id}
                    className="card"
                    onClick={() => setSelectedSpecies(species)}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3>{species.emoji} {species.commonName}</h3>
                        <p style={{ fontStyle: 'italic', color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                          {species.scientificName}
                        </p>
                      </div>
                      <span style={{
                        background: '#059669',
                        color: 'white',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 700
                      }}>
                        +{species.points}
                      </span>
                    </div>

                    <span style={{
                      display: 'inline-block',
                      background: '#E0F2FE',
                      color: '#0C4A6E',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      marginBottom: '0.75rem'
                    }}>
                      {species.category}
                    </span>

                    <p style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {species.description}
                    </p>

                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                      <strong style={{ color: '#023047' }}>Best Season:</strong> {species.season}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fishing Log Tab */}
        {activeTab === 'log' && (
          <div className="card section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2>📝 My Fishing Log</h2>
                <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
                  Track your catches and earn points • {userLogs.length} total entries
                </p>
              </div>
              <button
                onClick={() => setShowLogForm(!showLogForm)}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: 'white'
                }}
              >
                {showLogForm ? '✕ Cancel' : '+ Log a Catch'}
              </button>
            </div>

            {showLogForm && (
              <div className="card" style={{ background: '#F0FDF4', border: '2px solid #059669', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>🎣 Log New Catch</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label">Water Body *</label>
                    <select
                      value={logForm.waterBodyId}
                      onChange={(e) => setLogForm({ ...logForm, waterBodyId: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select water body...</option>
                      {PA_WATER_BODIES.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({w.type})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Species *</label>
                    <select
                      value={logForm.speciesId}
                      onChange={(e) => setLogForm({ ...logForm, speciesId: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select species...</option>
                      {PA_FISH_SPECIES.map(s => (
                        <option key={s.id} value={s.id}>{s.emoji} {s.commonName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Length (inches)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={logForm.length}
                      onChange={(e) => setLogForm({ ...logForm, length: e.target.value })}
                      className="input"
                      placeholder="e.g. 14.5"
                    />
                  </div>

                  <div>
                    <label className="label">Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={logForm.weight}
                      onChange={(e) => setLogForm({ ...logForm, weight: e.target.value })}
                      className="input"
                      placeholder="e.g. 2.3"
                    />
                  </div>

                  <div>
                    <label className="label">Bait/Lure</label>
                    <input
                      type="text"
                      value={logForm.bait}
                      onChange={(e) => setLogForm({ ...logForm, bait: e.target.value })}
                      className="input"
                      placeholder="e.g. Nightcrawler"
                    />
                  </div>

                  <div>
                    <label className="label">Weather</label>
                    <input
                      type="text"
                      value={logForm.weather}
                      onChange={(e) => setLogForm({ ...logForm, weather: e.target.value })}
                      className="input"
                      placeholder="e.g. Sunny, 72°F"
                    />
                  </div>

                  <div>
                    <label className="label">Water Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={logForm.waterTemp}
                      onChange={(e) => setLogForm({ ...logForm, waterTemp: e.target.value })}
                      className="input"
                      placeholder="e.g. 65"
                    />
                  </div>

                  <div>
                    <label className="label">Specific Location</label>
                    <input
                      type="text"
                      value={logForm.location}
                      onChange={(e) => setLogForm({ ...logForm, location: e.target.value })}
                      className="input"
                      placeholder="e.g. North shore, near dock"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label className="label">Notes</label>
                  <textarea
                    value={logForm.notes}
                    onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Add any additional details..."
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label className="label">Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="input"
                  />
                  {logPhotos.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {logPhotos.map((photo, idx) => (
                        <img 
                          key={idx}
                          src={photo} 
                          alt={`Upload ${idx + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={logForm.released}
                      onChange={(e) => setLogForm({ ...logForm, released: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ fontSize: '1rem', color: '#023047' }}>
                      Fish was released (catch & release)
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={handleSubmitLog}
                    className="btn"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      color: 'white'
                    }}
                  >
                    💾 Save Catch
                  </button>
                  <button
                    onClick={() => {
                      setShowLogForm(false);
                      setLogForm({
                        waterBodyId: '',
                        speciesId: '',
                        length: '',
                        weight: '',
                        bait: '',
                        weather: '',
                        waterTemp: '',
                        location: '',
                        notes: '',
                        released: true
                      });
                      setLogPhotos([]);
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {userLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6B7280' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎣</div>
                <h3 style={{ color: '#374151' }}>No Catches Logged Yet</h3>
                <p>Start logging your catches to track your fishing success and earn points!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {userLogs.map(log => {
                  const waterBody = PA_WATER_BODIES.find(w => w.id === log.waterBodyId);
                  const species = PA_FISH_SPECIES.find(s => s.id === log.speciesId);
                  
                  return (
                    <div key={log.id} className="card" style={{ background: '#F9FAFB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <h3>{species?.emoji} {species?.commonName}</h3>
                          <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
                            {waterBody?.name} • {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{
                          background: log.released ? '#ECFDF5' : '#FEF3C7',
                          color: log.released ? '#065F46' : '#92400E',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          height: 'fit-content'
                        }}>
                          {log.released ? '♻️ Released' : '🎣 Kept'}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        {log.length && (
                          <div>
                            <strong style={{ display: 'block', color: '#6B7280', fontSize: '0.85rem' }}>Length</strong>
                            <p style={{ color: '#023047', fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0 0' }}>
                              {log.length}&quot;
                            </p>
                          </div>
                        )}
                        {log.weight && (
                          <div>
                            <strong style={{ display: 'block', color: '#6B7280', fontSize: '0.85rem' }}>Weight</strong>
                            <p style={{ color: '#023047', fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0 0' }}>
                              {log.weight} lbs
                            </p>
                          </div>
                        )}
                        {log.bait && (
                          <div>
                            <strong style={{ display: 'block', color: '#6B7280', fontSize: '0.85rem' }}>Bait</strong>
                            <p style={{ color: '#023047', fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0 0' }}>
                              {log.bait}
                            </p>
                          </div>
                        )}
                        {log.waterTemp && (
                          <div>
                            <strong style={{ display: 'block', color: '#6B7280', fontSize: '0.85rem' }}>Water Temp</strong>
                            <p style={{ color: '#023047', fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0 0' }}>
                              {log.waterTemp}°F
                            </p>
                          </div>
                        )}
                      </div>

                      {log.photos.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
                          {log.photos.map((photo, idx) => (
                            <img 
                              key={idx}
                              src={photo} 
                              alt={`Catch ${idx + 1}`}
                              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                            />
                          ))}
                        </div>
                      )}

                      {log.notes && (
                        <p style={{ color: '#4B5563', fontSize: '0.95rem', fontStyle: 'italic', borderLeft: '3px solid #0077B6', paddingLeft: '1rem' }}>
                          {log.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

