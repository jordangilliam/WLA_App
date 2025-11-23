/**
 * Location Sync Service
 * Syncs offline location visits when connection is restored
 */

import { locationCache } from './location-cache'

interface SyncResult {
  success: boolean
  synced: number
  failed: number
  errors: Array<{ visit: any; error: string }>
}

class LocationSyncService {
  private isSyncing = false
  private syncListeners = new Set<(result: SyncResult) => void>()

  /**
   * Subscribe to sync events
   */
  subscribe(listener: (result: SyncResult) => void): () => void {
    this.syncListeners.add(listener)
    return () => {
      this.syncListeners.delete(listener)
    }
  }

  /**
   * Notify listeners of sync result
   */
  private notifyListeners(result: SyncResult): void {
    this.syncListeners.forEach((listener) => {
      try {
        listener(result)
      } catch (error) {
        console.error('Sync listener error:', error)
      }
    })
  }

  /**
   * Sync all unsynced location visits
   */
  async syncAll(missionId?: string): Promise<SyncResult> {
    if (this.isSyncing) {
      return { success: false, synced: 0, failed: 0, errors: [] }
    }

    this.isSyncing = true

    try {
      const unsynced = await locationCache.getUnsyncedVisits()
      const result: SyncResult = {
        success: true,
        synced: 0,
        failed: 0,
        errors: [],
      }

      // Filter by mission if provided
      const visitsToSync = missionId
        ? unsynced.filter((v) => v.missionId === missionId)
        : unsynced

      for (const visit of visitsToSync) {
        try {
          // Determine API endpoint based on action
          let endpoint = `/api/missions/${visit.missionId}/visit-location`
          if (visit.action === 'qr_scan') {
            endpoint = `/api/missions/${visit.missionId}/scan-qr`
          }

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              locationId: visit.locationId,
              action: visit.action || 'check_in',
              latitude: visit.latitude,
              longitude: visit.longitude,
              accuracy: visit.accuracy,
              qrCodeData: visit.qrCodeData,
            }),
          })

          if (response.ok) {
            result.synced++
            await locationCache.markVisitsSynced([visit.timestamp])
          } else {
            result.failed++
            result.errors.push({
              visit,
              error: `HTTP ${response.status}`,
            })
          }
        } catch (error) {
          result.failed++
          result.errors.push({
            visit,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }

      result.success = result.failed === 0
      this.notifyListeners(result)
      return result
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Initialize auto-sync on online event
   */
  initialize(): void {
    if (typeof window === 'undefined') return

    // Sync when coming online
    window.addEventListener('online', () => {
      this.syncAll().catch((error) => {
        console.error('Auto-sync failed:', error)
      })
    })

    // Periodic sync every 5 minutes when online
    setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.syncAll().catch((error) => {
          console.error('Periodic sync failed:', error)
        })
      }
    }, 5 * 60 * 1000)
  }
}

export const locationSync = new LocationSyncService()

// Initialize on import
if (typeof window !== 'undefined') {
  locationSync.initialize()
}



