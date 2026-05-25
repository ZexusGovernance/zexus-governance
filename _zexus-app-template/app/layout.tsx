import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.zexus.xyz'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Zexus App — Demo',
  description:
    'Zexus governance platform demo — voting, Trust Scores, Emergency Calls, ZXP staking.',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Zexus App — Demo',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ZexusGovernance',
  },
  robots: { index: true, follow: true },
  other: {
    'talentapp:project_verification': 'e6d70fa56c4ce7f53f52d148bb78ee4e4265d3f57937e09381337c6edc85ee49e074c2954f0268bf00ed5a063f4c89bf1463bc153c14fbad92a95c89f658fd6f',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#0b0a09' }} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
