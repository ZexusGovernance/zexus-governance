import type { Metadata } from 'next'
import './globals.css'
import { geistSans, geistMono } from './fonts'
import { Analytics } from '@vercel/analytics/next'

// ─── Site config ──────────────────────────────────────────────────────────
//
// SITE_URL falls back to the canonical production domain (zexus.xyz).
// On Vercel preview deploys you can override it with NEXT_PUBLIC_SITE_URL
// to make OG previews point to the preview URL instead.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zexus.xyz'

const SITE_NAME = 'Zexus Governance'
const SITE_TAGLINE = 'Verify, Don’t Trust'
const SITE_DESCRIPTION =
  'The decentralized trust layer for Web3 ecosystems. Verifiable accountability for projects, real voting power for communities. Join the waitlist on Base — gas-free.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'Zexus',
    'Web3',
    'DAO',
    'governance',
    'reputation',
    'trust',
    'transparency',
    'on-chain',
    'Base',
    'accountability',
    'waitlist',
  ],
  authors: [{ name: 'Zexus' }],
  creator: 'Zexus',
  publisher: 'Zexus',

  // Icons are auto-detected from app/icon.* and app/apple-icon.* — no manual
  // entries needed when those files exist.

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@ZexusGovernance',
    creator: '@ZexusGovernance',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: 'technology',
}

// JSON-LD structured data for legitimate crawlers (search engines,
// listing platforms like DeBank/CoinGecko, AI agents). Email here is
// machine-readable — spam scrapers usually ignore JSON-LD blocks.

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: 'Zexus',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: SITE_DESCRIPTION,
  email: 'zexushub@gmail.com',
  sameAs: [
    'https://x.com/ZexusGovernance',
    'https://t.me/+-BSQtI1uNNUwNTky',
    'https://discord.gg/SDUZMRP35J',
    'https://zexus-governance.gitbook.io/whitepaper',
    'https://github.com/ZexusGovernance/zexus-governance',
  ],
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
        <Analytics />
        {/* Structured data for crawlers / verification platforms */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_LD),
          }}
        />
      </body>
    </html>
  )
}
