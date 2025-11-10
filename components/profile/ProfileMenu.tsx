'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePoints } from '@/ui/points/PointsProvider';
import SoundSettings from '@/components/settings/SoundSettings';

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const { total: points, level, currentStreak, badges } = usePoints();
  const [activeSection, setActiveSection] = useState<'progress' | 'learn' | 'settings'>('progress');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🌲</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to WildPraxis</h2>
          <p className="text-gray-600 mb-6">Sign in to track your progress and unlock achievements</p>
          <Link
            href="/auth"
            className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const isTeacher = session?.user?.role === 'teacher';
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 pb-20 md:pb-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold">{session?.user?.name || 'Student'}</h1>
              <p className="text-green-100">{session?.user?.email}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{points}</div>
              <div className="text-xs text-green-100">Points</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-xs text-green-100">Day Streak</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{level}</div>
              <div className="text-xs text-green-100">Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveSection('progress')}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              activeSection === 'progress'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Progress
          </button>
          <button
            onClick={() => setActiveSection('learn')}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              activeSection === 'learn'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Learn More
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              activeSection === 'settings'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Progress Section */}
        {activeSection === 'progress' && (
          <div className="space-y-4">
            <Link
              href="/collections"
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📦</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Collection</h3>
                    <p className="text-sm text-gray-600">Sites visited and species observed</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Link>

            <Link
              href="/journal-new"
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📝</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Visit History</h3>
                    <p className="text-sm text-gray-600">View all your field observations</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Link>

            <Link
              href="/achievements"
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Achievements</h3>
                    <p className="text-sm text-gray-600">{badges.filter(b => b.earned).length} unlocked</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Link>

            {isTeacher && (
              <Link
                href="/dashboard/teacher"
                className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👨‍🏫</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Teacher Dashboard</h3>
                      <p className="text-sm text-gray-600">Manage classes and students</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Learn More Section */}
        {activeSection === 'learn' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Educational Modules</h3>
              <div className="space-y-2">
                <Link href="/birds" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🦜 Birds
                </Link>
                <Link href="/fishing" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🎣 Fishing
                </Link>
                <Link href="/gobblers" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🦃 Gobblers
                </Link>
                <Link href="/terrestrials" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🦌 Terrestrials
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Identification Keys</h3>
              <div className="space-y-2">
                <Link href="/keys/macro" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🔬 Macroinvertebrates
                </Link>
                <Link href="/keys/plants" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🌿 Plants
                </Link>
                <Link href="/keys/bugs" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🐛 Bugs
                </Link>
                <Link href="/keys/insects" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🦋 Insects
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Additional Resources</h3>
              <div className="space-y-2">
                <Link href="/habitat" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🏕️ Habitat
                </Link>
                <Link href="/stocking" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🎣 Stocking Calendar
                </Link>
                <Link href="/outreach" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  📢 Outreach
                </Link>
                <Link href="/media" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  🎥 Media
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Account</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{session?.user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className="text-gray-900 capitalize">{session?.user?.role || 'student'}</span>
                </div>
              </div>
            </div>

            {/* Sound Settings */}
            <SoundSettings />

            {(isTeacher || isAdmin) && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Tools</h3>
                <div className="space-y-2">
                  <Link href="/exports" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                    💾 Export Data
                  </Link>
                  {isAdmin && (
                    <Link href="/admin/dashboard" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Help & Info</h3>
              <div className="space-y-2">
                <a
                  href="https://wildlifeleadershipacademy.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700"
                >
                  🌲 WLA Website
                </a>
                <Link href="/offline" className="block px-3 py-2 hover:bg-green-50 rounded text-gray-700">
                  📱 Offline Mode
                </Link>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

