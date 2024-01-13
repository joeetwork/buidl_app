'use client';

import Link from 'next/link';
import React from 'react';

import { ClusterUiSelect } from '../cluster/cluster-ui';
import { WalletButton } from './wallet-button';

export function Navbar() {
  const pathname = 'TODO: implement me';

  const pages = [
    { label: 'Account', path: '/account' },

    { label: 'Clusters', path: '/clusters' },

    { label: 'Escrow', path: '/escrow' },
  ];

  return (
    <div className="navbar bg-base-300 text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          <img
            className="h-4 md:h-6"
            alt="Solana Logo"
            src="/solana-logo.png"
          />
        </Link>
        <ul className="menu menu-horizontal px-1 space-x-2">
          {pages.map(({ label, path }) => (
            <li key={path}>
              <Link
                className={pathname.startsWith(path) ? 'active' : ''}
                href={path}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-none space-x-2">
        <WalletButton />
        <ClusterUiSelect />
      </div>
    </div>
  );
}
