'use client';

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface LiveObservationsProps {
  observations: Array<{
    id: string;
    userId: string;
    userName: string;
    observationId: string;
    fieldSiteId: string;
    speciesName?: string;
    timestamp: Date;
    latitude?: number;
    longitude?: number;
  }>;
}

export default function LiveObservations({ observations }: LiveObservationsProps) {
  if (observations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-600">No observations yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Observations from your classmates will appear here in real-time
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {observations.map((obs) => (
        <div key={obs.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {obs.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{obs.userName}</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(obs.timestamp), { addSuffix: true })}
                </span>
              </div>
              {obs.speciesName ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">🦋</span>
                  <span className="text-gray-700 font-medium">{obs.speciesName}</span>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Made an observation</p>
              )}
              {obs.latitude && obs.longitude && (
                <p className="text-xs text-gray-500 mt-1">
                  📍 {obs.latitude.toFixed(4)}, {obs.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

