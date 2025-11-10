'use client';

interface FieldSite {
  id: string;
  name: string;
  description: string;
  site_type: string;
  address: string;
  city: string;
  state: string;
  distance_meters?: number;
  species_likely?: string[];
  habitat_type?: string;
}

interface NearbySitesListProps {
  sites: FieldSite[];
  onSiteSelect: (site: FieldSite) => void;
  detailed?: boolean;
}

const SITE_TYPE_ICONS: Record<string, string> = {
  library: '📚',
  park: '🌲',
  state_park: '🏞️',
  university: '🎓',
  sports: '⚽',
  greenway: '🚶',
  landmark: '🏛️',
};

const SITE_TYPE_COLORS: Record<string, string> = {
  library: 'bg-blue-100 text-blue-800 border-blue-200',
  park: 'bg-green-100 text-green-800 border-green-200',
  state_park: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  university: 'bg-purple-100 text-purple-800 border-purple-200',
  sports: 'bg-orange-100 text-orange-800 border-orange-200',
  greenway: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  landmark: 'bg-pink-100 text-pink-800 border-pink-200',
};

function formatDistance(meters: number | undefined): string {
  if (!meters) return '';
  
  if (meters < 1000) {
    return `${Math.round(meters)}m away`;
  }
  return `${(meters / 1000).toFixed(1)}km away`;
}

export default function NearbySitesList({
  sites,
  onSiteSelect,
  detailed = false,
}: NearbySitesListProps) {
  if (sites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No sites found</h3>
        <p className="text-sm text-gray-600">
          Try adjusting your filters or increasing the search radius
        </p>
      </div>
    );
  }

  return (
    <div className={detailed ? 'space-y-0' : 'space-y-3'}>
      {sites.map((site) => (
        <div
          key={site.id}
          onClick={() => onSiteSelect(site)}
          className={`cursor-pointer transition-all hover:shadow-md ${
            detailed
              ? 'border-b border-gray-200 p-4 hover:bg-gray-50'
              : 'bg-white rounded-lg p-4 border border-gray-200 hover:border-green-500'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              {SITE_TYPE_ICONS[site.site_type] || '📍'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {site.name}
                </h3>
                {site.distance_meters !== undefined && (
                  <span className="flex-shrink-0 text-xs font-medium text-green-600">
                    {formatDistance(site.distance_meters)}
                  </span>
                )}
              </div>

              {/* Site Type Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${
                    SITE_TYPE_COLORS[site.site_type] || 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}
                >
                  {site.site_type.replace('_', ' ')}
                </span>
                {site.habitat_type?.includes('Trout') && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-200">
                    🎣 Trout Water
                  </span>
                )}
              </div>

              {/* Location */}
              <p className="text-xs text-gray-600 mb-1">
                {site.address && `${site.address}, `}
                {site.city}, {site.state}
              </p>

              {/* Description (detailed view only) */}
              {detailed && site.description && (
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{site.description}</p>
              )}

              {/* Species (detailed view only) */}
              {detailed && site.species_likely && site.species_likely.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {site.species_likely.slice(0, 3).map((species, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                    >
                      {species}
                    </span>
                  ))}
                  {site.species_likely.length > 3 && (
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      +{site.species_likely.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Arrow */}
            {!detailed && (
              <div className="flex-shrink-0 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Show More (for non-detailed view with many sites) */}
      {!detailed && sites.length >= 10 && (
        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Showing first 10 sites. Switch to list view to see all {sites.length} sites.
          </p>
        </div>
      )}
    </div>
  );
}

