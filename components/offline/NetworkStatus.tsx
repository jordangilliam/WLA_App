/**
 * Network Status component
 * Shows online/offline status, pending sync items, and manual sync controls
 */

'use client'

import { useState, useEffect } from 'react'
import { syncEngine, useSyncState } from '@/lib/offline/sync-engine'
import { db } from '@/lib/offline/indexeddb'

type OfflineStats = {
  syncQueue: number
  classes: number
  lessons: number
  photos: number
}

export default function NetworkStatus() {
  const syncState = useSyncState()
  const [stats, setStats] = useState<OfflineStats>({
    syncQueue: 0,
    classes: 0,
    lessons: 0,
    photos: 0,
  })
  const [showDetails, setShowDetails] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)

  useEffect(() => {
    loadStats()
    
    // Refresh stats every 10 seconds
    const interval = setInterval(loadStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    const dbStats = await db.getStats()
    setStats({
      syncQueue: dbStats.syncQueue ?? 0,
      classes: dbStats.classes ?? 0,
      lessons: dbStats.lessons ?? 0,
      photos: dbStats.photos ?? 0,
    })
    
    // Get cache size from service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        setCacheSize(event.data.size)
      }
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      )
    }
  }

  const handleManualSync = async () => {
    await syncEngine.sync()
    await loadStats()
  }

  const handleClearCache = async () => {
    if (confirm('Clear all cached content? This cannot be undone.')) {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
      }
      await db.clearAll()
      await loadStats()
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      {/* Status Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm text-white ${
          syncState.isOnline ? 'bg-green-600' : 'bg-red-600'
        } transition-all`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              syncState.isOnline ? 'bg-green-200' : 'bg-red-200'
            } animate-pulse`} />
            <span className="font-medium">
              {syncState.isOnline ? 'Online' : 'Offline'}
            </span>
            {syncState.status === 'syncing' && (
              <span className="text-xs opacity-80">Syncing...</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {stats.syncQueue > 0 && (
              <span className="text-xs">
                {stats.syncQueue} item{stats.syncQueue !== 1 ? 's' : ''} pending
              </span>
            )}
            
            {syncState.lastSync && (
              <span className="text-xs opacity-80">
                Last sync: {formatTime(syncState.lastSync)}
              </span>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs underline hover:no-underline"
            >
              {showDetails ? 'Hide' : 'Details'}
            </button>
          </div>
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="fixed top-10 left-0 right-0 z-40 bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sync Status */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Sync Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      syncState.status === 'syncing' ? 'text-blue-600' :
                      syncState.status === 'error' ? 'text-red-600' :
                      'text-green-600'
                    }`}>
                      {syncState.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-medium text-gray-900">
                      {stats.syncQueue}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last sync:</span>
                    <span className="font-medium text-gray-900">
                      {formatTime(syncState.lastSync)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleManualSync}
                  disabled={!syncState.isOnline || syncState.status === 'syncing'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {syncState.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>

              {/* Storage Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Local Storage</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classes:</span>
                    <span className="font-medium text-gray-900">{stats.classes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lessons:</span>
                    <span className="font-medium text-gray-900">{stats.lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Photos:</span>
                    <span className="font-medium text-gray-900">{stats.photos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cache size:</span>
                    <span className="font-medium text-gray-900">
                      {formatBytes(cacheSize)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleClearCache}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Clear Cache
                </button>
              </div>

              {/* Connection Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Connection</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className={`font-medium ${
                      syncState.isOnline ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {syncState.isOnline ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  {typeof navigator !== 'undefined' && (navigator as any).connection && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-gray-900">
                          {(navigator as any).connection.effectiveType || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Downlink:</span>
                        <span className="font-medium text-gray-900">
                          {(navigator as any).connection.downlink || '—'} Mbps
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-gray-700">
                  {syncState.isOnline
                    ? 'Changes will sync automatically'
                    : 'Changes are saved locally and will sync when online'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

