const FALLBACK_GROCERY_IMAGE_URL = 'https://localhost:3100/images/fallback-grocery.png';
const fallbackImages = 'fallback-images';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(fallbackImages)
      .then(cache => {
        cache.add(FALLBACK_GROCERY_IMAGE_URL);
      })
  );
});

self.addEventListener('activate', event => {
  // caches.keys().filter(cache => cache !== fallbackImages).map(cache => cache.delete)
});

function fetchImageOrFallback(fetchEvent) {
  return fetch(fetchEvent.request, {
    mode: 'cors'
  }).then(response => {
    if (!response.ok) {
      return caches.match(FALLBACK_GROCERY_IMAGE_URL, { cacheName: fallbackImages });
    } else {
      return response;
    }
  }).catch((error) => {
    console.log(error);
    return caches.match(FALLBACK_GROCERY_IMAGE_URL, { cacheName: fallbackImages });
  })
}

self.addEventListener('fetch', event => {
  let acceptHeader = event.request.headers.get('accept');
  let requestUrl = new URL(event.request.url);
  if (acceptHeader.indexOf('image/*') >= 0) {
    if (requestUrl.pathname.indexOf('/images/') === 0) {
      event.respondWith(fetchImageOrFallback(event))
    }
  }
})