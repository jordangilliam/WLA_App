'use client';

import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Observation {
  id: string;
  latitude: number;
  longitude: number;
  speciesName: string;
  count: number;
  timestamp: Date;
}

interface SpeciesMapProps {
  observations: Observation[];
  speciesFilter?: string[];
  onObservationClick?: (observation: Observation) => void;
}

export default function SpeciesMap({
  observations,
  speciesFilter,
  onObservationClick,
}: SpeciesMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [-79.9959, 40.4406], // Pittsburgh default
      zoom: 10,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Filter observations
    const filtered = speciesFilter
      ? observations.filter((obs) => speciesFilter.includes(obs.speciesName))
      : observations;

    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach((marker) => marker.remove());

    // Add markers for each observation
    filtered.forEach((obs) => {
      const el = document.createElement('div');
      el.className = 'species-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getSpeciesColor(obs.speciesName);
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      el.addEventListener('click', () => {
        if (onObservationClick) {
          onObservationClick(obs);
        }
      });

      new mapboxgl.Marker(el)
        .setLngLat([obs.longitude, obs.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${obs.speciesName}</h3>
              <p class="text-sm">Count: ${obs.count}</p>
              <p class="text-xs text-gray-500">${new Date(obs.timestamp).toLocaleDateString()}</p>
            </div>
          `)
        )
        .addTo(map.current!);
    });

    // Fit map to bounds
    if (filtered.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filtered.forEach((obs) => {
        bounds.extend([obs.longitude, obs.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [observations, speciesFilter, mapLoaded, onObservationClick]);

  const getSpeciesColor = (speciesName: string): string => {
    // Generate consistent color from species name
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
    ];
    const index = speciesName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

