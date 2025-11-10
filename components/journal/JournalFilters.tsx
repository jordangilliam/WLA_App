'use client';

interface JournalFiltersProps {
  filters: {
    dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
    species: string;
    fieldSite: string;
    verified: 'all' | 'verified' | 'unverified';
    sortBy: 'date-desc' | 'date-asc' | 'site';
  };
  onFiltersChange: (filters: any) => void;
  availableSpecies: string[];
  availableFieldSites: { id: string; name: string }[];
  resultCount: number;
}

export default function JournalFilters({
  filters,
  onFiltersChange,
  availableSpecies,
  availableFieldSites,
  resultCount,
}: JournalFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: 'all',
      species: '',
      fieldSite: '',
      verified: 'all',
      sortBy: 'date-desc',
    });
  };

  const hasActiveFilters =
    filters.dateRange !== 'all' ||
    filters.species !== '' ||
    filters.fieldSite !== '' ||
    filters.verified !== 'all';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[
            { value: 'all', label: 'All Time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'custom', label: 'Custom' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('dateRange', option.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filters.dateRange === option.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Species Filter */}
      {availableSpecies.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Species
          </label>
          <select
            value={filters.species}
            onChange={(e) => handleFilterChange('species', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Species</option>
            {availableSpecies.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Field Site Filter */}
      {availableFieldSites.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field Site
          </label>
          <select
            value={filters.fieldSite}
            onChange={(e) => handleFilterChange('fieldSite', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Sites</option>
            {availableFieldSites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Verification Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'verified', label: '✓ Verified' },
            { value: 'unverified', label: 'Pending' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('verified', option.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filters.verified === option.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="site">By Site</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{resultCount}</span>{' '}
          observation{resultCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

