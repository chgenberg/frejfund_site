import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import LoginModal from './components/LoginModal'
import Image from 'next/image'
import { AuthProvider } from './context/AuthContext'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'FrejFund - AI-driven affärsanalys för investeringar',
  description: 'FrejFund använder AI för att analysera affärsplaner och matcha startups med rätt investerare. Få en objektiv bedömning på 10 minuter.',
  metadataBase: new URL('https://www.frejfund.com'),
  openGraph: {
    title: 'FrejFund - AI-driven affärsanalys för investeringar',
    description: 'Analysera din affärsidé och hitta rätt investerare med AI',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'FrejFund AI Analysis',
      },
    ],
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FrejFund - AI-driven affärsanalys',
    description: 'Analysera din affärsidé och hitta rätt investerare',
    images: ['/api/og'],
  },
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