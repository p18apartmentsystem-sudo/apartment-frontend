importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyB8TGN7rckv8UtO8tHjLTwzc0xcAHE9yxs",
    authDomain: "p18-apartment-system.firebaseapp.com",
    projectId: "p18-apartment-system",
    storageBucket: "p18-apartment-system.firebasestorage.app",
    messagingSenderId: "423719701111",
    appId: "1:423719701111:web:6ba467c48e0855871c9472",
    measurementId: "G-S9C4JETG0D",
});



const messaging = firebase.messaging();
// 🔥 Handle ALL incoming messages
self.addEventListener('push', function(event) {

  const payload = event.data.json();

  const title = payload.data?.title || 'Notification';
  const options = {
    body: payload.data?.body,
    icon: '/assets/media/logos/p18-logo.png',
    badge: '/assets/media/logos/p18-logo.png',
    data: {
      route: payload.data?.route || '/dashboard'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


// 🔥 Click handler
self.addEventListener('notificationclick', function(event) {

  event.notification.close();

  const route = event.notification.data.route || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {

        for (const client of clientList) {
          if ('focus' in client) {
            client.postMessage({ type: 'NAVIGATE', route });
            return client.focus();
          }
        }

        return clients.openWindow(route);
      })
  );
});
