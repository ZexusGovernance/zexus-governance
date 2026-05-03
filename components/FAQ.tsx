'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is signing up gas-free?',
    answer:
      'Yes. You sign a message with your wallet (free, no transaction) and our relayer pays the gas to write your address on Base mainnet. Your wallet never spends a single wei to join the waitlist.',
  },
  {
    question: 'What does Zexus actually verify on-chain?',
    answer:
      'Right now: your participation in the waitlist - your address is recorded in our verified contract on Base, and the count of all participants is publicly readable. After alpha launch, every project commitment, vote, and Trust Score change will be settled on-chain. No off-chain numbers, no inflated metrics.',
  },
  {
    question: 'What is ZXP and how do I earn it?',
    answer:
      'ZXP is the Zexus Points engine - the unit of voting power and reputation across the protocol. During waitlist you earn pre-launch points by signing up (5) and inviting others (1-3 per referral depending on your tier). When ZXP launches in Q3, your points convert into the live token economy.',
  },
  {
    question: 'How does the referral tier system work?',
    answer:
      'Bronze (0-9 referrals) gives you 1 point per new referral. Silver (10-29) gives 2 points. Gold (30+) gives 3 points. Higher tiers reward consistent evangelists - more invites you bring, more weight each new one carries.',
  },
  {
    question: 'Why Base mainnet specifically?',
    answer:
      "Base is fast (~2s blocks), cheap (~$0.001 per tx), and inherits Ethereum's security. It's also where the most active accountability-focused communities are forming. Multi-chain expansion (Arbitrum, others) is on the Q4 roadmap.",
  },
  {
    question: "I'm a project founder - how do I get on Zexus?",
    answer:
      "We're onboarding 10 founding projects through a Genesis Program in Q2. They get foundational status, listing priority, and a permanent role in shaping the protocol. Reach out via Twitter or Telegram (links in footer) - applications are open.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative z-10 py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[#E7C694] font-mono tracking-[0.4em] uppercase text-[10px] mb-4 opacity-60">
            Common Questions
          </h2>
          <p className="text-4xl md:text-5xl font-black tracking-tighter">
            Everything you need to know
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className={`
                  bg-[#0A0A0A]/40 backdrop-blur-md border rounded-2xl overflow-hidden
                  transition-all duration-300
                  ${
                    isOpen
                      ? 'border-[#E7C694]/30'
                      : 'border-white/[0.06] hover:border-white/[0.12]'
                  }
                `}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`
                      text-base md:text-lg font-bold tracking-tight transition-colors duration-300
                      ${isOpen ? 'text-[#E7C694]' : 'text-white/90'}
                    `}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`
                      flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center
                      transition-all duration-300
                      ${
                        isOpen
                          ? 'border-[#E7C694] text-[#E7C694] rotate-180'
                          : 'border-white/20 text-white/50'
                      }
                    `}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {/* Answer — animated reveal */}
                <div
                  className={`
                    grid transition-all duration-300 ease-out
                    ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }
                  `}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm md:text-base text-gray-400 leading-relaxed font-light">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer hint */}
        <p className="text-center text-[10px] text-gray-600 mt-10 tracking-widest uppercase">
          Have another question? Reach out on Twitter or Telegram
        </p>
      </div>
    </section>
  )
}
