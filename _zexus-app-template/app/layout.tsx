import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.zexus.xyz'
const SITE_NAME = 'Zexus App'
const SITE_DESCRIPTION =
  'The Zexus App is launching Q3 2026 on Base mainnet — voting, Trust Scores, Emergency Calls, and the ZXP reputation economy. Join the waitlist at zexus.xyz.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Coming Q3 2026`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Zexus',
    'Web3',
    'DAO',
    'governance',
    'reputation',
    'on-chain',
    'Base',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Coming Q3 2026`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ZexusGovernance',
    title: `${SITE_NAME} — Coming Q3 2026`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased bg-[#050505]"
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
