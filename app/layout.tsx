// zexus-governance/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import { geistSans, geistMono } from './fonts';

export const metadata: Metadata = {
  title: 'Zexus Governance',
  description: 'The Hub for Web3 Ecosystems',
  // ИЗМЕНЕНИЕ: Добавляем иконку сайта
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-geist-sans antialiased">
        {children}
      </body>
    </html>
  );
}