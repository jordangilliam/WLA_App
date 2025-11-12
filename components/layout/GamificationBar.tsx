'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePoints } from '@/ui/points/PointsProvider';
import { useNavigation } from '@/lib/contexts/NavigationContext';

interface GamificationBarProps {
  notificationCount?: number;
}

export default function GamificationBar({
  notificationCount = 0,
}: GamificationBarProps) {
  const { setShowSearch } = useNavigation();
  const pathname = usePathname();
  const { total: points, currentStreak } = usePoints();
  
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsDelta, setPointsDelta] = useState(0);
  const [prevPoints, setPrevPoints] = useState(0);
  const [streakPulsing, setStreakPulsing] = useState(false);

  // Detect points change and show animation
  useEffect(() => {
    const currentPoints = points || 0;
    if (currentPoints > prevPoints && prevPoints > 0) {
      const delta = currentPoints - prevPoints;
      setPointsDelta(delta);
      setShowPointsAnimation(true);
      
      setTimeout(() => {
        setShowPointsAnimation(false);
        setPrevPoints(currentPoints);
      }, 2000);
    } else if (currentPoints !== prevPoints) {
      setPrevPoints(currentPoints);
    }
  }, [points, prevPoints]);

  // Streak pulsing animation (active today)
  useEffect(() => {
    if (currentStreak > 0) {
      setStreakPulsing(true);
      const interval = setInterval(() => {
        setStreakPulsing((prev) => !prev);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [currentStreak]);

  // Show back button on specific pages
  const showBackButton = pathname !== '/' && pathname !== '/explore' && pathname !== '/journal-new' && pathname !== '/achievements' && pathname !== '/profile';

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo/Back */}
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-1 text-white hover:text-green-100 transition-colors"
              >
                <span className="text-xl">←</span>
                <span className="text-sm font-medium hidden sm:inline">Back</span>
              </button>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 text-white hover:text-green-100 transition-colors"
              >
                <span className="text-2xl">🌲</span>
                <span className="font-bold text-lg hidden sm:inline">WildPraxis</span>
              </Link>
            )}
          </div>

          {/* Right: Gamification Elements */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Points Counter */}
            <Link
              href="/profile"
              className="relative flex items-center gap-1.5 px-3 py-1.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all backdrop-blur-sm"
            >
              <span className="text-amber-300 text-lg">🪙</span>
              <span className="font-bold text-white">{(points || 0).toLocaleString()}</span>
              
              {/* Points gain animation */}
              {showPointsAnimation && (
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-amber-300 font-bold text-sm animate-float">
                  +{pointsDelta}
                </span>
              )}
            </Link>

            {/* Streak Counter */}
            {currentStreak > 0 && (
              <Link
                href="/profile"
                className={`flex items-center gap-1.5 px-3 py-1.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all backdrop-blur-sm ${
                  streakPulsing ? 'animate-pulse' : ''
                }`}
              >
                <span className="text-orange-300 text-lg">🔥</span>
                <span className="font-bold text-white">{currentStreak}</span>
              </Link>
            )}

            {/* Notifications */}
            <Link
              href="/achievements"
              className="relative flex items-center justify-center w-9 h-9 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all backdrop-blur-sm"
            >
              <span className="text-xl">🔔</span>
              
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>

            {/* Search Icon */}
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center justify-center w-9 h-9 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all backdrop-blur-sm"
              title="Search content"
            >
              <span className="text-xl">🔍</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
        }

        .animate-float {
          animation: float 2s ease-out forwards;
        }
      `}</style>
    </header>
  );
}

