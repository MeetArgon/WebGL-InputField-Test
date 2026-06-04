


// ========================================
// INSTALL
// ========================================

self.addEventListener('install', function (e)
{
    console.log('[Service Worker] Install');

    // Force immediate activation
    self.skipWaiting();

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

});



