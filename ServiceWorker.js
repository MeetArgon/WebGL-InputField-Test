
const cacheName =
    "DefaultCompany-WebGL InputField Test-0.1";

const contentToCache =
[
    "Build/c5d8ce08bf7608ef30b6f422ddc37119.loader.js",
    "Build/958547863e15fd6dfedea2ac7349c048.framework.js.unityweb",


    "Build/85cd9a587e653d9ac30065f17feb1f60.data.unityweb",
    "Build/ddd1bd15183f91045eaf4d7e38b3ba84.wasm.unityweb",

    "TemplateData/style.css"
];




// ========================================
// INSTALL
// ========================================

self.addEventListener('install', function (e)
{
    console.log('[Service Worker] Install');

    // Force immediate activation
    self.skipWaiting();


    e.waitUntil((async function ()
    {
        const cache = await caches.open(cacheName);

        console.log('[Service Worker] Caching all content');

        await cache.addAll(contentToCache);

    })());

});



// ========================================
// ACTIVATE
// ========================================

self.addEventListener('message', (event) =>
{
    if (event.data === 'skipWaiting')
    {
        self.skipWaiting();
    }
})

self.addEventListener('activate', function (e)
{
    console.log('[Service Worker] Activate');

    // Take control immediately
    self.clients.claim();


    e.waitUntil((async function ()
    {
        const keys = await caches.keys();

        await Promise.all(
            keys.map((key) =>
            {
                // Delete old cache versions
                if (key !== cacheName)
                {
                    console.log('[Service Worker] Removing old cache:', key);

                    return caches.delete(key);
                }
            })
        );

    })());

});




// ========================================
// FETCH
// ========================================

self.addEventListener('fetch', function (e)
{
    const url = e.request.url;

    // ONLY cache Unity static build files
    const shouldCache =
        url.includes('.data') ||
        url.includes('.wasm') ||
        url.includes('.framework.js') ||
        url.includes('.loader.js') ||
        url.includes('style.css');

    // Ignore everything else
    if (!shouldCache)
    {
        return;
    }

    e.respondWith((async function ()
    {
        console.log(`[Service Worker] Fetching: ${url}`);

        // Try cache first
        let response = await caches.match(e.request);

        if (response)
        {
            return response;
        }

        // Fetch from network
        response = await fetch(e.request);

        // Store in cache
        const cache = await caches.open(cacheName);

        cache.put(e.request, response.clone());

        return response;

    })());
});

