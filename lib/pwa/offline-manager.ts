/**
 * Progressive Web App - Offline Manager
 * Handles offline caching, sync, and background operations
 */

// ============================================================================
// Service Worker Registration
// ============================================================================

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Every hour
        })
        .catch(err => {
          console.error('SW registration failed:', err);
        });
    });
  }
}

// ============================================================================
// Offline Data Sync
// ============================================================================

export interface SyncQueueItem {
  id: string;
  type: 'check-in' | 'observation' | 'photo' | 'quiz' | 'journal';
  data: any;
  timestamp: Date;
  retryCount: number;
}

export class OfflineSyncManager {
  private dbName = 'wla-offline-sync';
  private storeName = 'sync-queue';
  private db: IDBDatabase | null = null;

  async initialize() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('type', 'type');
        }
      };
    });
  }

  /**
   * Add item to sync queue
   */
  async addToQueue(item: Omit<SyncQueueItem, 'id' | 'retryCount'>): Promise<string> {
    if (!this.db) await this.initialize();

    const queueItem: SyncQueueItem = {
      ...item,
      id: crypto.randomUUID(),
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(queueItem);

      request.onsuccess = () => resolve(queueItem.id);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all pending sync items
   */
  async getPendingItems(): Promise<SyncQueueItem[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remove synced item from queue
   */
  async removeFromQueue(id: string): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Sync all pending items
   */
  async syncAll(): Promise<{ succeeded: number; failed: number }> {
    const items = await this.getPendingItems();
    let succeeded = 0;
    let failed = 0;

    for (const item of items) {
      try {
        await this.syncItem(item);
        await this.removeFromQueue(item.id);
        succeeded++;
      } catch (error) {
        console.error(`Sync failed for item ${item.id}:`, error);
        failed++;
        
        // Increment retry count
        await this.incrementRetryCount(item.id);
      }
    }

    return { succeeded, failed };
  }

  /**
   * Sync individual item
   */
  private async syncItem(item: SyncQueueItem): Promise<void> {
    const endpoints: Record<SyncQueueItem['type'], string> = {
      'check-in': '/api/check-in',
      'observation': '/api/observations',
      'photo': '/api/media/upload',
      'quiz': '/api/progress/quiz',
      'journal': '/api/journal',
    };

    const response = await fetch(endpoints[item.type], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item.data),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
  }

  private async incrementRetryCount(id: string): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (item) {
        item.retryCount++;
        
        // Remove if too many retries
        if (item.retryCount > 5) {
          store.delete(id);
        } else {
          store.put(item);
        }
      }
    };
  }
}

// ============================================================================
// Offline Cache Manager
// ============================================================================

export class OfflineCacheManager {
  private cacheName = 'wla-offline-v1';

  /**
   * Cache essential assets
   */
  async cacheEssentials() {
    const essentialAssets = [
      '/',
      '/learn',
      '/map',
      '/journal',
      '/manifest.json',
      '/icons/icon-192.png',
      '/icons/icon-512.png',
      // Add more essential routes and assets
    ];

    const cache = await caches.open(this.cacheName);
    await cache.addAll(essentialAssets);
  }

  /**
   * Cache location data for offline use
   */
  async cacheLocations(locations: any[]) {
    const cache = await caches.open(this.cacheName);
    
    for (const location of locations) {
      // Cache location details
      await cache.put(
        `/api/locations/${location.id}`,
        new Response(JSON.stringify(location), {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // Cache location images
      if (location.images) {
        for (const imageUrl of location.images) {
          try {
            const imageResponse = await fetch(imageUrl);
            await cache.put(imageUrl, imageResponse.clone());
          } catch (error) {
            console.error(`Failed to cache image: ${imageUrl}`, error);
          }
        }
      }
    }
  }

  /**
   * Cache map tiles for offline use
   */
  async cacheMapTiles(bounds: any, zoomLevels: number[]) {
    const cache = await caches.open(`${this.cacheName}-maps`);
    
    for (const zoom of zoomLevels) {
      const tiles = this.calculateTiles(bounds, zoom);
      
      for (const tile of tiles) {
        const tileUrl = this.getTileUrl(tile.x, tile.y, zoom);
        try {
          const response = await fetch(tileUrl);
          await cache.put(tileUrl, response.clone());
        } catch (error) {
          console.error(`Failed to cache tile: ${tileUrl}`, error);
        }
      }
    }
  }

  private calculateTiles(bounds: any, zoom: number) {
    // Calculate tile coordinates for given bounds
    // Simplified - real implementation needs proper tile math
    const tiles = [];
    const minX = this.lonToTileX(bounds.west, zoom);
    const maxX = this.lonToTileX(bounds.east, zoom);
    const minY = this.latToTileY(bounds.north, zoom);
    const maxY = this.latToTileY(bounds.south, zoom);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        tiles.push({ x, y });
      }
    }

    return tiles;
  }

  private lonToTileX(lon: number, zoom: number): number {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  }

  private latToTileY(lat: number, zoom: number): number {
    return Math.floor(
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
        Math.pow(2, zoom)
    );
  }

  private getTileUrl(x: number, y: number, z: number): string {
    // OpenStreetMap tile URL (or use your preferred tile provider)
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  }

  /**
   * Clear old caches
   */
  async clearOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = [this.cacheName, `${this.cacheName}-maps`];

    await Promise.all(
      cacheNames.map(cacheName => {
        if (!currentCaches.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    );
  }
}

// ============================================================================
// Background Sync
// ============================================================================

export function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then(registration => {
      // Register periodic background sync (for updates)
      if ('periodicSync' in registration) {
        (registration as any).periodicSync.register('sync-data', {
          minInterval: 24 * 60 * 60 * 1000, // Daily
        });
      }

      // Register one-time sync (when coming back online)
      registration.sync.register('sync-pending-data');
    });
  }
}

// ============================================================================
// Network Status
// ============================================================================

export class NetworkStatusManager {
  private listeners: Array<(online: boolean) => void> = [];

  constructor() {
    window.addEventListener('online', () => this.notifyListeners(true));
    window.addEventListener('offline', () => this.notifyListeners(false));
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  onStatusChange(callback: (online: boolean) => void) {
    this.listeners.push(callback);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(listener => listener(online));
  }

  /**
   * Check if device has good connectivity
   */
  async checkConnectionQuality(): Promise<'good' | 'poor' | 'offline'> {
    if (!navigator.onLine) return 'offline';

    // Use Network Information API if available
    const connection = (navigator as any).connection;
    if (connection) {
      const { effectiveType, downlink } = connection;
      
      if (effectiveType === '4g' && downlink > 5) return 'good';
      if (effectiveType === '3g' || effectiveType === '4g') return 'good';
      return 'poor';
    }

    // Fallback: measure latency
    try {
      const start = Date.now();
      await fetch('/api/ping', { method: 'HEAD' });
      const latency = Date.now() - start;

      if (latency < 200) return 'good';
      return 'poor';
    } catch {
      return 'offline';
    }
  }
}

// ============================================================================
// Install Prompt
// ============================================================================

export class PWAInstallManager {
  private deferredPrompt: any = null;

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    this.deferredPrompt = null;
    
    return outcome === 'accepted';
  }

  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }
}

// ============================================================================
// Push Notifications
// ============================================================================

export class PushNotificationManager {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    return await Notification.requestPermission();
  }

  async subscribe(): Promise<PushSubscription> {
    const registration = await navigator.serviceWorker.ready;
    
    // Get public VAPID key from server
    const response = await fetch('/api/push/vapid-key');
    const { publicKey } = await response.json();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(publicKey),
    });

    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    return subscription;
  }

  async sendNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission !== 'granted') {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      ...options,
    });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check storage quota
 */
export async function checkStorageQuota() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usageInMB = (estimate.usage || 0) / (1024 * 1024);
    const quotaInMB = (estimate.quota || 0) / (1024 * 1024);
    const percentUsed = (usageInMB / quotaInMB) * 100;

    return {
      usage: usageInMB,
      quota: quotaInMB,
      percentUsed,
      available: quotaInMB - usageInMB,
    };
  }

  return null;
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    return await navigator.storage.persist();
  }
  return false;
}

