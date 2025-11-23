/**
 * AR Map Hooks for Location-Based Mission Triggers
 * 
 * This component provides hooks and utilities for integrating missions
 * with location-based features, similar to Pokémon GO's geofencing.
 * 
 * Features:
 * - Geofence detection for mission sites
 * - AR overlay triggers when near mission locations
 * - Location-based stage progression
 * - Distance calculations and proximity alerts
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useGeolocation } from '@/lib/hooks/useGeolocation'

export interface MissionLocation {
  id: string
  missionId: string
  stageId?: string
  name: string
  latitude: number
  longitude: number
  radius: number // meters
  type: 'checkpoint' | 'challenge' | 'reward' | 'clue'
  description?: string
  requiredAction?: 'check_in' | 'photo' | 'observation' | 'data_collection'
}

export interface ProximityAlert {
  missionId: string
  locationId: string
  locationName: string
  distance: number
  type: MissionLocation['type']
  message: string
}

interface UseMissionMapOptions {
  missionLocations: MissionLocation[]
  proximityThreshold?: number // meters - when to trigger alerts
  updateInterval?: number // ms - how often to check location
  onProximityAlert?: (alert: ProximityAlert) => void
  onLocationReached?: (location: MissionLocation) => void
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
 * Check if user is within geofence radius
 */
function isWithinGeofence(
  userLat: number,
  userLon: number,
  location: MissionLocation
): boolean {
  const distance = calculateDistance(
    userLat,
    userLon,
    location.latitude,
    location.longitude
  )
  return distance <= location.radius
}

/**
 * Hook for location-based mission features
 */
export function useMissionMap({
  missionLocations,
  proximityThreshold = 200, // 200m default
  updateInterval = 5000, // 5 seconds
  onProximityAlert,
  onLocationReached,
}: UseMissionMapOptions) {
  const { location, error: geoError } = useGeolocation()
  const [nearbyLocations, setNearbyLocations] = useState<MissionLocation[]>([])
  const [reachedLocations, setReachedLocations] = useState<Set<string>>(new Set())
  const [proximityAlerts, setProximityAlerts] = useState<ProximityAlert[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastAlertRef = useRef<Set<string>>(new Set())

  // Check proximity and geofence status
  const checkLocationProximity = useCallback(() => {
    if (!location || missionLocations.length === 0) {
      setNearbyLocations([])
      setProximityAlerts([])
      return
    }

    const userLat = location.latitude
    const userLon = location.longitude

    const nearby: MissionLocation[] = []
    const alerts: ProximityAlert[] = []

    missionLocations.forEach((loc) => {
      const distance = calculateDistance(userLat, userLon, loc.latitude, loc.longitude)
      const alertKey = `${loc.id}-${Math.floor(distance / 50)}` // Group by 50m increments

      // Check if within geofence
      if (isWithinGeofence(userLat, userLon, loc)) {
        nearby.push(loc)

        // Trigger reached callback if not already reached
        if (!reachedLocations.has(loc.id)) {
          setReachedLocations((prev) => new Set(prev).add(loc.id))
          onLocationReached?.(loc)
        }
      }
      // Check if within proximity threshold (but not yet reached)
      else if (distance <= proximityThreshold && !reachedLocations.has(loc.id)) {
        if (!lastAlertRef.current.has(alertKey)) {
          alerts.push({
            missionId: loc.missionId,
            locationId: loc.id,
            locationName: loc.name,
            distance: Math.round(distance),
            type: loc.type,
            message: getProximityMessage(loc, distance),
          })
          lastAlertRef.current.add(alertKey)
        }
      }
    })

    setNearbyLocations(nearby)
    setProximityAlerts(alerts)

    // Trigger alert callbacks
    alerts.forEach((alert) => {
      onProximityAlert?.(alert)
    })
  }, [location, missionLocations, proximityThreshold, reachedLocations, onProximityAlert, onLocationReached])

  // Set up location checking interval
  useEffect(() => {
    if (location && missionLocations.length > 0) {
      checkLocationProximity()

      intervalRef.current = setInterval(() => {
        checkLocationProximity()
        // Clear old alerts periodically
        lastAlertRef.current.clear()
      }, updateInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [location, missionLocations, updateInterval, checkLocationProximity])

  return {
    location,
    nearbyLocations,
    proximityAlerts,
    reachedLocations,
    geoError,
    isTracking: !!location && missionLocations.length > 0,
  }
}

/**
 * Generate proximity message based on location type and distance
 */
function getProximityMessage(location: MissionLocation, distance: number): string {
  const distanceStr = distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`

  switch (location.type) {
    case 'checkpoint':
      return `📍 Mission checkpoint nearby! ${location.name} is ${distanceStr} away.`
    case 'challenge':
      return `🎯 Challenge location detected! ${location.name} is ${distanceStr} away.`
    case 'reward':
      return `🎁 Reward location nearby! ${location.name} is ${distanceStr} away.`
    case 'clue':
      return `🔍 Clue location detected! ${location.name} is ${distanceStr} away.`
    default:
      return `📍 Mission location nearby: ${location.name} (${distanceStr})`
  }
}

/**
 * Component for displaying AR-style proximity alerts
 */
interface MissionProximityAlertProps {
  alerts: ProximityAlert[]
  onDismiss?: (alertId: string) => void
}

export function MissionProximityAlert({ alerts, onDismiss }: MissionProximityAlertProps) {
  if (alerts.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 space-y-2 sm:left-auto sm:right-4 sm:max-w-sm">
      {alerts.map((alert) => (
        <div
          key={`${alert.missionId}-${alert.locationId}`}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl p-4 animate-pulse border-2 border-purple-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
                {alert.type === 'checkpoint' && '📍 Checkpoint'}
                {alert.type === 'challenge' && '🎯 Challenge'}
                {alert.type === 'reward' && '🎁 Reward'}
                {alert.type === 'clue' && '🔍 Clue'}
              </p>
              <p className="text-base font-bold mt-1">{alert.locationName}</p>
              <p className="text-sm opacity-90 mt-1">{alert.message}</p>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(`${alert.missionId}-${alert.locationId}`)}
                className="text-white/80 hover:text-white"
                aria-label="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Hook to fetch mission locations from API
 */
export function useMissionLocations(missionId: string) {
  const [locations, setLocations] = useState<MissionLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch(`/api/story-missions/${missionId}/locations`)
        if (!response.ok) {
          throw new Error('Failed to fetch mission locations')
        }
        const data = await response.json()
        setLocations(data.locations || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (missionId) {
      fetchLocations()
    }
  }, [missionId])

  return { locations, loading, error }
}



