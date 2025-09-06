'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Camera, Upload, Mic, MicOff, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface MedicineFormData {
  name: string
  dosage: string
  frequency: string
  timeSlots: string[]
  stockDays: number
  expiryDate: string
  foodTiming: 'before' | 'after' | 'with' | 'anytime'
  instructions: string
  priority: 'low' | 'medium' | 'high'
  color: string
}

interface EnhancedMedicineFormProps {
  initialData?: Partial<MedicineFormData>
  onSubmit: (data: MedicineFormData) => void
  onCancel: () => void
  isEditing?: boolean
  elderlyName?: string
}

export default function EnhancedMedicineForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false,
  elderlyName 
}: EnhancedMedicineFormProps) {
  const { t, language } = useLanguage()
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<any>(null)

  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    dosage: '',
    frequency: 'twice-daily',
    timeSlots: ['09:00', '21:00'],
    stockDays: 30,
    expiryDate: '',
    foodTiming: 'anytime',
    instructions: '',
    priority: 'medium',
    color: '#3B82F6',
    ...initialData
  })

  const frequencyOptions = {
    'once-daily': { times: ['09:00'], label: t('frequency.once.daily') },
    'twice-daily': { times: ['09:00', '21:00'], label: t('frequency.twice.daily') },
    'thrice-daily': { times: ['08:00', '14:00', '20:00'], label: t('frequency.thrice.daily') },
    'four-times': { times: ['07:00', '12:00', '17:00', '22:00'], label: t('frequency.four.times') },
    'weekly': { times: ['09:00'], label: t('frequency.weekly') },
    'as-needed': { times: [], label: t('frequency.as.needed') }
  }

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]

  useEffect(() => {
    if (formData.frequency in frequencyOptions) {
      setFormData(prev => ({
        ...prev,
        timeSlots: frequencyOptions[formData.frequency as keyof typeof frequencyOptions].times
      }))
    }
  }, [formData.frequency])

  const startVoiceRecording = async () => {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US'
        recognitionRef.current.interimResults = false
        recognitionRef.current.maxAlternatives = 1
        
        recognitionRef.current.onstart = () => {
          setIsVoiceRecording(true)
          toast.success(language === 'hi' ? 'आवाज़ रिकॉर्डिंग शुरू' : 'Voice recording started')
        }
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          
          if (currentStep === 1) {
            setFormData(prev => ({ ...prev, name: transcript }))
          } else if (currentStep === 2) {
            setFormData(prev => ({ ...prev, dosage: transcript }))
          } else if (currentStep === 6) {
            setFormData(prev => ({ ...prev, instructions: transcript }))
          }
          
          toast.success(language === 'hi' ? 'आवाज़ पहचान हो गई' : 'Voice recognized')
        }
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          toast.error(language === 'hi' ? 'आवाज़ में समस्या' : 'Voice recognition error')
          setIsVoiceRecording(false)
        }
        
        recognitionRef.current.onend = () => {
          setIsVoiceRecording(false)
        }
        
        recognitionRef.current.start()
      } else {
        toast.error(language === 'hi' ? 'आवाज़ सपोर्ट नहीं है' : 'Voice recognition not supported')
      }
    } catch (error) {
      console.error('Voice recording error:', error)
      toast.error(language === 'hi' ? 'आवाज़ रिकॉर्डिंग में समस्या' : 'Voice recording failed')
    }
  }

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsVoiceRecording(false)
  }

  const handlePhotoScan = async () => {
    try {
      toast(language === 'hi' ? 'फोटो स्कैन फीचर जल्द आ रहा है' : 'Photo scan feature coming soon', { icon: '📸' })
    } catch (error) {
      console.error('Photo scan error:', error)
      toast.error(language === 'hi' ? 'फोटो स्कैन में समस्या' : 'Photo scan failed')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error(language === 'hi' ? 'दवा का नाम जरूरी है' : 'Medicine name is required')
      return
    }
    
    if (!formData.dosage.trim()) {
      toast.error(language === 'hi' ? 'खुराक जरूरी है' : 'Dosage is required')
      return
    }
    
    onSubmit(formData)
  }

  const updateTimeSlot = (index: number, time: string) => {
    const newTimeSlots = [...formData.timeSlots]
    newTimeSlots[index] = time
    setFormData(prev => ({ ...prev, timeSlots: newTimeSlots }))
  }

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, '12:00']
    }))
  }

  const removeTimeSlot = (index: number) => {
    if (formData.timeSlots.length > 1) {
      const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, timeSlots: newTimeSlots }))
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('medicine.name')}</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder={language === 'hi' ? 'दवा का नाम लिखें' : 'Enter medicine name'}
              />
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={isVoiceRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    isVoiceRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isVoiceRecording ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                  {isVoiceRecording ? (language === 'hi' ? 'रुकें' : 'Stop') : t('medicine.voice.input')}
                </button>
                
                <button
                  type="button"
                  onClick={handlePhotoScan}
                  className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  {t('medicine.scan.photo')}
                </button>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('medicine.dosage')}</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder={language === 'hi' ? 'जैसे: 1 गोली, 5ml' : 'e.g., 1 tablet, 5ml'}
              />
              
              <div className="grid grid-cols-2 gap-3">
                {['1 tablet', '2 tablets', '5ml', '10ml', '1 teaspoon', '1 injection'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, dosage: option }))}
                    className="py-2 px-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              <button
                type="button"
                onClick={isVoiceRecording ? stopVoiceRecording : startVoiceRecording}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isVoiceRecording
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isVoiceRecording ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                {isVoiceRecording ? (language === 'hi' ? 'रुकें' : 'Stop') : t('medicine.voice.input')}
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('medicine.frequency')}</h3>
            <div className="space-y-3">
              {Object.entries(frequencyOptions).map(([key, option]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, frequency: key }))}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.frequency === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  {option.times.length > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      Times: {option.times.join(', ')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('medicine.time.slots')}</h3>
            <div className="space-y-3">
              {formData.timeSlots.map((time, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.timeSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addTimeSlot}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                + Add Time Slot
              </button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Medicine Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('medicine.stock.days')}
                </label>
                <input
                  type="number"
                  value={formData.stockDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockDays: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('medicine.expiry.date')}
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Food Timing
                </label>
                <select
                  value={formData.foodTiming}
                  onChange={(e) => setFormData(prev => ({ ...prev, foodTiming: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="before">{t('medicine.before.food')}</option>
                  <option value="after">{t('medicine.after.food')}</option>
                  <option value="with">{t('medicine.with.food')}</option>
                  <option value="anytime">{t('medicine.anytime')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'low', label: 'Low', color: 'green' },
                    { value: 'medium', label: 'Medium', color: 'yellow' },
                    { value: 'high', label: 'High', color: 'red' }
                  ].map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as any }))}
                      className={`py-2 px-3 border-2 rounded-lg font-medium transition-all ${
                        formData.priority === priority.value
                          ? `border-${priority.color}-500 bg-${priority.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('medicine.instructions')}</h3>
            <div className="space-y-3">
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder={language === 'hi' ? 'अतिरिक्त निर्देश (वैकल्पिक)' : 'Additional instructions (optional)'}
              />
              
              <button
                type="button"
                onClick={isVoiceRecording ? stopVoiceRecording : startVoiceRecording}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isVoiceRecording
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isVoiceRecording ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                {isVoiceRecording ? (language === 'hi' ? 'रुकें' : 'Stop') : t('medicine.voice.input')}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? t('medicine.edit') : t('medicine.add.new')}
              </h2>
              {elderlyName && (
                <p className="text-sm text-gray-600">{elderlyName}</p>
              )}
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex space-x-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  {language === 'hi' ? 'पिछला' : 'Previous'}
                </button>
              )}
              
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {language === 'hi' ? 'अगला' : 'Next'}
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {isEditing ? t('save') : t('add')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
