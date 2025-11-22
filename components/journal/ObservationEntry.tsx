'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReflectionPromptsCard from './ReflectionPromptsCard';

interface Observation {
  id: string;
  created_at: string;
  field_site_id?: string;
  field_site_name?: string;
  notes: string;
  weather?: string;
  temperature?: number;
  species_observed?: string[];
  photos?: string[];
  verified?: boolean;
  teacher_feedback?: string;
  tags?: string[];
  mood?: string;
  reflection_prompts?: {
    conditions?: string;
    habitat?: string;
    phenology?: string;
    action?: string;
    feelings?: string;
  };
}

interface ObservationEntryProps {
  observation: Observation;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
  onReflectionSave?: (
    id: string,
    payload: {
      reflection_prompts: NonNullable<Observation['reflection_prompts']>;
      mood?: string;
      tags?: string[];
    }
  ) => Promise<void>;
}

const WEATHER_EMOJIS: Record<string, string> = {
  sunny: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
  windy: '💨',
  unknown: '🌡️',
};

export default function ObservationEntry({
  observation,
  onEdit,
  onDelete,
  compact = false,
  onReflectionSave,
}: ObservationEntryProps) {
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const date = new Date(observation.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const truncatedNotes =
    observation.notes && observation.notes.length > 150
      ? observation.notes.substring(0, 150) + '...'
      : observation.notes;

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Icon/Photo */}
          <div className="flex-shrink-0">
            {observation.photos && observation.photos.length > 0 ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={observation.photos[0]}
                  alt="Observation"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
                📝
              </div>
            )}
          </div>

          {/* Middle: Content */}
          <div className="flex-1 min-w-0">
            {observation.field_site_name && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">
                  {observation.field_site_name}
                </span>
                {observation.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {observation.notes || 'No notes'}
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{formattedDate}</span>
              {observation.weather && (
                <span className="flex items-center gap-1">
                  {WEATHER_EMOJIS[observation.weather] || '🌡️'}
                  {observation.temperature && `${observation.temperature}°F`}
                </span>
              )}
              {observation.species_observed && observation.species_observed.length > 0 && (
                <span>{observation.species_observed.length} species</span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          {(onEdit || onDelete) && (
            <div className="flex-shrink-0 flex gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(observation.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(observation.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {observation.field_site_name && (
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                📍 {observation.field_site_name}
              </h3>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{formattedDate} at {formattedTime}</span>
              {observation.verified && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <span>✓</span>
                  <span>Verified by Teacher</span>
                </span>
              )}
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(observation.id)}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(observation.id)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Photos */}
      {observation.photos && observation.photos.length > 0 && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-3 gap-2">
            {observation.photos.map((photo, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden bg-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo}
                  alt={`Observation photo ${idx + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Weather & Temperature */}
        {(observation.weather || observation.temperature) && (
          <div className="flex items-center gap-4">
            {observation.weather && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{WEATHER_EMOJIS[observation.weather] || '🌡️'}</span>
                <span className="text-sm text-gray-600 capitalize">
                  {observation.weather.replace('-', ' ')}
                </span>
              </div>
            )}
            {observation.temperature && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{observation.temperature}°F</span>
              </div>
            )}
          </div>
        )}

        {/* Species Observed */}
        {observation.species_observed && observation.species_observed.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Species Observed</h4>
            <div className="flex flex-wrap gap-2">
              {observation.species_observed.map((species, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {species}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {observation.notes && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Observation Notes</h4>
            <p className="text-gray-700 whitespace-pre-wrap">
              {showFullNotes || observation.notes.length <= 150
                ? observation.notes
                : truncatedNotes}
            </p>
            {observation.notes.length > 150 && (
              <button
                onClick={() => setShowFullNotes(!showFullNotes)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                {showFullNotes ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Teacher Feedback */}
        {observation.teacher_feedback && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              👨‍🏫 Teacher Feedback
            </h4>
            <p className="text-sm text-blue-800">{observation.teacher_feedback}</p>
          </div>
        )}

        <ReflectionPromptsCard
          observationId={observation.id}
          prompts={observation.reflection_prompts}
          mood={observation.mood}
          tags={observation.tags}
          onSave={onReflectionSave}
        />
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={selectedPhoto}
              alt="Full size observation"
              width={1200}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

