import { ChatMessage } from '@/types'

interface ChatbotResponse {
  message: string
  actions?: {
    type: 'add_medicine' | 'set_reminder' | 'emergency_contact'
    data?: any
  }[]
}

export class MediChatbot {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
  }

  async processMessage(message: string, context?: {
    userId: string
    currentMedicines?: any[]
    userPreferences?: any
  }): Promise<ChatbotResponse> {
    try {
      // If OpenAI API key is available, use GPT
      if (this.apiKey) {
        return await this.processWithGPT(message, context)
      } else {
        // Fallback to rule-based responses
        return this.processWithRules(message, context)
      }
    } catch (error) {
      console.error('Chatbot processing error:', error)
      return {
        message: "I'm sorry, I'm having trouble understanding right now. Could you please try again?"
      }
    }
  }

  private async processWithGPT(message: string, context?: any): Promise<ChatbotResponse> {
    // OpenAI GPT integration would go here
    // For now, using rule-based fallback
    return this.processWithRules(message, context)
  }

  private processWithRules(message: string, context?: any): ChatbotResponse {
    const lowerMessage = message.toLowerCase()

    // Medicine addition patterns
    if (lowerMessage.includes('add medicine') || 
        lowerMessage.includes('new medicine') || 
        lowerMessage.includes('take') && lowerMessage.includes('daily')) {
      return {
        message: "I'd be happy to help you add a new medicine! Please provide:\n\n• Medicine name\n• Dosage (e.g., 10mg)\n• How often to take it\n• What time(s) of day\n• Expiry date\n\nFor example: 'I need to take Lisinopril 10mg once daily at 8 AM, expires December 2024'",
        actions: [{
          type: 'add_medicine'
        }]
      }
    }

    // Reminder patterns
    if (lowerMessage.includes('remind') || lowerMessage.includes('notification')) {
      return {
        message: "I can help you set up medicine reminders! I'll send you notifications:\n\n• 15 minutes before each dose\n• Via browser notification, email, or SMS\n• With dosage instructions\n\nWould you like to customize your reminder preferences?"
      }
    }

    // Time/schedule patterns
    if (lowerMessage.includes('when') && (lowerMessage.includes('take') || lowerMessage.includes('dose'))) {
      return {
        message: "Based on your current medicines:\n\n• Lisinopril 10mg - Next dose at 2:00 PM\n• Metformin 500mg - Next dose at 6:00 PM\n• Aspirin 81mg - Tomorrow at 8:00 AM\n\nWould you like me to send you a reminder before each dose?"
      }
    }

    // Expiry patterns
    if (lowerMessage.includes('expir') || lowerMessage.includes('old') || lowerMessage.includes('safe')) {
      return {
        message: "Here's your medicine expiry status:\n\n✅ Lisinopril - Expires Dec 15, 2024 (Good)\n⚠️ Metformin - Expires Nov 20, 2024 (Soon!)\n✅ Aspirin - Expires Mar 10, 2025 (Good)\n\nI recommend replacing your Metformin soon for safety!"
      }
    }

    // Emergency patterns
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent')) {
      return {
        message: "For emergencies, you can:\n\n🆘 Use the Emergency SOS button on your dashboard\n📞 It will instantly contact your emergency contacts\n🏥 Share your location and medical information\n\nWould you like to add or update your emergency contacts?",
        actions: [{
          type: 'emergency_contact'
        }]
      }
    }

    // Side effects patterns
    if (lowerMessage.includes('side effect') || lowerMessage.includes('feel') || lowerMessage.includes('reaction')) {
      return {
        message: "If you're experiencing side effects:\n\n⚠️ For severe reactions, use the Emergency SOS button\n📝 Note what you're feeling and when\n👨‍⚕️ Contact your doctor if symptoms persist\n📊 I can help track symptoms over time\n\nAre you experiencing any specific symptoms right now?"
      }
    }

    // Missed dose patterns
    if (lowerMessage.includes('missed') || lowerMessage.includes('forgot') || lowerMessage.includes('skip')) {
      return {
        message: "Don't worry about missing a dose! Here's what to do:\n\n⏰ If it's close to your next dose time, skip the missed dose\n💊 If you just remembered, take it now (unless directed otherwise)\n📋 I'll help you track this for your doctor\n\nWhich medicine did you miss?"
      }
    }

    // Greeting patterns
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        message: "Hello! I'm your AI medicine assistant. I can help you:\n\n💊 Add and track medicines\n⏰ Set up reminders\n📅 Check expiry dates\n🆘 Handle emergencies\n📊 Monitor your health routine\n\nWhat would you like to do today?"
      }
    }

    // Default response
    return {
      message: "I'm here to help with your medicines! I can assist with:\n\n• Adding new medicines\n• Setting up reminders\n• Checking expiry dates\n• Emergency assistance\n• Health tracking\n\nWhat would you like to know more about?"
    }
  }

  // Extract medicine information from natural language
  extractMedicineInfo(message: string): Partial<{
    name: string
    dosage: string
    frequency: string
    times: string[]
    expiryDate: string
  }> {
    const info: any = {}
    
    // Extract medicine name (usually the first capitalized word)
    const nameMatch = message.match(/\b[A-Z][a-z]+(?:in|ol|ex|il|pril|formin|cycline)\b/)
    if (nameMatch) {
      info.name = nameMatch[0]
    }

    // Extract dosage (number + mg/g/ml)
    const dosageMatch = message.match(/(\d+(?:\.\d+)?)\s*(mg|g|ml|mcg|units?)/i)
    if (dosageMatch) {
      info.dosage = dosageMatch[0]
    }

    // Extract frequency
    if (message.includes('once') || message.includes('daily')) {
      info.frequency = 'daily'
    } else if (message.includes('twice')) {
      info.frequency = 'twice daily'
    } else if (message.includes('three times')) {
      info.frequency = 'three times daily'
    }

    // Extract times
    const timeMatches = message.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/g)
    if (timeMatches) {
      info.times = timeMatches
    }

    return info
  }
}
