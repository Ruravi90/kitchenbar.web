// Service Worker for Push Notifications
// Simple JavaScript version without TypeScript annotations

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  if (!event.data) {
    console.warn('Push event has no data');
    return;
  }

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nueva notificación',
      icon: data.icon || '/assets/icons/icon-192x192.png',
      badge: data.badge || '/assets/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [],
      tag: data.data && data.data.type ? data.data.type : 'default',
      requireInteraction: false
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'KitchenBar', options)
    );
 } catch (error) {
    console.error('Error showing notification:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  // Handle action buttons
  if (event.action) {
    console.log('Action clicked:', event.action);
  }

  // Open or focus the app
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Get URL to open based on notification data
        const urlToOpen = getUrlFromNotification(event.notification.data);

        // Check if a window is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }

        // Open new window if none exists
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

/**
 * Get URL to open based on notification type
 */
function getUrlFromNotification(data) {
  const baseUrl = self.registration.scope;

  if (!data || !data.type) {
    return baseUrl;
  }

  switch (data.type) {
    case 'new_order':
      return baseUrl + 'kitchen/orders';
    case 'order_update':
      return baseUrl + 'client/history';
    case 'table_request':
      return baseUrl + 'kitchen/attendance';
    default:
      return baseUrl;
  }
}
