'use client'

import { useState } from 'react'
import { X, Camera, Upload, Mic, Clock, Calendar, Pill } from 'lucide-react'
import MedicineScanner from './MedicineScanner'
import { getHindiVoiceService } from '@/lib/hindiVoiceService'
import toast from 'react-hot-toast'

interface AddMedicineFormProps {
  onSubmit: (medicine: any) => void
  onClose: () => void
}

interface MedicineForm {
  name: string
  dosage: string
  frequency: string
  timeSlots: string[]
  stockCount: number
  expiryDate: string
  withFood: 'before' | 'after' | 'anytime'
  instructions: string
}

export default function EnhancedAddMedicineForm({ onSubmit, onClose }: AddMedicineFormProps) {
  const [form, setForm] = useState<MedicineForm>({
    name: '',
    dosage: '',
    frequency: 'दिन में 1 बार',
    timeSlots: ['09:00'],
    stockCount: 30,
    expiryDate: '',
    withFood: 'anytime',
    instructions: ''
  })
  const [showScanner, setShowScanner] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const voiceService = getHindiVoiceService()

  const frequencyOptions = [
    { value: 'दिन में 1 बार', slots: ['09:00'] },
    { value: 'दिन में 2 बार', slots: ['09:00', '21:00'] },
    { value: 'दिन में 3 बार', slots: ['08:00', '14:00', '20:00'] },
    { value: 'दिन में 4 बार', slots: ['06:00', '12:00', '18:00', '22:00'] },
    { value: 'सप्ताह में 1 बार', slots: ['09:00'] },
    { value: 'आवश्यकता अनुसार', slots: [] }
  ]

  const handleFrequencyChange = (frequency: string) => {
    const option = frequencyOptions.find(opt => opt.value === frequency)
    if (option) {
      setForm(prev => ({
        ...prev,
        frequency,
        timeSlots: option.slots
      }))
    }
  }

  const handleTimeSlotChange = (index: number, value: string) => {
    const newTimeSlots = [...form.timeSlots]
    newTimeSlots[index] = value
    setForm(prev => ({ ...prev, timeSlots: newTimeSlots }))
  }

  const addTimeSlot = () => {
    setForm(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, '09:00']
    }))
  }

  const removeTimeSlot = (index: number) => {
    setForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }))
  }

  const handleMedicineScanned = (medicineInfo: any) => {
    setForm(prev => ({
      ...prev,
      name: medicineInfo.name,
      dosage: medicineInfo.dosage !== 'जानकारी नहीं मिली' ? medicineInfo.dosage : prev.dosage,
      expiryDate: medicineInfo.expiryDate !== 'जानकारी नहीं मिली' ? 
        new Date(medicineInfo.expiryDate).toISOString().split('T')[0] : prev.expiryDate
    }))
    setShowScanner(false)
    toast.success('दवा की जानकारी भर दी गई!')
  }

  const startVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('आवाज़ पहचान उपलब्ध नहीं है')
      return
    }

    setIsListening(true)
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setForm(prev => ({ ...prev, name: transcript }))
      toast.success('आवाज़ सुन ली गई!')
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      toast.error('आवाज़ पहचान में समस्या')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.dosage || !form.expiryDate) {
      toast.error('कृपया सभी आवश्यक जानकारी भरें')
      return
    }

    // Voice confirmation
    await voiceService.speakCustomMessage(
      `दवा ${form.name} जोड़ी जा रही है। ${form.frequency} लेना है।`,
      'medium'
    )

    onSubmit({
      ...form,
      id: Date.now().toString(),
      adherenceStreak: 0,
      lastTaken: null
    })

    toast.success('दवा सफलतापूर्वक जोड़ी गई!')
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              नई दवा जोड़ें / Add New Medicine
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">त्वरित विकल्प / Quick Options:</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowScanner(true)}
                className="flex items-center px-4 py-2 bg-medical-100 text-medical-700 rounded-lg hover:bg-medical-200"
              >
                <Camera className="w-4 h-4 mr-2" />
                फोटो स्कैन / Photo Scan
              </button>
              
              <button
                onClick={startVoiceInput}
                disabled={isListening}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isListening 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isListening ? 'सुन रहे हैं...' : 'आवाज़ से नाम / Voice Input'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Medicine Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                दवा का नाम / Medicine Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                placeholder="दवा का नाम लिखें..."
                required
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                खुराक / Dosage *
              </label>
              <input
                type="text"
                value={form.dosage}
                onChange={(e) => setForm(prev => ({ ...prev, dosage: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                placeholder="जैसे: 500mg, 1 गोली..."
                required
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आवृत्ति / Frequency
              </label>
              <select
                value={form.frequency}
                onChange={(e) => handleFrequencyChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slots */}
            {form.timeSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  समय / Time Slots
                </label>
                <div className="space-y-3">
                  {form.timeSlots.map((time, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500"
                      />
                      {form.timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="text-medical-600 hover:text-medical-700 text-sm font-medium"
                  >
                    + और समय जोड़ें
                  </button>
                </div>
              </div>
            )}

            {/* Food Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                भोजन के साथ / With Food
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'before', label: 'खाने से पहले', icon: '🍽️→💊' },
                  { value: 'after', label: 'खाने के बाद', icon: '💊→🍽️' },
                  { value: 'anytime', label: 'कभी भी', icon: '⏰' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, withFood: option.value as any }))}
                    className={`p-3 border-2 rounded-lg text-center ${
                      form.withFood === option.value
                        ? 'border-medical-500 bg-medical-50 text-medical-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Count */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  स्टॉक (दिन) / Stock (days)
                </label>
                <input
                  type="number"
                  value={form.stockCount}
                  onChange={(e) => setForm(prev => ({ ...prev, stockCount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                  min="1"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  एक्सपायरी डेट / Expiry Date *
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                अतिरिक्त निर्देश / Additional Instructions
              </label>
              <textarea
                value={form.instructions}
                onChange={(e) => setForm(prev => ({ ...prev, instructions: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                placeholder="डॉक्टर के विशेष निर्देश..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                रद्द करें / Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-medical-600 text-white py-3 rounded-lg font-semibold hover:bg-medical-700 transition-colors"
              >
                दवा जोड़ें / Add Medicine
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Medicine Scanner Modal */}
      {showScanner && (
        <MedicineScanner
          onMedicineDetected={handleMedicineScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  )
}
