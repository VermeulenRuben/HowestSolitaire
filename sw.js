const CACHE_VERSION = 'v1::';
const OFFLINE_FUNDAMENTALS =
    [
        'index.html',
        'manifest.json',
        'assets/style/screen.css',
        'assets/script/card.js',
        'assets/script/output.js',
        'assets/script/swReg.js',

        'audio/fx/click.mp3',
        'audio/bgm.mp3',

        'images/bg.png',
        'images/reset.png',
        'images/soundState/sound-off.png',
        'images/soundState/sound-on.png',

        'images/wam/favicon192.png',
        "images/wam/favicon168.png",
        "images/wam/favicon144.png",
        "images/wam/favicon96.png",
        "images/wam/favicon72.png",
        "images/wam/favicon48.png",

        'images/cards/back.png',
        'images/cards/error.png',

        'images/cards/bee/a.png',
        'images/cards/bee/2.png',
        'images/cards/bee/3.png',
        'images/cards/bee/4.png',
        'images/cards/bee/5.png',
        'images/cards/bee/6.png',
        'images/cards/bee/7.png',
        'images/cards/bee/8.png',
        'images/cards/bee/9.png',
        'images/cards/bee/10.png',
        'images/cards/bee/j.png',
        'images/cards/bee/q.png',
        'images/cards/bee/k.png',

        'images/cards/database/a.png',
        'images/cards/database/2.png',
        'images/cards/database/3.png',
        'images/cards/database/4.png',
        'images/cards/database/5.png',
        'images/cards/database/6.png',
        'images/cards/database/7.png',
        'images/cards/database/8.png',
        'images/cards/database/9.png',
        'images/cards/database/10.png',
        'images/cards/database/j.png',
        'images/cards/database/q.png',
        'images/cards/database/k.png',

        'images/cards/java/a.png',
        'images/cards/java/2.png',
        'images/cards/java/3.png',
        'images/cards/java/4.png',
        'images/cards/java/5.png',
        'images/cards/java/6.png',
        'images/cards/java/7.png',
        'images/cards/java/8.png',
        'images/cards/java/9.png',
        'images/cards/java/10.png',
        'images/cards/java/j.png',
        'images/cards/java/q.png',
        'images/cards/java/k.png',

        'images/cards/social/a.png',
        'images/cards/social/2.png',
        'images/cards/social/3.png',
        'images/cards/social/4.png',
        'images/cards/social/5.png',
        'images/cards/social/6.png',
        'images/cards/social/7.png',
        'images/cards/social/8.png',
        'images/cards/social/9.png',
        'images/cards/social/10.png',
        'images/cards/social/j.png',
        'images/cards/social/q.png',
        'images/cards/social/k.png'
    ];

let ServiceWorkerSays = function (message) {
    console.log('Service-Worker: ' + message)
};

self.addEventListener('install', function (event) {
    ServiceWorkerSays("install event in progress...");
    event.waitUntil(caches.open(CACHE_VERSION + "howest-solitaire").then((cache) => {
        return cache.addAll(OFFLINE_FUNDAMENTALS)
    }).then(function () {
        ServiceWorkerSays("install completed.");
    }).catch(function (err) {
        ServiceWorkerSays("install failed: " + err)
    }))
});

self.addEventListener('fetch', function (event) {
    ServiceWorkerSays("fetch event in progress...");
    if (event.request.method !== 'GET') {
        ServiceWorkerSays(
            "fetch event was ignored. Only the method " +
            "GET can be use for requesting a fetch not " + event.request.method +
            " with url " + event.request.url);
    } else {
        event.respondWith(
            caches.match(event.request).then(function (cached) {
                let networked = fetch(event.request)
                    .then(fetchedFromNetwork, unableToResolve)
                    .catch(unableToResolve);
                let offOrOnline = cached ? '(cached)' : '(network)';
                //ServiceWorkerSays("fetch event " + offOrOnline + " " + event.request.url);
                return cached || networked;

                function fetchedFromNetwork(response) {
                    let cacheCopy = response.clone();
                    //ServiceWorkerSays('fetch response from network. ' + event.request.url);
                    caches.open(CACHE_VERSION + 'fetch-Solitaire').then(function add(cache) {
                        cache.put(event.request, cacheCopy);
                    }).then(function () {
                        //ServiceWorkerSays('fetch response stored in cache. ' + event.request.url);
                    });
                    return response;
                }

                function unableToResolve() {
                    ServiceWorkerSays('fetch request failed in both cache and network.');
                    return new Response('<h1>Service Unavailable</h1>', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/html'
                        })
                    });
                }
            })
        )
    }
});

self.addEventListener('activate', function (event) {
    ServiceWorkerSays('activate event in progress...');
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                return !key.startsWith(CACHE_VERSION);
            }).map(function (key) {
                return caches.delete(key);
            }));
        }).then(function () {
            ServiceWorkerSays('activate completed.');
        })
    );
});