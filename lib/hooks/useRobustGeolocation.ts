/**
 * Robust Geolocation Hook
 * Enhanced version with retry logic, caching, accuracy validation, and fallbacks
 */

import { useState, useEffect, useRef, useCallback } from 'react'

interface GeolocationState {
  location: {
    latitude: number
    longitude: number
    accuracy: number
    altitude?: number
    heading?: number
    speed?: number
    timestamp: number
  } | null
  error: string | null
  isLoading: boolean
  isHighAccuracy: boolean
  retryCount: number
}

interface UseRobustGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  retryAttempts?: number
  retryDelay?: number
  minAccuracy?: number // meters - reject locations less accurate than this
  cacheDuration?: number // ms - how long to cache location
  watchInterval?: number // ms - how often to update (0 = watch continuously)
  onLocationUpdate?: (location: GeolocationState['location']) => void
  onError?: (error: string) => void
}

const DEFAULT_OPTIONS: Required<Omit<UseRobustGeolocationOptions, 'onLocationUpdate' | 'onError'>> = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 30000,
  retryAttempts: 3,
  retryDelay: 2000,
  minAccuracy: 100, // Reject locations with accuracy worse than 100m
  cacheDuration: 60000, // Cache for 1 minute
  watchInterval: 5000, // Update every 5 seconds
}

export function useRobustGeolocation(options: UseRobustGeolocationOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: true,
    isHighAccuracy: false,
    retryCount: 0,
  })

  const watchIdRef = useRef<number | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cachedLocationRef = useRef<GeolocationState['location'] | null>(null)
  const lastUpdateRef = useRef<number>(0)

  // Load cached location
  useEffect(() => {
    try {
      const cached = localStorage.getItem('wla-geolocation-cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        const age = Date.now() - parsed.timestamp
        if (age < opts.cacheDuration) {
          cachedLocationRef.current = parsed.location
          setState((prev) => ({
            ...prev,
            location: parsed.location,
            isLoading: false,
          }))
        }
      }
    } catch (e) {
      // Ignore cache errors
    }
  }, [])

  // Cache location
  const cacheLocation = useCallback((location: GeolocationState['location']) => {
    if (location) {
      try {
        localStorage.setItem(
          'wla-geolocation-cache',
          JSON.stringify({
            location,
            timestamp: Date.now(),
          })
        )
        cachedLocationRef.current = location
      } catch (e) {
        // Ignore cache errors
      }
    }
  }, [])

  // Validate location accuracy
  const isValidLocation = useCallback(
    (position: GeolocationPosition): boolean => {
      if (!position.coords.accuracy) return false
      if (position.coords.accuracy > opts.minAccuracy) return false
      return true
    },
    [opts.minAccuracy]
  )

  // Get location with retry logic
  const getLocation = useCallback(
    (attempt = 0): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'))
          return
        }

        const successHandler = (position: GeolocationPosition) => {
          if (isValidLocation(position)) {
            resolve(position)
          } else if (attempt < opts.retryAttempts) {
            // Retry if accuracy is poor
            setTimeout(() => {
              getLocation(attempt + 1).then(resolve).catch(reject)
            }, opts.retryDelay)
          } else {
            // Accept poor accuracy after max retries
            resolve(position)
          }
        }

        const errorHandler = (error: GeolocationPositionError) => {
          if (attempt < opts.retryAttempts) {
            retryTimeoutRef.current = setTimeout(() => {
              getLocation(attempt + 1).then(resolve).catch(reject)
            }, opts.retryDelay)
          } else {
            reject(error)
          }
        }

        navigator.geolocation.getCurrentPosition(
          successHandler,
          errorHandler,
          {
            enableHighAccuracy: opts.enableHighAccuracy,
            timeout: opts.timeout,
            maximumAge: opts.maximumAge,
          }
        )
      })
    },
    [opts, isValidLocation]
  )

  // Update location state
  const updateLocation = useCallback(
    (position: GeolocationPosition) => {
      const now = Date.now()
      // Throttle updates
      if (now - lastUpdateRef.current < opts.watchInterval) {
        return
      }
      lastUpdateRef.current = now

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || 0,
        altitude: position.coords.altitude ?? undefined,
        heading: position.coords.heading ?? undefined,
        speed: position.coords.speed ?? undefined,
        timestamp: position.timestamp,
      }

      setState((prev) => ({
        ...prev,
        location,
        error: null,
        isLoading: false,
        isHighAccuracy: (position.coords.accuracy || 0) < 20,
        retryCount: 0,
      }))

      cacheLocation(location)
      options.onLocationUpdate?.(location)
    },
    [opts.watchInterval, cacheLocation, options]
  )

  // Handle errors
  const handleError = useCallback(
    (error: GeolocationPositionError, attempt: number) => {
      let errorMessage = 'Unable to retrieve your location'

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            'Location access denied. Please enable location permissions in your browser settings.'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable. Please check your device settings.'
          break
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.'
          break
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: attempt < opts.retryAttempts,
        retryCount: attempt,
      }))

      options.onError?.(errorMessage)

      // Use cached location if available
      if (cachedLocationRef.current && attempt >= opts.retryAttempts) {
        setState((prev) => ({
          ...prev,
          location: cachedLocationRef.current,
          error: `Using cached location: ${errorMessage}`,
          isLoading: false,
        }))
      }
    },
    [opts.retryAttempts, options]
  )

  // Initialize geolocation
  useEffect(() => {
    let mounted = true

    // Initial location fetch
    getLocation()
      .then((position) => {
        if (mounted) updateLocation(position)
      })
      .catch((error) => {
        if (mounted) handleError(error, 0)
      })

    // Watch position if interval is set
    if (opts.watchInterval > 0) {
      const watchSuccess = (position: GeolocationPosition) => {
        if (mounted) updateLocation(position)
      }

      const watchError = (error: GeolocationPositionError) => {
        if (mounted) handleError(error, state.retryCount)
      }

      watchIdRef.current = navigator.geolocation.watchPosition(
        watchSuccess,
        watchError,
        {
          enableHighAccuracy: opts.enableHighAccuracy,
          timeout: opts.timeout,
          maximumAge: opts.maximumAge,
        }
      )
    }

    return () => {
      mounted = false
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, []) // Only run once on mount

  // Manual refresh function
  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    getLocation()
      .then(updateLocation)
      .catch((error) => handleError(error, 0))
  }, [getLocation, updateLocation, handleError])

  return {
    ...state,
    refresh,
    cachedLocation: cachedLocationRef.current,
  }
}


