// lib/referrals.ts
//
// Off-chain реферальная система. Контракт хранит только сам факт подписки,
// а очки/рефералы — здесь, в data/referrals.json. Это позволяет менять
// формулу без миграции контракта и бесплатно (без газа).
//
// Когда запустишь ZXP — снапшотом этого файла раздаёшь токены/баллы.

import { promises as fs } from 'fs'
import path from 'path'

// ─── Типы ───────────────────────────────────────────────────────────────────

export interface ReferralUser {
  address: string                    // lowercase
  joinedAt: string                   // ISO timestamp
  referrer: string | null            // lowercase address или null если пришёл напрямую
  directReferrals: string[]          // lowercase addresses, кого этот юзер привёл
  points: number                     // текущий баланс очков
  bonusFromAlphaTest: number         // зарезервировано для будущего airdrop за альфа-тест
  txHash?: string                    // tx подписки в контракт (для линка в BaseScan)
}

export interface ReferralsData {
  users: Record<string, ReferralUser>  // key: lowercase address
}

export type Tier = 'Bronze' | 'Silver' | 'Gold'

// ─── Конфиг ─────────────────────────────────────────────────────────────────

const BASE_POINTS_FOR_JOINING = 5

// Пороги тиров (по количеству прямых рефералов):
//   Bronze:  0 - 9   рефералов  →  1 очко за нового реферала
//   Silver: 10 - 29 рефералов  →  2 очка за нового реферала
//   Gold:   30+      рефералов  →  3 очка за нового реферала
const TIER_THRESHOLDS = {
  silver: 10,
  gold: 30,
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
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(REFERRALS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── API ────────────────────────────────────────────────────────────────────

/**
 * Регистрирует юзера в реферальной системе.
 * Вызывается ПОСЛЕ успешной записи в контракт.
 *
 * @param userAddress адрес нового подписчика
 * @param referrerAddress адрес реферера (или null если пришёл напрямую)
 */
export async function registerUser(
  userAddress: string,
  referrerAddress: string | null,
  txHash?: string
): Promise<{ user: ReferralUser; rewardedReferrer: ReferralUser | null }> {
  const data = await readData()
  const userKey = userAddress.toLowerCase()
  const rawReferrerKey = referrerAddress?.toLowerCase() || null

  // Если уже есть — ничего не делаем (защита от двойного вызова)
  if (data.users[userKey]) {
    return { user: data.users[userKey], rewardedReferrer: null }
  }

  // Защита от self-referral и невалидных рефереров
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

  // Награждаем реферера согласно его текущему тиру
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
 * Возвращает статистику конкретного юзера + его позицию в общей очереди.
 * Если юзера нет — exists: false, но totalUsers всё равно вернётся.
 */
export async function getUserStats(userAddress: string): Promise<{
  exists: boolean
  points: number
  tier: Tier
  referredCount: number
  position: number          // 1-based; 0 если юзера нет
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

  // Ранжируем: больше очков → выше; при равенстве — кто раньше пришёл → выше
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
 * Сортировка DESC — новые сверху.
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
