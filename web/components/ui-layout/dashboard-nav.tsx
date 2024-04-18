'use client';
import { useAccounts } from '@/hooks/get-accounts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function DashboardNav() {
  const { userAccount } = useAccounts();
  const [nav, setNav] = useState<{ label: string; path: string }[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const NAV =
      userAccount.data?.role === 'Freelancer'
        ? [
            { label: 'Requests', path: '/requests' },

            { label: 'Claim', path: '/claim' },

            { label: 'Submit', path: '/submit' },

            { label: 'Vote', path: '/vote' },
          ]
        : [
            { label: 'Contracts', path: '/contracts' },

            { label: 'Vote', path: '/vote' },
          ];

    setNav(NAV);
  }, [userAccount.data?.role]);

  return (
    <div className="w-[80%] m-auto bg-teal-600 flex justify-around px-32 rounded-b-xl p-[8px]">
      {nav.map(({ label, path }, idx) => {
        return (
          <Link
            key={idx}
            href={path.toLowerCase()}
            className={`text-lg  ${
              pathname.startsWith(path)
                ? 'text-white font-bold'
                : 'text-gray-300'
            }`}
          >
            {label === 'Contracts' ? 'Active' : label}
          </Link>
        );
      })}
    </div>
  );
}
