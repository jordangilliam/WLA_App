/**
 * Location Cache Manager
 * Caches location data for offline use and performance
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface LocationCacheDB extends DBSchema {
  locations: {
    key: string // location ID
    value: {
      id: string
      name: string
      latitude: number
      longitude: number
      radius: number
      type: string
      metadata: Record<string, any>
      cachedAt: number
    }
    indexes: { 'by-type': string; 'by-cached': number }
  }
  mission_locations: {
    key: string // mission_location ID
    value: {
      id: string
      missionId: string
      stageId?: string
      locationId?: string
      customName?: string
      latitude?: number
      longitude?: number
      locationType: string
      requiredAction?: string
      geofenceRadius: number
      qrCodeData?: string
      clueText?: string
      cachedAt: number
    }
    indexes: { 'by-mission': string; 'by-stage': string }
  }
  user_location_history: {
    key: string // timestamp-locationId
    value: {
      timestamp: number
      locationId: string
      latitude: number
      longitude: number
      accuracy: number
      action?: string
      synced: boolean
    }
    indexes: { 'by-timestamp': number; 'by-sync': number }
  }
}

class LocationCacheManager {
  private db: IDBPDatabase<LocationCacheDB> | null = null
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.db) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      this.db = await openDB<LocationCacheDB>('wla-location-cache', 1, {
        upgrade(db) {
          // Locations store
          if (!db.objectStoreNames.contains('locations')) {
            const locationStore = db.createObjectStore('locations', { keyPath: 'id' })
            locationStore.createIndex('by-type', 'type')
            locationStore.createIndex('by-cached', 'cachedAt')
          }

          // Mission locations store
          if (!db.objectStoreNames.contains('mission_locations')) {
            const missionStore = db.createObjectStore('mission_locations', { keyPath: 'id' })
            missionStore.createIndex('by-mission', 'missionId')
            missionStore.createIndex('by-stage', 'stageId')
          }

          // User location history store
          if (!db.objectStoreNames.contains('user_location_history')) {
            const historyStore = db.createObjectStore('user_location_history', {
              keyPath: 'timestamp',
            })
            historyStore.createIndex('by-timestamp', 'timestamp')
            historyStore.createIndex('by-sync', 'synced')
          }
        },
      })
    })()

    return this.initPromise
  }

  // Cache mission locations
  async cacheMissionLocations(missionId: string, locations: any[]): Promise<void> {
    await this.init()
    if (!this.db) return

    const tx = this.db.transaction('mission_locations', 'readwrite')
    for (const loc of locations) {
      await tx.store.put({
        ...loc,
        missionId,
        cachedAt: Date.now(),
      })
    }
    await tx.done
  }

  // Get cached mission locations
  async getMissionLocations(missionId: string): Promise<any[]> {
    await this.init()
    if (!this.db) return []

    const tx = this.db.transaction('mission_locations', 'readonly')
    const index = tx.store.index('by-mission')
    return index.getAll(missionId)
  }

  // Cache user location history
  async cacheLocationVisit(
    locationId: string,
    latitude: number,
    longitude: number,
    accuracy: number,
    action?: string
  ): Promise<void> {
    await this.init()
    if (!this.db) return

    const tx = this.db.transaction('user_location_history', 'readwrite')
    await tx.store.put({
      timestamp: Date.now(),
      locationId,
      latitude,
      longitude,
      accuracy,
      action,
      synced: false,
    })
    await tx.done
  }

  // Get unsynced location visits
  async getUnsyncedVisits(): Promise<any[]> {
    await this.init()
    if (!this.db) return []

    const tx = this.db.transaction('user_location_history', 'readonly')
    const index = tx.store.index('by-sync')
    return index.getAll(0) // 0 = false
  }

  // Mark visits as synced
  async markVisitsSynced(timestamps: number[]): Promise<void> {
    await this.init()
    if (!this.db) return

    const tx = this.db.transaction('user_location_history', 'readwrite')
    for (const ts of timestamps) {
      const visit = await tx.store.get(ts.toString())
      if (visit) {
        visit.synced = true
        await tx.store.put(visit)
      }
    }
    await tx.done
  }

  // Clear old cache (older than 7 days)
  async clearOldCache(): Promise<void> {
    await this.init()
    if (!this.db) return

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    // Clear old mission locations
    const missionTx = this.db.transaction('mission_locations', 'readwrite')
    const oldMissions = await missionTx.store.getAll()
    for (const mission of oldMissions) {
      if (mission.cachedAt && mission.cachedAt < sevenDaysAgo) {
        await missionTx.store.delete(mission.id as string)
      }
    }
    await missionTx.done

    // Clear old location history (keep last 30 days)
    const historyTx = this.db.transaction('user_location_history', 'readwrite')
    const historyIndex = historyTx.store.index('by-timestamp')
    const oldHistory = await historyIndex.getAll()
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    for (const visit of oldHistory) {
      if (visit.timestamp < thirtyDaysAgo) {
        // Key is timestamp-locationId format
        await historyTx.store.delete(`${visit.timestamp}-${visit.locationId}`)
      }
    }
    await historyTx.done
  }
}

export const locationCache = new LocationCacheManager()


