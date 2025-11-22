'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface StockingEvent {
  id: string;
  field_site_id: string;
  site_name: string;
  stocking_date: string;
  species: string;
  quantity: number;
  size_range: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  water_body_name?: string;
}

interface FieldSite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  site_type: string;
}

export default function StockingCalendarPage() {
  const router = useRouter();
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [stockings, setStockings] = useState<StockingEvent[]>([]);
  const [fieldSites, setFieldSites] = useState<FieldSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: 'all',
    status: 'scheduled',
    region: 'all',
  });

  useEffect(() => {
    fetchStockingData();
  }, [selectedMonth, filters]);

  const fetchStockingData = async () => {
    try {
      setLoading(true);

      // Fetch upcoming stockings
      const response = await fetch('/api/stocking/upcoming');
      if (response.ok) {
        const data = await response.json();
        setStockings(data.stockings || []);
        setFieldSites(data.fieldSites || []);
      }
    } catch (error) {
      console.error('Error fetching stocking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStockings = stockings.filter((stocking) => {
    if (filters.species !== 'all' && stocking.species !== filters.species) {
      return false;
    }
    if (filters.status !== 'all' && stocking.status !== filters.status) {
      return false;
    }
    return true;
  });

  const upcomingStockings = filteredStockings
    .filter((s) => new Date(s.stocking_date) >= new Date())
    .sort((a, b) => new Date(a.stocking_date).getTime() - new Date(b.stocking_date).getTime())
    .slice(0, 10);

  const stockingsByDate = filteredStockings.reduce((acc, stocking) => {
    const date = new Date(stocking.stocking_date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(stocking);
    return acc;
  }, {} as Record<string, StockingEvent[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stocking schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🎣 Trout Stocking Calendar</h1>
              <p className="text-blue-100">
                Pennsylvania Fish & Boat Commission - 2025 Schedule
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                📋 List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'calendar'
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                📅 Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Species Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Species
              </label>
              <select
                value={filters.species}
                onChange={(e) => setFilters({ ...filters, species: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Species</option>
                <option value="Rainbow Trout">Rainbow Trout</option>
                <option value="Brown Trout">Brown Trout</option>
                <option value="Brook Trout">Brook Trout</option>
                <option value="Golden Rainbow Trout">Golden Rainbow</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="scheduled">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Regions</option>
                <option value="pittsburgh">Pittsburgh Area</option>
                <option value="state-college">State College</option>
                <option value="harrisburg">Harrisburg</option>
                <option value="philadelphia">Philadelphia</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {view === 'list' ? (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-blue-200 p-6 text-center">
                <div className="text-4xl mb-2">🎣</div>
                <div className="text-3xl font-bold text-blue-600">
                  {upcomingStockings.length}
                </div>
                <div className="text-sm text-gray-600">Upcoming Stockings</div>
              </div>

              <div className="bg-white rounded-lg border border-green-200 p-6 text-center">
                <div className="text-4xl mb-2">📍</div>
                <div className="text-3xl font-bold text-green-600">
                  {fieldSites.filter(s => s.site_type === 'trout_stream' || s.site_type === 'lake').length}
                </div>
                <div className="text-sm text-gray-600">Stocked Locations</div>
              </div>

              <div className="bg-white rounded-lg border border-purple-200 p-6 text-center">
                <div className="text-4xl mb-2">🐟</div>
                <div className="text-3xl font-bold text-purple-600">
                  {stockings.reduce((sum, s) => sum + s.quantity, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Fish</div>
              </div>
            </div>

            {/* Upcoming Stockings List */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">
                  📅 Next 10 Stockings
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {upcomingStockings.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">🎣</div>
                    <p className="text-gray-600">
                      No upcoming stockings match your filters.
                    </p>
                  </div>
                ) : (
                  upcomingStockings.map((stocking) => (
                    <StockingCard key={stocking.id} stocking={stocking} />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Calendar View Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We&rsquo;re building an interactive calendar view with day-by-day stockings.
              </p>
              <button
                onClick={() => setView('list')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Stocking Card Component
function StockingCard({ stocking }: { stocking: StockingEvent }) {
  const router = useRouter();
  const date = new Date(stocking.stocking_date);
  const today = new Date();
  const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Date Badge */}
        <div className="flex-shrink-0">
          <div className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center ${
            isToday
              ? 'bg-green-600 text-white'
              : isTomorrow
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}>
            <div className="text-sm font-medium">
              {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </div>
            <div className="text-2xl font-bold">{date.getDate()}</div>
          </div>
        </div>

        {/* Middle: Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {stocking.site_name}
          </h3>
          {stocking.water_body_name && (
            <p className="text-sm text-gray-600 mb-2">
              {stocking.water_body_name}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1 text-blue-700">
              <span>🐟</span>
              <span className="font-medium">{stocking.species}</span>
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <span>📊</span>
              <span>{stocking.quantity.toLocaleString()} fish</span>
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <span>📏</span>
              <span>{stocking.size_range}</span>
            </span>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {formattedDate}
            {isToday && <span className="ml-2 text-green-600 font-semibold">• Today!</span>}
            {isTomorrow && <span className="ml-2 text-blue-600 font-semibold">• Tomorrow</span>}
            {daysUntil > 1 && (
              <span className="ml-2">• In {daysUntil} days</span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <Link
            href={`/explore?site=${stocking.field_site_id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
          >
            📍 View on Map
          </Link>
          <button
            onClick={() => {
              // TODO: Add notification preference
              alert('Notification feature coming soon!');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            🔔 Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}

