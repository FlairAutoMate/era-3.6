
console.log('Service Worker is disabled in this environment.');
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
