/**
 * Offline Map Cache Manager
 * Downloads and caches Mapbox tiles for offline use
 */

interface CachedTile {
  url: string;
  data: ArrayBuffer;
  timestamp: number;
  zoom: number;
}

interface MapRegion {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  minZoom: number;
  maxZoom: number;
  tiles: string[];
}

class MapCacheManager {
  private dbName = 'wla-map-cache';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private readonly MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly TILE_EXPIRY_DAYS = 30;

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

        // Tiles store
        if (!db.objectStoreNames.contains('tiles')) {
          const tilesStore = db.createObjectStore('tiles', { keyPath: 'url' });
          tilesStore.createIndex('timestamp', 'timestamp', { unique: false });
          tilesStore.createIndex('zoom', 'zoom', { unique: false });
        }

        // Regions store
        if (!db.objectStoreNames.contains('regions')) {
          const regionsStore = db.createObjectStore('regions', { keyPath: 'id' });
          regionsStore.createIndex('name', 'name', { unique: false });
        }
      };
    });
  }

  /**
   * Download and cache map tiles for a region
   */
  async cacheRegion(region: MapRegion, mapboxToken: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const tiles: CachedTile[] = [];

    // Calculate tiles needed for region
    for (let zoom = region.minZoom; zoom <= region.maxZoom; zoom++) {
      const tileBounds = this.getTileBounds(region.bounds, zoom);
      
      for (let x = tileBounds.minX; x <= tileBounds.maxX; x++) {
        for (let y = tileBounds.minY; y <= tileBounds.maxY; y++) {
          const tileUrl = this.getTileUrl(x, y, zoom, mapboxToken);
          tiles.push({
            url: tileUrl,
            data: new ArrayBuffer(0), // Will be filled when downloaded
            timestamp: Date.now(),
            zoom,
          });
        }
      }
    }

    // Download tiles
    for (const tile of tiles) {
      try {
        const response = await fetch(tile.url);
        if (response.ok) {
          const data = await response.arrayBuffer();
          tile.data = data;
          await this.saveTile(tile);
        }
      } catch (error) {
        console.error(`Failed to cache tile ${tile.url}:`, error);
      }
    }

    // Save region metadata
    await this.saveRegion(region);
  }

  /**
   * Get cached tile or fetch if not cached
   */
  async getTile(x: number, y: number, zoom: number, mapboxToken: string): Promise<ArrayBuffer | null> {
    if (!this.db) {
      await this.init();
    }

    const tileUrl = this.getTileUrl(x, y, zoom, mapboxToken);

    // Check cache first
    const cached = await this.loadTile(tileUrl);
    if (cached && this.isTileValid(cached)) {
      return cached.data;
    }

    // Fetch and cache
    try {
      const response = await fetch(tileUrl);
      if (response.ok) {
        const data = await response.arrayBuffer();
        await this.saveTile({
          url: tileUrl,
          data,
          timestamp: Date.now(),
          zoom,
        });
        return data;
      }
    } catch (error) {
      console.error(`Failed to fetch tile ${tileUrl}:`, error);
    }

    return null;
  }

  /**
   * Check if device is online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Get cached region
   */
  async getCachedRegion(regionId: string): Promise<MapRegion | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction(['regions'], 'readonly');
      const store = transaction.objectStore('regions');
      const request = store.get(regionId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * List all cached regions
   */
  async listCachedRegions(): Promise<MapRegion[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      const transaction = this.db.transaction(['regions'], 'readonly');
      const store = transaction.objectStore('regions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete cached region
   */
  async deleteRegion(regionId: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const region = await this.getCachedRegion(regionId);
    if (!region) return;

    // Delete tiles
    for (const tileUrl of region.tiles) {
      await this.deleteTile(tileUrl);
    }

    // Delete region
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['regions'], 'readwrite');
      const store = transaction.objectStore('regions');
      const request = store.delete(regionId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear expired tiles
   */
  async clearExpiredTiles(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const expiryTime = Date.now() - this.TILE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['tiles'], 'readwrite');
      const store = transaction.objectStore('tiles');
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(expiryTime);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async saveTile(tile: CachedTile): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['tiles'], 'readwrite');
      const store = transaction.objectStore('tiles');
      const request = store.put(tile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async loadTile(url: string): Promise<CachedTile | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction(['tiles'], 'readonly');
      const store = transaction.objectStore('tiles');
      const request = store.get(url);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteTile(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['tiles'], 'readwrite');
      const store = transaction.objectStore('tiles');
      const request = store.delete(url);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async saveRegion(region: MapRegion): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['regions'], 'readwrite');
      const store = transaction.objectStore('regions');
      const request = store.put(region);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private isTileValid(tile: CachedTile): boolean {
    const age = Date.now() - tile.timestamp;
    return age < this.TILE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  }

  private getTileUrl(x: number, y: number, zoom: number, token: string): string {
    // Mapbox tile URL format
    return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/${zoom}/${x}/${y}?access_token=${token}`;
  }

  private getTileBounds(bounds: MapRegion['bounds'], zoom: number): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    const minX = this.lonToTileX(bounds.west, zoom);
    const maxX = this.lonToTileX(bounds.east, zoom);
    const minY = this.latToTileY(bounds.north, zoom);
    const maxY = this.latToTileY(bounds.south, zoom);

    return { minX, maxX, minY, maxY };
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
}

export const mapCache = new MapCacheManager();

