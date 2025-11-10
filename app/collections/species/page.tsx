'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Species {
  id: string;
  name: string;
  category: 'bird' | 'mammal' | 'fish' | 'insect' | 'plant';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  observed: boolean;
  observation_count?: number;
  icon: string;
}

export default function SpeciesCollectionPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'observed' | 'unobserved'>('all');

  // Mock data - will be replaced with API
  const mockSpecies: Species[] = [
    { id: '1', name: 'Eastern Bluebird', category: 'bird', rarity: 'common', observed: true, observation_count: 2, icon: '🐦' },
    { id: '2', name: 'White-tailed Deer', category: 'mammal', rarity: 'common', observed: true, observation_count: 1, icon: '🦌' },
    { id: '3', name: 'Brook Trout', category: 'fish', rarity: 'uncommon', observed: false, icon: '🐟' },
    { id: '4', name: 'Bald Eagle', category: 'bird', rarity: 'rare', observed: false, icon: '🦅' },
    { id: '5', name: 'Black Bear', category: 'mammal', rarity: 'epic', observed: false, icon: '🐻' },
    { id: '6', name: 'Timber Rattlesnake', category: 'mammal', rarity: 'legendary', observed: false, icon: '🐍' },
  ];

  const filteredSpecies = mockSpecies.filter(species => {
    if (filterCategory !== 'all' && species.category !== filterCategory) return false;
    if (filterStatus === 'observed' && !species.observed) return false;
    if (filterStatus === 'unobserved' && species.observed) return false;
    return true;
  });

  const observedCount = mockSpecies.filter(s => s.observed).length;
  const totalCount = mockSpecies.length;
  const progressPercent = (observedCount / totalCount) * 100;

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    uncommon: 'from-green-500 to-green-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-amber-500 to-amber-600',
  };

  const rarityGlow = {
    common: 'shadow-gray-500/50',
    uncommon: 'shadow-green-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-amber-500/50 animate-pulse',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/collections" className="text-blue-100 hover:text-white mb-2 inline-block">
            ← Back to Collections
          </Link>
          <h1 className="text-3xl font-bold mb-2">🦋 Species Collection</h1>
          <p className="text-blue-100 mb-4">Document Pennsylvania's incredible biodiversity</p>
          
          {/* Progress Bar */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Species Documented</span>
              <span className="text-2xl font-bold">{observedCount}/{totalCount}</span>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Species</option>
                <option value="bird">Birds 🐦</option>
                <option value="mammal">Mammals 🦌</option>
                <option value="fish">Fish 🐟</option>
                <option value="insect">Insects 🦋</option>
                <option value="plant">Plants 🌿</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Species</option>
                <option value="observed">Observed</option>
                <option value="unobserved">Not Yet Observed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Species Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSpecies.map((species) => (
            <div
              key={species.id}
              className={`relative bg-white rounded-xl overflow-hidden transition-all ${
                species.observed
                  ? `shadow-lg ${rarityGlow[species.rarity]} hover:scale-105`
                  : 'opacity-50 hover:opacity-75'
              }`}
            >
              {/* Rarity Badge */}
              <div className={`absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded-full font-bold text-white bg-gradient-to-r ${rarityColors[species.rarity]}`}>
                {species.rarity}
              </div>

              {/* Content */}
              <div className={`p-6 text-center bg-gradient-to-br ${
                species.observed ? rarityColors[species.rarity] : 'from-gray-300 to-gray-400'
              }`}>
                <div className="text-6xl mb-2">{species.observed ? species.icon : '❓'}</div>
              </div>

              <div className="p-4">
                <h3 className={`font-bold text-center mb-2 ${
                  species.observed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {species.observed ? species.name : '???'}
                </h3>

                {species.observed ? (
                  <div className="text-xs text-center text-gray-600 mb-3">
                    Observed {species.observation_count}x
                  </div>
                ) : (
                  <div className="text-xs text-center text-gray-500 mb-3">
                    Not discovered yet
                  </div>
                )}

                {species.observed && (
                  <Link
                    href={`/collections/species/${species.id}`}
                    className="block w-full px-3 py-2 bg-blue-600 text-white text-center rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Card
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rarity Legend */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Rarity Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(rarityColors).map(([rarity, colors]) => (
              <div key={rarity} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${colors} mb-2`}></div>
                <div className="text-sm font-medium capitalize">{rarity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

