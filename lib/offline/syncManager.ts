/**
 * Smart Sync Manager
 * Intelligently syncs offline data when online
 */

import { offlineQueue } from './offline-queue';
import { contentCache } from './contentCache';

interface SyncOptions {
  priority?: 'high' | 'normal' | 'low';
  retryOnFailure?: boolean;
  maxRetries?: number;
}

class SyncManager {
  private isSyncing = false;
  private syncQueue: Array<{ action: () => Promise<void>; priority: number }> = [];
  private syncInterval: NodeJS.Timeout | null = null;

  /**
   * Start automatic sync
   */
  startAutoSync(intervalMs: number = 30000): void {
    if (this.syncInterval) {
      this.stopAutoSync();
    }

    this.syncInterval = setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.sync();
      }
    }, intervalMs);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Sync all pending data
   */
  async sync(options: SyncOptions = {}): Promise<void> {
    if (!navigator.onLine) {
      console.log('Device is offline, skipping sync');
      return;
    }

    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    this.isSyncing = true;

    try {
      // Sync offline queue first (highest priority)
      await this.syncOfflineQueue();

      // Sync content cache updates
      await this.syncContentCache();

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      if (options.retryOnFailure) {
        // Retry logic would go here
      }
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync offline queue
   */
  private async syncOfflineQueue(): Promise<void> {
    try {
      // syncQueue() already handles syncing all pending items
      await offlineQueue.syncQueue();
    } catch (error) {
      console.error('Failed to sync offline queue:', error);
    }
  }

  /**
   * Sync content cache
   */
  private async syncContentCache(): Promise<void> {
    // Check for content updates
    // This would compare cached content timestamps with server timestamps
    // and download updates if needed
    console.log('Content cache sync (placeholder)');
  }

  /**
   * Force immediate sync
   */
  async forceSync(): Promise<void> {
    await this.sync({ priority: 'high', retryOnFailure: true });
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isSyncing: boolean;
    queueLength: number;
    isOnline: boolean;
  } {
    return {
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      isOnline: navigator.onLine,
    };
  }
}

export const syncManager = new SyncManager();

