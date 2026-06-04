import Whitepaper from '@/components/Whitepaper'

export const metadata = {
  title: 'Whitepaper',
  description:
    'How Zexus works: ZXP economy and epochs, staking, Power Vote governance, Trust Score, Predict Markets, Emergency Calls, the Community Burn Pool, Seasons, and Burn Ranks.',
  alternates: { canonical: '/whitepaper' },
  openGraph: {
    title: 'Zexus Whitepaper — The Trust Layer for Web3',
    description:
      'ZXP economy, staking, Power Vote governance, Trust Score, Predict Markets, Emergency Calls, Burn Pool, Seasons, and Ranks.',
    url: '/whitepaper',
    type: 'article',
  },
}

export default function WhitepaperPage() {
  return <Whitepaper />
}
