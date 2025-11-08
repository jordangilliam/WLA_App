/**
 * Service Worker for WLA_App
 * Caches educational content, media, and API responses for offline access
 */

const CACHE_VERSION = 'wla-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`
const MEDIA_CACHE = `${CACHE_VERSION}-media`

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon.png',
]

// Media file extensions to cache
const MEDIA_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.mp3', '.pdf']

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/lessons',
  '/api/species',
  '/api/field-sites',
  '/api/classes',
]

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  
  // Force activation immediately
  self.skipWaiting()
})

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('wla-') && !name.startsWith(CACHE_VERSION))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  
  // Take control of all clients immediately
  return self.clients.claim()
})

/**
 * Fetch event - serve from cache or network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (isMediaFile(url)) {
    event.respondWith(cacheFirst(request, MEDIA_CACHE))
  } else if (isCacheableAPI(url)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  } else if (isPageRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  } else {
    // Default: network only
    event.respondWith(fetch(request))
  }
})

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/favicon.ico' ||
    url.pathname.match(/\.(woff|woff2|ttf|eot)$/)
  )
}

/**
 * Check if URL is a media file
 */
function isMediaFile(url) {
  return MEDIA_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))
}

/**
 * Check if URL is a cacheable API endpoint
 */
function isCacheableAPI(url) {
  return CACHEABLE_APIS.some((api) => url.pathname.startsWith(api))
}

/**
 * Check if request is a page navigation
 */
function isPageRequest(request) {
  return request.mode === 'navigate' || request.destination === 'document'
}

/**
 * Cache First strategy
 * Try cache first, fallback to network
 */
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    if (cached) {
      console.log('[SW] Serving from cache:', request.url)
      return cached
    }

    console.log('[SW] Not in cache, fetching:', request.url)
    const response = await fetch(request)

    // Cache successful responses
    if (response && response.status === 200) {
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.error('[SW] Cache first failed:', error)
    
    // Return offline page if available
    const offlineResponse = await caches.match('/offline')
    if (offlineResponse) {
      return offlineResponse
    }
    
    throw error
  }
}

/**
 * Network First strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request, cacheName) {
  try {
    console.log('[SW] Fetching from network:', request.url)
    const response = await fetch(request)

    // Cache successful responses
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    if (cached) {
      console.log('[SW] Serving from cache:', request.url)
      return cached
    }

    // Return offline page for navigation requests
    if (isPageRequest(request)) {
      const offlineResponse = await caches.match('/offline')
      if (offlineResponse) {
        return offlineResponse
      }
    }

    throw error
  }
}

/**
 * Message handler for cache management
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls)
      })
    )
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        )
      })
    )
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ size })
      })
    )
  }
})

/**
 * Calculate total cache size
 */
async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0

  for (const name of cacheNames) {
    const cache = await caches.open(name)
    const keys = await cache.keys()
    
    for (const request of keys) {
      const response = await cache.match(request)
      if (response) {
        const blob = await response.blob()
        totalSize += blob.size
      }
    }
  }

  return totalSize
}

console.log('[SW] Service worker loaded')
