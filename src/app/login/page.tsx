'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the new consolidated get-started page
    router.replace('/get-started')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-medical-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login existing user
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password)
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          localStorage.setItem('userMode', userData.mode)
          localStorage.setItem('userProfile', JSON.stringify(userData))
          
          toast.success(`स्वागत है! Welcome ${userData.name}!`)
          
          // Redirect based on mode
          if (userData.mode === 'caretaker') {
            router.push('/caretaker-dashboard')
          } else {
            router.push('/elderly-dashboard')
          }
        }
      } else {
        // Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
        
        const userData = {
          uid: userCredential.user.uid,
          email: form.email,
          name: form.name,
          phone: form.phone,
          mode: form.mode,
          elderlyUserId: form.mode === 'caretaker' ? form.elderlyUserId : null,
          createdAt: new Date().toISOString(),
          language: 'hi-IN',
          voiceEnabled: true
        }

        await setDoc(doc(db, 'users', userCredential.user.uid), userData)
        localStorage.setItem('userMode', form.mode)
        localStorage.setItem('userProfile', JSON.stringify(userData))
        
        toast.success('खाता बन गया! Account created successfully!')
        
        // Redirect based on mode
        if (form.mode === 'caretaker') {
          router.push('/caretaker-dashboard')
        } else {
          router.push('/elderly-dashboard')
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      
      // Show Firebase error and automatically redirect to demo mode
      if (error.code === 'auth/configuration-not-found') {
        toast.error('Firebase कॉन्फ़िगरेशन समस्या - डेमो मोड का उपयोग करें / Firebase configuration issue - use Demo Mode')
      } else if (error.code === 'auth/invalid-api-key') {
        toast.error('Firebase API key गलत है - डेमो मोड उपलब्ध है / Invalid Firebase API key - Demo Mode available')
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('इंटरनेट कनेक्शन चेक करें - डेमो मोड का उपयोग करें / Check internet connection - use Demo Mode')
      } else {
        toast.error(`प्रमाणीकरण त्रुटि - डेमो मोड उपलब्ध है / Authentication error - Demo Mode available: ${error.message}`)
      }
      
      // Auto-focus demo mode button
      setTimeout(() => {
        const demoButton = document.getElementById('demo-mode-button')
        if (demoButton) {
          demoButton.focus()
          demoButton.scrollIntoView({ behavior: 'smooth' })
        }
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  const ModeCard = ({ mode, icon: Icon, title, subtitle, description }: {
    mode: 'self' | 'caretaker'
    icon: any
    title: string
    subtitle: string
    description: string
  }) => (
    <div 
      onClick={() => {
        setForm(prev => ({ ...prev, mode }))
        setShowModeSelection(false)
      }}
      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
        form.mode === mode 
          ? 'border-medical-600 bg-medical-50 shadow-lg' 
          : 'border-gray-200 hover:border-medical-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center mb-4">
        <Icon className={`w-8 h-8 mr-3 ${form.mode === mode ? 'text-medical-600' : 'text-gray-500'}`} />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )

  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-medical-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">उपयोगकर्ता प्रकार चुनें</h1>
            <p className="text-gray-600">Choose User Type</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ModeCard
              mode="self"
              icon={User}
              title="स्वयं / Self"
              subtitle="मैं अपनी दवा लेता हूँ"
              description="I manage my own medicines and need reminders and tracking"
            />
            <ModeCard
              mode="caretaker"
              icon={Shield}
              title="देखभालकर्ता / Caretaker"
              subtitle="मैं किसी की देखभाल करता हूँ"
              description="I help manage medicines for an elderly family member"
            />
          </div>

          <button
            onClick={() => setShowModeSelection(false)}
            className="w-full bg-medical-600 text-white py-3 rounded-lg font-semibold hover:bg-medical-700 transition-colors"
          >
            जारी रखें / Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-orange-50 flex items-center justify-center p-4">
      {/* Language Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
        >
          <Languages className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Firebase Configuration Checker */}
        <FirebaseConfigChecker />

        {/* Firebase Setup Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-start">
            <div className="text-blue-600 mr-2">ℹ️</div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Firebase सेटअप आवश्यक / Firebase Setup Required:</p>
              <p className="text-xs mb-1">
                • Firebase Console से सही App ID प्राप्त करें / Get correct App ID from Firebase Console
              </p>
              <p className="text-xs mb-1">
                • Authentication और Firestore सक्षम करें / Enable Authentication and Firestore
              </p>
              <p className="text-xs text-orange-700 font-medium">
                🚀 तुरंत टेस्ट करने के लिए डेमो मोड का उपयोग करें / Use Demo Mode to test immediately
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-medical-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? t('login.title') : t('register.title')}
          </h1>
          <p className="text-gray-600">{t('app.title')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  नाम / Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                  required={!isLogin}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  फोन / Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                  required={!isLogin}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  उपयोगकर्ता प्रकार / User Type
                </label>
                <button
                  type="button"
                  onClick={() => setShowModeSelection(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-medical-300"
                >
                  <span>
                    {form.mode === 'self' ? 'स्वयं / Self' : 'देखभालकर्ता / Caretaker'}
                  </span>
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {form.mode === 'caretaker' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    बुजुर्ग व्यक्ति का ID / Elderly Person ID
                  </label>
                  <input
                    type="text"
                    value={form.elderlyUserId}
                    onChange={(e) => setForm(prev => ({ ...prev, elderlyUserId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    placeholder="Enter elderly person's ID"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ईमेल / Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              पासवर्ड / Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-medical-600 text-white py-3 rounded-lg font-semibold hover:bg-medical-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'प्रतीक्षा करें...' : (isLogin ? 'प्रवेश / Login' : 'पंजीकरण / Register')}
          </button>

          {/* Demo Mode Button */}
          <div className="mt-4">
            <button
              id="demo-mode-button"
              onClick={handleDemoLogin}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg border-2 border-orange-400"
            >
              🚀 {t('demo.mode')} / Demo Mode
              <div className="text-xs mt-1 opacity-90">
                Firebase सेटअप के बिना / Without Firebase Setup
              </div>
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-medical-600 hover:text-medical-700 font-medium"
          >
            {isLogin 
              ? 'नया खाता बनाएं / Create New Account' 
              : 'पहले से खाता है? / Already have an account?'
            }
          </button>
        </div>
      </div>
    </div>
  )
}
