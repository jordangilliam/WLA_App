/**
 * IndexedDB manager for offline storage
 * Replaces localStorage with robust structured storage
 * Supports photos, large datasets, and complex queries
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb'

// Database schema
interface WLADatabase extends DBSchema {
  // User data
  user_profile: {
    key: string
    value: {
      id: string
      email: string
      name: string
      role: string
      avatar_url?: string
      cached_at: number
    }
  }
  
  // Classes
  classes: {
    key: string
    value: {
      id: string
      name: string
      teacher_id: string
      class_code: string
      student_count: number
      cached_at: number
    }
    indexes: { 'by-teacher': string }
  }
  
  // Lessons and progress
  lessons: {
    key: string
    value: {
      id: string
      title: string
      content: string
      media_urls: string[]
      cached_at: number
    }
  }
  
  // User progress
  progress: {
    key: string
    value: {
      id: string
      user_id: string
      lesson_id: string
      status: string
      completed_at?: number
      synced: boolean
    }
    indexes: { 'by-user': string; 'by-sync': number }
  }
  
  // Check-ins (pending sync)
  checkins: {
    key: string
    value: {
      id: string
      user_id: string
      location_id: string
      lat: number
      lng: number
      timestamp: number
      photos: Blob[]
      notes: string
      synced: boolean
    }
    indexes: { 'by-sync': number; 'by-user': string }
  }
  
  // Photos (blob storage)
  photos: {
    key: string
    value: {
      id: string
      blob: Blob
      thumbnail: Blob
      metadata: {
        user_id: string
        taken_at: number
        location?: { lat: number; lng: number }
        size: number
      }
      synced: boolean
    }
    indexes: { 'by-sync': number; 'by-user': string }
  }
  
  // Sync queue
  sync_queue: {
    key: string
    value: {
      id: string
      action: 'create' | 'update' | 'delete'
      entity: string
      data: any
      timestamp: number
      attempts: number
      last_error?: string
    }
    indexes: { 'by-timestamp': number }
  }
}

class IndexedDBManager {
  private db: IDBPDatabase<WLADatabase> | null = null
  private readonly DB_NAME = 'wla_app_db'
  private readonly DB_VERSION = 1

  /**
   * Initialize database connection
   */
  async init(): Promise<void> {
    if (this.db) return

    this.db = await openDB<WLADatabase>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // User profile store
        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'id' })
        }

        // Classes store
        if (!db.objectStoreNames.contains('classes')) {
          const classStore = db.createObjectStore('classes', { keyPath: 'id' })
          classStore.createIndex('by-teacher', 'teacher_id')
        }

        // Lessons store
        if (!db.objectStoreNames.contains('lessons')) {
          db.createObjectStore('lessons', { keyPath: 'id' })
        }

        // Progress store
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'id' })
          progressStore.createIndex('by-user', 'user_id')
          progressStore.createIndex('by-sync', 'synced')
        }

        // Check-ins store
        if (!db.objectStoreNames.contains('checkins')) {
          const checkinStore = db.createObjectStore('checkins', { keyPath: 'id' })
          checkinStore.createIndex('by-sync', 'synced')
          checkinStore.createIndex('by-user', 'user_id')
        }

        // Photos store
        if (!db.objectStoreNames.contains('photos')) {
          const photoStore = db.createObjectStore('photos', { keyPath: 'id' })
          photoStore.createIndex('by-sync', 'synced')
          photoStore.createIndex('by-user', 'metadata.user_id')
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' })
          syncStore.createIndex('by-timestamp', 'timestamp')
        }
      },
    })
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    await this.init()
    return await this.db!.get('user_profile', userId)
  }

  /**
   * Save user profile
   */
  async saveUserProfile(profile: WLADatabase['user_profile']['value']) {
    await this.init()
    await this.db!.put('user_profile', { ...profile, cached_at: Date.now() })
  }

  /**
   * Get classes for a teacher
   */
  async getClassesByTeacher(teacherId: string) {
    await this.init()
    return await this.db!.getAllFromIndex('classes', 'by-teacher', teacherId)
  }

  /**
   * Save class
   */
  async saveClass(classData: WLADatabase['classes']['value']) {
    await this.init()
    await this.db!.put('classes', { ...classData, cached_at: Date.now() })
  }

  /**
   * Get lesson
   */
  async getLesson(lessonId: string) {
    await this.init()
    return await this.db!.get('lessons', lessonId)
  }

  /**
   * Save lesson for offline access
   */
  async saveLesson(lesson: WLADatabase['lessons']['value']) {
    await this.init()
    await this.db!.put('lessons', { ...lesson, cached_at: Date.now() })
  }

  /**
   * Save user progress
   */
  async saveProgress(progress: WLADatabase['progress']['value']) {
    await this.init()
    await this.db!.put('progress', progress)
  }

  /**
   * Get unsynced progress items
   */
  async getUnsyncedProgress() {
    await this.init()
    return await this.db!.getAllFromIndex('progress', 'by-sync', 0)
  }

  /**
   * Save check-in (queued for sync)
   */
  async saveCheckin(checkin: WLADatabase['checkins']['value']) {
    await this.init()
    await this.db!.put('checkins', checkin)
  }

  /**
   * Get unsynced check-ins
   */
  async getUnsyncedCheckins() {
    await this.init()
    return await this.db!.getAllFromIndex('checkins', 'by-sync', 0)
  }

  /**
   * Save photo
   */
  async savePhoto(photo: WLADatabase['photos']['value']) {
    await this.init()
    await this.db!.put('photos', photo)
  }

  /**
   * Get unsynced photos
   */
  async getUnsyncedPhotos() {
    await this.init()
    return await this.db!.getAllFromIndex('photos', 'by-sync', 0)
  }

  /**
   * Get photo by id
   */
  async getPhotoById(id: string) {
    await this.init()
    return await this.db!.get('photos', id)
  }

  /**
   * Add item to sync queue
   */
  async addToSyncQueue(item: Omit<WLADatabase['sync_queue']['value'], 'id'>) {
    await this.init()
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await this.db!.put('sync_queue', { ...item, id })
  }

  /**
   * Get sync queue items
   */
  async getSyncQueue() {
    await this.init()
    const items = await this.db!.getAllFromIndex('sync_queue', 'by-timestamp')
    return items.sort((a, b) => a.timestamp - b.timestamp)
  }

  /**
   * Remove item from sync queue
   */
  async removeFromSyncQueue(id: string) {
    await this.init()
    await this.db!.delete('sync_queue', id)
  }

  /**
   * Update sync queue item (for retry tracking)
   */
  async updateSyncQueueItem(id: string, updates: Partial<WLADatabase['sync_queue']['value']>) {
    await this.init()
    const item = await this.db!.get('sync_queue', id)
    if (item) {
      await this.db!.put('sync_queue', { ...item, ...updates })
    }
  }

  /**
   * Clear all data (for sign out)
   */
  async clearAll() {
    await this.init()
    const stores = ['user_profile', 'classes', 'lessons', 'progress', 'checkins', 'photos', 'sync_queue']
    
    for (const store of stores) {
      await this.db!.clear(store as any)
    }
  }

  /**
   * Get storage statistics
   */
  async getStats() {
    await this.init()
    
    const stats = {
      classes: await this.db!.count('classes'),
      lessons: await this.db!.count('lessons'),
      progress: await this.db!.count('progress'),
      checkins: await this.db!.count('checkins'),
      photos: await this.db!.count('photos'),
      syncQueue: await this.db!.count('sync_queue'),
    }

    return stats
  }

  /**
   * Estimate storage size
   */
  async estimateSize(): Promise<{ usage: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
      }
    }
    return { usage: 0, quota: 0 }
  }
}

// Singleton instance
export const db = new IndexedDBManager()

// Helper functions for common operations
export async function cacheUserData(userId: string, data: any) {
  await db.saveUserProfile({
    id: userId,
    ...data,
    cached_at: Date.now(),
  })
}

export async function cacheLesson(lessonId: string, lessonData: any) {
  await db.saveLesson({
    id: lessonId,
    ...lessonData,
    cached_at: Date.now(),
  })
}

export async function queueCheckin(checkinData: any) {
  await db.saveCheckin({
    ...checkinData,
    synced: false,
  })
  
  // Also add to sync queue
  await db.addToSyncQueue({
    action: 'create',
    entity: 'checkin',
    data: checkinData,
    timestamp: Date.now(),
    attempts: 0,
  })
}

export async function queuePhotoUpload(photoBlob: Blob, metadata: any) {
  const id = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Create thumbnail
  const thumbnail = await createThumbnail(photoBlob)
  
  await db.savePhoto({
    id,
    blob: photoBlob,
    thumbnail,
    metadata: {
      ...metadata,
      taken_at: Date.now(),
      size: photoBlob.size,
    },
    synced: false,
  })
  
  // Add to sync queue
  await db.addToSyncQueue({
    action: 'create',
    entity: 'photo',
    data: { id, metadata },
    timestamp: Date.now(),
    attempts: 0,
  })
  
  return id
}

/**
 * Create thumbnail from image blob
 */
async function createThumbnail(blob: Blob, maxSize: number = 200): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((thumbnailBlob) => {
        if (thumbnailBlob) {
          resolve(thumbnailBlob)
        } else {
          reject(new Error('Failed to create thumbnail'))
        }
      }, 'image/jpeg', 0.7)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })
}

