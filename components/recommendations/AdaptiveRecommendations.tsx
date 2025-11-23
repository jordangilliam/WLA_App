'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAdaptiveRecommendations, type UserProgress } from '@/lib/ai/recommendation-engine';
import Skeleton from '@/components/ui/Skeleton';

interface AdaptiveRecommendationsProps {
  userId: string;
  limit?: number;
  context?: {
    location?: {
      latitude: number;
      longitude: number;
      fieldSiteId?: string;
    };
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    season?: 'spring' | 'summer' | 'fall' | 'winter';
  };
}

export default function AdaptiveRecommendations({
  userId,
  limit = 5,
  context,
}: AdaptiveRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await fetch(
          `/api/recommendations/unified?limit=${limit}${context?.location?.fieldSiteId ? `&siteId=${context.location.fieldSiteId}` : ''}`
        );
        if (!response.ok) throw new Error('Failed to load recommendations');
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [userId, limit, context]);

  const getContentIcon = (type: string) => {
    const icons: Record<string, string> = {
      pillar_content: '📚',
      mission: '🗺️',
      challenge: '🎯',
      lesson: '📖',
    };
    return icons[type] || '📝';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🔍</div>
        <p className="text-gray-600">No recommendations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec) => (
        <Link
          key={rec.id}
          href={rec.path || '#'}
          className="block p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4">
            {rec.heroImageUrl ? (
              <Image
                src={rec.heroImageUrl}
                alt={rec.title}
                width={80}
                height={80}
                className="rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl flex-shrink-0">
                {getContentIcon(rec.type)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{rec.title}</h3>
                {rec.score && (
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {Math.round(rec.score * 100)}% match
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{rec.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {rec.pillarTitle && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {rec.pillarTitle}
                  </span>
                )}
                {rec.difficulty && (
                  <span className="capitalize">{rec.difficulty}</span>
                )}
                {rec.progressPercent !== undefined && (
                  <span className="text-blue-600">
                    {Math.round(rec.progressPercent)}% complete
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

