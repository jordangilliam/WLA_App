'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CollectionsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20 md:pb-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-3xl font-bold mb-2">My Collection</h1>
            <p className="text-purple-100">
              Discover and collect all the amazing sites and species across Pennsylvania!
            </p>
          </div>
        </div>
      </div>

      {/* Collection Categories */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sites Collection */}
          <Link
            href="/collections/sites"
            className="group bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl hover:border-green-500 transition-all"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Field Sites</h2>
              <p className="text-gray-600 mb-4">
                Explore and collect all 140+ sites across Pennsylvania
              </p>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-green-600">0/140+</div>
                <div className="text-sm text-green-700">Sites Visited</div>
              </div>
              <div className="text-green-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                View Collection →
              </div>
            </div>
          </Link>

          {/* Species Collection */}
          <Link
            href="/collections/species"
            className="group bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl hover:border-blue-500 transition-all"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🦋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Species</h2>
              <p className="text-gray-600 mb-4">
                Document and collect Pennsylvania&rsquo;s incredible wildlife
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-blue-600">0/150+</div>
                <div className="text-sm text-blue-700">Species Observed</div>
              </div>
              <div className="text-blue-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                View Collection →
              </div>
            </div>
          </Link>
        </div>

        {/* Achievement Teasers */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-3">🏆 Collection Milestones</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">🔓</div>
                <div className="text-xs font-semibold">10 Sites</div>
                <div className="text-xs opacity-90">Explorer</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-xs font-semibold">50 Sites</div>
                <div className="text-xs opacity-90">Adventurer</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-xs font-semibold">All Sites</div>
                <div className="text-xs opacity-90">Master Explorer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3">💡 Collection Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Check in at new sites to add them to your collection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Take photos of wildlife to document new species</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Rare sites and species are worth more points!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Complete your collection to unlock exclusive rewards</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

