'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePoints } from '@/ui/points/PointsProvider';
import StreakCalendar from '@/components/gamification/StreakCalendar';
import Skeleton from '@/components/ui/Skeleton';

interface StudentProfileProps {
  userId: string;
  isOwnProfile?: boolean;
}

interface ProfileData {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  achievements: number;
  observations: number;
  speciesIdentified: number;
  missionsCompleted: number;
  favoritePillars: string[];
  recentDiscoveries: any[];
}

export default function StudentProfile({ userId, isOwnProfile = false }: StudentProfileProps) {
  const { total: points, level, currentStreak, badges } = usePoints();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`/api/social/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to load profile');
        const data = await response.json();
        setProfile(data.profile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-start gap-6">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-white"
            />
          ) : (
            <div className="w-30 h-30 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-5xl font-bold border-4 border-white">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
            {profile.bio && <p className="text-blue-100 mb-4">{profile.bio}</p>}
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold">{points}</div>
                <div className="text-blue-100">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Level {level}</div>
                <div className="text-blue-100">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{currentStreak}</div>
                <div className="text-blue-100">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.achievements}</div>
                <div className="text-blue-100">Achievements</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-3xl mb-2">🔍</div>
          <div className="text-2xl font-bold text-gray-900">{profile.observations}</div>
          <div className="text-sm text-gray-600">Observations</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-3xl mb-2">🦋</div>
          <div className="text-2xl font-bold text-gray-900">{profile.speciesIdentified}</div>
          <div className="text-sm text-gray-600">Species</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-3xl mb-2">🗺️</div>
          <div className="text-2xl font-bold text-gray-900">{profile.missionsCompleted}</div>
          <div className="text-sm text-gray-600">Missions</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-gray-900">{profile.achievements}</div>
          <div className="text-sm text-gray-600">Badges</div>
        </div>
      </div>

      {/* Streak Calendar */}
      {isOwnProfile && (
        <StreakCalendar currentStreak={currentStreak} />
      )}

      {/* Favorite Pillars */}
      {profile.favoritePillars.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Favorite Topics</h2>
          <div className="flex flex-wrap gap-2">
            {profile.favoritePillars.map((pillar) => (
              <span
                key={pillar}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

