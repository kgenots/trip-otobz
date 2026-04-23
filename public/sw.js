self.addEventListener("push", function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Price Drop Alert";
  const body = data.body || "Check prices now!";
  const icon = data.icon || "/icon-192.png";
  const url = data.data?.url || "/new/price";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      tag: "price-alert",
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", function(event) {
  const url = event.notification.data?.url || "/new/price";
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function(windowClients) {
      for (let i = 0; i < windowClients.length; i++) {
        if (windowClients[i].url.includes(url.split("?")[0])) {
          return windowClients[i].focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
