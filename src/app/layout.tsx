import '../styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '../contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elderly Medicine Tracker - Smart Healthcare for Indian Families',
  description: 'Advanced medicine management for elderly with AI assistance, Hindi voice support, and family connectivity',
  keywords: 'medicine reminder, healthcare, AI chatbot, emergency SOS, medicine tracker, elderly care, Hindi support',
  authors: [{ name: 'Elderly Medicine Tracker Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4a90e2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon.svg" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  )
}
