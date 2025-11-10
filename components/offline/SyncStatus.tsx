'use client';

import { useState, useEffect } from 'react';
import { offlineQueue } from '@/lib/offline/offline-queue';

export default function SyncStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Update online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Update pending count
    const updateCounts = async () => {
      const pending = await offlineQueue.getPendingCount();
      const failed = await offlineQueue.getFailedActions();
      setPendingCount(pending);
      setFailedCount(failed.length);
    };

    updateCounts();
    const countInterval = setInterval(updateCounts, 5000);

    // Listen for sync events
    const handleSyncEvent = (event: string, data?: any) => {
      if (event === 'sync-start') {
        setIsSyncing(true);
      } else if (event === 'sync-complete') {
        setIsSyncing(false);
        updateCounts();
      } else if (event === 'sync-error') {
        setIsSyncing(false);
        updateCounts();
      }
    };

    offlineQueue.addListener(handleSyncEvent);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(countInterval);
      offlineQueue.removeListener(handleSyncEvent);
    };
  }, []);

  const handleManualSync = async () => {
    await offlineQueue.syncQueue();
  };

  const handleClearFailed = async () => {
    if (confirm('Are you sure you want to clear all failed items?')) {
      await offlineQueue.clearFailedActions();
      const failed = await offlineQueue.getFailedActions();
      setFailedCount(failed.length);
    }
  };

  const handleRetryFailed = async () => {
    const failed = await offlineQueue.getFailedActions();
    for (const action of failed) {
      await offlineQueue.retryAction(action.id);
    }
  };

  // Only show if offline or has pending items
  if (isOnline && pendingCount === 0 && failedCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <>
      {/* Status Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 ${
          !isOnline
            ? 'bg-amber-600'
            : isSyncing
            ? 'bg-blue-600'
            : pendingCount > 0
            ? 'bg-purple-600'
            : failedCount > 0
            ? 'bg-red-600'
            : 'bg-green-600'
        } text-white py-2 px-4 shadow-lg`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isOnline && <span className="text-xl">📡</span>}
            {isSyncing && <span className="text-xl animate-spin">🔄</span>}
            {isOnline && !isSyncing && pendingCount > 0 && <span className="text-xl">⏳</span>}
            {failedCount > 0 && <span className="text-xl">⚠️</span>}

            <div>
              <div className="font-semibold">
                {!isOnline
                  ? 'Offline Mode'
                  : isSyncing
                  ? 'Syncing...'
                  : pendingCount > 0
                  ? `${pendingCount} item${pendingCount > 1 ? 's' : ''} pending`
                  : failedCount > 0
                  ? `${failedCount} item${failedCount > 1 ? 's' : ''} failed`
                  : 'All synced!'}
              </div>
              <div className="text-xs opacity-90">
                {!isOnline
                  ? 'Your data will sync when you reconnect'
                  : isSyncing
                  ? 'Please wait...'
                  : 'Tap for details'}
              </div>
            </div>
          </div>

          {isOnline && (pendingCount > 0 || failedCount > 0) && !isSyncing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleManualSync();
              }}
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
            >
              Sync Now
            </button>
          )}
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Offline Sync Status</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Connection Status */}
              <div className={`rounded-lg p-4 ${isOnline ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{isOnline ? '✓' : '📡'}</span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {isOnline ? 'Online' : 'Offline'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isOnline
                        ? 'Connected to the internet'
                        : 'No internet connection. Your data is saved locally.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Items */}
              {pendingCount > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">⏳</span>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {pendingCount} Pending Item{pendingCount > 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-600">
                        Waiting to sync to the cloud
                      </div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 ml-11">
                    <li>• Check-ins</li>
                    <li>• Observations</li>
                    <li>• Photos</li>
                    <li>• Challenge progress</li>
                  </ul>
                </div>
              )}

              {/* Failed Items */}
              {failedCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {failedCount} Failed Item{failedCount > 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-600">
                        These items couldn't be synced after 3 attempts
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-11">
                    <button
                      onClick={handleRetryFailed}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                    >
                      Retry All
                    </button>
                    <button
                      onClick={handleClearFailed}
                      className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg text-sm font-medium hover:bg-red-50"
                    >
                      Clear Failed
                    </button>
                  </div>
                </div>
              )}

              {/* Sync Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">How Offline Mode Works</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>All your actions are saved locally on this device</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>When you reconnect, everything syncs automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Photos are compressed and queued for upload</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>No data is lost - everything is backed up locally</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

