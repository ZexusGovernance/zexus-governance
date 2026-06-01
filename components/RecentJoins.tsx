'use client'

import { useEffect, useState } from 'react'

interface JoinEvent {
  participant: string
  timestamp: number
  txHash: string
  blockNumber: number
}

const POLL_INTERVAL_MS = 30_000
const ITEMS_TO_SHOW = 6

// ─── Helper: pretty relative time ──────────────────────────────────────────

function timeAgo(unixSeconds: number): string {
  const diffSec = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds)
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  return `${Math.floor(diffSec / 86400)}d ago`
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function RecentJoins() {
  const [joins, setJoins] = useState<JoinEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, forceTick] = useState(0) // re-renders every second so timeAgo updates

  // Re-render once a second so "23s ago" → "24s ago" without re-fetching
  useEffect(() => {
    const tick = setInterval(() => forceTick((n) => n + 1), 1000)
    return () => clearInterval(tick)
  }, [])

  // Poll the API
  useEffect(() => {
    let cancelled = false

    const fetchJoins = async () => {
      try {
        const res = await fetch(`/api/recent-joins?limit=${ITEMS_TO_SHOW}`)
        const data = await res.json()
        if (cancelled) return
        if (data.error) {
          setError(data.error)
        } else if (Array.isArray(data.joins)) {
          // newest first
          setJoins(
            [...data.joins].sort(
              (a: JoinEvent, b: JoinEvent) => b.timestamp - a.timestamp,
            ),
          )
          setError(null)
        }
      } catch (e: unknown) {
        if (cancelled) return
        setError((e as Error).message || 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchJoins()
    const id = setInterval(fetchJoins, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  // one entry rendered inline for the moving line
  const renderItem = (join: JoinEvent, key: string) => (
    <a
      key={key}
      href={`https://basescan.org/address/${join.participant}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 mx-6 align-middle"
    >
      <span
        className="w-5 h-5 rounded-full flex-shrink-0 border border-white/10"
        style={{
          background: `linear-gradient(135deg, #${join.participant.slice(2, 8)}, #${join.participant.slice(-6)})`,
        }}
      />
      <span className="text-xs font-mono text-gray-300 group-hover:text-[#E7C694] transition-colors">
        {shortAddr(join.participant)}
      </span>
      <span className="text-[9px] tracking-[0.2em] uppercase text-gray-600">
        joined · {timeAgo(join.timestamp)}
      </span>
      {/* separator */}
      <span className="ml-6 w-1 h-1 rounded-full bg-[#E7C694]/30" />
    </a>
  )

  return (
    <section className="relative z-10 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Compact header: centered live indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          <span className="text-[9px] tracking-[0.4em] uppercase text-green-400/70 font-mono">
            Live · Recent joins on Base
          </span>
        </div>

        {/* Moving line with grey edge fade */}
        {loading && joins.length === 0 ? (
          <p className="text-center text-xs text-gray-500 tracking-widest uppercase">
            Loading events...
          </p>
        ) : error ? (
          <p className="text-center text-xs text-red-400/70 tracking-widest uppercase">
            {error}
          </p>
        ) : joins.length === 0 ? (
          <p className="text-center text-xs text-gray-500 tracking-widest uppercase">
            No joins in the last hour · Be the first ✨
          </p>
        ) : (
          <div className="marquee-container">
            <div className="join-marquee inline-flex w-max items-center whitespace-nowrap">
              {/* rendered twice for a seamless loop */}
              {joins.map((j) => renderItem(j, `a-${j.participant}`))}
              {joins.map((j) => renderItem(j, `b-${j.participant}`))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
