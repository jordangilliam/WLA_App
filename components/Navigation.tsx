'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/map', icon: '🗺️', label: 'Map' },
    { href: '/species', icon: '🐟', label: 'Species' },
    { href: '/missions', icon: '🎯', label: 'Missions' },
    { href: '/profile', icon: '👤', label: 'Profile' },
  ];

  const menuItems = [
    { href: '/achievements', icon: '🏆', label: 'Achievements' },
    { href: '/leaderboard', icon: '📊', label: 'Leaderboard' },
    { href: '/challenges', icon: '⚡', label: 'Challenges' },
    { href: '/shop', icon: '🛒', label: 'Shop' },
    { href: '/experts', icon: '🎓', label: 'Experts' },
    { href: '/style-guide', icon: '🎨', label: 'Style Guide' },
  ];

  return (
    <>
      {/* Main Bottom Navigation - Always Visible */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-2xl z-50 safe-bottom">
        <div className="flex justify-around items-center px-2 py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 transform active:scale-95 ${
                  isActive
                    ? 'text-wla-blue bg-cyan-50'
                    : 'text-neutral-600 hover:text-wla-blue hover:bg-neutral-50'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-semibold">{item.label}</span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-wla-blue rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute -top-12 right-4 w-12 h-12 bg-gradient-to-br from-wla-blue to-wla-orange text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Slide-Up Menu Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-all duration-300 z-40 ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '70vh', paddingBottom: '80px' }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full"></div>
        </div>

        {/* Menu Header */}
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Menu</h2>
              <p className="text-sm text-neutral-600">Explore more features</p>
            </div>
            <div className="flex gap-2">
              <span className="text-3xl">🐟</span>
              <span className="text-3xl">🦅</span>
              <span className="text-3xl">🦌</span>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 180px)' }}>
          <div className="grid grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95"
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm font-semibold text-neutral-700 text-center">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Quick Stats Section */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-4 border border-cyan-200">
              <div className="text-3xl font-bold text-wla-blue">127</div>
              <div className="text-sm text-cyan-700 font-semibold">Species Found</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
              <div className="text-3xl font-bold text-wla-orange">45</div>
              <div className="text-sm text-orange-700 font-semibold">Missions Done</div>
            </div>
          </div>

          {/* Settings & Help */}
          <div className="mt-6 space-y-3">
            <Link
              href="/settings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚙️</span>
                <span className="font-semibold text-neutral-700">Settings</span>
              </div>
              <span className="text-neutral-400">→</span>
            </Link>
            <Link
              href="/help"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">❓</span>
                <span className="font-semibold text-neutral-700">Help & Support</span>
              </div>
              <span className="text-neutral-400">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

