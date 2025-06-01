import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analysera din affärsidé med AI - FrejFund',
  description: 'Testa att analysera din affärsidé du också! FrejFund hjälper startups att hitta rätt investerare med AI-driven analys. Få din investeringsscore på 10 minuter.',
  openGraph: {
    title: 'Jag analyserade min affärsidé med AI!',
    description: 'Testa att analysera din affärsidé du också! FrejFund hjälper startups att hitta rätt investerare med AI-driven analys.',
    images: [
      {
        url: '/brain.png',
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
    title: 'Analysera din affärsidé med AI - FrejFund',
    description: 'AI-driven analys som matchar startups med rätt investerare',
    images: ['/brain.png'],
  },
};

export default function LinkedInShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 