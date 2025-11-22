'use client';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePoints } from '@/ui/points/PointsProvider';

(mapboxgl as any).accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface WaterReading {
  id: string;
  lat: number;
  lon: number;
  timestamp: number;
  waterTempC?: number;
  airTempC?: number;
  ph?: number;
  dissolvedOxygen?: number;
  turbidity?: string;
  flowRate?: number;
  depth?: number;
  weather?: string;
  habitat?: string;
  notes?: string;
  photos?: string[];
  observer?: string;
}

const WEATHER_OPTIONS = ['☀️ Sunny', '⛅ Partly Cloudy', '☁️ Cloudy', '🌧️ Rainy', '🌨️ Snowy', '🌫️ Foggy'];
const TURBIDITY_OPTIONS = ['Clear', 'Slightly Cloudy', 'Cloudy', 'Murky', 'Opaque'];
const HABITAT_OPTIONS = ['Riffle', 'Pool', 'Run', 'Lake Shore', 'Stream Bank', 'Wetland'];

export default function WaterQualityMap() {
  const { award } = usePoints();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [readings, setReadings] = useState<WaterReading[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReading, setSelectedReading] = useState<WaterReading | null>(null);
  const [newReading, setNewReading] = useState<Partial<WaterReading>>({
    weather: '☀️ Sunny',
    turbidity: 'Clear',
    habitat: 'Riffle'
  });

  // Load readings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wla-map-readings');
      if (saved) setReadings(JSON.parse(saved));
    } catch {}
  }, []);

  // Save readings
  const saveReadings = (updated: WaterReading[]) => {
    setReadings(updated);
    localStorage.setItem('wla-map-readings', JSON.stringify(updated));
  };

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-79.9959, 40.4406], // Pittsburgh, PA
        zoom: 8
      });

      map.current.addControl(new mapboxgl.NavigationControl());
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    (map.current as any)._wlaMarkers?.forEach((m: mapboxgl.Marker) => m.remove());

    const markers: mapboxgl.Marker[] = [];
    readings.forEach((reading) => {
      // Color code by water quality
      const qualityColor = getQualityColor(reading);
      
      const el = document.createElement('div');
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.background = qualityColor;
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([reading.lon, reading.lat])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedReading(reading);
        setShowForm(false);
      });

      markers.push(marker);
    });

    (map.current as any)._wlaMarkers = markers;
  }, [readings]);

  const getQualityColor = (reading: WaterReading): string => {
    // Simple quality assessment based on DO and pH
    const hasGoodDO = reading.dissolvedOxygen ? reading.dissolvedOxygen >= 7 : true;
    const hasGoodPH = reading.ph ? (reading.ph >= 6.5 && reading.ph <= 8.5) : true;
    
    if (hasGoodDO && hasGoodPH) return '#06D6A0'; // Green - Good
    if (!hasGoodDO || !hasGoodPH) return '#FFB703'; // Yellow - Fair
    return '#DC2626'; // Red - Poor
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewReading({
          ...newReading,
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        map.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15
        });
      });
    }
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
    setNewReading({
      ...newReading,
      photos: [...(newReading.photos || []), ...photos]
    });
  };

  const addReading = () => {
    if (!newReading.lat || !newReading.lon) {
      alert('Please add location (use GPS button)');
      return;
    }

    const reading: WaterReading = {
      id: `reading-${Date.now()}`,
      lat: newReading.lat,
      lon: newReading.lon,
      timestamp: Date.now(),
      waterTempC: newReading.waterTempC,
      airTempC: newReading.airTempC,
      ph: newReading.ph,
      dissolvedOxygen: newReading.dissolvedOxygen,
      turbidity: newReading.turbidity,
      flowRate: newReading.flowRate,
      depth: newReading.depth,
      weather: newReading.weather,
      habitat: newReading.habitat,
      notes: newReading.notes,
      photos: newReading.photos,
      observer: newReading.observer
    };

    saveReadings([...readings, reading]);
    
    // Award points
    let points = 10; // Base
    if (reading.dissolvedOxygen) points += 5;
    if (reading.ph) points += 5;
    if (reading.photos && reading.photos.length > 0) points += 5;
    
    award(points, 'Water Quality Reading');

    // Reset form
    setNewReading({ weather: '☀️ Sunny', turbidity: 'Clear', habitat: 'Riffle' });
    setShowForm(false);
    alert(`Reading saved! +${points} points`);
  };

  const deleteReading = (id: string) => {
    if (confirm('Delete this reading?')) {
      saveReadings(readings.filter(r => r.id !== id));
      setSelectedReading(null);
    }
  };

  const exportCSV = () => {
    let csv = 'Date,Time,Latitude,Longitude,Water Temp (C),Air Temp (C),pH,Dissolved Oxygen (mg/L),Turbidity,Flow Rate,Depth (cm),Weather,Habitat,Observer,Notes\n';
    readings.forEach(r => {
      const date = new Date(r.timestamp);
      csv += [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        r.lat.toFixed(6),
        r.lon.toFixed(6),
        r.waterTempC || '',
        r.airTempC || '',
        r.ph || '',
        r.dissolvedOxygen || '',
        r.turbidity || '',
        r.flowRate || '',
        r.depth || '',
        r.weather || '',
        r.habitat || '',
        r.observer || '',
        `"${(r.notes || '').replace(/"/g, '""')}"`
      ].join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wla-water-quality-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0077B6, #023047)',
        color: 'white',
        padding: '3rem 1.5rem',
        marginBottom: '2rem',
        borderRadius: '16px'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          🗺️ Watershed Water Quality
        </h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Monitor stream health across Pennsylvania with scientific measurements and photo documentation
        </p>
      </section>

      {/* Stats */}
      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #06D6A0, #059669)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{readings.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Total Readings</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #0077B6, #023047)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>
            {readings.filter(r => r.dissolvedOxygen && r.dissolvedOxygen >= 7).length}
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Good Quality Sites</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #FFB703, #FB8500)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>
            {readings.filter(r => r.photos && r.photos.length > 0).length}
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>With Photos</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="row" style={{ alignItems: 'start' }}>
        {/* Map */}
        <div className="card section" style={{ flex: '2 1 600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Pennsylvania Streams</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowForm(!showForm)} className="btn-success">
                ➕ New Reading
              </button>
              <button onClick={exportCSV} className="btn-outline" disabled={readings.length === 0}>
                📥 Export CSV
              </button>
            </div>
          </div>
          
          <div 
            ref={mapContainer} 
            style={{ 
              width: '100%', 
              height: '500px', 
              borderRadius: '12px', 
              overflow: 'hidden',
              border: '2px solid #E5E7EB'
            }} 
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#F8F9FA', borderRadius: '8px', fontSize: '0.9rem' }}>
            <strong>Legend:</strong> 
            <span style={{ marginLeft: '1rem' }}>🟢 Good Quality</span>
            <span style={{ marginLeft: '1rem' }}>🟡 Fair Quality</span>
            <span style={{ marginLeft: '1rem' }}>🔴 Poor Quality</span>
          </div>
        </div>

        {/* Form or Details */}
        <div style={{ flex: '1 1 400px' }}>
          {showForm ? (
            <div className="card section">
              <h3>New Water Quality Reading</h3>
              
              <button onClick={getCurrentLocation} className="btn-outline" style={{ width: '100%', marginBottom: '1rem' }}>
                📍 Get GPS Location
              </button>
              
              {newReading.lat && newReading.lon && (
                <div style={{ padding: '0.75rem', background: '#D1FAE5', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', color: '#065F46' }}>
                  ✓ Location: {newReading.lat.toFixed(6)}, {newReading.lon.toFixed(6)}
                </div>
              )}

              <div style={{ display: 'grid', gap: '1rem' }}>
                <label style={{ margin: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Water Temp (°C):</span>
                  <input
                    type="number"
                    step="0.1"
                    value={newReading.waterTempC || ''}
                    onChange={(e) => setNewReading({...newReading, waterTempC: parseFloat(e.target.value)})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                  />
                </label>

                <label style={{ margin: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>pH:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={newReading.ph || ''}
                    onChange={(e) => setNewReading({...newReading, ph: parseFloat(e.target.value)})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                  />
                </label>

                <label style={{ margin: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Dissolved Oxygen (mg/L):</span>
                  <input
                    type="number"
                    step="0.1"
                    value={newReading.dissolvedOxygen || ''}
                    onChange={(e) => setNewReading({...newReading, dissolvedOxygen: parseFloat(e.target.value)})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                  />
                </label>

                <label style={{ margin: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Turbidity:</span>
                  <select
                    value={newReading.turbidity}
                    onChange={(e) => setNewReading({...newReading, turbidity: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                  >
                    {TURBIDITY_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </label>

                <label style={{ margin: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Habitat Type:</span>
                  <select
                    value={newReading.habitat}
                    onChange={(e) => setNewReading({...newReading, habitat: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                  >
                    {HABITAT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </label>

                <label style={{ margin: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Weather:</span>
                  <select
                    value={newReading.weather}
                    onChange={(e) => setNewReading({...newReading, weather: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                  >
                    {WEATHER_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
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

                {newReading.photos && newReading.photos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {newReading.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '100%',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                      height: '140px',
                    }}
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
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Observer Name:</span>
                  <input
                    type="text"
                    value={newReading.observer || ''}
                    onChange={(e) => setNewReading({...newReading, observer: e.target.value})}
                    placeholder="Your name"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
                  />
                </label>

                <label style={{ margin: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Notes:</span>
                  <textarea
                    value={newReading.notes || ''}
                    onChange={(e) => setNewReading({...newReading, notes: e.target.value})}
                    placeholder="Observations, stream conditions, etc."
                    style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB', fontFamily: 'inherit' }}
                  />
                </label>

                <button onClick={addReading} className="btn-success" style={{ width: '100%', padding: '1rem' }}>
                  💾 Save Reading
                </button>
              </div>
            </div>
          ) : selectedReading ? (
            <div className="card section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Reading Details</h3>
                <button onClick={() => deleteReading(selectedReading.id)} style={{
                  padding: '0.5rem 1rem',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  🗑️
                </button>
              </div>

              <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
                <div><strong>Date:</strong> {new Date(selectedReading.timestamp).toLocaleString()}</div>
                <div><strong>Location:</strong> {selectedReading.lat.toFixed(6)}, {selectedReading.lon.toFixed(6)}</div>
                {selectedReading.waterTempC && <div><strong>Water Temp:</strong> {selectedReading.waterTempC}°C</div>}
                {selectedReading.ph && <div><strong>pH:</strong> {selectedReading.ph}</div>}
                {selectedReading.dissolvedOxygen && <div><strong>DO:</strong> {selectedReading.dissolvedOxygen} mg/L</div>}
                {selectedReading.turbidity && <div><strong>Turbidity:</strong> {selectedReading.turbidity}</div>}
                {selectedReading.habitat && <div><strong>Habitat:</strong> {selectedReading.habitat}</div>}
                {selectedReading.weather && <div><strong>Weather:</strong> {selectedReading.weather}</div>}
                {selectedReading.observer && <div><strong>Observer:</strong> {selectedReading.observer}</div>}
                {selectedReading.notes && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#F8F9FA', borderRadius: '6px' }}>
                    <strong>Notes:</strong>
                    <div>{selectedReading.notes}</div>
                  </div>
                )}
              </div>

              {selectedReading.photos && selectedReading.photos.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Photos:</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    {selectedReading.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        style={{ width: '100%', borderRadius: '6px', overflow: 'hidden', position: 'relative', height: '160px' }}
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
                </div>
              )}

              <button onClick={() => setSelectedReading(null)} className="btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                ← Back to Map
              </button>
            </div>
          ) : (
            <div className="card section" style={{ textAlign: 'center', padding: '3rem 2rem', color: '#6B7280' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
              <p>Click a marker on the map to view details or add a new reading</p>
            </div>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="card section" style={{ background: '#F8F9FA', marginTop: '2rem' }}>
        <h3>📚 Water Quality Resources</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <a href="https://www.dep.pa.gov/Business/Water/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textAlign: 'left' }}>
            <div><strong>PA DEP Water Quality</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>State monitoring data</div>
          </a>
          <a href="https://www.allianceforaquaticmonitoring.org/" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textAlign: 'left' }}>
            <div><strong>Alliance for Aquatic Resource Monitoring</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Volunteer monitoring</div>
          </a>
          <a href="https://www.inaturalist.org" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textAlign: 'left' }}>
            <div><strong>iNaturalist</strong></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Upload observations</div>
          </a>
        </div>
      </div>
    </div>
  );
}
