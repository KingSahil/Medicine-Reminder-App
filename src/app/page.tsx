import Link from 'next/link'
import { 
  Heart, 
  Shield, 
  Clock, 
  AlertTriangle, 
  MessageCircle, 
  Calendar,
  ArrowRight 
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MediRemind</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-medical-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Never Miss Your{' '}
              <span className="text-gradient">Medicine</span> Again
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Smart AI-powered medicine reminders with expiry tracking and emergency SOS features. 
              Your health companion that cares when you forget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Health Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your medications safely and effectively
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Chatbot Feature */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI Chatbot Reminder
              </h3>
              <p className="text-gray-600 mb-6">
                Intelligent chatbot that learns your schedule and sends personalized 
                reminders via web push notifications, email, or SMS.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Natural language interaction</li>
                <li>• Smart scheduling</li>
                <li>• Multiple notification methods</li>
                <li>• Dosage tracking</li>
              </ul>
            </div>

            {/* Expiry Tracker Feature */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Medicine Expiry Tracker
              </h3>
              <p className="text-gray-600 mb-6">
                Never use expired medicines again. Get alerts before your 
                medications expire to ensure safety and effectiveness.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Expiry date monitoring</li>
                <li>• Advance warnings</li>
                <li>• Batch tracking</li>
                <li>• Safety notifications</li>
              </ul>
            </div>

            {/* Emergency SOS Feature */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-emergency-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-emergency-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Emergency SOS Button
              </h3>
              <p className="text-gray-600 mb-6">
                One-click emergency assistance that instantly contacts your 
                pre-specified emergency contacts or medical professionals.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Instant emergency alerts</li>
                <li>• Pre-configured contacts</li>
                <li>• Location sharing</li>
                <li>• Medical history access</li>
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
                Why Choose MediRemind?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Improved Health Outcomes
                    </h3>
                    <p className="text-gray-600">
                      Take medicines on time, every time. Studies show proper medication 
                      adherence improves treatment effectiveness by up to 80%.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-medical-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Safety First
                    </h3>
                    <p className="text-gray-600">
                      Prevent dangerous consumption of expired medicines with our 
                      intelligent tracking and early warning system.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-emergency-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Emergency Ready
                    </h3>
                    <p className="text-gray-600">
                      Quick emergency response can save lives. Our SOS feature 
                      ensures help is just one click away.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-medical-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-white animate-heartbeat" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Start Your Health Journey
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of users who trust MediRemind for their daily health management.
                </p>
                <Link href="/dashboard" className="btn-primary w-full">
                  Get Started Now
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
              <span className="ml-2 text-xl font-bold">MediRemind</span>
            </div>
            <p className="text-gray-400 mb-4">
              Smart healthcare companion for better medication management
            </p>
            <p className="text-sm text-gray-500">
              © 2024 MediRemind. All rights reserved. | Built for better health outcomes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
