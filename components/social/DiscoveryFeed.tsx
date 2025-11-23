'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Skeleton from '@/components/ui/Skeleton';

interface Discovery {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'observation' | 'achievement' | 'species' | 'mission';
  title: string;
  description?: string;
  imageUrl?: string;
  timestamp: Date;
  location?: string;
  points?: number;
  link?: string;
}

interface DiscoveryFeedProps {
  classId?: string;
  limit?: number;
}

export default function DiscoveryFeed({ classId, limit = 20 }: DiscoveryFeedProps) {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDiscoveries() {
      try {
        const url = `/api/social/feed${classId ? `?classId=${classId}` : ''}&limit=${limit}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load feed');
        const data = await response.json();
        setDiscoveries(data.discoveries || []);
      } catch (error) {
        console.error('Error loading discovery feed:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDiscoveries();
  }, [classId, limit]);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      observation: '🔍',
      achievement: '🏆',
      species: '🦋',
      mission: '🗺️',
    };
    return icons[type] || '📝';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (discoveries.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-600">No discoveries yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Share your observations and achievements to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discoveries.map((discovery) => {
        const content = (
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                {discovery.userAvatar ? (
                  <Image
                    src={discovery.userAvatar}
                    alt={discovery.userName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {discovery.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{getTypeIcon(discovery.type)}</span>
                  <span className="font-semibold text-gray-900">{discovery.userName}</span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(discovery.timestamp), { addSuffix: true })}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-1">{discovery.title}</h3>
                {discovery.description && (
                  <p className="text-sm text-gray-600 mb-2">{discovery.description}</p>
                )}

                {discovery.imageUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <Image
                      src={discovery.imageUrl}
                      alt={discovery.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {discovery.location && (
                    <span className="flex items-center gap-1">
                      <span>📍</span>
                      {discovery.location}
                    </span>
                  )}
                  {discovery.points && (
                    <span className="flex items-center gap-1">
                      <span>🪙</span>
                      +{discovery.points} points
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

        return discovery.link ? (
          <Link key={discovery.id} href={discovery.link}>
            {content}
          </Link>
        ) : (
          <div key={discovery.id}>{content}</div>
        );
      })}
    </div>
  );
}

