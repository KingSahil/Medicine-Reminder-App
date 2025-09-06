'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'

interface FirebaseStatus {
  configLoaded: boolean
  projectExists: boolean
  authEnabled: boolean
  firestoreEnabled: boolean
  error?: string
}

export default function FirebaseConfigChecker() {
  const [status, setStatus] = useState<FirebaseStatus>({
    configLoaded: false,
    projectExists: false,
    authEnabled: false,
    firestoreEnabled: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkFirebaseConfig()
  }, [])

  const checkFirebaseConfig = async () => {
    try {
      // Check if environment variables are loaded
      const configLoaded = !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      )

      if (!configLoaded) {
        setStatus({
          configLoaded: false,
          projectExists: false,
          authEnabled: false,
          firestoreEnabled: false,
          error: 'Firebase environment variables not found'
        })
        setLoading(false)
        return
      }

      // Test Firebase project accessibility
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

      // Test Auth service
      try {
        const authResponse = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: 'test' })
          }
        )
        
        const authEnabled = authResponse.status !== 404
        
        // Test Firestore (basic project check)
        const firestoreResponse = await fetch(
          `https://firestore.googleapis.com/v1/projects/${projectId}/databases`,
          {
            headers: { 'Authorization': `Bearer invalid` }
          }
        )
        
        const firestoreEnabled = firestoreResponse.status !== 404

        setStatus({
          configLoaded: true,
          projectExists: true,
          authEnabled,
          firestoreEnabled,
          error: undefined
        })
      } catch (error: any) {
        setStatus({
          configLoaded: true,
          projectExists: false,
          authEnabled: false,
          firestoreEnabled: false,
          error: error.message
        })
      }
    } catch (error: any) {
      setStatus({
        configLoaded: false,
        projectExists: false,
        authEnabled: false,
        firestoreEnabled: false,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (success: boolean) => {
    if (loading) return <Loader className="w-4 h-4 animate-spin text-gray-500" />
    return success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
        <h3 className="font-semibold text-gray-800">Firebase Configuration Status</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          {getIcon(status.configLoaded)}
          <span className="ml-2">Environment Variables Loaded</span>
        </div>
        
        <div className="flex items-center">
          {getIcon(status.projectExists)}
          <span className="ml-2">Firebase Project Accessible</span>
        </div>
        
        <div className="flex items-center">
          {getIcon(status.authEnabled)}
          <span className="ml-2">Authentication Service Enabled</span>
        </div>
        
        <div className="flex items-center">
          {getIcon(status.firestoreEnabled)}
          <span className="ml-2">Firestore Database Enabled</span>
        </div>
      </div>

      {status.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <strong>Error:</strong> {status.error}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-600">
        <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}</p>
        <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set'}</p>
        <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 
          `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 10)}...` : 'Not set'}</p>
      </div>

      <div className="mt-3 text-xs text-blue-600">
        <p><strong>Next Steps:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Ensure Firebase project exists in console.firebase.google.com</li>
          <li>Enable Authentication → Sign-in methods → Email/Password</li>
          <li>Create Firestore database in test mode</li>
          <li>Verify domain is added to authorized domains</li>
          <li>Use Demo Mode for immediate testing</li>
        </ul>
      </div>
    </div>
  )
}
