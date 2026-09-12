import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  metadataBase: new URL('https://grievance.astraietm.in'),
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
      <body className="min-h-screen flex flex-col bg-cyber-bg text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
