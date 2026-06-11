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
    id: 'vision',
    title: 'Vision',
    blocks: [
      {
        t: 'p',
        text: 'Web3 runs on promises. Projects ship roadmaps, hype launches, and announce milestones - but the people deciding whether to trust them have almost nothing verifiable to go on. Reputation is built from marketing and follower counts, not from delivery. The result is predictable: abandoned projects, broken promises, and communities that find out too late.',
      },
      {
        t: 'p',
        text: 'Zexus is an accountability layer for onchain projects. Every project carries a Trust Score built from real, auditable signals and adjusted by community votes on the milestones it actually delivers. Around that sits a social feed, watchlists, alerts, and prediction markets - so tracking a project, holding it accountable, and acting on what you learn all happen in one place.',
      },
      {
        t: 'p',
        text: 'ZXP, the platform points system, aligns everyone around honest participation: you earn it by contributing, stake it to weight your governance voice, and burn it as skin in the game when you vote or raise an alarm. Reputation on Zexus has to be earned and spent - it cannot be bought.',
      },
    ],
  },
  {
    id: 'zxp-points',
    title: 'ZXP - Points, Not a Token',
    blocks: [
      {
        t: 'callout',
        text: 'ZXP is a points system, not a cryptocurrency. It is not a token. It has no monetary value, is not for sale, and cannot be bought, traded, withdrawn, or exchanged for money or crypto. ZXP exists only inside Zexus as a measure of reputation and governance weight.',
      },
      { t: 'h3', text: 'Off-chain by design' },
      {
        t: 'p',
        text: 'ZXP balances live in the Zexus database, not on a blockchain. There is no ZXP contract address, no liquidity pool, and no market. "Staking" and "burning" ZXP are internal accounting actions - they move points between states in our system; they are not onchain transactions and they never touch your wallet balance.',
      },
      { t: 'h3', text: 'What your wallet is for' },
      {
        t: 'p',
        text: 'Your wallet is used only for identity: you sign in with it (Sign-In With Ethereum) so your reputation is tied to one account. Signing in costs nothing and never moves funds. ZXP itself stays entirely off-chain.',
      },
      { t: 'h3', text: 'A balanced economy: faucets and sinks' },
      {
        t: 'p',
        text: 'ZXP is designed to circulate, not pile up. It enters through participation (faucets) and leaves through use and inactivity (sinks), which keeps the system from inflating into meaninglessness.',
      },
      {
        t: 'table',
        head: ['Faucets (ZXP in)', 'Sinks (ZXP out)'],
        rows: [
          ['Onboarding & daily check-ins', 'Casting governance votes (burned)'],
          ['Staking rewards (APY)', 'Predict market fee (2%, burned)'],
          ['Referrals', 'Emergency Call contributions'],
          ['Predict wins', 'End-of-epoch decay on inactivity'],
        ],
      },
      {
        t: 'callout',
        text: 'On the future: the roadmap mentions a future onchain "Points Engine". To be explicit - today\'s ZXP points are not that system and grant no claim, guarantee, airdrop, or entitlement to any future token. Anything onchain, if it ever ships, would be announced separately with its own terms.',
      },
    ],
  },
  {
    id: 'epochs',
    title: 'Epochs & Anti-Inflation',
    blocks: [
      {
        t: 'p',
        text: 'The protocol runs in 6-month epochs. A daily maintenance job (03:00 UTC) recalculates the staking APY and, when an epoch closes, applies a tiered retention burn before automatically advancing to the next epoch.',
      },
      { t: 'h3', text: 'Tiered retention' },
      {
        t: 'p',
        text: 'At epoch end, each wallet\'s free (unstaked) ZXP is retained based on the activity it showed during the epoch. Hoarding without participating costs you; staying active costs you nothing.',
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
        text: 'Staked ZXP is never decayed - staking is itself proof of commitment. The burned amount is added to each profile\'s lifetime ZXP burned counter, which drives Burn Ranks.',
      },
      { t: 'h3', text: 'Dynamic APY' },
      {
        t: 'p',
        text: 'Staking rewards are paid in ZXP at a dynamic APY with an 8% hard ceiling. The base rate is recomputed daily from the median participant balance so rewards stay sustainable as the network grows. At the start of every epoch the rate resets to the 8% ceiling.',
      },
      {
        t: 'callout',
        text: 'Effective APY = base APY (up to 8%) + active Community Burn Pool bonus.',
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
          ['< 30 days', '1.00x', '1.00x'],
          ['>= 30 days', '1.05x', '1.20x'],
          ['>= 90 days', '1.10x', '1.50x'],
          ['>= 180 days', '1.20x', '1.80x'],
          ['>= 365 days', '1.35x', '2.20x'],
        ],
      },
      {
        t: 'p',
        text: 'Rewards accrue continuously (fractional drip, down to 4 decimals) so even small positions visibly earn over time. Unstaking is subject to a cooldown window before the principal becomes available again.',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance - Power Vote',
    blocks: [
      {
        t: 'p',
        text: 'Zexus governance is built around milestone confirmation. Projects post claims (e.g. "shipped X", "hit milestone Y"); the community confirms or disputes them, and the weighted outcome moves the project\'s Trust Score. Governance today is scoped to project accountability - it is not protocol treasury or parameter voting.',
      },
      { t: 'h3', text: 'Vote weight formula' },
      { t: 'formula', code: 'vote_weight = sqrt(staked ZXP) x time_bonus' },
      {
        t: 'p',
        text: 'The square root deliberately softens whale dominance - doubling your stake does not double your vote. time_bonus follows the staking age multipliers (1.0x up to 2.2x from <30d to >=365d), so conviction over time is rewarded.',
      },
      {
        t: 'p',
        text: 'To prevent gaming, the time bonus uses the amount-weighted average age across all of a wallet\'s positions - you cannot anchor one tiny old position to boost a large fresh stake.',
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
        text: 'Votes are confirm or dispute. Voting posts auto-finalize at their deadline, and the weighted result feeds directly into the project\'s Trust Score.',
      },
    ],
  },
  {
    id: 'trust-score',
    title: 'Trust Score',
    blocks: [
      {
        t: 'p',
        text: 'Every project carries a Trust Score from 0 to 110 - a living reputation number rather than a static rating. It has two parts: a baseline built from verifiable signals, and an ongoing adjustment driven by community milestone votes.',
      },
      { t: 'h3', text: 'Baseline: six weighted categories' },
      {
        t: 'p',
        text: 'The baseline scores transparency and traction across six categories, each capped so no single dimension can dominate. GitHub activity is pulled live from the GitHub API; the rest is evidence-based and auditable.',
      },
      {
        t: 'table',
        head: ['Category', 'Max', 'Signals'],
        rows: [
          ['Social Presence', '25', 'Twitter followers, Discord members, GitHub commits (30d)'],
          ['Product & Tech', '25', 'Product stage (testnet/mainnet), whitepaper, audit'],
          ['On-chain Activity', '20', 'Holder wallets, TVL'],
          ['Team & Backing', '15', 'Doxxed team, investors'],
          ['Track Record', '15', 'Contract age, partnerships'],
          ['Bonus Signals', '10', 'CEX listing, grants, media, hackathon wins, integrations'],
        ],
      },
      { t: 'h3', text: 'Ongoing: the community cycle' },
      {
        t: 'formula',
        code: 'milestone claim -> community vote (confirm / dispute) -> Trust Score update -> public timeline',
      },
      {
        t: 'p',
        text: 'Confirmed milestones raise the score; disputed or failed ones lower it. Every movement is recorded on the project\'s Trust Timeline, so the full history is auditable rather than a black box.',
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
        code: 'payout = (your_bet / winning_pool) x (total_pool - 2% fee)',
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
          ['Response window', '48 hours (closes early once the team responds)'],
          ['Community verdict vote', '48 hours, stake-weighted'],
          ['Cooldown per project', 'Outcome-based - 30d false alarm / 7d resolved / 0d unresolved'],
          ['Cooldown per initiator', '14 days after a false alarm'],
        ],
      },
      {
        t: 'p',
        text: 'When the pool is reached the call activates: the project\'s Trust Score is provisionally lowered as a visible "under review" flag, and the team has 48 hours to respond publicly - the window closing early the moment they do. The call then converts into a stake-weighted community verdict vote, and the result decides the outcome: Resolved (real but addressed - half the staked ZXP returned, Trust Score -10), Unresolved (real and neglected - stake returned with a bonus, Trust Score -20), or, with no quorum, a full refund and no penalty. A separate review can mark a baseless call a false alarm, burning the contributed ZXP. The provisional drop is reversed at resolution, so the net Trust Score change equals the final verdict.',
      },
      {
        t: 'p',
        text: 'No single party decides the outcome - not the project, not the Zexus team. The staked community adjudicates by vote; the manual review exists only as a last-resort backstop. All amounts scale with an admin-controlled factor, so thresholds can be tuned as ZXP activity changes without a code change. Watchers of the targeted project are notified in-app and via Telegram at each stage: opened, activated, responded, verdict open, and resolved.',
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
        text: 'The pool resets at the start of each calendar month. End-of-epoch decay burns are excluded, so the pool reflects genuine activity. This turns burning ZXP from a purely individual cost into a positive-sum, cooperative game.',
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
        text: 'A wallet\'s lifetime ZXP burned earns a permanent rank badge, displayed on the profile. Burning is the truest signal of conviction, so it is what ranks reflect:',
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
        text: 'ZXP enters circulation through participation, never purchase:',
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
          ['Staking rewards', 'Dynamic APY (up to 8% + Burn Pool bonus)'],
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
    id: 'sybil',
    title: 'Sybil Resistance & Anti-Abuse',
    blocks: [
      {
        t: 'p',
        text: 'Because reputation is the product, resisting fake accounts and farming matters more than almost anything else. Zexus layers several defenses:',
      },
      {
        t: 'list',
        items: [
          'No cash incentive: ZXP has no monetary value and cannot be sold, which removes the core reason to farm it at scale.',
          'Square-root vote weighting: splitting a stake across many wallets yields less total power than keeping it together, so Sybil swarms are penalized by design.',
          'Voting gates: a minimum of 10 ZXP staked plus a 48-hour account age is required before a wallet can vote.',
          'Skin in the game: each first-time vote burns 1 ZXP, so spamming votes has a real cost.',
          'Anti-anchoring: vote weight uses the amount-weighted average age of all positions, so an old dust position cannot juice a fresh whale stake.',
          'One-time, time-boxed onboarding: onboarding rewards pay once and only within the first 7 days; the daily check-in is capped at 1 ZXP per day.',
          'Invite-code gating during early access limits how fast new accounts can appear.',
        ],
      },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture & Security',
    blocks: [
      {
        t: 'p',
        text: 'Zexus is a web application, not a smart-contract protocol. The split between off-chain and onchain is intentional and explicit:',
      },
      {
        t: 'table',
        head: ['Layer', 'Where it lives'],
        rows: [
          ['ZXP points, staking, votes, posts, projects, Trust Scores', 'Off-chain (Supabase / Postgres)'],
          ['Wallet identity (Sign-In With Ethereum)', 'Base'],
          ['Waitlist contract', 'Base'],
        ],
      },
      { t: 'h3', text: 'Security' },
      {
        t: 'list',
        items: [
          'SIWE authentication: actions are signed with the wallet, and the server derives the acting address from the verified session - never from request bodies.',
          'Admin and write routes are guarded server-side.',
          'Telegram notifications: opt-in alerts for ZXP earned, Emergency Calls, Predict wins, and watched-project activity.',
          'Invite-code gating during the early access phase.',
        ],
      },
    ],
  },
  {
    id: 'test-phase',
    title: 'Test Phase Report',
    blocks: [
      {
        t: 'p',
        text: 'Ahead of any public launch, Zexus ran a five-day test phase (June 5-10, 2026) with a curated, invite-only cohort of external testers on Base Mainnet. The objective was simple: prove that every core mechanic - community verdict voting, staking and rewards, Predict markets, Emergency Calls, and Telegram notifications - works end-to-end with real users under real conditions.',
      },
      {
        t: 'callout',
        text: 'All primary mechanics passed. The first community-verdict vote and the first Predict market each opened, ran, and resolved on schedule with live participants - the protocol\'s full loop executed in production, not a demo.',
      },
      { t: 'h3', text: 'Participation' },
      {
        t: 'table',
        head: ['Metric', 'Result'],
        rows: [
          ['External testers', '8 (invite-only ZX access codes)'],
          ['Active wallets with recorded activity', '20 (including the admin wallet)'],
          ['Fake / batch wallets detected & excluded', '11'],
        ],
      },
      {
        t: 'p',
        text: 'Sybil defenses behaved exactly as designed. The 48-hour account gate, the stake-to-vote requirement, and batch-pattern detection isolated 11 throwaway wallets - including two clusters created seconds apart - which were excluded from every metric. No farmed account reached the voting threshold.',
      },
      { t: 'h3', text: 'Mechanics validated' },
      {
        t: 'table',
        head: ['Mechanic', 'Outcome'],
        rows: [
          ['Community verdict vote', 'Test-phase launch milestone submitted, voted, and resolved on schedule'],
          ['Predict market', '"Will Zexus reach 10 stakers by June 9?" - opened, bet on, resolved No (8 stakers)'],
          ['Emergency Call', 'Triggered under simulated conditions; full pool-to-verdict flow validated'],
          ['Staking & rewards', 'APY accrual and ZXP grants distributed correctly'],
          ['Telegram bot', 'Opt-in /start flow confirmed seamless by testers'],
        ],
      },
      { t: 'h3', text: 'Issues found and fixed' },
      {
        t: 'list',
        items: [
          'Right-sidebar scroll breaking after a watchlist interaction - fixed.',
          'Daily check-in button disappearing after day 2 - fixed.',
          'Comment flicker on submit - fixed.',
          'Staking page scroll on mobile - fixed.',
          'ZXP balance not refreshing after a Predict bet - fixed.',
        ],
      },
      {
        t: 'p',
        text: 'Early tester feedback averaged 7.5 / 10 overall (8.0 for UI, 7.3 for usability), with the Predict market singled out as a standout. Remaining open items - mobile polish, Telegram check-in reminders, and username display on profiles - are tracked for the public launch.',
      },
    ],
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    blocks: [
      { t: 'h3', text: 'Q2 - The Genesis & Alpha' },
      {
        t: 'list',
        items: [
          'Official announcement and waitlist open',
          'Genesis Program onboarding (10 founding projects)',
          'Alpha: Voting, Trust Score, MVP',
          'Sybil filter and reputation integration',
        ],
      },
      { t: 'h3', text: 'Q3 - Growth & Mainnet' },
      {
        t: 'list',
        items: [
          'Public mainnet launch (Base / Arbitrum)',
          'Zexus Points Engine (ZXP) full launch',
          'Genesis Tier: Wave 2 projects',
        ],
      },
      { t: 'h3', text: 'Q4 - Global Expansion' },
      {
        t: 'list',
        items: [
          'Advanced governance and DAO delegate tools',
          'Zexus Analytics API for launchpads',
          'Sleuth partnership: onchain detectives',
        ],
      },
    ],
  },
  {
    id: 'risks',
    title: 'Risks & Disclaimers',
    blocks: [
      {
        t: 'list',
        items: [
          'Alpha software: Zexus is in active development, provided "as is" without warranties. Features, parameters, and balances may change or be reset.',
          'ZXP has no monetary value: it is a points system, not a token or investment. Nothing in this document is financial, legal, or investment advice.',
          'No entitlement: holding ZXP grants no claim, airdrop, or right to any current or future onchain token.',
          'Trust Score is informational: it is a community and evidence-based signal, not an endorsement, guarantee, or recommendation. Always do your own research.',
          'Wallet responsibility: you are responsible for the security of your wallet and keys. Onchain transactions cannot be reversed.',
          'Jurisdiction: you are responsible for ensuring your use of Zexus complies with your local laws. See the Terms of Service.',
        ],
      },
    ],
  },
  {
    id: 'glossary',
    title: 'Glossary',
    blocks: [
      {
        t: 'table',
        head: ['Term', 'Meaning'],
        rows: [
          ['ZXP', 'Off-chain reputation and governance points. Not a token, no monetary value.'],
          ['Trust Score', 'A 0-110 project reputation number from verifiable signals plus community votes.'],
          ['Epoch', 'A 6-month cycle; ends with a tiered retention burn.'],
          ['Power Vote', 'A governance vote weighted by sqrt(stake) x time bonus.'],
          ['Burn', 'Permanently removing ZXP from a balance.'],
          ['Season', 'A monthly leaderboard of ZXP earned.'],
          ['Milestone', 'A project claim the community confirms or disputes.'],
          ['Emergency Call', 'A community-funded alarm raised against a project.'],
          ['SIWE', 'Sign-In With Ethereum - wallet-based login.'],
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
          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light">
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
            Back
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
            Zexus is a social accountability platform where the community tracks
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
              Reflects protocol mechanics as of June 2026 - Alpha v1.0
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
            Back to home
          </Link>
        </div>
      </footer>
    </main>
  )
}
