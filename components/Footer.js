// zexus-governance/components/Footer.js
import { DiscordIcon, TelegramIcon, GithubIcon } from './SocialIcons'; // Эти иконки мы добавим на следующем шаге
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-20 bg-gray-950 py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between text-center md:flex-row">
          <Link href="/" className="text-xl font-bold text-white">
            Zexus Governance
          </Link>
          <div className="mt-6 flex space-x-6 md:mt-0">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Discord</span>
              <DiscordIcon className="h-6 w-6" />
            </a>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Telegram</span>
              <TelegramIcon className="h-6 w-6" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <GithubIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 Zexus Governance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}