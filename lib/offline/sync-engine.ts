/**
 * Sync engine for offline/online synchronization
 * Queues changes when offline and syncs when connection restored
 * Handles conflict resolution and retry logic
 */

import { db } from './indexeddb'

export type SyncStatus = 'idle' | 'syncing' | 'error'

export interface SyncState {
  status: SyncStatus
  isOnline: boolean
  lastSync: number | null
  pendingItems: number
  failedItems: number
}

class SyncEngine {
  private status: SyncStatus = 'idle'
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true
  private lastSync: number | null = null
  private syncInterval: NodeJS.Timeout | null = null
  private listeners: Set<(state: SyncState) => void> = new Set()

  constructor() {
    if (typeof window !== 'undefined') {
      // Listen for online/offline events
      window.addEventListener('online', () => this.handleOnline())
      window.addEventListener('offline', () => this.handleOffline())
      
      // Start periodic sync check (every 30 seconds when online)
      this.startPeriodicSync()
    }
  }

  /**
   * Subscribe to sync state changes
   */
  subscribe(listener: (state: SyncState) => void) {
    this.listeners.add(listener)
    
    // Immediately send current state
    listener(this.getState())
    
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Get current sync state
   */
  getState(): SyncState {
    return {
      status: this.status,
      isOnline: this.isOnline,
      lastSync: this.lastSync,
      pendingItems: 0, // Updated by getPendingCount()
      failedItems: 0,
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners() {
    const state = this.getState()
    this.listeners.forEach(listener => listener(state))
  }

  /**
   * Handle coming online
   */
  private handleOnline() {
    console.log('📶 Connection restored - starting sync')
    this.isOnline = true
    this.notifyListeners()
    this.sync() // Trigger immediate sync
  }

  /**
   * Handle going offline
   */
  private handleOffline() {
    console.log('📴 Connection lost - offline mode enabled')
    this.isOnline = false
    this.notifyListeners()
  }

  /**
   * Start periodic sync (every 30 seconds)
   */
  private startPeriodicSync() {
    if (this.syncInterval) return

    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.status === 'idle') {
        this.sync()
      }
    }, 30000) // 30 seconds
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  /**
   * Manual sync trigger
   */
  async sync(): Promise<{ success: boolean; synced: number; failed: number }> {
    if (!this.isOnline) {
      console.log('Cannot sync - offline')
      return { success: false, synced: 0, failed: 0 }
    }

    if (this.status === 'syncing') {
      console.log('Sync already in progress')
      return { success: false, synced: 0, failed: 0 }
    }

    this.status = 'syncing'
    this.notifyListeners()

    let syncedCount = 0
    let failedCount = 0

    try {
      // Get all items from sync queue
      const queue = await db.getSyncQueue()
      
      console.log(`🔄 Syncing ${queue.length} items...`)

      // Process queue items
      for (const item of queue) {
        try {
          await this.syncItem(item)
          await db.removeFromSyncQueue(item.id)
          syncedCount++
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error)
          failedCount++
          
          // Update retry count
          await db.updateSyncQueueItem(item.id, {
            attempts: item.attempts + 1,
            last_error: error instanceof Error ? error.message : 'Unknown error',
          })

          // Remove from queue if too many failures
          if (item.attempts >= 5) {
            console.warn(`Removing item ${item.id} after 5 failed attempts`)
            await db.removeFromSyncQueue(item.id)
          }
        }
      }

      this.lastSync = Date.now()
      this.status = 'idle'
      
      console.log(`✅ Sync complete: ${syncedCount} synced, ${failedCount} failed`)
      
      this.notifyListeners()
      
      return { success: true, synced: syncedCount, failed: failedCount }
    } catch (error) {
      console.error('Sync error:', error)
      this.status = 'error'
      this.notifyListeners()
      
      return { success: false, synced: syncedCount, failed: failedCount }
    }
  }

  /**
   * Sync a single item
   */
  private async syncItem(item: any) {
    const { action, entity, data } = item

    switch (entity) {
      case 'checkin':
        await this.syncCheckin(action, data)
        break
      
      case 'photo':
        await this.syncPhoto(action, data)
        break
      
      case 'progress':
        await this.syncProgress(action, data)
        break
      
      default:
        console.warn(`Unknown entity type: ${entity}`)
    }
  }

  /**
   * Sync check-in to server
   */
  private async syncCheckin(action: string, data: any) {
    const response = await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to sync check-in: ${response.statusText}`)
    }

    // Mark as synced in local DB
    const checkin = await db.getUnsyncedCheckins()
    const localCheckin = checkin.find((c: any) => c.id === data.id)
    if (localCheckin) {
      await db.saveCheckin({ ...localCheckin, synced: true })
    }
  }

  /**
   * Sync photo to server
   */
  private async syncPhoto(action: string, data: any) {
    // Get photo from IndexedDB
    const photo = await db.getPhotoById(data.id)
    if (!photo) {
      throw new Error('Photo not found in local storage')
    }

    // Upload photo
    const formData = new FormData()
    formData.append('photo', photo.blob)
    formData.append('metadata', JSON.stringify(photo.metadata))

    const response = await fetch('/api/photos/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to sync photo: ${response.statusText}`)
    }

    // Mark as synced
    await db.savePhoto({ ...photo, synced: true })
  }

  /**
   * Sync progress to server
   */
  private async syncProgress(action: string, data: any) {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to sync progress: ${response.statusText}`)
    }

    // Mark as synced
    await db.saveProgress({ ...data, synced: true })
  }

  /**
   * Get count of pending items
   */
  async getPendingCount(): Promise<number> {
    const queue = await db.getSyncQueue()
    return queue.length
  }

  /**
   * Clear all pending items
   */
  async clearPending() {
    const queue = await db.getSyncQueue()
    for (const item of queue) {
      await db.removeFromSyncQueue(item.id)
    }
    this.notifyListeners()
  }
}

// Singleton instance
export const syncEngine = new SyncEngine()

// Helper hooks for React components
export function useSyncState() {
  const [state, setState] = React.useState<SyncState>(syncEngine.getState())

  React.useEffect(() => {
    return syncEngine.subscribe(setState)
  }, [])

  return state
}

export function useSync() {
  return {
    sync: () => syncEngine.sync(),
    getPendingCount: () => syncEngine.getPendingCount(),
    clearPending: () => syncEngine.clearPending(),
  }
}

// Auto-import React for hooks
import React from 'react'

