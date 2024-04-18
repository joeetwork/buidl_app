'use client';

import Link from 'next/link';
import React from 'react';

import WalletButton from '../shared/wallet-button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserType } from './user-type';
import { useAccounts } from '@/hooks/get-accounts';

export function Navbar() {
  const pathname = usePathname();
  const { userAccount } = useAccounts();

  const PAGES =
    userAccount.data?.role === 'Freelancer'
      ? [
          { label: 'Contracts', path: '/contracts' },

          { label: 'Profile', path: '/profile' },
        ]
      : [
          { label: 'Contracts', path: '/contracts' },

          { label: 'Explore', path: '/explore' },

          { label: 'Profile', path: '/profile' },
        ];

  return (
    <div className="navbar bg-base-300 text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0">
      <div className="flex-1">
        <Link
          className="h-auto w-[13%] lg:w-[10%] xl:w-[6%] 2xl:w-[3%] ml-2 rounded hover:ring hover:ring-teal-600"
          href="/"
        >
          <Image
            className="w-full h-auto rounded"
            alt="Solana Logo"
            src="/gigd.png"
            width={0}
            height={0}
            sizes="100vw"
          />
        </Link>
        <ul className="flex pl-4 space-x-2">
          {PAGES.map(({ label, path }) => {
            return (
              <li key={path}>
                <Link
                  className={`p-2 rounded-lg hover:transition-colors hover:bg-opacity-80 hover:bg-teal-400 text-white ${
                    pathname.startsWith(path)
                      ? 'bg-opacity-80 bg-teal-600'
                      : '' ||
                        (pathname === '/requests' && path === '/contracts')
                      ? 'bg-opacity-80 bg-teal-600'
                      : ''
                  }`}
                  href={
                    userAccount.data?.role === 'Freelancer' &&
                    path === '/contracts'
                      ? '/requests'
                      : path
                  }
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex-none space-x-2">
        <WalletButton />
        <UserType />
      </div>
    </div>
  );
}
