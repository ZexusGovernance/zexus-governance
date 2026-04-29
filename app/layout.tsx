import type { Metadata } from 'next'
import './globals.css'
import { geistSans, geistMono } from './fonts'

export const metadata: Metadata = {
  title: 'Zexus Governance',
  description: 'The Hub for Web3 Ecosystems',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-geist-sans antialiased bg-[#050505]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
