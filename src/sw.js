/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';

// This is the required `fetch` handler for Android installability
self.addEventListener('fetch', (event) => {
  // You can leave this empty, or add custom caching logic here
  // The presence of this listener is what matters for Android
});

precacheAndRoute(self.__WB_MANIFEST);