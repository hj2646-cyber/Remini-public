// Remini 보호자 PWA — Service Worker (Web Push, iOS 16.4+)

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = { title: "Remini 알림", body: "", data: {} };
  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }
  const isRiskAlert =
    payload.data && ["warning", "emergency"].includes(payload.data.level);
  const options = {
    body: payload.body,
    icon: "/images/icon-192.png",
    badge: "/images/icon-192.png",
    data: payload.data || {},
    tag: (payload.data && payload.data.alertId) || "remini-alert",
    requireInteraction: isRiskAlert,
    vibrate: isRiskAlert ? [200, 100, 200, 100, 200] : [100],
  };
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      }),
  );
});
