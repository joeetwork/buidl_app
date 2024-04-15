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
        <Link className="btn btn-ghost normal-case text-xl w-1/5" href="/">
          <Image
            style={{ width: '100%', height: 'auto' }}
            alt="Solana Logo"
            src="/solana-logo.png"
            width={0}
            height={0}
            sizes="100vw"
          />
        </Link>
        <ul className="menu menu-horizontal px-1 space-x-2">
          {PAGES.map(({ label, path }) => (
            <li key={path}>
              <Link
                className={pathname.startsWith(path) ? 'active' : ''}
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
          ))}
        </ul>
      </div>
      <div className="flex-none space-x-2">
        <WalletButton />
        <UserType />
      </div>
    </div>
  );
}
