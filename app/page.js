// zexus-governance/app/page.js

'use client'; // <-- ЭТА СТРОКА ОЧЕНЬ ВАЖНА, ТАК КАК МЫ ИСПОЛЬЗУЕМ СОСТОЯНИЕ (useState)
import { useState, useEffect } from 'react';
import HeroCanvas from '@/components/HeroCanvas'; 
import { SparklesIcon, ShareIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import Header from '@/components/Header';
import Link from 'next/link'; // <-- ВАЖНО: Добавляем импорт Link

// Array with data for the Governance Stories section (newest events at the top)
const stories = [
  {
    date: '25.08.2025',
    title: 'Github Creation',
    description: 'The Zexus project has been published on Github to ensure transparency.'
  },
  {
    date: '20.08.2025',
    title: 'Token Delegation',
    description: '2M tokens $TRUMPWINNER have been delegated to the Zexus treasury.'
  },
  {
    date: '20.08.2025',
    title: 'Project Foundation',
    description: 'Official launch of Zexus Governance.'
  },
];


export default function Home() {
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000); 
  };

  const handleExploreClick = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    showNotification('Platform is temporarily unavailable', 'error');
  };

  return (
    <main className="relative min-h-screen">
      <HeroCanvas /> 
      <Header />
      
      {/* Уведомление */}
      {notification.message && (
        <div 
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-opacity duration-300 ${
            notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Hero section content */}
      <section className="relative z-10 flex min-h-screen flex-col items-center p-8 text-center text-white">
        <div className="my-auto">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Zexus Governance
          </h1>
          <p className="mt-4 text-lg text-gray-300 sm:text-xl">
            The Hub for Web3 Ecosystems
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-4">
            <Link
              href="/vote"
              className="rounded-md bg-[#B58C5A] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm ring-2 ring-[#B58C5A] hover:bg-[#A37B4D] hover:ring-[#A37B4D] hover:shadow-[0_0_25px_rgba(181,140,90,0.8)] transition-all duration-300"
            >
              Explore Now
            </Link>
            <a href="#" onClick={handleExploreClick} className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
              Explore Ecosystems <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        
        {/* Block with scrolling partners */}
        <section className="bg-[rgba(10,10,10,0.8)] py-4 border-y border-gray-300/20 w-full mt-32">
          <div className="container mx-auto px-6 lg:px-8">
              <p className="text-left text-base text-white font-semibold tracking-widest uppercase mb-2">In Partnership with</p>
              <hr className="my-2 border-white/60" />
          </div>
          <div className="marquee-container text-gray-100 text-lg font-semibold tracking-widest uppercase">
            <div className="marquee">
              <span>TRUMPWINNER</span> &nbsp; &middot; &nbsp; 
              <span>OKX WALLET</span> &nbsp; &middot; &nbsp; 
              <span>CoinPaprika</span> &nbsp; &middot; &nbsp; 
              <span>DexScreener</span> &nbsp; &middot; &nbsp; 
              <span>LiveCoinWatch</span> &nbsp; &middot; &nbsp;
              <span>TRUMPWINNER</span> &nbsp; &middot; &nbsp; 
              <span>OKX WALLET</span> &nbsp; &middot; &nbsp; 
              <span>CoinPaprika</span> &nbsp; &middot; &nbsp; 
              <span>DexScreener</span> &nbsp; &middot; &nbsp; 
              <span>LiveCoinWatch</span> &nbsp; &middot; &nbsp;
              <span>TRUMPWINNER</span> &nbsp; &middot; &nbsp; 
              <span>OKX WALLET</span> &nbsp; &middot; &nbsp; 
              <span>CoinPaprika</span> &nbsp; &middot; &nbsp; 
              <span>DexScreener</span> &nbsp; &middot; &nbsp; 
              <span>LiveCoinWatch</span> &nbsp; &middot; &nbsp;
              <span>TRUMPWINNER</span> &nbsp; &middot; &nbsp; 
              <span>OKX WALLET</span> &nbsp; &middot; &nbsp; 
              <span>CoinPaprika</span> &nbsp; &middot; &nbsp; 
              <span>DexScreener</span> &nbsp; &middot; &nbsp; 
              <span>LiveCoinWatch</span> &nbsp; &middot; &nbsp;
            </div>
          </div>
        </section>
      </section>

      {/* Smooth transition from Hero section to the next one */}
      <div className="relative z-20 h-24 bg-gradient-to-b from-transparent to-[#0A0A0A]"></div>

      {/* "How Zexus Works" section */}
      <section id="features" className="relative z-20 mt-[-12]">
        <div className="bg-[#0A0A0A] py-24 sm:py-32">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                How Zexus Works
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-400">
                A simple and clear scheme of Zexus's interaction with partner projects and their communities.
              </p>
            </div>
            
            {/* Flowchart with new "glassmorphism" design */}
            <div className="mx-auto mt-16 max-w-none text-base leading-7 text-gray-300">
              <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8">
                {/* Step 1: Project N transfers tokens */}
                <div className="relative flex flex-col items-center text-center p-6 rounded-2xl shadow-xl w-full lg:w-1/3 overflow-hidden bg-white/5 border border-gray-700/50 backdrop-filter backdrop-blur-sm">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 hover:opacity-100" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(181, 140, 90, 0.4) 0%, transparent 70%)' }}></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="text-xl font-semibold text-white">Project N</div>
                        <div className="mt-2 text-gray-400">
                          transfers tokens for Zexus to manage.
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <svg className="w-10 h-10 text-[#B58C5A] rotate-90 lg:rotate-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.59 18.001L15.3 17.291L20.8 12.001L15.3 6.71104L14.59 6.00104L13.88 6.71104L19.38 12.001L13.88 17.291L14.59 18.001Z" />
                  <path d="M5.59003 18.001L6.30003 17.291L11.8 12.001L6.30003 6.71104L5.59003 6.00104L4.88003 6.71104L10.38 12.001L4.88003 17.291L5.59003 18.001Z" />
                </svg>

                {/* Step 2: Zexus receives N tokens and transfers ZEX */}
                <div className="relative flex flex-col items-center text-center p-6 rounded-2xl shadow-xl w-full lg:w-1/3 overflow-hidden bg-white/5 border border-gray-700/50 backdrop-filter backdrop-blur-sm">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 hover:opacity-100" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(181, 140, 90, 0.4) 0%, transparent 70%)' }}></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="text-xl font-semibold text-white">Zexus Governance</div>
                        <div className="mt-2 text-gray-400">
                          Receives Project N tokens and transfers 5% $ZEX in return.
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <svg className="w-10 h-10 text-[#B58C5A] rotate-90 lg:rotate-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.59 18.001L15.3 17.291L20.8 12.001L15.3 6.71104L14.59 6.00104L13.88 6.71104L19.38 12.001L13.88 17.291L14.59 18.001Z" />
                  <path d="M5.59003 18.001L6.30003 17.291L11.8 12.001L6.30003 6.71104L5.59003 6.00104L4.88003 6.71104L10.38 12.001L4.88003 17.291L5.59003 18.001Z" />
                </svg>

                {/* Step 3: Zexus distributes tokens */}
                <div className="relative flex flex-col items-center text-center p-6 rounded-2xl shadow-xl w-full lg:w-1/3 overflow-hidden bg-white/5 border border-gray-700/50 backdrop-filter backdrop-blur-sm">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 hover:opacity-100" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(181, 140, 90, 0.4) 0%, transparent 70%)' }}></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="text-xl font-semibold text-white">Community</div>
                        <div className="mt-2 text-gray-400">
                          Receives Project N tokens and $ZEX from Zexus.
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smooth transition between sections */}
      <div className="relative z-20 h-24 bg-gradient-to-b from-[#0A0A0A] to-[rgba(10,10,10,0.8)]"></div>

      {/* "Governance Stories" section */}
      <section id="stories" className="relative z-20">
        <div className="bg-[rgba(10,10,10,0.8)] py-24 sm:py-32">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Governance Stories
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-400">
                Key events in the development of the Zexus project.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-xl text-white">
              <ul role="list" className="space-y-6">
                {stories.map((story, index) => (
                  <li key={index} className="relative flex gap-x-6">
                    <div className="absolute left-0 top-0 flex w-6 justify-center">
                      <div className="w-px bg-gray-700 h-full"></div>
                    </div>
                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-gray-900 ring-2 ring-gray-600 rounded-full">
                      <SparklesIcon className="h-4 w-4 text-[#B58C5A]" aria-hidden="true" />
                    </div>
                    <p className="flex-auto py-0.5 text-base leading-7 text-gray-400">
                      <span className="font-semibold text-white block">{story.title}</span>
                      {story.description}
                    </p>
                    <time dateTime={story.date} className="flex-none py-0.5 text-base leading-7 text-gray-500">
                      {story.date}
                    </time>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* "Unified Treasury" section */}
      <section id="treasury" className="relative z-20">
        <div className="bg-[rgba(10,10,10,0.8)] py-24 sm:py-32">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Unified Treasury
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-400">
                Increased transparency and control over all community financial operations.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl text-white overflow-x-auto lg:max-w-4xl">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-white">Description</th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-white">Amount</th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-white">Token</th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-white">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {/* Example data row */}
                  <tr>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">
                      <div className="font-medium text-white">Developer Grant Payout</div>
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">
                      ???
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">
                      ZEX
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">
                      TBA
                    </td>
                  </tr>
                  {/* Example data row */}
                  <tr>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">
                      <div className="font-medium text-white">Voting Reward</div>
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">
                      ???
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">
                      ZEX
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">
                      TBA
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}