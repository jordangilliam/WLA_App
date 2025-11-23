'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContentRail from './ContentRail';
import Skeleton from '@/components/ui/Skeleton';

interface Mission {
  id: string;
  title: string;
  synopsis: string;
  heroImageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  startAt?: string;
  endAt?: string;
}

export default function MissionCarousel() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMissions() {
      try {
        const response = await fetch('/api/story-missions?limit=5');
        if (!response.ok) {
          // Handle 500 errors gracefully (e.g., missing database table)
          if (response.status === 500) {
            setError('Missions temporarily unavailable');
            setMissions([]);
            setLoading(false);
            return;
          }
          throw new Error('Failed to load missions');
        }
        const data = await response.json();
        setMissions(data.missions || []);
        setError(null);
      } catch (error) {
        console.error('Error loading missions:', error);
        setError('Unable to load missions');
        setMissions([]);
      } finally {
        setLoading(false);
      }
    }
    loadMissions();
  }, []);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  const renderMissionCard = (mission: Mission) => (
    <Link
      href={`/missions?mission=${mission.id}`}
      className="block w-72 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
    >
      {mission.heroImageUrl ? (
        <div className="relative h-40 w-full">
          <Image
            src={mission.heroImageUrl}
            alt={mission.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <span className="text-4xl">🗺️</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{mission.title}</h3>
          {mission.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[mission.difficulty]}`}>
              {mission.difficulty}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{mission.synopsis}</p>
        <div className="flex items-center text-xs text-gray-500">
          <span>Start Mission →</span>
        </div>
      </div>
    </Link>
  );

  // Don't render if there's an error (e.g., database table missing)
  if (error) {
    return null; // Fail silently - missions feature not available
  }

  if (loading) {
    return (
      <ContentRail
        title="Featured Missions"
        subtitle="Explore conservation stories and field research"
        items={[1, 2, 3]}
        renderItem={(_, index) => (
          <div key={index} className="w-72">
            <Skeleton className="h-40 rounded-t-xl" />
            <Skeleton className="h-32 rounded-b-xl mt-2" />
          </div>
        )}
      />
    );
  }

  // Don't render if no missions available
  if (missions.length === 0) {
    return null;
  }

  return (
    <ContentRail
      title="Featured Missions"
      subtitle="Explore conservation stories and field research"
      items={missions}
      renderItem={renderMissionCard}
      viewAllHref="/missions"
      viewAllLabel="View All Missions"
      emptyMessage="No active missions at the moment"
      emptyIcon="🗺️"
    />
  );
}

