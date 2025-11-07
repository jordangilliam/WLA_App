import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FieldSite } from '../../lib/types'
import { isWithinGeofence } from '../../lib/geo'
import { useLocationStore } from '../../state/store'

interface GeofenceGuardProps {
  site: FieldSite
  children: React.ReactNode
  onOutsideBoundary?: () => void
}

/**
 * Guard component that only renders children when user is within geofence
 * Shows a message and distance when outside the boundary
 */
export const GeofenceGuard: React.FC<GeofenceGuardProps> = ({
  site,
  children,
  onOutsideBoundary,
}) => {
  const { currentLocation } = useLocationStore()
  const [isWithin, setIsWithin] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)

  useEffect(() => {
    if (!currentLocation) return

    const within = isWithinGeofence(
      currentLocation.latitude,
      currentLocation.longitude,
      site.lat,
      site.lng,
      site.radius
    )

    setIsWithin(within)

    // Calculate distance if outside
    if (!within && currentLocation) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        site.lat,
        site.lng
      )
      setDistance(Math.round(dist))

      if (onOutsideBoundary) {
        onOutsideBoundary()
      }
    } else {
      setDistance(null)
    }
  }, [currentLocation, site, onOutsideBoundary])

  if (isWithin) {
    return <>{children}</>
  }

  return (
    <View style={styles.container}>
      <View style={styles.warningBox}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Outside Site Boundary</Text>
        <Text style={styles.message}>
          You must be within {site.radius}m of {site.name} to interact.
        </Text>
        {distance !== null && (
          <Text style={styles.distance}>
            You are {distance}m away ({(distance - site.radius).toFixed(0)}m too far)
          </Text>
        )}
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            💡 Move closer to the marked location on the map
          </Text>
        </View>
      </View>
    </View>
  )
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  warningBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#F39C12',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E67E22',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  distance: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 16,
  },
  hint: {
    backgroundColor: '#EBF5FB',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  hintText: {
    fontSize: 14,
    color: '#2874A6',
    textAlign: 'center',
  },
})

