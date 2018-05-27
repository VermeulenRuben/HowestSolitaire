const CACHE_VERSION = 'v1::';
const OFFLINE_FUNDAMENTALS =
    [
        'index.html',
        'manifest.json',
        'assets/style/screen.css',
        'assets/script/localForage/localForage.js',
        'assets/script/storage.js',
        'assets/script/card.js',
        'assets/script/output.js',
        'assets/script/swReg.js',

        'audio/fx/click.mp3',
        'audio/bgm.mp3',

        'images/bg/page.png',
        'images/bg/table.png',
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
        'images/cards/error.png'
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

function fetchFromCacheOrNetwork(request) {
    caches.match(request).then(function (cached) {
        let networked = fetch(request)
            .then(fetchedFromNetwork, unableToResolve)
            .catch(unableToResolve);
        let offOrOnline = cached ? '(cached)' : '(network)';
        //ServiceWorkerSays("fetch event " + offOrOnline + " " + event.request.url);
        return cached || networked;

        function fetchedFromNetwork(response) {
            let cacheCopy = response.clone();
            //ServiceWorkerSays('fetch response from network. ' + event.request.url);
            caches.open(CACHE_VERSION + 'fetch-Solitaire').then(function add(cache) {
                cache.put(request, cacheCopy);
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
}

self.addEventListener('fetch', function (event) {
    ServiceWorkerSays("fetch event in progress...");
    if (event.request.method !== 'GET') {
        ServiceWorkerSays(
            "fetch event was ignored. Only the method " +
            "GET can be use for requesting a fetch not " + event.request.method);
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

function CacheAllCards() {
    let numbers = ["a",2,3,4,5,6,7,8,9,10,"j","q","k"];
    let categories = ["bee", "database", "social", "java"];
    categories.forEach(category => {
        numbers.forEach(nbr => {
            fetchFromCacheOrNetwork(new Request ("images/cards/" + category + "/" + nbr + ".png"))
        })
    })
}

CacheAllCards();

