// app/api/recent-joins/route.ts
//
// Возвращает последние N подписей для live activity feed.
//
// ВАЖНО: данные читаются из data/referrals.json, а не из событий контракта.
// Причина: на free tier Alchemy лимит на eth_getLogs всего 10 блоков
// (бесполезно для нашей задачи). Локальные данные синхронизированы с
// контрактом по построению — каждая подписка идёт через POST /api/waitlist,
// который пишет ОДНОВРЕМЕННО и в контракт, и в файл. Если транзакция
// падает on-chain — мы файл не обновляем (см. route.ts).
//
// При желании в будущем можно мигрировать на платный RPC + getLogs или на
// indexed-сервис типа The Graph / Goldsky.

import { NextRequest, NextResponse } from 'next/server'
import { getRecentJoins } from '@/lib/referrals'

export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get('limit')
  const limit = Math.min(Math.max(parseInt(limitParam || '8', 10) || 8, 1), 50)

  try {
    const joins = await getRecentJoins(limit)

    return NextResponse.json({
      joins: joins.map((j) => ({
        participant: j.address,
        timestamp: Math.floor(new Date(j.joinedAt).getTime() / 1000),
        txHash: j.txHash || '',
        joinedAt: j.joinedAt,
      })),
    })
  } catch (err: unknown) {
    const error = err as { message?: string }
    console.error('[RecentJoins] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to load joins' },
      { status: 500 }
    )
  }
}
