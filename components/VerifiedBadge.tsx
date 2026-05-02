'use client'

interface VerifiedBadgeProps {
  contractAddress?: string
}

const DEFAULT_CONTRACT = '0xB6ce48D89DfDe6cF9589b8f889d6F9f05Fa07584'

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function VerifiedBadge({
  contractAddress = DEFAULT_CONTRACT,
}: VerifiedBadgeProps) {
  return (
    <a
      href={`https://basescan.org/address/${contractAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group inline-flex items-center gap-2 mt-4 px-3 py-1.5
        rounded-full border border-white/[0.06] bg-[#0A0A0A]/40
        hover:border-[#E7C694]/30 transition-all
      "
      aria-label="View contract on BaseScan"
    >
      {/* Base logo (синий кружок) */}
      <span className="w-3.5 h-3.5 rounded-full bg-[#0052FF] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 111 111" className="w-2 h-2" fill="white">
          <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017 110.034 24.6319 85.359 0 54.921 0 26.0432 0 2.3576 22.1714 0 50.3923h72.8467v9.2497H0c2.3576 28.2208 26.0432 50.3922 54.921 50.3922Z" />
        </svg>
      </span>
      <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 group-hover:text-[#E7C694] transition-colors font-medium">
        Verified on Base · {shortAddr(contractAddress)} ↗
      </span>
    </a>
  )
}
