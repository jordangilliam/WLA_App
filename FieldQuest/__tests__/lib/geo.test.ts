import { calculateDistance, isWithinGeofence, isPossibleMovement } from '../../lib/geo'

describe('geo utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points accurately', () => {
      // State College, PA to Harrisburg, PA (~140km)
      const distance = calculateDistance(40.7934, -77.8600, 40.2737, -76.8844)
      expect(distance).toBeGreaterThan(130000) // 130km
      expect(distance).toBeLessThan(150000) // 150km
    })

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(40.7934, -77.8600, 40.7934, -77.8600)
      expect(distance).toBe(0)
    })

    it('should handle negative coordinates', () => {
      const distance = calculateDistance(-33.8688, 151.2093, -37.8136, 144.9631)
      expect(distance).toBeGreaterThan(0)
    })
  })

  describe('isWithinGeofence', () => {
    it('should return true when point is within radius', () => {
      // Point 50m away from center
      const result = isWithinGeofence(
        40.7934,
        -77.8600,
        40.79385, // ~50m north
        -77.8600,
        100 // 100m radius
      )
      expect(result).toBe(true)
    })

    it('should return false when point is outside radius', () => {
      // Point 200m away from center
      const result = isWithinGeofence(
        40.7934,
        -77.8600,
        40.7952, // ~200m north
        -77.8600,
        100 // 100m radius
      )
      expect(result).toBe(false)
    })

    it('should handle exact boundary', () => {
      const result = isWithinGeofence(
        40.7934,
        -77.8600,
        40.7943, // ~100m north
        -77.8600,
        100 // 100m radius
      )
      expect(result).toBe(true) // Should be within or very close
    })
  })

  describe('isPossibleMovement', () => {
    it('should allow reasonable walking speed', () => {
      const lastLocation = {
        lat: 40.7934,
        lng: -77.8600,
        timestamp: Date.now() - 60000, // 1 minute ago
      }

      const currentLocation = {
        lat: 40.7938, // ~45m north (0.75 m/s = normal walk)
        lng: -77.8600,
        timestamp: Date.now(),
      }

      const result = isPossibleMovement(lastLocation, currentLocation)
      expect(result.possible).toBe(true)
    })

    it('should flag impossible teleportation', () => {
      const lastLocation = {
        lat: 40.7934,
        lng: -77.8600,
        timestamp: Date.now() - 5000, // 5 seconds ago
      }

      const currentLocation = {
        lat: 40.8934, // ~11km away
        lng: -77.8600,
        timestamp: Date.now(),
      }

      const result = isPossibleMovement(lastLocation, currentLocation)
      expect(result.possible).toBe(false)
      expect(result.suspicious).toBe(true)
    })

    it('should allow driving speed for longer time periods', () => {
      const lastLocation = {
        lat: 40.7934,
        lng: -77.8600,
        timestamp: Date.now() - 600000, // 10 minutes ago
      }

      const currentLocation = {
        lat: 40.8934, // ~11km away (66 km/h average)
        lng: -77.8600,
        timestamp: Date.now(),
      }

      const result = isPossibleMovement(lastLocation, currentLocation)
      expect(result.possible).toBe(true)
    })
  })
})

