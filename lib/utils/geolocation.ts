/**
 * Geolocation Utilities
 * High-accuracy GPS tracking, distance calculations, and location verification
 */

import type { Coordinates, Location, LocationBoundary } from '../types/location.types';

// ============================================================================
// Constants
// ============================================================================

const EARTH_RADIUS_KM = 6371;
const EARTH_RADIUS_METERS = 6371000;
const DEFAULT_CHECK_IN_RADIUS_METERS = 100; // Must be within 100m to check in
const HIGH_ACCURACY_THRESHOLD = 20; // Consider location accurate if within 20m

// ============================================================================
// Geolocation API Wrapper
// ============================================================================

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
}

export class GeolocationService {
  private watchId: number | null = null;
  private isWatching = false;

  /**
   * Check if geolocation is supported
   */
  static isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Get current position
   */
  async getCurrentPosition(options?: GeolocationOptions): Promise<Coordinates> {
    if (!GeolocationService.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: options?.enableHighAccuracy ?? true,
      timeout: options?.timeout ?? 10000,
      maximumAge: options?.maximumAge ?? 0,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude ?? undefined,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(this.handleError(error));
        },
        defaultOptions
      );
    });
  }

  /**
   * Watch position changes
   */
  watchPosition(
    callback: (coords: Coordinates) => void,
    errorCallback?: (error: Error) => void,
    options?: GeolocationOptions
  ): number {
    if (!GeolocationService.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: options?.enableHighAccuracy ?? true,
      timeout: options?.timeout ?? 10000,
      maximumAge: options?.maximumAge ?? 1000,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude ?? undefined,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        if (errorCallback) {
          errorCallback(this.handleError(error));
        }
      },
      defaultOptions
    );

    this.isWatching = true;
    return this.watchId;
  }

  /**
   * Stop watching position
   */
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  /**
   * Handle geolocation errors
   */
  private handleError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Location permission denied. Please enable location access in your browser settings.');
      case error.POSITION_UNAVAILABLE:
        return new Error('Location information unavailable. Please check your device settings.');
      case error.TIMEOUT:
        return new Error('Location request timed out. Please try again.');
      default:
        return new Error('An unknown error occurred while getting your location.');
    }
  }

  /**
   * Get watch status
   */
  getWatchStatus(): { isWatching: boolean; watchId: number | null } {
    return {
      isWatching: this.isWatching,
      watchId: this.watchId,
    };
  }
}

// ============================================================================
// Distance Calculations
// ============================================================================

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  const deltaLat = toRadians(coord2.latitude - coord1.latitude);
  const deltaLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Calculate total distance of a route (array of coordinates)
 */
export function calculateRouteDistance(coordinates: Coordinates[]): number {
  if (coordinates.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += calculateDistance(coordinates[i - 1], coordinates[i]);
  }

  return totalDistance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate bearing between two points (in degrees)
 */
export function calculateBearing(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360; // Normalize to 0-360
}

// ============================================================================
// Location Verification
// ============================================================================

/**
 * Check if user is within check-in radius of a location
 */
export function isWithinCheckInRadius(
  userCoords: Coordinates,
  location: Location,
  customRadius?: number
): boolean {
  const radius = customRadius ?? DEFAULT_CHECK_IN_RADIUS_METERS;
  const distance = calculateDistance(userCoords, location.coordinates);
  return distance <= radius;
}

/**
 * Check if user is within a location boundary
 */
export function isWithinBoundary(userCoords: Coordinates, boundary: LocationBoundary): boolean {
  switch (boundary.type) {
    case 'Point':
      // For point boundaries, check circle radius
      if (!boundary.radius) return false;
      const distance = calculateDistance(userCoords, boundary.coordinates[0]);
      return distance <= boundary.radius;

    case 'Circle':
      // Same as Point but more explicit
      if (!boundary.radius) return false;
      return calculateDistance(userCoords, boundary.coordinates[0]) <= boundary.radius;

    case 'Polygon':
      // Use ray casting algorithm for polygon containment
      return isPointInPolygon(userCoords, boundary.coordinates);

    default:
      return false;
  }
}

/**
 * Ray casting algorithm to determine if point is inside polygon
 */
function isPointInPolygon(point: Coordinates, polygon: Coordinates[]): boolean {
  let inside = false;
  const x = point.longitude;
  const y = point.latitude;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude;
    const yi = polygon[i].latitude;
    const xj = polygon[j].longitude;
    const yj = polygon[j].latitude;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Verify location accuracy is sufficient
 */
export function isAccuracySufficient(accuracy: number | undefined): boolean {
  if (!accuracy) return false;
  return accuracy <= HIGH_ACCURACY_THRESHOLD;
}

/**
 * Calculate confidence score for location verification (0-100)
 */
export function calculateLocationConfidence(
  userCoords: Coordinates,
  location: Location,
  customRadius?: number
): number {
  const radius = customRadius ?? DEFAULT_CHECK_IN_RADIUS_METERS;
  const distance = calculateDistance(userCoords, location.coordinates);

  // If outside radius, confidence is 0
  if (distance > radius) return 0;

  // Base confidence on distance (closer = higher confidence)
  let confidence = ((radius - distance) / radius) * 70; // Max 70 from distance

  // Add accuracy bonus
  if (userCoords.accuracy) {
    const accuracyScore = Math.max(0, 30 - userCoords.accuracy); // Up to 30 points
    confidence += accuracyScore;
  }

  return Math.min(100, Math.round(confidence));
}

// ============================================================================
// Geofencing
// ============================================================================

export interface GeofenceEvent {
  type: 'enter' | 'exit' | 'dwell';
  locationId: string;
  timestamp: Date;
  coordinates: Coordinates;
}

export class GeofenceManager {
  private monitoredLocations: Map<string, Location> = new Map();
  private userInsideLocations: Set<string> = new Set();
  private callbacks: Map<string, (event: GeofenceEvent) => void> = new Map();

  /**
   * Add location to monitor
   */
  addLocation(location: Location, callback?: (event: GeofenceEvent) => void): void {
    this.monitoredLocations.set(location.id, location);
    if (callback) {
      this.callbacks.set(location.id, callback);
    }
  }

  /**
   * Remove location from monitoring
   */
  removeLocation(locationId: string): void {
    this.monitoredLocations.delete(locationId);
    this.callbacks.delete(locationId);
    this.userInsideLocations.delete(locationId);
  }

  /**
   * Update user position and check geofences
   */
  updatePosition(userCoords: Coordinates): GeofenceEvent[] {
    const events: GeofenceEvent[] = [];

    for (const [locationId, location] of this.monitoredLocations) {
      const isInside = isWithinCheckInRadius(userCoords, location);
      const wasInside = this.userInsideLocations.has(locationId);

      if (isInside && !wasInside) {
        // User entered location
        const event: GeofenceEvent = {
          type: 'enter',
          locationId,
          timestamp: new Date(),
          coordinates: userCoords,
        };
        events.push(event);
        this.userInsideLocations.add(locationId);

        const callback = this.callbacks.get(locationId);
        if (callback) callback(event);
      } else if (!isInside && wasInside) {
        // User exited location
        const event: GeofenceEvent = {
          type: 'exit',
          locationId,
          timestamp: new Date(),
          coordinates: userCoords,
        };
        events.push(event);
        this.userInsideLocations.delete(locationId);

        const callback = this.callbacks.get(locationId);
        if (callback) callback(event);
      }
    }

    return events;
  }

  /**
   * Get locations user is currently inside
   */
  getCurrentLocations(): string[] {
    return Array.from(this.userInsideLocations);
  }

  /**
   * Clear all monitored locations
   */
  clear(): void {
    this.monitoredLocations.clear();
    this.callbacks.clear();
    this.userInsideLocations.clear();
  }
}

// ============================================================================
// Route Tracking
// ============================================================================

export interface RoutePoint extends Coordinates {
  timestamp: Date;
  speed?: number;
}

export class RouteTracker {
  private points: RoutePoint[] = [];
  private isTracking = false;
  private startTime?: Date;
  private geolocationService = new GeolocationService();

  /**
   * Start tracking route
   */
  startTracking(callback?: (point: RoutePoint) => void): void {
    if (this.isTracking) return;

    this.isTracking = true;
    this.startTime = new Date();
    this.points = [];

    this.geolocationService.watchPosition(
      (coords) => {
        const point: RoutePoint = {
          ...coords,
          timestamp: new Date(),
          speed: this.calculateSpeed(),
        };
        this.points.push(point);
        if (callback) callback(point);
      },
      (error) => {
        console.error('Route tracking error:', error);
        this.stopTracking();
      },
      { enableHighAccuracy: true, maximumAge: 1000 }
    );
  }

  /**
   * Stop tracking route
   */
  stopTracking(): void {
    this.isTracking = false;
    this.geolocationService.clearWatch();
  }

  /**
   * Get current route data
   */
  getRoute(): RoutePoint[] {
    return [...this.points];
  }

  /**
   * Get route statistics
   */
  getStatistics() {
    if (this.points.length < 2) {
      return {
        totalDistance: 0,
        duration: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        pointCount: this.points.length,
      };
    }

    const totalDistance = calculateRouteDistance(this.points);
    const duration = this.startTime
      ? (new Date().getTime() - this.startTime.getTime()) / 1000 / 60 // minutes
      : 0;

    const speeds = this.points.filter((p) => p.speed !== undefined).map((p) => p.speed!);
    const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;

    return {
      totalDistance,
      duration,
      averageSpeed,
      maxSpeed,
      pointCount: this.points.length,
    };
  }

  /**
   * Calculate current speed based on recent points
   */
  private calculateSpeed(): number | undefined {
    if (this.points.length < 2) return undefined;

    const recent = this.points.slice(-2);
    const distance = calculateDistance(recent[0], recent[1]);
    const timeDiff = (recent[1].timestamp.getTime() - recent[0].timestamp.getTime()) / 1000; // seconds

    if (timeDiff === 0) return undefined;
    return distance / timeDiff; // meters per second
  }

  /**
   * Clear route data
   */
  clear(): void {
    this.points = [];
    this.startTime = undefined;
  }

  /**
   * Export route as GeoJSON
   */
  exportAsGeoJSON() {
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: this.points.map((p) => [p.longitude, p.latitude, p.altitude || 0]),
      },
      properties: {
        timestamps: this.points.map((p) => p.timestamp.toISOString()),
        speeds: this.points.map((p) => p.speed),
        ...this.getStatistics(),
      },
    };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

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
 * Get cardinal direction from bearing
 */
export function getCardinalDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coords: Coordinates, precision: number = 6): string {
  return `${coords.latitude.toFixed(precision)}, ${coords.longitude.toFixed(precision)}`;
}

/**
 * Calculate bounding box for a set of coordinates
 */
export function calculateBounds(coordinates: Coordinates[]): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  if (coordinates.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 };
  }

  return coordinates.reduce(
    (bounds, coord) => ({
      north: Math.max(bounds.north, coord.latitude),
      south: Math.min(bounds.south, coord.latitude),
      east: Math.max(bounds.east, coord.longitude),
      west: Math.min(bounds.west, coord.longitude),
    }),
    {
      north: coordinates[0].latitude,
      south: coordinates[0].latitude,
      east: coordinates[0].longitude,
      west: coordinates[0].longitude,
    }
  );
}

/**
 * Find nearest location from current position
 */
export function findNearestLocation(
  userCoords: Coordinates,
  locations: Location[]
): { location: Location; distance: number } | null {
  if (locations.length === 0) return null;

  let nearest: { location: Location; distance: number } | null = null;

  for (const location of locations) {
    const distance = calculateDistance(userCoords, location.coordinates);
    if (!nearest || distance < nearest.distance) {
      nearest = { location, distance };
    }
  }

  return nearest;
}

/**
 * Find all locations within radius
 */
export function findLocationsWithinRadius(
  userCoords: Coordinates,
  locations: Location[],
  radiusMeters: number
): Array<{ location: Location; distance: number }> {
  return locations
    .map((location) => ({
      location,
      distance: calculateDistance(userCoords, location.coordinates),
    }))
    .filter((item) => item.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance);
}

