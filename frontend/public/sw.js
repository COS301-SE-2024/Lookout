const CACHE_NAME = "offline-cache-v1";

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([
				"/HomeScreen.tsx",
				"/ExploreScreen.tsx",
				"/GroupScreen.tsx",
				"/CategoryPostsPage.tsx",
				"/LoginScreen.tsx",
				"/Profile.tsx",
				"/SignUpScreen.tsx"
				//Will add more pages here when we need them
			]);
		})
	);
});

self.addEventListener("fetch", (event) => {
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
