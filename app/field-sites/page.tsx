'use client';

import { useEffect, useState } from 'react';
import InteractiveMap from '@/components/map/InteractiveMap';
import CheckInButton from '@/components/map/CheckInButton';

interface FieldSite {
  id: string;
  name: string;
  description: string;
  site_type: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  ecological_notes?: string;
  species_commonly_found?: string[];
  habitat_types?: string[];
  distance_meters?: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

// Site type display names
const SITE_TYPE_NAMES: Record<string, string> = {
  library: 'Library',
  park: 'Park',
  state_park: 'State Park',
  university: 'University',
  sports: 'Sports Venue',
  greenway: 'Greenway/Trail',
  landmark: 'Landmark',
  trout_water: 'Trout Water',
  museum: 'Museum',
};

export default function FieldSitesPage() {
  const [sites, setSites] = useState<FieldSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<FieldSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<FieldSite | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Page container styles for desktop
  const pageStyles = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  // Fetch field sites
  useEffect(() => {
    async function fetchSites() {
      try {
        const url = userLocation
          ? `/api/field-sites?lat=${userLocation.latitude}&lng=${userLocation.longitude}&radius=100000`
          : '/api/field-sites';

        const response = await fetch(url);
        const data = await response.json();

        if (data.sites) {
          setSites(data.sites);
          setFilteredSites(data.sites);
        }
      } catch (error) {
        console.error('Error fetching field sites:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, [userLocation]);

  // Filter sites
  useEffect(() => {
    let filtered = sites;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((site) => site.site_type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(query) ||
          site.city?.toLowerCase().includes(query) ||
          site.description?.toLowerCase().includes(query)
      );
    }

    setFilteredSites(filtered);
  }, [sites, filterType, searchQuery]);

  // Get unique site types
  const siteTypes = Array.from(new Set(sites.map((s) => s.site_type))).sort();

  return (
    <div style={pageStyles}>
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: 'white',
          padding: '3rem 1.5rem',
          marginBottom: '2rem',
          borderRadius: '16px',
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          🗺️ Field Sites Explorer
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto',
            opacity: 0.95,
          }}
        >
          Discover 130+ field sites across Pennsylvania - libraries, parks, universities, trout streams, and
          more!
        </p>
      </section>

      {/* Stats */}
      <div className="row" style={{ marginBottom: '2rem', gap: '1rem' }}>
        <div
          className="card section"
          style={{
            flex: 1,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
          }}
        >
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{sites.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Total Sites</p>
        </div>
        <div
          className="card section"
          style={{
            flex: 1,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: 'white',
          }}
        >
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{siteTypes.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Site Types</p>
        </div>
        <div
          className="card section"
          style={{
            flex: 1,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            color: 'white',
          }}
        >
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>
            {filteredSites.length}
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Visible Sites</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              placeholder="🔍 Search sites by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '0.75rem 1rem' }}
            >
              All Sites
            </button>
            {siteTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={filterType === type ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '0.75rem 1rem' }}
              >
                {SITE_TYPE_NAMES[type] || type} ({sites.filter((s) => s.site_type === type).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        {/* Map */}
        <div className="card section" style={{ 
          flex: '2 1 700px',
          minWidth: '0', // Important for flex shrinking
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Interactive Map</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p>Loading field sites...</p>
            </div>
          ) : (
            <div style={{ 
              height: '700px', 
              width: '100%',
              borderRadius: '12px', 
              overflow: 'hidden',
              position: 'relative'
            }}>
              <InteractiveMap
                sites={filteredSites}
                userLocation={userLocation}
                selectedSite={selectedSite}
                onSiteSelect={setSelectedSite}
              />
            </div>
          )}
        </div>

        {/* Site Details */}
        <div style={{ 
          flex: '1 1 400px',
          minWidth: '320px',
          maxWidth: '500px'
        }}>
          {selectedSite ? (
            <div className="card section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                    {SITE_TYPE_NAMES[selectedSite.site_type] || selectedSite.site_type}
                  </div>
                  <h3 style={{ margin: 0 }}>{selectedSite.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedSite(null)}
                  style={{
                    padding: '0.5rem',
                    background: '#F3F4F6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              {selectedSite.distance_meters !== undefined && (
                <div
                  style={{
                    padding: '0.75rem',
                    background: '#EFF6FF',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    color: '#1E40AF',
                  }}
                >
                  📍 {(selectedSite.distance_meters / 1000).toFixed(1)} km away
                </div>
              )}

              <p style={{ color: '#4B5563', lineHeight: 1.6 }}>{selectedSite.description}</p>

              {selectedSite.address && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#F9FAFB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                    📍 {selectedSite.address}
                    {selectedSite.city && `, ${selectedSite.city}`}
                    {selectedSite.state && `, ${selectedSite.state}`}
                  </div>
                </div>
              )}

              {selectedSite.habitat_types && selectedSite.habitat_types.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Habitat Types:</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedSite.habitat_types.map((habitat, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#DBEAFE',
                          color: '#1E40AF',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                        }}
                      >
                        {habitat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSite.species_commonly_found && selectedSite.species_commonly_found.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Species Commonly Found:</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedSite.species_commonly_found.map((species, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#D1FAE5',
                          color: '#065F46',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                        }}
                      >
                        {species}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSite.ecological_notes && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#F0FDF4', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#065F46' }}>
                    Ecological Notes:
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#047857', lineHeight: 1.6 }}>
                    {selectedSite.ecological_notes}
                  </p>
                </div>
              )}

              {/* Check-in button */}
              <div style={{ marginTop: '1.5rem' }}>
                <CheckInButton
                  site={selectedSite}
                  userLocation={userLocation}
                  onCheckInSuccess={() => {
                    alert('Check-in successful! Points awarded!');
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              className="card section"
              style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6B7280' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
              <h3 style={{ color: '#4B5563' }}>Select a Site</h3>
              <p>Click on a marker on the map to view site details and check in</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

