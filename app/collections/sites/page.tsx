'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface FieldSite {
  id: string;
  name: string;
  city: string;
  site_type: string;
  visited: boolean;
  visit_count?: number;
  last_visit?: string;
  image_url?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic';
}

export default function SitesCollectionPage() {
  const { data: session, status } = useSession();
  const [sites, setSites] = useState<FieldSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visited' | 'unvisited'>('all');

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/collections/sites');
      // const data = await response.json();
      
      // Mock data for now
      const mockSites: FieldSite[] = [
        { id: '1', name: 'Schenley Park', city: 'Pittsburgh', site_type: 'park', visited: true, visit_count: 3, rarity: 'common' },
        { id: '2', name: 'Carnegie Library Main', city: 'Pittsburgh', site_type: 'library', visited: true, visit_count: 1, rarity: 'common' },
        { id: '3', name: 'Frick Park', city: 'Pittsburgh', site_type: 'park', visited: false, rarity: 'common' },
        { id: '4', name: 'Ricketts Glen State Park', city: 'Benton', site_type: 'state_park', visited: false, rarity: 'epic' },
        { id: '5', name: 'Point State Park', city: 'Pittsburgh', site_type: 'park', visited: false, rarity: 'uncommon' },
      ];
      
      setSites(mockSites);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setLoading(false);
    }
  };

  const filteredSites = sites.filter(site => {
    if (filterType !== 'all' && site.site_type !== filterType) return false;
    if (filterStatus === 'visited' && !site.visited) return false;
    if (filterStatus === 'unvisited' && site.visited) return false;
    return true;
  });

  const visitedCount = sites.filter(s => s.visited).length;
  const totalCount = sites.length;
  const progressPercent = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700',
    uncommon: 'bg-green-100 text-green-700',
    rare: 'bg-blue-100 text-blue-700',
    epic: 'bg-purple-100 text-purple-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/collections" className="text-green-100 hover:text-white mb-2 inline-block">
            ← Back to Collections
          </Link>
          <h1 className="text-3xl font-bold mb-2">🗺️ Field Sites Collection</h1>
          <p className="text-green-100 mb-4">Explore all 140+ sites across Pennsylvania</p>
          
          {/* Progress Bar */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Collection Progress</span>
              <span className="text-2xl font-bold">{visitedCount}/{totalCount}</span>
            </div>
            <div className="bg-white bg-opacity-30 rounded-full h-4">
              <div
                className="bg-white rounded-full h-4 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="park">Parks</option>
                <option value="library">Libraries</option>
                <option value="state_park">State Parks</option>
                <option value="trail">Trails</option>
                <option value="water">Water Bodies</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Sites</option>
                <option value="visited">Visited</option>
                <option value="unvisited">Not Visited Yet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site) => (
            <div
              key={site.id}
              className={`bg-white rounded-lg border-2 overflow-hidden transition-all ${
                site.visited
                  ? 'border-green-500 shadow-md hover:shadow-lg'
                  : 'border-gray-200 opacity-60 hover:opacity-100'
              }`}
            >
              {/* Image */}
              <div className={`h-32 flex items-center justify-center ${
                site.visited ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-gray-100'
              }`}>
                <div className="text-5xl">{site.visited ? '✅' : '🔒'}</div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-bold ${site.visited ? 'text-gray-900' : 'text-gray-500'}`}>
                    {site.name}
                  </h3>
                  {site.rarity && (
                    <span className={`text-xs px-2 py-1 rounded-full ${rarityColors[site.rarity]}`}>
                      {site.rarity}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  📍 {site.city} • {site.site_type.replace('_', ' ')}
                </p>

                {site.visited ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-700">
                      🎯 Visited {site.visit_count} {site.visit_count === 1 ? 'time' : 'times'}
                    </div>
                    <Link
                      href={`/explore?siteId=${site.id}`}
                      className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/explore?siteId=${site.id}`}
                    className="block w-full px-4 py-2 bg-gray-600 text-white text-center rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Find Site
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSites.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Sites Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters</p>
            <button
              onClick={() => {
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

