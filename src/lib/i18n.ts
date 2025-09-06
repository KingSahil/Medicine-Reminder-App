import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "getStarted": "Get Started",
      "learnMore": "Learn More",
      "dashboard": "Dashboard",
      
      // Hero Section
      "heroTitle": "Never Miss Your Medicine Again",
      "heroSubtitle": "Smart AI-powered medicine reminders with expiry tracking and emergency SOS features. Your health companion that cares when you forget.",
      "startFreeTrial": "Start Free Trial",
      
      // Features
      "aiChatbotTitle": "AI Chatbot Reminder",
      "aiChatbotDesc": "Intelligent chatbot that learns your schedule and sends personalized reminders via web push notifications, email, or SMS.",
      "expiryTrackerTitle": "Medicine Expiry Tracker",
      "expiryTrackerDesc": "Never use expired medicines again. Get alerts before your medications expire to ensure safety and effectiveness.",
      "emergencySOSTitle": "Emergency SOS Button",
      "emergencySOSDesc": "One-click emergency assistance that instantly contacts your pre-specified emergency contacts or medical professionals.",
      
      // Dashboard
      "goodAfternoon": "Good afternoon!",
      "medicinesRemaining": "You have {{count}} medicines to take today. Stay healthy!",
      "addMedicine": "Add Medicine",
      "aiAssistant": "AI Assistant",
      "emergency": "Emergency",
      "emergencyAlert": "Emergency Alert",
      "yourMedicines": "Your Medicines",
      "activeMedicines": "Active Medicines",
      "todaysDoses": "Today's Doses",
      "expiringPlaceholder": "Expiring Soon",
      "adherenceRate": "Adherence Rate",
      
      // Medicine Form
      "medicineName": "Medicine Name",
      "dosage": "Dosage",
      "frequency": "Frequency",
      "reminderTimes": "Reminder Times",
      "startDate": "Start Date",
      "endDate": "End Date (Optional)",
      "expiryDate": "Expiry Date",
      "instructions": "Special Instructions (Optional)",
      "cancel": "Cancel",
      
      // AI Assistant
      "chatPlaceholder": "Ask me anything about your medicines...",
      "quickActions": "Quick actions:",
      "addNewMedicine": "Add new medicine",
      "nextDoseTime": "When should I take my next dose?",
      "checkExpiry": "Check medicine expiry dates",
      "emergencyHelp": "Emergency help",
      
      // Emergency
      "confirmEmergency": "Confirm Emergency Alert",
      "emergencyConfirmText": "This will immediately notify your emergency contacts and share your location. Are you sure you need emergency assistance?",
      "yesSendAlert": "Yes, Send Alert",
      "sendingAlert": "Sending Emergency Alert",
      "alertWillBeSent": "Alert will be sent in {{count}} seconds...",
      
      // Notifications
      "timeToTake": "Time to take {{medicine}}!",
      "medicineReminder": "{{dosage}} - Don't forget to take your medicine",
      "emergencyAlertSent": "Emergency Alert Sent!",
      
      // Languages
      "language": "Language",
      "english": "English",
      "spanish": "Español",
      "french": "Français",
      "german": "Deutsch",
      "chinese": "中文",
      "japanese": "日本語",
      "korean": "한국어",
      "arabic": "العربية",
      "hindi": "हिन्दी",
      "portuguese": "Português"
    }
  },
  es: {
    translation: {
      "getStarted": "Comenzar",
      "learnMore": "Aprende Más",
      "dashboard": "Panel",
      "heroTitle": "Nunca Más Olvides Tu Medicina",
      "heroSubtitle": "Recordatorios inteligentes de medicina impulsados por IA con seguimiento de vencimiento y funciones SOS de emergencia.",
      "startFreeTrial": "Iniciar Prueba Gratuita",
      "aiChatbotTitle": "Recordatorio de Chatbot IA",
      "aiChatbotDesc": "Chatbot inteligente que aprende tu horario y envía recordatorios personalizados.",
      "expiryTrackerTitle": "Rastreador de Vencimiento",
      "expiryTrackerDesc": "Nunca uses medicinas vencidas. Recibe alertas antes de que expiren tus medicamentos.",
      "emergencySOSTitle": "Botón SOS de Emergencia",
      "emergencySOSDesc": "Asistencia de emergencia con un clic que contacta instantáneamente a tus contactos de emergencia.",
      "goodAfternoon": "¡Buenas tardes!",
      "medicinesRemaining": "Tienes {{count}} medicinas para tomar hoy. ¡Mantente saludable!",
      "addMedicine": "Agregar Medicina",
      "aiAssistant": "Asistente IA",
      "emergency": "Emergencia",
      "emergencyAlert": "Alerta de Emergencia",
      "yourMedicines": "Tus Medicinas",
      "activeMedicines": "Medicinas Activas",
      "todaysDoses": "Dosis de Hoy",
      "expiringPlaceholder": "Expirando Pronto",
      "adherenceRate": "Tasa de Adherencia",
      "medicineName": "Nombre de la Medicina",
      "dosage": "Dosis",
      "frequency": "Frecuencia",
      "reminderTimes": "Horarios de Recordatorio",
      "startDate": "Fecha de Inicio",
      "endDate": "Fecha de Fin (Opcional)",
      "expiryDate": "Fecha de Vencimiento",
      "instructions": "Instrucciones Especiales (Opcional)",
      "cancel": "Cancelar",
      "chatPlaceholder": "Pregúntame sobre tus medicinas...",
      "quickActions": "Acciones rápidas:",
      "addNewMedicine": "Agregar nueva medicina",
      "nextDoseTime": "¿Cuándo debo tomar mi próxima dosis?",
      "checkExpiry": "Verificar fechas de vencimiento",
      "emergencyHelp": "Ayuda de emergencia",
      "confirmEmergency": "Confirmar Alerta de Emergencia",
      "emergencyConfirmText": "Esto notificará inmediatamente a tus contactos de emergencia y compartirá tu ubicación.",
      "yesSendAlert": "Sí, Enviar Alerta",
      "sendingAlert": "Enviando Alerta de Emergencia",
      "alertWillBeSent": "La alerta se enviará en {{count}} segundos...",
      "timeToTake": "¡Hora de tomar {{medicine}}!",
      "medicineReminder": "{{dosage}} - No olvides tomar tu medicina",
      "emergencyAlertSent": "¡Alerta de Emergencia Enviada!",
      "language": "Idioma",
      "english": "English",
      "spanish": "Español",
      "french": "Français",
      "german": "Deutsch",
      "chinese": "中文",
      "japanese": "日本語",
      "korean": "한국어",
      "arabic": "العربية",
      "hindi": "हिन्दी",
      "portuguese": "Português"
    }
  },
  fr: {
    translation: {
      "getStarted": "Commencer",
      "learnMore": "En Savoir Plus",
      "dashboard": "Tableau de Bord",
      "heroTitle": "Ne Manquez Plus Jamais Vos Médicaments",
      "heroSubtitle": "Rappels intelligents de médicaments alimentés par l'IA avec suivi d'expiration et fonctionnalités SOS d'urgence.",
      "startFreeTrial": "Commencer l'Essai Gratuit",
      "aiChatbotTitle": "Rappel de Chatbot IA",
      "aiChatbotDesc": "Chatbot intelligent qui apprend votre horaire et envoie des rappels personnalisés.",
      "expiryTrackerTitle": "Suivi d'Expiration",
      "expiryTrackerDesc": "N'utilisez plus jamais de médicaments expirés. Recevez des alertes avant l'expiration.",
      "emergencySOSTitle": "Bouton SOS d'Urgence",
      "emergencySOSDesc": "Assistance d'urgence en un clic qui contacte instantanément vos contacts d'urgence.",
      "goodAfternoon": "Bon après-midi!",
      "medicinesRemaining": "Vous avez {{count}} médicaments à prendre aujourd'hui. Restez en bonne santé!",
      "addMedicine": "Ajouter Médicament",
      "aiAssistant": "Assistant IA",
      "emergency": "Urgence",
      "emergencyAlert": "Alerte d'Urgence",
      "yourMedicines": "Vos Médicaments",
      "activeMedicines": "Médicaments Actifs",
      "todaysDoses": "Doses d'Aujourd'hui",
      "expiringPlaceholder": "Expire Bientôt",
      "adherenceRate": "Taux d'Adhérence",
      "language": "Langue"
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
