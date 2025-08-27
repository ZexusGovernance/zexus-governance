// zexus-governance/components/Header.js

'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navigation = [
  { name: 'Vote', href: '/vote' },
  { name: 'How Zexus Works', href: '#features' },
  { name: 'Dashboard', href: '#dashboard' },
  { name: 'Treasury', href: '#treasury' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showDashboardPopup, setShowDashboardPopup] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDashboardClick = (e) => {
    e.preventDefault();
    setShowDashboardPopup(true);
    setTimeout(() => {
      setShowDashboardPopup(false);
    }, 3000);
  };

  return (
    <>
      <header className="py-4">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1 items-center gap-x-4">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-x-2">
              <span className="sr-only">Zexus Governance</span>
              <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
              <div className="flex items-center">
                <a href="#" className="text-2xl font-bold text-white">
                  Zexus Governance
                </a>
                <span className="ml-2 text-xs font-semibold text-gray-400">Beta v1.0.0</span>
              </div>
            </a>
          </div>
          
          {isClient && (
            <Popover.Group className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-sm font-semibold leading-6 text-white"
                  onClick={item.name === 'Dashboard' ? handleDashboardClick : undefined}
                >
                  {item.name}
                </a>
              ))}
            </Popover.Group>
          )}

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm font-semibold leading-6 text-white">
              Start <span aria-hidden="true">→</span>
            </a>
          </div>
        </nav>

        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/80 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Zexus Governance</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                      onClick={item.name === 'Dashboard' ? handleDashboardClick : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                  >
                    Start
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      {showDashboardPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="bg-red-600/80 text-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
            <p className="font-bold text-lg">Temporarily unavailable</p>
          </div>
        </div>
      )}
    </>
  );
}