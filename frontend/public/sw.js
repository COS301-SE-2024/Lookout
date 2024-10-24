const CACHE_NAME = "lookout-cache-v3";
const OFFLINE_URLS = [
	"/",
	"/index.html",
	"/HomeScreen.js",
	"/Profile.js",
	"/offline.html"
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames
						.filter((cacheName) => cacheName !== CACHE_NAME)
						.map((cacheName) => caches.delete(cacheName))
				)
			)
	);
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") {
		return;
	}
	event.respondWith(
		fetch(event.request)
			.then((networkResponse) => {
				if (
					!networkResponse ||
					(networkResponse.status !== 200 &&
						networkResponse.status !== 201 &&
						networkResponse.status !== 304)
				) {
					return networkResponse;
				}

				const responseToCache = networkResponse.clone();
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, responseToCache);
				});
				return networkResponse;
			})
			.catch(() => {
				return caches.match(event.request).then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse;
					}
					if (event.request.mode === "navigate") {
						return caches.match("/offline.html");
					}
				});
			})
	);
});
