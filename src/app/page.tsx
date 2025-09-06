'use client'

import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Heart, 
  Shield, 
  Clock, 
  AlertTriangle, 
  MessageCircle, 
  Calendar,
  ArrowRight,
  User,
  Users,
  Mic,
  Languages
} from 'lucide-react'

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-medical-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {t('app.title')}
              </span>
            </div>
            <div className="flex items-center space-x-4">
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
              <Link 
                href="/get-started" 
                className="bg-medical-600 text-white px-4 py-2 rounded-lg hover:bg-medical-700 transition-colors"
              >
                {t('nav.getstarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medical-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-700 mb-4">
              {t('hero.subtitle')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/get-started" className="bg-medical-600 text-white text-lg px-8 py-4 rounded-lg hover:bg-medical-700 transition-colors flex items-center justify-center">
                {t('hero.get.started')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <Mic className="w-5 h-5 mr-2" />
              <span>{t('voice.hindi.support')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Chatbot Feature */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {t('features.chatbot.title')}
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                {t('features.chatbot.description')}
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• {t('features.chatbot.feature1')}</li>
                <li>• {t('features.chatbot.feature2')}</li>
                <li>• {t('features.chatbot.feature3')}</li>
                <li>• {t('features.chatbot.feature4')}</li>
              </ul>
            </div>

            {/* Expiry Tracker Feature */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {t('features.expiry.title')}
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                {t('features.expiry.description')}
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• {t('features.expiry.feature1')}</li>
                <li>• {t('features.expiry.feature2')}</li>
                <li>• {t('features.expiry.feature3')}</li>
                <li>• {t('features.expiry.feature4')}</li>
              </ul>
            </div>

            {/* Emergency SOS Feature */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-emergency-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-emergency-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {t('features.emergency.title')}
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                {t('features.emergency.description')}
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• {t('features.emergency.feature1')}</li>
                <li>• {t('features.emergency.feature2')}</li>
                <li>• {t('features.emergency.feature3')}</li>
                <li>• {t('features.emergency.feature4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('benefits.title')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t('benefits.health.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('benefits.health.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-medical-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t('benefits.safety.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('benefits.safety.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-emergency-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t('benefits.emergency.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('benefits.emergency.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-medical-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('cta.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('cta.description')}
                </p>
                <Link href="/get-started" className="bg-medical-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-medical-700 transition-colors inline-block w-full">
                  {t('cta.button')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">{t('app.title')}</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.description')}
            </p>
            <p className="text-sm text-gray-500">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
