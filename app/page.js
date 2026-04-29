'use client'
import { useState } from 'react'
import Image from 'next/image'
import HeroCanvas from '@/components/HeroCanvas'
import Header from '@/components/Header'

export default function Home() {
  const [notification, setNotification] = useState('')

  const socialLinks = {
    Twitter: 'https://x.com/ZexusGovernance',
    Discord: '#',
    Telegram: 'https://t.me/+-BSQtI1uNNUwNTky',
    Docs: 'https://zexus-governance.gitbook.io/whitepaper',
    Privacy: 'https://zexus-governance.gitbook.io/whitepaper/privacy-policy',
    Terms: 'https://zexus-governance.gitbook.io/whitepaper/terms-of-service',
  }

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-[#E7C694] selection:text-black font-sans overflow-x-hidden">
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

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-5xl">
        <div className="bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-full px-8 py-2 shadow-2xl transition-all hover:border-[#E7C694]/20">
          <Header />
        </div>
      </div>

      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#1A1A1A]/90 backdrop-blur-xl border border-[#E7C694]/30 px-8 py-3 rounded-full shadow-[0_10px_40px_rgba(231,198,148,0.2)] text-[#E7C694] font-bold text-sm tracking-widest uppercase">
            {notification}
          </div>
        </div>
      )}

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center">
        <div className="w-full max-w-[1400px]">
          <h1 className="text-6xl sm:text-8xl md:text-[110px] font-black tracking-tighter mb-8 leading-[0.85] text-white">
            Verify, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#E7C694] via-[#FFFEEF] to-[#A68B5B] drop-shadow-[0_5px_15px_rgba(231,198,148,0.2)]">
              Don’t Trust.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light mb-16 opacity-70">
            The first accountability hub where project roadmaps meet on-chain
            transparency. Protection for communities, power for builders.
          </p>

          <div className="relative z-[20] flex flex-col items-center group/btn-container">
            <span className="text-[10px] uppercase tracking-[0.6em] text-[#E7C694] mb-6 font-bold animate-pulse opacity-60">
              Waitlist is Live
            </span>
            <button
              onClick={() =>
                showNotification('Waitlist Registration Opening Soon')
              }
              className="group relative inline-flex items-center justify-center px-16 py-6 overflow-hidden rounded-full bg-[#0A0A0A] border border-[#E7C694]/30 text-[#E7C694] transition-all duration-500 hover:border-[#E7C694] hover:shadow-[0_0_35px_rgba(231,198,148,0.15)] active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E7C694]/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 text-xl font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-300">
                Join the Waitlist
              </span>
              <div className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-[#E7C694]/40 to-[#A68B5B]/40 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
            </button>
            <div className="absolute -bottom-10 w-full h-20 bg-[#E7C694]/5 blur-[60px] rounded-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      <section
        id="roadmap"
        className="relative z-10 pt-40 pb-0 px-6 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-32">
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
                className="absolute top-0 w-full bg-gradient-to-b from-[#FFFEEF] via-[#E7C694] to-transparent transition-all duration-1000"
                style={{ height: '32%' }}
              ></div>
            </div>

            <div className="space-y-40 relative z-10">
              <div className="relative flex flex-col md:flex-row items-start md:items-center group">
                <div className="flex-1 md:text-right md:pr-20 pl-12 md:pl-0 mb-8 md:mb-0 transition-all duration-700 group-hover:scale-[1.03]">
                  <div className="inline-block px-3 py-1 mb-4 rounded-full border border-[#E7C694]/40 bg-[#E7C694]/10 text-[#E7C694] text-[8px] font-bold tracking-[0.3em] uppercase">
                    Current Phase
                  </div>
                  <span className="block text-6xl md:text-8xl font-black text-[#E7C694]/20 group-hover:text-[#E7C694]/30 transition-colors select-none">
                    Q2
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#E7C694] mt-[-1rem] md:mt-[-2rem] mb-4 tracking-tight">
                    The Genesis & Alpha
                  </h3>
                  <ul className="space-y-3 text-gray-300 font-light text-sm md:text-base">
                    <li>• Official Announcement & Waitlist Open</li>
                    <li>• Genesis Program Onboarding (10 projects)</li>
                    <li>• Alpha Testnet: Voting, Trust Score, MVP</li>
                    <li>• Sybil Filter & Reputation Integration</li>
                  </ul>
                </div>
                <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#FFFEEF] shadow-[0_0_25px_8px_rgba(231,198,148,0.8)] z-10 scale-125 transition-transform duration-500 group-hover:scale-150"></div>
                <div className="flex-1 hidden md:block"></div>
              </div>

              <div className="relative flex flex-col md:flex-row items-start md:items-center group">
                <div className="flex-1 hidden md:block"></div>
                <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-white/20 shadow-none z-10 group-hover:bg-white/40 transition-all duration-500"></div>
                <div className="flex-1 md:pl-20 pl-12 opacity-30 group-hover:opacity-60 transition-all duration-700">
                  <span className="text-6xl md:text-8xl font-black text-white/5 select-none">
                    Q3
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mt-[-1rem] md:mt-[-2rem] mb-4 tracking-tight">
                    Growth & Mainnet
                  </h3>
                  <ul className="space-y-3 text-gray-500 font-light text-sm md:text-base">
                    <li>• Public Mainnet Launch (Base/Arbitrum)</li>
                    <li>• Zexus Points Engine (ZXP) Full Launch</li>
                    <li>• Beta Genesis Tier: Wave 2 Projects</li>
                  </ul>
                </div>
              </div>

              <div className="relative flex flex-col md:flex-row items-start md:items-center group">
                <div className="flex-1 md:text-right md:pr-20 pl-12 md:pl-0 opacity-30 group-hover:opacity-60 transition-all duration-700">
                  <span className="text-6xl md:text-8xl font-black text-white/5 select-none">
                    Q4
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mt-[-1rem] md:mt-[-2rem] mb-4 tracking-tight">
                    Global Expansion
                  </h3>
                  <ul className="space-y-3 text-gray-500 font-light text-sm md:text-base">
                    <li>• Advanced Governance & DAO Delegate Tools</li>
                    <li>• Zexus Analytics API for Launchpads</li>
                    <li>• Sleuth Partnership: On-chain Detectives</li>
                  </ul>
                </div>
                <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-white/20 z-10 group-hover:bg-white/40 transition-all duration-500"></div>
                <div className="flex-1 hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 pt-20 pb-32 flex flex-col items-center">
        <div className="w-[1px] h-32 bg-white/10 mb-16"></div>
        <div className="max-w-4xl w-full px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-8">
            Join the{' '}
            <span className="font-black italic">Evolution of Trust</span>
          </h2>
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-[#E7C694]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <button
              onClick={() => showNotification('Initializing Genesis Portal...')}
              className="relative px-12 py-4 rounded-full border border-white/10 bg-[#0A0A0A] hover:border-[#E7C694]/40 hover:text-[#E7C694] transition-all duration-500 text-sm font-bold tracking-[0.2em] uppercase"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 pt-16 pb-10 px-10 border-t border-white/[0.03] bg-[#080808]/30">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
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
                    rel="noopener noreferrer"
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
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href={socialLinks.Terms}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] tracking-[0.4em] text-gray-600 uppercase">
              © 2026 Zexus Protocol • Alpha v1.0
            </p>

            <div className="flex gap-8">
              {Object.entries(socialLinks)
                .filter(
                  ([name]) => !['Docs', 'Privacy', 'Terms'].includes(name),
                )
                .map(([name, url]) => {
                  if (name === 'Discord') {
                    return (
                      <button
                        key={name}
                        onClick={() =>
                          showNotification('Discord Server Coming Soon')
                        }
                        className="text-[9px] tracking-[0.3em] text-gray-500 uppercase font-bold hover:text-[#E7C694] transition-colors cursor-pointer"
                      >
                        {name}
                      </button>
                    )
                  }
                  return (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] tracking-[0.3em] text-gray-500 uppercase font-bold hover:text-[#E7C694] transition-colors"
                    >
                      {name}
                    </a>
                  )
                })}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
