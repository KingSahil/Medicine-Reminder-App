export interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: Date
  endDate?: Date
  expiryDate: Date
  instructions?: string
  userId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Reminder {
  id: string
  medicineId: string
  scheduledTime: Date
  status: 'pending' | 'taken' | 'missed' | 'skipped'
  actualTakenTime?: Date
  userId: string
  createdAt: Date
}

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phoneNumber: string
  email?: string
  isPrimary: boolean
  userId: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  phoneNumber?: string
  emergencyContacts: EmergencyContact[]
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  notificationMethods: ('push' | 'email' | 'sms')[]
  reminderAdvanceTime: number // minutes before scheduled time
  timezone: string
  language: string
  emergencyMessage?: string
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  userId: string
  metadata?: {
    medicineAdded?: boolean
    reminderSet?: boolean
    action?: string
  }
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: {
    action: string
    title: string
  }[]
}

export interface EmergencyAlert {
  id: string
  userId: string
  location?: {
    latitude: number
    longitude: number
  }
  message: string
  timestamp: Date
  status: 'active' | 'resolved'
  respondedContacts: string[]
}
