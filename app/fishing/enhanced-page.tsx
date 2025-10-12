// This is a preview of the next-level fishing page
// Will be moved to page.tsx after testing

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PA_WATER_BODIES, getWaterBodiesByRegion, getTroutStreams, getBassLakes } from '@/data/pa-water-bodies';
import { gpsTracker } from '@/utils/gps-tracking';

// Initialize Mapbox
(mapboxgl as any).accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface StockingData {
  id: string;
  waterBodyName: string;
  date: string;
  species: string;
  quantity: number;
}

interface WaterQualityObs {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  isPollution: boolean;
  waterQuality?: {
    ph?: number;
    temperature?: number;
    turbidity?: string;
  };
}

export default function EnhancedFishingPage() {
  const { award } = usePoints();
  
  // State
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWater, setSelectedWater] = useState<typeof PA_WATER_BODIES[0] | null>(null);
  const [stockingData, setStockingData] = useState<StockingData[]>([]);
  const [waterQualityData, setWaterQualityData] = useState<WaterQualityObs[]>([]);
  const [showStocking, setShowStocking] = useState(true);
  const [showWaterQuality, setShowWaterQuality] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [view, setView] = useState<'map' | 'list' | 'guide'>('map');
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Filter water bodies
  const filteredWaters = PA_WATER_BODIES.filter(water => {
    const matchesRegion = selectedRegion === 'all' || water.region === selectedRegion;
    const matchesType = selectedType === 'all' || water.type === selectedType;
    const matchesSearch = water.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         water.county.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesType && matchesSearch;
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-77.8, 40.8], // Center of PA
      zoom: 7
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for filtered waters
    filteredWaters.forEach(water => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        background: ${water.type === 'Stream' ? '#0077B6' : water.type === 'Lake' ? '#06D6A0' : '#FFB703'};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      `;
      
      // Add icon based on type
      const icon = water.type === 'Stream' ? '🎣' : water.type === 'Lake' ? '🏞️' : '🌊';
      el.textContent = icon;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([water.lon, water.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #023047; font-size: 1.1rem;">${water.name}</h3>
              <p style="margin: 4px 0; color: #666; font-size: 0.9rem;">
                <strong>${water.type}</strong> • ${water.county} County
              </p>
              <p style="margin: 8px 0 4px 0; font-size: 0.85rem; color: #333;">
                ${water.habitat.substring(0, 100)}...
              </p>
              <button 
                onclick="document.dispatchEvent(new CustomEvent('selectWater', {detail: '${water.id}'}))"
                style="
                  margin-top: 8px;
                  padding: 6px 12px;
                  background: #0077B6;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 0.85rem;
                  font-weight: 600;
                "
              >
                View Details →
              </button>
            </div>
          `)
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [filteredWaters]);

  // Listen for water selection from map popup
  useEffect(() => {
    const handleSelectWater = ((e: CustomEvent) => {
      const water = PA_WATER_BODIES.find(w => w.id === e.detail);
      if (water) {
        setSelectedWater(water);
        setView('guide');
      }
    }) as EventListener;

    document.addEventListener('selectWater', handleSelectWater);
    return () => document.removeEventListener('selectWater', handleSelectWater);
  }, []);

  // Fetch stocking data
  useEffect(() => {
    const fetchStocking = async () => {
      try {
        const res = await fetch('/api/pfbc-data?type=stocking');
        const { data } = await res.json();
        setStockingData(data || []);
      } catch (error) {
        console.error('Failed to fetch stocking data:', error);
      }
    };
    fetchStocking();
  }, []);

  // Fetch water quality data
  useEffect(() => {
    const fetchWaterQuality = async () => {
      try {
        const res = await fetch('/api/waterreporter');
        const { data } = await res.json();
        setWaterQualityData(data || []);
      } catch (error) {
        console.error('Failed to fetch water quality:', error);
      }
    };
    fetchWaterQuality();
  }, []);

  // GPS tracking
  const toggleTracking = async () => {
    if (isTracking) {
      const track = gpsTracker.stopTracking();
      if (track) {
        gpsTracker.downloadGPX(track);
        award(50, 'GPS Track Completed');
      }
      setIsTracking(false);
    } else {
      try {
        await gpsTracker.startTracking(`Fishing Trip ${new Date().toLocaleDateString()}`);
        setIsTracking(true);
        award(10, 'GPS Tracking Started');
      } catch (error) {
        alert('GPS tracking failed. Please enable location services.');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #023047 0%, #0077B6 100%)',
        color: 'white',
        padding: '2rem 1rem',
        borderRadius: '0 0 24px 24px',
      }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                🎣 PA Fishing Guide
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.95, marginBottom: 0 }}>
                {PA_WATER_BODIES.length} Waters • {stockingData.length} Stocking Events • Real-time Data
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setView('map')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: view === 'map' ? '#FFD60A' : 'rgba(255,255,255,0.2)',
                  color: view === 'map' ? '#023047' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🗺️ Map
              </button>
              <button
                onClick={() => setView('list')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: view === 'list' ? '#FFD60A' : 'rgba(255,255,255,0.2)',
                  color: view === 'list' ? '#023047' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                📋 List
              </button>
              <button
                onClick={() => setView('guide')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: view === 'guide' ? '#FFD60A' : 'rgba(255,255,255,0.2)',
                  color: view === 'guide' ? '#023047' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                📖 Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container" style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
              Search Waters
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or county..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            >
              <option value="all">All Regions</option>
              <option value="Northwest">Northwest</option>
              <option value="Southwest">Southwest</option>
              <option value="Northcentral">Northcentral</option>
              <option value="Southcentral">Southcentral</option>
              <option value="Northeast">Northeast</option>
              <option value="Southeast">Southeast</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
              Water Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            >
              <option value="all">All Types</option>
              <option value="Stream">Streams</option>
              <option value="Lake">Lakes</option>
              <option value="River">Rivers</option>
              <option value="Reservoir">Reservoirs</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
              GPS Tracking
            </label>
            <button
              onClick={toggleTracking}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: isTracking ? '#EF4444' : '#06D6A0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isTracking ? '⏹️ Stop Tracking' : '📍 Start Tracking'}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginTop: '1rem', color: '#6B7280', fontSize: '0.95rem' }}>
          Showing <strong>{filteredWaters.length}</strong> of <strong>{PA_WATER_BODIES.length}</strong> waters
        </div>
      </div>

      {/* Content based on view */}
      {view === 'map' && (
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto 2rem', padding: '0 1rem' }}>
          <div
            ref={mapContainer}
            style={{
              width: '100%',
              height: '600px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          />
          
          {/* Map Legend */}
          <div style={{
            marginTop: '1rem',
            background: 'white',
            padding: '1rem',
            borderRadius: '12px',
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#0077B6' }} />
              <span>Streams ({PA_WATER_BODIES.filter(w => w.type === 'Stream').length})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#06D6A0' }} />
              <span>Lakes ({PA_WATER_BODIES.filter(w => w.type === 'Lake').length + PA_WATER_BODIES.filter(w => w.type === 'Reservoir').length})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FFB703' }} />
              <span>Rivers ({PA_WATER_BODIES.filter(w => w.type === 'River').length})</span>
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto 2rem', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredWaters.map(water => (
              <div
                key={water.id}
                onClick={() => {
                  setSelectedWater(water);
                  setView('guide');
                }}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.5rem' }}>
                      {water.name}
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      {water.type} • {water.county} County • {water.region}
                    </p>
                    <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {water.habitat.substring(0, 200)}...
                    </p>
                    {water.size && (
                      <p style={{ marginTop: '0.5rem', fontWeight: 600, color: '#0077B6' }}>
                        Size: {water.size}
                      </p>
                    )}
                  </div>
                  <div style={{
                    padding: '0.75rem 1.25rem',
                    background: '#FFD60A',
                    borderRadius: '8px',
                    fontWeight: 700,
                    color: '#023047',
                    whiteSpace: 'nowrap',
                  }}>
                    View →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'guide' && selectedWater && (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto 2rem', padding: '0 1rem' }}>
          <button
            onClick={() => setView('list')}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              background: '#E5E7EB',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Back to List
          </button>

          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#023047', marginBottom: '1rem' }}>
              {selectedWater.name}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', background: '#F3F4F6', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.25rem' }}>Type</div>
                <div style={{ fontWeight: 700, color: '#023047' }}>{selectedWater.type}</div>
              </div>
              <div style={{ padding: '1rem', background: '#F3F4F6', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.25rem' }}>County</div>
                <div style={{ fontWeight: 700, color: '#023047' }}>{selectedWater.county}</div>
              </div>
              <div style={{ padding: '1rem', background: '#F3F4F6', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.25rem' }}>Region</div>
                <div style={{ fontWeight: 700, color: '#023047' }}>{selectedWater.region}</div>
              </div>
              {selectedWater.size && (
                <div style={{ padding: '1rem', background: '#F3F4F6', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.25rem' }}>Size</div>
                  <div style={{ fontWeight: 700, color: '#023047' }}>{selectedWater.size}</div>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              Habitat & Description
            </h3>
            <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '2rem' }}>
              {selectedWater.habitat}
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              Regulations
            </h3>
            <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '2rem' }}>
              {selectedWater.regulations}
            </p>

            {selectedWater.bestTime && (
              <>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
                  Best Time to Fish
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {selectedWater.bestTime}
                </p>
              </>
            )}

            {selectedWater.tips && (
              <>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
                  Fishing Tips
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.7 }}>
                  {selectedWater.tips}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

