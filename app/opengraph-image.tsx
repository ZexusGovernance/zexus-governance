// app/opengraph-image.tsx
//
// Auto-generated Open Graph image for the root URL.
// Next.js renders this React component to a 1200x630 PNG at build time
// (or on first request) and serves it as the page's og:image.
//
// Replace the design when you want a custom-branded card; this is a
// solid default that looks clean in Twitter / Telegram previews.

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Zexus Governance — Verify, Don\'t Trust'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at top, #1a1208 0%, #050505 60%)',
          padding: 80,
          position: 'relative',
        }}
      >
        {/* Top-left brand */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#E7C694',
              boxShadow: '0 0 30px rgba(231, 198, 148, 0.6)',
            }}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#E7C694',
              fontWeight: 700,
            }}
          >
            Zexus Governance
          </span>
        </div>

        {/* Top-right status */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 20px',
            border: '1px solid rgba(231, 198, 148, 0.25)',
            borderRadius: 999,
            background: 'rgba(231, 198, 148, 0.05)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
            }}
          />
          <span
            style={{
              fontSize: 16,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#10b981',
              fontWeight: 600,
            }}
          >
            Waitlist Live
          </span>
        </div>

        {/* Centerpiece headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 140,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              fontWeight: 900,
              margin: 0,
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>Verify,</span>
            <span
              style={{
                background:
                  'linear-gradient(to top right, #A68B5B, #FFFEEF, #E7C694)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              Don&apos;t Trust.
            </span>
          </h1>

          <p
            style={{
              marginTop: 32,
              fontSize: 28,
              color: '#9ca3af',
              maxWidth: 800,
              lineHeight: 1.4,
              fontWeight: 300,
            }}
          >
            The decentralized trust layer for Web3 ecosystems
          </p>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: 80,
            right: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 18,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#6b7280',
          }}
        >
          <span>On-chain · Base mainnet</span>
          <span style={{ color: '#E7C694' }}>zexus.xyz</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
