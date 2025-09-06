'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Plus, Clock, Calendar, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface AddMedicineModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (medicine: any) => void
}

export default function AddMedicineModal({ isOpen, onClose, onAdd }: AddMedicineModalProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    reminderTimes: ['08:00'],
    startDate: '',
    endDate: '',
    expiryDate: '',
    instructions: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Medicine name is required'
    if (!formData.dosage) newErrors.dosage = 'Dosage is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'

    // Check if expiry date is in the future
    if (formData.expiryDate && new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future'
    }

    // Check if start date is not in the past
    const today = new Date().toISOString().split('T')[0]
    if (formData.startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Create medicine object
    const newMedicine = {
      id: Date.now().toString(),
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      reminderTimes: formData.reminderTimes,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      expiryDate: formData.expiryDate,
      instructions: formData.instructions,
      status: 'active',
      createdAt: new Date().toISOString(),
      nextDose: calculateNextDose(formData.reminderTimes)
    }

    onAdd(newMedicine)
    toast.success(`${formData.name} added successfully!`)
    handleClose()
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
    
    // If all times today have passed, use the first time tomorrow
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDate = tomorrow.toISOString().split('T')[0]
    return new Date(`${tomorrowDate}T${times[0]}:00`).toISOString()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      reminderTimes: ['08:00'],
      startDate: '',
      endDate: '',
      expiryDate: '',
      instructions: ''
    })
    setErrors({})
    onClose()
  }

  const addReminderTime = () => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, '12:00']
    }))
  }

  const updateReminderTime = (index: number, time: string) => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.map((t, i) => i === index ? time : t)
    }))
  }

  const removeReminderTime = (index: number) => {
    if (formData.reminderTimes.length > 1) {
      setFormData(prev => ({
        ...prev,
        reminderTimes: prev.reminderTimes.filter((_, i) => i !== index)
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose}></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{t('addMedicine')}</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Medicine Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('medicineName')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Aspirin"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('dosage')} *
              </label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dosage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 500mg, 2 tablets"
              />
              {errors.dosage && <p className="text-red-500 text-xs mt-1">{errors.dosage}</p>}
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('frequency')}
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="three-times-daily">Three Times Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>

            {/* Reminder Times */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reminderTimes')}
              </label>
              <div className="space-y-2">
                {formData.reminderTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateReminderTime(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.reminderTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReminderTime(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addReminderTime}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Time
                </button>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('startDate')} *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('endDate')}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('expiryDate')} *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('instructions')}
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Take with food, avoid alcohol, etc."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('addMedicine')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
