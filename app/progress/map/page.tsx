'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import map components to avoid SSR issues
const ProgressHeatmap = dynamic(() => import('@/components/map/ProgressHeatmap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>,
});

export default function ProgressMapPage() {
  const { data: session, status } = useSession();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');
  const [mapStyle, setMapStyle] = useState<'heatmap' | 'pins' | 'paths'>('pins');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🗺️ My Progress Map</h1>
          <p className="text-green-100">
            Visualize your exploration journey across Pennsylvania
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeFilter('week')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeFilter === 'week'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeFilter('month')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeFilter === 'month'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setTimeFilter('all')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeFilter === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Map Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Map Style</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMapStyle('pins')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    mapStyle === 'pins'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📍 Pins
                </button>
                <button
                  onClick={() => setMapStyle('heatmap')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    mapStyle === 'heatmap'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔥 Heatmap
                </button>
                <button
                  onClick={() => setMapStyle('paths')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    mapStyle === 'paths'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🛤️ Paths
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <ProgressHeatmap 
            timeFilter={timeFilter}
            mapStyle={mapStyle}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-3xl mb-2">📍</div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">Sites Visited</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-3xl mb-2">🗺️</div>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">Cities Explored</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-3xl mb-2">🚶</div>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-sm text-gray-600">Miles Traveled</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-gray-900">87%</div>
            <div className="text-sm text-gray-600">Exploration Rate</div>
          </div>
        </div>

        {/* Recent Visits Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">📅 Recent Visits</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="text-2xl">📍</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Schenley Park</div>
                <div className="text-sm text-gray-600">Pittsburgh • 2 hours ago</div>
              </div>
              <div className="text-green-600 font-medium">+50 pts</div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">📍</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Carnegie Library</div>
                <div className="text-sm text-gray-600">Pittsburgh • Yesterday</div>
              </div>
              <div className="text-gray-600 font-medium">+50 pts</div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">📍</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Point State Park</div>
                <div className="text-sm text-gray-600">Pittsburgh • 3 days ago</div>
              </div>
              <div className="text-gray-600 font-medium">+50 pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

