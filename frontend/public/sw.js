const CACHE_NAME = "lookout-cache-v2";
const OFFLINE_URLS = ["/", "/index.html", "/HomeScreen.tsx", "/Profile.tsx"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
	);
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
});

self.addEventListener("fetch", (event) => {
	if (event.request.url.includes("/createPost")) {
		return;
	}

	event.respondWith(
		fetch(event.request)
			.then((networkResponse) => {
				return caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				});
			})
			.catch(() => {
				return caches.match(event.request).then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse;
					} else {
						return caches.match("/offline.html");
					}
				});
			})
	);
});
