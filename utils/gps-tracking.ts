/**
 * GPS Tracking Utility
 * 
 * Provides GPS tracking, waypoint management, and GPX export for field work.
 * Works offline and caches track data locally.
 */

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface Waypoint {
  id: string;
  name: string;
  description?: string;
  coordinate: GPSCoordinate;
  type: 'observation' | 'catch' | 'access' | 'hazard' | 'photo' | 'custom';
  icon?: string;
  photos?: string[];
  notes?: string;
}

export interface GPSTrack {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  coordinates: GPSCoordinate[];
  waypoints: Waypoint[];
  distance?: number; // in meters
  duration?: number; // in seconds
  averageSpeed?: number; // in m/s
  elevationGain?: number; // in meters
  elevationLoss?: number; // in meters
}

export class GPSTracker {
  private watchId: number | null = null;
  private currentTrack: GPSTrack | null = null;
  private isTracking: boolean = false;
  private onUpdateCallback?: (track: GPSTrack) => void;

  /**
   * Start tracking GPS location
   */
  startTracking(trackName: string, onUpdate?: (track: GPSTrack) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isTracking) {
        reject(new Error('Already tracking'));
        return;
      }

      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      // Initialize new track
      this.currentTrack = {
        id: Date.now().toString(),
        name: trackName,
        startTime: Date.now(),
        coordinates: [],
        waypoints: [],
      };

      this.onUpdateCallback = onUpdate;

      // Start watching position
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (!this.currentTrack) return;

          const coordinate: GPSCoordinate = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || undefined,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          this.currentTrack.coordinates.push(coordinate);
          this.updateTrackStats();

          // Save to local storage
          this.saveTrack();

          // Callback with updated track
          if (this.onUpdateCallback && this.currentTrack) {
            this.onUpdateCallback({ ...this.currentTrack });
          }

          if (!this.isTracking) {
            this.isTracking = true;
            resolve();
          }
        },
        (error) => {
          console.error('GPS Error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Stop tracking GPS location
   */
  stopTracking(): GPSTrack | null {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.currentTrack) {
      this.currentTrack.endTime = Date.now();
      this.currentTrack.duration = Math.floor(
        (this.currentTrack.endTime - this.currentTrack.startTime) / 1000
      );
      this.updateTrackStats();
      this.saveTrack();
    }

    this.isTracking = false;
    const track = this.currentTrack;
    this.currentTrack = null;
    return track;
  }

  /**
   * Add a waypoint to the current track
   */
  addWaypoint(waypoint: Omit<Waypoint, 'id' | 'coordinate'>): Waypoint | null {
    if (!this.currentTrack || !this.isTracking) {
      console.error('No active track');
      return null;
    }

    // Get current position
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newWaypoint: Waypoint = {
            ...waypoint,
            id: Date.now().toString(),
            coordinate: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude || undefined,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            },
          };

          this.currentTrack!.waypoints.push(newWaypoint);
          this.saveTrack();

          if (this.onUpdateCallback && this.currentTrack) {
            this.onUpdateCallback({ ...this.currentTrack });
          }

          resolve(newWaypoint);
        },
        (error) => {
          console.error('Failed to get position for waypoint:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    }) as any;
  }

  /**
   * Calculate track statistics
   */
  private updateTrackStats(): void {
    if (!this.currentTrack || this.currentTrack.coordinates.length < 2) {
      return;
    }

    const coords = this.currentTrack.coordinates;
    let totalDistance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;

    for (let i = 1; i < coords.length; i++) {
      // Calculate distance
      totalDistance += this.calculateDistance(
        coords[i - 1].latitude,
        coords[i - 1].longitude,
        coords[i].latitude,
        coords[i].longitude
      );

      // Calculate elevation changes
      if (coords[i - 1].altitude && coords[i].altitude) {
        const elevChange = coords[i].altitude! - coords[i - 1].altitude!;
        if (elevChange > 0) {
          elevationGain += elevChange;
        } else {
          elevationLoss += Math.abs(elevChange);
        }
      }
    }

    this.currentTrack.distance = totalDistance;
    this.currentTrack.elevationGain = elevationGain;
    this.currentTrack.elevationLoss = elevationLoss;

    // Calculate average speed
    if (this.currentTrack.coordinates.length >= 2) {
      const duration =
        (coords[coords.length - 1].timestamp - coords[0].timestamp) / 1000;
      this.currentTrack.averageSpeed = duration > 0 ? totalDistance / duration : 0;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(
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

    return R * c;
  }

  /**
   * Save track to local storage
   */
  private saveTrack(): void {
    if (!this.currentTrack) return;

    try {
      const tracks = this.getAllTracks();
      const index = tracks.findIndex((t) => t.id === this.currentTrack!.id);

      if (index >= 0) {
        tracks[index] = this.currentTrack;
      } else {
        tracks.push(this.currentTrack);
      }

      localStorage.setItem('wla-gps-tracks', JSON.stringify(tracks));
    } catch (error) {
      console.error('Failed to save track:', error);
    }
  }

  /**
   * Get all saved tracks
   */
  getAllTracks(): GPSTrack[] {
    try {
      const stored = localStorage.getItem('wla-gps-tracks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load tracks:', error);
      return [];
    }
  }

  /**
   * Delete a track
   */
  deleteTrack(trackId: string): void {
    try {
      const tracks = this.getAllTracks().filter((t) => t.id !== trackId);
      localStorage.setItem('wla-gps-tracks', JSON.stringify(tracks));
    } catch (error) {
      console.error('Failed to delete track:', error);
    }
  }

  /**
   * Export track to GPX format
   */
  exportToGPX(track: GPSTrack): string {
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="WLA Conservation App" 
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${this.escapeXml(track.name)}</name>
    <time>${new Date(track.startTime).toISOString()}</time>
  </metadata>
  ${track.waypoints
    .map(
      (wp) => `
  <wpt lat="${wp.coordinate.latitude}" lon="${wp.coordinate.longitude}">
    <ele>${wp.coordinate.altitude || 0}</ele>
    <time>${new Date(wp.coordinate.timestamp).toISOString()}</time>
    <name>${this.escapeXml(wp.name)}</name>
    ${wp.description ? `<desc>${this.escapeXml(wp.description)}</desc>` : ''}
    <type>${wp.type}</type>
  </wpt>`
    )
    .join('')}
  <trk>
    <name>${this.escapeXml(track.name)}</name>
    <trkseg>
${track.coordinates
  .map(
    (coord) => `      <trkpt lat="${coord.latitude}" lon="${coord.longitude}">
        <ele>${coord.altitude || 0}</ele>
        <time>${new Date(coord.timestamp).toISOString()}</time>
      </trkpt>`
  )
  .join('\n')}
    </trkseg>
  </trk>
</gpx>`;

    return gpx;
  }

  /**
   * Download GPX file
   */
  downloadGPX(track: GPSTrack): void {
    const gpxContent = this.exportToGPX(track);
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${track.name.replace(/\s+/g, '_')}_${track.id}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Get current tracking status
   */
  getStatus(): {
    isTracking: boolean;
    currentTrack: GPSTrack | null;
  } {
    return {
      isTracking: this.isTracking,
      currentTrack: this.currentTrack,
    };
  }

  /**
   * Format distance for display
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    } else if (meters < 10000) {
      return `${(meters / 1000).toFixed(2)} km`;
    } else {
      return `${Math.round(meters / 1000)} km`;
    }
  }

  /**
   * Format duration for display
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  /**
   * Format speed for display
   */
  static formatSpeed(metersPerSecond: number): string {
    const kmPerHour = metersPerSecond * 3.6;
    return `${kmPerHour.toFixed(1)} km/h`;
  }
}

// Export singleton instance
export const gpsTracker = new GPSTracker();

