'use client'

import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import ReferralPanel, { UserStats } from './ReferralPanel'

type WaitlistStatus =
  | 'idle'
  | 'checking'
  | 'not_in'
  | 'already_in'
  | 'signing'
  | 'submitting'
  | 'success'
  | 'error'

interface WaitlistButtonProps {
  variant?: 'primary' | 'secondary'
  onNotification?: (message: string) => void
  /** Fires when the user transitions in/out of the dashboard view */
  onSuccessStateChange?: (isSuccess: boolean) => void
}

export default function WaitlistButton({
  variant = 'primary',
  onNotification,
  onSuccessStateChange,
}: WaitlistButtonProps) {
  const { address, isConnected, isConnecting: isAccountConnecting } = useAccount()
  const { openConnectModal, connectModalOpen } = useConnectModal()
  const { signMessageAsync } = useSignMessage()
  const isConnecting = isAccountConnecting || connectModalOpen

  const [status, setStatus] = useState<WaitlistStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [count, setCount] = useState<number | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [referrer, setReferrer] = useState<string | null>(null)

  // Read ?ref= from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref && /^0x[a-fA-F0-9]{40}$/.test(ref)) {
      setReferrer(ref.toLowerCase())
    }
  }, [])

  // Load the counter on mount
  useEffect(() => {
    fetchCount()
  }, [])

  // When the wallet connects, check the address status
  useEffect(() => {
    if (isConnected && address) {
      checkWaitlistStatus(address)
    } else {
      setStatus('idle')
      setStats(null)
    }
  }, [isConnected, address])

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/waitlist')
      const data = await res.json()
      if (typeof data.total === 'number') setCount(data.total)
    } catch {
      // silently ignore — counter just won't appear
    }
  }

  const checkWaitlistStatus = async (addr: string) => {
    setStatus('checking')
    try {
      const res = await fetch(`/api/waitlist?address=${addr.toLowerCase()}`)
      const data = await res.json()
      if (typeof data.total === 'number') setCount(data.total)
      if (data.stats) setStats(data.stats)
      setStatus(data.inWaitlist ? 'already_in' : 'not_in')
    } catch {
      setStatus('not_in')
    }
  }

  const handleClick = async () => {
    if (!isConnected) {
      openConnectModal?.()
      return
    }
    if (status === 'already_in' || status === 'success') return
    if ((status === 'not_in' || status === 'error') && address) {
      await joinWaitlist(address)
    }
  }

  const joinWaitlist = async (addr: string) => {
    setStatus('signing')
    setErrorMsg('')

    try {
      const message = `I want to join the Zexus waitlist.\n\nWallet: ${addr}\nTimestamp: ${Date.now()}`
      const signature = await signMessageAsync({ message })

      setStatus('submitting')

      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: addr.toLowerCase(),
          signature,
          message,
          referrer,
        }),
      })

      const data = await res.json()

      if (typeof data.total === 'number') setCount(data.total)
      if (data.stats) setStats(data.stats)

      if (data.success) {
        setStatus('success')
        onNotification?.('🎉 You joined the Zexus Waitlist!')
      } else if (data.alreadyIn) {
        setStatus('already_in')
        onNotification?.('You are already on the waitlist!')
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err: unknown) {
      const error = err as { code?: number; message?: string }
      if (error?.code === 4001 || error?.message?.includes('rejected')) {
        setStatus('not_in')
        setErrorMsg('Signature rejected')
        onNotification?.('Signature cancelled')
      } else {
        setStatus('error')
        setErrorMsg(error?.message || 'Something went wrong')
        onNotification?.('Error joining waitlist')
      }
    }
  }

  // ─── Button content ───────────────────────────────────────────────────────

  const getButtonContent = () => {
    if (!isConnected || status === 'idle') {
      return { label: 'Join the Waitlist', sub: 'Connect wallet to continue', disabled: false }
    }
    if (isConnecting || status === 'checking') {
      return { label: 'Checking...', sub: null, disabled: true }
    }
    if (status === 'signing') {
      return { label: 'Sign in wallet...', sub: 'Approve in your wallet — no gas needed', disabled: true }
    }
    if (status === 'submitting') {
      return { label: 'Registering on-chain...', sub: 'Writing to Base mainnet', disabled: true }
    }
    if (status === 'already_in' || status === 'success') {
      return { label: "✓ You're on the Waitlist", sub: null, disabled: true }
    }
    if (status === 'error') {
      return { label: 'Try Again', sub: errorMsg, disabled: false }
    }
    return {
      label: 'Join the Waitlist',
      sub: address ? `${address.slice(0, 6)}...${address.slice(-4)} · Sign to confirm` : null,
      disabled: false,
    }
  }

  const { label, sub, disabled } = getButtonContent()
  const isSuccess = status === 'already_in' || status === 'success'
  const isLoading =
    status === 'checking' ||
    status === 'signing' ||
    status === 'submitting' ||
    isConnecting

  // Notify parent so the hero layout can adapt (centered → top-aligned)
  useEffect(() => {
    onSuccessStateChange?.(isSuccess)
  }, [isSuccess, onSuccessStateChange])

  // ─── Counter + Verified badge in a single line ───────────────────────────

  const CONTRACT_ADDR = '0xB6ce48D89DfDe6cF9589b8f889d6F9f05Fa07584'

  const TrustStrip = () => {
    if (count === null) return null
    return (
      <div className="flex items-center gap-3 mt-6 text-[11px] tracking-[0.35em] uppercase text-gray-500 font-medium">
        {/* Live counter */}
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E7C694] opacity-50"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E7C694]/70"></span>
          </span>
          <span>
            <span className="text-[#E7C694]/80 font-bold">{count.toLocaleString()}</span>
            {' '}joined
          </span>
        </span>

        {/* Separator */}
        <span className="text-gray-700">·</span>

        {/* Verified link */}
        <a
          href={`https://basescan.org/address/${CONTRACT_ADDR}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-[#E7C694] transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] flex-shrink-0" />
          <span>Verified on Base ↗</span>
        </a>
      </div>
    )
  }

  // ─── PRIMARY ──────────────────────────────────────────────────────────────

  if (variant === 'primary') {
    // If the user is already on the waitlist, show the single dashboard panel
    // — no big button, no scattered badges, everything lives inside one card.
    if (isSuccess && stats && address) {
      return (
        <div className="flex flex-col items-center w-full">
          <ReferralPanel address={address} stats={stats} count={count} />
        </div>
      )
    }

    // Otherwise: the regular button for connecting / signing
    return (
      <div className="flex flex-col items-center w-full">
        <span className="text-[10px] uppercase tracking-[0.6em] text-[#E7C694] mb-6 font-bold animate-pulse opacity-60">
          Waitlist is Live
        </span>

        <button
          onClick={handleClick}
          disabled={disabled}
          className={`
            group relative inline-flex items-center justify-center px-16 py-6
            overflow-hidden rounded-full bg-[#0A0A0A] border transition-all duration-500
            active:scale-95 disabled:cursor-not-allowed
            ${isLoading
              ? 'border-white/20 text-white/40'
              : 'border-[#E7C694]/30 text-[#E7C694] hover:border-[#E7C694] hover:shadow-[0_0_35px_rgba(231,198,148,0.15)]'
            }
          `}
        >
          {!disabled && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E7C694]/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          )}

          {isLoading && (
            <span className="absolute left-8">
              <svg className="animate-spin w-4 h-4 text-[#E7C694]/50" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </span>
          )}

          <span className="relative z-10 text-xl font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-300">
            {label}
          </span>

          {!disabled && (
            <div className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-[#E7C694]/40 to-[#A68B5B]/40 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
          )}
        </button>

        {sub && (
          <p className="text-[10px] tracking-widest uppercase text-gray-500 animate-pulse mt-3">
            {sub}
          </p>
        )}

        {/* If a referrer is present in the URL, surface it as a small note */}
        {referrer && (
          <p className="text-[10px] tracking-widest uppercase text-[#E7C694]/60 mt-3">
            Invited by {referrer.slice(0, 6)}...{referrer.slice(-4)}
          </p>
        )}

        <TrustStrip />
      </div>
    )
  }

  // ─── SECONDARY ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative px-12 py-4 rounded-full border bg-[#0A0A0A]
          transition-all duration-500 text-sm font-bold tracking-[0.2em] uppercase
          disabled:cursor-not-allowed
          ${isSuccess
            ? 'border-[#E7C694]/40 text-[#E7C694]'
            : isLoading
              ? 'border-white/10 text-white/30'
              : 'border-white/10 hover:border-[#E7C694]/40 hover:text-[#E7C694]'
          }
        `}
      >
        {isLoading && (
          <span className="inline-block mr-2">
            <svg className="animate-spin w-3 h-3 inline" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </span>
        )}
        {label}
      </button>

      {sub && (
        <p className="text-[9px] tracking-widest uppercase text-gray-600 mt-2">
          {sub}
        </p>
      )}

      <TrustStrip />
    </div>
  )
}
