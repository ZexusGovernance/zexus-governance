'use client'

import { useEffect, useState } from 'react'

interface ContactEmailProps {
  className?: string
}

// Email is split across two strings and joined at runtime.
// The full address never appears as a contiguous token in the static HTML —
// most basic scrapers won't pick it up. Gmail spam filtering takes care of
// the few sophisticated scrapers that still find it.

export default function ContactEmail({ className }: ContactEmailProps) {
  const [parts, setParts] = useState<{ user: string; domain: string } | null>(
    null
  )

  useEffect(() => {
    setParts({ user: 'zexushub', domain: 'gmail.com' })
  }, [])

  if (!parts) {
    // Server-rendered placeholder — invisible to scrapers, replaced after hydration
    return (
      <span className={className} aria-hidden="true">
        Contact
      </span>
    )
  }

  return (
    <a
      href={`mailto:${parts.user}@${parts.domain}`}
      className={className}
    >
      {parts.user}@{parts.domain}
    </a>
  )
}
