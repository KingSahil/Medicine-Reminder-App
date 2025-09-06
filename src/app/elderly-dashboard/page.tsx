'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { Heart, Pill, Clock, Camera, Mic, MicOff, User, Shield, AlertCircle, Phone, TrendingUp, Languages, Edit, Plus } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { getHindiVoiceService } from '../../lib/hindiVoiceService'
import EnhancedMedicineForm from '../../components/EnhancedMedicineForm'
import toast from 'react-hot-toast'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  timeSlots: string[]
  stockCount: number
  expiryDate: string
  withFood: 'before' | 'after' | 'anytime'
  imageUrl?: string
  lastTaken?: string
  adherenceStreak: number
}

interface UserProfile {
  name: string
  mode: 'self' | 'caretaker'
  elderlyUserId?: string
  voiceEnabled: boolean
  language: 'hi-IN' | 'en-IN'
}

export default function ElderlyDashboard() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAddMedicine, setShowAddMedicine] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const voiceService = getHindiVoiceService()

  // Mock data for demonstration
  useEffect(() => {
    // Load user profile from localStorage
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
    } else {
      router.push('/get-started')
      return
    }

    // Mock medicines data
    const mockMedicines: Medicine[] = [
      {
        id: '1',
        name: 'मेटफॉर्मिन / Metformin',
        dosage: '500mg',
        frequency: 'दिन में 2 बार',
        timeSlots: ['08:00', '20:00'],
        stockCount: 15,
        expiryDate: '2024-12-31',
        withFood: 'after',
        adherenceStreak: 12
      },
      {
        id: '2', 
        name: 'एस्प्रिन / Aspirin',
        dosage: '75mg',
        frequency: 'दिन में 1 बार',
        timeSlots: ['09:00'],
        stockCount: 8,
        expiryDate: '2024-11-15',
        withFood: 'after',
        adherenceStreak: 8
      },
      {
        id: '3',
        name: 'विटामिन डी / Vitamin D',
        dosage: '1000 IU',
        frequency: 'दिन में 1 बार',
        timeSlots: ['10:00'],
        stockCount: 25,
        expiryDate: '2025-03-20',
        withFood: 'anytime',
        adherenceStreak: 20
      }
    ]

    setMedicines(mockMedicines)
    setLoading(false)

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [router])

  // Voice announcement for medicine reminders
  const announceMedicineReminder = async (medicine: Medicine) => {
    if (!voiceEnabled) return
    
    try {
      await voiceService.speakMedicineReminder(
        medicine.name,
        medicine.dosage,
        currentTime.toLocaleTimeString('hi-IN'),
        medicine.withFood !== 'anytime' ? medicine.withFood : undefined
      )
    } catch (error) {
      console.error('Voice announcement failed:', error)
    }
  }

  // Check for upcoming reminders
  const getUpcomingReminders = () => {
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`

    return medicines.filter(medicine => 
      medicine.timeSlots.some(timeSlot => {
        const [hour, minute] = timeSlot.split(':').map(Number)
        const slotTime = hour * 60 + minute
        const currentTotalMinutes = currentHour * 60 + currentMinute
        return Math.abs(slotTime - currentTotalMinutes) <= 15 // Within 15 minutes
      })
    )
  }

  const upcomingReminders = getUpcomingReminders()

  // Adherence chart data
  const adherenceData = {
    labels: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
    datasets: [
      {
        label: 'दवा ली गई',
        data: [2, 3, 2, 3, 2, 1, 3],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2
      }
    ]
  }

  // Stock level chart
  const stockData = {
    labels: medicines.map(m => m.name.split(' / ')[0]),
    datasets: [
      {
        label: 'स्टॉक (दिन)',
        data: medicines.map(m => m.stockCount),
        backgroundColor: medicines.map(m => 
          m.stockCount <= 7 ? 'rgba(239, 68, 68, 0.8)' : 
          m.stockCount <= 15 ? 'rgba(245, 158, 11, 0.8)' : 
          'rgba(34, 197, 94, 0.8)'
        ),
        borderColor: medicines.map(m => 
          m.stockCount <= 7 ? 'rgba(239, 68, 68, 1)' : 
          m.stockCount <= 15 ? 'rgba(245, 158, 11, 1)' : 
          'rgba(34, 197, 94, 1)'
        ),
        borderWidth: 2
      }
    ]
  }

  // Medicine management functions
  const handleAddMedicine = (medicineData: any) => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: medicineData.name,
      dosage: medicineData.dosage,
      frequency: medicineData.frequency,
      timeSlots: medicineData.timeSlots,
      stockCount: medicineData.stockDays,
      expiryDate: medicineData.expiryDate,
      withFood: medicineData.foodTiming,
      adherenceStreak: 0
    }
    
    setMedicines(prev => [...prev, newMedicine])
    setShowAddMedicine(false)
    toast.success(language === 'hi' ? 'दवा जोड़ दी गई' : 'Medicine added successfully')
  }

  const handleEditMedicine = (medicineData: any) => {
    if (!editingMedicine) return
    
    const updatedMedicine: Medicine = {
      ...editingMedicine,
      name: medicineData.name,
      dosage: medicineData.dosage,
      frequency: medicineData.frequency,
      timeSlots: medicineData.timeSlots,
      stockCount: medicineData.stockDays,
      expiryDate: medicineData.expiryDate,
      withFood: medicineData.foodTiming
    }
    
    setMedicines(prev => prev.map(med => 
      med.id === editingMedicine.id ? updatedMedicine : med
    ))
    setEditingMedicine(null)
    setShowAddMedicine(false)
    toast.success(language === 'hi' ? 'दवा अपडेट हो गई' : 'Medicine updated successfully')
  }

  const startEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setShowAddMedicine(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('userProfile')
    localStorage.removeItem('userMode')
    router.push('/get-started')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-medical-600 mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-medical-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-medical-600 mr-3" />
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  {t('dashboard.welcome')} {userProfile?.name} जी
                </h1>
                <p className="text-sm text-gray-600">
                  {userProfile?.mode === 'self' ? t('login.self.mode') : t('login.caretaker.mode')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Add Medicine Button */}
              <button
                onClick={() => setShowAddMedicine(true)}
                className="bg-medical-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-medical-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('medicine.add.new')}
              </button>
              
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-2 text-gray-600 hover:text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
                title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              >
                <Languages className="w-5 h-5" />
              </button>
              
              {/* Voice Toggle */}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-lg transition-colors ${voiceEnabled ? 'bg-medical-100 text-medical-600' : 'bg-gray-100 text-gray-400'}`}
                title={voiceEnabled ? t('voice.enabled') : t('voice.disabled')}
              >
                {voiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              
              {/* Time Display */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {currentTime.toLocaleTimeString('hi-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="text-xs text-gray-600">
                  {currentTime.toLocaleDateString('hi-IN')}
                </p>
              </div>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Alert if needed */}
        {upcomingReminders.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-orange-800">
                  दवा का समय आ गया है!
                </h3>
                <p className="text-orange-700">
                  {upcomingReminders.length} दवाई लेने का समय है
                </p>
              </div>
              <button
                onClick={() => upcomingReminders.forEach(announceMedicineReminder)}
                className="ml-auto bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                📢 सुनें
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-medical-100">
            <div className="flex items-center">
              <Pill className="w-8 h-8 text-medical-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{medicines.length}</p>
                <p className="text-sm text-gray-600">{t('dashboard.total.medicines')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(medicines.reduce((acc, m) => acc + m.adherenceStreak, 0) / medicines.length)}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.average.streak')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-100">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{upcomingReminders.length}</p>
                <p className="text-sm text-gray-600">{t('dashboard.upcoming.reminders')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {medicines.filter(m => m.stockCount <= 7).length}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.low.stock')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medicine List */}
          <div className="bg-white rounded-xl shadow-sm border border-medical-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">{t('dashboard.todays.medicines')}</h2>
            </div>
            <div className="p-6 space-y-4">
              {medicines.map((medicine) => (
                <div key={medicine.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {medicine.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        medicine.stockCount <= 7 ? 'bg-red-100 text-red-800' :
                        medicine.stockCount <= 15 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {medicine.stockCount} {language === 'hi' ? 'दिन' : 'days'}
                      </span>
                      <button
                        onClick={() => startEditMedicine(medicine)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={t('edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>{language === 'hi' ? 'खुराक' : 'Dosage'}: {medicine.dosage}</div>
                    <div>{language === 'hi' ? 'आवृत्ति' : 'Frequency'}: {medicine.frequency}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {medicine.timeSlots.map((time, idx) => (
                        <span key={idx} className="bg-medical-100 text-medical-800 px-2 py-1 rounded text-sm">
                          {time}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => announceMedicineReminder(medicine)}
                      className="bg-medical-600 text-white px-3 py-1 rounded hover:bg-medical-700 text-sm"
                    >
                      🔊 {language === 'hi' ? 'रिमाइंडर' : 'Reminder'}
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'hi' ? 'स्ट्रीक' : 'Streak'}: {medicine.adherenceStreak} {language === 'hi' ? 'दिन' : 'days'}
                      </span>
                      <span className={`${
                        medicine.withFood === 'before' ? 'text-blue-600' :
                        medicine.withFood === 'after' ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {medicine.withFood === 'before' ? (language === 'hi' ? '🍽️ खाने से पहले' : '🍽️ Before food') :
                         medicine.withFood === 'after' ? (language === 'hi' ? '🍽️ खाने के बाद' : '🍽️ After food') :
                         (language === 'hi' ? '⏰ कभी भी' : '⏰ Anytime')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-6">
            {/* Adherence Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-medical-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('dashboard.weekly.report')}
              </h3>
              <Bar 
                data={adherenceData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 4
                    }
                  }
                }}
              />
            </div>

            {/* Stock Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-medical-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('dashboard.medicine.stock.status')}
              </h3>
              <Bar 
                data={stockData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Emergency Button */}
        <div className="mt-8 text-center">
          <button
            onClick={async () => {
              await voiceService.speakEmergencyAlert()
              toast.error('आपातकाल सेवा सक्रिय!')
            }}
            className="bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-red-700 shadow-lg"
          >
            🚨 {language === 'hi' ? 'आपातकाल' : 'Emergency'}
          </button>
        </div>
      </div>

      {/* Enhanced Medicine Form Modal */}
      {showAddMedicine && (
        <EnhancedMedicineForm
          initialData={editingMedicine ? {
            name: editingMedicine.name,
            dosage: editingMedicine.dosage,
            frequency: editingMedicine.frequency,
            timeSlots: editingMedicine.timeSlots,
            stockDays: editingMedicine.stockCount,
            expiryDate: editingMedicine.expiryDate,
            foodTiming: editingMedicine.withFood,
            instructions: '',
            priority: 'medium',
            color: '#3B82F6'
          } : undefined}
          onSubmit={editingMedicine ? handleEditMedicine : handleAddMedicine}
          onCancel={() => {
            setShowAddMedicine(false)
            setEditingMedicine(null)
          }}
          isEditing={!!editingMedicine}
          elderlyName={userProfile?.name}
        />
      )}
    </div>
  )
}
