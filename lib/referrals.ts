// lib/referrals.ts
//
// Off-chain реферальная система. Контракт хранит сам факт подписки,
// а очки/рефералы — здесь.
//
// На проде (Vercel) хранилище — Upstash Redis. Если переменные окружения
// UPSTASH_REDIS_REST_URL не заданы (например, локально без БД) — fallback
// на data/referrals.json. Это позволяет разрабатывать без локального Redis.

import { promises as fs } from 'fs'
import path from 'path'
import { Redis } from '@upstash/redis'

// ─── Типы ───────────────────────────────────────────────────────────────────

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

// ─── Конфиг ─────────────────────────────────────────────────────────────────

const BASE_POINTS_FOR_JOINING = 5

const TIER_THRESHOLDS = {
  silver: 10,
  gold: 30,
}

const REDIS_KEY = 'zexus:referrals'

// ─── Backend выбор ──────────────────────────────────────────────────────────

const useRedis =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

let redis: Redis | null = null
if (useRedis) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

// ─── Хелперы ────────────────────────────────────────────────────────────────

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
  // Redis backend (на Vercel)
  if (redis) {
    try {
      const data = await redis.get<ReferralsData>(REDIS_KEY)
      if (data && typeof data === 'object' && 'users' in data) {
        return data as ReferralsData
      }
      return { users: {} }
    } catch (err) {
      console.error('[referrals] Redis read failed:', err)
      return { users: {} }
    }
  }

  // File backend (локально)
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
  // Redis backend
  if (redis) {
    await redis.set(REDIS_KEY, data)
    return
  }

  // File backend
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(REFERRALS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── API ────────────────────────────────────────────────────────────────────

/**
 * Регистрирует юзера в реферальной системе.
 * Вызывается ПОСЛЕ успешной записи в контракт.
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
 * Возвращает статистику конкретного юзера + его позицию в очереди.
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
 * Последние N подписей по времени (для live activity feed).
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
 * Топ-N юзеров для лидерборда. Опционально использовать позже.
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
