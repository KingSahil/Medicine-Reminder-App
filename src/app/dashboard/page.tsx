'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useLanguage } from '../../contexts/LanguageContext'
import { 
  Plus, 
  MessageCircle, 
  Calendar, 
  Shield, 
  Bell, 
  Settings,
  Heart,
  Clock,
  AlertTriangle,
  Pill,
  X
} from 'lucide-react'

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  reminderTimes: string[]
  startDate: string
  endDate?: string
  expiryDate: string
  instructions?: string
  status: 'active' | 'completed' | 'missed'
  createdAt: string
  nextDose: string
}

export default function DashboardPage() {
  const { language, setLanguage, t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'daily',
      reminderTimes: ['14:00'],
      startDate: '2024-01-01',
      expiryDate: '2024-12-15',
      status: 'active',
      createdAt: '2024-01-01',
      nextDose: '2024-01-20T14:00:00'
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'twice-daily',
      reminderTimes: ['08:00', '18:00'],
      startDate: '2024-01-01',
      expiryDate: '2024-11-20',
      status: 'active',
      createdAt: '2024-01-01',
      nextDose: '2024-01-20T18:00:00'
    },
    {
      id: '3',
      name: 'Aspirin',
      dosage: '81mg',
      frequency: 'daily',
      reminderTimes: ['08:00'],
      startDate: '2024-01-01',
      expiryDate: '2025-03-10',
      status: 'active',
      createdAt: '2024-01-01',
      nextDose: '2024-01-21T08:00:00'
    }
  ])

  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    reminderTimes: ['08:00'],
    startDate: '',
    expiryDate: '',
    instructions: ''
  })

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.startDate || !newMedicine.expiryDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const medicine: Medicine = {
      id: Date.now().toString(),
      ...newMedicine,
      status: 'active',
      createdAt: new Date().toISOString(),
      nextDose: calculateNextDose(newMedicine.reminderTimes)
    }

    setMedicines(prev => [...prev, medicine])
    toast.success(`${newMedicine.name} added successfully!`)
    setIsAddMedicineModalOpen(false)
    setNewMedicine({
      name: '',
      dosage: '',
      frequency: 'daily',
      reminderTimes: ['08:00'],
      startDate: '',
      expiryDate: '',
      instructions: ''
    })
  }

  const calculateNextDose = (times: string[]): string => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    for (const time of times) {
      const doseTime = new Date(`${today}T${time}:00`)
      if (doseTime > now) {
        return doseTime.toISOString()
      }
    }
    
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDate = tomorrow.toISOString().split('T')[0]
    return new Date(`${tomorrowDate}T${times[0]}:00`).toISOString()
  }

  const handleEmergencyCall = () => {
    toast.loading('Contacting emergency services...', { duration: 2000 })
    
    setTimeout(() => {
      toast.success('Emergency services have been contacted! Your location has been shared.')
      // In a real app, this would actually call emergency services
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Emergency location:', position.coords)
          },
          (error) => {
            console.error('Location error:', error)
          }
        )
      }
    }, 2000)
  }

  const activeMedicines = medicines.filter(med => med.status === 'active')
  const todaysDoses = medicines.reduce((total, med) => total + med.reminderTimes.length, 0)
  const expiringMedicines = medicines.filter(med => {
    const expiryDate = new Date(med.expiryDate)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)
    return expiryDate <= oneMonthFromNow
  })

  const getStatusColor = (medicine: Medicine) => {
    const expiryDate = new Date(medicine.expiryDate)
    const now = new Date()
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
    
    if (expiryDate <= now) return 'text-red-600 bg-red-50'
    if (expiryDate <= oneWeekFromNow) return 'text-orange-600 bg-orange-50'
    return 'text-green-600 bg-green-50'
  }

  const getStatusText = (medicine: Medicine) => {
    const expiryDate = new Date(medicine.expiryDate)
    const now = new Date()
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
    
    if (expiryDate <= now) return 'Expired'
    if (expiryDate <= oneWeekFromNow) return 'Expiring Soon'
    return 'Active'
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MediRemind</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good afternoon! 👋
          </h1>
          <p className="text-gray-600">
            You have {activeMedicines.length} medicines to take today. Stay healthy!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Medicines</p>
                <p className="text-2xl font-bold text-gray-900">{activeMedicines.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Doses</p>
                <p className="text-2xl font-bold text-gray-900">{todaysDoses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">{expiringMedicines.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medicines List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Medicines
                </h2>
                <button 
                  onClick={() => setIsAddMedicineModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Medicine
                </button>
              </div>

              <div className="space-y-4">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Pill className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">
                            {medicine.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {medicine.dosage} • Next: {new Date(medicine.nextDose).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(medicine)}`}>
                          {getStatusText(medicine)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {medicine.expiryDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Chatbot */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <h3 className="ml-2 text-lg font-semibold text-gray-900">
                  AI Assistant
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ask me anything about your medicines or health routines!
              </p>
              <button 
                onClick={() => setIsChatbotOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
              >
                Start Chat
              </button>
            </div>

            {/* Emergency SOS */}
            <div className="bg-gradient-to-br from-red-50 to-red-50 border border-red-200 p-6 rounded-xl shadow-md">
              <div className="text-center">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Emergency SOS
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Instant help when you need it most
                </p>
                <button 
                  onClick={handleEmergencyCall}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors w-full animate-pulse"
                >
                  🆘 Emergency Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {isAddMedicineModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsAddMedicineModalOpen(false)}></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Medicine</h3>
                <button
                  onClick={() => setIsAddMedicineModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Aspirin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 500mg, 2 tablets"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newMedicine.frequency}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="twice-daily">Twice Daily</option>
                    <option value="three-times-daily">Three Times Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={newMedicine.startDate}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddMedicineModalOpen(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Medicine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Simple Chatbot Modal */}
      {isChatbotOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsChatbotOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <button onClick={() => setIsChatbotOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="text-sm">{t('chatbot.greeting')}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm">{t('chatbot.help.topics')}</p>
                    <ul className="text-xs mt-2 space-y-1">
                      <li>• {t('chatbot.topic.interactions')}</li>
                      <li>• {t('chatbot.topic.dosage')}</li>
                      <li>• {t('chatbot.topic.reminders')}</li>
                      <li>• {t('chatbot.topic.side.effects')}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        toast.success('AI response feature coming soon!')
                      }
                    }}
                  />
                  <button 
                    onClick={() => toast.success('AI response feature coming soon!')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
