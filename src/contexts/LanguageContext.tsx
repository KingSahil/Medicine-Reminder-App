'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Common
    'app.title': 'Elderly Medicine Tracker',
    'app.subtitle': 'Smart Healthcare for Indian Families',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'add': 'Add',
    'continue': 'Continue',
    'demo.mode': 'Demo Mode',
    'common.back': 'Back',
    
    // Get Started
    'getstarted.title': 'Choose Your Mode',
    'getstarted.subtitle': 'Select how you want to use the medicine tracker',
    
    // Mode Features
    'mode.self.feature1': 'Personal medicine management',
    'mode.self.feature2': 'Health tracking & reminders',
    'mode.self.feature3': 'Voice support in Hindi',
    'mode.caretaker.feature1': 'Manage multiple elderly users',
    'mode.caretaker.feature2': 'Family health coordination',
    'mode.caretaker.feature3': 'Emergency contact system',
    
    // Demo
    'demo.self.name': 'Ram Ji',
    'demo.caretaker.name': 'Sunita Ji',
    'demo.login.success': 'Demo mode login successful!',
    
    // Auth
    'auth.success': 'Login successful!',
    'auth.error': 'Authentication error',
    
    // Navigation
    'nav.getstarted': 'Get Started',
    
    // Hero Section
    'hero.title': 'Elderly Medicine Tracker',
    'hero.subtitle': 'Smart Healthcare for Indian Families',
    'hero.description': 'Hindi voice reminders, photo medicine scanning, and family care features.',
    'hero.get.started': 'Get Started',
    
    // Features
    'features.title': 'Comprehensive Health Management',
    'features.subtitle': 'Everything you need to manage your medications safely and effectively',
    'features.chatbot.title': 'AI Chatbot Reminder',
    'features.chatbot.description': 'Intelligent chatbot that learns your schedule and sends personalized reminders via web push notifications, email, or SMS.',
    'features.chatbot.feature1': 'Natural language interaction',
    'features.chatbot.feature2': 'Smart scheduling',
    'features.chatbot.feature3': 'Multiple notification methods',
    'features.chatbot.feature4': 'Dosage tracking',
    'features.expiry.title': 'Medicine Expiry Tracker',
    'features.expiry.description': 'Never use expired medicines again. Get alerts before your medications expire to ensure safety and effectiveness.',
    'features.expiry.feature1': 'Expiry date monitoring',
    'features.expiry.feature2': 'Advance warnings',
    'features.expiry.feature3': 'Batch tracking',
    'features.expiry.feature4': 'Safety notifications',
    'features.emergency.title': 'Emergency SOS Button',
    'features.emergency.description': 'One-click emergency assistance that instantly contacts your pre-specified emergency contacts or medical professionals.',
    'features.emergency.feature1': 'Instant emergency alerts',
    'features.emergency.feature2': 'Pre-configured contacts',
    'features.emergency.feature3': 'Location sharing',
    'features.emergency.feature4': 'Medical history access',
    
    // Benefits
    'benefits.title': 'Why Choose Our Medicine Tracker?',
    'benefits.health.title': 'Improved Health Outcomes',
    'benefits.health.description': 'Take medicines on time, every time. Studies show proper medication adherence improves treatment effectiveness by up to 80%.',
    'benefits.safety.title': 'Safety First',
    'benefits.safety.description': 'Prevent dangerous consumption of expired medicines with our intelligent tracking and early warning system.',
    'benefits.emergency.title': 'Emergency Ready',
    'benefits.emergency.description': 'Quick emergency response can save lives. Our SOS feature ensures help is just one click away.',
    
    // CTA
    'cta.title': 'Start Your Health Journey',
    'cta.description': 'Join thousands of users who trust our medicine tracker for their daily health management.',
    'cta.button': 'Get Started Now',
    
    // Footer
    'footer.description': 'Smart healthcare companion for better medication management',
    'footer.copyright': '© 2024 Elderly Medicine Tracker. All rights reserved. | Built for better health outcomes.',
    
    // Login/Auth
    'login.title': 'Login',
    'register.title': 'Register',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.name': 'Name',
    'login.phone': 'Phone',
    'login.self.mode': 'Self Mode',
    'login.caretaker.mode': 'Caretaker Mode',
    'login.self.desc': 'I manage my own medicines',
    'login.caretaker.desc': 'I help manage medicines for elderly family member',
    'login.elderly.id': 'Elderly Person ID',
    'login.submit': 'Login',
    'register.submit': 'Register',
    'login.create.account': 'Create New Account',
    'login.have.account': 'Already have an account?',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.total.medicines': 'Total Medicines',
    'dashboard.upcoming.reminders': 'Upcoming Reminders',
    'dashboard.low.stock': 'Low Stock',
    'dashboard.expiring.soon': 'Expiring Soon',
    'dashboard.todays.medicines': 'Today\'s Medicines',
    'dashboard.adherence.streak': 'Adherence Streak',
    'dashboard.voice.reminder': 'Voice Reminder',
    'dashboard.emergency': 'Emergency',
    'dashboard.weekly.report': 'Weekly Report',
    'dashboard.medicine.stock.status': 'Medicine Stock Status',
    'dashboard.average.streak': 'Average Streak',
    'dashboard.recent.medicines': 'Recent Medicines',
    'dashboard.elderly.users': 'Elderly Users',
    
    // Medicine Management
    'medicine.add.new': 'Add New Medicine',
    'medicine.edit': 'Edit Medicine',
    'medicine.name': 'Medicine Name',
    'medicine.dosage': 'Dosage',
    'medicine.frequency': 'Frequency',
    'medicine.time.slots': 'Time Slots',
    'medicine.stock.days': 'Stock (days)',
    'medicine.expiry.date': 'Expiry Date',
    'medicine.with.food': 'With Food',
    'medicine.before.food': 'Before Food',
    'medicine.after.food': 'After Food',
    'medicine.anytime': 'Anytime',
    'medicine.instructions': 'Additional Instructions',
    'medicine.scan.photo': 'Scan Photo',
    'medicine.voice.input': 'Voice Input',
    'medicine.mark.taken': 'Mark as Taken',
    
    // Frequency options
    'frequency.once.daily': 'Once daily',
    'frequency.twice.daily': 'Twice daily',
    'frequency.thrice.daily': 'Thrice daily',
    'frequency.four.times': 'Four times daily',
    'frequency.weekly': 'Weekly',
    'frequency.as.needed': 'As needed',
    
    // Caretaker
    'caretaker.dashboard': 'Caretaker Dashboard',
    'caretaker.elderly.name': 'Elderly Person Name',
    'caretaker.manage.medicines': 'Manage Medicines',
    'caretaker.add.elderly': 'Add Elderly Person',
    'caretaker.emergency.contacts': 'Emergency Contacts',
    'caretaker.health.reports': 'Health Reports',
    
    // Detail Labels
    'label.dosage': 'Dosage',
    'label.frequency': 'Frequency',
    'label.times': 'Times',
    'label.stock': 'Stock',
    'label.expires': 'Expires',
    'label.instructions': 'Instructions',
    'label.phone': 'Phone',
    'label.emergency': 'Emergency',
    'label.medicines': 'Medicines',
    'label.last.active': 'Last Active',
    'label.days': 'days',
    'status.day.streak': 'day streak',
    'status.low.stock': 'Low stock!',
    'status.stock.ok': 'Stock OK',
    'dashboard.adherence.rate': 'Adherence Rate',
    'status.expiring.soon': 'Expiring Soon',
    'status.expired': 'Expired',
    'status.active': 'Active',
    'button.manage.medicines': 'Manage Medicines',
    'button.hide.medicines': 'Hide Medicines',
    'managing.medicines.for': 'Managing medicines for',
    
    // Voice & Notifications
    'voice.enabled': 'Voice Enabled',
    'voice.disabled': 'Voice Disabled',
    'voice.hindi.support': 'Hindi Voice Support',
    'notification.medicine.time': 'It\'s time to take your medicine',
    'notification.low.stock': 'Medicine stock is running low',
    'notification.expired': 'Medicine has expired',
    
    // Settings
    'settings.language': 'Language',
    'settings.voice': 'Voice Settings',
    'settings.notifications': 'Notifications',
    'settings.emergency': 'Emergency Contacts',
    
    // Chatbot
    'chatbot.greeting': 'Hello! I\'m your AI health assistant. How can I help you today?',
    'chatbot.help.topics': 'You can ask me about:',
    'chatbot.topic.interactions': 'Medicine interactions',
    'chatbot.topic.dosage': 'Dosage information',
    'chatbot.topic.reminders': 'Setting reminders',
    'chatbot.topic.side.effects': 'Side effects',
  },
  hi: {
    // Common
    'app.title': 'बुजुर्ग दवा ट्रैकर',
    'app.subtitle': 'भारतीय परिवारों के लिए स्मार्ट स्वास्थ्य सेवा',
    'loading': 'लोड हो रहा है...',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'add': 'जोड़ें',
    'continue': 'जारी रखें',
    'demo.mode': 'डेमो मोड',
    'common.back': 'वापस',
    
    // Get Started
    'getstarted.title': 'अपना मोड चुनें',
    'getstarted.subtitle': 'दवा ट्रैकर का उपयोग कैसे करना चाहते हैं चुनें',
    
    // Mode Features
    'mode.self.feature1': 'व्यक्तिगत दवा प्रबंधन',
    'mode.self.feature2': 'स्वास्थ्य ट्रैकिंग और रिमाइंडर',
    'mode.self.feature3': 'हिंदी में आवाज़ समर्थन',
    'mode.caretaker.feature1': 'कई बुजुर्ग उपयोगकर्ता प्रबंधन',
    'mode.caretaker.feature2': 'पारिवारिक स्वास्थ्य समन्वय',
    'mode.caretaker.feature3': 'आपातकालीन संपर्क प्रणाली',
    
    // Demo
    'demo.self.name': 'राम जी',
    'demo.caretaker.name': 'सुनीता जी',
    'demo.login.success': 'डेमो मोड लॉगिन सफल!',
    
    // Auth
    'auth.success': 'लॉगिन सफल!',
    'auth.error': 'प्रमाणीकरण त्रुटि',
    
    // Navigation
    'nav.getstarted': 'शुरू करें',
    
    // Hero Section
    'hero.title': 'बुजुर्गों के लिए दवा ट्रैकर',
    'hero.subtitle': 'भारतीय परिवारों के लिए स्मार्ट स्वास्थ्य सेवा',
    'hero.description': 'हिंदी आवाज़ रिमाइंडर, फोटो से दवा स्कैन, और परिवारिक देखभाल के साथ।',
    'hero.get.started': 'शुरू करें',
    
    // Features
    'features.title': 'व्यापक स्वास्थ्य प्रबंधन',
    'features.subtitle': 'अपनी दवाओं को सुरक्षित और प्रभावी रूप से प्रबंधित करने के लिए आवश्यक सब कुछ',
    'features.chatbot.title': 'AI चैटबॉट रिमाइंडर',
    'features.chatbot.description': 'बुद्धिमान चैटबॉट जो आपका शेड्यूल सीखता है और वेब पुश नोटिफिकेशन, ईमेल या SMS के माध्यम से व्यक्तिगत रिमाइंडर भेजता है।',
    'features.chatbot.feature1': 'प्राकृतिक भाषा बातचीत',
    'features.chatbot.feature2': 'स्मार्ट शेड्यूलिंग',
    'features.chatbot.feature3': 'कई नोटिफिकेशन तरीके',
    'features.chatbot.feature4': 'खुराक ट्रैकिंग',
    'features.expiry.title': 'दवा एक्सपायरी ट्रैकर',
    'features.expiry.description': 'समाप्त हुई दवाओं का फिर कभी उपयोग न करें। सुरक्षा और प्रभावशीलता सुनिश्चित करने के लिए आपकी दवाओं की समाप्ति से पहले अलर्ट पाएं।',
    'features.expiry.feature1': 'एक्सपायरी डेट निगरानी',
    'features.expiry.feature2': 'पूर्व चेतावनी',
    'features.expiry.feature3': 'बैच ट्रैकिंग',
    'features.expiry.feature4': 'सुरक्षा नोटिफिकेशन',
    'features.emergency.title': 'आपातकालीन SOS बटन',
    'features.emergency.description': 'एक-क्लिक आपातकालीन सहायता जो तुरंत आपके पूर्व-निर्दिष्ट आपातकालीन संपर्कों या चिकित्सा पेशेवरों से संपर्क करती है।',
    'features.emergency.feature1': 'तत्काल आपातकालीन अलर्ट',
    'features.emergency.feature2': 'पूर्व-कॉन्फ़िगर संपर्क',
    'features.emergency.feature3': 'स्थान साझाकरण',
    'features.emergency.feature4': 'मेडिकल हिस्ट्री एक्सेस',
    
    // Benefits
    'benefits.title': 'हमारा दवा ट्रैकर क्यों चुनें?',
    'benefits.health.title': 'बेहतर स्वास्थ्य परिणाम',
    'benefits.health.description': 'समय पर दवा लें, हर बार। अध्ययन दिखाते हैं कि उचित दवा पालन उपचार प्रभावशीलता को 80% तक बेहतर बनाता है।',
    'benefits.safety.title': 'सुरक्षा पहले',
    'benefits.safety.description': 'हमारी बुद्धिमान ट्रैकिंग और पूर्व चेतावनी प्रणाली के साथ समाप्त हुई दवाओं के खतरनाक सेवन को रोकें।',
    'benefits.emergency.title': 'आपातकाल के लिए तैयार',
    'benefits.emergency.description': 'त्वरित आपातकालीन प्रतिक्रिया जीवन बचा सकती है। हमारा SOS फीचर सुनिश्चित करता है कि मदद केवल एक क्लिक दूर है।',
    
    // CTA
    'cta.title': 'अपनी स्वास्थ्य यात्रा शुरू करें',
    'cta.description': 'हजारों उपयोगकर्ताओं में शामिल हों जो अपने दैनिक स्वास्थ्य प्रबंधन के लिए हमारे दवा ट्रैकर पर भरोसा करते हैं।',
    'cta.button': 'अभी शुरू करें',
    
    // Footer
    'footer.description': 'बेहतर दवा प्रबंधन के लिए स्मार्ट स्वास्थ्य साथी',
    'footer.copyright': '© 2024 बुजुर्ग दवा ट्रैकर। सभी अधिकार सुरक्षित। | बेहतर स्वास्थ्य परिणामों के लिए निर्मित।',
    
    // Login/Auth
    'login.title': 'प्रवेश',
    'register.title': 'पंजीकरण',
    'login.email': 'ईमेल',
    'login.password': 'पासवर्ड',
    'login.name': 'नाम',
    'login.phone': 'फोन',
    'login.self.mode': 'स्वयं मोड',
    'login.caretaker.mode': 'देखभालकर्ता मोड',
    'login.self.desc': 'मैं अपनी दवा का प्रबंधन करता हूं',
    'login.caretaker.desc': 'मैं बुजुर्ग परिवारी सदस्य की दवा का प्रबंधन करता हूं',
    'login.elderly.id': 'बुजुर्ग व्यक्ति का ID',
    'login.submit': 'प्रवेश',
    'register.submit': 'पंजीकरण',
    'login.create.account': 'नया खाता बनाएं',
    'login.have.account': 'पहले से खाता है?',
    
    // Dashboard
    'dashboard.welcome': 'नमस्ते',
    'dashboard.total.medicines': 'कुल दवाएं',
    'dashboard.upcoming.reminders': 'आगामी रिमाइंडर',
    'dashboard.low.stock': 'कम स्टॉक',
    'dashboard.expiring.soon': 'जल्द समाप्त',
    'dashboard.todays.medicines': 'आज की दवाएं',
    'dashboard.adherence.streak': 'नियमितता',
    'dashboard.voice.reminder': 'आवाज़ रिमाइंडर',
    'dashboard.emergency': 'आपातकाल',
    'dashboard.weekly.report': 'साप्ताहिक रिपोर्ट',
    'dashboard.medicine.stock.status': 'दवा स्टॉक स्थिति',
    'dashboard.average.streak': 'औसत स्ट्रीक',
    'dashboard.recent.medicines': 'हाल की दवाएं',
    'dashboard.elderly.users': 'बुजुर्ग उपयोगकर्ता',
    
    // Medicine Management
    'medicine.add.new': 'नई दवा जोड़ें',
    'medicine.edit': 'दवा संपादित करें',
    'medicine.name': 'दवा का नाम',
    'medicine.dosage': 'खुराक',
    'medicine.frequency': 'आवृत्ति',
    'medicine.time.slots': 'समय',
    'medicine.stock.days': 'स्टॉक (दिन)',
    'medicine.expiry.date': 'एक्सपायरी डेट',
    'medicine.with.food': 'भोजन के साथ',
    'medicine.before.food': 'खाने से पहले',
    'medicine.after.food': 'खाने के बाद',
    'medicine.anytime': 'कभी भी',
    'medicine.instructions': 'अतिरिक्त निर्देश',
    'medicine.scan.photo': 'फोटो स्कैन',
    'medicine.voice.input': 'आवाज़ इनपुट',
    'medicine.mark.taken': 'लिया गया मार्क करें',
    
    // Frequency options
    'frequency.once.daily': 'दिन में 1 बार',
    'frequency.twice.daily': 'दिन में 2 बार',
    'frequency.thrice.daily': 'दिन में 3 बार',
    'frequency.four.times': 'दिन में 4 बार',
    'frequency.weekly': 'सप्ताह में 1 बार',
    'frequency.as.needed': 'आवश्यकता अनुसार',
    
    // Caretaker
    'caretaker.dashboard': 'देखभालकर्ता डैशबोर्ड',
    'caretaker.elderly.name': 'बुजुर्ग का नाम',
    'caretaker.manage.medicines': 'दवा प्रबंधन',
    'caretaker.add.elderly': 'बुजुर्ग जोड़ें',
    'caretaker.emergency.contacts': 'आपातकालीन संपर्क',
    'caretaker.health.reports': 'स्वास्थ्य रिपोर्ट',
    
    // Detail Labels
    'label.dosage': 'खुराक',
    'label.frequency': 'आवृत्ति',
    'label.times': 'समय',
    'label.stock': 'स्टॉक',
    'label.expires': 'समाप्त',
    'label.instructions': 'निर्देश',
    'label.phone': 'फोन',
    'label.emergency': 'आपातकाल',
    'label.medicines': 'दवाएं',
    'label.last.active': 'अंतिम सक्रिय',
    'label.days': 'दिन',
    'status.day.streak': 'दिन स्ट्रीक',
    'status.low.stock': 'कम स्टॉक!',
    'status.stock.ok': 'स्टॉक ठीक है',
    'dashboard.adherence.rate': 'अनुपालन दर',
    'status.expiring.soon': 'जल्द समाप्त',
    'status.expired': 'समाप्त हो गई',
    'status.active': 'सक्रिय',
    'button.manage.medicines': 'दवाएं प्रबंधित करें',
    'button.hide.medicines': 'दवाएं छुपाएं',
    'managing.medicines.for': 'के लिए दवाएं प्रबंधित कर रहे हैं',
    
    // Voice & Notifications
    'voice.enabled': 'आवाज़ चालू',
    'voice.disabled': 'आवाज़ बंद',
    'voice.hindi.support': 'हिंदी आवाज़ समर्थन',
    'notification.medicine.time': 'दवा लेने का समय हो गया है',
    'notification.low.stock': 'दवा की मात्रा कम है',
    'notification.expired': 'दवा की समय सीमा समाप्त हो गई है',
    
    // Settings
    'settings.language': 'भाषा',
    'settings.voice': 'आवाज़ सेटिंग्स',
    'settings.notifications': 'सूचनाएं',
    'settings.emergency': 'आपातकालीन संपर्क',
    
    // Chatbot
    'chatbot.greeting': 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    'chatbot.help.topics': 'आप मुझसे इन विषयों पर पूछ सकते हैं:',
    'chatbot.topic.interactions': 'दवा के बीच इंटरैक्शन',
    'chatbot.topic.dosage': 'डोज़ की जानकारी',
    'chatbot.topic.reminders': 'रिमाइंडर सेट करना',
    'chatbot.topic.side.effects': 'साइड इफेक्ट्स',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('hi')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
