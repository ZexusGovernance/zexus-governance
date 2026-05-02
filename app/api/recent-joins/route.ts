// app/api/recent-joins/route.ts
//
// Returns the latest N joins for the live activity feed.
//
// IMPORTANT: data is read from referrals storage (Redis or file), NOT
// from contract events. The Alchemy free tier limits eth_getLogs to a 10
// block range which is useless for this. Local data is in sync with the
// contract by construction — every join goes through POST /api/waitlist,
// which writes to both atomically. If the on-chain tx reverts we never
// touch the off-chain store.
//
// In-memory cache reduces Redis load: even if 100 visitors poll the feed
// concurrently, only 1 read every CACHE_TTL_MS hits Upstash.

import { NextRequest, NextResponse } from 'next/server'
import { getRecentJoins } from '@/lib/referrals'

interface JoinPayload {
  participant: string
  timestamp: number
  txHash: string
  joinedAt: string
}

const CACHE_TTL_MS = 30_000 // 30 seconds

let cache: { data: JoinPayload[]; ts: number } | null = null

export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get('limit')
  const limit = Math.min(Math.max(parseInt(limitParam || '8', 10) || 8, 1), 50)

  try {
    // Serve from cache if fresh
    const now = Date.now()
    if (cache && now - cache.ts < CACHE_TTL_MS) {
      return NextResponse.json({ joins: cache.data.slice(0, limit) })
    }

    const joins = await getRecentJoins(50) // fetch a bit more, slice on demand
    const payload: JoinPayload[] = joins.map((j) => ({
      participant: j.address,
      timestamp: Math.floor(new Date(j.joinedAt).getTime() / 1000),
      txHash: j.txHash || '',
      joinedAt: j.joinedAt,
    }))

    cache = { data: payload, ts: now }

    return NextResponse.json({ joins: payload.slice(0, limit) })
  } catch (err: unknown) {
    const error = err as { message?: string }
    console.error('[RecentJoins] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to load joins' },
      { status: 500 }
    )
  }
}
