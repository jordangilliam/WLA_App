/**
 * Background location tracking for spawn notifications
 * Runs every 10 minutes to check for nearby rare spawns
 */

import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { NotificationService } from './notifications'
import { calculateDistance } from './geo'
import { api } from './api'

const BACKGROUND_LOCATION_TASK = 'background-location-task'
const BACKGROUND_CHECK_INTERVAL = 10 * 60 * 1000 // 10 minutes

interface BackgroundLocationData {
  locations: Location.LocationObject[]
}

// Define the background task
TaskManager.defineTask<BackgroundLocationData>(
  BACKGROUND_LOCATION_TASK,
  async ({ data, error }) => {
    if (error) {
      console.error('Background location task error:', error)
      return
    }

    if (data) {
      const { locations } = data
      const location = locations[0]

      if (location) {
        try {
          await checkNearbySpawnsAndNotify(
            location.coords.latitude,
            location.coords.longitude
          )
        } catch (err) {
          console.error('Error checking nearby spawns:', err)
        }
      }
    }
  }
)

/**
 * Check for nearby spawns and notify user
 */
async function checkNearbySpawnsAndNotify(
  lat: number,
  lng: number
): Promise<void> {
  try {
    // Fetch nearby data
    const nearby = await api.getNearby(lat, lng, 300)

    // Check for rare+ spawns
    for (const spawn of nearby.spawns || []) {
      const rarity = spawn.species?.rarity
      
      if (['rare', 'epic', 'legendary'].includes(rarity)) {
        const distance = calculateDistance(lat, lng, spawn.lat, spawn.lng)

        // Notify if within 300m
        if (distance <= 300) {
          await NotificationService.notifyNearbySpawn(
            spawn.species.common_name,
            rarity,
            Math.round(distance)
          )
        }
      }
    }

    // Check for nearby active events
    for (const event of nearby.active_events || []) {
      const eventStart = new Date(event.start_time)
      const now = new Date()
      const minutesUntilStart = Math.floor(
        (eventStart.getTime() - now.getTime()) / 60000
      )

      // Notify if event starts within next hour
      if (minutesUntilStart > 0 && minutesUntilStart <= 60) {
        await NotificationService.notifyFieldTripEvent(
          event.name,
          event.field_sites?.name || 'a field site',
          event.start_time
        )
      }
    }
  } catch (error) {
    console.error('Failed to check nearby spawns:', error)
  }
}

export class BackgroundLocationService {
  /**
   * Request background location permissions
   */
  static async requestPermissions(): Promise<boolean> {
    // First request foreground
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync()

    if (foregroundStatus !== 'granted') {
      console.warn('Foreground location permission not granted')
      return false
    }

    // Then request background
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync()

    if (backgroundStatus !== 'granted') {
      console.warn('Background location permission not granted')
      return false
    }

    return true
  }

  /**
   * Start background location tracking
   */
  static async start(): Promise<boolean> {
    try {
      // Check if task is already registered
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_LOCATION_TASK
      )

      if (isRegistered) {
        console.log('Background location task already running')
        return true
      }

      // Start background location updates
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: BACKGROUND_CHECK_INTERVAL,
        distanceInterval: 0, // Use time interval only
        foregroundService: {
          notificationTitle: 'FieldQuest Active',
          notificationBody: 'Checking for nearby wildlife...',
          notificationColor: '#D97706',
        },
        pausesUpdatesAutomatically: true,
        activityType: Location.ActivityType.Fitness,
      })

      console.log('Background location tracking started')
      return true
    } catch (error) {
      console.error('Failed to start background location:', error)
      return false
    }
  }

  /**
   * Stop background location tracking
   */
  static async stop(): Promise<void> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_LOCATION_TASK
      )

      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
        console.log('Background location tracking stopped')
      }
    } catch (error) {
      console.error('Failed to stop background location:', error)
    }
  }

  /**
   * Check if background location is running
   */
  static async isTracking(): Promise<boolean> {
    return await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK)
  }

  /**
   * Get background location status
   */
  static async getStatus(): Promise<{
    hasPermission: boolean
    isTracking: boolean
  }> {
    const { status: foregroundStatus } =
      await Location.getForegroundPermissionsAsync()
    const { status: backgroundStatus } =
      await Location.getBackgroundPermissionsAsync()

    const hasPermission =
      foregroundStatus === 'granted' && backgroundStatus === 'granted'
    const isTracking = await this.isTracking()

    return { hasPermission, isTracking }
  }
}

