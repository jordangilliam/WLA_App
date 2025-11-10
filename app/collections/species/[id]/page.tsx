'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { soundManager, haptics } from '@/lib/audio/soundManager';

interface SpeciesCard {
  id: string;
  card_number: number;
  common_name: string;
  scientific_name: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon_emoji: string;
  card_image_url?: string;
  primary_color?: string;
  habitat: string[];
  diet: string;
  size_description: string;
  fun_facts: Array<{ fact: string }>;
  conservation_status: string;
  pa_native: boolean;
  seasons_active: string[];
  discovery_points: number;
  collected: boolean;
  observation_count: number;
}

export default function SpeciesCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Mock data - will be fetched from API
  const card: SpeciesCard = {
    id: id,
    card_number: 1,
    common_name: 'Eastern Bluebird',
    scientific_name: 'Sialia sialis',
    category: 'bird',
    rarity: 'common',
    icon_emoji: '🐦',
    habitat: ['open fields', 'parks', 'gardens'],
    diet: 'Insects',
    size_description: '6-8 inches',
    fun_facts: [
      { fact: 'The male has bright blue plumage!' },
      { fact: 'They nest in cavities and birdhouses' },
    ],
    conservation_status: 'Least Concern',
    pa_native: true,
    seasons_active: ['spring', 'summer', 'fall'],
    discovery_points: 10,
    collected: true,
    observation_count: 3,
  };

  const handleFlip = () => {
    soundManager.play('button-click');
    haptics.light();
    setIsFlipped(!isFlipped);
  };

  const rarityColors = {
    common: { gradient: 'from-gray-500 to-gray-600', text: 'text-gray-700', glow: 'shadow-gray-500/50' },
    uncommon: { gradient: 'from-green-500 to-green-600', text: 'text-green-700', glow: 'shadow-green-500/50' },
    rare: { gradient: 'from-blue-500 to-blue-600', text: 'text-blue-700', glow: 'shadow-blue-500/50' },
    epic: { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-700', glow: 'shadow-purple-500/50' },
    legendary: { gradient: 'from-amber-500 to-amber-600', text: 'text-amber-700', glow: 'shadow-amber-500/50 animate-pulse' },
  };

  const { gradient, text, glow } = rarityColors[card.rarity];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20 md:pb-6 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/collections/species"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          ← Back to Collection
        </Link>

        {/* Card Display */}
        <div className="perspective-1000 mb-8">
          <div
            onClick={handleFlip}
            className={`relative w-full aspect-[2/3] cursor-pointer transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of Card */}
            <div
              className={`absolute inset-0 backface-hidden rounded-3xl ${glow} shadow-2xl overflow-hidden`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
              
              {/* Rarity Badge */}
              <div className="absolute top-4 right-4 bg-white bg-opacity-30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase">
                {card.rarity}
              </div>

              {/* Card Number */}
              <div className="absolute top-4 left-4 text-white text-sm font-mono font-bold">
                #{String(card.card_number).padStart(3, '0')}
              </div>

              {/* Species Image/Emoji */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl animate-pulse">{card.icon_emoji}</div>
              </div>

              {/* Species Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h1 className="text-3xl font-black text-white mb-1">{card.common_name}</h1>
                <p className="text-white text-sm italic opacity-90">{card.scientific_name}</p>
                {card.collected && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                    ✓ Collected • Seen {card.observation_count}x
                  </div>
                )}
              </div>

              {/* Flip Hint */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-black bg-opacity-30 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full animate-bounce">
                  Tap to flip
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl ${glow} shadow-2xl overflow-hidden bg-white`}
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="p-6 h-full overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-5xl mb-2">{card.icon_emoji}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{card.common_name}</h2>
                  <p className="text-sm text-gray-600 italic">{card.scientific_name}</p>
                </div>

                {/* Info Sections */}
                <div className="space-y-4">
                  {/* Habitat */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">🏡 Habitat</h3>
                    <div className="flex flex-wrap gap-2">
                      {card.habitat.map((h) => (
                        <span key={h} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">🍽️ Diet</h3>
                      <p className="text-sm text-gray-900">{card.diet}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">📏 Size</h3>
                      <p className="text-sm text-gray-900">{card.size_description}</p>
                    </div>
                  </div>

                  {/* Seasons */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">📅 Best Seasons</h3>
                    <div className="flex flex-wrap gap-2">
                      {card.seasons_active.map((season) => (
                        <span key={season} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                          {season}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fun Facts */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">💡 Fun Facts</h3>
                    <ul className="space-y-2">
                      {card.fun_facts.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-purple-600 mt-0.5">•</span>
                          <span>{item.fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conservation */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">🌍 Conservation</h3>
                    <p className="text-sm text-gray-900">{card.conservation_status}</p>
                    {card.pa_native && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        PA Native
                      </span>
                    )}
                  </div>

                  {/* Discovery Points */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-amber-600">+{card.discovery_points}</div>
                    <div className="text-xs text-amber-700">Discovery Points</div>
                  </div>
                </div>

                {/* Flip Back Hint */}
                <div className="mt-6 text-center">
                  <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded-full">
                    Tap to flip back
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {card.collected && (
          <div className="space-y-3">
            <button className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              ⭐ Mark as Favorite
            </button>
            <button className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              📸 Add Photo
            </button>
          </div>
        )}

        {!card.collected && (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Not Yet Discovered</h3>
            <p className="text-sm text-gray-600">
              Find and observe this species in the wild to add it to your collection!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

