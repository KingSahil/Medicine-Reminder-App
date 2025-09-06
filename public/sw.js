// Service Worker for Medicine Reminder App
// Handles background notifications and caching

const CACHE_NAME = 'medicine-reminder-v1'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icon.svg'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// Push event - handle push notifications from Firebase
self.addEventListener('push', (event) => {
  console.log('Push received:', event)
  
  let notificationData = {}
  
  if (event.data) {
    try {
      notificationData = event.data.json()
    } catch (e) {
      notificationData = {
        title: 'Medicine Reminder',
        body: event.data.text() || 'You have a medicine reminder',
        icon: '/icons/medicine-icon-192.png',
        badge: '/icons/medicine-badge-72.png'
      }
    }
  }

  const title = notificationData.title || 'Medicine Reminder'
  const options = {
    body: notificationData.body || 'Time to take your medicine!',
    icon: notificationData.icon || '/icons/medicine-icon-192.png',
    badge: notificationData.badge || '/icons/medicine-badge-72.png',
    vibrate: notificationData.vibrate || [200, 100, 200],
    tag: notificationData.tag || 'medicine-reminder',
    requireInteraction: true,
    actions: notificationData.actions || [
      {
        action: 'taken',
        title: '✅ Taken'
      },
      {
        action: 'snooze',
        title: '⏰ Snooze 10min'
      }
    ],
    data: notificationData.data || {}
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  const action = event.action
  const data = event.notification.data

  // Handle different actions
  switch (action) {
    case 'taken':
      handleMedicineTaken(data)
      break
    case 'snooze':
      handleMedicineSnooze(data, 10)
      break
    case 'skip':
      handleMedicineSkipped(data)
      break
    case 'acknowledge':
      console.log('Expiry warning acknowledged')
      break
    case 'replace':
      openWindow(`/dashboard?order=${data.medicineName}`)
      break
    default:
      // Default action - open the app
      openWindow('/dashboard')
      break
  }
})

// Helper function to open app window
function openWindow(url) {
  return clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
}

// Handle medicine taken action
function handleMedicineTaken(data) {
  console.log('Medicine marked as taken:', data)
  
  // Send message to app if it's open
  clients.matchAll().then((clientList) => {
    clientList.forEach((client) => {
      client.postMessage({
        type: 'MEDICINE_TAKEN',
        medicineId: data.medicineId,
        timestamp: new Date().toISOString()
      })
    })
  })

  // You would also update the backend/Firebase here
  // updateMedicineStatus(data.medicineId, 'taken', new Date())
}

// Handle medicine snooze action
function handleMedicineSnooze(data, minutes) {
  console.log(`Medicine snoozed for ${minutes} minutes:`, data)
  
  // Schedule new notification
  const snoozeTime = minutes * 60 * 1000
  setTimeout(() => {
    self.registration.showNotification(`⏰ Snoozed: Time to take ${data.medicineName}!`, {
      body: `${data.dosage} - Reminder after ${minutes} minute snooze`,
      icon: '/icons/medicine-icon-192.png',
      badge: '/icons/medicine-badge-72.png',
      vibrate: [200, 100, 200],
      tag: `medicine-snooze-${data.medicineId}`,
      requireInteraction: true,
      actions: [
        { action: 'taken', title: '✅ Taken' },
        { action: 'skip', title: '❌ Skip' }
      ],
      data: data
    })
  }, snoozeTime)

  // Notify app
  clients.matchAll().then((clientList) => {
    clientList.forEach((client) => {
      client.postMessage({
        type: 'MEDICINE_SNOOZED',
        medicineId: data.medicineId,
        snoozeMinutes: minutes,
        timestamp: new Date().toISOString()
      })
    })
  })
}

// Handle medicine skipped action
function handleMedicineSkipped(data) {
  console.log('Medicine marked as skipped:', data)
  
  // Notify app
  clients.matchAll().then((clientList) => {
    clientList.forEach((client) => {
      client.postMessage({
        type: 'MEDICINE_SKIPPED',
        medicineId: data.medicineId,
        timestamp: new Date().toISOString()
      })
    })
  })

  // You would also update the backend/Firebase here
  // updateMedicineStatus(data.medicineId, 'skipped', new Date())
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag)
  
  if (event.tag === 'medicine-status-sync') {
    event.waitUntil(syncMedicineStatus())
  }
})

// Sync medicine status when back online
function syncMedicineStatus() {
  // Get pending status updates from IndexedDB and sync with Firebase
  console.log('Syncing medicine status...')
  // Implementation would sync offline data with server
}
