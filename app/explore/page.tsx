'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import InteractiveMap, { MapFieldSite } from '@/components/map/InteractiveMap';
import SiteFilters from '@/components/map/SiteFilters';
import NearbySitesList from '@/components/map/NearbySitesList';
import CheckInButton from '@/components/map/CheckInButton';
import { useGeolocation } from '@/lib/hooks/useGeolocation';

type FieldSite = MapFieldSite & {
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  ecological_notes?: string;
  species_likely?: string[];
  habitat_type?: string;
};

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { location, error: locationError, isLoading: locationLoading } = useGeolocation();
  
  const [sites, setSites] = useState<FieldSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<FieldSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<FieldSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    siteType: 'all',
    maxDistance: 50000, // 50km default
    searchQuery: '',
  });
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const fetchNearbySites = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/locations/nearby?lat=${lat}&lng=${lng}&radius=${filters.maxDistance}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sites');
      }

      const data = await response.json();
      setSites(data.sites || []);
    } catch (error) {
      console.error('Error fetching nearby sites:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.maxDistance]);

  const applyFilters = useCallback(() => {
    let filtered = [...sites];

    // Filter by site type
    if (filters.siteType !== 'all') {
      filtered = filtered.filter((site) => site.site_type === filters.siteType);
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(query) ||
          site.city?.toLowerCase().includes(query) ||
          site.description?.toLowerCase().includes(query)
      );
    }

    // Filter by distance
    filtered = filtered.filter(
      (site) => !site.distance_meters || site.distance_meters <= filters.maxDistance
    );

    // Sort by distance
    filtered.sort((a, b) => {
      if (!a.distance_meters) return 1;
      if (!b.distance_meters) return -1;
      return a.distance_meters - b.distance_meters;
    });

    setFilteredSites(filtered);
  }, [sites, filters]);

  // Fetch nearby sites when location changes
  useEffect(() => {
    if (location) {
      fetchNearbySites(location.latitude, location.longitude);
    }
  }, [location, fetchNearbySites]);

  // Apply filters when sites or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSiteSelect = (site: FieldSite) => {
    setSelectedSite(site);
  };

  const handleCheckInSuccess = () => {
    // Refresh sites to update visit status
    if (location) {
      fetchNearbySites(location.latitude, location.longitude);
    }
  };

  // Redirect to auth if not logged in
  if (status === 'unauthenticated') {
    router.push('/auth?callbackUrl=/explore');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Explore Field Sites
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {location
                  ? `${filteredSites.length} sites near you`
                  : 'Enable location to find nearby sites'}
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🗺️ Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <SiteFilters
            filters={filters}
            onFiltersChange={setFilters}
            siteCount={filteredSites.length}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {locationError && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800">Location Access Needed</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {locationError}. Please enable location services to see nearby field sites and
                  check in.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Finding field sites near you...</p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
                    <InteractiveMap
                      sites={filteredSites}
                      userLocation={location}
                      selectedSite={selectedSite}
                      onSiteSelect={handleSiteSelect}
                    />
                  </div>
                </div>

                {/* Sidebar - Takes 1 column */}
                <div className="lg:col-span-1">
                  {selectedSite ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                      <button
                        onClick={() => setSelectedSite(null)}
                        className="text-gray-500 hover:text-gray-700 mb-4"
                      >
                        ← Back to list
                      </button>

                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedSite.name}
                      </h2>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          {selectedSite.site_type}
                        </span>
                        {selectedSite.distance_meters && (
                          <span className="text-sm text-gray-600">
                            {(selectedSite.distance_meters / 1000).toFixed(1)} km away
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">{selectedSite.description}</p>

                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">📍 Location</h3>
                        <p className="text-sm text-gray-600">
                          {selectedSite.address}
                          <br />
                          {selectedSite.city}, {selectedSite.state}
                        </p>
                      </div>

                      {selectedSite.ecological_notes && (
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-900 mb-2">🌿 Ecology</h3>
                          <p className="text-sm text-gray-600">{selectedSite.ecological_notes}</p>
                        </div>
                      )}

                      {selectedSite.species_likely && selectedSite.species_likely.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-900 mb-2">🦅 Species to Look For</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedSite.species_likely.slice(0, 5).map((species, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                              >
                                {species}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <CheckInButton
                        site={selectedSite}
                        userLocation={location}
                        onSuccess={handleCheckInSuccess}
                      />

                      <button
                        onClick={() => router.push(`/sites/${selectedSite.id}`)}
                        className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        View Full Details →
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Nearby Sites ({filteredSites.length})
                      </h3>
                      <NearbySitesList
                        sites={filteredSites.slice(0, 10)}
                        onSiteSelect={handleSiteSelect}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* List View */
              <div className="bg-white rounded-lg shadow-lg">
                <NearbySitesList
                  sites={filteredSites}
                  onSiteSelect={(site) => {
                    setSelectedSite(site);
                    setViewMode('map');
                  }}
                  detailed
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats Footer */}
      {location && !loading && (
        <div className="bg-white border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{sites.length}</div>
                <div className="text-sm text-gray-600">Sites Near You</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {sites.filter((s) => s.site_type === 'library').length}
                </div>
                <div className="text-sm text-gray-600">Libraries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {sites.filter((s) => s.site_type === 'park' || s.site_type === 'state_park').length}
                </div>
                <div className="text-sm text-gray-600">Parks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {sites.filter((s) => s.habitat_type?.includes('Trout')).length}
                </div>
                <div className="text-sm text-gray-600">Trout Waters</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

