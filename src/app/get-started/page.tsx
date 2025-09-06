'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import { User, Settings, Heart, Shield, Languages, Users, ArrowLeft } from 'lucide-react'
import FirebaseConfigChecker from '../../components/FirebaseConfigChecker'
import toast from 'react-hot-toast'

interface LoginForm {
  email: string
  password: string
  name?: string
  phone?: string
  mode: 'self' | 'caretaker'
  elderlyUserId?: string
}

export default function GetStartedPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [step, setStep] = useState<'mode' | 'auth'>('mode')
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    name: '',
    phone: '',
    mode: 'self',
    elderlyUserId: ''
  })
  const [loading, setLoading] = useState(false)

  const handleModeSelection = (mode: 'self' | 'caretaker') => {
    setForm({ ...form, mode })
    setStep('auth')
  }

  const handleDemoLogin = () => {
    // Demo mode for testing without Firebase
    const demoUserData = {
      uid: 'demo-user-' + Date.now(),
      email: 'demo@example.com',
      name: form.mode === 'self' ? t('demo.self.name') : t('demo.caretaker.name'),
      phone: '+91 9876543210',
      mode: form.mode,
      elderlyUserId: form.mode === 'caretaker' ? 'elderly-demo-123' : null,
      createdAt: new Date().toISOString(),
      language: language,
      voiceEnabled: true
    }

    localStorage.setItem('userMode', form.mode)
    localStorage.setItem('userProfile', JSON.stringify(demoUserData))
    
    toast.success(t('demo.login.success'))
    
    // Redirect based on mode
    if (form.mode === 'caretaker') {
      router.push('/caretaker-dashboard')
    } else {
      router.push('/elderly-dashboard')
    }
  }

  const handleFirebaseAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let userCredential
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, form.email, form.password)
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      }

      const user = userCredential.user

      // For new users, save profile information
      if (!isLogin || !(await getDoc(doc(db, 'users', user.uid))).exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: form.name || user.displayName || user.email?.split('@')[0],
          email: user.email,
          phone: form.phone || '',
          mode: form.mode,
          elderlyUserId: form.mode === 'caretaker' ? form.elderlyUserId : null,
          createdAt: new Date().toISOString(),
          language: language,
          voiceEnabled: true
        })
      }

      // Get user profile data
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userData = userDoc.data()

      localStorage.setItem('userMode', userData?.mode || form.mode)
      localStorage.setItem('userProfile', JSON.stringify({
        uid: user.uid,
        ...userData
      }))

      toast.success(t('auth.success'))

      // Redirect based on mode
      if (userData?.mode === 'caretaker' || form.mode === 'caretaker') {
        router.push('/caretaker-dashboard')
      } else {
        router.push('/elderly-dashboard')
      }

    } catch (error: any) {
      console.error('Authentication error:', error)
      toast.error(t('auth.error') + ': ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'mode') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-orange-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('common.back')}
              </button>
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-medical-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  {t('app.title')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Languages className="h-5 w-5 text-gray-600" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="hi">हिंदी</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('getstarted.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('getstarted.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Self Mode */}
            <div 
              onClick={() => handleModeSelection('self')}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-medical-200"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-10 w-10 text-medical-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('login.self.mode')}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {t('login.self.desc')}
                </p>
                <ul className="text-left space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-medical-600 mr-3 flex-shrink-0" />
                    {t('mode.self.feature1')}
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 text-medical-600 mr-3 flex-shrink-0" />
                    {t('mode.self.feature2')}
                  </li>
                  <li className="flex items-center">
                    <Settings className="h-5 w-5 text-medical-600 mr-3 flex-shrink-0" />
                    {t('mode.self.feature3')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Caretaker Mode */}
            <div 
              onClick={() => handleModeSelection('caretaker')}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-orange-200"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('login.caretaker.mode')}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {t('login.caretaker.desc')}
                </p>
                <ul className="text-left space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-orange-600 mr-3 flex-shrink-0" />
                    {t('mode.caretaker.feature1')}
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 text-orange-600 mr-3 flex-shrink-0" />
                    {t('mode.caretaker.feature2')}
                  </li>
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-orange-600 mr-3 flex-shrink-0" />
                    {t('mode.caretaker.feature3')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authentication Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setStep('mode')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('common.back')}
            </button>
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-medical-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {t('app.title')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Languages className="h-5 w-5 text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="hi">हिंदी</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${form.mode === 'self' ? 'bg-medical-100' : 'bg-orange-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {form.mode === 'self' ? 
                <User className="h-8 w-8 text-medical-600" /> :
                <Users className="h-8 w-8 text-orange-600" />
              }
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? t('login.title') : t('register.title')}
            </h2>
            <p className="text-gray-600">
              {form.mode === 'self' ? t('login.self.mode') : t('login.caretaker.mode')}
            </p>
          </div>

          <form onSubmit={handleFirebaseAuth} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.name')}
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                  placeholder={t('login.name')}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                placeholder={t('login.email')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                placeholder={t('login.password')}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.phone')}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                  placeholder={t('login.phone')}
                />
              </div>
            )}

            {!isLogin && form.mode === 'caretaker' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.elderly.id')}
                </label>
                <input
                  type="text"
                  value={form.elderlyUserId}
                  onChange={(e) => setForm({ ...form, elderlyUserId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                  placeholder={t('login.elderly.id')}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${form.mode === 'self' ? 'bg-medical-600 hover:bg-medical-700' : 'bg-orange-600 hover:bg-orange-700'} text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50`}
            >
              {loading ? t('loading') : (isLogin ? t('login.submit') : t('register.submit'))}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200"
            >
              {t('demo.mode')} - {t('continue')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-medical-600 hover:text-medical-700 font-medium"
            >
              {isLogin ? t('login.create.account') : t('login.have.account')}
            </button>
          </div>

          <div className="mt-8">
            <FirebaseConfigChecker />
          </div>
        </div>
      </div>
    </div>
  )
}
