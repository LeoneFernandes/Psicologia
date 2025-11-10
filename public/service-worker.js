self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando...");
  event.waitUntil(
    caches.open("psicologia-cache-v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/manifest.json"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna o cache se existir, senão busca da internet
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", () => {
  console.log("Service Worker: Ativo!");
});
