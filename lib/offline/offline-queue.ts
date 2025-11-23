/**
 * Enhanced Offline Queue Manager
 * Handles queuing and syncing of offline actions when connection is restored
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface QueuedAction {
  id: string;
  type: 'check-in' | 'observation' | 'photo' | 'challenge-progress' | 'achievement' | 'bundle';
  data: any;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
  error?: string;
}

export interface BundleQueueRecord {
  id: string;
  createdAt: number;
  siteId?: string;
  siteName?: string;
  pillarIds: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

interface OfflineDB extends DBSchema {
  queue: {
    key: string;
    value: QueuedAction;
    indexes: { 'by-status': string; 'by-timestamp': number };
  };
  photos: {
    key: string;
    value: {
      id: string;
      blob: Blob;
      timestamp: number;
    };
  };
  bundles: {
    key: string;
    value: BundleQueueRecord;
    indexes: { 'by-created': number };
  };
}

class OfflineQueueManager {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private syncInProgress = false;
  private listeners: Set<(event: 'sync-start' | 'sync-complete' | 'sync-error', data?: any) => void> = new Set();
  private bundleListeners: Set<(bundles: BundleQueueRecord[]) => void> = new Set();
  private lastSyncAt: number | null = null;

  async init() {
    if (this.db) return;

    this.db = await openDB<OfflineDB>('wildpraxis-offline', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          // Queue store
          const queueStore = db.createObjectStore('queue', { keyPath: 'id' });
          queueStore.createIndex('by-status', 'status');
          queueStore.createIndex('by-timestamp', 'timestamp');

          // Photos store (for offline photo uploads)
          db.createObjectStore('photos', { keyPath: 'id' });
        }

        if (oldVersion < 2) {
          const bundleStore = db.createObjectStore('bundles', { keyPath: 'id' });
          bundleStore.createIndex('by-created', 'createdAt');
        }
      },
    });

    const storedLastSync = localStorage.getItem('wla-last-sync');
    if (storedLastSync) {
      this.lastSyncAt = Number(storedLastSync);
    }

    // Listen for online events
    window.addEventListener('online', () => {
      this.syncQueue();
    });

    // Auto-sync every 5 minutes if online
    setInterval(() => {
      if (navigator.onLine) {
        this.syncQueue();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Add an action to the offline queue
   */
  async addToQueue(type: QueuedAction['type'], data: any): Promise<string> {
    if (!this.db) await this.init();

    const action: QueuedAction = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    await this.db!.add('queue', action);

    // If online, try to sync immediately
    if (navigator.onLine && !this.syncInProgress) {
      setTimeout(() => this.syncQueue(), 100);
    }

    return action.id;
  }

  /**
   * Add a photo to offline storage
   */
  async addPhoto(id: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();

    await this.db!.put('photos', {
      id,
      blob,
      timestamp: Date.now(),
    });
  }

  /**
   * Get a photo from offline storage
   */
  async getPhoto(id: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    const photo = await this.db!.get('photos', id);
    return photo?.blob || null;
  }

  /**
   * Get all pending actions
   */
  async getPendingActions(): Promise<QueuedAction[]> {
    if (!this.db) await this.init();

    return await this.db!.getAllFromIndex('queue', 'by-status', 'pending');
  }

  /**
   * Get count of pending actions
   */
  async getPendingCount(): Promise<number> {
    if (!this.db) await this.init();

    return await this.db!.countFromIndex('queue', 'by-status', 'pending');
  }

  /**
   * Sync all pending actions
   */
  async syncQueue(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) return;

    this.syncInProgress = true;
    this.notifyListeners('sync-start');

    try {
      const pending = await this.getPendingActions();

      for (const action of pending) {
        try {
          // Mark as syncing
          await this.updateActionStatus(action.id, 'syncing');

          // Sync based on type
          await this.syncAction(action);

          // Remove from queue on success
          await this.db!.delete('queue', action.id);

          // Clean up associated photos if any
          if (action.data.photoId) {
            await this.db!.delete('photos', action.data.photoId);
          }
        } catch (error: any) {
          console.error(`Failed to sync action ${action.id}:`, error);

          // Increment retry count
          const retryCount = action.retryCount + 1;

          if (retryCount >= 3) {
            // Mark as failed after 3 retries
            await this.updateActionStatus(action.id, 'failed', error.message);
          } else {
            // Reset to pending for retry
            await this.db!.put('queue', {
              ...action,
              status: 'pending',
              retryCount,
              error: error.message,
            });
          }
        }
      }

      if (navigator.onLine) {
        this.lastSyncAt = Date.now();
        localStorage.setItem('wla-last-sync', this.lastSyncAt.toString());
      }

      this.notifyListeners('sync-complete', { synced: pending.length, lastSyncAt: this.lastSyncAt });
    } catch (error) {
      console.error('Queue sync error:', error);
      this.notifyListeners('sync-error', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync a single action
   */
  private async syncAction(action: QueuedAction): Promise<void> {
    switch (action.type) {
      case 'check-in':
        await this.syncCheckIn(action.data);
        break;
      case 'observation':
        await this.syncObservation(action.data);
        break;
      case 'photo':
        await this.syncPhoto(action.data);
        break;
      case 'challenge-progress':
        await this.syncChallengeProgress(action.data);
        break;
      case 'achievement':
        await this.syncAchievement(action.data);
        break;
      case 'bundle':
        // Bundles are local-only; no remote sync required.
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async syncCheckIn(data: any): Promise<void> {
    const response = await fetch('/api/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Check-in sync failed: ${response.statusText}`);
    }
  }

  private async syncObservation(data: any): Promise<void> {
    // Upload photo first if exists
    if (data.photoId) {
      const photoBlob = await this.getPhoto(data.photoId);
      if (photoBlob) {
        const formData = new FormData();
        formData.append('photo', photoBlob);
        formData.append('observationId', data.photoId);

        const uploadResponse = await fetch('/api/observations/upload-photo', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          data.photoUrl = url;
        }
      }
    }

    const response = await fetch('/api/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Observation sync failed: ${response.statusText}`);
    }
  }

  private async syncPhoto(data: any): Promise<void> {
    const photoBlob = await this.getPhoto(data.photoId);
    if (!photoBlob) {
      throw new Error('Photo not found in offline storage');
    }

    const formData = new FormData();
    formData.append('photo', photoBlob);
    formData.append('metadata', JSON.stringify(data.metadata));

    const response = await fetch('/api/photos/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Photo sync failed: ${response.statusText}`);
    }
  }

  private async syncChallengeProgress(data: any): Promise<void> {
    const response = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Challenge progress sync failed: ${response.statusText}`);
    }
  }

  private async syncAchievement(data: any): Promise<void> {
    const response = await fetch('/api/achievements/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Achievement sync failed: ${response.statusText}`);
    }
  }

  /**
   * Update action status
   */
  private async updateActionStatus(
    id: string,
    status: QueuedAction['status'],
    error?: string
  ): Promise<void> {
    const action = await this.db!.get('queue', id);
    if (action) {
      await this.db!.put('queue', {
        ...action,
        status,
        error,
      });
    }
  }

  /**
   * Clear failed actions
   */
  async clearFailedActions(): Promise<void> {
    if (!this.db) await this.init();

    const failed = await this.db!.getAllFromIndex('queue', 'by-status', 'failed');
    for (const action of failed) {
      await this.db!.delete('queue', action.id);
    }
  }

  /**
   * Get failed actions
   */
  async getFailedActions(): Promise<QueuedAction[]> {
    if (!this.db) await this.init();

    return await this.db!.getAllFromIndex('queue', 'by-status', 'failed');
  }

  /**
   * Retry a failed action
   */
  async retryAction(id: string): Promise<void> {
    if (!this.db) await this.init();

    const action = await this.db!.get('queue', id);
    if (action && action.status === 'failed') {
      await this.db!.put('queue', {
        ...action,
        status: 'pending',
        retryCount: 0,
        error: undefined,
      });

      if (navigator.onLine) {
        setTimeout(() => this.syncQueue(), 100);
      }
    }
  }

  /**
   * Add listener for sync events
   */
  addListener(callback: (event: 'sync-start' | 'sync-complete' | 'sync-error', data?: any) => void): void {
    this.listeners.add(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback: (event: 'sync-start' | 'sync-complete' | 'sync-error', data?: any) => void): void {
    this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(event: 'sync-start' | 'sync-complete' | 'sync-error', data?: any): void {
    this.listeners.forEach((callback) => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  /**
   * Bundle queue helpers
   */
  async addBundleRecord(record: BundleQueueRecord): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('bundles', record);
    await this.notifyBundleListeners();
  }

  async getBundleRecords(): Promise<BundleQueueRecord[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('bundles', 'by-created');
  }

  async deleteBundleRecord(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('bundles', id);
    await this.notifyBundleListeners();
  }

  async clearBundleRecords(): Promise<void> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('bundles', 'readwrite');
    await tx.store.clear();
    await tx.done;
    await this.notifyBundleListeners();
  }

  addBundleListener(listener: (bundles: BundleQueueRecord[]) => void): void {
    this.bundleListeners.add(listener);
  }

  removeBundleListener(listener: (bundles: BundleQueueRecord[]) => void): void {
    this.bundleListeners.delete(listener);
  }

  private async notifyBundleListeners(): Promise<void> {
    if (!this.bundleListeners.size) return;
    const bundles = await this.getBundleRecords();
    this.bundleListeners.forEach((listener) => {
      try {
        listener(bundles);
      } catch (error) {
        console.error('Bundle listener error:', error);
      }
    });
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isOnline: boolean;
    isSyncing: boolean;
  } {
    return {
      isOnline: navigator.onLine,
      isSyncing: this.syncInProgress,
    };
  }

  getLastSyncTimestamp(): number | null {
    return this.lastSyncAt;
  }
}

// Export singleton instance
export const offlineQueue = new OfflineQueueManager();

// Auto-initialize
if (typeof window !== 'undefined') {
  offlineQueue.init();
}

