'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Species {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  characteristics: {
    label: string;
    value: string;
  }[];
  habitat: string;
  size: string;
  season: string[];
  description: string;
}

interface SpeciesComparisonProps {
  species: Species[];
  title?: string;
}

export default function SpeciesComparison({ species, title = 'Species Comparison' }: SpeciesComparisonProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  const toggleSpecies = (speciesId: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(speciesId) ? prev.filter((id) => id !== speciesId) : [...prev, speciesId]
    );
  };

  const selected = species.filter((s) => selectedSpecies.includes(s.id));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">
        Select species to compare side-by-side
      </p>

      {/* Species Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {species.map((spec) => {
          const isSelected = selectedSpecies.includes(spec.id);
          return (
            <button
              key={spec.id}
              onClick={() => toggleSpecies(spec.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={spec.imageUrl}
                  alt={spec.name}
                  fill
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-sm">{spec.name}</div>
                <div className="text-xs text-gray-600 italic">{spec.scientificName}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Comparison Table */}
      {selected.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-3 text-left font-semibold text-gray-900">
                  Characteristic
                </th>
                {selected.map((spec) => (
                  <th
                    key={spec.id}
                    className="border border-gray-200 p-3 text-center font-semibold text-gray-900 min-w-[200px]"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={spec.imageUrl}
                        alt={spec.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-bold">{spec.name}</div>
                        <div className="text-xs text-gray-600 italic">{spec.scientificName}</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Size */}
              <tr>
                <td className="border border-gray-200 p-3 font-semibold text-gray-700">Size</td>
                {selected.map((spec) => (
                  <td key={spec.id} className="border border-gray-200 p-3 text-center text-gray-700">
                    {spec.size}
                  </td>
                ))}
              </tr>

              {/* Habitat */}
              <tr className="bg-gray-50">
                <td className="border border-gray-200 p-3 font-semibold text-gray-700">Habitat</td>
                {selected.map((spec) => (
                  <td key={spec.id} className="border border-gray-200 p-3 text-center text-gray-700">
                    {spec.habitat}
                  </td>
                ))}
              </tr>

              {/* Season */}
              <tr>
                <td className="border border-gray-200 p-3 font-semibold text-gray-700">Active Season</td>
                {selected.map((spec) => (
                  <td key={spec.id} className="border border-gray-200 p-3 text-center text-gray-700">
                    {spec.season.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Custom Characteristics */}
              {selected[0]?.characteristics.map((char, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="border border-gray-200 p-3 font-semibold text-gray-700">
                    {char.label}
                  </td>
                  {selected.map((spec) => (
                    <td key={spec.id} className="border border-gray-200 p-3 text-center text-gray-700">
                      {spec.characteristics[index]?.value || '—'}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Description */}
              <tr className="bg-gray-50">
                <td className="border border-gray-200 p-3 font-semibold text-gray-700">Description</td>
                {selected.map((spec) => (
                  <td key={spec.id} className="border border-gray-200 p-3 text-sm text-gray-700">
                    {spec.description}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selected.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-600">Select species above to compare</p>
        </div>
      )}
    </div>
  );
}

