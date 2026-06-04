// zexus-governance/components/Whitepaper.js
//
// Single-page whitepaper for zexus.xyz/whitepaper. Content lives in the SECTIONS
// data array below - edit there to keep the doc in sync with the protocol. Numbers
// mirror the live zexus-app codebase (epochs, staking, governance, predict, etc.).

'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ── Content ───────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'economy',
    title: 'ZXP Economy & Epochs',
    blocks: [
      {
        t: 'p',
        text: 'ZXP is the off-chain governance and reputation credit that powers Zexus. It is not an inflationary point system - ZXP is designed to be used, not hoarded. Unused balances of inactive participants decay at the end of each epoch, while active governors keep everything they earn.',
      },
      { t: 'h3', text: 'Epochs' },
      {
        t: 'p',
        text: 'The protocol runs in 6-month epochs. A daily maintenance job (03:00 UTC) recalculates the staking APY and, when an epoch closes, applies a tiered retention burn before automatically advancing to the next epoch.',
      },
      { t: 'h3', text: 'Tiered retention (anti-inflation)' },
      {
        t: 'p',
        text: 'At epoch end, each wallet’s free (unstaked) ZXP is retained based on the activity it showed during the epoch:',
      },
      {
        t: 'table',
        head: ['Activity during epoch', 'ZXP retained', 'Effect'],
        rows: [
          ['Staking or 3+ governance votes', '100%', 'No loss'],
          ['1-2 governance votes', '90%', '-10%'],
          ['0 votes and not staking', '70%', '-30%'],
        ],
      },
      {
        t: 'p',
        text: 'Staked ZXP is never decayed - staking is itself proof of commitment. The burned amount is recorded on each profile’s lifetime ZXP burned counter, which drives Burn Ranks.',
      },
      { t: 'h3', text: 'Dynamic APY' },
      {
        t: 'p',
        text: 'Staking rewards are paid in ZXP at a dynamic APY with an 8% hard ceiling. The base rate is recomputed daily from the median participant balance so rewards stay sustainable as the network grows. At the start of every epoch the rate resets to the 8% ceiling.',
      },
      {
        t: 'callout',
        text: 'Effective APY = base APY (≤ 8%) + active Community Burn Pool bonus.',
      },
    ],
  },
  {
    id: 'staking',
    title: 'Staking',
    blocks: [
      {
        t: 'p',
        text: 'Staking ZXP does two things: it earns rewards (APY) and it unlocks governance power. Both scale with how long a position has been staked, rewarding long-term alignment over mercenary capital.',
      },
      { t: 'h3', text: 'Age multipliers' },
      {
        t: 'table',
        head: ['Position age', 'APY multiplier', 'Vote-power multiplier'],
        rows: [
          ['< 30 days', '1.00×', '1.00×'],
          ['≥ 30 days', '1.05×', '1.20×'],
          ['≥ 90 days', '1.10×', '1.50×'],
          ['≥ 180 days', '1.20×', '1.80×'],
          ['≥ 365 days', '1.35×', '2.20×'],
        ],
      },
      {
        t: 'p',
        text: 'Rewards accrue continuously (fractional drip, down to 4 decimals) so even small positions visibly earn over time. Unstaking is subject to a cooldown window before the principal becomes withdrawable.',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance - Power Vote',
    blocks: [
      {
        t: 'p',
        text: 'Zexus governance is built around milestone confirmation. Projects post claims (e.g. “shipped X”, “hit milestone Y”); the community confirms or disputes them, and the weighted outcome moves the project’s Trust Score.',
      },
      { t: 'h3', text: 'Vote weight formula' },
      { t: 'formula', code: 'vote_weight = √(staked ZXP) × time_bonus' },
      {
        t: 'p',
        text: 'The square root deliberately softens whale dominance - doubling your stake does not double your vote. time_bonus follows the staking age multipliers (1.0× → 2.2× from <30d to ≥365d), so conviction over time is rewarded.',
      },
      {
        t: 'p',
        text: 'To prevent gaming, the time bonus uses the amount-weighted average age across all of a wallet’s positions - you cannot anchor one tiny old position to boost a large fresh stake.',
      },
      { t: 'h3', text: 'Eligibility & cost' },
      {
        t: 'table',
        head: ['Requirement', 'Value'],
        rows: [
          ['Minimum staked to vote', '10 ZXP'],
          ['Minimum account age', '48 hours'],
          ['Cost per vote', '1 ZXP (burned)'],
          ['Changing an existing vote', 'Free'],
        ],
      },
      {
        t: 'p',
        text: 'Votes are confirm or dispute. Voting posts auto-finalize at their deadline, and the weighted result feeds directly into the project’s Trust Score.',
      },
    ],
  },
  {
    id: 'trust-score',
    title: 'Trust Score',
    blocks: [
      {
        t: 'p',
        text: 'Every project carries a Trust Score (capped at 110) - a living reputation number rather than a static rating. It moves through the governance cycle:',
      },
      {
        t: 'formula',
        code: 'milestone claim → community vote → Trust Score update → public timeline',
      },
      {
        t: 'p',
        text: 'Confirmed milestones raise the score; disputed or failed ones lower it. Each project exposes a Trust Timeline so the full history of movements is auditable.',
      },
    ],
  },
  {
    id: 'predict',
    title: 'Predict Market',
    blocks: [
      {
        t: 'p',
        text: 'Predict Markets let the community put ZXP behind their convictions about project outcomes. They are parimutuel (pooled) markets:',
      },
      {
        t: 'list',
        items: [
          'Each market has two outcomes, A and B, each with its own pool.',
          'One bet per wallet per market, minimum 1 ZXP, paid from your free balance.',
          'On resolution a 2% platform fee is burned; the remaining prize pool is split among winners pro-rata to their share of the winning pool.',
        ],
      },
      {
        t: 'formula',
        code: 'payout = (your_bet / winning_pool) × (total_pool - 2% fee)',
      },
      {
        t: 'p',
        text: 'Markets have a betting deadline; after it no new bets are accepted, and the outcome is resolved by governance.',
      },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency Call',
    blocks: [
      {
        t: 'p',
        text: 'An Emergency Call is a community-funded alarm against a project - used to flag serious issues (rug risk, broken promises, security concerns) and rally a quorum.',
      },
      {
        t: 'table',
        head: ['Parameter', 'Value'],
        rows: [
          ['Collection window', '48 hours'],
          ['Contribution range', '5-60 ZXP per wallet (base)'],
          ['Pool goal', '300 ZXP (base)'],
          ['Cooldown per project', '60 days'],
          ['Cooldown per initiator', '14 days'],
        ],
      },
      {
        t: 'p',
        text: 'All amounts scale with an admin-controlled factor, so thresholds can be tuned as ZXP velocity changes without a code change. Watchers of the targeted project are notified (e.g. via Telegram) when a call opens.',
      },
    ],
  },
  {
    id: 'burn-pool',
    title: 'Community Burn Pool',
    blocks: [
      {
        t: 'p',
        text: 'The Burn Pool is a shared, monthly co-op goal. Every ZXP burned through normal activity (votes, emergency calls, predict fees) adds to one collective pool. When the community crosses a tier, everyone receives a staking-APY bonus for the rest of the month.',
      },
      {
        t: 'table',
        head: ['Tier', 'Goal (ZXP burned this month)', 'Reward (APY for everyone)'],
        rows: [
          ['Tier I', '500', '+1% APY'],
          ['Tier II', '1,500', '+2% APY'],
          ['Tier III', '4,500', '+3% APY'],
          ['Tier IV', '9,000', '+5% APY'],
        ],
      },
      {
        t: 'p',
        text: 'The pool resets at the start of each calendar month. Epoch-end decay burns are excluded, so the pool reflects genuine activity. This turns burning ZXP from a purely individual cost into a positive-sum, cooperative game.',
      },
    ],
  },
  {
    id: 'seasons',
    title: 'Seasons',
    blocks: [
      {
        t: 'p',
        text: 'Each calendar month is a Season. Season XP is the amount of ZXP a participant earns during the month - from rewards, daily check-ins, governance verdicts, referrals, and onboarding. It is computed live from the transaction ledger, and the top 50 are ranked publicly.',
      },
      {
        t: 'p',
        text: 'Seasons give newcomers a fair, recurring shot at recognition: the board zeroes out every month, so standing reflects recent contribution rather than lifetime totals.',
      },
    ],
  },
  {
    id: 'burn-ranks',
    title: 'Burn Ranks',
    blocks: [
      {
        t: 'p',
        text: 'A wallet’s lifetime ZXP burned earns a permanent rank badge, displayed on the profile. Burning is the truest signal of conviction, so it is what ranks reflect:',
      },
      {
        t: 'table',
        head: ['Rank', 'Lifetime ZXP burned'],
        rows: [
          ['Contributor', '100+'],
          ['Believer', '500+'],
          ['Whale', '2,000+'],
          ['Legend', '10,000+'],
        ],
      },
    ],
  },
  {
    id: 'earning',
    title: 'Earning ZXP',
    blocks: [
      {
        t: 'p',
        text: 'ZXP enters circulation through participation, not purchase:',
      },
      {
        t: 'table',
        head: ['Action', 'Reward'],
        rows: [
          ['Connect wallet (onboarding)', '3 ZXP'],
          ['First comment (onboarding)', '2 ZXP'],
          ['First reaction (onboarding)', '1 ZXP'],
          ['Add to watchlist (onboarding)', '1 ZXP'],
          ['Daily check-in', '1 ZXP / day'],
          ['Successful referral', '5 ZXP'],
          ['Staking rewards', 'Dynamic APY (≤ 8% + Burn Pool bonus)'],
          ['Predict win', 'Pro-rata share of the prize pool'],
        ],
      },
      {
        t: 'p',
        text: 'Onboarding rewards (7 ZXP total) are claimable within the first 7 days after a wallet registers.',
      },
    ],
  },
  {
    id: 'platform',
    title: 'Platform & Security',
    blocks: [
      {
        t: 'list',
        items: [
          'SIWE wallet authentication - actions are signed with the wallet; the server derives the acting address from the verified session, never from request bodies.',
          'Telegram notifications - opt-in alerts for ZXP earned, Emergency Calls, Predict wins, and watched-project activity.',
          'Invite-code gating - onboarding is gated behind invite codes during the early access phase.',
          'Achievements & badges, daily check-in streaks, and referrals drive retention and reward sustained participation.',
        ],
      },
    ],
  },
]

// ── Block renderer ──────────────────────────────────────────────────────────

function Block({ block }) {
  switch (block.t) {
    case 'h3':
      return (
        <h3 className="text-lg font-bold tracking-tight text-[#E7C694] mt-10 mb-3">
          {block.text}
        </h3>
      )
    case 'p':
      return (
        <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light mb-5">
          {block.text}
        </p>
      )
    case 'list':
      return (
        <ul className="space-y-3 mb-5">
          {block.items.map((it, i) => (
            <li
              key={i}
              className="relative pl-5 text-sm md:text-base text-gray-400 leading-relaxed font-light"
            >
              <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-[#E7C694]/70" />
              {it}
            </li>
          ))}
        </ul>
      )
    case 'formula':
      return (
        <div className="my-6 px-5 py-4 rounded-xl border border-[#E7C694]/15 bg-[#E7C694]/[0.04] overflow-x-auto">
          <code className="font-mono text-xs md:text-sm text-[#E7C694] tracking-tight whitespace-nowrap">
            {block.code}
          </code>
        </div>
      )
    case 'callout':
      return (
        <div className="my-6 px-5 py-4 rounded-xl border-l-2 border-[#E7C694]/50 bg-white/[0.02]">
          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light italic">
            {block.text}
          </p>
        </div>
      )
    case 'table':
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03]">
                {block.head.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#E7C694] border-b border-white/[0.06]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-3 text-xs md:text-sm font-light ${
                        ci === 0 ? 'text-gray-200 font-normal' : 'text-gray-400'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return null
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Whitepaper() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const observer = useRef(null)

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )
    const obs = observer.current
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <main className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#E7C694] selection:text-black overflow-x-hidden">
      {/* ambient backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0A0A0A] via-[#050505] to-[#050505]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-0 w-[600px] h-[400px] bg-[#E7C694]/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* header */}
      <header className="relative z-10 px-6 pt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-x-3 group">
            <Image
              src="/logo.png"
              alt="Zexus Logo"
              width={32}
              height={32}
              className="h-8 w-auto object-contain transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:drop-shadow-[0_0_12px_rgba(231,198,148,0.7)]"
            />
            <div className="flex flex-col">
              <span className="text-base font-black text-white tracking-tighter leading-none transition-colors group-hover:text-[#E7C694]">
                ZEXUS
              </span>
              <span className="text-[9px] font-mono text-[#E7C694] tracking-[0.3em] uppercase opacity-80">
                Governance
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 hover:text-[#E7C694] transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* title */}
      <div className="relative z-10 px-6 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[#E7C694] font-mono tracking-[0.4em] uppercase text-[10px] mb-4 opacity-60">
            Whitepaper
          </h2>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            The Trust Layer for Web3
          </h1>
          <p className="text-base text-gray-400 leading-relaxed font-light max-w-2xl">
            Zexus is a social governance protocol where the community tracks
            onchain projects, votes on milestones, and earns ZXP. Every project
            gets a Trust Score based on real activity, not marketing.
          </p>
        </div>
      </div>

      {/* body: TOC + content */}
      <div className="relative z-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto flex gap-12">
          {/* sticky TOC */}
          <nav className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-12">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600 mb-5">
                On this page
              </p>
              <ul className="space-y-2.5 border-l border-white/[0.06]">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`block -ml-px pl-4 border-l text-[11px] font-medium tracking-wide transition-all ${
                        activeId === s.id
                          ? 'border-[#E7C694] text-[#E7C694]'
                          : 'border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* content */}
          <article className="min-w-0 flex-1 max-w-3xl">
            {SECTIONS.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-24 mb-16 pb-16 border-b border-white/[0.04] last:border-0"
              >
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6">
                  {s.title}
                </h2>
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            ))}

            <p className="text-[10px] font-mono text-gray-600 tracking-wide uppercase">
              Reflects protocol mechanics as of June 2026 · Alpha v1.0
            </p>
          </article>
        </div>
      </div>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[9px] tracking-[0.4em] text-gray-600 uppercase">
            © 2026 Zexus Protocol
          </p>
          <Link
            href="/"
            className="text-[9px] tracking-[0.3em] text-gray-500 uppercase font-bold hover:text-[#E7C694] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </footer>
    </main>
  )
}
