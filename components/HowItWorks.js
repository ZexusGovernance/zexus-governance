'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Declare',
    body: 'Projects publish their roadmap and milestones on-chain. Public, timestamped, immutable.',
    icon: 'M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5',
  },
  {
    num: '02',
    title: 'Verify',
    body: 'The community votes on whether promises are kept. Sybil-resistant and reputation-weighted.',
    icon: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z',
  },
  {
    num: '03',
    title: 'Trust Score',
    body: 'Every outcome becomes a permanent, on-chain Trust Score. Accountability you can actually see.',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  },
]

const labelCls =
  'text-[9px] font-mono tracking-[0.3em] uppercase text-[#E7C694]/60'

// ─── animated trust-score ring + count-up ──────────────────────────────────
function ScoreRing() {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const dur = 1100
    const target = 87
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setV(target * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className={labelCls}>Trust Score</span>
      <div className="relative w-36 h-36 mt-4">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90 overflow-visible">
          <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
          <circle
            cx="60" cy="60" r="46" fill="none" stroke="#E7C694" strokeWidth="7"
            strokeLinecap="round" pathLength="100" strokeDasharray="100"
            strokeDashoffset={100 - v}
            style={{ filter: 'drop-shadow(0 0 5px rgba(231,198,148,0.5))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-[#E7C694] tracking-tighter">{Math.round(v)}</span>
          <span className="text-[8px] font-mono text-gray-600 tracking-widest">/ 100</span>
        </div>
      </div>
      <span className="mt-4 text-[9px] font-mono text-gray-500 tracking-widest uppercase">
        Verified on Base
      </span>
    </div>
  )
}

// ─── the visual panel that swaps per active step ────────────────────────────
function Visual({ active }) {
  if (active === 0) {
    const items = [
      { m: 'Alpha Testnet Launch', status: 'in' },
      { m: 'Genesis Program', status: 'in' },
      { m: 'Grant Strategy', status: 'planned' },
    ]
    return (
      <div className="w-full">
        <span className={labelCls}>Roadmap · On-chain</span>
        <div className="mt-5 space-y-2.5">
          {items.map((it, idx) => (
            <div
              key={it.m}
              className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              style={{ animation: `fadeUp 0.5s ease-out ${idx * 0.12}s both` }}
            >
              {it.status === 'in' ? (
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[#E7C694] shadow-[0_0_6px_1px_rgba(231,198,148,0.5)]" />
              ) : (
                <span className="w-2 h-2 rounded-full flex-shrink-0 border border-white/25" />
              )}
              <span className="flex-1 text-sm text-gray-200 truncate">{it.m}</span>
              {it.status === 'in' ? (
                <span className="flex items-center gap-1 text-[8px] font-mono tracking-[0.15em] uppercase text-[#E7C694]/70">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  In Progress
                </span>
              ) : (
                <span className="text-[8px] font-mono tracking-[0.15em] uppercase text-gray-600">
                  Planned
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (active === 1) {
    return (
      <div className="w-full rounded-xl border border-white/[0.07] bg-[#0A0A0A] p-4">
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full flex-shrink-0 border border-white/10 bg-gradient-to-br from-[#E7C694] to-[#5865F2]" />
            <div>
              <p className="text-xs font-bold text-white leading-none">Aerodrome</p>
              <p className="text-[8px] font-mono text-gray-600 mt-1 tracking-wide">DEX / AMM</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[8px] font-mono tracking-[0.15em] uppercase px-2 py-1 rounded-full border border-[#E7C694]/30 text-[#E7C694]/80">
            <span className="w-1 h-1 rounded-full bg-[#E7C694] animate-pulse" />
            Voting
          </span>
        </div>

        <p className="text-sm font-bold text-white mb-1">Community vote: v2 fee structure</p>
        <p className="text-[11px] text-gray-500 mb-4">Did the team ship the promised milestone?</p>

        {/* split bar */}
        <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.05]">
          <div
            className="h-full origin-left bg-gradient-to-r from-emerald-500/70 to-emerald-400/80"
            style={{ width: '71%', animation: 'scaleXIn 0.8s cubic-bezier(0.4,0,0.2,1) both' }}
          />
          <div className="h-full bg-gradient-to-r from-red-500/60 to-red-400/70" style={{ width: '29%' }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] font-mono">
          <span className="text-emerald-400/90">71% Yes</span>
          <span className="text-gray-600">53 voters · weight 1</span>
          <span className="text-red-400/70">29% No</span>
        </div>

        {/* outcome */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400/80">
            +2 pts Trust Score
          </span>
          <span className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">Passed</span>
        </div>
      </div>
    )
  }

  return <ScoreRing />
}

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 3500)
    return () => clearInterval(id)
  }, [paused])

  return (
    <section
      id="about"
      className="relative z-10 pt-20 pb-20 px-6 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#E7C694]/[0.03] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* heading */}
        <div className="text-center mb-16">
          <h2 className="text-[#E7C694] font-mono tracking-[0.4em] uppercase text-[10px] mb-5 opacity-60">
            The Protocol
          </h2>
          <p className="text-4xl md:text-6xl font-black tracking-tighter">
            From promise to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#E7C694] via-[#FFFEEF] to-[#A68B5B]">
              proof
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* LEFT — interactive steps */}
          <div className="flex flex-col gap-2">
            {STEPS.map((s, i) => {
              const on = active === i
              return (
                <button
                  key={s.num}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group relative text-left flex items-start gap-4 rounded-xl border p-5 transition-all duration-400 ${
                    on
                      ? 'border-[#E7C694]/30 bg-[#E7C694]/[0.04]'
                      : 'border-white/[0.05] bg-transparent hover:border-white/10'
                  }`}
                >
                  {/* active accent bar */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] bg-[#E7C694] rounded-full transition-all duration-400 ${
                      on ? 'h-8 opacity-100' : 'h-0 opacity-0'
                    }`}
                  />
                  {/* icon */}
                  <div
                    className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center border transition-all duration-400 ${
                      on
                        ? 'border-[#E7C694]/50 bg-[#E7C694]/10 shadow-[0_0_20px_-6px_rgba(231,198,148,0.6)]'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-colors duration-400 ${on ? 'text-[#E7C694]' : 'text-gray-500'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  {/* text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[9px] font-mono text-gray-600 tracking-widest">{s.num}</span>
                      <h3 className={`text-base font-bold tracking-tight transition-colors duration-400 ${on ? 'text-[#E7C694]' : 'text-white/70'}`}>
                        {s.title}
                      </h3>
                    </div>
                    <p
                      className={`text-sm font-light leading-relaxed overflow-hidden transition-all duration-500 ${
                        on ? 'max-h-24 opacity-100 text-gray-400' : 'max-h-0 opacity-0 md:max-h-24 md:opacity-60 text-gray-600'
                      }`}
                    >
                      {s.body}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* RIGHT — dynamic visual */}
          <div className="relative min-h-[260px] rounded-2xl border border-white/[0.07] bg-[#080808]/60 backdrop-blur-sm p-7 flex items-center overflow-hidden">
            {/* faint progress dots */}
            <div className="absolute top-5 right-6 flex gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-400 ${active === i ? 'w-5 bg-[#E7C694]' : 'w-1.5 bg-white/15'}`}
                />
              ))}
            </div>
            <div key={active} className="w-full" style={{ animation: 'fadeUp 0.45s ease-out both' }}>
              <Visual active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
