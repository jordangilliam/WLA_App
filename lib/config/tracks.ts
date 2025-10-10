/**
 * Track configuration and theming
 */

import type { Track, TrackInfo } from '../types/lesson.types';

export const TRACKS: Record<Track, TrackInfo> = {
  'Brookies': {
    id: 'Brookies',
    name: 'Brookies',
    emoji: '🎣',
    description: 'Cold water streams & brook trout conservation',
    color: '#0077B6',
    gradient: 'linear-gradient(135deg, #0077B6, #023047)',
  },
  'Bass': {
    id: 'Bass',
    name: 'Bass',
    emoji: '🐟',
    description: 'Warm water fisheries & lake ecology',
    color: '#06D6A0',
    gradient: 'linear-gradient(135deg, #06D6A0, #0077B6)',
  },
  'Bucktails': {
    id: 'Bucktails',
    name: 'Bucktails',
    emoji: '🦌',
    description: 'Wildlife management & white-tailed deer conservation',
    color: '#8B4513',
    gradient: 'linear-gradient(135deg, #D2691E, #8B4513)',
  },
  'Gobblers': {
    id: 'Gobblers',
    name: 'Gobblers',
    emoji: '🦃',
    description: 'Wild turkey & upland game birds',
    color: '#9D4EDD',
    gradient: 'linear-gradient(135deg, #9D4EDD, #7209B7)',
  },
  'Ursids': {
    id: 'Ursids',
    name: 'Ursids',
    emoji: '🐻',
    description: 'Black bears & forest ecosystems',
    color: '#2C1810',
    gradient: 'linear-gradient(135deg, #3E2723, #1B0F0A)',
  },
  'All': {
    id: 'All',
    name: 'All Tracks',
    emoji: '🌲',
    description: 'General conservation education',
    color: '#023047',
    gradient: 'linear-gradient(135deg, #023047, #000000)',
  },
};

export function getTrackInfo(track: Track): TrackInfo {
  return TRACKS[track] || TRACKS.All;
}

export function getAllTracks(): Track[] {
  return Object.keys(TRACKS) as Track[];
}

export function getTrackColor(track: Track): string {
  return TRACKS[track]?.color || '#023047';
}

export function getTrackGradient(track: Track): string {
  return TRACKS[track]?.gradient || 'linear-gradient(135deg, #023047, #000000)';
}

