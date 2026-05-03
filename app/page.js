'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import HeroCanvas from '@/components/HeroCanvas'
import Header from '@/components/Header'
import WagmiProviderWrapper from '@/components/providers/wagmi-provider'
import WaitlistButton from '@/components/WaitlistButton'
import RecentJoins from '@/components/RecentJoins'
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

  const stepRef0 = useRef(null)
  const stepRef1 = useRef(null)
  const stepRef2 = useRef(null)
  const stepsRefs = useMemo(() => [stepRef0, stepRef1, stepRef2], [])

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

      {/* ─── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center py-8">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#E7C694]/30 to-transparent" />
      </div>

      {/* ─── ROADMAP ──────────────────────────────────────────────────────────── */}
      <section
        id="roadmap"
        className="relative z-10 pt-24 pb-24 px-6 overflow-hidden"
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

            <div className="space-y-40 relative z-10">
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

      {/* ─── LIVE RECENT JOINS ──────────────────────────────────────────────── */}
      <RecentJoins />

      {/* ─── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center py-4">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#E7C694]/30 to-transparent" />
      </div>

      {/* ─── FAQ ──────────────────────────────────────────────────────────────── */}
      <FAQ />

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
                    href={socialLinks.Privacy}
                    target="_blank"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href={socialLinks.Terms}
                    target="_blank"
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
