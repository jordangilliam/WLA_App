'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapFieldSite {
  id: string;
  name: string;
  site_type: string;
  latitude: number;
  longitude: number;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  distance_meters?: number;
}

interface InteractiveMapProps {
  sites: MapFieldSite[];
  userLocation: { latitude: number; longitude: number } | null;
  selectedSite: MapFieldSite | null;
  onSiteSelect: (site: MapFieldSite) => void;
}

// Site type to color mapping
const SITE_TYPE_COLORS: Record<string, string> = {
  library: '#3B82F6', // blue
  park: '#10B981', // green
  state_park: '#059669', // dark green
  university: '#8B5CF6', // purple
  sports: '#F59E0B', // orange
  greenway: '#06B6D4', // cyan
  landmark: '#EC4899', // pink
};

// Site type to emoji mapping
const SITE_TYPE_ICONS: Record<string, string> = {
  library: '📚',
  park: '🌲',
  state_park: '🏞️',
  university: '🎓',
  sports: '⚽',
  greenway: '🚶',
  landmark: '🏛️',
};

export default function InteractiveMap({
  sites,
  userLocation,
  selectedSite,
  onSiteSelect,
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const initialUserLocation = useRef(userLocation);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Get Mapbox token from environment
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token not configured');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Create map instance
    const centerCoords: [number, number] = initialUserLocation.current
      ? [initialUserLocation.current.longitude, initialUserLocation.current.latitude]
      : [-79.9959, 40.4406];
    const initialZoom = initialUserLocation.current ? 12 : 10;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: centerCoords,
      zoom: initialZoom,
      pitch: 0,
      bearing: 0,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocation control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    );

    // Mark map as loaded
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Cleanup
    return () => {
      markers.current.forEach((marker) => marker.remove());
      if (userMarker.current) userMarker.current.remove();
      if (map.current) map.current.remove();
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    // Remove existing user marker
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Create user location marker
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #3B82F6;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      cursor: pointer;
    `;

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<div style="padding: 8px;"><strong>Your Location</strong></div>'
        )
      )
      .addTo(map.current);

    // Center map on user location
    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 12,
      duration: 1000,
    });
  }, [userLocation, mapLoaded]);

  // Update site markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add site markers
    sites.forEach((site) => {
      const el = document.createElement('div');
      el.className = 'site-marker';
      el.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: ${SITE_TYPE_COLORS[site.site_type] || '#6B7280'};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: transform 0.2s;
      `;
      el.innerHTML = SITE_TYPE_ICONS[site.site_type] || '📍';
      el.title = site.name;

      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Click handler
      el.addEventListener('click', () => {
        onSiteSelect(site);
      });

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([site.longitude, site.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 12px; min-width: 200px;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">
                ${site.name}
              </div>
              <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                ${site.site_type}
              </div>
              ${
                site.distance_meters
                  ? `<div style="font-size: 12px; color: #059669;">
                      📏 ${(site.distance_meters / 1000).toFixed(1)} km away
                    </div>`
                  : ''
              }
              <button 
                onclick="window.dispatchEvent(new CustomEvent('selectSite', { detail: '${site.id}' }))"
                style="
                  margin-top: 8px;
                  width: 100%;
                  padding: 6px 12px;
                  background-color: #10B981;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 12px;
                  font-weight: 500;
                "
              >
                View Details
              </button>
            </div>
          `)
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit bounds to show all sites
    if (sites.length > 0 && userLocation) {
      const bounds = new mapboxgl.LngLatBounds();

      // Add user location
      bounds.extend([userLocation.longitude, userLocation.latitude]);

      // Add all sites
      sites.forEach((site) => {
        bounds.extend([site.longitude, site.latitude]);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14,
      });
    }
  }, [sites, mapLoaded, userLocation, onSiteSelect]);

  // Highlight selected site
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedSite) return;

    // Fly to selected site
    map.current.flyTo({
      center: [selectedSite.longitude, selectedSite.latitude],
      zoom: 15,
      duration: 1000,
    });

    // Open popup for selected site
    const selectedMarker = markers.current.find((marker) => {
      const lngLat = marker.getLngLat();
      return (
        lngLat.lng === selectedSite.longitude && lngLat.lat === selectedSite.latitude
      );
    });

    if (selectedMarker) {
      selectedMarker.togglePopup();
    }
  }, [selectedSite, mapLoaded]);

  // Listen for custom event from popup
  useEffect(() => {
    const handleSelectSite = (event: any) => {
      const siteId = event.detail;
      const site = sites.find((s) => s.id === siteId);
      if (site) {
        onSiteSelect(site);
      }
    };

    window.addEventListener('selectSite', handleSelectSite);
    return () => window.removeEventListener('selectSite', handleSelectSite);
  }, [sites, onSiteSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">Site Types</div>
        <div className="space-y-1">
          {Object.entries(SITE_TYPE_ICONS).map(([type, icon]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="text-sm">{icon}</span>
              <span className="text-xs text-gray-600 capitalize">{type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

