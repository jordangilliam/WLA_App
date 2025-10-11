/**
 * Modern local storage utilities with TypeScript safety
 * Implements caching, error handling, and data migration
 */

type StorageKey = 'user-progress' | 'points-history' | 'preferences' | 'lesson-cache';

interface StorageValue<T> {
  data: T;
  timestamp: number;
  version: string;
}

const CURRENT_VERSION = '2.0.0';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

/**
 * Safely get data from localStorage with error handling
 */
export function getStorage<T>(key: StorageKey, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(`wla-${key}`);
    if (!item) return defaultValue;
    
    const parsed: StorageValue<T> = JSON.parse(item);
    
    // Check version compatibility
    if (parsed.version !== CURRENT_VERSION) {
      console.warn(`Storage version mismatch for ${key}, using default`);
      return defaultValue;
    }
    
    return parsed.data;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
}

/**
 * Safely set data in localStorage with versioning
 */
export function setStorage<T>(key: StorageKey, value: T): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const storageValue: StorageValue<T> = {
      data: value,
      timestamp: Date.now(),
      version: CURRENT_VERSION,
    };
    
    localStorage.setItem(`wla-${key}`, JSON.stringify(storageValue));
    
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: `wla-${key}`,
      newValue: JSON.stringify(storageValue),
    }));
    
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to storage:`, error);
    
    // Check if it's a quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded. Clearing old data...');
      clearOldCache();
    }
    
    return false;
  }
}

/**
 * Remove specific key from storage
 */
export function removeStorage(key: StorageKey): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(`wla-${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
}

/**
 * Clear all app storage (for reset functionality)
 */
export function clearAllStorage(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const keys: StorageKey[] = ['user-progress', 'points-history', 'preferences', 'lesson-cache'];
    keys.forEach(key => localStorage.removeItem(`wla-${key}`));
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

/**
 * Clear old cached data to free up space
 */
function clearOldCache(): void {
  try {
    removeStorage('lesson-cache');
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
}

/**
 * Export all data as JSON for backup
 */
export function exportAllData(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = {
      progress: getStorage('user-progress', {}),
      points: getStorage('points-history', []),
      preferences: getStorage('preferences', {}),
      exportedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}

/**
 * Import data from JSON backup
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.progress) setStorage('user-progress', data.progress);
    if (data.points) setStorage('points-history', data.points);
    if (data.preferences) setStorage('preferences', data.preferences);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

/**
 * Hook for listening to storage changes (cross-tab sync)
 */
export function onStorageChange(callback: (key: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (e: StorageEvent) => {
    if (e.key?.startsWith('wla-')) {
      callback(e.key);
    }
  };
  
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

/**
 * Get storage size in bytes (for diagnostics)
 */
export function getStorageSize(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith('wla-')) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    return 0;
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

