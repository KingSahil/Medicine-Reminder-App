'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, where, getDocs } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { Bell, Home, Users, PlusCircle, Edit, Trash2, Languages, Heart, Shield, AlertTriangle, Phone, Calendar, Clock, Pill } from 'lucide-react'
import toast from 'react-hot-toast'

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  timeSlots: string[]
  stockDays: number
  expiryDate: string
  foodTiming: 'before' | 'after' | 'with' | 'anytime'
  instructions: string
  elderlyUserId: string
  elderlyName: string
  lastTaken?: string
  adherenceStreak: number
}

interface ElderlyUser {
  id: string
  name: string
  phone: string
  emergencyContact: string
  lastActive: string
  medicineCount: number
}

export default function CaretakerDashboard() {
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<'dashboard' | 'medicines' | 'elderly'>('dashboard')
  const [elderlyUsers, setElderlyUsers] = useState<ElderlyUser[]>([])
  const [selectedElderly, setSelectedElderly] = useState<string | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [showAddMedicine, setShowAddMedicine] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [showAddElderly, setShowAddElderly] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form states
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    dosage: '',
    frequency: 'twice-daily',
    timeSlots: ['09:00', '21:00'],
    stockDays: 30,
    expiryDate: '',
    foodTiming: 'anytime' as 'before' | 'after' | 'with' | 'anytime',
    instructions: ''
  })

  const [elderlyForm, setElderlyForm] = useState({
    name: '',
    phone: '',
    emergencyContact: ''
  })

  useEffect(() => {
    loadElderlyUsers()
  }, [])

  useEffect(() => {
    if (selectedElderly) {
      loadMedicines(selectedElderly)
    }
  }, [selectedElderly])

  const loadElderlyUsers = async () => {
    try {
      // In demo mode, show sample elderly users
      const sampleUsers: ElderlyUser[] = [
        {
          id: 'demo-elderly-1',
          name: 'राम प्रसाद शर्मा (Ram Prasad Sharma)',
          phone: '+91-98765-43210',
          emergencyContact: '+91-98765-43211',
          lastActive: new Date().toISOString(),
          medicineCount: 4
        },
        {
          id: 'demo-elderly-2',
          name: 'सुशीला देवी (Sushila Devi)',
          phone: '+91-98765-43212',
          emergencyContact: '+91-98765-43213',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          medicineCount: 2
        }
      ]
      setElderlyUsers(sampleUsers)
      if (sampleUsers.length > 0) {
        setSelectedElderly(sampleUsers[0].id)
      }
    } catch (error) {
      console.error('Error loading elderly users:', error)
      toast.error('Failed to load elderly users')
    } finally {
      setLoading(false)
    }
  }

  const loadMedicines = async (elderlyId: string) => {
    try {
      // In demo mode, show sample medicines
      const sampleMedicines: Medicine[] = [
        {
          id: 'med-1',
          name: 'एस्पिरिन (Aspirin 75mg)',
          dosage: '1 tablet',
          frequency: 'once-daily',
          timeSlots: ['09:00'],
          stockDays: 15,
          expiryDate: '2024-12-31',
          foodTiming: 'after',
          instructions: 'खाना खाने के बाद लें',
          elderlyUserId: elderlyId,
          elderlyName: 'राम प्रसाद शर्मा',
          adherenceStreak: 7
        },
        {
          id: 'med-2',
          name: 'मेटफॉर्मिन (Metformin 500mg)',
          dosage: '1 tablet',
          frequency: 'twice-daily',
          timeSlots: ['08:00', '20:00'],
          stockDays: 25,
          expiryDate: '2025-06-30',
          foodTiming: 'with',
          instructions: 'भोजन के साथ लें',
          elderlyUserId: elderlyId,
          elderlyName: 'राम प्रसाद शर्मा',
          adherenceStreak: 12
        }
      ]
      setMedicines(sampleMedicines)
    } catch (error) {
      console.error('Error loading medicines:', error)
      toast.error('Failed to load medicines')
    }
  }

  const handleAddMedicine = async () => {
    if (!selectedElderly) {
      toast.error('Please select an elderly person first')
      return
    }

    try {
      const newMedicine: Omit<Medicine, 'id'> = {
        ...medicineForm,
        elderlyUserId: selectedElderly,
        elderlyName: elderlyUsers.find(u => u.id === selectedElderly)?.name || '',
        adherenceStreak: 0
      }

      // In demo mode, just add to local state
      const id = 'med-' + Date.now()
      setMedicines(prev => [...prev, { ...newMedicine, id }])
      
      setShowAddMedicine(false)
      setMedicineForm({
        name: '',
        dosage: '',
        frequency: 'twice-daily',
        timeSlots: ['09:00', '21:00'],
        stockDays: 30,
        expiryDate: '',
        foodTiming: 'anytime',
        instructions: ''
      })
      
      toast.success(language === 'hi' ? 'दवा जोड़ दी गई' : 'Medicine added successfully')
    } catch (error) {
      console.error('Error adding medicine:', error)
      toast.error('Failed to add medicine')
    }
  }

  const handleEditMedicine = async () => {
    if (!editingMedicine) return

    try {
      // In demo mode, update local state
      setMedicines(prev => prev.map(med => 
        med.id === editingMedicine.id 
          ? { ...med, ...medicineForm }
          : med
      ))
      
      setEditingMedicine(null)
      setMedicineForm({
        name: '',
        dosage: '',
        frequency: 'twice-daily',
        timeSlots: ['09:00', '21:00'],
        stockDays: 30,
        expiryDate: '',
        foodTiming: 'anytime',
        instructions: ''
      })
      
      toast.success(language === 'hi' ? 'दवा अपडेट हो गई' : 'Medicine updated successfully')
    } catch (error) {
      console.error('Error updating medicine:', error)
      toast.error('Failed to update medicine')
    }
  }

  const handleDeleteMedicine = async (medicineId: string) => {
    try {
      // In demo mode, remove from local state
      setMedicines(prev => prev.filter(med => med.id !== medicineId))
      toast.success(language === 'hi' ? 'दवा हटा दी गई' : 'Medicine deleted successfully')
    } catch (error) {
      console.error('Error deleting medicine:', error)
      toast.error('Failed to delete medicine')
    }
  }

  const handleAddElderly = async () => {
    try {
      const newElderly: ElderlyUser = {
        id: 'elderly-' + Date.now(),
        ...elderlyForm,
        lastActive: new Date().toISOString(),
        medicineCount: 0
      }
      
      setElderlyUsers(prev => [...prev, newElderly])
      setShowAddElderly(false)
      setElderlyForm({ name: '', phone: '', emergencyContact: '' })
      
      toast.success(language === 'hi' ? 'बुजुर्ग व्यक्ति जोड़ा गया' : 'Elderly person added successfully')
    } catch (error) {
      console.error('Error adding elderly person:', error)
      toast.error('Failed to add elderly person')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/get-started')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const startEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setMedicineForm({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      timeSlots: medicine.timeSlots,
      stockDays: medicine.stockDays,
      expiryDate: medicine.expiryDate,
      foodTiming: medicine.foodTiming,
      instructions: medicine.instructions
    })
    setShowAddMedicine(true)
  }

  const updateTimeSlots = (frequency: string) => {
    const timeSlotMap: { [key: string]: string[] } = {
      'once-daily': ['09:00'],
      'twice-daily': ['09:00', '21:00'],
      'thrice-daily': ['08:00', '14:00', '20:00'],
      'four-times': ['07:00', '12:00', '17:00', '22:00']
    }
    return timeSlotMap[frequency] || ['09:00']
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                {t('caretaker.dashboard')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Languages className="h-5 w-5" />
              </button>
              
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
        {/* Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Home className="inline h-4 w-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('medicines')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'medicines'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Pill className="inline h-4 w-4 mr-2" />
            {t('caretaker.manage.medicines')}
          </button>
          <button
            onClick={() => setCurrentView('elderly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'elderly'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Users className="inline h-4 w-4 mr-2" />
            Elderly Users
          </button>
        </div>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Elderly User Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('caretaker.elderly.name')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {elderlyUsers.map((elderly) => (
                  <div
                    key={elderly.id}
                    onClick={() => setSelectedElderly(elderly.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedElderly === elderly.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{elderly.name}</h3>
                        <p className="text-sm text-gray-600">{elderly.phone}</p>
                        <p className="text-sm text-blue-600">{elderly.medicineCount} medicines</p>
                      </div>
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Overview */}
            {selectedElderly && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('dashboard.total.medicines')}</p>
                      <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
                    </div>
                    <Pill className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('dashboard.upcoming.reminders')}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {medicines.reduce((acc, med) => acc + med.timeSlots.length, 0)}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('dashboard.low.stock')}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {medicines.filter(med => med.stockDays < 7).length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('dashboard.adherence.streak')}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {medicines.length > 0 ? Math.round(medicines.reduce((acc, med) => acc + med.adherenceStreak, 0) / medicines.length) : 0} days
                      </p>
                    </div>
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Recent Medicines */}
            {selectedElderly && medicines.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.recent.medicines')}</h3>
                <div className="space-y-3">
                  {medicines.slice(0, 3).map((medicine) => (
                    <div key={medicine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                        <p className="text-sm text-gray-600">{medicine.dosage} - {medicine.frequency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{medicine.stockDays} days left</p>
                        <p className="text-xs text-gray-500">{medicine.adherenceStreak} {t('status.day.streak')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Medicines View */}
        {currentView === 'medicines' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('caretaker.manage.medicines')}</h2>
                {selectedElderly && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t('managing.medicines.for')}: {elderlyUsers.find(u => u.id === selectedElderly)?.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowAddMedicine(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                {t('medicine.add.new')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <div key={medicine.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{medicine.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditMedicine(medicine)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>{t('label.dosage')}:</strong> {medicine.dosage}</p>
                    <p><strong>{t('label.frequency')}:</strong> {medicine.frequency}</p>
                    <p><strong>{t('label.times')}:</strong> {medicine.timeSlots.join(', ')}</p>
                    <p><strong>{t('label.stock')}:</strong> {medicine.stockDays} {t('label.days')}</p>
                    <p><strong>{t('label.expires')}:</strong> {medicine.expiryDate}</p>
                    {medicine.instructions && (
                      <p><strong>{t('label.instructions')}:</strong> {medicine.instructions}</p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        {medicine.adherenceStreak} {t('status.day.streak')}
                      </span>
                      <span className={`font-medium ${medicine.stockDays < 7 ? 'text-red-600' : 'text-gray-600'}`}>
                        {medicine.stockDays < 7 ? t('status.low.stock') : t('status.stock.ok')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Elderly Users View */}
        {currentView === 'elderly' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.elderly.users')}</h2>
              <button
                onClick={() => setShowAddElderly(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                {t('caretaker.add.elderly')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elderlyUsers.map((elderly) => (
                <div key={elderly.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{elderly.name}</h3>
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>{t('label.phone')}:</strong> {elderly.phone}</p>
                    <p><strong>{t('label.emergency')}:</strong> {elderly.emergencyContact}</p>
                    <p><strong>{t('label.medicines')}:</strong> {elderly.medicineCount}</p>
                    <p><strong>{t('label.last.active')}:</strong> {new Date(elderly.lastActive).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => {
                        setSelectedElderly(elderly.id)
                        setCurrentView('medicines')
                      }}
                      className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      {t('button.manage.medicines')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Medicine Modal */}
      {showAddMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingMedicine ? t('medicine.edit') : t('medicine.add.new')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('medicine.name')}
                  </label>
                  <input
                    type="text"
                    value={medicineForm.name}
                    onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter medicine name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('medicine.dosage')}
                  </label>
                  <input
                    type="text"
                    value={medicineForm.dosage}
                    onChange={(e) => setMedicineForm({...medicineForm, dosage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1 tablet, 5ml"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('medicine.frequency')}
                  </label>
                  <select
                    value={medicineForm.frequency}
                    onChange={(e) => {
                      const frequency = e.target.value
                      setMedicineForm({
                        ...medicineForm, 
                        frequency,
                        timeSlots: updateTimeSlots(frequency)
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="once-daily">{t('frequency.once.daily')}</option>
                    <option value="twice-daily">{t('frequency.twice.daily')}</option>
                    <option value="thrice-daily">{t('frequency.thrice.daily')}</option>
                    <option value="four-times">{t('frequency.four.times')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('medicine.stock.days')}
                  </label>
                  <input
                    type="number"
                    value={medicineForm.stockDays}
                    onChange={(e) => setMedicineForm({...medicineForm, stockDays: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('medicine.expiry.date')}
                  </label>
                  <input
                    type="date"
                    value={medicineForm.expiryDate}
                    onChange={(e) => setMedicineForm({...medicineForm, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Timing
                  </label>
                  <select
                    value={medicineForm.foodTiming}
                    onChange={(e) => setMedicineForm({...medicineForm, foodTiming: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="before">{t('medicine.before.food')}</option>
                    <option value="after">{t('medicine.after.food')}</option>
                    <option value="with">{t('medicine.with.food')}</option>
                    <option value="anytime">{t('medicine.anytime')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('medicine.instructions')}
                  </label>
                  <textarea
                    value={medicineForm.instructions}
                    onChange={(e) => setMedicineForm({...medicineForm, instructions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Additional instructions (optional)"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddMedicine(false)
                    setEditingMedicine(null)
                    setMedicineForm({
                      name: '',
                      dosage: '',
                      frequency: 'twice-daily',
                      timeSlots: ['09:00', '21:00'],
                      stockDays: 30,
                      expiryDate: '',
                      foodTiming: 'anytime',
                      instructions: ''
                    })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={editingMedicine ? handleEditMedicine : handleAddMedicine}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingMedicine ? t('save') : t('add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Elderly Modal */}
      {showAddElderly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('caretaker.add.elderly')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('login.name')}
                  </label>
                  <input
                    type="text"
                    value={elderlyForm.name}
                    onChange={(e) => setElderlyForm({...elderlyForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('login.phone')}
                  </label>
                  <input
                    type="tel"
                    value={elderlyForm.phone}
                    onChange={(e) => setElderlyForm({...elderlyForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91-XXXXX-XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('caretaker.emergency.contacts')}
                  </label>
                  <input
                    type="tel"
                    value={elderlyForm.emergencyContact}
                    onChange={(e) => setElderlyForm({...elderlyForm, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91-XXXXX-XXXXX"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddElderly(false)
                    setElderlyForm({ name: '', phone: '', emergencyContact: '' })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddElderly}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
