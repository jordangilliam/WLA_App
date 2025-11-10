'use client';

import { useState } from 'react';

interface ObservationPromptProps {
  siteName: string;
  speciesLikely?: string[];
  onSubmit: (observation: {
    notes: string;
    speciesObserved: string[];
    weather: string;
    temperature?: number;
  }) => void;
  onSkip: () => void;
}

const WEATHER_OPTIONS = [
  { value: 'sunny', label: 'Sunny', emoji: '☀️' },
  { value: 'partly-cloudy', label: 'Partly Cloudy', emoji: '⛅' },
  { value: 'cloudy', label: 'Cloudy', emoji: '☁️' },
  { value: 'rainy', label: 'Rainy', emoji: '🌧️' },
  { value: 'snowy', label: 'Snowy', emoji: '❄️' },
  { value: 'windy', label: 'Windy', emoji: '💨' },
];

export default function ObservationPrompt({
  siteName,
  speciesLikely,
  onSubmit,
  onSkip,
}: ObservationPromptProps) {
  const [notes, setNotes] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSpecies = (species: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(species) ? prev.filter((s) => s !== species) : [...prev, species]
    );
  };

  const handleSubmit = async () => {
    if (!notes.trim() && selectedSpecies.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        notes: notes.trim(),
        speciesObserved: selectedSpecies,
        weather: weather || 'unknown',
        temperature: temperature ? parseFloat(temperature) : undefined,
      });
    } catch (error) {
      console.error('Error submitting observation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyData =
    notes.trim() || selectedSpecies.length > 0 || weather || temperature;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Quick Observation (Optional)
          </h3>
          <p className="text-sm text-gray-600">
            Document what you saw at {siteName}
          </p>
        </div>

        {/* Weather */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weather Conditions
          </label>
          <div className="grid grid-cols-3 gap-2">
            {WEATHER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setWeather(option.value)}
                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                  weather === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className="text-xs font-medium text-gray-700">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature (°F)
          </label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="e.g., 72"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Species Likely */}
        {speciesLikely && speciesLikely.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Species Likely at This Site
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Tap species you observed:
            </p>
            <div className="flex flex-wrap gap-2">
              {speciesLikely.slice(0, 8).map((species) => (
                <button
                  key={species}
                  onClick={() => toggleSpecies(species)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedSpecies.includes(species)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedSpecies.includes(species) ? '✓ ' : ''}
                  {species}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you see? What was interesting? Any wildlife behavior?"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            {notes.length}/500 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {hasAnyData && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                'Save Observation'
              )}
            </button>
          )}

          <button
            onClick={onSkip}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            {hasAnyData ? 'Skip for Now' : 'Continue Without Observation'}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🌟 Observation Tips:
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Note unusual behavior or rare species</li>
          <li>• Record habitat conditions</li>
          <li>• Mention weather impact on wildlife</li>
          <li>• Your data helps scientists!</li>
        </ul>
      </div>
    </div>
  );
}

