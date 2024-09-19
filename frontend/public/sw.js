// const CACHE_NAME = "lookout-v1";

// self.addEventListener("fetch", (event) => {
// 	if (event.request.url.includes("createPost")) {
// 		return;
// 	}

// 	event.respondWith(
// 		caches.match(event.request).then((response) => {
// 			if (response) {
// 				return response;
// 			}

// 			const fetchRequest = event.request.clone();

// 			return fetch(fetchRequest).then((response) => {
// 				if (
// 					!response ||
// 					response.status !== 200 ||
// 					response.type !== "basic"
// 				) {
// 					return response;
// 				}

// 				const responseToCache = response.clone();

// 				caches.open(CACHE_NAME).then((cache) => {
// 					cache.put(event.request, responseToCache);
// 				});

// 				return response;
// 			});
// 		})
// 	);
// });

// self.addEventListener("activate", (event) => {
// 	const cacheWhitelist = [CACHE_NAME];
// 	event.waitUntil(
// 		caches.keys().then((cacheNames) => {
// 			return Promise.all(
// 				cacheNames.map((cacheName) => {
// 					if (cacheWhitelist.indexOf(cacheName) === -1) {
// 						return caches.delete(cacheName);
// 					}
// 				})
// 			);
// 		})
// 	);
// });
