'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Habitat {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  characteristics: string[];
  commonSpecies: Array<{
    id: string;
    name: string;
    imageUrl?: string;
  }>;
  conservationStatus: string;
  threats: string[];
  conservationActions: string[];
}

interface HabitatGuideProps {
  habitats: Habitat[];
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function HabitatGuide({ habitats, currentLocation }: HabitatGuideProps) {
  const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(habitats[0] || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'species' | 'conservation'>('overview');

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Habitat Selection */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {habitats.map((habitat) => (
            <button
              key={habitat.id}
              onClick={() => {
                setSelectedHabitat(habitat);
                setActiveTab('overview');
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedHabitat?.id === habitat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {habitat.name}
            </button>
          ))}
        </div>
      </div>

      {selectedHabitat && (
        <>
          {/* Hero Image */}
          <div className="relative h-64 w-full">
            <Image
              src={selectedHabitat.imageUrl}
              alt={selectedHabitat.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedHabitat.name}</h2>
              <p className="text-white text-sm opacity-90">{selectedHabitat.description}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {(['overview', 'species', 'conservation'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Key Characteristics</h3>
                  <ul className="space-y-2">
                    {selectedHabitat.characteristics.map((char, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Conservation Status</h3>
                  <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
                    {selectedHabitat.conservationStatus}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'species' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Common Species in {selectedHabitat.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedHabitat.commonSpecies.map((species) => (
                    <div
                      key={species.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      {species.imageUrl && (
                        <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={species.imageUrl}
                            alt={species.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="font-semibold text-gray-900 text-sm text-center">
                        {species.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'conservation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-3">Threats</h3>
                  <ul className="space-y-2">
                    {selectedHabitat.threats.map((threat, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">⚠️</span>
                        <span className="text-gray-700">{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-green-900 mb-3">Conservation Actions</h3>
                  <ul className="space-y-2">
                    {selectedHabitat.conservationActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

