import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import LoginModal from './components/LoginModal'
import Image from 'next/image'
import { AuthProvider } from './context/AuthContext'
import OverlayNavbar from './components/OverlayNavbar'
import { setupAuthListener } from './lib/auth'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'FrejFund - AI-driven business analysis for investments',
  description: 'FrejFund uses AI to analyze business plans and match startups with the right investors. Get an objective assessment in 10 minutes.',
  metadataBase: new URL('https://www.frejfund.com'),
  openGraph: {
    title: 'FrejFund - AI-driven business analysis for investments',
    description: 'Analyze your business idea and find the right investors with AI',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'FrejFund AI Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FrejFund - AI-driven business analysis',
    description: 'Analyze your business idea and find the right investors',
    images: ['/api/og'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sätt upp auth-listen när appen startar
  if (typeof window !== 'undefined') {
    setupAuthListener();
  }

  return (
    <html lang="sv">
      <body className={`${nunito.className} min-h-screen flex flex-col bg-black relative`}>
        <AuthProvider>
          {/* Global bakgrundsbild */}
          <Image
            src="/bakgrund.png"
            alt="Bakgrund"
            fill
            className="object-cover -z-10 fixed inset-0"
            priority
          />
          <LoginModal />
          <OverlayNavbar />
          <main className="flex-grow relative z-10 pt-20">
            {children}
          </main>
          <Footer />
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  )
} 