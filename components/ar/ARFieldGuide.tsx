'use client';

import { useState } from 'react';
import Image from 'next/image';
import ARIdentification from './ARIdentification';

interface SpeciesInfo {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  imageUrl?: string;
  habitat: string;
  conservationStatus: string;
}

interface ARFieldGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ARFieldGuide({ isOpen, onClose }: ARFieldGuideProps) {
  const [arMode, setArMode] = useState<'species' | 'bird' | 'macro'>('species');
  const [identifiedSpecies, setIdentifiedSpecies] = useState<SpeciesInfo | null>(null);
  const [showAR, setShowAR] = useState(false);

  const handleIdentification = (result: any) => {
    // In a real implementation, this would fetch species details from the database
    // For now, create a placeholder species info
    if (result.label && result.confidence > 0.7) {
      setIdentifiedSpecies({
        id: result.label.toLowerCase().replace(/\s+/g, '-'),
        name: result.label,
        scientificName: 'Species sp.',
        description: `Identified with ${Math.round(result.confidence * 100)}% confidence`,
        habitat: 'Various habitats',
        conservationStatus: 'Unknown',
      });
      setShowAR(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {showAR ? (
        <ARIdentification
          isActive={showAR}
          mode={arMode}
          onIdentification={handleIdentification}
          onClose={() => setShowAR(false)}
        />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">AR Field Guide</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <p className="text-gray-600 mb-3">Select identification mode:</p>
              <div className="flex gap-3">
                {(['species', 'bird', 'macro'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setArMode(mode)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      arMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Start AR Button */}
            <button
              onClick={() => setShowAR(true)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg mb-6 hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Start AR Identification 📷
            </button>

            {/* Identified Species Info */}
            {identifiedSpecies && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {identifiedSpecies.name}
                </h3>
                <p className="text-gray-600 italic mb-2">{identifiedSpecies.scientificName}</p>
                <p className="text-gray-700 mb-4">{identifiedSpecies.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Habitat</p>
                    <p className="text-gray-900">{identifiedSpecies.habitat}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Conservation Status</p>
                    <p className="text-gray-900">{identifiedSpecies.conservationStatus}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">How to use:</h4>
              <ol className="list-decimal list-inside text-gray-700 space-y-1">
                <li>Select your identification mode</li>
                <li>Tap "Start AR Identification"</li>
                <li>Point your camera at the species</li>
                <li>Tap the screen or use the Identify button</li>
                <li>View species information when identified</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

