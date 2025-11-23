'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContentRail from './ContentRail';
import Skeleton from '@/components/ui/Skeleton';

interface NearbySite {
  id: string;
  name: string;
  description?: string;
  site_type?: string;
  distance_meters?: number;
  latitude: number;
  longitude: number;
}

export default function NearbySitesRail() {
  const [sites, setSites] = useState<NearbySite[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    async function loadNearbySites() {
      if (!userLocation) return;
      
      try {
        const response = await fetch(
          `/api/locations/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=10000`
        );
        if (!response.ok) throw new Error('Failed to load nearby sites');
        const data = await response.json();
        setSites((data.sites || []).slice(0, 5));
      } catch (error) {
        console.error('Error loading nearby sites:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNearbySites();
  }, [userLocation]);

  const formatDistance = (meters?: number): string => {
    if (!meters) return '';
    if (meters < 1000) return `${Math.round(meters)}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  const getSiteTypeIcon = (siteType?: string): string => {
    const icons: Record<string, string> = {
      stream: '🌊',
      lake: '🏞️',
      park: '🌲',
      state_park: '🌳',
      wildlife_area: '🦌',
      default: '📍',
    };
    return icons[siteType || 'default'] || icons.default;
  };

  const renderSiteCard = (site: NearbySite) => (
    <Link
      href={`/explore?site=${site.id}`}
      className="block w-64 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="text-3xl">{getSiteTypeIcon(site.site_type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{site.name}</h3>
            {site.site_type && (
              <p className="text-xs text-gray-500 capitalize mt-1">{site.site_type.replace('_', ' ')}</p>
            )}
          </div>
        </div>
        {site.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{site.description}</p>
        )}
        {site.distance_meters && (
          <div className="flex items-center text-xs text-blue-600 font-semibold">
            <span>📍 {formatDistance(site.distance_meters)}</span>
          </div>
        )}
      </div>
    </Link>
  );

  if (loading) {
    return (
      <ContentRail
        title="Nearby Sites"
        subtitle="Field sites within 10km of your location"
        items={[1, 2, 3]}
        renderItem={(_, index) => (
          <div key={index} className="w-64">
            <Skeleton className="h-32 rounded-xl" />
          </div>
        )}
      />
    );
  }

  if (!userLocation) {
    return (
      <ContentRail
        title="Nearby Sites"
        subtitle="Enable location to see sites near you"
        items={[]}
        renderItem={() => null}
        emptyMessage="Enable location services to see nearby field sites"
        emptyIcon="📍"
      />
    );
  }

  return (
    <ContentRail
      title="Nearby Sites"
      subtitle="Field sites within 10km of your location"
      items={sites}
      renderItem={renderSiteCard}
      viewAllHref="/explore"
      viewAllLabel="View All Sites"
      emptyMessage="No sites found nearby. Try exploring the map!"
      emptyIcon="🗺️"
    />
  );
}

