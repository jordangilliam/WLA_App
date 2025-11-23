/**
 * Robust Mission Location Actions Component
 * Enhanced with retry logic, offline support, optimistic updates, and better error handling
 */

'use client'

import { useState, useEffect } from 'react'
import QRCodeScanner from './QRCodeScanner'
import AROverlay from './AROverlay'
import { locationCache } from '@/lib/location/location-cache'
import { useRobustGeolocation } from '@/lib/hooks/useRobustGeolocation'

interface MissionLocationActionsRobustProps {
  location: {
    id: string
    name: string
    locationType: string
    requiredAction?: string
    qrCodeData?: string
    arMarkerUrl?: string
    clueText?: string
    clueImageUrl?: string
    latitude?: number
    longitude?: number
    geofenceRadius?: number
  }
  missionId: string
  stageId?: string
  onActionComplete?: (action: string) => void
}

export default function MissionLocationActionsRobust({
  location,
  missionId,
  stageId,
  onActionComplete,
}: MissionLocationActionsRobustProps) {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showAR, setShowAR] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  const { location: userLocation, error: geoError, refresh: refreshLocation } = useRobustGeolocation({
    enableHighAccuracy: true,
    minAccuracy: 50, // Require accuracy better than 50m
    retryAttempts: 3,
  })

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Retry function wrapper
  const withRetry = async <T,>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> => {
    let lastError: Error | null = null

    for (let i = 0; i < maxRetries; i++) {
      try {
        setRetryCount(i)
        return await fn()
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error')
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
        }
      }
    }

    throw lastError
  }

  const handleQRScan = async (qrData: string) => {
    setError(null)
    try {
      // Cache visit locally first (optimistic update)
      await locationCache.cacheLocationVisit(
        location.id,
        userLocation?.latitude || 0,
        userLocation?.longitude || 0,
        userLocation?.accuracy || 0,
        'qr_scan'
      )

      const response = await withRetry(
        () =>
          fetch(`/api/missions/${missionId}/scan-qr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              qrCodeData: qrData,
              locationId: location.id,
              latitude: userLocation?.latitude,
              longitude: userLocation?.longitude,
            }),
          }),
        3,
        1000
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Invalid QR code')
      }

      const data = await response.json()
      setShowQRScanner(false)
      setError(null)
      setRetryCount(0)
      onActionComplete?.('qr_scan')

      // Show clue if available
      if (data.location?.clueText) {
        // Use a better notification system instead of alert
        setError(`🔐 Clue Revealed: ${data.location.clueText}`)
        setTimeout(() => setError(null), 5000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan QR code'
      setError(errorMessage)

      if (isOffline) {
        setError('Action queued for sync when online')
      }
    }
  }

  const handleCheckIn = async () => {
    setCheckingIn(true)
    setError(null)

    try {
      // Validate location accuracy
      if (!userLocation) {
        throw new Error('Location not available. Please wait...')
      }

      if (userLocation.accuracy > 100) {
        throw new Error(
          `Location accuracy is poor (${Math.round(userLocation.accuracy)}m). Please move to an open area.`
        )
      }

      // Validate geofence if location data available
      if (location.latitude && location.longitude && location.geofenceRadius) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude
        )

        if (distance > location.geofenceRadius) {
          throw new Error(
            `You are ${Math.round(distance)}m away. Please move within ${location.geofenceRadius}m of the location.`
          )
        }
      }

      // Cache visit locally first
      await locationCache.cacheLocationVisit(
        location.id,
        userLocation.latitude,
        userLocation.longitude,
        userLocation.accuracy,
        'check_in'
      )

      const response = await withRetry(
        () =>
          fetch(`/api/missions/${missionId}/visit-location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              locationId: location.id,
              action: 'check_in',
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              accuracy: userLocation.accuracy,
            }),
          }),
        3,
        1000
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to check in')
      }

      const data = await response.json()
      setError(null)
      setRetryCount(0)
      onActionComplete?.('check_in')

      if (data.location?.clueText) {
        setError(`🔐 Clue Revealed: ${data.location.clueText}`)
        setTimeout(() => setError(null), 5000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check in'
      setError(errorMessage)

      if (isOffline) {
        setError('Check-in queued for sync when online')
      } else if (err instanceof Error && err.message.includes('accuracy')) {
        // Suggest refreshing location
        setTimeout(() => {
          refreshLocation()
        }, 2000)
      }
    } finally {
      setCheckingIn(false)
    }
  }

  const needsQR = location.locationType === 'qr_code' || location.requiredAction === 'qr_scan'
  const needsAR = location.locationType === 'ar_marker' || location.requiredAction === 'ar_view'
  const needsCheckIn = location.requiredAction === 'check_in'

  return (
    <>
      <div className="space-y-3">
        {/* Error Display */}
        {error && (
          <div
            className={`p-3 rounded-lg ${
              error.includes('🔐')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Offline Indicator */}
        {isOffline && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg">
            <p className="text-sm font-semibold">⚠️ Offline Mode</p>
            <p className="text-xs mt-1">Actions will be synced when connection is restored</p>
          </div>
        )}

        {/* Location Status */}
        {userLocation && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg">
            <p className="text-xs">
              📍 Location accuracy: {Math.round(userLocation.accuracy)}m
              {userLocation.accuracy > 50 && ' (Poor - try moving to open area)'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {needsQR && location.qrCodeData && (
            <button
              onClick={() => setShowQRScanner(true)}
              disabled={checkingIn}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📷 Scan QR Code
            </button>
          )}

          {needsAR && location.arMarkerUrl && (
            <button
              onClick={() => setShowAR(true)}
              disabled={checkingIn}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔍 Use AR View
            </button>
          )}

          {needsCheckIn && (
            <>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn || !userLocation}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkingIn ? (
                  <>
                    <span className="animate-spin">⏳</span> Checking In...
                    {retryCount > 0 && ` (Retry ${retryCount})`}
                  </>
                ) : (
                  '📍 Check In'
                )}
              </button>
              {geoError && (
                <button
                  onClick={refreshLocation}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium text-sm"
                >
                  🔄 Refresh Location
                </button>
              )}
            </>
          )}
        </div>

        {/* Clue Display */}
        {location.clueText && (
          <div className="w-full mt-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-900 mb-1">🔐 Clue</p>
            <p className="text-sm text-slate-700">{location.clueText}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showQRScanner && (
        <QRCodeScanner
          onScan={handleQRScan}
          onClose={() => {
            setShowQRScanner(false)
            setError(null)
          }}
          missionId={missionId}
          locationId={location.id}
        />
      )}

      {showAR && (
        <AROverlay
          markerUrl={location.arMarkerUrl}
          clueText={location.clueText}
          clueImage={location.clueImageUrl}
          onClose={() => {
            setShowAR(false)
            setError(null)
          }}
          missionId={missionId}
          locationId={location.id}
        />
      )}
    </>
  )
}

// Distance calculation helper
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
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



