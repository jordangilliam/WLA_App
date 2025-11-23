'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoCapture from './PhotoCapture';
import ObservationPrompt from './ObservationPrompt';

interface FieldSite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  species_likely?: string[];
}

export interface CheckInResultPayload {
  pointsEarned?: number;
  isFirstVisit?: boolean;
  message?: string;
  newAchievements?: { title?: string; achievementId?: string }[];
}

interface CheckInFlowProps {
  site: FieldSite;
  userLocation: { latitude: number; longitude: number };
  onClose: () => void;
  onSuccess?: (payload?: CheckInResultPayload) => void;
}

type FlowStep = 'confirming' | 'photo' | 'observation' | 'submitting' | 'success';

export default function CheckInFlow({
  site,
  userLocation,
  onClose,
  onSuccess,
}: CheckInFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>('confirming');
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [observationData, setObservationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmCheckIn = () => {
    setStep('photo');
  };

  const handlePhotoTaken = (photoUrl: string, data: string) => {
    setPhotoData(data);
    // Auto-advance to observation after photo captured
    setTimeout(() => {
      setStep('observation');
    }, 500);
  };

  const handleSkipPhoto = () => {
    setStep('observation');
  };

  const handleObservationSubmit = async (observation: any) => {
    setObservationData(observation);
    await submitCheckIn(observation);
  };

  const handleSkipObservation = async () => {
    await submitCheckIn(null);
  };

  const submitCheckIn = async (observation: any) => {
    try {
      setStep('submitting');
      setError(null);

      // Submit check-in to API
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: site.id,
          coordinates: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            accuracy: 10,
          },
          verificationMethod: 'gps',
          photoUrl: photoData,
          notes: observation?.notes,
          ...(observation && {
            weather: observation.weather,
            temperature: observation.temperature,
            speciesObserved: observation.speciesObserved,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Check-in failed');
      }

      // Success! Navigate to success screen
      if (data.success && data.checkIn) {
        const achievements = data.checkIn.newAchievements
          ?.map((a: any) => a.title)
          .join(',') || '';
        
        router.push(
          `/check-in/success?points=${data.checkIn.pointsEarned}&firstVisit=${data.checkIn.isFirstVisit}&siteName=${encodeURIComponent(site.name)}&achievements=${achievements}`
        );

        if (onSuccess) {
          onSuccess(data.checkIn as CheckInResultPayload);
        }
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err: any) {
      console.error('Check-in error:', err);
      setError(err.message || 'Failed to check in. Please try again.');
      setStep('confirming'); // Go back to start
    }
  };

  // Modal overlay
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Check-In</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Step number={1} label="Confirm" active={step === 'confirming'} completed={step !== 'confirming'} />
            <div className="flex-1 h-0.5 bg-gray-200 mx-2">
              <div
                className={`h-full bg-green-600 transition-all duration-300 ${
                  step === 'confirming' ? 'w-0' : step === 'photo' ? 'w-1/2' : 'w-full'
                }`}
              ></div>
            </div>
            <Step number={2} label="Photo" active={step === 'photo'} completed={step === 'observation' || step === 'submitting'} />
            <div className="flex-1 h-0.5 bg-gray-200 mx-2">
              <div
                className={`h-full bg-green-600 transition-all duration-300 ${
                  step === 'observation' || step === 'submitting' ? 'w-full' : 'w-0'
                }`}
              ></div>
            </div>
            <Step number={3} label="Done" active={step === 'observation' || step === 'submitting'} completed={false} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {step === 'confirming' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Check in at {site.name}?
                </h3>
                <p className="text-gray-600 mb-6">
                  You&rsquo;ll earn points and can add photos and observations!
                </p>

                <button
                  onClick={handleConfirmCheckIn}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                >
                  ✓ Confirm Check-In
                </button>
              </div>
            </div>
          )}

          {step === 'photo' && (
            <PhotoCapture onPhotoTaken={handlePhotoTaken} onSkip={handleSkipPhoto} />
          )}

          {step === 'observation' && (
            <ObservationPrompt
              siteName={site.name}
              speciesLikely={site.species_likely}
              onSubmit={handleObservationSubmit}
              onSkip={handleSkipObservation}
            />
          )}

          {step === 'submitting' && (
            <div className="bg-white rounded-lg p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900">
                Completing check-in...
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Calculating points and checking achievements
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Progress step component
function Step({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
          completed
            ? 'bg-green-600 text-white'
            : active
            ? 'bg-green-600 text-white ring-4 ring-green-100'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {completed ? '✓' : number}
      </div>
      <span className={`text-xs mt-1 ${active ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}

