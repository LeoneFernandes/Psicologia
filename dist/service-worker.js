const CACHE_NAME = "psicologia-cache-v3";
const OFFLINE_URL = "/";

// Instala o Service Worker e faz cache inicial
self.addEventListener("install", (event) => {
  console.log("🟢 [Service Worker] Instalando nova versão...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        OFFLINE_URL,
        "/manifest.json",
        "/favicon.ico",
      ])
    )
  );

  // força o SW a assumir controle imediatamente
  self.skipWaiting();
});

// Ativa e limpa versões antigas
self.addEventListener("activate", (event) => {
  console.log("⚡ [Service Worker] Ativo!");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Excluindo cache antigo:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  // Faz com que o SW novo controle as abas abertas
  self.clients.claim();

  // Notifica as abas abertas que há uma nova versão
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "NEW_VERSION_ACTIVATED" });
    });
  });
});

// Estratégia de cache com atualização em segundo plano
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });

          return networkResponse;
        })
        .catch(() => cachedResponse || caches.match(OFFLINE_URL));

      return cachedResponse || fetchPromise;
    })
  );
});
