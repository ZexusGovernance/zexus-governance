import LegalPage from '@/components/LegalPage'

export const metadata = {
  title: 'Terms of Service',
  description:
    'Zexus is in active Alpha and provided “as is”. You are responsible for your wallet security and for complying with your local jurisdiction.',
  alternates: { canonical: '/terms' },
}

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="April 20, 2026"
      sections={[
        {
          heading: 'Alpha Version',
          body: 'Zexus is currently in active development. The platform is provided “as is” without warranties of any kind. Use at your own risk.',
        },
        {
          heading: 'User Responsibility',
          body: 'You are solely responsible for the security of your wallet and private keys. We cannot recover funds or reverse blockchain transactions.',
        },
        {
          heading: 'Governance',
          body: 'Any participation in voting or governance is subject to the rules of the specific smart contracts deployed on the network.',
        },
        {
          heading: 'Eligibility',
          body: 'You are responsible for ensuring that your use of Zexus complies with the laws of your local jurisdiction.',
        },
      ]}
    />
  )
}
