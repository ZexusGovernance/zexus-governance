import Header from '@/components/Header';
import WagmiProviderWrapper from '@/components/providers/wagmi-provider';
import VoteContent from '@/components/vote-content';
import AnimVote from '@/components/AnimVote';

export const metadata = {
  title: 'Community Vote',
  description: 'The Hub for Web3 Ecosystems',
};

export default function VotePage() {
  return (
    <>
      <WagmiProviderWrapper>
        {/* УДАЛИТЕ этот класс: bg-gray-950 */}
        <main className="relative min-h-screen text-white">
          <AnimVote />
          <Header />
          <VoteContent />
        </main>
      </WagmiProviderWrapper>
    </>
  );
}