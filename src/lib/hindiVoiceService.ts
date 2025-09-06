'use client'

// Hindi Voice Reminder Service for Elderly Medicine Tracker
export class HindiVoiceService {
  private synthesis: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []
  private hindiVoice: SpeechSynthesisVoice | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis
      this.loadVoices()
      
      // Handle voice loading async
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices()
      }
    }
  }

  private loadVoices() {
    if (!this.synthesis) return
    
    this.voices = this.synthesis.getVoices()
    
    // Find Hindi voice
    this.hindiVoice = this.voices.find(voice => 
      voice.lang.includes('hi') || 
      voice.lang.includes('hi-IN') ||
      voice.name.toLowerCase().includes('hindi')
    ) || null

    // Fallback to English if Hindi not available
    if (!this.hindiVoice) {
      this.hindiVoice = this.voices.find(voice => 
        voice.lang.includes('en') && voice.lang.includes('IN')
      ) || this.voices[0] || null
    }
  }

  // Medicine reminder messages in Hindi
  private getMedicineReminderMessage(medicineName: string, dosage: string, time: string): string {
    const messages = [
      `नमस्ते, अब ${medicineName} लेने का समय है। ${dosage} खुराक लें।`,
      `दवा का समय हो गया है। कृपया ${medicineName} की ${dosage} खुराक लें।`,
      `${medicineName} लेना न भूलें। ${dosage} की खुराक का समय है।`,
      `आपकी दवा ${medicineName} लेने का समय आ गया है। ${dosage} लें।`
    ]
    
    return messages[Math.floor(Math.random() * messages.length)]
  }

  // Food-related reminders
  private getFoodReminderMessage(beforeAfter: 'before' | 'after'): string {
    if (beforeAfter === 'before') {
      return 'खाना खाने से पहले यह दवा लें। भोजन के साथ पानी भी पिएं।'
    } else {
      return 'खाना खाने के बाद यह दवा लें। पेट भरने के बाद दवा लेना बेहतर है।'
    }
  }

  // Emergency messages
  private getEmergencyMessage(): string {
    return 'आपातकाल! तुरंत डॉक्टर को कॉल करें या नजदीकी अस्पताल जाएं। परिवार के सदस्यों को भी सूचना दी जा रही है।'
  }

  // Stock reminder messages
  private getStockReminderMessage(medicineName: string, remainingDays: number): string {
    if (remainingDays <= 2) {
      return `चेतावनी! ${medicineName} की दवा केवल ${remainingDays} दिन के लिए बची है। तुरंत नई दवा खरीदें।`
    } else if (remainingDays <= 7) {
      return `सूचना: ${medicineName} की दवा ${remainingDays} दिन में खत्म हो जाएगी। नई दवा खरीदने की तैयारी करें।`
    }
    return `${medicineName} की स्टॉक जांच: अभी ${remainingDays} दिन की दवा बची है।`
  }

  // Adherence encouragement
  private getAdherenceMessage(streakDays: number): string {
    if (streakDays >= 30) {
      return `बहुत बढ़िया! आपने ${streakDays} दिन नियमित दवा ली है। इसी तरह जारी रखें।`
    } else if (streakDays >= 7) {
      return `शाबाश! ${streakDays} दिन से नियमित दवा ले रहे हैं। बहुत अच्छा काम कर रहे हैं।`
    }
    return `आपने ${streakDays} दिन नियमित दवा ली है। इसी तरह जारी रखें।`
  }

  // Main speak function
  public speak(text: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis || !this.hindiVoice) {
        console.warn('Speech synthesis not available')
        resolve()
        return
      }

      // Cancel any ongoing speech for high priority messages
      if (priority === 'high') {
        this.synthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = this.hindiVoice
      utterance.rate = 0.8 // Slower for elderly users
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Set different settings based on priority
      switch (priority) {
        case 'high':
          utterance.rate = 0.7
          utterance.volume = 1.0
          break
        case 'medium':
          utterance.rate = 0.8
          utterance.volume = 0.9
          break
        case 'low':
          utterance.rate = 0.9
          utterance.volume = 0.8
          break
      }

      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)

      this.synthesis.speak(utterance)
    })
  }

  // Specific reminder functions
  public async speakMedicineReminder(medicineName: string, dosage: string, time: string, withFood?: 'before' | 'after') {
    const mainMessage = this.getMedicineReminderMessage(medicineName, dosage, time)
    await this.speak(mainMessage, 'high')
    
    if (withFood) {
      const foodMessage = this.getFoodReminderMessage(withFood)
      await this.speak(foodMessage, 'medium')
    }
  }

  public async speakEmergencyAlert() {
    const message = this.getEmergencyMessage()
    await this.speak(message, 'high')
  }

  public async speakStockReminder(medicineName: string, remainingDays: number) {
    const message = this.getStockReminderMessage(medicineName, remainingDays)
    const priority = remainingDays <= 2 ? 'high' : 'medium'
    await this.speak(message, priority)
  }

  public async speakAdherenceEncouragement(streakDays: number) {
    const message = this.getAdherenceMessage(streakDays)
    await this.speak(message, 'low')
  }

  // Custom message with Hindi support
  public async speakCustomMessage(message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    await this.speak(message, priority)
  }

  // Test if voice is available
  public isVoiceAvailable(): boolean {
    return !!(this.synthesis && this.hindiVoice)
  }

  // Get available voices info
  public getAvailableVoices(): { name: string, lang: string }[] {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang
    }))
  }

  // Stop current speech
  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }
}

// Singleton instance
let hindiVoiceService: HindiVoiceService | null = null

export const getHindiVoiceService = (): HindiVoiceService => {
  if (!hindiVoiceService) {
    hindiVoiceService = new HindiVoiceService()
  }
  return hindiVoiceService
}

// Voice reminder types
export interface VoiceReminder {
  id: string
  medicineId: string
  message: string
  scheduledTime: Date
  priority: 'low' | 'medium' | 'high'
  spoken: boolean
  withFood?: 'before' | 'after'
}

// Voice settings for user preferences
export interface VoiceSettings {
  enabled: boolean
  language: 'hi-IN' | 'en-IN'
  rate: number // 0.5 to 2.0
  volume: number // 0.0 to 1.0
  emergencyOnly: boolean
  quietHours: {
    start: string // HH:MM format
    end: string
  }
}

export const defaultVoiceSettings: VoiceSettings = {
  enabled: true,
  language: 'hi-IN',
  rate: 0.8,
  volume: 1.0,
  emergencyOnly: false,
  quietHours: {
    start: '22:00',
    end: '06:00'
  }
}
