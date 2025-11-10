'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SiteDetail {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  site_type: string;
  description: string;
  ecology_notes?: string;
  access_info?: string;
  regulations?: string;
  safety_notes?: string;
}

interface WaterBody {
  stream_name?: string;
  stream_type?: string;
  water_quality?: string;
  habitat_features?: string[];
  species_present?: string[];
}

interface StockingEvent {
  id: string;
  stocking_date: string;
  species: string;
  quantity: number;
  size_range: string;
  status: string;
}

export default function StockingSiteDetailPage({ params }: { params: { siteId: string } }) {
  const router = useRouter();
  const [site, setSite] = useState<SiteDetail | null>(null);
  const [waterBody, setWaterBody] = useState<WaterBody | null>(null);
  const [nextStocking, setNextStocking] = useState<any>(null);
  const [allStockings, setAllStockings] = useState<StockingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteDetail();
  }, [params.siteId]);

  const fetchSiteDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stocking/site/${params.siteId}`);

      if (response.ok) {
        const data = await response.json();
        setSite(data.site);
        setWaterBody(data.waterBody);
        setNextStocking(data.nextStocking);
        setAllStockings(data.allStockings || []);
      } else {
        console.error('Failed to fetch site details');
      }
    } catch (error) {
      console.error('Error fetching site details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site details...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎣</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Site Not Found</h2>
          <p className="text-gray-600 mb-6">The requested stocking site could not be found.</p>
          <Link
            href="/stocking"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Calendar
          </Link>
        </div>
      </div>
    );
  }

  const upcomingStockings = allStockings.filter(
    (s) => new Date(s.stocking_date) >= new Date() && s.status === 'scheduled'
  );

  const pastStockings = allStockings.filter(
    (s) => new Date(s.stocking_date) < new Date() || s.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <Link
            href="/stocking"
            className="text-blue-100 hover:text-white mb-4 inline-flex items-center gap-2"
          >
            ← Back to Calendar
          </Link>
          <h1 className="text-4xl font-bold mb-2">{site.name}</h1>
          <p className="text-blue-100">
            {site.site_type === 'trout_stream' ? '🌊 Trout Stream' : '🏞️ Lake / Reservoir'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Next Stocking Banner */}
        {nextStocking && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">🎣 Next Stocking</h3>
                <p className="text-2xl font-bold mb-1">
                  {new Date(nextStocking.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span>🐟 {nextStocking.species}</span>
                  <span>📊 {nextStocking.quantity.toLocaleString()} fish</span>
                  <span>📏 {nextStocking.sizeRange}</span>
                </div>
              </div>
              <button
                onClick={() => alert('Notification feature coming soon!')}
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-green-50 transition-colors"
              >
                🔔 Notify Me
              </button>
            </div>
          </div>
        )}

        {/* Site Info */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">📍 Site Information</h2>
          </div>
          <div className="p-6 space-y-4">
            {site.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{site.description}</p>
              </div>
            )}

            {site.access_info && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🚗 Access</h3>
                <p className="text-gray-700">{site.access_info}</p>
              </div>
            )}

            {site.regulations && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">⚖️ Regulations</h3>
                <p className="text-yellow-800 text-sm">{site.regulations}</p>
              </div>
            )}

            {site.safety_notes && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">⚠️ Safety</h3>
                <p className="text-red-800 text-sm">{site.safety_notes}</p>
              </div>
            )}

            {/* Map Button */}
            <div>
              <Link
                href={`/explore?site=${site.id}`}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block text-center"
              >
                📍 View on Map & Get Directions
              </Link>
            </div>
          </div>
        </div>

        {/* Water Body Details */}
        {waterBody && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">💧 Water Body Details</h2>
            </div>
            <div className="p-6 space-y-4">
              {waterBody.stream_name && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Stream Name</h3>
                  <p className="text-gray-700">{waterBody.stream_name}</p>
                </div>
              )}

              {waterBody.stream_type && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Type</h3>
                  <p className="text-gray-700">{waterBody.stream_type}</p>
                </div>
              )}

              {waterBody.species_present && waterBody.species_present.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🐟 Species Present</h3>
                  <div className="flex flex-wrap gap-2">
                    {waterBody.species_present.map((species, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {species}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Stockings */}
        {upcomingStockings.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                📅 Upcoming Stockings ({upcomingStockings.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingStockings.slice(0, 5).map((stocking) => (
                <StockingRow key={stocking.id} stocking={stocking} />
              ))}
            </div>
          </div>
        )}

        {/* Past Stockings */}
        {pastStockings.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                📊 Past Stockings ({pastStockings.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {pastStockings.slice(0, 10).map((stocking) => (
                <StockingRow key={stocking.id} stocking={stocking} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StockingRow({ stocking }: { stocking: StockingEvent }) {
  const date = new Date(stocking.stocking_date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">
            {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
          </div>
          <div className="text-xl font-bold text-gray-900">{date.getDate()}</div>
        </div>
        <div>
          <div className="font-medium text-gray-900">{stocking.species}</div>
          <div className="text-sm text-gray-600">
            {stocking.quantity.toLocaleString()} fish • {stocking.size_range}
          </div>
        </div>
      </div>
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          stocking.status === 'completed'
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        {stocking.status}
      </span>
    </div>
  );
}

