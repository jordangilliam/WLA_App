/**
 * Geographic utilities for FieldQuest
 * Haversine distance, geofencing, anti-cheat movement validation
 */

import type { Coordinates, MovementCheck } from './types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if user is within geofence radius of target
 */
export function isWithinGeofence(
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number,
  radius: number
): boolean {
  const distance = calculateDistance(userLat, userLon, targetLat, targetLon);
  return distance <= radius;
}

/**
 * Validate movement is physically possible (anti-cheat)
 * @returns Object with validation result and calculated speed
 */
export function isPossibleMovement(
  prevLat: number,
  prevLon: number,
  prevTime: number, // Unix timestamp in ms
  newLat: number,
  newLon: number,
  newTime: number // Unix timestamp in ms
): MovementCheck {
  const distance = calculateDistance(prevLat, prevLon, newLat, newLon);
  const timeDiff = (newTime - prevTime) / 1000; // seconds
  
  if (timeDiff <= 0) {
    return { possible: false, speed: 0, distance, time_diff: timeDiff };
  }

  const speed = distance / timeDiff; // m/s

  // Max reasonable speed: 40 m/s (~144 km/h)
  // Allows for cars/trains but catches teleportation
  const possible = speed < 40;

  return { possible, speed, distance, time_diff: timeDiff };
}

/**
 * Get compass bearing between two points
 * @returns Bearing in degrees (0-360)
 */
export function getBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;

  return bearing;
}

/**
 * Generate random point within radius of center
 * Useful for spawning wildlife near field sites
 */
export function generateRandomPoint(
  centerLat: number,
  centerLon: number,
  radiusMeters: number
): Coordinates {
  // Random distance and angle
  const distance = Math.random() * radiusMeters;
  const angle = Math.random() * 2 * Math.PI;

  // Convert to lat/lng offsets
  const latOffset = (distance / 111320) * Math.cos(angle);
  const lonOffset =
    (distance / (111320 * Math.cos((centerLat * Math.PI) / 180))) *
    Math.sin(angle);

  return {
    latitude: centerLat + latOffset,
    longitude: centerLon + lonOffset,
  };
}

/**
 * Check if coordinate is within bounds (for restricting to PA)
 */
export function isWithinPennsylvania(lat: number, lon: number): boolean {
  // Pennsylvania bounding box (approximate)
  const PA_BOUNDS = {
    north: 42.5,
    south: 39.7,
    east: -74.7,
    west: -80.5,
  };

  return (
    lat >= PA_BOUNDS.south &&
    lat <= PA_BOUNDS.north &&
    lon >= PA_BOUNDS.west &&
    lon <= PA_BOUNDS.east
  );
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

/**
 * Get time of day based on hour
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Calculate XP needed for next level
 */
export function xpForNextLevel(currentLevel: number): number {
  // Level 1: 100 XP, Level 2: 400 XP, Level 3: 900 XP...
  // Formula: (level)^2 * 100
  return (currentLevel + 1) * (currentLevel + 1) * 100;
}

/**
 * Calculate current level from total XP
 */
export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

/**
 * Get rarity color for UI
 */
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return '#9E9E9E';
    case 'uncommon': return '#4CAF50';
    case 'rare': return '#2196F3';
    case 'epic': return '#9C27B0';
    case 'legendary': return '#FF9800';
    default: return '#9E9E9E';
  }
}

