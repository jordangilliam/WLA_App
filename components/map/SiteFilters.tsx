'use client';

import { useState } from 'react';

interface SiteFiltersProps {
  filters: {
    siteType: string;
    maxDistance: number;
    searchQuery: string;
  };
  onFiltersChange: (filters: any) => void;
  siteCount: number;
}

const SITE_TYPES = [
  { value: 'all', label: 'All Types', icon: '📍' },
  { value: 'library', label: 'Libraries', icon: '📚' },
  { value: 'park', label: 'Parks', icon: '🌲' },
  { value: 'state_park', label: 'State Parks', icon: '🏞️' },
  { value: 'university', label: 'Universities', icon: '🎓' },
  { value: 'sports', label: 'Sports & Recreation', icon: '⚽' },
  { value: 'greenway', label: 'Trails & Greenways', icon: '🚶' },
  { value: 'landmark', label: 'Landmarks', icon: '🏛️' },
];

const DISTANCE_OPTIONS = [
  { value: 5000, label: '5 km' },
  { value: 10000, label: '10 km' },
  { value: 25000, label: '25 km' },
  { value: 50000, label: '50 km' },
  { value: 100000, label: '100 km' },
];

export default function SiteFilters({ filters, onFiltersChange, siteCount }: SiteFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      siteType: 'all',
      maxDistance: 50000,
      searchQuery: '',
    });
  };

  const hasActiveFilters = filters.siteType !== 'all' || filters.searchQuery !== '';

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search sites by name or city..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        {filters.searchQuery && (
          <button
            onClick={() => handleFilterChange('searchQuery', '')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {SITE_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => handleFilterChange('siteType', type.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              filters.siteType === type.value
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>{type.icon}</span>
            <span className="text-sm">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <span>{showAdvanced ? '▼' : '▶'}</span>
          <span>Advanced Filters</span>
        </button>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          )}
          <span className="text-sm font-medium text-gray-700">
            {siteCount} site{siteCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          {/* Distance Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Distance
            </label>
            <div className="grid grid-cols-5 gap-2">
              {DISTANCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('maxDistance', option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.maxDistance === option.value
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Currently showing sites within {(filters.maxDistance / 1000).toFixed(0)} kilometers
            </div>
          </div>

          {/* Additional Filters (Future) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled
                />
                <span>Wheelchair Accessible</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled
                />
                <span>Parking Available</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled
                />
                <span>Restrooms On-Site</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled
                />
                <span>Recently Stocked</span>
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic">
            Additional filters coming soon after water_body_details integration
          </p>
        </div>
      )}
    </div>
  );
}

