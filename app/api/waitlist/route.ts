// app/api/waitlist/route.ts
//
// Required environment variables:
//   WAITLIST_CONTRACT_ADDRESS=0x...       deployed contract address
//   RELAYER_PRIVATE_KEY=0x...             relayer wallet private key
//   BASE_RPC_URL=https://...              server-side Base RPC (optional)
//   NEXT_PUBLIC_BASE_RPC_URL=...          fallback if BASE_RPC_URL is missing

import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, createWalletClient, http, verifyMessage } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { registerUser, getUserStats } from '@/lib/referrals'

// ─── Contract ABI (only the functions we need) ──────────────────────────────

const WAITLIST_ABI = [
  {
    name: 'addToWaitlist',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'participant', type: 'address' }],
    outputs: [],
  },
  {
    name: 'isInWaitlist',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'count',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

// ─── viem clients ───────────────────────────────────────────────────────────

// Server-only RPC (BASE_RPC_URL has no NEXT_PUBLIC_ prefix, key stays on the server).
// Falls back to the public RPC when no private one is configured.
const RPC_URL =
  process.env.BASE_RPC_URL ||
  process.env.NEXT_PUBLIC_BASE_RPC_URL ||
  'https://mainnet.base.org'
const CONTRACT_ADDRESS = process.env.WAITLIST_CONTRACT_ADDRESS as `0x${string}`

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
})

function getWalletClient() {
  const privateKey = process.env.RELAYER_PRIVATE_KEY as `0x${string}`
  if (!privateKey) throw new Error('RELAYER_PRIVATE_KEY not set')
  const account = privateKeyToAccount(privateKey)
  return createWalletClient({
    account,
    chain: base,
    transport: http(RPC_URL),
  })
}

// ─── GET /api/waitlist?address=0x... ────────────────────────────────────────

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')

  try {
    const total = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: WAITLIST_ABI,
      functionName: 'count',
    })

    if (!address) {
      return NextResponse.json({ total: Number(total) })
    }

    const inWaitlist = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: WAITLIST_ABI,
      functionName: 'isInWaitlist',
      args: [address as `0x${string}`],
    })

    const stats = await getUserStats(address)

    return NextResponse.json({ inWaitlist, total: Number(total), stats })
  } catch (err: unknown) {
    console.error('[Waitlist GET] Error:', err)
    return NextResponse.json({ error: 'Contract read failed' }, { status: 500 })
  }
}

// ─── POST /api/waitlist ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { address, signature, message, referrer } = body

    if (!address || !signature || !message) {
      return NextResponse.json(
        { error: 'address, signature, message required' },
        { status: 400 }
      )
    }

    if (!CONTRACT_ADDRESS) {
      return NextResponse.json({ error: 'Contract not configured' }, { status: 500 })
    }

    // 1. Verify the user's signature
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    })

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // 2. Check whether the address is already in the contract
    const alreadyIn = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: WAITLIST_ABI,
      functionName: 'isInWaitlist',
      args: [address as `0x${string}`],
    })

    if (alreadyIn) {
      // The user is already on-chain but might be missing from Redis
      // (e.g. they joined while Redis was unavailable, or used the file
      // backend that was later migrated). Backfill on the fly:
      // registerUser is idempotent — it skips users who already exist.
      const stats = await getUserStats(address)
      if (!stats.exists) {
        console.log(`[Waitlist] Backfilling missing referrals entry for ${address}`)
        await registerUser(address, referrer || null)
      }

      const total = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: WAITLIST_ABI,
        functionName: 'count',
      })
      const freshStats = await getUserStats(address)
      return NextResponse.json({
        success: false,
        alreadyIn: true,
        total: Number(total),
        stats: freshStats,
      })
    }

    // 3. Relayer pays the gas — user does not
    const walletClient = getWalletClient()

    const txHash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: WAITLIST_ABI,
      functionName: 'addToWaitlist',
      args: [address as `0x${string}`],
    })

    console.log(`[Waitlist] Tx sent: ${txHash}`)

    // 4. Wait for confirmation (Base is fast, ~2s blocks)
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      timeout: 30_000,
    })

    if (receipt.status !== 'success') {
      throw new Error('Transaction reverted on-chain')
    }

    // 5. Register the user in the referral system (off-chain)
    await registerUser(address, referrer || null, txHash)

    // 6. Refresh the counter and the user's stats
    const newTotal = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: WAITLIST_ABI,
      functionName: 'count',
    })

    const stats = await getUserStats(address)

    console.log(`[Waitlist] Added ${address} | total: ${newTotal} | ref: ${referrer || 'none'}`)

    return NextResponse.json({
      success: true,
      txHash,
      total: Number(newTotal),
      stats,
    })
  } catch (err: unknown) {
    const error = err as { message?: string }
    console.error('[Waitlist POST] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Server error' },
      { status: 500 }
    )
  }
}
