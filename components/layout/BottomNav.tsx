'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface BottomNavProps {
  notificationCounts?: {
    achievements: number;
    journal: number;
  };
}

export default function BottomNav({ notificationCounts }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showCheckInAnimation, setShowCheckInAnimation] = useState(false);

  const isActive = (path: string) => {
    if (path === '/explore') {
      return pathname === '/explore' || pathname === '/map';
    }
    if (path === '/journal-new') {
      return pathname === '/journal-new' || pathname === '/journal';
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  const handleNavigation = (path: string) => {
    // Haptic feedback on native
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins.Haptics?.impact({ style: 'light' });
      } catch (e) {
        // Haptics not available
      }
    }
    
    router.push(path);
  };

  const handleCheckIn = () => {
    // Haptic feedback
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins.Haptics?.impact({ style: 'medium' });
      } catch (e) {
        // Haptics not available
      }
    }

    setShowCheckInAnimation(true);
    setTimeout(() => setShowCheckInAnimation(false), 300);
    
    // Navigate to explore with check-in intent
    router.push('/explore?action=checkin');
  };

  const tabs = [
    {
      id: 'explore',
      path: '/explore',
      icon: '🗺️',
      label: 'Explore',
      activeColor: 'text-green-600',
      activeBg: 'bg-green-50',
    },
    {
      id: 'journal',
      path: '/journal-new',
      icon: '📝',
      label: 'Journal',
      activeColor: 'text-blue-600',
      activeBg: 'bg-blue-50',
      badge: notificationCounts?.journal || 0,
    },
    {
      id: 'checkin',
      path: '#',
      icon: '➕',
      label: 'Check-In',
      isFAB: true,
    },
    {
      id: 'achievements',
      path: '/achievements',
      icon: '🏆',
      label: 'Achievements',
      activeColor: 'text-purple-600',
      activeBg: 'bg-purple-50',
      badge: notificationCounts?.achievements || 0,
    },
    {
      id: 'profile',
      path: '/profile',
      icon: '👤',
      label: 'Profile',
      activeColor: 'text-gray-600',
      activeBg: 'bg-gray-50',
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around px-2 h-16 max-w-md mx-auto">
          {tabs.map((tab, index) => {
            if (tab.isFAB) {
              // Center Floating Action Button
              return (
                <button
                  key={tab.id}
                  onClick={handleCheckIn}
                  className={`relative flex flex-col items-center justify-center transition-all ${
                    showCheckInAnimation ? 'scale-110' : 'scale-100'
                  }`}
                  style={{
                    width: '64px',
                    height: '64px',
                    marginTop: '-32px',
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg flex items-center justify-center text-white text-2xl hover:from-green-600 hover:to-green-700 active:scale-95 transition-all">
                    {tab.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-1">
                    {tab.label}
                  </span>
                </button>
              );
            }

            const active = isActive(tab.path);

            return (
              <button
                key={tab.id}
                onClick={() => handleNavigation(tab.path)}
                className="relative flex-1 flex flex-col items-center justify-center py-2 transition-all active:scale-95"
              >
                {/* Badge */}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute top-1 right-1/2 translate-x-3 -translate-y-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}

                {/* Icon with background */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all ${
                    active
                      ? `${tab.activeBg} ${tab.activeColor}`
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.icon}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium mt-1 transition-colors ${
                    active ? tab.activeColor : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop variant intentionally omitted to keep footer area clean */}

      {/* Spacer for mobile to prevent content from being hidden behind fixed nav */}
      <div className="md:hidden h-16"></div>

      <style jsx global>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}

