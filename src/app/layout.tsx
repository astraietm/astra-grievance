import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const getBaseUrl = (): string => {
  const url = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://grievance.astraietm.in');
  if (!url || typeof url !== 'string' || url.trim() === '') return 'https://grievance.astraietm.in';
  const trimmed = url.trim();
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
};

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'Confidential Grievance Portal | ASTRA IETM Cyber Security Department',
  description:
    'Secure, confidential grievance submission portal for students and department members at KMCT Institute of Engineering and Technology. Identity verified via Google, confidential from reviewers.',
  keywords: [
    'ASTRA IETM',
    'KMCT IET',
    'KMCT Grievance',
    'Cyber Security Department',
    'Confidential Grievance Portal',
    'Student Grievance System',
    'grievance.astraietm.in',
  ],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'ASTRA IETM Confidential Grievance Portal',
    description: 'Speak up. Be heard. Stay protected. Confidential grievance portal for KMCT IET Cyber Security Department.',
    url: 'https://grievance.astraietm.in',
    siteName: 'ASTRA IETM Grievance Portal',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-neo-dark text-slate-100 font-mono antialiased selection:bg-neo-yellow selection:text-black">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
