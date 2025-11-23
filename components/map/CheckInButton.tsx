'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckInFlow, { CheckInResultPayload } from '../checkin/CheckInFlow';

interface FieldSite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  species_likely?: string[];
}

interface CheckInButtonProps {
  site: FieldSite;
  userLocation: { latitude: number; longitude: number } | null;
  onSuccess?: (payload?: CheckInResultPayload) => void;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export default function CheckInButton({ site, userLocation, onSuccess }: CheckInButtonProps) {
  const router = useRouter();
  const [showCheckInFlow, setShowCheckInFlow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate distance from user to site
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        site.latitude,
        site.longitude
      )
    : null;

  // Check if user is within check-in radius (100 meters)
  const withinRadius = distance !== null && distance <= 100;

  const handleCheckIn = () => {
    if (!userLocation) {
      setError('Location not available. Please enable location services.');
      return;
    }

    if (!withinRadius) {
      setError(`You're too far away (${Math.round(distance!)}m). Get within 100m to check in.`);
      return;
    }

    // Open check-in flow modal
    setShowCheckInFlow(true);
  };

  // Loading location
  if (userLocation === null) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Getting your location...</p>
      </div>
    );
  }

  // Too far away
  if (!withinRadius && distance !== null) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📍</span>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 mb-1">Too Far to Check In</h4>
            <p className="text-sm text-yellow-800 mb-2">
              You&apos;re {Math.round(distance)}m away. Get within 100m to check in and earn points!
            </p>
            <div className="w-full bg-yellow-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-yellow-600 h-full transition-all"
                style={{ width: `${Math.min((100 / distance) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              {distance > 100 ? `${Math.round(distance - 100)}m more to go` : 'Almost there!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Within radius - can check in!
  return (
    <>
      <div className="space-y-3">
        {/* Check-in Button */}
        <button
          onClick={handleCheckIn}
          className="w-full px-6 py-4 rounded-lg font-bold text-lg transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span className="flex items-center justify-center gap-2">
            <span>✓</span>
            Check In Now
          </span>
        </button>

      {/* Success Indicator */}
      {withinRadius && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-800">
            <span className="text-xl">✓</span>
            <div className="flex-1">
              <p className="text-sm font-medium">You&apos;re here!</p>
              <p className="text-xs text-green-700">
                Within {Math.round(distance!)}m of site • Ready to earn conservation points
              </p>
            </div>
          </div>
        </div>
      )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Check-in Failed</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Check-In Flow Modal */}
      {showCheckInFlow && userLocation && (
        <CheckInFlow
          site={site}
          userLocation={userLocation}
          onClose={() => setShowCheckInFlow(false)}
          onSuccess={(payload) => {
            setShowCheckInFlow(false);
            if (onSuccess) onSuccess(payload);
          }}
        />
      )}
    </>
  );
}

