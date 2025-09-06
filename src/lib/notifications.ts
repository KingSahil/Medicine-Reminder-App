import { getMessagingInstance } from './firebase'
import { NotificationPayload } from '@/types'

export class NotificationService {
  private static instance: NotificationService
  private registration: ServiceWorkerRegistration | null = null

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  async initializeFirebaseMessaging(): Promise<boolean> {
    try {
      const messaging = await getMessagingInstance()
      if (!messaging) return false

      // Register service worker
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.register('/sw.js')
      }

      return true
    } catch (error) {
      console.error('Error initializing Firebase messaging:', error)
      return false
    }
  }

  async scheduleMedicineReminder(
    medicineId: string,
    medicineName: string,
    dosage: string,
    scheduledTime: Date
  ): Promise<boolean> {
    const hasPermission = await this.requestPermission()
    if (!hasPermission) return false

    const now = new Date()
    const timeUntilReminder = scheduledTime.getTime() - now.getTime()

    if (timeUntilReminder <= 0) {
      // Send immediate notification
      return this.sendMedicineNotification(medicineName, dosage, 'now')
    }

    // Schedule future notification
    setTimeout(() => {
      this.sendMedicineNotification(medicineName, dosage, 'now')
    }, timeUntilReminder)

    // Also schedule a 15-minute early reminder
    const earlyReminderTime = timeUntilReminder - (15 * 60 * 1000) // 15 minutes early
    if (earlyReminderTime > 0) {
      setTimeout(() => {
        this.sendMedicineNotification(medicineName, dosage, '15 minutes')
      }, earlyReminderTime)
    }

    return true
  }

  private async sendMedicineNotification(
    medicineName: string,
    dosage: string,
    timing: string
  ): Promise<boolean> {
    try {
      const title = timing === 'now' 
        ? `Time to take ${medicineName}!` 
        : `Reminder: ${medicineName} in ${timing}`

      const options: NotificationOptions = {
        body: `${dosage} - Don't forget to take your medicine`,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: `medicine-${medicineName}`,
        requireInteraction: true,
        actions: [
          {
            action: 'taken',
            title: '✅ Taken',
          },
          {
            action: 'snooze',
            title: '⏰ Snooze 10min',
          },
          {
            action: 'skip',
            title: '❌ Skip',
          }
        ],
        data: {
          medicineId: medicineName,
          dosage,
          timestamp: new Date().toISOString()
        }
      }

      if ('serviceWorker' in navigator && this.registration) {
        // Use service worker for background notifications
        await this.registration.showNotification(title, options)
      } else {
        // Fallback to browser notification
        new Notification(title, options)
      }

      return true
    } catch (error) {
      console.error('Error sending notification:', error)
      return false
    }
  }

  async sendExpiryWarning(medicineName: string, expiryDate: Date): Promise<boolean> {
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    const title = `⚠️ ${medicineName} expiring soon!`
    const body = daysUntilExpiry <= 0 
      ? `${medicineName} has expired. Please replace it immediately.`
      : `${medicineName} expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}.`

    const options: NotificationOptions = {
      body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: `expiry-${medicineName}`,
      requireInteraction: true,
      actions: [
        {
          action: 'acknowledge',
          title: '✅ Acknowledged',
        },
        {
          action: 'replace',
          title: '🛒 Order Replacement',
        }
      ],
      data: {
        type: 'expiry',
        medicineName,
        expiryDate: expiryDate.toISOString()
      }
    }

    try {
      if ('serviceWorker' in navigator && this.registration) {
        await this.registration.showNotification(title, options)
      } else {
        new Notification(title, options)
      }
      return true
    } catch (error) {
      console.error('Error sending expiry warning:', error)
      return false
    }
  }

  async sendEmergencyAlert(emergencyContacts: Array<{ name: string; phone: string }>): Promise<boolean> {
    const title = '🆘 Emergency Alert Sent!'
    const contactNames = emergencyContacts.map(c => c.name).join(', ')
    const body = `Emergency contacts (${contactNames}) have been notified of your emergency.`

    const options: NotificationOptions = {
      body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'emergency-alert',
      requireInteraction: true,
      data: {
        type: 'emergency',
        timestamp: new Date().toISOString(),
        contacts: emergencyContacts
      }
    }

    try {
      if ('serviceWorker' in navigator && this.registration) {
        await this.registration.showNotification(title, options)
      } else {
        new Notification(title, options)
      }
      return true
    } catch (error) {
      console.error('Error sending emergency alert:', error)
      return false
    }
  }

  // Handle notification clicks
  handleNotificationClick(event: NotificationEvent): void {
    event.notification.close()

    const { action } = event
    const { data } = event.notification

    switch (action) {
      case 'taken':
        // Mark medicine as taken
        this.handleMedicineTaken(data.medicineId, data.timestamp)
        break
      case 'snooze':
        // Reschedule notification for 10 minutes
        this.handleMedicineSnooze(data.medicineId, 10)
        break
      case 'skip':
        // Mark as skipped
        this.handleMedicineSkipped(data.medicineId, data.timestamp)
        break
      case 'acknowledge':
        // Mark expiry warning as acknowledged
        console.log('Expiry warning acknowledged')
        break
      case 'replace':
        // Open replacement ordering flow
        this.handleReplaceOrder(data.medicineName)
        break
      default:
        // Open the app
        if (clients.openWindow) {
          clients.openWindow('/get-started')
        }
    }
  }

  private async handleMedicineTaken(medicineId: string, timestamp: string): Promise<void> {
    // Update database with taken status
    console.log(`Medicine ${medicineId} marked as taken at ${timestamp}`)
    // Implementation would update Firebase/database
  }

  private async handleMedicineSnooze(medicineId: string, minutes: number): Promise<void> {
    // Reschedule notification
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000)
    console.log(`Medicine ${medicineId} snoozed until ${snoozeTime}`)
    // Implementation would reschedule the notification
  }

  private async handleMedicineSkipped(medicineId: string, timestamp: string): Promise<void> {
    // Mark as skipped in database
    console.log(`Medicine ${medicineId} marked as skipped at ${timestamp}`)
    // Implementation would update Firebase/database
  }

  private async handleReplaceOrder(medicineName: string): Promise<void> {
    // Open ordering flow or redirect to pharmacy
    console.log(`Opening replacement order for ${medicineName}`)
    if (clients.openWindow) {
      clients.openWindow(`/get-started?order=${medicineName}`)
    }
  }
}
