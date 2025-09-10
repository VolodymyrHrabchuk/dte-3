self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches
      .open("app-static-v1")
      .then((cache) => cache.addAll(["/", "/manifest.webmanifest"]))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  e.respondWith(
    caches.match(request).then(
      (res) =>
        res ||
        fetch(request)
          .then((net) => {
            const copy = net.clone();
            caches.open("app-dyn-v1").then((c) => c.put(request, copy));
            return net;
          })
          .catch(() => res)
    )
  );
});
