import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import OverlayNavbar from './components/OverlayNavbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import LoginModal from './components/LoginModal'
import Image from 'next/image'
import { AuthProvider } from './context/AuthContext'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'FrejFund',
  description: 'AI-baserad affärsanalys och investerarmatchning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          <OverlayNavbar />
          <LoginModal />
          <main className="flex-grow relative z-10">
            {children}
          </main>
          <Footer />
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  )
} 