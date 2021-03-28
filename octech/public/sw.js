/*  service_worker.js  */
  
const offlineCache = './offline.html';
// Adding the offline page 
// when installing the service worker
self.addEventListener('install', e => {
    // Wait until promise is finished 
    // Until it get rid of the service worker
    e.waitUntil(
        caches.open(offlineCache)
        .then(cache => {
            cache.add(offlineCache)
                // When everything is set
                .then(() => self.skipWaiting())
        })
    );
})
  
// Call Activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker - Activated')
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(
                    cache => {
                        if (cache !== offlineCache) {
                            console.log(
                              'Service Worker: Clearing Old Cache');
                            return caches.delete(cache);
                        }
                    }
                )
            )
        })
    );
  
});
  
// Call Fetch Event 
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        // If there is no internet
        fetch(e.request).catch((error) =>
            caches.match(offlineCache)
        )
    );
});