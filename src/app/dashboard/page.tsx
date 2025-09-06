'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  MessageCircle, 
  Calendar, 
  Shield, 
  Bell, 
  Settings,
  Heart,
  Clock,
  AlertTriangle,
  Pill
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const mockMedicines = [
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      nextDose: '2:00 PM',
      expiryDate: '2024-12-15',
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      nextDose: '6:00 PM',
      expiryDate: '2024-11-20',
      status: 'warning'
    },
    {
      id: '3',
      name: 'Aspirin',
      dosage: '81mg',
      nextDose: 'Tomorrow 8:00 AM',
      expiryDate: '2025-03-10',
      status: 'normal'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-primary-600 bg-primary-50'
      case 'warning': return 'text-orange-600 bg-orange-50'
      case 'expired': return 'text-red-600 bg-red-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Heart className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MediRemind</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good afternoon! 👋
          </h1>
          <p className="text-gray-600">
            You have 2 medicines to take today. Stay healthy!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Pill className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Medicines</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Doses</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-medical-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medicines List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Medicines
                </h2>
                <button className="btn-primary flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Medicine
                </button>
              </div>

              <div className="space-y-4">
                {mockMedicines.map((medicine) => (
                  <div key={medicine.id} className="medicine-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">
                            {medicine.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {medicine.dosage} • Next: {medicine.nextDose}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(medicine.status)}`}>
                          {medicine.status === 'upcoming' && 'Due Soon'}
                          {medicine.status === 'warning' && 'Expiring Soon'}
                          {medicine.status === 'normal' && 'On Track'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {medicine.expiryDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Chatbot */}
            <div className="card">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary-600" />
                <h3 className="ml-2 text-lg font-semibold text-gray-900">
                  AI Assistant
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ask me anything about your medicines or health routines!
              </p>
              <button className="btn-primary w-full">
                Start Chat
              </button>
            </div>

            {/* Emergency SOS */}
            <div className="card bg-gradient-to-br from-emergency-50 to-red-50 border-emergency-200">
              <div className="text-center">
                <Shield className="h-12 w-12 text-emergency-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Emergency SOS
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Instant help when you need it most
                </p>
                <button className="btn-emergency w-full animate-pulse">
                  🆘 Emergency Alert
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">Add New Medicine</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">View Schedule</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
