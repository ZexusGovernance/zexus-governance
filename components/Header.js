// zexus-governance/components/Header.js

'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const navigation = [
    {
      name: 'Socials',
      href: 'https://twitter.com/ZexusGovernance',
      external: true,
    },
    {
      name: 'Roadmap',
      href: '#roadmap',
      external: false,
    },
    {
      name: 'GitBook',
      href: 'https://zexus-governance.gitbook.io/whitepaper',
      external: true,
    },
  ]

  return (
    <header className="relative z-40">
      <nav
        className="flex items-center justify-between py-4"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 items-center gap-x-4">
          <Link
            href="/"
            className="-m-1.5 p-1.5 flex items-center gap-x-3 group"
          >
            <span className="sr-only">Zexus Governance</span>
            <Image
              src="/logo.png"
              alt="Zexus Logo"
              width={38}
              height={38}
              priority
              className="h-9 w-auto object-contain transition-transform duration-500 group-hover:rotate-[360deg]"
            />
            <div className="flex flex-col">
              <span className="text-sm md:text-xl font-black text-white tracking-tighter leading-none transition-colors group-hover:text-[#E7C694]">
                ZEXUS
              </span>
              <span className="text-[10px] font-mono text-[#E7C694] tracking-[0.3em] uppercase opacity-80">
                Governance
              </span>
            </div>
          </Link>
        </div>

        {isClient && (
          <div className="hidden lg:flex lg:gap-x-10 items-center">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-300 hover:scale-105 ${
                  item.name === 'Roadmap'
                    ? 'text-white border-x border-white/10 px-6 py-1 hover:text-[#E7C694] hover:border-[#E7C694]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-sm group hover:border-[#E7C694]/20 transition-all">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E7C694] animate-pulse"></div>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-200">
              Alpha v1.0
            </span>
          </div>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-7 w-7" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#050505] px-6 py-6 sm:max-w-sm border-l border-white/5">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5 flex items-center gap-x-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="Zexus Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-xl font-black text-white tracking-tighter">
                ZEXUS
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-[#E7C694] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <span className="sr-only">Close menu</span>
              <Bars3Icon className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-16 flow-root">
            <div className="space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-6 text-center text-lg font-bold tracking-[0.3em] uppercase text-white hover:bg-[#E7C694]/5 hover:text-[#E7C694] border border-white/5 transition-all active:scale-95"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="mt-10 px-4 py-4 rounded-xl border border-[#E7C694]/10 bg-[#E7C694]/5 text-center">
              <span className="text-[10px] font-mono text-[#E7C694] uppercase tracking-widest">
                Est. 25.08.2025
              </span>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
