'use client'

import { useState } from 'react'
import { Plus, Calendar, Clock, Pill, X } from 'lucide-react'

interface MedicineFormData {
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate: string
  expiryDate: string
  instructions: string
}

interface AddMedicineFormProps {
  onSubmit: (medicineData: MedicineFormData) => void
  onCancel: () => void
  initialData?: Partial<MedicineFormData>
}

export default function AddMedicineForm({ 
  onSubmit, 
  onCancel, 
  initialData 
}: AddMedicineFormProps) {
  const [formData, setFormData] = useState<MedicineFormData>({
    name: initialData?.name || '',
    dosage: initialData?.dosage || '',
    frequency: initialData?.frequency || 'daily',
    times: initialData?.times || [''],
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    expiryDate: initialData?.expiryDate || '',
    instructions: initialData?.instructions || ''
  })

  const [errors, setErrors] = useState<Partial<MedicineFormData>>({})

  const frequencyOptions = [
    { value: 'daily', label: 'Once daily' },
    { value: 'twice-daily', label: 'Twice daily' },
    { value: 'three-times-daily', label: 'Three times daily' },
    { value: 'four-times-daily', label: 'Four times daily' },
    { value: 'as-needed', label: 'As needed' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom schedule' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<MedicineFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Medicine name is required'
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required'
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    } else {
      const expiryDate = new Date(formData.expiryDate)
      const today = new Date()
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future'
      }
    }

    if (formData.times.filter(time => time.trim()).length === 0) {
      newErrors.times = ['At least one time is required'] as any
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Filter out empty times
      const cleanedData = {
        ...formData,
        times: formData.times.filter(time => time.trim())
      }
      onSubmit(cleanedData)
    }
  }

  const handleInputChange = (field: keyof MedicineFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '']
    }))
  }

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }))
  }

  const updateTimeSlot = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((time, i) => i === index ? value : time)
    }))
  }

  const getTimeSlotsForFrequency = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 1
      case 'twice-daily':
        return 2
      case 'three-times-daily':
        return 3
      case 'four-times-daily':
        return 4
      default:
        return formData.times.length
    }
  }

  // Auto-adjust time slots based on frequency
  const handleFrequencyChange = (frequency: string) => {
    const requiredSlots = getTimeSlotsForFrequency(frequency)
    let newTimes = [...formData.times]

    if (requiredSlots > newTimes.length) {
      // Add more slots
      while (newTimes.length < requiredSlots) {
        newTimes.push('')
      }
    } else if (requiredSlots < newTimes.length && frequency !== 'custom') {
      // Reduce slots
      newTimes = newTimes.slice(0, requiredSlots)
    }

    setFormData(prev => ({ ...prev, frequency, times: newTimes }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Pill className="h-7 w-7 text-primary-600 mr-3" />
              Add New Medicine
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Medicine Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g., Lisinopril, Metformin"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                className={`input-field ${errors.dosage ? 'border-red-500' : ''}`}
                placeholder="e.g., 10mg, 500mg, 1 tablet"
              />
              {errors.dosage && (
                <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>
              )}
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => handleFrequencyChange(e.target.value)}
                className="input-field"
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Times *
              </label>
              <div className="space-y-2">
                {formData.times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      className="input-field flex-1"
                    />
                    {formData.times.length > 1 && formData.frequency === 'custom' && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {formData.frequency === 'custom' && (
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add another time
                  </button>
                )}
              </div>
              {errors.times && (
                <p className="mt-1 text-sm text-red-600">{errors.times[0]}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="input-field"
                  min={formData.startDate}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className={`input-field ${errors.expiryDate ? 'border-red-500' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                className="input-field min-h-[80px]"
                placeholder="e.g., Take with food, Avoid alcohol, Take on empty stomach..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Medicine
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary px-6"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
