'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function MainNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  return (
    <nav
      className="bg-gradient-to-r from-green-700 via-green-600 to-blue-700 shadow-lg sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-bold text-xl hover:text-green-100 transition-colors flex items-center gap-2"
          >
            <span className="text-2xl">🌲</span>
            <span>WildPraxis</span>
          </Link>

          {/* Main Menu */}
          <div className="flex items-center gap-1">
            {/* Learn Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('learn')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  isActive('/learn') || isActive('/birds') || isActive('/fishing')
                    ? 'bg-white text-green-700'
                    : 'text-white hover:bg-green-500'
                }`}
              >
                📚 Learn
                <span className="text-xs">▼</span>
              </button>
              {openDropdown === 'learn' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <Link href="/birds" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🦜 Birds
                  </Link>
                  <Link href="/fishing" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🎣 Fishing
                  </Link>
                  <Link href="/gobblers" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🦃 Gobblers
                  </Link>
                  <Link href="/terrestrials" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🦌 Terrestrials
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link href="/keys/macro" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🔬 Macroinvertebrates
                  </Link>
                  <Link href="/keys/plants" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🌿 Plants
                  </Link>
                  <Link href="/keys/bugs" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🐛 Bugs
                  </Link>
                  <Link href="/habitat" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🏕️ Habitat
                  </Link>
                </div>
              )}
            </div>

            {/* Field Work Dropdown - NEW FEATURES! */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('fieldwork')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  isActive('/explore') || isActive('/journal') || isActive('/stocking')
                    ? 'bg-white text-green-700'
                    : 'text-white hover:bg-green-500'
                }`}
              >
                🔬 Field Work
                <span className="text-xs">▼</span>
              </button>
              {openDropdown === 'fieldwork' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <div className="px-4 py-2 text-xs font-semibold text-green-700 uppercase">
                    Explore
                  </div>
                  <Link href="/explore" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🗺️ Interactive Map
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      New!
                    </span>
                  </Link>
                  <Link href="/map" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    📍 Classic Map
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-4 py-2 text-xs font-semibold text-green-700 uppercase">
                    Record
                  </div>
                  <Link href="/journal-new" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    📝 Observations
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      New!
                    </span>
                  </Link>
                  <Link href="/journal" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    📸 Photo Journal
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-4 py-2 text-xs font-semibold text-blue-700 uppercase">
                    Fishing
                  </div>
                  <Link href="/stocking" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🎣 Stocking Calendar
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      New!
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Games Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('games')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  isActive('/games') || isActive('/achievements')
                    ? 'bg-white text-green-700'
                    : 'text-white hover:bg-green-500'
                }`}
              >
                🎮 Games
                <span className="text-xs">▼</span>
              </button>
              {openDropdown === 'games' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <Link href="/achievements" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🏆 Achievements
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      New!
                    </span>
                  </Link>
                  <Link href="/games" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🎯 Challenges
                  </Link>
                  <Link href="/leaderboard" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    📊 Leaderboard
                  </Link>
                </div>
              )}
            </div>

            {/* Community Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('community')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  isActive('/outreach') || isActive('/media')
                    ? 'bg-white text-green-700'
                    : 'text-white hover:bg-green-500'
                }`}
              >
                👥 Community
                <span className="text-xs">▼</span>
              </button>
              {openDropdown === 'community' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <Link href="/outreach" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    📢 Outreach
                  </Link>
                  <Link href="/media" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    🎥 Media
                  </Link>
                  <Link href="/jobs" className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                    💼 Jobs
                  </Link>
                </div>
              )}
            </div>

            {/* Profile */}
            <Link
              href="/auth"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/auth') || isActive('/dashboard')
                  ? 'bg-white text-green-700'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              👤 Profile
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-xl">🌲</span>
              <span>WildPraxis</span>
            </Link>
          </div>

          {/* Mobile Menu Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/explore"
              className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors"
            >
              <span>🗺️</span>
              <span>Explore</span>
            </Link>
            <Link
              href="/journal-new"
              className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors"
            >
              <span>📝</span>
              <span>Journal</span>
            </Link>
            <Link
              href="/stocking"
              className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors"
            >
              <span>🎣</span>
              <span>Stocking</span>
            </Link>
            <Link
              href="/achievements"
              className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors"
            >
              <span>🏆</span>
              <span>Achievements</span>
            </Link>
            <Link
              href="/learn"
              className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors"
            >
              <span>📚</span>
              <span>Learn</span>
            </Link>
            <Link
              href="/auth"
              className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors"
            >
              <span>👤</span>
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Close dropdown on click outside */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenDropdown(null)}
        ></div>
      )}
    </nav>
  );
}

