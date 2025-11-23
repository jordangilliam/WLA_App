'use client';

import { useState } from 'react';
import Skeleton from '@/components/ui/Skeleton';

interface SoundIdentifierProps {
  audioData: string;
  onResults?: (results: any[]) => void;
  latitude?: number;
  longitude?: number;
  fieldSiteId?: string;
}

export default function SoundIdentifier({
  audioData,
  onResults,
  latitude,
  longitude,
  fieldSiteId,
}: SoundIdentifierProps) {
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const identify = async () => {
    if (!audioData) return;

    setIsIdentifying(true);
    setError(null);

    try {
      const response = await fetch('/api/sound/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData,
          latitude,
          longitude,
          fieldSiteId,
        }),
      });

      if (!response.ok) {
        throw new Error('Identification failed');
      }

      const data = await response.json();
      if (data.success) {
        setResults(data.results || []);
        if (onResults) {
          onResults(data.results || []);
        }
      } else {
        throw new Error(data.error || 'Identification failed');
      }
    } catch (err: any) {
      console.error('Sound identification error:', err);
      setError(err.message || 'Unable to identify sound');
    } finally {
      setIsIdentifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={identify}
        disabled={isIdentifying}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isIdentifying ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Identifying...
          </span>
        ) : (
          '🔍 Identify Sound'
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {isIdentifying && (
        <div className="space-y-2">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Identification Results:</h4>
          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">{result.label || 'Unknown'}</div>
                <div className="text-sm text-gray-600">
                  {Math.round((result.confidence || 0) * 100)}% confidence
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Provider: {result.provider} • Mode: {result.mode}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

