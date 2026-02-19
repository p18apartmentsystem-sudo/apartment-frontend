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

messaging.onBackgroundMessage(function (payload) {

  const notificationTitle = payload.data?.title || 'P18';

  const notificationOptions = {
    body: payload.data?.body,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-192x192.png',
    data: {
      route: payload.data?.route || '/apartment/updates'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const route = event.notification.data?.route || '/apartment/updates';

  event.waitUntil(
    clients.openWindow(self.location.origin + route)
  );
});