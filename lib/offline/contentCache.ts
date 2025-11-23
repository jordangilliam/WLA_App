/**
 * Offline Content Cache Manager
 * Downloads and caches lessons, guides, and other content for offline use
 */

interface CachedContent {
  id: string;
  type: 'lesson' | 'guide' | 'mission' | 'species';
  data: any;
  timestamp: number;
  size: number;
}

interface CacheStats {
  totalSize: number;
  itemCount: number;
  byType: Record<string, { count: number; size: number }>;
}

class ContentCacheManager {
  private dbName = 'wla-content-cache';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly CONTENT_EXPIRY_DAYS = 90;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('content')) {
          const contentStore = db.createObjectStore('content', { keyPath: 'id' });
          contentStore.createIndex('type', 'type', { unique: false });
          contentStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Cache content item
   */
  async cacheContent(id: string, type: CachedContent['type'], data: any): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const size = new Blob([JSON.stringify(data)]).size;
    const cached: CachedContent = {
      id,
      type,
      data,
      timestamp: Date.now(),
      size,
    };

    // Check cache size
    const stats = await this.getStats();
    if (stats.totalSize + size > this.MAX_CACHE_SIZE) {
      await this.clearOldestContent(size);
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['content'], 'readwrite');
      const store = transaction.objectStore('content');
      const request = store.put(cached);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cached content
   */
  async getContent(id: string): Promise<any | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction(['content'], 'readonly');
      const store = transaction.objectStore('content');
      const request = store.get(id);

      request.onsuccess = () => {
        const cached = request.result as CachedContent | undefined;
        if (cached && this.isContentValid(cached)) {
          resolve(cached.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all cached content of a type
   */
  async getContentByType(type: CachedContent['type']): Promise<any[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      const transaction = this.db.transaction(['content'], 'readonly');
      const store = transaction.objectStore('content');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = () => {
        const items = (request.result as CachedContent[]) || [];
        const valid = items.filter((item) => this.isContentValid(item));
        resolve(valid.map((item) => item.data));
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete cached content
   */
  async deleteContent(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['content'], 'readwrite');
      const store = transaction.objectStore('content');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all cached content
   */
  async clearAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['content'], 'readwrite');
      const store = transaction.objectStore('content');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve({ totalSize: 0, itemCount: 0, byType: {} });
        return;
      }

      const transaction = this.db.transaction(['content'], 'readonly');
      const store = transaction.objectStore('content');
      const request = store.getAll();

      request.onsuccess = () => {
        const items = (request.result as CachedContent[]) || [];
        const stats: CacheStats = {
          totalSize: 0,
          itemCount: items.length,
          byType: {},
        };

        items.forEach((item) => {
          stats.totalSize += item.size;
          if (!stats.byType[item.type]) {
            stats.byType[item.type] = { count: 0, size: 0 };
          }
          stats.byType[item.type].count++;
          stats.byType[item.type].size += item.size;
        });

        resolve(stats);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Check if content is cached
   */
  async isCached(id: string): Promise<boolean> {
    const content = await this.getContent(id);
    return content !== null;
  }

  private async clearOldestContent(minSizeToFree: number): Promise<void> {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['content'], 'readwrite');
      const store = transaction.objectStore('content');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'next');

      let freed = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && freed < minSizeToFree) {
          const item = cursor.value as CachedContent;
          freed += item.size;
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private isContentValid(content: CachedContent): boolean {
    const age = Date.now() - content.timestamp;
    return age < this.CONTENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  }
}

export const contentCache = new ContentCacheManager();

