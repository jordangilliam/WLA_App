'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Confetti from 'react-confetti';

function CheckInSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Get params from URL
  const points = parseInt(searchParams.get('points') || '10');
  const firstVisit = searchParams.get('firstVisit') === 'true';
  const siteName = searchParams.get('siteName') || 'this location';
  const achievements = searchParams.get('achievements')?.split(',').filter(Boolean) || [];

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      {/* Confetti */}
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-bounce-in">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
            <span className="text-6xl animate-pulse">✓</span>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {firstVisit ? '🎉 First Visit!' : 'Check-In Successful!'}
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          You checked in at <span className="font-semibold">{siteName}</span>
        </p>

        {/* Points Earned */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <div className="text-5xl font-bold text-green-600 mb-2">
            +{points}
          </div>
          <div className="text-lg font-medium text-green-800">Points Earned!</div>
          {firstVisit && (
            <div className="mt-2 text-sm text-green-700">
              Includes +15 bonus for first visit! 🌟
            </div>
          )}
        </div>

        {/* Achievements Unlocked */}
        {achievements.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold text-yellow-900 mb-2">
              Achievement{achievements.length > 1 ? 's' : ''} Unlocked!
            </div>
            <div className="space-y-2">
              {achievements.map((achievement, idx) => (
                <div key={idx} className="text-sm font-medium text-yellow-800">
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/journal?addObservation=true')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            📝 Add Observation
          </button>

          <button
            onClick={() => router.push('/explore')}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            🗺️ Find More Sites
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            View Your Stats →
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
        >
          Close
        </button>
      </div>

      {/* Inline styles for animation */}
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}

export default function CheckInSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <CheckInSuccessContent />
    </Suspense>
  );
}

