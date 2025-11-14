if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        console.log("✅ Service Worker registrado:", reg.scope);
      })
      .catch((err) => {
        console.log("❌ Erro ao registrar o Service Worker:", err);
      });
  });
}
