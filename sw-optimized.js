// Optimized Service Worker with advanced caching strategies
const CACHE_NAME = 'devconnect-v2-optimized';
const STATIC_CACHE = 'devconnect-static-v2';
const RUNTIME_CACHE = 'devconnect-runtime-v2';

// Define cache strategies for different resource types
const CACHE_STRATEGIES = {
    // Critical resources - cache first with network fallback
    critical: [
        '/',
        '/index.html',
        '/index-optimized.html',
        '/styles/critical.css',
        '/styles/main.css',
        '/scripts/modules/ui.js',
        '/icons/logo.png',
        '/manifest.json'
    ],
    
    // External libraries - cache first (they rarely change)
    external: [
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        'https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css',
        'https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css',
        'https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js'
    ],
    
    // API data - network first with cache fallback
    api: [
        '/data/events.json'
    ],
    
    // Images - cache first with network fallback
    images: []
};

// Combined resources for initial cache
const urlsToCache = [
    ...CACHE_STRATEGIES.critical,
    ...CACHE_STRATEGIES.external
];

// Install event - pre-cache critical resources
self.addEventListener('install', event => {
    console.log('SW: Install event');
    
    event.waitUntil(
        Promise.all([
            // Cache static resources
            caches.open(STATIC_CACHE).then(cache => {
                console.log('SW: Caching static resources');
                return cache.addAll(urlsToCache);
            }),
            
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('SW: Activate event');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== RUNTIME_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Determine caching strategy based on resource type
    if (isCriticalResource(request.url)) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    } else if (isExternalResource(request.url)) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    } else if (isApiResource(request.url)) {
        event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
    } else if (isImageResource(request.url)) {
        event.respondWith(cacheFirstStrategy(request, RUNTIME_CACHE));
    } else if (isNavigationRequest(request)) {
        event.respondWith(networkFirstStrategy(request, STATIC_CACHE, '/index.html'));
    } else {
        // Default strategy - network first with cache fallback
        event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
    }
});

// Cache-first strategy: Check cache first, fallback to network
async function cacheFirstStrategy(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Update cache in background if resource is stale
            updateCacheInBackground(request, cache);
            return cachedResponse;
        }
        
        // Fetch from network and cache
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            cache.put(request, responseClone);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('SW: Cache-first strategy failed:', error);
        
        // Return cached response if available, even if stale
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline fallback for critical resources
        if (isCriticalResource(request.url)) {
            return new Response('App temporarily offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/plain' }
            });
        }
        
        throw error;
    }
}

// Network-first strategy: Try network first, fallback to cache
async function networkFirstStrategy(request, cacheName, fallbackUrl = null) {
    try {
        const networkResponse = await fetch(request, {
            // Add timeout for faster fallback to cache
            signal: AbortSignal.timeout(5000)
        });
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            const responseClone = networkResponse.clone();
            cache.put(request, responseClone);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('SW: Network failed, trying cache:', request.url);
        
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return fallback for navigation requests
        if (fallbackUrl && isNavigationRequest(request)) {
            const fallbackResponse = await cache.match(fallbackUrl);
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
        
        throw error;
    }
}

// Background cache update for stale resources
async function updateCacheInBackground(request, cache) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse);
        }
    } catch (error) {
        // Silently fail background updates
        console.log('SW: Background cache update failed:', error);
    }
}

// Resource type detection functions
function isCriticalResource(url) {
    return CACHE_STRATEGIES.critical.some(resource => url.includes(resource));
}

function isExternalResource(url) {
    return CACHE_STRATEGIES.external.some(resource => url.includes(resource)) ||
           url.includes('unpkg.com') ||
           url.includes('cdn.jsdelivr.net') ||
           url.includes('supabase.co');
}

function isApiResource(url) {
    return url.includes('/data/') || 
           url.includes('supabase.co') ||
           url.includes('/api/');
}

function isImageResource(url) {
    return url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i);
}

function isNavigationRequest(request) {
    return request.mode === 'navigate' || 
           (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Message handling for cache management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
    
    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        event.waitUntil(
            calculateCacheSize().then(size => {
                event.ports[0].postMessage({ size });
            })
        );
    }
});

// Calculate total cache size
async function calculateCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const key of keys) {
            const response = await cache.match(key);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }
    
    return totalSize;
}

// Periodic cache cleanup (if browser supports it)
if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    self.addEventListener('sync', event => {
        if (event.tag === 'cache-cleanup') {
            event.waitUntil(cleanupOldCaches());
        }
    });
}

async function cleanupOldCaches() {
    const cache = await caches.open(RUNTIME_CACHE);
    const keys = await cache.keys();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
                const age = now - new Date(dateHeader).getTime();
                if (age > maxAge) {
                    await cache.delete(key);
                }
            }
        }
    }
}

console.log('SW: Service Worker loaded with optimized caching strategies');