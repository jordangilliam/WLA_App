'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ProgressHeatmapProps {
  timeFilter: 'week' | 'month' | 'all';
  mapStyle: 'heatmap' | 'pins' | 'paths';
}

export default function ProgressHeatmap({ timeFilter, mapStyle }: ProgressHeatmapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN || '';
    
    if (!mapboxToken) {
      console.error('Mapbox access token not found');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-79.9959, 40.4406], // Pittsburgh
      zoom: 10,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map visualization based on filters
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Mock visited sites data
    const visitedSites = [
      { lng: -79.9959, lat: 40.4406, visits: 3, name: 'Schenley Park' },
      { lng: -79.9879, lat: 40.4444, visits: 1, name: 'Carnegie Library' },
      { lng: -80.0095, lat: 40.4417, visits: 2, name: 'Point State Park' },
      { lng: -80.0000, lat: 40.4500, visits: 1, name: 'Frick Park' },
      { lng: -79.9800, lat: 40.4300, visits: 4, name: 'Highland Park' },
    ];

    // Clear existing layers and sources
    if (map.current!.getLayer('visit-heatmap')) {
      map.current!.removeLayer('visit-heatmap');
    }
    if (map.current!.getLayer('visit-pins')) {
      map.current!.removeLayer('visit-pins');
    }
    if (map.current!.getLayer('visit-paths')) {
      map.current!.removeLayer('visit-paths');
    }
    if (map.current!.getSource('visits')) {
      map.current!.removeSource('visits');
    }
    if (map.current!.getSource('paths')) {
      map.current!.removeSource('paths');
    }

    // Remove existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Add data based on map style
    if (mapStyle === 'heatmap') {
      // Heatmap visualization
      map.current!.addSource('visits', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: visitedSites.map(site => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [site.lng, site.lat],
            },
            properties: {
              visits: site.visits,
            },
          })),
        },
      });

      map.current!.addLayer({
        id: 'visit-heatmap',
        type: 'heatmap',
        source: 'visits',
        paint: {
          'heatmap-weight': ['get', 'visits'],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)',
          ],
          'heatmap-radius': 30,
          'heatmap-opacity': 0.8,
        },
      });
    } else if (mapStyle === 'pins') {
      // Pin visualization
      visitedSites.forEach(site => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = `${30 + site.visits * 5}px`;
        el.style.height = `${30 + site.visits * 5}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = site.visits > 2 ? '#10B981' : site.visits > 1 ? '#3B82F6' : '#6B7280';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontWeight = 'bold';
        el.style.color = 'white';
        el.style.fontSize = '12px';
        el.textContent = site.visits.toString();

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([site.lng, site.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${site.name}</div>
                <div style="font-size: 12px; color: #666;">Visited ${site.visits} time${site.visits > 1 ? 's' : ''}</div>
              </div>`
            )
          )
          .addTo(map.current!);
      });
    } else if (mapStyle === 'paths') {
      // Path visualization (connecting visited sites)
      const coordinates = visitedSites.map(site => [site.lng, site.lat]);

      map.current!.addSource('paths', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
          properties: {},
        },
      });

      map.current!.addLayer({
        id: 'visit-paths',
        type: 'line',
        source: 'paths',
        paint: {
          'line-color': '#10B981',
          'line-width': 3,
          'line-opacity': 0.7,
        },
      });

      // Add markers for sites
      visitedSites.forEach(site => {
        const el = document.createElement('div');
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#10B981';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        new mapboxgl.Marker(el)
          .setLngLat([site.lng, site.lat])
          .setPopup(new mapboxgl.Popup({ offset: 15 }).setHTML(`<strong>${site.name}</strong>`))
          .addTo(map.current!);
      });
    }
  }, [mapLoaded, mapStyle, timeFilter]);

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-[500px] w-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-semibold text-gray-700 mb-2">Visit Frequency</div>
        {mapStyle === 'heatmap' ? (
          <div className="flex items-center gap-2">
            <div className="w-16 h-3 rounded-full" style={{ 
              background: 'linear-gradient(to right, rgb(103,169,207), rgb(253,219,199), rgb(178,24,43))' 
            }}></div>
            <span className="text-xs text-gray-600">Low → High</span>
          </div>
        ) : mapStyle === 'pins' ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-500"></div>
              <span className="text-xs">1 visit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500"></div>
              <span className="text-xs">2 visits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <span className="text-xs">3+ visits</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-green-500 rounded"></div>
            <span className="text-xs">Your journey</span>
          </div>
        )}
      </div>
    </div>
  );
}

