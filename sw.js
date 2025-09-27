// Service Worker pro Nech mě růst
// Verze 2.0 - Vylepšená funkcionalita a správné cesty

const CACHE_NAME = 'nech-me-rust-v2.0';

// BASE path derived from service worker location (works on GitHub Pages subpath)
const SW_BASE = (function(){
    const p = self.location.pathname.replace(/\/sw\.js$/, '/');
    return p;
})();

// Helper to resolve paths relative to SW base
function resolve(path) {
    if (!path) return SW_BASE;
    const clean = path.toString().replace(/^\/+/, '');
    return SW_BASE + clean;
}
function resolveList(list) {
    return list.map(p => resolve(p));
}

const OFFLINE_FALLBACK = 'offline.html';

// Základní soubory pro cache
const CORE_FILES = ['', 'index.html', 'offline.html', 'styles.css', 'script.js', 'events.js', 'translations.json'];

// HTML stránky
const HTML_PAGES = [
    '/udalosti.html',
    '/kontakt.html',
    '/virtualni-adopce.html',
    '/zvireci-obyvatele.html',
    '/prispet-kryptem.html'
];

// Obrázky a assety (s správnými cestami)
const ASSETS = [
    '/assets/logo.png',
    '/assets/logo-circle.png',
    '/assets/about-image.jpg',
    '/assets/adoption-hero.jpg',
    '/assets/animals-hero.jpg',
    '/assets/contact-hero.jpg',
    '/assets/hero-image.jpg',
    '/assets/virtual-adoption.jpg',
    '/assets/visit-image.jpg',
    '/assets/atila.jpg',
    '/assets/avala.jpg',
    '/assets/flicek.jpg',
    '/assets/karel.jpg',
    '/assets/kveta.jpg',
    '/assets/list.jpg',
    '/assets/lotka.jpg',
    '/assets/masa.jpg',
    '/assets/patricie.jpg',
    '/assets/princezna.jpg',
    '/assets/riky.jpg',
    '/assets/zorka.jpg',
    '/assets/6d320b75db83457e8ed3425dfcaaf36f.jpg'
];

// Externí zdroje (fonty, ikony)
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Všechny soubory pro cache
const urlsToCache = [
    ...CORE_FILES,
    ...HTML_PAGES,
    ...ASSETS,
    ...EXTERNAL_RESOURCES
];

// Instalace Service Worker
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching core files...');
                
                // Nejdříve cachujeme základní soubory
                return cache.addAll(resolveList(CORE_FILES))
                    .then(() => {
                        console.log('[SW] Core files cached successfully');
                        
                        // Pak postupně cachujeme ostatní soubory
                        return Promise.allSettled([
                            cache.addAll(resolveList(HTML_PAGES)),
                            cache.addAll(resolveList(EXTERNAL_RESOURCES)),
                            ...ASSETS.map(asset => 
                                cache.add(asset).catch(err => {
                                    console.warn(`[SW] Failed to cache ${asset}:`, err);
                                    return Promise.resolve();
                                })
                            )
                        ]);
                    });
            })
            .then(() => {
                console.log('[SW] Installation completed');
                // Přeskočit čekání a aktivovat nový SW
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Installation failed:', error);
            })
    );
});

// Aktivace Service Worker
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Activation completed');
                // Převzít kontrolu nad všemi klienty
                return self.clients.claim();
            })
    );
});

// Pomocné funkce
function isNavigationRequest(request) {
    return request.mode === 'navigate';
}

function isAssetRequest(request) {
    const url = new URL(request.url);
    return ASSETS.some(asset => url.pathname === asset) || 
           url.pathname.startsWith('/assets/');
}

function isHTMLRequest(request) {
    const url = new URL(request.url);
    return url.pathname.endsWith('.html') || url.pathname === '/';
}

function isExternalResource(request) {
    const url = new URL(request.url);
    return !url.origin.includes(self.location.origin);
}

// Fetch event handler
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorovat non-GET požadavky
    if (request.method !== 'GET') {
        return;
    }
    
    // Ignorovat chrome-extension a další protokoly
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Navigační požadavky (HTML stránky)
    if (isNavigationRequest(request)) {
        event.respondWith(handleNavigationRequest(request));
        return;
    }
    
    // Assety (obrázky, CSS, JS)
    if (isAssetRequest(request) || isHTMLRequest(request)) {
        event.respondWith(handleAssetRequest(request));
        return;
    }
    
    // Externí zdroje (fonty, ikony)
    if (isExternalResource(request)) {
        event.respondWith(handleExternalRequest(request));
        return;
    }
    
    // Ostatní požadavky
    event.respondWith(handleOtherRequest(request));
});

// Obsluha navigačních požadavků (Network First)
async function handleNavigationRequest(request) {
    try {
        // Zkusit síť
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Uložit do cache pro příště
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('[SW] Network failed for navigation, trying cache:', error);
        
        // Zkusit cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback na offline stránku
        const offlineResponse = await caches.match(OFFLINE_FALLBACK);
        return offlineResponse || new Response('Offline', { status: 503 });
    }
}

// Obsluha assetů (Cache First)
async function handleAssetRequest(request) {
    try {
        // Zkusit cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Zkusit síť
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Uložit do cache
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('[SW] Failed to fetch asset:', request.url, error);
        
        // Pro obrázky vrátit placeholder
        if (request.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#f0f0f0"/><text x="150" y="100" text-anchor="middle" fill="#999" font-family="Arial">Obrázek nedostupný</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        }
        
        return new Response('Asset not available', { status: 404 });
    }
}

// Obsluha externích zdrojů (Cache First s dlouhým TTL)
async function handleExternalRequest(request) {
    try {
        // Zkusit cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Zkusit síť s timeoutem
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const networkResponse = await fetch(request, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (networkResponse.ok) {
            // Uložit do cache s dlouhým TTL
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('[SW] Failed to fetch external resource:', request.url, error);
        
        // Pro CSS vrátit prázdný stylesheet
        if (request.url.includes('.css')) {
            return new Response('/* External CSS not available */', {
                headers: { 'Content-Type': 'text/css' }
            });
        }
        
        return new Response('External resource not available', { status: 404 });
    }
}

// Obsluha ostatních požadavků (Network First)
async function handleOtherRequest(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Not available', { status: 404 });
    }
}

// Background sync pro offline akce
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('[SW] Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Zde můžete implementovat synchronizaci dat když se připojení obnoví
    console.log('[SW] Performing background sync...');
}

// Push notifications (pro budoucí použití)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/logo-circle.png',
            badge: '/assets/logo.png',
            vibrate: [100, 50, 100],
            data: data.data || {}
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Klik na notifikaci
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

// Zprávy od klienta
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('[SW] Service Worker script loaded');

