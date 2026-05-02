// lib/referrals.ts
//
// Off-chain referral system. The contract stores the join fact only;
// points and referrals live here.
//
// On production (Vercel) the storage is Upstash Redis. If env vars are
// missing (e.g. local dev without a DB) it falls back to data/referrals.json.
// This lets local development run without a Redis instance.

import { promises as fs } from 'fs'
import path from 'path'
import { Redis } from '@upstash/redis'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ReferralUser {
  address: string
  joinedAt: string
  referrer: string | null
  directReferrals: string[]
  points: number
  bonusFromAlphaTest: number
  txHash?: string
}

export interface ReferralsData {
  users: Record<string, ReferralUser>
}

export type Tier = 'Bronze' | 'Silver' | 'Gold'

// ─── Config ─────────────────────────────────────────────────────────────────

const BASE_POINTS_FOR_JOINING = 5

const TIER_THRESHOLDS = {
  silver: 10,
  gold: 30,
}

const REDIS_KEY = 'zexus:referrals'

// ─── Backend selection ──────────────────────────────────────────────────────
//
// Both env-var naming conventions are supported:
// - UPSTASH_REDIS_REST_URL/_TOKEN — manual Upstash setup
// - KV_REST_API_URL/_TOKEN — Vercel Marketplace integration uses these

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || ''
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || ''

const useRedis = !!REDIS_URL && !!REDIS_TOKEN

let redis: Redis | null = null
if (useRedis) {
  redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  console.log(
    `[referrals] Using Redis backend (${process.env.UPSTASH_REDIS_REST_URL ? 'UPSTASH_*' : 'KV_*'} env vars)`
  )
} else {
  console.log('[referrals] Using FILE backend (no Redis env vars detected)')
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'data')
const REFERRALS_FILE = path.join(DATA_DIR, 'referrals.json')

export function getTier(directReferralsCount: number): Tier {
  if (directReferralsCount >= TIER_THRESHOLDS.gold) return 'Gold'
  if (directReferralsCount >= TIER_THRESHOLDS.silver) return 'Silver'
  return 'Bronze'
}

function pointsPerReferral(directReferralsCount: number): number {
  const tier = getTier(directReferralsCount)
  return tier === 'Gold' ? 3 : tier === 'Silver' ? 2 : 1
}

async function readData(): Promise<ReferralsData> {
  // Redis backend (production / Vercel)
  if (redis) {
    try {
      const raw = await redis.get(REDIS_KEY)
      if (!raw) return { users: {} }

      // Upstash may return either a parsed object or a raw string —
      // handle both shapes explicitly.
      let data: unknown
      if (typeof raw === 'string') {
        data = JSON.parse(raw)
      } else {
        data = raw
      }

      if (
        data &&
        typeof data === 'object' &&
        'users' in data &&
        (data as ReferralsData).users
      ) {
        return data as ReferralsData
      }
      console.warn('[referrals] Redis returned unexpected shape:', data)
      return { users: {} }
    } catch (err) {
      console.error('[referrals] Redis read failed:', err)
      return { users: {} }
    }
  }

  // File backend (local dev)
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const raw = await fs.readFile(REFERRALS_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    if (!parsed.users) return { users: {} }
    return parsed
  } catch {
    return { users: {} }
  }
}

async function writeData(data: ReferralsData): Promise<void> {
  // Redis backend — explicit serialization for reliability
  if (redis) {
    try {
      const json = JSON.stringify(data)
      const userCount = Object.keys(data.users).length
      console.log(
        `[referrals] Writing to Redis: ${json.length} bytes, ${userCount} users`
      )
      await redis.set(REDIS_KEY, json)
      console.log(`[referrals] Redis write OK`)
      return
    } catch (err) {
      console.error('[referrals] Redis write FAILED:', err)
      throw err // important: bubble up so route.ts returns 500
    }
  }

  // File backend
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(REFERRALS_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('[referrals] File write FAILED:', err)
    throw err
  }
}

// ─── API ────────────────────────────────────────────────────────────────────

/**
 * Registers a user in the referral system.
 * Must be called AFTER a successful contract write.
 * Idempotent: if the user already exists, returns the existing record.
 */
export async function registerUser(
  userAddress: string,
  referrerAddress: string | null,
  txHash?: string
): Promise<{ user: ReferralUser; rewardedReferrer: ReferralUser | null }> {
  const data = await readData()
  const userKey = userAddress.toLowerCase()
  const rawReferrerKey = referrerAddress?.toLowerCase() || null

  if (data.users[userKey]) {
    return { user: data.users[userKey], rewardedReferrer: null }
  }

  // Self-referral and unknown-referrer protection
  const validReferrerKey =
    rawReferrerKey &&
    rawReferrerKey !== userKey &&
    data.users[rawReferrerKey]
      ? rawReferrerKey
      : null

  const newUser: ReferralUser = {
    address: userKey,
    joinedAt: new Date().toISOString(),
    referrer: validReferrerKey,
    directReferrals: [],
    points: BASE_POINTS_FOR_JOINING,
    bonusFromAlphaTest: 0,
    txHash,
  }

  data.users[userKey] = newUser

  let rewardedReferrer: ReferralUser | null = null
  if (validReferrerKey) {
    const ref = data.users[validReferrerKey]
    const reward = pointsPerReferral(ref.directReferrals.length)
    ref.directReferrals.push(userKey)
    ref.points += reward
    rewardedReferrer = ref
  }

  await writeData(data)
  return { user: newUser, rewardedReferrer }
}

/**
 * Returns the user's stats and their position in the queue.
 */
export async function getUserStats(userAddress: string): Promise<{
  exists: boolean
  points: number
  tier: Tier
  referredCount: number
  position: number
  totalUsers: number
}> {
  const data = await readData()
  const key = userAddress.toLowerCase()
  const user = data.users[key]
  const totalUsers = Object.keys(data.users).length

  if (!user) {
    return {
      exists: false,
      points: 0,
      tier: 'Bronze',
      referredCount: 0,
      position: 0,
      totalUsers,
    }
  }

  const allUsers = Object.values(data.users)
  allUsers.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return a.joinedAt.localeCompare(b.joinedAt)
  })

  const position = allUsers.findIndex((u) => u.address === key) + 1

  return {
    exists: true,
    points: user.points,
    tier: getTier(user.directReferrals.length),
    referredCount: user.directReferrals.length,
    position,
    totalUsers,
  }
}

/**
 * Latest N joins by time (for the live activity feed).
 */
export async function getRecentJoins(limit: number = 8): Promise<
  Array<{
    address: string
    joinedAt: string
    txHash: string | null
  }>
> {
  const data = await readData()
  const all = Object.values(data.users)
  all.sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
  return all.slice(0, limit).map((u) => ({
    address: u.address,
    joinedAt: u.joinedAt,
    txHash: u.txHash || null,
  }))
}

/**
 * Top N users for the leaderboard. Optional, used later.
 */
export async function getLeaderboard(limit: number = 10): Promise<
  Array<{
    address: string
    points: number
    referredCount: number
    tier: Tier
  }>
> {
  const data = await readData()
  const all = Object.values(data.users)
  all.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return a.joinedAt.localeCompare(b.joinedAt)
  })
  return all.slice(0, limit).map((u) => ({
    address: u.address,
    points: u.points,
    referredCount: u.directReferrals.length,
    tier: getTier(u.directReferrals.length),
  }))
}
