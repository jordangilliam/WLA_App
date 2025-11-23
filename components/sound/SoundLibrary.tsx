'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';

interface BirdCall {
  id: string;
  commonName: string;
  scientificName: string;
  audioUrl: string;
  imageUrl?: string;
  habitat: string;
  season: string[];
  description: string;
}

export default function SoundLibrary() {
  const [birds, setBirds] = useState<BirdCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHabitat, setSelectedHabitat] = useState<string>('all');

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, using sample data
    const sampleBirds: BirdCall[] = [
      {
        id: '1',
        commonName: 'American Robin',
        scientificName: 'Turdus migratorius',
        audioUrl: '/sounds/birds/american-robin.mp3',
        habitat: 'woodland',
        season: ['spring', 'summer'],
        description: 'Common songbird with a cheerful, warbling song',
      },
      {
        id: '2',
        commonName: 'Northern Cardinal',
        scientificName: 'Cardinalis cardinalis',
        audioUrl: '/sounds/birds/northern-cardinal.mp3',
        habitat: 'woodland',
        season: ['year-round'],
        description: 'Bright red bird with a distinctive whistle',
      },
      {
        id: '3',
        commonName: 'Blue Jay',
        scientificName: 'Cyanocitta cristata',
        audioUrl: '/sounds/birds/blue-jay.mp3',
        habitat: 'woodland',
        season: ['year-round'],
        description: 'Noisy, intelligent bird with a variety of calls',
      },
    ];

    setTimeout(() => {
      setBirds(sampleBirds);
      setLoading(false);
    }, 500);
  }, []);

  const filteredBirds = birds.filter((bird) => {
    const matchesSearch =
      bird.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bird.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHabitat = selectedHabitat === 'all' || bird.habitat === selectedHabitat;
    return matchesSearch && matchesHabitat;
  });

  const habitats = ['all', 'woodland', 'wetland', 'grassland', 'urban'];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bird Call Library</h2>
        <p className="text-gray-600">
          Learn to identify birds by their calls and songs
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Search birds..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2 flex-wrap">
          {habitats.map((habitat) => (
            <button
              key={habitat}
              onClick={() => setSelectedHabitat(habitat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedHabitat === habitat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {habitat.charAt(0).toUpperCase() + habitat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bird List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : filteredBirds.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-600">No birds found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBirds.map((bird) => (
            <div
              key={bird.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {bird.imageUrl && (
                  <Image
                    src={bird.imageUrl}
                    alt={bird.commonName}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{bird.commonName}</h3>
                  <p className="text-sm text-gray-600 italic">{bird.scientificName}</p>
                  <p className="text-sm text-gray-700 mt-2">{bird.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>📍 {bird.habitat}</span>
                    <span>📅 {bird.season.join(', ')}</span>
                  </div>
                  {bird.audioUrl && (
                    <audio controls className="w-full mt-3">
                      <source src={bird.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

