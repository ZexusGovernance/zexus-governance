'use client'

import { useState } from 'react'

export type Tier = 'Bronze' | 'Silver' | 'Gold'

export interface UserStats {
  exists: boolean
  points: number
  tier: Tier
  referredCount: number
  position: number
  totalUsers: number
}

interface ReferralPanelProps {
  address: string
  stats: UserStats
  count: number | null
  contractAddress?: string
}

// ─── Config ────────────────────────────────────────────────────────────────

const DEFAULT_CONTRACT = '0xB6ce48D89DfDe6cF9589b8f889d6F9f05Fa07584'

const TIER_CONFIG: Record<Tier, { color: string; label: string; ppr: number }> = {
  Bronze: { color: '#C5762D', label: 'Bronze', ppr: 1 },
  Silver: { color: '#CFCFCF', label: 'Silver', ppr: 2 },
  Gold: { color: '#E7C694', label: 'Gold', ppr: 3 },
}

const SHARE_TEXT =
  'I just joined the @ZexusGovernance waitlist — the trust layer for Web3.\n\nSign up gas-free and get on the list early:'

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildRefLink(address: string): string {
  if (typeof window === 'undefined') return `?ref=${address}`
  return `${window.location.origin}/?ref=${address}`
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// ─── Icons ─────────────────────────────────────────────────────────────────

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

const CopyIcon = ({ checked }: { checked: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
    {checked ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    ) : (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    )}
  </svg>
)

// ─── Main component: unified dashboard ────────────────────────────────────

export default function ReferralPanel({
  address,
  stats,
  count,
  contractAddress = DEFAULT_CONTRACT,
}: ReferralPanelProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedDiscord, setCopiedDiscord] = useState(false)

  const refLink = buildRefLink(address)
  const tierData = TIER_CONFIG[stats.tier]
  const totalCount = count ?? stats.totalUsers

  const copyToClipboard = async (text: string, type: 'link' | 'discord') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'link') {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      } else {
        setCopiedDiscord(true)
        setTimeout(() => setCopiedDiscord(false), 2000)
      }
    } catch {
      // ignore
    }
  }

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(refLink)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(SHARE_TEXT)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareDiscord = () => {
    const text = `${SHARE_TEXT}\n${refLink}`
    copyToClipboard(text, 'discord')
  }

  return (
    <div
      className="
        relative w-full max-w-xl mx-auto
        bg-[#0A0A0A]/70 backdrop-blur-xl
        border border-[#E7C694]/20 rounded-3xl
        shadow-[0_0_80px_rgba(231,198,148,0.07)]
        overflow-hidden
      "
    >
      {/* ── Top accent line ── */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C694]/40 to-transparent" />

      {/* ── Header: status + summary line ── */}
      <div className="px-7 py-6 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E7C694] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E7C694]" />
          </span>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#E7C694] font-bold">
            You&apos;re on the Waitlist
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-gray-500 font-mono">
          <span>
            <span className="text-[#E7C694]/80 font-bold">
              {totalCount.toLocaleString()}
            </span>{' '}
            joined
          </span>
          <span className="text-gray-700">·</span>
          <a
            href={`https://basescan.org/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#E7C694] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
            <span>Verified on Base ↗</span>
          </a>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="px-7 py-6 grid grid-cols-3 gap-3 border-b border-white/[0.05]">
        <StatCard
          label="Position"
          value={`#${stats.position.toLocaleString()}`}
          sub={`of ${totalCount.toLocaleString()}`}
        />
        <StatCard
          label="Points"
          value={stats.points.toLocaleString()}
          sub={`${tierData.ppr} pt per ref`}
          accent
        />
        <StatCard
          label="Tier"
          value={tierData.label}
          sub={`${stats.referredCount} invited`}
          color={tierData.color}
        />
      </div>

      {/* ── Invite link ── */}
      <div className="px-7 py-6 border-b border-white/[0.05]">
        <p className="text-[9px] tracking-[0.4em] uppercase text-gray-500 mb-3">
          Your invite link
        </p>
        <div className="flex items-center gap-2 bg-black/40 border border-white/[0.08] rounded-full pl-4 pr-1.5 py-1.5 hover:border-[#E7C694]/30 transition-colors">
          <span className="flex-1 text-xs text-gray-300 font-mono truncate">
            {refLink}
          </span>
          <button
            onClick={() => copyToClipboard(refLink, 'link')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E7C694]/15 hover:bg-[#E7C694]/25 text-[#E7C694] text-[10px] font-bold uppercase tracking-widest transition-colors flex-shrink-0"
            aria-label="Copy invite link"
          >
            <CopyIcon checked={copiedLink} />
            {copiedLink ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* ── Share buttons ── */}
      <div className="px-7 py-6 border-b border-white/[0.05]">
        <p className="text-[9px] tracking-[0.4em] uppercase text-gray-500 mb-3">
          Share & Earn
        </p>
        <div className="grid grid-cols-3 gap-2">
          <ShareButton onClick={shareTwitter} icon={<TwitterIcon />} label="X" />
          <ShareButton
            onClick={shareTelegram}
            icon={<TelegramIcon />}
            label="Telegram"
          />
          <ShareButton
            onClick={shareDiscord}
            icon={<DiscordIcon />}
            label={copiedDiscord ? 'Copied' : 'Discord'}
          />
        </div>
      </div>

      {/* ── Tier hint footer ── */}
      <div className="px-7 py-4 bg-black/20">
        <p className="text-[10px] text-gray-600 leading-relaxed text-center">
          Each invited friend earns you points. Reach{' '}
          <span className="text-[#CFCFCF]">Silver</span> at 10 refs (2 pt each),{' '}
          <span className="text-[#E7C694]">Gold</span> at 30 (3 pt each).
        </p>
      </div>
    </div>
  )
}

// ─── Subcomponents ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
  color,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
  color?: string
}) {
  return (
    <div
      className={`
        relative px-3 py-3 rounded-xl bg-black/30 border
        ${accent ? 'border-[#E7C694]/30' : 'border-white/[0.05]'}
      `}
    >
      <p className="text-[8px] tracking-[0.35em] uppercase text-gray-500 mb-1.5">
        {label}
      </p>
      <p
        className="text-2xl font-black tracking-tight leading-none"
        style={color ? { color } : undefined}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[8px] tracking-widest uppercase text-gray-600 mt-1.5">
          {sub}
        </p>
      )}
    </div>
  )
}

function ShareButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center justify-center gap-2 px-3 py-2.5 rounded-full
        bg-black/30 border border-white/[0.08]
        text-gray-300 text-[10px] font-bold tracking-widest uppercase
        hover:border-[#E7C694]/40 hover:text-[#E7C694] hover:bg-[#E7C694]/5
        transition-all active:scale-95
      "
    >
      {icon}
      {label}
    </button>
  )
}
