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
          setJoins(data.joins)
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

  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-xl mx-auto">
        {/* Compact header: single line */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
            </span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-green-400/70 font-mono">
              Live · On-chain
            </span>
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            Recent joins on Base
          </span>
        </div>

        {/* Feed */}
        <div className="bg-[#0A0A0A]/40 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden">
          {loading && joins.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <span className="text-xs text-gray-500 tracking-widest uppercase">
                Loading events...
              </span>
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center">
              <span className="text-xs text-red-400/70 tracking-widest uppercase">
                {error}
              </span>
            </div>
          ) : joins.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <span className="text-xs text-gray-500 tracking-widest uppercase">
                No joins in the last hour · Be the first ✨
              </span>
            </div>
          ) : (
            <ul>
              {joins.map((join, idx) => (
                <li
                  key={join.participant}
                  className={`
                    flex items-center justify-between px-5 py-3
                    ${idx !== joins.length - 1 ? 'border-b border-white/[0.03]' : ''}
                    transition-colors hover:bg-white/[0.02]
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 border border-white/10"
                      style={{
                        background: `linear-gradient(135deg, #${join.participant.slice(2, 8)}, #${join.participant.slice(-6)})`,
                      }}
                    />
                    <a
                      href={`https://basescan.org/address/${join.participant}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-gray-300 hover:text-[#E7C694] transition-colors truncate"
                    >
                      {shortAddr(join.participant)}
                    </a>
                  </div>

                  {join.txHash ? (
                    <a
                      href={`https://basescan.org/tx/${join.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] tracking-widest uppercase text-gray-600 hover:text-[#E7C694] transition-colors flex-shrink-0 ml-3"
                    >
                      {timeAgo(join.timestamp)} ↗
                    </a>
                  ) : (
                    <span className="text-[9px] tracking-widest uppercase text-gray-600 flex-shrink-0 ml-3">
                      {timeAgo(join.timestamp)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
