'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import HeroCanvas from '@/components/HeroCanvas'
import Header from '@/components/Header'
import WagmiProviderWrapper from '@/components/providers/wagmi-provider'
import WaitlistButton from '@/components/WaitlistButton'
import RecentJoins from '@/components/RecentJoins'
import HowItWorks from '@/components/HowItWorks'
import FAQ from '@/components/FAQ'
import ContactEmail from '@/components/ContactEmail'

const RoadmapItem = ({
  children,
  side = 'left',
  isActive,
  onHover,
  stepIndex,
}) => {
  return (
    <div
      onMouseEnter={() => onHover(stepIndex)}
      className={`relative flex flex-col md:flex-row items-start md:items-center group transition-all duration-500 cursor-default ${
        isActive ? 'opacity-100 scale-[1.02] blur-0' : 'opacity-15 blur-[2px]'
      }`}
    >
      {side === 'right' && <div className="flex-1 hidden md:block"></div>}
      <div
        className={`absolute left-[12px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full z-10 transition-all duration-500 ${
          isActive
            ? 'bg-[#FFFEEF] shadow-[0_0_25px_8px_rgba(231,198,148,0.5)] scale-150'
            : 'bg-white/20 scale-100'
        }`}
      ></div>
      <div
        className={`flex-1 pl-12 md:pl-0 ${side === 'left' ? 'md:text-right md:pr-20' : 'md:pl-20'}`}
      >
        {children}
      </div>
      {side === 'left' && <div className="flex-1 hidden md:block"></div>}
    </div>
  )
}

// ─── Inner page component (rendered inside the Wagmi provider) ──────────────

function HomeContent() {
  const [notification, setNotification] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [isInWaitlist, setIsInWaitlist] = useState(false)
  const [netLive, setNetLive] = useState(false)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [bolt, setBolt] = useState({ node: null, on: false })

  const stepRef0 = useRef(null)
  const stepRef1 = useRef(null)
  const stepRef2 = useRef(null)
  const stepsRefs = useMemo(() => [stepRef0, stepRef1, stepRef2], [])
  const netRef = useRef(null)
  const boltRefs = useRef([])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -35% 0px',
      threshold: [0.2, 0.5, 0.8],
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const stepAttr = entry.target.getAttribute('data-step')
          if (stepAttr !== null) {
            setActiveStep(parseInt(stepAttr))
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    stepsRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })
    return () => observer.disconnect()
  }, [stepsRefs])

  useEffect(() => {
    const el = netRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setNetLive(entry.isIntersecting),
      { rootMargin: '-10% 0px -10% 0px', threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])


  const handleStepHover = (index) => setActiveStep(index)

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 4000)
  }

  const socialLinks = {
    Twitter: 'https://x.com/ZexusGovernance',
    Discord: 'https://discord.gg/SDUZMRP35J',
    Telegram: 'https://t.me/+-BSQtI1uNNUwNTky',
    Docs: 'https://zexus-governance.gitbook.io/whitepaper',
    Privacy: 'https://zexus-governance.gitbook.io/whitepaper/privacy-policy',
    Terms: 'https://zexus-governance.gitbook.io/whitepaper/terms-of-service',
  }

  // ─── Social constellation: 7 channel nodes orbiting the Zexus App core ──────
  const ORBIT_R = 38 // % of container
  const orbitNodes = useMemo(() => {
    const items = [
      {
        name: 'Twitter',
        handle: '@ZexusGovernance',
        href: 'https://x.com/ZexusGovernance',
        path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z',
      },
      {
        name: 'Discord',
        handle: 'Community',
        href: 'https://discord.gg/SDUZMRP35J',
        path: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
      },
      {
        name: 'Telegram',
        handle: 'Announcements',
        href: 'https://t.me/+-BSQtI1uNNUwNTky',
        path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
      },
      {
        name: 'GitHub',
        handle: 'Open source',
        href: 'https://github.com/ZexusGovernance/zexus-governance',
        path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z',
      },
      {
        name: 'Farcaster',
        handle: '@zexusgovernance',
        href: 'https://farcaster.xyz/zexusgovernance',
        path: 'M11.97 1.12c-5.96 0-10.8 4.84-10.8 10.8s4.84 10.8 10.8 10.8 10.8-4.84 10.8-10.8-4.84-10.8-10.8-10.8zM8.1 7.2h7.8l.54 2.34H15v5.46h1.56v1.8H7.44v-1.8H9V9.54H7.56L8.1 7.2z',
      },
      {
        name: 'Paragraph',
        handle: 'Blog & articles',
        href: 'https://paragraph.com/@zexusgovernance',
        path: 'M4 5h13v2H4zM4 9h13v2H4zM4 13h9v2H4zM4 17h9v2H4zM19 5h1v14h-1z',
      },
      {
        name: 'Medium',
        handle: 'Articles soon',
        href: 'https://medium.com/@zexushub',
        path: 'M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z',
      },
    ]
    const n = items.length
    return items.map((it, i) => {
      const ang = (-90 + i * (360 / n)) * (Math.PI / 180)
      const x = 50 + ORBIT_R * Math.cos(ang)
      const y = 50 + ORBIT_R * Math.sin(ang)
      const dx = x - 50
      const dy = y - 50
      const len = Math.hypot(dx, dy)
      return { ...it, x, y, dx, dy, px: -dy / len, py: dx / len }
    })
  }, [])

  // a few subtle twinkles (deterministic → no hydration mismatch)
  const twinkles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const r = (seed) => {
          const s = Math.sin((i + 1) * seed) * 43758.5453
          return s - Math.floor(s)
        }
        return {
          x: 8 + r(12.9898) * 84,
          y: 8 + r(78.233) * 84,
          delay: r(3.71) * 6,
          dur: 3.5 + r(5.13) * 3,
          size: 1.5 + r(9.37) * 1.5,
        }
      }),
    []
  )

  // live lightning: morph the bolt path each frame (~60fps) for a smooth crackle
  useEffect(() => {
    if (bolt.node === null) return
    const node = orbitNodes[bolt.node]
    let raf
    const seg = 10
    const loop = () => {
      const time = performance.now()
      let d = 'M50,50'
      for (let k = 1; k < seg; k++) {
        const t = k / seg
        const bx = 50 + node.dx * t
        const by = 50 + node.dy * t
        const amp = 2.4 * Math.sin(t * Math.PI) // taper to 0 at both ends
        // two layered sine waves → organic, continuous wobble (no jumps)
        const wob =
          amp *
          (0.7 * Math.sin(time * 0.013 + k * 1.7) +
            0.3 * Math.sin(time * 0.031 + k * 3.1))
        d += ` L${(bx + node.px * wob).toFixed(2)},${(by + node.py * wob).toFixed(2)}`
      }
      d += ` L${node.x.toFixed(2)},${node.y.toFixed(2)}`
      boltRefs.current.forEach((p) => p && p.setAttribute('d', d))
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [bolt.node, orbitNodes])

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-[#E7C694] selection:text-black font-sans overflow-x-hidden">
      {/* Backgrounds */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative w-full h-full opacity-[0.35] blur-[1px] scale-105 -left-[5%] md:-left-[3%]">
          <HeroCanvas />
        </div>
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none bg-radial-gradient from-transparent via-[#050505]/70 to-[#050505]"></div>
      <div
        className="fixed inset-0 z-[2] opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Header */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-5xl">
        <div className="bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-full px-8 py-2 shadow-2xl transition-all hover:border-[#E7C694]/20">
          <Header />
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#1A1A1A]/90 backdrop-blur-xl border border-[#E7C694]/30 px-8 py-3 rounded-full shadow-[0_10px_40px_rgba(231,198,148,0.2)] text-[#E7C694] font-bold text-sm tracking-widest uppercase">
            {notification}
          </div>
        </div>
      )}

      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className={`relative z-10 flex min-h-screen flex-col items-center px-6 text-center transition-[justify-content,padding] duration-500 ${
          isInWaitlist
            ? 'justify-start pt-32 pb-16'
            : 'justify-center pt-16 pb-0'
        }`}
      >
        <div className="w-full max-w-[1400px]">
          <h1 className="text-6xl sm:text-8xl md:text-[110px] font-black tracking-tighter mb-8 leading-[0.85] text-white">
            Verify, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#E7C694] via-[#FFFEEF] to-[#A68B5B] drop-shadow-[0_5px_15px_rgba(231,198,148,0.2)]">
              Don't Trust.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light mb-16 opacity-70">
            The first accountability hub where project roadmaps meet on-chain
            transparency. Protection for communities, power for builders.
          </p>

          {/* ── Waitlist button / dashboard (primary) ── */}
          <div className="relative z-[20] flex flex-col items-center group/btn-container">
            <WaitlistButton
              variant="primary"
              onNotification={showNotification}
              onSuccessStateChange={setIsInWaitlist}
            />

            <div className="absolute -bottom-10 w-full h-20 bg-[#E7C694]/5 blur-[60px] rounded-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* ─── LIVE RECENT JOINS (social proof, near the CTA) ──────────────────── */}
      <RecentJoins />

      {/* ─── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center py-4">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#E7C694]/30 to-transparent" />
      </div>

      {/* ─── WHAT IS ZEXUS (interactive) ──────────────────────────────────────── */}
      <HowItWorks />

      {/* ─── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center py-8">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#E7C694]/30 to-transparent" />
      </div>

      {/* ─── ROADMAP ──────────────────────────────────────────────────────────── */}
      <section
        id="roadmap"
        className="relative z-10 pt-20 pb-20 px-6 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[#E7C694] font-mono tracking-[0.4em] uppercase text-[10px] mb-4 opacity-60 animate-pulse">
              Strategic Path
            </h2>
            <p className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-lg">
              Key Milestones 2026
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10 overflow-hidden">
              <div
                className="absolute top-0 w-full bg-gradient-to-b from-[#FFFEEF] via-[#E7C694] to-transparent transition-all duration-1000 ease-in-out"
                style={{
                  height:
                    activeStep === 0
                      ? '30%'
                      : activeStep === 1
                        ? '66%'
                        : '100%',
                }}
              ></div>
            </div>

            <div className="space-y-24 relative z-10">
              <div ref={stepRef0} data-step="0">
                <RoadmapItem
                  isActive={activeStep === 0}
                  side="left"
                  stepIndex={0}
                  onHover={handleStepHover}
                >
                  <div
                    className={`inline-block px-3 py-1 mb-4 rounded-full border transition-all duration-500 ${activeStep === 0 ? 'border-[#E7C694]/40 bg-[#E7C694]/10 text-[#E7C694]' : 'border-white/10 bg-white/5 text-white/10'} text-[8px] font-bold tracking-[0.3em] uppercase`}
                  >
                    Current Phase
                  </div>
                  <span
                    className={`block text-6xl md:text-8xl font-black transition-colors duration-500 select-none ${activeStep === 0 ? 'text-[#E7C694]/20' : 'text-white/5'}`}
                  >
                    Q2
                  </span>
                  <h3
                    className={`text-2xl md:text-3xl font-bold mt-[-1rem] md:mt-[-2rem] mb-4 tracking-tight transition-colors duration-500 ${activeStep === 0 ? 'text-[#E7C694]' : 'text-white/20'}`}
                  >
                    The Genesis & Alpha
                  </h3>
                  <ul
                    className={`space-y-3 font-light text-sm md:text-base transition-colors duration-500 ${activeStep === 0 ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    <li>• Official Announcement & Waitlist Open</li>
                    <li>• Genesis Program Onboarding (10 projects)</li>
                    <li>• Alpha Testnet: Voting, Trust Score, MVP</li>
                    <li>• Sybil Filter & Reputation Integration</li>
                  </ul>
                </RoadmapItem>
              </div>

              <div ref={stepRef1} data-step="1">
                <RoadmapItem
                  isActive={activeStep === 1}
                  side="right"
                  stepIndex={1}
                  onHover={handleStepHover}
                >
                  <span
                    className={`block text-6xl md:text-8xl font-black transition-colors duration-500 select-none ${activeStep === 1 ? 'text-white/10' : 'text-white/5'}`}
                  >
                    Q3
                  </span>
                  <h3
                    className={`text-2xl md:text-3xl font-bold mt-[-1rem] md:mt-[-2rem] mb-4 tracking-tight transition-colors duration-500 ${activeStep === 1 ? 'text-white' : 'text-white/20'}`}
                  >
                    Growth & Mainnet
                  </h3>
                  <ul
                    className={`space-y-3 font-light text-sm md:text-base transition-colors duration-500 ${activeStep === 1 ? 'text-gray-200' : 'text-gray-600'}`}
                  >
                    <li>• Public Mainnet Launch (Base/Arbitrum)</li>
                    <li>• Zexus Points Engine (ZXP) Full Launch</li>
                    <li>• Beta Genesis Tier: Wave 2 Projects</li>
                  </ul>
                </RoadmapItem>
              </div>

              <div ref={stepRef2} data-step="2">
                <RoadmapItem
                  isActive={activeStep === 2}
                  side="left"
                  stepIndex={2}
                  onHover={handleStepHover}
                >
                  <span
                    className={`block text-6xl md:text-8xl font-black transition-colors duration-500 select-none ${activeStep === 2 ? 'text-white/10' : 'text-white/5'}`}
                  >
                    Q4
                  </span>
                  <h3
                    className={`text-2xl md:text-3xl font-bold mt-[-1rem] md:mt-[-2rem] mb-4 tracking-tight transition-colors duration-500 ${activeStep === 2 ? 'text-white' : 'text-white/20'}`}
                  >
                    Global Expansion
                  </h3>
                  <ul
                    className={`space-y-3 font-light text-sm md:text-base transition-colors duration-500 ${activeStep === 2 ? 'text-gray-200' : 'text-gray-600'}`}
                  >
                    <li>• Advanced Governance & DAO Delegate Tools</li>
                    <li>• Zexus Analytics API for Launchpads</li>
                    <li>• Sleuth Partnership: On-chain Detectives</li>
                  </ul>
                </RoadmapItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center py-4">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#E7C694]/30 to-transparent" />
      </div>

      {/* ─── FAQ ──────────────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ─── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center py-4">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#E7C694]/30 to-transparent" />
      </div>

      {/* ─── SOCIALS — orbital network ────────────────────────────────────────── */}
      <section id="socials" className="relative z-10 pt-20 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-4">
            <h2 className="text-[#E7C694] font-mono tracking-[0.4em] uppercase text-[10px] mb-3 opacity-60">
              The Network
            </h2>
            <p className="text-3xl md:text-4xl font-black tracking-tighter">Community</p>
          </div>

          {/* legend */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E7C694] animate-pulse shadow-[0_0_5px_2px_rgba(231,198,148,0.4)]" />
            <span className="text-[9px] font-mono text-gray-600 tracking-[0.25em] uppercase">
              {hoveredNode !== null ? orbitNodes[hoveredNode].handle : '1 core · 7 channels online'}
            </span>
          </div>

          {/* constellation */}
          <div
            ref={netRef}
            className="relative w-full max-w-[520px] mx-auto aspect-square select-none"
          >
            {/* orbit guide rings */}
            {[76, 56, 30].map((s, k) => (
              <div
                key={k}
                className={`absolute rounded-full border border-[#E7C694]/[0.07] transition-all duration-1000 ${netLive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{
                  width: `${s}%`, height: `${s}%`,
                  left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)',
                  transitionDelay: `${k * 120}ms`,
                }}
              />
            ))}

            {/* radar sweep */}
            <div
              className={`absolute rounded-full pointer-events-none transition-opacity duration-1000 ${netLive ? 'opacity-100' : 'opacity-0'}`}
              style={{
                width: '76%', height: '76%', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(231,198,148,0.10) 350deg, rgba(231,198,148,0.22) 360deg)',
                animation: 'netSpin 8s linear infinite',
                maskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
              }}
            />

            {/* connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {orbitNodes.map((node, i) => {
                const active = hoveredNode === i
                return (
                  <line
                    key={i}
                    x1="50" y1="50" x2={node.x} y2={node.y}
                    stroke={active ? 'rgba(231,198,148,0.7)' : 'rgba(231,198,148,0.18)'}
                    strokeWidth={active ? 1.4 : 0.6}
                    vectorEffect="non-scaling-stroke"
                    pathLength="1"
                    strokeDasharray="1"
                    style={{
                      strokeDashoffset: netLive ? 0 : 1,
                      transition: `stroke-dashoffset 0.9s ease ${i * 90}ms, stroke 0.3s, stroke-width 0.3s`,
                    }}
                  />
                )
              })}
            </svg>

            {/* lightning bolt: slowly grows core→node on hover, slowly retracts on leave */}
            {bolt.node !== null && (() => {
              const anim = {
                animation: bolt.on
                  ? 'boltGrow 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  : 'boltRetract 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              }
              const common = {
                fill: 'none',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                vectorEffect: 'non-scaling-stroke',
                pathLength: '1',
                strokeDasharray: '1',
              }
              return (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <filter id="boltGlow" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="1.6" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* wide soft glow */}
                  <path
                    ref={(el) => (boltRefs.current[0] = el)} d="M50,50"
                    stroke="rgba(231,198,148,0.5)" strokeWidth="4"
                    filter="url(#boltGlow)" style={{ ...common, ...anim }}
                  />
                  {/* mid gold body */}
                  <path
                    ref={(el) => (boltRefs.current[1] = el)} d="M50,50"
                    stroke="#E7C694" strokeWidth="2"
                    style={{ ...common, ...anim }}
                  />
                  {/* bright white-hot core */}
                  <path
                    ref={(el) => (boltRefs.current[2] = el)} d="M50,50"
                    stroke="#FFFEEF" strokeWidth="0.9"
                    style={{ ...common, ...anim }}
                    onAnimationEnd={() => { if (!bolt.on) setBolt({ node: null, on: false }) }}
                  />
                </svg>
              )
            })()}

            {/* subtle random twinkles — client-only (avoids SSR float-precision mismatch) */}
            {netLive &&
              twinkles.map((t, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-[#E7C694] pointer-events-none"
                  style={{
                    left: `${t.x}%`, top: `${t.y}%`,
                    width: `${t.size}px`, height: `${t.size}px`,
                    opacity: 0,
                    animation: `twinkle ${t.dur}s ease-in-out ${t.delay}s infinite`,
                  }}
                />
              ))}

            {/* radial darkening around the core so the background fades near the avatar */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] h-[58%] rounded-full pointer-events-none z-[15]"
              style={{
                background:
                  'radial-gradient(circle, #050505 28%, rgba(5,5,5,0.85) 50%, rgba(5,5,5,0.4) 68%, transparent 82%)',
              }}
            />

            {/* orbit nodes */}
            {orbitNodes.map((node, i) => {
              const active = hoveredNode === i
              return (
                <a
                  key={node.name}
                  href={node.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => { setHoveredNode(i); setBolt({ node: i, on: true }) }}
                  onMouseLeave={() => { setHoveredNode(null); setBolt(b => ({ ...b, on: false })) }}
                  className="group absolute z-20 flex flex-col items-center"
                  style={{
                    left: `${node.x}%`, top: `${node.y}%`,
                    transform: `translate(-50%, -50%) scale(${netLive ? 1 : 0})`,
                    opacity: netLive ? 1 : 0,
                    transition: `transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 80 + 300}ms, opacity 0.6s ${i * 80 + 300}ms`,
                  }}
                >
                  <div
                    className={`relative w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center border backdrop-blur-sm transition-all duration-300 ${
                      active
                        ? 'border-[#E7C694]/60 bg-[#E7C694]/[0.12] scale-110 shadow-[0_0_24px_-2px_rgba(231,198,148,0.5)]'
                        : 'border-white/10 bg-[#0A0A0A]/80'
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${active ? 'text-[#E7C694]' : 'text-gray-500'}`}
                      fill="currentColor"
                    >
                      <path d={node.path} />
                    </svg>
                  </div>
                  <span
                    className={`mt-2 text-[8px] md:text-[9px] font-mono uppercase tracking-[0.15em] transition-colors duration-300 whitespace-nowrap ${active ? 'text-[#E7C694]' : 'text-gray-600'}`}
                  >
                    {node.name}
                  </span>
                </a>
              )
            })}

            {/* central core — Zexus App (circle centered exactly at 50/50) */}
            <a
              href="https://app.zexus.xyz"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredNode(null)}
              className="group absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 w-[88px] h-[88px] md:w-[108px] md:h-[108px]"
            >
              {/* breathing glow halo */}
              <span
                className="absolute inset-0 rounded-full bg-[#E7C694]/20 blur-xl"
                style={{ animation: 'corePulse 3.5s ease-in-out infinite' }}
              />

              {/* rotating conic energy ring */}
              <span
                className="absolute inset-[-14%] rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(231,198,148,0.55) 60deg, transparent 130deg, transparent 230deg, rgba(231,198,148,0.4) 290deg, transparent 360deg)',
                  WebkitMask: 'radial-gradient(closest-side, transparent 71%, #000 73%)',
                  mask: 'radial-gradient(closest-side, transparent 71%, #000 73%)',
                  animation: 'coreSpin 5s linear infinite',
                }}
              />

              {/* counter-rotating dashed ring */}
              <span
                className="absolute inset-[-3px] rounded-full border border-dashed border-[#E7C694]/20"
                style={{ animation: 'coreSpinRev 16s linear infinite' }}
              />

              {/* orbiting satellite dot */}
              <span
                className="absolute inset-[-20%]"
                style={{ animation: 'coreSpin 7s linear infinite' }}
              >
                <span className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FFFEEF] shadow-[0_0_8px_2px_rgba(231,198,148,0.7)]" />
              </span>

              {/* the core circle */}
              <div className="relative w-full h-full rounded-full flex items-center justify-center border-2 border-[#E7C694]/40 bg-gradient-to-br from-[#E7C694]/[0.18] to-[#0A0A0A] shadow-[0_0_40px_-5px_rgba(231,198,148,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_55px_-2px_rgba(231,198,148,0.6)] group-hover:border-[#E7C694]/70">
                <Image
                  src="/logo.png"
                  alt="Zexus"
                  width={44}
                  height={44}
                  className="opacity-90 drop-shadow-[0_0_10px_rgba(231,198,148,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_16px_rgba(231,198,148,0.7)]"
                />
              </div>

              {/* label — kept on the front plane, above the lightning */}
              <div className="absolute top-full left-1/2 z-50 -translate-x-1/2 mt-3 flex flex-col items-center gap-1.5 whitespace-nowrap [text-shadow:0_2px_10px_rgba(0,0,0,0.95)]">
                <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] text-[#E7C694]">Zexus App</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[7px] font-mono tracking-[0.15em] uppercase px-1.5 py-px border border-[#E7C694]/40 bg-[#0A0A0A]/70 text-[#E7C694]/80 backdrop-blur-sm">Alpha</span>
                  <span className="text-[7px] font-mono tracking-[0.15em] uppercase px-1.5 py-px border border-[#E7C694]/25 bg-[#0A0A0A]/70 text-[#E7C694]/55 backdrop-blur-sm">Invite Code</span>
                </div>
              </div>
            </a>
          </div>

          <p className="text-center text-[9px] font-mono text-gray-700 tracking-[0.2em] uppercase mt-6">
            Tap a node to connect
          </p>

        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 pt-16 pb-10 px-10 border-t border-white/[0.03] bg-[#080808]/30">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-x-3 mb-4 grayscale opacity-60 hover:opacity-100 transition-all cursor-default">
                <Image src="/logo.png" alt="Zexus" width={24} height={24} />
                <span className="text-lg font-black tracking-tighter text-white uppercase">
                  Zexus
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-light max-w-xs uppercase tracking-wider">
                Protocol-driven accountability. Transparency is no longer
                optional.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E7C694] mb-4">
                Platform
              </h4>
              <ul className="space-y-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <li>
                  <a
                    href="#roadmap"
                    className="hover:text-white transition-colors"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    href="#socials"
                    className="hover:text-white transition-colors"
                  >
                    Socials
                  </a>
                </li>
                <li>
                  <a
                    href={socialLinks.Docs}
                    target="_blank"
                    className="hover:text-white transition-colors"
                  >
                    Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E7C694] mb-4">
                Legal
              </h4>
              <ul className="space-y-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E7C694] mb-4">
                Contact
              </h4>
              <ul className="space-y-3 text-[10px] text-gray-500 font-bold tracking-widest">
                <li>
                  <ContactEmail className="hover:text-white transition-colors lowercase tracking-normal font-mono normal-case" />
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] tracking-[0.4em] text-gray-600 uppercase">
              © 2026 Zexus Protocol
            </p>
            <div className="flex gap-8">
              {Object.entries(socialLinks)
                .filter(
                  ([name]) => !['Docs', 'Privacy', 'Terms'].includes(name),
                )
                .map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    className="text-[9px] tracking-[0.3em] text-gray-500 uppercase font-bold hover:text-[#E7C694] transition-colors"
                  >
                    {name}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

// ─── Default export: wraps the page in the Wagmi provider ───────────────────

export default function Home() {
  return (
    <WagmiProviderWrapper>
      <HomeContent />
    </WagmiProviderWrapper>
  )
}
