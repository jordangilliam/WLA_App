/**
 * Location tracking service for FieldQuest
 * Handles GPS updates, permissions, and server reporting
 */

import * as Location from 'expo-location';
import type { LocationUpdate } from './types';

export interface LocationConfig {
  foregroundInterval: number; // milliseconds
  minDistance: number; // meters
  accuracy: Location.Accuracy;
}

const DEFAULT_CONFIG: LocationConfig = {
  foregroundInterval: 5000, // 5 seconds
  minDistance: 5, // 5 meters
  accuracy: Location.Accuracy.High,
};

type LocationCallback = (location: LocationUpdate) => void;

class LocationService {
  private subscription: Location.LocationSubscription | null = null;
  private lastLocation: LocationUpdate | null = null;
  private callbacks: Set<LocationCallback> = new Set();
  private isTracking = false;
  private config: LocationConfig = DEFAULT_CONFIG;

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<{
    granted: boolean;
    canAskAgain: boolean;
  }> {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain,
    };
  }

  /**
   * Check current permission status
   */
  async checkPermissions(): Promise<boolean> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Get current location once (doesn't start tracking)
   */
  async getCurrentLocation(): Promise<LocationUpdate | null> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const { granted } = await this.requestPermissions();
        if (!granted) return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: this.config.accuracy,
      });

      return this.formatLocation(location);
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Start continuous location tracking
   */
  async startTracking(config?: Partial<LocationConfig>): Promise<boolean> {
    if (this.isTracking) {
      console.warn('Location tracking already started');
      return true;
    }

    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const { granted } = await this.requestPermissions();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      // Merge config
      if (config) {
        this.config = { ...this.config, ...config };
      }

      // Start watching position
      this.subscription = await Location.watchPositionAsync(
        {
          accuracy: this.config.accuracy,
          distanceInterval: this.config.minDistance,
          timeInterval: this.config.foregroundInterval,
        },
        (location) => {
          const formatted = this.formatLocation(location);
          this.lastLocation = formatted;
          this.notifyCallbacks(formatted);
        }
      );

      this.isTracking = true;
      console.log('Location tracking started');
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  /**
   * Stop location tracking
   */
  stopTracking(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.isTracking = false;
    console.log('Location tracking stopped');
  }

  /**
   * Register callback for location updates
   */
  onLocationUpdate(callback: LocationCallback): () => void {
    this.callbacks.add(callback);
    
    // Immediately call with last location if available
    if (this.lastLocation) {
      callback(this.lastLocation);
    }

    // Return unsubscribe function
    return () => this.callbacks.delete(callback);
  }

  /**
   * Get last known location
   */
  getLastLocation(): LocationUpdate | null {
    return this.lastLocation;
  }

  /**
   * Check if currently tracking
   */
  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  /**
   * Format Expo location to our type
   */
  private formatLocation(location: Location.LocationObject): LocationUpdate {
    return {
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy,
        altitudeAccuracy: location.coords.altitudeAccuracy,
        heading: location.coords.heading,
        speed: location.coords.speed,
      },
      timestamp: location.timestamp,
    };
  }

  /**
   * Notify all callbacks of location update
   */
  private notifyCallbacks(location: LocationUpdate): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(location);
      } catch (error) {
        console.error('Error in location callback:', error);
      }
    });
  }

  /**
   * Get device heading/compass direction
   */
  async getHeading(): Promise<number | null> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });

      return location.coords.heading;
    } catch (error) {
      console.error('Error getting heading:', error);
      return null;
    }
  }
}

// Export singleton instance
export const locationService = new LocationService();

// Export class for testing
export { LocationService };

