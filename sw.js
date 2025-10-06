// Plantilla de un service worker minimo

// 1. Nombre del sw y los archivos a cachear
const CACHE_NAME = 'mi-cache';
const urlsToCache = [
    'index.html',
    "manifest.json",
    'style.css',
    'offline.html',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png',
];

// 2. INSTALL -> se ejecuta al instalar el sw
// se cachean(se meten al cache) los recursos base de la PWA
self.addEventListener('install', (event) => {
    console.log("Service Worker: Instalando...");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
            console.log("Archivos Cacheados");
            return cache.addAll(urlsToCache)})
    )
});

// 3. ACTIVATE -> se ejecuta al activar el sw
// limpiar el cache viejo para mantener solo la version actual del cach
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
            keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
});

// 4. FETCH -> se ejecuta cuando se hace una peticion a la app
// Intercepta cada peticion de la PWA
// Busca primero en cache
// Si no TextEncoderStream, busca en internet
// En caso de FileSystemWritableFileStream, muestra la pagina offline.html
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => { return response || fetch(event.request)
                .catch(() => caches.match('offline.html'));
            })
    )
});

// 5. PUSH -> notificaciones en segundo plano
// Manejo de notificaciones push (Opcional)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.text() : 'Notificaciones sin texto'
    event.waitUntil(
        self.registration.showNotification('Mi PWA', {
            body: data,
            icon: 'icon.png'
        })
    )
});

