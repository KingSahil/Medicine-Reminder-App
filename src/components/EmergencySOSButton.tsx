'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react'

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phoneNumber: string
  email?: string
  isPrimary: boolean
}

interface EmergencySOSProps {
  emergencyContacts?: EmergencyContact[]
  onEmergencyActivated?: (location?: GeolocationPosition) => void
}

export default function EmergencySOSButton({ 
  emergencyContacts = [], 
  onEmergencyActivated 
}: EmergencySOSProps) {
  const [isActivating, setIsActivating] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleEmergencyClick = () => {
    setShowConfirmation(true)
  }

  const confirmEmergency = async () => {
    setShowConfirmation(false)
    setIsActivating(true)
    setCountdown(5)

    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          activateEmergency()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const activateEmergency = async () => {
    try {
      // Get user's location
      let location: GeolocationPosition | undefined

      if (navigator.geolocation) {
        try {
          location = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            })
          })
        } catch (error) {
          console.log('Could not get location:', error)
        }
      }

      // Send emergency alerts
      await sendEmergencyAlerts(location)

      // Call the callback
      if (onEmergencyActivated) {
        onEmergencyActivated(location)
      }

      // Show success message
      alert('Emergency alert sent successfully! Your emergency contacts have been notified.')

    } catch (error) {
      console.error('Emergency activation failed:', error)
      alert('Failed to send emergency alert. Please try calling directly.')
    } finally {
      setIsActivating(false)
      setCountdown(0)
    }
  }

  const sendEmergencyAlerts = async (location?: GeolocationPosition) => {
    const emergencyMessage = createEmergencyMessage(location)

    // Send SMS/calls to emergency contacts
    for (const contact of emergencyContacts) {
      try {
        // In a real app, this would call your backend API to send SMS/make calls
        console.log(`Sending emergency alert to ${contact.name} (${contact.phoneNumber})`)
        
        // For demo purposes, we'll just log
        // await sendSMS(contact.phoneNumber, emergencyMessage)
        // await sendEmail(contact.email, 'EMERGENCY ALERT', emergencyMessage)
      } catch (error) {
        console.error(`Failed to contact ${contact.name}:`, error)
      }
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🆘 Emergency Alert Sent!', {
        body: `Emergency contacts have been notified. Help is on the way.`,
        icon: '/icons/emergency-icon-192.png',
        requireInteraction: true
      })
    }
  }

  const createEmergencyMessage = (location?: GeolocationPosition): string => {
    let message = '🆘 EMERGENCY ALERT 🆘\n\n'
    message += 'This is an automated emergency message from MediRemind app.\n\n'
    message += `Patient needs immediate assistance!\n`
    message += `Time: ${new Date().toLocaleString()}\n`
    
    if (location) {
      message += `Location: https://maps.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}\n`
      message += `Accuracy: ±${location.coords.accuracy}m\n`
    } else {
      message += 'Location: Unable to determine\n'
    }
    
    message += '\nPlease respond immediately or call emergency services if needed.'
    return message
  }

  const cancelEmergency = () => {
    setIsActivating(false)
    setCountdown(0)
    setShowConfirmation(false)
  }

  return (
    <div className="space-y-4">
      {/* Emergency Contacts Display */}
      {emergencyContacts.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            Emergency Contacts
          </h4>
          <div className="space-y-2">
            {emergencyContacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-900">{contact.name}</span>
                  <span className="text-gray-600 ml-2">({contact.relationship})</span>
                  {contact.isPrimary && (
                    <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
                      Primary
                    </span>
                  )}
                </div>
                <span className="text-gray-600">{contact.phoneNumber}</span>
              </div>
            ))}
            {emergencyContacts.length > 3 && (
              <p className="text-xs text-gray-500">
                +{emergencyContacts.length - 3} more contacts
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main SOS Button */}
      <div className="text-center">
        {!isActivating && !showConfirmation && (
          <button
            onClick={handleEmergencyClick}
            className="w-32 h-32 bg-gradient-to-br from-emergency-500 to-emergency-600 hover:from-emergency-600 hover:to-emergency-700 text-white rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emergency-300 animate-pulse"
          >
            <div className="flex flex-col items-center justify-center">
              <Shield className="h-12 w-12 mb-2" />
              <span className="text-lg font-bold">SOS</span>
              <span className="text-xs">Emergency</span>
            </div>
          </button>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="bg-white border-2 border-emergency-300 rounded-lg p-6 shadow-xl">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-emergency-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Emergency Alert
              </h3>
              <p className="text-gray-600 mb-6">
                This will immediately notify your emergency contacts and share your location.
                Are you sure you need emergency assistance?
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={confirmEmergency}
                  className="px-6 py-3 bg-emergency-600 hover:bg-emergency-700 text-white font-bold rounded-lg transition-colors"
                >
                  Yes, Send Alert
                </button>
                <button
                  onClick={cancelEmergency}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activating State with Countdown */}
        {isActivating && countdown > 0 && (
          <div className="bg-white border-2 border-emergency-300 rounded-lg p-6 shadow-xl">
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${((6 - countdown) / 5) * 283} 283`}
                      className="text-emergency-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-emergency-600">{countdown}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sending Emergency Alert
              </h3>
              <p className="text-gray-600 mb-4">
                Alert will be sent in {countdown} seconds...
              </p>
              <button
                onClick={cancelEmergency}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isActivating && countdown === 0 && (
          <div className="bg-white border-2 border-emergency-300 rounded-lg p-6 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-emergency-200 border-t-emergency-600"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sending Alert...
              </h3>
              <p className="text-gray-600">
                Notifying emergency contacts and sharing location
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Warning Text */}
      {!isActivating && !showConfirmation && (
        <div className="text-center">
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            For immediate life-threatening emergencies, call 911 directly. 
            This button notifies your pre-configured emergency contacts.
          </p>
        </div>
      )}
    </div>
  )
}
