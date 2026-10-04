import { precacheAndRoute } from 'workbox-precaching'

// A fetch handler that actually responds (not empty) is required for Android installability
self.addEventListener('fetch', (event) => {
  // This is a simple pass-through, but it's enough to satisfy Chrome Android
  event.respondWith(fetch(event.request))
})

precacheAndRoute(self.__WB_MANIFEST)