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

// 🔔 Background notifications
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Background message ', payload);

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: '/assets/icons/icon-192x192.png',
            badge: '/assets/icons/icon-72x72.png'
        }
    );
});
