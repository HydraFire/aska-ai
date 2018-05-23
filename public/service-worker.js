/* eslint-disable */
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'ASKA';
  const options = {
    body: event.data.text(),
    icon: '/image/1439629286_367264191.jpg',
    badge: '/image/1439629286_367264191.jpg',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  let url = 'https://coub.com/view/yujzc';
  event.waitUntil(
    clients.matchAll({type: 'window'}).then( windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          // If so, just focus it.
          if (client.url === url && 'focus' in client) {
              return client.focus();
          }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
          return clients.openWindow(url);
      }
    })
  );
});
