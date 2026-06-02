const cacheName = "DefaultCompany-WebGL InputField Test-0.1";
const contentToCache = [
    "Build/a01a93fd5ee6bb37c3e12dd443bc418f.loader.js",
    "Build/2823fc0e8b0d9609df1d05e11ed7aeb7.framework.js.unityweb",
    "Build/ac9c256bb348912a9342f2d3d2ce5a7f.data.unityweb",
    "Build/a4610751194c36a56176b694066a49c3.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
