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