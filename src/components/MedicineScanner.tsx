'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, Scan, X, Check, Loader2 } from 'lucide-react'
import Webcam from 'react-webcam'
import Tesseract from 'tesseract.js'
import { getHindiVoiceService } from '@/lib/hindiVoiceService'
import toast from 'react-hot-toast'

interface MedicineInfo {
  name: string
  dosage: string
  manufacturer: string
  expiryDate: string
  batchNumber: string
  confidence: number
}

interface MedicineScannerProps {
  onMedicineDetected: (medicine: MedicineInfo) => void
  onClose: () => void
}

export default function MedicineScanner({ onMedicineDetected, onClose }: MedicineScannerProps) {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera')
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [ocrResult, setOcrResult] = useState<string>('')
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const voiceService = getHindiVoiceService()

  // Medicine name patterns in English and Hindi
  const medicinePatterns = [
    // Common diabetes medicines
    { pattern: /metformin|मेटफॉर्मिन/i, name: 'मेटफॉर्मिन / Metformin', category: 'diabetes' },
    { pattern: /glimepiride|ग्लिमेपिराइड/i, name: 'ग्लिमेपिराइड / Glimepiride', category: 'diabetes' },
    { pattern: /insulin|इंसुलिन/i, name: 'इंसुलिन / Insulin', category: 'diabetes' },
    
    // Blood pressure medicines
    { pattern: /amlodipine|एम्लोडिपिन/i, name: 'एम्लोडिपिन / Amlodipine', category: 'bp' },
    { pattern: /atenolol|एटेनोलोल/i, name: 'एटेनोलोल / Atenolol', category: 'bp' },
    { pattern: /losartan|लोसार्टन/i, name: 'लोसार्टन / Losartan', category: 'bp' },
    
    // Pain relief
    { pattern: /paracetamol|पैरासिटामोल/i, name: 'पैरासिटामोल / Paracetamol', category: 'pain' },
    { pattern: /aspirin|एस्प्रिन/i, name: 'एस्प्रिन / Aspirin', category: 'pain' },
    { pattern: /ibuprofen|आइबुप्रोफेन/i, name: 'आइबुप्रोफेन / Ibuprofen', category: 'pain' },
    
    // Vitamins
    { pattern: /vitamin\s*d|विटामिन\s*डी/i, name: 'विटामिन डी / Vitamin D', category: 'vitamin' },
    { pattern: /vitamin\s*b12|विटामिन\s*बी12/i, name: 'विटामिन बी12 / Vitamin B12', category: 'vitamin' },
    { pattern: /calcium|कैल्शियम/i, name: 'कैल्शियम / Calcium', category: 'vitamin' },
  ]

  // Dosage patterns
  const dosagePatterns = [
    /(\d+)\s*mg/i,
    /(\d+)\s*mcg/i,
    /(\d+)\s*iu/i,
    /(\d+)\s*ml/i,
    /(\d+)\s*tablet/i,
    /(\d+)\s*गोली/i
  ]

  // Expiry date patterns
  const expiryPatterns = [
    /exp[iry]*:?\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/i,
    /मियाद:?\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/i,
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/i
  ]

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setCapturedImage(imageSrc)
        processImage(imageSrc)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string
        setCapturedImage(imageSrc)
        processImage(imageSrc)
      }
      reader.readAsDataURL(file)
    }
  }

  const processImage = async (imageSrc: string) => {
    setIsProcessing(true)
    
    try {
      // Voice announcement
      await voiceService.speakCustomMessage('दवा की जानकारी स्कैन की जा रही है...', 'medium')
      
      // Perform OCR
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng+hin', {
        logger: m => console.log(m)
      })
      
      setOcrResult(text)
      console.log('OCR Result:', text)
      
      // Extract medicine information
      const medicineInfo = extractMedicineInfo(text)
      
      if (medicineInfo.name) {
        await voiceService.speakCustomMessage(
          `दवा मिली: ${medicineInfo.name}. ${medicineInfo.dosage} खुराक।`,
          'high'
        )
        onMedicineDetected(medicineInfo)
        toast.success('दवा की जानकारी मिल गई!')
      } else {
        await voiceService.speakCustomMessage('दवा की जानकारी स्पष्ट नहीं है। फिर से कोशिश करें।', 'medium')
        toast.error('दवा की जानकारी नहीं मिली')
      }
      
    } catch (error) {
      console.error('OCR Error:', error)
      await voiceService.speakCustomMessage('स्कैन करने में समस्या हुई। फिर से कोशिश करें।', 'medium')
      toast.error('स्कैन में समस्या हुई')
    } finally {
      setIsProcessing(false)
    }
  }

  const extractMedicineInfo = (text: string): MedicineInfo => {
    const cleanText = text.toLowerCase().replace(/\n/g, ' ')
    
    // Find medicine name
    let detectedMedicine = medicinePatterns.find(pattern => 
      pattern.pattern.test(cleanText)
    )
    
    // Extract dosage
    let dosage = 'जानकारी नहीं मिली'
    for (const pattern of dosagePatterns) {
      const match = cleanText.match(pattern)
      if (match) {
        dosage = match[0]
        break
      }
    }
    
    // Extract expiry date
    let expiryDate = 'जानकारी नहीं मिली'
    for (const pattern of expiryPatterns) {
      const match = cleanText.match(pattern)
      if (match) {
        expiryDate = match[0]
        break
      }
    }
    
    // Extract manufacturer (simplified)
    const manufacturerKeywords = ['pvt', 'ltd', 'pharma', 'pharmaceuticals', 'labs']
    const words = cleanText.split(' ')
    let manufacturer = 'जानकारी नहीं मिली'
    
    for (let i = 0; i < words.length; i++) {
      if (manufacturerKeywords.some(keyword => words[i].includes(keyword))) {
        manufacturer = words.slice(Math.max(0, i-2), i+1).join(' ')
        break
      }
    }
    
    // Extract batch number (simplified)
    const batchMatch = cleanText.match(/batch:?\s*([a-z0-9]+)/i) || 
                     cleanText.match(/lot:?\s*([a-z0-9]+)/i)
    const batchNumber = batchMatch ? batchMatch[1] : 'जानकारी नहीं मिली'
    
    return {
      name: detectedMedicine?.name || 'अज्ञात दवा',
      dosage,
      manufacturer,
      expiryDate,
      batchNumber,
      confidence: detectedMedicine ? 0.8 : 0.3
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setOcrResult('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            दवा स्कैनर / Medicine Scanner
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="p-6 border-b">
          <div className="flex space-x-4">
            <button
              onClick={() => setMode('camera')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                mode === 'camera' 
                  ? 'bg-medical-100 text-medical-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Camera className="w-4 h-4 mr-2" />
              कैमरा / Camera
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                mode === 'upload' 
                  ? 'bg-medical-100 text-medical-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              अपलोड / Upload
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!capturedImage ? (
            <>
              {mode === 'camera' ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      className="w-full rounded-lg"
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        width: 640,
                        height: 480,
                        facingMode: 'environment'
                      }}
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-medical-400 rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Scan className="w-12 h-12 text-medical-400" />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={captureImage}
                    disabled={isProcessing}
                    className="w-full bg-medical-600 text-white py-3 rounded-lg font-semibold hover:bg-medical-700 disabled:opacity-50"
                  >
                    📸 फोटो लें / Capture Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-medical-400 rounded-lg p-8 text-center cursor-pointer hover:border-medical-600"
                  >
                    <Upload className="w-12 h-12 text-medical-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      दवा की फोटो अपलोड करें<br />
                      Click to upload medicine photo
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {/* Captured Image */}
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured medicine" 
                  className="w-full rounded-lg"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>स्कैन कर रहे हैं...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={retakePhoto}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  🔄 फिर से / Retake
                </button>
                <button
                  onClick={() => processImage(capturedImage)}
                  disabled={isProcessing}
                  className="flex-1 bg-medical-600 text-white py-2 rounded-lg hover:bg-medical-700 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      स्कैन...
                    </div>
                  ) : (
                    '🔍 स्कैन / Scan'
                  )}
                </button>
              </div>

              {/* OCR Result */}
              {ocrResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    स्कैन परिणाम / Scan Result:
                  </h4>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {ocrResult}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <h4 className="font-semibold text-gray-800 mb-2">
            निर्देश / Instructions:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• दवा का पैकेट साफ और अच्छी रोशनी में रखें</li>
            <li>• Keep medicine packet in good light</li>
            <li>• दवा का नाम और डोज़ स्पष्ट दिखाई दे</li>
            <li>• Ensure medicine name and dosage are clearly visible</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
