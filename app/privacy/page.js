import LegalPage from '@/components/LegalPage'

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Zexus does not collect personal data. We only interact with public wallet addresses and use minimal technical cookies.',
  alternates: { canonical: '/privacy' },
}

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="April 20, 2026"
      intro="At ZEXUS, we prioritize your privacy. Being a decentralized governance platform, the organization operates under these core principles:"
      sections={[
        {
          heading: 'No Personal Data',
          body: 'The platform does not collect, store, or sell user personal information including names, emails, or physical addresses.',
        },
        {
          heading: 'Blockchain Data',
          body: 'ZEXUS only engages with public wallet addresses that users voluntarily provide through their wallet providers (such as MetaMask). All transaction information remains public on the blockchain and falls outside the platform’s control.',
        },
        {
          heading: 'Cookies',
          body: 'The website employs minimal technical cookies necessary for proper functionality. No cookie usage occurs for advertising or tracking purposes.',
        },
      ]}
    />
  )
}
