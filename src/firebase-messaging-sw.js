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


// 🔥 BACKGROUND MESSAGE
messaging.onBackgroundMessage(function (payload) {

    console.log('[firebase-messaging-sw.js] Received:', payload);

    const title = payload.data.title;
    const options = {
        body: payload.data.body,
        icon: '/assets/media/logos/p18-logo.png',
        badge: '/assets/media/logos/p18-logo.png',
        data: {
            route: payload.data.route
        }
    };

    self.registration.showNotification(title, options);
});


// 🔥 CLICK HANDLER
self.addEventListener('notificationclick', function (event) {

    event.notification.close();

    const route = event.notification.data.route || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {

                for (const client of clientList) {
                    if (client.url.includes(route) && 'focus' in client) {
                        return client.focus();
                    }
                }

                if (clients.openWindow) {
                    return clients.openWindow(route);
                }
            })
    );
});
