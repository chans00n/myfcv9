import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MYFC - Elevate Your Routine with Facial Fitness',
  description: 'Make facial fitness a natural part of your daily wellness routine-because when you look strong, you feel strong.',
  applicationName: 'MYFC',
  authors: [{ name: 'MYFC Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
