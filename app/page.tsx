'use client';

import { useSession } from 'next-auth/react';
import { usePoints } from '@/ui/points/PointsProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const { total: points, level, currentStreak } = usePoints();
  const router = useRouter();

  // If logged in, show personalized dashboard
  if (status === 'authenticated') {
    return <LoggedInHome points={points} level={level} streak={currentStreak} />;
  }

  // If not logged in, show landing page
  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20 md:pb-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-block px-4 py-2 bg-yellow-400 text-green-900 rounded-full text-sm font-bold mb-6">
            Wildlife Leadership Academy
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
            Explore Nature.<br />Earn Achievements.<br />Make an Impact.
          </h1>
          
          <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join Pennsylvania&rsquo;s premier conservation app for youth. Check in at field sites, document wildlife, and become a conservation leader.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="px-8 py-4 bg-yellow-400 text-green-900 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 bg-white bg-opacity-20 text-white rounded-full font-bold text-lg hover:bg-opacity-30 transition-all backdrop-blur-sm"
            >
              Explore Sites
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">140+</div>
              <div className="text-sm text-green-100">Field Sites</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-green-100">Active Users</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">67</div>
              <div className="text-sm text-green-100">PA Counties</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How WildPraxis Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Explore</h3>
            <p className="text-gray-600 mb-4">
              Discover 140+ field sites across Pennsylvania—parks, streams, libraries, and conservation areas.
            </p>
            <Link href="/explore" className="text-green-600 font-medium hover:text-green-700">
              View Map →
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Document</h3>
            <p className="text-gray-600 mb-4">
              Check in at sites, take photos, record observations, and contribute to citizen science.
            </p>
            <Link href="/journal-new" className="text-green-600 font-medium hover:text-green-700">
              Start Journal →
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Achieve</h3>
            <p className="text-gray-600 mb-4">
              Earn points, unlock achievements, build streaks, and compete on leaderboards.
            </p>
            <Link href="/achievements" className="text-green-600 font-medium hover:text-green-700">
              View Achievements →
            </Link>
          </div>
        </div>
      </div>

      {/* Special Features */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎣 Trout Stocking Calendar
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Get real-time updates on trout stocking schedules across 16+ Pennsylvania waters. Plan your fishing trips with accurate, up-to-date information from the PA Fish & Boat Commission.
              </p>
              <Link
                href="/stocking"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View Stocking Schedule
              </Link>
            </div>

            <div className="bg-blue-50 rounded-lg p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-700">12 Streams & 4 Lakes</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-700">Auto-Updated Schedules</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-700">Stocking Notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-700">Regulations & Safety Info</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Your Conservation Journey?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join hundreds of students exploring Pennsylvania&rsquo;s natural heritage.
        </p>
        <Link
          href="/auth"
          className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
        >
          Sign Up Now - It&rsquo;s Free
        </Link>
      </div>
    </div>
  );
}

function LoggedInHome({ points, level, streak }: { points: number; level: number; streak: number }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20 md:pb-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome Back! 🌲</h1>
          <p className="text-green-100">Ready to explore and make an impact today?</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/explore?action=checkin')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
          >
            <div className="text-3xl mb-2">📍</div>
            <div className="font-bold">Check In</div>
          </button>

          <button
            onClick={() => router.push('/explore')}
            className="bg-white border-2 border-green-600 text-green-700 rounded-lg p-6 text-center hover:bg-green-50 transition-all"
          >
            <div className="text-3xl mb-2">🗺️</div>
            <div className="font-bold">Explore</div>
          </button>

          <button
            onClick={() => router.push('/journal-new')}
            className="bg-white border-2 border-blue-600 text-blue-700 rounded-lg p-6 text-center hover:bg-blue-50 transition-all"
          >
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold">Journal</div>
          </button>

          <button
            onClick={() => router.push('/stocking')}
            className="bg-white border-2 border-purple-600 text-purple-700 rounded-lg p-6 text-center hover:bg-purple-50 transition-all"
          >
            <div className="text-3xl mb-2">🎣</div>
            <div className="font-bold">Stocking</div>
          </button>
        </div>
      </div>

      {/* Featured Sites */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Locations</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-1">Schenley Park</h3>
            <p className="text-sm text-gray-600 mb-3">456 acres of urban nature in Pittsburgh</p>
            <button
              onClick={() => router.push('/explore')}
              className="text-green-600 text-sm font-medium hover:text-green-700"
            >
              View on Map →
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-1">Yellow Creek State Park</h3>
            <p className="text-sm text-gray-600 mb-3">722-acre lake perfect for fishing</p>
            <button
              onClick={() => router.push('/stocking')}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              View Stocking →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Your Journey</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Build Your Streak!</h3>
              <p className="text-sm text-gray-600">Visit a new site to keep your streak alive</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/explore')}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Find Sites Nearby
            </button>
            <button
              onClick={() => router.push('/achievements')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
