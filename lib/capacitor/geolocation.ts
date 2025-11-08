/**
 * Capacitor Geolocation plugin wrapper
 * Cross-platform location services for field trip check-ins
 */

import { Geolocation, Position, PermissionStatus } from '@capacitor/geolocation'

export interface LocationCoords {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number
  speed?: number
  heading?: number
}

/**
 * Get current position
 */
export async function getCurrentPosition(): Promise<LocationCoords> {
  try {
    const position: Position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude ?? undefined,
      speed: position.coords.speed ?? undefined,
      heading: position.coords.heading ?? undefined,
    }
  } catch (error) {
    console.error('Error getting position:', error)
    throw new Error('Failed to get current position')
  }
}

/**
 * Watch position changes
 */
export function watchPosition(
  callback: (position: LocationCoords) => void,
  errorCallback?: (error: any) => void
) {
  const watchId = Geolocation.watchPosition(
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
    (position, error) => {
      if (error) {
        errorCallback?.(error)
        return
      }

      if (position) {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude ?? undefined,
          speed: position.coords.speed ?? undefined,
          heading: position.coords.heading ?? undefined,
        })
      }
    }
  )

  return watchId
}

/**
 * Clear position watch
 */
export async function clearWatch(watchId: string) {
  await Geolocation.clearWatch({ id: watchId })
}

/**
 * Request location permissions
 */
export async function requestLocationPermissions(): Promise<boolean> {
  try {
    const permissions: PermissionStatus = await Geolocation.requestPermissions()
    return permissions.location === 'granted'
  } catch (error) {
    console.error('Error requesting location permissions:', error)
    return false
  }
}

/**
 * Check location permissions
 */
export async function checkLocationPermissions(): Promise<boolean> {
  try {
    const permissions: PermissionStatus = await Geolocation.checkPermissions()
    return permissions.location === 'granted'
  } catch (error) {
    console.error('Error checking location permissions:', error)
    return false
  }
}

