/**
 * Offline Map Tile Caching Utility
 * 
 * Caches Mapbox tiles for offline use in the field.
 * Uses IndexedDB for efficient storage of map tiles.
 */

interface TileCoordinate {
  z: number; // zoom level
  x: number; // tile x coordinate
  y: number; // tile y coordinate
}

interface CachedTile {
  id: string;
  coordinate: TileCoordinate;
  blob: Blob;
  timestamp: number;
  size: number;
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
  zoomLevels: number[];
  tileCount: number;
  downloadedTiles: number;
  totalSize: number;
  createdAt: number;
  status: 'pending' | 'downloading' | 'complete' | 'error';
}

export class OfflineMapCache {
  private dbName = 'wla-offline-maps';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB
   */
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

        // Create tiles store
        if (!db.objectStoreNames.contains('tiles')) {
          const tilesStore = db.createObjectStore('tiles', { keyPath: 'id' });
          tilesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create regions store
        if (!db.objectStoreNames.contains('regions')) {
          db.createObjectStore('regions', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Download map tiles for a region
   */
  async downloadRegion(
    region: Omit<MapRegion, 'id' | 'downloadedTiles' | 'totalSize' | 'createdAt' | 'status'>,
    onProgress?: (progress: number, region: MapRegion) => void
  ): Promise<MapRegion> {
    await this.init();

    const mapRegion: MapRegion = {
      ...region,
      id: Date.now().toString(),
      downloadedTiles: 0,
      totalSize: 0,
      createdAt: Date.now(),
      status: 'downloading',
    };

    // Save region metadata
    await this.saveRegion(mapRegion);

    try {
      // Calculate all tiles needed
      const tilesToDownload: TileCoordinate[] = [];
      
      for (const zoom of region.zoomLevels) {
        const tiles = this.getTilesInBounds(region.bounds, zoom);
        tilesToDownload.push(...tiles);
      }

      mapRegion.tileCount = tilesToDownload.length;

      // Download tiles
      for (let i = 0; i < tilesToDownload.length; i++) {
        const tile = tilesToDownload[i];
        
        try {
          await this.downloadTile(tile);
          mapRegion.downloadedTiles++;
          
          // Update progress
          if (onProgress) {
            const progress = (mapRegion.downloadedTiles / mapRegion.tileCount) * 100;
            onProgress(progress, mapRegion);
          }
        } catch (error) {
          console.error(`Failed to download tile ${tile.z}/${tile.x}/${tile.y}:`, error);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      mapRegion.status = 'complete';
      await this.saveRegion(mapRegion);

      return mapRegion;
    } catch (error) {
      mapRegion.status = 'error';
      await this.saveRegion(mapRegion);
      throw error;
    }
  }

  /**
   * Download a single tile
   */
  private async downloadTile(coordinate: TileCoordinate): Promise<void> {
    const { z, x, y } = coordinate;
    const tileId = `${z}-${x}-${y}`;

    // Check if tile already exists
    const existing = await this.getTile(tileId);
    if (existing) {
      return;
    }

    // Download from Mapbox
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    const url = `https://api.mapbox.com/v4/mapbox.outdoors-v12/${z}/${x}/${y}@2x.png?access_token=${mapboxToken}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tile: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Save to IndexedDB
    const cachedTile: CachedTile = {
      id: tileId,
      coordinate,
      blob,
      timestamp: Date.now(),
      size: blob.size,
    };

    await this.saveTile(cachedTile);
  }

  /**
   * Get tiles in bounds at a specific zoom level
   */
  private getTilesInBounds(
    bounds: MapRegion['bounds'],
    zoom: number
  ): TileCoordinate[] {
    const tiles: TileCoordinate[] = [];

    const minTileX = this.lonToTileX(bounds.west, zoom);
    const maxTileX = this.lonToTileX(bounds.east, zoom);
    const minTileY = this.latToTileY(bounds.north, zoom);
    const maxTileY = this.latToTileY(bounds.south, zoom);

    for (let x = minTileX; x <= maxTileX; x++) {
      for (let y = minTileY; y <= maxTileY; y++) {
        tiles.push({ z: zoom, x, y });
      }
    }

    return tiles;
  }

  /**
   * Convert longitude to tile X coordinate
   */
  private lonToTileX(lon: number, zoom: number): number {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  }

  /**
   * Convert latitude to tile Y coordinate
   */
  private latToTileY(lat: number, zoom: number): number {
    const latRad = (lat * Math.PI) / 180;
    return Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
        Math.pow(2, zoom)
    );
  }

  /**
   * Save tile to IndexedDB
   */
  private async saveTile(tile: CachedTile): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tiles'], 'readwrite');
      const store = transaction.objectStore('tiles');
      const request = store.put(tile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get tile from IndexedDB
   */
  private async getTile(id: string): Promise<CachedTile | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tiles'], 'readonly');
      const store = transaction.objectStore('tiles');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save region metadata
   */
  private async saveRegion(region: MapRegion): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['regions'], 'readwrite');
      const store = transaction.objectStore('regions');
      const request = store.put(region);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all saved regions
   */
  async getAllRegions(): Promise<MapRegion[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['regions'], 'readonly');
      const store = transaction.objectStore('regions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a region and its tiles
   */
  async deleteRegion(regionId: string): Promise<void> {
    if (!this.db) await this.init();

    const region = await this.getRegion(regionId);
    if (!region) return;

    // Delete all tiles for this region
    const tiles = this.getTilesInBounds(region.bounds, region.zoomLevels[0]);
    
    for (const tile of tiles) {
      const tileId = `${tile.z}-${tile.x}-${tile.y}`;
      await this.deleteTile(tileId);
    }

    // Delete region metadata
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['regions'], 'readwrite');
      const store = transaction.objectStore('regions');
      const request = store.delete(regionId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get region by ID
   */
  private async getRegion(id: string): Promise<MapRegion | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['regions'], 'readonly');
      const store = transaction.objectStore('regions');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a tile
   */
  private async deleteTile(id: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tiles'], 'readwrite');
      const store = transaction.objectStore('tiles');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get total cache size
   */
  async getCacheSize(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tiles'], 'readonly');
      const store = transaction.objectStore('tiles');
      const request = store.getAll();

      request.onsuccess = () => {
        const tiles: CachedTile[] = request.result;
        const totalSize = tiles.reduce((sum, tile) => sum + tile.size, 0);
        resolve(totalSize);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all cached tiles
   */
  async clearAllTiles(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tiles', 'regions'], 'readwrite');
      
      const tilesRequest = transaction.objectStore('tiles').clear();
      const regionsRequest = transaction.objectStore('regions').clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Format size for display
   */
  static formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  /**
   * Estimate region download size
   */
  static estimateRegionSize(region: Pick<MapRegion, 'bounds' | 'zoomLevels'>): {
    tileCount: number;
    estimatedSize: string;
  } {
    let totalTiles = 0;

    for (const zoom of region.zoomLevels) {
      const cache = new OfflineMapCache();
      const tiles = cache['getTilesInBounds'](region.bounds, zoom);
      totalTiles += tiles.length;
    }

    // Average tile size is about 25-50KB
    const averageTileSize = 35 * 1024; // 35KB
    const estimatedBytes = totalTiles * averageTileSize;

    return {
      tileCount: totalTiles,
      estimatedSize: this.formatSize(estimatedBytes),
    };
  }
}

// Export singleton instance
export const offlineMapCache = new OfflineMapCache();

// Common PA fishing regions for quick download
export const PA_FISHING_REGIONS = {
  'raystown-lake': {
    name: 'Raystown Lake Area',
    bounds: { north: 40.50, south: 40.35, east: -78.00, west: -78.20 },
    zoomLevels: [12, 13, 14, 15],
  },
  'spring-creek': {
    name: 'Spring Creek Area',
    bounds: { north: 40.85, south: 40.75, east: -77.80, west: -77.95 },
    zoomLevels: [12, 13, 14, 15],
  },
  'lake-erie': {
    name: 'Lake Erie (Presque Isle)',
    bounds: { north: 42.20, south: 42.05, east: -80.00, west: -80.15 },
    zoomLevels: [11, 12, 13, 14],
  },
  'penn's-creek': {
    name: 'Penns Creek Area',
    bounds: { north: 40.90, south: 40.80, east: -77.35, west: -77.50 },
    zoomLevels: [12, 13, 14, 15],
  },
  'little-lehigh': {
    name: 'Little Lehigh Area',
    bounds: { north: 40.65, south: 40.55, east: -75.45, west: -75.60 },
    zoomLevels: [12, 13, 14, 15],
  },
};

