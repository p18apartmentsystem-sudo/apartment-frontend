importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message', payload);

  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/assets/media/logos/p18-logo.png', // 🔥 your app icon
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


// 🔥 IMPORTANT: Handle click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const route = event.notification.data?.route || '/dashboard';
  const urlToOpen = new URL(route, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});