const CACHE_NAME = "offline-cache-v1";

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([
				"/"
				//Will add more pages here when we need them
			]);
		})
	);
});

self.addEventListener("fetch", (event) => {
	const requestUrl = new URL(event.request.url);
	const s3Domain = " capstone.s3";

	if (requestUrl.hostname.contains(s3Domain)) {
		return;
	}
	event.respondWith(
		caches
			.match(event.request)
			.then((response) => {
				if (response) {
					return response;
				}

				return fetch(event.request).then((networkResponse) => {
					if (
						!networkResponse ||
						networkResponse.status !== 200 ||
						networkResponse.type !== "basic"
					) {
						return networkResponse;
					}

					const responseToCache = networkResponse.clone();

					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});

					return networkResponse;
				});
			})
			.catch(() => {
				return caches.match("/offline.html");
			})
	);
});
