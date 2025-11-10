'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ObservationEntry from '@/components/journal/ObservationEntry';
import JournalFilters from '@/components/journal/JournalFilters';

interface Observation {
  id: string;
  created_at: string;
  field_site_id?: string;
  field_site_name?: string;
  notes: string;
  weather?: string;
  temperature?: number;
  species_observed?: string[];
  photos?: string[];
  verified?: boolean;
  teacher_feedback?: string;
}

export default function JournalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [observations, setObservations] = useState<Observation[]>([]);
  const [filteredObservations, setFilteredObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list');
  
  const [filters, setFilters] = useState({
    dateRange: 'all',
    species: '',
    fieldSite: '',
    verified: 'all',
    sortBy: 'date-desc',
  });

  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [availableFieldSites, setAvailableFieldSites] = useState<{ id: string; name: string }[]>([]);

  // Check if redirected from check-in with addObservation parameter
  const addObservation = searchParams.get('addObservation');

  // Redirect to auth if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?callbackUrl=/journal-new');
    }
  }, [status, router]);

  // Fetch observations
  useEffect(() => {
    if (status === 'authenticated') {
      fetchObservations();
    }
  }, [status]);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [observations, filters]);

  const fetchObservations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/observations');

      if (!response.ok) {
        throw new Error('Failed to fetch observations');
      }

      const data = await response.json();
      setObservations(data.observations || []);

      // Extract unique species and field sites
      const speciesSet = new Set<string>();
      const sitesMap = new Map<string, string>();

      (data.observations || []).forEach((obs: Observation) => {
        if (obs.species_observed) {
          obs.species_observed.forEach((s) => speciesSet.add(s));
        }
        if (obs.field_site_id && obs.field_site_name) {
          sitesMap.set(obs.field_site_id, obs.field_site_name);
        }
      });

      setAvailableSpecies(Array.from(speciesSet).sort());
      setAvailableFieldSites(
        Array.from(sitesMap.entries()).map(([id, name]) => ({ id, name }))
      );
    } catch (error) {
      console.error('Error fetching observations:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...observations];

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((obs) => {
        const obsDate = new Date(obs.created_at);
        switch (filters.dateRange) {
          case 'today':
            return obsDate >= today;
          case 'week':
            return obsDate >= weekAgo;
          case 'month':
            return obsDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Species filter
    if (filters.species) {
      filtered = filtered.filter(
        (obs) =>
          obs.species_observed && obs.species_observed.includes(filters.species)
      );
    }

    // Field site filter
    if (filters.fieldSite) {
      filtered = filtered.filter((obs) => obs.field_site_id === filters.fieldSite);
    }

    // Verification filter
    if (filters.verified !== 'all') {
      filtered = filtered.filter((obs) =>
        filters.verified === 'verified' ? obs.verified === true : !obs.verified
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (filters.sortBy === 'date-desc') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (filters.sortBy === 'date-asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (filters.sortBy === 'site') {
        return (a.field_site_name || '').localeCompare(b.field_site_name || '');
      }
      return 0;
    });

    setFilteredObservations(filtered);
  };

  const handleExportCSV = () => {
    // Convert observations to CSV
    const headers = [
      'Date',
      'Time',
      'Field Site',
      'Weather',
      'Temperature (°F)',
      'Species Observed',
      'Notes',
      'Verified',
      'Teacher Feedback',
    ];

    const rows = filteredObservations.map((obs) => {
      const date = new Date(obs.created_at);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        obs.field_site_name || '',
        obs.weather || '',
        obs.temperature?.toString() || '',
        (obs.species_observed || []).join('; '),
        (obs.notes || '').replace(/"/g, '""'),
        obs.verified ? 'Yes' : 'No',
        (obs.teacher_feedback || '').replace(/"/g, '""'),
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `observations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this observation? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/observations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete observation');
      }

      // Remove from state
      setObservations((prev) => prev.filter((obs) => obs.id !== id));
    } catch (error) {
      console.error('Error deleting observation:', error);
      alert('Failed to delete observation. Please try again.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Journal</h1>
              <p className="mt-1 text-sm text-gray-600">
                {filteredObservations.length} observation
                {filteredObservations.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex gap-2">
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
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📱 Compact
                </button>
              </div>

              {/* Export Button */}
              {filteredObservations.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  📥 Export CSV
                </button>
              )}

              {/* Add Observation (links to explore) */}
              <button
                onClick={() => router.push('/explore')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-colors"
              >
                + New Observation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JournalFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableSpecies={availableSpecies}
              availableFieldSites={availableFieldSites}
              resultCount={filteredObservations.length}
            />
          </div>

          {/* Observations List */}
          <div className="lg:col-span-3">
            {filteredObservations.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Observations Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start exploring field sites and record your observations!
                </p>
                <button
                  onClick={() => router.push('/explore')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Find Field Sites
                </button>
              </div>
            ) : (
              <div className={viewMode === 'list' ? 'space-y-6' : 'space-y-3'}>
                {filteredObservations.map((observation) => (
                  <ObservationEntry
                    key={observation.id}
                    observation={observation}
                    onDelete={handleDelete}
                    compact={viewMode === 'compact'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

