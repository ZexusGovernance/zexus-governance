'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { http } from 'viem'
import { base, mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

// Явные транспорты для каждой цепи — это убирает CORS-ошибки от
// дефолтных публичных RPC (eth.merkle.io etc) которые ненадёжны
// и спамят консоль.
const config = getDefaultConfig({
  appName: 'Zexus Governance',
  projectId: 'cafd0501cf9af168e43a539088ac45aa',
  chains: [base, mainnet, polygon, optimism, arbitrum],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
  },
  ssr: true,
})

export default function WagmiProviderWrapper({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
