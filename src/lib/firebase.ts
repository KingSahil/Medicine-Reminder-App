import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ABCDEF123"
}

// Debug logging for Firebase config
if (typeof window !== 'undefined') {
  console.log('Firebase Config Loaded:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId
  })
}

// Check if we're in demo mode or if Firebase config is incomplete
const isDemo = process.env.NODE_ENV === 'development' && (
  firebaseConfig.apiKey === 'demo-api-key' || 
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId ||
  firebaseConfig.apiKey.length < 20 // Basic validation for API key format
)

// Initialize Firebase only if not in demo mode
let app: any = null
let auth: any = null
let db: any = null

if (!isDemo) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.warn('Firebase initialization failed, falling back to demo mode:', error)
    // Fall back to demo mode if Firebase fails to initialize
  }
}

// Create mock auth and db for demo mode
if (isDemo || !auth || !db) {
  console.log('Running in demo mode - Firebase features will be mocked')
  
  // Mock auth object
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: Function) => {
      // Return unsubscribe function
      return () => {}
    }
  }
  
  // Mock db object
  db = {
    // Mock Firestore methods as needed
  }
}

export { auth, db }

// Initialize messaging only in browser environment and not in demo mode
export const getMessagingInstance = async () => {
  if (isDemo || !app) return null
  if (typeof window !== 'undefined' && await isSupported()) {
    try {
      return getMessaging(app)
    } catch (error) {
      console.warn('Messaging initialization failed:', error)
      return null
    }
  }
  return null
}

export const isFirebaseDemo = isDemo || !app
export default app
