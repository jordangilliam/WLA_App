/**
 * Geofence Manager
 * Handles geofence detection with smoothing, accuracy validation, and state management
 */

import type { MissionLocation } from '@/components/missions/MissionMapHooks'

interface GeofenceState {
  locationId: string
  enteredAt: number | null
  exitedAt: number | null
  isInside: boolean
  confidence: number // 0-1, based on consistent readings
  readings: Array<{
    timestamp: number
    isInside: boolean
    distance: number
    accuracy: number
  }>
}

interface GeofenceManagerOptions {
  smoothingWindow?: number // ms - how long to smooth readings
  minConfidence?: number // 0-1 - minimum confidence to trigger enter/exit
  requiredReadings?: number // number of consistent readings needed
}

export class GeofenceManager {
  private states = new Map<string, GeofenceState>()
  private options: Required<GeofenceManagerOptions>
  private callbacks = new Map<string, Set<(state: GeofenceState) => void>>()

  constructor(options: GeofenceManagerOptions = {}) {
    this.options = {
      smoothingWindow: options.smoothingWindow ?? 5000, // 5 seconds
      minConfidence: options.minConfidence ?? 0.7, // 70% confidence
      requiredReadings: options.requiredReadings ?? 3, // 3 consistent readings
    }
  }

  /**
   * Check if user is inside geofence with smoothing
   */
  checkGeofence(
    location: MissionLocation,
    userLat: number,
    userLon: number,
    accuracy: number
  ): GeofenceState {
    const distance = this.calculateDistance(
      userLat,
      userLon,
      location.latitude,
      location.longitude
    )

    const isInside = distance <= location.radius
    const timestamp = Date.now()

    // Get or create state
    let state = this.states.get(location.id)
    if (!state) {
      state = {
        locationId: location.id,
        enteredAt: null,
        exitedAt: null,
        isInside: false,
        confidence: 0,
        readings: [],
      }
      this.states.set(location.id, state)
    }

    // Add reading
    state.readings.push({
      timestamp,
      isInside,
      distance,
      accuracy,
    })

    // Keep only recent readings within smoothing window
    const cutoff = timestamp - this.options.smoothingWindow
    state.readings = state.readings.filter((r) => r.timestamp > cutoff)

    // Calculate confidence based on consistent readings
    if (state.readings.length >= this.options.requiredReadings) {
      const recentReadings = state.readings.slice(-this.options.requiredReadings)
      const consistentReadings = recentReadings.filter((r) => r.isInside === isInside).length
      state.confidence = consistentReadings / recentReadings.length
    } else {
      state.confidence = state.readings.length / this.options.requiredReadings
    }

    // Update state if confidence is high enough
    if (state.confidence >= this.options.minConfidence) {
      const wasInside = state.isInside
      state.isInside = isInside

      // Trigger enter event
      if (!wasInside && isInside && state.enteredAt === null) {
        state.enteredAt = timestamp
        state.exitedAt = null
        this.notifyCallbacks(location.id, state)
      }

      // Trigger exit event
      if (wasInside && !isInside && state.exitedAt === null) {
        state.exitedAt = timestamp
        this.notifyCallbacks(location.id, state)
      }
    }

    return state
  }

  /**
   * Calculate distance between two points (Haversine)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000 // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * Subscribe to geofence state changes
   */
  subscribe(locationId: string, callback: (state: GeofenceState) => void): () => void {
    if (!this.callbacks.has(locationId)) {
      this.callbacks.set(locationId, new Set())
    }
    this.callbacks.get(locationId)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.callbacks.get(locationId)?.delete(callback)
    }
  }

  /**
   * Notify callbacks of state change
   */
  private notifyCallbacks(locationId: string, state: GeofenceState): void {
    this.callbacks.get(locationId)?.forEach((callback) => {
      try {
        callback(state)
      } catch (error) {
        console.error('Geofence callback error:', error)
      }
    })
  }

  /**
   * Get current state for a location
   */
  getState(locationId: string): GeofenceState | undefined {
    return this.states.get(locationId)
  }

  /**
   * Reset state for a location
   */
  reset(locationId: string): void {
    this.states.delete(locationId)
    this.callbacks.delete(locationId)
  }

  /**
   * Reset all states
   */
  resetAll(): void {
    this.states.clear()
    this.callbacks.clear()
  }
}

export const geofenceManager = new GeofenceManager()


