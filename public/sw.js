// WLA App Service Worker - Offline Support
const CACHE_VERSION = 'wla-v1.0.0';
const RUNTIME_CACHE = 'wla-runtime';
const PRECACHE_URLS = [
  '/',
  '/learn',
  '/habitat',
  '/journal',
  '/map',
  '/birds',
  '/keys/macro',
  '/outreach',
  '/leaderboard',
  '/manifest.json',
];

// Install: Pre-cache core app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[SW] Pre-caching app shell');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      console.log('[SW] Skip waiting');
      return self.skipWaiting();
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch: Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip API routes (they need fresh data)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Handle different request types
  if (request.method === 'GET') {
    // For HTML pages: Network-first, then cache
    if (request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Clone and cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // If network fails, try cache
            return caches.match(request).then((cached) => {
              if (cached) {
                return cached;
              }
              // Return offline page if available
              return caches.match('/');
            });
          })
      );
      return;
    }

    // For other assets (CSS, JS, images): Cache-first, then network
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Return cached version and update in background
          fetch(request).then((response) => {
            if (response.status === 200) {
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, response);
              });
            }
          }).catch(() => {
            // Network failed, but we have cache
          });
          return cached;
        }

        // Not in cache, fetch from network
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});

// Background Sync (for future use with form submissions)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-journal-entries') {
    console.log('[SW] Background sync: journal entries');
    event.waitUntil(syncJournalEntries());
  }
});

async function syncJournalEntries() {
  // TODO: Implement background sync for journal entries
  // This would sync locally stored entries when connection is restored
  console.log('[SW] Syncing journal entries (not yet implemented)');
}

// Push Notifications (for future use)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'WLA Notification';
  const options = {
    body: data.body || 'New update from Wildlife Leadership Academy',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

console.log('[SW] Service worker loaded');

